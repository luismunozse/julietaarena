import { Metadata } from 'next'
import BlogSection from '@/components/BlogSection'
import PageBreadcrumb from '@/components/PageBreadcrumb'

export const metadata: Metadata = {
  title: 'Blog y Noticias - Julieta Arena | Martillera Publica',
  description: 'Mantente informado sobre las ultimas noticias del mercado inmobiliario, consejos legales y actualizaciones del sector.',
  keywords: 'blog inmobiliario, noticias inmobiliarias, consejos legales, mercado inmobiliario, Julieta Arena',
  openGraph: {
    title: 'Blog y Noticias - Julieta Arena',
    description: 'Mantente informado sobre las ultimas noticias del mercado inmobiliario y consejos legales.',
    type: 'website',
  },
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <PageBreadcrumb items={[{ label: 'Blog' }]} />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-dark via-brand-accent to-brand-primary py-14 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
            Blog y Noticias
          </h1>
          <p className="text-lg text-white/85 max-w-xl mx-auto leading-relaxed">
            Mantente informado sobre las ultimas tendencias del mercado inmobiliario,
            consejos legales y actualizaciones del sector.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <BlogSection showHeader={false} showFooter={false} />
      </div>
    </main>
  )
}
