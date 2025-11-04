'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import { useRouter } from 'next/navigation'
import FavoriteButton from './FavoriteButton'
import PropertyImageGallery from './PropertyImageGallery'
import PropertySidebar from './PropertySidebar'
import PropertyMetrics from './PropertyMetrics'
import PropertyFeatures from './PropertyFeatures'
import PropertyLocationMap from './PropertyLocationMap'
import { useAnalytics } from '@/hooks/useAnalytics'
import styles from './PropertyDetail.module.css'

interface PropertyDetailProps {
  property: Property
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [activeView, setActiveView] = useState<'fotos' | 'mapa'>('fotos')
  const router = useRouter()
  const analytics = useAnalytics()

  const handleWhatsApp = () => {
    const message = `Hola, estoy interesado/a en ${property.title}`
    const whatsappUrl = `https://wa.me/+543519999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    analytics.trackContact('whatsapp', `property_detail_${property.id}`)
  }

  const handlePhone = () => {
    window.location.href = 'tel:+543519999999'
    analytics.trackContact('phone', `property_detail_${property.id}`)
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getOperationLabel = (): string => {
    return property.operation === 'venta' ? 'Venta' : 'Alquiler'
  }

  const getTypeLabel = (): string => {
    const labels: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'terreno': 'Terreno',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
    }
    return labels[property.type] || property.type
  }

  return (
    <div className={styles.propertyDetail}>
      {/* Header con título y acciones */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerInfo}>
            <div className={styles.breadcrumb}>
              <button 
                className={styles.breadcrumbLink}
                onClick={() => router.push('/propiedades')}
              >
                Propiedades
              </button>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>{getTypeLabel()}</span>
            </div>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.subtitle}>
              <span className={styles.operation}>{getOperationLabel()}</span>
              <span className={styles.separator}>•</span>
              <span className={styles.location}>📍 {property.location}</span>
            </div>
            <div className={styles.price}>{formatPrice(property.price)}
              {property.operation === 'alquiler' && <span className={styles.pricePeriod}>/mes</span>}
            </div>
          </div>
          <div className={styles.headerActions}>
            <FavoriteButton propertyId={property.id} size="large" />
            <button 
              className={`${styles.shareBtn} button-press`}
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    text: property.description,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              aria-label="Compartir propiedad"
            >
              📤 Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className={styles.mainContent}>
        <div className={styles.contentLeft}>
          {/* Galería de imágenes */}
          <div className={styles.gallerySection}>
            <div className={styles.viewTabs}>
              <button
                className={`${styles.viewTab} ${activeView === 'fotos' ? styles.active : ''}`}
                onClick={() => setActiveView('fotos')}
              >
                📸 Fotos {property.images.length > 0 && `(${property.images.length})`}
              </button>
              {property.coordinates && (
                <button
                  className={`${styles.viewTab} ${activeView === 'mapa' ? styles.active : ''}`}
                  onClick={() => setActiveView('mapa')}
                >
                  🗺️ Ubicación
                </button>
              )}
            </div>

            {activeView === 'fotos' ? (
              <PropertyImageGallery images={property.images} title={property.title} />
            ) : (
              property.coordinates && (
                <PropertyLocationMap 
                  latitude={property.coordinates.lat}
                  longitude={property.coordinates.lng}
                  propertyTitle={property.title}
                />
              )
            )}
          </div>

          {/* Métricas de la propiedad */}
          <PropertyMetrics property={property} />

          {/* Descripción */}
          <div className={styles.descriptionSection}>
            <h2 className={styles.sectionTitle}>Descripción</h2>
            <p className={styles.descriptionText}>{property.description}</p>
          </div>

          {/* Características */}
          <PropertyFeatures features={property.features} />

          {/* Información adicional si existe */}
          {property.yearBuilt && (
            <div className={styles.additionalInfo}>
              <h2 className={styles.sectionTitle}>Información Adicional</h2>
              <div className={styles.infoGrid}>
                {property.yearBuilt && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Construcción:</span>
                    <span className={styles.infoValue}>{new Date().getFullYear() - property.yearBuilt} años de antigüedad</span>
                  </div>
                )}
                {property.orientation && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Orientación:</span>
                    <span className={styles.infoValue}>{property.orientation}</span>
                  </div>
                )}
                {property.floor && property.totalFloors && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Piso:</span>
                    <span className={styles.infoValue}>{property.floor} de {property.totalFloors}</span>
                  </div>
                )}
                {property.expenses && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Expensas:</span>
                    <span className={styles.infoValue}>
                      ${property.expenses.toLocaleString('es-AR')}
                      {property.operation === 'alquiler' ? '/mes' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar derecho */}
        <div className={styles.sidebar}>
          <PropertySidebar property={property} />
        </div>
      </div>
    </div>
  )
}



