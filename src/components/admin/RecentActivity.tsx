'use client'

import Link from 'next/link'
import { Home, MessageSquare, Mail, Clock } from 'lucide-react'
import { useRecentActivity } from '@/hooks/useRecentActivity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

const iconMap: Record<string, React.ReactNode> = {
  '🏠': <Home className="h-5 w-5 text-sky-700" />,
  '💬': <MessageSquare className="h-5 w-5 text-emerald-600" />,
  '📧': <Mail className="h-5 w-5 text-amber-600" />,
}

export default function RecentActivity() {
  const { activities, isLoading } = useRecentActivity(8)

  if (isLoading) {
    return (
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-sky-800">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-[60px] w-full rounded-lg" />
          ))}
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-sky-800">Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground">
            <p>No hay actividad reciente</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-sky-800">Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {activities.map((activity) => {
          const content = (
            <>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted md:h-9 md:w-9">
                {iconMap[activity.icon] || <Clock className="h-5 w-5 text-gray-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-[0.95rem] font-semibold text-gray-800">
                  {activity.title}
                </h3>
                <p className="mb-1 truncate text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <span className="text-xs text-gray-400">
                  {(activity as { formattedTime?: string }).formattedTime || 'Hace un momento'}
                </span>
              </div>
            </>
          )

          const itemClasses = cn(
            'flex gap-4 rounded-lg p-4 transition-colors md:p-3',
            'hover:bg-muted/50',
            activity.link && 'cursor-pointer'
          )

          if (activity.link) {
            return (
              <Link
                key={activity.id}
                href={activity.link}
                className={cn(itemClasses, 'no-underline')}
              >
                {content}
              </Link>
            )
          }

          return (
            <div key={activity.id} className={itemClasses}>
              {content}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

