/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react'
import PropertyCard from '../PropertyCard'
import type { Property } from '@/data/properties'

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
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}))

jest.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    trackPropertyView: jest.fn(),
    trackClick: jest.fn(),
    trackContact: jest.fn(),
  }),
}))

jest.mock('@/hooks/useInView', () => ({
  useInView: () => ({
    ref: { current: null },
    isInView: false,
  }),
}))

jest.mock('@/components/ToastContainer', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  }),
}))

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
    currency: 'USD',
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

  it('renderiza el precio con moneda', () => {
    const { container } = render(<PropertyCard property={mockProperty} />)
    expect(container).toHaveTextContent(/USD/)
    expect(container).toHaveTextContent(/450/)
  })

  it('renderiza la ubicación', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/Nordelta, Buenos Aires/)).toBeInTheDocument()
  })

  it('muestra features con labels legibles', () => {
    const { container } = render(<PropertyCard property={mockProperty} />)
    expect(container).toHaveTextContent(/4/)
    expect(container).toHaveTextContent(/dorm/)
    expect(container).toHaveTextContent(/3/)
    expect(container).toHaveTextContent(/baño/)
    expect(container).toHaveTextContent(/280/)
    expect(container).toHaveTextContent(/m²/)
  })

  it('muestra badge de "Destacada" cuando featured es true', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/Destacada/i)).toBeInTheDocument()
  })

  it('muestra badge de operación', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/Venta/i)).toBeInTheDocument()
  })

  it('renderiza la imagen principal', () => {
    render(<PropertyCard property={mockProperty} />)
    const image = screen.getByAltText(/Casa moderna en Nordelta/i)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg')
  })

  it('muestra el CTA de WhatsApp', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText(/Consultar por WhatsApp/i)).toBeInTheDocument()
  })

  it('muestra tipo de propiedad', () => {
    render(<PropertyCard property={mockProperty} />)
    expect(screen.getByText('Casa')).toBeInTheDocument()
  })
})
