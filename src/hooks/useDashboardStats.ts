'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useProperties } from './useProperties'
import { subDays, startOfDay, endOfDay } from 'date-fns'

export interface DashboardStats {
  totalProperties: number
  activeProperties: number
  featuredProperties: number
  newInquiries24h: number
  newContacts24h: number
  conversionRate: number
  estimatedRevenue: {
    sales: number
    rentals: number
    total: number
  }
  propertiesByMonth: Array<{
    month: string
    count: number
  }>
  propertiesByType: Record<string, number>
  propertiesByStatus: Record<string, number>
  propertiesByOperation: Record<string, number>
}

export function useDashboardStats() {
  const { properties } = useProperties()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true)
        setError(null)

        // Calcular fecha de hace 24 horas
        const yesterday = subDays(new Date(), 1)
        const yesterdayStart = startOfDay(yesterday)
        const yesterdayEnd = endOfDay(new Date())

        // Cargar consultas de últimas 24h
        const { data: inquiriesData, error: inquiriesError } = await supabase
          .from('property_inquiries')
          .select('id, created_at')
          .gte('created_at', yesterdayStart.toISOString())
          .lte('created_at', yesterdayEnd.toISOString())

        if (inquiriesError) {
          console.error('Error cargando consultas:', inquiriesError)
        }

        // Cargar contactos de últimas 24h
        const { data: contactsData, error: contactsError } = await supabase
          .from('contact_inquiries')
          .select('id, created_at')
          .gte('created_at', yesterdayStart.toISOString())
          .lte('created_at', yesterdayEnd.toISOString())

        if (contactsError) {
          console.error('Error cargando contactos:', contactsError)
        }

        // Calcular estadísticas de propiedades
        const activeProperties = properties.filter(p => p.status === 'disponible').length
        const featuredProperties = properties.filter(p => p.featured).length
        
        // Calcular ingresos estimados
        const salesProperties = properties.filter(p => p.operation === 'venta' && p.status === 'disponible')
        const rentalProperties = properties.filter(p => p.operation === 'alquiler' && p.status === 'disponible')
        
        const salesRevenue = salesProperties.reduce((sum, p) => {
          const price = p.currency === 'ARS' ? p.price / 1000 : p.price // Convertir ARS a miles
          return sum + price
        }, 0)
        
        const rentalsRevenue = rentalProperties.reduce((sum, p) => {
          const price = p.currency === 'ARS' ? p.price / 1000 : p.price
          return sum + price
        }, 0)

        // Calcular tasa de conversión (consultas / propiedades activas)
        const totalInquiries = inquiriesData?.length || 0
        const conversionRate = activeProperties > 0 
          ? (totalInquiries / activeProperties) * 100 
          : 0

        // Propiedades por tipo
        const propertiesByType: Record<string, number> = {}
        properties.forEach(p => {
          propertiesByType[p.type] = (propertiesByType[p.type] || 0) + 1
        })

        // Propiedades por estado
        const propertiesByStatus: Record<string, number> = {}
        properties.forEach(p => {
          propertiesByStatus[p.status] = (propertiesByStatus[p.status] || 0) + 1
        })

        // Propiedades por operación
        const propertiesByOperation: Record<string, number> = {}
        properties.forEach(p => {
          propertiesByOperation[p.operation] = (propertiesByOperation[p.operation] || 0) + 1
        })

        // Propiedades por mes (últimos 6 meses)
        const propertiesByMonth: Array<{ month: string; count: number }> = []
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
        
        for (let i = 5; i >= 0; i--) {
          const date = subDays(new Date(), i * 30)
          const monthKey = `${months[date.getMonth()]} ${date.getFullYear()}`
          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          
          const count = properties.filter(p => {
            if (!p.createdAt) return false
            const created = new Date(p.createdAt)
            return created >= monthStart && created <= monthEnd
          }).length
          
          propertiesByMonth.push({ month: monthKey, count })
        }

        setStats({
          totalProperties: properties.length,
          activeProperties,
          featuredProperties,
          newInquiries24h: inquiriesData?.length || 0,
          newContacts24h: contactsData?.length || 0,
          conversionRate: Math.round(conversionRate * 100) / 100,
          estimatedRevenue: {
            sales: Math.round(salesRevenue * 100) / 100,
            rentals: Math.round(rentalsRevenue * 100) / 100,
            total: Math.round((salesRevenue + rentalsRevenue) * 100) / 100,
          },
          propertiesByMonth,
          propertiesByType,
          propertiesByStatus,
          propertiesByOperation,
        })
      } catch (err) {
        console.error('Error cargando estadísticas:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [properties])

  return { stats, isLoading, error }
}

