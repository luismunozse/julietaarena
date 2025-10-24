import { Metadata } from 'next'
import BlogSection from '@/components/BlogSection'
import styles from './page.module.css'

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
    <main className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className="container">
          <h1 className={styles.heroTitle}>Blog y Noticias</h1>
          <p className={styles.heroSubtitle}>
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
