'use client'

import { useState, useEffect, useRef } from 'react'
import GoogleMaps from './GoogleMaps'
import styles from './PropertyMap.module.css'
import { Property } from '@/data/properties'

interface PropertyMapProps {
  properties?: Property[]
  height?: string
}

interface MapMarker {
  id: string
  property: Property
  position: { lat: number; lng: number }
}

// Coordenadas aproximadas de Córdoba y alrededores
const cordobaCoordinates = {
  lat: -31.4201,
  lng: -64.1888
}

// Coordenadas aproximadas para diferentes zonas de Córdoba
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

export default function PropertyMap({ properties = [], height = '600px' }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [filterOperation, setFilterOperation] = useState<string>('all')
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generar marcadores para las propiedades
    const markers: MapMarker[] = properties.map((property, index) => {
      const location = property.location.split(',')[0].trim()
      const coords = zoneCoordinates[location] || cordobaCoordinates
      
      // Agregar pequeña variación para evitar superposición
      const lat = coords.lat + (Math.random() - 0.5) * 0.01
      const lng = coords.lng + (Math.random() - 0.5) * 0.01

      return {
        id: property.id,
        property,
        position: { lat, lng }
      }
    })
    
    setMapMarkers(markers)
  }, [properties])

  const filteredMarkers = mapMarkers.filter(marker => {
    const property = marker.property
    const typeMatch = filterType === 'all' || property.type === filterType
    const operationMatch = filterOperation === 'all' || property.operation === filterOperation
    return typeMatch && operationMatch
  })

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${price.toLocaleString()}`
  }

  const getPropertyIcon = (property: Property) => {
    const icons = {
      casa: '🏠',
      departamento: '🏢',
      terreno: '🏞️',
      local: '🏪',
      oficina: '🏢',
      cochera: '🅿️'
    }
    return icons[property.type] || '🏠'
  }

  const getPropertyColor = (property: Property) => {
    const colors = {
      venta: '#2c5f7d',
      alquiler: '#e8b86d'
    }
    return colors[property.operation] || '#2c5f7d'
  }

  return (
    <section className={`section ${styles.mapSection}`} id="mapa">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Ubicación de Propiedades</h2>
          <p className="section-subtitle">
            Explora nuestras propiedades en el mapa interactivo de Córdoba
          </p>
        </div>

        <div className={styles.mapContainer}>
          <div className={styles.mapFilters}>
            <div className={styles.filterGroup}>
              <label htmlFor="typeFilter">Tipo de Propiedad</label>
              <select
                id="typeFilter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todos los tipos</option>
                <option value="casa">Casas</option>
                <option value="departamento">Departamentos</option>
                <option value="terreno">Terrenos</option>
                <option value="local">Locales</option>
                <option value="oficina">Oficinas</option>
                <option value="cochera">Cocheras</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="operationFilter">Operación</label>
              <select
                id="operationFilter"
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todas las operaciones</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
          </div>

          <div className={styles.mapWrapper} style={{ height }}>
            <GoogleMaps
              properties={filteredMarkers.map(marker => marker.property)}
              selectedProperty={selectedProperty}
              onPropertySelect={setSelectedProperty}
              height={height}
            />

            <div className={styles.propertyList}>
              <h4>Propiedades ({filteredMarkers.length})</h4>
              <div className={styles.propertyCards}>
                {filteredMarkers.map((marker) => (
                  <div
                    key={marker.id}
                    className={`${styles.propertyCard} ${
                      selectedProperty?.id === marker.property.id ? styles.propertyCardSelected : ''
                    }`}
                    onClick={() => setSelectedProperty(marker.property)}
                  >
                    <div className={styles.propertyImage}>
                      <div className={styles.placeholderImage}>
                        <span className={styles.propertyTypeIcon}>
                          {getPropertyIcon(marker.property)}
                        </span>
                      </div>
                      <div className={styles.propertyType}>
                        {getPropertyIcon(marker.property)}
                      </div>
                    </div>
                    
                    <div className={styles.propertyInfo}>
                      <h5>{marker.property.title}</h5>
                      <p className={styles.propertyLocation}>{marker.property.location}</p>
                      <p className={styles.propertyPrice}>
                        {formatPrice(marker.property.price)}
                        {marker.property.operation === 'alquiler' && '/mes'}
                      </p>
                      <div className={styles.propertyDetails}>
                        {marker.property.bedrooms && (
                          <span>🛏️ {marker.property.bedrooms}</span>
                        )}
                        {marker.property.bathrooms && (
                          <span>🚿 {marker.property.bathrooms}</span>
                        )}
                        <span>📐 {marker.property.area}m²</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedProperty && (
          <div className={styles.propertyModal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3>{selectedProperty.title}</h3>
                <button
                  className={styles.closeModal}
                  onClick={() => setSelectedProperty(null)}
                >
                  ✕
                </button>
              </div>
              
              <div className={styles.modalBody}>
                <div className={styles.modalImage}>
                  <div className={styles.placeholderImage}>
                    <span className={styles.propertyTypeIcon}>
                      {getPropertyIcon(selectedProperty)}
                    </span>
                  </div>
                </div>
                
                <div className={styles.modalInfo}>
                  <div className={styles.modalPrice}>
                    {formatPrice(selectedProperty.price)}
                    {selectedProperty.operation === 'alquiler' && '/mes'}
                  </div>
                  
                  <div className={styles.modalDetails}>
                    <p><strong>Ubicación:</strong> {selectedProperty.location}</p>
                    <p><strong>Tipo:</strong> {selectedProperty.type}</p>
                    <p><strong>Área:</strong> {selectedProperty.area}m²</p>
                    {selectedProperty.bedrooms && (
                      <p><strong>Dormitorios:</strong> {selectedProperty.bedrooms}</p>
                    )}
                    {selectedProperty.bathrooms && (
                      <p><strong>Baños:</strong> {selectedProperty.bathrooms}</p>
                    )}
                  </div>
                  
                  <p className={styles.modalDescription}>{selectedProperty.description}</p>
                  
                  <div className={styles.modalActions}>
                    <a href="#contacto" className="btn btn-primary">
                      Consultar
                    </a>
                    <a href={`/propiedades#${selectedProperty.id}`} className="btn btn-secondary">
                      Ver Detalles
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
