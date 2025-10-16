// Configuración de EmailJS
export const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
}

// Template de email para el formulario de contacto
export const EMAIL_TEMPLATE = {
  to_email: 'inmobiliaria72juliarena@gmail.com',
  from_name: '{{name}}',
  from_email: '{{email}}',
  phone: '{{phone}}',
  service: '{{service}}',
  message: '{{message}}',
  reply_to: '{{email}}',
}
