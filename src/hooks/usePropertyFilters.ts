'use client'

import { useState, useMemo } from 'react'
import type { Property } from '@/data/properties'

export interface PropertyFilters {
  search: string
  type: string
  operation: string
  status: string
  featured: string
  priceMin: string
  priceMax: string
  areaMin: string
  areaMax: string
  dateFrom: string
  dateTo: string
}

export function usePropertyFilters(properties: Property[]) {
  const [filters, setFilters] = useState<PropertyFilters>({
    search: '',
    type: 'all',
    operation: 'all',
    status: 'all',
    featured: 'all',
    priceMin: '',
    priceMax: '',
    areaMin: '',
    areaMax: '',
    dateFrom: '',
    dateTo: '',
  })

  const filteredProperties = useMemo(() => {
    return properties.filter(prop => {
      // Búsqueda por texto
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          prop.title.toLowerCase().includes(searchLower) ||
          prop.description.toLowerCase().includes(searchLower) ||
          prop.location.toLowerCase().includes(searchLower) ||
          prop.features.some(f => f.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) return false
      }

      // Filtro por tipo
      if (filters.type !== 'all' && prop.type !== filters.type) return false

      // Filtro por operación
      if (filters.operation !== 'all' && prop.operation !== filters.operation) return false

      // Filtro por estado
      if (filters.status !== 'all' && prop.status !== filters.status) return false

      // Filtro por destacada
      if (filters.featured !== 'all') {
        const isFeatured = filters.featured === 'yes'
        if (prop.featured !== isFeatured) return false
      }

      // Filtro por precio
      if (filters.priceMin) {
        const minPrice = parseFloat(filters.priceMin)
        if (prop.price < minPrice) return false
      }
      if (filters.priceMax) {
        const maxPrice = parseFloat(filters.priceMax)
        if (prop.price > maxPrice) return false
      }

      // Filtro por área
      if (filters.areaMin) {
        const minArea = parseFloat(filters.areaMin)
        if (prop.area < minArea) return false
      }
      if (filters.areaMax) {
        const maxArea = parseFloat(filters.areaMax)
        if (prop.area > maxArea) return false
      }

      // Filtro por fecha de creación
      if (filters.dateFrom && prop.createdAt) {
        const propDate = new Date(prop.createdAt)
        const fromDate = new Date(filters.dateFrom)
        if (propDate < fromDate) return false
      }
      if (filters.dateTo && prop.createdAt) {
        const propDate = new Date(prop.createdAt)
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999) // Incluir todo el día
        if (propDate > toDate) return false
      }

      return true
    })
  }, [properties, filters])

  const updateFilter = (key: keyof PropertyFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      operation: 'all',
      status: 'all',
      featured: 'all',
      priceMin: '',
      priceMax: '',
      areaMin: '',
      areaMax: '',
      dateFrom: '',
      dateTo: '',
    })
  }

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'search') return value.trim() !== ''
      return value !== 'all' && value !== ''
    })
  }, [filters])

  return {
    filters,
    filteredProperties,
    updateFilter,
    clearFilters,
    hasActiveFilters,
  }
}


