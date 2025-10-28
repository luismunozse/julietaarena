'use client'

import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import styles from './PropertyCardList.module.css'

interface PropertyCardListProps {
  property: Property
}

export default function PropertyCardList({ property }: PropertyCardListProps) {
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
    <div className={styles.propertyCardList}>
      {/* Imagen */}
      <div className={styles.imageContainer}>
        <img 
          src={property.images[0]} 
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

