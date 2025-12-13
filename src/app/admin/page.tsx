'use client'

import Link from 'next/link'
import NotificationSettings from '@/components/NotificationSettings'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import DashboardCharts from '@/components/admin/DashboardCharts'
import styles from './page.module.css'

export default function AdminDashboard() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.header}>
        <h1>Panel de Administración</h1>
        <p>Bienvenido al panel de control de Julieta Arena</p>
      </div>

      {/* Estadísticas en tiempo real */}
      <DashboardStats />

      {/* Gráficos */}
      <DashboardCharts />

      {/* Actividad reciente */}
      <RecentActivity />

      <div className={styles.dashboardGrid}>
        {/* Card de Propiedades */}
        <Link href="/admin/propiedades" className={styles.dashboardCard}>
          <div className={styles.cardIcon}>🏠</div>
          <div className={styles.cardContent}>
            <h2>Propiedades</h2>
            <p>Gestionar propiedades en venta y alquiler</p>
          </div>
          <div className={styles.cardArrow}>→</div>
        </Link>

        {/* Card de Nueva Propiedad */}
        <Link href="/admin/propiedades/nueva" className={styles.dashboardCard}>
          <div className={styles.cardIcon}>➕</div>
          <div className={styles.cardContent}>
            <h2>Nueva Propiedad</h2>
            <p>Agregar una nueva propiedad al catálogo</p>
          </div>
          <div className={styles.cardArrow}>→</div>
        </Link>

        {/* Card de Consultas */}
        <Link href="/admin/consultas" className={styles.dashboardCard}>
          <div className={styles.cardIcon}>💬</div>
          <div className={styles.cardContent}>
            <h2>Consultas</h2>
            <p>Ver y gestionar consultas de propiedades</p>
          </div>
          <div className={styles.cardArrow}>→</div>
        </Link>

        {/* Card de Contactos */}
        <Link href="/admin/contactos" className={styles.dashboardCard}>
          <div className={styles.cardIcon}>📧</div>
          <div className={styles.cardContent}>
            <h2>Contactos</h2>
            <p>Ver y gestionar contactos generales</p>
          </div>
          <div className={styles.cardArrow}>→</div>
        </Link>

        {/* Card de Analytics */}
        <Link href="/admin/analytics" className={styles.dashboardCard}>
          <div className={styles.cardIcon}>📈</div>
          <div className={styles.cardContent}>
            <h2>Analytics</h2>
            <p>Ver métricas y estadísticas del sitio</p>
          </div>
          <div className={styles.cardArrow}>→</div>
        </Link>

        {/* Card de Ver Sitio */}
        <Link href="/" className={styles.dashboardCard}>
          <div className={styles.cardIcon}>🌐</div>
          <div className={styles.cardContent}>
            <h2>Ver Sitio Web</h2>
            <p>Ir al sitio web público</p>
          </div>
          <div className={styles.cardArrow}>→</div>
        </Link>
      </div>

      {/* Sección de accesos rápidos */}
      <div className={styles.quickActions}>
        <h2>Accesos Rápidos</h2>
        <div className={styles.actionsGrid}>
          <Link href="/admin/propiedades/nueva" className={styles.actionButton}>
            <span className={styles.actionIcon}>➕</span>
            <span>Agregar Propiedad</span>
          </Link>
          <Link href="/admin/propiedades" className={styles.actionButton}>
            <span className={styles.actionIcon}>📋</span>
            <span>Ver Todas</span>
          </Link>
          <Link href="/admin/consultas" className={styles.actionButton}>
            <span className={styles.actionIcon}>💬</span>
            <span>Ver Consultas</span>
          </Link>
          <Link href="/admin/contactos" className={styles.actionButton}>
            <span className={styles.actionIcon}>📧</span>
            <span>Ver Contactos</span>
          </Link>
          <Link href="/admin/analytics" className={styles.actionButton}>
            <span className={styles.actionIcon}>📊</span>
            <span>Ver Estadísticas</span>
          </Link>
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <div className={styles.notificationsSection}>
        <h2>Notificaciones en Tiempo Real</h2>
        <NotificationSettings />
      </div>
    </main>
  )
}
