'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import type { BlogPost } from '@/data/blogPosts'
import BlogPostForm from '@/components/BlogPostForm'
import Modal from '@/components/Modal'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const { getBlogPostById, updateBlogPost, isLoading: postsLoading } = useBlogPosts()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'alert' | 'success' | 'error'
    title: string
    message: string
  }>({ isOpen: false, type: 'alert', title: '', message: '' })

  useEffect(() => {
    if (postsLoading) return

    const found = getBlogPostById(postId)
    if (found) {
      setPost(found)
    } else {
      router.push('/admin/blog')
    }
    setIsLoading(false)
  }, [postId, getBlogPostById, router, postsLoading])

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
    const success = await updateBlogPost(postId, formData)
    setIsSubmitting(false)

    if (success) {
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Articulo Actualizado',
        message: 'El articulo se ha actualizado exitosamente. Redirigiendo...',
      })
      setTimeout(() => router.push('/admin/blog'), 1500)
    } else {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error al Actualizar',
        message: 'No se pudo actualizar el articulo. Intenta nuevamente.',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">Cargando articulo...</p>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Editar Articulo"
        subtitle={post.title}
        action={
          <Button variant="outline" onClick={() => router.push('/admin/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        }
      />

      <BlogPostForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        initialData={post}
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
