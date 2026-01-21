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
    <main className="min-h-screen p-6 md:p-10 bg-[#f8f9fa]">
      <AdminPageHeader
        title="Panel de Administración"
        subtitle="Bienvenido al panel de control de Julieta Arena"
      />

      {/* Estadísticas en tiempo real */}
      <DashboardStats />

      {/* Gráficos */}
      <DashboardCharts />

      {/* Actividad reciente */}
      <RecentActivity />

      {/* Cards de navegación */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {dashboardCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="flex items-center gap-5 p-6 border-l-4 border-l-[#2c5f7d] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <span className="text-5xl opacity-90">{card.icon}</span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[#1a4158] mb-1">
                  {card.title}
                </h2>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
              <ChevronRight className="h-6 w-6 text-[#2c5f7d]" />
            </Card>
          </Link>
        ))}
      </div>

      {/* Sección de accesos rápidos */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-[#1a4158] mb-5">
          Accesos Rápidos
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center justify-center gap-3 p-5 bg-white border-2 border-gray-200 rounded-xl text-[#1a4158] font-semibold hover:border-[#2c5f7d] hover:bg-[#2c5f7d]/5 transition-all duration-300"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-sm">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-[#1a4158] mb-5 text-center">
          Notificaciones en Tiempo Real
        </h2>
        <NotificationSettings />
      </div>
    </main>
  )
}
