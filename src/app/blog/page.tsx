import { Metadata } from 'next'
import BlogSection from '@/components/BlogSection'

export const metadata: Metadata = {
  title: 'Blog y Noticias - Julieta Arena | Martillera Pública',
  description: 'Mantente informado sobre las últimas noticias del mercado inmobiliario, consejos legales y actualizaciones del sector.',
  keywords: 'blog inmobiliario, noticias inmobiliarias, consejos legales, mercado inmobiliario, Julieta Arena',
  openGraph: {
    title: 'Blog y Noticias - Julieta Arena',
    description: 'Mantente informado sobre las últimas noticias del mercado inmobiliario y consejos legales.',
    type: 'website',
  },
}

export default function BlogPage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div style={{
        background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
        padding: '80px 0 60px',
        color: '#fff',
        textAlign: 'center' as const
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#fff'
          }}>Blog y Noticias</h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.9)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Mantente informado sobre las últimas tendencias del mercado inmobiliario,
            consejos legales y actualizaciones del sector.
          </p>
        </div>
      </div>

      <div className="container">
        <BlogSection showHeader={false} showFooter={false} />
      </div>
    </main>
  )
}
