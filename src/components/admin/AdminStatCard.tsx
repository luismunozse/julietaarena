'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

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
    <Card
      className={cn(
        'flex flex-row items-center gap-4 p-4 md:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
        className
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
          iconBgColor
        )}
      >
        {icon}
      </div>
      <CardContent className="flex-1 p-0">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        <p className="mb-1 text-2xl font-bold leading-none text-[#2c5f7d] md:text-3xl">
          {value}
        </p>
        {label && (
          <span className="text-sm text-muted-foreground">{label}</span>
        )}
      </CardContent>
    </Card>
  )
}
