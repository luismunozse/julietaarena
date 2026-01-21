'use client'

import { ArrowRight } from 'lucide-react'

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

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <a
              href="#servicios"
              onClick={(e) => scrollTo(e, '#servicios')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold bg-brand-secondary text-brand-dark shadow-lg shadow-brand-secondary/25 hover:shadow-xl hover:shadow-brand-secondary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Ver Servicios
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a
              href="#contacto"
              onClick={(e) => scrollTo(e, '#contacto')}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/10 border-2 border-white/30 backdrop-blur-sm hover:bg-white hover:text-brand-dark hover:border-white hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Contactar Ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
