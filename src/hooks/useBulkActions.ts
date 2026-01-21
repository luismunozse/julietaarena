'use client'

import { useState, useCallback } from 'react'
import type { Property } from '@/data/properties'
import { useProperties } from './useProperties'
import { useToast } from '@/components/ToastContainer'

export function useBulkActions() {
  const { updateProperty, deleteProperty } = useProperties()
  const { success, error: showError } = useToast()
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectAll = useCallback((properties: Property[]) => {
    setSelectedIds(new Set(properties.map(p => p.id)))
  }, [])

  const deselectAll = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const bulkStatusChange = useCallback(async (
    properties: Property[],
    status: 'disponible' | 'reservado' | 'vendido'
  ) => {
    setIsProcessing(true)
    try {
      const updates = Array.from(selectedIds).map(id => {
        const property = properties.find(p => p.id === id)
        if (!property) return null
        return updateProperty(id, { ...property, status })
      })

      await Promise.all(updates.filter(Boolean) as Promise<boolean>[])
      success(`${selectedIds.size} propiedades actualizadas`)
      setSelectedIds(new Set())
    } catch (err) {
      showError('Error al actualizar propiedades')
    } finally {
      setIsProcessing(false)
    }
  }, [selectedIds, updateProperty, success, showError])

  const bulkFeaturedToggle = useCallback(async (
    properties: Property[],
    featured: boolean
  ) => {
    setIsProcessing(true)
    try {
      const updates = Array.from(selectedIds).map(id => {
        const property = properties.find(p => p.id === id)
        if (!property) return null
        return updateProperty(id, { ...property, featured })
      })

      await Promise.all(updates.filter(Boolean) as Promise<boolean>[])
      success(`${selectedIds.size} propiedades actualizadas`)
      setSelectedIds(new Set())
    } catch (err) {
      showError('Error al actualizar propiedades')
    } finally {
      setIsProcessing(false)
    }
  }, [selectedIds, updateProperty, success, showError])

  const bulkDelete = useCallback(async () => {
    if (!confirm(`¿Estás seguro de eliminar ${selectedIds.size} propiedades? Esta acción no se puede deshacer.`)) {
      return
    }

    setIsProcessing(true)
    try {
      const deletions = Array.from(selectedIds).map(id => deleteProperty(id))
      await Promise.all(deletions)
      success(`${selectedIds.size} propiedades eliminadas`)
      setSelectedIds(new Set())
    } catch (err) {
      showError('Error al eliminar propiedades')
    } finally {
      setIsProcessing(false)
    }
  }, [selectedIds, deleteProperty, success, showError])

  return {
    selectedIds,
    isProcessing,
    toggleSelection,
    selectAll,
    deselectAll,
    bulkStatusChange,
    bulkFeaturedToggle,
    bulkDelete,
  }
}


