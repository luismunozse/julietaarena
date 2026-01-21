'use client'

interface PropertyFeaturesProps {
  features: string[]
}

const inlineStyles = {
  features: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  } as React.CSSProperties,
  title: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1a4158',
    marginBottom: '1rem',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.75rem',
  } as React.CSSProperties,
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,
  checkIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: '#2c5f7d',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
  } as React.CSSProperties,
  featureText: {
    color: '#1a4158',
    fontSize: '0.95rem',
  } as React.CSSProperties,
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <div style={inlineStyles.features}>
      <h2 style={inlineStyles.title}>Caracteristicas</h2>
      <div style={inlineStyles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} style={inlineStyles.feature}>
            <span style={inlineStyles.checkIcon}>✓</span>
            <span style={inlineStyles.featureText}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
