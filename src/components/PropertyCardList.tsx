'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import { useSwipe } from '@/hooks/useSwipe'

interface PropertyCardListProps {
  property: Property
}

const inlineStyles = {
  propertyCardList: {
    display: 'flex',
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  imageContainer: {
    position: 'relative' as const,
    width: '300px',
    minHeight: '200px',
    flexShrink: 0,
  } as React.CSSProperties,
  propertyImage: {
    objectFit: 'cover' as const,
  } as React.CSSProperties,
  favoriteButton: {
    position: 'absolute' as const,
    top: '0.75rem',
    right: '0.75rem',
    zIndex: 10,
  } as React.CSSProperties,
  featuredBadge: {
    position: 'absolute' as const,
    top: '0.75rem',
    left: '0.75rem',
    backgroundColor: '#e8b86d',
    color: '#1a4158',
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: 600,
  } as React.CSSProperties,
  propertyContent: {
    flex: 1,
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  } as React.CSSProperties,
  propertyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  } as React.CSSProperties,
  propertyTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1a4158',
    margin: 0,
  } as React.CSSProperties,
  propertyLocation: {
    fontSize: '0.9rem',
    color: '#636e72',
    margin: '0.25rem 0 0 0',
  } as React.CSSProperties,
  priceSection: {
    textAlign: 'right' as const,
    flexShrink: 0,
  } as React.CSSProperties,
  price: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#2c5f7d',
    display: 'block',
  } as React.CSSProperties,
  priceLabel: {
    fontSize: '0.8rem',
    color: '#636e72',
    display: 'block',
  } as React.CSSProperties,
  propertyDescription: {
    fontSize: '0.9rem',
    color: '#636e72',
    lineHeight: 1.6,
    margin: 0,
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  } as React.CSSProperties,
  propertyFeatures: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  } as React.CSSProperties,
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#f8f9fa',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  featureIcon: {
    fontSize: '1rem',
  } as React.CSSProperties,
  featureText: {
    fontSize: '0.85rem',
    color: '#1a4158',
    fontWeight: 500,
  } as React.CSSProperties,
  propertyActions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: 'auto',
    paddingTop: '0.75rem',
    borderTop: '1px solid #e5e7eb',
  } as React.CSSProperties,
  actionBtn: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#fff',
    color: '#1a4158',
    fontSize: '0.85rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
}

function PropertyCardList({ property }: PropertyCardListProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }, [property.images.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }, [property.images.length])

  // Swipe gestures para navegacion de imagenes
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextImage,
    onSwipeRight: prevImage,
    minSwipeDistance: 50
  })

  // Memoizar precio formateado
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price)
  }, [property.price, property.currency])

  // Memoizar label de tipo
  const typeLabel = useMemo(() => {
    const types: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'terreno': 'Terreno',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
      'cochera': 'Cochera'
    }
    return types[property.type] || property.type
  }, [property.type])

  return (
    <div style={inlineStyles.propertyCardList} className="hover-lift">
      {/* Imagen con swipe */}
      <div style={inlineStyles.imageContainer} {...swipeHandlers}>
        <Image
          src={property.images[currentImageIndex]}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          style={inlineStyles.propertyImage}
        />
        <div style={inlineStyles.favoriteButton}>
          <FavoriteButton propertyId={property.id} size="small" />
        </div>
        {property.featured && (
          <div style={inlineStyles.featuredBadge}>Destacada</div>
        )}
      </div>

      {/* Contenido */}
      <div style={inlineStyles.propertyContent}>
        <div style={inlineStyles.propertyHeader}>
          <div>
            <h3 style={inlineStyles.propertyTitle}>{property.title}</h3>
            <p style={inlineStyles.propertyLocation}>📍 {property.location}</p>
          </div>
          <div style={inlineStyles.priceSection}>
            <span style={inlineStyles.price}>{formattedPrice}</span>
            <span style={inlineStyles.priceLabel}>
              {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
            </span>
          </div>
        </div>

        <p style={inlineStyles.propertyDescription}>{property.description}</p>

        <div style={inlineStyles.propertyFeatures}>
          <div style={inlineStyles.feature}>
            <span style={inlineStyles.featureIcon}>📐</span>
            <span style={inlineStyles.featureText}>{property.area} m2</span>
          </div>
          {property.bedrooms && (
            <div style={inlineStyles.feature}>
              <span style={inlineStyles.featureIcon}>🛏️</span>
              <span style={inlineStyles.featureText}>{property.bedrooms} hab.</span>
            </div>
          )}
          {property.bathrooms && (
            <div style={inlineStyles.feature}>
              <span style={inlineStyles.featureIcon}>🚿</span>
              <span style={inlineStyles.featureText}>{property.bathrooms} banos</span>
            </div>
          )}
          {property.parking && (
            <div style={inlineStyles.feature}>
              <span style={inlineStyles.featureIcon}>🚗</span>
              <span style={inlineStyles.featureText}>{property.parking} cochera</span>
            </div>
          )}
        </div>

        <div style={inlineStyles.propertyActions}>
          <button style={inlineStyles.actionBtn}>
            📧 Contactar
          </button>
          <button style={{...inlineStyles.actionBtn, display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#25D366', color: '#fff', border: 'none'}}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
          <button style={inlineStyles.actionBtn}>
            ℹ️ Ver detalles
          </button>
        </div>
      </div>
    </div>
  )
}

// Memoizar componente para evitar re-renders innecesarios
export default memo(PropertyCardList, (prevProps, nextProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.price === nextProps.property.price &&
    prevProps.property.status === nextProps.property.status &&
    JSON.stringify(prevProps.property.images) === JSON.stringify(nextProps.property.images)
  )
})
