import { FEATURE_FILTERS } from './constants'
import type { Compound } from './types'

export const APPROVED_VENDOR_INDEX_FEATURES = FEATURE_FILTERS.map(({ id, name }) => ({ id, name }))

const APPROVED_VENDOR_INDEX_FEATURE_SET = new Set(APPROVED_VENDOR_INDEX_FEATURES.map((feature) => feature.id))

export type VendorDirectorySeoContext = {
  query?: string
  validFeatureIds: string[]
  invalidFeatureIds: string[]
  validPeptide?: Compound
  hasInvalidPeptide: boolean
}

export function normalizeVendorQuery(query?: string) {
  const normalized = query?.trim()
  return normalized ? normalized : undefined
}

export function parseVendorFeatureIds(features?: string) {
  const valid: string[] = []
  const invalid: string[] = []
  const seen = new Set<string>()

  for (const featureId of features?.split(',').filter(Boolean) ?? []) {
    if (seen.has(featureId)) continue
    seen.add(featureId)

    if (APPROVED_VENDOR_INDEX_FEATURE_SET.has(featureId)) {
      valid.push(featureId)
    } else {
      invalid.push(featureId)
    }
  }

  return { valid, invalid }
}

export function resolveVendorDirectorySeoContext(
  filters: {
    q?: string
    features?: string
    peptide?: string
  },
  compounds: Compound[],
): VendorDirectorySeoContext {
  const query = normalizeVendorQuery(filters.q)
  const { valid, invalid } = parseVendorFeatureIds(filters.features)
  const validPeptide = filters.peptide
    ? compounds.find((compound) => compound.id === filters.peptide)
    : undefined

  return {
    query,
    validFeatureIds: valid,
    invalidFeatureIds: invalid,
    validPeptide,
    hasInvalidPeptide: Boolean(filters.peptide && !validPeptide),
  }
}

export function vendorFeaturePath(featureId: string) {
  return `/vendors?features=${featureId}`
}

export function vendorPeptidePath(compoundId: string) {
  return `/vendors?peptide=${compoundId}`
}

export function vendorSearchPath(query: string) {
  return `/vendors?${new URLSearchParams({ q: query }).toString()}`
}
