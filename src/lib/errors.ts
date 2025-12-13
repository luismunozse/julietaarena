/**
 * Tipos de error específicos y utilidades para manejo de errores
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public context?: Record<string, unknown>
  ) {
    super(message)
    this.name = 'AppError'
    // Mantener el stack trace correcto
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string, public details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400, { field, details })
    this.name = 'ValidationError'
  }
}

export class AuthError extends AppError {
  constructor(message: string, public reason?: string) {
    super(message, 'AUTH_ERROR', 401, { reason })
    this.name = 'AuthError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(`${resource} no encontrado${id ? `: ${id}` : ''}`, 'NOT_FOUND', 404, { resource, id })
    this.name = 'NotFoundError'
  }
}

export class NetworkError extends AppError {
  constructor(message: string, public originalError?: Error) {
    super(message, 'NETWORK_ERROR', 0, { originalError: originalError?.message })
    this.name = 'NetworkError'
  }
}

/**
 * Convierte un error desconocido a AppError
 */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, { originalError: error.message })
  }
  
  return new AppError('Error desconocido', 'UNKNOWN_ERROR', 500)
}

/**
 * Obtiene un mensaje de error amigable para mostrar al usuario
 */
export function getUserFriendlyMessage(error: unknown): string {
  const normalized = normalizeError(error)
  
  // Mensajes específicos por código de error (siempre en español para el usuario)
  switch (normalized.code) {
    case 'VALIDATION_ERROR':
      return 'Los datos proporcionados no son válidos'
    case 'AUTH_ERROR':
      return 'No tienes permisos para realizar esta acción'
    case 'NOT_FOUND':
      return 'El recurso solicitado no existe'
    case 'NETWORK_ERROR':
      return 'Error de conexión. Por favor, verifica tu conexión a internet'
    default:
      return normalized.message || 'Ocurrió un error inesperado. Por favor, intenta nuevamente'
  }
}


