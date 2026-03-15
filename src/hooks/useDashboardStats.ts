'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useProperties } from './useProperties'
import { subDays, startOfDay, endOfDay } from 'date-fns'

export interface TrendData {
  value: number
  previous: number
  /** Percentage change from previous period */
  change: number
}

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
  trends: {
    inquiries: TrendData
    contacts: TrendData
    properties: TrendData
  }
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

        const now = new Date()
        const yesterday = subDays(now, 1)
        const twoDaysAgo = subDays(now, 2)

        // Current 24h window
        const currentStart = startOfDay(yesterday)
        const currentEnd = endOfDay(now)

        // Previous 24h window (for trend comparison)
        const prevStart = startOfDay(twoDaysAgo)
        const prevEnd = endOfDay(yesterday)

        // Fetch current + previous period inquiries and contacts in parallel
        const [
          { data: inquiriesData, error: inquiriesError },
          { data: prevInquiriesData },
          { data: contactsData, error: contactsError },
          { data: prevContactsData },
        ] = await Promise.all([
          supabase
            .from('property_inquiries')
            .select('id, created_at')
            .gte('created_at', currentStart.toISOString())
            .lte('created_at', currentEnd.toISOString()),
          supabase
            .from('property_inquiries')
            .select('id')
            .gte('created_at', prevStart.toISOString())
            .lt('created_at', currentStart.toISOString()),
          supabase
            .from('contact_inquiries')
            .select('id, created_at')
            .gte('created_at', currentStart.toISOString())
            .lte('created_at', currentEnd.toISOString()),
          supabase
            .from('contact_inquiries')
            .select('id')
            .gte('created_at', prevStart.toISOString())
            .lt('created_at', currentStart.toISOString()),
        ])

        // errors from inquiries/contacts queries are non-fatal

        const activeProperties = properties.filter(p => p.status === 'disponible').length
        const featuredProperties = properties.filter(p => p.featured).length

        const salesProperties = properties.filter(p => p.operation === 'venta' && p.status === 'disponible')
        const rentalProperties = properties.filter(p => p.operation === 'alquiler' && p.status === 'disponible')

        const salesRevenue = salesProperties.reduce((sum, p) => {
          const price = p.currency === 'ARS' ? p.price / 1000 : p.price
          return sum + price
        }, 0)

        const rentalsRevenue = rentalProperties.reduce((sum, p) => {
          const price = p.currency === 'ARS' ? p.price / 1000 : p.price
          return sum + price
        }, 0)

        const totalInquiries = inquiriesData?.length || 0
        const conversionRate = activeProperties > 0
          ? (totalInquiries / activeProperties) * 100
          : 0

        const propertiesByType: Record<string, number> = {}
        properties.forEach(p => {
          propertiesByType[p.type] = (propertiesByType[p.type] || 0) + 1
        })

        const propertiesByStatus: Record<string, number> = {}
        properties.forEach(p => {
          propertiesByStatus[p.status] = (propertiesByStatus[p.status] || 0) + 1
        })

        const propertiesByOperation: Record<string, number> = {}
        properties.forEach(p => {
          propertiesByOperation[p.operation] = (propertiesByOperation[p.operation] || 0) + 1
        })

        // Properties by month (last 6 months)
        const propertiesByMonth: Array<{ month: string; count: number }> = []
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
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

        // Calculate trends
        const currentInquiries = inquiriesData?.length || 0
        const previousInquiries = prevInquiriesData?.length || 0
        const currentContacts = contactsData?.length || 0
        const previousContacts = prevContactsData?.length || 0

        // Properties added this week vs last week
        const weekAgo = subDays(now, 7)
        const twoWeeksAgo = subDays(now, 14)
        const propsThisWeek = properties.filter(p => p.createdAt && new Date(p.createdAt) >= weekAgo).length
        const propsLastWeek = properties.filter(p => {
          if (!p.createdAt) return false
          const d = new Date(p.createdAt)
          return d >= twoWeeksAgo && d < weekAgo
        }).length

        const calcChange = (current: number, previous: number) =>
          previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100)

        setStats({
          totalProperties: properties.length,
          activeProperties,
          featuredProperties,
          newInquiries24h: currentInquiries,
          newContacts24h: currentContacts,
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
          trends: {
            inquiries: {
              value: currentInquiries,
              previous: previousInquiries,
              change: calcChange(currentInquiries, previousInquiries),
            },
            contacts: {
              value: currentContacts,
              previous: previousContacts,
              change: calcChange(currentContacts, previousContacts),
            },
            properties: {
              value: propsThisWeek,
              previous: propsLastWeek,
              change: calcChange(propsThisWeek, propsLastWeek),
            },
          },
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [properties])

  return { stats, isLoading, error }
}
