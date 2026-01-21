import { Metadata } from 'next'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'


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
    <main className="pageContainer">
      <div className="header">
        <h1>Panel de Administración</h1>
        <p>Analytics y métricas del sitio web</p>
      </div>
      
      <AnalyticsDashboard />
    </main>
  )
}
