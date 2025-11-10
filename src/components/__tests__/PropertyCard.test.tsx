/* eslint-disable @next/next/no-img-element */
import { render, screen } from '@testing-library/react'
import PropertyCard from '../PropertyCard'
import type { Property } from '@/data/properties'

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
    expect(screen.getByText(/4/)).toBeInTheDocument() // bedrooms
    expect(screen.getByText(/3/)).toBeInTheDocument() // bathrooms
    expect(screen.getByText(/280/)).toBeInTheDocument() // area
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
    const image = screen.getByAlt(/Casa moderna en Nordelta/i)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg')
  })

  it('muestra la imagen de placeholder si no hay imágenes', () => {
    const propertyWithoutImages: Property = {
      ...mockProperty,
      images: [],
    }
    render(<PropertyCard property={propertyWithoutImages} />)
    const image = screen.getByAlt(/Casa moderna en Nordelta/i)
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'))
  })

  it('aplica clase correcta para el tipo de operación', () => {
    const { container } = render(<PropertyCard property={mockProperty} />)
    // Verificar que tiene contenido relacionado con venta
    expect(container).toHaveTextContent(/venta/i)
  })
})
