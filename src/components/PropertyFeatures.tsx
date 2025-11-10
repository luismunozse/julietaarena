'use client'

import styles from './PropertyFeatures.module.css'

interface PropertyFeaturesProps {
  features: string[]
}

export default function PropertyFeatures({ features }: PropertyFeaturesProps) {
  if (!features || features.length === 0) {
    return null
  }

  return (
    <div className={styles.features}>
      <h2 className={styles.title}>Características</h2>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <div key={index} className={styles.feature}>
            <span className={styles.checkIcon}>✓</span>
            <span className={styles.featureText}>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  )
}





