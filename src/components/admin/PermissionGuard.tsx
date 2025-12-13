'use client'

import { useEffect, useState, ReactNode } from 'react'
import { hasPermission, isAdmin } from '@/lib/permissions'
import type { Permission, Section } from '@/lib/permissions'
import { useAuth } from '@/hooks/useAuth'
import styles from './PermissionGuard.module.css'

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

      // Verificar permiso específico
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
        <div className={styles.noPermission}>
          <p>No tienes permisos para realizar esta acción.</p>
        </div>
      )
    }
    return <>{fallback}</>
  }

  return <>{children}</>
}
