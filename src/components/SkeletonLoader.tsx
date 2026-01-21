interface SkeletonLoaderProps {
  type?: 'card' | 'list'
  count?: number
}

export default function SkeletonLoader({ type = 'card', count = 6 }: SkeletonLoaderProps) {
  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  }

  if (type === 'list') {
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '16px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb'
              }}
            >
              <div
                style={{
                  width: '200px',
                  height: '150px',
                  borderRadius: '8px',
                  flexShrink: 0,
                  ...shimmerStyle
                }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ height: '24px', width: '70%', borderRadius: '4px', ...shimmerStyle }} />
                <div style={{ height: '16px', width: '100%', borderRadius: '4px', ...shimmerStyle }} />
                <div style={{ height: '16px', width: '60%', borderRadius: '4px', ...shimmerStyle }} />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <div style={{ height: '28px', width: '60px', borderRadius: '4px', ...shimmerStyle }} />
                  <div style={{ height: '28px', width: '60px', borderRadius: '4px', ...shimmerStyle }} />
                  <div style={{ height: '28px', width: '60px', borderRadius: '4px', ...shimmerStyle }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            style={{
              background: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            <div style={{ height: '200px', ...shimmerStyle }} />
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '20px', width: '80%', borderRadius: '4px', ...shimmerStyle }} />
              <div style={{ height: '16px', width: '100%', borderRadius: '4px', ...shimmerStyle }} />
              <div style={{ height: '16px', width: '70%', borderRadius: '4px', ...shimmerStyle }} />
              <div style={{ height: '28px', width: '40%', borderRadius: '4px', marginTop: '8px', ...shimmerStyle }} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
