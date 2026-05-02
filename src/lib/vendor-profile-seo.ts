import { FEATURE_LABELS } from './constants'
import type { Vendor } from './types'

const MAX_VENDOR_PROFILE_DESCRIPTION_LENGTH = 160

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

function vendorProfileSignals(vendor: Vendor) {
  const signals: string[] = []

  if (vendor.country) signals.push(vendor.country)
  if (vendor.hasCoa) signals.push(FEATURE_LABELS.coa)
  if (vendor.acceptsCreditCard) signals.push(FEATURE_LABELS['credit-card'])
  if (vendor.acceptsAch) signals.push(FEATURE_LABELS.ach)
  if (vendor.acceptsCrypto) signals.push(FEATURE_LABELS.crypto)
  if (vendor.fastShipping) signals.push(FEATURE_LABELS['fast-shipping'])
  if (vendor.shipsInternational) signals.push(FEATURE_LABELS.international)
  if (vendor.promoCode) signals.push(FEATURE_LABELS['promo-code'])

  return signals
}

export function vendorProfilePath(vendorId: string) {
  return `/vendors/${vendorId}`
}

export function buildVendorProfileTitle(vendor: Vendor) {
  return `${vendor.name} — Peptide Vendor Profile`
}

export function buildVendorProfileDescription(vendor: Vendor) {
  const description = normalizeWhitespace(vendor.description)
  const signals = vendorProfileSignals(vendor)
  const signalSuffix = signals.length > 0 ? ` ${signals.join(' • ')}` : ''
  return truncateAtWordBoundary(`${description}${signalSuffix}`, MAX_VENDOR_PROFILE_DESCRIPTION_LENGTH)
}
