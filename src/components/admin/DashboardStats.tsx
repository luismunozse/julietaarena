'use client'

import { useDashboardStats } from '@/hooks/useDashboardStats'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import {
  Building2,
  CheckCircle,
  Star,
  MessageSquare,
  Mail,
  BarChart3,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  iconBgColor: string
  title: string
  value: string | number
  label: string
}

function StatCard({ icon, iconBgColor, title, value, label }: StatCardProps) {
  return (
    <Card className="flex flex-row items-center gap-4 p-4 md:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
          iconBgColor
        )}
      >
        {icon}
      </div>
      <CardContent className="flex-1 p-0">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <p className="mb-1 text-2xl font-bold leading-none text-[#2c5f7d] md:text-3xl">
          {value}
        </p>
        <span className="text-sm text-muted-foreground">{label}</span>
      </CardContent>
    </Card>
  )
}

function StatSkeleton() {
  return (
    <Card className="p-4 md:p-6">
      <div className="h-24 w-full animate-pulse rounded-xl bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%]" />
    </Card>
  )
}

export default function DashboardStats() {
  const { stats, isLoading } = useDashboardStats()

  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="rounded-lg bg-red-50 p-8 text-center text-red-500">
        Error al cargar estadisticas
      </div>
    )
  }

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Building2 className="h-8 w-8 text-blue-600" />}
        iconBgColor="bg-blue-50"
        title="Total Propiedades"
        value={stats.totalProperties}
        label="En el sistema"
      />

      <StatCard
        icon={<CheckCircle className="h-8 w-8 text-green-600" />}
        iconBgColor="bg-green-50"
        title="Disponibles"
        value={stats.activeProperties}
        label="Activas"
      />

      <StatCard
        icon={<Star className="h-8 w-8 text-purple-600" />}
        iconBgColor="bg-purple-50"
        title="Destacadas"
        value={stats.featuredProperties}
        label="En portada"
      />

      <StatCard
        icon={<MessageSquare className="h-8 w-8 text-orange-600" />}
        iconBgColor="bg-orange-50"
        title="Consultas 24h"
        value={stats.newInquiries24h}
        label="Ultimas 24 horas"
      />

      <StatCard
        icon={<Mail className="h-8 w-8 text-teal-600" />}
        iconBgColor="bg-teal-50"
        title="Contactos 24h"
        value={stats.newContacts24h}
        label="Ultimas 24 horas"
      />

      <StatCard
        icon={<BarChart3 className="h-8 w-8 text-pink-600" />}
        iconBgColor="bg-pink-50"
        title="Tasa Conversion"
        value={`${stats.conversionRate}%`}
        label="Consultas/Propiedades"
      />

      <StatCard
        icon={<DollarSign className="h-8 w-8 text-violet-600" />}
        iconBgColor="bg-violet-50"
        title="Ingresos Estimados"
        value={`$${stats.estimatedRevenue.total.toLocaleString('es-AR')}`}
        label={`Venta: $${stats.estimatedRevenue.sales.toLocaleString('es-AR')} | Alquiler: $${stats.estimatedRevenue.rentals.toLocaleString('es-AR')}`}
      />

      <StatCard
        icon={<TrendingUp className="h-8 w-8 text-sky-600" />}
        iconBgColor="bg-sky-50"
        title="Distribucion"
        value={Object.keys(stats.propertiesByType).length}
        label="Tipos diferentes"
      />
    </div>
  )
}
