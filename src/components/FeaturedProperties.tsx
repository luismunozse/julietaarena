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
    <div className="bg-white rounded-xl overflow-hidden border border-border">
      <div className="aspect-[16/10] bg-gradient-to-r from-surface via-border/30 to-surface animate-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="h-5 bg-surface rounded w-2/3 animate-pulse" />
        <div className="flex gap-2">
          <div className="h-3 bg-surface rounded w-12 animate-pulse" />
          <div className="h-3 bg-surface rounded w-16 animate-pulse" />
          <div className="h-3 bg-surface rounded w-14 animate-pulse" />
        </div>
        <div className="h-4 bg-surface rounded w-4/5 animate-pulse" />
        <div className="h-3 bg-surface rounded w-1/2 animate-pulse" />
        <div className="h-9 bg-surface rounded-lg w-full animate-pulse mt-1" />
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
      <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-surface to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-3 sm:mb-4">
              Destacadas
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-accent mb-2 sm:mb-3">
              Propiedades Destacadas
            </h2>
            <p className="text-sm sm:text-base text-muted max-w-xl mx-auto px-2">
              Las mejores oportunidades del mercado seleccionadas especialmente para vos
            </p>
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-surface to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-3 sm:mb-4">
            <Sparkles className="w-4 h-4" />
            Destacadas
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-accent mb-2 sm:mb-3">
            Propiedades Destacadas
          </h2>
          <p className="text-sm sm:text-base text-muted max-w-xl mx-auto px-2">
            Las mejores oportunidades del mercado seleccionadas especialmente para vos
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center px-4">
          <button
            onClick={() => router.push('/propiedades/resultado?featured=true&operation=venta')}
            className="group inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span className="hidden sm:inline">Ver todas las propiedades destacadas</span>
            <span className="sm:hidden">Ver todas las destacadas</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </div>
    </section>
  )
}
