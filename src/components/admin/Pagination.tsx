'use client'

import { usePagination } from '@/hooks/usePagination'
import styles from './Pagination.module.css'

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
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            <span>
              Mostrando {(currentPage - 1) * currentItemsPerPage + 1} - {Math.min(currentPage * currentItemsPerPage, totalItems)} de {totalItems}
            </span>
            <select
              value={currentItemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                handlePageChange(1)
              }}
              className={styles.itemsPerPageSelect}
            >
              <option value={10}>10 por página</option>
              <option value={25}>25 por página</option>
              <option value={50}>50 por página</option>
              <option value={100}>100 por página</option>
            </select>
          </div>

          <div className={styles.paginationControls}>
            <button
              onClick={() => {
                goToFirst()
                handlePageChange(1)
              }}
              disabled={!hasPreviousPage}
              className={styles.paginationButton}
            >
              ««
            </button>
            <button
              onClick={() => {
                goToPrevious()
                handlePageChange(currentPage - 1)
              }}
              disabled={!hasPreviousPage}
              className={styles.paginationButton}
            >
              « Anterior
            </button>
            
            <span className={styles.pageInfo}>
              Página {currentPage} de {totalPages}
            </span>
            
            <button
              onClick={() => {
                goToNext()
                handlePageChange(currentPage + 1)
              }}
              disabled={!hasNextPage}
              className={styles.paginationButton}
            >
              Siguiente »
            </button>
            <button
              onClick={() => {
                goToLast()
                handlePageChange(totalPages)
              }}
              disabled={!hasNextPage}
              className={styles.paginationButton}
            >
              »»
            </button>
          </div>
        </div>
      )}
    </>
  )
}

