'use client'

import { Property } from '@/data/properties'
import styles from './MapPlaceholder.module.css'

interface MapPlaceholderProps {
  properties: Property[]
  selectedProperty?: Property | null
  onPropertySelect?: (property: Property) => void
  height?: string
}

export default function MapPlaceholder({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  height = '500px' 
}: MapPlaceholderProps) {
  // Coordenadas aproximadas para diferentes zonas
  const zoneCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'Villa Allende': { lat: -31.3000, lng: -64.3000 },
    'Nueva Córdoba': { lat: -31.4200, lng: -64.1900 },
    'Carlos Paz': { lat: -31.4240, lng: -64.4978 },
    'Centro': { lat: -31.4201, lng: -64.1888 },
    'Barrio Norte': { lat: -31.4000, lng: -64.1800 },
    'Barrio Jardín': { lat: -31.4100, lng: -64.2000 },
    'Barrio Güemes': { lat: -31.4300, lng: -64.2000 },
    'Torre Empresarial': { lat: -31.4150, lng: -64.1850 }
  }

  const getPropertyIcon = (property: Property) => {
    const icons = {
      casa: '🏠',
      departamento: '🏢',
      terreno: '🏞️',
      local: '🏪',
      oficina: '🏢'
    }
    return icons[property.type as keyof typeof icons] || '🏠'
  }

  const getPropertyColor = (property: Property) => {
    if (property.featured) return '#e8b86d'
    if (property.operation === 'venta') return '#2c5f7d'
    return '#28a745'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={styles.mapContainer} style={{ height }}>
      <div className={styles.mapHeader}>
        <h3>📍 Ubicación de Propiedades</h3>
        <p>Mapa interactivo de propiedades en Córdoba</p>
      </div>
      
      <div className={styles.mapContent}>
        <div className={styles.mapArea}>
          <div className={styles.mapBackground}>
            <div className={styles.mapTitle}>Córdoba, Argentina</div>
            <div className={styles.mapSubtitle}>Zona de propiedades</div>
          </div>
          
          <div className={styles.propertiesList}>
            {properties.slice(0, 6).map((property, index) => {
              const location = property.location.split(',')[0].trim()
              const coords = zoneCoordinates[location] || zoneCoordinates['Centro']
              
              return (
                <div 
                  key={property.id}
                  className={`${styles.propertyMarker} ${selectedProperty?.id === property.id ? styles.selected : ''}`}
                  style={{
                    left: `${20 + (index * 12)}%`,
                    top: `${30 + (index % 3) * 20}%`
                  }}
                  onClick={() => onPropertySelect?.(property)}
                >
                  <div 
                    className={styles.markerIcon}
                    style={{ backgroundColor: getPropertyColor(property) }}
                  >
                    {getPropertyIcon(property)}
                  </div>
                  <div className={styles.markerTooltip}>
                    <div className={styles.tooltipTitle}>{property.title}</div>
                    <div className={styles.tooltipPrice}>
                      {formatPrice(property.price)}{property.operation === 'alquiler' ? '/mes' : ''}
                    </div>
                    <div className={styles.tooltipLocation}>📍 {property.location}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className={styles.mapLegend}>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#2c5f7d' }}></div>
            <span>En Venta</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#28a745' }}></div>
            <span>En Alquiler</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#e8b86d' }}></div>
            <span>Destacadas</span>
          </div>
        </div>
      </div>
      
      <div className={styles.mapFooter}>
        <p>💡 Para ver el mapa interactivo completo, configura la API de Google Maps</p>
        <button 
          className={styles.setupButton}
          onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
        >
          Configurar Google Maps API
        </button>
      </div>
    </div>
  )
}
