'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { accessibility } from '@/lib/accessibility'

interface UseAccessibilityOptions {
  announceChanges?: boolean
  trapFocus?: boolean
  restoreFocus?: boolean
  skipLinks?: Array<{ href: string; text: string }>
  liveRegion?: 'polite' | 'assertive' | 'off'
}

export function useAccessibility(options: UseAccessibilityOptions = {}) {
  const {
    announceChanges = true,
    trapFocus = false,
    restoreFocus = false,
    skipLinks = [],
    liveRegion = 'polite'
  } = options

  const containerRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [announcements, setAnnouncements] = useState<string[]>([])

  // Focus management
  const focusElement = useCallback((element: HTMLElement) => {
    element.focus()
    setIsFocused(true)
  }, [])

  const blurElement = useCallback((element: HTMLElement) => {
    element.blur()
    setIsFocused(false)
  }, [])

  const trapFocusInContainer = useCallback(() => {
    if (containerRef.current && trapFocus) {
      return accessibility.focus.trap(containerRef.current)
    }
    return () => {}
  }, [trapFocus])

  const restorePreviousFocus = useCallback(() => {
    if (previousFocusRef.current && restoreFocus) {
      accessibility.focus.restore(previousFocusRef.current)
    }
  }, [restoreFocus])

  // Announcements
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceChanges) {
      accessibility.screenReader.announce(message, priority)
      setAnnouncements(prev => [...prev, message])
    }
  }, [announceChanges])

  const announceError = useCallback((message: string) => {
    announce(message, 'assertive')
  }, [announce])

  const announceSuccess = useCallback((message: string) => {
    announce(message, 'polite')
  }, [announce])

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key, ctrlKey, altKey, shiftKey, metaKey } = event
    const target = event.target as HTMLElement

    // Skip links
    if (key === 'Tab' && !shiftKey && target === document.body) {
      const firstSkipLink = document.querySelector('.skip-link') as HTMLElement
      if (firstSkipLink) {
        firstSkipLink.focus()
        event.preventDefault()
      }
    }

    // Escape key
    if (key === 'Escape') {
      const modal = document.querySelector('[role="dialog"]') as HTMLElement
      if (modal) {
        const closeButton = modal.querySelector('[aria-label*="cerrar"], [aria-label*="close"]') as HTMLElement
        if (closeButton) {
          closeButton.focus()
          closeButton.click()
        }
      }
    }

    // Arrow keys for custom components
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
      const role = target.getAttribute('role')
      if (['menuitem', 'tab', 'option', 'button'].includes(role || '')) {
        event.preventDefault()
        // Custom arrow key handling can be implemented here
      }
    }

    // Enter and Space for custom buttons
    if ((key === 'Enter' || key === ' ') && target.getAttribute('role') === 'button') {
      event.preventDefault()
      target.click()
    }
  }, [])

  // Focus tracking
  const handleFocusIn = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (containerRef.current?.contains(target)) {
      setIsFocused(true)
    }
  }, [])

  const handleFocusOut = useCallback((event: FocusEvent) => {
    const target = event.target as HTMLElement
    if (containerRef.current?.contains(target)) {
      setIsFocused(false)
    }
  }, [])

  // Setup effects
  useEffect(() => {
    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)

    // Setup skip links
    if (skipLinks.length > 0) {
      const skipLinksElement = accessibility.skipLinks.create(skipLinks)
      document.body.insertBefore(skipLinksElement, document.body.firstChild)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      
      // Remove skip links
      const skipLinksElement = document.querySelector('.skip-links')
      if (skipLinksElement) {
        skipLinksElement.remove()
      }
    }
  }, [handleKeyDown, handleFocusIn, handleFocusOut, skipLinks])

  // Focus trap effect
  useEffect(() => {
    if (trapFocus && containerRef.current) {
      const cleanup = trapFocusInContainer()
      return cleanup
    }
  }, [trapFocus, trapFocusInContainer])

  // Restore focus on unmount
  useEffect(() => {
    return () => {
      if (restoreFocus) {
        restorePreviousFocus()
      }
    }
  }, [restoreFocus, restorePreviousFocus])

  return {
    containerRef,
    isFocused,
    announcements,
    focusElement,
    blurElement,
    announce,
    announceError,
    announceSuccess,
    trapFocusInContainer,
    restorePreviousFocus
  }
}

// Hook for form accessibility
export function useFormAccessibility() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateField = useCallback((field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    const fieldName = field.name || field.id
    const errorMessage = accessibility.validation.getErrorMessage(field)
    
    setErrors(prev => ({
      ...prev,
      [fieldName]: field.validity.valid ? '' : errorMessage
    }))
    
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))

    if (!field.validity.valid) {
      accessibility.validation.announceError(field)
    }

    return field.validity.valid
  }, [])

  const validateForm = useCallback((form: HTMLFormElement) => {
    const fields = form.querySelectorAll('input, select, textarea') as NodeListOf<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    let isValid = true

    fields.forEach(field => {
      if (!validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }, [validateField])

  const clearErrors = useCallback(() => {
    setErrors({})
    setTouched({})
  }, [])

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName] || ''
  }, [errors])

  const isFieldTouched = useCallback((fieldName: string) => {
    return touched[fieldName] || false
  }, [touched])

  const hasErrors = Object.values(errors).some(error => error !== '')

  return {
    errors,
    touched,
    hasErrors,
    validateField,
    validateForm,
    clearErrors,
    getFieldError,
    isFieldTouched
  }
}

// Hook for modal accessibility
export function useModalAccessibility(isOpen: boolean) {
  const [announcements, setAnnouncements] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      // Announce modal opening
      accessibility.screenReader.announce('Modal abierto', 'polite')
      
      // Trap focus
      const modal = document.querySelector('[role="dialog"]') as HTMLElement
      if (modal) {
        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        firstElement?.focus()
      }
    } else {
      // Announce modal closing
      accessibility.screenReader.announce('Modal cerrado', 'polite')
    }
  }, [isOpen])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    accessibility.screenReader.announce(message, priority)
    setAnnouncements(prev => [...prev, message])
  }, [])

  return {
    announcements,
    announce
  }
}

// Hook for keyboard navigation
export function useKeyboardNavigation(items: HTMLElement[], orientation: 'horizontal' | 'vertical' = 'horizontal') {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event
    const isHorizontal = orientation === 'horizontal'

    if (isHorizontal) {
      if (key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex(prev => prev > 0 ? prev - 1 : items.length - 1)
      } else if (key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex(prev => prev < items.length - 1 ? prev + 1 : 0)
      }
    } else {
      if (key === 'ArrowUp') {
        event.preventDefault()
        setActiveIndex(prev => prev > 0 ? prev - 1 : items.length - 1)
      } else if (key === 'ArrowDown') {
        event.preventDefault()
        setActiveIndex(prev => prev < items.length - 1 ? prev + 1 : 0)
      }
    }

    if (key === 'Home') {
      event.preventDefault()
      setActiveIndex(0)
    } else if (key === 'End') {
      event.preventDefault()
      setActiveIndex(items.length - 1)
    }
  }, [items.length, orientation])

  useEffect(() => {
    if (items.length > 0) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  useEffect(() => {
    if (items[activeIndex]) {
      items[activeIndex].focus()
    }
  }, [activeIndex, items])

  return {
    activeIndex,
    setActiveIndex
  }
}
