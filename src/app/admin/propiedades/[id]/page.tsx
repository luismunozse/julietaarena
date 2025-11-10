'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import type { Property } from '@/data/properties'
import PropertyForm from '@/components/PropertyForm'
import Modal from '@/components/Modal'
import styles from './page.module.css'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string

  const { getPropertyById, updateProperty, isLoading: propertiesLoading } = useProperties()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    if (propertiesLoading) return

    const currentProperty = getPropertyById(propertyId)
    if (currentProperty) {
      setProperty(currentProperty)
      setIsLoading(false)
    } else {
      setIsLoading(false)
      router.push('/admin/propiedades')
    }
  }, [propertyId, getPropertyById, router, propertiesLoading])

  const handleSubmit = async (formData: Partial<Property>) => {
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

    // Actualizar propiedad
    const success = await updateProperty(propertyId, formData)

    setIsSubmitting(false)

    if (success) {
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Propiedad Actualizada',
        message: 'La propiedad se ha actualizado exitosamente. Redirigiendo...'
      })
      setTimeout(() => {
        router.push('/admin/propiedades')
      }, 1500)
    } else {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error al Actualizar',
        message: 'No se pudo actualizar la propiedad. Por favor intenta nuevamente.'
      })
    }
  }

  if (isLoading) {
    return <div className={styles.loading}>Cargando propiedad...</div>
  }

  if (!property) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Editar Propiedad</h1>
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
        initialData={property}
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
