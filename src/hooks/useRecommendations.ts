'use client'

import { useState, useEffect, useMemo } from 'react'
import { Property } from '@/data/properties'
import { useAuth } from './useAuth'
import { useFavorites } from './useFavorites'

interface RecommendationScore {
  property: Property
  score: number
  reasons: string[]
}

interface UserBehavior {
  viewedProperties: string[]
  searchHistory: {
    priceRange: { min: number; max: number }
    propertyTypes: string[]
    locations: string[]
    features: string[]
  }[]
  favoriteTypes: string[]
  favoriteLocations: string[]
  averagePrice: number
}

export function useRecommendations(properties: Property[]) {
  const { user } = useAuth()
  const { favorites } = useFavorites()
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null)

  // Cargar comportamiento del usuario
  useEffect(() => {
    if (!user) return

    const behavior = localStorage.getItem(`user-behavior-${user.id}`)
    if (behavior) {
      setUserBehavior(JSON.parse(behavior))
    } else {
      // Inicializar comportamiento por defecto
      const defaultBehavior: UserBehavior = {
        viewedProperties: [],
        searchHistory: [],
        favoriteTypes: [],
        favoriteLocations: [],
        averagePrice: 0
      }
      setUserBehavior(defaultBehavior)
    }
  }, [user])

  // Actualizar comportamiento del usuario
  const updateUserBehavior = (updates: Partial<UserBehavior>) => {
    if (!user || !userBehavior) return

    const updatedBehavior = { ...userBehavior, ...updates }
    setUserBehavior(updatedBehavior)
    localStorage.setItem(`user-behavior-${user.id}`, JSON.stringify(updatedBehavior))
  }

  // Registrar visualización de propiedad
  const trackPropertyView = (propertyId: string) => {
    if (!userBehavior) return

    const updatedViewed = [...userBehavior.viewedProperties]
    if (!updatedViewed.includes(propertyId)) {
      updatedViewed.push(propertyId)
      // Mantener solo los últimos 50
      if (updatedViewed.length > 50) {
        updatedViewed.shift()
      }
    }

    updateUserBehavior({ viewedProperties: updatedViewed })
  }

  // Registrar búsqueda
  const trackSearch = (searchData: {
    priceRange: { min: number; max: number }
    propertyTypes: string[]
    locations: string[]
    features: string[]
  }) => {
    if (!userBehavior) return

    const updatedHistory = [...userBehavior.searchHistory, searchData]
    // Mantener solo las últimas 20 búsquedas
    if (updatedHistory.length > 20) {
      updatedHistory.shift()
    }

    updateUserBehavior({ searchHistory: updatedHistory })
  }

  // Calcular recomendaciones
  const recommendations = useMemo(() => {
    if (!userBehavior || properties.length === 0) return []

    const scoredProperties: RecommendationScore[] = properties
      .filter(property => !favorites.includes(property.id)) // Excluir favoritos
      .map(property => {
        let score = 0
        const reasons: string[] = []

        // 1. Basado en tipos de propiedades favoritas
        if (userBehavior.favoriteTypes.includes(property.type)) {
          score += 30
          reasons.push(`Tipo de propiedad que te interesa: ${property.type}`)
        }

        // 2. Basado en ubicaciones favoritas
        const propertyLocation = property.location.split(',')[0].trim()
        if (userBehavior.favoriteLocations.includes(propertyLocation)) {
          score += 25
          reasons.push(`Ubicación que te interesa: ${propertyLocation}`)
        }

        // 3. Basado en rango de precios histórico
        const avgMinPrice = userBehavior.searchHistory.reduce((sum, search) => sum + search.priceRange.min, 0) / userBehavior.searchHistory.length
        const avgMaxPrice = userBehavior.searchHistory.reduce((sum, search) => sum + search.priceRange.max, 0) / userBehavior.searchHistory.length
        
        if (property.price >= avgMinPrice && property.price <= avgMaxPrice) {
          score += 20
          reasons.push('Precio dentro de tu rango de búsqueda')
        }

        // 4. Basado en características buscadas
        const allSearchedFeatures = userBehavior.searchHistory.flatMap(search => search.features)
        const commonFeatures = property.features.filter(feature => 
          allSearchedFeatures.includes(feature)
        )
        
        if (commonFeatures.length > 0) {
          score += commonFeatures.length * 5
          reasons.push(`Tiene características que buscas: ${commonFeatures.join(', ')}`)
        }

        // 5. Propiedades similares a las vistas
        const viewedProperties = userBehavior.viewedProperties
          .map(id => properties.find(p => p.id === id))
          .filter(Boolean) as Property[]

        viewedProperties.forEach(viewed => {
          if (viewed.type === property.type) {
            score += 10
            reasons.push('Similar a propiedades que has visto')
          }
          
          if (viewed.location === property.location) {
            score += 15
            reasons.push('Misma ubicación que propiedades vistas')
          }
        })

        // 6. Propiedades destacadas (boost)
        if (property.featured) {
          score += 15
          reasons.push('Propiedad destacada')
        }

        // 7. Disponibilidad
        if (property.status === 'disponible') {
          score += 10
          reasons.push('Disponible ahora')
        }

        // 8. Penalizar propiedades ya vistas
        if (userBehavior.viewedProperties.includes(property.id)) {
          score -= 20
        }

        return { property, score, reasons }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6) // Top 6 recomendaciones

    return scoredProperties
  }, [userBehavior, properties, favorites])

  // Recomendaciones por similitud
  const getSimilarProperties = (propertyId: string, limit: number = 4) => {
    const targetProperty = properties.find(p => p.id === propertyId)
    if (!targetProperty) return []

    return properties
      .filter(p => p.id !== propertyId)
      .map(p => {
        let similarity = 0

        // Tipo de propiedad
        if (p.type === targetProperty.type) similarity += 30

        // Ubicación
        if (p.location === targetProperty.location) similarity += 25

        // Rango de precio similar (±20%)
        const priceDiff = Math.abs(p.price - targetProperty.price) / targetProperty.price
        if (priceDiff <= 0.2) similarity += 20

        // Características comunes
        const commonFeatures = p.features.filter(f => targetProperty.features.includes(f))
        similarity += commonFeatures.length * 5

        // Área similar
        const areaDiff = Math.abs(p.area - targetProperty.area) / targetProperty.area
        if (areaDiff <= 0.3) similarity += 10

        return { property: p, similarity }
      })
      .filter(item => item.similarity > 20)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.property)
  }

  // Recomendaciones por ubicación
  const getLocationRecommendations = (location: string, limit: number = 4) => {
    return properties
      .filter(p => p.location.includes(location))
      .sort((a, b) => {
        // Priorizar propiedades destacadas y disponibles
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        if (a.status === 'disponible' && b.status !== 'disponible') return -1
        if (a.status !== 'disponible' && b.status === 'disponible') return 1
        return 0
      })
      .slice(0, limit)
  }

  // Recomendaciones por precio
  const getPriceRangeRecommendations = (minPrice: number, maxPrice: number, limit: number = 4) => {
    return properties
      .filter(p => p.price >= minPrice && p.price <= maxPrice)
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
      .slice(0, limit)
  }

  return {
    recommendations,
    trackPropertyView,
    trackSearch,
    getSimilarProperties,
    getLocationRecommendations,
    getPriceRangeRecommendations,
    userBehavior
  }
}
