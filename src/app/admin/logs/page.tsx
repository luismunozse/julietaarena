'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAllAuditLogs, type AuditLog, type ActionType, type EntityType } from '@/lib/audit'
import { format } from 'date-fns'
import { es } from 'date-fns/locale/es'
import Pagination from '@/components/admin/Pagination'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

const actionLabels: Record<string, string> = {
  create: 'Creado',
  update: 'Actualizado',
  delete: 'Eliminado',
  assign: 'Asignación',
  status_change: 'Cambio de estado',
  tag_add: 'Etiqueta agregada',
  tag_remove: 'Etiqueta removida'
}

const actionIcons: Record<string, string> = {
  create: '➕',
  update: '✏️',
  delete: '🗑️',
  assign: '👤',
  status_change: '🔄',
  tag_add: '🏷️',
  tag_remove: '🏷️'
}

const entityLabels: Record<string, string> = {
  property: 'Propiedad',
  property_inquiry: 'Consulta de Propiedad',
  contact_inquiry: 'Contacto',
  user: 'Usuario',
  template: 'Plantilla'
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
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

  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })
    } catch {
      return dateString
    }
  }

  const clearFilters = () => {
    setFilters({ action_type: '', entity_type: '', start_date: '', end_date: '' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Logs de Actividad"
        subtitle="Registro de todas las acciones del sistema"
      />

      {/* Filtros */}
      <Card className="mb-6 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label>Tipo de acción</Label>
            <Select
              value={filters.action_type}
              onValueChange={(value) => setFilters({ ...filters, action_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="create">Crear</SelectItem>
                <SelectItem value="update">Actualizar</SelectItem>
                <SelectItem value="delete">Eliminar</SelectItem>
                <SelectItem value="assign">Asignar</SelectItem>
                <SelectItem value="status_change">Cambio de estado</SelectItem>
                <SelectItem value="tag_add">Agregar etiqueta</SelectItem>
                <SelectItem value="tag_remove">Remover etiqueta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de entidad</Label>
            <Select
              value={filters.entity_type}
              onValueChange={(value) => setFilters({ ...filters, entity_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="property">Propiedad</SelectItem>
                <SelectItem value="property_inquiry">Consulta</SelectItem>
                <SelectItem value="contact_inquiry">Contacto</SelectItem>
                <SelectItem value="user">Usuario</SelectItem>
                <SelectItem value="template">Plantilla</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fecha desde</Label>
            <Input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha hasta</Label>
            <Input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
            />
          </div>

          <Button variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      </Card>

      {/* Lista de logs */}
      <Pagination
        items={logs}
        itemsPerPage={50}
        render={(paginatedItems) => (
          <>
            {paginatedItems.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-4xl mb-4">📋</p>
                <p className="text-muted-foreground">No hay logs con los filtros seleccionados</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {paginatedItems.map((log) => (
                  <Card key={log.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{actionIcons[log.action_type] || '📝'}</span>
                          <div>
                            <span className="font-semibold text-slate-900">{actionLabels[log.action_type] || log.action_type}</span>
                            <span className="text-muted-foreground mx-2">·</span>
                            <span className="text-muted-foreground">{entityLabels[log.entity_type] || log.entity_type}</span>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{formatDate(log.created_at)}</span>
                      </div>

                      {log.user_email && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Por: <strong>{log.user_email}</strong>
                        </p>
                      )}

                      {log.description && (
                        <p className="text-sm mb-2">{log.description}</p>
                      )}

                      {log.old_values && log.new_values && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Antes:</p>
                            <pre className="text-xs bg-red-50 p-2 rounded overflow-auto max-h-32">{JSON.stringify(log.old_values, null, 2)}</pre>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1">Después:</p>
                            <pre className="text-xs bg-green-50 p-2 rounded overflow-auto max-h-32">{JSON.stringify(log.new_values, null, 2)}</pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      />
    </div>
  )
}
