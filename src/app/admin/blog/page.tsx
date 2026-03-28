'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useBlogPosts } from '@/hooks/useBlogPosts'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import Modal from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye, Star, FileText, Globe, FilePenLine } from 'lucide-react'

export default function AdminBlogPage() {
  const router = useRouter()
  const { blogPosts, isLoading, deleteBlogPost } = useBlogPosts()

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: '',
  })

  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'alert' | 'success' | 'error'
    title: string
    message: string
  }>({ isOpen: false, type: 'alert', title: '', message: '' })

  const published = blogPosts.filter(p => p.status === 'published').length
  const drafts = blogPosts.filter(p => p.status === 'draft').length
  const featured = blogPosts.filter(p => p.featured).length

  const handleDelete = async () => {
    const success = await deleteBlogPost(deleteModal.id)
    setDeleteModal({ isOpen: false, id: '', title: '' })
    if (success) {
      setModal({ isOpen: true, type: 'success', title: 'Eliminado', message: 'El articulo fue eliminado correctamente.' })
    } else {
      setModal({ isOpen: true, type: 'error', title: 'Error', message: 'No se pudo eliminar el articulo.' })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">Cargando articulos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog"
        subtitle={`${blogPosts.length} articulos en total`}
        action={
          <Button onClick={() => router.push('/admin/blog/nuevo')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Articulo
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-100">
              <FileText className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{blogPosts.length}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100">
              <Globe className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{published}</p>
              <p className="text-xs text-slate-500">Publicados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100">
              <FilePenLine className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{drafts}</p>
              <p className="text-xs text-slate-500">Borradores</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{featured}</p>
              <p className="text-xs text-slate-500">Destacados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts list */}
      {blogPosts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Sin articulos</h3>
            <p className="text-slate-500 mb-4">Crea tu primer articulo para el blog.</p>
            <Button onClick={() => router.push('/admin/blog/nuevo')}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Articulo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-3 font-medium text-slate-600">Titulo</th>
                  <th className="text-left p-3 font-medium text-slate-600">Categoria</th>
                  <th className="text-left p-3 font-medium text-slate-600">Estado</th>
                  <th className="text-left p-3 font-medium text-slate-600">Fecha</th>
                  <th className="text-right p-3 font-medium text-slate-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {blogPosts.map(post => (
                  <tr key={post.id} className="border-b hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {post.featured && <Star className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{post.title}</p>
                          <p className="text-xs text-slate-400 truncate">/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className={post.status === 'published'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                      }>
                        {post.status === 'published' ? 'Publicado' : 'Borrador'}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500">{formatDate(post.date)}</td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        {post.status === 'published' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                            title="Ver"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => router.push(`/admin/blog/${post.id}`)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteModal({ isOpen: true, id: post.id, title: post.title })}
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete confirmation */}
      {deleteModal.isOpen && (
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
          onConfirm={handleDelete}
          title="Eliminar Articulo"
          message={`¿Estas seguro de eliminar "${deleteModal.title}"? Esta accion no se puede deshacer.`}
          type="confirm"
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

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
