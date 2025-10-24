'use client'

import { useState } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import styles from './FavoriteButton.module.css'

interface FavoriteButtonProps {
  propertyId: string
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
}

export default function FavoriteButton({ 
  propertyId, 
  size = 'medium',
  showText = false 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    toggleFavorite(propertyId)
    
    // Reset animation after a short delay
    setTimeout(() => setIsAnimating(false), 300)
  }

  const favorite = isFavorite(propertyId)

  return (
    <button
      className={`${styles.favoriteButton} ${styles[size]} ${favorite ? styles.active : ''} ${isAnimating ? styles.animate : ''}`}
      onClick={handleClick}
      aria-label={favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <span className={styles.heartIcon}>
        {favorite ? '❤️' : '🤍'}
      </span>
      {showText && (
        <span className={styles.favoriteText}>
          {favorite ? 'En Favoritos' : 'Agregar a Favoritos'}
        </span>
      )}
    </button>
  )
}
