'use client'

import { useState, useEffect } from 'react'
import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import CompareButton from './CompareButton'
import AppointmentBooking from './AppointmentBooking'
import ReviewSummary from './ReviewSummary'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useFadeInUp } from '@/hooks/useAnimation'
import styles from './PropertyCard.module.css'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const analytics = useAnalytics()
  const { elementRef, isVisible } = useFadeInUp({ trigger: 'onScroll' })

  // Track property view
  useEffect(() => {
    analytics.trackPropertyView(property.id, property.title)
  }, [property.id, property.title, analytics])

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

  return (
    <div
      ref={elementRef as any}
      className={`${styles.propertyCard} ${property.featured ? styles.featured : ''}`}
    >
      {property.featured && (
        <div className={styles.featuredBadge}>
          <span>⭐ Destacada</span>
        </div>
      )}
      
      <div className={styles.favoriteButton}>
        <FavoriteButton propertyId={property.id} size="small" />
      </div>
      
      <div className={styles.imageContainer}>
        <img 
          src={property.images[currentImageIndex]} 
          alt={property.title}
          className={styles.propertyImage}
        />
        
        {property.images.length > 1 && (
          <>
            <button 
              className={`${styles.imageNav} ${styles.prevBtn}`}
              onClick={prevImage}
              aria-label="Imagen anterior"
            >
              &#8249;
            </button>
            <button 
              className={`${styles.imageNav} ${styles.nextBtn}`}
              onClick={nextImage}
              aria-label="Siguiente imagen"
            >
              &#8250;
            </button>
            <div className={styles.imageDots}>
              {property.images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentImageIndex ? styles.active : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className={styles.statusBadge}>
          <span className={`${styles.status} ${styles[property.status]}`}>
            {property.status === 'disponible' ? 'Disponible' : 
             property.status === 'reservado' ? 'Reservado' : 'Vendido'}
          </span>
        </div>
      </div>

      <div className={styles.propertyContent}>
        <div className={styles.propertyHeader}>
          <h3 className={styles.propertyTitle}>{property.title}</h3>
          <span className={styles.propertyType}>{getTypeLabel(property.type)}</span>
        </div>

        <p className={styles.propertyLocation}>
          📍 {property.location}
        </p>

        <div className={styles.propertyDetails}>
          {property.bedrooms && (
            <span className={styles.detail}>
              🛏️ {property.bedrooms} dorm.
            </span>
          )}
          {property.bathrooms && (
            <span className={styles.detail}>
              🚿 {property.bathrooms} baños
            </span>
          )}
          <span className={styles.detail}>
            📐 {property.area} m²
          </span>
          {property.parking && property.parking > 0 && (
            <span className={styles.detail}>
              🚗 {property.parking} cochera{property.parking > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className={styles.propertyFeatures}>
          <h4>Características principales:</h4>
          <ul>
            {property.features.slice(0, 4).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
            {property.features.length > 4 && (
              <li className={styles.moreFeatures}>
                +{property.features.length - 4} características más
              </li>
            )}
          </ul>
        </div>

        <div className={styles.propertyPrice}>
          <span className={styles.price}>{formatPrice(property.price)}</span>
          {property.expenses && (
            <span className={styles.expenses}>
              + {formatPrice(property.expenses)} expensas
            </span>
          )}
        </div>

        <div className={styles.propertyActions}>
          <button 
            className={styles.appointmentBtn}
            onClick={() => {
              analytics.trackClick('appointment_button', 'property_card', { propertyId: property.id })
              setShowAppointmentBooking(true)
            }}
          >
            📅 Agendar Visita
          </button>
          <button 
            className={styles.reviewsBtn}
            onClick={() => {
              analytics.trackClick('reviews_button', 'property_card', { propertyId: property.id })
              setShowReviews(true)
            }}
          >
            ⭐ Reseñas
          </button>
          <button 
            className={styles.contactBtn}
            onClick={() => analytics.trackContact('phone', `property_${property.id}`)}
          >
            📞 Consultar
          </button>
          <button 
            className={styles.whatsappBtn}
            onClick={() => analytics.trackContact('whatsapp', `property_${property.id}`)}
          >
            💬 WhatsApp
          </button>
        </div>

        <div className={styles.propertyComparison}>
          <CompareButton property={property} size="small" showText={true} />
        </div>
      </div>

      {showAppointmentBooking && (
        <AppointmentBooking
          property={property}
          onClose={() => setShowAppointmentBooking(false)}
          onSuccess={(appointmentId) => {
            console.log('Cita agendada:', appointmentId)
            setShowAppointmentBooking(false)
          }}
        />
      )}

      {showReviews && (
        <div className={styles.reviewsOverlay}>
          <div className={styles.reviewsModal}>
            <div className={styles.reviewsHeader}>
              <h2>Reseñas de {property.title}</h2>
              <button 
                onClick={() => setShowReviews(false)}
                className={styles.closeBtn}
              >
                ✕
              </button>
            </div>
            <ReviewSummary property={property} />
          </div>
        </div>
      )}
    </div>
  )
}
