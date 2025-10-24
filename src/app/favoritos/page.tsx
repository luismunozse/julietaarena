'use client'

import { useState, useEffect } from 'react'
import { useFavorites } from '@/hooks/useFavorites'
import { properties, Property } from '@/data/properties'
import PropertyCard from '@/components/PropertyCard'
import FavoriteButton from '@/components/FavoriteButton'
import styles from './page.module.css'

export default function FavoritosPage() {
  const { favorites, clearFavorites } = useFavorites()
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([])

  useEffect(() => {
    const favoriteProps = properties.filter(prop => favorites.includes(prop.id))
    setFavoriteProperties(favoriteProps)
  }, [favorites])

  if (favoriteProperties.length === 0) {
    return (
      <main className={styles.pageContainer}>
        <div className={styles.heroSection}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>Mis Favoritos</h1>
              <p className={styles.heroSubtitle}>
                Guarda las propiedades que más te gustan
              </p>
            </div>
          </div>
        </div>

        <div className={styles.emptyState}>
          <div className="container">
            <div className={styles.emptyContent}>
              <div className={styles.emptyIcon}>❤️</div>
              <h2>No tienes propiedades favoritas</h2>
              <p>Explora nuestras propiedades y agrega las que más te gusten a tus favoritos</p>
              <a href="/propiedades" className="btn btn-primary">
                Ver Propiedades
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.pageContainer}>
      <div className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Mis Favoritos</h1>
            <p className={styles.heroSubtitle}>
              {favoriteProperties.length} propiedad{favoriteProperties.length !== 1 ? 'es' : ''} guardada{favoriteProperties.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.favoritesSection}>
        <div className="container">
          <div className={styles.favoritesHeader}>
            <h2>Propiedades Favoritas</h2>
            <button 
              onClick={clearFavorites}
              className={styles.clearAllBtn}
            >
              Limpiar Todo
            </button>
          </div>

          <div className={styles.favoritesGrid}>
            {favoriteProperties.map(property => (
              <div key={property.id} className={styles.favoriteCard}>
                <PropertyCard property={property} />
                <div className={styles.favoriteActions}>
                  <FavoriteButton 
                    propertyId={property.id} 
                    size="large" 
                    showText={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
