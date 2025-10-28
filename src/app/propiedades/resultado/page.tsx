import { Suspense } from 'react'
import PropertiesResults from '@/components/PropertiesResults'
import SkeletonLoader from '@/components/SkeletonLoader'

export const metadata = {
  title: 'Resultados de Búsqueda | Julieta Arena - Martillera Pública',
  description: 'Resultados de tu búsqueda de propiedades en Córdoba.',
}

export default function ResultadoPage() {
  return (
    <main>
      <Suspense fallback={<SkeletonLoader type="card" count={6} />}>
        <PropertiesResults />
      </Suspense>
    </main>
  )
}

