'use client'

import { useState, CSSProperties } from 'react'
import { Property } from '@/data/properties'
import { usePropertyComparator } from '@/hooks/usePropertyComparator'

interface CompareButtonProps {
  property: Property
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

const sizeStyles: Record<string, CSSProperties> = {
  small: {
    width: '32px',
    height: '32px',
    fontSize: '0.875rem',
  },
  medium: {
    width: '40px',
    height: '40px',
    fontSize: '1rem',
  },
  large: {
    width: '48px',
    height: '48px',
    fontSize: '1.25rem',
  },
}

const baseButtonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  backgroundColor: '#ffffff',
  border: '2px solid #e5e7eb',
  borderRadius: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  position: 'relative',
}

const activeButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  backgroundColor: '#2c5f7d',
  borderColor: '#2c5f7d',
  color: '#ffffff',
}

const disabledButtonStyle: CSSProperties = {
  ...baseButtonStyle,
  opacity: 0.5,
  cursor: 'not-allowed',
}

const iconStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const textStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  whiteSpace: 'nowrap',
}

const tooltipStyle: CSSProperties = {
  position: 'absolute',
  bottom: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#1a4158',
  color: '#ffffff',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  marginBottom: '0.5rem',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.2s, visibility 0.2s',
  pointerEvents: 'none',
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
  } = usePropertyComparator()

  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

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

  const getButtonStyle = (): CSSProperties => {
    let style: CSSProperties = { ...baseButtonStyle, ...sizeStyles[size] }

    if (showText) {
      style = { ...style, width: 'auto', padding: '0 1rem' }
    }

    if (inComparison) {
      style = { ...style, ...activeButtonStyle }
    }

    if (!canAdd && !inComparison) {
      style = { ...style, ...disabledButtonStyle }
    }

    if (isAnimating) {
      style = { ...style, transform: 'scale(1.1)' }
    }

    return style
  }

  return (
    <button
      style={getButtonStyle()}
      onClick={handleClick}
      disabled={!canAdd && !inComparison}
      aria-label={inComparison ? 'Quitar de comparacion' : 'Agregar a comparacion'}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span style={iconStyle}>
        {inComparison ? '⚖️' : '⚖️'}
      </span>
      {showText && (
        <span style={textStyle}>
          {inComparison ? 'En Comparacion' : canAdd ? 'Comparar' : 'Lleno'}
        </span>
      )}
      {!canAdd && !inComparison && (
        <span style={{
          ...tooltipStyle,
          opacity: showTooltip ? 1 : 0,
          visibility: showTooltip ? 'visible' : 'hidden',
        }}>
          Maximo {3} propiedades
        </span>
      )}
    </button>
  )
}
