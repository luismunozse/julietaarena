'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { properties, Property, getPropertiesForSale, getPropertiesForRent } from '@/data/properties'
import PropertyCard from './PropertyCard'
import PropertyCardList from './PropertyCardList'
import PropertyMap from './PropertyMap'
import SkeletonLoader from './SkeletonLoader'
import EmptyState from './EmptyState'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useUXMetrics } from '@/hooks/useUXMetrics'
import styles from './PropertiesResults.module.css'

type ViewMode = 'grid' | 'list' | 'map'

export default function PropertiesResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'venta' | 'alquiler'>('venta')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const analytics = useAnalytics()
  const loadingStartTime = useRef<number>(Date.now())

  // Track UX metrics
  const { trackCustomMetric, trackEmptyState, trackLoadingState } = useUXMetrics({
    componentName: 'PropertiesResults',
    trackLoadTime: true,
    trackScrollDepth: true
  })

  // Leer parámetros de la URL al cargar
  useEffect(() => {
    setIsLoading(true)
    loadingStartTime.current = Date.now()
    
    const operation = searchParams.get('operation')
    const type = searchParams.get('type')
    const location = searchParams.get('location')
    const featured = searchParams.get('featured')

    if (operation === 'venta' || operation === 'alquiler') {
      setActiveTab(operation)
    }

    if (type && type !== 'all') {
      setSelectedType(type)
    }

    if (location) {
      setSelectedLocation(location)
      setSearchTerm(location)
    }

    // Simular carga de datos (en una app real, esto sería una llamada API)
    const timer = setTimeout(() => {
      const loadingDuration = Date.now() - loadingStartTime.current
      trackLoadingState(loadingDuration)
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [searchParams, trackLoadingState])

  const types = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'local', label: 'Local Comercial' },
    { value: 'oficina', label: 'Oficina' }
  ]

  const currentProperties = activeTab === 'venta' ? getPropertiesForSale() : getPropertiesForRent()

  const filteredProperties = useMemo(() => {
    const featured = searchParams.get('featured')
    
    return currentProperties.filter(property => {
      // Filtro por destacadas (si viene en URL)
      if (featured === 'true' && !property.featured) return false
      
      // Filtro por tipo
      if (selectedType !== 'all' && property.type !== selectedType) return false
      
      // Filtro por ubicación/búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const titleMatch = property.title.toLowerCase().includes(searchLower)
        const locationMatch = property.location.toLowerCase().includes(searchLower)
        const descriptionMatch = property.description.toLowerCase().includes(searchLower)
        
        if (!titleMatch && !locationMatch && !descriptionMatch) return false
      }
      
      return property.status === 'disponible'
    })
  }, [currentProperties, selectedType, searchTerm, searchParams])

  // Ordenar propiedades
  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'area-asc':
          return a.area - b.area
        case 'area-desc':
          return b.area - a.area
        default:
          return 0
      }
    })
  }, [filteredProperties, sortBy])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={styles.resultsPage}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className="container">
          <button 
            className={styles.backButton}
            onClick={() => router.back()}
          >
            ← Volver
          </button>
          <h1 className={styles.pageTitle}>
            {activeTab === 'venta' ? '🏠 Propiedades en Venta' : '🔑 Propiedades en Alquiler'}
          </h1>
          {searchTerm && (
            <p className={styles.searchInfo}>
              Resultados para: <strong>{searchTerm}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="container">
        {/* Filtros Rápidos y Controles de Vista */}
        <div className={styles.quickFilters}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.filterSelect}
          >
            {types.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="recent">Más recientes</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="area-asc">Área: menor a mayor</option>
            <option value="area-desc">Área: mayor a menor</option>
          </select>

          <div className={styles.resultsCount}>
            {sortedProperties.length} propiedad{sortedProperties.length !== 1 ? 'es' : ''} encontrada{sortedProperties.length !== 1 ? 's' : ''}
          </div>

          {/* Botones de Vista */}
          <div className={styles.viewModeButtons}>
            <button
              className={`${styles.viewModeBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista en grilla"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="2" width="6" height="6" rx="1"/>
                <rect x="12" y="2" width="6" height="6" rx="1"/>
                <rect x="2" y="12" width="6" height="6" rx="1"/>
                <rect x="12" y="12" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button
              className={`${styles.viewModeBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="Vista en lista"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <rect x="2" y="3" width="16" height="3" rx="1"/>
                <rect x="2" y="9" width="16" height="3" rx="1"/>
                <rect x="2" y="15" width="16" height="3" rx="1"/>
              </svg>
            </button>
            <button
              className={`${styles.viewModeBtn} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => setViewMode('map')}
              title="Vista en mapa"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2C6.69 2 4 4.69 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Resultados */}
        {isLoading ? (
          <SkeletonLoader 
            type={viewMode === 'list' ? 'list' : 'card'} 
            count={viewMode === 'map' ? 1 : 6} 
          />
        ) : sortedProperties.length > 0 ? (
          <>
            {/* Vista en Grilla */}
            {viewMode === 'grid' && (
              <div className={styles.propertiesGrid}>
                {sortedProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Vista en Lista */}
            {viewMode === 'list' && (
              <div className={styles.propertiesList}>
                {sortedProperties.map(property => (
                  <PropertyCardList key={property.id} property={property} />
                ))}
              </div>
            )}

            {/* Vista en Mapa */}
            {viewMode === 'map' && (
              <div className={styles.mapView}>
                {sortedProperties.length === 0 ? (
                  <EmptyState
                    icon="📍"
                    title="No hay propiedades para mostrar en el mapa"
                    description="No se encontraron propiedades con coordenadas geográficas para mostrar en el mapa."
                    actionLabel="Volver a la búsqueda"
                    onAction={() => router.push('/propiedades')}
                  />
                ) : (
                  <PropertyMap 
                    properties={sortedProperties}
                    height="calc(100vh - 400px)"
                  />
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {(() => {
              trackEmptyState(`No results for: ${searchTerm || 'unknown'} - Type: ${selectedType} - Operation: ${activeTab}`)
              return null
            })()}
            <EmptyState
              icon="🔍"
              title="No se encontraron propiedades"
              description="Intenta ajustar tus criterios de búsqueda o explora otras opciones disponibles."
              actionLabel="Hacer una nueva búsqueda"
              onAction={() => router.push('/propiedades')}
            />
          </>
        )}
      </div>
    </div>
  )
}

