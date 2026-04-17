import type { VendorSummary } from '~/lib/types'

export const SITE_URL = process.env.SITE_URL || ''

export const FEATURE_LABELS = {
  coa: 'Verified COAs',
  'credit-card': 'Credit Card',
  ach: 'ACH',
  crypto: 'Crypto',
  'fast-shipping': 'Fast Shipping',
  international: 'International Shipping',
  'promo-code': 'Promo Code',
} as const

export const FEATURE_FILTERS: { id: string; name: string; emoji: string }[] = [
  { id: 'coa', name: FEATURE_LABELS.coa, emoji: '📋' },
  { id: 'credit-card', name: FEATURE_LABELS['credit-card'], emoji: '💳' },
  { id: 'ach', name: FEATURE_LABELS.ach, emoji: '🏦' },
  { id: 'crypto', name: FEATURE_LABELS.crypto, emoji: '' },
  { id: 'fast-shipping', name: FEATURE_LABELS['fast-shipping'], emoji: '⚡' },
  { id: 'international', name: FEATURE_LABELS.international, emoji: '🌍' },
  { id: 'promo-code', name: FEATURE_LABELS['promo-code'], emoji: '🏷️' },
]

export function getVendorFeatureLabels(vendor: VendorSummary) {
  return [
    vendor.hasCoa ? FEATURE_LABELS.coa : undefined,
    vendor.acceptsCreditCard ? FEATURE_LABELS['credit-card'] : undefined,
    vendor.acceptsAch ? FEATURE_LABELS.ach : undefined,
    vendor.acceptsCrypto ? FEATURE_LABELS.crypto : undefined,
    vendor.fastShipping ? FEATURE_LABELS['fast-shipping'] : undefined,
    vendor.shipsInternational ? FEATURE_LABELS.international : undefined,
    vendor.promoCode ? FEATURE_LABELS['promo-code'] : undefined,
  ].filter(Boolean) as string[]
}

export const COUNTRIES = [
  'All Countries',
  'USA',
] as const
