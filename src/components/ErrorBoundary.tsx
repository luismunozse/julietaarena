'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react'
import { logger } from '@/lib/logger'
import { normalizeError } from '@/lib/errors'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const normalizedError = normalizeError(error)
    logger.error('ErrorBoundary caught an error', {
      componentStack: errorInfo.componentStack,
      errorMessage: error.message,
      errorStack: error.stack,
    }, normalizedError)

    this.setState({
      error,
      errorInfo,
    })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          className={cn(
            'flex items-center justify-center min-h-[400px] p-8 bg-gray-50'
          )}
        >
          <div
            className={cn(
              'max-w-[600px] text-center bg-white p-8 rounded-lg shadow-md'
            )}
          >
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h1
              className={cn(
                'text-red-500 text-2xl mb-4 font-semibold'
              )}
            >
              Oops! Algo salio mal
            </h1>
            <p
              className={cn(
                'text-gray-500 text-base mb-6 leading-relaxed'
              )}
            >
              Lo sentimos, ocurrio un error inesperado. Por favor, intenta recargar la pagina.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                className={cn(
                  'my-6 text-left bg-gray-50 p-4 rounded border border-gray-200',
                  '[&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-gray-600 [&_summary]:mb-2'
                )}
              >
                <summary>Detalles del error (solo en desarrollo)</summary>
                <pre
                  className={cn(
                    'font-mono text-sm text-red-500 whitespace-pre-wrap break-all',
                    'overflow-x-auto max-h-[300px] overflow-y-auto mt-2'
                  )}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div
              className={cn(
                'flex gap-4 justify-center mt-6',
                'flex-col md:flex-row'
              )}
            >
              <Button
                onClick={this.handleReset}
                className={cn('w-full md:w-auto')}
              >
                <RotateCcw className="h-4 w-4" />
                Intentar de nuevo
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
                className={cn('w-full md:w-auto')}
              >
                <RefreshCw className="h-4 w-4" />
                Recargar pagina
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
