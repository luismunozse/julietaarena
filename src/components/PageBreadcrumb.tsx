'use client'

import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
  showBack?: boolean
}

export default function PageBreadcrumb({ items, showBack = true }: PageBreadcrumbProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 mb-6 text-sm">
      {showBack && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-slate-600 hover:text-slate-900 h-8 px-2"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4" />
            Volver
          </Button>
          <span className="text-slate-300">|</span>
        </>
      )}
      <nav className="flex items-center gap-1" aria-label="Breadcrumb">
        <Link href="/" className="text-brand-primary hover:text-brand-accent transition-colors font-medium">
          Inicio
        </Link>
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-1">
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="text-brand-primary hover:text-brand-accent transition-colors font-medium">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-500">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  )
}
