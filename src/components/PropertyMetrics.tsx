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
  primary?: boolean
}

export default function PropertyMetrics({ property }: PropertyMetricsProps) {
  const currentYear = new Date().getFullYear()
  const age = property.yearBuilt ? currentYear - property.yearBuilt : null

  const primaryMetrics: MetricItem[] = []
  const secondaryMetrics: MetricItem[] = []

  // ── Primary metrics (hero stats) ──
  if (property.area) {
    primaryMetrics.push({
      icon: <Ruler className="h-6 w-6" />,
      value: `${property.area} m²`,
      label: 'Superficie total',
      primary: true,
    })
  }

  if (property.coveredArea) {
    primaryMetrics.push({
      icon: <Home className="h-6 w-6" />,
      value: `${property.coveredArea} m²`,
      label: 'Sup. cubierta',
      primary: true,
    })
  }

  if (property.rooms) {
    primaryMetrics.push({
      icon: <DoorOpen className="h-6 w-6" />,
      value: `${property.rooms}`,
      label: 'Ambientes',
      primary: true,
    })
  }

  if (property.bedrooms) {
    primaryMetrics.push({
      icon: <BedDouble className="h-6 w-6" />,
      value: `${property.bedrooms}`,
      label: 'Dormitorios',
      primary: true,
    })
  }

  if (property.bathrooms) {
    primaryMetrics.push({
      icon: <Bath className="h-6 w-6" />,
      value: `${property.bathrooms}`,
      label: 'Banos',
      primary: true,
    })
  }

  if (property.parking !== undefined && property.parking > 0) {
    primaryMetrics.push({
      icon: <Car className="h-6 w-6" />,
      value: `${property.parking}`,
      label: 'Cocheras',
      primary: true,
    })
  }

  // ── Secondary metrics (compact list) ──
  if (age !== null && age >= 0) {
    secondaryMetrics.push({
      icon: <CalendarDays className="h-4 w-4" />,
      value: property.condition === 'a_estrenar' ? 'A estrenar' : `${age} anos`,
      label: 'Antiguedad',
    })
  } else if (property.condition) {
    secondaryMetrics.push({
      icon: <CalendarDays className="h-4 w-4" />,
      value: conditionLabels[property.condition] || property.condition,
      label: 'Condicion',
    })
  }

  if (property.orientation) {
    secondaryMetrics.push({
      icon: <Compass className="h-4 w-4" />,
      value: property.orientation,
      label: 'Orientacion',
    })
  }

  if (property.floor !== undefined && property.totalFloors) {
    secondaryMetrics.push({
      icon: <Layers className="h-4 w-4" />,
      value: `${property.floor} de ${property.totalFloors}`,
      label: 'Piso',
    })
  }

  if (property.disposition) {
    secondaryMetrics.push({
      icon: <ArrowUpDown className="h-4 w-4" />,
      value: property.disposition.charAt(0).toUpperCase() + property.disposition.slice(1),
      label: 'Disposicion',
    })
  }

  if (property.expenses) {
    secondaryMetrics.push({
      icon: <Receipt className="h-4 w-4" />,
      value: `$ ${property.expenses.toLocaleString('es-AR')}`,
      label: 'Expensas',
    })
  }

  if (primaryMetrics.length === 0 && secondaryMetrics.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Caracteristicas</h2>

        {/* ── Hero stats: large cards ── */}
        {primaryMetrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
            {primaryMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center rounded-xl p-4 bg-gradient-to-b from-brand-primary/5 to-brand-primary/[0.02] border border-brand-primary/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary mb-2">
                  {metric.icon}
                </div>
                <p className="text-xl font-bold text-foreground">{metric.value}</p>
                <p className="text-xs text-muted mt-0.5">{metric.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Secondary: compact inline list ── */}
        {secondaryMetrics.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 pt-3 border-t border-border">
            {secondaryMetrics.map((metric, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-muted">{metric.icon}</span>
                <span className="text-muted">{metric.label}:</span>
                <span className="font-semibold text-foreground">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
