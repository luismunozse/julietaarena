'use client'

import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react'
import { useAccessibility } from '@/hooks/useAccessibility'
import styles from './AccessibleButton.module.css'

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  ariaLabel?: string
  ariaDescribedBy?: string
  announceOnClick?: boolean
  announceMessage?: string
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    ariaLabel,
    ariaDescribedBy,
    announceOnClick = false,
    announceMessage,
    className = '',
    disabled,
    onClick,
    ...props
  }, ref) => {
    const { announce } = useAccessibility()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (announceOnClick && announceMessage) {
        announce(announceMessage, 'polite')
      }
      onClick?.(event)
    }

    const buttonClasses = [
      styles.button,
      styles[variant],
      styles[size],
      fullWidth ? styles.fullWidth : '',
      loading ? styles.loading : '',
      className
    ].filter(Boolean).join(' ')

    const ariaProps = {
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-disabled': disabled || loading,
      'aria-busy': loading
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={handleClick}
        {...ariaProps}
        {...props}
      >
        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
          </span>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className={styles.iconLeft} aria-hidden="true">
            {icon}
          </span>
        )}
        
        <span className={styles.content}>
          {children}
        </span>
        
        {!loading && icon && iconPosition === 'right' && (
          <span className={styles.iconRight} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    )
  }
)

AccessibleButton.displayName = 'AccessibleButton'

export default AccessibleButton
