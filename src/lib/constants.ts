export const SITE_URL = process.env.SITE_URL || ''

export const FEATURE_FILTERS: { id: string; name: string; emoji: string }[] = [
  { id: 'coa', name: 'COA', emoji: '📋' },
  { id: 'credit-card', name: 'Credit Card', emoji: '💳' },
  { id: 'ach', name: 'ACH', emoji: '🏦' },
  { id: 'crypto', name: 'Crypto', emoji: '' },
  { id: 'fast-shipping', name: 'Fast Shipping', emoji: '⚡' },
  { id: 'international', name: 'International', emoji: '🌍' },
]

export const COUNTRIES = [
  'All Countries',
  'USA',
] as const
