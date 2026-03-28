'use client'

import { useState, useMemo, useCallback, memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import { useSwipe } from '@/hooks/useSwipe'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Maximize, BedDouble, Bath, Car, Phone, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const WHATSAPP_NUMBER = '543513078376'

const OPERATION_LABELS: Record<string, string> = {
  venta: 'Venta',
  alquiler: 'Alquiler',
  alquiler_temporal: 'Temporal',
}

const STATUS_CONFIG = {
  disponible: { label: 'Disponible', className: 'bg-emerald-600 text-white' },
  reservado: { label: 'Reservada', className: 'bg-amber-500 text-white' },
  vendido: { label: 'Vendida', className: 'bg-foreground/70 text-white' },
}

interface PropertyCardListProps {
  property: Property
}

function PropertyCardList({ property }: PropertyCardListProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }, [property.images.length])

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }, [property.images.length])

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => nextImage(),
    onSwipeRight: () => prevImage(),
    minSwipeDistance: 50,
  })

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price)
  }, [property.price, property.currency])

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Hola, me interesa la propiedad: ${property.title} - ${property.location}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handlePhone = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`tel:+${WHATSAPP_NUMBER}`, '_self')
  }

  const status = STATUS_CONFIG[property.status] || STATUS_CONFIG.disponible

  return (
    <Link href={`/propiedades/${property.id}`} className="block group">
      <Card className="flex flex-col sm:flex-row overflow-hidden bg-white rounded-xl border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative w-full sm:w-[280px] lg:w-[320px] h-[220px] sm:h-auto sm:min-h-[220px] shrink-0 bg-surface" {...swipeHandlers}>
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Favorite */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton propertyId={property.id} size="small" />
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {property.featured && (
              <Badge className="bg-brand-secondary text-brand-dark hover:bg-brand-secondary text-[10px] font-semibold uppercase tracking-wider shadow-sm">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Destacada
              </Badge>
            )}
            <Badge className={cn("hover:opacity-100 text-[10px] font-semibold uppercase tracking-wider shadow-sm", status.className)}>
              {status.label}
            </Badge>
            {property.aptCredit && (
              <Badge className="bg-brand-primary text-white hover:bg-brand-primary text-[10px] font-semibold shadow-sm">
                Apto crédito
              </Badge>
            )}
          </div>

          {/* Image nav */}
          {property.images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => prevImage(e)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => nextImage(e)}
              >
                <ChevronRight className="h-4 w-4" />
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

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3 min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground truncate group-hover:text-brand-primary transition-colors">
                {property.title}
              </h3>
              <p className="text-sm text-muted flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{property.location}</span>
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-brand-primary block">{formattedPrice}</span>
              <Badge variant="outline" className="text-[10px] mt-1 border-border text-muted">
                {OPERATION_LABELS[property.operation] || property.operation}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed line-clamp-2">{property.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1.5">
              <Maximize className="h-3.5 w-3.5 text-brand-primary/60" />
              <span className="text-xs font-medium text-foreground">{property.area} m²</span>
            </div>
            {property.bedrooms && (
              <div className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1.5">
                <BedDouble className="h-3.5 w-3.5 text-brand-primary/60" />
                <span className="text-xs font-medium text-foreground">{property.bedrooms} dorm.</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1.5">
                <Bath className="h-3.5 w-3.5 text-brand-primary/60" />
                <span className="text-xs font-medium text-foreground">{property.bathrooms} baño{property.bathrooms > 1 ? 's' : ''}</span>
              </div>
            )}
            {property.parking && property.parking > 0 && (
              <div className="flex items-center gap-1.5 bg-surface border border-border rounded-lg px-2.5 py-1.5">
                <Car className="h-3.5 w-3.5 text-brand-primary/60" />
                <span className="text-xs font-medium text-foreground">{property.parking} coch.</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-3 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-border text-muted hover:text-foreground hover:bg-surface"
              onClick={handlePhone}
            >
              <Phone className="h-3.5 w-3.5" />
              Llamar
            </Button>
            <Button
              size="sm"
              className="text-xs bg-[#25D366] hover:bg-[#20BD5A] text-white"
              onClick={handleWhatsApp}
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default memo(PropertyCardList, (prevProps, nextProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.price === nextProps.property.price &&
    prevProps.property.status === nextProps.property.status &&
    JSON.stringify(prevProps.property.images) === JSON.stringify(nextProps.property.images)
  )
})
