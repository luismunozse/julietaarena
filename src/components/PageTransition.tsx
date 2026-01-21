'use client'

import { ReactNode, useEffect, useState, CSSProperties } from 'react'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
}

const baseStyle: CSSProperties = {
  opacity: 1,
  transform: 'translateY(0)',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
}

const animatingStyle: CSSProperties = {
  opacity: 0,
  transform: 'translateY(10px)',
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)

    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return (
    <div style={isAnimating ? { ...baseStyle, ...animatingStyle } : baseStyle}>
      {children}
    </div>
  )
}
