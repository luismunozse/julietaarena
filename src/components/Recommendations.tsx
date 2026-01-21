'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import { useRecommendations } from '@/hooks/useRecommendations'
import PropertyCard from './PropertyCard'

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
    <div style={{ padding: '40px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a4158', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {title}
          <span
            style={{
              padding: '4px 12px',
              background: '#e8b86d',
              color: 'white',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {recommendations.length}
          </span>
        </h2>
        {recommendations.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#2c5f7d',
              border: '1px solid #2c5f7d',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showAll ? 'Ver menos' : `Ver todas (${recommendations.length})`}
          </button>
        )}
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}
      >
        {displayedRecommendations.map(({ property, score, reasons }) => (
          <div
            key={property.id}
            style={{ position: 'relative' }}
            onClick={() => handlePropertyClick(property.id)}
          >
            {/* Score Badge */}
            <div
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #e8b86d 0%, #d4a056 100%)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(232, 184, 109, 0.4)'
              }}
            >
              {Math.round(score)}% match
            </div>

            <PropertyCard property={property} />

            {showReasons && reasons.length > 0 && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: '#f8f9fa',
                  borderRadius: '12px'
                }}
              >
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1a4158', marginBottom: '8px' }}>
                  ¿Por qué te recomendamos esta propiedad?
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#636e72', fontSize: '14px' }}>
                  {reasons.slice(0, 3).map((reason, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      {!showAll && recommendations.length > 3 && (
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => setShowAll(true)}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            Ver más recomendaciones
          </button>
        </div>
      )}
    </div>
  )
}
