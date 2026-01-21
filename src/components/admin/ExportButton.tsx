'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, FileJson, Loader2 } from 'lucide-react'
import type { Property } from '@/data/properties'
import { exportToCSV, exportToJSON } from '@/lib/export'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ExportButtonProps {
  properties: Property[]
  disabled?: boolean
}

export default function ExportButton({ properties, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(true)
    try {
      if (format === 'csv') {
        exportToCSV(properties)
      } else {
        exportToJSON(properties)
      }
      // Pequeno delay para mejor UX
      await new Promise(resolve => setTimeout(resolve, 300))
    } catch (err) {
      console.error('Error al exportar:', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={disabled || isExporting || properties.length === 0}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuItem
          onClick={() => handleExport('csv')}
          className="cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar a CSV (Excel)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport('json')}
          className="cursor-pointer"
        >
          <FileJson className="h-4 w-4 mr-2" />
          Exportar a JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
