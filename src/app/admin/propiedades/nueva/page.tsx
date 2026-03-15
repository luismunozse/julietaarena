'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProperties } from '@/hooks/useProperties'
import type { Property } from '@/data/properties'
import PropertyForm from '@/components/PropertyForm'
import Modal from '@/components/Modal'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RotateCcw } from 'lucide-react'

const DRAFT_STORAGE_KEY = 'property-form-draft'

export default function NewPropertyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { createProperty } = useProperties()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formKey, setFormKey] = useState(0)

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

  // Limpiar borrador si viene con parametro clear=true
  useEffect(() => {
    if (searchParams.get('clear') === 'true') {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      // Remover el parametro de la URL sin recargar
      router.replace('/admin/propiedades/nueva', { scroll: false })
    }
  }, [searchParams, router])

  const handleClearDraft = () => {
    if (confirm('¿Deseas limpiar el formulario y empezar de cero?')) {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      setFormKey(prev => prev + 1) // Forzar re-render del formulario
    }
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    router.push('/login?redirect=/admin/propiedades/nueva')
    return null
  }

  const handleSubmit = async (formData: Partial<Property>) => {
    try {
      setIsSubmitting(true)

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

      const success = await createProperty(formData as any)

      if (success) {
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
    <div className="space-y-6">
      <AdminPageHeader
        title="Agregar Nueva Propiedad"
        subtitle="Completa el formulario para crear una nueva propiedad"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClearDraft}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Limpiar
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/propiedades')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        }
      />

      <PropertyForm
        key={formKey}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

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
