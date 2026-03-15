'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  User,
  RefreshCw,
  Tag,
  FileText,
  History
} from 'lucide-react'
import { getAuditLogs, type AuditLog } from '@/lib/audit'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
      // silently ignore
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
      assign: 'Asignacion',
      status_change: 'Cambio de estado',
      tag_add: 'Etiqueta agregada',
      tag_remove: 'Etiqueta removida'
    }
    return labels[actionType] || actionType
  }

  const getActionIcon = (actionType: string) => {
    const iconClass = "h-5 w-5"
    const icons: Record<string, React.ReactNode> = {
      create: <Plus className={iconClass} />,
      update: <Pencil className={iconClass} />,
      delete: <Trash2 className={iconClass} />,
      assign: <User className={iconClass} />,
      status_change: <RefreshCw className={iconClass} />,
      tag_add: <Tag className={iconClass} />,
      tag_remove: <Tag className={iconClass} />
    }
    return icons[actionType] || <FileText className={iconClass} />
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
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
          <p>Cargando historial...</p>
        </div>
      </div>
    )
  }

  if (logs.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <History className="h-5 w-5" />
          Historial de Cambios
        </h3>
        <div className="p-8 text-center text-muted-foreground italic">
          <p>No hay cambios registrados</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <History className="h-5 w-5" />
        Historial de Cambios
      </h3>
      <div className="flex flex-col gap-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="p-4 bg-muted/50 border border-border rounded-lg border-l-4 border-l-primary"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-primary">{getActionIcon(log.action_type)}</span>
              <span className="font-semibold text-foreground flex-1">{getActionLabel(log.action_type)}</span>
              <span className="text-sm text-muted-foreground">{formatDate(log.created_at)}</span>
            </div>

            {log.user_email && (
              <div className="text-sm text-muted-foreground mb-2">
                Por: <strong>{log.user_email}</strong>
              </div>
            )}

            {log.description && (
              <div className="text-sm text-muted-foreground mb-2 p-2 bg-background rounded">
                {log.description}
              </div>
            )}

            {log.old_values && log.new_values && (
              <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-border">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Antes:
                  </span>
                  <pre className="text-xs p-2 bg-background border border-border rounded overflow-x-auto text-foreground font-mono">
                    {JSON.stringify(log.old_values, null, 2)}
                  </pre>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Despues:
                  </span>
                  <pre className="text-xs p-2 bg-background border border-border rounded overflow-x-auto text-foreground font-mono">
                    {JSON.stringify(log.new_values, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
