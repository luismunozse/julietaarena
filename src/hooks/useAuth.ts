'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'
import { User, UserSession, LoginCredentials, RegisterData, UserPreferences } from '@/types/user'

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
        console.error('Error fetching Supabase session:', error.message)
        setUser(null)
        setSession(null)
      } else {
        applySession(data.session ?? null)
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password
    })

    if (error) {
      console.error('Login error:', error.message)
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
    }

    return true
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          preferences: defaultPreferences
        }
      }
    })

    if (error) {
      console.error('Register error:', error.message)
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
    } else {
      // Sign up may require email verification
      setUser(null)
      setSession(null)
    }

    return true
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Logout error:', error.message)
    }
    setUser(null)
    setSession(null)
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user || !session) return false

    const { error, data } = await supabase.auth.updateUser({
      data: {
        ...user,
        ...updates,
        preferences: user.preferences
      }
    })

    if (error) {
      console.error('Update profile error:', error.message)
      return false
    }

    if (data.user) {
      const mappedUser = mapSupabaseUserToLocalUser(data.user)
      setUser(mappedUser)
      setSession({ ...session, user: mappedUser })
    }

    return true
  }

  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<boolean> => {
    if (!user || !session) return false

    const mergedPreferences = { ...user.preferences, ...preferences }
    const { error, data } = await supabase.auth.updateUser({
      data: {
        ...user,
        preferences: mergedPreferences
      }
    })

    if (error) {
      console.error('Update preferences error:', error.message)
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
    }

    return true
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
