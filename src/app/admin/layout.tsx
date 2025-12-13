'use client'

import { useEffect, ReactNode, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useAdminKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import Modal from '@/components/Modal'
import KeyboardShortcuts from '@/components/admin/KeyboardShortcuts'
import ThemeToggle from '@/components/admin/ThemeToggle'
import styles from './layout.module.css'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // Activar atajos de teclado
  useAdminKeyboardShortcuts()

  useEffect(() => {
    // Solo redirigir si ya terminó de cargar y no está autenticado
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Mostrar loading mientras verifica la sesión
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Verificando sesión...</p>
      </div>
    )
  }

  // No renderizar nada mientras redirige
  if (!isAuthenticated) {
    return null
  }

  const handleLogoutClick = () => {
    setShowLogoutModal(true)
  }

  const handleLogoutConfirm = async () => {
    await logout()
    router.push('/login')
  }

  const menuItems = [
    { path: '/admin', icon: '📊', label: 'Dashboard', exact: true },
    { path: '/admin/propiedades', icon: '🏠', label: 'Propiedades', exact: true },
    { path: '/admin/propiedades/nueva', icon: '➕', label: 'Nueva Propiedad', exact: true },
    { path: '/admin/consultas', icon: '💬', label: 'Consultas', exact: false },
    { path: '/admin/contactos', icon: '📧', label: 'Contactos', exact: false },
    { path: '/admin/analytics', icon: '📈', label: 'Analytics', exact: false },
    { path: '/admin/usuarios', icon: '👥', label: 'Usuarios', exact: false },
    { path: '/admin/logs', icon: '📋', label: 'Logs', exact: false },
    { path: '/admin/plantillas', icon: '📄', label: 'Plantillas', exact: false },
    { path: '/admin/backup', icon: '💾', label: 'Backup', exact: false },
    { path: '/admin/configuracion', icon: '⚙️', label: 'Configuración', exact: false },
  ]

  const isActive = (path: string, exact: boolean) => {
    if (exact) {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}>
        {/* Logo/Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>🏘️</span>
            {!sidebarCollapsed && (
              <div className={styles.logoText}>
                <h2>Julieta Arena</h2>
                <p>Admin Panel</p>
              </div>
            )}
          </div>
          <button
            className={styles.toggleButton}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? 'Expandir' : 'Contraer'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* User Info */}
        <div className={styles.userSection}>
          <div className={styles.userAvatar}>
            {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
          </div>
          {!sidebarCollapsed && (
            <div className={styles.userName}>
              <p className={styles.userNameText}>{user?.name || 'Admin'}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className={styles.navigation}>
          <div className={styles.navSection}>
            {!sidebarCollapsed && <p className={styles.navTitle}>MENÚ PRINCIPAL</p>}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`${styles.navItem} ${isActive(item.path, item.exact) ? styles.active : ''}`}
                title={item.label}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!sidebarCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              </Link>
            ))}
          </div>

          <div className={styles.navSection}>
            {!sidebarCollapsed && <p className={styles.navTitle}>ACCIONES</p>}
            <Link
              href="/"
              className={styles.navItem}
              title="Ver Sitio"
            >
              <span className={styles.navIcon}>🌐</span>
              {!sidebarCollapsed && <span className={styles.navLabel}>Ver Sitio</span>}
            </Link>
            {!sidebarCollapsed && (
              <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                <ThemeToggle />
              </div>
            )}
            <button
              onClick={handleLogoutClick}
              className={`${styles.navItem} ${styles.logoutItem}`}
              title="Cerrar Sesión"
              type="button"
            >
              <span className={styles.navIcon}>🚪</span>
              {!sidebarCollapsed && <span className={styles.navLabel}>Cerrar Sesión</span>}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>

      {/* Componentes globales */}
      <KeyboardShortcuts />

      {/* Modal de Logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Cerrar Sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        type="confirm"
      />
    </div>
  )
}
