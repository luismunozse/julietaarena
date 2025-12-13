'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import { useSwipe } from '@/hooks/useSwipe'
import styles from './PropertyCardList.module.css'

interface PropertyCardListProps {
  property: Property
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

  // Swipe gestures para navegación de imágenes
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
    <div className={`${styles.propertyCardList} hover-lift`}>
      {/* Imagen con swipe */}
      <div className={styles.imageContainer} {...swipeHandlers}>
        <Image 
          src={property.images[currentImageIndex]} 
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className={styles.propertyImage}
        />
        <div className={styles.favoriteButton}>
          <FavoriteButton propertyId={property.id} size="small" />
        </div>
        {property.featured && (
          <div className={styles.featuredBadge}>⭐ Destacada</div>
        )}
      </div>

      {/* Contenido */}
      <div className={styles.propertyContent}>
        <div className={styles.propertyHeader}>
          <div>
            <h3 className={styles.propertyTitle}>{property.title}</h3>
            <p className={styles.propertyLocation}>📍 {property.location}</p>
          </div>
          <div className={styles.priceSection}>
            <span className={styles.price}>{formattedPrice}</span>
            <span className={styles.priceLabel}>
              {property.operation === 'venta' ? 'Venta' : 'Alquiler'}
            </span>
          </div>
        </div>

        <p className={styles.propertyDescription}>{property.description}</p>

        <div className={styles.propertyFeatures}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>📐</span>
            <span className={styles.featureText}>{property.area} m²</span>
          </div>
          {property.bedrooms && (
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🛏️</span>
              <span className={styles.featureText}>{property.bedrooms} hab.</span>
            </div>
          )}
          {property.bathrooms && (
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🚿</span>
              <span className={styles.featureText}>{property.bathrooms} baños</span>
            </div>
          )}
          {property.parking && (
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🚗</span>
              <span className={styles.featureText}>{property.parking} cochera</span>
            </div>
          )}
        </div>

        <div className={styles.propertyActions}>
          <button className={styles.actionBtn}>
            📧 Contactar
          </button>
          <button className={styles.actionBtn}>
            📱 WhatsApp
          </button>
          <button className={styles.actionBtn}>
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
