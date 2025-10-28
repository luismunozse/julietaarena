import emailjs from '@emailjs/browser'

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
  templates: {
    contact: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT || '',
    vender: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_VENDER || '',
    appointment: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_APPOINTMENT || '',
    propertyInquiry: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_PROPERTY || '',
  }
}

// Inicializar EmailJS con la clave pública
if (EMAILJS_CONFIG.publicKey) {
  emailjs.init(EMAILJS_CONFIG.publicKey)
}

// Tipos de datos para cada formulario
export interface ContactFormData {
  from_name: string
  from_email: string
  phone?: string
  message: string
}

export interface VenderFormData {
  from_name: string
  from_email: string
  phone: string
  locality: string
  property_type: string
  comments?: string
}

export interface AppointmentFormData {
  from_name: string
  from_email: string
  phone: string
  property_title: string
  property_id: string
  date: string
  time: string
  comments?: string
}

export interface PropertyInquiryData {
  from_name: string
  from_email: string
  phone: string
  property_title: string
  property_id: string
  property_price: string
  property_location: string
  message: string
}

// Servicio de Email
class EmailService {
  private isConfigured(): boolean {
    return !!(EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.publicKey)
  }

  private logError(formType: string, error: any) {
    console.error(`[EmailService] Error enviando ${formType}:`, error)
  }

  /**
   * Enviar formulario de contacto general
   */
  async sendContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'EmailJS no está configurado correctamente. Por favor, contactanos por WhatsApp.'
      }
    }

    if (!EMAILJS_CONFIG.templates.contact) {
      return {
        success: false,
        message: 'Template de contacto no configurado.'
      }
    }

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.contact,
        {
          from_name: data.from_name,
          from_email: data.from_email,
          phone: data.phone || 'No proporcionado',
          message: data.message,
          to_name: 'Julieta Arena',
        }
      )

      if (response.status === 200) {
        return {
          success: true,
          message: '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.'
        }
      }

      return {
        success: false,
        message: 'Hubo un problema al enviar el mensaje. Por favor, intenta nuevamente.'
      }
    } catch (error) {
      this.logError('contacto', error)
      return {
        success: false,
        message: 'Error al enviar el mensaje. Por favor, contactanos directamente por WhatsApp.'
      }
    }
  }

  /**
   * Enviar formulario de vender propiedad
   */
  async sendVenderForm(data: VenderFormData): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'EmailJS no está configurado correctamente. Por favor, contactanos por WhatsApp.'
      }
    }

    if (!EMAILJS_CONFIG.templates.vender) {
      return {
        success: false,
        message: 'Template de vender no configurado.'
      }
    }

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.vender,
        {
          from_name: data.from_name,
          from_email: data.from_email,
          phone: data.phone,
          locality: data.locality,
          property_type: data.property_type,
          comments: data.comments || 'Sin comentarios adicionales',
          to_name: 'Julieta Arena',
        }
      )

      if (response.status === 200) {
        return {
          success: true,
          message: '¡Solicitud enviada correctamente! Te contactaremos pronto para evaluar tu propiedad.'
        }
      }

      return {
        success: false,
        message: 'Hubo un problema al enviar la solicitud. Por favor, intenta nuevamente.'
      }
    } catch (error) {
      this.logError('vender', error)
      return {
        success: false,
        message: 'Error al enviar la solicitud. Por favor, contactanos directamente por WhatsApp.'
      }
    }
  }

  /**
   * Enviar formulario de agendamiento de visita
   */
  async sendAppointmentForm(data: AppointmentFormData): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'EmailJS no está configurado correctamente. Por favor, contactanos por WhatsApp.'
      }
    }

    if (!EMAILJS_CONFIG.templates.appointment) {
      return {
        success: false,
        message: 'Template de citas no configurado.'
      }
    }

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.appointment,
        {
          from_name: data.from_name,
          from_email: data.from_email,
          phone: data.phone,
          property_title: data.property_title,
          property_id: data.property_id,
          date: data.date,
          time: data.time,
          comments: data.comments || 'Sin comentarios adicionales',
          to_name: 'Julieta Arena',
        }
      )

      if (response.status === 200) {
        return {
          success: true,
          message: '¡Visita agendada! Te enviaremos una confirmación por email.'
        }
      }

      return {
        success: false,
        message: 'Hubo un problema al agendar la visita. Por favor, intenta nuevamente.'
      }
    } catch (error) {
      this.logError('cita', error)
      return {
        success: false,
        message: 'Error al agendar la visita. Por favor, contactanos directamente por WhatsApp.'
      }
    }
  }

  /**
   * Enviar consulta sobre una propiedad específica
   */
  async sendPropertyInquiry(data: PropertyInquiryData): Promise<{ success: boolean; message: string }> {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: 'EmailJS no está configurado correctamente. Por favor, contactanos por WhatsApp.'
      }
    }

    if (!EMAILJS_CONFIG.templates.propertyInquiry) {
      return {
        success: false,
        message: 'Template de consulta no configurado.'
      }
    }

    try {
      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templates.propertyInquiry,
        {
          from_name: data.from_name,
          from_email: data.from_email,
          phone: data.phone,
          property_title: data.property_title,
          property_id: data.property_id,
          property_price: data.property_price,
          property_location: data.property_location,
          message: data.message,
          to_name: 'Julieta Arena',
        }
      )

      if (response.status === 200) {
        return {
          success: true,
          message: '¡Consulta enviada! Te responderemos a la brevedad con información sobre esta propiedad.'
        }
      }

      return {
        success: false,
        message: 'Hubo un problema al enviar la consulta. Por favor, intenta nuevamente.'
      }
    } catch (error) {
      this.logError('consulta propiedad', error)
      return {
        success: false,
        message: 'Error al enviar la consulta. Por favor, contactanos directamente por WhatsApp.'
      }
    }
  }
}

// Exportar instancia única del servicio
export const emailService = new EmailService()
