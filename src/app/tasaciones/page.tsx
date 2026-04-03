import AppraisalForm from '@/components/AppraisalForm'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Check, FileText, Camera, MapPin, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Tasaciones Profesionales | Julieta Arena',
  description:
    'Solicita una tasacion respaldada por una martillera publica matriculada en Cordoba. Valoracion objetiva segun el mercado argentino y normativa vigente.',
}

const INCLUDES = [
  'Analisis comparativo de mercado actual',
  'Relevamiento fotografico y estado constructivo',
  'Informe de documentacion y situacion catastral',
  'Sugerencias de estrategia comercial',
]

const FEATURES = [
  'Informe firmado por perito tasador MP: 06-1216 (Ley 7191 / CBA)',
  'Compatibles con gestiones bancarias y organismos publicos',
  'Entrega digital en 48/72 h habiles luego de la visita',
]

export default function TasacionesPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <PageBreadcrumb items={[{ label: 'Tasaciones' }]} />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div>
              <p className="text-brand-secondary font-semibold text-sm uppercase tracking-wider mb-2">
                Tasaciones profesionales
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Valuaciones reales para decisiones seguras
              </h1>
              <p className="text-white/85 leading-relaxed mb-6 text-base sm:text-lg">
                Realizamos informes respaldados por normativa argentina, aplicando metodologias
                comparativas y de capitalizacion de renta para viviendas, campos, locales y
                desarrollos. Cada tasacion incluye referencias de mercado, estado dominial y
                documentacion requerida para operaciones ante escribanos y bancos.
              </p>
              <ul className="space-y-3">
                {FEATURES.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/90 text-sm sm:text-base">
                    <Check className="w-5 h-5 text-brand-secondary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Info card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-white text-xl font-semibold mb-4">Que incluye?</h3>
              <ul className="space-y-3 mb-6">
                {INCLUDES.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-white/85 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="bg-brand-secondary rounded-xl p-4 text-center">
                <span className="text-2xl font-bold text-brand-dark block">+15 anos</span>
                <p className="text-brand-dark/80 text-sm">
                  De experiencia valuando activos inmobiliarios en Cordoba
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-3">
              Solicita tu tasacion
            </h2>
            <p className="text-muted leading-relaxed">
              Completa el formulario con los datos de la propiedad. Te contactaremos en menos
              de 24 h habiles para coordinar la visita y enviarte el presupuesto de honorarios
              conforme al arancel profesional vigente.
            </p>
          </div>
          <AppraisalForm />
        </div>
      </section>
    </main>
  )
}
