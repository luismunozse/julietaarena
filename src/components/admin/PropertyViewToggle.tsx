'use client'

import { LayoutGrid, Table, List, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

type ViewMode = 'grid' | 'table' | 'list'

interface PropertyViewToggleProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export default function PropertyViewToggle({
  viewMode,
  onViewModeChange,
  onSortChange,
  sortBy,
  sortOrder,
}: PropertyViewToggleProps) {
  return (
    <Card className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 p-4 mb-4">
      <div className="flex border-2 border-border rounded-lg overflow-hidden w-full md:w-auto">
        <Button
          variant="ghost"
          onClick={() => onViewModeChange('grid')}
          className={cn(
            "flex-1 md:flex-none rounded-none border-none px-4 py-2 font-semibold",
            viewMode === 'grid' && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
          title="Vista de grilla"
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Grilla
        </Button>
        <Button
          variant="ghost"
          onClick={() => onViewModeChange('table')}
          className={cn(
            "flex-1 md:flex-none rounded-none border-none px-4 py-2 font-semibold",
            viewMode === 'table' && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
          title="Vista de tabla"
        >
          <Table className="h-4 w-4 mr-2" />
          Tabla
        </Button>
        <Button
          variant="ghost"
          onClick={() => onViewModeChange('list')}
          className={cn(
            "flex-1 md:flex-none rounded-none border-none px-4 py-2 font-semibold",
            viewMode === 'list' && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
          title="Vista de lista"
        >
          <List className="h-4 w-4 mr-2" />
          Lista
        </Button>
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
        <Label className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
          Ordenar por:
        </Label>
        <Select
          value={sortBy}
          onValueChange={(value) => onSortChange(value, sortOrder)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Fecha de creación</SelectItem>
            <SelectItem value="updatedAt">Fecha de modificación</SelectItem>
            <SelectItem value="price">Precio</SelectItem>
            <SelectItem value="title">Título</SelectItem>
            <SelectItem value="location">Ubicación</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          title={sortOrder === 'asc' ? 'Orden descendente' : 'Orden ascendente'}
          className="border-2"
        >
          {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  )
}
