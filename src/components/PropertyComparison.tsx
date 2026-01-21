'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Property } from '@/data/properties'
import { usePropertyComparator } from '@/hooks/usePropertyComparator'


interface PropertyComparisonProps {
  onClose: () => void
}

export default function PropertyComparison({ onClose }: PropertyComparisonProps) {
  const { comparisonProperties, removeFromComparison, clearComparison } = usePropertyComparator()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const formatPrice = (price: number, currency: 'ARS' | 'USD' = 'USD'): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getTypeLabel = (type: string): string => {
    const types: { [key: string]: string } = {
      'casa': 'Casa',
      'departamento': 'Departamento',
      'terreno': 'Terreno',
      'local': 'Local Comercial',
      'oficina': 'Oficina',
      'cochera': 'Cochera'
    }
    return types[type] || type
  }

  const getComparisonData = () => {
    const data = [
      { label: 'Precio', key: 'price', format: (property: Property) => formatPrice(property.price, property.currency) },
      { label: 'Tipo', key: 'type', format: (property: Property) => getTypeLabel(property.type) },
      { label: 'Ubicación', key: 'location', format: (property: Property) => property.location },
      { label: 'Área', key: 'area', format: (property: Property) => {
        // Formatear con decimales solo si es necesario
        const value = property.area
        const formatted = value % 1 === 0 ? value.toString() : value.toFixed(2).replace(/\.?0+$/, '')
        return `${formatted} m²`
      }},
      { label: 'Dormitorios', key: 'bedrooms', format: (property: Property) => property.bedrooms || 'N/A' },
      { label: 'Baños', key: 'bathrooms', format: (property: Property) => property.bathrooms || 'N/A' },
      { label: 'Cocheras', key: 'parking', format: (property: Property) => property.parking || 'N/A' },
      { label: 'Año', key: 'yearBuilt', format: (property: Property) => property.yearBuilt || 'N/A' },
      { label: 'Expensas', key: 'expenses', format: (property: Property) => property.expenses ? formatPrice(property.expenses, property.currency) : 'N/A' },
      { label: 'Estado', key: 'status', format: (property: Property) => property.status === 'disponible' ? 'Disponible' : property.status },
    ]

    return data
  }

  if (comparisonProperties.length === 0) {
    return null
  }

  return (
    <div className="comparisonOverlay">
      <div className="comparisonModal">
        <div className="comparisonHeader">
          <h2>Comparación de Propiedades</h2>
          <div className="headerActions">
            <button 
              onClick={clearComparison}
              className="clearAllBtn"
            >
              Limpiar Todo
            </button>
            <button 
              onClick={onClose}
              className="closeBtn"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="comparisonContent">
          <div className="propertiesHeader">
            <div className="propertyColumn">
              <span className="columnLabel">Características</span>
            </div>
            {comparisonProperties.map((property, index) => (
              <div key={property.id} className="propertyColumn">
                <div className="propertyCard">
                  <div className="propertyImage">
                    <Image 
                      src={property.images[0]} 
                      alt={property.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 250px"
                      className="propertyImageContent"
                    />
                    <button 
                      className="removeBtn"
                      onClick={() => removeFromComparison(property.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className="propertyTitle">{property.title}</h3>
                  <p className="propertyType">{getTypeLabel(property.type)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="comparisonTable">
            {getComparisonData().map((row, index) => (
              <div key={index} className="comparisonRow">
                <div className="rowLabel">
                  {row.label}
                </div>
                {comparisonProperties.map((property) => (
                  <div key={property.id} className="rowValue">
                    {String(row.format(property))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="featuresComparison">
            <h3>Características Especiales</h3>
            <div className="featuresGrid">
              {comparisonProperties.map((property) => (
                <div key={property.id} className="propertyFeatures">
                  <h4>{property.title}</h4>
                  <ul>
                    {property.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="comparisonActions">
          <button 
            onClick={onClose}
            className="btn btn-secondary"
          >
            Cerrar
          </button>
          <a 
            href="#contacto"
            className="btn btn-primary"
          >
            Contactar sobre estas propiedades
          </a>
        </div>
      </div>
    </div>
  )
}
