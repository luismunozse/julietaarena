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
      style={{
        padding: '60px 0 40px 0',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              background: 'rgba(232, 184, 109, 0.1)',
              color: '#2c5f7d',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '16px'
            }}
          >
            Nuestros Servicios
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#1a4158',
              marginBottom: '16px'
            }}
          >
            Servicios Profesionales
          </h2>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#636e72',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.7'
            }}
          >
            Soluciones integrales en servicios inmobiliarios y martillería,
            con más de 15 años de experiencia en el mercado.
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px'
          }}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon
            const isAnchor = service.href.startsWith('#')

            const cardContent = (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s ease',
                  height: '100%',
                  cursor: 'pointer'
                }}
                className="serviceCard"
              >
                {/* Icon */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    background: service.color,
                    boxShadow: `0 8px 20px ${service.color}40`
                  }}
                >
                  <IconComponent style={{ width: '28px', height: '28px', color: 'white' }} strokeWidth={1.5} />
                </div>

                {/* Content */}
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#1a4158',
                    marginBottom: '12px'
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    color: '#636e72',
                    lineHeight: '1.7',
                    marginBottom: '20px'
                  }}
                >
                  {service.description}
                </p>

                {/* Link indicator */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#2c5f7d'
                  }}
                >
                  <span>Más información</span>
                  <ArrowRight style={{ width: '16px', height: '16px', marginLeft: '8px' }} />
                </div>
              </div>
            )

            return isAnchor ? (
              <a key={index} href={service.href} style={{ textDecoration: 'none' }}>
                {cardContent}
              </a>
            ) : (
              <Link key={index} href={service.href} style={{ textDecoration: 'none' }}>
                {cardContent}
              </Link>
            )
          })}
        </div>
      </div>

    </section>
  )
}
