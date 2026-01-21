'use client'

import { useState, useEffect, useMemo, CSSProperties } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useProperties } from '@/hooks/useProperties'
import { useAnalytics } from '@/hooks/useAnalytics'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { subDays, format } from 'date-fns'

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#607D8B']

interface AnalyticsChartsProps {
  timeRange: '24h' | '7d' | '30d' | 'all'
}

const styles: Record<string, CSSProperties> = {
  chartsContainer: {
    marginTop: '1.5rem',
  },
  loading: {
    padding: '2rem',
    textAlign: 'center',
    color: '#636e72',
    fontSize: '0.875rem',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '1.25rem',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
  },
  metricCardH3: {
    margin: '0 0 0.5rem 0',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: '#636e72',
  },
  metricValue: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2c5f7d',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    padding: '1.5rem',
    border: '1px solid #e5e7eb',
  },
  chartTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#1a4158',
  },
}

export default function AnalyticsCharts({ timeRange }: AnalyticsChartsProps) {
  const { properties } = useProperties()
  const analytics = useAnalytics()
  const [inquiriesData, setInquiriesData] = useState<any[]>([])
  const [contactsData, setContactsData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        // Cargar consultas
        const { data: inquiries } = await supabase
          .from('property_inquiries')
          .select('id, created_at, property_id, status')
          .order('created_at', { ascending: false })

        // Cargar contactos
        const { data: contacts } = await supabase
          .from('contact_inquiries')
          .select('id, created_at, service, status')
          .order('created_at', { ascending: false })

        setInquiriesData(inquiries || [])
        setContactsData(contacts || [])
      } catch (err) {
        console.error('Error cargando datos:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar datos por rango de tiempo
  const filterByTimeRange = useMemo(() => {
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case '24h':
        startDate = subDays(now, 1)
        break
      case '7d':
        startDate = subDays(now, 7)
        break
      case '30d':
        startDate = subDays(now, 30)
        break
      default:
        startDate = new Date(0) // Todo el tiempo
    }

    return (dateString: string) => {
      const date = new Date(dateString)
      return date >= startDate
    }
  }, [timeRange])

  // Consultas por dia
  const inquiriesByDay = useMemo(() => {
    const filtered = inquiriesData.filter(i => filterByTimeRange(i.created_at))
    const grouped: Record<string, number> = {}

    filtered.forEach(inq => {
      const day = format(new Date(inq.created_at), 'yyyy-MM-dd')
      grouped[day] = (grouped[day] || 0) + 1
    })

    return Object.entries(grouped)
      .map(([day, count]) => ({ day: format(new Date(day), 'dd/MM'), count }))
      .sort((a, b) => a.day.localeCompare(b.day))
  }, [inquiriesData, filterByTimeRange])

  // Consultas por propiedad
  const inquiriesByProperty = useMemo(() => {
    const filtered = inquiriesData.filter(i => filterByTimeRange(i.created_at))
    const grouped: Record<string, number> = {}

    filtered.forEach(inq => {
      const propId = inq.property_id || 'unknown'
      grouped[propId] = (grouped[propId] || 0) + 1
    })

    return Object.entries(grouped)
      .map(([propId, count]) => {
        const property = properties.find(p => p.id === propId)
        return {
          name: property?.title || 'Propiedad eliminada',
          count,
        }
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [inquiriesData, properties, filterByTimeRange])

  // Consultas por estado
  const inquiriesByStatus = useMemo(() => {
    const filtered = inquiriesData.filter(i => filterByTimeRange(i.created_at))
    const grouped: Record<string, number> = {}

    filtered.forEach(inq => {
      grouped[inq.status] = (grouped[inq.status] || 0) + 1
    })

    return Object.entries(grouped).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }))
  }, [inquiriesData, filterByTimeRange])

  // Consultas por hora del dia (heatmap)
  const inquiriesByHour = useMemo(() => {
    const filtered = inquiriesData.filter(i => filterByTimeRange(i.created_at))
    const grouped: Record<number, number> = {}

    filtered.forEach(inq => {
      const hour = new Date(inq.created_at).getHours()
      grouped[hour] = (grouped[hour] || 0) + 1
    })

    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: grouped[i] || 0,
    }))
  }, [inquiriesData, filterByTimeRange])

  // Tasa de conversion (consultas / propiedades activas)
  const conversionRate = useMemo(() => {
    const activeProperties = properties.filter(p => p.status === 'disponible').length
    const filteredInquiries = inquiriesData.filter(i => filterByTimeRange(i.created_at))
    if (activeProperties === 0) return 0
    return (filteredInquiries.length / activeProperties) * 100
  }, [properties, inquiriesData, filterByTimeRange])

  // Tiempo promedio de respuesta (simulado - necesitaria campo updated_at en consultas)
  const avgResponseTime = useMemo(() => {
    // Por ahora retornamos un valor simulado
    return '2.5 horas'
  }, [])

  if (isLoading) {
    return <div style={styles.loading}>Cargando graficos...</div>
  }

  return (
    <div style={styles.chartsContainer}>
      {/* Metricas principales */}
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <h3 style={styles.metricCardH3}>Consultas Totales</h3>
          <p style={styles.metricValue}>
            {inquiriesData.filter(i => filterByTimeRange(i.created_at)).length}
          </p>
        </div>
        <div style={styles.metricCard}>
          <h3 style={styles.metricCardH3}>Tasa de Conversion</h3>
          <p style={styles.metricValue}>{conversionRate.toFixed(1)}%</p>
        </div>
        <div style={styles.metricCard}>
          <h3 style={styles.metricCardH3}>Contactos Totales</h3>
          <p style={styles.metricValue}>
            {contactsData.filter(c => filterByTimeRange(c.created_at)).length}
          </p>
        </div>
        <div style={styles.metricCard}>
          <h3 style={styles.metricCardH3}>Tiempo Promedio Respuesta</h3>
          <p style={styles.metricValue}>{avgResponseTime}</p>
        </div>
      </div>

      {/* Graficos */}
      <div style={styles.chartsGrid}>
        {/* Consultas por dia */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Consultas por Dia</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={inquiriesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#2196F3" fill="#2196F3" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Consultas por propiedad */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Top 10 Propiedades Mas Consultadas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inquiriesByProperty}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Consultas por estado */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Distribucion por Estado</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={inquiriesByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {inquiriesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Consultas por hora */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Consultas por Hora del Dia</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={inquiriesByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
