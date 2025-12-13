'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAuditLogs, type AuditLog } from '@/lib/audit'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import styles from './ChangeHistory.module.css'

interface ChangeHistoryProps {
  entityType: 'property_inquiry' | 'contact_inquiry'
  entityId: string
}

export default function ChangeHistory({ entityType, entityId }: ChangeHistoryProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const auditLogs = await getAuditLogs(entityType, entityId)
      setLogs(auditLogs)
    } catch (err) {
      console.error('Error al cargar historial:', err)
    } finally {
      setIsLoading(false)
    }
  }, [entityType, entityId])

  useEffect(() => {
    void loadHistory()
  }, [loadHistory])

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

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
    } catch {
      return dateString
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando historial...</p>
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Historial de Cambios</h3>
        <div className={styles.empty}>
          <p>No hay cambios registrados</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Historial de Cambios</h3>
      <div className={styles.logsList}>
        {logs.map((log) => (
          <div key={log.id} className={styles.logItem}>
            <div className={styles.logHeader}>
              <span className={styles.actionIcon}>{getActionIcon(log.action_type)}</span>
              <span className={styles.actionLabel}>{getActionLabel(log.action_type)}</span>
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
    </div>
  )
}
