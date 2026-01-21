'use client'

import { useEffect, useState, ReactNode } from 'react'
import { ShieldAlert } from 'lucide-react'
import { hasPermission, isAdmin } from '@/lib/permissions'
import type { Permission, Section } from '@/lib/permissions'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

interface PermissionGuardProps {
  section: Section
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
  showMessage?: boolean
}

export default function PermissionGuard({
  section,
  permission,
  children,
  fallback = null,
  showMessage = false
}: PermissionGuardProps) {
  const { user } = useAuth()
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setHasAccess(false)
        setIsLoading(false)
        return
      }

      // Los admins tienen acceso total
      const admin = await isAdmin(user.id)
      if (admin) {
        setHasAccess(true)
        setIsLoading(false)
        return
      }

      // Verificar permiso especifico
      const hasPerm = await hasPermission(user.id, section, permission)
      setHasAccess(hasPerm)
      setIsLoading(false)
    }

    void checkPermission()
  }, [user, section, permission])

  if (isLoading) {
    return null // O un spinner si prefieres
  }

  if (!hasAccess) {
    if (showMessage) {
      return (
        <div className={cn(
          "p-5 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center"
        )}>
          <div className="flex items-center justify-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            <p className="m-0 font-medium">No tienes permisos para realizar esta accion.</p>
          </div>
        </div>
      )
    }
    return <>{fallback}</>
  }

  return <>{children}</>
}
