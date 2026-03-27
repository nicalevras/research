export type VendorCategory = 'all' | 'research' | 'therapeutic' | 'cosmetic' | 'api-supplier'

export interface Vendor {
  id: string
  name: string
  website: string
  location: string
  country: string
  rating: number
  reviewCount: number
  category: Exclude<VendorCategory, 'all'>
  description: string
  founded: number
  certifications: string[]
}
