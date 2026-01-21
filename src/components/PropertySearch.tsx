'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, AlertTriangle, Home, Key, DollarSign, Building2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PropertySearch() {
  const [searchLocation, setSearchLocation] = useState('')
  const [propertyType, setPropertyType] = useState('all')
  const [operation, setOperation] = useState<'venta' | 'alquiler' | null>(null)
  const [isLoadingMaps, setIsLoadingMaps] = useState(true)
  const [mapsError, setMapsError] = useState<string | null>(null)
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)

  const placeholders = [
    "Donde queres mudarte?",
    "Ejemplo: Cordoba Capital",
    "Ejemplo: Villa Carlos Paz",
    "Ejemplo: Alta Gracia",
    "Ejemplo: Rio Cuarto"
  ]

  const propertyTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'local', label: 'Local Comercial' },
    { value: 'oficina', label: 'Oficina' }
  ]

  // Animar placeholders
  useEffect(() => {
    if (isLoadingMaps || searchLocation) return

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isLoadingMaps, searchLocation, placeholders.length])

  // Inicializar Google Places Autocomplete
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setMapsError('API key de Google Maps no configurada')
      setIsLoadingMaps(false)
      return
    }

    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.maps && window.google.maps.places) {
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

          if (place.geometry && place.formatted_address) {
            setSelectedPlace(place)
            setSearchLocation(place.formatted_address)
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

    if (operation) {
      params.append('operation', operation)
    } else {
      params.append('operation', 'venta')
    }

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

  const handleOperationClick = (op: 'venta' | 'alquiler' | 'emprendimientos') => {
    if (op === 'emprendimientos') {
      router.push('/propiedades/resultado?featured=true&operation=venta')
    } else {
      setOperation(op)
      router.push(`/propiedades/resultado?operation=${op}`)
    }
  }

  return (
    <section
      className={cn(
        "relative min-h-dvh h-screen flex items-center justify-center",
        "bg-cover bg-center bg-fixed pt-20 overflow-hidden",
        "supports-[height:100dvh]:min-h-dvh"
      )}
      style={{
        background: `linear-gradient(135deg, rgba(26, 65, 88, 0.9) 0%, rgba(44, 95, 125, 0.85) 100%), url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop') no-repeat center center`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Hero Overlay */}
      <div
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(26, 65, 88, 0.4) 0%, rgba(26, 65, 88, 0.7) 100%)'
        }}
      />

      <div className="container">
        <div className="relative z-10 text-center text-white max-w-[900px] mx-auto px-5 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Hero Title */}
          <h1
            className={cn(
              "text-[clamp(2.5rem,7vw+1rem,4.5rem)] font-bold mb-[clamp(12px,3vw,24px)]",
              "leading-[1.1] tracking-tight",
              "drop-shadow-[2px_4px_12px_rgba(0,0,0,0.3)]"
            )}
          >
            Mucho mas que mudarte
          </h1>

          {/* Hero Subtitle */}
          <p
            className={cn(
              "text-[clamp(1.1rem,2.5vw+0.5rem,1.5rem)] mb-[clamp(32px,6vw,48px)]",
              "leading-relaxed opacity-95",
              "drop-shadow-[1px_2px_6px_rgba(0,0,0,0.2)]"
            )}
          >
            Encuentra tu hogar ideal con el acompanamiento profesional que necesitas
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center flex-wrap mb-[clamp(24px,5vw,40px)] max-w-[900px] mx-auto">
            <Button
              variant="outline"
              onClick={() => handleOperationClick('venta')}
              className={cn(
                "py-[clamp(12px,2vw,16px)] px-[clamp(18px,2.5vw,28px)] h-auto",
                "border-2 border-white/30 bg-white/95 text-[#1a4158] rounded-xl",
                "text-[clamp(0.85rem,1.3vw,1.05rem)] font-semibold",
                "backdrop-blur-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                "flex-1 min-w-[min(140px,calc(50%-6px))] whitespace-nowrap",
                "hover:bg-white hover:border-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]",
                "transition-all duration-300",
                operation === 'venta' && "bg-white border-amber-400 shadow-[0_4px_16px_rgba(232,184,109,0.4)]"
              )}
            >
              <Home className="w-4 h-4 mr-1" />
              Quiero comprar
            </Button>

            <Button
              variant="outline"
              onClick={() => handleOperationClick('alquiler')}
              className={cn(
                "py-[clamp(12px,2vw,16px)] px-[clamp(18px,2.5vw,28px)] h-auto",
                "border-2 border-white/30 bg-white/95 text-[#1a4158] rounded-xl",
                "text-[clamp(0.85rem,1.3vw,1.05rem)] font-semibold",
                "backdrop-blur-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                "flex-1 min-w-[min(140px,calc(50%-6px))] whitespace-nowrap",
                "hover:bg-white hover:border-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]",
                "transition-all duration-300",
                operation === 'alquiler' && "bg-white border-amber-400 shadow-[0_4px_16px_rgba(232,184,109,0.4)]"
              )}
            >
              <Key className="w-4 h-4 mr-1" />
              Quiero alquilar
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push('/vender')}
              className={cn(
                "py-[clamp(12px,2vw,16px)] px-[clamp(18px,2.5vw,28px)] h-auto",
                "border-2 border-white/30 bg-white/95 text-[#1a4158] rounded-xl",
                "text-[clamp(0.85rem,1.3vw,1.05rem)] font-semibold",
                "backdrop-blur-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                "flex-1 min-w-[min(140px,calc(50%-6px))] whitespace-nowrap",
                "hover:bg-white hover:border-white hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]",
                "transition-all duration-300"
              )}
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Quiero vender
            </Button>

            <Button
              onClick={() => handleOperationClick('emprendimientos')}
              className={cn(
                "py-[clamp(12px,2vw,16px)] px-[clamp(18px,2.5vw,28px)] h-auto",
                "border-2 border-amber-500 bg-amber-500 text-white rounded-xl",
                "text-[clamp(0.85rem,1.3vw,1.05rem)] font-semibold",
                "backdrop-blur-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]",
                "flex-1 min-w-[min(140px,calc(50%-6px))] whitespace-nowrap",
                "hover:bg-amber-600 hover:border-amber-600 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)]",
                "transition-all duration-300"
              )}
            >
              <Building2 className="w-4 h-4 mr-1" />
              Emprendimientos
            </Button>
          </div>

          {/* Search Box */}
          <div
            className={cn(
              "grid grid-cols-[1fr_1fr_auto] gap-3 bg-white/[0.98] p-2 rounded-2xl",
              "shadow-[0_20px_40px_rgba(0,0,0,0.2)] backdrop-blur-lg",
              "md:grid-cols-[1fr_1fr_auto]",
              "max-md:grid-cols-1"
            )}
          >
            {/* Location Input */}
            <div className="relative">
              <Input
                ref={inputRef}
                type="text"
                placeholder={isLoadingMaps ? "Cargando ubicaciones..." : placeholders[placeholderIndex]}
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                disabled={isLoadingMaps}
                className={cn(
                  "w-full py-4 px-5 h-auto border-none bg-transparent",
                  "text-[clamp(0.95rem,1.2vw,1.05rem)] text-gray-800 rounded-xl",
                  "focus:bg-[#2c5f7d]/5 focus-visible:ring-0 focus-visible:border-none",
                  "placeholder:text-gray-400",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  !isLoadingMaps && !searchLocation && "placeholder:animate-pulse"
                )}
              />
              {mapsError && (
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 cursor-help animate-pulse"
                  title={mapsError}
                >
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
              )}
            </div>

            {/* Property Type Select */}
            <div className="relative">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={cn(
                  "w-full py-4 px-5 pr-11 h-auto border-none bg-transparent",
                  "text-[clamp(0.95rem,1.2vw,1.05rem)] text-gray-800 rounded-xl",
                  "cursor-pointer transition-colors duration-300",
                  "appearance-none",
                  "focus:outline-none focus:bg-[#2c5f7d]/5",
                  "hover:bg-[#2c5f7d]/[0.03]"
                )}
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              aria-label="Buscar propiedades"
              className={cn(
                "bg-gradient-to-br from-[#1a4158] to-[#2c5f7d] text-white",
                "py-4 px-6 h-auto rounded-xl",
                "text-lg font-semibold",
                "flex items-center justify-center min-w-[60px]",
                "shadow-[0_4px_12px_rgba(44,95,125,0.3)]",
                "hover:from-[#2c5f7d] hover:to-[#1a4158] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(44,95,125,0.4)]",
                "active:translate-y-0",
                "transition-all duration-300",
                "max-md:w-full"
              )}
            >
              <Search className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
