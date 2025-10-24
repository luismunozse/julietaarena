'use client'

import { useEffect, useRef, useState } from 'react'
import { Property } from '@/data/properties'
import styles from './GoogleMaps.module.css'

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

export default function GoogleMaps({ 
  properties, 
  selectedProperty, 
  onPropertySelect,
  height = '500px' 
}: GoogleMapsProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Coordenadas de Córdoba
  const cordobaCenter = { lat: -31.4201, lng: -64.1888 }

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
    return icons[property.type] || '🏠'
  }

  const getPropertyColor = (property: Property) => {
    return property.operation === 'venta' ? '#2c5f7d' : '#e8b86d'
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${price.toLocaleString()}`
  }

  const initMap = () => {
    if (!mapRef.current || window.google) return

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: cordobaCenter,
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    })

    setMap(mapInstance)
    setIsLoaded(true)
    createMarkers(mapInstance)
  }

  const createMarkers = (mapInstance: any) => {
    if (!mapInstance) return

    // Limpiar marcadores existentes
    markers.forEach(marker => marker.setMap(null))

    const newMarkers = properties.map(property => {
      const location = property.location.split(',')[0].trim()
      const coords = zoneCoordinates[location] || cordobaCenter
      
      // Agregar pequeña variación para evitar superposición
      const lat = coords.lat + (Math.random() - 0.5) * 0.01
      const lng = coords.lng + (Math.random() - 0.5) * 0.01

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
          strokeWeight: 2
        }
      })

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="${styles.infoWindow}">
            <div class="${styles.infoImage}">
              <img src="${property.images[0]}" alt="${property.title}" />
            </div>
            <div class="${styles.infoContent}">
              <h3>${property.title}</h3>
              <p class="${styles.infoLocation}">📍 ${property.location}</p>
              <p class="${styles.infoPrice}">${formatPrice(property.price)}${property.operation === 'alquiler' ? '/mes' : ''}</p>
              <div class="${styles.infoDetails}">
                <span>${property.area}m²</span>
                ${property.bedrooms ? `<span>🛏️ ${property.bedrooms}</span>` : ''}
                ${property.bathrooms ? `<span>🚿 ${property.bathrooms}</span>` : ''}
              </div>
              <button onclick="window.selectProperty('${property.id}')" class="${styles.infoButton}">
                Ver Detalles
              </button>
            </div>
          </div>
        `
      })

      marker.addListener('click', () => {
        infoWindow.open(mapInstance, marker)
        if (onPropertySelect) {
          onPropertySelect(property)
        }
      })

      return marker
    })

    setMarkers(newMarkers)

    // Exponer función global para el botón
    ;(window as any).selectProperty = (propertyId: string) => {
      const property = properties.find(p => p.id === propertyId)
      if (property && onPropertySelect) {
        onPropertySelect(property)
      }
    }
  }

  useEffect(() => {
    // Cargar Google Maps API
    const loadGoogleMaps = () => {
      if (window.google) {
        initMap()
        return
      }

      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        window.initMap = initMap
        initMap()
      }
      document.head.appendChild(script)
    }

    loadGoogleMaps()
  }, [initMap])

  useEffect(() => {
    if (map && isLoaded) {
      createMarkers(map)
    }
  }, [properties, map, isLoaded, createMarkers])

  useEffect(() => {
    if (selectedProperty && map) {
      const location = selectedProperty.location.split(',')[0].trim()
      const coords = zoneCoordinates[location] || cordobaCenter
      
      map.setCenter(coords)
      map.setZoom(15)
    }
  }, [selectedProperty, map, cordobaCenter, zoneCoordinates])

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={styles.mapContainer} style={{ height }}>
        <div className={styles.mapError}>
          <h3>Mapa no disponible</h3>
          <p>Google Maps API key no configurada</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.mapContainer} style={{ height }}>
      <div ref={mapRef} className={styles.map} />
      {!isLoaded && (
        <div className={styles.mapLoading}>
          <div className={styles.loadingSpinner}></div>
          <p>Cargando mapa...</p>
        </div>
      )}
    </div>
  )
}
