'use client'

import { useState, useEffect } from 'react'
import type { BlogPost } from '@/data/blogPosts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Save, Loader2, X, Plus } from 'lucide-react'

interface BlogPostFormProps {
  onSubmit: (data: Partial<BlogPost>) => void
  isSubmitting: boolean
  initialData?: Partial<BlogPost>
}

const CATEGORIES = [
  'Consejos Legales',
  'Mercado',
  'Remates',
  'Alquileres',
  'Tasaciones',
  'Legal',
  'Inversiones',
  'Noticias',
]

const generateSlug = (title: string): string =>
  title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export default function BlogPostForm({ onSubmit, isSubmitting, initialData }: BlogPostFormProps) {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'Julieta Arena',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    image: '',
    featured: false,
    readTime: 5,
    status: 'draft',
    ...initialData,
  })

  const [tagInput, setTagInput] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  // Auto-generate slug from title (unless manually edited)
  useEffect(() => {
    if (!slugManual && formData.title && !initialData?.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.title || '') }))
    }
  }, [formData.title, slugManual, initialData?.slug])

  const updateField = (field: keyof BlogPost, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !(formData.tags || []).includes(tag)) {
      updateField('tags', [...(formData.tags || []), tag])
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    updateField('tags', (formData.tags || []).filter(t => t !== tag))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg text-slate-900">Informacion Basica</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Titulo *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={e => updateField('title', e.target.value)}
                placeholder="Titulo del articulo"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="slug">Slug (URL) *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug || ''}
                  onChange={e => {
                    setSlugManual(true)
                    updateField('slug', e.target.value)
                  }}
                  placeholder="url-del-articulo"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSlugManual(false)
                    updateField('slug', generateSlug(formData.title || ''))
                  }}
                >
                  Auto
                </Button>
              </div>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="excerpt">Resumen *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt || ''}
                onChange={e => updateField('excerpt', e.target.value)}
                placeholder="Breve resumen del articulo"
                rows={2}
                required
              />
            </div>

            <div>
              <Label htmlFor="author">Autor</Label>
              <Input
                id="author"
                value={formData.author || ''}
                onChange={e => updateField('author', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ''}
                onChange={e => updateField('date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="category">Categoria *</Label>
              <select
                id="category"
                value={formData.category || ''}
                onChange={e => updateField('category', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                required
              >
                <option value="">Seleccionar...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="image">URL de Imagen</Label>
              <Input
                id="image"
                value={formData.image || ''}
                onChange={e => updateField('image', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg text-slate-900">Contenido</h3>
          <Textarea
            value={formData.content || ''}
            onChange={e => updateField('content', e.target.value)}
            placeholder="Escribe el contenido del articulo..."
            rows={15}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>

      {/* Tags & Config */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg text-slate-900">Configuracion</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Estado</Label>
              <select
                id="status"
                value={formData.status || 'draft'}
                onChange={e => updateField('status', e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>

            <div>
              <Label htmlFor="readTime">Tiempo de lectura (min)</Label>
              <Input
                id="readTime"
                type="number"
                min={1}
                max={60}
                value={formData.readTime || 5}
                onChange={e => updateField('readTime', parseInt(e.target.value) || 5)}
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer h-9">
                <input
                  type="checkbox"
                  checked={formData.featured || false}
                  onChange={e => updateField('featured', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">Destacado</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Etiquetas</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Agregar etiqueta..."
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={addTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {(formData.tags || []).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {(formData.tags || []).map(tag => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    #{tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[160px]">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Actualizar Articulo' : 'Crear Articulo'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
