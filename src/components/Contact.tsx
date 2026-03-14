'use client'

import { useState, FormEvent, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { contactFormSchema, validateAndParse } from '@/lib/validation'
import { sanitizeText } from '@/lib/sanitize'
import { logger } from '@/lib/logger'
import { normalizeError, getUserFriendlyMessage } from '@/lib/errors'
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rateLimit'
import { MapPin, Phone, Mail, Clock, Loader2, Send, MessageSquare, type LucideIcon } from 'lucide-react'

/* =============================================================================
   TYPES
============================================================================= */

interface ContactInfo {
  icon: LucideIcon
  title: string
  content: string
  href?: string
}

interface FormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  service?: string
  message?: string
}

/* =============================================================================
   CONSTANTS
============================================================================= */

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: MapPin,
    title: 'Ubicación',
    content: 'Córdoba, Argentina',
  },
  {
    icon: Phone,
    title: 'Teléfono',
    content: '+54 (351) 307-8376',
    href: 'tel:+543513078376',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'inmobiliaria72juliarena@gmail.com',
    href: 'mailto:inmobiliaria72juliarena@gmail.com',
  },
  {
    icon: Clock,
    title: 'Horario de Atención',
    content: 'Lunes a Viernes: 9:00 - 18:00',
  },
]

const SERVICE_OPTIONS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'venta', label: 'Venta de Propiedades' },
  { value: 'alquiler', label: 'Alquileres' },
  { value: 'remate', label: 'Remates Judiciales' },
  { value: 'jubilacion', label: 'Jubilaciones' },
  { value: 'tasacion', label: 'Tasaciones' },
  { value: 'asesoria', label: 'Asesoramiento Legal' },
  { value: 'otro', label: 'Otro' },
]

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  phone: '',
  service: '',
  message: '',
}

/* =============================================================================
   VALIDATION FUNCTIONS
============================================================================= */

const validateName = (name: string): string | undefined => {
  if (!name.trim()) return 'El nombre es requerido'
  if (name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name)) return 'El nombre solo puede contener letras'
  return undefined
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'El email es requerido'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Por favor ingresa un email válido'
  return undefined
}

const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) return 'El teléfono es requerido'
  const phoneLimpio = phone.replace(/[\s\-\(\)]/g, '')
  if (!/^\d+$/.test(phoneLimpio)) return 'El teléfono solo puede contener números'
  if (phoneLimpio.length > 10) return 'El teléfono no puede tener más de 10 dígitos'
  if (phoneLimpio.length < 8) return 'El teléfono debe tener al menos 8 dígitos'
  return undefined
}

const validateService = (service: string): string | undefined => {
  if (!service) return 'Debe seleccionar un servicio'
  return undefined
}

const validateMessage = (message: string): string | undefined => {
  if (!message.trim()) return 'El mensaje es requerido'
  if (message.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres'
  return undefined
}

/* =============================================================================
   SUB-COMPONENTS
============================================================================= */

function ContactInfoCard({ icon: Icon, title, content, href }: ContactInfo) {
  const cardContent = (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0 bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <div className="min-w-0">
        <div className="text-xs sm:text-sm text-muted">{title}</div>
        <div className="font-medium text-sm sm:text-base text-brand-accent truncate">{content}</div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block no-underline">
        {cardContent}
      </a>
    )
  }

  return cardContent
}

function WhatsAppCard() {
  return (
    <div className="bg-gradient-to-br from-brand-accent to-brand-primary rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-3 sm:mb-4">
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">Hablemos</h3>
          <p className="text-xs sm:text-sm text-white/70">Respuesta en 24 horas</p>
        </div>
      </div>
      <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-4 sm:mb-5">
        No dudes en contactarme. Estaré encantada de responder
        todas tus consultas y ayudarte a encontrar lo que necesitas.
      </p>
      <a
        href="https://wa.me/543513078376"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#20BD5A] rounded-xl font-medium text-sm sm:text-base transition-colors duration-200"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 sm:w-5 sm:h-5 fill-current">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Escribir por WhatsApp
      </a>
    </div>
  )
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function Contact() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error: showError } = useToast()

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'name': return validateName(value)
      case 'email': return validateEmail(value)
      case 'phone': return validatePhone(value)
      case 'service': return validateService(value)
      case 'message': return validateMessage(value)
      default: return undefined
    }
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
      service: validateService(formData.service),
      message: validateMessage(formData.message),
    }

    const filteredErrors = Object.entries(newErrors).reduce((acc, [key, value]) => {
      if (value) acc[key as keyof FormErrors] = value
      return acc
    }, {} as FormErrors)

    setErrors(filteredErrors)
    return Object.keys(filteredErrors).length === 0
  }, [formData])

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [touched, validateField])

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, phone: value }))

    if (touched.phone) {
      const error = validateField('phone', value)
      setErrors(prev => ({ ...prev, phone: error }))
    }
  }, [touched.phone, validateField])

  const handleBlur = useCallback((
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [validateField])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      service: true,
      message: true,
    })

    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario', 4000)
      return
    }

    const rateLimitCheck = checkRateLimit('contact-form', RATE_LIMIT_CONFIGS.contactForm)
    if (!rateLimitCheck.allowed) {
      const minutes = Math.ceil((rateLimitCheck.timeUntilReset || 0) / 60000)
      showError(
        `Has enviado demasiados mensajes. Por favor, espera ${minutes} minuto${minutes > 1 ? 's' : ''} antes de intentar nuevamente.`,
        7000
      )
      return
    }

    setIsSubmitting(true)

    try {
      const validation = validateAndParse(contactFormSchema, {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        message: formData.message,
      }, 'Datos del formulario inválidos')

      if (!validation.success) {
        const errorMessage = validation.details?.issues?.[0]?.message || 'Por favor, completa todos los campos correctamente'
        showError(errorMessage, 5000)
        logger.warn('Contact form validation failed', { errors: validation.details?.issues })
        return
      }

      const sanitizedData = {
        customer_name: sanitizeText(validation.data.from_name),
        customer_email: validation.data.from_email,
        customer_phone: validation.data.phone ? sanitizeText(validation.data.phone) : null,
        service: sanitizeText(formData.service),
        message: sanitizeText(validation.data.message),
        status: 'nueva' as const
      }

      const { error } = await supabase
        .from('contact_inquiries')
        .insert([sanitizedData])
        .select()

      if (error) {
        const normalizedError = normalizeError(error)
        logger.error('Error saving contact inquiry', {}, normalizedError)
        showError(getUserFriendlyMessage(normalizedError), 7000)
        return
      }

      logger.info('Contact inquiry saved successfully', { email: sanitizedData.customer_email })

      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: sanitizedData.customer_name,
            email: sanitizedData.customer_email,
            phone: sanitizedData.customer_phone,
            service: sanitizedData.service,
            message: sanitizedData.message,
          }),
        })

        if (!emailResponse.ok) {
          logger.warn('Email notification failed but inquiry was saved', { email: sanitizedData.customer_email })
        }
      } catch (emailError) {
        logger.warn('Email notification failed but inquiry was saved', { error: emailError })
      }

      success('¡Mensaje enviado correctamente! Te contactaremos pronto.', 5000)
      setFormData(INITIAL_FORM_DATA)
      setErrors({})
      setTouched({})
    } catch (err) {
      const error = normalizeError(err)
      logger.error('Error submitting contact form', {}, error)
      showError(getUserFriendlyMessage(error), 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBaseClasses = "w-full h-11 sm:h-12 px-3 sm:px-4 text-sm sm:text-base bg-surface border rounded-xl outline-none transition-all duration-200 focus:bg-white focus:ring-2"
  const inputNormalClasses = `${inputBaseClasses} border-border focus:border-brand-primary focus:ring-brand-primary/20`
  const inputErrorClasses = `${inputBaseClasses} border-red-500 border-2 focus:border-red-500 focus:ring-red-500/20`

  return (
    <section id="contacto" className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-surface to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-3 sm:mb-4">
            Contacto
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-accent mb-3 sm:mb-4">
            ¿Necesitas Asesoramiento?
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed px-2">
            Estoy aquí para ayudarte. Contáctame para cualquier consulta sobre
            servicios inmobiliarios, remates judiciales o asesoramiento profesional.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
          {/* Contact Info - Left Side */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <WhatsAppCard />
            <div className="space-y-2 sm:space-y-3">
              {CONTACT_INFO.map((info, index) => (
                <ContactInfoCard key={index} {...info} />
              ))}
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-border">
              <h3 className="text-xl sm:text-2xl font-bold text-brand-accent mb-1 sm:mb-2">
                Envíame un mensaje
              </h3>
              <p className="text-sm sm:text-base text-muted mb-4 sm:mb-6">
                Completa el formulario y te responderé a la brevedad.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Name & Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Tu nombre"
                      className={errors.name ? inputErrorClasses : inputNormalClasses}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="tu@email.com"
                      className={errors.email ? inputErrorClasses : inputNormalClasses}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone & Service */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onBlur={handleBlur}
                      maxLength={10}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="3511234567"
                      className={errors.phone ? inputErrorClasses : inputNormalClasses}
                    />
                    {errors.phone ? (
                      <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-1">10 dígitos sin espacios</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Servicio de Interés <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={errors.service ? inputErrorClasses : inputNormalClasses}
                    >
                      {SERVICE_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.service && (
                      <p className="text-xs text-red-500 mt-1">{errors.service}</p>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mensaje <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="¿En qué puedo ayudarte?"
                    className={`${errors.message ? inputErrorClasses : inputNormalClasses} h-auto py-3 resize-none`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-14 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-accent rounded-xl shadow-lg shadow-brand-primary/30 hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Enviar Mensaje
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
