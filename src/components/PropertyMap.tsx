'use client'

import { useState, useEffect, useRef } from 'react'
import GoogleMaps from './GoogleMaps'
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

// Coordenadas aproximadas de Cordoba y alrededores
const cordobaCoordinates = {
  lat: -31.4201,
  lng: -64.1888
}

// Coordenadas aproximadas para diferentes zonas de Cordoba
const zoneCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Villa Allende': { lat: -31.3000, lng: -64.3000 },
  'Nueva Cordoba': { lat: -31.4200, lng: -64.1900 },
  'Carlos Paz': { lat: -31.4240, lng: -64.4978 },
  'Centro': { lat: -31.4201, lng: -64.1888 },
  'Barrio Norte': { lat: -31.4000, lng: -64.1800 },
  'Barrio Jardin': { lat: -31.4100, lng: -64.2000 },
  'Barrio Guemes': { lat: -31.4300, lng: -64.2000 },
  'Torre Empresarial': { lat: -31.4150, lng: -64.1850 }
}

const inlineStyles = {
  mapSection: {
    padding: '4rem 0',
  } as React.CSSProperties,
  mapContainer: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  } as React.CSSProperties,
  mapFilters: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f8f9fa',
  } as React.CSSProperties,
  filterGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    minWidth: '180px',
  } as React.CSSProperties,
  filterSelect: {
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontSize: '0.9rem',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none',
  } as React.CSSProperties,
  mapWrapper: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: 0,
  } as React.CSSProperties,
  propertyList: {
    borderLeft: '1px solid #e5e7eb',
    padding: '1rem',
    overflowY: 'auto' as const,
    backgroundColor: '#f8f9fa',
    maxHeight: '600px',
  } as React.CSSProperties,
  propertyCards: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    marginTop: '1rem',
  } as React.CSSProperties,
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  propertyCardSelected: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid #2c5f7d',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,
  propertyImage: {
    position: 'relative' as const,
    height: '100px',
    backgroundColor: '#f8f9fa',
  } as React.CSSProperties,
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  } as React.CSSProperties,
  propertyTypeIcon: {
    fontSize: '2rem',
  } as React.CSSProperties,
  propertyType: {
    position: 'absolute' as const,
    top: '0.5rem',
    left: '0.5rem',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
  } as React.CSSProperties,
  propertyInfo: {
    padding: '0.75rem',
  } as React.CSSProperties,
  propertyTitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#1a4158',
    margin: '0 0 0.25rem 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  propertyLocation: {
    fontSize: '0.8rem',
    color: '#636e72',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,
  propertyPrice: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#2c5f7d',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,
  propertyDetails: {
    display: 'flex',
    gap: '0.75rem',
    fontSize: '0.75rem',
    color: '#636e72',
  } as React.CSSProperties,
  propertyModal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  } as React.CSSProperties,
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto' as const,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  } as React.CSSProperties,
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
  } as React.CSSProperties,
  closeModal: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#636e72',
    padding: '0.25rem',
  } as React.CSSProperties,
  modalBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    padding: '1.5rem',
  } as React.CSSProperties,
  modalImage: {
    height: '200px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    overflow: 'hidden',
  } as React.CSSProperties,
  modalInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  } as React.CSSProperties,
  modalPrice: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2c5f7d',
  } as React.CSSProperties,
  modalDetails: {
    fontSize: '0.9rem',
    color: '#1a4158',
  } as React.CSSProperties,
  modalDescription: {
    fontSize: '0.9rem',
    color: '#636e72',
    lineHeight: 1.6,
    margin: 0,
  } as React.CSSProperties,
  modalActions: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  } as React.CSSProperties,
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

      // Agregar pequena variacion para evitar superposicion
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
    <section className="section" style={inlineStyles.mapSection} id="mapa">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Ubicacion de Propiedades</h2>
          <p className="section-subtitle">
            Explora nuestras propiedades en el mapa interactivo de Cordoba
          </p>
        </div>

        <div style={inlineStyles.mapContainer}>
          <div style={inlineStyles.mapFilters}>
            <div style={inlineStyles.filterGroup}>
              <label htmlFor="typeFilter" style={{ fontSize: '0.85rem', color: '#1a4158', fontWeight: 500 }}>Tipo de Propiedad</label>
              <select
                id="typeFilter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={inlineStyles.filterSelect}
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

            <div style={inlineStyles.filterGroup}>
              <label htmlFor="operationFilter" style={{ fontSize: '0.85rem', color: '#1a4158', fontWeight: 500 }}>Operacion</label>
              <select
                id="operationFilter"
                value={filterOperation}
                onChange={(e) => setFilterOperation(e.target.value)}
                style={inlineStyles.filterSelect}
              >
                <option value="all">Todas las operaciones</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
          </div>

          <div style={{ ...inlineStyles.mapWrapper, height }}>
            <GoogleMaps
              properties={filteredMarkers.map(marker => marker.property)}
              selectedProperty={selectedProperty}
              onPropertySelect={setSelectedProperty}
              height={height}
            />

            <div style={inlineStyles.propertyList}>
              <h4 style={{ margin: 0, color: '#1a4158', fontWeight: 600 }}>Propiedades ({filteredMarkers.length})</h4>
              <div style={inlineStyles.propertyCards}>
                {filteredMarkers.map((marker) => (
                  <div
                    key={marker.id}
                    style={selectedProperty?.id === marker.property.id ? inlineStyles.propertyCardSelected : inlineStyles.propertyCard}
                    onClick={() => setSelectedProperty(marker.property)}
                  >
                    <div style={inlineStyles.propertyImage}>
                      <div style={inlineStyles.placeholderImage}>
                        <span style={inlineStyles.propertyTypeIcon}>
                          {getPropertyIcon(marker.property)}
                        </span>
                      </div>
                      <div style={inlineStyles.propertyType}>
                        {getPropertyIcon(marker.property)}
                      </div>
                    </div>

                    <div style={inlineStyles.propertyInfo}>
                      <h5 style={inlineStyles.propertyTitle}>{marker.property.title}</h5>
                      <p style={inlineStyles.propertyLocation}>{marker.property.location}</p>
                      <p style={inlineStyles.propertyPrice}>
                        {formatPrice(marker.property.price)}
                        {marker.property.operation === 'alquiler' && '/mes'}
                      </p>
                      <div style={inlineStyles.propertyDetails}>
                        {marker.property.bedrooms && (
                          <span>🛏️ {marker.property.bedrooms}</span>
                        )}
                        {marker.property.bathrooms && (
                          <span>🚿 {marker.property.bathrooms}</span>
                        )}
                        <span>📐 {marker.property.area}m2</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {selectedProperty && (
          <div style={inlineStyles.propertyModal}>
            <div style={inlineStyles.modalContent}>
              <div style={inlineStyles.modalHeader}>
                <h3 style={{ margin: 0, color: '#1a4158' }}>{selectedProperty.title}</h3>
                <button
                  style={inlineStyles.closeModal}
                  onClick={() => setSelectedProperty(null)}
                >
                  ✕
                </button>
              </div>

              <div style={inlineStyles.modalBody}>
                <div style={inlineStyles.modalImage}>
                  <div style={inlineStyles.placeholderImage}>
                    <span style={inlineStyles.propertyTypeIcon}>
                      {getPropertyIcon(selectedProperty)}
                    </span>
                  </div>
                </div>

                <div style={inlineStyles.modalInfo}>
                  <div style={inlineStyles.modalPrice}>
                    {formatPrice(selectedProperty.price)}
                    {selectedProperty.operation === 'alquiler' && '/mes'}
                  </div>

                  <div style={inlineStyles.modalDetails}>
                    <p style={{ margin: '0.25rem 0' }}><strong>Ubicacion:</strong> {selectedProperty.location}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Tipo:</strong> {selectedProperty.type}</p>
                    <p style={{ margin: '0.25rem 0' }}><strong>Area:</strong> {selectedProperty.area}m2</p>
                    {selectedProperty.bedrooms && (
                      <p style={{ margin: '0.25rem 0' }}><strong>Dormitorios:</strong> {selectedProperty.bedrooms}</p>
                    )}
                    {selectedProperty.bathrooms && (
                      <p style={{ margin: '0.25rem 0' }}><strong>Banos:</strong> {selectedProperty.bathrooms}</p>
                    )}
                  </div>

                  <p style={inlineStyles.modalDescription}>{selectedProperty.description}</p>

                  <div style={inlineStyles.modalActions}>
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
