export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  preferences: UserPreferences
  favorites: string[]
  appointments: string[]
  createdAt: string
  lastLogin: string
  isVerified: boolean
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'es' | 'en'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  searchFilters: {
    priceRange: { min: number; max: number }
    propertyTypes: string[]
    locations: string[]
    features: string[]
  }
}

export interface UserProfile {
  personalInfo: {
    name: string
    email: string
    phone?: string
    avatar?: string
  }
  preferences: UserPreferences
  activity: {
    lastLogin: string
    totalSearches: number
    favoritesCount: number
    appointmentsCount: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
}

export interface UserSession {
  user: User
  token: string
  expiresAt: string
}
