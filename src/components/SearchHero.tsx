'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Home, Key, DollarSign, Building2 } from 'lucide-react'

/* =============================================================================
   TYPES
============================================================================= */

type Operation = 'venta' | 'alquiler' | null

interface ActionButton {
  id: Operation | 'vender' | 'emprendimientos'
  label: string
  icon: React.ReactNode
  isSpecial?: boolean
}

/* =============================================================================
   CONSTANTS
============================================================================= */

const PLACEHOLDERS = [
  "¿Dónde querés mudarte?",
  "Ejemplo: Córdoba Capital",
  "Ejemplo: Villa Carlos Paz",
  "Ejemplo: Nueva Córdoba",
  "Ejemplo: Río Cuarto"
]

const PROPERTY_TYPES = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'local', label: 'Local Comercial' },
  { value: 'oficina', label: 'Oficina' }
]

const ACTION_BUTTONS: ActionButton[] = [
  { id: 'venta', label: 'Quiero comprar', icon: <Home className="w-4 h-4" /> },
  { id: 'alquiler', label: 'Quiero alquilar', icon: <Key className="w-4 h-4" /> },
  { id: 'vender', label: 'Quiero vender', icon: <DollarSign className="w-4 h-4" /> },
  { id: 'emprendimientos', label: 'Emprendimientos', icon: <Building2 className="w-4 h-4" />, isSpecial: true }
]

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function SearchHero() {
  const [searchLocation, setSearchLocation] = useState('')
  const [propertyType, setPropertyType] = useState('all')
  const [operation, setOperation] = useState<Operation>(null)
  const [isLoadingMaps, setIsLoadingMaps] = useState(true)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  // Rotate placeholders
  useEffect(() => {
    if (isLoadingMaps || searchLocation) return

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoadingMaps, searchLocation])

  // Initialize Google Maps Autocomplete
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setMapsError('API key de Google Maps no configurada')
      setIsLoadingMaps(false)
      return
    }

    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google?.maps?.places) {
          resolve()
          return
        }

        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve())
          existingScript.addEventListener('error', () => reject(new Error('Failed to load Google Maps')))
          return
        }

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

        // Permitir ciudades, barrios, direcciones y regiones
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'ar' },
          fields: ['address_components', 'geometry', 'name', 'formatted_address'],
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.geometry) {
            // Extraer las partes más relevantes de la dirección
            const components = place.address_components || []
            const neighborhood = components.find(c =>
              c.types.includes('sublocality_level_1') || c.types.includes('neighborhood')
            )
            const city = components.find(c =>
              c.types.includes('locality') || c.types.includes('administrative_area_level_2')
            )

            // Usar barrio + ciudad, o solo ciudad, o el nombre del lugar
            let locationText = ''
            if (neighborhood && city) {
              locationText = `${neighborhood.long_name}, ${city.long_name}`
            } else if (city) {
              locationText = city.long_name
            } else if (neighborhood) {
              locationText = neighborhood.long_name
            } else {
              locationText = place.name || place.formatted_address || ''
            }

            setSearchLocation(locationText)
          }
        })

        autocompleteRef.current = autocomplete
        setIsLoadingMaps(false)
      } catch (error) {
        setMapsError('Error al cargar el servicio de ubicaciones')
        setIsLoadingMaps(false)
      }
    }

    initAutocomplete()

    return () => {
      if (autocompleteRef.current && window.google) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [])

  const buildSearchUrl = (overrideOperation?: string) => {
    const params = new URLSearchParams()
    params.append('operation', overrideOperation || operation || 'venta')

    if (searchLocation.trim()) {
      params.append('location', searchLocation.trim())
    }

    if (propertyType && propertyType !== 'all') {
      params.append('type', propertyType)
    }

    return `/propiedades/resultado?${params.toString()}`
  }

  const handleSearch = () => {
    router.push(buildSearchUrl())
  }

  const handleActionClick = (id: ActionButton['id']) => {
    if (id === 'vender') {
      router.push('/vender')
      return
    }

    if (id === 'emprendimientos') {
      router.push('/propiedades/resultado?featured=true&operation=venta')
      return
    }

    // Para comprar/alquilar: setear la operación y navegar con los filtros actuales
    setOperation(id)
    router.push(buildSearchUrl(id as string))
  }

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden pt-24 sm:pt-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary" />

      {/* Decorative overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-brand-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full bg-brand-primary/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
            Mucho más que mudarte
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
            Encuentra tu hogar ideal con el acompañamiento profesional que necesitás
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 justify-center mb-6 sm:mb-8 px-2">
            {ACTION_BUTTONS.map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleActionClick(btn.id)}
                className={`
                  inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm
                  transition-all duration-200 hover:-translate-y-0.5
                  ${operation === btn.id
                    ? 'bg-white text-brand-accent shadow-lg'
                    : btn.isSpecial
                      ? 'bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 hover:bg-brand-secondary/30'
                      : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                  }
                `}
              >
                {btn.icon}
                <span className="whitespace-nowrap">{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl p-2.5 sm:p-3 shadow-2xl shadow-black/15 mx-2 sm:mx-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2.5">
              {/* Location Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={isLoadingMaps ? "Cargando ubicaciones..." : PLACEHOLDERS[placeholderIndex]}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={isLoadingMaps}
                  className="w-full h-12 sm:h-14 pl-11 pr-4 text-sm sm:text-base bg-surface border border-border rounded-xl outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:bg-white disabled:opacity-60"
                />
                {mapsError && (
                  <span
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 cursor-help text-warning"
                    title={mapsError}
                  >
                    ⚠️
                  </span>
                )}
              </div>

              {/* Property Type Select */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="h-12 sm:h-14 px-3 sm:px-4 text-sm sm:text-base bg-surface border border-border rounded-xl outline-none cursor-pointer transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:bg-white sm:w-48"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                aria-label="Buscar propiedades"
                className="h-12 sm:h-14 px-5 sm:px-7 bg-gradient-to-r from-brand-secondary to-yellow-500 rounded-xl flex items-center justify-center gap-2.5 font-semibold text-sm sm:text-base text-brand-dark hover:shadow-lg hover:shadow-brand-secondary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
