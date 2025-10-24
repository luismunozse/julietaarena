'use client'

import { Suspense, ReactNode } from 'react'
import styles from './LazyWrapper.module.css'

interface LazyWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  height?: string
}

export default function LazyWrapper({ 
  children, 
  fallback = <div className={styles.skeleton} />,
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
