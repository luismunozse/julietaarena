import Image from 'next/image'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={`section ${styles.about}`} id="sobre-mi">
      <div className="container">
        <div className={styles.aboutContent}>
          <div className={styles.aboutImage}>
            <Image 
              src="/images/perfil.jpeg" 
              alt="Julieta Arena - Martillera Pública"
              width={400}
              height={400}
              className={styles.profileImage}
              priority
            />
          </div>
          <div className={styles.aboutText}>
            <h2 className="section-title">Sobre Mí</h2>
            <h3 className={styles.aboutSubtitle}>Julieta Arena - Martillera Pública</h3>
            <p className={styles.aboutDescription}>
              Soy martillera pública matriculada con amplia experiencia en el mercado inmobiliario de Córdoba. 
              Mi compromiso es brindar un servicio profesional, transparente y personalizado a cada uno de mis clientes.
            </p>
            <p className={styles.aboutDescription}>
              Con años de trayectoria en el sector, me especializo en ofrecer soluciones integrales que abarcan desde 
              la compra-venta y alquiler de propiedades, hasta la gestión de remates judiciales y particulares como también asesoramiento en 
              trámites en general.
            </p>
            
            <div className={styles.aboutFeatures}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h4>Experiencia Profesional</h4>
                  <p>Años de trayectoria en el mercado inmobiliario</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h4>Transparencia Total</h4>
                  <p>Claridad y honestidad en cada transacción</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h4>Atención Personalizada</h4>
                  <p>Seguimiento dedicado a cada cliente</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

