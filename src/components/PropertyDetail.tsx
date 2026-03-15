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
import { MapPin, Share2, ChevronRight, Camera, Map, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface PropertyDetailProps {
  property: Property
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const [activeView, setActiveView] = useState<'fotos' | 'mapa'>('fotos')
  const router = useRouter()
  const analytics = useAnalytics()

  const getOperationLabel = (): string => {
    const labels: Record<string, string> = { venta: 'Venta', alquiler: 'Alquiler', alquiler_temporal: 'Alquiler Temporal' }
    return labels[property.operation] || property.operation
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
              {property.aptCredit && (
                <Badge className="text-sm font-semibold px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                  Apto Crédito
                </Badge>
              )}
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
                Ubicación
              </button>
            </div>

            {activeView === 'fotos' ? (
              <PropertyImageGallery images={property.images} title={property.title} />
            ) : (
              <PropertyLocationMap
                latitude={property.coordinates?.lat}
                longitude={property.coordinates?.lng}
                address={property.location}
                propertyTitle={property.title}
              />
            )}
          </div>

          {/* Metricas de la propiedad */}
          <PropertyMetrics property={property} />

          {/* Descripcion */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
            <h2 className="text-lg font-semibold text-brand-dark mb-3">Descripcion</h2>
            <p className="text-muted leading-relaxed m-0 whitespace-pre-line">{sanitizeText(property.description)}</p>
          </div>

          {/* Video Tour */}
          {property.videoUrl && (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-border">
              <div className="p-6 pb-3">
                <h2 className="text-lg font-semibold text-brand-dark">Tour Virtual</h2>
              </div>
              {property.videoUrl.includes('youtube.com') || property.videoUrl.includes('youtu.be') ? (
                <div className="relative w-full pb-[56.25%]">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={property.videoUrl
                      .replace('watch?v=', 'embed/')
                      .replace('youtu.be/', 'youtube.com/embed/')
                      .split('&')[0]}
                    title="Tour virtual"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="px-6 pb-6">
                  <a
                    href={property.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-primary hover:text-brand-accent font-medium transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver tour virtual
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Caracteristicas */}
          <PropertyFeatures features={property.features} />

          {/* Informacion adicional si existe */}
          {(property.yearBuilt || property.orientation || (property.floor && property.totalFloors) || property.expenses || property.disposition || property.condition || property.rooms) && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-semibold text-brand-dark mb-4">Informacion Adicional</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {property.condition && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Condición</span>
                    <span className="text-sm font-semibold text-brand-dark">
                      {{ a_estrenar: 'A estrenar', muy_bueno: 'Muy bueno', bueno: 'Bueno', regular: 'Regular', a_reciclar: 'A reciclar' }[property.condition] || property.condition}
                    </span>
                  </div>
                )}
                {property.rooms && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Ambientes</span>
                    <span className="text-sm font-semibold text-brand-dark">{property.rooms}</span>
                  </div>
                )}
                {property.disposition && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Disposición</span>
                    <span className="text-sm font-semibold text-brand-dark capitalize">{property.disposition}</span>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Antiguedad</span>
                    <span className="text-sm font-semibold text-brand-dark">
                      {property.condition === 'a_estrenar' ? 'A estrenar' : `${new Date().getFullYear() - property.yearBuilt} años`}
                    </span>
                  </div>
                )}
                {property.orientation && (
                  <div className="p-3 bg-surface rounded-lg">
                    <span className="text-xs text-muted block mb-1">Orientacion</span>
                    <span className="text-sm font-semibold text-brand-dark">{property.orientation}</span>
                  </div>
                )}
                {property.floor !== undefined && property.totalFloors && (
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
                      $ {property.expenses.toLocaleString('es-AR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Servicios disponibles */}
          {property.services && property.services.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-semibold text-brand-dark mb-4">Servicios e Infraestructura</h2>
              <div className="flex flex-wrap gap-2">
                {property.services.map((service) => (
                  <Badge key={service} variant="outline" className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 border-emerald-200">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Documentación */}
          {property.documentation && property.documentation.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-lg font-semibold text-brand-dark mb-4">Documentación</h2>
              <div className="flex flex-wrap gap-2">
                {property.documentation.map((doc) => (
                  <Badge key={doc} variant="outline" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border-blue-200">
                    {doc}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mapa de ubicación - siempre visible */}
          <Card className="overflow-hidden shadow-sm">
            <CardContent className="p-0">
              <div className="p-5 pb-3">
                <h2 className="text-lg font-semibold text-slate-900">Ubicación</h2>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {property.location}
                </p>
              </div>
              <PropertyLocationMap
                latitude={property.coordinates?.lat}
                longitude={property.coordinates?.lng}
                address={property.location}
                propertyTitle={property.title}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar derecho */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <PropertySidebar property={property} />
        </div>
      </div>
    </div>
  )
}
