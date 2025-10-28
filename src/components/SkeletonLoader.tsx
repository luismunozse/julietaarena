import styles from './SkeletonLoader.module.css'

interface SkeletonLoaderProps {
  type?: 'card' | 'list'
  count?: number
}

export default function SkeletonLoader({ type = 'card', count = 6 }: SkeletonLoaderProps) {
  if (type === 'list') {
    return (
      <div className={styles.skeletonList}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className={styles.skeletonListItem}>
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonTitle} />
              <div className={styles.skeletonText} />
              <div className={styles.skeletonText} style={{ width: '60%' }} />
              <div className={styles.skeletonFeatures}>
                <div className={styles.skeletonBadge} />
                <div className={styles.skeletonBadge} />
                <div className={styles.skeletonBadge} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonCardContent}>
            <div className={styles.skeletonTitle} />
            <div className={styles.skeletonText} />
            <div className={styles.skeletonText} style={{ width: '70%' }} />
            <div className={styles.skeletonPrice} />
          </div>
        </div>
      ))}
    </div>
  )
}

