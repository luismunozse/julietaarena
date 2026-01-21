'use client'

import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Property } from '@/data/properties'
import PropertyCard from './PropertyCard'
import MapPlaceholder from './MapPlaceholder'
import VirtualizedPropertyList from './VirtualizedPropertyList'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useProperties } from '@/hooks/useProperties'
import { debounce } from '@/lib/debounce'

export default function Properties() {
  const searchParams = useSearchParams()
  const { properties, isLoading } = useProperties()
  const [activeTab, setActiveTab] = useState<'venta' | 'alquiler'>('venta')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 200000000 })
  const [areaRange, setAreaRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })
  const [bedrooms, setBedrooms] = useState<string>('all')
  const [bathrooms, setBathrooms] = useState<string>('all')
  const [yearBuilt, setYearBuilt] = useState<string>('all')
  const [features, setFeatures] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [showSidebar, setShowSidebar] = useState(false)
  const analytics = useAnalytics()

  const handleClearAllFilters = useCallback(() => {
    setSelectedType('all')
    setSelectedLocation('all')
    setPriceRange({ min: 0, max: activeTab === 'venta' ? 200000000 : 500000 })
    setAreaRange({ min: 0, max: 1000 })
    setBedrooms('all')
    setBathrooms('all')
    setYearBuilt('all')
    setFeatures([])
    setSearchTerm('')
  }, [activeTab])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value)
  }, [])

  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value)
  }, [])

  const handleBedroomsChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setBedrooms(e.target.value)
  }, [])

  const clearFilters = useCallback(() => {
    handleClearAllFilters()
  }, [handleClearAllFilters])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
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
  }, [searchParams])

  const types = ['all', 'casa', 'departamento', 'terreno', 'local', 'oficina', 'cochera']
  const locations = ['all', 'Villa Allende', 'Nueva Córdoba', 'Villa Carlos Paz', 'Centro', 'Barrio Norte', 'Torre Empresarial', 'Barrio Jardín', 'Barrio Güemes']
  const bedroomOptions = ['all', '1', '2', '3', '4', '5+']
  const bathroomOptions = ['all', '1', '2', '3', '4+']
  const yearOptions = ['all', '2020+', '2015+', '2010+', '2000+', '1990+', '1980+']
  const availableFeatures = [
    'Jardín', 'Parrilla', 'Pileta', 'Garaje', 'Ascensor', 'Seguridad 24hs',
    'Aire acondicionado', 'Calefacción', 'Lavadero', 'Balcón', 'Terraza',
    'Closets empotrados', 'Pisos de madera', 'Cocina integrada'
  ]

  const typeLabels: { [key: string]: string } = {
    'all': 'Todas',
    'casa': 'Casas',
    'departamento': 'Departamentos',
    'terreno': 'Terrenos',
    'local': 'Locales',
    'oficina': 'Oficinas',
    'cochera': 'Cocheras'
  }

  const currentProperties = useMemo(() => {
    return properties.filter(prop =>
      prop.operation === activeTab && prop.status === 'disponible'
    )
  }, [properties, activeTab])

  const currentPriceRange = useMemo(() => {
    const maxPrice = activeTab === 'venta' ? 200000000 : 500000
    return priceRange.max > maxPrice ? { min: 0, max: maxPrice } : priceRange
  }, [activeTab, priceRange])

  const filteredProperties = useMemo(() => {
    if (isLoading) return []

    const featured = searchParams.get('featured')

    return currentProperties.filter(property => {
      if (featured === 'true' && !property.featured) return false
      if (selectedType !== 'all' && property.type !== selectedType) return false
      if (selectedLocation !== 'all' && !property.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false
      if (property.price < currentPriceRange.min || property.price > currentPriceRange.max) return false
      if (property.area < areaRange.min || property.area > areaRange.max) return false

      if (bedrooms !== 'all') {
        const bedroomCount = property.bedrooms || 0
        if (bedrooms === '5+' && bedroomCount < 5) return false
        if (bedrooms !== '5+' && bedroomCount !== parseInt(bedrooms)) return false
      }

      if (bathrooms !== 'all') {
        const bathroomCount = property.bathrooms || 0
        if (bathrooms === '4+' && bathroomCount < 4) return false
        if (bathrooms !== '4+' && bathroomCount !== parseInt(bathrooms)) return false
      }

      if (yearBuilt !== 'all' && property.yearBuilt) {
        const year = property.yearBuilt
        const yearFilter = parseInt(yearBuilt.replace('+', ''))
        if (year < yearFilter) return false
      }

      if (features.length > 0) {
        const hasAllFeatures = features.every(feature =>
          property.features.some(propFeature =>
            propFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
        if (!hasAllFeatures) return false
      }

      if (debouncedSearchTerm.trim() &&
        !property.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
        !property.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
        !property.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) return false

      return property.status === 'disponible'
    })
  }, [currentProperties, selectedType, selectedLocation, currentPriceRange, areaRange, bedrooms, bathrooms, yearBuilt, features, debouncedSearchTerm, searchParams, isLoading])

  useEffect(() => {
    if (debouncedSearchTerm) {
      analytics.trackSearch(debouncedSearchTerm, filteredProperties.length, {
        type: selectedType,
        location: selectedLocation,
        priceRange: currentPriceRange,
        areaRange,
        bedrooms,
        bathrooms,
        yearBuilt,
        features
      })
    }
  }, [debouncedSearchTerm, filteredProperties.length, selectedType, selectedLocation, currentPriceRange, areaRange, bedrooms, bathrooms, yearBuilt, features, analytics])

  const featuredProperties = useMemo(() => {
    return properties.filter(prop => prop.featured && prop.status === 'disponible')
  }, [properties])

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const selectStyle: React.CSSProperties = {
    padding: '10px 14px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#374151',
    background: 'white',
    cursor: 'pointer',
    minWidth: '150px'
  }

  const labelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  }

  return (
    <section id="propiedades" style={{ padding: '60px 0', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', background: 'white', borderRadius: '12px', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => setActiveTab('venta')}
              style={{
                padding: '12px 32px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === 'venta' ? 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)' : 'transparent',
                color: activeTab === 'venta' ? 'white' : '#636e72'
              }}
            >
              En Venta
            </button>
            <button
              onClick={() => setActiveTab('alquiler')}
              style={{
                padding: '12px 32px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === 'alquiler' ? 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)' : 'transparent',
                color: activeTab === 'alquiler' ? 'white' : '#636e72'
              }}
            >
              En Alquiler
            </button>
          </div>
        </div>

        {/* Quick Filters */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} style={selectStyle}>
            {types.map(type => (
              <option key={type} value={type}>{typeLabels[type]}</option>
            ))}
          </select>

          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} style={selectStyle}>
            <option value="all">Todas las ubicaciones</option>
            {locations.filter(loc => loc !== 'all').map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>

          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} style={selectStyle}>
            <option value="all">Cualquier habitación</option>
            {bedroomOptions.filter(opt => opt !== 'all').map(option => (
              <option key={option} value={option}>{option === '5+' ? '5+ hab.' : `${option} hab.`}</option>
            ))}
          </select>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            style={{
              padding: '10px 20px',
              background: showSidebar ? '#2c5f7d' : 'white',
              color: showSidebar ? 'white' : '#2c5f7d',
              border: '1px solid #2c5f7d',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Filtros Avanzados
          </button>

          {(selectedType !== 'all' || selectedLocation !== 'all' || bedrooms !== 'all') && (
            <button
              onClick={() => {
                setSelectedType('all')
                setSelectedLocation('all')
                setBedrooms('all')
              }}
              style={{
                padding: '10px 16px',
                background: '#fee2e2',
                color: '#dc2626',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Layout */}
        <div style={{ display: 'flex', gap: '24px' }}>
          {/* Sidebar */}
          {showSidebar && (
            <aside style={{
              width: '300px',
              flexShrink: 0,
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              height: 'fit-content',
              position: 'sticky',
              top: '100px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h4 style={{ fontWeight: '600', color: '#1a4158', margin: 0 }}>Filtros Avanzados</h4>
                <button
                  onClick={handleClearAllFilters}
                  style={{ fontSize: '14px', color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Limpiar todo
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Search */}
                <div>
                  <label style={labelStyle}>Buscar</label>
                  <input
                    type="text"
                    placeholder="Ubicación, tipo..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label style={labelStyle}>Rango de precio</label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#636e72' }}>
                    <span>{formatPrice(currentPriceRange.min)}</span>
                    <span>{formatPrice(currentPriceRange.max)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={activeTab === 'venta' ? 200000000 : 500000}
                    step={activeTab === 'venta' ? 5000000 : 10000}
                    value={currentPriceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#2c5f7d' }}
                  />
                </div>

                {/* Area Range */}
                <div>
                  <label style={labelStyle}>Área (m²)</label>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#636e72' }}>
                    <span>{areaRange.min}m²</span>
                    <span>{areaRange.max}m²</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="50"
                    value={areaRange.max}
                    onChange={(e) => setAreaRange({ ...areaRange, max: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: '#2c5f7d' }}
                  />
                </div>

                {/* Bathrooms */}
                <div>
                  <label style={labelStyle}>Baños</label>
                  <select
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value)}
                    style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }}
                  >
                    {bathroomOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'all' ? 'Cualquiera' : `${option} baño${option !== '1' ? 's' : ''}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year Built */}
                <div>
                  <label style={labelStyle}>Año de construcción</label>
                  <select
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value)}
                    style={{ ...selectStyle, width: '100%', boxSizing: 'border-box' }}
                  >
                    {yearOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'all' ? 'Cualquiera' : option}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Features */}
                <div>
                  <label style={labelStyle}>Características</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {availableFeatures.map(feature => (
                      <label
                        key={feature}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          background: features.includes(feature) ? '#e0f2fe' : '#f3f4f6',
                          borderRadius: '20px',
                          fontSize: '13px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={features.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFeatures([...features, feature])
                            } else {
                              setFeatures(features.filter(f => f !== feature))
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                        <span style={{ color: features.includes(feature) ? '#0369a1' : '#636e72' }}>{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main style={{ flex: 1 }}>
            {/* Featured Properties */}
            {featuredProperties.filter(prop => prop.operation === activeTab).length > 0 && (
              <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1a4158', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>⭐</span> Propiedades Destacadas
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {featuredProperties.filter(prop => prop.operation === activeTab).map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1a4158', margin: 0 }}>
                {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''} encontrada{filteredProperties.length !== 1 ? 's' : ''}
              </h3>
              {(selectedType !== 'all' || selectedLocation !== 'all' || debouncedSearchTerm || currentPriceRange.max < (activeTab === 'venta' ? 200000000 : 500000) || areaRange.max < 1000 || bedrooms !== 'all' || bathrooms !== 'all' || yearBuilt !== 'all' || features.length > 0) && (
                <button
                  onClick={clearFilters}
                  style={{
                    padding: '8px 16px',
                    background: 'transparent',
                    color: '#2c5f7d',
                    border: '1px solid #2c5f7d',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Results */}
            {filteredProperties.length > 0 ? (
              <VirtualizedPropertyList
                properties={filteredProperties}
                height={600}
                itemHeight={450}
              />
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 24px',
                background: 'white',
                borderRadius: '16px',
                border: '2px dashed #e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <p style={{ color: '#636e72', fontSize: '1.1rem' }}>No se encontraron propiedades con los filtros seleccionados.</p>
                <p style={{ color: '#9ca3af', marginTop: '8px' }}>Intenta ajustar tus criterios de búsqueda.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>
  )
}
