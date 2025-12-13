'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { logAssignment } from '@/lib/audit'
import { useAuth } from '@/hooks/useAuth'
import styles from './AssigneeSelector.module.css'

interface User {
  id: string
  email: string
  name?: string
}

interface AssigneeSelectorProps {
  entityType: 'property_inquiry' | 'contact_inquiry'
  entityId: string
  currentAssigneeId: string | null
  onAssigneeChange?: (assigneeId: string | null) => void
}

export default function AssigneeSelector({
  entityType,
  entityId,
  currentAssigneeId,
  onAssigneeChange
}: AssigneeSelectorProps) {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(currentAssigneeId)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const { success, error: showError } = useToast()
  const { user: currentUser } = useAuth()

  const loadUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true)
      
      // Obtener usuarios de auth.users a través de user_roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('is_active', true)

      if (rolesError) {
        console.error('Error al cargar usuarios:', rolesError)
        // Intentar obtener usuarios directamente de auth si hay error
        const { data: authData } = await supabase.auth.admin?.listUsers()
        if (authData?.users) {
          setUsers(
            authData.users.map((u) => ({
              id: u.id,
              email: u.email || '',
              name: u.user_metadata?.name || u.email || 'Usuario'
            }))
          )
        }
        return
      }

      // Obtener información de usuarios desde auth
      // Nota: Esto requiere permisos de admin en Supabase
      // En producción, deberías tener una función edge o API route para esto
      const userIds = rolesData?.map((r) => r.user_id) || []
      
      // Por ahora, usaremos los IDs directamente
      // En producción, necesitarás una función que obtenga los usuarios
      const usersList: User[] = userIds.map((id) => ({
        id,
        email: `usuario-${id.substring(0, 8)}`,
        name: `Usuario ${id.substring(0, 8)}`
      }))

      // Agregar el usuario actual si no está en la lista
      if (currentUser && !usersList.find((u) => u.id === currentUser.id)) {
        usersList.unshift({
          id: currentUser.id,
          email: currentUser.email,
          name: currentUser.name
        })
      }

      setUsers(usersList)
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
      showError('Error al cargar la lista de usuarios')
    } finally {
      setIsLoadingUsers(false)
    }
  }, [currentUser, showError])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  useEffect(() => {
    setSelectedUserId(currentAssigneeId)
  }, [currentAssigneeId])

  const updateAssignee = async (newAssigneeId: string | null) => {
    setIsLoading(true)
    try {
      const tableName = entityType === 'property_inquiry' ? 'property_inquiries' : 'contact_inquiries'
      
      const { error } = await supabase
        .from(tableName)
        .update({ assigned_to: newAssigneeId })
        .eq('id', entityId)

      if (error) {
        console.error('Error al actualizar asignación:', error)
        showError('Error al actualizar la asignación')
        return
      }

      setSelectedUserId(newAssigneeId)
      onAssigneeChange?.(newAssigneeId)
      
      // Registrar en auditoría
      await logAssignment(
        entityType,
        entityId,
        currentAssigneeId,
        newAssigneeId,
        currentUser || undefined
      )
      
      success(newAssigneeId ? 'Asignación actualizada correctamente' : 'Asignación removida')
    } catch (err) {
      console.error('Error:', err)
      showError('Error al actualizar la asignación')
    } finally {
      setIsLoading(false)
    }
  }

  const getAssigneeName = (userId: string | null): string => {
    if (!userId) return 'Sin asignar'
    const user = users.find((u) => u.id === userId)
    return user?.name || user?.email || 'Usuario desconocido'
  }

  return (
    <div className={styles.container}>
      <label className={styles.label}>Asignado a:</label>
      <div className={styles.selector}>
        {isLoadingUsers ? (
          <span className={styles.loading}>Cargando usuarios...</span>
        ) : (
          <>
            <select
              value={selectedUserId || ''}
              onChange={(e) => {
                const newValue = e.target.value || null
                updateAssignee(newValue)
              }}
              className={styles.select}
              disabled={isLoading}
            >
              <option value="">Sin asignar</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            {selectedUserId && (
              <button
                type="button"
                onClick={() => updateAssignee(null)}
                className={styles.removeButton}
                disabled={isLoading}
                title="Remover asignación"
              >
                ×
              </button>
            )}
          </>
        )}
      </div>
      {selectedUserId && (
        <span className={styles.currentAssignee}>
          Actualmente asignado a: <strong>{getAssigneeName(selectedUserId)}</strong>
        </span>
      )}
    </div>
  )
}
