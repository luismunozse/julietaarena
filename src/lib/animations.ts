// Animation utilities and keyframes
export const animations = {
  // Fade animations
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 }
  },
  fadeInUp: {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  fadeInDown: {
    from: { opacity: 0, transform: 'translateY(-30px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
  fadeInLeft: {
    from: { opacity: 0, transform: 'translateX(-30px)' },
    to: { opacity: 1, transform: 'translateX(0)' }
  },
  fadeInRight: {
    from: { opacity: 0, transform: 'translateX(30px)' },
    to: { opacity: 1, transform: 'translateX(0)' }
  },

  // Scale animations
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' }
  },
  scaleOut: {
    from: { opacity: 1, transform: 'scale(1)' },
    to: { opacity: 0, transform: 'scale(0.8)' }
  },
  bounceIn: {
    from: { opacity: 0, transform: 'scale(0.3)' },
    '50%': { opacity: 1, transform: 'scale(1.05)' },
    '70%': { transform: 'scale(0.9)' },
    '100%': { opacity: 1, transform: 'scale(1)' }
  },

  // Slide animations
  slideInUp: {
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' }
  },
  slideInDown: {
    from: { transform: 'translateY(-100%)' },
    to: { transform: 'translateY(0)' }
  },
  slideInLeft: {
    from: { transform: 'translateX(-100%)' },
    to: { transform: 'translateX(0)' }
  },
  slideInRight: {
    from: { transform: 'translateX(100%)' },
    to: { transform: 'translateX(0)' }
  },

  // Rotation animations
  rotateIn: {
    from: { opacity: 0, transform: 'rotate(-200deg)' },
    to: { opacity: 1, transform: 'rotate(0deg)' }
  },
  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },

  // Pulse animations
  pulse: {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' }
  },
  heartbeat: {
    '0%, 100%': { transform: 'scale(1)' },
    '25%': { transform: 'scale(1.1)' },
    '50%': { transform: 'scale(1)' },
    '75%': { transform: 'scale(1.05)' }
  },

  // Shake animations
  shake: {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' }
  },

  // Wobble animations
  wobble: {
    '0%': { transform: 'translateX(0%)' },
    '15%': { transform: 'translateX(-25%) rotate(-5deg)' },
    '30%': { transform: 'translateX(20%) rotate(3deg)' },
    '45%': { transform: 'translateX(-15%) rotate(-3deg)' },
    '60%': { transform: 'translateX(10%) rotate(2deg)' },
    '75%': { transform: 'translateX(-5%) rotate(-1deg)' },
    '100%': { transform: 'translateX(0%)' }
  },

  // Zoom animations
  zoomIn: {
    from: { opacity: 0, transform: 'scale(0.3)' },
    to: { opacity: 1, transform: 'scale(1)' }
  },
  zoomOut: {
    from: { opacity: 1, transform: 'scale(1)' },
    to: { opacity: 0, transform: 'scale(0.3)' }
  },

  // Flip animations
  flipInX: {
    from: { transform: 'perspective(400px) rotateX(90deg)', opacity: 0 },
    '40%': { transform: 'perspective(400px) rotateX(-20deg)' },
    '60%': { transform: 'perspective(400px) rotateX(10deg)', opacity: 1 },
    '80%': { transform: 'perspective(400px) rotateX(-5deg)' },
    to: { transform: 'perspective(400px) rotateX(0deg)', opacity: 1 }
  },
  flipInY: {
    from: { transform: 'perspective(400px) rotateY(90deg)', opacity: 0 },
    '40%': { transform: 'perspective(400px) rotateY(-20deg)' },
    '60%': { transform: 'perspective(400px) rotateY(10deg)', opacity: 1 },
    '80%': { transform: 'perspective(400px) rotateY(-5deg)' },
    to: { transform: 'perspective(400px) rotateY(0deg)', opacity: 1 }
  }
}

export const durations = {
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.5s',
  slower: '0.8s',
  slowest: '1s'
}

export const easings = {
  linear: 'linear',
  ease: 'ease',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  cubicBezier: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
}

export const delays = {
  none: '0s',
  short: '0.1s',
  medium: '0.2s',
  long: '0.3s',
  longer: '0.5s'
}

// Animation presets for common use cases
export const presets = {
  // Page transitions
  pageEnter: {
    animation: animations.fadeInUp,
    duration: durations.normal,
    easing: easings.easeOut
  },
  pageExit: {
    animation: animations.fadeOut,
    duration: durations.fast,
    easing: easings.easeIn
  },

  // Card animations
  cardHover: {
    animation: animations.scaleIn,
    duration: durations.fast,
    easing: easings.easeOut
  },
  cardEnter: {
    animation: animations.fadeInUp,
    duration: durations.normal,
    easing: easings.easeOut
  },

  // Button animations
  buttonPress: {
    animation: animations.scaleOut,
    duration: durations.fast,
    easing: easings.easeIn
  },
  buttonHover: {
    animation: animations.pulse,
    duration: durations.slow,
    easing: easings.easeInOut
  },

  // Modal animations
  modalEnter: {
    animation: animations.scaleIn,
    duration: durations.normal,
    easing: easings.bounce
  },
  modalExit: {
    animation: animations.scaleOut,
    duration: durations.fast,
    easing: easings.easeIn
  },

  // Loading animations
  loading: {
    animation: animations.spin,
    duration: durations.slowest,
    easing: easings.linear
  },
  loadingPulse: {
    animation: animations.pulse,
    duration: durations.slow,
    easing: easings.easeInOut
  },

  // Notification animations
  notificationEnter: {
    animation: animations.slideInRight,
    duration: durations.normal,
    easing: easings.easeOut
  },
  notificationExit: {
    animation: animations.slideInRight,
    duration: durations.fast,
    easing: easings.easeIn
  },

  // Form animations
  formError: {
    animation: animations.shake,
    duration: durations.normal,
    easing: easings.easeInOut
  },
  formSuccess: {
    animation: animations.bounceIn,
    duration: durations.normal,
    easing: easings.bounce
  }
}

// Utility functions
export const createAnimation = (
  keyframes: any,
  duration: string = durations.normal,
  easing: string = easings.easeOut,
  delay: string = delays.none,
  fillMode: string = 'both'
) => ({
  animationName: keyframes,
  animationDuration: duration,
  animationTimingFunction: easing,
  animationDelay: delay,
  animationFillMode: fillMode
})

export const createStaggeredAnimation = (
  baseAnimation: any,
  staggerDelay: string = delays.short,
  maxItems: number = 10
) => {
  const staggered: any = {}
  for (let i = 0; i < maxItems; i++) {
    staggered[`:nth-child(${i + 1})`] = {
      ...baseAnimation,
      animationDelay: `${parseFloat(staggerDelay) * i}s`
    }
  }
  return staggered
}
