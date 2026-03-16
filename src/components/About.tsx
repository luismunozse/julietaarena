'use client'

import Image from 'next/image'
import { Award, ShieldCheck, Heart, Quote, type LucideIcon } from 'lucide-react'

/* =============================================================================
   TYPES
============================================================================= */

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

/* =============================================================================
   CONSTANTS
============================================================================= */

const FEATURES: Feature[] = [
  {
    icon: Award,
    title: 'Experiencia Profesional',
    description: 'Más de 15 años de trayectoria en el mercado inmobiliario de Córdoba',
  },
  {
    icon: ShieldCheck,
    title: 'Transparencia Total',
    description: 'Claridad y honestidad en cada transacción, sin sorpresas',
  },
  {
    icon: Heart,
    title: 'Atención Personalizada',
    description: 'Seguimiento dedicado y cercano a cada cliente',
  },
]

/* =============================================================================
   SUB-COMPONENTS
============================================================================= */

function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <div className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-surface hover:bg-brand-primary/5 transition-colors duration-300">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex-shrink-0 bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="min-w-0">
        <h4 className="font-semibold text-brand-accent mb-0.5 sm:mb-1 text-sm sm:text-base">{title}</h4>
        <p className="text-muted text-xs sm:text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function About() {
  return (
    <section id="sobre-mi" className="py-10 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

          {/* Image Section */}
          <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:max-w-none order-1 lg:order-none">
            {/* Decorative background frame */}
            <div className="absolute inset-3 sm:inset-4 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-2xl sm:rounded-3xl rotate-3" />

            {/* Main image */}
            <Image
              src="/images/perfil.jpeg"
              alt="Julieta Arena - Martillera Pública"
              width={500}
              height={600}
              className="relative w-full aspect-[4/5] object-cover rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-white"
              loading="lazy"
              sizes="(max-width: 640px) 280px, (max-width: 768px) 384px, (max-width: 1024px) 448px, 500px"
            />
          </div>

          {/* Content Section */}
          <div className="lg:pl-4 text-center lg:text-left order-2 lg:order-none">
            {/* Section badge */}
            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-4 sm:mb-6">
              Sobre Mí
            </span>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand-accent mb-1 sm:mb-2">
              Julieta Arena
            </h2>
            <p className="text-lg sm:text-xl text-brand-secondary font-medium mb-4 sm:mb-6">
              Martillera Pública · Perito Tasador
            </p>

            {/* Quote */}
            <div className="relative pl-5 sm:pl-6 border-l-4 border-brand-secondary mb-6 sm:mb-8 text-left">
              <Quote className="absolute -left-3 -top-1 w-5 h-5 sm:w-6 sm:h-6 text-brand-secondary bg-white" />
              <p className="text-muted italic text-base sm:text-lg leading-relaxed">
                &quot;Mi compromiso es brindar un servicio profesional, transparente y personalizado
                a cada uno de mis clientes.&quot;
              </p>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted leading-relaxed mb-6 sm:mb-8 text-left">
              Soy martillera pública y perito tasador matriculada (MP: 06-1216 · CPCPI Córdoba) con amplia experiencia en el mercado inmobiliario.
              Me especializo en ofrecer soluciones integrales que abarcan desde la compra-venta y alquiler
              de propiedades, tasaciones profesionales y remates judiciales.
            </p>

            {/* Features */}
            <div className="space-y-2 sm:space-y-3">
              {FEATURES.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
