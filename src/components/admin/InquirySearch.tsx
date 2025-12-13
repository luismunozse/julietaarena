'use client'

import { useState } from 'react'
import styles from './InquirySearch.module.css'

interface InquirySearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filterStatus: string
  onStatusChange: (status: string) => void
  filterProperty?: string
  onPropertyChange?: (property: string) => void
  filterService?: string
  onServiceChange?: (service: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  type: 'consultas' | 'contactos'
}

export default function InquirySearch({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterProperty,
  onPropertyChange,
  filterService,
  onServiceChange,
  hasActiveFilters,
  onClearFilters,
  type,
}: InquirySearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchHeader}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder={type === 'consultas' 
              ? "Buscar por nombre, email, teléfono, propiedad, mensaje..."
              : "Buscar por nombre, email, teléfono, servicio, mensaje..."
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        <div className={styles.searchActions}>
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
              <label>Estado</label>
              <select
                value={filterStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="todas">Todos los estados</option>
                <option value="nueva">Nueva</option>
                <option value="leida">Leída</option>
                <option value="contactada">Contactada</option>
                <option value="cerrada">Cerrada</option>
              </select>
            </div>

            {type === 'consultas' && filterProperty !== undefined && onPropertyChange && (
              <div className={styles.filterGroup}>
                <label>Propiedad</label>
                <input
                  type="text"
                  placeholder="Buscar por propiedad..."
                  value={filterProperty}
                  onChange={(e) => onPropertyChange(e.target.value)}
                  className={styles.filterInput}
                />
              </div>
            )}

            {type === 'contactos' && filterService !== undefined && onServiceChange && (
              <div className={styles.filterGroup}>
                <label>Servicio</label>
                <select
                  value={filterService}
                  onChange={(e) => onServiceChange(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="todos">Todos los servicios</option>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                  <option value="tasacion">Tasación</option>
                  <option value="asesoramiento">Asesoramiento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
