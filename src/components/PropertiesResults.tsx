'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Property } from '@/data/properties'
import { useProperties } from '@/hooks/useProperties'
import PropertyCard from './PropertyCard'
import PropertyCardList from './PropertyCardList'
import PropertyMap from './PropertyMap'
import SkeletonLoader from './SkeletonLoader'
import EmptyState from './EmptyState'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useUXMetrics } from '@/hooks/useUXMetrics'
import styles from './PropertiesResults.module.css'

type ViewMode = 'grid' | 'list' | 'map'

type OperationTab = 'venta' | 'alquiler'

export default function PropertiesResults() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { properties, isLoading: propertiesLoading } = useProperties()
  
  const [activeTab, setActiveTab] = useState<OperationTab>('venta')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('recent')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')

  // Filtros avanzados
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [bedrooms, setBedrooms] = useState<string>('all')
  const [bathrooms, setBathrooms] = useState<string>('all')
  const [minArea, setMinArea] = useState<string>('')
  const [maxArea, setMaxArea] = useState<string>('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const analytics = useAnalytics()
  const hasTrackedResults = useRef(false)

  // Track UX metrics
  const { trackCustomMetric, trackEmptyState } = useUXMetrics({
    componentName: 'PropertiesResults',
    trackLoadTime: true,
    trackScrollDepth: true
  })

  const pushParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams?.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

    const query = params.toString()
    router.push(`/propiedades/resultado${query ? `?${query}` : ''}`)
  }

  // Leer parámetros de la URL - solo cuando cambian los searchParams
  useEffect(() => {
    const operation = searchParams?.get('operation')
    const type = searchParams?.get('type')
    const location = searchParams?.get('location')

    if (operation === 'venta' || operation === 'alquiler') {
      setActiveTab(operation)
    }

    if (type && type !== 'all') {
      setSelectedType(type)
    } else {
      setSelectedType('all')
    }

    if (location) {
      setSelectedLocation(location)
      setSearchTerm(location)
    } else {
      setSelectedLocation('all')
      setSearchTerm('')
    }
  }, [searchParams])

  useEffect(() => {
    if (!propertiesLoading && !hasTrackedResults.current) {
      trackCustomMetric('properties_loaded', properties.length)
      hasTrackedResults.current = true
    }
  }, [propertiesLoading, properties.length, trackCustomMetric])

  const types = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'casa', label: 'Casa' },
    { value: 'departamento', label: 'Departamento' },
    { value: 'terreno', label: 'Terreno' },
    { value: 'local', label: 'Local Comercial' },
    { value: 'oficina', label: 'Oficina' },
    { value: 'cochera', label: 'Cochera' }
  ]

  const currentProperties = useMemo(() => {
    return properties.filter(prop => 
      prop.operation === activeTab && prop.status === 'disponible'
    )
  }, [properties, activeTab])

  const filteredProperties = useMemo(() => {
    if (propertiesLoading) return []

    try {
      const featured = searchParams?.get('featured')

      return currentProperties.filter(property => {
        // Solo mostrar propiedades disponibles
        if (property.status !== 'disponible') return false

        // Filtro por destacadas (si viene en URL)
        if (featured === 'true' && !property.featured) return false

        // Filtro por tipo
        if (selectedType !== 'all' && property.type !== selectedType) return false

        // Filtro por ubicación/búsqueda
        if (searchTerm && searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase().trim()
          const titleMatch = property.title.toLowerCase().includes(searchLower)
          const locationMatch = property.location.toLowerCase().includes(searchLower)
          const descriptionMatch = property.description.toLowerCase().includes(searchLower)

          if (!titleMatch && !locationMatch && !descriptionMatch) return false
        }

        // Filtro por ubicación específica si está seleccionada
        if (selectedLocation !== 'all' && selectedLocation) {
          const locationLower = property.location.toLowerCase()
          const selectedLower = selectedLocation.toLowerCase()
          if (!locationLower.includes(selectedLower)) return false
        }

        // Filtro por rango de precio
        if (minPrice && property.price < parseFloat(minPrice)) return false
        if (maxPrice && property.price > parseFloat(maxPrice)) return false

        // Filtro por dormitorios
        if (bedrooms !== 'all') {
          const bedroomsNum = parseInt(bedrooms)
          if (bedrooms === '4+') {
            if (!property.bedrooms || property.bedrooms < 4) return false
          } else {
            if (property.bedrooms !== bedroomsNum) return false
          }
        }

        // Filtro por baños
        if (bathrooms !== 'all') {
          const bathroomsNum = parseInt(bathrooms)
          if (bathrooms === '3+') {
            if (!property.bathrooms || property.bathrooms < 3) return false
          } else {
            if (property.bathrooms !== bathroomsNum) return false
          }
        }

        // Filtro por área
        if (minArea && property.area < parseFloat(minArea)) return false
        if (maxArea && property.area > parseFloat(maxArea)) return false

        return true
      })
    } catch (error) {
      console.error('Error filtering properties:', error)
      return currentProperties.filter(p => p.status === 'disponible')
    }
  }, [currentProperties, selectedType, selectedLocation, searchTerm, searchParams, propertiesLoading, minPrice, maxPrice, bedrooms, bathrooms, minArea, maxArea])

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

  const handleTabChange = (tab: OperationTab) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    pushParams({ operation: tab })
    analytics.trackEvent({
      event: 'properties_tab_change',
      category: 'properties',
      action: 'switch_operation',
      label: tab
    })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  const handleClearFilters = () => {
    setSelectedType('all')
    setSortBy('recent')
    setSearchTerm('')
    setSelectedLocation('all')
    setMinPrice('')
    setMaxPrice('')
    setBedrooms('all')
    setBathrooms('all')
    setMinArea('')
    setMaxArea('')
    pushParams({ type: null, location: null, featured: null })
    analytics.trackEvent({
      event: 'properties_filters_reset',
      category: 'properties',
      action: 'reset_filters'
    })
  }

  const hasActiveFilters = () => {
    return selectedType !== 'all' || searchTerm || minPrice || maxPrice ||
           bedrooms !== 'all' || bathrooms !== 'all' || minArea || maxArea
  }

  const removeFilter = (filterName: string) => {
    switch (filterName) {
      case 'type':
        setSelectedType('all')
        break
      case 'search':
        setSearchTerm('')
        break
      case 'minPrice':
        setMinPrice('')
        break
      case 'maxPrice':
        setMaxPrice('')
        break
      case 'bedrooms':
        setBedrooms('all')
        break
      case 'bathrooms':
        setBathrooms('all')
        break
      case 'minArea':
        setMinArea('')
        break
      case 'maxArea':
        setMaxArea('')
        break
    }
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    analytics.trackEvent({
      event: 'properties_view_mode',
      category: 'properties',
      action: 'change_view',
      label: mode
    })
  };

  return (
    <div className={styles.resultsPage}>
      {/* Hero Header */}
      <div className={styles.heroHeader}>
        <div className="container">
          {/* Breadcrumbs */}
          <nav className={styles.breadcrumbs} aria-label="breadcrumb">
            <button
              className={styles.breadcrumbLink}
              onClick={() => router.push('/')}
            >
              Inicio
            </button>
            <span className={styles.breadcrumbSeparator}>/</span>
            <button
              className={styles.breadcrumbLink}
              onClick={() => router.push('/propiedades')}
            >
              Propiedades
            </button>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>
              {activeTab === 'venta' ? 'En Venta' : 'En Alquiler'}
            </span>
          </nav>

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

      <div className={styles.tabsContainer}>
        <div className={styles.tabs} role="tablist" aria-label="Tipo de operación">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'venta'}
            className={`${styles.tab} ${activeTab === 'venta' ? styles.active : ''}`}
            onClick={() => handleTabChange('venta')}
          >
            <span aria-hidden="true">🏠</span> Comprar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'alquiler'}
            className={`${styles.tab} ${activeTab === 'alquiler' ? styles.active : ''}`}
            onClick={() => handleTabChange('alquiler')}
          >
            <span aria-hidden="true">🔑</span> Alquilar
          </button>
        </div>
      </div>

      <div className="container">
        {/* Filtros Rápidos y Controles de Vista */}
        <section className={styles.filtersPanel}>
          <div className={styles.quickFilters}>
            <div className={styles.filterGroup}>
              <label htmlFor="searchInput">Buscar</label>
              <div className={styles.searchField}>
              <input
                id="searchInput"
                type="search"
                placeholder="Ej: Nueva Córdoba, 3 dormitorios, casa"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <button
                  type="button"
                  className={styles.clearSearchBtn}
                  aria-label="Limpiar búsqueda"
                  onClick={() => handleSearchChange('')}
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="typeFilter">Tipo de propiedad</label>
            <select
              id="typeFilter"
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
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="sortFilter">Ordenar</label>
            <select
              id="sortFilter"
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
          </div>

            {/* Botón de Filtros Avanzados */}
            <div className={styles.filterGroup}>
              <button
                type="button"
                className={styles.advancedFiltersToggle}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              >
                {showAdvancedFilters ? '▲' : '▼'} Filtros avanzados
              </button>
            </div>
          </div>

          {/* Panel de Filtros Avanzados */}
          {showAdvancedFilters && (
            <div className={styles.advancedFiltersPanel}>
              <div className={styles.advancedFiltersGrid}>
                {/* Rango de Precio */}
                <div className={styles.filterGroup}>
                  <label>Rango de precio</label>
                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      placeholder="Mín"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeSeparator}>-</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className={styles.rangeInput}
                    />
                  </div>
                </div>

                {/* Dormitorios */}
                <div className={styles.filterGroup}>
                  <label htmlFor="bedroomsFilter">Dormitorios</label>
                  <select
                    id="bedroomsFilter"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">Cualquiera</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4+">4+</option>
                  </select>
                </div>

                {/* Baños */}
                <div className={styles.filterGroup}>
                  <label htmlFor="bathroomsFilter">Baños</label>
                  <select
                    id="bathroomsFilter"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    className={styles.filterSelect}
                  >
                    <option value="all">Cualquiera</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3+">3+</option>
                  </select>
                </div>

                {/* Rango de Área */}
                <div className={styles.filterGroup}>
                  <label>Área (m²)</label>
                  <div className={styles.rangeInputs}>
                    <input
                      type="number"
                      placeholder="Mín"
                      value={minArea}
                      onChange={(e) => setMinArea(e.target.value)}
                      className={styles.rangeInput}
                    />
                    <span className={styles.rangeSeparator}>-</span>
                    <input
                      type="number"
                      placeholder="Máx"
                      value={maxArea}
                      onChange={(e) => setMaxArea(e.target.value)}
                      className={styles.rangeInput}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Badges de Filtros Activos */}
          {hasActiveFilters() && (
            <div className={styles.activeFilters}>
              <span className={styles.activeFiltersLabel}>Filtros activos:</span>
              <div className={styles.filterBadges}>
                {selectedType !== 'all' && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('type')}
                  >
                    Tipo: {types.find(t => t.value === selectedType)?.label}
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
                {searchTerm && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('search')}
                  >
                    Buscar: {searchTerm}
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
                {minPrice && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('minPrice')}
                  >
                    Precio mín: ${parseFloat(minPrice).toLocaleString()}
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
                {maxPrice && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('maxPrice')}
                  >
                    Precio máx: ${parseFloat(maxPrice).toLocaleString()}
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
                {bedrooms !== 'all' && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('bedrooms')}
                  >
                    Dormitorios: {bedrooms}
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
                {bathrooms !== 'all' && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('bathrooms')}
                  >
                    Baños: {bathrooms}
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
                {minArea && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('minArea')}
                  >
                    Área mín: {parseFloat(minArea).toLocaleString()} m²
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
                {maxArea && (
                  <button
                    type="button"
                    className={styles.filterBadge}
                    onClick={() => removeFilter('maxArea')}
                  >
                    Área máx: {parseFloat(maxArea).toLocaleString()} m²
                    <span className={styles.badgeRemove}>×</span>
                  </button>
                )}
              </div>
            </div>
          )}

            <div className={styles.toolbar}>
              <div className={styles.resultsCount}>
                {sortedProperties.length} propiedad{sortedProperties.length !== 1 ? 'es' : ''} encontrada{sortedProperties.length !== 1 ? 's' : ''}
              </div>

            <div className={styles.viewModeButtons}>
              <button
                className={`${styles.viewModeBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => handleViewModeChange('grid')}
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
                onClick={() => handleViewModeChange('list')}
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
                onClick={() => handleViewModeChange('map')}
                title="Vista en mapa"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2C6.69 2 4 4.69 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.31-2.69-6-6-6zm0 8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </button>
            </div>

            <button
              type="button"
              className={styles.clearFiltersBtn}
              onClick={handleClearFilters}
              disabled={selectedType === 'all' && sortBy === 'recent' && !searchTerm}
            >
              Restablecer filtros
            </button>
            </div>
        </section>

        {/* Resultados */}
        {propertiesLoading ? (
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
