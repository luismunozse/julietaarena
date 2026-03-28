'use client'

import { useState, useMemo } from 'react'
import { Property } from '@/data/properties'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FavoriteButton from './FavoriteButton'
import PropertyImageGallery from './PropertyImageGallery'
import PropertySidebar from './PropertySidebar'
import PropertyMetrics from './PropertyMetrics'
import PropertyFeatures from './PropertyFeatures'
import PropertyCard from './PropertyCard'
import PropertyLocationMap from './PropertyLocationMap'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useProperties } from '@/hooks/useProperties'
import { useToast } from '@/components/ToastContainer'
import { sanitizeText } from '@/lib/sanitize'
import { cn } from '@/lib/utils'
import { MapPin, Share2, ChevronRight, ChevronLeft, ExternalLink, Phone, Printer, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/* =============================================================================
   WHATSAPP ICON
============================================================================= */

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
)

/* =============================================================================
   CONSTANTS
============================================================================= */

const operationLabels: Record<string, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
  alquiler_temporal: 'Alquiler Temporal',
}

const typeLabels: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  terreno: 'Terreno',
  local: 'Local Comercial',
  oficina: 'Oficina',
  cochera: 'Cochera',
}

const conditionLabels: Record<string, string> = {
  a_estrenar: 'A estrenar',
  muy_bueno: 'Muy bueno',
  bueno: 'Bueno',
  regular: 'Regular',
  a_reciclar: 'A reciclar',
}

/* =============================================================================
   COMPONENT
============================================================================= */

interface PropertyDetailProps {
  property: Property
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const router = useRouter()
  const analytics = useAnalytics()
  const { properties } = useProperties()
  const { success } = useToast()
  const [copied, setCopied] = useState(false)

  const opLabel = operationLabels[property.operation] || property.operation
  const typeLabel = typeLabels[property.type] || property.type

  /* ---------------------------------------------------------------------------
     SHARE
  --------------------------------------------------------------------------- */

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    success('Link copiado al portapapeles', 3000)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer,width=600,height=400')
  }

  const shareToInstagram = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    success('Link copiado. Pegalo en tu historia o publicación de Instagram', 4000)
    setTimeout(() => setCopied(false), 3000)
  }

  /* ---------------------------------------------------------------------------
     SIMILAR PROPERTIES
  --------------------------------------------------------------------------- */

  const similarProperties = useMemo(() => {
    if (!properties || properties.length === 0) return []

    const priceRange = property.price * 0.3
    return properties
      .filter((p) =>
        p.id !== property.id &&
        p.status === 'disponible' &&
        (p.type === property.type || p.operation === property.operation) &&
        Math.abs(p.price - property.price) < priceRange
      )
      .sort((a, b) => {
        // Prioritize same type + operation
        const aScore = (a.type === property.type ? 2 : 0) + (a.operation === property.operation ? 1 : 0)
        const bScore = (b.type === property.type ? 2 : 0) + (b.operation === property.operation ? 1 : 0)
        return bScore - aScore
      })
      .slice(0, 3)
  }, [properties, property])

  /* ---------------------------------------------------------------------------
     WHATSAPP
  --------------------------------------------------------------------------- */

  const handleWhatsApp = () => {
    const message = `Hola, estoy interesado/a en ${property.title} - ${property.location}`
    window.open(`https://wa.me/543513078376?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCall = () => {
    window.open('tel:+543513078376', '_self')
  }

  /* ---------------------------------------------------------------------------
     PRINT
  --------------------------------------------------------------------------- */

  const handlePrint = () => {
    window.print()
  }

  /* ---------------------------------------------------------------------------
     RENDER
  --------------------------------------------------------------------------- */

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-28 md:pb-12">
      {/* ================================================================
          HEADER
      ================================================================ */}
      <div className="mb-6">
        {/* Breadcrumb + Back button */}
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-sm gap-1.5 text-slate-600 hover:text-slate-900 print:hidden"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
          <span className="text-slate-300">|</span>
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/" className="text-brand-primary hover:text-brand-accent transition-colors font-medium">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <Link href="/propiedades" className="text-brand-primary hover:text-brand-accent transition-colors font-medium">
              Propiedades
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted" />
            <span className="text-muted">{typeLabel}</span>
          </nav>
        </div>

        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex-1 min-w-0">
            {/* Internal code */}
            {property.internalCode && (
              <span className="text-xs text-slate-400 font-mono mb-1 block">Ref: {property.internalCode}</span>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-dark mb-3">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              <Badge className={cn(
                "text-sm font-semibold px-3 py-1",
                property.operation === 'venta'
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-100"
              )}>
                {opLabel}
              </Badge>
              <Badge variant="outline" className="text-sm font-medium px-3 py-1">
                {typeLabel}
              </Badge>
              {property.aptCredit && (
                <Badge className="text-sm font-semibold px-3 py-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
                  Apto Crédito
                </Badge>
              )}
              {property.condition && (
                <Badge variant="outline" className="text-sm px-3 py-1 text-slate-600">
                  {conditionLabels[property.condition] || property.condition}
                </Badge>
              )}
              <div className="flex items-center gap-1.5 text-muted">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{property.location}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 print:hidden">
            <FavoriteButton propertyId={property.id} size="large" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-border hover:bg-surface"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? 'Copiado' : 'Compartir'}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={shareToFacebook} className="gap-2 cursor-pointer">
                  <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                  Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={shareToInstagram} className="gap-2 cursor-pointer">
                  <InstagramIcon className="w-4 h-4 text-[#E4405F]" />
                  Instagram
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyLink} className="gap-2 cursor-pointer">
                  <Copy className="w-4 h-4" />
                  Copiar link
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex print:hidden"
              onClick={handlePrint}
              title="Imprimir"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================================
          MAIN CONTENT
      ================================================================ */}
      <div className="property-detail-grid">
        <div className="flex flex-col gap-6 min-w-0">
          {/* Gallery */}
          <Card className="overflow-hidden shadow-sm print:shadow-none">
            <PropertyImageGallery images={property.images} title={property.title} />
          </Card>

          {/* Metrics */}
          <PropertyMetrics property={property} />

          {/* Description */}
          <Card className="shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Descripción</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{sanitizeText(property.description)}</p>
            </CardContent>
          </Card>

          {/* Video Tour */}
          {property.videoUrl && (
            <Card className="overflow-hidden shadow-sm print:hidden">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6 pb-3">
                  <h2 className="text-lg font-semibold text-slate-900">Tour Virtual</h2>
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
              </CardContent>
            </Card>
          )}

          {/* Features */}
          <PropertyFeatures features={property.features} />

          {/* Additional Info */}
          {(property.yearBuilt || property.orientation || (property.floor !== undefined && property.totalFloors) || property.expenses || property.disposition || property.condition || property.rooms) && (
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Información Adicional</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {property.condition && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Condición</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {conditionLabels[property.condition] || property.condition}
                      </span>
                    </div>
                  )}
                  {property.rooms && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Ambientes</span>
                      <span className="text-sm font-semibold text-slate-900">{property.rooms}</span>
                    </div>
                  )}
                  {property.disposition && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Disposición</span>
                      <span className="text-sm font-semibold text-slate-900 capitalize">{property.disposition}</span>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Antigüedad</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {property.condition === 'a_estrenar' ? 'A estrenar' : `${new Date().getFullYear() - property.yearBuilt} años`}
                      </span>
                    </div>
                  )}
                  {property.orientation && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Orientación</span>
                      <span className="text-sm font-semibold text-slate-900">{property.orientation}</span>
                    </div>
                  )}
                  {property.floor !== undefined && property.totalFloors && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Piso</span>
                      <span className="text-sm font-semibold text-slate-900">{property.floor} de {property.totalFloors}</span>
                    </div>
                  )}
                  {property.expenses && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-xs text-slate-500 block mb-1">Expensas</span>
                      <span className="text-sm font-semibold text-slate-900">$ {property.expenses.toLocaleString('es-AR')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Services */}
          {property.services && property.services.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Servicios e Infraestructura</h2>
                <div className="flex flex-wrap gap-2">
                  {property.services.map((service) => (
                    <Badge key={service} variant="outline" className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 border-emerald-200">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documentation */}
          {property.documentation && property.documentation.length > 0 && (
            <Card className="shadow-sm">
              <CardContent className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Documentación</h2>
                <div className="flex flex-wrap gap-2">
                  {property.documentation.map((doc) => (
                    <Badge key={doc} variant="outline" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border-blue-200">
                      {doc}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location Map */}
          <Card className="overflow-hidden shadow-sm print:hidden">
            <CardContent className="p-0">
              <div className="p-4 sm:p-5 pb-3">
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

        {/* ================================================================
            SIDEBAR
        ================================================================ */}
        <div className="md:sticky md:top-24 h-fit space-y-6 print:hidden">
          <PropertySidebar property={property} />
        </div>
      </div>

      {/* ================================================================
          SIMILAR PROPERTIES (full width, outside grid)
      ================================================================ */}
      {similarProperties.length > 0 && (
        <div className="mt-8 print:hidden">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Propiedades similares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================
          MOBILE BOTTOM CTA BAR
      ================================================================ */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden print:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-2 px-4 py-3 max-w-lg mx-auto">
          <Button
            className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold h-11"
            onClick={handleWhatsApp}
          >
            <WhatsAppIcon className="w-5 h-5" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="flex-1 font-semibold h-11 border-[#2c5f7d] text-[#2c5f7d]"
            onClick={handleCall}
          >
            <Phone className="w-4 h-4" />
            Llamar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-11 w-11 shrink-0"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={shareToFacebook} className="gap-2 cursor-pointer">
                <FacebookIcon className="w-4 h-4 text-[#1877F2]" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={shareToInstagram} className="gap-2 cursor-pointer">
                <InstagramIcon className="w-4 h-4 text-[#E4405F]" />
                Instagram
              </DropdownMenuItem>
              <DropdownMenuItem onClick={copyLink} className="gap-2 cursor-pointer">
                <Copy className="w-4 h-4" />
                Copiar link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
