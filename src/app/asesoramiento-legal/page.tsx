import LegalServices from '@/components/LegalServices'
import styles from './page.module.css'

export const metadata = {
  title: 'Asesoramiento Legal | Julieta Arena - Martillera Pública',
  description: 'Servicios legales especializados en derecho argentino: redacciones de contratos, declaratoria de herederos, sucesiones, trato abreviado y cuota alimentaria.',
  keywords: 'asesoramiento legal, derecho argentino, sucesiones, declaratoria herederos, contratos, cuota alimentaria, trato abreviado',
}

export default function AsesoramientoLegalPage() {
  return (
    <main className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Asesoramiento Legal Especializado</h1>
            <p className={styles.heroSubtitle}>
              Servicios jurídicos profesionales en derecho argentino para particulares y empresas
            </p>
            <div className={styles.heroFeatures}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>⚖️</span>
                <span className={styles.featureText}>Derecho Argentino</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📋</span>
                <span className={styles.featureText}>Documentación Legal</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🏛️</span>
                <span className={styles.featureText}>Tribunales</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>👨‍💼</span>
                <span className={styles.featureText}>Asesoría Personalizada</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.regulatorySection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Marco normativo argentino</h2>
            <p>
              Trabajamos conforme al Código Civil y Comercial de la Nación, la Ley de Procedimiento Civil y
              Comercial de Córdoba, normas de AFIP y registros provinciales. Cada informe incluye citas legales
              y jurisprudenciales vigentes para respaldar la estrategia.
            </p>
          </div>
          <div className={styles.regulatoryGrid}>
            {[
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
            ].map(card => (
              <article key={card.title} className={styles.regulatoryCard}>
                <h3>{card.title}</h3>
                <ul>
                  {card.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.contentSection}>
        <LegalServices />
      </div>

      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Metodología de trabajo</h2>
            <p>Seguimos un proceso transparente compatible con los requisitos de los tribunales y organismos argentinos.</p>
          </div>
          <div className={styles.processTimeline}>
            {[
              'Entrevista inicial, análisis de antecedentes y firma de carta de servicio.',
              'Auditoría documental y pedidos de partidas/legajos en registros oficiales.',
              'Estrategia jurídica y estimación de honorarios según aranceles vigentes.',
              'Presentaciones y gestiones ante juzgados, registros o escribanías.',
              'Informe final y acompañamiento en la ejecución (transferencias, inscripción, etc.).'
            ].map((step, index) => (
              <div key={index} className={styles.timelineItem}>
                <span className={styles.timelineNumber}>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div>
              <h2>Consultá tu caso</h2>
              <p>
                Elaboramos presupuestos claros y por escrito, acorde al arancel profesional de Córdoba (Ley 9459).
                Enviá tu consulta y recibí una respuesta dentro de las próximas 24/48 h hábiles.
              </p>
              <ul className={styles.ctaList}>
                <li>Honorarios regulados y acuerdo de confidencialidad.</li>
                <li>Atención virtual en todo el país y presencial en Córdoba.</li>
                <li>Seguimiento del expediente con reportes mensuales.</li>
              </ul>
            </div>
            <div className={styles.ctaActions}>
              <a href="https://wa.me/+543519999999" target="_blank" rel="noopener noreferrer" className={styles.whatsappCta}>
                💬 Consultar por WhatsApp
              </a>
              <a href="mailto:inmobiliaria72juliarena@gmail.com" className={styles.secondaryCta}>
                ✉️ Enviar antecedentes
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
