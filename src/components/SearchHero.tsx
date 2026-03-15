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
  "Ejemplo: Alta Gracia",
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
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
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

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'ar' },
          fields: ['address_components', 'geometry', 'name', 'formatted_address'],
          types: ['(cities)']
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace()
          if (place.geometry) {
            setSelectedPlace(place)
            // Extraer nombre de ciudad en vez de la dirección completa de Google
            const cityComponent = place.address_components?.find(c =>
              c.types.includes('locality') || c.types.includes('administrative_area_level_2')
            )
            setSearchLocation(cityComponent?.long_name || place.name || place.formatted_address || '')
          }
        })

        autocompleteRef.current = autocomplete
        setIsLoadingMaps(false)
      } catch (error) {
        console.error('Error loading Google Maps:', error)
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

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.append('operation', operation || 'venta')

    if (searchLocation) {
      params.append('location', searchLocation.toLowerCase())
    }

    if (propertyType && propertyType !== 'all') {
      params.append('type', propertyType)
    }

    if (selectedPlace?.geometry?.location) {
      params.append('lat', selectedPlace.geometry.location.lat().toString())
      params.append('lng', selectedPlace.geometry.location.lng().toString())
    }

    router.push(`/propiedades/resultado?${params.toString()}`)
  }

  const handleActionClick = (id: ActionButton['id']) => {
    if (id === 'vender') {
      router.push('/vender')
    } else if (id === 'emprendimientos') {
      router.push('/propiedades/resultado?featured=true&operation=venta')
    } else {
      setOperation(id)
      router.push(`/propiedades/resultado?operation=${id}`)
    }
  }

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary" />

      {/* Decorative overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 sm:w-96 h-48 sm:h-96 rounded-full bg-brand-secondary/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 sm:w-[500px] h-64 sm:h-[500px] rounded-full bg-brand-primary/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
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
          <div className="bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-2xl shadow-black/20 mx-2 sm:mx-0">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Location Input */}
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={isLoadingMaps ? "Cargando ubicaciones..." : PLACEHOLDERS[placeholderIndex]}
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  disabled={isLoadingMaps}
                  className="w-full h-12 sm:h-14 px-4 sm:px-5 text-sm sm:text-base bg-surface border-2 border-border rounded-xl outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 disabled:opacity-60"
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
                className="h-12 sm:h-14 px-3 sm:px-4 text-sm sm:text-base bg-surface border-2 border-border rounded-xl outline-none cursor-pointer transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:w-48"
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
                className="h-12 sm:h-14 px-4 sm:px-6 bg-gradient-to-r from-brand-secondary to-yellow-500 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm sm:text-base text-brand-dark hover:shadow-lg hover:shadow-brand-secondary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
                <span>Buscar</span>
              </button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-6 sm:mt-10 grid grid-cols-3 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-8 text-white/70 px-2">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">+500</div>
              <div className="text-xs sm:text-sm">Propiedades</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">+15</div>
              <div className="text-xs sm:text-sm">Años experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">+300</div>
              <div className="text-xs sm:text-sm">Clientes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
