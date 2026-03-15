'use client'

import { useInView } from '@/hooks/useInView'

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'scale-in'
}

export default function AnimateOnScroll({
  children,
  className = '',
  animation = 'fade-in-up',
}: AnimateOnScrollProps) {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`${className} ${isInView ? `animate-${animation}` : 'opacity-0'}`}
    >
      {children}
    </div>
  )
}
