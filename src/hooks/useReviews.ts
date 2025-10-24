'use client'

import { useState, useEffect } from 'react'
import { Review, ReviewSummary, ReviewFormData } from '@/types/review'
import { useAuth } from './useAuth'

const REVIEWS_KEY = 'julieta-arena-reviews'

export function useReviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    // Cargar reviews del localStorage
    const stored = localStorage.getItem(REVIEWS_KEY)
    if (stored) {
      try {
        setReviews(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading reviews:', error)
      }
    }
  }, [])

  const saveReviews = (newReviews: Review[]) => {
    setReviews(newReviews)
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(newReviews))
  }

  const createReview = (formData: ReviewFormData): Review => {
    if (!user) throw new Error('Usuario no autenticado')

    const newReview: Review = {
      id: `review-${Date.now()}`,
      propertyId: formData.propertyId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      pros: formData.pros,
      cons: formData.cons,
      verified: true, // En una app real, esto se verificaría
      helpful: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedReviews = [...reviews, newReview]
    saveReviews(updatedReviews)
    return newReview
  }

  const updateReview = (reviewId: string, updates: Partial<ReviewFormData>) => {
    if (!user) throw new Error('Usuario no autenticado')

    const updatedReviews = reviews.map(review => 
      review.id === reviewId && review.userId === user.id
        ? { 
            ...review, 
            ...updates, 
            updatedAt: new Date().toISOString() 
          }
        : review
    )
    saveReviews(updatedReviews)
  }

  const deleteReview = (reviewId: string) => {
    if (!user) throw new Error('Usuario no autenticado')

    const updatedReviews = reviews.filter(review => 
      !(review.id === reviewId && review.userId === user.id)
    )
    saveReviews(updatedReviews)
  }

  const getReviewsByProperty = (propertyId: string): Review[] => {
    return reviews
      .filter(review => review.propertyId === propertyId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const getReviewSummary = (propertyId: string): ReviewSummary => {
    const propertyReviews = getReviewsByProperty(propertyId)
    
    if (propertyReviews.length === 0) {
      return {
        propertyId,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        recentReviews: []
      }
    }

    const totalRating = propertyReviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / propertyReviews.length

    const ratingDistribution = propertyReviews.reduce((dist, review) => {
      dist[review.rating as keyof typeof dist]++
      return dist
    }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })

    const recentReviews = propertyReviews.slice(0, 3)

    return {
      propertyId,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: propertyReviews.length,
      ratingDistribution,
      recentReviews
    }
  }

  const markHelpful = (reviewId: string) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    )
    saveReviews(updatedReviews)
  }

  const getUserReview = (propertyId: string): Review | null => {
    if (!user) return null
    return reviews.find(review => 
      review.propertyId === propertyId && review.userId === user.id
    ) || null
  }

  const canUserReview = (propertyId: string): boolean => {
    if (!user) return false
    return !getUserReview(propertyId)
  }

  return {
    reviews,
    createReview,
    updateReview,
    deleteReview,
    getReviewsByProperty,
    getReviewSummary,
    markHelpful,
    getUserReview,
    canUserReview
  }
}
