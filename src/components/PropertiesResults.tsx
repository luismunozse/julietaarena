'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import PropertyCard from './PropertyCard'
import PropertyCardList from './PropertyCardList'
import PropertyMap from './PropertyMap'
import SkeletonLoader from './SkeletonLoader'
import EmptyState from './EmptyState'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useUXMetrics } from '@/hooks/useUXMetrics'
import {
  Search, X, ChevronDown, ChevronUp, Grid3X3, List, MapPin,
  Home, Key, SlidersHorizontal, RotateCcw
} from 'lucide-react'

/* =============================================================================
   TYPES
============================================================================= */

type ViewMode = 'grid' | 'list' | 'map'
type OperationTab = 'venta' | 'alquiler'

/* =============================================================================
   CONSTANTS
============================================================================= */

const PROPERTY_TYPES = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'casa', label: 'Casa' },
  { value: 'departamento', label: 'Departamento' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'local', label: 'Local Comercial' },
  { value: 'oficina', label: 'Oficina' },
  { value: 'cochera', label: 'Cochera' }
]

const SORT_OPTIONS = [
  { value: 'recent', label: 'Más recientes' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'area-asc', label: 'Área: menor a mayor' },
  { value: 'area-desc', label: 'Área: mayor a menor' }
]

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

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

  // Advanced filters
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')
  const [bedrooms, setBedrooms] = useState<string>('all')
  const [bathrooms, setBathrooms] = useState<string>('all')
  const [minArea, setMinArea] = useState<string>('')
  const [maxArea, setMaxArea] = useState<string>('')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const analytics = useAnalytics()
  const hasTrackedResults = useRef(false)

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

  useEffect(() => {
    const operation = searchParams?.get('operation')
    const type = searchParams?.get('type')
    const location = searchParams?.get('location')

    if (operation === 'venta' || operation === 'alquiler') {
      setActiveTab(operation)
    }
    setSelectedType(type && type !== 'all' ? type : 'all')
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
        if (property.status !== 'disponible') return false
        if (featured === 'true' && !property.featured) return false
        if (selectedType !== 'all' && property.type !== selectedType) return false

        if (searchTerm && searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase().trim()
          const titleLower = property.title.toLowerCase()
          const locationLower = property.location.toLowerCase()
          const descriptionLower = property.description.toLowerCase()
          // Buscar en ambas direcciones: la propiedad contiene el término O el término contiene la ubicación
          const titleMatch = titleLower.includes(searchLower) || searchLower.includes(titleLower)
          const locationMatch = locationLower.includes(searchLower) || searchLower.includes(locationLower)
          const descriptionMatch = descriptionLower.includes(searchLower)
          if (!titleMatch && !locationMatch && !descriptionMatch) return false
        } else if (selectedLocation !== 'all' && selectedLocation) {
          // Solo aplicar filtro de selectedLocation si no hay searchTerm (evitar duplicar)
          const locationLower = property.location.toLowerCase()
          const selectedLower = selectedLocation.toLowerCase()
          if (!locationLower.includes(selectedLower) && !selectedLower.includes(locationLower)) return false
        }

        if (minPrice && property.price < parseFloat(minPrice)) return false
        if (maxPrice && property.price > parseFloat(maxPrice)) return false

        if (bedrooms !== 'all') {
          const bedroomsNum = parseInt(bedrooms)
          if (bedrooms === '4+') {
            if (!property.bedrooms || property.bedrooms < 4) return false
          } else {
            if (property.bedrooms !== bedroomsNum) return false
          }
        }

        if (bathrooms !== 'all') {
          const bathroomsNum = parseInt(bathrooms)
          if (bathrooms === '3+') {
            if (!property.bathrooms || property.bathrooms < 3) return false
          } else {
            if (property.bathrooms !== bathroomsNum) return false
          }
        }

        if (minArea && property.area < parseFloat(minArea)) return false
        if (maxArea && property.area > parseFloat(maxArea)) return false

        return true
      })
    } catch (error) {
      console.error('Error filtering properties:', error)
      return currentProperties.filter(p => p.status === 'disponible')
    }
  }, [currentProperties, selectedType, selectedLocation, searchTerm, searchParams, propertiesLoading, minPrice, maxPrice, bedrooms, bathrooms, minArea, maxArea])

  const sortedProperties = useMemo(() => {
    return [...filteredProperties].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'area-asc': return a.area - b.area
        case 'area-desc': return b.area - a.area
        default: return 0
      }
    })
  }, [filteredProperties, sortBy])

  const handleTabChange = (tab: OperationTab) => {
    if (tab === activeTab) return
    setActiveTab(tab)
    pushParams({ operation: tab })
    analytics.trackEvent({ event: 'properties_tab_change', category: 'properties', action: 'switch_operation', label: tab })
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
  }

  const hasActiveFilters = selectedType !== 'all' || searchTerm || minPrice || maxPrice || bedrooms !== 'all' || bathrooms !== 'all' || minArea || maxArea

  const inputClasses = "w-full h-11 px-4 text-sm bg-white border border-border rounded-lg outline-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
  const selectClasses = "h-11 px-3 text-sm bg-white border border-border rounded-lg outline-none cursor-pointer transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary py-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <button onClick={() => router.push('/')} className="hover:text-white transition-colors">
              Inicio
            </button>
            <span>/</span>
            <button onClick={() => router.push('/propiedades')} className="hover:text-white transition-colors">
              Propiedades
            </button>
            <span>/</span>
            <span className="text-white">{activeTab === 'venta' ? 'En Venta' : 'En Alquiler'}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            {activeTab === 'venta' ? <Home className="w-7 h-7" /> : <Key className="w-7 h-7" />}
            Propiedades en {activeTab === 'venta' ? 'Venta' : 'Alquiler'}
          </h1>
          {searchTerm && (
            <p className="text-white/70 mt-2">
              Resultados para: <strong className="text-white">{searchTerm}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            <button
              onClick={() => handleTabChange('venta')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'venta'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              <Home className="w-4 h-4" />
              Comprar
            </button>
            <button
              onClick={() => handleTabChange('alquiler')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'alquiler'
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-muted hover:text-foreground'
              }`}
            >
              <Key className="w-4 h-4" />
              Alquilar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-border p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="search"
                placeholder="Buscar ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClasses} pl-10`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={selectClasses}
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={selectClasses}
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center justify-center gap-2 h-11 px-4 text-sm font-medium text-brand-primary bg-brand-primary/10 rounded-lg hover:bg-brand-primary/20 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
              {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t border-border">
              {/* Price Range */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Precio</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Mín" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={`${inputClasses} text-center`} />
                  <span className="text-muted">-</span>
                  <input type="number" placeholder="Máx" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={`${inputClasses} text-center`} />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Dormitorios</label>
                <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={`${selectClasses} w-full`}>
                  <option value="all">Cualquiera</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4+">4+</option>
                </select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Baños</label>
                <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} className={`${selectClasses} w-full`}>
                  <option value="all">Cualquiera</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3+">3+</option>
                </select>
              </div>

              {/* Area Range */}
              <div>
                <label className="block text-xs font-medium text-muted mb-1.5">Área (m²)</label>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Mín" value={minArea} onChange={(e) => setMinArea(e.target.value)} className={`${inputClasses} text-center`} />
                  <span className="text-muted">-</span>
                  <input type="number" placeholder="Máx" value={maxArea} onChange={(e) => setMaxArea(e.target.value)} className={`${inputClasses} text-center`} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">{sortedProperties.length}</span> propiedad{sortedProperties.length !== 1 ? 'es' : ''} encontrada{sortedProperties.length !== 1 ? 's' : ''}
          </p>

          <div className="flex items-center gap-2">
            {/* View Mode Buttons */}
            <div className="flex bg-white rounded-lg border border-border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-brand-primary text-white' : 'text-muted hover:text-foreground'}`}
                title="Vista grilla"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-brand-primary text-white' : 'text-muted hover:text-foreground'}`}
                title="Vista lista"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'map' ? 'bg-brand-primary text-white' : 'text-muted hover:text-foreground'}`}
                title="Vista mapa"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {propertiesLoading ? (
          <SkeletonLoader type={viewMode === 'list' ? 'list' : 'card'} count={viewMode === 'map' ? 1 : 6} />
        ) : sortedProperties.length > 0 ? (
          <>
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {sortedProperties.map(property => (
                  <PropertyCardList key={property.id} property={property} />
                ))}
              </div>
            )}

            {viewMode === 'map' && (
              <div className="bg-white rounded-xl border border-border overflow-hidden" style={{ height: 'calc(100vh - 350px)', minHeight: '400px' }}>
                <PropertyMap properties={sortedProperties} height="100%" />
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
