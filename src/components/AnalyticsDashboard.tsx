'use client'

import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import styles from './AnalyticsDashboard.module.css'

interface AnalyticsData {
  totalEvents: number
  totalPageViews: number
  popularPages: Array<{ page: string; views: number }>
  popularEvents: Array<{ event: string; count: number }>
  events: any[]
  pageViews: any[]
}

export default function AnalyticsDashboard() {
  const analytics = useAnalytics()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d')

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const analyticsData = analytics.exportData()
      setData(analyticsData)
      setIsLoading(false)
    }

    loadData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)
    
    return () => clearInterval(interval)
  }, [analytics])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-AR')
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '24h': return 'Últimas 24 horas'
      case '7d': return 'Últimos 7 días'
      case '30d': return 'Últimos 30 días'
      case 'all': return 'Todo el tiempo'
      default: return 'Últimos 7 días'
    }
  }

  if (isLoading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando datos de analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.error}>
          <p>No se pudieron cargar los datos de analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard de Analytics</h1>
        <div className={styles.controls}>
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            className={styles.timeRange}
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="all">Todo el tiempo</option>
          </select>
          <button 
            onClick={() => analytics.clearData()}
            className={styles.clearBtn}
          >
            Limpiar Datos
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Eventos Totales</h3>
            <p className={styles.statNumber}>{formatNumber(data.totalEvents)}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👁️</div>
          <div className={styles.statContent}>
            <h3>Vistas de Página</h3>
            <p className={styles.statNumber}>{formatNumber(data.totalPageViews)}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏠</div>
          <div className={styles.statContent}>
            <h3>Propiedades Vistas</h3>
            <p className={styles.statNumber}>
              {formatNumber(data.events.filter(e => e.category === 'property').length)}
            </p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📞</div>
          <div className={styles.statContent}>
            <h3>Contactos</h3>
            <p className={styles.statNumber}>
              {formatNumber(data.events.filter(e => e.category === 'contact').length)}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.section}>
          <h2>Páginas Más Visitadas</h2>
          <div className={styles.list}>
            {data.popularPages.slice(0, 10).map((page, index) => (
              <div key={index} className={styles.listItem}>
                <span className={styles.listLabel}>{page.page}</span>
                <span className={styles.listValue}>{formatNumber(page.views)} vistas</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Eventos Más Frecuentes</h2>
          <div className={styles.list}>
            {data.popularEvents.slice(0, 10).map((event, index) => (
              <div key={index} className={styles.listItem}>
                <span className={styles.listLabel}>{event.event}</span>
                <span className={styles.listValue}>{formatNumber(event.count)} veces</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Eventos Recientes</h2>
        <div className={styles.eventsTable}>
          <div className={styles.tableHeader}>
            <span>Evento</span>
            <span>Categoría</span>
            <span>Acción</span>
            <span>Fecha</span>
          </div>
          {data.events.slice(-20).reverse().map((event, index) => (
            <div key={index} className={styles.tableRow}>
              <span className={styles.eventName}>{event.event}</span>
              <span className={styles.eventCategory}>{event.category}</span>
              <span className={styles.eventAction}>{event.action}</span>
              <span className={styles.eventDate}>{formatDate(event.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Vistas de Página Recientes</h2>
        <div className={styles.eventsTable}>
          <div className={styles.tableHeader}>
            <span>Página</span>
            <span>Título</span>
            <span>URL</span>
            <span>Fecha</span>
          </div>
          {data.pageViews.slice(-20).reverse().map((pageView, index) => (
            <div key={index} className={styles.tableRow}>
              <span className={styles.eventName}>{pageView.page}</span>
              <span className={styles.eventCategory}>{pageView.title}</span>
              <span className={styles.eventAction}>{pageView.url}</span>
              <span className={styles.eventDate}>{formatDate(pageView.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
