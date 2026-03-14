import { Home, Key, Gavel, Users, ClipboardCheck, Scale, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  {
    icon: Home,
    title: 'Venta de Propiedades',
    description: 'Asesoramiento integral en la compra y venta de inmuebles con gestión completa del proceso.',
    href: '/propiedades',
    color: '#3b82f6',
  },
  {
    icon: Key,
    title: 'Alquileres',
    description: 'Administración de alquileres residenciales y comerciales con seguimiento profesional.',
    href: '/propiedades?tipo=alquiler',
    color: '#10b981',
  },
  {
    icon: Gavel,
    title: 'Remates Judiciales',
    description: 'Especialización en remates judiciales y subastas públicas con experiencia legal.',
    href: '/remates-judiciales',
    color: '#f59e0b',
  },
  {
    icon: Users,
    title: 'Jubilaciones',
    description: 'Asesoramiento en trámites de jubilaciones y gestiones previsionales.',
    href: '#contacto',
    color: '#8b5cf6',
  },
  {
    icon: ClipboardCheck,
    title: 'Tasaciones',
    description: 'Tasaciones profesionales para compra-venta, sucesiones y fines judiciales.',
    href: '/tasaciones',
    color: '#ec4899',
  },
  {
    icon: Scale,
    title: 'Asesoramiento Legal',
    description: 'Consultoría especializada en aspectos legales de transacciones inmobiliarias.',
    href: '/asesoramiento-legal',
    color: '#06b6d4',
  },
]

export default function Services() {
  return (
    <section
      id="servicios"
      className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-white to-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
            Nuestros Servicios
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-accent mb-4">
            Servicios Profesionales
          </h2>
          <p className="text-base sm:text-lg text-muted max-w-xl mx-auto leading-relaxed px-2">
            Soluciones integrales en servicios inmobiliarios y martillería,
            con más de 15 años de experiencia en el mercado.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isAnchor = service.href.startsWith('#')

            const cardContent = (
              <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer group">
                {/* Icon */}
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-105 transition-transform duration-300"
                  style={{
                    background: service.color,
                    boxShadow: `0 8px 20px ${service.color}40`
                  }}
                >
                  <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold text-brand-accent mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-muted leading-relaxed mb-4 sm:mb-5">
                  {service.description}
                </p>

                {/* Link indicator */}
                <div className="flex items-center text-sm font-medium text-brand-primary group-hover:text-brand-secondary transition-colors">
                  <span>Más información</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )

            return isAnchor ? (
              <a key={index} href={service.href} className="no-underline block">
                {cardContent}
              </a>
            ) : (
              <Link key={index} href={service.href} className="no-underline block">
                {cardContent}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
