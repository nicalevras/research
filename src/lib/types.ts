export interface VendorSummary {
  id: string
  name: string
  description: string
  logoUrl: string | null
  promoCode: string | null
  promoDiscountPercent: number | null
  verified: boolean
  featured: boolean
  country: string
  hasCoa: boolean
  acceptsCreditCard: boolean
  acceptsAch: boolean
  acceptsCrypto: boolean
  fastShipping: boolean
  shipsInternational: boolean
  rating: number
  reviewCount: number
  updatedAt?: string
}

export interface Vendor extends VendorSummary {
  website: string
  compoundNames: string[]
  compoundSlugs: string[]
  updatedAt: string
}

export interface VendorCompoundOption {
  id: string
  name: string
  compoundSlugs: string[]
}

export interface CompoundProfileVendor {
  id: string
  name: string
  logoUrl: string | null
  rating: number
}

export interface CompoundProfileData {
  id: string
  name: string
  description: string
  categories: string[]
}

export interface PeptideProfileSitemapEntry {
  id: string
  updatedAt: string
}

export interface FeatureFilter {
  id: string
  name: string
}

export interface Compound {
  id: string
  name: string
  description: string
  categories: string[]
  featured: boolean
  vendorCount?: number
}

export interface CompoundStudy {
  id: string
  title: string
  source: string
  url: string
}

export interface Review {
  id: string
  userId: string
  username: string
  vendorId: string
  rating: number
  comment: string
  createdAt: string
  updatedAt: string
}
