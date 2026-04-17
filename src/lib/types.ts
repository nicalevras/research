export interface Vendor {
  id: string
  name: string
  website: string
  country: string
  compoundNames: string[]
  compoundSlugs: string[]
  hasCoa: boolean
  acceptsCreditCard: boolean
  acceptsAch: boolean
  acceptsCrypto: boolean
  fastShipping: boolean
  shipsInternational: boolean
  rating: number
  reviewCount: number
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
