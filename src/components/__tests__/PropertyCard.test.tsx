/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react'
import PropertyCard from '../PropertyCard'
import type { Property } from '@/data/properties'
import { ReactNode } from 'react'

// Mock de variables de entorno de Supabase
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

// Mock del router de Next.js
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}))

// Mock de hooks que usa PropertyCard
jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackPropertyView: jest.fn(),
    trackClick: jest.fn(),
    trackContact: jest.fn(),
  }),
}))

jest.mock('@/hooks/useAnimation', () => ({
  useFadeInUp: () => ({
    elementRef: { current: null },
    isVisible: true,
  }),
}))

// Mock del ToastContext
jest.mock('../ToastContainer', () => ({
  ToastProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  useToast: () => ({
    toasts: [],
    showSuccess: jest.fn(),
    showError: jest.fn(),
    showWarning: jest.fn(),
    showInfo: jest.fn(),
    removeToast: jest.fn(),
  }),
}))

// Mock del hook useFavorites
jest.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    isFavorite: jest.fn(() => false),
    toggleFavorite: jest.fn(),
    favorites: [],
  }),
}))

describe('PropertyCard', () => {
  const mockProperty: Property = {
    id: 'test-1',
    title: 'Casa moderna en Nordelta',
    description: 'Hermosa casa de 3 plantas',
    price: 450000,
    location: 'Nordelta, Buenos Aires',
    type: 'casa',
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    coveredArea: 220,
    images: ['https://example.com/image1.jpg'],
    features: ['Piscina', 'Jardín'],
    status: 'disponible',
    featured: true,
    yearBuilt: 2020,
    parking: 2,
    operation: 'venta',
  }

  it('renderiza el título de la propiedad', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Casa moderna en Nordelta')).toBeInTheDocument()
  })

  it('renderiza el precio correctamente', () => {
    render(<PropertyCard property={mockProperty} />)
    // Buscar por texto que contenga parte del precio formateado
    expect(screen.getByText(/450\.000/)).toBeInTheDocument()
  })

  it('renderiza la ubicación', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/Nordelta, Buenos Aires/)).toBeInTheDocument()
  })

  it('muestra las características principales (dormitorios, baños, área)', () => {
    render(<PropertyCard property={mockProperty} />)
    // Buscar texto que contenga los números de dormitorios, baños y área
    expect(screen.getByText(/4 dorm/)).toBeInTheDocument()
    expect(screen.getByText(/3 baños/)).toBeInTheDocument()
    expect(screen.getByText(/280 m²/)).toBeInTheDocument()
  })

  it('muestra badge de "Destacada" cuando featured es true', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/Destacada/i)).toBeInTheDocument()
  })

  it('muestra badge de "Disponible"', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/Disponible/i)).toBeInTheDocument()
  })

  it('renderiza la imagen principal', () => {
    render(<PropertyCard property={mockProperty} />)
    const image = screen.getByAltText(/Casa moderna en Nordelta/i)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg')
  })

  it('renderiza correctamente con las imágenes proporcionadas', () => {
    render(<PropertyCard property={mockProperty} />)
    const image = screen.getByAltText(/Casa moderna en Nordelta/i)
    expect(image).toBeInTheDocument()
  })

  it('muestra el precio formateado', () => {
    const { container } = render(<PropertyCard property={mockProperty} />)
    // Verificar que muestra el precio en USD
    expect(container).toHaveTextContent(/US\$/)
  })
})
