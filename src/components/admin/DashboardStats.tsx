'use client'

import { DashboardStats as DashboardStatsType, TrendData } from '@/hooks/useDashboardStats'
import { cn } from '@/lib/utils'
import {
  Building2,
  CheckCircle,
  Star,
  MessageSquare,
  Mail,
  BarChart3,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  value: string | number
  subtitle?: string
  trend?: TrendData
  trendLabel?: string
}

interface DashboardStatsProps {
  stats: DashboardStatsType | null
  isLoading: boolean
  error?: string | null
}

function TrendBadge({ trend, label }: { trend: TrendData; label: string }) {
  const isPositive = trend.change > 0
  const isNeutral = trend.change === 0

  if (isNeutral) {
    return (
      <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-400">
        <Minus className="h-3 w-3" />
        sin cambios
      </span>
    )
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-0.5 text-[11px] font-medium',
      isPositive ? 'text-emerald-600' : 'text-red-500'
    )}>
      {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {isPositive ? '+' : ''}{trend.change}% {label}
    </span>
  )
}

function StatCard({ icon, iconBg, title, value, subtitle, trend, trendLabel }: StatCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-white p-4 border border-slate-100 transition-shadow hover:shadow-sm">
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', iconBg)}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-500 mb-0.5">{title}</p>
        <p className="text-xl font-semibold tracking-tight text-slate-900">{value}</p>
        {trend ? (
          <TrendBadge trend={trend} label={trendLabel || ''} />
        ) : subtitle ? (
          <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

function StatSkeleton() {
  return (
    <div className="rounded-xl bg-white p-4 border border-slate-100">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-slate-100 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 rounded bg-slate-100 animate-pulse" />
          <div className="h-6 w-12 rounded bg-slate-100 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardStats({ stats, isLoading, error }: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => <StatSkeleton key={i} />)}
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-100 p-6 text-center">
        <p className="text-sm font-medium text-red-600">Error al cargar estadísticas</p>
        {error && <p className="text-xs mt-1 text-red-400">{error}</p>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Building2 className="h-4 w-4 text-blue-600" />}
        iconBg="bg-blue-50"
        title="Total Propiedades"
        value={stats.totalProperties}
        trend={stats.trends.properties}
        trendLabel="vs sem. anterior"
      />
      <StatCard
        icon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
        iconBg="bg-emerald-50"
        title="Disponibles"
        value={stats.activeProperties}
        subtitle="Activas"
      />
      <StatCard
        icon={<Star className="h-4 w-4 text-amber-600" />}
        iconBg="bg-amber-50"
        title="Destacadas"
        value={stats.featuredProperties}
        subtitle="En portada"
      />
      <StatCard
        icon={<MessageSquare className="h-4 w-4 text-orange-600" />}
        iconBg="bg-orange-50"
        title="Consultas 24h"
        value={stats.newInquiries24h}
        trend={stats.trends.inquiries}
        trendLabel="vs ayer"
      />
      <StatCard
        icon={<Mail className="h-4 w-4 text-teal-600" />}
        iconBg="bg-teal-50"
        title="Contactos 24h"
        value={stats.newContacts24h}
        trend={stats.trends.contacts}
        trendLabel="vs ayer"
      />
      <StatCard
        icon={<BarChart3 className="h-4 w-4 text-pink-600" />}
        iconBg="bg-pink-50"
        title="Tasa Conversión"
        value={`${stats.conversionRate}%`}
        subtitle="Consultas / Propiedades"
      />
      <StatCard
        icon={<DollarSign className="h-4 w-4 text-violet-600" />}
        iconBg="bg-violet-50"
        title="Ingresos Estimados"
        value={`$${stats.estimatedRevenue.total.toLocaleString('es-AR')}`}
        subtitle={`V: $${stats.estimatedRevenue.sales.toLocaleString('es-AR')} | A: $${stats.estimatedRevenue.rentals.toLocaleString('es-AR')}`}
      />
      <StatCard
        icon={<TrendingUp className="h-4 w-4 text-sky-600" />}
        iconBg="bg-sky-50"
        title="Distribución"
        value={Object.keys(stats.propertiesByType).length}
        subtitle="Tipos diferentes"
      />
    </div>
  )
}
