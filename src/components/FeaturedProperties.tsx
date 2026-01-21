'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import PropertyCard from './PropertyCard'
import { ArrowRight, Sparkles } from 'lucide-react'

/* =============================================================================
   SKELETON LOADER
============================================================================= */

function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
      <div className="aspect-[16/10] bg-gradient-to-r from-surface via-muted to-surface animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-surface rounded w-20 animate-pulse" />
        <div className="h-5 bg-surface rounded w-3/4 animate-pulse" />
        <div className="h-4 bg-surface rounded w-1/2 animate-pulse" />
        <div className="flex gap-4 pt-2">
          <div className="h-4 bg-surface rounded w-12 animate-pulse" />
          <div className="h-4 bg-surface rounded w-12 animate-pulse" />
          <div className="h-4 bg-surface rounded w-16 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function FeaturedProperties() {
  const router = useRouter()
  const { properties, isLoading } = useProperties()

  const featuredProperties = useMemo(() => {
    return properties
      .filter(p => p.featured && p.status === 'disponible')
      .slice(0, 6)
  }, [properties])

  if (isLoading) {
    return (
      <section className="py-12 lg:py-16 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
              Destacadas
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-accent mb-3">
              Propiedades Destacadas
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Las mejores oportunidades del mercado seleccionadas especialmente para vos
            </p>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProperties.length === 0) {
    return null
  }

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-surface to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Destacadas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-accent mb-3">
            Propiedades Destacadas
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Las mejores oportunidades del mercado seleccionadas especialmente para vos
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/propiedades/resultado?featured=true&operation=venta')}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            Ver todas las propiedades destacadas
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  )
}
