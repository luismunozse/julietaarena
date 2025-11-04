'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProperties } from '@/hooks/useProperties'
import type { Property } from '@/data/properties'
import PropertyForm from '@/components/PropertyForm'
import styles from './page.module.css'

export default function NewPropertyPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { createProperty } = useProperties()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Protección de ruta
  if (authLoading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  if (!isAuthenticated) {
    router.push('/login?redirect=/admin/propiedades/nueva')
    return null
  }

  const handleSubmit = async (formData: Partial<Property>) => {
    setIsSubmitting(true)

    // Validar datos requeridos
    if (!formData.title || !formData.description || !formData.price || !formData.location) {
      alert('Por favor completa todos los campos requeridos')
      setIsSubmitting(false)
      return
    }

    // Crear propiedad
    const success = createProperty(formData as any)

    if (success) {
      router.push('/admin/propiedades')
    } else {
      alert('Error al crear la propiedad')
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
        initialData={{
          title: '',
          description: '',
          price: 0,
          location: '',
          type: 'casa',
          operation: 'venta',
          status: 'disponible',
          featured: false,
          images: [],
          features: [],
          area: 0
        }}
      />
    </div>
  )
}

