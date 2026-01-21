'use client'

import { useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  message: string
  type: ToastType
  duration?: number
  onClose: (id: string) => void
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const typeStyles = {
  success: {
    icon: 'bg-green-500 text-white',
    progress: 'bg-green-500',
  },
  error: {
    icon: 'bg-red-500 text-white',
    progress: 'bg-red-500',
  },
  warning: {
    icon: 'bg-amber-500 text-white',
    progress: 'bg-amber-500',
  },
  info: {
    icon: 'bg-blue-500 text-white',
    progress: 'bg-blue-500',
  },
}

export default function Toast({ id, message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id)
    }, duration)

    return () => clearTimeout(timer)
  }, [id, duration, onClose])

  const Icon = iconMap[type]
  const styles = typeStyles[type]

  return (
    <div
      className={cn(
        'flex items-center gap-3 min-w-[320px] max-w-[500px] px-5 py-4',
        'bg-white rounded-xl relative overflow-hidden',
        'shadow-[0_8px_24px_rgba(0,0,0,0.15),0_2px_8px_rgba(0,0,0,0.1)]',
        'animate-toast-slide-in',
        'max-[480px]:min-w-[calc(100vw-40px)] max-[480px]:max-w-[calc(100vw-40px)]'
      )}
    >
      <div
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
          styles.icon
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="m-0 text-[0.95rem] text-[var(--text-dark)] leading-[1.4] break-words">
          {message}
        </p>
      </div>
      <button
        className={cn(
          'w-6 h-6 border-none bg-transparent text-[var(--text-light)] cursor-pointer',
          'flex items-center justify-center rounded shrink-0',
          'transition-all duration-300 ease-in-out',
          'hover:bg-black/5 hover:text-[var(--text-dark)]'
        )}
        onClick={() => onClose(id)}
        aria-label="Cerrar notificacion"
      >
        <X className="w-4 h-4" />
      </button>
      <div
        className={cn(
          'absolute bottom-0 left-0 h-[3px] w-full origin-left',
          'animate-toast-progress',
          styles.progress
        )}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}
