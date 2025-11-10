'use client'

import { useEffect, type ReactNode } from 'react'
import styles from './Modal.module.css'

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
    switch (type) {
      case 'confirm':
        return '❓'
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      default:
        return 'ℹ️'
    }
  }

  const getIconClass = () => {
    switch (type) {
      case 'confirm':
        return styles.iconConfirm
      case 'success':
        return styles.iconSuccess
      case 'error':
        return styles.iconError
      default:
        return styles.iconInfo
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={`${styles.modalIcon} ${getIconClass()}`}>
          {getIcon()}
        </div>

        <h2 className={styles.modalTitle}>{title}</h2>
        {message && <p className={styles.modalMessage}>{message}</p>}
        {children}

        <div className={styles.modalActions}>
          {type === 'confirm' && (
            <button
              className={styles.cancelButton}
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}
          <button
            className={`${styles.confirmButton} ${type === 'error' ? styles.errorButton : ''}`}
            onClick={handleConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
