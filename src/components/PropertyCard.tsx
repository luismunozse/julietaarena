'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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

function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const analytics = useAnalytics()
  const { elementRef, isVisible } = useFadeInUp({ trigger: 'onScroll' })

  // Track property view
  useEffect(() => {
    analytics.trackPropertyView(property.id, property.title)
  }, [property.id, property.title, analytics])

  // Memoizar formateo de precio
  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price)
  }, [property.price, property.currency])

  const formattedExpenses = useMemo(() => {
    if (!property.expenses) return null
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.expenses)
  }, [property.expenses, property.currency])

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

  // Memoizar características principales
  const mainFeatures = useMemo(() => {
    return property.features.slice(0, 4)
  }, [property.features])

  // Callbacks memoizados para evitar recreaciones
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

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Solo navegar si no se clickeó un botón o enlace
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return
    }
    router.push(`/propiedades/${property.id}`)
    analytics.trackClick('property_card', 'property_list', { propertyId: property.id })
  }, [property.id, router, analytics])

  const handleAppointmentClick = useCallback(() => {
    analytics.trackClick('appointment_button', 'property_card', { propertyId: property.id })
    setShowAppointmentBooking(true)
  }, [property.id, analytics])

  const handleReviewsClick = useCallback(() => {
    analytics.trackClick('reviews_button', 'property_card', { propertyId: property.id })
    setShowReviews(true)
  }, [property.id, analytics])

  const handleImageIndexChange = useCallback((index: number) => {
    setCurrentImageIndex(index)
  }, [])

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`${styles.propertyCard} ${property.featured ? styles.featured : ''} hover-lift ${styles.clickable}`}
      onClick={handleCardClick}
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
        <Image 
          src={property.images[currentImageIndex]}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
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
                  onClick={() => handleImageIndexChange(index)}
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
          <span className={styles.propertyType}>{typeLabel}</span>
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
            {mainFeatures.map((feature, index) => (
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
          <span className={styles.price}>{formattedPrice}</span>
          {formattedExpenses && (
            <span className={styles.expenses}>
              + {formattedExpenses} expensas
            </span>
          )}
        </div>

        <div className={styles.propertyActions}>
          <button 
            className={`${styles.appointmentBtn} button-press`}
            onClick={handleAppointmentClick}
          >
            📅 Agendar Visita
          </button>
          <button 
            className={`${styles.reviewsBtn} button-press`}
            onClick={handleReviewsClick}
          >
            ⭐ Reseñas
          </button>
          <button 
            className={`${styles.contactBtn} button-press ripple`}
            onClick={() => analytics.trackContact('phone', `property_${property.id}`)}
          >
            📞 Consultar
          </button>
          <button 
            className={`${styles.whatsappBtn} button-press ripple`}
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

// Memoizar componente para evitar re-renders innecesarios
export default memo(PropertyCard, (prevProps, nextProps) => {
  // Comparación personalizada: solo re-renderizar si cambian propiedades relevantes
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.title === nextProps.property.title &&
    prevProps.property.price === nextProps.property.price &&
    prevProps.property.status === nextProps.property.status &&
    prevProps.property.featured === nextProps.property.featured &&
    JSON.stringify(prevProps.property.images) === JSON.stringify(nextProps.property.images)
  )
})
