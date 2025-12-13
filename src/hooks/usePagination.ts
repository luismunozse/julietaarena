'use client'

import { useState, useMemo } from 'react'

export interface PaginationConfig {
  itemsPerPage: number
  currentPage: number
  totalItems: number
  totalPages: number
}

export function usePagination<T>(items: T[], initialItemsPerPage = 25) {
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(items.length / itemsPerPage)

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, currentPage, itemsPerPage])

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const goToFirst = () => goToPage(1)
  const goToLast = () => goToPage(totalPages)
  const goToNext = () => goToPage(currentPage + 1)
  const goToPrevious = () => goToPage(currentPage - 1)

  // Resetear a página 1 cuando cambian los items
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [totalPages, currentPage])

  return {
    paginatedItems,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: items.length,
    setItemsPerPage,
    goToPage,
    goToFirst,
    goToLast,
    goToNext,
    goToPrevious,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  }
}

