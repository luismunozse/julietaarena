'use client'

import { Property } from '@/data/properties'
import styles from './PropertyMetrics.module.css'

interface PropertyMetricsProps {
  property: Property
}

export default function PropertyMetrics({ property }: PropertyMetricsProps) {
  const currentYear = new Date().getFullYear()
  const age = property.yearBuilt ? currentYear - property.yearBuilt : null

  return (
    <div className={styles.metrics}>
      {property.area && (
        <div className={styles.metric}>
          <span className={styles.metricIcon}>📐</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{property.area} m²</span>
            <span className={styles.metricLabel}>Superficie total</span>
          </div>
        </div>
      )}

      {property.coveredArea && (
        <div className={styles.metric}>
          <span className={styles.metricIcon}>🏠</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{property.coveredArea} m²</span>
            <span className={styles.metricLabel}>Superficie cubierta</span>
          </div>
        </div>
      )}

      {property.bedrooms && (
        <div className={styles.metric}>
          <span className={styles.metricIcon}>🛏️</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{property.bedrooms}</span>
            <span className={styles.metricLabel}>Dormitorios</span>
          </div>
        </div>
      )}

      {property.bathrooms && (
        <div className={styles.metric}>
          <span className={styles.metricIcon}>🚿</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{property.bathrooms}</span>
            <span className={styles.metricLabel}>Baños</span>
          </div>
        </div>
      )}

      {property.parking !== undefined && (
        <div className={styles.metric}>
          <span className={styles.metricIcon}>🚗</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{property.parking}</span>
            <span className={styles.metricLabel}>Cocheras</span>
          </div>
        </div>
      )}

      {age && (
        <div className={styles.metric}>
          <span className={styles.metricIcon}>⏳</span>
          <div className={styles.metricContent}>
            <span className={styles.metricValue}>{age} años</span>
            <span className={styles.metricLabel}>Antigüedad</span>
          </div>
        </div>
      )}
    </div>
  )
}





