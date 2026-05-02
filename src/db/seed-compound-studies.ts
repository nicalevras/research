import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { asc } from 'drizzle-orm'
import * as schema from './schema'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const client = postgres(connectionString)
const db = drizzle(client, { schema })

type CsvRow = Record<string, string>

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

function requiredField(row: CsvRow, key: string): string {
  const value = row[key]?.trim()
  if (!value) throw new Error(`Missing required CSV field: ${key}`)
  return value
}

function readStudiesCsv() {
  const csvPath = resolve(
    process.cwd(),
    process.env.COMPOUND_STUDIES_CSV_PATH ?? '../compound_studies.csv',
  )
  return parseCsv(readFileSync(csvPath, 'utf-8'))
}

async function seedCompoundStudies() {
  console.log('Seeding compound_studies from CSV...')

  const csvRows = readStudiesCsv()
  const dbCompounds = await db
    .select({
      id: schema.compounds.id,
      name: schema.compounds.name,
    })
    .from(schema.compounds)
    .orderBy(asc(schema.compounds.sortOrder), asc(schema.compounds.name))

  const compoundIdBySlug = new Map(
    dbCompounds.map((compound) => [slugify(compound.name), compound.id]),
  )

  const studyRows = csvRows.map((row) => {
    const compoundName = requiredField(row, 'compound')
    const compoundId = compoundIdBySlug.get(slugify(compoundName))
    if (!compoundId) {
      throw new Error(`Compound from studies CSV not found in DB compounds table: ${compoundName}`)
    }

    const studyRank = Number(requiredField(row, 'study_rank'))
    if (!Number.isInteger(studyRank) || studyRank < 1) {
      throw new Error(`Invalid study_rank for ${compoundName}: ${row.study_rank}`)
    }

    return {
      compoundId,
      title: requiredField(row, 'study_title'),
      source: requiredField(row, 'source'),
      url: requiredField(row, 'url'),
      sortOrder: studyRank,
    } satisfies typeof schema.compoundStudies.$inferInsert
  })

  console.log('  Clearing existing compound_studies...')
  await db.delete(schema.compoundStudies)

  console.log(`  Inserting ${studyRows.length} compound study rows...`)
  await db.insert(schema.compoundStudies).values(studyRows)

  console.log('Compound study seed complete.')
  await client.end()
  process.exit(0)
}

seedCompoundStudies().catch(async (err) => {
  console.error('Compound study seed failed:', err)
  await client.end()
  process.exit(1)
})
