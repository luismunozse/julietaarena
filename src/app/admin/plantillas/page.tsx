'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import Pagination from '@/components/admin/Pagination'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Power, Trash2, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PropertyTemplate {
  id: string
  name: string
  description: string | null
  category: string | null
  template_data: Record<string, unknown>
  usage_count: number
  is_active: boolean
  created_at: string
}

const categoryLabels: Record<string, string> = {
  casa: 'Casa',
  departamento: 'Departamento',
  terreno: 'Terreno',
  local: 'Local',
  oficina: 'Oficina'
}

export default function PlantillasPage() {
  const [templates, setTemplates] = useState<PropertyTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { success, error: showError } = useToast()
  const router = useRouter()

  const loadTemplates = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('property_templates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar plantillas:', error)
        showError('Error al cargar las plantillas')
        return
      }

      setTemplates(data || [])
    } catch (err) {
      console.error('Error:', err)
      showError('Error al cargar las plantillas')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  useEffect(() => {
    void loadTemplates()
  }, [loadTemplates])

  const handleCreateFromProperty = async () => {
    router.push('/admin/propiedades')
  }

  const handleUseTemplate = async (template: PropertyTemplate) => {
    try {
      await supabase
        .from('property_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', template.id)

      const templateData = JSON.stringify(template.template_data)
      router.push(`/admin/propiedades/nueva?template=${encodeURIComponent(templateData)}`)
    } catch (err) {
      console.error('Error al usar plantilla:', err)
      showError('Error al usar la plantilla')
    }
  }

  const handleDeleteTemplate = async (template: PropertyTemplate) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar la plantilla "${template.name}"?`)) return

    try {
      const { error } = await supabase
        .from('property_templates')
        .delete()
        .eq('id', template.id)

      if (error) {
        console.error('Error al eliminar plantilla:', error)
        showError('Error al eliminar la plantilla')
        return
      }

      success('Plantilla eliminada correctamente')
      loadTemplates()
    } catch (err) {
      console.error('Error:', err)
      showError('Error al eliminar la plantilla')
    }
  }

  const handleToggleActive = async (template: PropertyTemplate) => {
    try {
      const { error } = await supabase
        .from('property_templates')
        .update({ is_active: !template.is_active })
        .eq('id', template.id)

      if (error) {
        console.error('Error al actualizar estado:', error)
        showError('Error al actualizar el estado')
        return
      }

      success(`Plantilla ${!template.is_active ? 'activada' : 'desactivada'} correctamente`)
      loadTemplates()
    } catch (err) {
      console.error('Error:', err)
      showError('Error al actualizar el estado')
    }
  }

  const getCategoryLabel = (category: string | null): string => {
    return categoryLabels[category || ''] || category || 'Sin categoría'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">Cargando plantillas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Plantillas de Propiedades"
        subtitle="Crea y gestiona plantillas para acelerar la creación de propiedades"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCreateFromProperty}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Crear desde Propiedad
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>
        }
      />

      <Pagination
        items={templates}
        itemsPerPage={20}
        render={(paginatedItems) => (
          <>
            {paginatedItems.length === 0 ? (
              <Card className="text-center py-12 bg-white">
                <CardContent>
                  <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-1">No hay plantillas creadas</p>
                  <p className="text-sm text-slate-500">
                    Crea plantillas desde propiedades existentes para reutilizar información común
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedItems.map((template) => (
                  <Card key={template.id} className="bg-white">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-800">{template.name}</h3>
                        <Badge className={cn(
                          'text-xs',
                          template.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-slate-100 text-slate-600'
                        )}>
                          {template.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>

                      {template.description && (
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {template.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(template.category)}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          Usada {template.usage_count} veces
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUseTemplate(template)}
                          disabled={!template.is_active}
                          className="flex-1"
                        >
                          Usar Plantilla
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(template)}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteTemplate(template)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
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

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nueva Plantilla"
          type="alert"
          message=""
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Para crear una plantilla completa, primero crea o edita una propiedad y luego
              guárdala como plantilla desde allí.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setShowCreateModal(false)
                  router.push('/admin/propiedades/nueva')
                }}
                className="flex-1"
              >
                Ir a Crear Propiedad
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
