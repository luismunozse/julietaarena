'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAllAuditLogs, type AuditLog, type ActionType, type EntityType } from '@/lib/audit'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import Pagination from '@/components/admin/Pagination'
import styles from './page.module.css'

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<{
    action_type: string
    entity_type: string
    start_date: string
    end_date: string
  }>({
    action_type: '',
    entity_type: '',
    start_date: '',
    end_date: ''
  })

  const loadLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const auditLogs = await getAllAuditLogs({
        action_type: (filters.action_type || undefined) as ActionType | undefined,
        entity_type: (filters.entity_type || undefined) as EntityType | undefined,
        start_date: filters.start_date || undefined,
        end_date: filters.end_date || undefined,
        limit: 500
      })
      setLogs(auditLogs)
    } catch (err) {
      console.error('Error al cargar logs:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  useEffect(() => {
    void loadLogs()
  }, [loadLogs])

  const getActionLabel = (actionType: string): string => {
    const labels: Record<string, string> = {
      create: 'Creado',
      update: 'Actualizado',
      delete: 'Eliminado',
      assign: 'Asignación',
      status_change: 'Cambio de estado',
      tag_add: 'Etiqueta agregada',
      tag_remove: 'Etiqueta removida'
    }
    return labels[actionType] || actionType
  }

  const getActionIcon = (actionType: string): string => {
    const icons: Record<string, string> = {
      create: '➕',
      update: '✏️',
      delete: '🗑️',
      assign: '👤',
      status_change: '🔄',
      tag_add: '🏷️',
      tag_remove: '🏷️'
    }
    return icons[actionType] || '📝'
  }

  const getEntityLabel = (entityType: string): string => {
    const labels: Record<string, string> = {
      property: 'Propiedad',
      property_inquiry: 'Consulta de Propiedad',
      contact_inquiry: 'Contacto',
      user: 'Usuario',
      template: 'Plantilla'
    }
    return labels[entityType] || entityType
  }

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
    } catch {
      return dateString
    }
  }

  const clearFilters = () => {
    setFilters({
      action_type: '',
      entity_type: '',
      start_date: '',
      end_date: ''
    })
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Logs de Actividad</h1>
          <p className={styles.subtitle}>Registro de todas las acciones del sistema</p>
        </div>
      </div>

      {/* Filtros */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label>Tipo de acción</label>
          <select
            value={filters.action_type}
            onChange={(e) => setFilters({ ...filters, action_type: e.target.value })}
            className={styles.select}
          >
            <option value="">Todas</option>
            <option value="create">Crear</option>
            <option value="update">Actualizar</option>
            <option value="delete">Eliminar</option>
            <option value="assign">Asignar</option>
            <option value="status_change">Cambio de estado</option>
            <option value="tag_add">Agregar etiqueta</option>
            <option value="tag_remove">Remover etiqueta</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Tipo de entidad</label>
          <select
            value={filters.entity_type}
            onChange={(e) => setFilters({ ...filters, entity_type: e.target.value })}
            className={styles.select}
          >
            <option value="">Todas</option>
            <option value="property">Propiedad</option>
            <option value="property_inquiry">Consulta</option>
            <option value="contact_inquiry">Contacto</option>
            <option value="user">Usuario</option>
            <option value="template">Plantilla</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label>Fecha desde</label>
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            className={styles.input}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>Fecha hasta</label>
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            className={styles.input}
          />
        </div>

        <button onClick={clearFilters} className={styles.clearButton}>
          Limpiar filtros
        </button>
      </div>

      {/* Lista de logs */}
      <Pagination
        items={logs}
        itemsPerPage={50}
        render={(paginatedItems) => (
          <>
            {paginatedItems.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyIcon}>📋</p>
                <p className={styles.emptyText}>No hay logs con los filtros seleccionados</p>
              </div>
            ) : (
              <div className={styles.logsList}>
                {paginatedItems.map((log) => (
                  <div key={log.id} className={styles.logItem}>
                    <div className={styles.logHeader}>
                      <span className={styles.actionIcon}>{getActionIcon(log.action_type)}</span>
                      <div className={styles.logInfo}>
                        <span className={styles.actionLabel}>{getActionLabel(log.action_type)}</span>
                        <span className={styles.entityLabel}>{getEntityLabel(log.entity_type)}</span>
                      </div>
                      <span className={styles.date}>{formatDate(log.created_at)}</span>
                    </div>

                    {log.user_email && (
                      <div className={styles.logUser}>
                        Por: <strong>{log.user_email}</strong>
                      </div>
                    )}

                    {log.description && (
                      <div className={styles.logDescription}>{log.description}</div>
                    )}

                    {log.old_values && log.new_values && (
                      <div className={styles.logChanges}>
                        <div className={styles.changeItem}>
                          <span className={styles.changeLabel}>Antes:</span>
                          <pre className={styles.changeValue}>{JSON.stringify(log.old_values, null, 2)}</pre>
                        </div>
                        <div className={styles.changeItem}>
                          <span className={styles.changeLabel}>Después:</span>
                          <pre className={styles.changeValue}>{JSON.stringify(log.new_values, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      />
    </div>
  )
}
