'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useFavorites } from '@/hooks/useFavorites'
import { Property } from '@/data/properties'
import { useProperties } from '@/hooks/useProperties'
import PropertyCard from '@/components/PropertyCard'
import FavoriteButton from '@/components/FavoriteButton'
import PageBreadcrumb from '@/components/PageBreadcrumb'

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
      <main className="min-h-screen pt-24 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#2c5f7d] to-[#1a4158] text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Mis Favoritos</h1>
            <p className="text-lg text-white/80">
              Guarda las propiedades que más te gustan
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="py-20">
          <div className="max-w-md mx-auto text-center px-6">
            <div className="text-6xl mb-6">❤️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No tienes propiedades favoritas</h2>
            <p className="text-gray-600 mb-8">Explora nuestras propiedades y agrega las que más te gusten a tus favoritos</p>
            <Link
              href="/propiedades"
              className="inline-block px-8 py-3 bg-gradient-to-r from-[#2c5f7d] to-[#1a4158] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Ver Propiedades
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <PageBreadcrumb items={[{ label: 'Mis Favoritos' }]} />
      </div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2c5f7d] to-[#1a4158] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Mis Favoritos</h1>
          <p className="text-lg text-white/80">
            {favoriteProperties.length} propiedad{favoriteProperties.length !== 1 ? 'es' : ''} guardada{favoriteProperties.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Favorites Grid */}
      <div className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Propiedades Favoritas</h2>
            <button
              onClick={clearFavorites}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
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
