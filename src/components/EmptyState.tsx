import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ 
  icon = '🔍', 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateIcon}>{icon}</div>
      <h3 className={styles.emptyStateTitle}>{title}</h3>
      <p className={styles.emptyStateDescription}>{description}</p>
      {actionLabel && onAction && (
        <button 
          className={styles.emptyStateButton}
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

