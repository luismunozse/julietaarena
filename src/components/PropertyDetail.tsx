'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import { useRouter } from 'next/navigation'
import FavoriteButton from './FavoriteButton'
import PropertyImageGallery from './PropertyImageGallery'
import PropertySidebar from './PropertySidebar'
import PropertyMetrics from './PropertyMetrics'
import PropertyFeatures from './PropertyFeatures'
import PropertyLocationMap from './PropertyLocationMap'
import { useAnalytics } from '@/hooks/useAnalytics'
import { sanitizeText } from '@/lib/sanitize'
import { cn } from '@/lib/utils'
import { MapPin, Share2, ChevronRight, Camera, Map } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PropertyDetailProps {
  property: Property
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [activeView, setActiveView] = useState<'fotos' | 'mapa'>('fotos')
  const router = useRouter()
  const analytics = useAnalytics()

  const getOperationLabel = (): string => {
    return property.operation === 'venta' ? 'Venta' : 'Alquiler'
  }

  const getTypeLabel = (): string => {
    const labels: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'terreno': 'Terreno',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
      'cochera': 'Cochera'
    }
    return labels[property.type] || property.type
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Header con titulo y acciones */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 mb-4 text-sm">
          <button
            className="text-brand-primary hover:text-brand-accent transition-colors font-medium"
            onClick={() => router.push('/')}
          >
            Inicio
          </button>
          <ChevronRight className="w-4 h-4 text-muted" />
          <button
            className="text-brand-primary hover:text-brand-accent transition-colors font-medium"
            onClick={() => router.push('/propiedades')}
          >
            Propiedades
          </button>
          <ChevronRight className="w-4 h-4 text-muted" />
          <span className="text-muted">{getTypeLabel()}</span>
        </nav>

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
              {property.title}
            </h1>

            {/* Subtitle with operation and location */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge className={cn(
                "text-sm font-semibold px-3 py-1",
                property.operation === 'venta'
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-100"
              )}>
                {getOperationLabel()}
              </Badge>
              <Badge variant="outline" className="text-sm font-medium px-3 py-1">
                {getTypeLabel()}
              </Badge>
              <div className="flex items-center gap-1.5 text-muted">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <FavoriteButton propertyId={property.id} size="large" />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 border-border hover:bg-surface"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: property.title,
                    text: property.description,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              aria-label="Compartir propiedad"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Compartir</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
        <div className="flex flex-col gap-6">
          {/* Galeria de imagenes */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border">
            <div className="flex border-b border-border">
              <button
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition-all border-b-2 -mb-px",
                  activeView === 'fotos'
                    ? "text-brand-primary border-brand-primary bg-brand-primary/5"
                    : "text-muted border-transparent hover:text-foreground hover:bg-surface"
                )}
                onClick={() => setActiveView('fotos')}
              >
                <Camera className="w-4 h-4" />
                Fotos {property.images.length > 0 && `(${property.images.length})`}
              </button>
              {property.coordinates && (
                <button
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-medium transition-all border-b-2 -mb-px",
                    activeView === 'mapa'
                      ? "text-brand-primary border-brand-primary bg-brand-primary/5"
                      : "text-muted border-transparent hover:text-foreground hover:bg-surface"
                  )}
                  onClick={() => setActiveView('mapa')}
                >
                  <Map className="w-4 h-4" />
                  Ubicacion
                </button>
              )}
            </div>

            {activeView === 'fotos' ? (
              <PropertyImageGallery images={property.images} title={property.title} />
            ) : (
              property.coordinates && (
                <PropertyLocationMap
                  latitude={property.coordinates.lat}
                  longitude={property.coordinates.lng}
                  propertyTitle={property.title}
                />
              )
            )}
          </div>

          {/* Metricas de la propiedad */}
          <PropertyMetrics property={property} />

          {/* Descripcion */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-semibold text-brand-dark mb-3">Descripcion</h2>
            <p className="text-muted leading-relaxed m-0 whitespace-pre-line">{sanitizeText(property.description)}</p>
          </div>

          {/* Caracteristicas */}
          <PropertyFeatures features={property.features} />

          {/* Informacion adicional si existe */}
          {(property.yearBuilt || property.orientation || (property.floor && property.totalFloors) || property.expenses) && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-semibold text-brand-dark mb-4">Informacion Adicional</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.yearBuilt && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Antiguedad</span>
                    <span className="text-sm font-semibold text-brand-dark">
                      {new Date().getFullYear() - property.yearBuilt} anos
                    </span>
                  </div>
                )}
                {property.orientation && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Orientacion</span>
                    <span className="text-sm font-semibold text-brand-dark">{property.orientation}</span>
                  </div>
                )}
                {property.floor && property.totalFloors && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Piso</span>
                    <span className="text-sm font-semibold text-brand-dark">
                      {property.floor} de {property.totalFloors}
                    </span>
                  </div>
                )}
                {property.expenses && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Expensas</span>
                    <span className="text-sm font-semibold text-brand-dark">
                      ${property.expenses.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar derecho */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <PropertySidebar property={property} />
        </div>
      </div>
    </div>
  )
}
