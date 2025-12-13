'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useProperties } from './useProperties'
import { formatDistanceToNow } from 'date-fns'

export interface ActivityItem {
  id: string
  type: 'property_created' | 'property_updated' | 'inquiry_received' | 'contact_received' | 'status_changed'
  title: string
  description: string
  timestamp: Date
  link?: string
  icon: string
}

export function useRecentActivity(limit = 10) {
  const { properties } = useProperties()
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadActivities() {
      try {
        setIsLoading(true)
        const allActivities: ActivityItem[] = []

        // Actividades de propiedades (últimas creadas/modificadas)
        const recentProperties = [...properties]
          .sort((a, b) => {
            const aDate = new Date(a.updatedAt || a.createdAt || 0)
            const bDate = new Date(b.updatedAt || b.createdAt || 0)
            return bDate.getTime() - aDate.getTime()
          })
          .slice(0, 5)

        recentProperties.forEach(prop => {
          const isNew = prop.createdAt && 
            new Date(prop.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000
          
          allActivities.push({
            id: `prop-${prop.id}`,
            type: isNew ? 'property_created' : 'property_updated',
            title: isNew ? 'Nueva propiedad creada' : 'Propiedad actualizada',
            description: prop.title,
            timestamp: new Date(prop.updatedAt || prop.createdAt || Date.now()),
            link: `/admin/propiedades/${prop.id}`,
            icon: '🏠',
          })
        })

        // Consultas recientes
        const { data: inquiriesData } = await supabase
          .from('property_inquiries')
          .select('id, customer_name, property_title, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        inquiriesData?.forEach(inquiry => {
          allActivities.push({
            id: `inquiry-${inquiry.id}`,
            type: 'inquiry_received',
            title: 'Nueva consulta recibida',
            description: `${inquiry.customer_name} consultó sobre ${inquiry.property_title}`,
            timestamp: new Date(inquiry.created_at),
            link: '/admin/consultas',
            icon: '💬',
          })
        })

        // Contactos recientes
        const { data: contactsData } = await supabase
          .from('contact_inquiries')
          .select('id, customer_name, service, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        contactsData?.forEach(contact => {
          allActivities.push({
            id: `contact-${contact.id}`,
            type: 'contact_received',
            title: 'Nuevo contacto recibido',
            description: `${contact.customer_name} - ${contact.service}`,
            timestamp: new Date(contact.created_at),
            link: '/admin/contactos',
            icon: '📧',
          })
        })

        // Ordenar todas las actividades por timestamp
        allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

        // Limitar y formatear
        const formattedActivities = allActivities.slice(0, limit).map(activity => ({
          ...activity,
          formattedTime: formatDistanceToNow(activity.timestamp, { 
            addSuffix: true
          }),
        }))

        setActivities(formattedActivities as ActivityItem[])
      } catch (err) {
        console.error('Error cargando actividad reciente:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadActivities()
  }, [properties, limit])

  return { activities, isLoading }
}

