'use client'

import { useEffect, type ReactNode } from 'react'
import { X, HelpCircle, CheckCircle, XCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export type ModalType = 'confirm' | 'alert' | 'success' | 'error'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message?: string
  type?: ModalType
  confirmText?: string
  cancelText?: string
  children?: ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'alert',
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  children
}: ModalProps) {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const getIcon = () => {
    const iconClasses = "w-10 h-10 text-white"
    switch (type) {
      case 'confirm':
        return <HelpCircle className={iconClasses} />
      case 'success':
        return <CheckCircle className={iconClasses} />
      case 'error':
        return <XCircle className={iconClasses} />
      default:
        return <Info className={iconClasses} />
    }
  }

  const getIconContainerClass = () => {
    switch (type) {
      case 'confirm':
        return 'bg-gradient-to-br from-orange-500 to-orange-600'
      case 'success':
        return 'bg-gradient-to-br from-green-500 to-green-600'
      case 'error':
        return 'bg-gradient-to-br from-red-500 to-red-600'
      default:
        return 'bg-gradient-to-br from-blue-500 to-blue-600'
    }
  }

  return (
    <div
      className={cn(
        'fixed inset-0 z-[10000] flex items-center justify-content p-4',
        'bg-black/60 backdrop-blur-sm',
        'animate-in fade-in duration-200'
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'relative mx-auto w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-8 text-center',
          'shadow-[0_20px_60px_rgba(0,0,0,0.3)]',
          'animate-in slide-in-from-bottom-5 zoom-in-95 duration-300',
          'max-sm:p-5 max-sm:max-w-[95vw]'
        )}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Icon */}
        <div
          className={cn(
            'mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full',
            'shadow-[0_4px_15px_rgba(0,0,0,0.15)]',
            'animate-in zoom-in-50 duration-500',
            'max-sm:mb-4 max-sm:h-[60px] max-sm:w-[60px]',
            getIconContainerClass()
          )}
        >
          {getIcon()}
        </div>

        {/* Title */}
        <h2 className={cn(
          'mb-4 text-[1.75rem] font-bold tracking-tight text-[#1a4158]',
          'max-sm:text-[1.4rem]'
        )}>
          {title}
        </h2>

        {/* Message */}
        {message && (
          <p className={cn(
            'mb-8 text-[1.05rem] font-medium leading-relaxed text-gray-600',
            'max-sm:text-[0.95rem]'
          )}>
            {message}
          </p>
        )}

        {/* Children */}
        {children}

        {/* Actions */}
        <div className={cn(
          'flex flex-wrap justify-center gap-4',
          'max-sm:flex-col-reverse max-sm:gap-3'
        )}>
          {type === 'confirm' && (
            <Button
              variant="outline"
              onClick={onClose}
              className={cn(
                'min-w-[140px] rounded-[10px] border-2 border-gray-300 px-8 py-[0.9rem] text-base font-semibold text-gray-600',
                'hover:-translate-y-0.5 hover:border-gray-400 hover:bg-gray-50 hover:shadow-lg',
                'active:translate-y-0',
                'transition-all duration-200',
                'max-sm:w-full max-sm:min-w-0'
              )}
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            autoFocus
            className={cn(
              'min-w-[140px] rounded-[10px] border-none px-8 py-[0.9rem] text-base font-bold',
              'hover:-translate-y-0.5 hover:shadow-xl',
              'active:translate-y-0',
              'transition-all duration-200',
              'max-sm:w-full max-sm:min-w-0',
              type === 'error'
                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-[0_6px_20px_rgba(244,67,54,0.35)] hover:from-red-500 hover:to-red-700 hover:shadow-[0_8px_25px_rgba(244,67,54,0.45)]'
                : 'bg-gradient-to-br from-[#2c5f7d] to-[#1a4158] shadow-[0_6px_20px_rgba(44,95,125,0.35)] hover:from-[#2c5f7d] hover:to-[#234960] hover:shadow-[0_8px_25px_rgba(44,95,125,0.45)]'
            )}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
