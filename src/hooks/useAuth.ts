'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { User, UserSession, LoginCredentials, RegisterData, UserPreferences } from '@/types/user'

const AUTH_SESSION_KEY = 'julieta-arena-auth-session'
const USERS_KEY = 'julieta-arena-users'

interface AuthContextType {
  user: User | null
  session: UserSession | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useAuthProvider() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar sesión existente
    const stored = localStorage.getItem(AUTH_SESSION_KEY)
    if (stored) {
      try {
        const sessionData: UserSession = JSON.parse(stored)
        if (new Date(sessionData.expiresAt) > new Date()) {
          setSession(sessionData)
          setUser(sessionData.user)
        } else {
          localStorage.removeItem(AUTH_SESSION_KEY)
        }
      } catch (error) {
        console.error('Error loading auth session:', error)
        localStorage.removeItem(AUTH_SESSION_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  const createUser = (data: RegisterData): User => {
    const defaultPreferences: UserPreferences = {
      theme: 'auto',
      language: 'es',
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      searchFilters: {
        priceRange: { min: 0, max: 1000000 },
        propertyTypes: [],
        locations: [],
        features: []
      }
    }

    return {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      phone: data.phone,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=2c5f7d&color=fff`,
      preferences: defaultPreferences,
      favorites: [],
      appointments: [],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isVerified: false
    }
  }

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  const getUsers = (): User[] => {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  const saveSession = (sessionData: UserSession) => {
    setSession(sessionData)
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionData))
  }

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const users = getUsers()
      const user = users.find(u => u.email === credentials.email)
      
      if (!user) {
        return false
      }

      // En una app real, aquí se validaría la contraseña con el servidor
      // Por ahora, simulamos que cualquier contraseña es válida
      
      const sessionData: UserSession = {
        user: {
          ...user,
          lastLogin: new Date().toISOString()
        },
        token: generateToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
      }

      // Actualizar usuario en la lista
      const updatedUsers = users.map(u => 
        u.id === user.id ? sessionData.user : u
      )
      saveUsers(updatedUsers)

      saveSession(sessionData)
      setUser(sessionData.user)
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const users = getUsers()
      
      // Verificar si el email ya existe
      if (users.some(u => u.email === data.email)) {
        return false
      }

      const newUser = createUser(data)
      const updatedUsers = [...users, newUser]
      saveUsers(updatedUsers)

      // Auto-login después del registro
      const sessionData: UserSession = {
        user: newUser,
        token: generateToken(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }

      saveSession(sessionData)
      setUser(newUser)
      
      return true
    } catch (error) {
      console.error('Register error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setSession(null)
    localStorage.removeItem(AUTH_SESSION_KEY)
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user || !session) return false

    try {
      const updatedUser = { ...user, ...updates }
      const users = getUsers()
      const updatedUsers = users.map(u => 
        u.id === user.id ? updatedUser : u
      )
      saveUsers(updatedUsers)

      const updatedSession = { ...session, user: updatedUser }
      saveSession(updatedSession)
      setUser(updatedUser)
      
      return true
    } catch (error) {
      console.error('Update profile error:', error)
      return false
    }
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!user || !session) return false

    try {
      const updatedPreferences = { ...user.preferences, ...preferences }
      const updatedUser = { ...user, preferences: updatedPreferences }
      
      const users = getUsers()
      const updatedUsers = users.map(u => 
        u.id === user.id ? updatedUser : u
      )
      saveUsers(updatedUsers)

      const updatedSession = { ...session, user: updatedUser }
      saveSession(updatedSession)
      setUser(updatedUser)
      
      return true
    } catch (error) {
      console.error('Update preferences error:', error)
      return false
    }
  }

  return {
    user,
    session,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updatePreferences,
    isAuthenticated: !!user
  }
}
