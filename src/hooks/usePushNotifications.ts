'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    // Verificar si el navegador soporta notificaciones
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      setIsEnabled(localStorage.getItem('push_notifications_enabled') === 'true')
    }
  }, [])

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      return { success: false, error: 'Notificaciones no soportadas en este navegador' }
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)

      if (result === 'granted') {
        localStorage.setItem('push_notifications_enabled', 'true')
        setIsEnabled(true)
        return { success: true }
      } else {
        return { success: false, error: 'Permiso denegado' }
      }
    } catch (error) {
      console.error('Error al solicitar permiso:', error)
      return { success: false, error: 'Error al solicitar permiso' }
    }
  }, [isSupported])

  const disableNotifications = useCallback(() => {
    localStorage.setItem('push_notifications_enabled', 'false')
    setIsEnabled(false)
  }, [])

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted' || !isEnabled) {
      return
    }

    try {
      const notification = new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options,
      })

      // Auto-cerrar después de 10 segundos
      setTimeout(() => notification.close(), 10000)

      return notification
    } catch (error) {
      console.error('Error al mostrar notificación:', error)
    }
  }, [permission, isEnabled])

  return {
    isSupported,
    isEnabled,
    permission,
    requestPermission,
    disableNotifications,
    showNotification,
  }
}

// Hook para escuchar nuevas consultas en tiempo real
export function useInquiryNotifications() {
  const { isEnabled, showNotification } = usePushNotifications()
  const [lastPropertyInquiryId, setLastPropertyInquiryId] = useState<string | null>(null)
  const [lastContactInquiryId, setLastContactInquiryId] = useState<string | null>(null)

  useEffect(() => {
    if (!isEnabled) return

    // Suscribirse a nuevas consultas de propiedades
    const propertyChannel = supabase
      .channel('property_inquiries_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'property_inquiries',
        },
        (payload) => {
          const inquiry = payload.new as any

          // Evitar notificar la primera vez que se carga
          if (lastPropertyInquiryId === null) {
            setLastPropertyInquiryId(inquiry.id)
            return
          }

          // Mostrar notificación
          showNotification('🏠 Nueva Consulta de Propiedad', {
            body: `${inquiry.customer_name} pregunta sobre ${inquiry.property_title}`,
            tag: `property_${inquiry.id}`,
            requireInteraction: false,
            data: {
              url: '/admin/consultas',
              inquiryId: inquiry.id,
            },
          })

          setLastPropertyInquiryId(inquiry.id)

          // Opcional: Reproducir sonido
          if (typeof Audio !== 'undefined') {
            try {
              const audio = new Audio('/sounds/notification.mp3')
              audio.volume = 0.5
              audio.play().catch((e) => console.log('No se pudo reproducir sonido:', e))
            } catch (e) {
              // Ignorar si no hay sonido
            }
          }
        }
      )
      .subscribe()

    // Suscribirse a nuevos contactos generales
    const contactChannel = supabase
      .channel('contact_inquiries_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'contact_inquiries',
        },
        (payload) => {
          const inquiry = payload.new as any

          // Evitar notificar la primera vez que se carga
          if (lastContactInquiryId === null) {
            setLastContactInquiryId(inquiry.id)
            return
          }

          const serviceLabels: { [key: string]: string } = {
            'venta': 'Venta de Propiedades',
            'alquiler': 'Alquileres',
            'remate': 'Remates Judiciales',
            'jubilacion': 'Jubilaciones',
            'tasacion': 'Tasaciones',
            'asesoria': 'Asesoramiento Legal',
            'otro': 'Otro'
          }

          // Mostrar notificación
          showNotification('📧 Nuevo Contacto General', {
            body: `${inquiry.customer_name} pregunta sobre ${serviceLabels[inquiry.service] || inquiry.service}`,
            tag: `contact_${inquiry.id}`,
            requireInteraction: false,
            data: {
              url: '/admin/contactos',
              inquiryId: inquiry.id,
            },
          })

          setLastContactInquiryId(inquiry.id)

          // Opcional: Reproducir sonido
          if (typeof Audio !== 'undefined') {
            try {
              const audio = new Audio('/sounds/notification.mp3')
              audio.volume = 0.5
              audio.play().catch((e) => console.log('No se pudo reproducir sonido:', e))
            } catch (e) {
              // Ignorar si no hay sonido
            }
          }
        }
      )
      .subscribe()

    // Cleanup: desuscribirse cuando el componente se desmonta
    return () => {
      propertyChannel.unsubscribe()
      contactChannel.unsubscribe()
    }
  }, [isEnabled, showNotification, lastPropertyInquiryId, lastContactInquiryId])

  return {
    isListening: isEnabled,
  }
}
