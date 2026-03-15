'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import { usePropertyFilters } from '@/hooks/usePropertyFilters'
import { useBulkActions } from '@/hooks/useBulkActions'
import Modal from '@/components/Modal'
import PropertyFilters from '@/components/admin/PropertyFilters'
import PropertyViewToggle from '@/components/admin/PropertyViewToggle'
import BulkActions from '@/components/admin/BulkActions'
import ExportButton from '@/components/admin/ExportButton'
import Pagination from '@/components/admin/Pagination'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { exportToCSV } from '@/lib/export'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Plus,
  Eye,
  Pencil,
  Copy,
  Trash2,
  Home,
  Building2,
  Trees,
  Store,
  Briefcase,
  Car,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  DollarSign,
  Key,
  Loader2,
} from 'lucide-react'

type ViewMode = 'grid' | 'table' | 'list'

const typeIcons: Record<string, React.ReactNode> = {
  casa: <Home className="h-4 w-4" />,
  departamento: <Building2 className="h-4 w-4" />,
  terreno: <Trees className="h-4 w-4" />,
  local: <Store className="h-4 w-4" />,
  oficina: <Briefcase className="h-4 w-4" />,
  cochera: <Car className="h-4 w-4" />,
}

const typeLabels: Record<string, string> = {
  casa: 'Casas',
  departamento: 'Deptos',
  terreno: 'Terrenos',
  local: 'Locales',
  oficina: 'Oficinas',
  cochera: 'Cocheras',
}

const typeColors: Record<string, string> = {
  casa: 'bg-blue-500',
  departamento: 'bg-emerald-500',
  terreno: 'bg-amber-500',
  local: 'bg-pink-500',
  oficina: 'bg-violet-500',
  cochera: 'bg-slate-500',
}

export default function AdminPropertiesPage() {
  const router = useRouter()
  const { properties, isLoading, deleteProperty, duplicateProperty } = useProperties()
  const { filters, filteredProperties, updateFilter, clearFilters, hasActiveFilters } = usePropertyFilters(properties)
  const {
    selectedIds,
    toggleSelection,
    selectAll,
    deselectAll,
    bulkStatusChange,
    bulkFeaturedToggle,
    bulkDelete,
  } = useBulkActions()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<string>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'confirm' | 'success' | 'error'
    title: string
    message: string
    onConfirm?: () => void
  }>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: ''
  })

  const stats = useMemo(() => ({
    total: properties.length,
    disponibles: properties.filter(p => p.status === 'disponible').length,
    reservadas: properties.filter(p => p.status === 'reservado').length,
    vendidas: properties.filter(p => p.status === 'vendido').length,
    destacadas: properties.filter(p => p.featured).length,
    porTipo: {
      casa: properties.filter(p => p.type === 'casa').length,
      departamento: properties.filter(p => p.type === 'departamento').length,
      terreno: properties.filter(p => p.type === 'terreno').length,
      local: properties.filter(p => p.type === 'local').length,
      oficina: properties.filter(p => p.type === 'oficina').length,
      cochera: properties.filter(p => p.type === 'cochera').length,
    },
    porOperacion: {
      venta: properties.filter(p => p.operation === 'venta').length,
      alquiler: properties.filter(p => p.operation === 'alquiler').length,
    }
  }), [properties])

  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties]
    sorted.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortBy) {
        case 'price':
          aValue = a.price
          bValue = b.price
          break
        case 'title':
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case 'location':
          aValue = a.location.toLowerCase()
          bValue = b.location.toLowerCase()
          break
        case 'updatedAt':
          aValue = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
          bValue = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
          break
        case 'createdAt':
        default:
          aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0
          bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0
          break
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
    return sorted
  }, [filteredProperties, sortBy, sortOrder])

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy)
    setSortOrder(newSortOrder)
  }

  const handleDeleteClick = (id: string) => {
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Eliminar Propiedad',
      message: 'Esta seguro de eliminar esta propiedad? Esta accion no se puede deshacer.',
      onConfirm: () => handleDeleteConfirm(id)
    })
  }

  const handleDeleteConfirm = async (id: string) => {
    setDeletingId(id)
    const success = await deleteProperty(id)

    if (success) {
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Propiedad Eliminada',
        message: 'La propiedad se ha eliminado exitosamente.'
      })
      setTimeout(() => setDeletingId(null), 500)
    } else {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error al Eliminar',
        message: 'No se pudo eliminar la propiedad. Por favor intenta nuevamente.'
      })
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number, currency: 'ARS' | 'USD' = 'USD') => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { bg: string; icon: React.ReactNode; label: string }> = {
      disponible: { bg: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Disponible' },
      reservado: { bg: 'bg-amber-100 text-amber-700', icon: <Clock className="h-3 w-3" />, label: 'Reservado' },
      vendido: { bg: 'bg-red-100 text-red-700', icon: <XCircle className="h-3 w-3" />, label: 'Vendido' },
    }
    const { bg, icon, label } = config[status] || config.disponible
    return (
      <Badge className={cn('gap-1 font-medium', bg)}>
        {icon}
        {label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">Cargando propiedades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Propiedades"
        subtitle={`${properties.length} propiedades en el sistema`}
        action={
          <Button onClick={() => router.push('/admin/propiedades/nueva?clear=true')}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Propiedad
          </Button>
        }
      />

      {/* Estadisticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.disponibles}</p>
                <p className="text-xs text-slate-500">Disponibles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.reservadas}</p>
                <p className="text-xs text-slate-500">Reservadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <Star className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stats.destacadas}</p>
                <p className="text-xs text-slate-500">Destacadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadisticas secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Por operacion */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Por Operacion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="font-medium text-slate-700">Venta</span>
              </div>
              <span className="text-lg font-bold text-slate-800">{stats.porOperacion.venta}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100">
                  <Key className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-slate-700">Alquiler</span>
              </div>
              <span className="text-lg font-bold text-slate-800">{stats.porOperacion.alquiler}</span>
            </div>
          </CardContent>
        </Card>

        {/* Por tipo */}
        <Card className="bg-white lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.entries(stats.porTipo).map(([type, count]) => (
                <div
                  key={type}
                  className="flex flex-col items-center gap-1.5 p-3 bg-slate-50 rounded-lg"
                >
                  <div className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-md text-white',
                    typeColors[type]
                  )}>
                    {typeIcons[type]}
                  </div>
                  <span className="text-lg font-bold text-slate-800">{count}</span>
                  <span className="text-[10px] text-slate-500 text-center">{typeLabels[type]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <PropertyFilters
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Acciones Masivas */}
      <BulkActions
        selectedIds={selectedIds}
        properties={sortedProperties}
        onSelectAll={() => selectAll(sortedProperties)}
        onDeselectAll={deselectAll}
        onBulkStatusChange={(status) => bulkStatusChange(sortedProperties, status)}
        onBulkFeaturedToggle={(featured) => bulkFeaturedToggle(sortedProperties, featured)}
        onBulkDelete={bulkDelete}
        onBulkExport={() => {
          const selectedProperties = sortedProperties.filter(p => selectedIds.has(p.id))
          exportToCSV(selectedProperties, 'propiedades_seleccionadas')
        }}
      />

      {/* Controles de Vista */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <PropertyViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-slate-100 text-slate-700">
            {sortedProperties.length} {sortedProperties.length === 1 ? 'propiedad' : 'propiedades'}
            {hasActiveFilters && ` (filtrado)`}
          </Badge>
          <ExportButton properties={sortedProperties} />
        </div>
      </div>

      {/* Lista con paginacion */}
      <Pagination
        items={sortedProperties}
        itemsPerPage={25}
        render={(paginatedItems) => (
          <>
            {viewMode === 'table' ? (
              <Card className="overflow-hidden bg-white">
                <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={selectedIds.size === paginatedItems.length && paginatedItems.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              paginatedItems.forEach(p => {
                                if (!selectedIds.has(p.id)) toggleSelection(p.id)
                              })
                            } else {
                              paginatedItems.forEach(p => {
                                if (selectedIds.has(p.id)) toggleSelection(p.id)
                              })
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Titulo</TableHead>
                      <TableHead>Ubicacion</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map(prop => (
                      <TableRow key={prop.id} className="hover:bg-slate-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedIds.has(prop.id)}
                            onCheckedChange={() => toggleSelection(prop.id)}
                          />
                        </TableCell>
                        <TableCell>
                          {prop.images && prop.images.length > 0 ? (
                            <Image
                              src={prop.images[0]}
                              alt={prop.title}
                              width={48}
                              height={48}
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center">
                              <Home className="h-5 w-5 text-slate-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium max-w-[180px] truncate">{prop.title}</TableCell>
                        <TableCell className="text-slate-600 max-w-[120px] truncate">{prop.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className={cn('flex h-5 w-5 items-center justify-center rounded text-white', typeColors[prop.type])}>
                              {typeIcons[prop.type]}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-800">
                          {formatPrice(prop.price, prop.currency)}
                        </TableCell>
                        <TableCell>{getStatusBadge(prop.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-0.5">
                            <Button variant="ghost" size="icon" className="h-9 w-9 min-h-[44px] min-w-[44px]" onClick={() => router.push(`/propiedades/${prop.id}`)} title="Ver" aria-label="Ver propiedad">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-9 w-9 min-h-[44px] min-w-[44px]" onClick={() => router.push(`/admin/propiedades/${prop.id}`)} title="Editar" aria-label="Editar propiedad">
                              <Pencil className="h-4 w-4 text-amber-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 min-h-[44px] min-w-[44px]"
                              onClick={async () => {
                                const newId = await duplicateProperty(prop.id)
                                if (newId) router.push(`/admin/propiedades/${newId}`)
                              }}
                              title="Duplicar"
                              aria-label="Duplicar propiedad"
                            >
                              <Copy className="h-4 w-4 text-emerald-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 min-h-[44px] min-w-[44px]"
                              onClick={() => handleDeleteClick(prop.id)}
                              disabled={deletingId === prop.id}
                              title="Eliminar"
                              aria-label="Eliminar propiedad"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                </div>
              </Card>
            ) : paginatedItems.length === 0 ? (
              <Card className="bg-white text-center py-16">
                <CardContent>
                  <Home className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">No hay propiedades</p>
                  <p className="text-sm text-slate-500 mb-6">
                    {hasActiveFilters ? 'No se encontraron propiedades con los filtros aplicados' : 'Comienza agregando tu primera propiedad'}
                  </p>
                  <Button onClick={() => router.push('/admin/propiedades/nueva?clear=true')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar propiedad
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'flex flex-col gap-4'
              )}>
                {paginatedItems.map(prop => (
                  <Card key={prop.id} className="overflow-hidden bg-white hover:shadow-lg transition-shadow group">
                    <div className="relative">
                      <Checkbox
                        checked={selectedIds.has(prop.id)}
                        onCheckedChange={() => toggleSelection(prop.id)}
                        className="absolute top-3 left-3 z-10 bg-white border-white"
                      />
                      <div className="relative h-44 w-full bg-slate-100">
                        {prop.images && prop.images.length > 0 ? (
                          <Image
                            src={prop.images[0]}
                            alt={prop.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Home className="h-12 w-12 text-slate-300" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {prop.featured && (
                            <Badge className="bg-amber-500 text-white gap-1">
                              <Star className="h-3 w-3" />
                              Destacada
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm capitalize text-xs">
                            {prop.operation}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-800 line-clamp-1 text-sm">{prop.title}</h3>
                        <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded text-white', typeColors[prop.type])}>
                          {typeIcons[prop.type]}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mb-2 line-clamp-1">{prop.location}</p>

                      <p className="text-lg font-bold text-slate-800 mb-2">
                        {formatPrice(prop.price, prop.currency)}
                      </p>

                      <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-600 mb-3">
                        {prop.bedrooms !== undefined && prop.bedrooms > 0 && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">{prop.bedrooms} hab</span>
                        )}
                        {prop.bathrooms !== undefined && prop.bathrooms > 0 && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">{prop.bathrooms} ban</span>
                        )}
                        {prop.area !== undefined && prop.area > 0 && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded">{prop.area}m2</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        {getStatusBadge(prop.status)}
                      </div>

                      <div className="flex gap-1.5 pt-3 border-t border-slate-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => router.push(`/propiedades/${prop.id}`)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-8 text-xs"
                          onClick={() => router.push(`/admin/propiedades/${prop.id}`)}
                        >
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={async () => {
                            const newId = await duplicateProperty(prop.id)
                            if (newId) router.push(`/admin/propiedades/${newId}`)
                          }}
                          title="Duplicar"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteClick(prop.id)}
                          disabled={deletingId === prop.id}
                          title="Eliminar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      />

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  )
}
