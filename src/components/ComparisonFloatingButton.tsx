'use client'

import { useState, CSSProperties } from 'react'
import { usePropertyComparator } from '@/hooks/usePropertyComparator'
import PropertyComparison from './PropertyComparison'

const styles: Record<string, CSSProperties> = {
  floatingButton: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    zIndex: 999,
  },
  comparisonBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1.5rem',
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.9375rem',
    transition: 'all 0.3s',
  },
  comparisonIcon: {
    fontSize: '1.25rem',
  },
  comparisonText: {
    whiteSpace: 'nowrap',
  },
  clearBtn: {
    width: '36px',
    height: '36px',
    backgroundColor: '#ffffff',
    color: '#636e72',
    border: '1px solid #e5e7eb',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '0.875rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
}

export default function ComparisonFloatingButton() {
  const { comparisonProperties, clearComparison } = usePropertyComparator()
  const [showComparison, setShowComparison] = useState(false)

  if (comparisonProperties.length === 0) {
    return null
  }

  return (
    <>
      <div style={styles.floatingButton}>
        <button
          style={styles.comparisonBtn}
          onClick={() => setShowComparison(true)}
        >
          <span style={styles.comparisonIcon}>⚖️</span>
          <span style={styles.comparisonText}>
            Comparar ({comparisonProperties.length})
          </span>
        </button>

        <button
          style={styles.clearBtn}
          onClick={clearComparison}
          title="Limpiar comparacion"
        >
          X
        </button>
      </div>

      {showComparison && (
        <PropertyComparison onClose={() => setShowComparison(false)} />
      )}
    </>
  )
}
