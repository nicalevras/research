import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'
import { PEPTIDE_CATEGORIES } from '../lib/constants'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString)
const db = drizzle(client, { schema })

type CsvRow = Record<string, string>

const VENDOR_IMAGE_BASE_PATH = '/images/vendor-images'
const VENDOR_IMAGE_DIR = 'public/images/vendor-images'
const VENDOR_LOGO_FILE_OVERRIDES: Record<string, string> = {
  genpeptide: 'gen_peptides.webp',
  'midwest-peptide': 'midwest_peptides.webp',
  nextgenpeps: 'next_gen_peptides.webp',
  'nura-peptide': 'nura_peptides.webp',
  s1research: 's1_research_peptides.webp',
}
const FEATURED_COMPOUND_IDS = new Set([
  'bpc-157',
  'tb-500',
  'semaglutide',
  'tirzepatide',
  'retatrutide',
  'cjc-1295-ipamorelin',
])

function parseCsvRows(text: string): string[][] {
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

  return rows
}

function parseCsv(text: string): CsvRow[] {
  const rows = parseCsvRows(text)

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

function requiredField(row: CsvRow, key: string, label = key): string {
  const value = row[key]?.trim()
  if (!value) throw new Error(`Missing required CSV field: ${label}`)
  return value
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

function readVerified(row: CsvRow): boolean {
  const verifiedKey = ['VERIFIED', 'Verified', 'verified'].find((key) => key in row)
  if (!verifiedKey) return true
  return parseBoolean(row[verifiedKey] ?? '')
}

function readFeatured(row: CsvRow): boolean {
  const featuredKey = ['FEATURED', 'Featured', 'featured'].find((key) => key in row)
  if (!featuredKey) return false
  return parseBoolean(row[featuredKey] ?? '')
}

function readDescription(row: CsvRow, vendorName: string): string {
  const descriptionKey = ['DESCRIPTION', 'Description', 'description'].find((key) => key in row)
  const description = descriptionKey ? row[descriptionKey]?.trim() : ''
  return description || `${vendorName} is a peptide vendor listed in AminoRank.`
}

function readVendorLogoFiles() {
  const imageDir = resolve(process.cwd(), VENDOR_IMAGE_DIR)
  if (!existsSync(imageDir)) return new Set<string>()

  return new Set(readdirSync(imageDir).filter((file) => file.endsWith('.webp')))
}

function readVendorLogoUrl(vendorId: string, logoFiles: Set<string>): string | null {
  const underscoredId = vendorId.replace(/-/g, '_')
  const logoFile = VENDOR_LOGO_FILE_OVERRIDES[vendorId]
    ?? [
      `${underscoredId}.webp`,
      `${underscoredId}_peptides.webp`,
    ].find((candidate) => logoFiles.has(candidate))

  return logoFile ? `${VENDOR_IMAGE_BASE_PATH}/${logoFile}` : null
}

function readVendorCsv() {
  const csvPath = resolve(process.cwd(), process.env.VENDOR_CSV_PATH ?? '../AFF VENDORS - HERMES - Sheet1.csv')
  const text = readFileSync(csvPath, 'utf-8')
  return parseCsv(text)
}

function readPeptideDescriptionMap() {
  const csvPath = resolve(process.cwd(), process.env.PEPTIDE_DESCRIPTIONS_CSV_PATH ?? '../peptide_descriptions.csv')
  if (!existsSync(csvPath)) {
    throw new Error(`Peptide descriptions CSV not found: ${csvPath}`)
  }

  const rows = parseCsv(readFileSync(csvPath, 'utf-8'))
  const descriptionMap = new Map<string, string>()

  rows.forEach((row) => {
    const compoundKey = ['compound', 'Compound', 'COMPOUND'].find((key) => key in row)
    const descriptionKey = ['description', 'Description', 'DESCRIPTION'].find((key) => key in row)
    if (!compoundKey || !descriptionKey) {
      throw new Error('Peptide descriptions CSV must include compound and description columns')
    }

    const name = requiredField(row, compoundKey, 'compound')
    const description = stripDescriptionSourceNotes(requiredField(row, descriptionKey, `${name} description`))
    const id = slugify(name)

    if (descriptionMap.has(id)) {
      throw new Error(`Duplicate peptide description for ${name}`)
    }

    descriptionMap.set(id, description)
  })

  return descriptionMap
}

function stripDescriptionSourceNotes(description: string): string {
  return description.replace(/\s+\[[^\]]+\]\s*$/, '').trim()
}

function categoryIdFromHeader(header: string): string | undefined {
  const normalized = header.toLowerCase()
  return PEPTIDE_CATEGORIES.find((category) => normalized.includes(category.name.toLowerCase()))?.id
}

function readPeptideCategoryMap() {
  const csvPath = resolve(process.cwd(), process.env.PEPTIDE_CATEGORIES_CSV_PATH ?? '../peptide categories - Sheet1.csv')
  if (!existsSync(csvPath)) return new Map<string, string[]>()

  const [headers, ...rows] = parseCsvRows(readFileSync(csvPath, 'utf-8'))
  if (!headers) return new Map<string, string[]>()

  const categoryIds = headers.map(categoryIdFromHeader)
  const categoryMap = new Map<string, string[]>()

  rows.forEach((row) => {
    row.forEach((value, index) => {
      const compoundName = value.trim()
      const categoryId = categoryIds[index]
      if (!compoundName || !categoryId) return

      const compoundId = slugify(compoundName)
      const categories = categoryMap.get(compoundId) ?? []
      if (!categories.includes(categoryId)) categories.push(categoryId)
      categoryMap.set(compoundId, categories)
    })
  })

  return categoryMap
}

function readCompoundCategories(compoundId: string, categoryMap: Map<string, string[]>): string[] {
  if (categoryMap.size === 0) return []

  const categories = categoryMap.get(compoundId)
  if (categories) return categories

  console.warn(`  Missing peptide category for ${compoundId}; defaulting to research.`)
  return ['research']
}

function buildSeedData(rows: CsvRow[]) {
  const compoundMap = new Map<string, string>()
  const vendorIds = new Set<string>()
  const vendorLogoFiles = readVendorLogoFiles()
  const peptideCategoryMap = readPeptideCategoryMap()
  const peptideDescriptionMap = readPeptideDescriptionMap()

  const vendors = rows.map((row) => {
    const name = requiredField(row, 'Vendor')
    const id = slugify(name)
    if (!id) throw new Error(`Missing vendor id for ${name}`)
    if (vendorIds.has(id)) throw new Error(`Duplicate vendor id: ${id}`)
    vendorIds.add(id)

    const compoundNames = parseCompounds(requiredField(row, 'Compounds', `${name} compounds`))
    const compoundSlugs = compoundNames.map(slugify)
    const website = requiredField(row, 'URL', `${name} URL`)

    compoundNames.forEach((compoundName, index) => {
      const compoundSlug = compoundSlugs[index]
      if (!compoundSlug) throw new Error(`Missing compound slug for ${compoundName}`)
      compoundMap.set(compoundSlug, compoundName)
    })

    const promoCode = readPromoCode(row)

    return {
      id,
      name,
      website,
      description: readDescription(row, name),
      logoUrl: readVendorLogoUrl(id, vendorLogoFiles),
      promoCode,
      promoDiscountPercent: readPromoDiscountPercent(row, promoCode),
      verified: readVerified(row),
      featured: readFeatured(row),
      country: row.Country || 'USA',
      compoundNames,
      compoundSlugs,
      hasCoa: parseBoolean(row.COA ?? ''),
      acceptsCreditCard: parseBoolean(row['CREDIT CARD'] ?? ''),
      acceptsAch: parseBoolean(row.ACH ?? ''),
      acceptsCrypto: parseBoolean(row.CRYPTO ?? ''),
      fastShipping: parseBoolean(row['FAST SHIPPING'] ?? ''),
      shipsInternational: parseBoolean(row.INTERNATIONAL ?? ''),
      rating: 0,
      reviewCount: 0,
    } satisfies typeof schema.vendors.$inferInsert
  })

  const compounds = Array.from(compoundMap.entries())
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([id, name], index) => {
      const description = peptideDescriptionMap.get(id)
      if (!description) {
        throw new Error(`Missing peptide description for ${name}`)
      }

      return {
        id,
        name,
        description,
        categories: readCompoundCategories(id, peptideCategoryMap),
        featured: FEATURED_COMPOUND_IDS.has(id),
        sortOrder: index,
      } satisfies typeof schema.compounds.$inferInsert
    })

  const unusedDescriptionIds = [...peptideDescriptionMap.keys()].filter((id) => !compoundMap.has(id))
  if (unusedDescriptionIds.length > 0) {
    throw new Error(`Found peptide descriptions with no matching compound: ${unusedDescriptionIds.join(', ')}`)
  }

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
