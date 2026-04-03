'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import { supabase } from '@/lib/supabaseClient'
import { useToast } from '@/components/ToastContainer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Send, Loader2, Clock, Users, ChevronDown, CalendarCheck } from 'lucide-react'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

interface PropertySidebarProps {
  property: Property
}

const formatPrice = (price: number, currency: 'ARS' | 'USD' = 'USD'): string => {
  const prefix = currency === 'USD' ? 'USD' : 'ARS'
  const formatted = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
  return `${prefix} ${formatted}`
}

export default function PropertySidebar({ property }: PropertySidebarProps) {
  const [contactFormData, setContactFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })
  const [showEmailField, setShowEmailField] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { success, error: showError } = useToast()

  // Simulated social proof — random but stable per property
  const [socialProof] = useState(() => {
    const seed = property.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    const viewers = (seed % 15) + 3
    return { viewers }
  })

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from('property_inquiries')
        .insert([
          {
            property_id: property.id,
            property_title: property.title,
            property_price: formatPrice(property.price, property.currency),
            property_location: property.location,
            customer_name: contactFormData.name,
            customer_email: contactFormData.email || undefined,
            customer_phone: contactFormData.phone,
            message: contactFormData.message || `Hola, vi ${property.title} en ${property.location} y me gustaria coordinar una visita.`,
            status: 'nueva'
          }
        ])
        .select()

      if (error) {
        showError('Error al enviar el mensaje. Por favor, contactanos por WhatsApp.', 7000)
        return
      }

      success('Mensaje enviado! Te contactaremos pronto.', 5000)
      setSubmitted(true)
      setContactFormData({ name: '', phone: '', email: '', message: '' })
    } catch (err) {
      showError('Error al enviar el mensaje. Por favor, contactanos por WhatsApp.', 7000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsApp = () => {
    const message = `Hola, vi ${property.title} en ${property.location} y me gustaria coordinar una visita.`
    const whatsappUrl = `https://wa.me/543513078376?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handlePhone = () => {
    window.location.href = 'tel:+543513078376'
  }

  const handleScheduleVisit = () => {
    const message = `Hola Julieta, me gustaria agendar una visita para ver ${property.title} en ${property.location}. Que dias y horarios tenes disponibles?`
    const whatsappUrl = `https://wa.me/543513078376?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Price Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-5 text-center">
          <span className="text-sm text-white/80 block mb-1">Precio</span>
          <p className="text-3xl sm:text-4xl font-bold text-white m-0">
            {formatPrice(property.price, property.currency)}
          </p>
          {property.operation === 'alquiler' && (
            <span className="text-sm text-white/80">/mes</span>
          )}
        </div>
        {property.expenses && (
          <div className="px-5 py-3 bg-surface text-center border-t border-border">
            <span className="text-sm text-muted">
              + {formatPrice(property.expenses, 'ARS')} expensas
            </span>
          </div>
        )}
      </div>

      {/* Social proof + trust signals */}
      <div className="flex items-center gap-3 px-1">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Users className="w-3.5 h-3.5" />
          <span><strong className="text-foreground">{socialProof.viewers}</strong> personas vieron esta propiedad</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600">
          <Clock className="w-3.5 h-3.5" />
          <span>Responde en &lt;1h</span>
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-5">
        {/* Agent Info */}
        <div className="flex items-center gap-4 pb-5 border-b border-border">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shrink-0 shadow-lg">
            {property.broker?.avatar ? (
              <Image
                src={property.broker.avatar}
                alt={property.broker.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white text-2xl font-bold">JA</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-brand-dark truncate">
              {property.broker?.name || 'Julieta Arena'}
            </h3>
            <p className="text-sm text-muted">Martillera Publica - Perito Tasador</p>
            <p className="text-xs text-brand-primary font-medium mt-1">MP: 06-1216 - CPCPI Cordoba</p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-5">
          <Button
            className="h-12 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium shadow-sm"
            onClick={handleWhatsApp}
          >
            <WhatsAppIcon className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            className="h-12 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-medium"
            onClick={handlePhone}
          >
            <Phone className="w-5 h-5 mr-2" />
            Llamar
          </Button>
        </div>

        {/* Schedule visit CTA */}
        <Button
          variant="outline"
          className="w-full h-11 mb-4 border-brand-secondary text-brand-dark hover:bg-brand-secondary/10 font-medium gap-2"
          onClick={handleScheduleVisit}
        >
          <CalendarCheck className="w-4 h-4" />
          Agendar visita
        </Button>

        {/* Divider */}
        <div className="flex items-center text-xs text-muted mb-4">
          <div className="flex-1 h-px bg-border" />
          <span className="px-3 uppercase tracking-wide">o enviar consulta</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Contact Form — reduced friction */}
        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">Consulta enviada!</p>
            <p className="text-xs text-muted">Te contactaremos a la brevedad.</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 text-brand-primary"
              onClick={() => setSubmitted(false)}
            >
              Enviar otra consulta
            </Button>
          </div>
        ) : (
          <form className="space-y-3" onSubmit={handleFormSubmit}>
            <div>
              <Label htmlFor="name" className="text-xs font-medium text-muted mb-1.5 block">
                Nombre *
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={contactFormData.name}
                onChange={(e) =>
                  setContactFormData({ ...contactFormData, name: e.target.value })
                }
                placeholder="Tu nombre"
                className="h-10 text-sm"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs font-medium text-muted mb-1.5 block">
                Telefono / WhatsApp *
              </Label>
              <Input
                id="phone"
                type="tel"
                required
                value={contactFormData.phone}
                onChange={(e) =>
                  setContactFormData({ ...contactFormData, phone: e.target.value })
                }
                placeholder="351 123-4567"
                className="h-10 text-sm"
              />
            </div>

            {/* Collapsible email field */}
            {!showEmailField ? (
              <button
                type="button"
                className="flex items-center gap-1 text-xs text-brand-primary hover:text-brand-accent font-medium transition-colors"
                onClick={() => setShowEmailField(true)}
              >
                <ChevronDown className="w-3 h-3" />
                Agregar email (opcional)
              </button>
            ) : (
              <div>
                <Label htmlFor="email" className="text-xs font-medium text-muted mb-1.5 block">
                  Email (opcional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactFormData.email}
                  onChange={(e) =>
                    setContactFormData({ ...contactFormData, email: e.target.value })
                  }
                  placeholder="tu@email.com"
                  className="h-10 text-sm"
                />
              </div>
            )}

            <div>
              <Label htmlFor="message" className="text-xs font-medium text-muted mb-1.5 block">
                Mensaje (opcional)
              </Label>
              <Textarea
                id="message"
                rows={2}
                value={contactFormData.message}
                onChange={(e) =>
                  setContactFormData({ ...contactFormData, message: e.target.value })
                }
                placeholder={`Hola, vi esta propiedad y me gustaria coordinar una visita...`}
                className="min-h-[60px] resize-none text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-brand-primary hover:bg-brand-accent text-white font-semibold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Quiero que me contacten
                </>
              )}
            </Button>
          </form>
        )}
      </div>

      {/* Info Footer */}
      <p className="text-xs text-center text-muted px-4">
        Al enviar, aceptas ser contactado por Julieta Arena Inmobiliaria.
      </p>
    </div>
  )
}
