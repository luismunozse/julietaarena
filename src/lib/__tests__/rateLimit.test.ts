import { rateLimiter, checkRateLimit, RATE_LIMIT_CONFIGS } from '../rateLimit'

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Limpiar estado del rate limiter antes de cada test
    // Las claves se forman como `${userId}:${actionType}` o `${userId}:custom`
    rateLimiter.reset('test-key:custom')
    rateLimiter.reset('key1:custom')
    rateLimiter.reset('key2:custom')
    rateLimiter.reset('reset-test:custom')
    rateLimiter.reset('contact-form')
    rateLimiter.reset('login')
  })

  describe('checkRateLimit', () => {
    it('permite primera solicitud', () => {
      const result = checkRateLimit('test-key', RATE_LIMIT_CONFIGS.contactForm)

      expect(result.allowed).toBe(true)
    })

    it('permite múltiples solicitudes dentro del límite', () => {
      const config = { maxAttempts: 3, windowMs: 60000 }

      // Primeras 3 solicitudes deben ser permitidas
      expect(checkRateLimit('test-key', config).allowed).toBe(true)
      expect(checkRateLimit('test-key', config).allowed).toBe(true)
      expect(checkRateLimit('test-key', config).allowed).toBe(true)

      // La cuarta debe ser rechazada
      const result = checkRateLimit('test-key', config)
      expect(result.allowed).toBe(false)
      expect(result.timeUntilReset).toBeGreaterThan(0)
    })

    it('resetea después de la ventana de tiempo', async () => {
      const config = { maxAttempts: 2, windowMs: 100 } // Ventana muy corta para test

      // Llenar el límite
      checkRateLimit('test-key', config)
      checkRateLimit('test-key', config)

      // Debe estar bloqueado
      expect(checkRateLimit('test-key', config).allowed).toBe(false)

      // Esperar a que expire la ventana
      await new Promise((resolve) => setTimeout(resolve, 150))

      // Debe permitir nuevamente
      expect(checkRateLimit('test-key', config).allowed).toBe(true)
    })

    it('usa diferentes claves independientemente', () => {
      const config = { maxAttempts: 2, windowMs: 60000 }

      // Llenar límite para key1
      checkRateLimit('key1', config)
      checkRateLimit('key1', config)

      // key2 debe seguir funcionando
      expect(checkRateLimit('key2', config).allowed).toBe(true)
      expect(checkRateLimit('key2', config).allowed).toBe(true)

      // key1 debe estar bloqueada
      expect(checkRateLimit('key1', config).allowed).toBe(false)
    })
  })

  describe('RATE_LIMIT_CONFIGS', () => {
    it('tiene configuración para contactForm', () => {
      expect(RATE_LIMIT_CONFIGS.contactForm).toBeDefined()
      expect(RATE_LIMIT_CONFIGS.contactForm.maxAttempts).toBe(3)
      expect(RATE_LIMIT_CONFIGS.contactForm.windowMs).toBe(60000)
    })

    it('tiene configuración para login', () => {
      expect(RATE_LIMIT_CONFIGS.login).toBeDefined()
      expect(RATE_LIMIT_CONFIGS.login.maxAttempts).toBe(5)
      expect(RATE_LIMIT_CONFIGS.login.windowMs).toBe(15 * 60 * 1000)
    })

    it('tiene configuración para register', () => {
      expect(RATE_LIMIT_CONFIGS.register).toBeDefined()
      expect(RATE_LIMIT_CONFIGS.register.maxAttempts).toBe(3)
      expect(RATE_LIMIT_CONFIGS.register.windowMs).toBe(60 * 60 * 1000)
    })

    it('tiene configuración para appointment', () => {
      expect(RATE_LIMIT_CONFIGS.appointment).toBeDefined()
      expect(RATE_LIMIT_CONFIGS.appointment.maxAttempts).toBe(5)
      expect(RATE_LIMIT_CONFIGS.appointment.windowMs).toBe(60000)
    })
  })

  describe('rateLimiter.reset', () => {
    it('resetea el rate limit para una clave específica', () => {
      const config = { maxAttempts: 2, windowMs: 60000 }

      // Llenar límite
      checkRateLimit('reset-test', config)
      checkRateLimit('reset-test', config)

      // Debe estar bloqueado
      expect(checkRateLimit('reset-test', config).allowed).toBe(false)

      // Resetear usando la clave correcta (incluye :custom)
      rateLimiter.reset('reset-test:custom')

      // Debe permitir nuevamente
      expect(checkRateLimit('reset-test', config).allowed).toBe(true)
    })
  })
})


