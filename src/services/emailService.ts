import emailjs from '@emailjs/browser'
import { EMAILJS_CONFIG, EMAIL_TEMPLATE } from '@/config/emailjs'

export interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export const sendContactEmail = async (formData: ContactFormData): Promise<boolean> => {
  try {
    // Verificar que las configuraciones estén disponibles
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      throw new Error('EmailJS no está configurado correctamente. Verifica las variables de entorno.')
    }

    // Configurar EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey)

    // Preparar los datos del template
    const templateParams = {
      ...EMAIL_TEMPLATE,
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      service: formData.service,
      message: formData.message,
      reply_to: formData.email,
    }

    // Enviar el email
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams
    )

    console.log('Email enviado exitosamente:', response)
    return true
  } catch (error) {
    console.error('Error al enviar email:', error)
    throw error
  }
}
