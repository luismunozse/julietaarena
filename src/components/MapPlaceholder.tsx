'use client'

import { Property } from '@/data/properties'

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
    <div
      style={{
        height,
        background: 'white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e5e7eb',
          background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)'
        }}
      >
        <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
          📍 Ubicación de Propiedades
        </h3>
        <p style={{ color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0', fontSize: '0.9rem' }}>
          Mapa interactivo de propiedades en Córdoba
        </p>
      </div>

      {/* Map Content */}
      <div style={{ flex: 1, position: 'relative', background: '#e8f4f8' }}>
        {/* Map Area */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }}
        >
          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#2c5f7d' }}>Córdoba, Argentina</div>
          <div style={{ fontSize: '1rem', color: '#636e72' }}>Zona de propiedades</div>
        </div>

        {/* Property Markers */}
        {properties.slice(0, 6).map((property, index) => (
          <div
            key={property.id}
            onClick={() => onPropertySelect?.(property)}
            style={{
              position: 'absolute',
              left: `${20 + (index * 12)}%`,
              top: `${30 + (index % 3) * 20}%`,
              cursor: 'pointer',
              zIndex: selectedProperty?.id === property.id ? 10 : 1
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: getPropertyColor(property),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                border: selectedProperty?.id === property.id ? '3px solid white' : 'none',
                transform: selectedProperty?.id === property.id ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              {getPropertyIcon(property)}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2c5f7d' }} />
          <span style={{ fontSize: '13px', color: '#636e72' }}>En Venta</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28a745' }} />
          <span style={{ fontSize: '13px', color: '#636e72' }}>En Alquiler</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#e8b86d' }} />
          <span style={{ fontSize: '13px', color: '#636e72' }}>Destacadas</span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: '1px solid #e5e7eb',
          background: '#f8f9fa',
          textAlign: 'center'
        }}
      >
        <p style={{ color: '#636e72', margin: '0 0 12px 0', fontSize: '14px' }}>
          💡 Para ver el mapa interactivo completo, configura la API de Google Maps
        </p>
        <button
          onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '500',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Configurar Google Maps API
        </button>
      </div>
    </div>
  )
}
