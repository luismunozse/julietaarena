'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { useRouter } from 'next/navigation'
import Modal from '@/components/Modal'
import Pagination from '@/components/admin/Pagination'
import styles from './page.module.css'

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
  const router = useRouter()

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error al cargar usuarios:', error)
        showError('Error al cargar los usuarios')
        return
      }

      // En producción, aquí deberías hacer un join con auth.users para obtener emails
      // Por ahora, usamos los datos disponibles
      setUsers(data || [])
    } catch (err) {
      console.error('Error:', err)
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
      // Crear usuario en auth
      const { data: authData, error: authError } = await supabase.auth.admin?.createUser({
        email: formData.email,
        password: formData.password,
        email_confirm: true,
        user_metadata: {
          name: formData.name
        }
      })

      if (authError || !authData.user) {
        console.error('Error al crear usuario:', authError)
        showError('Error al crear el usuario')
        return
      }

      // Crear rol
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: authData.user.id,
          role: formData.role,
          is_active: formData.is_active,
          permissions: getDefaultPermissions(formData.role)
        })

      if (roleError) {
        console.error('Error al crear rol:', roleError)
        showError('Error al crear el rol del usuario')
        return
      }

      success('Usuario creado correctamente')
      setShowCreateModal(false)
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'viewer',
        is_active: true
      })
      loadUsers()
    } catch (err) {
      console.error('Error:', err)
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
        console.error('Error al actualizar usuario:', error)
        showError('Error al actualizar el usuario')
        return
      }

      success('Usuario actualizado correctamente')
      setShowEditModal(false)
      setSelectedUser(null)
      loadUsers()
    } catch (err) {
      console.error('Error:', err)
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
        console.error('Error al actualizar estado:', error)
        showError('Error al actualizar el estado')
        return
      }

      success(`Usuario ${!user.is_active ? 'activado' : 'desactivado'} correctamente`)
      loadUsers()
    } catch (err) {
      console.error('Error:', err)
      showError('Error al actualizar el estado')
    }
  }

  const handleDeleteUser = async (user: UserRole) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar este usuario?`)) return

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', user.id)

      if (error) {
        console.error('Error al eliminar usuario:', error)
        showError('Error al eliminar el usuario')
        return
      }

      success('Usuario eliminado correctamente')
      loadUsers()
    } catch (err) {
      console.error('Error:', err)
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

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return styles.roleAdmin
      case 'editor': return styles.roleEditor
      case 'viewer': return styles.roleViewer
      default: return ''
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador'
      case 'editor': return 'Editor'
      case 'viewer': return 'Visualizador'
      default: return role
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Usuarios</h1>
          <p className={styles.subtitle}>Administra usuarios y permisos del panel</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className={styles.createButton}
        >
          + Nuevo Usuario
        </button>
      </div>

      <Pagination
        items={users}
        itemsPerPage={20}
        render={(paginatedItems) => (
          <>
            {paginatedItems.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyIcon}>👥</p>
                <p className={styles.emptyText}>No hay usuarios registrados</p>
              </div>
            ) : (
              <div className={styles.usersList}>
                {paginatedItems.map((user) => (
                  <div key={user.id} className={styles.userCard}>
                    <div className={styles.userInfo}>
                      <div>
                        <h3 className={styles.userName}>
                          {user.user_name || user.user_email || `Usuario ${user.user_id.substring(0, 8)}`}
                        </h3>
                        <p className={styles.userEmail}>{user.user_email || user.user_id}</p>
                      </div>
                      <div className={styles.userMeta}>
                        <span className={`${styles.roleBadge} ${getRoleBadgeClass(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                        <span className={`${styles.statusBadge} ${user.is_active ? styles.statusActive : styles.statusInactive}`}>
                          {user.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                    <div className={styles.userActions}>
                      <button
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
                        className={styles.editButton}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={styles.toggleButton}
                      >
                        {user.is_active ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className={styles.deleteButton}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
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
          <div className={styles.modalContent}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles.input}
                placeholder="usuario@ejemplo.com"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Contraseña</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
                placeholder="Nombre completo"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' | 'viewer' })}
                className={styles.select}
              >
                <option value="viewer">Visualizador</option>
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                Usuario activo
              </label>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleCreateUser} className={styles.saveButton}>
                Crear Usuario
              </button>
              <button onClick={() => setShowCreateModal(false)} className={styles.cancelButton}>
                Cancelar
              </button>
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
          <div className={styles.modalContent}>
            <div className={styles.formGroup}>
              <label>Rol</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' | 'viewer' })}
                className={styles.select}
              >
                <option value="viewer">Visualizador</option>
                <option value="editor">Editor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                Usuario activo
              </label>
            </div>
            <div className={styles.modalActions}>
              <button onClick={handleUpdateUser} className={styles.saveButton}>
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
                className={styles.cancelButton}
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
