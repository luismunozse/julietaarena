import { emailService } from '../emailService'
import { validateAndParse } from '@/lib/validation'

// Mock del logger
jest.mock('@/lib/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    logEmail: jest.fn(),
    logAuth: jest.fn(),
    logProperties: jest.fn(),
  },
}))

// Mock de validación
jest.mock('@/lib/validation', () => ({
  contactFormSchema: {},
  venderFormSchema: {},
  appointmentFormSchema: {},
  propertyInquirySchema: {},
  validateAndParse: jest.fn((schema, data) => ({
    success: true,
    data,
  })),
}))

// Mock de EmailJS
jest.mock('@emailjs/browser', () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    send: jest.fn(),
  },
}))

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Resetear mock de validación para que por defecto retorne success
    ;(validateAndParse as jest.Mock).mockReturnValue({
      success: true,
      data: {
        from_name: 'Test User',
        from_email: 'test@example.com',
        message: 'Test message',
      },
    })
  })

  describe('sendContactForm', () => {
    it('valida datos antes de enviar', async () => {
      ;(validateAndParse as jest.Mock).mockReturnValue({
        success: false,
        error: 'Datos inválidos',
        details: { issues: [{ message: 'Email inválido' }] },
      })

      const formData = {
        from_name: 'Test',
        from_email: 'invalid-email',
        message: 'Test',
      }

      const result = await emailService.sendContactForm(formData)

      expect(result.success).toBe(false)
      expect(result.message).toContain('inválido')
    })

    it('retorna error cuando EmailJS no está configurado', async () => {
      const formData = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        message: 'Test message with enough characters',
      }

      const result = await emailService.sendContactForm(formData)

      // Debe fallar porque EmailJS no está configurado en tests
      expect(result.success).toBe(false)
    })
  })

  describe('sendVenderForm', () => {
    it('valida datos de formulario vender', async () => {
      ;(validateAndParse as jest.Mock).mockReturnValue({
        success: false,
        error: 'Datos inválidos',
        details: { issues: [{ message: 'Campo requerido' }] },
      })

      const formData = {
        from_name: '',
        from_email: 'test@example.com',
        phone: '1234567890',
        locality: 'Córdoba',
        property_type: 'casa',
      }

      const result = await emailService.sendVenderForm(formData)

      expect(result.success).toBe(false)
    })
  })

  describe('sendAppointmentForm', () => {
    it('valida datos de formulario de cita', async () => {
      ;(validateAndParse as jest.Mock).mockReturnValue({
        success: false,
        error: 'Datos inválidos',
        details: { issues: [{ message: 'Fecha requerida' }] },
      })

      const formData = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        phone: '1234567890',
        property_title: 'Casa Test',
        property_id: 'prop-123',
        date: '',
        time: '10:00',
      }

      const result = await emailService.sendAppointmentForm(formData)

      expect(result.success).toBe(false)
    })
  })

  describe('sendPropertyInquiry', () => {
    it('valida datos de consulta de propiedad', async () => {
      ;(validateAndParse as jest.Mock).mockReturnValue({
        success: false,
        error: 'Datos inválidos',
        details: { issues: [{ message: 'Mensaje muy corto' }] },
      })

      const formData = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        phone: '1234567890',
        property_title: 'Casa Test',
        property_id: 'prop-123',
        property_price: '$100,000',
        property_location: 'Córdoba',
        message: 'Hi',
      }

      const result = await emailService.sendPropertyInquiry(formData)

      expect(result.success).toBe(false)
    })
  })
})
