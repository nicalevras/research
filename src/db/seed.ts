import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString)
const db = drizzle(client, { schema })

type CsvRow = Record<string, string>

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(field)
      field = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i++
      row.push(field)
      if (row.some((value) => value.length > 0)) rows.push(row)
      row = []
      field = ''
      continue
    }

    field += char
  }

  row.push(field)
  if (row.some((value) => value.length > 0)) rows.push(row)

  const [headers, ...dataRows] = rows
  if (!headers) return []

  return dataRows.map((values) => {
    const result: CsvRow = {}
    headers.forEach((header, index) => {
      result[header.trim()] = (values[index] ?? '').trim()
    })
    return result
  })
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\+/g, ' plus ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === 'true'
}

function parseCompounds(value: string): string[] {
  return value
    .split(',')
    .map((compound) => compound.trim())
    .filter(Boolean)
}

function readPromoCode(row: CsvRow): string | null {
  const promoCodeKey = ['PROMO_CODE', 'PROMO CODE', 'Promo Code'].find((key) => key in row)
  if (!promoCodeKey) return 'VIALSOURCE'

  const promoCode = row[promoCodeKey]?.trim()
  return promoCode || null
}

function readPromoDiscountPercent(row: CsvRow, promoCode: string | null): number | null {
  const discountKey = [
    'PROMO_DISCOUNT_PERCENT',
    'PROMO DISCOUNT PERCENT',
    'PROMO DISCOUNT %',
    'DISCOUNT_PERCENT',
    'DISCOUNT PERCENT',
    'Discount Percent',
  ].find((key) => key in row)

  if (!discountKey) return promoCode ? 10 : null

  const rawDiscount = row[discountKey]?.replace('%', '').trim()
  if (!rawDiscount) return null

  const discountPercent = Number(rawDiscount)
  if (!Number.isInteger(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
    throw new Error(`Invalid promo discount percent: ${row[discountKey]}`)
  }

  return discountPercent
}

function readVendorCsv() {
  const csvPath = resolve(process.cwd(), process.env.VENDOR_CSV_PATH ?? '../AFF VENDORS - HERMES - Sheet1.csv')
  const text = readFileSync(csvPath, 'utf-8')
  return parseCsv(text)
}

function buildSeedData(rows: CsvRow[]) {
  const compoundMap = new Map<string, string>()
  const vendorIds = new Set<string>()

  const vendors = rows.map((row) => {
    const name = row.Vendor
    const id = slugify(name)
    if (!id) throw new Error(`Missing vendor id for ${name}`)
    if (vendorIds.has(id)) throw new Error(`Duplicate vendor id: ${id}`)
    vendorIds.add(id)

    const compoundNames = parseCompounds(row.Compounds)
    const compoundSlugs = compoundNames.map(slugify)

    compoundNames.forEach((compoundName, index) => {
      const compoundSlug = compoundSlugs[index]
      if (!compoundSlug) throw new Error(`Missing compound slug for ${compoundName}`)
      compoundMap.set(compoundSlug, compoundName)
    })

    const promoCode = readPromoCode(row)

    return {
      id,
      name,
      website: row.URL,
      promoCode,
      promoDiscountPercent: readPromoDiscountPercent(row, promoCode),
      country: row.Country || 'USA',
      compoundNames,
      compoundSlugs,
      hasCoa: parseBoolean(row.COA),
      acceptsCreditCard: parseBoolean(row['CREDIT CARD']),
      acceptsAch: parseBoolean(row.ACH),
      acceptsCrypto: parseBoolean(row.CRYPTO),
      fastShipping: parseBoolean(row['FAST SHIPPING']),
      shipsInternational: parseBoolean(row.INTERNATIONAL),
      rating: 0,
      reviewCount: 0,
    } satisfies typeof schema.vendors.$inferInsert
  })

  const compounds = Array.from(compoundMap.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id, name], index) => ({
      id,
      name,
      sortOrder: index,
    } satisfies typeof schema.compounds.$inferInsert))

  return { vendors, compounds }
}

async function seed() {
  console.log('Seeding database from CSV...')

  const rows = readVendorCsv()
  const { vendors, compounds } = buildSeedData(rows)

  console.log('  Clearing existing app data...')
  await db.delete(schema.reviews)
  await db.delete(schema.vendors)
  await db.delete(schema.compounds)

  console.log(`  Inserting ${compounds.length} compounds...`)
  await db.insert(schema.compounds).values(compounds)

  console.log(`  Inserting ${vendors.length} vendors...`)
  await db.insert(schema.vendors).values(vendors)

  console.log('Seed complete.')
  await client.end()
  process.exit(0)
}

seed().catch(async (err) => {
  console.error('Seed failed:', err)
  await client.end()
  process.exit(1)
})
