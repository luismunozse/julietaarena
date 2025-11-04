import { Suspense } from 'react'
import PropertyDetail from '@/components/PropertyDetail'
import SkeletonLoader from '@/components/SkeletonLoader'
import { getPropertyById } from '@/data/properties'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface PropertyDetailPageProps {
  params: { id: string }
}

// Generar metadata dinámica
export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = getPropertyById(params.id)
  
  if (!property) {
    return {
      title: 'Propiedad no encontrada | Julieta Arena - Martillera Pública',
      description: 'La propiedad solicitada no se encuentra disponible.',
    }
  }

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(property.price)

  const operationText = property.operation === 'venta' ? 'en Venta' : 'en Alquiler'
  
  return {
    title: `${property.title} ${operationText} | Julieta Arena - Martillera Pública`,
    description: property.description,
    keywords: `${property.type}, ${property.location}, ${property.operation}, ${property.type}, martillera pública Córdoba`,
    openGraph: {
      title: `${property.title} ${operationText}`,
      description: property.description,
      images: property.images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${property.title} ${operationText}`,
      description: property.description,
      images: property.images,
    },
  }
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = getPropertyById(params.id)

  if (!property) {
    notFound()
  }

  return (
    <main>
      <Suspense fallback={<SkeletonLoader type="card" count={1} />}>
        <PropertyDetail property={property} />
      </Suspense>
    </main>
  )
}



