'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { emailService } from '@/services/emailService'
import { useToast } from '@/components/ToastContainer'
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rateLimit'
import { logger } from '@/lib/logger'
import { normalizeError, getUserFriendlyMessage } from '@/lib/errors'
import styles from './VenderForm.module.css'

interface FormErrors {
  nombre?: string
  email?: string
  telefono?: string
  localidad?: string
  tipoPropiedad?: string
}

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
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const tiposPropiedad = [
    'Casa',
    'Departamento',
    'Terreno',
    'Local Comercial',
    'Oficina',
    'Quinta',
    'Campo',
    'Otro'
  ]

  // Funciones de validación
  const validateNombre = (nombre: string): string | undefined => {
    if (!nombre.trim()) {
      return 'El nombre es requerido'
    }
    if (nombre.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres'
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      return 'El nombre solo puede contener letras'
    }
    return undefined
  }

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) {
      return 'El email es requerido'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Por favor ingresá un email válido'
    }
    return undefined
  }

  const validateTelefono = (telefono: string): string | undefined => {
    if (!telefono.trim()) {
      return 'El teléfono es requerido'
    }
    // Permitir solo números y opcionalmente espacios, guiones o paréntesis
    const telefonoLimpio = telefono.replace(/[\s\-\(\)]/g, '')
    if (!/^\d+$/.test(telefonoLimpio)) {
      return 'El teléfono solo puede contener números'
    }
    if (telefonoLimpio.length < 10 || telefonoLimpio.length > 15) {
      return 'El teléfono debe tener entre 10 y 15 dígitos'
    }
    return undefined
  }

  const validateLocalidad = (localidad: string): string | undefined => {
    if (!localidad.trim()) {
      return 'La localidad es requerida'
    }
    if (localidad.trim().length < 3) {
      return 'La localidad debe tener al menos 3 caracteres'
    }
    return undefined
  }

  const validateTipoPropiedad = (tipo: string): string | undefined => {
    if (!tipo) {
      return 'Debe seleccionar un tipo de propiedad'
    }
    return undefined
  }

  // Validar un campo específico
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'nombre':
        return validateNombre(value)
      case 'email':
        return validateEmail(value)
      case 'telefono':
        return validateTelefono(value)
      case 'localidad':
        return validateLocalidad(value)
      case 'tipoPropiedad':
        return validateTipoPropiedad(value)
      default:
        return undefined
    }
  }

  // Validar todo el formulario
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      nombre: validateNombre(formData.nombre),
      email: validateEmail(formData.email),
      telefono: validateTelefono(formData.telefono),
      localidad: validateLocalidad(formData.localidad),
      tipoPropiedad: validateTipoPropiedad(formData.tipoPropiedad)
    }

    // Filtrar errores undefined
    const filteredErrors = Object.entries(newErrors).reduce((acc, [key, value]) => {
      if (value) acc[key as keyof FormErrors] = value
      return acc
    }, {} as FormErrors)

    setErrors(filteredErrors)
    return Object.keys(filteredErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validar el campo mientras se escribe (solo si ya fue tocado)
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    // Validar el campo al salir
    const error = validateField(name, value)
    setErrors(prev => ({
      ...prev,
      [name]: error
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Marcar todos los campos como tocados
    setTouched({
      nombre: true,
      email: true,
      telefono: true,
      localidad: true,
      tipoPropiedad: true
    })

    // Validar todo el formulario
    if (!validateForm()) {
      // Hacer scroll al primer error
      const firstErrorField = document.querySelector(`.${styles.inputError}`)
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      showError('Por favor, corrige los errores en el formulario', 4000)
      return
    }

    setIsSubmitting(true)

    try {
      // Enviar formulario usando EmailJS
      const result = await emailService.sendVenderForm({
        from_name: formData.nombre,
        from_email: formData.email,
        phone: formData.telefono,
        locality: formData.localidad,
        property_type: formData.tipoPropiedad,
        comments: formData.comentarios
      })
      
      if (result.success) {
        success(result.message, 5000)
        
        // Limpiar formulario
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

        // Redirigir a home después de 3 segundos
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        showError(result.message, 7000)
      }
    } catch (err) {
      const error = normalizeError(err)
      logger.error('Error submitting vender form', {}, error)
      showError(getUserFriendlyMessage(error), 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.venderContainer}>
      {/* Lado Izquierdo - Información */}
      <div className={styles.infoSection}>
        <div className={styles.infoContent}>
          <h1 className={styles.mainTitle}>Vendé tu propiedad</h1>
          
          <p className={styles.description}>
            Completá el formulario y nos pondremos en contacto con vos para continuar con el proceso.
          </p>

          <div className={styles.benefitsList}>
            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>✓</span>
              <div>
                <h3>Tasación profesional</h3>
                <p>Evaluamos tu propiedad sin costo</p>
              </div>
            </div>

            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>✓</span>
              <div>
                <h3>Asesoramiento integral</h3>
                <p>Te acompañamos en todo el proceso</p>
              </div>
            </div>

            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>✓</span>
              <div>
                <h3>Máxima exposición</h3>
                <p>Tu propiedad en todos los portales</p>
              </div>
            </div>

            <div className={styles.benefit}>
              <span className={styles.benefitIcon}>✓</span>
              <div>
                <h3>Gestión completa</h3>
                <p>Desde la publicación hasta la escritura</p>
              </div>
            </div>
          </div>

          <div className={styles.contactInfo}>
            <p><strong>¿Tenés dudas?</strong></p>
            <p>📞 +54 (351) 307-8376</p>
            <p>📧 inmobiliaria72juliarena@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Lado Derecho - Formulario */}
      <div className={styles.formSection}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
              <h2 className={styles.formTitle}>Completá tus datos</h2>

              {/* Nombre y Apellido */}
              <div className={styles.formGroup}>
                <label htmlFor="nombre" className={styles.label}>
                  Nombre y apellido *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
                  placeholder="Juan Pérez"
                />
                {errors.nombre && (
                  <span className={styles.errorText}>{errors.nombre}</span>
                )}
              </div>

              {/* Email */}
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder="juan@example.com"
                />
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </div>

              {/* Teléfono */}
              <div className={styles.formGroup}>
                <label htmlFor="telefono" className={styles.label}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.telefono ? styles.inputError : ''}`}
                  placeholder="3511234567"
                />
                {errors.telefono && (
                  <span className={styles.errorText}>{errors.telefono}</span>
                )}
                <small className={styles.hint}>
                  Nº con código de área. Ej: 3511234567 (Córdoba)
                </small>
              </div>

              {/* Localidad/Provincia */}
              <div className={styles.formGroup}>
                <label htmlFor="localidad" className={styles.label}>
                  Localidad/provincia *
                </label>
                <input
                  type="text"
                  id="localidad"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.input} ${errors.localidad ? styles.inputError : ''}`}
                  placeholder="Córdoba, Córdoba"
                />
                {errors.localidad && (
                  <span className={styles.errorText}>{errors.localidad}</span>
                )}
              </div>

              {/* Tipo de Propiedad */}
              <div className={styles.formGroup}>
                <label htmlFor="tipoPropiedad" className={styles.label}>
                  Tipo de propiedad *
                </label>
                <select
                  id="tipoPropiedad"
                  name="tipoPropiedad"
                  value={formData.tipoPropiedad}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${styles.select} ${errors.tipoPropiedad ? styles.inputError : ''}`}
                >
                  <option value="">Tipo de propiedad</option>
                  {tiposPropiedad.map(tipo => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
                {errors.tipoPropiedad && (
                  <span className={styles.errorText}>{errors.tipoPropiedad}</span>
                )}
              </div>

              {/* Comentarios */}
              <div className={styles.formGroup}>
                <label htmlFor="comentarios" className={styles.label}>
                  Comentarios
                </label>
                <textarea
                  id="comentarios"
                  name="comentarios"
                  value={formData.comentarios}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={5}
                  placeholder="Contanos más sobre tu propiedad..."
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.submitButton} button-press ripple`}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Enviando...
                  </>
                ) : (
                  'Enviar consulta'
                )}
              </button>

              <p className={styles.privacyNote}>
                Al enviar este formulario, aceptás nuestra política de privacidad y el tratamiento de tus datos personales.
              </p>
            </form>
        </div>
      </div>
    </div>
  )
}

