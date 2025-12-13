/**
 * Helper para logging de debug que escribe directamente al archivo
 * como fallback si el servidor HTTP no está disponible
 */

const LOG_PATH = '.cursor/debug.log'
const SERVER_ENDPOINT = 'http://127.0.0.1:7242/ingest/6b827b36-c979-4953-9852-a2075bf41759'

interface DebugLogEntry {
  location: string
  message: string
  data?: Record<string, unknown>
  timestamp: number
  sessionId: string
  runId: string
  hypothesisId: string
}

/**
 * Escribe un log de debug
 * Intenta enviar al servidor HTTP primero, si falla escribe directamente al archivo
 */
export function debugLog(entry: DebugLogEntry): void {
  if (typeof window === 'undefined') {
    // En el servidor, solo escribir al archivo
    writeToFile(entry)
    return
  }

  // En el cliente, intentar HTTP primero
  fetch(SERVER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  }).catch(() => {
    // Si falla HTTP, escribir directamente al archivo (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      writeToFile(entry)
    }
  })
}

/**
 * Escribe directamente al archivo de log (fallback)
 * En el navegador, solo loguea a consola ya que no podemos escribir archivos directamente
 */
function writeToFile(entry: DebugLogEntry): void {
  try {
    // En el navegador, solo loguear a consola
    // El servidor de logging debería capturar estos logs desde la consola
    if (typeof window !== 'undefined') {
      console.debug('[DEBUG]', JSON.stringify(entry))
      return
    }

    // En Node.js (servidor), escribir al archivo solo si estamos en desarrollo
    if (process.env.NODE_ENV === 'development') {
      const fs = require('fs')
      const path = require('path')
      const logFile = path.join(process.cwd(), LOG_PATH)
      const logLine = JSON.stringify(entry) + '\n'
      
      // Crear directorio si no existe
      const logDir = path.dirname(logFile)
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }
      
      // Escribir al archivo (append)
      fs.appendFileSync(logFile, logLine, 'utf8')
    }
  } catch (err) {
    // Si todo falla, al menos loguear a consola
    console.error('[DEBUG LOG ERROR]', err)
    console.debug('[DEBUG]', JSON.stringify(entry))
  }
}

