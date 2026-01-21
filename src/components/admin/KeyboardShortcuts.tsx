'use client'

import { useState, useEffect, CSSProperties } from 'react'

const shortcuts = [
  { keys: 'Ctrl/Cmd + K', description: 'Busqueda global' },
  { keys: 'Ctrl/Cmd + N', description: 'Nueva propiedad' },
  { keys: 'Ctrl/Cmd + S', description: 'Guardar formulario' },
  { keys: 'Esc', description: 'Cerrar modales' },
  { keys: '?', description: 'Mostrar esta ayuda' },
]

const styles: Record<string, CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid #e5e7eb',
  },
  headerH2: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1a4158',
  },
  closeButton: {
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#636e72',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  content: {
    padding: '1rem 1.5rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  shortcutItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  keys: {
    padding: '0.375rem 0.75rem',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    fontSize: '0.8125rem',
    fontFamily: 'monospace',
    color: '#1a4158',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  description: {
    fontSize: '0.875rem',
    color: '#636e72',
  },
}

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
    <div style={styles.overlay} onClick={() => setIsOpen(false)}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.headerH2}>Atajos de Teclado</h2>
          <button onClick={() => setIsOpen(false)} style={styles.closeButton}>
            X
          </button>
        </div>
        <div style={styles.content}>
          {shortcuts.map((shortcut, index) => (
            <div key={index} style={styles.shortcutItem}>
              <kbd style={styles.keys}>{shortcut.keys}</kbd>
              <span style={styles.description}>{shortcut.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
