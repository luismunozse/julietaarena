'use client'

import { useState, useEffect } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Verificar si las notificaciones están soportadas
    if ('Notification' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result === 'granted'
    } catch {
      return false
    }
  }

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted' || !isSupported) return

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      })

      // Auto-cerrar después de 5 segundos
      setTimeout(() => {
        notification.close()
      }, 5000)

      return notification
    } catch {
      // silently ignore
    }
  }

  const showPropertyNotification = (property: any) => {
    const title = '🏠 Nueva Propiedad Disponible'
    const body = `${property.title} - ${property.location}`
    
    return showNotification(title, {
      body,
      data: { propertyId: property.id },
      tag: `property-${property.id}`,
      requireInteraction: true
    })
  }

  const showPriceDropNotification = (property: any, oldPrice: number, newPrice: number) => {
    const title = '💰 ¡Bajó el Precio!'
    const body = `${property.title} - De $${oldPrice.toLocaleString()} a $${newPrice.toLocaleString()}`
    
    return showNotification(title, {
      body,
      data: { propertyId: property.id, type: 'price-drop' },
      tag: `price-drop-${property.id}`,
      requireInteraction: true
    })
  }

  const showAppointmentReminder = (appointment: any) => {
    const title = '📅 Recordatorio de Cita'
    const body = `Tienes una cita programada para ${appointment.property.title}`
    
    return showNotification(title, {
      body,
      data: { appointmentId: appointment.id },
      tag: `appointment-${appointment.id}`,
      requireInteraction: true
    })
  }

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
    showPropertyNotification,
    showPriceDropNotification,
    showAppointmentReminder
  }
}
