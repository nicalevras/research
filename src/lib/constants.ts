import type { VendorCategory } from './types'

export const SITE_URL = ''

export const CATEGORIES: { value: VendorCategory; label: string }[] = [
  { value: 'all', label: 'All Vendors' },
  { value: 'research', label: 'Research' },
  { value: 'therapeutic', label: 'Therapeutic' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'api-supplier', label: 'API Supplier' },
  { value: 'custom-synthesis', label: 'Custom Synthesis' },
  { value: 'no-reference', label: 'No Ref' },
  { value: 'ghrp', label: 'GHRP' },
  { value: 'bpc', label: 'BPC-157' },
  { value: 'thymosin', label: 'Thymosin' },
  { value: 'glutathione', label: 'Glutathione' },
  { value: 'melanotan', label: 'Melanotan' },
  { value: 'epitalon', label: 'Epitalon' },
  { value: 'tb500', label: 'TB-500' },
  { value: 'mots-c', label: 'MOTS-c' },
]

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.filter((c) => c.value !== 'all').map((c) => [c.value, c.label]),
) as Record<Exclude<VendorCategory, 'all'>, string>

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
