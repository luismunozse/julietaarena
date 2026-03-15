'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { MapPin, AlertCircle, Lightbulb, Loader2 } from 'lucide-react'

interface LocationInputProps {
  value: string
  onChange: (location: string, coordinates?: { lat: number; lng: number }) => void
  placeholder?: string
  error?: string
}

export default function LocationInput({
  value,
  onChange,
  placeholder = 'Buscar ubicación...',
  error,
}: LocationInputProps) {
  const [isLoadingMaps, setIsLoadingMaps] = useState(true)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // Inicializar Google Places Autocomplete
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setMapsError('API key de Google Maps no configurada')
      setIsLoadingMaps(false)
      return
    }

    // Función para cargar el script de Google Maps
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Si ya está cargado, resolver inmediatamente
        if (window.google && window.google.maps && window.google.maps.places) {
          resolve()
          return
        }

        // Verificar si ya existe un script en proceso de carga
        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        )
        if (existingScript) {
          // Si existe, esperar a que cargue
          existingScript.addEventListener('load', () => resolve())
          existingScript.addEventListener('error', () =>
            reject(new Error('Failed to load Google Maps'))
          )
          return
        }

        // Crear nuevo script solo si no existe
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es`
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Google Maps'))
        document.head.appendChild(script)
      })
    }

    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsScript()

        if (!inputRef.current) return

        // Configurar autocomplete
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current,
          {
            componentRestrictions: { country: 'ar' }, // Restringir a Argentina
            fields: ['formatted_address', 'geometry', 'name'],
            types: ['geocode'], // Solo direcciones
          }
        )

        // Listener para cuando se selecciona un lugar
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()

          if (!place.geometry || !place.geometry.location) {
            setMapsError('No se pudo obtener la ubicación seleccionada')
            return
          }

          const location = place.formatted_address || place.name || ''
          const coordinates = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }

          onChange(location, coordinates)
        })

        autocompleteRef.current = autocomplete
        setIsLoadingMaps(false)
        setMapsError(null)
      } catch (err) {
        setMapsError('Error al cargar Google Maps')
        setIsLoadingMaps(false)
      }
    }

    initAutocomplete()

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [onChange])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value) // Actualizar el valor mientras se escribe
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={isLoadingMaps ? 'Cargando Google Maps...' : placeholder}
          disabled={isLoadingMaps}
          className={cn(
            'pl-9',
            error && 'border-destructive focus-visible:ring-destructive',
            isLoadingMaps && 'opacity-70'
          )}
        />
        {isLoadingMaps && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {mapsError && (
        <p className="flex items-center gap-1.5 text-sm text-amber-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{mapsError}. La dirección se puede ingresar manualmente.</span>
        </p>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {!isLoadingMaps && !mapsError && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 shrink-0" />
          <span>Comienza a escribir para buscar con autocompletado</span>
        </p>
      )}
    </div>
  )
}
