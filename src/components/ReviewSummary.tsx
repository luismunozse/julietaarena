'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import { useReviews } from '@/hooks/useReviews'
import ReviewForm from './ReviewForm'
import styles from './ReviewSummary.module.css'

interface ReviewSummaryProps {
  property: Property
}

export default function ReviewSummary({ property }: ReviewSummaryProps) {
  const { getReviewSummary, canUserReview } = useReviews()
  const [showReviewForm, setShowReviewForm] = useState(false)
  
  const summary = getReviewSummary(property.id)
  const canReview = canUserReview(property.id)

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClass = styles[`star${size.charAt(0).toUpperCase() + size.slice(1)}`]
    
    return (
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${sizeClass} ${star <= rating ? styles.filled : styles.empty}`}
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
      <div className={styles.noReviews}>
        <h3>Sin reseñas aún</h3>
        <p>Se el primero en reseñar esta propiedad</p>
        {canReview && (
          <button 
            className={styles.writeReviewBtn}
            onClick={() => setShowReviewForm(true)}
          >
            Escribir Reseña
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.reviewSummary}>
      <div className={styles.header}>
        <div className={styles.ratingOverview}>
          <div className={styles.averageRating}>
            <span className={styles.ratingNumber}>{summary.averageRating}</span>
            {renderStars(Math.round(summary.averageRating), 'large')}
            <span className={styles.totalReviews}>
              ({summary.totalReviews} reseña{summary.totalReviews !== 1 ? 's' : ''})
            </span>
          </div>
        </div>

        {canReview && (
          <button 
            className={styles.writeReviewBtn}
            onClick={() => setShowReviewForm(true)}
          >
            Escribir Reseña
          </button>
        )}
      </div>

      <div className={styles.ratingBreakdown}>
        <h4>Distribución de calificaciones</h4>
        <div className={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const percentage = getRatingPercentage(rating)
            return (
              <div key={rating} className={styles.ratingBar}>
                <span className={styles.ratingLabel}>
                  {rating} ⭐
                </span>
                <div className={styles.barContainer}>
                  <div 
                    className={styles.bar}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className={styles.percentage}>
                  {percentage}%
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {summary.recentReviews.length > 0 && (
        <div className={styles.recentReviews}>
          <h4>Reseñas recientes</h4>
          <div className={styles.reviewsList}>
            {summary.recentReviews.map((review) => (
              <div key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewHeader}>
                  <div className={styles.reviewerInfo}>
                    <Image 
                      src={review.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=2c5f7d&color=fff`}
                      alt={review.userName}
                      width={40}
                      height={40}
                      className={styles.reviewerAvatar}
                    />
                    <div>
                      <span className={styles.reviewerName}>{review.userName}</span>
                      {review.verified && (
                        <span className={styles.verifiedBadge}>✓ Verificado</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.reviewRating}>
                    {renderStars(review.rating, 'small')}
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                </div>
                
                <h5 className={styles.reviewTitle}>{review.title}</h5>
                <p className={styles.reviewComment}>{review.comment}</p>
                
                {(review.pros.length > 0 || review.cons.length > 0) && (
                  <div className={styles.prosCons}>
                    {review.pros.length > 0 && (
                      <div className={styles.pros}>
                        <strong>Pros:</strong>
                        <ul>
                          {review.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons.length > 0 && (
                      <div className={styles.cons}>
                        <strong>Contras:</strong>
                        <ul>
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
