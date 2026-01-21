import AppraisalForm from '@/components/AppraisalForm'

export const metadata = {
  title: 'Tasaciones Profesionales | Julieta Arena',
  description:
    'Solicitá una tasación respaldada por una martillera pública matriculada en Córdoba. Valoración objetiva según el mercado argentino y normativa vigente.',
}

export default function TasacionesPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <section style={{
        background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
        padding: '80px 0 60px',
        color: '#fff'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            alignItems: 'center'
          }}>
            <div>
              <p style={{
                color: '#e8b86d',
                fontWeight: 600,
                fontSize: '0.9rem',
                textTransform: 'uppercase' as const,
                letterSpacing: '1px',
                marginBottom: '0.5rem'
              }}>Tasaciones profesionales</p>
              <h1 style={{
                fontSize: '2.25rem',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '1rem',
                lineHeight: 1.2
              }}>Valuaciones reales para decisiones seguras</h1>
              <p style={{
                color: 'rgba(255,255,255,0.9)',
                lineHeight: 1.7,
                marginBottom: '1.5rem'
              }}>
                Realizamos informes respaldados por normativa argentina, aplicando metodologías comparativas y de capitalización
                de renta para viviendas, campos, locales y desarrollos. Cada tasación incluye referencias de mercado, estado
                dominial y documentación requerida para operaciones ante escribanos y bancos.
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column' as const,
                gap: '0.75rem'
              }}>
                {[
                  'Informe firmado por martillera pública (Ley 7191 / CBA)',
                  'Compatibles con gestiones bancarias y organismos públicos',
                  'Entrega digital en 48/72 h hábiles luego de la visita'
                ].map((item, index) => (
                  <li key={index} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    color: 'rgba(255,255,255,0.9)'
                  }}>
                    <span style={{ color: '#e8b86d' }}>&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '2rem',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '1rem', fontSize: '1.25rem' }}>¿Qué incluye?</h3>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column' as const,
                  gap: '0.5rem'
                }}>
                  {[
                    'Análisis comparativo de mercado actual',
                    'Relevamiento fotográfico y estado constructivo',
                    'Informe de documentación y situación catastral',
                    'Sugerencias de estrategia comercial'
                  ].map((item, index) => (
                    <li key={index} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem' }}>
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{
                backgroundColor: '#e8b86d',
                borderRadius: '12px',
                padding: '1rem',
                textAlign: 'center' as const
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a4158', display: 'block' }}>+15 años</span>
                <p style={{ margin: 0, color: '#1a4158', fontSize: '0.9rem' }}>De experiencia valuando activos inmobiliarios en Córdoba</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            textAlign: 'center' as const,
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            <h2 style={{ color: '#1a4158', fontSize: '2rem', marginBottom: '1rem' }}>Solicitá tu tasación</h2>
            <p style={{ color: '#636e72', lineHeight: 1.6 }}>
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
