'use client'

import { useState, useEffect } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { logTagChange } from '@/lib/audit'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface TagsManagerProps {
  entityType: 'property_inquiry' | 'contact_inquiry'
  entityId: string
  currentTags: string[]
  onTagsChange?: (tags: string[]) => void
}

// Etiquetas predefinidas con colores
const PREDEFINED_TAGS = [
  { label: 'Urgente', color: '#ef4444', value: 'urgente' },
  { label: 'Seguimiento', color: '#3b82f6', value: 'seguimiento' },
  { label: 'Cliente VIP', color: '#f59e0b', value: 'cliente-vip' },
  { label: 'Presupuesto', color: '#10b981', value: 'presupuesto' },
  { label: 'Interesado', color: '#8b5cf6', value: 'interesado' },
  { label: 'Revisar', color: '#ec4899', value: 'revisar' },
  { label: 'Cerrado', color: '#6b7280', value: 'cerrado' },
  { label: 'Pendiente', color: '#f97316', value: 'pendiente' }
]

export default function TagsManager({
  entityType,
  entityId,
  currentTags = [],
  onTagsChange
}: TagsManagerProps) {
  const [tags, setTags] = useState<string[]>(currentTags)
  const [isLoading, setIsLoading] = useState(false)
  const [showAddTag, setShowAddTag] = useState(false)
  const [newTag, setNewTag] = useState('')
  const { success, error: showError } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    setTags(currentTags)
  }, [currentTags])

  const updateTags = async (newTags: string[]) => {
    setIsLoading(true)
    try {
      const tableName = entityType === 'property_inquiry' ? 'property_inquiries' : 'contact_inquiries'

      const { error } = await supabase
        .from(tableName)
        .update({ tags: newTags })
        .eq('id', entityId)

      if (error) {
        console.error('Error al actualizar etiquetas:', error)
        showError('Error al actualizar las etiquetas')
        return
      }

      setTags(newTags)
      onTagsChange?.(newTags)
      success('Etiquetas actualizadas correctamente')
    } catch (err) {
      console.error('Error:', err)
      showError('Error al actualizar las etiquetas')
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = async (tagValue: string) => {
    if (!tagValue.trim() || tags.includes(tagValue)) return

    const newTags = [...tags, tagValue]
    await updateTags(newTags)

    // Registrar en auditoria
    await logTagChange(entityType, entityId, 'tag_add', tagValue, user || undefined)

    setNewTag('')
    setShowAddTag(false)
  }

  const removeTag = async (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    await updateTags(newTags)

    // Registrar en auditoria
    await logTagChange(entityType, entityId, 'tag_remove', tagToRemove, user || undefined)
  }

  const getTagColor = (tagValue: string): string => {
    const predefined = PREDEFINED_TAGS.find(t => t.value === tagValue)
    return predefined?.color || '#6b7280'
  }

  const getTagLabel = (tagValue: string): string => {
    const predefined = PREDEFINED_TAGS.find(t => t.value === tagValue)
    return predefined?.label || tagValue
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 items-center">
        {tags.length === 0 ? (
          <span className="text-sm italic text-muted-foreground">Sin etiquetas</span>
        ) : (
          tags.map((tag) => (
            <Badge
              key={tag}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-white text-sm font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {getTagLabel(tag)}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className={cn(
                  "bg-transparent border-none text-white text-lg leading-none p-0",
                  "w-5 h-5 flex items-center justify-center rounded-full",
                  "hover:bg-black/20 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                disabled={isLoading}
                aria-label={`Eliminar etiqueta ${tag}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))
        )}
      </div>

      {showAddTag ? (
        <div className="flex flex-col gap-3 p-4 bg-muted/50 border border-border rounded-lg">
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.filter(tag => !tags.includes(tag.value)).map((tag) => (
              <Button
                key={tag.value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag(tag.value)}
                className="border-2 hover:-translate-y-0.5 hover:shadow-md transition-all"
                style={{ borderColor: tag.color }}
                disabled={isLoading}
              >
                {tag.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTag(newTag.trim())
                }
              }}
              placeholder="Etiqueta personalizada..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              type="button"
              onClick={() => addTag(newTag.trim())}
              disabled={isLoading || !newTag.trim()}
              size="sm"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Agregar'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddTag(false)
                setNewTag('')
              }}
              disabled={isLoading}
              size="sm"
            >
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAddTag(true)}
          disabled={isLoading}
          className="self-start border-dashed"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar etiqueta
        </Button>
      )}
    </div>
  )
}
