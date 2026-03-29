import { eq, and, ilike, or, sql } from 'drizzle-orm'
import { db } from '~/db'
import { vendors, compounds, vendorCompounds } from '~/db/schema'
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
    founded: row.founded,
    certifications: row.certifications,
  }
}

export async function getVendorById(id: string): Promise<Vendor | undefined> {
  const row = await db.query.vendors.findFirst({
    where: eq(vendors.id, id),
  })
  return row ? rowToVendor(row) : undefined
}

export async function filterVendors(filters: {
  category?: string
  country?: string
  q?: string
}): Promise<Vendor[]> {
  const conditions = []

  if (filters.category && filters.category !== 'all') {
    conditions.push(eq(vendors.category, filters.category))
  }

  if (filters.country) {
    conditions.push(eq(vendors.country, filters.country))
  }

  if (filters.q) {
    const pattern = `%${filters.q}%`
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
    .orderBy(vendors.rating)

  return rows.map(rowToVendor)
}

export async function getVendorCompounds(vendorId: string) {
  const rows = await db
    .select({ id: compounds.id, name: compounds.name, category: compounds.category })
    .from(vendorCompounds)
    .innerJoin(compounds, eq(vendorCompounds.compoundId, compounds.id))
    .where(eq(vendorCompounds.vendorId, vendorId))

  return rows
}

export async function getCompounds() {
  return db.select().from(compounds).orderBy(compounds.name)
}

export async function getVendorsByCompound(compoundId: string): Promise<Vendor[]> {
  const rows = await db
    .select({ vendor: vendors })
    .from(vendorCompounds)
    .innerJoin(vendors, eq(vendorCompounds.vendorId, vendors.id))
    .where(eq(vendorCompounds.compoundId, compoundId))
    .orderBy(vendors.rating)

  return rows.map((r) => rowToVendor(r.vendor))
}
