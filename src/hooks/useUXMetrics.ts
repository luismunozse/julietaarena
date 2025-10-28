'use client'

import { useEffect, useRef } from 'react'
import { useAnalytics } from './useAnalytics'

interface UXMetricsConfig {
  componentName: string
  trackLoadTime?: boolean
  trackInteractionTime?: boolean
  trackScrollDepth?: boolean
}

export function useUXMetrics({
  componentName,
  trackLoadTime = true,
  trackInteractionTime = false,
  trackScrollDepth = false
}: UXMetricsConfig) {
  const analytics = useAnalytics()
  const mountTime = useRef<number>(Date.now())
  const interactionStart = useRef<number | null>(null)
  const maxScrollDepth = useRef<number>(0)

  // Track component load time
  useEffect(() => {
    if (!trackLoadTime) return

    const loadTime = Date.now() - mountTime.current

    // Track load time metric
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ux_metric_load_time', {
        component_name: componentName,
        load_time_ms: loadTime,
        event_category: 'UX Metrics',
        event_label: componentName
      })
    }

    console.log(`[UX Metrics] ${componentName} loaded in ${loadTime}ms`)
  }, [componentName, trackLoadTime])

  // Track interaction time
  useEffect(() => {
    if (!trackInteractionTime) return

    const handleInteractionStart = () => {
      if (!interactionStart.current) {
        interactionStart.current = Date.now()
      }
    }

    const handleInteractionEnd = () => {
      if (interactionStart.current) {
        const interactionTime = Date.now() - interactionStart.current

        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'ux_metric_interaction_time', {
            component_name: componentName,
            interaction_time_ms: interactionTime,
            event_category: 'UX Metrics',
            event_label: componentName
          })
        }

        console.log(`[UX Metrics] ${componentName} interaction time: ${interactionTime}ms`)
        interactionStart.current = null
      }
    }

    document.addEventListener('mousedown', handleInteractionStart)
    document.addEventListener('touchstart', handleInteractionStart)
    document.addEventListener('mouseup', handleInteractionEnd)
    document.addEventListener('touchend', handleInteractionEnd)

    return () => {
      document.removeEventListener('mousedown', handleInteractionStart)
      document.removeEventListener('touchstart', handleInteractionStart)
      document.removeEventListener('mouseup', handleInteractionEnd)
      document.removeEventListener('touchend', handleInteractionEnd)
    }
  }, [componentName, trackInteractionTime])

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return

    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollPercentage = Math.round((scrollTop / (documentHeight - windowHeight)) * 100)

      if (scrollPercentage > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercentage

        // Track milestones: 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(scrollPercentage)) {
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'ux_metric_scroll_depth', {
              component_name: componentName,
              scroll_depth: scrollPercentage,
              event_category: 'UX Metrics',
              event_label: `${componentName} - ${scrollPercentage}%`
            })
          }

          console.log(`[UX Metrics] ${componentName} scroll depth: ${scrollPercentage}%`)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [componentName, trackScrollDepth])

  // Track time on page (cleanup on unmount)
  useEffect(() => {
    return () => {
      const timeOnPage = Date.now() - mountTime.current

      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ux_metric_time_on_component', {
          component_name: componentName,
          time_ms: timeOnPage,
          event_category: 'UX Metrics',
          event_label: componentName
        })
      }

      console.log(`[UX Metrics] ${componentName} time on page: ${timeOnPage}ms`)
    }
  }, [componentName])

  // Utility methods
  const trackCustomMetric = (metricName: string, value: number | string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ux_metric_custom', {
        component_name: componentName,
        metric_name: metricName,
        metric_value: value,
        event_category: 'UX Metrics',
        event_label: `${componentName} - ${metricName}`
      })
    }

    console.log(`[UX Metrics] ${componentName} custom metric: ${metricName} = ${value}`)
  }

  const trackEmptyState = (reason: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ux_empty_state_shown', {
        component_name: componentName,
        reason,
        event_category: 'UX Metrics',
        event_label: `${componentName} - ${reason}`
      })
    }

    console.log(`[UX Metrics] ${componentName} empty state: ${reason}`)
  }

  const trackLoadingState = (duration: number) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ux_loading_duration', {
        component_name: componentName,
        duration_ms: duration,
        event_category: 'UX Metrics',
        event_label: componentName
      })
    }

    console.log(`[UX Metrics] ${componentName} loading duration: ${duration}ms`)
  }

  return {
    trackCustomMetric,
    trackEmptyState,
    trackLoadingState
  }
}

