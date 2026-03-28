import { renderHook, waitFor } from '@testing-library/react'
import { useProperties } from '../useProperties'
import { supabase } from '@/lib/supabaseClient'

// Mock de Supabase
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}))

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user' },
    session: null,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateProfile: jest.fn(),
    updatePreferences: jest.fn(),
    isAuthenticated: true,
  }),
}))

jest.mock('@/lib/storage', () => ({
  getPublicImageUrl: jest.fn((value: string) => value),
}))

jest.mock('@/components/ToastContainer', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showWarning: jest.fn(),
    showInfo: jest.fn(),
  }),
}))

jest.mock('@/data/properties', () => ({
  properties: [],
  Property: {},
}))

describe('useProperties Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('inicializa con estado de carga', () => {
    const { result } = renderHook(() => useProperties())

    expect(result.current.isLoading).toBe(true)
  })

  it('tiene las funciones básicas disponibles', async () => {
    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 3000 })

    expect(typeof result.current.getPropertyById).toBe('function')
    expect(typeof result.current.refreshProperties).toBe('function')
    expect(Array.isArray(result.current.properties)).toBe(true)
  })

  it('maneja errores al cargar propiedades', async () => {
    const mockError = { message: 'Error de conexión' }

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      }),
    })

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 3000 })

    expect(result.current.properties).toEqual([])
    expect(result.current.error).toBeTruthy()
  })

  it('retorna undefined para ID inexistente', async () => {
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    })

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    }, { timeout: 3000 })

    const property = result.current.getPropertyById('non-existent')
    expect(property).toBeUndefined()
  })
})
