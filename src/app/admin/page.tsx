'use client'

import Link from 'next/link'
import { ChevronRight, Home, Plus, MessageSquare, Mail, BarChart3, Globe } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useAuth } from '@/hooks/useAuth'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import DashboardCharts from '@/components/admin/DashboardCharts'
import PermissionGuard from '@/components/admin/PermissionGuard'
import { Card } from '@/components/ui/card'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

const dashboardCards = [
  {
    href: '/admin/propiedades',
    icon: Home,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 group-hover:bg-blue-100',
    title: 'Propiedades',
    description: 'Gestionar propiedades en venta y alquiler',
    section: 'properties' as const,
    permission: 'read' as const,
  },
  {
    href: '/admin/propiedades/nueva',
    icon: Plus,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 group-hover:bg-emerald-100',
    title: 'Nueva Propiedad',
    description: 'Agregar una nueva propiedad al catálogo',
    section: 'properties' as const,
    permission: 'create' as const,
  },
  {
    href: '/admin/consultas',
    icon: MessageSquare,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 group-hover:bg-amber-100',
    title: 'Consultas',
    description: 'Ver y gestionar consultas de propiedades',
    section: 'inquiries' as const,
    permission: 'read' as const,
  },
  {
    href: '/admin/contactos',
    icon: Mail,
    iconColor: 'text-teal-600',
    iconBg: 'bg-teal-50 group-hover:bg-teal-100',
    title: 'Contactos',
    description: 'Ver y gestionar contactos generales',
    section: 'contacts' as const,
    permission: 'read' as const,
  },
  {
    href: '/admin/analytics',
    icon: BarChart3,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 group-hover:bg-purple-100',
    title: 'Analytics',
    description: 'Ver métricas y estadísticas del sitio',
    section: 'analytics' as const,
    permission: 'read' as const,
  },
  {
    href: '/',
    icon: Globe,
    iconColor: 'text-slate-600',
    iconBg: 'bg-slate-100 group-hover:bg-slate-200',
    title: 'Ver Sitio Web',
    description: 'Ir al sitio web público',
    section: null,
    permission: null,
  },
]

export default function AdminDashboard() {
  const { stats, isLoading, error } = useDashboardStats()
  const { user } = useAuth()

  const firstName = user?.name?.split(' ')[0] || 'Administrador'

  return (
    <div className="space-y-8">
      {/* Welcome banner dinámico */}
      <div>
        <h1 className="text-3xl font-bold text-[#1a4158]">
          {getGreeting()}, {firstName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen de actividad de Julieta Arena
        </p>
      </div>

      {/* Estadísticas en tiempo real */}
      <DashboardStats stats={stats} isLoading={isLoading} error={error} />

      {/* Gráficos */}
      <DashboardCharts stats={stats} isLoading={isLoading} />

      {/* Actividad reciente */}
      <RecentActivity />

      {/* Cards de navegación con permisos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardCards.map((card) => {
          const Icon = card.icon
          const cardContent = (
            <Link key={card.href} href={card.href}>
              <Card className="group flex items-center gap-5 p-5 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${card.iconBg}`}>
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-slate-800 mb-0.5">
                    {card.title}
                  </h2>
                  <p className="text-sm text-slate-500 truncate">{card.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Card>
            </Link>
          )

          if (card.section && card.permission) {
            return (
              <PermissionGuard
                key={card.href}
                section={card.section}
                permission={card.permission}
              >
                {cardContent}
              </PermissionGuard>
            )
          }

          return <div key={card.href}>{cardContent}</div>
        })}
      </div>
    </div>
  )
}
