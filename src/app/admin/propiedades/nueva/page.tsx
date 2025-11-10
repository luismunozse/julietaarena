'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProperties } from '@/hooks/useProperties'
import type { Property } from '@/data/properties'
import PropertyForm from '@/components/PropertyForm'
import Modal from '@/components/Modal'
import styles from './page.module.css'

export default function NewPropertyPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { createProperty } = useProperties()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados del modal
  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'alert' | 'success' | 'error'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'alert',
    title: '',
    message: ''
  })

  // Protección de ruta
  if (authLoading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  if (!isAuthenticated) {
    router.push('/login?redirect=/admin/propiedades/nueva')
    return null
  }

  const handleSubmit = async (formData: Partial<Property>) => {
    try {
      setIsSubmitting(true)

      // Validar datos requeridos
      if (!formData.title || !formData.description || !formData.price || !formData.location) {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Campos Incompletos',
          message: 'Por favor completa todos los campos requeridos antes de continuar.'
        })
        setIsSubmitting(false)
        return
      }

      // Crear propiedad
      const success = await createProperty(formData as any)

      if (success) {
        // Limpiar borrador guardado
        if (typeof (window as any).__clearPropertyDraft === 'function') {
          (window as any).__clearPropertyDraft()
        }

        setModal({
          isOpen: true,
          type: 'success',
          title: 'Propiedad Creada',
          message: 'La propiedad se ha creado exitosamente. Redirigiendo...'
        })
        setTimeout(() => {
          router.push('/admin/propiedades')
        }, 1500)
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Error al Crear',
          message: 'No se pudo crear la propiedad. Por favor revisa la consola para más detalles.'
        })
      }
    } catch (error) {
      console.error('❌ Error capturado en handleSubmit:', error)
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error Inesperado',
        message: error instanceof Error ? error.message : 'Ocurrió un error desconocido al crear la propiedad.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Agregar Nueva Propiedad</h1>
        <button
          onClick={() => router.push('/admin/propiedades')}
          className={styles.cancelButton}
        >
          ← Volver
        </button>
      </div>

      <PropertyForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  )
}
