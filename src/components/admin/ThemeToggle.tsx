'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark)

    setIsDark(shouldBeDark)
    applyTheme(shouldBeDark)
    setMounted(true)
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

  if (!mounted) return null

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-md"
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600" />
      )}
      <span className="sr-only">{isDark ? 'Modo claro' : 'Modo oscuro'}</span>
    </Button>
  )
}
