'use client'

import { useState } from 'react'
import type { Property } from '@/data/properties'
import styles from './BulkActions.module.css'

interface BulkActionsProps {
  selectedIds: Set<string>
  properties: Property[]
  onSelectAll: () => void
  onDeselectAll: () => void
  onBulkStatusChange: (status: 'disponible' | 'reservado' | 'vendido') => Promise<void>
  onBulkFeaturedToggle: (featured: boolean) => Promise<void>
  onBulkDelete: () => Promise<void>
  onBulkExport: () => void
}

export default function BulkActions({
  selectedIds,
  properties,
  onSelectAll,
  onDeselectAll,
  onBulkStatusChange,
  onBulkFeaturedToggle,
  onBulkDelete,
  onBulkExport,
}: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (selectedIds.size === 0) {
    return null
  }

  const handleBulkAction = async (action: () => Promise<void>) => {
    setIsProcessing(true)
    try {
      await action()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.bulkActionsBar}>
      <div className={styles.bulkInfo}>
        <span className={styles.selectedCount}>
          {selectedIds.size} {selectedIds.size === 1 ? 'propiedad seleccionada' : 'propiedades seleccionadas'}
        </span>
        <button
          onClick={selectedIds.size === properties.length ? onDeselectAll : onSelectAll}
          className={styles.selectAllButton}
        >
          {selectedIds.size === properties.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </button>
      </div>

      <div className={styles.bulkButtons}>
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleBulkAction(() => onBulkStatusChange(e.target.value as 'disponible' | 'reservado' | 'vendido'))
              e.target.value = ''
            }
          }}
          disabled={isProcessing}
          className={styles.bulkSelect}
        >
          <option value="">Cambiar estado...</option>
          <option value="disponible">Marcar como Disponible</option>
          <option value="reservado">Marcar como Reservado</option>
          <option value="vendido">Marcar como Vendido</option>
        </select>

        <button
          onClick={() => handleBulkAction(() => onBulkFeaturedToggle(true))}
          disabled={isProcessing}
          className={styles.bulkButton}
        >
          ⭐ Destacar
        </button>

        <button
          onClick={() => handleBulkAction(() => onBulkFeaturedToggle(false))}
          disabled={isProcessing}
          className={styles.bulkButton}
        >
          ⭐ Quitar destacado
        </button>

        <button
          onClick={onBulkExport}
          disabled={isProcessing}
          className={styles.bulkButton}
        >
          📥 Exportar
        </button>

        <button
          onClick={() => handleBulkAction(onBulkDelete)}
          disabled={isProcessing}
          className={`${styles.bulkButton} ${styles.deleteButton}`}
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  )
}

