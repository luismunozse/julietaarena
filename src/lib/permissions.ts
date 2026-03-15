/**
 * Sistema de permisos granulares para el panel admin
 */

import { supabase } from './supabaseClient'
import type { User } from '@/types/user'

export type Permission = 'read' | 'create' | 'update' | 'delete'
export type Section = 'properties' | 'inquiries' | 'contacts' | 'analytics' | 'users' | 'settings'

export interface UserPermissions {
  properties: Record<Permission, boolean>
  inquiries: Record<Permission, boolean>
  contacts: Record<Permission, boolean>
  analytics: { read: boolean }
  users: Record<Permission, boolean>
  settings: { read: boolean; update: boolean }
}

export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'editor' | 'viewer'
  permissions: UserPermissions
  is_active: boolean
}

/**
 * Obtiene los permisos del usuario actual
 */
export async function getUserPermissions(userId: string): Promise<UserPermissions | null> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('permissions, role, is_active')
      .eq('user_id', userId)
      .single()

    if (error || !data || !data.is_active) {
      // Si no tiene rol o está inactivo, retornar permisos de viewer por defecto
      return getDefaultPermissions('viewer')
    }

    return data.permissions as UserPermissions
  } catch {
    return getDefaultPermissions('viewer')
  }
}

/**
 * Verifica si el usuario tiene un permiso específico
 */
export async function hasPermission(
  userId: string,
  section: Section,
  permission: Permission
): Promise<boolean> {
  const userPermissions = await getUserPermissions(userId)
  if (!userPermissions) return false

  const sectionPermissions = userPermissions[section]
  if (!sectionPermissions) return false

  // Verificar si el permiso existe en la sección
  if (permission in sectionPermissions) {
    return (sectionPermissions as Record<string, boolean>)[permission] || false
  }

  return false
}

/**
 * Obtiene permisos por defecto según el rol
 */
export function getDefaultPermissions(role: 'admin' | 'editor' | 'viewer'): UserPermissions {
  const basePermissions: UserPermissions = {
    properties: { read: true, create: false, update: false, delete: false },
    inquiries: { read: true, create: false, update: false, delete: false },
    contacts: { read: true, create: false, update: false, delete: false },
    analytics: { read: true },
    users: { read: false, create: false, update: false, delete: false },
    settings: { read: false, update: false }
  }

  if (role === 'admin') {
    return {
      properties: { read: true, create: true, update: true, delete: true },
      inquiries: { read: true, create: true, update: true, delete: true },
      contacts: { read: true, create: true, update: true, delete: true },
      analytics: { read: true },
      users: { read: true, create: true, update: true, delete: true },
      settings: { read: true, update: true }
    }
  }

  if (role === 'editor') {
    return {
      ...basePermissions,
      properties: { read: true, create: true, update: true, delete: false },
      inquiries: { read: true, create: true, update: true, delete: false },
      contacts: { read: true, create: true, update: true, delete: false }
    }
  }

  return basePermissions
}

/**
 * Verifica si el usuario es administrador
 */
export async function isAdmin(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase
      .from('user_roles')
      .select('role, is_active')
      .eq('user_id', userId)
      .single()

    return data?.role === 'admin' && data?.is_active === true
  } catch {
    return false
  }
}

