'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import styles from './PropertySidebar.module.css'

interface PropertySidebarProps {
  property: Property
}

export default function PropertySidebar({ property }: PropertySidebarProps) {
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

    const formatPrice = (price: number, currency: 'ARS' | 'USD' = 'USD'): string => {
      return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(price)
    }

    try {
      // Guardar la consulta en Supabase
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert([
          {
            property_id: property.id,
            property_title: property.title,
            property_price: formatPrice(property.price, property.currency),
            property_location: property.location,
            customer_name: contactFormData.name,
            customer_email: contactFormData.email,
            customer_phone: contactFormData.phone,
            message: contactFormData.message || `Estoy interesado/a en ${property.title}`,
            status: 'nueva'
          }
        ])
        .select()

      if (error) {
        console.error('Error al guardar consulta:', error)
        showError('Error al enviar el mensaje. Por favor, contactanos por WhatsApp.', 7000)
        return
      }

      success('¡Mensaje enviado correctamente! Te contactaremos pronto.', 5000)
      setContactFormData({ name: '', phone: '', email: '', message: '' })
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
                <Image
                  src={property.broker.avatar}
                  alt={property.broker.name}
                  width={60}
                  height={60}
                  className={styles.agentAvatarImage}
                />
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
            aria-label="Contactar por WhatsApp"
            title="WhatsApp"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.phoneBtn} button-press ripple`}
            onClick={handlePhone}
            aria-label="Llamar por teléfono"
            title="Llamar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
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
      </div>

      {/* Responsable */}
      {property.broker && (
        <div className={styles.responsibleInfo}>
          <p className={styles.responsibleText}>
            <strong>Corredor responsable:</strong> {property.broker.name} CPCPI 00000
          </p>
        </div>
      )}
    </div>
  )
}
