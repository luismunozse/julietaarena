'use client'

import { useState, useEffect } from 'react'
import styles from './KeyboardShortcuts.module.css'

const shortcuts = [
  { keys: 'Ctrl/Cmd + K', description: 'Búsqueda global' },
  { keys: 'Ctrl/Cmd + N', description: 'Nueva propiedad' },
  { keys: 'Ctrl/Cmd + S', description: 'Guardar formulario' },
  { keys: 'Esc', description: 'Cerrar modales' },
  { keys: '?', description: 'Mostrar esta ayuda' },
]

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          setIsOpen(true)
        }
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Atajos de Teclado</h2>
          <button onClick={() => setIsOpen(false)} className={styles.closeButton}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={styles.shortcutItem}>
              <kbd className={styles.keys}>{shortcut.keys}</kbd>
              <span className={styles.description}>{shortcut.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

