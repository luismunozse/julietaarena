'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import AppointmentBooking from './AppointmentBooking'
import { emailService } from '@/services/emailService'
import { useToast } from '@/components/ToastContainer'
import styles from './PropertySidebar.module.css'

interface PropertySidebarProps {
  property: Property
}

export default function PropertySidebar({ property }: PropertySidebarProps) {
  const [showAppointment, setShowAppointment] = useState(false)
  const [contactFormData, setContactFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { success, error: showError } = useToast()

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formatPrice = (price: number): string => {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    }

    try {
      const result = await emailService.sendPropertyInquiry({
        from_name: contactFormData.name,
        from_email: contactFormData.email,
        phone: contactFormData.phone,
        property_title: property.title,
        property_id: property.id,
        property_price: formatPrice(property.price),
        property_location: property.location,
        message: contactFormData.message || `Estoy interesado/a en ${property.title}`,
      })

      if (result.success) {
        success('Mensaje enviado correctamente. Te contactaremos pronto.', 5000)
        setContactFormData({ name: '', phone: '', email: '', message: '' })
      } else {
        showError(result.message, 7000)
      }
    } catch (err) {
      console.error('Error al enviar mensaje:', err)
      showError('Error al enviar el mensaje. Por favor, contactanos por WhatsApp.', 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsApp = () => {
    const message = `Hola, estoy interesado/a en ${property.title} - ${property.location}`
    const whatsappUrl = `https://wa.me/+543519999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handlePhone = () => {
    window.location.href = 'tel:+543519999999'
  }

  return (
    <div className={styles.sidebar}>
      {/* Card de contacto */}
      <div className={styles.contactCard}>
        <div className={styles.contactHeader}>
          <div className={styles.agentInfo}>
            <div className={styles.agentAvatar}>
              {property.broker?.avatar ? (
                <img src={property.broker.avatar} alt={property.broker.name} />
              ) : (
                <span className={styles.avatarPlaceholder}>JU</span>
              )}
            </div>
            <div className={styles.agentDetails}>
              <h3 className={styles.agentName}>
                {property.broker?.name || 'Julieta Arena'}
              </h3>
              <p className={styles.agentTitle}>Martillera Pública</p>
              {property.broker && (
                <span className={styles.verifiedBadge}>✓ Verificado</span>
              )}
            </div>
          </div>
        </div>

        {/* Botones de contacto rápido */}
        <div className={styles.quickActions}>
          <button
            className={`${styles.actionBtn} ${styles.whatsappBtn} button-press ripple`}
            onClick={handleWhatsApp}
          >
            💬 WhatsApp
          </button>
          <button
            className={`${styles.actionBtn} ${styles.phoneBtn} button-press ripple`}
            onClick={handlePhone}
          >
            📞 Llamar
          </button>
        </div>

        {/* Divider */}
        <div className={styles.divider}>
          <span>Envíanos un mensaje</span>
        </div>

        {/* Formulario de contacto */}
        <form className={styles.contactForm} onSubmit={handleFormSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Nombre y apellido *
            </label>
            <input
              id="name"
              type="text"
              required
              className={styles.input}
              value={contactFormData.name}
              onChange={(e) =>
                setContactFormData({ ...contactFormData, name: e.target.value })
              }
              placeholder="Tu nombre"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Teléfono *
            </label>
            <input
              id="phone"
              type="tel"
              required
              className={styles.input}
              value={contactFormData.phone}
              onChange={(e) =>
                setContactFormData({ ...contactFormData, phone: e.target.value })
              }
              placeholder="+54 9 XXX XXX XXXX"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email *
            </label>
            <input
              id="email"
              type="email"
              required
              className={styles.input}
              value={contactFormData.email}
              onChange={(e) =>
                setContactFormData({ ...contactFormData, email: e.target.value })
              }
              placeholder="tu@email.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Mensaje
            </label>
            <textarea
              id="message"
              rows={3}
              className={styles.textarea}
              value={contactFormData.message}
              onChange={(e) =>
                setContactFormData({ ...contactFormData, message: e.target.value })
              }
              placeholder={`Estoy interesado/a en ${property.title}`}
            />
          </div>

          <button
            type="submit"
            className={`${styles.submitBtn} button-press ripple`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Enviando...
              </>
            ) : (
              '📤 Enviar mensaje'
            )}
          </button>
        </form>

        {/* Botón de agendar visita */}
        <button
          className={`${styles.appointmentBtn} button-press ripple`}
          onClick={() => setShowAppointment(true)}
        >
          📅 Agendar Visita
        </button>
      </div>

      {/* Responsable */}
      {property.broker && (
        <div className={styles.responsibleInfo}>
          <p className={styles.responsibleText}>
            <strong>Corredor responsable:</strong> {property.broker.name} CPCPI 00000
          </p>
        </div>
      )}

      {/* Modal de agendar visita */}
      {showAppointment && (
        <AppointmentBooking
          property={property}
          onClose={() => setShowAppointment(false)}
          onSuccess={(appointmentId) => {
            setShowAppointment(false)
          }}
        />
      )}
    </div>
  )
}

