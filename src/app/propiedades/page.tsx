import SearchHero from '@/components/SearchHero'
import FeaturedProperties from '@/components/FeaturedProperties'

export const revalidate = 120

export const metadata = {
  title: 'Buscar Propiedades | Julieta Arena - Martillera Pública',
  description: 'Busca tu propiedad ideal en Córdoba. Casas, departamentos, terrenos, locales y oficinas en venta y alquiler.',
  keywords: 'buscar propiedades Córdoba, casas departamentos, inmobiliaria, martillera pública',
}

export default function PropiedadesPage() {
  return (
    <main className="min-h-screen bg-surface">
      <SearchHero />
      <FeaturedProperties />
    </main>
  )
}
