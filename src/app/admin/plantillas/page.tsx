'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import Pagination from '@/components/admin/Pagination'
import { useAuth } from '@/hooks/useAuth'
import styles from './page.module.css'

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
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando plantillas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Plantillas de Propiedades</h1>
          <p className={styles.subtitle}>Crea y gestiona plantillas para acelerar la creación de propiedades</p>
        </div>
        <div className={styles.headerActions}>
          <button
            onClick={handleCreateFromProperty}
            className={styles.createFromPropertyButton}
          >
            Crear desde Propiedad
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className={styles.createButton}
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
              <div className={styles.empty}>
                <p className={styles.emptyIcon}>📄</p>
                <p className={styles.emptyText}>No hay plantillas creadas</p>
                <p className={styles.emptySubtext}>
                  Crea plantillas desde propiedades existentes para reutilizar información común
                </p>
              </div>
            ) : (
              <div className={styles.templatesGrid}>
                {paginatedItems.map((template) => (
                  <div key={template.id} className={styles.templateCard}>
                    <div className={styles.templateHeader}>
                      <h3 className={styles.templateName}>{template.name}</h3>
                      <span className={`${styles.statusBadge} ${template.is_active ? styles.statusActive : styles.statusInactive}`}>
                        {template.is_active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                    
                    {template.description && (
                      <p className={styles.templateDescription}>{template.description}</p>
                    )}

                    <div className={styles.templateMeta}>
                      <span className={styles.categoryBadge}>
                        {getCategoryLabel(template.category)}
                      </span>
                      <span className={styles.usageCount}>
                        Usada {template.usage_count} veces
                      </span>
                    </div>

                    <div className={styles.templateActions}>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className={styles.useButton}
                        disabled={!template.is_active}
                      >
                        Usar Plantilla
                      </button>
                      <button
                        onClick={() => handleToggleActive(template)}
                        className={styles.toggleButton}
                      >
                        {template.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template)}
                        className={styles.deleteButton}
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
          <div className={styles.modalContent}>
            <p className={styles.modalInfo}>
              Para crear una plantilla completa, primero crea o edita una propiedad y luego
              guárdala como plantilla desde allí.
            </p>
            <div className={styles.modalActions}>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  router.push('/admin/propiedades/nueva')
                }}
                className={styles.createPropertyButton}
              >
                Ir a Crear Propiedad
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className={styles.cancelButton}
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
