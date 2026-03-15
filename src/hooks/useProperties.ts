'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Property } from '@/data/properties'
import type { SupabaseProperty } from '@/types/supabase'
import { properties as initialProperties } from '@/data/properties'
import { useAuth } from '@/hooks/useAuth'
import { getPublicImageUrl } from '@/lib/storage'
import { validateAndParse, supabasePropertySchema } from '@/lib/validation'
import { logger } from '@/lib/logger'
import { normalizeError, getUserFriendlyMessage } from '@/lib/errors'
import { useToast } from '@/components/ToastContainer'

const PROPERTIES_STORAGE_KEY = 'julieta-arena-properties'

// Función helper para convertir Property a formato Supabase
const normalizeImages = (images?: string[] | null) => {
  if (!Array.isArray(images)) return []
  return images
    .map(image => image?.trim())
    .filter((image): image is string => Boolean(image))
    .map(image => getPublicImageUrl(image))
}

const propertyToSupabase = (property: Property): Omit<SupabaseProperty, 'created_at' | 'updated_at' | 'created_by' | 'updated_by'> => ({
  id: property.id,
  title: property.title,
  description: property.description,
  price: property.price,
  currency: property.currency ?? 'USD',
  location: property.location,
  type: property.type,
  bedrooms: property.bedrooms ?? null,
  bathrooms: property.bathrooms ?? null,
  rooms: property.rooms ?? null,
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
  disposition: property.disposition ?? null,
  expenses: property.expenses ?? null,
  operation: property.operation,
  condition: property.condition ?? null,
  apt_credit: property.aptCredit ?? null,
  internal_code: property.internalCode ?? null,
  video_url: property.videoUrl ?? null,
  services: property.services ?? null,
  documentation: property.documentation ?? null,
  broker_name: property.broker?.name ?? null,
  broker_phone: property.broker?.phone ?? null,
  broker_email: property.broker?.email ?? null,
  broker_avatar: property.broker?.avatar ?? null,
  latitude: property.coordinates?.lat ?? null,
  longitude: property.coordinates?.lng ?? null,
})

// Función para normalizar datos de Supabase antes de validar
// Maneja casos donde los datos vienen con tipos incorrectos (strings en lugar de numbers, JSON strings en lugar de arrays)
const normalizeSupabaseData = (data: Record<string, unknown>): Record<string, unknown> => {
  const normalized = { ...data }

  // Convertir strings a numbers donde corresponda
  const numericFields = ['price', 'area', 'covered_area', 'bedrooms', 'bathrooms', 'rooms', 'year_built', 'parking', 'floor', 'total_floors', 'expenses', 'latitude', 'longitude']
  for (const field of numericFields) {
    const value = normalized[field]
    // Empty strings or whitespace-only strings should become null
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed === '') {
        normalized[field] = null
      } else {
        const parsed = parseFloat(trimmed)
        normalized[field] = isNaN(parsed) ? null : parsed
      }
    }
  }

  // Parsear JSON strings a arrays
  const arrayFields = ['images', 'features', 'services', 'documentation']
  for (const field of arrayFields) {
    const value = normalized[field]
    if (typeof value === 'string') {
      try {
        normalized[field] = JSON.parse(value)
      } catch {
        normalized[field] = []
      }
    }
  }

  return normalized
}

// Función helper para convertir formato Supabase a Property con validación
const supabaseToProperty = (data: unknown): Property | null => {
  // Normalizar datos antes de validar
  const normalizedData = typeof data === 'object' && data !== null
    ? normalizeSupabaseData(data as Record<string, unknown>)
    : data

  // Validar datos con Zod
  const validation = validateAndParse(supabasePropertySchema, normalizedData, 'Datos de propiedad inválidos')

  if (!validation.success) {
    logger.error('Error validando propiedad de Supabase', {
      error: validation.error,
      details: validation.details?.issues,
    })
    return null
  }

  const validated = validation.data
  
  return {
    id: validated.id,
    title: validated.title,
    description: validated.description,
    price: validated.price,
    currency: validated.currency,
    location: validated.location,
    type: validated.type,
    bedrooms: validated.bedrooms ?? undefined,
    bathrooms: validated.bathrooms ?? undefined,
    rooms: validated.rooms ?? undefined,
    area: validated.area,
    coveredArea: validated.covered_area ?? undefined,
    images: normalizeImages(validated.images),
    features: Array.isArray(validated.features) ? validated.features : [],
    status: validated.status,
    featured: validated.featured,
    yearBuilt: validated.year_built ?? undefined,
    parking: validated.parking ?? undefined,
    floor: validated.floor ?? undefined,
    totalFloors: validated.total_floors ?? undefined,
    orientation: validated.orientation ?? undefined,
    disposition: validated.disposition ?? undefined,
    expenses: validated.expenses ?? undefined,
    operation: validated.operation,
    condition: validated.condition ?? undefined,
    aptCredit: validated.apt_credit ?? undefined,
    internalCode: validated.internal_code ?? undefined,
    videoUrl: validated.video_url ?? undefined,
    services: Array.isArray(validated.services) ? validated.services : undefined,
    documentation: Array.isArray(validated.documentation) ? validated.documentation : undefined,
    broker: validated.broker_name
      ? {
          name: validated.broker_name,
          phone: validated.broker_phone ?? '',
          email: validated.broker_email ?? '',
          avatar: validated.broker_avatar ?? undefined,
        }
      : undefined,
    coordinates:
      validated.latitude !== null && validated.longitude !== null
        ? {
            lat: validated.latitude,
            lng: validated.longitude,
          }
        : undefined,
    createdBy: validated.created_by ?? undefined,
    updatedBy: validated.updated_by ?? undefined,
    createdAt: validated.created_at ?? undefined,
    updatedAt: validated.updated_at ?? undefined,
  }
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useSupabase, setUseSupabase] = useState(false)
  const { user } = useAuth()
  const { error: showErrorToast, success: showSuccessToast } = useToast()

  const migrateInitialProperties = useCallback(async (userId?: string | null) => {
    if (!userId) {
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
        // migration error - non-fatal
      }
    } catch {
      // silently ignore
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
        const mappedProperties = data
          .map(supabaseToProperty)
          .filter((prop): prop is Property => prop !== null)

        // Si no hay propiedades en Supabase pero hay en initialProperties, migrar
        if (mappedProperties.length === 0 && initialProperties.length > 0) {
          await migrateInitialProperties(user?.id)
          // Recargar después de migrar
          const { data: newData } = await supabase
            .from('properties')
            .select('*')
            .order('created_at', { ascending: false })
          if (newData) {
            const reloadedProperties = newData
              .map(supabaseToProperty)
              .filter((prop): prop is Property => prop !== null)
            setProperties(reloadedProperties)
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
      const error = normalizeError(err)
      logger.error('Error loading properties', { userId: user?.id }, error)
      const errorMessage = getUserFriendlyMessage(error)
      setError(errorMessage)
      showErrorToast(errorMessage)
      setUseSupabase(false)
      // Fallback a localStorage
      try {
        const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Validar propiedades del localStorage también
          const validated = Array.isArray(parsed)
            ? parsed.filter((p: unknown) => {
                const validation = validateAndParse(supabasePropertySchema, p)
                return validation.success
              })
            : []
          setProperties(validated)
        } else {
          setProperties([])
        }
      } catch (localStorageError) {
        logger.error('Error parsing localStorage properties', {}, normalizeError(localStorageError))
        setProperties([])
      }
    } finally {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [migrateInitialProperties, user?.id])

  // Cargar propiedades (desde Supabase o localStorage)
  // Usar useCallback para evitar recreación de loadProperties en cada render
  useEffect(() => {
    void loadProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Solo ejecutar una vez al montar el componente

  // Guardar en localStorage (fallback)
  const saveToLocalStorage = (updatedProperties: Property[]) => {
    try {
      localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(updatedProperties))
      setProperties(updatedProperties)
      return true
    } catch (err) {
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
          const error = new Error(insertError.message)
          logger.error('Error creating property', { propertyId: newProperty.id, userId: user.id }, error)
          const errorMessage = `Error al crear propiedad: ${insertError.message}`
          setError(errorMessage)
          showErrorToast(errorMessage)
          return false
        }

        logger.info('Property created', { propertyId: newProperty.id, userId: user.id })
        showSuccessToast('Propiedad creada exitosamente')
        // Recargar propiedades
        await loadProperties()
        return true
      } else {
        // Guardar en localStorage
        const updatedProperties = [...properties, newProperty]
        return saveToLocalStorage(updatedProperties)
      }
    } catch (err) {
      const error = normalizeError(err)
      logger.error('Error creating property', { userId: user?.id }, error)
      const errorMessage = getUserFriendlyMessage(error)
      setError(errorMessage)
      showErrorToast(errorMessage)
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
          const error = new Error(updateError.message)
          logger.error('Error updating property', { propertyId: id, userId: user.id }, error)
          const errorMessage = updateError.message || 'Error al actualizar propiedad'
          setError(errorMessage)
          showErrorToast(errorMessage)
          return false
        }

        logger.info('Property updated', { propertyId: id, userId: user.id })
        showSuccessToast('Propiedad actualizada exitosamente')
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
      const error = normalizeError(err)
      logger.error('Error updating property', { propertyId: id, userId: user?.id }, error)
      const errorMessage = getUserFriendlyMessage(error)
      setError(errorMessage)
      showErrorToast(errorMessage)
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
          const error = new Error(deleteError.message)
          logger.error('Error deleting property', { propertyId: id, userId: user.id }, error)
          const errorMessage = deleteError.message || 'Error al eliminar propiedad'
          setError(errorMessage)
          showErrorToast(errorMessage)
          return false
        }

        logger.info('Property deleted', { propertyId: id, userId: user.id })
        showSuccessToast('Propiedad eliminada exitosamente')
        // Recargar propiedades
        await loadProperties()
        return true
      } else {
        // Eliminar de localStorage
        const updatedProperties = properties.filter(prop => prop.id !== id)
        return saveToLocalStorage(updatedProperties)
      }
    } catch (err) {
      const error = normalizeError(err)
      logger.error('Error deleting property', { propertyId: id, userId: user?.id }, error)
      const errorMessage = getUserFriendlyMessage(error)
      setError(errorMessage)
      showErrorToast(errorMessage)
      return false
    }
  }

  // Obtener propiedad por ID
  const getPropertyById = (id: string): Property | undefined => {
    return properties.find(prop => prop.id === id)
  }

  // Duplicar propiedad
  const duplicateProperty = async (id: string): Promise<string | null> => {
    try {
      const originalProperty = properties.find(p => p.id === id)
      if (!originalProperty) {
        setError('Propiedad no encontrada')
        return null
      }

      const duplicatedProperty: Omit<Property, 'id'> = {
        ...originalProperty,
        title: `[Copia] ${originalProperty.title}`,
        status: 'disponible',
        featured: false,
        createdAt: undefined,
        updatedAt: undefined,
        createdBy: user?.id,
        updatedBy: user?.id,
      }

      const duplicatedId = `prop-${Date.now()}`
      const propertyWithId: Property = {
        ...duplicatedProperty,
        id: duplicatedId,
      } as Property

      const createSuccess = await createProperty(propertyWithId)
      if (createSuccess) {
        return duplicatedId
      }
      return null
    } catch (err) {
      const error = normalizeError(err)
      logger.error('Error duplicating property', { propertyId: id, userId: user?.id }, error)
      const errorMessage = getUserFriendlyMessage(error)
      setError(errorMessage)
      showErrorToast(errorMessage)
      return null
    }
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
    duplicateProperty,
    getPropertyById,
    refreshProperties,
    useSupabase, // Exponer si está usando Supabase
  }
}
