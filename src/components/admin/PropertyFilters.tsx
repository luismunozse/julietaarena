'use client'

import { useState } from 'react'
import type { PropertyFilters } from '@/hooks/usePropertyFilters'
import styles from './PropertyFilters.module.css'

interface PropertyFiltersProps {
  filters: PropertyFilters
  onFilterChange: (key: keyof PropertyFilters, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function PropertyFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filtersHeader}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Buscar por título, descripción, ubicación..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        <div className={styles.filtersActions}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.toggleButton}
          >
            {isExpanded ? '▲' : '▼'} Filtros Avanzados
          </button>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className={styles.clearButton}
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className={styles.advancedFilters}>
          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Tipo</label>
              <select
                value={filters.type}
                onChange={(e) => onFilterChange('type', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todos los tipos</option>
                <option value="casa">Casas</option>
                <option value="departamento">Departamentos</option>
                <option value="terreno">Terrenos</option>
                <option value="local">Locales</option>
                <option value="oficina">Oficinas</option>
                <option value="cochera">Cocheras</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Operación</label>
              <select
                value={filters.operation}
                onChange={(e) => onFilterChange('operation', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todas las operaciones</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Estado</label>
              <select
                value={filters.status}
                onChange={(e) => onFilterChange('status', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todos los estados</option>
                <option value="disponible">Disponible</option>
                <option value="reservado">Reservado</option>
                <option value="vendido">Vendido</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Destacada</label>
              <select
                value={filters.featured}
                onChange={(e) => onFilterChange('featured', e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">Todas</option>
                <option value="yes">Solo destacadas</option>
                <option value="no">No destacadas</option>
              </select>
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Precio Mínimo</label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => onFilterChange('priceMin', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Precio Máximo</label>
              <input
                type="number"
                placeholder="Sin límite"
                value={filters.priceMax}
                onChange={(e) => onFilterChange('priceMax', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Área Mínima (m²)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.areaMin}
                onChange={(e) => onFilterChange('areaMin', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Área Máxima (m²)</label>
              <input
                type="number"
                placeholder="Sin límite"
                value={filters.areaMax}
                onChange={(e) => onFilterChange('areaMax', e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterGroup}>
              <label>Fecha Desde</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
                className={styles.filterInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Fecha Hasta</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

