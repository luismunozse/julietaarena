import SearchHero from '@/components/SearchHero'
import FeaturedProperties from '@/components/FeaturedProperties'
import styles from './page.module.css'

export const metadata = {
  title: 'Buscar Propiedades | Julieta Arena - Martillera Pública',
  description: 'Busca tu propiedad ideal en Córdoba. Casas, departamentos, terrenos, locales y oficinas en venta y alquiler.',
  keywords: 'buscar propiedades Córdoba, casas departamentos, inmobiliaria, martillera pública',
}

export default function PropiedadesPage() {
  return (
    <main className={styles.pageContainer}>
      <SearchHero />
      <FeaturedProperties />
    </main>
  )
}
