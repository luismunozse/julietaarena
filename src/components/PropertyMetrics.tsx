'use client'

import { Property } from '@/data/properties'
import { Ruler, Home, BedDouble, Bath, Car, CalendarDays, DoorOpen, Compass, Layers, ArrowUpDown, Receipt } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyMetricsProps {
  property: Property
}

const conditionLabels: Record<string, string> = {
  a_estrenar: 'A estrenar',
  muy_bueno: 'Muy bueno',
  bueno: 'Bueno',
  regular: 'Regular',
  a_reciclar: 'A reciclar',
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

  // Primary metrics
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

  // Secondary metrics (previously in "Información Adicional" — now unified here)
  if (age !== null && age >= 0) {
    metrics.push({
      icon: <CalendarDays className="h-5 w-5" />,
      value: property.condition === 'a_estrenar' ? 'A estrenar' : `${age} años`,
      label: 'Antigüedad',
    })
  } else if (property.condition) {
    metrics.push({
      icon: <CalendarDays className="h-5 w-5" />,
      value: conditionLabels[property.condition] || property.condition,
      label: 'Condición',
    })
  }

  if (property.orientation) {
    metrics.push({
      icon: <Compass className="h-5 w-5" />,
      value: property.orientation,
      label: 'Orientación',
    })
  }

  if (property.floor !== undefined && property.totalFloors) {
    metrics.push({
      icon: <Layers className="h-5 w-5" />,
      value: `${property.floor} de ${property.totalFloors}`,
      label: 'Piso',
    })
  }

  if (property.disposition) {
    metrics.push({
      icon: <ArrowUpDown className="h-5 w-5" />,
      value: property.disposition.charAt(0).toUpperCase() + property.disposition.slice(1),
      label: 'Disposición',
    })
  }

  if (property.expenses) {
    metrics.push({
      icon: <Receipt className="h-5 w-5" />,
      value: `$ ${property.expenses.toLocaleString('es-AR')}`,
      label: 'Expensas',
    })
  }

  if (metrics.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Características</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 rounded-xl p-3.5 border transition-colors",
                metric.highlight
                  ? "bg-brand-primary/5 border-brand-primary/15"
                  : "bg-surface border-border"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                metric.highlight
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "bg-white text-muted shadow-sm"
              )}>
                {metric.icon}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-foreground truncate">{metric.value}</p>
                <p className="text-xs text-muted truncate">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
