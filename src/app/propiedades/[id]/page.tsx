'use client'

import { useEffect, useState, use } from 'react'
import PropertyDetail from '@/components/PropertyDetail'
import SkeletonLoader from '@/components/SkeletonLoader'
import { useProperties } from '@/hooks/useProperties'
import { useRouter } from 'next/navigation'
import type { Property } from '@/data/properties'

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const router = useRouter()
  const { getPropertyById, isLoading } = useProperties()
  const [property, setProperty] = useState<Property | undefined>(undefined)

  // Unwrap params Promise using React.use() for Next.js 15 compatibility
  const { id } = use(params)

  useEffect(() => {
    if (!isLoading) {
      const foundProperty = getPropertyById(id)
      if (!foundProperty) {
        router.push('/propiedades')
      } else {
        setProperty(foundProperty)
      }
    }
  }, [id, isLoading, getPropertyById, router])

  // Dynamic document title
  useEffect(() => {
    if (property) {
      const priceFormatted = property.currency === 'USD'
        ? `USD ${property.price.toLocaleString()}`
        : `$ ${property.price.toLocaleString()}`
      document.title = `${property.title} - ${priceFormatted} | Julieta Arena`
    }
    return () => {
      document.title = 'Julieta Arena - Martillera Pública | Servicios Inmobiliarios Córdoba'
    }
  }, [property])

  if (isLoading) {
    return (
      <main>
        <SkeletonLoader type="card" count={1} />
      </main>
    )
  }

  if (!property) {
    return (
      <main>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h1>Propiedad no encontrada</h1>
          <p>La propiedad solicitada no se encuentra disponible.</p>
        </div>
      </main>
    )
  }

  return (
    <main>
      <PropertyDetail property={property} />
    </main>
  )
}
