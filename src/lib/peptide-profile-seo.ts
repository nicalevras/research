import { PEPTIDE_CATEGORIES, SITE_NAME } from './constants'
import type { CompoundProfileData } from './types'

const MAX_PEPTIDE_PROFILE_DESCRIPTION_LENGTH = 160

const PEPTIDE_CATEGORY_BY_ID = new Map(PEPTIDE_CATEGORIES.map((category) => [category.id, category.name]))

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function truncateAtWordBoundary(value: string, maxLength: number) {
  const normalized = normalizeWhitespace(value)
  if (normalized.length <= maxLength) return normalized

  const truncated = normalized.slice(0, maxLength + 1)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex <= 0) {
    return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
  }

  return `${truncated.slice(0, lastSpaceIndex).trimEnd()}…`
}

function peptideProfileSignals(compound: CompoundProfileData, vendorCount: number, studyCount: number) {
  const signals: string[] = []

  const categoryNames = compound.categories
    .map((categoryId) => PEPTIDE_CATEGORY_BY_ID.get(categoryId))
    .filter((categoryName): categoryName is string => Boolean(categoryName))

  if (categoryNames.length > 0) {
    signals.push(categoryNames.join(', '))
  }

  if (vendorCount > 0) {
    signals.push(`${vendorCount} ${vendorCount === 1 ? 'vendor' : 'vendors'}`)
  }

  if (studyCount > 0) {
    signals.push('linked studies available')
  }

  return signals
}

export function peptideProfilePath(compoundId: string) {
  return `/peptides/${compoundId}`
}

export function buildPeptideProfileTitle(compound: CompoundProfileData) {
  return `${compound.name} Peptide Profile - ${SITE_NAME}`
}

export function buildPeptideProfileDescription(
  compound: CompoundProfileData,
  vendorCount: number,
  studyCount: number,
) {
  const description = normalizeWhitespace(compound.description)
  const signals = peptideProfileSignals(compound, vendorCount, studyCount)
  const signalSuffix = signals.length > 0 ? ` ${signals.join(' • ')}` : ''
  const fallback = `${compound.name} peptide profile${signalSuffix}.`

  return truncateAtWordBoundary(
    description ? `${description}${signalSuffix}` : fallback,
    MAX_PEPTIDE_PROFILE_DESCRIPTION_LENGTH,
  )
}
