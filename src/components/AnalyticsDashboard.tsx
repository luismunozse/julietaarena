'use client'

import { useState, useEffect, CSSProperties } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'

interface AnalyticsData {
  totalEvents: number
  totalPageViews: number
  popularPages: Array<{ page: string; views: number }>
  popularEvents: Array<{ event: string; count: number }>
  events: any[]
  pageViews: any[]
}

const styles: Record<string, CSSProperties> = {
  dashboard: {
    padding: '1.5rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    color: '#636e72',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTopColor: '#2c5f7d',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  error: {
    padding: '2rem',
    textAlign: 'center',
    color: '#636e72',
    backgroundColor: '#f8f9fa',
    borderRadius: '16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  headerH1: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1a4158',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  timeRange: {
    padding: '0.5rem 1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#1a4158',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  clearBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    color: '#636e72',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(44, 95, 125, 0.1)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  statContent: {
    flex: 1,
  },
  statContentH3: {
    margin: '0 0 0.25rem 0',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: '#636e72',
  },
  statNumber: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1a4158',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #e5e7eb',
  },
  sectionH2: {
    margin: '0 0 1rem 0',
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#1a4158',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  listLabel: {
    fontSize: '0.875rem',
    color: '#1a4158',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '70%',
  },
  listValue: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#2c5f7d',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    padding: '2rem',
    textAlign: 'center',
    color: '#636e72',
    fontSize: '0.875rem',
  },
  eventsTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    overflow: 'auto',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: '#2c5f7d',
    color: '#ffffff',
    borderRadius: '8px 8px 0 0',
    fontSize: '0.8125rem',
    fontWeight: 600,
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    fontSize: '0.8125rem',
    borderBottom: '1px solid #e5e7eb',
  },
  eventName: {
    color: '#1a4158',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  eventCategory: {
    color: '#636e72',
  },
  eventAction: {
    color: '#636e72',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  eventDate: {
    color: '#636e72',
    fontSize: '0.75rem',
  },
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
      setData(analyticsData as any)
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

  if (isLoading) {
    return (
      <div style={styles.dashboard}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Cargando datos de analytics...</p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!data) {
    return (
      <div style={styles.dashboard}>
        <div style={styles.error}>
          <p>No se pudieron cargar los datos de analytics.</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1 style={styles.headerH1}>Dashboard de Analytics</h1>
        <div style={styles.controls}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            style={styles.timeRange}
          >
            <option value="24h">Ultimas 24 horas</option>
            <option value="7d">Ultimos 7 dias</option>
            <option value="30d">Ultimos 30 dias</option>
            <option value="all">Todo el tiempo</option>
          </select>
          <button
            onClick={() => analytics.clearData()}
            style={styles.clearBtn}
          >
            Limpiar Datos
          </button>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statContent}>
            <h3 style={styles.statContentH3}>Eventos Totales</h3>
            <p style={styles.statNumber}>{formatNumber(data.totalEvents || 0)}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>👁️</div>
          <div style={styles.statContent}>
            <h3 style={styles.statContentH3}>Vistas de Pagina</h3>
            <p style={styles.statNumber}>{formatNumber(data.totalPageViews || 0)}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏠</div>
          <div style={styles.statContent}>
            <h3 style={styles.statContentH3}>Propiedades Vistas</h3>
            <p style={styles.statNumber}>
              {formatNumber((data.events || []).filter(e => e.category === 'property').length)}
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>📞</div>
          <div style={styles.statContent}>
            <h3 style={styles.statContentH3}>Contactos</h3>
            <p style={styles.statNumber}>
              {formatNumber((data.events || []).filter(e => e.category === 'contact').length)}
            </p>
          </div>
        </div>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.section}>
          <h2 style={styles.sectionH2}>Paginas Mas Visitadas</h2>
          <div style={styles.list}>
            {(data.popularPages || []).slice(0, 10).length > 0 ? (
              (data.popularPages || []).slice(0, 10).map((page, index) => (
                <div key={index} style={styles.listItem}>
                  <span style={styles.listLabel}>{page.page}</span>
                  <span style={styles.listValue}>{formatNumber(page.views)} vistas</span>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p>No hay datos de paginas visitadas aun</p>
              </div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionH2}>Eventos Mas Frecuentes</h2>
          <div style={styles.list}>
            {(data.popularEvents || []).slice(0, 10).length > 0 ? (
              (data.popularEvents || []).slice(0, 10).map((event, index) => (
                <div key={index} style={styles.listItem}>
                  <span style={styles.listLabel}>{event.event}</span>
                  <span style={styles.listValue}>{formatNumber(event.count)} veces</span>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>
                <p>No hay datos de eventos aun</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionH2}>Eventos Recientes</h2>
        <div style={styles.eventsTable}>
          {(data.events || []).length > 0 ? (
            <>
              <div style={styles.tableHeader}>
                <span>Evento</span>
                <span>Categoria</span>
                <span>Accion</span>
                <span>Fecha</span>
              </div>
              {(data.events || []).slice(-20).reverse().map((event, index) => (
                <div key={index} style={styles.tableRow}>
                  <span style={styles.eventName}>{event.event}</span>
                  <span style={styles.eventCategory}>{event.category}</span>
                  <span style={styles.eventAction}>{event.action}</span>
                  <span style={styles.eventDate}>{formatDate(event.timestamp)}</span>
                </div>
              ))}
            </>
          ) : (
            <div style={styles.emptyState}>
              <p>No hay eventos registrados aun</p>
            </div>
          )}
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionH2}>Vistas de Pagina Recientes</h2>
        <div style={styles.eventsTable}>
          {(data.pageViews || []).length > 0 ? (
            <>
              <div style={styles.tableHeader}>
                <span>Pagina</span>
                <span>Titulo</span>
                <span>URL</span>
                <span>Fecha</span>
              </div>
              {(data.pageViews || []).slice(-20).reverse().map((pageView, index) => (
                <div key={index} style={styles.tableRow}>
                  <span style={styles.eventName}>{pageView.page}</span>
                  <span style={styles.eventCategory}>{pageView.title}</span>
                  <span style={styles.eventAction}>{pageView.url}</span>
                  <span style={styles.eventDate}>{formatDate(pageView.timestamp)}</span>
                </div>
              ))}
            </>
          ) : (
            <div style={styles.emptyState}>
              <p>No hay vistas de pagina registradas aun</p>
            </div>
          )}
        </div>
      </div>

      {/* Graficos Avanzados */}
      <AnalyticsCharts timeRange={timeRange} />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
