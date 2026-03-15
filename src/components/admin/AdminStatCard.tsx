'use client'

import { cn } from '@/lib/utils'

interface AdminStatCardProps {
  icon: React.ReactNode
  iconBgColor: string
  title: string
  value: string | number
  label?: string
  className?: string
}

export default function AdminStatCard({
  icon,
  iconBgColor,
  title,
  value,
  label,
  className,
}: AdminStatCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xl bg-white p-4 border border-slate-100 transition-shadow hover:shadow-sm',
        className
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
          iconBgColor
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tracking-tight text-slate-900">
          {value}
        </p>
        <p className="text-xs text-slate-500">{title}</p>
        {label && (
          <p className="text-[11px] text-slate-400 truncate">{label}</p>
        )}
      </div>
    </div>
  )
}
