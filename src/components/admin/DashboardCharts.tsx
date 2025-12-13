'use client'

import { useDashboardStats } from '@/hooks/useDashboardStats'
import {
  LineChart,
  Line,
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
  Legend,
  ResponsiveContainer,
} from 'recharts'
import styles from './DashboardCharts.module.css'

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#607D8B']

export default function DashboardCharts() {
  const { stats, isLoading } = useDashboardStats()

  if (isLoading || !stats) {
    return (
      <div className={styles.chartsGrid}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.chartSkeleton}></div>
        ))}
      </div>
    )
  }

  // Preparar datos para gráfico de propiedades por mes
  const monthlyData = stats.propertiesByMonth.map(item => ({
    name: item.month,
    propiedades: item.count,
  }))

  // Preparar datos para gráfico de barras (distribución por tipo)
  const typeData = Object.entries(stats.propertiesByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    cantidad: value,
  }))

  // Preparar datos para gráfico de dona (estado)
  const statusData = Object.entries(stats.propertiesByStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  return (
    <div className={styles.chartsGrid}>
      {/* Gráfico de líneas: Propiedades por mes */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Propiedades por Mes</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="propiedades" stroke="#2196F3" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de barras: Distribución por tipo */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Distribución por Tipo</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de dona: Estado de propiedades */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Estado de Propiedades</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de área: Operación (Venta vs Alquiler) */}
      <div className={styles.chartCard}>
        <h3 className={styles.chartTitle}>Venta vs Alquiler</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={[
            { name: 'Venta', cantidad: stats.propertiesByOperation.venta || 0 },
            { name: 'Alquiler', cantidad: stats.propertiesByOperation.alquiler || 0 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="cantidad" stroke="#FF9800" fill="#FF9800" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

