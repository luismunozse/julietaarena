/**
 * Servicio de logging estructurado
 * Centraliza el logging y permite diferentes niveles y destinos
 * Integrado con Sentry para monitoreo en producción
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  userId?: string
  propertyId?: string
  action?: string
  [key: string]: unknown
}

// Tipo para el cliente de Sentry (se importa dinámicamente si está disponible)
interface SentryClient {
  captureException: (error: Error, context?: Record<string, unknown>) => void
  captureMessage: (message: string, level?: 'info' | 'warning' | 'error') => void
  setUser: (user: { id?: string; email?: string }) => void
  setContext: (key: string, context: Record<string, unknown>) => void
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private sentryClient: SentryClient | null = null

  constructor() {
    // Sentry es una dependencia opcional
    // El webpack alias en next.config.js hace que el módulo sea opcional
    // No intentar importarlo aquí para evitar errores de compilación
    // Si Sentry está instalado, se puede inicializar manualmente más tarde
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    const formattedMessage = this.formatMessage(level, message, context)
    
    // En desarrollo, siempre loguear
    // En producción, solo loguear warn y error
    if (this.isDevelopment || level === 'warn' || level === 'error') {
      switch (level) {
        case 'debug':
          console.debug(formattedMessage)
          break
        case 'info':
          console.info(formattedMessage)
          break
        case 'warn':
          console.warn(formattedMessage, error || '')
          if (this.sentryClient && error && typeof this.sentryClient.captureMessage === 'function') {
            try {
              this.sentryClient.captureMessage(formattedMessage, 'warning')
            } catch {
              // Ignorar errores de Sentry
            }
          }
          break
        case 'error':
          console.error(formattedMessage, error || '')
          // Enviar a Sentry si está disponible
          if (this.sentryClient) {
            try {
              if (error && typeof this.sentryClient.captureException === 'function') {
                this.sentryClient.captureException(error, {
                  extra: context,
                  tags: { level: 'error' },
                })
              } else if (typeof this.sentryClient.captureMessage === 'function') {
                this.sentryClient.captureMessage(formattedMessage, 'error')
              }
            } catch {
              // Ignorar errores de Sentry
            }
          }
          break
      }
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log('warn', message, context, error)
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log('error', message, context, error)
  }

  // Métodos específicos para casos comunes
  logAuth(action: string, userId?: string, error?: Error, details?: LogContext): void {
    if (error) {
      this.error(`Auth error: ${action}`, { userId, action, ...details }, error)
    } else {
      this.info(`Auth: ${action}`, { userId, action, ...details })
    }
    
    // Establecer usuario en Sentry si está disponible
    if (this.sentryClient && userId && typeof this.sentryClient.setUser === 'function') {
      try {
        this.sentryClient.setUser({ id: userId })
      } catch {
        // Ignorar errores de Sentry
      }
    }
  }

  logProperties(action: string, propertyId?: string, error?: Error, details?: LogContext): void {
    if (error) {
      this.error(`Property error: ${action}`, { propertyId, action, ...details }, error)
    } else {
      this.info(`Property: ${action}`, { propertyId, action, ...details })
    }
    
    // Establecer contexto en Sentry
    if (this.sentryClient && propertyId && typeof this.sentryClient.setContext === 'function') {
      try {
        this.sentryClient.setContext('property', { id: propertyId, action })
      } catch (e) {
        // Ignorar errores de Sentry
      }
    }
  }

  logEmail(action: string, status?: 'success' | 'fail', error?: Error, details?: LogContext): void {
    if (error || status === 'fail') {
      this.error(`Email error: ${action}`, { action, status, ...details }, error)
    } else {
      this.info(`Email: ${action}`, { action, status, ...details })
    }
  }

  logUI(action: string, details?: LogContext, userId?: string): void {
    this.info(`UI event: ${action}`, { userId, action, ...details })
  }

  logAnalytics(action: string, details?: LogContext, userId?: string): void {
    this.info(`Analytics event: ${action}`, { userId, action, ...details })
  }

  logApiCall(endpoint: string, method: string, statusCode?: number, error?: Error): void {
    if (error) {
      this.error(`API call failed: ${method} ${endpoint}`, { endpoint, method }, error)
    } else {
      this.info(`API call: ${method} ${endpoint}`, { endpoint, method, statusCode })
    }
  }
}

// Exportar instancia única (singleton)
export const logger = new Logger()
