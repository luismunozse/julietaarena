'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import styles from './PropertyLocationMap.module.css'

interface PropertyLocationMapProps {
  latitude: number
  longitude: number
  propertyTitle: string
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
      console.error('❌ NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no está en .env.local')
      return
    }

    // Si Google Maps ya está cargado, inicializar directamente
    if (window.google?.maps) {
      initMap()
      return
    }

    // Verificar si ya existe un script cargándose
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
      console.error('❌ Error al cargar el script de Google Maps')
    })
    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', initMap)
    }
  }, [initMap])

  if (error) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.mapError}>
          <h3>Mapa no disponible</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.mapContainer}>
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




