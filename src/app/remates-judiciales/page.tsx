import { Metadata } from 'next'
import Image from 'next/image'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Remates Judiciales - Julieta Arena | Martillera Pública',
  description: 'Participa en remates judiciales con la asesoría profesional de Julieta Arena. Oportunidades de inversión inmobiliaria con garantía legal.',
  keywords: 'remates judiciales, subastas, martillera pública, inversión inmobiliaria, oportunidades, Julieta Arena',
  openGraph: {
    title: 'Remates Judiciales - Julieta Arena',
    description: 'Participa en remates judiciales con la asesoría profesional de Julieta Arena. Oportunidades de inversión inmobiliaria con garantía legal.',
    type: 'website',
  },
}

export default function RematesJudicialesPage() {
  return (
    <main className={styles.pageContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                Remates Judiciales
              </h1>
              <p className={styles.heroSubtitle}>
                Oportunidades únicas de inversión inmobiliaria con asesoría profesional
              </p>
              <p className={styles.heroDescription}>
                Como martillera pública certificada, te brindo la experiencia y conocimiento 
                necesario para participar exitosamente en remates judiciales, maximizando 
                tus oportunidades de inversión.
              </p>
              <div className={styles.heroButtons}>
                <a href="#proximos-remates" className="btn btn-primary">
                  Ver Próximos Remates
                </a>
                <a href="#contacto" className="btn btn-secondary">
                  Consultar Asesoría
                </a>
              </div>
            </div>
            <div className={styles.heroImage}>
              <Image
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop"
                alt="Remates judiciales"
                width={600}
                height={400}
                className={styles.image}
              />
            </div>
          </div>
        </div>
      </section>

      {/* What are Judicial Auctions */}
      <section className={styles.whatSection}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Qué son los Remates Judiciales?</h2>
            <p className="section-subtitle">
              Una oportunidad única de inversión con garantía legal
            </p>
          </div>
          
          <div className={styles.whatGrid}>
            <div className={styles.whatCard}>
              <div className={styles.cardIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m0-7v7m0-7h4m-4 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-6 0h6"/>
                </svg>
              </div>
              <h3>Proceso Legal</h3>
              <p>
                Los remates judiciales son subastas públicas donde se venden propiedades 
                embargadas por orden judicial, garantizando la legalidad de la transacción.
              </p>
            </div>
            
            <div className={styles.whatCard}>
              <div className={styles.cardIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Oportunidades</h3>
              <p>
                Propiedades que pueden adquirirse por debajo del valor de mercado, 
                representando excelentes oportunidades de inversión.
              </p>
            </div>
            
            <div className={styles.whatCard}>
              <div className={styles.cardIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3>Garantía Legal</h3>
              <p>
                Títulos limpios y transferencia inmediata, con la garantía del 
                Poder Judicial y la supervisión de martilleros públicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Proceso de Participación</h2>
            <p className="section-subtitle">
              Te guío paso a paso en tu participación
            </p>
          </div>
          
          <div className={styles.processSteps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3>Evaluación de Oportunidades</h3>
                <p>
                  Analizamos las propiedades disponibles, su ubicación, 
                  estado y potencial de valorización.
                </p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3>Preparación de Documentación</h3>
                <p>
                  Te ayudo a reunir toda la documentación necesaria 
                  para participar en el remate.
                </p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3>Estrategia de Puja</h3>
                <p>
                  Desarrollamos una estrategia personalizada para 
                  maximizar tus posibilidades de éxito.
                </p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <h3>Participación en el Remate</h3>
                <p>
                  Te acompaño durante todo el proceso de subasta 
                  y te asesoro en tiempo real.
                </p>
              </div>
            </div>
            
            <div className={styles.step}>
              <div className={styles.stepNumber}>5</div>
              <div className={styles.stepContent}>
                <h3>Finalización Legal</h3>
                <p>
                  Gestionamos todos los trámites legales para 
                  la transferencia de la propiedad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Auctions */}
      <section className={styles.auctionsSection} id="proximos-remates">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Próximos Remates</h2>
            <p className="section-subtitle">
              Oportunidades disponibles para participar
            </p>
          </div>
          
          <div className={styles.auctionsGrid}>
            <div className={styles.auctionCard}>
              <div className={styles.auctionImage}>
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop"
                  alt="Casa en remate"
                  width={400}
                  height={250}
                  className={styles.image}
                />
                <div className={styles.auctionBadge}>En Venta</div>
              </div>
              <div className={styles.auctionContent}>
                <h3>Casa Familiar en Nueva Córdoba</h3>
                <p className={styles.auctionAddress}>Av. Hipólito Yrigoyen 1234, Córdoba</p>
                <div className={styles.auctionDetails}>
                  <div className={styles.detail}>
                    <span className={styles.label}>Valor Base:</span>
                    <span className={styles.value}>$45.000.000</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Fecha:</span>
                    <span className={styles.value}>25 de Diciembre, 2024</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Hora:</span>
                    <span className={styles.value}>10:00 AM</span>
                  </div>
                </div>
                <div className={styles.auctionActions}>
                  <button className="btn btn-primary">Ver Detalles</button>
                  <button className="btn btn-outline">Interesado</button>
                </div>
              </div>
            </div>
            
            <div className={styles.auctionCard}>
              <div className={styles.auctionImage}>
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"
                  alt="Departamento en remate"
                  width={400}
                  height={250}
                  className={styles.image}
                />
                <div className={styles.auctionBadge}>En Venta</div>
              </div>
              <div className={styles.auctionContent}>
                <h3>Departamento en Centro</h3>
                <p className={styles.auctionAddress}>San Martín 567, Córdoba</p>
                <div className={styles.auctionDetails}>
                  <div className={styles.detail}>
                    <span className={styles.label}>Valor Base:</span>
                    <span className={styles.value}>$28.000.000</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Fecha:</span>
                    <span className={styles.value}>2 de Enero, 2025</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Hora:</span>
                    <span className={styles.value}>2:00 PM</span>
                  </div>
                </div>
                <div className={styles.auctionActions}>
                  <button className="btn btn-primary">Ver Detalles</button>
                  <button className="btn btn-outline">Interesado</button>
                </div>
              </div>
            </div>
            
            <div className={styles.auctionCard}>
              <div className={styles.auctionImage}>
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop"
                  alt="Local comercial en remate"
                  width={400}
                  height={250}
                  className={styles.image}
                />
                <div className={styles.auctionBadge}>En Venta</div>
              </div>
              <div className={styles.auctionContent}>
                <h3>Local Comercial en Güemes</h3>
                <p className={styles.auctionAddress}>Belgrano 890, Córdoba</p>
                <div className={styles.auctionDetails}>
                  <div className={styles.detail}>
                    <span className={styles.label}>Valor Base:</span>
                    <span className={styles.value}>$35.000.000</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Fecha:</span>
                    <span className={styles.value}>8 de Enero, 2025</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.label}>Hora:</span>
                    <span className={styles.value}>11:00 AM</span>
                  </div>
                </div>
                <div className={styles.auctionActions}>
                  <button className="btn btn-primary">Ver Detalles</button>
                  <button className="btn btn-outline">Interesado</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ventajas de Participar con Nosotros</h2>
            <p className="section-subtitle">
              Por qué elegir nuestra asesoría profesional
            </p>
          </div>
          
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3>Experiencia Comprobada</h3>
              <p>
                Más de 10 años de experiencia en remates judiciales, 
                con cientos de transacciones exitosas.
              </p>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3>Análisis Profesional</h3>
              <p>
                Evaluación detallada de cada propiedad para identificar 
                las mejores oportunidades de inversión.
              </p>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h3>Acompañamiento Personalizado</h3>
              <p>
                Te guío durante todo el proceso, desde la evaluación 
                inicial hasta la finalización legal.
              </p>
            </div>
            
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11H5a2 2 0 0 0-2 2v3c0 1.1.9 2 2 2h4m0-7v7m0-7h4m-4 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-6 0h6"/>
                </svg>
              </div>
              <h3>Gestión Legal Completa</h3>
              <p>
                Manejo de toda la documentación y trámites legales 
                necesarios para la transferencia de la propiedad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection} id="contacto">
        <div className="container">
          <div className={styles.ctaContent}>
            <h2>¿Listo para Participar en tu Primer Remate?</h2>
            <p>
              Contactame para una consulta personalizada y descubre 
              las mejores oportunidades de inversión inmobiliaria.
            </p>
            <div className={styles.ctaButtons}>
              <a href="https://wa.me/5493512345678" className="btn btn-primary">
                Consultar por WhatsApp
              </a>
              <a href="tel:+5493512345678" className="btn btn-secondary">
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
