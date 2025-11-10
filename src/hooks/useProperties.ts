'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Property } from '@/data/properties'
import { properties as initialProperties } from '@/data/properties'
import { useAuth } from '@/hooks/useAuth'
import { getPublicImageUrl } from '@/lib/storage'

const PROPERTIES_STORAGE_KEY = 'julieta-arena-properties'

// Función helper para convertir Property a formato Supabase
const normalizeImages = (images?: string[] | null) => {
  if (!Array.isArray(images)) return []
  return images
    .map(image => image?.trim())
    .filter((image): image is string => Boolean(image))
    .map(image => getPublicImageUrl(image))
}

const propertyToSupabase = (property: Property) => ({
  id: property.id,
  title: property.title,
  description: property.description,
  price: property.price,
  currency: property.currency ?? 'USD',
  location: property.location,
  type: property.type,
  bedrooms: property.bedrooms ?? null,
  bathrooms: property.bathrooms ?? null,
  area: property.area,
  covered_area: property.coveredArea ?? null,
  images: property.images ?? [],
  features: property.features ?? [],
  status: property.status,
  featured: property.featured,
  year_built: property.yearBuilt ?? null,
  parking: property.parking ?? null,
  floor: property.floor ?? null,
  total_floors: property.totalFloors ?? null,
  orientation: property.orientation ?? null,
  expenses: property.expenses ?? null,
  operation: property.operation,
  broker_name: property.broker?.name ?? null,
  broker_phone: property.broker?.phone ?? null,
  broker_email: property.broker?.email ?? null,
  broker_avatar: property.broker?.avatar ?? null,
  latitude: property.coordinates?.lat ?? null,
  longitude: property.coordinates?.lng ?? null,
})

// Función helper para convertir formato Supabase a Property
const supabaseToProperty = (data: any): Property => ({
  id: data.id,
  title: data.title,
  description: data.description,
  price: data.price,
  currency: data.currency || 'USD',
  location: data.location,
  type: data.type,
  bedrooms: data.bedrooms ?? undefined,
  bathrooms: data.bathrooms ?? undefined,
  area: data.area,
  coveredArea: data.covered_area ?? undefined,
  images: normalizeImages(data.images),
  features: Array.isArray(data.features) ? data.features : [],
  status: data.status,
  featured: data.featured,
  yearBuilt: data.year_built ?? undefined,
  parking: data.parking ?? undefined,
  floor: data.floor ?? undefined,
  totalFloors: data.total_floors ?? undefined,
  orientation: data.orientation ?? undefined,
  expenses: data.expenses ?? undefined,
  operation: data.operation,
  broker: data.broker_name
    ? {
        name: data.broker_name,
        phone: data.broker_phone,
        email: data.broker_email,
        avatar: data.broker_avatar,
      }
    : undefined,
  coordinates:
    data.latitude && data.longitude
      ? {
          lat: data.latitude,
          lng: data.longitude,
        }
      : undefined,
  createdBy: data.created_by ?? undefined,
  updatedBy: data.updated_by ?? undefined,
  createdAt: data.created_at ?? undefined,
  updatedAt: data.updated_at ?? undefined,
})

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useSupabase, setUseSupabase] = useState(false)
  const { user } = useAuth()

  const migrateInitialProperties = useCallback(async (userId?: string | null) => {
    if (!userId) {
      console.warn('Se requiere un usuario autenticado para migrar propiedades de ejemplo.')
      return
    }

    if (initialProperties.length === 0) return

    try {
      const supabaseProperties = initialProperties.map(property => ({
        ...propertyToSupabase(property),
        created_by: property.createdBy ?? userId,
        updated_by: property.updatedBy ?? userId,
      }))

      const { error } = await supabase.from('properties').insert(supabaseProperties)

      if (error) {
        console.error('Error migrando propiedades:', error)
      }
    } catch (err) {
      console.error('Error en migración:', err)
    }
  }, [])

  const loadProperties = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Intentar cargar desde Supabase primero
      const { data, error: supabaseError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (!supabaseError && data) {
        // Supabase está disponible
        setUseSupabase(true)
        const mappedProperties = data.map(supabaseToProperty)

        // Si no hay propiedades en Supabase pero hay en initialProperties, migrar
        if (mappedProperties.length === 0 && initialProperties.length > 0) {
          await migrateInitialProperties(user?.id)
          // Recargar después de migrar
          const { data: newData } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false })
          if (newData) {
            setProperties(newData.map(supabaseToProperty))
          }
        } else {
          setProperties(mappedProperties)
        }
      } else {
        // Fallback a localStorage
        setUseSupabase(false)
        const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY)
        if (stored) {
          const parsedProperties = JSON.parse(stored)
          setProperties(parsedProperties)
        } else if (initialProperties.length > 0) {
          // Si no hay nada en localStorage, usar propiedades iniciales
          setProperties(initialProperties)
          localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(initialProperties))
        } else {
          setProperties([])
        }
      }
    } catch (err) {
      console.error('Error loading properties:', err)
      setError('Error al cargar propiedades')
      setUseSupabase(false)
      // Fallback a localStorage
      try {
        const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY)
        if (stored) {
          setProperties(JSON.parse(stored))
        } else {
          setProperties([])
        }
      } catch {
        setProperties([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [migrateInitialProperties, user?.id])

  // Cargar propiedades (desde Supabase o localStorage)
  useEffect(() => {
    void loadProperties()
  }, [loadProperties])

  // Guardar en localStorage (fallback)
  const saveToLocalStorage = (updatedProperties: Property[]) => {
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(updatedProperties))
      setProperties(updatedProperties)
      return true
    } catch (err) {
      console.error('Error saving to localStorage:', err)
      setError('Error al guardar propiedades')
      return false
    }
  }

  // Crear nueva propiedad
  const createProperty = async (propertyData: Omit<Property, 'id'>): Promise<boolean> => {
    try {
      const timestamp = new Date().toISOString()
      const newProperty: Property = {
        ...propertyData,
        id: `prop-${Date.now()}`,
        createdAt: propertyData.createdAt ?? timestamp,
        updatedAt: propertyData.updatedAt ?? timestamp,
      }

      if (useSupabase) {
        if (!user?.id) {
          setError('Necesitas iniciar sesión para crear propiedades.')
          return false
        }

        // Guardar en Supabase
        const propertyWithOwner: Property = {
          ...newProperty,
          createdBy: user.id,
          updatedBy: user.id,
        }
        const supabaseData = {
          ...propertyToSupabase(propertyWithOwner),
          created_by: user.id,
          updated_by: user.id,
        }

        const { error: insertError } = await supabase
          .from('properties')
          .insert([supabaseData])

        if (insertError) {
          console.error('Error creating property in Supabase:', insertError)
          console.error('Error details:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code
          })
          setError(`Error al crear propiedad: ${insertError.message}`)
          return false
        }

        // Recargar propiedades
        await loadProperties()
        return true
      } else {
        // Guardar en localStorage
        const updatedProperties = [...properties, newProperty]
        return saveToLocalStorage(updatedProperties)
      }
    } catch (err) {
      console.error('Error creating property:', err)
      setError('Error al crear propiedad')
      return false
    }
  }

  // Actualizar propiedad
  const updateProperty = async (id: string, updates: Partial<Property>): Promise<boolean> => {
    try {
      if (useSupabase) {
        if (!user?.id) {
          setError('Necesitas iniciar sesión para actualizar propiedades.')
          return false
        }

        // Actualizar en Supabase
        const currentProperty = properties.find(p => p.id === id)
        if (!currentProperty) {
          setError('Propiedad no encontrada')
          return false
        }

        const updatedProperty: Property = {
          ...currentProperty,
          ...updates,
          updatedBy: user.id,
          updatedAt: new Date().toISOString(),
        }
        const supabaseData = {
          ...propertyToSupabase(updatedProperty),
          updated_by: user.id,
        }

        const { error: updateError } = await supabase
          .from('properties')
          .update(supabaseData)
          .eq('id', id)

        if (updateError) {
          console.error('Error updating property in Supabase:', updateError)
          setError(updateError.message || 'Error al actualizar propiedad')
          return false
        }

        // Recargar propiedades
        await loadProperties()
        return true
      } else {
        // Actualizar en localStorage
        const updatedProperties = properties.map(prop =>
          prop.id === id
            ? { ...prop, ...updates, updatedAt: new Date().toISOString() }
            : prop
        )
        return saveToLocalStorage(updatedProperties)
      }
    } catch (err) {
      console.error('Error updating property:', err)
      setError('Error al actualizar propiedad')
      return false
    }
  }

  // Eliminar propiedad
  const deleteProperty = async (id: string): Promise<boolean> => {
    try {
      if (useSupabase) {
        if (!user?.id) {
          setError('Necesitas iniciar sesión para eliminar propiedades.')
          return false
        }

        const existingProperty = properties.find(p => p.id === id)
        if (!existingProperty) {
          setError('Propiedad no encontrada')
          return false
        }

        if (existingProperty.createdBy && existingProperty.createdBy !== user.id) {
          setError('Solo el creador puede eliminar esta propiedad.')
          return false
        }

        const { error: deleteError } = await supabase
          .from('properties')
          .delete()
          .eq('id', id)

        if (deleteError) {
          console.error('❌ Error deleting property in Supabase:', deleteError)
          setError(deleteError.message || 'Error al eliminar propiedad')
          return false
        }

        // Recargar propiedades
        await loadProperties()
        return true
      } else {
        // Eliminar de localStorage
        const updatedProperties = properties.filter(prop => prop.id !== id)
        return saveToLocalStorage(updatedProperties)
      }
    } catch (err) {
      console.error('❌ Error deleting property:', err)
      setError('Error al eliminar propiedad')
      return false
    }
  }

  // Obtener propiedad por ID
  const getPropertyById = (id: string): Property | undefined => {
    return properties.find(prop => prop.id === id)
  }

  // Refrescar propiedades
  const refreshProperties = async () => {
    await loadProperties()
  }

  return {
    properties,
    isLoading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    refreshProperties,
    useSupabase, // Exponer si está usando Supabase
  }
}
