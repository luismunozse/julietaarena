'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Check } from 'lucide-react'

interface PropertyFeaturesProps {
  features: string[]
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Características</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 bg-slate-50 border border-slate-100"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2c5f7d] text-white">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </div>
              <span className="text-sm text-slate-700">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
