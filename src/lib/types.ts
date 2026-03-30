export interface Vendor {
  id: string
  name: string
  website: string
  location: string
  country: string
  rating: number
  reviewCount: number
  description: string
}

export interface Tag {
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
