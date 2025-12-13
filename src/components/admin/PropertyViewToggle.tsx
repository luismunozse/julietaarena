'use client'

import { useState } from 'react'
import type { Property } from '@/data/properties'
import styles from './PropertyViewToggle.module.css'

type ViewMode = 'grid' | 'table' | 'list'

interface PropertyViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export default function PropertyViewToggle({
  viewMode,
  onViewModeChange,
  onSortChange,
  sortBy,
  sortOrder,
}: PropertyViewToggleProps) {
  return (
    <div className={styles.viewControls}>
      <div className={styles.viewToggle}>
        <button
          onClick={() => onViewModeChange('grid')}
          className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
          title="Vista de grilla"
        >
          ⬜ Grilla
        </button>
        <button
          onClick={() => onViewModeChange('table')}
          className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
          title="Vista de tabla"
        >
          ☰ Tabla
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
          title="Vista de lista"
        >
          ☰ Lista
        </button>
      </div>

      <div className={styles.sortControls}>
        <label>Ordenar por:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, sortOrder)}
          className={styles.sortSelect}
        >
          <option value="createdAt">Fecha de creación</option>
          <option value="updatedAt">Fecha de modificación</option>
          <option value="price">Precio</option>
          <option value="title">Título</option>
          <option value="location">Ubicación</option>
        </select>
        <button
          onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          className={styles.sortOrderButton}
          title={sortOrder === 'asc' ? 'Orden descendente' : 'Orden ascendente'}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  )
}

