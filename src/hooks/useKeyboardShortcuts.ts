'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcuts.forEach(shortcut => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.alt ? event.altKey : !event.altKey

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          // Evitar acción si está escribiendo en un input
          const target = event.target as HTMLElement
          if (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable
          ) {
            return
          }

          event.preventDefault()
          shortcut.action()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Hook para atajos comunes del admin
export function useAdminKeyboardShortcuts() {
  const router = useRouter()

  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      action: () => {
        // Búsqueda global - implementar modal de búsqueda
        const searchInput = document.querySelector('input[type="text"][placeholder*="Buscar"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      },
      description: 'Búsqueda global',
    },
    {
      key: 'n',
      ctrl: true,
      action: () => {
        if (window.location.pathname.includes('/admin/propiedades')) {
          router.push('/admin/propiedades/nueva')
        }
      },
      description: 'Nueva propiedad',
    },
    {
      key: 's',
      ctrl: true,
      action: () => {
        const saveButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
        if (saveButton && !saveButton.disabled) {
          saveButton.click()
        }
      },
      description: 'Guardar',
    },
    {
      key: 'Escape',
      action: () => {
        // Cerrar modales
        const modals = document.querySelectorAll('[role="dialog"]')
        modals.forEach(modal => {
          const closeButton = modal.querySelector('button[aria-label*="cerrar"], button[aria-label*="close"]')
          if (closeButton) {
            (closeButton as HTMLButtonElement).click()
          }
        })
      },
      description: 'Cerrar modales',
    },
    {
      key: '?',
      action: () => {
        // Mostrar ayuda de atajos
        const helpModal = document.getElementById('keyboard-shortcuts-help')
        if (helpModal) {
          (helpModal as HTMLElement).style.display = 'block'
        }
      },
      description: 'Mostrar ayuda',
    },
  ])
}

