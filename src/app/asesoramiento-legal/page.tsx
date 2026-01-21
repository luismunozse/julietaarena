import LegalServices from '@/components/LegalServices'
import { Scale, FileText, Building2, UserCheck, CheckCircle, Mail } from 'lucide-react'

export const metadata = {
  title: 'Asesoramiento Legal | Julieta Arena - Martillera Pública',
  description: 'Servicios legales especializados en derecho argentino: redacciones de contratos, declaratoria de herederos, sucesiones, trato abreviado y cuota alimentaria.',
  keywords: 'asesoramiento legal, derecho argentino, sucesiones, declaratoria herederos, contratos, cuota alimentaria, trato abreviado',
}

const HERO_BADGES = [
  { icon: Scale, text: 'Derecho Argentino' },
  { icon: FileText, text: 'Documentación Legal' },
  { icon: Building2, text: 'Tribunales' },
  { icon: UserCheck, text: 'Asesoría Personalizada' },
]

const REGULATORY_CARDS = [
  {
    title: 'Código Civil y Comercial',
    items: [
      'Contratos (arts. 957-1707)',
      'Derechos reales y sucesiones (arts. 1882-2532)',
      'Derecho de familia y alimentos (arts. 401-704)'
    ]
  },
  {
    title: 'Procedimiento Provincial',
    items: [
      'Trámite de sucesiones en Córdoba',
      'Medidas cautelares y edictos',
      'Actuaciones ante Juzgados de 1ª Instancia'
    ]
  },
  {
    title: 'Organismos de control',
    items: [
      'AFIP y rentas provinciales',
      'Registro de la Propiedad Inmueble',
      'Inspección de Personas Jurídicas'
    ]
  },
  {
    title: 'Protección del consumidor',
    items: [
      'Ley 24.240 y normas complementarias',
      'Contratos inmobiliarios y locación',
      'Prevención de cláusulas abusivas'
    ]
  }
]

const PROCESS_STEPS = [
  'Entrevista inicial, análisis de antecedentes y firma de carta de servicio.',
  'Auditoría documental y pedidos de partidas/legajos en registros oficiales.',
  'Estrategia jurídica y estimación de honorarios según aranceles vigentes.',
  'Presentaciones y gestiones ante juzgados, registros o escribanías.',
  'Informe final y acompañamiento en la ejecución (transferencias, inscripción, etc.).'
]

const CTA_BENEFITS = [
  'Honorarios regulados y acuerdo de confidencialidad.',
  'Atención virtual en todo el país y presencial en Córdoba.',
  'Seguimiento del expediente con reportes mensuales.'
]

export default function AsesoramientoLegalPage() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-brand-primary via-brand-accent to-brand-dark text-white py-16 lg:py-24 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-secondary/20 text-brand-secondary rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            Servicios Legales
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Asesoramiento Legal Especializado
          </h1>
          <p className="text-lg lg:text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Servicios jurídicos profesionales en derecho argentino para particulares y empresas
          </p>

          {/* Hero badges */}
          <div className="flex flex-wrap justify-center gap-3">
            {HERO_BADGES.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"
              >
                <item.icon className="w-5 h-5 text-brand-secondary" />
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Section */}
      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
              Marco Legal
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-accent mb-4">
              Marco normativo argentino
            </h2>
            <p className="text-muted max-w-3xl mx-auto">
              Trabajamos conforme al Código Civil y Comercial de la Nación, la Ley de Procedimiento Civil y
              Comercial de Córdoba, normas de AFIP y registros provinciales. Cada informe incluye citas legales
              y jurisprudenciales vigentes para respaldar la estrategia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REGULATORY_CARDS.map(card => (
              <article
                key={card.title}
                className="bg-white p-6 rounded-2xl shadow-sm border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-brand-primary mb-4">{card.title}</h3>
                <ul className="space-y-2">
                  {card.items.map(item => (
                    <li key={item} className="text-muted text-sm flex items-start gap-2">
                      <span className="text-brand-secondary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Services Component */}
      <section className="py-16 lg:py-20 bg-white">
        <LegalServices />
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-brand-secondary/10 text-brand-primary rounded-full text-sm font-medium mb-4">
              Proceso
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-brand-accent mb-4">
              Metodología de trabajo
            </h2>
            <p className="text-muted max-w-2xl mx-auto">
              Seguimos un proceso transparente compatible con los requisitos de los tribunales y organismos argentinos.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {PROCESS_STEPS.map((step, index) => (
              <div key={index} className="flex gap-4 mb-6 last:mb-0">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-accent text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-brand-primary/20">
                  {index + 1}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-foreground">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-brand-primary to-brand-accent">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            <div className="md:flex md:items-start md:gap-10">
              <div className="flex-1 mb-8 md:mb-0">
                <h2 className="text-2xl lg:text-3xl font-bold text-brand-accent mb-4">
                  Consultá tu caso
                </h2>
                <p className="text-muted mb-6">
                  Elaboramos presupuestos claros y por escrito, acorde al arancel profesional de Córdoba (Ley 9459).
                  Enviá tu consulta y recibí una respuesta dentro de las próximas 24/48 h hábiles.
                </p>
                <ul className="space-y-3">
                  {CTA_BENEFITS.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-3 md:w-64">
                <a
                  href="https://wa.me/+543513078376"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-[#25D366] text-white font-semibold rounded-xl hover:bg-[#20bd5a] hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-[#25D366]/25"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Consultar por WhatsApp
                </a>
                <a
                  href="mailto:inmobiliaria72juliarena@gmail.com"
                  className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-brand-primary text-brand-primary font-semibold rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-200"
                >
                  <Mail className="w-5 h-5" />
                  Enviar antecedentes
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
