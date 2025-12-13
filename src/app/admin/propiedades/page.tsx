'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import { usePropertyFilters } from '@/hooks/usePropertyFilters'
import { useBulkActions } from '@/hooks/useBulkActions'
import type { Property } from '@/data/properties'
import Modal from '@/components/Modal'
import PropertyFilters from '@/components/admin/PropertyFilters'
import PropertyViewToggle from '@/components/admin/PropertyViewToggle'
import BulkActions from '@/components/admin/BulkActions'
import ExportButton from '@/components/admin/ExportButton'
import Pagination from '@/components/admin/Pagination'
import { exportToCSV } from '@/lib/export'
import styles from './page.module.css'

type ViewMode = 'grid' | 'table' | 'list'

export default function AdminPropertiesPage() {
  const router = useRouter()
  const { properties, isLoading, deleteProperty, updateProperty, duplicateProperty, useSupabase, refreshProperties } = useProperties()
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

  // Estados del modal
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
  const stats = {
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
  }

  // Ordenar propiedades filtradas
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties]
    
    sorted.sort((a, b) => {
      let aValue: any
      let bValue: any
      
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

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      casa: '🏠',
      departamento: '🏢',
      terreno: '🌳',
      local: '🏪',
      oficina: '💼',
      cochera: '🚗'
    }
    return icons[type] || '🏠'
  }

  if (isLoading) {
    return <div className={styles.loading}>Cargando propiedades...</div>
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1>Dashboard de Propiedades</h1>
          <p>Vista general y gestión de propiedades</p>
          <p style={{ fontSize: '0.85rem', color: '#999', marginTop: '0.5rem' }}>
            📊 Fuente de datos: {useSupabase ? '☁️ Supabase' : '💾 localStorage'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className={styles.addButton}
            onClick={() => router.push('/admin/propiedades/nueva')}
          >
            ➕ Nueva Propiedad
          </button>
        </div>
      </div>

      {/* Cards de Estadísticas */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e3f2fd' }}>
            <span style={{ fontSize: '2rem' }}>🏘️</span>
          </div>
          <div className={styles.statContent}>
            <h3>Total Propiedades</h3>
            <p className={styles.statNumber}>{stats.total}</p>
            <span className={styles.statLabel}>En el sistema</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e8f5e9' }}>
            <span style={{ fontSize: '2rem' }}>✅</span>
          </div>
          <div className={styles.statContent}>
            <h3>Disponibles</h3>
            <p className={styles.statNumber}>{stats.disponibles}</p>
            <span className={styles.statLabel}>Listas para la venta/alquiler</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fff3e0' }}>
            <span style={{ fontSize: '2rem' }}>⏳</span>
          </div>
          <div className={styles.statContent}>
            <h3>Reservadas</h3>
            <p className={styles.statNumber}>{stats.reservadas}</p>
            <span className={styles.statLabel}>En proceso de cierre</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#fce4ec' }}>
            <span style={{ fontSize: '2rem' }}>❌</span>
          </div>
          <div className={styles.statContent}>
            <h3>Vendidas</h3>
            <p className={styles.statNumber}>{stats.vendidas}</p>
            <span className={styles.statLabel}>Operaciones cerradas</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#f3e5f5' }}>
            <span style={{ fontSize: '2rem' }}>⭐</span>
          </div>
          <div className={styles.statContent}>
            <h3>Destacadas</h3>
            <p className={styles.statNumber}>{stats.destacadas}</p>
            <span className={styles.statLabel}>En portada del sitio</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#e0f2f1' }}>
            <span style={{ fontSize: '2rem' }}>💰</span>
          </div>
          <div className={styles.statContent}>
            <h3>En Venta</h3>
            <p className={styles.statNumber}>{stats.porOperacion.venta}</p>
            <span className={styles.statLabel}>Propiedades en venta</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#ede7f6' }}>
            <span style={{ fontSize: '2rem' }}>🔑</span>
          </div>
          <div className={styles.statContent}>
            <h3>En Alquiler</h3>
            <p className={styles.statNumber}>{stats.porOperacion.alquiler}</p>
            <span className={styles.statLabel}>Propiedades en alquiler</span>
          </div>
        </div>
      </div>

      {/* Distribución por Tipo */}
      <div className={styles.chartSection}>
        <h2>Distribución por Tipo</h2>
        <div className={styles.chartGrid}>
          <div className={styles.chartItem}>
            <span className={styles.chartIcon}>🏠</span>
            <div className={styles.chartInfo}>
              <span className={styles.chartLabel}>Casas</span>
              <span className={styles.chartValue}>{stats.porTipo.casa}</span>
            </div>
            <div className={styles.chartBar}>
              <div
                className={styles.chartProgress}
                style={{ width: `${(stats.porTipo.casa / stats.total) * 100}%`, background: '#2196F3' }}
              />
            </div>
          </div>

          <div className={styles.chartItem}>
            <span className={styles.chartIcon}>🏢</span>
            <div className={styles.chartInfo}>
              <span className={styles.chartLabel}>Departamentos</span>
              <span className={styles.chartValue}>{stats.porTipo.departamento}</span>
            </div>
            <div className={styles.chartBar}>
              <div
                className={styles.chartProgress}
                style={{ width: `${(stats.porTipo.departamento / stats.total) * 100}%`, background: '#4CAF50' }}
              />
            </div>
          </div>

          <div className={styles.chartItem}>
            <span className={styles.chartIcon}>🌳</span>
            <div className={styles.chartInfo}>
              <span className={styles.chartLabel}>Terrenos</span>
              <span className={styles.chartValue}>{stats.porTipo.terreno}</span>
            </div>
            <div className={styles.chartBar}>
              <div
                className={styles.chartProgress}
                style={{ width: `${(stats.porTipo.terreno / stats.total) * 100}%`, background: '#FF9800' }}
              />
            </div>
          </div>

          <div className={styles.chartItem}>
            <span className={styles.chartIcon}>🏪</span>
            <div className={styles.chartInfo}>
              <span className={styles.chartLabel}>Locales</span>
              <span className={styles.chartValue}>{stats.porTipo.local}</span>
            </div>
            <div className={styles.chartBar}>
              <div
                className={styles.chartProgress}
                style={{ width: `${(stats.porTipo.local / stats.total) * 100}%`, background: '#E91E63' }}
              />
            </div>
          </div>

          <div className={styles.chartItem}>
            <span className={styles.chartIcon}>💼</span>
            <div className={styles.chartInfo}>
              <span className={styles.chartLabel}>Oficinas</span>
              <span className={styles.chartValue}>{stats.porTipo.oficina}</span>
            </div>
            <div className={styles.chartBar}>
              <div
                className={styles.chartProgress}
                style={{ width: `${(stats.porTipo.oficina / stats.total) * 100}%`, background: '#9C27B0' }}
              />
            </div>
          </div>

          <div className={styles.chartItem}>
            <span className={styles.chartIcon}>🚗</span>
            <div className={styles.chartInfo}>
              <span className={styles.chartLabel}>Cocheras</span>
              <span className={styles.chartValue}>{stats.porTipo.cochera}</span>
            </div>
            <div className={styles.chartBar}>
              <div
                className={styles.chartProgress}
                style={{ width: `${(stats.porTipo.cochera / stats.total) * 100}%`, background: '#607D8B' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros Avanzados */}
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

      {/* Controles de Vista y Ordenamiento */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <PropertyViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
        <ExportButton properties={sortedProperties} />
      </div>

      {/* Lista de Propiedades */}
      <div className={styles.filtersSection}>
        <div className={styles.filtersHeader}>
          <h2>Lista de Propiedades</h2>
          <span className={styles.resultsCount}>
            {sortedProperties.length} {sortedProperties.length === 1 ? 'propiedad' : 'propiedades'}
            {hasActiveFilters && ` (de ${properties.length} total)`}
          </span>
        </div>
      </div>

      {/* Lista de propiedades con paginación */}
      <Pagination
        items={sortedProperties}
        itemsPerPage={25}
        render={(paginatedItems) => (
          <>
            {viewMode === 'table' ? (
              <table className={styles.propertiesTable}>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={selectedIds.size === paginatedItems.length && paginatedItems.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            paginatedItems.forEach(p => toggleSelection(p.id))
                          } else {
                            paginatedItems.forEach(p => {
                              if (selectedIds.has(p.id)) {
                                toggleSelection(p.id)
                              }
                            })
                          }
                        }}
                      />
                    </th>
                    <th>Imagen</th>
                    <th>Título</th>
                    <th>Ubicación</th>
                    <th>Tipo</th>
                    <th>Operación</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map(prop => (
                    <tr key={prop.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(prop.id)}
                          onChange={() => toggleSelection(prop.id)}
                        />
                      </td>
                      <td>
                        {prop.images && prop.images.length > 0 ? (
                          <Image
                            src={prop.images[0]}
                            alt={prop.title}
                            width={60}
                            height={60}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{ width: 60, height: 60, background: '#e0e0e0', borderRadius: '4px' }} />
                        )}
                      </td>
                      <td>{prop.title}</td>
                      <td>{prop.location}</td>
                      <td>{getTypeIcon(prop.type)} {prop.type}</td>
                      <td>{prop.operation === 'venta' ? '💰 Venta' : '🔑 Alquiler'}</td>
                      <td>{formatPrice(prop.price, prop.currency)}</td>
                      <td>
                        <span className={styles.statusBadge}>
                          {prop.status === 'disponible' && '✅ Disponible'}
                          {prop.status === 'reservado' && '⏳ Reservado'}
                          {prop.status === 'vendido' && '❌ Vendido'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => router.push(`/propiedades/${prop.id}`)}
                            className={styles.viewButton}
                            title="Ver"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => router.push(`/admin/propiedades/${prop.id}`)}
                            className={styles.editButton}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={async () => {
                              const newId = await duplicateProperty(prop.id)
                              if (newId) {
                                router.push(`/admin/propiedades/${newId}`)
                              }
                            }}
                            className={styles.duplicateButton}
                            title="Duplicar"
                          >
                            📋
                          </button>
                          <button
                            onClick={() => handleDeleteClick(prop.id)}
                            disabled={deletingId === prop.id}
                            className={styles.deleteButton}
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : paginatedItems.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No hay propiedades que mostrar</p>
                <button
                  onClick={() => router.push('/admin/propiedades/nueva')}
                  className={styles.addButton}
                >
                  Agregar primera propiedad
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? styles.propertiesGrid : styles.propertiesList}>
                {paginatedItems.map(prop => (
                  <div key={prop.id} className={styles.propertyCard}>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(prop.id)}
                        onChange={() => toggleSelection(prop.id)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          left: '0.5rem',
                          zIndex: 10,
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                        }}
                      />
                      <div className={styles.propertyImage}>
                        {prop.images && prop.images.length > 0 ? (
                          <Image
                            src={prop.images[0]}
                            alt={prop.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 350px"
                            className={styles.propertyImageContent}
                          />
                        ) : (
                          <div className={styles.noImage}>Sin imagen</div>
                        )}
                        {prop.featured && (
                          <span className={styles.featuredBadge}>⭐ Destacada</span>
                        )}
                      </div>
                    </div>

                    <div className={styles.propertyInfo}>
                      <h3>{prop.title}</h3>
                      <p className={styles.location}>{prop.location}</p>
                      
                      <div className={styles.propertyMeta}>
                        <span>{getTypeIcon(prop.type)} {prop.type}</span>
                        <span className={styles.operation}>
                          {prop.operation === 'venta' ? '💰 Venta' : '🔑 Alquiler'}
                        </span>
                      </div>

                      <p className={styles.price}>{formatPrice(prop.price, prop.currency)}</p>

                      <div className={styles.propertyDetails}>
                        {prop.bedrooms && <span>🛏️ {prop.bedrooms}</span>}
                        {prop.bathrooms && <span>🚿 {prop.bathrooms}</span>}
                        {prop.area && <span>📐 {prop.area}m²</span>}
                        {prop.parking && <span>🚗 {prop.parking}</span>}
                      </div>

                      <div className={styles.status}>
                        <span className={styles.statusBadge}>
                          {prop.status === 'disponible' && '✅ Disponible'}
                          {prop.status === 'reservado' && '⏳ Reservado'}
                          {prop.status === 'vendido' && '❌ Vendido'}
                        </span>
                      </div>

                      <div className={styles.actions}>
                        <button
                          onClick={() => router.push(`/propiedades/${prop.id}`)}
                          className={styles.viewButton}
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => router.push(`/admin/propiedades/${prop.id}`)}
                          className={styles.editButton}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={async () => {
                            const newId = await duplicateProperty(prop.id)
                            if (newId) {
                              router.push(`/admin/propiedades/${newId}`)
                            }
                          }}
                          className={styles.duplicateButton}
                          title="Duplicar"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDeleteClick(prop.id)}
                          disabled={deletingId === prop.id}
                          className={styles.deleteButton}
                        >
                          {deletingId === prop.id ? '🗑️ Eliminando...' : '🗑️ Eliminar'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      />

      {/* Footer */}
      <div className={styles.footer}>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          ← Volver al sitio
        </button>
      </div>

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
