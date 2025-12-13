/**
 * Sistema de auditoría para registrar todas las acciones importantes del sistema
 */

import { supabase } from './supabaseClient'
import type { User } from '@/types/user'

export type ActionType = 'create' | 'update' | 'delete' | 'assign' | 'status_change' | 'tag_add' | 'tag_remove'
export type EntityType = 'property' | 'property_inquiry' | 'contact_inquiry' | 'user' | 'template'

export interface AuditLog {
  id: string
  created_at: string
  user_id: string | null
  user_email: string | null
  action_type: ActionType
  entity_type: EntityType
  entity_id: string
  changes: Record<string, unknown> | null
  old_values: Record<string, unknown> | null
  new_values: Record<string, unknown> | null
  description: string | null
  ip_address: string | null
  user_agent: string | null
}

export interface AuditLogInput {
  action_type: ActionType
  entity_type: EntityType
  entity_id: string
  changes?: Record<string, unknown>
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  description?: string
}

/**
 * Registra una acción en el log de auditoría
 */
export async function logAuditEvent(
  input: AuditLogInput,
  user?: User | null
): Promise<void> {
  try {
    const user_id = user?.id || null
    const user_email = user?.email || null

    // Obtener información del navegador si está disponible
    const user_agent = typeof window !== 'undefined' ? window.navigator.userAgent : null
    const ip_address = null // En producción, esto debería obtenerse del servidor

    const { error } = await supabase.from('audit_logs').insert({
      user_id,
      user_email,
      action_type: input.action_type,
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      changes: input.changes || null,
      old_values: input.old_values || null,
      new_values: input.new_values || null,
      description: input.description || null,
      ip_address,
      user_agent
    })

    if (error) {
      console.error('Error al registrar evento de auditoría:', error)
      // No lanzar error para no interrumpir el flujo principal
    }
  } catch (err) {
    console.error('Error inesperado al registrar evento de auditoría:', err)
    // No lanzar error para no interrumpir el flujo principal
  }
}

/**
 * Obtiene los logs de auditoría para una entidad específica
 */
export async function getAuditLogs(
  entityType: EntityType,
  entityId: string,
  limit: number = 50
): Promise<AuditLog[]> {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error al obtener logs de auditoría:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error inesperado al obtener logs de auditoría:', err)
    return []
  }
}

/**
 * Obtiene todos los logs de auditoría con filtros opcionales
 */
export async function getAllAuditLogs(filters?: {
  user_id?: string
  action_type?: ActionType
  entity_type?: EntityType
  start_date?: string
  end_date?: string
  limit?: number
}): Promise<AuditLog[]> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id)
    }

    if (filters?.action_type) {
      query = query.eq('action_type', filters.action_type)
    }

    if (filters?.entity_type) {
      query = query.eq('entity_type', filters.entity_type)
    }

    if (filters?.start_date) {
      query = query.gte('created_at', filters.start_date)
    }

    if (filters?.end_date) {
      query = query.lte('created_at', filters.end_date)
    }

    if (filters?.limit) {
      query = query.limit(filters.limit)
    } else {
      query = query.limit(100)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error al obtener logs de auditoría:', error)
      return []
    }

    return data || []
  } catch (err) {
    console.error('Error inesperado al obtener logs de auditoría:', err)
    return []
  }
}

/**
 * Helper para crear un log de cambio de estado
 */
export async function logStatusChange(
  entityType: EntityType,
  entityId: string,
  oldStatus: string,
  newStatus: string,
  user?: User | null
): Promise<void> {
  await logAuditEvent(
    {
      action_type: 'status_change',
      entity_type: entityType,
      entity_id: entityId,
      old_values: { status: oldStatus },
      new_values: { status: newStatus },
      description: `Estado cambiado de "${oldStatus}" a "${newStatus}"`
    },
    user
  )
}

/**
 * Helper para crear un log de asignación
 */
export async function logAssignment(
  entityType: EntityType,
  entityId: string,
  oldAssigneeId: string | null,
  newAssigneeId: string | null,
  user?: User | null
): Promise<void> {
  await logAuditEvent(
    {
      action_type: 'assign',
      entity_type: entityType,
      entity_id: entityId,
      old_values: { assigned_to: oldAssigneeId },
      new_values: { assigned_to: newAssigneeId },
      description: newAssigneeId
        ? `Asignado a usuario ${newAssigneeId}`
        : 'Asignación removida'
    },
    user
  )
}

/**
 * Helper para crear un log de etiquetas
 */
export async function logTagChange(
  entityType: EntityType,
  entityId: string,
  action: 'tag_add' | 'tag_remove',
  tag: string,
  user?: User | null
): Promise<void> {
  await logAuditEvent(
    {
      action_type: action,
      entity_type: entityType,
      entity_id: entityId,
      changes: { tag },
      description: action === 'tag_add' ? `Etiqueta "${tag}" agregada` : `Etiqueta "${tag}" removida`
    },
    user
  )
}
