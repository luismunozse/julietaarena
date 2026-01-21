'use client'

import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { Loader2, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

/* =============================================================================
   TYPES
============================================================================= */

interface AppraisalFormState {
  ownerName: string
  email: string
  phone: string
  preferredContact: 'whatsapp' | 'llamada' | 'email'
  propertyType: 'casa' | 'departamento' | 'terreno' | 'local' | 'campo' | 'otro'
  address: string
  neighborhood: string
  surface: string
  coveredSurface: string
  antique: string
  occupancy: 'propietario' | 'inquilino' | 'desocupado'
  improvements: string
  legalStatus: string
  purpose: 'venta' | 'alquiler' | 'herencia' | 'banco' | 'judicial' | 'otro'
  notes: string
}

interface FormErrors {
  ownerName?: string
  email?: string
  phone?: string
  address?: string
  neighborhood?: string
  surface?: string
  coveredSurface?: string
}

/* =============================================================================
   CONSTANTS
============================================================================= */

const initialState: AppraisalFormState = {
  ownerName: '',
  email: '',
  phone: '',
  preferredContact: 'whatsapp',
  propertyType: 'casa',
  address: '',
  neighborhood: '',
  surface: '',
  coveredSurface: '',
  antique: '',
  occupancy: 'propietario',
  improvements: '',
  legalStatus: '',
  purpose: 'venta',
  notes: '',
}

/* =============================================================================
   VALIDATION FUNCTIONS
============================================================================= */

const validateOwnerName = (name: string): string | undefined => {
  if (!name.trim()) return 'El nombre es requerido'
  if (name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
  if (name.trim().length > 100) return 'El nombre no puede exceder 100 caracteres'
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name.trim())) return 'El nombre solo puede contener letras'
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
  const phoneLimpio = phone.replace(/[\s\-\(\)\+]/g, '')
  if (!/^\d+$/.test(phoneLimpio)) return 'El teléfono solo puede contener números'
  if (phoneLimpio.length < 8) return 'El teléfono debe tener al menos 8 dígitos'
  if (phoneLimpio.length > 15) return 'El teléfono no puede tener más de 15 dígitos'
  return undefined
}

const validateAddress = (address: string): string | undefined => {
  if (!address.trim()) return 'La dirección es requerida'
  if (address.trim().length < 5) return 'La dirección debe tener al menos 5 caracteres'
  return undefined
}

const validateNeighborhood = (neighborhood: string): string | undefined => {
  if (!neighborhood.trim()) return 'El barrio/localidad es requerido'
  if (neighborhood.trim().length < 3) return 'El barrio debe tener al menos 3 caracteres'
  return undefined
}

const validateSurface = (surface: string): string | undefined => {
  if (surface && parseFloat(surface) < 0) return 'La superficie no puede ser negativa'
  if (surface && parseFloat(surface) > 1000000) return 'La superficie parece demasiado grande'
  return undefined
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function AppraisalForm() {
  const [form, setForm] = useState<AppraisalFormState>(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error } = useToast()

  const validateField = useCallback((name: string, value: string): string | undefined => {
    switch (name) {
      case 'ownerName': return validateOwnerName(value)
      case 'email': return validateEmail(value)
      case 'phone': return validatePhone(value)
      case 'address': return validateAddress(value)
      case 'neighborhood': return validateNeighborhood(value)
      case 'surface': return validateSurface(value)
      case 'coveredSurface': return validateSurface(value)
      default: return undefined
    }
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {
      ownerName: validateOwnerName(form.ownerName),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      address: validateAddress(form.address),
      neighborhood: validateNeighborhood(form.neighborhood),
      surface: validateSurface(form.surface),
      coveredSurface: validateSurface(form.coveredSurface),
    }

    const filteredErrors = Object.entries(newErrors).reduce((acc, [key, value]) => {
      if (value) acc[key as keyof FormErrors] = value
      return acc
    }, {} as FormErrors)

    setErrors(filteredErrors)
    return Object.keys(filteredErrors).length === 0
  }, [form])

  const handleChange = useCallback((field: keyof AppraisalFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))

    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }, [touched, validateField])

  const handleBlur = useCallback((field: keyof AppraisalFormState) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, form[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }, [form, validateField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark required fields as touched
    setTouched({
      ownerName: true,
      email: true,
      phone: true,
      address: true,
      neighborhood: true,
    })

    if (!validateForm()) {
      error('Por favor, corrige los errores en el formulario')
      return
    }

    setIsSubmitting(true)
    try {
      const { error: insertError } = await supabase.from('contact_inquiries').insert([
        {
          customer_name: form.ownerName,
          customer_email: form.email,
          customer_phone: form.phone,
          service: 'tasacion',
          message: `Tipo: ${form.propertyType}. Direccion: ${form.address}. Barrio/localidad: ${form.neighborhood}. Sup. terreno: ${form.surface} m2. Sup. cubierta: ${form.coveredSurface} m2. Antiguedad: ${form.antique}. Ocupacion: ${form.occupancy}. Mejora/estado: ${form.improvements}. Situacion legal: ${form.legalStatus}. Finalidad: ${form.purpose}. Observaciones: ${form.notes}. Contacto preferido: ${form.preferredContact}.`,
          status: 'nueva',
          notes: 'Solicitud de tasacion enviada desde la web',
        },
      ])

      if (insertError) {
        throw insertError
      }

      success('Gracias! Nos comunicaremos dentro de las proximas 24/48 h habiles.')
      setForm(initialState)
      setErrors({})
      setTouched({})
    } catch (err) {
      console.error('Error enviando tasacion', err)
      error('No pudimos enviar la solicitud. Por favor, intenta nuevamente o contactanos por WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputBaseClasses = "w-full px-4 py-3 text-sm bg-white border rounded-lg outline-none transition-all duration-200 focus:ring-2 focus:ring-brand-primary/20"
  const inputNormalClasses = `${inputBaseClasses} border-slate-200 focus:border-brand-primary`
  const inputErrorClasses = `${inputBaseClasses} border-red-500 border-2 bg-red-50 focus:border-red-500 focus:ring-red-500/20`
  const selectClasses = "w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg outline-none cursor-pointer transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
  const textareaClasses = "w-full px-4 py-3 text-sm bg-white border border-slate-200 rounded-lg outline-none resize-y min-h-[80px] transition-all duration-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
  const labelClasses = "block text-sm font-medium text-brand-accent mb-2"

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200"
    >
      {/* Datos del propietario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.ownerName}
            onChange={(e) => handleChange('ownerName', e.target.value)}
            onBlur={() => handleBlur('ownerName')}
            placeholder="Nombre y apellido"
            className={cn(errors.ownerName && touched.ownerName ? inputErrorClasses : inputNormalClasses)}
          />
          {errors.ownerName && touched.ownerName && (
            <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>
          )}
        </div>
        <div>
          <label className={labelClasses}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="tu@email.com"
            className={cn(errors.email && touched.email ? inputErrorClasses : inputNormalClasses)}
          />
          {errors.email && touched.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Teléfono / WhatsApp <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            placeholder="+54 9 ..."
            className={cn(errors.phone && touched.phone ? inputErrorClasses : inputNormalClasses)}
          />
          {errors.phone && touched.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className={labelClasses}>Medio de contacto preferido</label>
          <select
            value={form.preferredContact}
            onChange={(e) => handleChange('preferredContact', e.target.value as AppraisalFormState['preferredContact'])}
            className={selectClasses}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="llamada">Llamada telefonica</option>
            <option value="email">Email</option>
          </select>
        </div>
      </div>

      {/* Datos de la propiedad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>
            Tipo de propiedad <span className="text-red-500">*</span>
          </label>
          <select
            value={form.propertyType}
            onChange={(e) => handleChange('propertyType', e.target.value as AppraisalFormState['propertyType'])}
            className={selectClasses}
          >
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="terreno">Terreno</option>
            <option value="local">Local comercial</option>
            <option value="campo">Campo / Estancia</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>
            Dirección / ubicación <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.address}
            onChange={(e) => handleChange('address', e.target.value)}
            onBlur={() => handleBlur('address')}
            placeholder="Calle y altura"
            className={cn(errors.address && touched.address ? inputErrorClasses : inputNormalClasses)}
          />
          {errors.address && touched.address && (
            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClasses}>
          Barrio / Localidad <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.neighborhood}
          onChange={(e) => handleChange('neighborhood', e.target.value)}
          onBlur={() => handleBlur('neighborhood')}
          placeholder="Ej: Nueva Córdoba, Villa Allende"
          className={cn(errors.neighborhood && touched.neighborhood ? inputErrorClasses : inputNormalClasses)}
        />
        {errors.neighborhood && touched.neighborhood && (
          <p className="text-xs text-red-500 mt-1">{errors.neighborhood}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>Sup. terreno (m²)</label>
          <input
            type="number"
            min="0"
            value={form.surface}
            onChange={(e) => handleChange('surface', e.target.value)}
            onBlur={() => handleBlur('surface')}
            className={cn(errors.surface && touched.surface ? inputErrorClasses : inputNormalClasses)}
          />
          {errors.surface && touched.surface && (
            <p className="text-xs text-red-500 mt-1">{errors.surface}</p>
          )}
        </div>
        <div>
          <label className={labelClasses}>Sup. cubierta (m²)</label>
          <input
            type="number"
            min="0"
            value={form.coveredSurface}
            onChange={(e) => handleChange('coveredSurface', e.target.value)}
            onBlur={() => handleBlur('coveredSurface')}
            className={cn(errors.coveredSurface && touched.coveredSurface ? inputErrorClasses : inputNormalClasses)}
          />
          {errors.coveredSurface && touched.coveredSurface && (
            <p className="text-xs text-red-500 mt-1">{errors.coveredSurface}</p>
          )}
        </div>
        <div>
          <label className={labelClasses}>Antigüedad aproximada</label>
          <input
            type="text"
            value={form.antique}
            onChange={(e) => handleChange('antique', e.target.value)}
            placeholder="Ej: 12 años"
            className={inputNormalClasses}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClasses}>Ocupación actual</label>
          <select
            value={form.occupancy}
            onChange={(e) => handleChange('occupancy', e.target.value as AppraisalFormState['occupancy'])}
            className={selectClasses}
          >
            <option value="propietario">Propietario</option>
            <option value="inquilino">Alquilada</option>
            <option value="desocupado">Desocupada</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>
            Finalidad de la tasación <span className="text-red-500">*</span>
          </label>
          <select
            value={form.purpose}
            onChange={(e) => handleChange('purpose', e.target.value as AppraisalFormState['purpose'])}
            className={selectClasses}
          >
            <option value="venta">Venta / publicación</option>
            <option value="alquiler">Valor locativo</option>
            <option value="herencia">Partición / sucesión</option>
            <option value="banco">Requisito bancario</option>
            <option value="judicial">Proceso judicial</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className={labelClasses}>Situación legal / registral</label>
          <input
            type="text"
            value={form.legalStatus}
            onChange={(e) => handleChange('legalStatus', e.target.value)}
            placeholder="Escritura, boleto, PH, sucesión..."
            className={inputNormalClasses}
          />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Mejoras / estado actual</label>
        <textarea
          value={form.improvements}
          onChange={(e) => handleChange('improvements', e.target.value)}
          rows={3}
          placeholder="Refacciones recientes, amenities, características destacadas..."
          className={textareaClasses}
        />
      </div>

      <div>
        <label className={labelClasses}>Observaciones adicionales</label>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={4}
          placeholder="Disponibilidad horaria, urgencia, comentarios..."
          className={textareaClasses}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 mt-3 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg font-semibold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enviando solicitud...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Solicitar tasación profesional
          </>
        )}
      </button>
    </form>
  )
}
