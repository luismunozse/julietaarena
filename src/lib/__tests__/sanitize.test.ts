import { sanitizeHtml, sanitizeUrl } from '../sanitize'

describe('Sanitize Utilities', () => {
  describe('sanitizeHtml', () => {
    it('permite HTML básico seguro', () => {
      const html = '<p>Test paragraph</p><strong>Bold text</strong>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).toContain('<p>')
      expect(sanitized).toContain('<strong>')
    })

    it('elimina scripts maliciosos', () => {
      const html = '<p>Safe content</p><script>alert("XSS")</script>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).not.toContain('<script>')
      expect(sanitized).toContain('Safe content')
    })

    it('elimina eventos inline', () => {
      const html = '<div onclick="alert(\'XSS\')">Click me</div>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).not.toContain('onclick')
      expect(sanitized).toContain('Click me')
    })

    it('elimina iframes', () => {
      const html = '<p>Content</p><iframe src="evil.com"></iframe>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).not.toContain('<iframe>')
      expect(sanitized).toContain('Content')
    })

    it('maneja strings vacíos', () => {
      const sanitized = sanitizeHtml('')
      expect(sanitized).toBe('')
    })
  })

  describe('sanitizeUrl', () => {
    it('permite URLs HTTP válidas', () => {
      const url = 'http://example.com'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe(url)
    })

    it('permite URLs HTTPS válidas', () => {
      const url = 'https://example.com/path'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe(url)
    })

    it('permite URLs mailto', () => {
      const url = 'mailto:test@example.com'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe(url)
    })

    it('permite URLs tel', () => {
      const url = 'tel:+1234567890'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe(url)
    })

    it('rechaza URLs javascript:', () => {
      const url = 'javascript:alert("XSS")'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe('')
    })

    it('rechaza URLs data:', () => {
      const url = 'data:text/html,<script>alert("XSS")</script>'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe('')
    })

    it('maneja URLs inválidas', () => {
      const url = 'not-a-valid-url'
      const sanitized = sanitizeUrl(url)

      expect(sanitized).toBe('')
    })

    it('maneja strings vacíos', () => {
      const sanitized = sanitizeUrl('')
      expect(sanitized).toBe('')
    })
  })
})



