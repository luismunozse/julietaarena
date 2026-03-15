'use client'

import { useState, useEffect } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { Bell, X } from 'lucide-react'

export default function NotificationPrompt() {
  const { permission, isSupported, requestPermission } = useNotifications()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (isSupported && permission === 'default' && !isDismissed) {
      const dismissed = localStorage.getItem('notification-prompt-dismissed')
      if (!dismissed) {
        const timer = setTimeout(() => setIsVisible(true), 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [isSupported, permission, isDismissed])

  const handleEnable = async () => {
    const granted = await requestPermission()
    if (granted) {
      setIsVisible(false)
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
    <div className="fixed bottom-4 left-4 right-20 sm:left-auto sm:right-4 sm:bottom-6 sm:max-w-md z-[998] animate-fade-in-up">
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl shadow-xl border border-border relative">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-brand-accent mb-0.5">
            Mantente Informado
          </h3>
          <p className="text-xs sm:text-sm text-muted leading-snug">
            Recibe notificaciones sobre nuevas propiedades y cambios de precios.
          </p>
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button
            onClick={handleEnable}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-primary text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-brand-accent transition-colors whitespace-nowrap"
          >
            Activar
          </button>
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors whitespace-nowrap"
          >
            Ahora no
          </button>
        </div>
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-muted hover:text-foreground rounded-full hover:bg-surface transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
