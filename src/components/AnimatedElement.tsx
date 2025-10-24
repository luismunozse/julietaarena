'use client'

import { ReactNode, forwardRef } from 'react'
import { useAnimation, UseAnimationOptions } from '@/hooks/useAnimation'
import styles from './AnimatedElement.module.css'

interface AnimatedElementProps extends UseAnimationOptions {
  children: ReactNode
  className?: string
  as?: keyof JSX.IntrinsicElements
  style?: React.CSSProperties
  'data-testid'?: string
}

const AnimatedElement = forwardRef<HTMLElement, AnimatedElementProps>(
  ({ children, className = '', as: Component = 'div', style, ...animationOptions }, ref) => {
    const { elementRef, isVisible, isAnimating } = useAnimation(animationOptions)
    
    const combinedRef = (node: HTMLElement) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
      if (elementRef.current !== node) {
        (elementRef as React.MutableRefObject<HTMLElement | null>).current = node
      }
    }

    return (
      <Component
        ref={combinedRef}
        className={`${styles.animatedElement} ${className}`}
        style={style}
        data-animating={isAnimating}
        data-visible={isVisible}
      >
        {children}
      </Component>
    )
  }
)

AnimatedElement.displayName = 'AnimatedElement'

export default AnimatedElement
