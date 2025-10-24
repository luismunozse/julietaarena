'use client'

import { useEffect, useRef, useState } from 'react'
import { animations, durations, easings, presets } from '@/lib/animations'

interface UseAnimationOptions {
  animation?: any
  duration?: string
  easing?: string
  delay?: string
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both'
  trigger?: 'onMount' | 'onScroll' | 'onHover' | 'onClick' | 'manual'
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useAnimation(options: UseAnimationOptions = {}) {
  const {
    animation = animations.fadeIn,
    duration = durations.normal,
    easing = easings.easeOut,
    delay = '0s',
    fillMode = 'both',
    trigger = 'onMount',
    threshold = 0.1,
    rootMargin = '0px',
    once = true
  } = options

  const elementRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  const startAnimation = () => {
    if (elementRef.current && (!once || !hasAnimated)) {
      setIsAnimating(true)
      setHasAnimated(true)
      
      // Apply animation styles
      elementRef.current.style.animationName = animation
      elementRef.current.style.animationDuration = duration
      elementRef.current.style.animationTimingFunction = easing
      elementRef.current.style.animationDelay = delay
      elementRef.current.style.animationFillMode = fillMode
      
      // Reset animation state after completion
      const animationDuration = parseFloat(duration) * 1000
      setTimeout(() => {
        setIsAnimating(false)
      }, animationDuration)
    }
  }

  const stopAnimation = () => {
    if (elementRef.current) {
      elementRef.current.style.animationName = 'none'
      setIsAnimating(false)
    }
  }

  const resetAnimation = () => {
    if (elementRef.current) {
      elementRef.current.style.animationName = 'none'
      setIsAnimating(false)
      setHasAnimated(false)
    }
  }

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (trigger === 'onMount') {
      startAnimation()
    } else if (trigger === 'onScroll') {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true)
              startAnimation()
              if (once) {
                observer.unobserve(entry.target)
              }
            } else if (!once) {
              setIsVisible(false)
            }
          })
        },
        {
          threshold,
          rootMargin
        }
      )

      observer.observe(element)

      return () => {
        observer.unobserve(element)
      }
    } else if (trigger === 'onHover') {
      const handleMouseEnter = () => startAnimation()
      const handleMouseLeave = () => {
        if (!once) {
          stopAnimation()
        }
      }

      element.addEventListener('mouseenter', handleMouseEnter)
      element.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter)
        element.removeEventListener('mouseleave', handleMouseLeave)
      }
    } else if (trigger === 'onClick') {
      const handleClick = () => startAnimation()

      element.addEventListener('click', handleClick)

      return () => {
        element.removeEventListener('click', handleClick)
      }
    }
  }, [trigger, threshold, rootMargin, once])

  return {
    elementRef,
    isVisible,
    isAnimating,
    hasAnimated,
    startAnimation,
    stopAnimation,
    resetAnimation
  }
}

// Preset hooks for common animations
export function useFadeIn(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.fadeIn
  })
}

export function useFadeInUp(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.fadeInUp
  })
}

export function useFadeInDown(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.fadeInDown
  })
}

export function useFadeInLeft(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.fadeInLeft
  })
}

export function useFadeInRight(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.fadeInRight
  })
}

export function useScaleIn(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.scaleIn
  })
}

export function useBounceIn(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.bounceIn
  })
}

export function useSlideInUp(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.slideInUp
  })
}

export function useSlideInDown(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.slideInDown
  })
}

export function useSlideInLeft(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.slideInLeft
  })
}

export function useSlideInRight(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.slideInRight
  })
}

export function usePulse(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.pulse,
    duration: durations.slow,
    easing: easings.easeInOut
  })
}

export function useShake(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.shake,
    duration: durations.normal,
    easing: easings.easeInOut
  })
}

export function useSpin(options: Omit<UseAnimationOptions, 'animation'> = {}) {
  return useAnimation({
    ...options,
    animation: animations.spin,
    duration: durations.slowest,
    easing: easings.linear
  })
}

// Hook for staggered animations
export function useStaggeredAnimation(
  items: any[],
  baseAnimation: any = animations.fadeInUp,
  staggerDelay: string = '0.1s'
) {
  const [animatedItems, setAnimatedItems] = useState<boolean[]>(
    new Array(items.length).fill(false)
  )

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []
    
    items.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setAnimatedItems(prev => {
          const newState = [...prev]
          newState[index] = true
          return newState
        })
      }, index * parseFloat(staggerDelay) * 1000)
      
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [items.length, staggerDelay])

  return animatedItems
}
