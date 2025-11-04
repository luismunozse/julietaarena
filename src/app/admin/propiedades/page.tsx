'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import { useAuth } from '@/hooks/useAuth'
import type { Property } from '@/data/properties'
import styles from './page.module.css'

export default function AdminPropertiesPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { properties, isLoading, deleteProperty } = useProperties()
  const [filterType, setFilterType] = useState<string>('all')
  const [filterOperation, setFilterOperation] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Protección de ruta
  if (authLoading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  if (!isAuthenticated) {
    router.push('/login?redirect=/admin/propiedades')
    return null
  }

  // Filtros
  const filteredProperties = properties.filter(prop => {
    if (filterType !== 'all' && prop.type !== filterType) return false
    if (filterOperation !== 'all' && prop.operation !== filterOperation) return false
    return true
  })

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return
    
    setDeletingId(id)
    const success = deleteProperty(id)
    
    if (success) {
      setTimeout(() => setDeletingId(null), 500)
    } else {
      alert('Error al eliminar la propiedad')
      setDeletingId(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
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
      oficina: '💼'
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
          <h1>Panel de Administración</h1>
          <p>Gestiona tus propiedades</p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => router.push('/admin/propiedades/nueva')}
        >
          ➕ Agregar Propiedad
        </button>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todos los tipos</option>
          <option value="casa">Casas</option>
          <option value="departamento">Departamentos</option>
          <option value="terreno">Terrenos</option>
          <option value="local">Locales</option>
          <option value="oficina">Oficinas</option>
        </select>

        <select
          value={filterOperation}
          onChange={(e) => setFilterOperation(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todas las operaciones</option>
          <option value="venta">Venta</option>
          <option value="alquiler">Alquiler</option>
        </select>
      </div>

      {/* Contador */}
      <div className={styles.stats}>
        <span>
          {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad' : 'propiedades'}
        </span>
      </div>

      {/* Lista de propiedades */}
      <div className={styles.propertiesGrid}>
        {filteredProperties.length === 0 ? (
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
          filteredProperties.map(prop => (
            <div key={prop.id} className={styles.propertyCard}>
              <div className={styles.propertyImage}>
                {prop.images && prop.images.length > 0 ? (
                  <img src={prop.images[0]} alt={prop.title} />
                ) : (
                  <div className={styles.noImage}>Sin imagen</div>
                )}
                {prop.featured && (
                  <span className={styles.featuredBadge}>⭐ Destacada</span>
                )}
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

                <p className={styles.price}>{formatPrice(prop.price)}</p>

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
                    onClick={() => handleDelete(prop.id)}
                    disabled={deletingId === prop.id}
                    className={styles.deleteButton}
                  >
                    {deletingId === prop.id ? '🗑️ Eliminando...' : '🗑️ Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <button
          onClick={() => router.push('/')}
          className={styles.backButton}
        >
          ← Volver al sitio
        </button>
      </div>
    </div>
  )
}

