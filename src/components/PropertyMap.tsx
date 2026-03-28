'use client'

import { useState, useEffect, useRef } from 'react'
import GoogleMaps from './GoogleMaps'
import { Property } from '@/data/properties'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  X,
  Home,
  Building2,
  TreePine,
  Store,
  Briefcase,
  ParkingSquare,
  Bed,
  Bath,
  Ruler,
} from 'lucide-react'

interface PropertyMapProps {
  properties?: Property[]
  height?: string
  /** When true, hides the section wrapper, title, and built-in filters (used when embedded in PropertiesResults) */
  embedded?: boolean
}

interface MapMarker {
  id: string
  property: Property
  position: { lat: number; lng: number }
}

// Coordenadas aproximadas de Cordoba y alrededores
const cordobaCoordinates = {
  lat: -31.4201,
  lng: -64.1888,
}

// Coordenadas aproximadas para diferentes zonas de Cordoba
const zoneCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'Villa Allende': { lat: -31.3, lng: -64.3 },
  'Nueva Cordoba': { lat: -31.42, lng: -64.19 },
  'Carlos Paz': { lat: -31.424, lng: -64.4978 },
  Centro: { lat: -31.4201, lng: -64.1888 },
  'Barrio Norte': { lat: -31.4, lng: -64.18 },
  'Barrio Jardin': { lat: -31.41, lng: -64.2 },
  'Barrio Guemes': { lat: -31.43, lng: -64.2 },
  'Torre Empresarial': { lat: -31.415, lng: -64.185 },
}

const propertyTypeIcons: Record<string, React.ReactNode> = {
  casa: <Home className="h-5 w-5" />,
  departamento: <Building2 className="h-5 w-5" />,
  terreno: <TreePine className="h-5 w-5" />,
  local: <Store className="h-5 w-5" />,
  oficina: <Briefcase className="h-5 w-5" />,
  cochera: <ParkingSquare className="h-5 w-5" />,
}

export default function PropertyMap({
  properties = [],
  height = '600px',
  embedded = false,
}: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([])
  const [filterType, setFilterType] = useState<string>('all')
  const [filterOperation, setFilterOperation] = useState<string>('all')
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generar marcadores para las propiedades
    const markers: MapMarker[] = properties.map((property) => {
      const location = property.location.split(',')[0].trim()
      const coords = zoneCoordinates[location] || cordobaCoordinates

      // Agregar pequena variacion para evitar superposicion
      const lat = coords.lat + (Math.random() - 0.5) * 0.01
      const lng = coords.lng + (Math.random() - 0.5) * 0.01

      return {
        id: property.id,
        property,
        position: { lat, lng },
      }
    })

    setMapMarkers(markers)
  }, [properties])

  const filteredMarkers = mapMarkers.filter((marker) => {
    const property = marker.property
    const typeMatch = filterType === 'all' || property.type === filterType
    const operationMatch =
      filterOperation === 'all' || property.operation === filterOperation
    return typeMatch && operationMatch
  })

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`
    }
    return `$${price.toLocaleString()}`
  }

  const getPropertyIcon = (type: string) => {
    return propertyTypeIcons[type] || <Home className="h-5 w-5" />
  }

  const mapAndSidebar = (
    <div className="grid lg:grid-cols-[1fr_320px]" style={{ height }}>
      <GoogleMaps
        properties={filteredMarkers.map((marker) => marker.property)}
        selectedProperty={selectedProperty}
        onPropertySelect={setSelectedProperty}
        height={height}
      />

      {/* Property List Sidebar */}
      <div className="max-h-[600px] overflow-y-auto border-l border-slate-200 bg-slate-50 p-4">
        <h4 className="mb-4 font-semibold text-[#1a4158]">
          Propiedades ({filteredMarkers.length})
        </h4>
        <div className="flex flex-col gap-4">
          {filteredMarkers.map((marker) => (
            <div
              key={marker.id}
              className={cn(
                'cursor-pointer overflow-hidden rounded-xl border bg-white transition-all hover:shadow-md',
                selectedProperty?.id === marker.property.id
                  ? 'border-2 border-[#2c5f7d]'
                  : 'border-slate-200'
              )}
              onClick={() => setSelectedProperty(marker.property)}
            >
              {/* Property Image Placeholder */}
              <div className="relative h-24 bg-slate-100">
                <div className="flex h-full items-center justify-center text-slate-400">
                  {getPropertyIcon(marker.property.type)}
                </div>
                <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                  {getPropertyIcon(marker.property.type)}
                </div>
              </div>

              {/* Property Info */}
              <div className="p-3">
                <h5 className="mb-1 truncate text-sm font-semibold text-[#1a4158]">
                  {marker.property.title}
                </h5>
                <p className="mb-2 text-xs text-slate-500">
                  {marker.property.location}
                </p>
                <p className="mb-2 text-base font-bold text-[#2c5f7d]">
                  {formatPrice(marker.property.price)}
                  {marker.property.operation === 'alquiler' && '/mes'}
                </p>
                <div className="flex gap-3 text-xs text-slate-500">
                  {marker.property.bedrooms && (
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {marker.property.bedrooms}
                    </span>
                  )}
                  {marker.property.bathrooms && (
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {marker.property.bathrooms}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Ruler className="h-3 w-3" />
                    {marker.property.area}m²
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const propertyModal = selectedProperty && (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4"
      onClick={() => setSelectedProperty(null)}
    >
      <Card
        className="max-h-[90vh] w-full max-w-[600px] overflow-auto bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h3 className="font-semibold text-[#1a4158]">
            {selectedProperty.title}
          </h3>
          <button
            className="p-1 text-slate-500 transition-colors hover:text-slate-700"
            onClick={() => setSelectedProperty(null)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <CardContent className="grid gap-6 p-6 md:grid-cols-2">
          {/* Property Image */}
          <div className="h-[200px] overflow-hidden rounded-lg bg-slate-100">
            <div className="flex h-full items-center justify-center text-slate-400">
              {getPropertyIcon(selectedProperty.type)}
            </div>
          </div>

          {/* Property Details */}
          <div className="flex flex-col gap-4">
            <div className="text-2xl font-bold text-[#2c5f7d]">
              {formatPrice(selectedProperty.price)}
              {selectedProperty.operation === 'alquiler' && '/mes'}
            </div>

            <div className="space-y-1 text-sm text-[#1a4158]">
              <p>
                <strong>Ubicación:</strong> {selectedProperty.location}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedProperty.type}
              </p>
              <p>
                <strong>Área:</strong> {selectedProperty.area}m²
              </p>
              {selectedProperty.bedrooms && (
                <p>
                  <strong>Dormitorios:</strong> {selectedProperty.bedrooms}
                </p>
              )}
              {selectedProperty.bathrooms && (
                <p>
                  <strong>Baños:</strong> {selectedProperty.bathrooms}
                </p>
              )}
            </div>

            <p className="text-sm leading-relaxed text-slate-600">
              {selectedProperty.description}
            </p>

            <div className="mt-4 flex gap-4">
              <Button asChild>
                <a href="#contacto">Consultar</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`/propiedades/${selectedProperty.id}`}>
                  Ver Detalles
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // When embedded (e.g. inside PropertiesResults), render just the map + sidebar without wrapper/title/filters
  if (embedded) {
    return (
      <>
        {mapAndSidebar}
        {propertyModal}
      </>
    )
  }

  // Standalone version with section wrapper, title, and filters
  return (
    <section className="py-16" id="mapa">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-[#1a4158]">
            Ubicación de Propiedades
          </h2>
          <p className="text-slate-600">
            Explora nuestras propiedades en el mapa interactivo de Córdoba
          </p>
        </div>

        <Card className="overflow-hidden bg-white">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 border-b border-slate-200 bg-slate-50 p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Label htmlFor="typeFilter" className="text-sm font-medium">
                Tipo de Propiedad
              </Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger id="typeFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="casa">Casas</SelectItem>
                  <SelectItem value="departamento">Departamentos</SelectItem>
                  <SelectItem value="terreno">Terrenos</SelectItem>
                  <SelectItem value="local">Locales</SelectItem>
                  <SelectItem value="oficina">Oficinas</SelectItem>
                  <SelectItem value="cochera">Cocheras</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Label htmlFor="operationFilter" className="text-sm font-medium">
                Operación
              </Label>
              <Select value={filterOperation} onValueChange={setFilterOperation}>
                <SelectTrigger id="operationFilter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las operaciones</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {mapAndSidebar}
        </Card>

        {propertyModal}
      </div>
    </section>
  )
}
