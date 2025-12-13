import {
  validateAndParse,
  loginCredentialsSchema,
  registerDataSchema,
  contactFormSchema,
  propertySchema,
} from '../validation'
import { z } from 'zod'

describe('Validation Utilities', () => {
  describe('validateAndParse', () => {
    it('valida datos correctos exitosamente', () => {
      const schema = z.object({
        name: z.string().min(2),
        age: z.number().positive(),
      })

      const data = { name: 'John Doe', age: 30 }
      const result = validateAndParse(schema, data)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(data)
      }
    })

    it('rechaza datos inválidos', () => {
      const schema = z.object({
        name: z.string().min(2),
        age: z.number().positive(),
      })

      const data = { name: 'J', age: -5 }
      const result = validateAndParse(schema, data)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBeTruthy()
        expect(result.details).toBeDefined()
      }
    })

    it('usa mensaje de error personalizado', () => {
      const schema = z.object({
        email: z.string().email(),
      })

      const data = { email: 'invalid-email' }
      const result = validateAndParse(schema, data, 'Email inválido')

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toBe('Email inválido')
      }
    })
  })

  describe('loginCredentialsSchema', () => {
    it('valida credenciales correctas', () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const result = loginCredentialsSchema.safeParse(credentials)
      expect(result.success).toBe(true)
    })

    it('rechaza email inválido', () => {
      const credentials = {
        email: 'invalid-email',
        password: 'password123',
      }

      const result = loginCredentialsSchema.safeParse(credentials)
      expect(result.success).toBe(false)
    })

    it('rechaza contraseña muy corta', () => {
      const credentials = {
        email: 'test@example.com',
        password: '12345', // Menos de 6 caracteres
      }

      const result = loginCredentialsSchema.safeParse(credentials)
      expect(result.success).toBe(false)
    })
  })

  describe('registerDataSchema', () => {
    it('valida datos de registro correctos', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '1234567890',
      }

      const result = registerDataSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rechaza nombre muy corto', () => {
      const data = {
        name: 'J', // Menos de 2 caracteres
        email: 'john@example.com',
        password: 'password123',
      }

      const result = registerDataSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('contactFormSchema', () => {
    it('valida formulario de contacto correcto', () => {
      const data = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        phone: '1234567890',
        message: 'This is a test message with enough characters',
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('rechaza mensaje muy corto', () => {
      const data = {
        from_name: 'John Doe',
        from_email: 'john@example.com',
        message: 'Short', // Menos de 10 caracteres
      }

      const result = contactFormSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('propertySchema', () => {
    it('valida propiedad completa correctamente', () => {
      const property = {
        id: 'prop-123',
        title: 'Casa Test',
        description: 'Descripción de la casa',
        price: 100000,
        currency: 'USD' as const,
        location: 'Córdoba',
        type: 'casa' as const,
        area: 100,
        images: ['image1.jpg'],
        features: ['Piscina', 'Jardín'],
        status: 'disponible' as const,
        featured: false,
        operation: 'venta' as const,
      }

      const result = propertySchema.safeParse(property)
      expect(result.success).toBe(true)
    })

    it('rechaza propiedad con precio negativo', () => {
      const property = {
        id: 'prop-123',
        title: 'Casa Test',
        description: 'Descripción',
        price: -1000, // Precio negativo
        currency: 'USD' as const,
        location: 'Córdoba',
        type: 'casa' as const,
        area: 100,
        images: [],
        features: [],
        status: 'disponible' as const,
        featured: false,
        operation: 'venta' as const,
      }

      const result = propertySchema.safeParse(property)
      expect(result.success).toBe(false)
    })
  })
})


