'use client'

import { useState, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'
import AnalyticsCharts from '@/components/admin/AnalyticsCharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, BarChart3, Eye, Home, Phone, AlertCircle } from 'lucide-react'

interface AnalyticsData {
  totalEvents: number
  totalPageViews: number
  popularPages: Array<{ page: string; views: number }>
  popularEvents: Array<{ event: string; count: number }>
  events: any[]
  pageViews: any[]
}

export default function AnalyticsDashboard() {
  const analytics = useAnalytics()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | 'all'>('7d')

  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      const analyticsData = analytics.exportData()
      setData(analyticsData as any)
      setIsLoading(false)
    }

    loadData()

    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000)

    return () => clearInterval(interval)
  }, [analytics])

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-AR').format(num)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-AR')
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#2c5f7d]" />
          <p>Cargando datos de analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card className="bg-slate-50 text-center">
          <CardContent className="py-8">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-slate-400" />
            <p className="text-slate-600">
              No se pudieron cargar los datos de analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statCards = [
    {
      icon: <BarChart3 className="h-6 w-6 text-[#2c5f7d]" />,
      label: 'Eventos Totales',
      value: formatNumber(data.totalEvents || 0),
    },
    {
      icon: <Eye className="h-6 w-6 text-[#2c5f7d]" />,
      label: 'Vistas de Página',
      value: formatNumber(data.totalPageViews || 0),
    },
    {
      icon: <Home className="h-6 w-6 text-[#2c5f7d]" />,
      label: 'Propiedades Vistas',
      value: formatNumber(
        (data.events || []).filter((e) => e.category === 'property').length
      ),
    },
    {
      icon: <Phone className="h-6 w-6 text-[#2c5f7d]" />,
      label: 'Contactos',
      value: formatNumber(
        (data.events || []).filter((e) => e.category === 'contact').length
      ),
    },
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-[#1a4158]">
          Dashboard de Analytics
        </h1>
        <div className="flex items-center gap-4">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value as any)}
          >
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="all">Todo el tiempo</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => analytics.clearData()}>
            Limpiar Datos
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2c5f7d]/10">
                {stat.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-[13px] font-medium text-slate-500">
                  {stat.label}
                </h3>
                <p className="text-2xl font-bold text-[#1a4158]">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Popular Pages */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#1a4158]">
              Páginas Más Visitadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data.popularPages || []).slice(0, 10).length > 0 ? (
              (data.popularPages || []).slice(0, 10).map((page, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <span className="max-w-[70%] truncate text-sm text-[#1a4158]">
                    {page.page}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold text-[#2c5f7d]">
                    {formatNumber(page.views)} vistas
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No hay datos de páginas visitadas aún
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Events */}
        <Card className="bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-[#1a4158]">
              Eventos Más Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(data.popularEvents || []).slice(0, 10).length > 0 ? (
              (data.popularEvents || []).slice(0, 10).map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
                >
                  <span className="max-w-[70%] truncate text-sm text-[#1a4158]">
                    {event.event}
                  </span>
                  <span className="whitespace-nowrap text-sm font-semibold text-[#2c5f7d]">
                    {formatNumber(event.count)} veces
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-slate-500">
                No hay datos de eventos aún
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Events Table */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#1a4158]">
            Eventos Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(data.events || []).length > 0 ? (
            <div className="overflow-auto">
              <div className="grid grid-cols-4 gap-4 rounded-t-lg bg-[#2c5f7d] p-3 text-[13px] font-semibold text-white">
                <span>Evento</span>
                <span>Categoría</span>
                <span>Acción</span>
                <span>Fecha</span>
              </div>
              {(data.events || [])
                .slice(-20)
                .reverse()
                .map((event, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 border-b border-slate-200 bg-slate-50 p-3 text-[13px]"
                  >
                    <span className="truncate font-medium text-[#1a4158]">
                      {event.event}
                    </span>
                    <span className="text-slate-500">{event.category}</span>
                    <span className="truncate text-slate-500">
                      {event.action}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">
              No hay eventos registrados aún
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Page Views Table */}
      <Card className="bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-[#1a4158]">
            Vistas de Página Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(data.pageViews || []).length > 0 ? (
            <div className="overflow-auto">
              <div className="grid grid-cols-4 gap-4 rounded-t-lg bg-[#2c5f7d] p-3 text-[13px] font-semibold text-white">
                <span>Página</span>
                <span>Título</span>
                <span>URL</span>
                <span>Fecha</span>
              </div>
              {(data.pageViews || [])
                .slice(-20)
                .reverse()
                .map((pageView, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 gap-4 border-b border-slate-200 bg-slate-50 p-3 text-[13px]"
                  >
                    <span className="truncate font-medium text-[#1a4158]">
                      {pageView.page}
                    </span>
                    <span className="text-slate-500">{pageView.title}</span>
                    <span className="truncate text-slate-500">
                      {pageView.url}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDate(pageView.timestamp)}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="py-8 text-center text-sm text-slate-500">
              No hay vistas de página registradas aún
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Charts */}
      <AnalyticsCharts timeRange={timeRange} />
    </div>
  )
}
