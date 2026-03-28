'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useInView } from '@/hooks/useInView'
import { cn } from '@/lib/utils'
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Car,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from 'lucide-react'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const WHATSAPP_NUMBER = '543513078376'

const TYPE_LABELS: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Depto',
  terreno: 'Terreno',
  local: 'Local',
  oficina: 'Oficina',
  cochera: 'Cochera',
}

interface PropertyCardProps {
  property: Property
}

function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imgError, setImgError] = useState(false)
  const analytics = useAnalytics()

  const { ref: viewRef, isInView } = useInView({ threshold: 0.5, triggerOnce: true })
  const hasTracked = useState(false)
  if (isInView && !hasTracked[0]) {
    hasTracked[1](true)
    analytics.trackPropertyView(property.id, property.title)
  }

  const formattedPrice = useMemo(() => {
    const prefix = property.currency === 'USD' ? 'USD' : 'ARS'
    const formatted = new Intl.NumberFormat('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price)
    return `${prefix} ${formatted}`
  }, [property.price, property.currency])

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setImgError(false)
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }, [property.images.length])

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setImgError(false)
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }, [property.images.length])

  const handleCardClick = useCallback(() => {
    router.push(`/propiedades/${property.id}`)
    analytics.trackClick('property_card', 'property_list', { propertyId: property.id })
  }, [property.id, router, analytics])

  const handleWhatsApp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    analytics.trackContact('whatsapp', `property_${property.id}`)
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, me interesa la propiedad: ${property.title}`)}`,
      '_blank'
    )
  }, [property.id, property.title, analytics])

  // Build features array
  const features: string[] = []
  if (property.bedrooms) features.push(`${property.bedrooms} dorm`)
  if (property.bathrooms) features.push(`${property.bathrooms} ${property.bathrooms > 1 ? 'baños' : 'baño'}`)
  if (property.area) features.push(`${property.area} m²`)
  if (property.parking && property.parking > 0) features.push(`${property.parking} coch`)

  const operationLabel = property.operation === 'alquiler' ? 'Alquiler' : property.operation === 'alquiler_temporal' ? 'Temporal' : 'Venta'

  return (
    <article
      ref={viewRef}
      className={cn(
        "group bg-white rounded-xl border border-border overflow-hidden cursor-pointer",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      )}
      onClick={handleCardClick}
    >
      {/* ── Image ── */}
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface text-muted">
            <ImageOff className="w-8 h-8 mb-2 opacity-40" />
            <span className="text-xs opacity-60">Imagen no disponible</span>
          </div>
        ) : (
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNWY5Ii8+PC9zdmc+"
            onError={() => setImgError(true)}
          />
        )}

        {/* Badges — solo esquina superior izquierda */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {property.featured && (
            <span className="bg-brand-secondary text-brand-dark text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow-sm">
              Destacada
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-foreground text-[10px] font-semibold px-2 py-1 rounded-md shadow-sm">
            {operationLabel}
          </span>
        </div>

        {/* Favorito — esquina superior derecha */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton propertyId={property.id} size="small" />
        </div>

        {/* Navegación de imágenes */}
        {property.images.length > 1 && !imgError && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {property.images.slice(0, 5).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        {/* Precio — jerarquía #1 */}
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <span className="text-lg font-bold text-foreground">{formattedPrice}</span>
          {property.expenses && (
            <span className="text-[11px] text-muted">+ ${new Intl.NumberFormat('es-AR').format(property.expenses)} exp.</span>
          )}
        </div>

        {/* Tipo + features — jerarquía #2: una línea compacta */}
        <div className="flex items-center gap-1.5 text-xs text-muted mb-2.5">
          <span className="font-medium text-foreground">{TYPE_LABELS[property.type] || property.type}</span>
          {features.length > 0 && (
            <>
              <span className="text-border">|</span>
              {features.map((f, i) => (
                <span key={i} className="flex items-center gap-0.5">
                  {i > 0 && <span className="text-border mx-0.5">·</span>}
                  {f}
                </span>
              ))}
            </>
          )}
        </div>

        {/* Título — jerarquía #3 */}
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-brand-primary transition-colors mb-1.5">
          {property.title}
        </h3>

        {/* Ubicación — jerarquía #4 */}
        <p className="flex items-center gap-1 text-xs text-muted mb-3">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{property.location}</span>
        </p>

        {/* CTA — un solo botón principal */}
        <button
          className="w-full flex items-center justify-center gap-2 h-9 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-semibold rounded-lg transition-colors"
          onClick={handleWhatsApp}
        >
          <WhatsAppIcon className="h-3.5 w-3.5" />
          Consultar por WhatsApp
        </button>
      </div>
    </article>
  )
}

export default memo(PropertyCard, (prevProps, nextProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.price === nextProps.property.price &&
    prevProps.property.status === nextProps.property.status &&
    prevProps.property.featured === nextProps.property.featured &&
    JSON.stringify(prevProps.property.images) === JSON.stringify(nextProps.property.images)
  )
})
