'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react'
import type { PropertyFilters } from '@/hooks/usePropertyFilters'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface PropertyFiltersProps {
  filters: PropertyFilters
  onFilterChange: (key: keyof PropertyFilters, value: string) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export default function PropertyFilters({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}: PropertyFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-8">
      <div className="flex gap-4 items-center flex-wrap md:flex-row flex-col">
        <div className="flex-1 min-w-0 relative w-full md:min-w-[300px]">
          <Input
            type="text"
            placeholder="Buscar por título, descripción, ubicación..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
            Filtros Avanzados
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Tipo
              </Label>
              <Select
                value={filters.type}
                onValueChange={(value) => onFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="casa">Casas</SelectItem>
                  <SelectItem value="departamento">Departamentos</SelectItem>
                  <SelectItem value="terreno">Terrenos</SelectItem>
                  <SelectItem value="local">Locales</SelectItem>
                  <SelectItem value="oficina">Oficinas</SelectItem>
                  <SelectItem value="cochera">Cocheras</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Operación
              </Label>
              <Select
                value={filters.operation}
                onValueChange={(value) => onFilterChange('operation', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las operaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las operaciones</SelectItem>
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Estado
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) => onFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-muted-foreground">
                Destacada
              </Label>
              <Select
                value={filters.featured}
                onValueChange={(value) => onFilterChange('featured', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="yes">Solo destacadas</SelectItem>
                  <SelectItem value="no">No destacadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-muted-foreground">
                Precio Mínimo
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={(e) => onFilterChange('priceMin', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-muted-foreground">
                Precio Máximo
              </label>
              <Input
                type="number"
                placeholder="Sin límite"
                value={filters.priceMax}
                onChange={(e) => onFilterChange('priceMax', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-muted-foreground">
                Área Mínima (m²)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.areaMin}
                onChange={(e) => onFilterChange('areaMin', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-muted-foreground">
                Área Máxima (m²)
              </label>
              <Input
                type="number"
                placeholder="Sin límite"
                value={filters.areaMax}
                onChange={(e) => onFilterChange('areaMax', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-muted-foreground">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-muted-foreground">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => onFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
