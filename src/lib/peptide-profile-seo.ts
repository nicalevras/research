import { SITE_NAME } from './constants'
import type { CompoundProfileData } from './types'

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function peptideProfilePath(compoundId: string) {
  return `/peptides/${compoundId}`
}

export function buildPeptideProfileTitle(compound: CompoundProfileData) {
  return `${normalizeWhitespace(compound.name)} Peptide Review 2026: Studies & Vendors | ${SITE_NAME}`
}

export function buildPeptideProfileDescription(
  compound: CompoundProfileData,
  _vendorCount: number,
  _studyCount: number,
) {
  return `${normalizeWhitespace(compound.name)} peptide review with linked studies, categories, and vendor availability on ${SITE_NAME}.`
}
