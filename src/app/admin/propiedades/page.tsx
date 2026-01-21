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
import AdminStatCard from '@/components/admin/AdminStatCard'
import { exportToCSV } from '@/lib/export'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Eye, Pencil, Copy, Trash2, ArrowLeft } from 'lucide-react'

type ViewMode = 'grid' | 'table' | 'list'

const typeIcons: Record<string, string> = {
  casa: '🏠',
  departamento: '🏢',
  terreno: '🌳',
  local: '🏪',
  oficina: '💼',
  cochera: '🚗',
}

const typeColors: Record<string, string> = {
  casa: 'bg-blue-500',
  departamento: 'bg-green-500',
  terreno: 'bg-orange-500',
  local: 'bg-pink-500',
  oficina: 'bg-purple-500',
  cochera: 'bg-slate-500',
}

export default function AdminPropertiesPage() {
  const router = useRouter()
  const { properties, isLoading, deleteProperty, duplicateProperty, useSupabase } = useProperties()
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

  // Estadísticas
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

  // Ordenar propiedades
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
      message: '¿Estás seguro de eliminar esta propiedad? Esta acción no se puede deshacer.',
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
    const variants: Record<string, string> = {
      disponible: 'bg-green-100 text-green-800',
      reservado: 'bg-amber-100 text-amber-800',
      vendido: 'bg-red-100 text-red-800',
    }
    const labels: Record<string, string> = {
      disponible: '✅ Disponible',
      reservado: '⏳ Reservado',
      vendido: '❌ Vendido',
    }
    return (
      <Badge className={cn('font-medium', variants[status])}>
        {labels[status]}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-[#2c5f7d]">
        Cargando propiedades...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 md:p-8">
      {/* Header */}
      <Card className="mb-8 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <AdminPageHeader
              title="Dashboard de Propiedades"
              subtitle="Vista general y gestión de propiedades"
              className="mb-0"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Fuente de datos: {useSupabase ? 'Supabase' : 'localStorage'}
            </p>
          </div>
          <Button
            onClick={() => router.push('/admin/propiedades/nueva')}
            className="bg-gradient-to-r from-[#2c5f7d] to-[#7d9fb8] hover:from-[#1a4158] hover:to-[#2c5f7d]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Propiedad
          </Button>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
        <AdminStatCard
          icon={<span className="text-3xl">🏘️</span>}
          iconBgColor="bg-blue-50"
          title="Total"
          value={stats.total}
          label="En el sistema"
        />
        <AdminStatCard
          icon={<span className="text-3xl">✅</span>}
          iconBgColor="bg-green-50"
          title="Disponibles"
          value={stats.disponibles}
          label="Activas"
        />
        <AdminStatCard
          icon={<span className="text-3xl">⏳</span>}
          iconBgColor="bg-amber-50"
          title="Reservadas"
          value={stats.reservadas}
          label="En proceso"
        />
        <AdminStatCard
          icon={<span className="text-3xl">❌</span>}
          iconBgColor="bg-red-50"
          title="Vendidas"
          value={stats.vendidas}
          label="Cerradas"
        />
        <AdminStatCard
          icon={<span className="text-3xl">⭐</span>}
          iconBgColor="bg-purple-50"
          title="Destacadas"
          value={stats.destacadas}
          label="En portada"
        />
        <AdminStatCard
          icon={<span className="text-3xl">💰</span>}
          iconBgColor="bg-teal-50"
          title="En Venta"
          value={stats.porOperacion.venta}
        />
        <AdminStatCard
          icon={<span className="text-3xl">🔑</span>}
          iconBgColor="bg-indigo-50"
          title="Alquiler"
          value={stats.porOperacion.alquiler}
        />
      </div>

      {/* Distribución por Tipo */}
      <Card className="mb-8 p-6">
        <h2 className="text-xl font-bold text-[#1a4158] mb-6">Distribución por Tipo</h2>
        <div className="space-y-4">
          {Object.entries(stats.porTipo).map(([type, count]) => (
            <div key={type} className="grid grid-cols-[50px_1fr_150px] gap-4 items-center p-3 bg-slate-50 rounded-lg">
              <span className="text-2xl text-center">{typeIcons[type]}</span>
              <div>
                <span className="font-semibold text-[#1a4158] capitalize">{type}s</span>
                <span className="ml-2 text-muted-foreground">{count}</span>
              </div>
              <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all', typeColors[type])}
                  style={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

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
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <PropertyViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        <ExportButton properties={sortedProperties} />
      </div>

      {/* Header Lista */}
      <Card className="mb-4 p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#1a4158]">Lista de Propiedades</h2>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {sortedProperties.length} {sortedProperties.length === 1 ? 'propiedad' : 'propiedades'}
            {hasActiveFilters && ` (de ${properties.length} total)`}
          </Badge>
        </div>
      </Card>

      {/* Lista con paginación */}
      <Pagination
        items={sortedProperties}
        itemsPerPage={25}
        render={(paginatedItems) => (
          <>
            {viewMode === 'table' ? (
              <Card className="overflow-hidden mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                      <TableHead>Título</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Operación</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map(prop => (
                      <TableRow key={prop.id}>
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
                              width={60}
                              height={60}
                              className="object-cover rounded"
                            />
                          ) : (
                            <div className="w-[60px] h-[60px] bg-slate-200 rounded" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{prop.title}</TableCell>
                        <TableCell>{prop.location}</TableCell>
                        <TableCell>{typeIcons[prop.type]} {prop.type}</TableCell>
                        <TableCell>{prop.operation === 'venta' ? '💰 Venta' : '🔑 Alquiler'}</TableCell>
                        <TableCell className="font-semibold">{formatPrice(prop.price, prop.currency)}</TableCell>
                        <TableCell>{getStatusBadge(prop.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/propiedades/${prop.id}`)} title="Ver">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/propiedades/${prop.id}`)} title="Editar">
                              <Pencil className="h-4 w-4 text-orange-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={async () => {
                                const newId = await duplicateProperty(prop.id)
                                if (newId) router.push(`/admin/propiedades/${newId}`)
                              }}
                              title="Duplicar"
                            >
                              <Copy className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(prop.id)}
                              disabled={deletingId === prop.id}
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            ) : paginatedItems.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-lg text-muted-foreground mb-4">No hay propiedades que mostrar</p>
                <Button onClick={() => router.push('/admin/propiedades/nueva')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primera propiedad
                </Button>
              </Card>
            ) : (
              <div className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'flex flex-col gap-4',
                'mb-6'
              )}>
                {paginatedItems.map(prop => (
                  <Card key={prop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <Checkbox
                        checked={selectedIds.has(prop.id)}
                        onCheckedChange={() => toggleSelection(prop.id)}
                        className="absolute top-3 left-3 z-10 bg-white"
                      />
                      <div className="relative h-48 w-full">
                        {prop.images && prop.images.length > 0 ? (
                          <Image
                            src={prop.images[0]}
                            alt={prop.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-muted-foreground">
                            Sin imagen
                          </div>
                        )}
                        {prop.featured && (
                          <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
                            ⭐ Destacada
                          </Badge>
                        )}
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-[#2c5f7d] mb-1">{prop.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{prop.location}</p>

                      <div className="flex justify-between items-center mb-3 pb-3 border-b">
                        <span>{typeIcons[prop.type]} {prop.type}</span>
                        <span className="font-semibold text-[#2c5f7d]">
                          {prop.operation === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
                        </span>
                      </div>

                      <p className="text-xl font-bold text-[#2c5f7d] mb-3">
                        {formatPrice(prop.price, prop.currency)}
                      </p>

                      <div className="flex gap-3 text-sm text-muted-foreground mb-3 flex-wrap">
                        {prop.bedrooms && <span>🛏️ {prop.bedrooms}</span>}
                        {prop.bathrooms && <span>🚿 {prop.bathrooms}</span>}
                        {prop.area && <span>📐 {prop.area}m²</span>}
                        {prop.parking && <span>🚗 {prop.parking}</span>}
                      </div>

                      <div className="mb-4">{getStatusBadge(prop.status)}</div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => router.push(`/propiedades/${prop.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-orange-600 border-orange-200 hover:bg-orange-50"
                          onClick={() => router.push(`/admin/propiedades/${prop.id}`)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={async () => {
                            const newId = await duplicateProperty(prop.id)
                            if (newId) router.push(`/admin/propiedades/${newId}`)
                          }}
                          title="Duplicar"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeleteClick(prop.id)}
                          disabled={deletingId === prop.id}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Footer */}
      <Card className="p-4">
        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="text-[#2c5f7d] border-[#2c5f7d] hover:bg-[#2c5f7d]/5"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al sitio
        </Button>
      </Card>

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
