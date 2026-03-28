'use client'

import { Check } from 'lucide-react'

interface PropertyFeaturesProps {
  features: string[]
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm">
      <div className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Comodidades</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg"
            >
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
