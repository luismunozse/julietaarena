'use client'

import { Search, ClipboardList, MessageCircle } from 'lucide-react'
import Link from 'next/link'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export default function Hero() {
  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, selector: string) => {
    e.preventDefault()
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary" />

      {/* Decorative glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-brand-secondary/20 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-brand-primary/30 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-medium text-white/90 bg-white/10 border border-white/15 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-brand-secondary animate-pulse" />
              Servicios Inmobiliarios Profesionales en Córdoba
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-8 animate-fade-in-up">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
              Julieta Arena
            </span>
            <span className="block mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-secondary leading-tight tracking-tight">
              Martillera Pública
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-2xl mb-12 text-lg md:text-xl text-white/75 leading-relaxed animate-fade-in-up delay-200" style={{ marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            Más de 15 años brindando servicios de excelencia en el mercado inmobiliario.
            Comprometida con la transparencia y la satisfacción de cada cliente.
          </p>

          {/* 3 CTA Buttons — diferenciados por funnel */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in-up delay-300">
            {/* CTA 1: Awareness — Buscar propiedades */}
            <Link
              href="/propiedades"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold bg-brand-secondary text-brand-dark shadow-lg shadow-brand-secondary/25 hover:shadow-xl hover:shadow-brand-secondary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <Search className="w-5 h-5" />
              Ver Propiedades
            </Link>

            {/* CTA 2: Seller Intent — Tasá tu propiedad */}
            <Link
              href="/tasaciones"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/10 border-2 border-white/30 backdrop-blur-sm hover:bg-white hover:text-brand-dark hover:border-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <ClipboardList className="w-5 h-5" />
              Tasá tu Propiedad
            </Link>

            {/* CTA 3: Decision — Contacto directo WhatsApp */}
            <a
              href="https://wa.me/543513078376?text=Hola%20Julieta%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20tus%20servicios%20inmobiliarios."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-semibold text-white bg-[#25D366] shadow-lg shadow-[#25D366]/25 hover:bg-[#20BD5A] hover:shadow-xl hover:shadow-[#25D366]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Hablemos
            </a>
          </div>

          {/* Micro-copy de confianza */}
          <p className="mt-6 text-sm text-white/50 animate-fade-in-up delay-300">
            Sin compromiso · Respuesta inmediata · MP 06-1216
          </p>
        </div>
      </div>
    </section>
  )
}
