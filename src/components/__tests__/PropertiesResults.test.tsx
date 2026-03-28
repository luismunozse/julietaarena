import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PropertiesResults from '../PropertiesResults'
import type { Property } from '@/data/properties'

const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Casa en Nueva Córdoba',
    description: 'Hermosa casa',
    price: 150000,
    currency: 'USD',
    location: 'Nueva Córdoba, Córdoba',
    type: 'casa',
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    images: ['img1.jpg'],
    features: ['Piscina'],
    status: 'disponible',
    featured: true,
    operation: 'venta',
  },
  {
    id: '2',
    title: 'Departamento Centro',
    description: 'Moderno depto',
    price: 80000,
    currency: 'USD',
    location: 'Centro, Córdoba',
    type: 'departamento',
    bedrooms: 1,
    bathrooms: 1,
    area: 50,
    images: ['img2.jpg'],
    features: [],
    status: 'disponible',
    featured: false,
    operation: 'venta',
  },
  {
    id: '3',
    title: 'Local Comercial',
    description: 'Amplio local',
    price: 1200,
    currency: 'USD',
    location: 'Centro, Córdoba',
    type: 'local',
    bedrooms: 0,
    bathrooms: 1,
    area: 80,
    images: [],
    features: [],
    status: 'disponible',
    featured: false,
    operation: 'alquiler',
  },
]

const mockPush = jest.fn()
let mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}))

jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
    })),
  },
}))

jest.mock('@/hooks/useProperties', () => ({
  useProperties: () => ({
    properties: mockProperties,
    isLoading: false,
  }),
}))

jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackEvent: jest.fn(),
    trackPropertyView: jest.fn(),
    trackClick: jest.fn(),
    trackContact: jest.fn(),
    trackSearch: jest.fn(),
  }),
}))

jest.mock('@/hooks/useUXMetrics', () => ({
  useUXMetrics: () => ({
    trackCustomMetric: jest.fn(),
    trackEmptyState: jest.fn(),
  }),
}))

jest.mock('@/components/ToastContainer', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
}))

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    session: null,
    isLoading: false,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    updateProfile: jest.fn(),
    updatePreferences: jest.fn(),
    isAuthenticated: false,
  }),
}))

jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: jest.fn(() => false),
    toggleFavorite: jest.fn(),
    favorites: [],
  }),
}))

jest.mock('@/hooks/useAnimation', () => ({
  useFadeInUp: () => ({
    elementRef: { current: null },
    isVisible: true,
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}))

jest.mock('@/components/PropertyMap', () => ({
  __esModule: true,
  default: () => <div data-testid="property-map">Map</div>,
}))

jest.mock('@/components/PropertyCardList', () => ({
  __esModule: true,
  default: ({ property }: { property: { title: string } }) => <div>{property.title} (list)</div>,
}))

jest.mock('@/components/SkeletonLoader', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}))

jest.mock('@/components/EmptyState', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}))

describe('PropertiesResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams = new URLSearchParams()
  })

  it('renders properties in venta tab by default', () => {
    render(<PropertiesResults />)

    expect(screen.getAllByText(/Casa en Nueva Córdoba/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Departamento Centro/i).length).toBeGreaterThan(0)
  })

  it('shows property count', () => {
    render(<PropertiesResults />)

    // The count and label might be in separate elements
    expect(screen.getByText(/encontrada/i)).toBeInTheDocument()
  })

  it('switches to alquiler tab', async () => {
    const user = userEvent.setup()
    render(<PropertiesResults />)

    await user.click(screen.getByText('Alquilar'))

    await waitFor(() => {
      expect(screen.getAllByText(/Local Comercial/i).length).toBeGreaterThan(0)
    })
  })

  it('filters by property type', async () => {
    const user = userEvent.setup()
    render(<PropertiesResults />)

    const typeSelect = screen.getAllByRole('combobox')[0]
    await user.selectOptions(typeSelect, 'departamento')

    await waitFor(() => {
      expect(screen.getAllByText(/Departamento Centro/i).length).toBeGreaterThan(0)
    })
  })

  it('searches by text', async () => {
    const user = userEvent.setup()
    render(<PropertiesResults />)

    const searchInput = screen.getByPlaceholderText(/Buscar por barrio/i)
    await user.type(searchInput, 'Nueva Córdoba')

    await waitFor(() => {
      expect(screen.getAllByText(/Casa en Nueva Córdoba/i).length).toBeGreaterThan(0)
    }, { timeout: 1000 })
  })

  it('reads operation from URL params', () => {
    mockSearchParams = new URLSearchParams('operation=alquiler')
    render(<PropertiesResults />)

    expect(screen.getAllByText(/Local Comercial/i).length).toBeGreaterThan(0)
  })

  it('shows empty state when no results match', async () => {
    const user = userEvent.setup()
    render(<PropertiesResults />)

    const searchInput = screen.getByPlaceholderText(/Buscar por barrio/i)
    await user.type(searchInput, 'ubicacion inexistente xyz')

    await waitFor(() => {
      expect(screen.getByText(/No se encontraron propiedades/i)).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('clears filters on reset button click', async () => {
    const user = userEvent.setup()
    render(<PropertiesResults />)

    // Apply a filter first
    const typeSelect = screen.getAllByRole('combobox')[0]
    await user.selectOptions(typeSelect, 'departamento')

    // Click clear filters
    const clearButton = await screen.findByText(/Limpiar filtros/i)
    await user.click(clearButton)

    await waitFor(() => {
      expect(screen.getAllByText(/Casa en Nueva Córdoba/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Departamento Centro/i).length).toBeGreaterThan(0)
    })
  })
})
