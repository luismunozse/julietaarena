'use client'

import { useState, useEffect } from 'react'
import { Property } from '@/data/properties'

const COMPARATOR_KEY = 'julieta-arena-comparator'

export function usePropertyComparator() {
  const [comparisonProperties, setComparisonProperties] = useState<Property[]>([])
  const maxProperties = 3

  useEffect(() => {
    // Cargar propiedades del comparador del localStorage
    const stored = localStorage.getItem(COMPARATOR_KEY)
    if (stored) {
      try {
        const propertyIds = JSON.parse(stored)
        // Aquí necesitarías cargar las propiedades por ID desde tu store
        // Por ahora lo dejamos vacío
        setComparisonProperties([])
      } catch (error) {
        console.error('Error loading comparison properties:', error)
      }
    }
  }, [])

  const addToComparison = (property: Property) => {
    if (comparisonProperties.length >= maxProperties) {
      return false // No se puede agregar más
    }

    if (comparisonProperties.some(p => p.id === property.id)) {
      return false // Ya está en la comparación
    }

    const newComparison = [...comparisonProperties, property]
    setComparisonProperties(newComparison)
    localStorage.setItem(COMPARATOR_KEY, JSON.stringify(newComparison.map(p => p.id)))
    return true
  }

  const removeFromComparison = (propertyId: string) => {
    const newComparison = comparisonProperties.filter(p => p.id !== propertyId)
    setComparisonProperties(newComparison)
    localStorage.setItem(COMPARATOR_KEY, JSON.stringify(newComparison.map(p => p.id)))
  }

  const clearComparison = () => {
    setComparisonProperties([])
    localStorage.removeItem(COMPARATOR_KEY)
  }

  const isInComparison = (propertyId: string) => {
    return comparisonProperties.some(p => p.id === propertyId)
  }

  const canAddToComparison = (propertyId: string) => {
    return !isInComparison(propertyId) && comparisonProperties.length < maxProperties
  }

  return {
    comparisonProperties,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    canAddToComparison,
    maxProperties,
    isFull: comparisonProperties.length >= maxProperties
  }
}
