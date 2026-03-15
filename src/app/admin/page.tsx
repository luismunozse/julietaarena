'use client'

import Link from 'next/link'
import { Home, Plus, MessageSquare, Mail, BarChart3, Globe, ArrowRight } from 'lucide-react'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import { useAuth } from '@/hooks/useAuth'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import DashboardCharts from '@/components/admin/DashboardCharts'
import PermissionGuard from '@/components/admin/PermissionGuard'
import { cn } from '@/lib/utils'

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
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Propiedades',
    description: 'Gestionar propiedades',
    section: 'properties' as const,
    permission: 'read' as const,
  },
  {
    href: '/admin/propiedades/nueva',
    icon: Plus,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Nueva Propiedad',
    description: 'Agregar al catálogo',
    section: 'properties' as const,
    permission: 'create' as const,
  },
  {
    href: '/admin/consultas',
    icon: MessageSquare,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Consultas',
    description: 'Consultas de clientes',
    section: 'inquiries' as const,
    permission: 'read' as const,
  },
  {
    href: '/admin/contactos',
    icon: Mail,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    title: 'Contactos',
    description: 'Contactos generales',
    section: 'contacts' as const,
    permission: 'read' as const,
  },
  {
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Analytics',
    description: 'Métricas del sitio',
    section: 'analytics' as const,
    permission: 'read' as const,
  },
  {
    href: '/',
    icon: Globe,
    color: 'text-slate-600',
    bg: 'bg-slate-50',
    title: 'Ver Sitio',
    description: 'Ir al sitio público',
    section: null,
    permission: null,
  },
]

export default function AdminDashboard() {
  const { stats, isLoading, error } = useDashboardStats()
  const { user } = useAuth()

  const firstName = user?.name?.split(' ')[0] || 'Administrador'

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-sm text-slate-500">Resumen de actividad de Julieta Arena</p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} isLoading={isLoading} error={error} />

      {/* Charts */}
      <DashboardCharts stats={stats} isLoading={isLoading} />

      {/* Activity + Navigation */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl bg-white border border-slate-100 p-5">
            <h3 className="text-sm font-medium text-slate-900 mb-3">Accesos Rápidos</h3>
            <div className="space-y-1">
              {dashboardCards.map((card) => {
                const Icon = card.icon
                const link = (
                  <Link
                    href={card.href}
                    className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50"
                  >
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', card.bg)}>
                      <Icon className={cn('h-4 w-4', card.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{card.title}</p>
                      <p className="text-xs text-slate-400">{card.description}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
                  </Link>
                )

                if (card.section && card.permission) {
                  return (
                    <PermissionGuard key={card.href} section={card.section} permission={card.permission}>
                      {link}
                    </PermissionGuard>
                  )
                }

                return <div key={card.href}>{link}</div>
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
