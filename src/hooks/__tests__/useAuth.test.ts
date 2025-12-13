import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuthProvider } from '../useAuth'
import { supabase } from '@/lib/supabaseClient'
import { logger } from '@/lib/logger'
import { useToast } from '@/components/ToastContainer'

// Mock de Supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
      updateUser: jest.fn(),
    },
  },
}))

// Mock del logger
jest.mock('@/lib/logger', () => ({
  logger: {
    logAuth: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}))

// Mock del Toast
jest.mock('@/components/ToastContainer', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
}))

// Mock de validación
jest.mock('@/lib/validation', () => ({
  loginCredentialsSchema: {},
  registerDataSchema: {},
  validateAndParse: jest.fn((schema, data) => ({
    success: true,
    data,
  })),
}))

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('inicializa con estado de carga', () => {
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const { result } = renderHook(() => useAuthProvider())

    expect(result.current.isLoading).toBe(true)
  })

  it('carga sesión existente al inicializar', async () => {
    const mockSession = {
      access_token: 'test-token',
      expires_at: Date.now() / 1000 + 3600,
      expires_in: 3600,
      user: {
        id: 'user-123',
        email: 'test@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        user_metadata: {
          name: 'Test User',
          phone: '1234567890',
        },
      },
    }

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })

    const { result } = renderHook(() => useAuthProvider())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.user).toBeDefined()
    expect(result.current.user?.email).toBe('test@example.com')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('realiza login exitosamente', async () => {
    const mockSession = {
      access_token: 'test-token',
      expires_at: Date.now() / 1000 + 3600,
      expires_in: 3600,
      user: {
        id: 'user-123',
        email: 'test@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        user_metadata: {},
      },
    }

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    })

    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { session: mockSession, user: mockSession.user },
      error: null,
    })

    const { result } = renderHook(() => useAuthProvider())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let loginResult = false
    await act(async () => {
      loginResult = await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      })
    })

    expect(loginResult).toBe(true)
    expect(result.current.isAuthenticated).toBe(true)
    expect(logger.logAuth).toHaveBeenCalledWith('login', 'user-123')
  })

  it('maneja error en login con credenciales inválidas', async () => {
    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    })

    ;(supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Invalid credentials' },
    })

    const { result } = renderHook(() => useAuthProvider())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let loginResult = true
    await act(async () => {
      loginResult = await result.current.login({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      })
    })

    expect(loginResult).toBe(false)
    expect(result.current.isAuthenticated).toBe(false)
    expect(logger.logAuth).toHaveBeenCalledWith(
      'login',
      undefined,
      expect.any(Error)
    )
  })

  it('realiza registro exitosamente', async () => {
    const mockSession = {
      access_token: 'test-token',
      expires_at: Date.now() / 1000 + 3600,
      expires_in: 3600,
      user: {
        id: 'user-123',
        email: 'newuser@example.com',
        email_confirmed_at: null,
        created_at: '2024-01-01T00:00:00Z',
        user_metadata: {
          name: 'New User',
        },
      },
    }

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    })

    ;(supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { session: mockSession, user: mockSession.user },
      error: null,
    })

    const { result } = renderHook(() => useAuthProvider())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let registerResult = false
    await act(async () => {
      registerResult = await result.current.register({
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
        phone: '1234567890',
      })
    })

    expect(registerResult).toBe(true)
    expect(logger.logAuth).toHaveBeenCalledWith('register', 'user-123')
  })

  it('realiza logout exitosamente', async () => {
    const mockSession = {
      access_token: 'test-token',
      expires_at: Date.now() / 1000 + 3600,
      expires_in: 3600,
      user: {
        id: 'user-123',
        email: 'test@example.com',
        email_confirmed_at: '2024-01-01T00:00:00Z',
        created_at: '2024-01-01T00:00:00Z',
        user_metadata: {},
      },
    }

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    })

    ;(supabase.auth.signOut as jest.Mock).mockResolvedValue({
      error: null,
    })

    const { result } = renderHook(() => useAuthProvider())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.isAuthenticated).toBe(true)

    await act(async () => {
      await result.current.logout()
    })

    expect(result.current.isAuthenticated).toBe(false)
    expect(result.current.user).toBeNull()
    expect(logger.logAuth).toHaveBeenCalledWith('logout', 'user-123')
  })

  it('valida credenciales antes de login', async () => {
    const { validateAndParse } = require('@/lib/validation')
    ;(validateAndParse as jest.Mock).mockReturnValue({
      success: false,
      error: 'Email inválido',
      details: { errors: [{ message: 'Email inválido' }] },
    })

    ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    })

    const { result } = renderHook(() => useAuthProvider())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    let loginResult = true
    await act(async () => {
      loginResult = await result.current.login({
        email: 'invalid-email',
        password: '123',
      })
    })

    expect(loginResult).toBe(false)
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled()
  })
})


