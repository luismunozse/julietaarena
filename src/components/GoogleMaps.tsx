'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Property } from '@/data/properties'
import { cn } from '@/lib/utils'
import { Loader2, MapPinOff } from 'lucide-react'

interface GoogleMapsProps {
  properties: Property[]
  selectedProperty?: Property | null
  onPropertySelect?: (property: Property) => void
  height?: string
}

declare global {
  interface Window {
    google: any
    initMap: () => void
  }
}

const CORDOBA_CENTER = { lat: -31.4201, lng: -64.1888 }

const ZONE_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Villa Allende': { lat: -31.3, lng: -64.3 },
  'Nueva Córdoba': { lat: -31.42, lng: -64.19 },
  'Carlos Paz': { lat: -31.424, lng: -64.4978 },
  Centro: { lat: -31.4201, lng: -64.1888 },
  'Barrio Norte': { lat: -31.4, lng: -64.18 },
  'Barrio Jardín': { lat: -31.41, lng: -64.2 },
  'Barrio Güemes': { lat: -31.43, lng: -64.2 },
  'Torre Empresarial': { lat: -31.415, lng: -64.185 },
}

const sanitizeUrl = (url: string) =>
  url.replace(/"/g, '&quot;').replace(/'/g, '&#39;')

// Info window styles as CSS string for injection
const infoWindowStyles = `
  .gm-info-window {
    padding: 0;
    max-width: 280px;
    font-family: inherit;
  }
  .gm-info-image {
    width: 100%;
    height: 120px;
    background-size: cover;
    background-position: center;
    background-color: #e5e7eb;
    border-radius: 8px 8px 0 0;
  }
  .gm-info-content {
    padding: 12px;
  }
  .gm-info-content h3 {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #1a4158;
  }
  .gm-info-location {
    margin: 0 0 4px 0;
    font-size: 12px;
    color: #636e72;
  }
  .gm-info-price {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 700;
    color: #2c5f7d;
  }
  .gm-info-details {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 12px;
    color: #636e72;
  }
  .gm-info-button {
    width: 100%;
    padding: 8px 16px;
    background-color: #2c5f7d;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  .gm-info-button:hover {
    background-color: #1a4158;
  }
`

export default function GoogleMaps({
  properties,
  selectedProperty,
  onPropertySelect,
  height = '500px',
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const markersRef = useRef<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Inject info window styles
  useEffect(() => {
    const styleId = 'google-maps-info-styles'
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style')
      styleEl.id = styleId
      styleEl.textContent = infoWindowStyles
      document.head.appendChild(styleEl)
    }
  }, [])

  const getPropertyColor = (property: Property) => {
    return property.operation === 'venta' ? '#2c5f7d' : '#e8b86d'
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${price.toLocaleString()}`
  }

  const createMarkers = useCallback(
    (mapInstance: google.maps.Map | null) => {
      if (!mapInstance) return

      markersRef.current.forEach((marker) => marker.setMap(null))

      const newMarkers = properties.map((property) => {
        const location = property.location.split(',')[0].trim()
        const coords = ZONE_COORDINATES[location] || CORDOBA_CENTER
        const lat = coords.lat + (Math.random() - 0.5) * 0.01
        const lng = coords.lng + (Math.random() - 0.5) * 0.01
        const imageUrl = property.images[0] ? sanitizeUrl(property.images[0]) : ''

        const marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: mapInstance,
          title: property.title,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: getPropertyColor(property),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          },
        })

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
          <div class="gm-info-window">
            <div class="gm-info-image" ${imageUrl ? `style="background-image:url('${imageUrl}')"` : ''}></div>
            <div class="gm-info-content">
              <h3>${property.title}</h3>
              <p class="gm-info-location">📍 ${property.location}</p>
              <p class="gm-info-price">${formatPrice(property.price)}${property.operation === 'alquiler' ? '/mes' : ''}</p>
              <div class="gm-info-details">
                <span>${property.area}m²</span>
                ${property.bedrooms ? `<span>🛏️ ${property.bedrooms}</span>` : ''}
                ${property.bathrooms ? `<span>🚿 ${property.bathrooms}</span>` : ''}
              </div>
              <button onclick="window.selectProperty('${property.id}')" class="gm-info-button">
                Ver Detalles
              </button>
            </div>
          </div>
        `,
        })

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker)
          if (onPropertySelect) {
            onPropertySelect(property)
          }
        })

        return marker
      })

      markersRef.current = newMarkers
      ;(
        window as unknown as { selectProperty?: (propertyId: string) => void }
      ).selectProperty = (propertyId: string) => {
        const property = properties.find((p) => p.id === propertyId)
        if (property && onPropertySelect) {
          onPropertySelect(property)
        }
      }
    },
    [onPropertySelect, properties]
  )

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: CORDOBA_CENTER,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    })

    setMap(mapInstance)
    setIsLoaded(true)
    createMarkers(mapInstance)
  }, [createMarkers])

  useEffect(() => {
    if (window.google?.maps) {
      initMap()
      return
    }

    const scriptId = 'google-maps-script'
    const existingScript = document.getElementById(
      scriptId
    ) as HTMLScriptElement | null

    if (existingScript) {
      existingScript.addEventListener('load', initMap)
      return () => existingScript.removeEventListener('load', initMap)
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
    script.async = true
    script.defer = true
    script.addEventListener('load', initMap)
    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', initMap)
    }
  }, [initMap])

  useEffect(() => {
    if (map) {
      createMarkers(map)
    }
  }, [map, createMarkers, properties])

  useEffect(() => {
    if (selectedProperty && map) {
      const location = selectedProperty.location.split(',')[0].trim()
      const coords = ZONE_COORDINATES[location] || CORDOBA_CENTER

      map.setCenter(coords)
      map.setZoom(15)
    }
  }, [selectedProperty, map])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div
        className="relative w-full overflow-hidden rounded-2xl shadow-md"
        style={{ height }}
      >
        <div className="flex h-full flex-col items-center justify-center bg-slate-50 p-8 text-center text-slate-500">
          <MapPinOff className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-1 text-lg font-medium text-slate-700">
            Mapa no disponible
          </h3>
          <p className="text-sm">Google Maps API key no configurada</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-md"
      style={{ height }}
    >
      <div ref={mapRef} className="h-full w-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#2c5f7d]" />
          <p>Cargando mapa...</p>
        </div>
      )}
    </div>
  )
}
