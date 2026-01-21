'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ToastContainer'
import { Send, Phone, Mail, Loader2, Home, FileText, MapPin, Users } from 'lucide-react'

/* =============================================================================
   TYPES
============================================================================= */

interface FormErrors {
  nombre?: string
  email?: string
  telefono?: string
  localidad?: string
  tipoPropiedad?: string
}

interface BenefitItemProps {
  icon: React.ReactNode
  title: string
  description: string
}

/* =============================================================================
   CONSTANTS
============================================================================= */

const PROPERTY_TYPES = [
  'Casa',
  'Departamento',
  'Terreno',
  'Local Comercial',
  'Oficina',
  'Quinta',
  'Campo',
  'Otro'
]

const BENEFITS = [
  {
    icon: <FileText className="w-4 h-4" />,
    title: 'Tasación profesional',
    description: 'Evaluamos tu propiedad sin costo'
  },
  {
    icon: <Users className="w-4 h-4" />,
    title: 'Asesoramiento integral',
    description: 'Te acompañamos en todo el proceso'
  },
  {
    icon: <Home className="w-4 h-4" />,
    title: 'Máxima exposición',
    description: 'Tu propiedad en todos los portales'
  },
  {
    icon: <MapPin className="w-4 h-4" />,
    title: 'Gestión completa',
    description: 'Desde la publicación hasta la escritura'
  }
]

/* =============================================================================
   SUB-COMPONENTS
============================================================================= */

function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-10 h-10 rounded-xl bg-brand-secondary text-brand-accent flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-secondary/20">
        {icon}
      </div>
      <div>
        <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-white/75">{description}</p>
      </div>
    </div>
  )
}

/* =============================================================================
   VALIDATION FUNCTIONS
============================================================================= */

const validateNombre = (nombre: string): string | undefined => {
  if (!nombre.trim()) return 'El nombre es requerido'
  if (nombre.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return 'El nombre solo puede contener letras'
  return undefined
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'El email es requerido'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Por favor ingresa un email válido'
  return undefined
}

const validateTelefono = (telefono: string): string | undefined => {
  if (!telefono.trim()) return 'El teléfono es requerido'
  const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '')
  if (!/^\d+$/.test(telefonoLimpio)) return 'El teléfono solo puede contener números'
  if (telefonoLimpio.length !== 10) return 'El teléfono debe tener exactamente 10 dígitos (ej: 3511234567)'
  return undefined
}

const validateLocalidad = (localidad: string): string | undefined => {
  if (!localidad.trim()) return 'La localidad es requerida'
  if (localidad.trim().length < 3) return 'La localidad debe tener al menos 3 caracteres'
  return undefined
}

const validateTipoPropiedad = (tipo: string): string | undefined => {
  if (!tipo) return 'Debe seleccionar un tipo de propiedad'
  return undefined
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function VenderForm() {
  const router = useRouter()
  const { success, error: showError } = useToast()

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    localidad: '',
    tipoPropiedad: '',
    comentarios: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'nombre': return validateNombre(value)
      case 'email': return validateEmail(value)
      case 'telefono': return validateTelefono(value)
      case 'localidad': return validateLocalidad(value)
      case 'tipoPropiedad': return validateTipoPropiedad(value)
      default: return undefined
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      nombre: validateNombre(formData.nombre),
      email: validateEmail(formData.email),
      telefono: validateTelefono(formData.telefono),
      localidad: validateLocalidad(formData.localidad),
      tipoPropiedad: validateTipoPropiedad(formData.tipoPropiedad)
    }

    const filteredErrors = Object.entries(newErrors).reduce((acc, [key, value]) => {
      if (value) acc[key as keyof FormErrors] = value
      return acc
    }, {} as FormErrors)

    setErrors(filteredErrors)
    return Object.keys(filteredErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setFormData(prev => ({ ...prev, telefono: value }))

    if (touched.telefono) {
      const error = validateField('telefono', value)
      setErrors(prev => ({ ...prev, telefono: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setTouched({
      nombre: true,
      email: true,
      telefono: true,
      localidad: true,
      tipoPropiedad: true
    })

    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario', 4000)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-vender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          localidad: formData.localidad,
          tipoPropiedad: formData.tipoPropiedad,
          comentarios: formData.comentarios
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        success('¡Solicitud enviada correctamente! Te contactaremos pronto para evaluar tu propiedad.', 5000)
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          localidad: '',
          tipoPropiedad: '',
          comentarios: ''
        })
        setErrors({})
        setTouched({})
        setTimeout(() => router.push('/'), 3000)
      } else {
        showError(result.error || 'Error al enviar la solicitud. Intentá de nuevo.', 7000)
      }
    } catch {
      showError('Error de conexión. Por favor, contactanos por WhatsApp.', 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Input classes
  const inputBaseClasses = "w-full h-12 px-4 text-sm bg-white border rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-primary/20"
  const inputNormalClasses = `${inputBaseClasses} border-border focus:border-brand-primary`
  const inputErrorClasses = `${inputBaseClasses} border-error border-2 focus:border-error`

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
      {/* Left Side - Info Section */}
      <div className="bg-gradient-to-br from-brand-primary via-brand-accent to-brand-dark p-8 lg:p-12 xl:p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-lg">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-secondary/20 text-brand-secondary rounded-full text-sm font-medium mb-6">
            <Home className="w-4 h-4" />
            Vendé tu propiedad
          </span>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Vendé tu propiedad con profesionales
          </h1>

          {/* Description */}
          <p className="text-lg text-white/85 mb-10 leading-relaxed">
            Completá el formulario y nos pondremos en contacto con vos para continuar con el proceso de venta.
          </p>

          {/* Benefits List */}
          <div className="space-y-6 mb-10">
            {BENEFITS.map((benefit, index) => (
              <BenefitItem key={index} {...benefit} />
            ))}
          </div>

          {/* Contact Info Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-4">¿Tenés dudas?</h3>
            <div className="space-y-3">
              <a
                href="tel:+543513078376"
                className="flex items-center gap-3 text-white/85 hover:text-brand-secondary transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+54 (351) 307-8376</span>
              </a>
              <a
                href="mailto:inmobiliaria72juliarena@gmail.com"
                className="flex items-center gap-3 text-white/85 hover:text-brand-secondary transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">inmobiliaria72juliarena@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="bg-surface p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Form Card */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5 border border-border">
            <h2 className="text-2xl font-bold text-brand-accent mb-6">
              Completá tus datos
            </h2>

            <div className="space-y-5">
              {/* Nombre */}
              <div className="space-y-2">
                <label htmlFor="nombre" className="block text-sm font-medium text-brand-accent">
                  Nombre y apellido <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.nombre ? inputErrorClasses : inputNormalClasses}
                  placeholder="Juan Pérez"
                />
                {errors.nombre && (
                  <p className="text-xs text-error mt-1">{errors.nombre}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-brand-accent">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email ? inputErrorClasses : inputNormalClasses}
                  placeholder="juan@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-error mt-1">{errors.email}</p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <label htmlFor="telefono" className="block text-sm font-medium text-brand-accent">
                  Teléfono <span className="text-error">*</span>
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handlePhoneChange}
                  onBlur={handleBlur}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={errors.telefono ? inputErrorClasses : inputNormalClasses}
                  placeholder="3511234567"
                />
                {errors.telefono && (
                  <p className="text-xs text-error mt-1">{errors.telefono}</p>
                )}
                <p className="text-xs text-muted">10 dígitos con código de área (sin 0 ni 15). Ej: 3511234567</p>
              </div>

              {/* Localidad */}
              <div className="space-y-2">
                <label htmlFor="localidad" className="block text-sm font-medium text-brand-accent">
                  Localidad/Provincia <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="localidad"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.localidad ? inputErrorClasses : inputNormalClasses}
                  placeholder="Córdoba, Córdoba"
                />
                {errors.localidad && (
                  <p className="text-xs text-error mt-1">{errors.localidad}</p>
                )}
              </div>

              {/* Tipo de Propiedad */}
              <div className="space-y-2">
                <label htmlFor="tipoPropiedad" className="block text-sm font-medium text-brand-accent">
                  Tipo de propiedad <span className="text-error">*</span>
                </label>
                <select
                  id="tipoPropiedad"
                  name="tipoPropiedad"
                  value={formData.tipoPropiedad}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${errors.tipoPropiedad ? inputErrorClasses : inputNormalClasses} cursor-pointer`}
                >
                  <option value="">Seleccionar tipo</option>
                  {PROPERTY_TYPES.map(tipo => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {errors.tipoPropiedad && (
                  <p className="text-xs text-error mt-1">{errors.tipoPropiedad}</p>
                )}
              </div>

              {/* Comentarios */}
              <div className="space-y-2">
                <label htmlFor="comentarios" className="block text-sm font-medium text-brand-accent">
                  Comentarios <span className="text-muted">(opcional)</span>
                </label>
                <textarea
                  id="comentarios"
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 text-sm bg-white border border-border rounded-xl outline-none resize-none transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                  placeholder="Contanos más sobre tu propiedad..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar consulta
                  </>
                )}
              </button>

              {/* Privacy Note */}
              <p className="text-xs text-muted text-center">
                Al enviar este formulario, aceptás nuestra política de privacidad y el tratamiento de tus datos personales.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
