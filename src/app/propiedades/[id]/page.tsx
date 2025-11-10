'use client'

import { useEffect, useState } from 'react'
import PropertyDetail from '@/components/PropertyDetail'
import SkeletonLoader from '@/components/SkeletonLoader'
import { useProperties } from '@/hooks/useProperties'
import { useRouter } from 'next/navigation'
import type { Property } from '@/data/properties'

interface PropertyDetailPageProps {
  params: { id: string }
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const router = useRouter()
  const { getPropertyById, isLoading } = useProperties()
  const [property, setProperty] = useState<Property | undefined>(undefined)

  useEffect(() => {
    if (!isLoading) {
      const foundProperty = getPropertyById(params.id)
      if (!foundProperty) {
        router.push('/propiedades')
      } else {
        setProperty(foundProperty)
      }
    }
  }, [params.id, isLoading, getPropertyById, router])

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





