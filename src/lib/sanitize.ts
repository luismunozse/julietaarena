/**
 * Utilidades de sanitización de HTML
 * Previene ataques XSS sanitizando contenido HTML antes de renderizar
 */

import DOMPurify from 'dompurify'

// Configuración de DOMPurify para permitir solo tags seguros
const sanitizeConfig = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a'],
  ALLOWED_ATTR: ['href', 'title', 'target'],
  ALLOW_DATA_ATTR: false,
}

/**
 * Sanitiza HTML para prevenir XSS
 * @param dirty - HTML sin sanitizar
 * @returns HTML sanitizado seguro para renderizar
 */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // En el servidor, retornar texto plano sin HTML
    return dirty.replace(/<[^>]*>/g, '')
  }
  
  return DOMPurify.sanitize(dirty, sanitizeConfig)
}

/**
 * Sanitiza texto plano (elimina cualquier HTML)
 * @param text - Texto que puede contener HTML
 * @returns Texto plano sin HTML
 */
export function sanitizeText(text: string): string {
  if (typeof window === 'undefined') {
    return text.replace(/<[^>]*>/g, '')
  }
  
  return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
}

/**
 * Sanitiza un objeto con propiedades que pueden contener HTML
 * @param obj - Objeto con propiedades que pueden contener HTML
 * @param fields - Campos que deben ser sanitizados
 * @returns Objeto con campos sanitizados
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const sanitized = { ...obj }

  for (const field of fields) {
    const value = sanitized[field]
    if (typeof value === 'string') {
      sanitized[field] = sanitizeText(value) as T[keyof T]
    }
  }

  return sanitized
}

/**
 * Sanitiza una URL para prevenir ataques XSS
 * Solo permite protocolos seguros: http, https, mailto, tel
 * @param url - URL a sanitizar
 * @returns URL sanitizada o string vacío si es inválida
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const trimmedUrl = url.trim()

  // Protocolos permitidos
  const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:']

  try {
    const parsed = new URL(trimmedUrl)

    if (allowedProtocols.includes(parsed.protocol)) {
      return trimmedUrl
    }

    return ''
  } catch {
    // URL inválida
    return ''
  }
}


