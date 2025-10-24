'use client'

import { forwardRef, FormHTMLAttributes, ReactNode } from 'react'
import { useFormAccessibility } from '@/hooks/useAccessibility'
import styles from './AccessibleForm.module.css'

interface AccessibleFormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
  onSubmit: (data: FormData) => void | Promise<void>
  validateOnChange?: boolean
  validateOnBlur?: boolean
  showErrors?: boolean
  className?: string
}

const AccessibleForm = forwardRef<HTMLFormElement, AccessibleFormProps>(
  ({
    children,
    onSubmit,
    validateOnChange = true,
    validateOnBlur = true,
    showErrors = true,
    className = '',
    ...props
  }, ref) => {
    const {
      errors,
      hasErrors,
      validateField,
      validateForm,
      clearErrors,
      getFieldError,
      isFieldTouched
    } = useFormAccessibility()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      
      const form = event.currentTarget
      const formData = new FormData(form)
      
      const isValid = validateForm(form)
      
      if (isValid) {
        try {
          await onSubmit(formData)
          clearErrors()
        } catch (error) {
          console.error('Form submission error:', error)
        }
      }
    }

    const handleFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (validateOnChange) {
        validateField(event.target)
      }
    }

    const handleFieldBlur = (event: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (validateOnBlur) {
        validateField(event.target)
      }
    }

    const formClasses = [
      styles.form,
      hasErrors ? styles.hasErrors : '',
      className
    ].filter(Boolean).join(' ')

    return (
      <form
        ref={ref}
        className={formClasses}
        onSubmit={handleSubmit}
        noValidate
        aria-label="Formulario"
        {...props}
      >
        {children}
        
        {/* Add event listeners to all form fields */}
        <div
          className={styles.fieldContainer}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />
        
        {showErrors && hasErrors && (
          <div className={styles.errorSummary} role="alert" aria-live="polite">
            <h3>Por favor corrige los siguientes errores:</h3>
            <ul>
              {Object.entries(errors).map(([field, error]) => (
                error && (
                  <li key={field}>
                    <a href={`#${field}`} onClick={(e) => {
                      e.preventDefault()
                      const fieldElement = document.getElementById(field)
                      fieldElement?.focus()
                    }}>
                      {error}
                    </a>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
      </form>
    )
  }
)

AccessibleForm.displayName = 'AccessibleForm'

export default AccessibleForm
