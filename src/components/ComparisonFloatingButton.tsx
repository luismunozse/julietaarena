'use client'

import { useState } from 'react'
import { usePropertyComparator } from '@/hooks/usePropertyComparator'
import PropertyComparison from './PropertyComparison'

export default function ComparisonFloatingButton() {
  const { comparisonProperties, clearComparison } = usePropertyComparator()
  const [showComparison, setShowComparison] = useState(false)

  if (comparisonProperties.length === 0) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-36 right-4 sm:bottom-6 sm:right-24 flex items-center gap-2 z-[999]">
        <button
          className="flex items-center gap-3 py-3.5 px-6 bg-brand-primary text-white border-none rounded-full shadow-md cursor-pointer font-semibold text-[0.9375rem] transition-all duration-300 hover:bg-brand-accent hover:shadow-lg"
          onClick={() => setShowComparison(true)}
        >
          <span className="text-xl">&#x2696;&#xFE0F;</span>
          <span className="whitespace-nowrap">
            Comparar ({comparisonProperties.length})
          </span>
        </button>

        <button
          className="w-9 h-9 bg-white text-muted border border-border rounded-full cursor-pointer text-sm flex items-center justify-center transition-all duration-200 shadow-md hover:bg-surface hover:text-foreground"
          onClick={clearComparison}
          title="Limpiar comparación"
        >
          X
        </button>
      </div>

      {showComparison && (
        <PropertyComparison onClose={() => setShowComparison(false)} />
      )}
    </>
  )
}
