'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface PropertyLocationMapProps {
  latitude: number
  longitude: number
  propertyTitle: string
}

const inlineStyles = {
  mapContainer: {
    position: 'relative' as const,
    width: '100%',
    height: '400px',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
    overflow: 'hidden',
  } as React.CSSProperties,
  map: {
    width: '100%',
    height: '100%',
  } as React.CSSProperties,
  mapError: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    color: '#636e72',
    textAlign: 'center' as const,
    padding: '2rem',
  } as React.CSSProperties,
  mapLoading: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    gap: '1rem',
  } as React.CSSProperties,
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #2c5f7d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  } as React.CSSProperties,
}

export default function PropertyLocationMap({ latitude, longitude, propertyTitle }: PropertyLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) {
      return
    }

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 15,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    })

    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      title: propertyTitle,
    })

    setIsLoaded(true)
  }, [latitude, longitude, propertyTitle])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError('API key de Google Maps no configurada')
      console.error('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no esta en .env.local')
      return
    }

    // Si Google Maps ya esta cargado, inicializar directamente
    if (window.google?.maps) {
      initMap()
      return
    }

    // Verificar si ya existe un script cargandose
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      existingScript.addEventListener('load', initMap)
      return () => existingScript.removeEventListener('load', initMap)
    }

    // Cargar el script de Google Maps
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.addEventListener('load', initMap)
    script.addEventListener('error', () => {
      setError('Error al cargar Google Maps')
      console.error('Error al cargar el script de Google Maps')
    })
    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', initMap)
    }
  }, [initMap])

  if (error) {
    return (
      <div style={inlineStyles.mapContainer}>
        <div style={inlineStyles.mapError}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a4158' }}>Mapa no disponible</h3>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div style={inlineStyles.mapContainer}>
      <div ref={mapRef} style={inlineStyles.map} />
      {!isLoaded && (
        <div style={inlineStyles.mapLoading}>
          <div style={inlineStyles.loadingSpinner}></div>
          <p style={{ margin: 0, color: '#636e72' }}>Cargando mapa...</p>
        </div>
      )}
    </div>
  )
}
