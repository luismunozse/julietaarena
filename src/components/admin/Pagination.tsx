'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { usePagination } from '@/hooks/usePagination'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PaginationProps<T> {
  items: T[]
  itemsPerPage?: number
  onPageChange?: (page: number) => void
  render: (paginatedItems: T[]) => React.ReactNode
}

export default function Pagination<T>({
  items,
  itemsPerPage = 25,
  onPageChange,
  render,
}: PaginationProps<T>) {
  const {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage: currentItemsPerPage,
    totalItems,
    setItemsPerPage,
    goToFirst,
    goToLast,
    goToNext,
    goToPrevious,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(items, itemsPerPage)

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    }
  }

  return (
    <>
      {render(paginatedItems)}

      {totalPages > 1 && (
        <div
          className={cn(
            'flex justify-between items-center p-6 bg-white rounded-lg mt-8 flex-wrap gap-4',
            'max-md:flex-col max-md:items-stretch'
          )}
        >
          <div
            className={cn(
              'flex items-center gap-4 text-muted-foreground text-sm',
              'max-md:justify-between max-md:w-full'
            )}
          >
            <span>
              Mostrando {(currentPage - 1) * currentItemsPerPage + 1} - {Math.min(currentPage * currentItemsPerPage, totalItems)} de {totalItems}
            </span>
            <Select
              value={String(currentItemsPerPage)}
              onValueChange={(value) => {
                setItemsPerPage(Number(value))
                handlePageChange(1)
              }}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 por página</SelectItem>
                <SelectItem value="25">25 por página</SelectItem>
                <SelectItem value="50">50 por página</SelectItem>
                <SelectItem value="100">100 por página</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div
            className={cn(
              'flex items-center gap-2',
              'max-md:w-full max-md:justify-center max-md:flex-wrap'
            )}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                goToFirst()
                handlePageChange(1)
              }}
              disabled={!hasPreviousPage}
            >
              <ChevronsLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                goToPrevious()
                handlePageChange(currentPage - 1)
              }}
              disabled={!hasPreviousPage}
            >
              <ChevronLeft className="size-4" />
              <span className="max-sm:hidden">Anterior</span>
            </Button>

            <span className="px-4 font-semibold text-muted-foreground">
              Pagina {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                goToNext()
                handlePageChange(currentPage + 1)
              }}
              disabled={!hasNextPage}
            >
              <span className="max-sm:hidden">Siguiente</span>
              <ChevronRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                goToLast()
                handlePageChange(totalPages)
              }}
              disabled={!hasNextPage}
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
