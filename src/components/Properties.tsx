'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { properties, Property, getPropertiesForSale, getPropertiesForRent } from '@/data/properties'
import PropertyCard from './PropertyCard'
import MapPlaceholder from './MapPlaceholder'
import { useAnalytics } from '@/hooks/useAnalytics'
import styles from './Properties.module.css'

export default function Properties() {
  const searchParams = useSearchParams()
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
  const analytics = useAnalytics()

  // Leer parámetros de la URL al cargar
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

    if (featured === 'true') {
      // Mostrar solo propiedades destacadas
      // Esto se manejará en el filtrado
    }
  }, [searchParams])

  const types = ['all', 'casa', 'departamento', 'terreno', 'local', 'oficina']
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
    'oficina': 'Oficinas'
  }

  const currentProperties = activeTab === 'venta' ? getPropertiesForSale() : getPropertiesForRent()

  // Ajustar rango de precios según la pestaña activa
  const currentPriceRange = useMemo(() => {
    const maxPrice = activeTab === 'venta' ? 200000000 : 500000
    return priceRange.max > maxPrice ? { min: 0, max: maxPrice } : priceRange
  }, [activeTab, priceRange])

  const filteredProperties = useMemo(() => {
    const featured = searchParams.get('featured')
    
    return currentProperties.filter(property => {
      // Filtro por destacadas (si viene en URL)
      if (featured === 'true' && !property.featured) return false
      
      // Filtro por tipo
      if (selectedType !== 'all' && property.type !== selectedType) return false
      
      // Filtro por ubicación
      if (selectedLocation !== 'all' && !property.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false
      
      // Filtro por precio
      if (property.price < currentPriceRange.min || property.price > currentPriceRange.max) return false
      
      // Filtro por área
      if (property.area < areaRange.min || property.area > areaRange.max) return false
      
      // Filtro por dormitorios
      if (bedrooms !== 'all') {
        const bedroomCount = property.bedrooms || 0
        if (bedrooms === '5+' && bedroomCount < 5) return false
        if (bedrooms !== '5+' && bedroomCount !== parseInt(bedrooms)) return false
      }
      
      // Filtro por baños
      if (bathrooms !== 'all') {
        const bathroomCount = property.bathrooms || 0
        if (bathrooms === '4+' && bathroomCount < 4) return false
        if (bathrooms !== '4+' && bathroomCount !== parseInt(bathrooms)) return false
      }
      
      // Filtro por año de construcción
      if (yearBuilt !== 'all' && property.yearBuilt) {
        const year = property.yearBuilt
        const yearFilter = parseInt(yearBuilt.replace('+', ''))
        if (year < yearFilter) return false
      }
      
      // Filtro por características
      if (features.length > 0) {
        const hasAllFeatures = features.every(feature => 
          property.features.some(propFeature => 
            propFeature.toLowerCase().includes(feature.toLowerCase())
          )
        )
        if (!hasAllFeatures) return false
      }
      
      // Filtro por búsqueda
      if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !property.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.location.toLowerCase().includes(searchTerm.toLowerCase())) return false
      
      return property.status === 'disponible'
    })
  }, [currentProperties, selectedType, selectedLocation, currentPriceRange, areaRange, bedrooms, bathrooms, yearBuilt, features, searchTerm, searchParams])

  // Track search events
  useEffect(() => {
    if (searchTerm) {
      analytics.trackSearch(searchTerm, filteredProperties.length, {
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
  }, [searchTerm, filteredProperties.length, selectedType, selectedLocation, currentPriceRange, areaRange, bedrooms, bathrooms, yearBuilt, features, analytics])

  const featuredProperties = properties.filter(prop => prop.featured && prop.status === 'disponible')

  const formatPrice = (price: number): string => {
    if (activeTab === 'alquiler') {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    } else {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    }
  }

  return (
    <section className="section" id="propiedades">
      <div className="container" style={{ maxWidth: '100%', padding: '0 20px' }}>
        {/* Pestañas de Venta/Alquiler */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'venta' ? styles.active : ''}`}
              onClick={() => setActiveTab('venta')}
            >
              🏠 En Venta
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'alquiler' ? styles.active : ''}`}
              onClick={() => setActiveTab('alquiler')}
            >
              🔑 En Alquiler
            </button>
          </div>
        </div>

        {/* Filtros Horizontales Rápidos */}
        <div className={styles.quickFilters}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.quickFilterSelect}
          >
            {types.map(type => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className={styles.quickFilterSelect}
          >
            <option value="all">Todas las ubicaciones</option>
            {locations.filter(loc => loc !== 'all').map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={styles.quickFilterSelect}
          >
            <option value="all">Cualquier habitación</option>
            {bedroomOptions.filter(opt => opt !== 'all').map(option => (
              <option key={option} value={option}>
                {option === '5+' ? '5+ hab.' : `${option} hab.`}
              </option>
            ))}
          </select>

          <button
            className={styles.advancedFiltersBtn}
            onClick={() => {
              const sidebar = document.querySelector(`.${styles.sidebarFilters}`)
              sidebar?.classList.toggle(styles.visible)
            }}
          >
            🔍 Filtros Avanzados
          </button>

          {(selectedType !== 'all' || selectedLocation !== 'all' || bedrooms !== 'all') && (
            <button 
              onClick={() => {
                setSelectedType('all')
                setSelectedLocation('all')
                setBedrooms('all')
              }}
              className={styles.clearQuickFiltersBtn}
            >
              ✕ Limpiar
            </button>
          )}
        </div>

        {/* Layout con Sidebar */}
        <div className={styles.propertiesLayout}>
          {/* Sidebar Izquierdo - Filtros */}
          <aside className={styles.sidebarFilters}>
            <div className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <h4>Filtros Avanzados</h4>
            <button 
              onClick={() => {
                setSelectedType('all')
                setSelectedLocation('all')
                setPriceRange({ min: 0, max: activeTab === 'venta' ? 200000000 : 500000 })
                setAreaRange({ min: 0, max: 1000 })
                setBedrooms('all')
                setBathrooms('all')
                setYearBuilt('all')
                setFeatures([])
                setSearchTerm('')
              }}
              className={styles.clearAllBtn}
            >
              Limpiar todo
            </button>
          </div>

          <div className={styles.filtersGrid}>
            {/* Búsqueda */}
            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                Buscar
              </label>
              <input
                type="text"
                placeholder="Ubicación, tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.filterSelect}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Tipo de propiedad
              </label>
              <select 
                value={selectedType} 
                onChange={(e) => setSelectedType(e.target.value)}
                className={styles.filterSelect}
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {typeLabels[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                Ubicación
              </label>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className={styles.filterSelect}
              >
                {locations.map(location => (
                  <option key={location} value={location}>
                    {location === 'all' ? 'Todas las ubicaciones' : location}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Rango de precio
              </label>
              <div className={styles.priceRange}>
                <div className={styles.priceDisplay}>
                  <span className={styles.priceMin}>{formatPrice(currentPriceRange.min)}</span>
                  <span className={styles.priceSeparator}>-</span>
                  <span className={styles.priceMax}>{formatPrice(currentPriceRange.max)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={activeTab === 'venta' ? 200000000 : 500000}
                  step={activeTab === 'venta' ? 5000000 : 10000}
                  value={currentPriceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className={styles.priceSlider}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <path d="M9 9h6v6H9z"></path>
                </svg>
                Área (m²)
              </label>
              <div className={styles.areaRange}>
                <div className={styles.areaDisplay}>
                  <span className={styles.areaMin}>{areaRange.min}m²</span>
                  <span className={styles.areaSeparator}>-</span>
                  <span className={styles.areaMax}>{areaRange.max}m²</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={areaRange.max}
                  onChange={(e) => setAreaRange({ ...areaRange, max: parseInt(e.target.value) })}
                  className={styles.areaSlider}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Dormitorios
              </label>
              <select 
                value={bedrooms} 
                onChange={(e) => setBedrooms(e.target.value)}
                className={styles.filterSelect}
              >
                {bedroomOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'Cualquiera' : `${option} dormitorio${option !== '1' ? 's' : ''}`}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Baños
              </label>
              <select 
                value={bathrooms} 
                onChange={(e) => setBathrooms(e.target.value)}
                className={styles.filterSelect}
              >
                {bathroomOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'Cualquiera' : `${option} baño${option !== '1' ? 's' : ''}`}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Año de construcción
              </label>
              <select 
                value={yearBuilt} 
                onChange={(e) => setYearBuilt(e.target.value)}
                className={styles.filterSelect}
              >
                {yearOptions.map(option => (
                  <option key={option} value={option}>
                    {option === 'all' ? 'Cualquiera' : option}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"></path>
                  <rect x="9" y="11" width="6" height="11"></rect>
                  <path d="M9 7h6v4H9z"></path>
                </svg>
                Características
              </label>
              <div className={styles.featuresFilter}>
                {availableFeatures.map(feature => (
                  <label key={feature} className={styles.featureCheckbox}>
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
                    />
                    <span className={styles.featureLabel}>{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
            </div>
          </aside>

          {/* Contenido Principal */}
          <main className={styles.mainContent}>
            {/* Propiedades destacadas */}
            {featuredProperties.filter(prop => prop.operation === activeTab).length > 0 && (
              <div className={styles.featuredSection}>
                <h3 className={styles.featuredTitle}>⭐ Propiedades Destacadas</h3>
                <div className={styles.featuredGrid}>
                  {featuredProperties.filter(prop => prop.operation === activeTab).map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            )}

            {/* Resultados */}
            <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h3>
              {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''} encontrada{filteredProperties.length !== 1 ? 's' : ''}
            </h3>
            {(selectedType !== 'all' || selectedLocation !== 'all' || searchTerm || currentPriceRange.max < (activeTab === 'venta' ? 200000000 : 500000) || areaRange.max < 1000 || bedrooms !== 'all' || bathrooms !== 'all' || yearBuilt !== 'all' || features.length > 0) && (
              <button 
                onClick={() => {
                  setSelectedType('all')
                  setSelectedLocation('all')
                  setPriceRange({ min: 0, max: activeTab === 'venta' ? 200000000 : 500000 })
                  setAreaRange({ min: 0, max: 1000 })
                  setBedrooms('all')
                  setBathrooms('all')
                  setYearBuilt('all')
                  setFeatures([])
                  setSearchTerm('')
                }}
                className={styles.clearFiltersBtn}
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {filteredProperties.length > 0 ? (
            <div className={styles.propertiesGrid}>
              {filteredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              <p>No se encontraron propiedades con los filtros seleccionados.</p>
              <p>Intenta ajustar tus criterios de búsqueda.</p>
            </div>
          )}
        </div>
          </main>
        </div>
      </div>
    </section>
  )
}
