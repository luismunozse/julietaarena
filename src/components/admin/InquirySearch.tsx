'use client'

import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface InquirySearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  filterStatus: string
  onStatusChange: (status: string) => void
  filterProperty?: string
  onPropertyChange?: (property: string) => void
  filterService?: string
  onServiceChange?: (service: string) => void
  hasActiveFilters: boolean
  onClearFilters: () => void
  type: 'consultas' | 'contactos'
}

export default function InquirySearch({
  searchTerm,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterProperty,
  onPropertyChange,
  filterService,
  onServiceChange,
  hasActiveFilters,
  onClearFilters,
  type,
}: InquirySearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="p-6 mb-8">
      <div className="flex gap-4 items-center flex-wrap md:flex-row flex-col">
        <div className="flex-1 min-w-[300px] md:min-w-[300px] w-full relative">
          <Input
            type="text"
            placeholder={type === 'consultas'
              ? "Buscar por nombre, email, telefono, propiedad, mensaje..."
              : "Buscar por nombre, email, telefono, servicio, mensaje..."
            }
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-semibold"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 mr-2" /> : <ChevronDown className="h-4 w-4 mr-2" />}
            Filtros Avanzados
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-semibold text-muted-foreground">Estado</Label>
              <Select
                value={filterStatus}
                onValueChange={onStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los estados</SelectItem>
                  <SelectItem value="nueva">Nueva</SelectItem>
                  <SelectItem value="leida">Leída</SelectItem>
                  <SelectItem value="contactada">Contactada</SelectItem>
                  <SelectItem value="cerrada">Cerrada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'consultas' && filterProperty !== undefined && onPropertyChange && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-muted-foreground">Propiedad</Label>
                <Input
                  type="text"
                  placeholder="Buscar por propiedad..."
                  value={filterProperty}
                  onChange={(e) => onPropertyChange(e.target.value)}
                />
              </div>
            )}

            {type === 'contactos' && filterService !== undefined && onServiceChange && (
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-semibold text-muted-foreground">Servicio</Label>
                <Select
                  value={filterService}
                  onValueChange={onServiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los servicios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los servicios</SelectItem>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                    <SelectItem value="tasacion">Tasación</SelectItem>
                    <SelectItem value="asesoramiento">Asesoramiento</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
