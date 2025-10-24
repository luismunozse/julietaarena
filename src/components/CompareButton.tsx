'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import { usePropertyComparator } from '@/hooks/usePropertyComparator'
import styles from './CompareButton.module.css'

interface CompareButtonProps {
  property: Property
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

export default function CompareButton({ 
  property, 
  size = 'medium',
  showText = false 
}: CompareButtonProps) {
  const { 
    isInComparison, 
    addToComparison, 
    removeFromComparison, 
    canAddToComparison,
    isFull 
  } = usePropertyComparator()
  
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    
    if (isInComparison(property.id)) {
      removeFromComparison(property.id)
    } else {
      addToComparison(property)
    }
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  const inComparison = isInComparison(property.id)
  const canAdd = canAddToComparison(property.id)

  return (
    <button
      className={`${styles.compareButton} ${styles[size]} ${inComparison ? styles.active : ''} ${isAnimating ? styles.animate : ''} ${!canAdd && !inComparison ? styles.disabled : ''}`}
      onClick={handleClick}
      disabled={!canAdd && !inComparison}
      aria-label={inComparison ? 'Quitar de comparación' : 'Agregar a comparación'}
    >
      <span className={styles.compareIcon}>
        {inComparison ? '⚖️' : '⚖️'}
      </span>
      {showText && (
        <span className={styles.compareText}>
          {inComparison ? 'En Comparación' : canAdd ? 'Comparar' : 'Lleno'}
        </span>
      )}
      {!canAdd && !inComparison && (
        <span className={styles.tooltip}>
          Máximo {3} propiedades
        </span>
      )}
    </button>
  )
}
