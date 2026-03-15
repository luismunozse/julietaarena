'use client'

import { useState } from 'react'
import type { Property } from '@/data/properties'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Star, StarOff, Download, Trash2, CheckSquare } from 'lucide-react'

interface BulkActionsProps {
  selectedIds: Set<string>
  properties: Property[]
  onSelectAll: () => void
  onDeselectAll: () => void
  onBulkStatusChange: (status: 'disponible' | 'reservado' | 'vendido') => Promise<void>
  onBulkFeaturedToggle: (featured: boolean) => Promise<void>
  onBulkDelete: () => Promise<void>
  onBulkExport: () => void
}

export default function BulkActions({
  selectedIds,
  properties,
  onSelectAll,
  onDeselectAll,
  onBulkStatusChange,
  onBulkFeaturedToggle,
  onBulkDelete,
  onBulkExport,
}: BulkActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  if (selectedIds.size === 0) {
    return null
  }

  const handleBulkAction = async (action: () => Promise<void>) => {
    setIsProcessing(true)
    try {
      await action()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div
      className={cn(
        'bg-[#2c5f7d] text-white p-4 px-6 rounded-lg mb-6',
        'flex justify-between items-center flex-wrap gap-4',
        'sticky top-20 z-10 shadow-lg',
        'md:flex-row flex-col md:items-center items-stretch'
      )}
    >
      <div className="flex items-center gap-4 md:justify-start justify-between">
        <span className="font-semibold text-base">
          {selectedIds.size} {selectedIds.size === 1 ? 'propiedad seleccionada' : 'propiedades seleccionadas'}
        </span>
        <Button
          onClick={selectedIds.size === properties.length ? onDeselectAll : onSelectAll}
          variant="ghost"
          size="sm"
          className={cn(
            'bg-white/20 border border-white/30 text-white font-semibold',
            'hover:bg-white/30 hover:text-white'
          )}
        >
          <CheckSquare className="size-4" />
          {selectedIds.size === properties.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </Button>
      </div>

      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 w-full md:w-auto">
        <Select
          disabled={isProcessing}
          onValueChange={(value) => {
            if (value) {
              handleBulkAction(() => onBulkStatusChange(value as 'disponible' | 'reservado' | 'vendido'))
            }
          }}
        >
          <SelectTrigger
            className={cn(
              'bg-white text-gray-800 border-white font-semibold',
              'col-span-2 md:w-[180px]'
            )}
          >
            <SelectValue placeholder="Cambiar estado..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="disponible">Marcar como Disponible</SelectItem>
            <SelectItem value="reservado">Marcar como Reservado</SelectItem>
            <SelectItem value="vendido">Marcar como Vendido</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={() => handleBulkAction(() => onBulkFeaturedToggle(true))}
          disabled={isProcessing}
          variant="ghost"
          size="sm"
          className={cn(
            'bg-white/10 border border-white/30 text-white font-semibold',
            'hover:bg-white/20 hover:text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'md:flex-none'
          )}
        >
          <Star className="size-4" />
          Destacar
        </Button>

        <Button
          onClick={() => handleBulkAction(() => onBulkFeaturedToggle(false))}
          disabled={isProcessing}
          variant="ghost"
          size="sm"
          className={cn(
            'bg-white/10 border border-white/30 text-white font-semibold',
            'hover:bg-white/20 hover:text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'md:flex-none'
          )}
        >
          <StarOff className="size-4" />
          Quitar destacado
        </Button>

        <Button
          onClick={onBulkExport}
          disabled={isProcessing}
          variant="ghost"
          size="sm"
          className={cn(
            'bg-white/10 border border-white/30 text-white font-semibold',
            'hover:bg-white/20 hover:text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'md:flex-none'
          )}
        >
          <Download className="size-4" />
          Exportar
        </Button>

        <Button
          onClick={() => handleBulkAction(onBulkDelete)}
          disabled={isProcessing}
          variant="destructive"
          size="sm"
          className={cn(
            'bg-red-500/80 border border-red-500/80 text-white font-semibold',
            'hover:bg-red-500 hover:text-white',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'md:flex-none'
          )}
        >
          <Trash2 className="size-4" />
          Eliminar
        </Button>
      </div>
    </div>
  )
}
