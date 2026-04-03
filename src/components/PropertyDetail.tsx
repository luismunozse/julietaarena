'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { Property } from '@/data/properties'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FavoriteButton from './FavoriteButton'
import PropertyImageGallery from './PropertyImageGallery'
import PropertySidebar from './PropertySidebar'
import UsdCalculator from './UsdCalculator'
import PropertyMetrics from './PropertyMetrics'
import PropertyFeatures from './PropertyFeatures'
import PropertyCard from './PropertyCard'
import PropertyLocationMap from './PropertyLocationMap'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useProperties } from '@/hooks/useProperties'
import { useToast } from '@/components/ToastContainer'
import { useInView } from '@/hooks/useInView'
import { sanitizeText } from '@/lib/sanitize'
import { cn } from '@/lib/utils'
import {
  MapPin, Share2, ChevronRight, ChevronLeft, ExternalLink,
  Phone, Printer, Copy, Check, Shield, CalendarCheck,
  Clock, MessageCircle, X, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

const WHATSAPP_NUMBER = '543513078376'

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

const statusConfig: Record<string, { label: string; className: string }> = {
  disponible: { label: 'Disponible', className: 'bg-emerald-100 text-emerald-700' },
  reservado: { label: 'Reservada', className: 'bg-amber-100 text-amber-700' },
  vendido: { label: 'Vendida', className: 'bg-red-100 text-red-700' },
}

// ── Helpers ──
function getDaysAgo(dateStr?: string): number | null {
  if (!dateStr) return null
  const created = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24))
  return diff >= 0 ? diff : null
}

function getDaysLabel(days: number): string {
  if (days === 0) return 'Publicada hoy'
  if (days === 1) return 'Publicada ayer'
  if (days <= 7) return `Publicada hace ${days} dias`
  if (days <= 30) return `Publicada hace ${Math.floor(days / 7)} semanas`
  return ''
}

// ── Animated section wrapper ──
function AnimatedSection({ children, className, id }: { children: React.ReactNode; className?: string; id?: string }) {
  const { ref, isInView } = useInView({ threshold: 0.1, triggerOnce: true })
  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        'transition-all duration-700 ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className
      )}
    >
      {children}
    </div>
  )
}

interface PropertyDetailProps {
  property: Property
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const router = useRouter()
  const analytics = useAnalytics()
  const { properties } = useProperties()
  const { success } = useToast()
  const [copied, setCopied] = useState(false)
  const [showContactSheet, setShowContactSheet] = useState(false)
  const [activeSection, setActiveSection] = useState('fotos')
  const similarRef = useRef<HTMLDivElement>(null)

  const opLabel = operationLabels[property.operation] || property.operation
  const typeLabel = typeLabels[property.type] || property.type
  const statusInfo = statusConfig[property.status] || statusConfig.disponible
  const daysAgo = getDaysAgo(property.createdAt)
  const daysLabel = daysAgo !== null ? getDaysLabel(daysAgo) : ''

  const formattedPrice = useMemo(() => {
    const prefix = property.currency === 'USD' ? 'USD' : 'ARS'
    const formatted = new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price)
    return `${prefix} ${formatted}`
  }, [property.price, property.currency])

  /* -- Share -- */
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
    success('Link copiado. Pegalo en tu historia o publicacion de Instagram', 4000)
    setTimeout(() => setCopied(false), 3000)
  }

  const ShareDropdown = ({ iconSize = 'w-4 h-4' }: { iconSize?: string }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-border hover:bg-surface">
          {copied ? <Check className={cn(iconSize, "text-emerald-500")} /> : <Share2 className={iconSize} />}
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
  )

  /* -- Similar properties — improved algorithm -- */
  const similarProperties = useMemo(() => {
    if (!properties || properties.length === 0) return []

    return properties
      .filter((p) => p.id !== property.id && p.status === 'disponible')
      .map((p) => {
        let score = 0
        // Same location/zone (highest priority)
        const propZone = property.location.split(',').pop()?.trim().toLowerCase() || ''
        const pZone = p.location.split(',').pop()?.trim().toLowerCase() || ''
        if (propZone && pZone && propZone === pZone) score += 4

        // Same type
        if (p.type === property.type) score += 3
        // Same operation
        if (p.operation === property.operation) score += 2
        // Similar price (within 40%)
        const priceDiff = Math.abs(p.price - property.price) / property.price
        if (priceDiff < 0.2) score += 2
        else if (priceDiff < 0.4) score += 1

        return { property: p, score }
      })
      .filter((item) => item.score >= 2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.property)
  }, [properties, property])

  /* -- Carousel scroll -- */
  const scrollSimilar = useCallback((dir: 'left' | 'right') => {
    if (!similarRef.current) return
    const scrollAmount = similarRef.current.offsetWidth * 0.8
    similarRef.current.scrollBy({
      left: dir === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }, [])

  /* -- Actions -- */
  const handleWhatsApp = () => {
    const message = `Hola, vi ${property.title} en ${property.location} y me gustaria coordinar una visita.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleCall = () => {
    window.open(`tel:+${WHATSAPP_NUMBER}`, '_self')
  }

  /* -- Section scroll for tab nav -- */
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const el = document.getElementById(sectionId)
    if (el) {
      const offset = 140
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  // Lock body scroll when contact sheet is open
  useEffect(() => {
    if (showContactSheet) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [showContactSheet])

  // Tab nav sections
  const sections = [
    { id: 'fotos', label: 'Fotos' },
    { id: 'info', label: 'Info' },
    { id: 'descripcion', label: 'Descripcion' },
    { id: 'ubicacion', label: 'Mapa' },
    { id: 'contacto', label: 'Contacto' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-32 md:pb-12">
      {/* ── HEADER ── */}
      <div className="mb-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm mb-4">
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

        {/* Title row — responsive: stacked on mobile, side-by-side on desktop */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
          <div className="flex-1 min-w-0">
            {property.internalCode && (
              <span className="text-xs text-muted font-mono mb-1 block">Ref: {property.internalCode}</span>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-dark mb-2">
              {property.title}
            </h1>

            {/* Location + badges */}
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center gap-1.5 text-muted">
                <MapPin className="w-4 h-4 shrink-0" />
                {property.location}
              </span>
              <span className="text-border">·</span>

              {/* Status badge */}
              <Badge className={cn("text-xs font-semibold px-2.5 py-0.5", statusInfo.className)}>
                {statusInfo.label}
              </Badge>

              {/* Operation badge */}
              <Badge className={cn(
                "text-xs font-semibold px-2.5 py-0.5",
                property.operation === 'venta'
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-100"
              )}>
                {opLabel}
              </Badge>

              <Badge variant="outline" className="text-xs font-medium px-2.5 py-0.5 border-border text-muted">
                {typeLabel}
              </Badge>

              {/* Apto credito — prominent */}
              {property.aptCredit && (
                <Badge className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200 hover:from-amber-100 gap-1">
                  <Shield className="w-3 h-3" />
                  Apto Credito
                </Badge>
              )}

              {/* Days published */}
              {daysLabel && daysAgo !== null && daysAgo <= 30 && (
                <Badge variant="outline" className="text-xs font-medium px-2.5 py-0.5 border-brand-primary/20 text-brand-primary bg-brand-primary/5">
                  <Clock className="w-3 h-3 mr-1" />
                  {daysLabel}
                </Badge>
              )}
            </div>
          </div>

          {/* Price — on mobile: full width below title. On desktop: right side */}
          <div className="flex flex-row md:flex-col md:items-end gap-3 md:gap-2 items-center print:hidden">
            <div className="md:text-right">
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{formattedPrice}</p>
              {property.expenses && (
                <p className="text-sm text-muted">+ $ {property.expenses.toLocaleString('es-AR')} expensas</p>
              )}
              {property.operation === 'alquiler' && (
                <p className="text-xs text-muted">/mes</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <FavoriteButton propertyId={property.id} size="large" />
              <ShareDropdown />
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex"
                onClick={() => window.print()}
                title="Imprimir"
              >
                <Printer className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── STICKY TAB NAV (mobile) ── */}
      <div className="sticky top-[60px] z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-white/95 backdrop-blur-md border-b border-border md:hidden print:hidden">
        <div className="flex gap-1 overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors",
                activeSection === section.id
                  ? "bg-brand-primary text-white"
                  : "text-muted hover:bg-surface"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="property-detail-grid">
        <div className="flex flex-col gap-6 min-w-0">
          {/* Gallery */}
          <AnimatedSection id="fotos">
            <div className="rounded-xl overflow-hidden border border-border shadow-sm print:shadow-none">
              <PropertyImageGallery images={property.images} title={property.title} />
            </div>
          </AnimatedSection>

          {/* Metrics */}
          <AnimatedSection id="info">
            <PropertyMetrics property={property} />
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection id="descripcion">
            <div className="bg-white rounded-xl border border-border shadow-sm">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-foreground mb-3">Descripcion</h2>
                <p className="text-muted leading-relaxed whitespace-pre-line">{sanitizeText(property.description)}</p>
              </div>
            </div>
          </AnimatedSection>

          {/* Video Tour */}
          {property.videoUrl && (
            <AnimatedSection>
              <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm print:hidden">
                <div className="p-4 sm:p-6 pb-3">
                  <h2 className="text-lg font-semibold text-foreground">Tour Virtual</h2>
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
            </AnimatedSection>
          )}

          {/* Features / Comodidades */}
          <AnimatedSection>
            <PropertyFeatures features={property.features} />
          </AnimatedSection>

          {/* Services & Documentation — unified */}
          {((property.services && property.services.length > 0) || (property.documentation && property.documentation.length > 0)) && (
            <AnimatedSection>
              <div className="bg-white rounded-xl border border-border shadow-sm">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Informacion adicional</h2>

                  {property.services && property.services.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-muted mb-2">Servicios e Infraestructura</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.services.map((service) => (
                          <Badge key={service} variant="outline" className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-700 border-emerald-200">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {property.documentation && property.documentation.length > 0 && (
                    <div className={property.services && property.services.length > 0 ? 'pt-4 border-t border-border' : ''}>
                      <h3 className="text-sm font-medium text-muted mb-2">Documentacion</h3>
                      <div className="flex flex-wrap gap-2">
                        {property.documentation.map((doc) => (
                          <Badge key={doc} variant="outline" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-700 border-blue-200">
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* Location Map */}
          <AnimatedSection id="ubicacion">
            <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm print:hidden">
              <div className="p-4 sm:p-5 pb-3">
                <h2 className="text-lg font-semibold text-foreground">Ubicacion</h2>
                <p className="text-sm text-muted flex items-center gap-1.5 mt-1">
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
            </div>
          </AnimatedSection>
        </div>

        {/* ── SIDEBAR ── */}
        <div id="contacto" className="md:sticky md:top-24 h-fit space-y-4 print:hidden">
          <PropertySidebar property={property} />
          <UsdCalculator price={property.price} currency={property.currency} />
        </div>
      </div>

      {/* ── SIMILAR PROPERTIES — Carousel ── */}
      {similarProperties.length > 0 && (
        <AnimatedSection className="mt-10 print:hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Propiedades similares</h2>
              <p className="text-sm text-muted">Otras opciones que podrian interesarte</p>
            </div>
            {similarProperties.length > 3 && (
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scrollSimilar('left')}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-surface transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSimilar('right')}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-surface transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={similarRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 md:mx-0 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {similarProperties.map((p) => (
              <div key={p.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[calc(33.333%-11px)] snap-start shrink-0">
                <PropertyCard property={p} />
              </div>
            ))}
          </div>

          {/* CTA to see all */}
          <div className="text-center mt-6">
            <Link
              href={`/propiedades?operation=${property.operation}&type=${property.type}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors"
            >
              Ver todas las propiedades en {opLabel.toLowerCase()}
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </AnimatedSection>
      )}

      {/* ── MOBILE BOTTOM CTA — Redesigned ── */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden print:hidden bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          {/* Price row */}
          <div className="flex items-center justify-between px-4 pt-2 pb-1">
            <div className="min-w-0">
              <p className="text-lg font-bold text-foreground truncate">{formattedPrice}</p>
              {property.operation === 'alquiler' && (
                <p className="text-[10px] text-muted -mt-0.5">/mes</p>
              )}
            </div>
            <button
              onClick={() => setShowContactSheet(true)}
              className="text-xs text-brand-primary font-semibold flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Consultar
            </button>
          </div>
          {/* Buttons row */}
          <div className="flex items-center gap-2 px-4 pb-3">
            <Button
              className="flex-[1.3] bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold h-11"
              onClick={handleWhatsApp}
            >
              <WhatsAppIcon className="w-4 h-4 mr-1.5" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex-1 font-semibold h-11 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
              onClick={handleCall}
            >
              <Phone className="w-4 h-4 mr-1.5" />
              Llamar
            </Button>
          </div>
        </div>
      </div>

      {/* ── MOBILE CONTACT BOTTOM SHEET ── */}
      {showContactSheet && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowContactSheet(false)}
          />
          {/* Sheet */}
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            {/* Handle */}
            <div className="sticky top-0 bg-white pt-3 pb-2 px-4 border-b border-border rounded-t-2xl">
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Consultar</h3>
                <button
                  onClick={() => setShowContactSheet(false)}
                  className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <PropertySidebar property={property} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
