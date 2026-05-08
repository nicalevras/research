import { SITE_NAME } from './constants'
import type { Vendor } from './types'

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

export function vendorProfilePath(vendorId: string) {
  return `/vendors/${vendorId}`
}

export function buildVendorProfileTitle(vendor: Vendor) {
  return `${normalizeWhitespace(vendor.name)} Review 2026: Ratings, Lab Results & Discounts | ${SITE_NAME}`
}

export function buildVendorProfileDescription(vendor: Vendor) {
  return `${normalizeWhitespace(vendor.name)} reviews, lab results, payment methods, shipping details, peptide availability, and exclusive discounts on ${SITE_NAME}.`
}
