'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { logAssignment } from '@/lib/audit'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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

      // Obtener usuarios de auth.users a traves de user_roles
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

      // Obtener informacion de usuarios desde auth
      // Nota: Esto requiere permisos de admin en Supabase
      // En produccion, deberias tener una funcion edge o API route para esto
      const userIds = rolesData?.map((r) => r.user_id) || []

      // Por ahora, usaremos los IDs directamente
      // En produccion, necesitaras una funcion que obtenga los usuarios
      const usersList: User[] = userIds.map((id) => ({
        id,
        email: `usuario-${id.substring(0, 8)}`,
        name: `Usuario ${id.substring(0, 8)}`
      }))

      // Agregar el usuario actual si no esta en la lista
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
        console.error('Error al actualizar asignacion:', error)
        showError('Error al actualizar la asignacion')
        return
      }

      setSelectedUserId(newAssigneeId)
      onAssigneeChange?.(newAssigneeId)

      // Registrar en auditoria
      await logAssignment(
        entityType,
        entityId,
        currentAssigneeId,
        newAssigneeId,
        currentUser || undefined
      )

      success(newAssigneeId ? 'Asignacion actualizada correctamente' : 'Asignacion removida')
    } catch (err) {
      console.error('Error:', err)
      showError('Error al actualizar la asignacion')
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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">Asignado a:</label>
      <div className="flex gap-2 items-center">
        {isLoadingUsers ? (
          <span className="text-sm italic text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cargando usuarios...
          </span>
        ) : (
          <>
            <select
              value={selectedUserId || ''}
              onChange={(e) => {
                const newValue = e.target.value || null
                updateAssignee(newValue)
              }}
              className={cn(
                "flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm",
                "transition-colors cursor-pointer",
                "hover:border-muted-foreground/50",
                "focus:outline-none focus:border-ring focus:ring-ring/50 focus:ring-[3px]",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
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
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => updateAssignee(null)}
                disabled={isLoading}
                title="Remover asignacion"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </div>
      {selectedUserId && (
        <span className="text-xs text-muted-foreground">
          Actualmente asignado a: <strong>{getAssigneeName(selectedUserId)}</strong>
        </span>
      )}
    </div>
  )
}
