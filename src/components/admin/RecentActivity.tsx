'use client'

import Link from 'next/link'
import { Home, MessageSquare, Mail, Clock } from 'lucide-react'
import { useRecentActivity } from '@/hooks/useRecentActivity'
import { cn } from '@/lib/utils'

const iconMap: Record<string, { icon: React.ReactNode; color: string }> = {
  '🏠': { icon: <Home className="h-4 w-4" />, color: 'text-blue-600 bg-blue-50' },
  '💬': { icon: <MessageSquare className="h-4 w-4" />, color: 'text-emerald-600 bg-emerald-50' },
  '📧': { icon: <Mail className="h-4 w-4" />, color: 'text-amber-600 bg-amber-50' },
}

const defaultIcon = { icon: <Clock className="h-4 w-4" />, color: 'text-slate-500 bg-slate-100' }

export default function RecentActivity() {
  const { activities, isLoading } = useRecentActivity(8)

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white border border-slate-100 p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-4">Actividad Reciente</h3>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-100 animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-32 rounded bg-slate-100 animate-pulse" />
                <div className="h-2.5 w-48 rounded bg-slate-50 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (activities.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-slate-100 p-5">
        <h3 className="text-sm font-medium text-slate-900 mb-4">Actividad Reciente</h3>
        <p className="text-sm text-slate-400 text-center py-6">Sin actividad reciente</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white border border-slate-100 p-5">
      <h3 className="text-sm font-medium text-slate-900 mb-4">Actividad Reciente</h3>
      <div className="space-y-1">
        {activities.map((activity) => {
          const { icon, color } = iconMap[activity.icon] || defaultIcon
          const content = (
            <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-slate-50">
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', color)}>
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{activity.title}</p>
                <p className="text-xs text-slate-400 truncate">{activity.description}</p>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">
                {(activity as { formattedTime?: string }).formattedTime || 'Ahora'}
              </span>
            </div>
          )

          if (activity.link) {
            return (
              <Link key={activity.id} href={activity.link} className="block no-underline">
                {content}
              </Link>
            )
          }

          return <div key={activity.id}>{content}</div>
        })}
      </div>
    </div>
  )
}
