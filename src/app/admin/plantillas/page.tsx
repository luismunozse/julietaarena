'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import Pagination from '@/components/admin/Pagination'
import { useAuth } from '@/hooks/useAuth'


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

export default function PlantillasPage() {
  const [templates, setTemplates] = useState<PropertyTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<PropertyTemplate | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'casa' as string
  })
  const { success, error: showError } = useToast()
  const router = useRouter()
  const { user } = useAuth()

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
    // Esta función debería ser llamada desde la página de propiedades
    // con los datos de una propiedad existente
    router.push('/admin/propiedades')
  }

  const handleUseTemplate = async (template: PropertyTemplate) => {
    try {
      // Incrementar contador de uso
      await supabase
        .from('property_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', template.id)

      // Redirigir a crear propiedad con los datos de la plantilla
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
    const labels: Record<string, string> = {
      casa: 'Casa',
      departamento: 'Departamento',
      terreno: 'Terreno',
      local: 'Local',
      oficina: 'Oficina'
    }
    return labels[category || ''] || category || 'Sin categoría'
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando plantillas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="title">Plantillas de Propiedades</h1>
          <p className="subtitle">Crea y gestiona plantillas para acelerar la creación de propiedades</p>
        </div>
        <div className="headerActions">
          <button
            onClick={handleCreateFromProperty}
            className="createFromPropertyButton"
          >
            Crear desde Propiedad
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="createButton"
          >
            + Nueva Plantilla
          </button>
        </div>
      </div>

      <Pagination
        items={templates}
        itemsPerPage={20}
        render={(paginatedItems) => (
          <>
            {paginatedItems.length === 0 ? (
              <div className="empty">
                <p className="emptyIcon">📄</p>
                <p className="emptyText">No hay plantillas creadas</p>
                <p className="emptySubtext">
                  Crea plantillas desde propiedades existentes para reutilizar información común
                </p>
              </div>
            ) : (
              <div className="templatesGrid">
                {paginatedItems.map((template) => (
                  <div key={template.id} className="templateCard">
                    <div className="templateHeader">
                      <h3 className="templateName">{template.name}</h3>
                      <span className={`statusBadge ${template.is_active ? 'statusActive' : 'statusInactive'}`}>
                        {template.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    
                    {template.description && (
                      <p className="templateDescription">{template.description}</p>
                    )}

                    <div className="templateMeta">
                      <span className="categoryBadge">
                        {getCategoryLabel(template.category)}
                      </span>
                      <span className="usageCount">
                        Usada {template.usage_count} veces
                      </span>
                    </div>

                    <div className="templateActions">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="useButton"
                        disabled={!template.is_active}
                      >
                        Usar Plantilla
                      </button>
                      <button
                        onClick={() => handleToggleActive(template)}
                        className="toggleButton"
                      >
                        {template.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template)}
                        className="deleteButton"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      />

      {/* Modal crear plantilla */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nueva Plantilla"
          type="alert"
          message=""
        >
          <div className="modalContent">
            <p className="modalInfo">
              Para crear una plantilla completa, primero crea o edita una propiedad y luego
              guárdala como plantilla desde allí.
            </p>
            <div className="modalActions">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  router.push('/admin/propiedades/nueva')
                }}
                className="createPropertyButton"
              >
                Ir a Crear Propiedad
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="cancelButton"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

