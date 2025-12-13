'use client'

import { useState, useEffect } from 'react'
import styles from './ThemeToggle.module.css'

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
    <button onClick={toggleTheme} className={styles.toggle} title={isDark ? 'Modo claro' : 'Modo oscuro'}>
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

