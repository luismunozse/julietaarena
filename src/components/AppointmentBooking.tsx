'use client'

import { useState, useEffect } from 'react'
import { Property } from '@/data/properties'
import { AppointmentFormData } from '@/types/appointment'
import { useAppointments } from '@/hooks/useAppointments'
import { emailService } from '@/services/emailService'
import { useToast } from '@/components/ToastContainer'
import styles from './AppointmentBooking.module.css'

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

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  useEffect(() => {
    if (formData.date) {
      const available = timeSlots.filter(time => 
        isTimeSlotAvailable(formData.date, time)
      )
      setAvailableTimes(available)
      
      // Si el tiempo seleccionado no está disponible, limpiarlo
      if (formData.time && !available.includes(formData.time)) {
        setFormData(prev => ({ ...prev, time: '' }))
      }
    }
  }, [formData.date, formData.time, timeSlots, isTimeSlotAvailable])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Crear cita localmente
      const appointment = createAppointment(formData)
      
      // Enviar email de confirmación usando EmailJS
      const result = await emailService.sendAppointmentForm({
        from_name: formData.clientName,
        from_email: formData.clientEmail,
        phone: formData.clientPhone,
        property_title: property.title,
        property_id: property.id,
        date: new Date(formData.date).toLocaleDateString('es-AR', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: formData.time,
        comments: formData.notes
      })
      
      if (result.success) {
        success(result.message, 5000)
        onSuccess?.(appointment.id)
        onClose()
      } else {
        showError(result.message, 7000)
      }
    } catch (err) {
      console.error('Error creating appointment:', err)
      showError('Error inesperado al agendar la visita. Por favor, contactanos por WhatsApp.', 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Agendar Visita</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ✕
          </button>
        </div>

        <div className={styles.propertyInfo}>
          <h3>{property.title}</h3>
          <p>📍 {property.location}</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="clientName">Nombre Completo *</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                required
                placeholder="Tu nombre completo"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="clientEmail">Email *</label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                required
                placeholder="tu@email.com"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="clientPhone">Teléfono *</label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                required
                placeholder="+54 351 123-4567"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Fecha *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={getMinDate()}
                max={getMaxDate()}
                required
              />
              {formData.date && (
                <p className={styles.datePreview}>
                  {formatDate(formData.date)}
                </p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time">Hora *</label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                disabled={!formData.date}
              >
                <option value="">Selecciona una hora</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>
                    {time} - Disponible
                  </option>
                ))}
              </select>
              {formData.date && availableTimes.length === 0 && (
                <p className={styles.noSlots}>
                  No hay horarios disponibles para esta fecha
                </p>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notas adicionales (opcional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Comentarios especiales o preguntas sobre la propiedad..."
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              onClick={onClose}
              className={styles.cancelBtn}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={isSubmitting || !formData.date || !formData.time}
            >
              {isSubmitting ? 'Agendando...' : 'Confirmar Cita'}
            </button>
          </div>
        </form>

        <div className={styles.info}>
          <h4>ℹ️ Información importante:</h4>
          <ul>
            <li>Las visitas tienen una duración aproximada de 1 hora</li>
            <li>Te contactaremos para confirmar la cita</li>
            <li>Puedes cancelar o reprogramar con 24hs de anticipación</li>
            <li>Trae tu DNI para la visita</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
