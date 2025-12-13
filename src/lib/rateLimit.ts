/**
 * Sistema de rate limiting para prevenir abuso
 */

interface RateLimitConfig {
  maxRequests?: number
  maxAttempts?: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Almacenamiento en memoria (en producción, usar Redis o similar)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Configuraciones por tipo de acción
const rateLimitConfigs: Record<string, RateLimitConfig> = {
  create: { maxRequests: 10, windowMs: 60000 }, // 10 por minuto
  update: { maxRequests: 30, windowMs: 60000 }, // 30 por minuto
  delete: { maxRequests: 5, windowMs: 60000 }, // 5 por minuto
  bulk: { maxRequests: 5, windowMs: 60000 }, // 5 por minuto
  export: { maxRequests: 3, windowMs: 60000 }, // 3 por minuto
  default: { maxRequests: 60, windowMs: 60000 } // 60 por minuto
}

// Exportar configuraciones para compatibilidad con código existente
export const RATE_LIMIT_CONFIGS = {
  contactForm: { maxAttempts: 3, windowMs: 60000 },
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  register: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  appointment: { maxAttempts: 5, windowMs: 60000 }
}

/**
 * Verifica si una acción está permitida según el rate limit
 */
export function checkRateLimit(
  userId: string,
  actionType: string | RateLimitConfig = 'default'
): { allowed: boolean; remaining: number; resetTime: number; timeUntilReset?: number } {
  // Si se pasa un objeto de configuración directamente (compatibilidad con código antiguo)
  let config: RateLimitConfig
  if (typeof actionType === 'object') {
    config = actionType
  } else {
    config = rateLimitConfigs[actionType] || rateLimitConfigs.default
  }
  
  const maxAttempts = config.maxAttempts ?? config.maxRequests ?? 60
  const key = `${userId}:${typeof actionType === 'string' ? actionType : 'custom'}`
  const now = Date.now()

  let entry = rateLimitStore.get(key)

  // Si no existe o expiró, crear nueva entrada
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.windowMs
    }
    rateLimitStore.set(key, entry)
  }

  // Incrementar contador
  entry.count++

  const allowed = entry.count <= maxAttempts
  const remaining = Math.max(0, maxAttempts - entry.count)
  const timeUntilReset = Math.max(0, entry.resetTime - now)

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
    timeUntilReset
  }
}

/**
 * Limpia entradas expiradas del store
 */
export function cleanupRateLimit(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Limpiar entradas expiradas cada minuto
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimit, 60000)
}

/**
 * Resetea el rate limit para una clave específica
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

/**
 * Objeto rateLimiter para compatibilidad con código existente
 */
export const rateLimiter = {
  reset: resetRateLimit
}

/**
 * Hook para usar rate limiting en componentes
 */
export function useRateLimit(userId: string | undefined, actionType: string = 'default') {
  const check = () => {
    if (!userId) return { allowed: false, remaining: 0, resetTime: 0 }
    return checkRateLimit(userId, actionType)
  }

  return { check }
}
