'use client'

import { Check, Snowflake, Shield, Trees, Building2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyFeaturesProps {
  features: string[]
}

// Feature categories with keywords for auto-grouping
const CATEGORIES = [
  {
    name: 'Confort',
    icon: Sparkles,
    keywords: ['aire', 'calefacc', 'calefon', 'termotanque', 'losa', 'radiante', 'split', 'estufa', 'hogar', 'chimenea', 'ventilador', 'hidromasaje', 'jacuzzi', 'vestidor', 'placard', 'closet', 'balcon', 'terraza', 'quincho', 'parrilla', 'asador', 'barbacoa', 'lavadero', 'despensa', 'bodega', 'amoblado'],
  },
  {
    name: 'Seguridad',
    icon: Shield,
    keywords: ['seguridad', 'alarma', 'camara', 'vigilancia', 'portero', 'cerco', 'rejas', 'blindada', 'guardia', 'barrio cerrado', 'country'],
  },
  {
    name: 'Exterior',
    icon: Trees,
    keywords: ['piscina', 'pileta', 'jardin', 'parque', 'patio', 'solarium', 'deck', 'galeria', 'garage', 'cochera', 'estacionamiento', 'riego'],
  },
  {
    name: 'Edificio',
    icon: Building2,
    keywords: ['ascensor', 'sum', 'salon', 'gym', 'gimnasio', 'laundry', 'baulera', 'rooftop', 'amenities', 'piscina comun', 'pileta comun', 'conserjeria', 'porteria'],
  },
]

function categorizeFeatures(features: string[]): { name: string; icon: typeof Sparkles; features: string[] }[] {
  const categorized: Record<string, string[]> = {}
  const uncategorized: string[] = []

  for (const feature of features) {
    const featureLower = feature.toLowerCase()
    let matched = false

    for (const cat of CATEGORIES) {
      if (cat.keywords.some(kw => featureLower.includes(kw))) {
        if (!categorized[cat.name]) categorized[cat.name] = []
        categorized[cat.name].push(feature)
        matched = true
        break
      }
    }

    if (!matched) {
      uncategorized.push(feature)
    }
  }

  const result: { name: string; icon: typeof Sparkles; features: string[] }[] = []

  for (const cat of CATEGORIES) {
    if (categorized[cat.name]?.length) {
      result.push({ name: cat.name, icon: cat.icon, features: categorized[cat.name] })
    }
  }

  // Add uncategorized to the first group or create "Otros"
  if (uncategorized.length > 0) {
    if (result.length > 0) {
      result[0].features.push(...uncategorized)
    } else {
      result.push({ name: 'Comodidades', icon: Sparkles, features: uncategorized })
    }
  }

  return result
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  const groups = categorizeFeatures(features)

  // If only one group or few features, render flat
  if (groups.length <= 1 || features.length <= 4) {
    return (
      <div className="bg-white rounded-xl border border-border shadow-sm">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Comodidades</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Grouped layout
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-5">Comodidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {groups.map((group) => {
            const Icon = group.icon
            return (
              <div key={group.name}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{group.name}</h3>
                </div>
                <div className="space-y-1.5 pl-1">
                  {group.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-1">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-2.5 w-2.5" strokeWidth={3} />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
