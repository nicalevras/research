import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { eq, and, ilike, or, desc, asc, avg, count, isNotNull } from 'drizzle-orm'
import type { SQL } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { db } from '~/db'
import { vendors, reviews, user, account, compounds, vendorFavorites } from '~/db/schema'
import { auth } from '~/lib/auth'
import type { Vendor, VendorSummary, Review, Compound } from './types'

const COMPOUND_REGISTRY_CACHE_TTL_MS = 5 * 60_000

let compoundsCache: { data: Compound[]; expiresAt: number } | undefined
let compoundsRequest: Promise<Compound[]> | undefined

const vendorSummaryColumns = {
  id: vendors.id,
  name: vendors.name,
  website: vendors.website,
  promoCode: vendors.promoCode,
  promoDiscountPercent: vendors.promoDiscountPercent,
  country: vendors.country,
  hasCoa: vendors.hasCoa,
  acceptsCreditCard: vendors.acceptsCreditCard,
  acceptsAch: vendors.acceptsAch,
  acceptsCrypto: vendors.acceptsCrypto,
  fastShipping: vendors.fastShipping,
  shipsInternational: vendors.shipsInternational,
  rating: vendors.rating,
  reviewCount: vendors.reviewCount,
}

function rowToVendorSummary(row: VendorSummary): VendorSummary {
  return {
    id: row.id,
    name: row.name,
    website: row.website,
    promoCode: row.promoCode,
    promoDiscountPercent: row.promoDiscountPercent,
    country: row.country,
    hasCoa: row.hasCoa,
    acceptsCreditCard: row.acceptsCreditCard,
    acceptsAch: row.acceptsAch,
    acceptsCrypto: row.acceptsCrypto,
    fastShipping: row.fastShipping,
    shipsInternational: row.shipsInternational,
    rating: row.rating,
    reviewCount: row.reviewCount,
  }
}

function rowToVendor(row: typeof vendors.$inferSelect): Vendor {
  return {
    ...rowToVendorSummary(row),
    compoundNames: row.compoundNames,
    compoundSlugs: row.compoundSlugs,
  }
}

async function loadCompounds(): Promise<Compound[]> {
  const now = Date.now()
  if (compoundsCache && compoundsCache.expiresAt > now) {
    return compoundsCache.data
  }

  if (!compoundsRequest) {
    compoundsRequest = db
      .select({
        id: compounds.id,
        name: compounds.name,
      })
      .from(compounds)
      .orderBy(asc(compounds.sortOrder), asc(compounds.name))
      .then((rows) => {
        compoundsCache = {
          data: rows,
          expiresAt: Date.now() + COMPOUND_REGISTRY_CACHE_TTL_MS,
        }
        return rows
      })
      .finally(() => {
        compoundsRequest = undefined
      })
  }

  return compoundsRequest
}

function escapeLike(str: string): string {
  return str.replace(/[%_\\]/g, '\\$&')
}

function isUniqueViolation(err: unknown): boolean {
  // PostgreSQL error code 23505 = unique_violation
  if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === '23505') return true
  // Fallback for drivers that wrap the error in a message
  return err instanceof Error && err.message.includes('23505')
}

export const getVendorById = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: id }) => {
    const row = await db.query.vendors.findFirst({
      where: eq(vendors.id, id),
    })
    return row ? rowToVendor(row) : undefined
  })

export const getCompounds = createServerFn({ method: 'GET' })
  .handler(loadCompounds)

export const filterVendors = createServerFn({ method: 'GET' })
  .inputValidator((d: { country?: string; q?: string; features?: string; compound?: string }) => d)
  .handler(async ({ data: filters }) => {
    const { country, q, features: featureString, compound } = filters
    const featureIds = featureString ? featureString.split(',').filter(Boolean) : []
    const conditions: SQL[] = []

    if (country) {
      conditions.push(eq(vendors.country, country))
    }

    if (compound) {
      conditions.push(sql`${vendors.compoundSlugs} @> ARRAY[${compound}]::text[]`)
    }

    for (const featureId of featureIds) {
      if (featureId === 'coa') conditions.push(eq(vendors.hasCoa, true))
      if (featureId === 'credit-card') conditions.push(eq(vendors.acceptsCreditCard, true))
      if (featureId === 'ach') conditions.push(eq(vendors.acceptsAch, true))
      if (featureId === 'crypto') conditions.push(eq(vendors.acceptsCrypto, true))
      if (featureId === 'fast-shipping') conditions.push(eq(vendors.fastShipping, true))
      if (featureId === 'international') conditions.push(eq(vendors.shipsInternational, true))
      if (featureId === 'promo-code') conditions.push(isNotNull(vendors.promoCode))
    }

    if (q) {
      const escaped = escapeLike(q)
      const pattern = `%${escaped}%`

      conditions.push(
        or(
          ilike(vendors.name, pattern),
          ilike(vendors.country, pattern),
          ilike(vendors.website, pattern),
          sql`${vendors.compoundNames}::text ILIKE ${pattern}`,
          sql`${vendors.compoundSlugs}::text ILIKE ${pattern}`,
        )!,
      )
    }

    const rows = await db
      .select(vendorSummaryColumns)
      .from(vendors)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(vendors.rating))

    return rows.map(rowToVendorSummary)
  })

// ── Favorites ──────────────────────────────────────────────────────

export const getFavoriteVendorIds = createServerFn({ method: 'GET' })
  .handler(async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) return []

    const rows = await db
      .select({ vendorId: vendorFavorites.vendorId })
      .from(vendorFavorites)
      .where(eq(vendorFavorites.userId, session.user.id))
      .orderBy(desc(vendorFavorites.createdAt))

    return rows.map((row) => row.vendorId)
  })

export const getFavoriteVendors = createServerFn({ method: 'GET' })
  .handler(async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')

    const rows = await db
      .select(vendorSummaryColumns)
      .from(vendorFavorites)
      .innerJoin(vendors, eq(vendorFavorites.vendorId, vendors.id))
      .where(eq(vendorFavorites.userId, session.user.id))
      .orderBy(desc(vendorFavorites.createdAt), asc(vendors.name))

    return rows.map(rowToVendorSummary)
  })

export const setVendorFavorite = createServerFn({ method: 'POST' })
  .inputValidator((d: { vendorId: string; favorited: boolean }) => d)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')

    const [vendor] = await db
      .select({ id: vendors.id })
      .from(vendors)
      .where(eq(vendors.id, data.vendorId))
      .limit(1)

    if (!vendor) throw new Error('Vendor not found')

    if (data.favorited) {
      await db
        .insert(vendorFavorites)
        .values({
          userId: session.user.id,
          vendorId: data.vendorId,
        })
        .onConflictDoNothing()
    } else {
      await db
        .delete(vendorFavorites)
        .where(and(eq(vendorFavorites.userId, session.user.id), eq(vendorFavorites.vendorId, data.vendorId)))
    }

    return { vendorId: data.vendorId, favorited: data.favorited }
  })

// ── Reviews ─────────────────────────────────────────────────────────

async function recalcVendorRating(vendorId: string) {
  const [result] = await db
    .select({
      avgRating: avg(reviews.rating),
      total: count(reviews.id),
    })
    .from(reviews)
    .where(eq(reviews.vendorId, vendorId))

  await db
    .update(vendors)
    .set({
      rating: result.avgRating ? parseFloat(String(result.avgRating)) : 0,
      reviewCount: result.total,
      updatedAt: new Date(),
    })
    .where(eq(vendors.id, vendorId))
}

const MAX_COMMENT_LENGTH = 2000

const MAX_REVIEWS_PER_PAGE = 100

export const getVendorReviews = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: vendorId }) => {
    const rows = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        username: user.username,
        vendorId: reviews.vendorId,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.userId, user.id))
      .where(eq(reviews.vendorId, vendorId))
      .orderBy(desc(reviews.createdAt))
      .limit(MAX_REVIEWS_PER_PAGE)

    return rows.map((r): Review => ({
      id: r.id,
      userId: r.userId,
      username: r.username,
      vendorId: r.vendorId,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
  })

export const createReview = createServerFn({ method: 'POST' })
  .inputValidator((d: { vendorId: string; rating: number; comment: string }) => d)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')
    const { vendorId, rating, comment } = data
    if (rating < 1 || rating > 5 || (rating * 2) % 1 !== 0) throw new Error('Rating must be 1-5 in 0.5 increments')
    if (!comment.trim()) throw new Error('Comment is required')
    if (comment.trim().length > MAX_COMMENT_LENGTH) throw new Error(`Comment must be under ${MAX_COMMENT_LENGTH} characters`)

    // Verify vendor exists
    const vendor = await db.query.vendors.findFirst({ where: eq(vendors.id, vendorId) })
    if (!vendor) throw new Error('Vendor not found')

    // Insert and catch unique constraint violation (TOCTOU-safe)
    try {
      await db.insert(reviews).values({
        userId: session.user.id,
        vendorId,
        rating,
        comment: comment.trim(),
      })
    } catch (err) {
      if (isUniqueViolation(err)) throw new Error('You have already reviewed this vendor')
      throw err
    }

    await recalcVendorRating(vendorId)
    return { success: true }
  })

export const updateReview = createServerFn({ method: 'POST' })
  .inputValidator((d: { reviewId: string; rating: number; comment: string }) => d)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')
    const { reviewId, rating, comment } = data
    if (rating < 1 || rating > 5 || (rating * 2) % 1 !== 0) throw new Error('Rating must be 1-5 in 0.5 increments')
    if (!comment.trim()) throw new Error('Comment is required')
    if (comment.trim().length > MAX_COMMENT_LENGTH) throw new Error(`Comment must be under ${MAX_COMMENT_LENGTH} characters`)

    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, reviewId),
    })
    if (!review) throw new Error('Review not found')
    if (review.userId !== session.user.id) throw new Error('Unauthorized')

    await db
      .update(reviews)
      .set({ rating, comment: comment.trim(), updatedAt: new Date() })
      .where(eq(reviews.id, reviewId))

    await recalcVendorRating(review.vendorId)
    return { success: true }
  })

export const deleteReview = createServerFn({ method: 'POST' })
  .inputValidator((d: { reviewId: string }) => d)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')
    const review = await db.query.reviews.findFirst({
      where: eq(reviews.id, data.reviewId),
    })
    if (!review) throw new Error('Review not found')
    if (review.userId !== session.user.id) throw new Error('Unauthorized')

    const vendorId = review.vendorId
    await db.delete(reviews).where(eq(reviews.id, data.reviewId))
    await recalcVendorRating(vendorId)
    return { success: true }
  })

export const getUserReviews = createServerFn({ method: 'GET' })
  .handler(async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')

    const rows = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        username: user.username,
        vendorId: reviews.vendorId,
        vendorName: vendors.name,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.userId, user.id))
      .innerJoin(vendors, eq(reviews.vendorId, vendors.id))
      .where(eq(reviews.userId, session.user.id))
      .orderBy(desc(reviews.createdAt))

    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      username: r.username,
      vendorId: r.vendorId,
      vendorName: r.vendorName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
  })

// ── Username ────────────────────────────────────────────────────────

const MAX_USERNAME_LENGTH = 30

export const changeUsername = createServerFn({ method: 'POST' })
  .inputValidator((d: { username: string }) => d)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')
    const username = data.username.trim()
    if (!username || username.length < 2) throw new Error('Username must be at least 2 characters')
    if (username.length > MAX_USERNAME_LENGTH) throw new Error(`Username must be ${MAX_USERNAME_LENGTH} characters or fewer`)
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) throw new Error('Username can only contain letters, numbers, hyphens, and underscores')

    // Attempt the update directly — catch unique constraint violation (TOCTOU-safe)
    try {
      const result = await db
        .update(user)
        .set({ username, updatedAt: new Date() })
        .where(eq(user.id, session.user.id))
        .returning({ id: user.id })

      if (result.length === 0) throw new Error('User not found')
    } catch (err) {
      if (isUniqueViolation(err)) throw new Error('Username is already taken')
      throw err
    }

    return { success: true }
  })

// ── Account info ───────────────────────────────────────────────────

export const getHasPassword = createServerFn({ method: 'GET' })
  .handler(async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')

    const credential = await db
      .select({ id: account.id })
      .from(account)
      .where(and(eq(account.userId, session.user.id), eq(account.providerId, 'credential')))
      .limit(1)

    return credential.length > 0
  })

// ── Account deletion ────────────────────────────────────────────────

export const deleteAccountAndCleanup = createServerFn({ method: 'POST' })
  .inputValidator((d: { password?: string }) => d)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')
    // 1. Collect affected vendor IDs while reviews still exist
    const affectedRows = await db
      .selectDistinct({ vendorId: reviews.vendorId })
      .from(reviews)
      .where(eq(reviews.userId, session.user.id))
    const affectedVendorIds = affectedRows.map((r) => r.vendorId)

    // 2. Delete user via better-auth (cascades reviews, sessions, accounts)
    const deleteResult = await auth.api.deleteUser({
      headers,
      body: data.password ? { password: data.password } : {},
    })

    if (!deleteResult) throw new Error('Failed to delete account')

    // 3. Recalculate vendor ratings now that reviews are cascade-deleted
    for (const vendorId of affectedVendorIds) {
      await recalcVendorRating(vendorId)
    }

    return { success: true }
  })
