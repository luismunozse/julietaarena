'use client'

import { useState } from 'react'
import { usePropertyComparator } from '@/hooks/usePropertyComparator'
import PropertyComparison from './PropertyComparison'
import styles from './ComparisonFloatingButton.module.css'

export default function ComparisonFloatingButton() {
  const { comparisonProperties, clearComparison } = usePropertyComparator()
  const [showComparison, setShowComparison] = useState(false)

  if (comparisonProperties.length === 0) {
    return null
  }

  return (
    <>
      <div className={styles.floatingButton}>
        <button
          className={styles.comparisonBtn}
          onClick={() => setShowComparison(true)}
        >
          <span className={styles.comparisonIcon}>⚖️</span>
          <span className={styles.comparisonText}>
            Comparar ({comparisonProperties.length})
          </span>
        </button>
        
        <button
          className={styles.clearBtn}
          onClick={clearComparison}
          title="Limpiar comparación"
        >
          ✕
        </button>
      </div>

      {showComparison && (
        <PropertyComparison onClose={() => setShowComparison(false)} />
      )}
    </>
  )
}
