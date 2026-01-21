'use client'

import { useState, useEffect, CSSProperties } from 'react'

const toggleStyle: CSSProperties = {
  width: '40px',
  height: '40px',
  backgroundColor: 'rgba(44, 95, 125, 0.1)',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  fontSize: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s',
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Cargar preferencia guardada
    const saved = localStorage.getItem('admin-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark)

    setIsDark(shouldBeDark)
    applyTheme(shouldBeDark)
  }, [])

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('admin-theme', newTheme ? 'dark' : 'light')
    applyTheme(newTheme)
  }

  return (
    <button onClick={toggleTheme} style={toggleStyle} title={isDark ? 'Modo claro' : 'Modo oscuro'}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
