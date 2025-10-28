'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import styles from './SearchHero.module.css'

export default function SearchHero() {
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
    "¿Dónde querés mudarte?",
    "Ejemplo: Córdoba Capital",
    "Ejemplo: Villa Carlos Paz",
    "Ejemplo: Alta Gracia",
    "Ejemplo: Río Cuarto"
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
    }, 3000) // Cambiar cada 3 segundos

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

    // Función para cargar el script de Google Maps
    const loadGoogleMapsScript = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve()
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

        // Crear autocomplete con restricciones para Argentina
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          componentRestrictions: { country: 'ar' },
          fields: ['address_components', 'geometry', 'name', 'formatted_address'],
          types: ['(cities)'] // Solo ciudades y localidades
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
    
    // Agregar parámetros de búsqueda
    if (operation) {
      params.append('operation', operation)
    } else {
      params.append('operation', 'venta') // Por defecto venta
    }
    
    if (searchLocation) {
      params.append('location', searchLocation.toLowerCase())
    }
    
    if (propertyType && propertyType !== 'all') {
      params.append('type', propertyType)
    }
    
    // Agregar coordenadas si están disponibles
    if (selectedPlace?.geometry?.location) {
      params.append('lat', selectedPlace.geometry.location.lat().toString())
      params.append('lng', selectedPlace.geometry.location.lng().toString())
    }

    // Redirigir a página de resultados
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
    <section className={styles.searchHero}>
      <div className={styles.heroOverlay}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Mucho más que mudarte
          </h1>
          
          <p className={styles.heroSubtitle}>
            Encuentra tu hogar ideal con el acompañamiento profesional que necesitás
          </p>

          {/* Botones de Acción */}
          <div className={styles.actionButtons}>
            <button
              className={`${styles.actionBtn} ${operation === 'venta' ? styles.active : ''}`}
              onClick={() => handleOperationClick('venta')}
            >
              🏠 Quiero comprar
            </button>
            <button
              className={`${styles.actionBtn} ${operation === 'alquiler' ? styles.active : ''}`}
              onClick={() => handleOperationClick('alquiler')}
            >
              🔑 Quiero alquilar
            </button>
            <button
              className={`${styles.actionBtn}`}
              onClick={() => router.push('/vender')}
            >
              💰 Quiero vender
            </button>
            <button
              className={`${styles.actionBtn} ${styles.emprendimientos}`}
              onClick={() => handleOperationClick('emprendimientos')}
            >
              🏗️ Emprendimientos
            </button>
          </div>

          {/* Barra de Búsqueda */}
          <div className={styles.searchBox}>
            <div className={styles.searchInputGroup}>
              <input
                ref={inputRef}
                type="text"
                placeholder={isLoadingMaps ? "Cargando ubicaciones..." : placeholders[placeholderIndex]}
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className={`${styles.searchInput} ${!isLoadingMaps && !searchLocation ? styles.animatedPlaceholder : ''}`}
                disabled={isLoadingMaps}
              />
              {mapsError && (
                <div className={styles.errorTooltip} title={mapsError}>
                  ⚠️
                </div>
              )}
            </div>
            
            <div className={styles.searchInputGroup}>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className={styles.searchSelect}
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSearch}
              className={styles.searchButton}
              aria-label="Buscar propiedades"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

