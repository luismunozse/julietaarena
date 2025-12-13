import {
  AppError,
  ValidationError,
  AuthError,
  NetworkError,
  NotFoundError,
  normalizeError,
  getUserFriendlyMessage,
} from '../errors'

describe('Error Classes', () => {
  describe('AppError', () => {
    it('crea error con código y mensaje', () => {
      const error = new AppError('Technical error', 'CUSTOM_CODE', 500)

      expect(error.message).toBe('Technical error')
      expect(error.code).toBe('CUSTOM_CODE')
      expect(error.statusCode).toBe(500)
      expect(error.name).toBe('AppError')
    })

    it('permite contexto opcional', () => {
      const error = new AppError('Error', 'CODE', 400, { userId: '123' })

      expect(error.context).toEqual({ userId: '123' })
    })
  })

  describe('ValidationError', () => {
    it('crea error de validación con campo y detalles', () => {
      const error = new ValidationError('Validation failed', 'email', { invalid: true })

      expect(error.message).toBe('Validation failed')
      expect(error.field).toBe('email')
      expect(error.details).toEqual({ invalid: true })
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.statusCode).toBe(400)
    })
  })

  describe('AuthError', () => {
    it('crea error de autenticación', () => {
      const error = new AuthError('Invalid credentials', 'Wrong password')

      expect(error.message).toBe('Invalid credentials')
      expect(error.reason).toBe('Wrong password')
      expect(error.code).toBe('AUTH_ERROR')
      expect(error.statusCode).toBe(401)
    })
  })

  describe('NetworkError', () => {
    it('crea error de red', () => {
      const originalError = new Error('Connection failed')
      const error = new NetworkError('Network error', originalError)

      expect(error.message).toBe('Network error')
      expect(error.originalError).toBe(originalError)
      expect(error.code).toBe('NETWORK_ERROR')
    })
  })

  describe('NotFoundError', () => {
    it('crea error de recurso no encontrado', () => {
      const error = new NotFoundError('Property', 'prop-123')

      expect(error.message).toContain('Property')
      expect(error.message).toContain('prop-123')
      expect(error.code).toBe('NOT_FOUND')
      expect(error.statusCode).toBe(404)
    })
  })

  describe('normalizeError', () => {
    it('normaliza AppError sin cambios', () => {
      const appError = new AppError('Test error', 'TEST_CODE', 500)
      const normalized = normalizeError(appError)

      expect(normalized).toBe(appError)
    })

    it('normaliza Error genérico a AppError', () => {
      const genericError = new Error('Generic error')
      const normalized = normalizeError(genericError)

      expect(normalized).toBeInstanceOf(AppError)
      expect(normalized.message).toBe('Generic error')
      expect(normalized.code).toBe('UNKNOWN_ERROR')
    })

    it('maneja valores desconocidos', () => {
      const unknown = 'string error'
      const normalized = normalizeError(unknown)

      expect(normalized).toBeInstanceOf(AppError)
      expect(normalized.message).toBe('Error desconocido')
    })
  })

  describe('getUserFriendlyMessage', () => {
    it('retorna mensaje específico para VALIDATION_ERROR', () => {
      const error = new ValidationError('Invalid data', 'email')
      const message = getUserFriendlyMessage(error)

      expect(message).toBeTruthy()
      expect(message).toContain('válidos')
    })

    it('retorna mensaje específico para AUTH_ERROR', () => {
      const error = new AuthError('Unauthorized')
      const message = getUserFriendlyMessage(error)

      expect(message).toContain('permisos')
    })

    it('retorna mensaje específico para NETWORK_ERROR', () => {
      const error = new NetworkError('Connection failed')
      const message = getUserFriendlyMessage(error)

      expect(message).toContain('conexión')
    })

    it('retorna mensaje por defecto para errores desconocidos', () => {
      const error = new Error('Generic error')
      const message = getUserFriendlyMessage(error)

      expect(message).toBeTruthy()
      expect(message.length).toBeGreaterThan(0)
    })
  })
})

