'use client'

import { useState } from 'react'
import type { Property } from '@/data/properties'
import { exportToCSV, exportToJSON } from '@/lib/export'
import styles from './ExportButton.module.css'

interface ExportButtonProps {
  properties: Property[]
  disabled?: boolean
}

export default function ExportButton({ properties, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true)
    try {
      if (format === 'csv') {
        exportToCSV(properties)
      } else {
        exportToJSON(properties)
      }
      // Pequeño delay para mejor UX
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (err) {
      console.error('Error al exportar:', err)
    } finally {
      setIsExporting(false)
      setShowMenu(false)
    }
  }

  return (
    <div className={styles.exportContainer}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={disabled || isExporting || properties.length === 0}
        className={styles.exportButton}
      >
        {isExporting ? '⏳ Exportando...' : '📥 Exportar'}
      </button>
      
      {showMenu && (
        <>
          <div className={styles.backdrop} onClick={() => setShowMenu(false)} />
          <div className={styles.menu}>
            <button
              onClick={() => handleExport('csv')}
              className={styles.menuItem}
            >
              📊 Exportar a CSV (Excel)
            </button>
            <button
              onClick={() => handleExport('json')}
              className={styles.menuItem}
            >
              📄 Exportar a JSON
            </button>
          </div>
        </>
      )}
    </div>
  )
}

