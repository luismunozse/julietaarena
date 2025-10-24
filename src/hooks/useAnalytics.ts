'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { analytics } from '@/lib/analytics'

export function useAnalytics() {
  const router = useRouter()

  // Track page views on route changes
  useEffect(() => {
    const handleRouteChange = () => {
      analytics.trackPageView()
    }

    // Track initial page view
    handleRouteChange()

    // Listen for route changes (Next.js 13+ App Router)
    const handlePopState = () => {
      setTimeout(handleRouteChange, 100)
    }

    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  return {
    trackEvent: analytics.trackEvent.bind(analytics),
    trackClick: analytics.trackClick.bind(analytics),
    trackFormSubmit: analytics.trackFormSubmit.bind(analytics),
    trackPropertyView: analytics.trackPropertyView.bind(analytics),
    trackPropertyFavorite: analytics.trackPropertyFavorite.bind(analytics),
    trackPropertyCompare: analytics.trackPropertyCompare.bind(analytics),
    trackAppointmentBooking: analytics.trackAppointmentBooking.bind(analytics),
    trackChatMessage: analytics.trackChatMessage.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackContact: analytics.trackContact.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics),
    getPageViews: analytics.getPageViews.bind(analytics),
    exportData: analytics.exportData.bind(analytics),
    clearData: analytics.clearData.bind(analytics)
  }
}

// Hook for tracking specific page views
export function usePageTracking(pageName: string, pageTitle?: string) {
  useEffect(() => {
    analytics.trackPageView(pageName, pageTitle)
  }, [pageName, pageTitle])
}

// Hook for tracking component interactions
export function useInteractionTracking(componentName: string) {
  const trackClick = (element: string, properties?: Record<string, any>) => {
    analytics.trackClick(element, componentName, properties)
  }

  const trackView = (element: string, properties?: Record<string, any>) => {
    analytics.trackEvent({
      event: 'view',
      category: 'component',
      action: 'view',
      label: element,
      properties: {
        component: componentName,
        ...properties
      }
    })
  }

  return { trackClick, trackView }
}
