'use client'

import { Suspense, ReactNode, CSSProperties } from 'react'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  height?: string
}

const skeletonStyle: CSSProperties = {
  width: '100%',
  height: '200px',
  backgroundColor: '#e5e7eb',
  borderRadius: '16px',
  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}

function DefaultSkeleton() {
  return (
    <>
      <div style={skeletonStyle} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  )
}

export default function LazyWrapper({
  children,
  fallback = <DefaultSkeleton />,
  height = '200px'
}: LazyWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <div style={{ minHeight: height }}>
        {children}
      </div>
    </Suspense>
  )
}
