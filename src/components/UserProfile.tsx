'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import styles from './UserProfile.module.css'

export default function UserProfile() {
  const { user, updateProfile, updatePreferences, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  })

  const handleSave = async () => {
    if (!user) return

    const success = await updateProfile({
      name: formData.name,
      phone: formData.phone
    })

    if (success) {
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    })
    setIsEditing(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = async (key: string, value: any) => {
    if (!user) return

    const updatedPreferences = {
      ...user.preferences,
      [key]: value
    }

    await updatePreferences(updatedPreferences)
  }

  if (!user) return null

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.avatarSection}>
          <img 
            src={user.avatar} 
            alt={user.name}
            className={styles.avatar}
          />
          <div className={styles.userInfo}>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.phone && <p>{user.phone}</p>}
          </div>
        </div>
        
        <div className={styles.headerActions}>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className={styles.editBtn}
            >
              ✏️ Editar Perfil
            </button>
          ) : (
            <div className={styles.editActions}>
              <button 
                onClick={handleSave}
                className={styles.saveBtn}
              >
                💾 Guardar
              </button>
              <button 
                onClick={handleCancel}
                className={styles.cancelBtn}
              >
                ❌ Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.section}>
          <h3>Información Personal</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.value}>{user.name}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <p className={styles.value}>{user.email}</p>
            </div>

            <div className={styles.formGroup}>
              <label>Teléfono</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="+54 351 123-4567"
                />
              ) : (
                <p className={styles.value}>{user.phone || 'No especificado'}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Miembro desde</label>
              <p className={styles.value}>
                {new Date(user.createdAt).toLocaleDateString('es-AR')}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Preferencias</h3>
          <div className={styles.preferences}>
            <div className={styles.preferenceGroup}>
              <label>Tema</label>
              <select 
                value={user.preferences.theme}
                onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                className={styles.select}
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="auto">Automático</option>
              </select>
            </div>

            <div className={styles.preferenceGroup}>
              <label>Idioma</label>
              <select 
                value={user.preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className={styles.select}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Notificaciones</h3>
          <div className={styles.notifications}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={user.preferences.notifications.email}
                onChange={(e) => handlePreferenceChange('notifications', {
                  ...user.preferences.notifications,
                  email: e.target.checked
                })}
                className={styles.checkbox}
              />
              <span>Email</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={user.preferences.notifications.push}
                onChange={(e) => handlePreferenceChange('notifications', {
                  ...user.preferences.notifications,
                  push: e.target.checked
                })}
                className={styles.checkbox}
              />
              <span>Push</span>
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={user.preferences.notifications.sms}
                onChange={(e) => handlePreferenceChange('notifications', {
                  ...user.preferences.notifications,
                  sms: e.target.checked
                })}
                className={styles.checkbox}
              />
              <span>SMS</span>
            </label>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Actividad</h3>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{user.favorites.length}</span>
              <span className={styles.statLabel}>Favoritos</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{user.appointments.length}</span>
              <span className={styles.statLabel}>Citas</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>
                {Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
              </span>
              <span className={styles.statLabel}>Días activo</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <button onClick={logout} className={styles.logoutBtn}>
            🚪 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
