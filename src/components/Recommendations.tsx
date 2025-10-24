'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import { useRecommendations } from '@/hooks/useRecommendations'
import PropertyCard from './PropertyCard'
import styles from './Recommendations.module.css'

interface RecommendationsProps {
  properties: Property[]
  title?: string
  showReasons?: boolean
  maxItems?: number
}

export default function Recommendations({ 
  properties, 
  title = "Recomendaciones para ti",
  showReasons = false,
  maxItems = 6
}: RecommendationsProps) {
  const { recommendations, trackPropertyView } = useRecommendations(properties)
  const [showAll, setShowAll] = useState(false)

  const displayedRecommendations = showAll 
    ? recommendations.slice(0, maxItems)
    : recommendations.slice(0, 3)

  const handlePropertyClick = (propertyId: string) => {
    trackPropertyView(propertyId)
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className={styles.recommendationsContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          {title}
          <span className={styles.badge}>
            {recommendations.length}
          </span>
        </h2>
        {recommendations.length > 3 && (
          <button 
            className={styles.toggleBtn}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Ver menos' : `Ver todas (${recommendations.length})`}
          </button>
        )}
      </div>

      <div className={styles.recommendationsGrid}>
        {displayedRecommendations.map(({ property, score, reasons }) => (
          <div 
            key={property.id} 
            className={styles.recommendationItem}
            onClick={() => handlePropertyClick(property.id)}
          >
            <div className={styles.scoreBadge}>
              {Math.round(score)}% match
            </div>
            
            <PropertyCard property={property} />
            
            {showReasons && reasons.length > 0 && (
              <div className={styles.reasons}>
                <h4>¿Por qué te recomendamos esta propiedad?</h4>
                <ul>
                  {reasons.slice(0, 3).map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {!showAll && recommendations.length > 3 && (
        <div className={styles.loadMore}>
          <button 
            className={styles.loadMoreBtn}
            onClick={() => setShowAll(true)}
          >
            Ver más recomendaciones
          </button>
        </div>
      )}
    </div>
  )
}
