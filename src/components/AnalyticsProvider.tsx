'use client'

import { ReactNode, useEffect } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

interface AnalyticsProviderProps {
  children: ReactNode
}

export default function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const analytics = useAnalytics()

  useEffect(() => {
    // Track initial page load
    analytics.trackPageView()

    // Track performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        analytics.trackEvent({
          event: 'page_performance',
          category: 'performance',
          action: 'page_load',
          value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          properties: {
            domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
          }
        })
      })
    }

    // Track scroll depth
    let maxScrollDepth = 0
    const trackScrollDepth = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollDepth = Math.round((scrollTop / documentHeight) * 100)
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        
        // Track milestone scroll depths
        if (scrollDepth >= 25 && maxScrollDepth < 25) {
          analytics.trackEvent({
            event: 'scroll_depth',
            category: 'engagement',
            action: 'scroll',
            value: 25
          })
        } else if (scrollDepth >= 50 && maxScrollDepth < 50) {
          analytics.trackEvent({
            event: 'scroll_depth',
            category: 'engagement',
            action: 'scroll',
            value: 50
          })
        } else if (scrollDepth >= 75 && maxScrollDepth < 75) {
          analytics.trackEvent({
            event: 'scroll_depth',
            category: 'engagement',
            action: 'scroll',
            value: 75
          })
        } else if (scrollDepth >= 90 && maxScrollDepth < 90) {
          analytics.trackEvent({
            event: 'scroll_depth',
            category: 'engagement',
            action: 'scroll',
            value: 90
          })
        }
      }
    }

    // Track time on page
    const startTime = Date.now()
    const trackTimeOnPage = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      analytics.trackEvent({
        event: 'time_on_page',
        category: 'engagement',
        action: 'time_spent',
        value: timeOnPage
      })
    }

    // Add event listeners
    window.addEventListener('scroll', trackScrollDepth, { passive: true })
    window.addEventListener('beforeunload', trackTimeOnPage)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', trackScrollDepth)
      window.removeEventListener('beforeunload', trackTimeOnPage)
    }
  }, [analytics])

  return <>{children}</>
}
