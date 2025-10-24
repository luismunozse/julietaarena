export interface Review {
  id: string
  propertyId: string
  userId: string
  userName: string
  userAvatar?: string
  rating: number
  title: string
  comment: string
  pros: string[]
  cons: string[]
  verified: boolean
  helpful: number
  createdAt: string
  updatedAt: string
}

export interface ReviewSummary {
  propertyId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  recentReviews: Review[]
}

export interface ReviewFormData {
  propertyId: string
  rating: number
  title: string
  comment: string
  pros: string[]
  cons: string[]
}
