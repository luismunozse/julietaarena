'use client'

import { useState, useEffect, useMemo, useCallback, memo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Property } from '@/data/properties'
import FavoriteButton from './FavoriteButton'
import AppointmentBooking from './AppointmentBooking'
import ReviewSummary from './ReviewSummary'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useFadeInUp } from '@/hooks/useAnimation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Car,
  ChevronLeft,
  ChevronRight,
  Phone,
  Calendar,
  Star,
} from 'lucide-react'

// WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

interface PropertyCardProps {
  property: Property
}

function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
  const [showReviews, setShowReviews] = useState(false)
  const analytics = useAnalytics()
  const { elementRef } = useFadeInUp({ trigger: 'onScroll' })

  useEffect(() => {
    analytics.trackPropertyView(property.id, property.title)
  }, [property.id, property.title, analytics])

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.price)
  }, [property.price, property.currency])

  const formattedExpenses = useMemo(() => {
    if (!property.expenses) return null
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: property.currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(property.expenses)
  }, [property.expenses, property.currency])

  const typeLabel = useMemo(() => {
    const types: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'terreno': 'Terreno',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
      'cochera': 'Cochera'
    }
    return types[property.type] || property.type
  }, [property.type])

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    )
  }, [property.images.length])

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    )
  }, [property.images.length])

  const handleCardClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return
    }
    router.push(`/propiedades/${property.id}`)
    analytics.trackClick('property_card', 'property_list', { propertyId: property.id })
  }, [property.id, router, analytics])


  const statusVariant = {
    disponible: { variant: 'default' as const, label: 'Disponible', className: 'bg-emerald-700 text-white text-xs font-medium uppercase tracking-wide px-2.5 py-1' },
    reservado: { variant: 'secondary' as const, label: 'Reservada', className: 'bg-amber-600 text-white text-xs font-medium uppercase tracking-wide px-2.5 py-1' },
    vendido: { variant: 'secondary' as const, label: 'Vendida', className: 'bg-slate-600 text-white text-xs font-medium uppercase tracking-wide px-2.5 py-1' }
  }

  const status = statusVariant[property.status] || statusVariant.disponible

  return (
    <TooltipProvider>
      <Card
        ref={elementRef as React.RefObject<HTMLDivElement>}
        className={cn(
          "group overflow-hidden cursor-pointer transition-all duration-200",
          "rounded-md border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300",
          "bg-white p-0 gap-0"
        )}
        onClick={handleCardClick}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={property.images[currentImageIndex]}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.featured && (
              <Badge className="bg-slate-900 text-white text-xs font-medium uppercase tracking-wide px-2.5 py-1">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Destacada
              </Badge>
            )}
            <Badge className={status.className}>
              {status.label}
            </Badge>
          </div>

          {/* Favorite button */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton propertyId={property.id} size="small" />
          </div>

          {/* Image navigation */}
          {property.images.length > 1 && (
            <>
              <Button
                size="icon"
                variant="secondary"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded bg-white border border-slate-200 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4 text-slate-700" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded bg-white border border-slate-200 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4 text-slate-700" />
              </Button>

              {/* Image counter */}
              <div className="absolute bottom-3 right-3">
                <span className="bg-slate-900/80 text-white text-xs font-medium px-2 py-1 rounded">
                  {currentImageIndex + 1} / {property.images.length}
                </span>
              </div>
            </>
          )}

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3">
            <div className="bg-white border border-slate-200 rounded px-3 py-1.5 shadow">
              <span className="text-lg font-bold text-slate-900">{formattedPrice}</span>
              {formattedExpenses && (
                <span className="text-xs text-slate-500 ml-1.5">+ {formattedExpenses} exp.</span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* Type & Location */}
          <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">
                {typeLabel}
              </span>
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-slate-700 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-slate-500">
              <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
              <span className="truncate">{property.location}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-600">
            {property.bedrooms && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4" />
                    <span>{property.bedrooms}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{property.bedrooms} dormitorio{property.bedrooms > 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>
            )}
            {property.bathrooms && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4" />
                    <span>{property.bathrooms}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{property.bathrooms} baño{property.bathrooms > 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4" />
                  <span>{property.area} m²</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Superficie total</p>
              </TooltipContent>
            </Tooltip>
            {property.parking && property.parking > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5">
                    <Car className="h-4 w-4" />
                    <span>{property.parking}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{property.parking} cochera{property.parking > 1 ? 's' : ''}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-1.5 sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    analytics.trackContact('phone', `property_${property.id}`)
                    window.open('tel:+543513078376', '_self')
                  }}
                >
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-1.5 sm:ml-2">Llamar</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Llamar ahora</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    analytics.trackContact('whatsapp', `property_${property.id}`)
                    window.open(`https://wa.me/543513078376?text=Hola, me interesa la propiedad: ${property.title}`, '_blank')
                  }}
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-1.5 sm:ml-2">WhatsApp</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Enviar WhatsApp</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-400 h-8 w-8 sm:h-9 sm:w-9"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowAppointmentBooking(true)
                  }}
                >
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Agendar visita</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {showAppointmentBooking && (
        <AppointmentBooking
          property={property}
          onClose={() => setShowAppointmentBooking(false)}
          onSuccess={() => setShowAppointmentBooking(false)}
        />
      )}

      {showReviews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowReviews(false)}>
          <Card className="max-w-lg w-full mx-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h2 className="font-semibold">Reseñas</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReviews(false)}
              >
                <span className="sr-only">Cerrar</span>
                ×
              </Button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <ReviewSummary property={property} />
            </div>
          </Card>
        </div>
      )}
    </TooltipProvider>
  )
}

export default memo(PropertyCard, (prevProps, nextProps) => {
  return (
    prevProps.property.id === nextProps.property.id &&
    prevProps.property.title === nextProps.property.title &&
    prevProps.property.price === nextProps.property.price &&
    prevProps.property.status === nextProps.property.status &&
    prevProps.property.featured === nextProps.property.featured &&
    JSON.stringify(prevProps.property.images) === JSON.stringify(nextProps.property.images)
  )
})
