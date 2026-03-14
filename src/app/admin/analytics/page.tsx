import { Metadata } from 'next'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import AdminPageHeader from '@/components/admin/AdminPageHeader'

export const metadata: Metadata = {
  title: 'Analytics - Panel de Administración | Julieta Arena',
  description: 'Dashboard de analytics y métricas del sitio web.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Analytics"
        subtitle="Métricas y estadísticas del sitio web"
      />
      <AnalyticsDashboard />
    </div>
  )
}
