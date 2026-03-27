import type { VendorCategory } from './types'

export const CATEGORIES: { value: VendorCategory; label: string }[] = [
  { value: 'all', label: 'All Vendors' },
  { value: 'research', label: 'Research' },
  { value: 'therapeutic', label: 'Therapeutic' },
  { value: 'cosmetic', label: 'Cosmetic' },
  { value: 'api-supplier', label: 'API Supplier' },
]

export const CATEGORY_LABELS: Record<Exclude<VendorCategory, 'all'>, string> = {
  research: 'Research',
  therapeutic: 'Therapeutic',
  cosmetic: 'Cosmetic',
  'api-supplier': 'API Supplier',
}
