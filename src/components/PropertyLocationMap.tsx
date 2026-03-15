'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MapPin, ExternalLink, Navigation, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PropertyLocationMapProps {
  latitude?: number
  longitude?: number
  address?: string
  propertyTitle: string
}

export default function PropertyLocationMap({ latitude, longitude, address, propertyTitle }: PropertyLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resolvedCoords, setResolvedCoords] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  )

  const initMap = useCallback((coords: { lat: number; lng: number }) => {
    if (!mapRef.current || !window.google?.maps) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: coords,
      zoom: 16,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
      ],
    })

    new window.google.maps.Marker({
      position: coords,
      map,
      title: propertyTitle,
      animation: window.google.maps.Animation.DROP,
    })

    setIsLoaded(true)
  }, [propertyTitle])

  const geocodeAddress = useCallback((addr: string) => {
    if (!window.google?.maps) return

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode(
      { address: `${addr}, Córdoba, Argentina` },
      (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location
          const coords = { lat: location.lat(), lng: location.lng() }
          setResolvedCoords(coords)
          initMap(coords)
        } else {
          setError('No se pudo encontrar la ubicación en el mapa')
        }
      }
    )
  }, [initMap])

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError('API key de Google Maps no configurada')
      return
    }

    const onReady = () => {
      if (latitude && longitude) {
        const coords = { lat: latitude, lng: longitude }
        setResolvedCoords(coords)
        initMap(coords)
      } else if (address) {
        geocodeAddress(address)
      } else {
        setError('No hay ubicación disponible')
      }
    }

    if (window.google?.maps) {
      onReady()
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      if ((window as any).google?.maps) {
        onReady()
      } else {
        existingScript.addEventListener('load', onReady)
        return () => existingScript.removeEventListener('load', onReady)
      }
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.addEventListener('load', onReady)
    script.addEventListener('error', () => setError('Error al cargar Google Maps'))
    document.head.appendChild(script)

    return () => {
      script.removeEventListener('load', onReady)
    }
  }, [latitude, longitude, address, initMap, geocodeAddress])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] bg-slate-50 text-center p-8">
        <MapPin className="h-10 w-10 text-slate-300 mb-3" />
        <p className="text-sm font-medium text-slate-700 mb-1">Mapa no disponible</p>
        <p className="text-xs text-slate-500">{error}</p>
        {address && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(address + ', Córdoba, Argentina')}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4" />
            Buscar en Google Maps
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={mapRef} className="w-full h-[350px]" />
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 gap-3">
          <Loader2 className="h-8 w-8 text-[#2c5f7d] animate-spin" />
          <p className="text-sm text-slate-500">Cargando mapa...</p>
        </div>
      )}

      {/* Overlay buttons */}
      {resolvedCoords && isLoaded && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            className="bg-white text-slate-700 hover:bg-slate-100 shadow-lg border border-slate-200"
            onClick={() => window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${resolvedCoords.lat},${resolvedCoords.lng}`,
              '_blank'
            )}
          >
            <Navigation className="h-4 w-4" />
            <span className="hidden sm:inline">Cómo llegar</span>
          </Button>
          <Button
            size="sm"
            className="bg-white text-slate-700 hover:bg-slate-100 shadow-lg border border-slate-200"
            onClick={() => window.open(
              `https://www.google.com/maps/@${resolvedCoords.lat},${resolvedCoords.lng},17z`,
              '_blank'
            )}
          >
            <ExternalLink className="h-4 w-4" />
            <span className="hidden sm:inline">Google Maps</span>
          </Button>
        </div>
      )}
    </div>
  )
}
