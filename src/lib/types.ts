export type VendorCategory = 'all' | 'research' | 'therapeutic' | 'cosmetic' | 'api-supplier' | 'custom-synthesis' | 'no-reference' | 'ghrp' | 'bpc' | 'thymosin' | 'glutathione' | 'melanotan' | 'epitalon' | 'tb500' | 'mots-c'

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
