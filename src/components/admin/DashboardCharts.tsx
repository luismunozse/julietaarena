'use client'

import { DashboardStats } from '@/hooks/useDashboardStats'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Brand-aligned palette: primary blue, gold accent, dark accent, teal, warm, neutral
const COLORS = ['#2c5f7d', '#e8b86d', '#1a4158', '#14b8a6', '#f59e0b', '#64748b']

interface DashboardChartsProps {
  stats: DashboardStats | null
  isLoading: boolean
}

export default function DashboardCharts({ stats, isLoading }: DashboardChartsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-[280px] sm:h-[300px] rounded-xl',
              'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100',
              'bg-[length:200%_100%] animate-pulse'
            )}
          />
        ))}
      </div>
    )
  }

  const monthlyData = stats.propertiesByMonth.map(item => ({
    name: item.month,
    propiedades: item.count,
  }))

  const typeData = Object.entries(stats.propertiesByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    cantidad: value,
  }))

  const statusData = Object.entries(stats.propertiesByStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
      {/* Grafico de lineas: Propiedades por mes */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Propiedades por Mes</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="propiedades" stroke="#2c5f7d" strokeWidth={2} dot={{ fill: '#2c5f7d', r: 3 }} activeDot={{ fill: '#e8b86d', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafico de barras: Distribucion por tipo */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Distribución por Tipo</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={30} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#2c5f7d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafico de dona: Estado de propiedades */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Estado de Propiedades</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                formatter={(value: string) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafico de barras: Venta vs Alquiler */}
      <Card className="p-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#2c5f7d]">Venta vs Alquiler</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { name: 'Venta', cantidad: stats.propertiesByOperation.venta || 0 },
              { name: 'Alquiler', cantidad: stats.propertiesByOperation.alquiler || 0 },
            ]} layout="vertical" barSize={40}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={65} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#e8b86d" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
