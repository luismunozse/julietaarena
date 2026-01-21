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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: '#f8f9fa',
        borderRadius: '16px',
        border: '2px dashed #e5e7eb'
      }}
    >
      <div
        style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1a4158',
          marginBottom: '8px'
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: '#636e72',
          maxWidth: '400px',
          lineHeight: '1.6'
        }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            marginTop: '24px',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #2c5f7d 0%, #1a4158 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(44, 95, 125, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
