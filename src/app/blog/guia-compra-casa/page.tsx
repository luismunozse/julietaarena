import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guía Completa para Comprar tu Primera Casa - Julieta Arena',
  description: 'Descubre todo lo que necesitas saber para comprar tu primera casa: financiamiento, documentación, proceso legal y consejos profesionales.',
  keywords: 'comprar casa, primera vivienda, financiamiento hipotecario, proceso legal, Julieta Arena',
  openGraph: {
    title: 'Guía Completa para Comprar tu Primera Casa',
    description: 'Descubre todo lo que necesitas saber para comprar tu primera casa: financiamiento, documentación, proceso legal y consejos profesionales.',
    type: 'article',
  },
}

export default function GuiaCompraCasaPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.9rem',
            color: '#636e72',
            marginBottom: '1.5rem'
          }}>
            <Link href="/blog" style={{ color: '#2c5f7d', textDecoration: 'none' }}>Blog</Link> / <span>Guía para Comprar tu Primera Casa</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <span style={{
              backgroundColor: '#2c5f7d',
              color: '#fff',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 500
            }}>Consejos Legales</span>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>8 min lectura</span>
            <span style={{ color: '#636e72', fontSize: '0.9rem' }}>15 de Diciembre, 2024</span>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1a4158',
            marginBottom: '1rem',
            lineHeight: 1.2
          }}>
            Guía Completa para Comprar tu Primera Casa
          </h1>

          <p style={{
            fontSize: '1.25rem',
            color: '#636e72',
            marginBottom: '2rem',
            lineHeight: 1.6
          }}>
            Comprar tu primera casa es uno de los pasos más importantes en la vida.
            Te guiamos paso a paso para que tomes la mejor decisión.
          </p>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              overflow: 'hidden'
            }}>
              <Image
                src="/images/perfil.jpeg"
                alt="Julieta Arena"
                width={50}
                height={50}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
            <div>
              <h4 style={{ margin: 0, color: '#1a4158', fontWeight: 600 }}>Julieta Arena</h4>
              <p style={{ margin: 0, color: '#636e72', fontSize: '0.9rem' }}>Martillera Pública</p>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto 2rem',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <Image
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop"
            alt="Casa familiar moderna"
            width={800}
            height={400}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <article style={{
          maxWidth: '800px',
          margin: '0 auto',
          backgroundColor: '#fff',
          padding: '2.5rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ color: '#1a4158', fontSize: '1.5rem', marginTop: 0, marginBottom: '1rem' }}>1. Evaluación de tu Situación Financiera</h2>
          <p style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1rem' }}>
            Antes de comenzar a buscar una casa, es fundamental que evalúes tu situación financiera actual.
            Esto incluye analizar tus ingresos, gastos, ahorros y deudas existentes.
          </p>

          <h3 style={{ color: '#1a4158', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Puntos clave a considerar:</h3>
          <ul style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li><strong style={{ color: '#1a4158' }}>Ingresos estables:</strong> Asegúrate de tener una fuente de ingresos confiable</li>
            <li><strong style={{ color: '#1a4158' }}>Capacidad de ahorro:</strong> Debes poder ahorrar al menos el 20% del valor de la propiedad</li>
            <li><strong style={{ color: '#1a4158' }}>Historial crediticio:</strong> Un buen historial te ayudará a obtener mejores tasas de interés</li>
            <li><strong style={{ color: '#1a4158' }}>Gastos mensuales:</strong> No destines más del 30% de tus ingresos al pago de la hipoteca</li>
          </ul>

          <h2 style={{ color: '#1a4158', fontSize: '1.5rem', marginBottom: '1rem' }}>2. Búsqueda y Selección de la Propiedad</h2>
          <p style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Una vez que tengas clara tu situación financiera, es momento de comenzar la búsqueda.
            Define tus prioridades: ubicación, tamaño, características específicas y presupuesto máximo.
          </p>

          <div style={{
            backgroundColor: '#e8f4f8',
            border: '1px solid #2c5f7d',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ color: '#2c5f7d', marginTop: 0, marginBottom: '0.5rem' }}>Consejo Profesional</h4>
            <p style={{ color: '#1a4158', margin: 0, lineHeight: 1.6 }}>
              Siempre visita la propiedad en diferentes horarios y días de la semana para evaluar
              el ruido, tráfico y ambiente del vecindario.
            </p>
          </div>

          <h2 style={{ color: '#1a4158', fontSize: '1.5rem', marginBottom: '1rem' }}>3. Proceso Legal y Documentación</h2>
          <p style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1rem' }}>
            El proceso legal es crucial para proteger tu inversión. Como martillera pública,
            te recomiendo seguir estos pasos:
          </p>

          <ol style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li><strong style={{ color: '#1a4158' }}>Verificación de títulos:</strong> Asegúrate de que el vendedor tenga la propiedad libre de gravámenes</li>
            <li><strong style={{ color: '#1a4158' }}>Inspección técnica:</strong> Contrata un profesional para evaluar el estado de la construcción</li>
            <li><strong style={{ color: '#1a4158' }}>Escrituración:</strong> El proceso de transferencia debe realizarse ante escribano público</li>
            <li><strong style={{ color: '#1a4158' }}>Registro de la propiedad:</strong> Actualización en el registro inmobiliario</li>
          </ol>

          <h2 style={{ color: '#1a4158', fontSize: '1.5rem', marginBottom: '1rem' }}>4. Financiamiento y Hipoteca</h2>
          <p style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1rem' }}>
            Existen varias opciones de financiamiento disponibles. Es importante comparar
            diferentes entidades financieras y sus condiciones.
          </p>

          <h3 style={{ color: '#1a4158', fontSize: '1.25rem', marginBottom: '0.75rem' }}>Tipos de financiamiento:</h3>
          <ul style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li><strong style={{ color: '#1a4158' }}>Hipoteca tradicional:</strong> Préstamo a largo plazo con garantía hipotecaria</li>
            <li><strong style={{ color: '#1a4158' }}>Procrear:</strong> Programa del gobierno para vivienda familiar</li>
            <li><strong style={{ color: '#1a4158' }}>Fideicomiso:</strong> Alternativa para aquellos que no califican para hipoteca tradicional</li>
          </ul>

          <h2 style={{ color: '#1a4158', fontSize: '1.5rem', marginBottom: '1rem' }}>5. Costos Adicionales a Considerar</h2>
          <p style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1rem' }}>
            Además del precio de la propiedad, debes considerar varios costos adicionales:
          </p>

          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            {[
              { label: 'Escrituración', value: '2-3% del valor' },
              { label: 'Impuestos de sellos', value: '1-2% del valor' },
              { label: 'Registro de la propiedad', value: '$50.000 - $100.000' },
              { label: 'Seguro de título', value: '$30.000 - $60.000' },
              { label: 'Inspección técnica', value: '$80.000 - $150.000' }
            ].map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '0.75rem 0',
                borderBottom: index < 4 ? '1px solid #e5e7eb' : 'none'
              }}>
                <span style={{ color: '#636e72' }}>{item.label}</span>
                <span style={{ color: '#1a4158', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          <h2 style={{ color: '#1a4158', fontSize: '1.5rem', marginBottom: '1rem' }}>Conclusión</h2>
          <p style={{ color: '#636e72', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Comprar tu primera casa es un proceso que requiere paciencia, investigación y asesoramiento profesional.
            No dudes en consultar con profesionales del sector para tomar la mejor decisión.
          </p>

          <div style={{
            backgroundColor: '#2c5f7d',
            color: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            textAlign: 'center' as const
          }}>
            <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '0.5rem' }}>¿Necesitas asesoramiento profesional?</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '1rem' }}>Como martillera pública, puedo ayudarte en todo el proceso de compra de tu vivienda.</p>
            <Link href="/#contacto" className="btn btn-primary" style={{
              backgroundColor: '#e8b86d',
              color: '#1a4158',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              Consultar Ahora
            </Link>
          </div>
        </article>

        <div style={{
          maxWidth: '800px',
          margin: '2rem auto 0',
          backgroundColor: '#fff',
          padding: '1.5rem 2rem',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap' as const,
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ color: '#636e72', fontWeight: 500 }}>Etiquetas:</span>
            {['#primera-casa', '#financiamiento', '#consejos-legales', '#proceso-legal'].map((tag) => (
              <span key={tag} style={{
                backgroundColor: '#f8f9fa',
                color: '#2c5f7d',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.85rem'
              }}>{tag}</span>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap' as const
          }}>
            <span style={{ color: '#636e72' }}>Compartir:</span>
            {['Facebook', 'Twitter', 'LinkedIn', 'WhatsApp'].map((platform) => (
              <button key={platform} style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e5e7eb',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#1a4158',
                fontSize: '0.9rem'
              }}>{platform}</button>
            ))}
          </div>
        </div>

        <div style={{
          maxWidth: '800px',
          margin: '2rem auto 0'
        }}>
          <h3 style={{ color: '#1a4158', marginBottom: '1.5rem' }}>Artículos Relacionados</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { title: 'Guía de Financiamiento Hipotecario', desc: 'Todo lo que necesitas saber sobre préstamos hipotecarios' },
              { title: 'Documentación Necesaria para Comprar', desc: 'Lista completa de documentos requeridos' }
            ].map((post, index) => (
              <div key={index} style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
              }}>
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop"
                  alt={post.title}
                  width={300}
                  height={200}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ color: '#1a4158', marginTop: 0, marginBottom: '0.5rem', fontSize: '1rem' }}>{post.title}</h4>
                  <p style={{ color: '#636e72', margin: 0, fontSize: '0.9rem' }}>{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
