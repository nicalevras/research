export const SITE_URL = process.env.SITE_URL || ''

export const FEATURE_LABELS = {
  coa: 'COAs',
  'credit-card': 'Credit Card Accepted',
  ach: 'ACH Accepted',
  crypto: 'Crypto Accepted',
  'fast-shipping': 'Fast Shipping',
  international: 'International Shipping',
  'promo-code': 'Promo Code',
} as const

export const FEATURE_FILTERS: { id: string; name: string; emoji: string }[] = [
  { id: 'coa', name: FEATURE_LABELS.coa, emoji: '📋' },
  { id: 'credit-card', name: FEATURE_LABELS['credit-card'], emoji: '💳' },
  { id: 'ach', name: FEATURE_LABELS.ach, emoji: '🏦' },
  { id: 'crypto', name: FEATURE_LABELS.crypto, emoji: '' },
  { id: 'promo-code', name: FEATURE_LABELS['promo-code'], emoji: '🏷️' },
  { id: 'international', name: FEATURE_LABELS.international, emoji: '🌍' },
  { id: 'fast-shipping', name: FEATURE_LABELS['fast-shipping'], emoji: '⚡' },
]

export const PEPTIDE_CATEGORIES: { id: string; name: string; emoji: string }[] = [
  { id: 'weight-loss', name: 'Weight Loss', emoji: '🏋️' },
  { id: 'energy', name: 'Energy', emoji: '⚡' },
  { id: 'focus', name: 'Focus', emoji: '🧠' },
  { id: 'sexual-health', name: 'Sexual Health', emoji: '☯️' },
  { id: 'cosmetic', name: 'Cosmetic', emoji: '✨' },
  { id: 'recovery', name: 'Recovery', emoji: '🩹' },
  { id: 'muscle', name: 'Muscle', emoji: '💪' },
  { id: 'longevity', name: 'Longevity', emoji: '⏳' },
  { id: 'research', name: 'Research', emoji: '🧪' },
]
