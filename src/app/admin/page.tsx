'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import NotificationSettings from '@/components/NotificationSettings'
import DashboardStats from '@/components/admin/DashboardStats'
import RecentActivity from '@/components/admin/RecentActivity'
import DashboardCharts from '@/components/admin/DashboardCharts'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Card } from '@/components/ui/card'

const dashboardCards = [
  {
    href: '/admin/propiedades',
    icon: '🏠',
    title: 'Propiedades',
    description: 'Gestionar propiedades en venta y alquiler',
  },
  {
    href: '/admin/propiedades/nueva',
    icon: '➕',
    title: 'Nueva Propiedad',
    description: 'Agregar una nueva propiedad al catálogo',
  },
  {
    href: '/admin/consultas',
    icon: '💬',
    title: 'Consultas',
    description: 'Ver y gestionar consultas de propiedades',
  },
  {
    href: '/admin/contactos',
    icon: '📧',
    title: 'Contactos',
    description: 'Ver y gestionar contactos generales',
  },
  {
    href: '/admin/analytics',
    icon: '📈',
    title: 'Analytics',
    description: 'Ver métricas y estadísticas del sitio',
  },
  {
    href: '/',
    icon: '🌐',
    title: 'Ver Sitio Web',
    description: 'Ir al sitio web público',
  },
]

const quickActions = [
  { href: '/admin/propiedades/nueva', icon: '➕', label: 'Agregar Propiedad' },
  { href: '/admin/propiedades', icon: '📋', label: 'Ver Todas' },
  { href: '/admin/consultas', icon: '💬', label: 'Ver Consultas' },
  { href: '/admin/contactos', icon: '📧', label: 'Ver Contactos' },
  { href: '/admin/analytics', icon: '📊', label: 'Ver Estadísticas' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Panel de Administración"
        subtitle="Bienvenido al panel de control de Julieta Arena"
        className="mb-0"
      />

      {/* Estadísticas en tiempo real */}
      <DashboardStats />

      {/* Gráficos */}
      <DashboardCharts />

      {/* Actividad reciente */}
      <RecentActivity />

      {/* Cards de navegación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dashboardCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="group flex items-center gap-5 p-5 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200 cursor-pointer h-full">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-blue-50 group-hover:to-slate-50 transition-colors">
                <span className="text-2xl">{card.icon}</span>
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
        ))}
      </div>

      {/* Sección de accesos rápidos */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white border border-slate-200 rounded-xl text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm transition-all duration-200"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-xs font-medium text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-5 text-center">
          Notificaciones en Tiempo Real
        </h2>
        <NotificationSettings />
      </div>
    </div>
  )
}
