import AppraisalForm from '@/components/AppraisalForm'
import styles from './page.module.css'

export const metadata = {
  title: 'Tasaciones Profesionales | Julieta Arena',
  description:
    'Solicitá una tasación respaldada por una martillera pública matriculada en Córdoba. Valoración objetiva según el mercado argentino y normativa vigente.',
}

export default function TasacionesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <p className={styles.kicker}>Tasaciones profesionales</p>
              <h1>Valuaciones reales para decisiones seguras</h1>
              <p>
                Realizamos informes respaldados por normativa argentina, aplicando metodologías comparativas y de capitalización
                de renta para viviendas, campos, locales y desarrollos. Cada tasación incluye referencias de mercado, estado
                dominial y documentación requerida para operaciones ante escribanos y bancos.
              </p>
              <ul className={styles.heroList}>
                <li>Informe firmado por martillera pública (Ley 7191 / CBA)</li>
                <li>Compatibles con gestiones bancarias y organismos públicos</li>
                <li>Entrega digital en 48/72 h hábiles luego de la visita</li>
              </ul>
            </div>
            <div className={styles.heroCard}>
              <div>
                <h3>¿Qué incluye?</h3>
                <ul>
                  <li>Análisis comparativo de mercado actual</li>
                  <li>Relevamiento fotográfico y estado constructivo</li>
                  <li>Informe de documentación y situación catastral</li>
                  <li>Sugerencias de estrategia comercial</li>
                </ul>
              </div>
              <div className={styles.heroBadge}>
                <span>+15 años</span>
                <p>De experiencia valuando activos inmobiliarios en Córdoba</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.formSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Solicitá tu tasación</h2>
            <p>
              Completá el formulario con los datos de la propiedad. Te contactaremos en menos de 24 h hábiles para coordinar la
              visita y enviarte el presupuesto de honorarios conforme al arancel profesional vigente.
            </p>
          </div>
          <AppraisalForm />
        </div>
      </section>
    </main>
  )
}
