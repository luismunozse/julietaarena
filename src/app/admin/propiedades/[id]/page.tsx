'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProperties } from '@/hooks/useProperties'
import type { Property } from '@/data/properties'
import PropertyForm from '@/components/PropertyForm'
import styles from './page.module.css'

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const propertyId = params.id as string
  
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { getPropertyById, updateProperty } = useProperties()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const currentProperty = getPropertyById(propertyId)
      if (currentProperty) {
        setProperty(currentProperty)
      } else {
        router.push('/admin/propiedades')
      }
      setIsLoading(false)
    }
  }, [propertyId, authLoading, isAuthenticated, getPropertyById, router])

  // Protección de ruta
  if (authLoading) {
    return <div className={styles.loading}>Cargando...</div>
  }

  if (!isAuthenticated) {
    router.push(`/login?redirect=/admin/propiedades/${propertyId}`)
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

    // Actualizar propiedad
    const success = updateProperty(propertyId, formData)

    if (success) {
      router.push('/admin/propiedades')
    } else {
      alert('Error al actualizar la propiedad')
      setIsSubmitting(false)
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
    </div>
  )
}

