'use client'

import { useState, useEffect } from 'react'
import type { Property } from '@/data/properties'

const PROPERTIES_STORAGE_KEY = 'julieta-arena-properties'

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar propiedades desde localStorage o datos iniciales
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY)
      if (stored) {
        const parsedProperties = JSON.parse(stored)
        setProperties(parsedProperties)
      } else {
        // Si no hay datos guardados, cargar desde el archivo de propiedades
        import('@/data/properties').then(module => {
          setProperties(module.properties)
          // Guardar por primera vez
          localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(module.properties))
        })
      }
      setIsLoading(false)
    } catch (err) {
      console.error('Error loading properties:', err)
      setError('Error al cargar propiedades')
      setIsLoading(false)
    }
  }, [])

  // Guardar en localStorage
  const saveProperties = (updatedProperties: Property[]) => {
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(updatedProperties))
      setProperties(updatedProperties)
      return true
    } catch (err) {
      console.error('Error saving properties:', err)
      setError('Error al guardar propiedades')
      return false
    }
  }

  // Crear nueva propiedad
  const createProperty = (propertyData: Omit<Property, 'id'>): boolean => {
    const newProperty: Property = {
      ...propertyData,
      id: `prop-${Date.now()}`
    }
    const updatedProperties = [...properties, newProperty]
    return saveProperties(updatedProperties)
  }

  // Actualizar propiedad
  const updateProperty = (id: string, updates: Partial<Property>): boolean => {
    const updatedProperties = properties.map(prop => 
      prop.id === id ? { ...prop, ...updates } : prop
    )
    return saveProperties(updatedProperties)
  }

  // Eliminar propiedad
  const deleteProperty = (id: string): boolean => {
    const updatedProperties = properties.filter(prop => prop.id !== id)
    return saveProperties(updatedProperties)
  }

  // Obtener propiedad por ID
  const getPropertyById = (id: string): Property | undefined => {
    return properties.find(prop => prop.id === id)
  }

  return {
    properties,
    isLoading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    refreshProperties: () => {
      const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY)
      if (stored) {
        setProperties(JSON.parse(stored))
      }
    }
  }
}

