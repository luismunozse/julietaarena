'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { logTagChange } from '@/lib/audit'
import { useAuth } from '@/hooks/useAuth'
import styles from './TagsManager.module.css'

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
    
    // Registrar en auditoría
    await logTagChange(entityType, entityId, 'tag_add', tagValue, user || undefined)
    
    setNewTag('')
    setShowAddTag(false)
  }

  const removeTag = async (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    await updateTags(newTags)
    
    // Registrar en auditoría
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
    <div className={styles.container}>
      <div className={styles.tagsList}>
        {tags.length === 0 ? (
          <span className={styles.noTags}>Sin etiquetas</span>
        ) : (
          tags.map((tag) => (
            <span
              key={tag}
              className={styles.tag}
              style={{ backgroundColor: getTagColor(tag) }}
            >
              {getTagLabel(tag)}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className={styles.removeTag}
                disabled={isLoading}
                aria-label={`Eliminar etiqueta ${tag}`}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>

      {showAddTag ? (
        <div className={styles.addTagForm}>
          <div className={styles.predefinedTags}>
            {PREDEFINED_TAGS.filter(tag => !tags.includes(tag.value)).map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => addTag(tag.value)}
                className={styles.predefinedTag}
                style={{ borderColor: tag.color }}
                disabled={isLoading}
              >
                {tag.label}
              </button>
            ))}
          </div>
          <div className={styles.customTagInput}>
            <input
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
              className={styles.input}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => addTag(newTag.trim())}
              className={styles.addButton}
              disabled={isLoading || !newTag.trim()}
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddTag(false)
                setNewTag('')
              }}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddTag(true)}
          className={styles.addTagButton}
          disabled={isLoading}
        >
          + Agregar etiqueta
        </button>
      )}
    </div>
  )
}
