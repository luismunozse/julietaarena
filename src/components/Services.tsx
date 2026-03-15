import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const services = [
  {
    title: 'Venta de Propiedades',
    description: 'Asesoramiento integral en la compra y venta de inmuebles con gestión completa del proceso.',
    href: '/propiedades',
    color: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop&crop=center',
  },
  {
    title: 'Alquileres',
    description: 'Administración de alquileres residenciales y comerciales con seguimiento profesional.',
    href: '/propiedades?tipo=alquiler',
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop&crop=center',
  },
  {
    title: 'Remates Judiciales',
    description: 'Especialización en remates judiciales y subastas públicas con experiencia legal.',
    href: '/remates-judiciales',
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop&crop=center',
  },
  {
    title: 'Jubilaciones',
    description: 'Asesoramiento en trámites de jubilaciones y gestiones previsionales.',
    href: '#contacto',
    color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop&crop=center',
  },
  {
    title: 'Tasaciones',
    description: 'Tasaciones profesionales para compra-venta, sucesiones y fines judiciales.',
    href: '/tasaciones',
    color: '#ec4899',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop&crop=center',
  },
  {
    title: 'Asesoramiento Legal',
    description: 'Consultoría especializada en aspectos legales de transacciones inmobiliarias.',
    href: '/asesoramiento-legal',
    color: '#06b6d4',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop&crop=center',
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
            const isAnchor = service.href.startsWith('#')

            const cardContent = (
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer group overflow-hidden">
                {/* Image */}
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {/* Color accent bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: service.color }}
                  />
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
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
