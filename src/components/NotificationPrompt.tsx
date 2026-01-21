'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { useNotifications } from '@/hooks/useNotifications'

const styles: Record<string, CSSProperties> = {
  notificationPrompt: {
    position: 'fixed',
    bottom: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1000,
    maxWidth: '500px',
    width: 'calc(100% - 2rem)',
  },
  promptContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
    position: 'relative',
  },
  promptIcon: {
    fontSize: '2rem',
    flexShrink: 0,
  },
  promptText: {
    flex: 1,
  },
  promptTextH3: {
    margin: '0 0 0.25rem 0',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a4158',
  },
  promptTextP: {
    margin: 0,
    fontSize: '0.875rem',
    color: '#636e72',
    lineHeight: 1.4,
  },
  promptActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flexShrink: 0,
  },
  enableBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s',
  },
  dismissBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: 'transparent',
    color: '#636e72',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    whiteSpace: 'nowrap',
    transition: 'background-color 0.2s',
  },
  closeBtn: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#636e72',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
  },
}

export default function NotificationPrompt() {
  const { permission, isSupported, requestPermission } = useNotifications()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Mostrar el prompt si las notificaciones estan soportadas,
    // el permiso no esta concedido y no se ha descartado
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
      // Mostrar notificacion de confirmacion
      setTimeout(() => {
        new Notification('Notificaciones Activadas!', {
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
    <div style={styles.notificationPrompt}>
      <div style={styles.promptContent}>
        <div style={styles.promptIcon}>
          🔔
        </div>
        <div style={styles.promptText}>
          <h3 style={styles.promptTextH3}>Mantente Informado</h3>
          <p style={styles.promptTextP}>
            Recibe notificaciones sobre nuevas propiedades, cambios de precios
            y recordatorios de citas.
          </p>
        </div>
        <div style={styles.promptActions}>
          <button
            onClick={handleEnable}
            style={styles.enableBtn}
          >
            Activar Notificaciones
          </button>
          <button
            onClick={handleDismiss}
            style={styles.dismissBtn}
          >
            Ahora no
          </button>
        </div>
        <button
          onClick={handleDismiss}
          style={styles.closeBtn}
          aria-label="Cerrar"
        >
          X
        </button>
      </div>
    </div>
  )
}
