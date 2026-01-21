'use client'

import { Property } from '@/data/properties'

interface PropertyMetricsProps {
  property: Property
}

const inlineStyles = {
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  } as React.CSSProperties,
  metric: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  metricIcon: {
    fontSize: '1.5rem',
    flexShrink: 0,
  } as React.CSSProperties,
  metricContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.125rem',
  } as React.CSSProperties,
  metricValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#1a4158',
  } as React.CSSProperties,
  metricLabel: {
    fontSize: '0.8rem',
    color: '#636e72',
  } as React.CSSProperties,
}

export default function PropertyMetrics({ property }: PropertyMetricsProps) {
  const currentYear = new Date().getFullYear()
  const age = property.yearBuilt ? currentYear - property.yearBuilt : null

  return (
    <div style={inlineStyles.metrics}>
      {property.area && (
        <div style={inlineStyles.metric}>
          <span style={inlineStyles.metricIcon}>📐</span>
          <div style={inlineStyles.metricContent}>
            <span style={inlineStyles.metricValue}>{property.area} m2</span>
            <span style={inlineStyles.metricLabel}>Superficie total</span>
          </div>
        </div>
      )}

      {property.coveredArea && (
        <div style={inlineStyles.metric}>
          <span style={inlineStyles.metricIcon}>🏠</span>
          <div style={inlineStyles.metricContent}>
            <span style={inlineStyles.metricValue}>{property.coveredArea} m2</span>
            <span style={inlineStyles.metricLabel}>Superficie cubierta</span>
          </div>
        </div>
      )}

      {property.bedrooms && (
        <div style={inlineStyles.metric}>
          <span style={inlineStyles.metricIcon}>🛏️</span>
          <div style={inlineStyles.metricContent}>
            <span style={inlineStyles.metricValue}>{property.bedrooms}</span>
            <span style={inlineStyles.metricLabel}>Dormitorios</span>
          </div>
        </div>
      )}

      {property.bathrooms && (
        <div style={inlineStyles.metric}>
          <span style={inlineStyles.metricIcon}>🚿</span>
          <div style={inlineStyles.metricContent}>
            <span style={inlineStyles.metricValue}>{property.bathrooms}</span>
            <span style={inlineStyles.metricLabel}>Banos</span>
          </div>
        </div>
      )}

      {property.parking !== undefined && (
        <div style={inlineStyles.metric}>
          <span style={inlineStyles.metricIcon}>🚗</span>
          <div style={inlineStyles.metricContent}>
            <span style={inlineStyles.metricValue}>{property.parking}</span>
            <span style={inlineStyles.metricLabel}>Cocheras</span>
          </div>
        </div>
      )}

      {age && (
        <div style={inlineStyles.metric}>
          <span style={inlineStyles.metricIcon}>⏳</span>
          <div style={inlineStyles.metricContent}>
            <span style={inlineStyles.metricValue}>{age} anos</span>
            <span style={inlineStyles.metricLabel}>Antiguedad</span>
          </div>
        </div>
      )}
    </div>
  )
}
