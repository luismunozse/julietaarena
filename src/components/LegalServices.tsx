'use client'

import { useState } from 'react'
import { legalServices, LegalService } from '@/data/legalServices'
import { X, Clock, DollarSign, Phone } from 'lucide-react'

// WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

/* =============================================================================
   SUB-COMPONENTS
============================================================================= */

interface ServiceCardProps {
  service: LegalService
  onViewDetails: () => void
}

function ServiceCard({ service, onViewDetails }: ServiceCardProps) {
  return (
    <article className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="flex gap-4 mb-4">
        <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {service.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-brand-accent mb-1 truncate">{service.title}</h3>
          <p className="text-sm text-muted line-clamp-2">{service.description}</p>
        </div>
      </div>

      {/* Details */}
      <div className="flex gap-6 py-4 border-y border-border mb-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Duración
          </span>
          <span className="text-sm font-medium text-brand-accent">{service.duration}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            Costo
          </span>
          <span className="text-sm font-medium text-brand-accent">{service.cost}</span>
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-brand-accent mb-2">Características principales:</h4>
        <ul className="space-y-1.5 pl-4 text-sm text-muted">
          {service.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="list-disc">{feature}</li>
          ))}
          {service.features.length > 3 && (
            <li className="list-none text-brand-primary italic">
              +{service.features.length - 3} características más
            </li>
          )}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onViewDetails}
          className="flex-1 py-2.5 px-4 border-2 border-brand-primary text-brand-primary rounded-lg font-medium text-sm hover:bg-brand-primary hover:text-white transition-all duration-200"
        >
          Ver Detalles
        </button>
        <a
          href="https://wa.me/+543513078376"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 px-4 bg-brand-primary text-white rounded-lg font-medium text-sm text-center hover:bg-brand-accent transition-colors"
        >
          Consultar
        </a>
      </div>
    </article>
  )
}

interface ServiceModalProps {
  service: LegalService
  onClose: () => void
}

function ServiceModal({ service, onClose }: ServiceModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-border sticky top-0 bg-white z-10">
          <div className="w-14 h-14 bg-brand-primary/10 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
            {service.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-brand-accent mb-1">{service.title}</h2>
            <p className="text-sm text-muted">{service.description}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center text-muted hover:text-foreground transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Features */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-brand-accent mb-3">Características del Servicio</h3>
            <ul className="space-y-2 pl-5 text-sm text-muted list-disc">
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-brand-accent mb-3">Requisitos Necesarios</h3>
            <ul className="space-y-2 pl-5 text-sm text-muted list-disc">
              {service.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>

          {/* Process */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-brand-accent mb-3">Proceso de Trabajo</h3>
            <ol className="space-y-2 pl-5 text-sm text-muted list-decimal">
              {service.process.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Documents */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-brand-accent mb-3">Documentación Requerida</h3>
            <ul className="space-y-2 pl-5 text-sm text-muted list-disc">
              {service.documents.map((document, index) => (
                <li key={index}>{document}</li>
              ))}
            </ul>
          </div>

          {/* Legal Basis */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-brand-accent mb-3">Marco Legal</h3>
            <ul className="space-y-2 pl-5 text-sm text-muted list-disc">
              {service.legalBasis.map((basis, index) => (
                <li key={index}>{basis}</li>
              ))}
            </ul>
          </div>

          {/* Summary */}
          <div className="flex gap-8 p-4 bg-surface rounded-xl">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">Duración estimada</span>
              <span className="text-base font-semibold text-brand-primary">{service.duration}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted">Inversión</span>
              <span className="text-base font-semibold text-brand-primary">{service.cost}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 p-6 border-t border-border sticky bottom-0 bg-white">
          <a
            href="https://wa.me/+543513078376"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-[#25D366] text-white rounded-xl font-semibold hover:bg-[#20bd5a] transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5" />
            Consultar por WhatsApp
          </a>
          <a
            href="tel:+543513078376"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-brand-primary text-white rounded-xl font-semibold hover:bg-brand-accent transition-colors"
          >
            <Phone className="w-5 h-5" />
            Llamar Ahora
          </a>
        </div>
      </div>
    </div>
  )
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function LegalServices() {
  const [selectedService, setSelectedService] = useState<LegalService | null>(null)

  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
          Nuestros Servicios
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-accent mb-4">
          Servicios Legales Especializados
        </h2>
        <p className="text-muted max-w-2xl mx-auto">
          Asesoramiento jurídico profesional en derecho argentino para resolver sus necesidades legales
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {legalServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onViewDetails={() => setSelectedService(service)}
          />
        ))}
      </div>

      {/* Modal */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  )
}
