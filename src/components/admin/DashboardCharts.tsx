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
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#E91E63', '#9C27B0', '#607D8B']

export default function DashboardCharts() {
  const { stats, isLoading } = useDashboardStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-[300px] rounded-xl',
              'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100',
              'bg-[length:200%_100%] animate-pulse'
            )}
          />
        ))}
      </div>
    )
  }

  // Preparar datos para grafico de propiedades por mes
  const monthlyData = stats.propertiesByMonth.map(item => ({
    name: item.month,
    propiedades: item.count,
  }))

  // Preparar datos para grafico de barras (distribucion por tipo)
  const typeData = Object.entries(stats.propertiesByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    cantidad: value,
  }))

  // Preparar datos para grafico de dona (estado)
  const statusData = Object.entries(stats.propertiesByStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]">
      {/* Grafico de lineas: Propiedades por mes */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Propiedades por Mes</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Grafico de barras: Distribucion por tipo */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Distribucion por Tipo</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Grafico de dona: Estado de propiedades */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Estado de Propiedades</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {/* Grafico de area: Operacion (Venta vs Alquiler) */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Venta vs Alquiler</CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
