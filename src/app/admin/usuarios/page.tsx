'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import Modal from '@/components/Modal'
import Pagination from '@/components/admin/Pagination'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Pencil, Trash2, Power } from 'lucide-react'

interface UserRole {
  id: string
  user_id: string
  user_email?: string
  user_name?: string
  role: 'admin' | 'editor' | 'viewer'
  permissions: Record<string, unknown>
  is_active: boolean
  created_at: string
  notes?: string
}

const roleVariants: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  editor: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-700',
}

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  editor: 'Editor',
  viewer: 'Visualizador',
}

export default function UsuariosPage() {
  const [users, setUsers] = useState<UserRole[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserRole | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    is_active: true
  })
  const { success, error: showError } = useToast()

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        showError('Error al cargar los usuarios')
        return
      }

      setUsers(data || [])
    } catch {
      showError('Error al cargar los usuarios')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  useEffect(() => {
    void loadUsers()
  }, [loadUsers])

  const handleCreateUser = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.admin?.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: { name: formData.name }
      })

      if (authError || !authData.user) {
        showError('Error al crear el usuario')
        return
      }

      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: formData.role,
          is_active: formData.is_active,
          permissions: getDefaultPermissions(formData.role)
        })

      if (roleError) {
        showError('Error al crear el rol del usuario')
        return
      }

      success('Usuario creado correctamente')
      setShowCreateModal(false)
      setFormData({ email: '', password: '', name: '', role: 'viewer', is_active: true })
      loadUsers()
    } catch {
      showError('Error al crear el usuario')
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      const { error } = await supabase
        .from('user_roles')
        .update({
          role: formData.role,
          is_active: formData.is_active,
          permissions: getDefaultPermissions(formData.role)
        })
        .eq('id', selectedUser.id)

      if (error) {
        showError('Error al actualizar el usuario')
        return
      }

      success('Usuario actualizado correctamente')
      setShowEditModal(false)
      setSelectedUser(null)
      loadUsers()
    } catch {
      showError('Error al actualizar el usuario')
    }
  }

  const handleToggleActive = async (user: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ is_active: !user.is_active })
        .eq('id', user.id)

      if (error) {
        showError('Error al actualizar el estado')
        return
      }

      success(`Usuario ${!user.is_active ? 'activado' : 'desactivado'} correctamente`)
      loadUsers()
    } catch {
      showError('Error al actualizar el estado')
    }
  }

  const handleDeleteUser = async (user: UserRole) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', user.id)

      if (error) {
        showError('Error al eliminar el usuario')
        return
      }

      success('Usuario eliminado correctamente')
      loadUsers()
    } catch {
      showError('Error al eliminar el usuario')
    }
  }

  const getDefaultPermissions = (role: string) => {
    const basePermissions = {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2c5f7d] mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <AdminPageHeader
          title="Gestión de Usuarios"
          subtitle="Administra usuarios y permisos del panel"
          className="mb-0"
        />
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <Pagination
        items={users}
        itemsPerPage={20}
        render={(paginatedItems) => (
          <>
            {paginatedItems.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-4xl mb-4">👥</p>
                <p className="text-muted-foreground">No hay usuarios registrados</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {paginatedItems.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#1a4158]">
                            {user.user_name || user.user_email || `Usuario ${user.user_id.substring(0, 8)}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.user_email || user.user_id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn('font-medium', roleVariants[user.role])}>
                            {roleLabels[user.role]}
                          </Badge>
                          <Badge className={cn(
                            'font-medium',
                            user.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          )}>
                            {user.is_active ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user)
                              setFormData({
                                email: user.user_email || '',
                                password: '',
                                name: user.user_name || '',
                                role: user.role,
                                is_active: user.is_active
                              })
                              setShowEditModal(true)
                            }}
                          >
                            <Pencil className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(user)}
                            className={cn(
                              user.is_active
                                ? 'text-orange-600 border-orange-200 hover:bg-orange-50'
                                : 'text-green-600 border-green-200 hover:bg-green-50'
                            )}
                          >
                            <Power className="h-4 w-4 mr-1" />
                            {user.is_active ? 'Desactivar' : 'Activar'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      />

      {/* Modal crear usuario */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nuevo Usuario"
          type="alert"
          message=""
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as 'admin' | 'editor' | 'viewer' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
              />
              <Label htmlFor="is_active">Usuario activo</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateUser} className="flex-1">
                Crear Usuario
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal editar usuario */}
      {showEditModal && selectedUser && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          title="Editar Usuario"
          type="alert"
          message=""
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as 'admin' | 'editor' | 'viewer' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit_is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
              />
              <Label htmlFor="edit_is_active">Usuario activo</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateUser} className="flex-1">
                Guardar Cambios
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
