import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contact from '../Contact'

// Mock Supabase
const mockInsert = jest.fn().mockReturnValue({
  select: jest.fn().mockResolvedValue({ data: [{}], error: null }),
})
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: mockInsert,
    })),
  },
}))

jest.mock('@/components/ToastContainer', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
}))

jest.mock('@/lib/sanitize', () => ({
  sanitizeText: (text: string) => text,
}))

jest.mock('@/lib/errors', () => ({
  normalizeError: (err: unknown) => err,
  getUserFriendlyMessage: () => 'Error',
}))

jest.mock('@/lib/rateLimit', () => ({
  checkRateLimit: () => ({ allowed: true }),
  RATE_LIMIT_CONFIGS: { contactForm: {} },
}))

// Mock fetch for email API
beforeEach(() => {
  (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
})

describe('Contact Form', () => {
  it('renders all form fields', () => {
    render(<Contact />)

    expect(screen.getByPlaceholderText(/María García/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/maria@email.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/3511234567/i)).toBeInTheDocument()
    expect(screen.getByText(/Enviar Mensaje/i)).toBeInTheDocument()
  })

  it('shows validation errors on empty submit', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    await user.click(screen.getByText(/Enviar Mensaje/i))

    await waitFor(() => {
      expect(screen.getByText(/El nombre es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/El email es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/El teléfono es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/Debe seleccionar un servicio/i)).toBeInTheDocument()
      expect(screen.getByText(/El mensaje es requerido/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const emailInput = screen.getByPlaceholderText(/maria@email.com/i)
    await user.type(emailInput, 'invalid-email')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/ingresa un email válido/i)).toBeInTheDocument()
    })
  })

  it('validates phone to 10 digits', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const phoneInput = screen.getByPlaceholderText(/3511234567/i)
    await user.type(phoneInput, '123')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/10 dígitos/i)).toBeInTheDocument()
    })
  })

  it('validates name minimum length', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const nameInput = screen.getByPlaceholderText(/María García/i)
    await user.type(nameInput, 'ab')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/al menos 3 caracteres/i)).toBeInTheDocument()
    })
  })

  it('validates message minimum length', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    const messageInput = screen.getByPlaceholderText(/Contanos en qué podemos ayudarte/i)
    await user.type(messageInput, 'corto')
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText(/al menos 10 caracteres/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    render(<Contact />)

    await user.type(screen.getByPlaceholderText(/María García/i), 'Juan Pérez')
    await user.type(screen.getByPlaceholderText(/maria@email.com/i), 'juan@test.com')
    await user.type(screen.getByPlaceholderText(/3511234567/i), '3511234567')
    await user.selectOptions(screen.getByRole('combobox'), 'venta')
    await user.type(screen.getByPlaceholderText(/Contanos en qué podemos ayudarte/i), 'Me interesa una propiedad en venta en Córdoba')

    await user.click(screen.getByText(/Enviar Mensaje/i))

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
    })
  })

  it('renders contact info cards', () => {
    render(<Contact />)

    expect(screen.getByText('Córdoba, Argentina')).toBeInTheDocument()
    expect(screen.getByText('+54 (351) 307-8376')).toBeInTheDocument()
    expect(screen.getByText('martillerajulietaarena@gmail.com')).toBeInTheDocument()
  })

  it('renders WhatsApp button', () => {
    render(<Contact />)

    expect(screen.getByText(/Escribir por WhatsApp/i)).toBeInTheDocument()
  })
})
