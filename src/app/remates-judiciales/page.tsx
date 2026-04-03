import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Gavel, Shield, TrendingUp, Search, FileText, Users, Scale, ChevronRight, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export const metadata: Metadata = {
  title: 'Remates Judiciales - Julieta Arena | Martillera Publica',
  description: 'Participa en remates judiciales con la asesoria profesional de Julieta Arena. Oportunidades de inversion inmobiliaria con garantia legal.',
  keywords: 'remates judiciales, subastas, martillera publica, inversion inmobiliaria, oportunidades, Julieta Arena',
  openGraph: {
    title: 'Remates Judiciales - Julieta Arena',
    description: 'Participa en remates judiciales con la asesoria profesional de Julieta Arena.',
    type: 'website',
  },
}

const WHAT_CARDS = [
  {
    icon: Scale,
    title: 'Proceso Legal',
    description: 'Los remates judiciales son subastas publicas donde se venden propiedades embargadas por orden judicial, garantizando la legalidad de la transaccion.',
  },
  {
    icon: TrendingUp,
    title: 'Oportunidades',
    description: 'Propiedades que pueden adquirirse por debajo del valor de mercado, representando excelentes oportunidades de inversion.',
  },
  {
    icon: Shield,
    title: 'Garantia Legal',
    description: 'Titulos limpios y transferencia inmediata, con la garantia del Poder Judicial y la supervision de martilleros publicos.',
  },
]

const STEPS = [
  { title: 'Evaluacion de Oportunidades', description: 'Analizamos las propiedades disponibles, su ubicacion, estado y potencial de valorizacion.' },
  { title: 'Preparacion de Documentacion', description: 'Te ayudo a reunir toda la documentacion necesaria para participar en el remate.' },
  { title: 'Estrategia de Puja', description: 'Desarrollamos una estrategia personalizada para maximizar tus posibilidades de exito.' },
  { title: 'Participacion en el Remate', description: 'Te acompano durante todo el proceso de subasta y te asesoro en tiempo real.' },
  { title: 'Finalizacion Legal', description: 'Gestionamos todos los tramites legales para la transferencia de la propiedad.' },
]

const BENEFITS = [
  { icon: Shield, title: 'Experiencia Comprobada', description: 'Mas de 10 anos de experiencia en remates judiciales, con cientos de transacciones exitosas.' },
  { icon: Search, title: 'Analisis Profesional', description: 'Evaluacion detallada de cada propiedad para identificar las mejores oportunidades de inversion.' },
  { icon: Users, title: 'Acompanamiento Personalizado', description: 'Te guio durante todo el proceso, desde la evaluacion inicial hasta la finalizacion legal.' },
  { icon: FileText, title: 'Gestion Legal Completa', description: 'Manejo de toda la documentacion y tramites legales necesarios para la transferencia de la propiedad.' },
]

export default function RematesJudicialesPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <PageBreadcrumb items={[{ label: 'Servicios', href: '/#servicios' }, { label: 'Remates Judiciales' }]} />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Remates Judiciales
              </h1>
              <p className="text-xl text-white/90 font-medium mb-3">
                Oportunidades unicas de inversion inmobiliaria con asesoria profesional
              </p>
              <p className="text-white/75 leading-relaxed mb-8">
                Como martillera publica certificada, te brindo la experiencia y conocimiento
                necesario para participar exitosamente en remates judiciales, maximizando
                tus oportunidades de inversion.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#proceso"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-secondary text-brand-dark font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <Gavel className="w-5 h-5" />
                  Como participar
                </a>
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  Consultar Asesoria
                </a>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-dark/40 z-10" />
              <Image
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=450&fit=crop"
                alt="Remates judiciales"
                fill
                className="object-cover"
                sizes="500px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What are Judicial Auctions */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Que son los Remates Judiciales?
            </h2>
            <p className="text-muted leading-relaxed">
              Una oportunidad unica de inversion con garantia legal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WHAT_CARDS.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="bg-white rounded-xl border border-border p-6 sm:p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{card.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="proceso" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Proceso de Participacion
            </h2>
            <p className="text-muted leading-relaxed">
              Te guio paso a paso en tu participacion
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-0">
            {STEPS.map((step, i) => (
              <div key={i} className="flex gap-4 sm:gap-6">
                {/* Timeline line + number */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                    {i + 1}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-brand-primary/30 to-brand-primary/5 my-1" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-8 sm:pb-10">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Auctions — "Proximamente" */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Proximos Remates
            </h2>
            <p className="text-muted leading-relaxed">
              Oportunidades disponibles para participar
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-5">
              <Gavel className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay remates programados actualmente
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-6 max-w-md mx-auto">
              Te notificaremos cuando haya nuevas oportunidades. Contactanos para que te
              avisemos cuando surjan propiedades que se ajusten a lo que buscas.
            </p>
            <a
              href="https://wa.me/543513078376?text=Hola%20Julieta%2C%20me%20interesan%20los%20remates%20judiciales.%20Quiero%20que%20me%20avisen%20cuando%20haya%20oportunidades."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-xl transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Avisame cuando haya remates
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Ventajas de Participar con Nosotros
            </h2>
            <p className="text-muted leading-relaxed">
              Por que elegir nuestra asesoria profesional
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon
              return (
                <div
                  key={benefit.title}
                  className="text-center p-6 rounded-xl hover:bg-surface transition-colors"
                >
                  <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-brand-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{benefit.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="py-16 sm:py-20 bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Listo para Participar en tu Primer Remate?
          </h2>
          <p className="text-white/80 mb-8 text-lg leading-relaxed">
            Contactame para una consulta personalizada y descubri las mejores
            oportunidades de inversion inmobiliaria.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/543513078376?text=Hola%20Julieta%2C%20me%20interesan%20los%20remates%20judiciales."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold rounded-xl transition-colors shadow-lg"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Consultar por WhatsApp
            </a>
            <a
              href="tel:+543513078376"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Llamar Ahora
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
