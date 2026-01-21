'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import { useReviews } from '@/hooks/useReviews'
import ReviewForm from './ReviewForm'

interface ReviewSummaryProps {
  property: Property
}

export default function ReviewSummary({ property }: ReviewSummaryProps) {
  const { getReviewSummary, canUserReview } = useReviews()
  const [showReviewForm, setShowReviewForm] = useState(false)

  const summary = getReviewSummary(property.id)
  const canReview = canUserReview(property.id)

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizes = { small: '14px', medium: '18px', large: '24px' }

    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{
              fontSize: sizes[size],
              color: star <= rating ? '#e8b86d' : '#d1d5db'
            }}
          >
            ⭐
          </span>
        ))}
      </div>
    )
  }

  const getRatingPercentage = (rating: number) => {
    if (summary.totalReviews === 0) return 0
    return Math.round((summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution] / summary.totalReviews) * 100)
  }

  if (summary.totalReviews === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '40px 24px',
          background: '#f8f9fa',
          borderRadius: '16px'
        }}
      >
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a4158', marginBottom: '8px' }}>
          Sin reseñas aún
        </h3>
        <p style={{ color: '#636e72', marginBottom: '20px' }}>
          Se el primero en reseñar esta propiedad
        </p>
        {canReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Escribir Reseña
          </button>
        )}

        {showReviewForm && (
          <ReviewForm
            property={property}
            onClose={() => setShowReviewForm(false)}
            onSuccess={() => setShowReviewForm(false)}
          />
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '3rem', fontWeight: '700', color: '#1a4158' }}>{summary.averageRating}</span>
          <div>
            {renderStars(Math.round(summary.averageRating), 'large')}
            <span style={{ color: '#636e72', fontSize: '14px', marginTop: '4px', display: 'block' }}>
              ({summary.totalReviews} reseña{summary.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        {canReview && (
          <button
            onClick={() => setShowReviewForm(true)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Escribir Reseña
          </button>
        )}
      </div>

      {/* Rating Breakdown */}
      <div style={{ marginBottom: '32px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a4158', marginBottom: '16px' }}>
          Distribución de calificaciones
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = getRatingPercentage(rating)
            return (
              <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '40px', fontSize: '14px', color: '#636e72' }}>{rating} ⭐</span>
                <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #e8b86d 0%, #d4a056 100%)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                <span style={{ width: '40px', fontSize: '14px', color: '#636e72', textAlign: 'right' }}>{percentage}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Reviews */}
      {summary.recentReviews.length > 0 && (
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a4158', marginBottom: '16px' }}>
            Reseñas recientes
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {summary.recentReviews.map((review) => (
              <div
                key={review.id}
                style={{
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '12px'
                }}
              >
                {/* Review Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Image
                      src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=2c5f7d&color=fff`}
                      alt={review.userName}
                      width={40}
                      height={40}
                      style={{ borderRadius: '50%' }}
                    />
                    <div>
                      <span style={{ fontWeight: '500', color: '#1a4158' }}>{review.userName}</span>
                      {review.verified && (
                        <span
                          style={{
                            marginLeft: '8px',
                            padding: '2px 8px',
                            background: '#d1fae5',
                            color: '#059669',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}
                        >
                          ✓ Verificado
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {renderStars(review.rating, 'small')}
                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                      {new Date(review.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>

                <h5 style={{ fontWeight: '600', color: '#1a4158', marginBottom: '8px' }}>{review.title}</h5>
                <p style={{ color: '#636e72', fontSize: '14px', lineHeight: '1.6', marginBottom: '12px' }}>{review.comment}</p>

                {/* Pros & Cons */}
                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '12px' }}>
                    {review.pros.length > 0 && (
                      <div>
                        <strong style={{ color: '#059669', fontSize: '13px' }}>Pros:</strong>
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', color: '#636e72', fontSize: '13px' }}>
                          {review.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div>
                        <strong style={{ color: '#dc2626', fontSize: '13px' }}>Contras:</strong>
                        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', color: '#636e72', fontSize: '13px' }}>
                          {review.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showReviewForm && (
        <ReviewForm
          property={property}
          onClose={() => setShowReviewForm(false)}
          onSuccess={() => setShowReviewForm(false)}
        />
      )}
    </div>
  )
}
