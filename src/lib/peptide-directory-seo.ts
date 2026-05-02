import { PEPTIDE_CATEGORIES } from './constants'
import type { VendorCompoundOption } from './types'

export const APPROVED_PEPTIDE_INDEX_CATEGORIES = PEPTIDE_CATEGORIES.map(({ id, name }) => ({ id, name }))

const APPROVED_PEPTIDE_INDEX_CATEGORY_SET = new Set(APPROVED_PEPTIDE_INDEX_CATEGORIES.map((category) => category.id))
const CATEGORY_ORDER = new Map(APPROVED_PEPTIDE_INDEX_CATEGORIES.map((category, index) => [category.id, index]))

export type PeptideDirectorySeoContext = {
  query?: string
  validCategoryIds: string[]
  invalidCategoryIds: string[]
  validVendor?: VendorCompoundOption
  hasInvalidVendor: boolean
}

export function normalizePeptideQuery(query?: string) {
  const normalized = query?.trim()
  return normalized ? normalized : undefined
}

export function parsePeptideCategoryIds(categories?: string) {
  const valid: string[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const categoryId of categories?.split(',').filter(Boolean) ?? []) {
    if (seen.has(categoryId)) continue
    seen.add(categoryId)

    if (APPROVED_PEPTIDE_INDEX_CATEGORY_SET.has(categoryId)) {
      valid.push(categoryId)
    } else {
      invalid.push(categoryId)
    }
  }

  valid.sort((left, right) => (CATEGORY_ORDER.get(left) ?? 0) - (CATEGORY_ORDER.get(right) ?? 0))

  return { valid, invalid }
}

export function resolvePeptideDirectorySeoContext(
  filters: {
    q?: string
    categories?: string
    vendor?: string
  },
  vendors: VendorCompoundOption[],
): PeptideDirectorySeoContext {
  const query = normalizePeptideQuery(filters.q)
  const { valid, invalid } = parsePeptideCategoryIds(filters.categories)
  const validVendor = filters.vendor
    ? vendors.find((vendor) => vendor.id === filters.vendor)
    : undefined

  return {
    query,
    validCategoryIds: valid,
    invalidCategoryIds: invalid,
    validVendor,
    hasInvalidVendor: Boolean(filters.vendor && !validVendor),
  }
}

export function peptideCategoryPath(categoryId: string) {
  return `/peptides?categories=${categoryId}`
}

export function peptideVendorPath(vendorId: string) {
  return `/peptides?vendor=${vendorId}`
}

export function peptideSearchPath(query: string) {
  return `/peptides?${new URLSearchParams({ q: query }).toString()}`
}
