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

const COLORS = ['#2c5f7d', '#e8b86d', '#1a4158', '#14b8a6', '#f59e0b', '#64748b']

interface DashboardChartsProps {
  stats: DashboardStats | null
  isLoading: boolean
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-slate-100 p-5">
      <h3 className="text-sm font-medium text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function DashboardCharts({ stats, isLoading }: DashboardChartsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[260px] rounded-xl bg-white border border-slate-100 animate-pulse" />
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

  const gridStyle = { stroke: '#f1f5f9' }
  const axisStyle = { fontSize: 11, fill: '#94a3b8' }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ChartCard title="Propiedades por Mes">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Line type="monotone" dataKey="propiedades" stroke="#2c5f7d" strokeWidth={2} dot={{ fill: '#2c5f7d', r: 3 }} activeDot={{ fill: '#e8b86d', r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Distribución por Tipo">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Bar dataKey="cantidad" fill="#2c5f7d" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Estado de Propiedades">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={65}
              innerRadius={35}
              fill="#8884d8"
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
            >
              {statusData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value: string) => <span className="text-xs text-slate-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Venta vs Alquiler">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[
            { name: 'Venta', cantidad: stats.propertiesByOperation.venta || 0 },
            { name: 'Alquiler', cantidad: stats.propertiesByOperation.alquiler || 0 },
          ]} layout="vertical" barSize={32}>
            <CartesianGrid strokeDasharray="3 3" {...gridStyle} />
            <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" width={65} tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
            <Bar dataKey="cantidad" fill="#e8b86d" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
