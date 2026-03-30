import type { VendorCategory } from './types'

export const SITE_URL = ''

export const CATEGORIES: { value: VendorCategory; label: string }[] = [
  { value: 'all', label: 'All Vendors' },
  { value: 'research', label: 'Research' },
  { value: 'therapeutic', label: 'Therapeutic' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'api-supplier', label: 'API Supplier' },
]

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.filter((c) => c.value !== 'all').map((c) => [c.value, c.label]),
) as Record<Exclude<VendorCategory, 'all'>, string>

export const TAGS: { id: string; name: string; emoji: string }[] = [
  { id: 'credit-card', name: 'Credit Card', emoji: '💳' },
  { id: 'crypto', name: 'Crypto Accepted', emoji: '₿' },
  { id: 'free-shipping', name: 'Free Shipping', emoji: '📦' },
  { id: 'lab-tested', name: 'Lab Tested', emoji: '🔬' },
  { id: 'gmp-certified', name: 'GMP Certified', emoji: '✅' },
  { id: 'ships-international', name: 'Ships International', emoji: '🌍' },
  { id: 'money-back', name: 'Money-Back Guarantee', emoji: '💰' },
  { id: 'same-day-shipping', name: 'Same-Day Shipping', emoji: '⚡' },
  { id: 'coa-available', name: 'COA Available', emoji: '📋' },
  { id: 'bulk-discounts', name: 'Bulk Discounts', emoji: '🏷️' },
]

export const COUNTRIES = [
  'All Countries',
  'Canada',
  'China',
  'France',
  'Germany',
  'South Korea',
  'Switzerland',
  'USA',
] as const
