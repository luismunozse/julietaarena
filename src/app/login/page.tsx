'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import styles from './page.module.css'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, isAuthenticated, isLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = searchParams.get('redirect') || '/admin/propiedades'

  useEffect(() => {
    // Si ya está autenticado, redirigir
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isLoading, router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const success = await login({ email, password })
      if (success) {
        router.push(redirectTo)
      } else {
        setError('Email o contraseña incorrectos. Verifica tus credenciales.')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('Ocurrió un error. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Ya se redirige en el useEffect
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <div className={styles.header}>
          <h1>Panel de Administración</h1>
          <p>Julieta Arena - Servicios Inmobiliarios</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@julietaarena.com.ar"
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? '⏳ Iniciando sesión...' : '🔐 Iniciar Sesión'}
          </button>
        </form>

        <div className={styles.info}>
          <p>🔒 <strong>Acceso Restringido</strong></p>
          <p>Solo los administradores autorizados pueden acceder a este panel.</p>
          <p className={styles.note}>Los usuarios administradores deben ser creados por el administrador del sistema desde el panel de Supabase.</p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.loading}>Cargando...</div></div>}>
      <LoginForm />
    </Suspense>
  )
}
