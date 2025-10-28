'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import { useSwipe } from '@/hooks/useSwipe'
import styles from './PropertyCardList.module.css'

interface PropertyCardListProps {
  property: Property
}

export default function PropertyCardList({ property }: PropertyCardListProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }

  // Swipe gestures para navegación de imágenes
  const swipeHandlers = useSwipe({
    onSwipeLeft: nextImage,
    onSwipeRight: prevImage,
    minSwipeDistance: 50
  })

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getTypeLabel = (type: string): string => {
    const types: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'terreno': 'Terreno',
      'local': 'Local Comercial',
      'oficina': 'Oficina'
    }
    return types[type] || type
  }

  return (
    <div className={`${styles.propertyCardList} hover-lift`}>
      {/* Imagen con swipe */}
      <div className={styles.imageContainer} {...swipeHandlers}>
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.title}
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
            <span className={styles.price}>{formatPrice(property.price)}</span>
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

