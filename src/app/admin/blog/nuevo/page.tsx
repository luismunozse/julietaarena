'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import type { BlogPost } from '@/data/blogPosts'
import BlogPostForm from '@/components/BlogPostForm'
import Modal from '@/components/Modal'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function NewBlogPostPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { createBlogPost } = useBlogPosts()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'alert' | 'success' | 'error'
    title: string
    message: string
  }>({ isOpen: false, type: 'alert', title: '', message: '' })

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
    router.push('/login?redirect=/admin/blog/nuevo')
    return null
  }

  const handleSubmit = async (formData: Partial<BlogPost>) => {
    if (!formData.title || !formData.slug || !formData.category) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Campos Incompletos',
        message: 'Por favor completa titulo, slug y categoria.',
      })
      return
    }

    setIsSubmitting(true)
    const success = await createBlogPost(formData)
    setIsSubmitting(false)

    if (success) {
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Articulo Creado',
        message: 'El articulo se ha creado exitosamente. Redirigiendo...',
      })
      setTimeout(() => router.push('/admin/blog'), 1500)
    } else {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error al Crear',
        message: 'No se pudo crear el articulo. Revisa la consola para mas detalles.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Nuevo Articulo"
        subtitle="Crea un nuevo articulo para el blog"
        action={
          <Button variant="outline" onClick={() => router.push('/admin/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <BlogPostForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

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
