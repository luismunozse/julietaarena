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

// Mock de las propiedades iniciales
jest.mock('@/data/properties', () => ({
  properties: [],
  Property: {},
}))

describe('useProperties Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Limpiar localStorage
    localStorage.clear()
  })

  it('inicializa con estado de carga', () => {
    const { result } = renderHook(() => useProperties())

    expect(result.current.isLoading).toBe(true)
  })

  it('carga propiedades desde Supabase exitosamente', async () => {
    const mockProperties = [
      {
        id: 'prop-1',
        title: 'Casa Test',
        description: 'Descripción test',
        price: 100000,
        location: 'Test Location',
        type: 'casa',
        area: 100,
        covered_area: 80,
        images: [],
        features: [],
        status: 'disponible',
        featured: false,
        operation: 'venta',
      },
    ]

    // Mock de la respuesta de Supabase
    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockProperties,
          error: null,
        }),
      }),
    })

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.properties).toHaveLength(1)
    expect(result.current.properties[0].title).toBe('Casa Test')
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
    })

    // Debe hacer fallback a localStorage
    expect(result.current.useSupabase).toBe(false)
  })

  it('encuentra una propiedad por ID', async () => {
    const mockProperties = [
      {
        id: 'prop-123',
        title: 'Casa Específica',
        description: 'Test',
        price: 200000,
        location: 'Test',
        type: 'casa',
        area: 150,
        covered_area: 120,
        images: [],
        features: [],
        status: 'disponible',
        featured: false,
        operation: 'venta',
      },
    ]

    ;(supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockProperties,
          error: null,
        }),
      }),
    })

    const { result } = renderHook(() => useProperties())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const property = result.current.getPropertyById('prop-123')
    expect(property).toBeDefined()
    expect(property?.title).toBe('Casa Específica')
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
    })

    const property = result.current.getPropertyById('non-existent')
    expect(property).toBeUndefined()
  })
})
