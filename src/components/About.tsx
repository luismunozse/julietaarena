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
    <div className="group flex items-start gap-4 p-4 rounded-xl bg-surface hover:bg-brand-primary/5 transition-colors duration-300">
      <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-brand-accent mb-1">{title}</h4>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

/* =============================================================================
   MAIN COMPONENT
============================================================================= */

export default function About() {
  return (
    <section id="sobre-mi" className="pt-10 pb-10 lg:pt-12 lg:pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image Section */}
          <div className="relative max-w-md mx-auto lg:max-w-none">
            {/* Decorative background frame */}
            <div className="absolute inset-4 bg-gradient-to-br from-brand-secondary to-brand-primary rounded-3xl rotate-3" />

            {/* Main image */}
            <Image
              src="/images/perfil.jpeg"
              alt="Julieta Arena - Martillera Pública"
              width={500}
              height={600}
              className="relative w-full aspect-[4/5] object-cover rounded-3xl shadow-2xl border-4 border-white"
              priority
            />
          </div>

          {/* Content Section */}
          <div className="lg:pl-4">
            {/* Section badge */}
            <span className="inline-block px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-6">
              Sobre Mí
            </span>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-accent mb-2">
              Julieta Arena
            </h2>
            <p className="text-xl text-brand-secondary font-medium mb-6">
              Martillera Pública Matriculada
            </p>

            {/* Quote */}
            <div className="relative pl-6 border-l-4 border-brand-secondary mb-8">
              <Quote className="absolute -left-3 -top-1 w-6 h-6 text-brand-secondary bg-white" />
              <p className="text-muted italic text-lg leading-relaxed">
                &quot;Mi compromiso es brindar un servicio profesional, transparente y personalizado
                a cada uno de mis clientes.&quot;
              </p>
            </div>

            {/* Description */}
            <p className="text-muted leading-relaxed mb-8">
              Soy martillera pública matriculada con amplia experiencia en el mercado inmobiliario de Córdoba.
              Me especializo en ofrecer soluciones integrales que abarcan desde la compra-venta y alquiler
              de propiedades, hasta la gestión de remates judiciales y asesoramiento en trámites en general.
            </p>

            {/* Features */}
            <div className="space-y-3">
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
