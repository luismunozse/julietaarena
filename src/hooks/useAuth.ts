'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { User, UserSession, LoginCredentials, RegisterData, UserPreferences } from '@/types/user'
import { loginCredentialsSchema, registerDataSchema, validateAndParse } from '@/lib/validation'
import { logger } from '@/lib/logger'
import { AuthError, normalizeError, getUserFriendlyMessage } from '@/lib/errors'
import { useToast } from '@/components/ToastContainer'


interface AuthContextType {
  user: User | null
  session: UserSession | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<boolean>
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

const clonePreferences = (prefs?: UserPreferences): UserPreferences =>
  JSON.parse(JSON.stringify(prefs ?? defaultPreferences))

const mapSupabaseUserToLocalUser = (authUser: SupabaseUser): User => {
  const metadata = authUser.user_metadata || {}

  return {
    id: authUser.id,
    email: authUser.email || '',
    name: metadata.name || authUser.email || 'Usuario',
    phone: metadata.phone,
    avatar:
      metadata.avatar ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(metadata.name || authUser.email || 'Usuario')}&background=2c5f7d&color=fff`,
    preferences: clonePreferences(metadata.preferences),
    favorites: metadata.favorites || [],
    appointments: metadata.appointments || [],
    createdAt: authUser.created_at,
    lastLogin: new Date().toISOString(),
    isVerified: Boolean(authUser.email_confirmed_at)
  }
}

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
  const { error: showErrorToast, success: showSuccessToast } = useToast()

  useEffect(() => {
    let isMounted = true

    const applySession = (supabaseSession: Session | null) => {
      if (!supabaseSession) {
        setUser(null)
        setSession(null)
        return
      }

      const mappedUser = mapSupabaseUserToLocalUser(supabaseSession.user)
      setUser(mappedUser)
      setSession({
        user: mappedUser,
        token: supabaseSession.access_token,
        expiresAt: supabaseSession.expires_at
          ? new Date(supabaseSession.expires_at * 1000).toISOString()
          : new Date(Date.now() + (supabaseSession.expires_in || 3600) * 1000).toISOString()
      })
    }

    const syncSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!isMounted) return

      if (error) {
        const authError = new AuthError(error.message, error.message)
        logger.logAuth('getSession', undefined, authError)
        setUser(null)
        setSession(null)
      } else {
        applySession(data.session ?? null)
        if (data.session) {
          logger.logAuth('sessionRestored', data.session.user.id)
        }
      }

      setIsLoading(false)
    }

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      applySession(newSession)
    })

    void syncSession()

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // Validar credenciales antes de enviarlas
      const validation = validateAndParse(loginCredentialsSchema, credentials, 'Credenciales inválidas')
      if (!validation.success) {
        const errorMessage = ('details' in validation && validation.details?.issues?.[0]?.message) || 'Credenciales inválidas'
        logger.logAuth('login', undefined, new Error(errorMessage))
        showErrorToast(errorMessage)
        return false
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validation.data.email,
        password: validation.data.password
      })

      if (error) {
        const authError = new AuthError(error.message, error.message)
        logger.logAuth('login', undefined, authError)
        showErrorToast(getUserFriendlyMessage(authError))
        return false
      }

      if (data.session) {
        const mappedUser = mapSupabaseUserToLocalUser(data.session.user)
        setUser(mappedUser)
        setSession({
          user: mappedUser,
          token: data.session.access_token,
          expiresAt: data.session.expires_at
            ? new Date(data.session.expires_at * 1000).toISOString()
            : new Date(Date.now() + (data.session.expires_in || 3600) * 1000).toISOString()
        })
        logger.logAuth('login', mappedUser.id)
        showSuccessToast('Sesión iniciada correctamente')
      }

      return true
    } catch (err) {
      const error = normalizeError(err)
      logger.logAuth('login', undefined, error)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Validar datos antes de enviarlos
      const validation = validateAndParse(registerDataSchema, data, 'Datos de registro inválidos')
      if (!validation.success) {
        const errorMessage = ('details' in validation && validation.details?.issues?.[0]?.message) || 'Datos de registro inválidos'
        logger.logAuth('register', undefined, new Error(errorMessage))
        showErrorToast(errorMessage)
        return false
      }

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: validation.data.email,
        password: validation.data.password,
        options: {
          data: {
            name: validation.data.name,
            phone: validation.data.phone,
            preferences: defaultPreferences
          }
        }
      })

      if (error) {
        const authError = new AuthError(error.message, error.message)
        logger.logAuth('register', undefined, authError)
        showErrorToast(getUserFriendlyMessage(authError))
        return false
      }

      if (signUpData.session) {
        const mappedUser = mapSupabaseUserToLocalUser(signUpData.session.user)
        setUser(mappedUser)
        setSession({
          user: mappedUser,
          token: signUpData.session.access_token,
          expiresAt: signUpData.session.expires_at
            ? new Date(signUpData.session.expires_at * 1000).toISOString()
            : new Date(Date.now() + (signUpData.session.expires_in || 3600) * 1000).toISOString()
        })
        logger.logAuth('register', mappedUser.id)
        showSuccessToast('Registro exitoso')
      } else {
        // Sign up may require email verification
        setUser(null)
        setSession(null)
        logger.info('Registration requires email verification', { email: validation.data.email })
        showSuccessToast('Registro exitoso. Por favor verifica tu email.')
      }

      return true
    } catch (err) {
      const error = normalizeError(err)
      logger.logAuth('register', undefined, error)
      return false
    }
  }

  const logout = async () => {
    try {
      const userId = user?.id
      const { error } = await supabase.auth.signOut()
      if (error) {
        const authError = new AuthError(error.message, error.message)
        logger.logAuth('logout', userId, authError)
      } else {
        logger.logAuth('logout', userId)
      }
      setUser(null)
      setSession(null)
    } catch (err) {
      const error = normalizeError(err)
      logger.logAuth('logout', user?.id, error)
      // Aún así, limpiar el estado local
      setUser(null)
      setSession(null)
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user || !session) {
      logger.warn('Update profile called without user or session')
      return false
    }

    try {
      const { error, data } = await supabase.auth.updateUser({
        data: {
          ...user,
          ...updates,
          preferences: user.preferences
        }
      })

      if (error) {
        const authError = new AuthError(error.message, error.message)
        logger.logAuth('updateProfile', user.id, authError)
        return false
      }

      if (data.user) {
        const mappedUser = mapSupabaseUserToLocalUser(data.user)
        setUser(mappedUser)
        setSession({ ...session, user: mappedUser })
        logger.logAuth('updateProfile', user.id)
      }

      return true
    } catch (err) {
      const error = normalizeError(err)
      logger.logAuth('updateProfile', user.id, error)
      return false
    }
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!user || !session) {
      logger.warn('Update preferences called without user or session')
      return false
    }

    try {
      const mergedPreferences = { ...user.preferences, ...preferences }
      const { error, data } = await supabase.auth.updateUser({
        data: {
          ...user,
          preferences: mergedPreferences
        }
      })

      if (error) {
        const authError = new AuthError(error.message, error.message)
        logger.logAuth('updatePreferences', user.id, authError)
        return false
      }

      if (data.user) {
        const mappedUser = mapSupabaseUserToLocalUser({
          ...data.user,
          user_metadata: {
            ...data.user.user_metadata,
            preferences: mergedPreferences
          }
        } as SupabaseUser)
        setUser(mappedUser)
        setSession({ ...session, user: mappedUser })
        logger.logAuth('updatePreferences', user.id)
      }

      return true
    } catch (err) {
      const error = normalizeError(err)
      logger.logAuth('updatePreferences', user.id, error)
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
