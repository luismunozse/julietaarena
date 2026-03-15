'use client'

import { Property } from '@/data/properties'
import { Card, CardContent } from '@/components/ui/card'
import { Ruler, Home, BedDouble, Bath, Car, CalendarDays, DoorOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyMetricsProps {
  property: Property
}

interface MetricItem {
  icon: React.ReactNode
  value: string
  label: string
  highlight?: boolean
}

export default function PropertyMetrics({ property }: PropertyMetricsProps) {
  const currentYear = new Date().getFullYear()
  const age = property.yearBuilt ? currentYear - property.yearBuilt : null

  const metrics: MetricItem[] = []

  if (property.area) {
    metrics.push({
      icon: <Ruler className="h-5 w-5" />,
      value: `${property.area} m²`,
      label: 'Superficie total',
      highlight: true,
    })
  }

  if (property.coveredArea) {
    metrics.push({
      icon: <Home className="h-5 w-5" />,
      value: `${property.coveredArea} m²`,
      label: 'Superficie cubierta',
    })
  }

  if (property.rooms) {
    metrics.push({
      icon: <DoorOpen className="h-5 w-5" />,
      value: `${property.rooms}`,
      label: 'Ambientes',
    })
  }

  if (property.bedrooms) {
    metrics.push({
      icon: <BedDouble className="h-5 w-5" />,
      value: `${property.bedrooms}`,
      label: 'Dormitorios',
    })
  }

  if (property.bathrooms) {
    metrics.push({
      icon: <Bath className="h-5 w-5" />,
      value: `${property.bathrooms}`,
      label: 'Baños',
    })
  }

  if (property.parking !== undefined && property.parking > 0) {
    metrics.push({
      icon: <Car className="h-5 w-5" />,
      value: `${property.parking}`,
      label: 'Cocheras',
    })
  }

  if (age !== null && age >= 0) {
    metrics.push({
      icon: <CalendarDays className="h-5 w-5" />,
      value: property.condition === 'a_estrenar' ? 'A estrenar' : `${age} años`,
      label: 'Antigüedad',
    })
  }

  if (metrics.length === 0) return null

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3.5 border transition-colors",
                metric.highlight
                  ? "bg-[#2c5f7d]/5 border-[#2c5f7d]/20"
                  : "bg-slate-50 border-slate-100"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                metric.highlight
                  ? "bg-[#2c5f7d]/10 text-[#2c5f7d]"
                  : "bg-white text-slate-500 shadow-sm"
              )}>
                {metric.icon}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-slate-900 truncate">{metric.value}</p>
                <p className="text-xs text-slate-500 truncate">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
