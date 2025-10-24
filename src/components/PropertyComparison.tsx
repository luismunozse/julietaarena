'use client'

import { useState } from 'react'
import { Property } from '@/data/properties'
import { usePropertyComparator } from '@/hooks/usePropertyComparator'
import styles from './PropertyComparison.module.css'

interface PropertyComparisonProps {
  onClose: () => void
}

export default function PropertyComparison({ onClose }: PropertyComparisonProps) {
  const { comparisonProperties, removeFromComparison, clearComparison } = usePropertyComparator()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
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
      'oficina': 'Oficina'
    }
    return types[type] || type
  }

  const getComparisonData = () => {
    const data = [
      { label: 'Precio', key: 'price', format: (value: number) => formatPrice(value) },
      { label: 'Tipo', key: 'type', format: (value: string) => getTypeLabel(value) },
      { label: 'Ubicación', key: 'location', format: (value: string) => value },
      { label: 'Área', key: 'area', format: (value: number) => `${value} m²` },
      { label: 'Dormitorios', key: 'bedrooms', format: (value: number) => value || 'N/A' },
      { label: 'Baños', key: 'bathrooms', format: (value: number) => value || 'N/A' },
      { label: 'Cocheras', key: 'parking', format: (value: number) => value || 'N/A' },
      { label: 'Año', key: 'yearBuilt', format: (value: number) => value || 'N/A' },
      { label: 'Expensas', key: 'expenses', format: (value: number) => value ? formatPrice(value) : 'N/A' },
      { label: 'Estado', key: 'status', format: (value: string) => value === 'disponible' ? 'Disponible' : value },
    ]

    return data
  }

  if (comparisonProperties.length === 0) {
    return null
  }

  return (
    <div className={styles.comparisonOverlay}>
      <div className={styles.comparisonModal}>
        <div className={styles.comparisonHeader}>
          <h2>Comparación de Propiedades</h2>
          <div className={styles.headerActions}>
            <button 
              onClick={clearComparison}
              className={styles.clearAllBtn}
            >
              Limpiar Todo
            </button>
            <button 
              onClick={onClose}
              className={styles.closeBtn}
            >
              ✕
            </button>
          </div>
        </div>

        <div className={styles.comparisonContent}>
          <div className={styles.propertiesHeader}>
            <div className={styles.propertyColumn}>
              <span className={styles.columnLabel}>Características</span>
            </div>
            {comparisonProperties.map((property, index) => (
              <div key={property.id} className={styles.propertyColumn}>
                <div className={styles.propertyCard}>
                  <div className={styles.propertyImage}>
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                    />
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeFromComparison(property.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <h3 className={styles.propertyTitle}>{property.title}</h3>
                  <p className={styles.propertyType}>{getTypeLabel(property.type)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.comparisonTable}>
            {getComparisonData().map((row, index) => (
              <div key={index} className={styles.comparisonRow}>
                <div className={styles.rowLabel}>
                  {row.label}
                </div>
                {comparisonProperties.map((property) => (
                  <div key={property.id} className={styles.rowValue}>
                    {String(property[row.key as keyof Property] || '')}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.featuresComparison}>
            <h3>Características Especiales</h3>
            <div className={styles.featuresGrid}>
              {comparisonProperties.map((property) => (
                <div key={property.id} className={styles.propertyFeatures}>
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

        <div className={styles.comparisonActions}>
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
