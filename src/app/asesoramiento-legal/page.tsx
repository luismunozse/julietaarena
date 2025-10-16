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

      <div className={styles.contentSection}>
        <LegalServices />
      </div>
    </main>
  )
}
