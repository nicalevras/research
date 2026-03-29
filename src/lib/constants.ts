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

export const TAGS: { id: string; name: string }[] = [
  { id: 'credit-card', name: 'Credit Card' },
  { id: 'crypto', name: 'Crypto Accepted' },
  { id: 'free-shipping', name: 'Free Shipping' },
  { id: 'lab-tested', name: 'Lab Tested' },
  { id: 'gmp-certified', name: 'GMP Certified' },
  { id: 'ships-international', name: 'Ships International' },
  { id: 'money-back', name: 'Money-Back Guarantee' },
  { id: 'same-day-shipping', name: 'Same-Day Shipping' },
  { id: 'coa-available', name: 'COA Available' },
  { id: 'bulk-discounts', name: 'Bulk Discounts' },
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
