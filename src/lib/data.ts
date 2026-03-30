import { createServerFn } from '@tanstack/react-start'
import { eq, and, ilike, or, desc, inArray } from 'drizzle-orm'
import { db } from '~/db'
import { vendors, compounds, vendorCompounds, tags, vendorTags } from '~/db/schema'
import type { Vendor } from './types'

function rowToVendor(row: typeof vendors.$inferSelect): Vendor {
  return {
    id: row.id,
    name: row.name,
    website: row.website,
    location: row.location,
    country: row.country,
    rating: row.rating,
    reviewCount: row.reviewCount,
    category: row.category as Vendor['category'],
    description: row.description,
  }
}

export const getVendorById = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: id }) => {
    const row = await db.query.vendors.findFirst({
      where: eq(vendors.id, id),
    })
    return row ? rowToVendor(row) : undefined
  })

export const filterVendors = createServerFn({ method: 'GET' })
  .inputValidator((d: { category?: string; country?: string; q?: string; tags?: string; compound?: string }) => d)
  .handler(async ({ data: filters }) => {
    const { category, country, q, tags: tagString, compound } = filters
    const tagIds = tagString ? tagString.split(',').filter(Boolean) : []

    // Collect vendor ID constraints from join tables
    let vendorIdPool: string[] | undefined

    // Filter by compound via vendor_compounds
    if (compound) {
      const compoundRows = await db
        .select({ vendorId: vendorCompounds.vendorId })
        .from(vendorCompounds)
        .where(eq(vendorCompounds.compoundId, compound))

      const compoundVendorIds = compoundRows.map((r) => r.vendorId)
      if (compoundVendorIds.length === 0) return []
      vendorIdPool = compoundVendorIds
    }

    // Filter by tags via vendor_tags
    if (tagIds.length > 0) {
      const taggedVendorRows = await db
        .select({ vendorId: vendorTags.vendorId })
        .from(vendorTags)
        .where(inArray(vendorTags.tagId, tagIds))
        .groupBy(vendorTags.vendorId)

      const taggedVendorIds = taggedVendorRows.map((r) => r.vendorId)
      if (taggedVendorIds.length === 0) return []

      // Intersect with compound filter if both are active
      if (vendorIdPool) {
        const tagSet = new Set(taggedVendorIds)
        vendorIdPool = vendorIdPool.filter((id) => tagSet.has(id))
        if (vendorIdPool.length === 0) return []
      } else {
        vendorIdPool = taggedVendorIds
      }
    }

    const conditions = []

    if (vendorIdPool) {
      conditions.push(inArray(vendors.id, vendorIdPool))
    }

    if (category && category !== 'all') {
      conditions.push(eq(vendors.category, category))
    }

    if (country) {
      conditions.push(eq(vendors.country, country))
    }

    if (q) {
      const pattern = `%${q}%`
      conditions.push(
        or(
          ilike(vendors.name, pattern),
          ilike(vendors.location, pattern),
          ilike(vendors.country, pattern),
          ilike(vendors.description, pattern),
        )!,
      )
    }

    const rows = await db
      .select()
      .from(vendors)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(vendors.rating))

    return rows.map(rowToVendor)
  })

export const getVendorTags = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: vendorId }) => {
    const rows = await db
      .select({ id: tags.id, name: tags.name })
      .from(vendorTags)
      .innerJoin(tags, eq(vendorTags.tagId, tags.id))
      .where(eq(vendorTags.vendorId, vendorId))

    return rows
  })

export const getVendorCompounds = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: vendorId }) => {
    const rows = await db
      .select({ id: compounds.id, name: compounds.name, category: compounds.category })
      .from(vendorCompounds)
      .innerJoin(compounds, eq(vendorCompounds.compoundId, compounds.id))
      .where(eq(vendorCompounds.vendorId, vendorId))

    return rows
  })

export const getCompounds = createServerFn({ method: 'GET' })
  .handler(async () => {
    return db.select().from(compounds).orderBy(compounds.name)
  })

export const getVendorsByCompound = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data: compoundId }) => {
    const rows = await db
      .select({ vendor: vendors })
      .from(vendorCompounds)
      .innerJoin(vendors, eq(vendorCompounds.vendorId, vendors.id))
      .where(eq(vendorCompounds.compoundId, compoundId))
      .orderBy(desc(vendors.rating))

    return rows.map((r) => rowToVendor(r.vendor))
  })
