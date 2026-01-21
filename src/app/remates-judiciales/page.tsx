import { Metadata } from 'next'
import Image from 'next/image'


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
    <main className="pageContainer">
      {/* Hero Section */}
      <section className="heroSection">
        <div className="container">
          <div className="heroContent">
            <div className="heroText">
              <h1 className="heroTitle">
                Remates Judiciales
              </h1>
              <p className="heroSubtitle">
                Oportunidades únicas de inversión inmobiliaria con asesoría profesional
              </p>
              <p className="heroDescription">
                Como martillera pública certificada, te brindo la experiencia y conocimiento 
                necesario para participar exitosamente en remates judiciales, maximizando 
                tus oportunidades de inversión.
              </p>
              <div className="heroButtons">
                <a href="#proximos-remates" className="btn btn-primary">
                  Ver Próximos Remates
                </a>
                <a href="#contacto" className="btn btn-secondary">
                  Consultar Asesoría
                </a>
              </div>
            </div>
            <div className="heroImage">
              <Image
                src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop"
                alt="Remates judiciales"
                width={600}
                height={400}
                className="image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What are Judicial Auctions */}
      <section className="whatSection">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">¿Qué son los Remates Judiciales?</h2>
            <p className="section-subtitle">
              Una oportunidad única de inversión con garantía legal
            </p>
          </div>
          
          <div className="whatGrid">
            <div className="whatCard">
              <div className="cardIcon">
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
            
            <div className="whatCard">
              <div className="cardIcon">
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
            
            <div className="whatCard">
              <div className="cardIcon">
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
      <section className="processSection">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Proceso de Participación</h2>
            <p className="section-subtitle">
              Te guío paso a paso en tu participación
            </p>
          </div>
          
          <div className="processSteps">
            <div className="step">
              <div className="stepNumber">1</div>
              <div className="stepContent">
                <h3>Evaluación de Oportunidades</h3>
                <p>
                  Analizamos las propiedades disponibles, su ubicación, 
                  estado y potencial de valorización.
                </p>
              </div>
            </div>
            
            <div className="step">
              <div className="stepNumber">2</div>
              <div className="stepContent">
                <h3>Preparación de Documentación</h3>
                <p>
                  Te ayudo a reunir toda la documentación necesaria 
                  para participar en el remate.
                </p>
              </div>
            </div>
            
            <div className="step">
              <div className="stepNumber">3</div>
              <div className="stepContent">
                <h3>Estrategia de Puja</h3>
                <p>
                  Desarrollamos una estrategia personalizada para 
                  maximizar tus posibilidades de éxito.
                </p>
              </div>
            </div>
            
            <div className="step">
              <div className="stepNumber">4</div>
              <div className="stepContent">
                <h3>Participación en el Remate</h3>
                <p>
                  Te acompaño durante todo el proceso de subasta 
                  y te asesoro en tiempo real.
                </p>
              </div>
            </div>
            
            <div className="step">
              <div className="stepNumber">5</div>
              <div className="stepContent">
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
      <section className="auctionsSection" id="proximos-remates">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Próximos Remates</h2>
            <p className="section-subtitle">
              Oportunidades disponibles para participar
            </p>
          </div>
          
          <div className="auctionsGrid">
            <div className="auctionCard">
              <div className="auctionImage">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop"
                  alt="Casa en remate"
                  width={400}
                  height={250}
                  className="image"
                />
                <div className="auctionBadge">En Venta</div>
              </div>
              <div className="auctionContent">
                <h3>Casa Familiar en Nueva Córdoba</h3>
                <p className="auctionAddress">Av. Hipólito Yrigoyen 1234, Córdoba</p>
                <div className="auctionDetails">
                  <div className="detail">
                    <span className="label">Valor Base:</span>
                    <span className="value">$45.000.000</span>
                  </div>
                  <div className="detail">
                    <span className="label">Fecha:</span>
                    <span className="value">25 de Diciembre, 2024</span>
                  </div>
                  <div className="detail">
                    <span className="label">Hora:</span>
                    <span className="value">10:00 AM</span>
                  </div>
                </div>
                <div className="auctionActions">
                  <button className="btn btn-primary">Ver Detalles</button>
                  <button className="btn btn-outline">Interesado</button>
                </div>
              </div>
            </div>
            
            <div className="auctionCard">
              <div className="auctionImage">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"
                  alt="Departamento en remate"
                  width={400}
                  height={250}
                  className="image"
                />
                <div className="auctionBadge">En Venta</div>
              </div>
              <div className="auctionContent">
                <h3>Departamento en Centro</h3>
                <p className="auctionAddress">San Martín 567, Córdoba</p>
                <div className="auctionDetails">
                  <div className="detail">
                    <span className="label">Valor Base:</span>
                    <span className="value">$28.000.000</span>
                  </div>
                  <div className="detail">
                    <span className="label">Fecha:</span>
                    <span className="value">2 de Enero, 2025</span>
                  </div>
                  <div className="detail">
                    <span className="label">Hora:</span>
                    <span className="value">2:00 PM</span>
                  </div>
                </div>
                <div className="auctionActions">
                  <button className="btn btn-primary">Ver Detalles</button>
                  <button className="btn btn-outline">Interesado</button>
                </div>
              </div>
            </div>
            
            <div className="auctionCard">
              <div className="auctionImage">
                <Image
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=250&fit=crop"
                  alt="Local comercial en remate"
                  width={400}
                  height={250}
                  className="image"
                />
                <div className="auctionBadge">En Venta</div>
              </div>
              <div className="auctionContent">
                <h3>Local Comercial en Güemes</h3>
                <p className="auctionAddress">Belgrano 890, Córdoba</p>
                <div className="auctionDetails">
                  <div className="detail">
                    <span className="label">Valor Base:</span>
                    <span className="value">$35.000.000</span>
                  </div>
                  <div className="detail">
                    <span className="label">Fecha:</span>
                    <span className="value">8 de Enero, 2025</span>
                  </div>
                  <div className="detail">
                    <span className="label">Hora:</span>
                    <span className="value">11:00 AM</span>
                  </div>
                </div>
                <div className="auctionActions">
                  <button className="btn btn-primary">Ver Detalles</button>
                  <button className="btn btn-outline">Interesado</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefitsSection">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ventajas de Participar con Nosotros</h2>
            <p className="section-subtitle">
              Por qué elegir nuestra asesoría profesional
            </p>
          </div>
          
          <div className="benefitsGrid">
            <div className="benefitCard">
              <div className="benefitIcon">
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
            
            <div className="benefitCard">
              <div className="benefitIcon">
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
            
            <div className="benefitCard">
              <div className="benefitIcon">
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
            
            <div className="benefitCard">
              <div className="benefitIcon">
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
      <section className="ctaSection" id="contacto">
        <div className="container">
          <div className="ctaContent">
            <h2>¿Listo para Participar en tu Primer Remate?</h2>
            <p>
              Contactame para una consulta personalizada y descubre 
              las mejores oportunidades de inversión inmobiliaria.
            </p>
            <div className="ctaButtons">
              <a href="https://wa.me/543513078376" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Consultar por WhatsApp
              </a>
              <a href="tel:+543513078376" className="btn btn-secondary">
                Llamar Ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
