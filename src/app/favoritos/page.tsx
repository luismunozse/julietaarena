'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFavorites } from '@/hooks/useFavorites'
import { Property } from '@/data/properties'
import { useProperties } from '@/hooks/useProperties'
import PropertyCard from '@/components/PropertyCard'
import FavoriteButton from '@/components/FavoriteButton'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Heart, Search } from 'lucide-react'

export default function FavoritosPage() {
  const { favorites, clearFavorites } = useFavorites()
  const { properties } = useProperties()
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([])

  useEffect(() => {
    const favoriteProps = properties.filter(prop => favorites.includes(prop.id))
    setFavoriteProperties(favoriteProps)
  }, [favorites, properties])

  if (favoriteProperties.length === 0) {
    return (
      <main className="min-h-screen pt-20 bg-surface">
        {/* Hero */}
        <div className="bg-gradient-to-br from-brand-primary to-brand-accent text-white py-14 sm:py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Mis Favoritos</h1>
            <p className="text-lg text-white/80">
              Guarda las propiedades que mas te gustan
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="py-20">
          <div className="max-w-md mx-auto text-center px-6">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">No tenes propiedades favoritas</h2>
            <p className="text-muted mb-8">Explora nuestras propiedades y agrega las que mas te gusten a tus favoritos</p>
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              <Search className="w-5 h-5" />
              Ver Propiedades
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-20 bg-surface">
      <div className="max-w-6xl mx-auto px-6">
        <PageBreadcrumb items={[{ label: 'Mis Favoritos' }]} />
      </div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-brand-primary to-brand-accent text-white py-14 sm:py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Mis Favoritos</h1>
          <p className="text-lg text-white/80">
            {favoriteProperties.length} propiedad{favoriteProperties.length !== 1 ? 'es' : ''} guardada{favoriteProperties.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Propiedades Favoritas</h2>
            <button
              onClick={clearFavorites}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
            >
              Limpiar Todo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map(property => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <div className="absolute top-4 right-4">
                  <FavoriteButton
                    propertyId={property.id}
                    size="large"
                    showText={false}
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
