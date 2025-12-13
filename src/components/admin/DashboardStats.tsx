'use client'

import { useDashboardStats } from '@/hooks/useDashboardStats'
import styles from './DashboardStats.module.css'

export default function DashboardStats() {
  const { stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className={styles.statsGrid}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statSkeleton}></div>
          </div>
        ))}
      </div>
    )
  }

  if (!stats) {
    return <div className={styles.error}>Error al cargar estadísticas</div>
  }

  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#e3f2fd' }}>
          <span>🏘️</span>
        </div>
        <div className={styles.statContent}>
          <h3>Total Propiedades</h3>
          <p className={styles.statNumber}>{stats.totalProperties}</p>
          <span className={styles.statLabel}>En el sistema</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#e8f5e9' }}>
          <span>✅</span>
        </div>
        <div className={styles.statContent}>
          <h3>Disponibles</h3>
          <p className={styles.statNumber}>{stats.activeProperties}</p>
          <span className={styles.statLabel}>Activas</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#f3e5f5' }}>
          <span>⭐</span>
        </div>
        <div className={styles.statContent}>
          <h3>Destacadas</h3>
          <p className={styles.statNumber}>{stats.featuredProperties}</p>
          <span className={styles.statLabel}>En portada</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#fff3e0' }}>
          <span>💬</span>
        </div>
        <div className={styles.statContent}>
          <h3>Consultas 24h</h3>
          <p className={styles.statNumber}>{stats.newInquiries24h}</p>
          <span className={styles.statLabel}>Últimas 24 horas</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#e0f2f1' }}>
          <span>📧</span>
        </div>
        <div className={styles.statContent}>
          <h3>Contactos 24h</h3>
          <p className={styles.statNumber}>{stats.newContacts24h}</p>
          <span className={styles.statLabel}>Últimas 24 horas</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#fce4ec' }}>
          <span>📊</span>
        </div>
        <div className={styles.statContent}>
          <h3>Tasa Conversión</h3>
          <p className={styles.statNumber}>{stats.conversionRate}%</p>
          <span className={styles.statLabel}>Consultas/Propiedades</span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#ede7f6' }}>
          <span>💰</span>
        </div>
        <div className={styles.statContent}>
          <h3>Ingresos Estimados</h3>
          <p className={styles.statNumber}>
            ${stats.estimatedRevenue.total.toLocaleString('es-AR')}
          </p>
          <span className={styles.statLabel}>
            Venta: ${stats.estimatedRevenue.sales.toLocaleString('es-AR')} | 
            Alquiler: ${stats.estimatedRevenue.rentals.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ background: '#e1f5fe' }}>
          <span>📈</span>
        </div>
        <div className={styles.statContent}>
          <h3>Distribución</h3>
          <p className={styles.statNumber}>
            {Object.keys(stats.propertiesByType).length}
          </p>
          <span className={styles.statLabel}>Tipos diferentes</span>
        </div>
      </div>
    </div>
  )
}

