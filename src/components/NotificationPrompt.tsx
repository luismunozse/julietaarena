'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import styles from './NotificationPrompt.module.css'

export default function NotificationPrompt() {
  const { permission, isSupported, requestPermission } = useNotifications()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Mostrar el prompt si las notificaciones están soportadas, 
    // el permiso no está concedido y no se ha descartado
    if (isSupported && permission === 'default' && !isDismissed) {
      const dismissed = localStorage.getItem('notification-prompt-dismissed')
      if (!dismissed) {
        setIsVisible(true)
      }
    }
  }, [isSupported, permission, isDismissed])

  const handleEnable = async () => {
    const granted = await requestPermission()
    if (granted) {
      setIsVisible(false)
      // Mostrar notificación de confirmación
      setTimeout(() => {
        new Notification('¡Notificaciones Activadas!', {
          body: 'Te mantendremos informado sobre nuevas propiedades y actualizaciones.',
          icon: '/favicon.ico'
        })
      }, 1000)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('notification-prompt-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className={styles.notificationPrompt}>
      <div className={styles.promptContent}>
        <div className={styles.promptIcon}>
          🔔
        </div>
        <div className={styles.promptText}>
          <h3>Mantente Informado</h3>
          <p>
            Recibe notificaciones sobre nuevas propiedades, cambios de precios 
            y recordatorios de citas.
          </p>
        </div>
        <div className={styles.promptActions}>
          <button 
            onClick={handleEnable}
            className={styles.enableBtn}
          >
            Activar Notificaciones
          </button>
          <button 
            onClick={handleDismiss}
            className={styles.dismissBtn}
          >
            Ahora no
          </button>
        </div>
        <button 
          onClick={handleDismiss}
          className={styles.closeBtn}
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
