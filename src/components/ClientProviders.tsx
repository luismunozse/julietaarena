'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/components/AuthProvider'
import { ToastProvider } from '@/components/ToastContainer'
import AnalyticsProvider from '@/components/AnalyticsProvider'
import ErrorBoundary from '@/components/ErrorBoundary'
import ConditionalLayout from '@/components/ConditionalLayout'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AnalyticsProvider>
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </AuthProvider>
        </AnalyticsProvider>
      </ToastProvider>
    </ErrorBoundary>
  )
}
