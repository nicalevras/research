export interface VendorSummary {
  id: string
  name: string
  description: string
  logoUrl: string | null
  promoCode: string | null
  promoDiscountPercent: number | null
  verified: boolean
  country: string
  hasCoa: boolean
  acceptsCreditCard: boolean
  acceptsAch: boolean
  acceptsCrypto: boolean
  fastShipping: boolean
  shipsInternational: boolean
  rating: number
  reviewCount: number
}

export interface Vendor extends VendorSummary {
  website: string
  compoundNames: string[]
  compoundSlugs: string[]
}

export interface FeatureFilter {
  id: string
  name: string
}

export interface Compound {
  id: string
  name: string
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
