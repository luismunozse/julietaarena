'use client'

import { useState, useMemo } from 'react'
import { properties, Property, getPropertiesForSale, getPropertiesForRent } from '@/data/properties'
import PropertyCard from './PropertyCard'
import styles from './Properties.module.css'

export default function Properties() {
  const [activeTab, setActiveTab] = useState<'venta' | 'alquiler'>('venta')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 200000000 })
  const [searchTerm, setSearchTerm] = useState('')

  const types = ['all', 'casa', 'departamento', 'terreno', 'local', 'oficina']
  const locations = ['all', 'Villa Allende', 'Nueva Córdoba', 'Villa Carlos Paz', 'Centro', 'Barrio Norte', 'Torre Empresarial', 'Barrio Jardín', 'Barrio Güemes']

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
  const maxPrice = activeTab === 'venta' ? 200000000 : 500000
  const currentPriceRange = priceRange.max > maxPrice ? { min: 0, max: maxPrice } : priceRange

  const filteredProperties = useMemo(() => {
    return currentProperties.filter(property => {
      // Filtro por tipo
      if (selectedType !== 'all' && property.type !== selectedType) return false
      
      // Filtro por ubicación
      if (selectedLocation !== 'all' && !property.location.toLowerCase().includes(selectedLocation.toLowerCase())) return false
      
      // Filtro por precio
      if (property.price < currentPriceRange.min || property.price > currentPriceRange.max) return false
      
      // Filtro por búsqueda
      if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !property.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !property.location.toLowerCase().includes(searchTerm.toLowerCase())) return false
      
      return property.status === 'disponible'
    })
  }, [currentProperties, selectedType, selectedLocation, currentPriceRange, searchTerm])

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
      <div className="container">
        {/* Buscador Principal */}
        <div className={styles.searchHero}>
          <div className={styles.searchContainer}>
            <div className={styles.searchHeader}>
              <h3>🔍 Encuentra tu propiedad ideal</h3>
              <p>Busca entre nuestras propiedades disponibles</p>
            </div>
            
            <div className={styles.searchBox}>
              <div className={styles.searchInputContainer}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Buscar por ubicación, tipo o características..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className={styles.clearSearchBtn}
                    aria-label="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <button className={styles.searchBtn}>
                <span>Buscar</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12,5 19,12 12,19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>

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

        {/* Filtros Avanzados */}
        <div className={styles.filtersSection}>
          <div className={styles.filtersHeader}>
            <h4>Filtros Avanzados</h4>
            <button 
              onClick={() => {
                setSelectedType('all')
                setSelectedLocation('all')
                setPriceRange({ min: 0, max: maxPrice })
                setSearchTerm('')
              }}
              className={styles.clearAllBtn}
            >
              Limpiar todo
            </button>
          </div>

          <div className={styles.filtersGrid}>
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
                  max={maxPrice}
                  step={activeTab === 'venta' ? 5000000 : 10000}
                  value={currentPriceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                  className={styles.priceSlider}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className={styles.resultsSection}>
          <div className={styles.resultsHeader}>
            <h3>
              {filteredProperties.length} propiedad{filteredProperties.length !== 1 ? 'es' : ''} encontrada{filteredProperties.length !== 1 ? 's' : ''}
            </h3>
            {(selectedType !== 'all' || selectedLocation !== 'all' || searchTerm || currentPriceRange.max < maxPrice) && (
              <button 
                onClick={() => {
                  setSelectedType('all')
                  setSelectedLocation('all')
                  setPriceRange({ min: 0, max: maxPrice })
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
      </div>
    </section>
  )
}
