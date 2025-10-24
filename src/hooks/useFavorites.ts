'use client'

import { useState, useEffect } from 'react'

const FAVORITES_KEY = 'julieta-arena-favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    // Cargar favoritos del localStorage
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])

  const addToFavorites = (propertyId: string) => {
    const newFavorites = [...favorites, propertyId]
    setFavorites(newFavorites)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
  }

  const removeFromFavorites = (propertyId: string) => {
    const newFavorites = favorites.filter(id => id !== propertyId)
    setFavorites(newFavorites)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
  }

  const toggleFavorite = (propertyId: string) => {
    if (isFavorite(propertyId)) {
      removeFromFavorites(propertyId)
    } else {
      addToFavorites(propertyId)
    }
  }

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId)
  }

  const clearFavorites = () => {
    setFavorites([])
    localStorage.removeItem(FAVORITES_KEY)
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites
  }
}
