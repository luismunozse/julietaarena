'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import PropertyCard from './PropertyCard'
import styles from './FeaturedProperties.module.css'

export default function FeaturedProperties() {
  const router = useRouter()
  const { properties, isLoading } = useProperties()

  const featuredProperties = useMemo(() => {
    return properties
      .filter(p => p.featured && p.status === 'disponible')
      .slice(0, 6) // Mostrar máximo 6 propiedades destacadas
  }, [properties])

  if (isLoading) {
    return (
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Propiedades Destacadas</h2>
            <div className={styles.loadingSkeleton}>
              {[1, 2, 3].map(i => (
                <div key={i} className={styles.skeletonCard}></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (featuredProperties.length === 0) {
    return null // No mostrar la sección si no hay propiedades destacadas
  }

  return (
    <section className={styles.featuredSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Propiedades Destacadas</h2>
          <p className={styles.sectionSubtitle}>
            Las mejores oportunidades del mercado seleccionadas especialmente para vos
          </p>
        </div>

        <div className={styles.propertiesGrid}>
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className={styles.viewAllContainer}>
          <button
            className={styles.viewAllBtn}
            onClick={() => router.push('/propiedades/resultado?featured=true&operation=venta')}
          >
            Ver todas las propiedades destacadas
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
