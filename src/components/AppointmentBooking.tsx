'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import { AppointmentFormData } from '@/types/appointment'
import { useAppointments } from '@/hooks/useAppointments'
import { useToast } from '@/components/ToastContainer'
import { checkRateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rateLimit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  X,
  AlertCircle,
  Check,
  Loader2,
  Info
} from 'lucide-react'

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
]

interface AppointmentBookingProps {
  property: Property
  onClose: () => void
  onSuccess?: (appointmentId: string) => void
}

export default function AppointmentBooking({
  property,
  onClose,
  onSuccess
}: AppointmentBookingProps) {
  const { createAppointment, isTimeSlotAvailable } = useAppointments()
  const { success, error: showError } = useToast()
  const [formData, setFormData] = useState<AppointmentFormData>({
    propertyId: property.id,
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    date: '',
    time: '',
    notes: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validaciones
  const validateName = (name: string): string => {
    if (!name.trim()) return 'El nombre es requerido'
    if (name.trim().length < 3) return 'El nombre debe tener al menos 3 caracteres'
    if (name.trim().length > 100) return 'El nombre no puede exceder 100 caracteres'
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(name.trim())) return 'El nombre solo puede contener letras'
    return ''
  }

  const validateEmail = (email: string): string => {
    if (!email.trim()) return 'El email es requerido'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return 'Ingresa un email válido'
    return ''
  }

  const validatePhone = (phone: string): string => {
    if (!phone.trim()) return 'El teléfono es requerido'
    const phoneClean = phone.replace(/[\s\-\(\)]/g, '')
    if (!/^(\+?54)?[0-9]{10,12}$/.test(phoneClean)) return 'Ingresa un teléfono válido (ej: 351 123-4567)'
    return ''
  }

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'clientName': return validateName(value)
      case 'clientEmail': return validateEmail(value)
      case 'clientPhone': return validatePhone(value)
      case 'date': return !value ? 'Selecciona una fecha' : ''
      case 'time': return !value ? 'Selecciona un horario' : ''
      default: return ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    newErrors.clientName = validateName(formData.clientName)
    newErrors.clientEmail = validateEmail(formData.clientEmail)
    newErrors.clientPhone = validatePhone(formData.clientPhone)
    newErrors.date = !formData.date ? 'Selecciona una fecha' : ''
    newErrors.time = !formData.time ? 'Selecciona un horario' : ''

    setErrors(newErrors)
    setTouched({ clientName: true, clientEmail: true, clientPhone: true, date: true, time: true })

    return !Object.values(newErrors).some(error => error !== '')
  }

  useEffect(() => {
    if (formData.date) {
      const available = TIME_SLOTS.filter(time =>
        isTimeSlotAvailable(formData.date, time)
      )
      setAvailableTimes(available)

      if (formData.time && !available.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: '' }))
      }
    }
  }, [formData.date, formData.time, isTimeSlotAvailable])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (touched[name]) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario', 5000)
      return
    }

    const rateLimitCheck = checkRateLimit(`appointment-${property.id}`, RATE_LIMIT_CONFIGS.appointment)
    if (!rateLimitCheck.allowed) {
      const minutes = Math.ceil((rateLimitCheck.timeUntilReset || 0) / 60000)
      showError(
        `Has agendado demasiadas visitas. Por favor, espera ${minutes} minuto${minutes > 1 ? 's' : ''} antes de intentar nuevamente.`,
        7000
      )
      return
    }

    setIsSubmitting(true)

    try {
      const appointment = createAppointment(formData)

      const formattedDate = new Date(formData.date).toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      const response = await fetch('/api/send-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: formData.clientName,
          clientEmail: formData.clientEmail,
          clientPhone: formData.clientPhone,
          propertyTitle: property.title,
          propertyId: property.id,
          date: formattedDate,
          time: formData.time,
          notes: formData.notes
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        success('Visita agendada. Te enviaremos una confirmación por email.', 5000)
        onSuccess?.(appointment.id)
        onClose()
      } else {
        showError(result.error || 'Error al agendar la visita. Intenta de nuevo.', 7000)
      }
    } catch {
      showError('Error de conexión. Por favor, contactanos por WhatsApp.', 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const minDate = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }, [])

  const maxDate = useMemo(() => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }, [])

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const formattedPrice = useMemo(() => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: property.currency || 'ARS',
      minimumFractionDigits: 0,
    }).format(property.price)
  }, [property.price, property.currency])

  const hasError = (field: string) => errors[field] && touched[field]

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 bg-slate-800 text-white rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/15 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Agendar Visita</h2>
              <p className="text-sm text-white/80 mt-1">Completa el formulario para programar tu visita</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/15 rounded-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Property Info */}
        <div className="flex gap-4 p-5 bg-slate-50 border-b border-slate-200">
          <div className="w-24 h-20 rounded-lg overflow-hidden relative flex-shrink-0">
            {property.images && property.images.length > 0 ? (
              <Image
                src={property.images[0]}
                alt={property.title}
                fill
                sizes="96px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                <Calendar className="w-8 h-8" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-800 truncate">{property.title}</h3>
            <p className="flex items-center gap-1.5 text-sm text-slate-500 mt-1">
              <MapPin className="w-4 h-4" />
              {property.location}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-base font-bold text-slate-800">{formattedPrice}</span>
              <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-medium capitalize">
                {property.type}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contact Info Section */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-amber-400">
              <User className="w-5 h-5" />
              Información de Contacto
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="clientName">Nombre Completo *</Label>
                <div className="relative">
                  <User className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                    hasError('clientName') ? "text-red-500" : "text-slate-400"
                  )} />
                  <Input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Tu nombre completo"
                    className={cn(
                      "pl-10",
                      hasError('clientName') && "border-red-500 bg-red-50 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                {hasError('clientName') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.clientName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Email *</Label>
                <div className="relative">
                  <Mail className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                    hasError('clientEmail') ? "text-red-500" : "text-slate-400"
                  )} />
                  <Input
                    type="email"
                    id="clientEmail"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="tu@email.com"
                    className={cn(
                      "pl-10",
                      hasError('clientEmail') && "border-red-500 bg-red-50 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                {hasError('clientEmail') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.clientEmail}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="clientPhone">Teléfono *</Label>
                <div className="relative">
                  <Phone className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                    hasError('clientPhone') ? "text-red-500" : "text-slate-400"
                  )} />
                  <Input
                    type="tel"
                    id="clientPhone"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="+54 351 123-4567"
                    className={cn(
                      "pl-10",
                      hasError('clientPhone') && "border-red-500 bg-red-50 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                {hasError('clientPhone') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.clientPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time Section */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-amber-400">
              <Calendar className="w-5 h-5" />
              Fecha y Hora de la Visita
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <div className="relative">
                  <Calendar className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                    hasError('date') ? "text-red-500" : "text-slate-400"
                  )} />
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min={minDate}
                    max={maxDate}
                    className={cn(
                      "pl-10",
                      hasError('date') && "border-red-500 bg-red-50 focus-visible:ring-red-500"
                    )}
                  />
                </div>
                {hasError('date') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.date}
                  </p>
                )}
                {formData.date && !errors.date && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(formData.date)}
                  </p>
                )}
              </div>

              {/* Time */}
              <div className="space-y-2">
                <Label htmlFor="time">Hora *</Label>
                <div className="relative">
                  <Clock className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10",
                    hasError('time') ? "text-red-500" : "text-slate-400"
                  )} />
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={!formData.date}
                    className={cn(
                      "w-full h-10 pl-10 pr-4 rounded-md border bg-white text-sm",
                      "focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-0",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      hasError('time')
                        ? "border-red-500 bg-red-50 focus:ring-red-500"
                        : "border-slate-200"
                    )}
                  >
                    <option value="">Selecciona una hora</option>
                    {availableTimes.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
                {hasError('time') && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.time}
                  </p>
                )}
                {formData.date && availableTimes.length === 0 && !errors.time && (
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    No hay horarios disponibles para esta fecha
                  </p>
                )}
                {formData.date && availableTimes.length > 0 && formData.time && !errors.time && (
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Horario seleccionado: {formData.time}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-4 pb-2 border-b-2 border-amber-400">
              <FileText className="w-5 h-5" />
              Información Adicional
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    handleInputChange(e)
                  }
                }}
                rows={3}
                maxLength={500}
                placeholder="Comentarios especiales, preguntas sobre la propiedad..."
                className="w-full px-4 py-3 rounded-md border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <p className="text-xs text-slate-500 text-right">
                {formData.notes?.length || 0}/500 caracteres
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 text-slate-700 mb-3">
              <Info className="w-5 h-5" />
              <h4 className="text-sm font-semibold">Información importante</h4>
            </div>
            <ul className="space-y-2">
              {[
                'Las visitas tienen una duración aproximada de 1 hora',
                'Te contactaremos para confirmar la cita',
                'Puedes cancelar o reprogramar con 24hs de anticipación',
                'Trae tu DNI para la visita'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-slate-700 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.date || !formData.time}
              className="px-6 bg-slate-800 hover:bg-slate-900"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Agendando...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar Cita
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
