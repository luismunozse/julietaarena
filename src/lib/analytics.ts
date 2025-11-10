// Analytics and Event Tracking System
export interface AnalyticsEvent {
  event: string
  category: string
  action: string
  label?: string
  value?: number
  properties?: Record<string, any>
}

export interface PageViewEvent {
  page: string
  title: string
  url: string
  referrer?: string
  timestamp: number
}

class Analytics {
  private isEnabled: boolean = false
  private events: AnalyticsEvent[] = []
  private pageViews: PageViewEvent[] = []

  constructor() {
    this.initialize()
  }

  private initialize() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') return

    // Enable analytics in production, development, or when explicitly enabled
    this.isEnabled = process.env.NODE_ENV === 'production' ||
                    process.env.NODE_ENV === 'development' ||
                    localStorage.getItem('analytics_enabled') === 'true'

    // Load existing data from localStorage
    this.loadFromStorage()

    // Track page view on initialization
    this.trackPageView()
  }

  private loadFromStorage() {
    try {
      const storedEvents = localStorage.getItem('analytics_events')
      const storedPageViews = localStorage.getItem('analytics_pageviews')
      
      if (storedEvents) {
        this.events = JSON.parse(storedEvents)
      }
      
      if (storedPageViews) {
        this.pageViews = JSON.parse(storedPageViews)
      }
    } catch (error) {
      console.warn('Error loading analytics data from storage:', error)
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events))
      localStorage.setItem('analytics_pageviews', JSON.stringify(this.pageViews))
    } catch (error) {
      console.warn('Error saving analytics data to storage:', error)
    }
  }

  // Enable/disable analytics
  enable() {
    this.isEnabled = true
    localStorage.setItem('analytics_enabled', 'true')
  }

  disable() {
    this.isEnabled = false
    localStorage.setItem('analytics_enabled', 'false')
  }

  // Track custom events
  trackEvent(event: AnalyticsEvent) {
    if (!this.isEnabled) return

    const eventWithTimestamp = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userId: this.getUserId()
    }

    this.events.push(eventWithTimestamp)
    this.saveToStorage()

    // Send to external analytics (Google Analytics, etc.)
    this.sendToExternalAnalytics(eventWithTimestamp)

  }

  // Track page views
  trackPageView(page?: string, title?: string) {
    if (!this.isEnabled) return

    const pageView: PageViewEvent = {
      page: page || window.location.pathname,
      title: title || document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: Date.now()
    }

    this.pageViews.push(pageView)
    this.saveToStorage()

    // Send to external analytics
    this.sendPageViewToExternalAnalytics(pageView)

  }

  // Track user interactions
  trackClick(element: string, location: string, properties?: Record<string, any>) {
    this.trackEvent({
      event: 'click',
      category: 'user_interaction',
      action: 'click',
      label: element,
      properties: {
        location,
        ...properties
      }
    })
  }

  trackFormSubmit(formName: string, success: boolean, properties?: Record<string, any>) {
    this.trackEvent({
      event: 'form_submit',
      category: 'form',
      action: success ? 'submit_success' : 'submit_error',
      label: formName,
      properties
    })
  }

  trackPropertyView(propertyId: string, propertyTitle: string) {
    this.trackEvent({
      event: 'property_view',
      category: 'property',
      action: 'view',
      label: propertyTitle,
      properties: {
        propertyId
      }
    })
  }

  trackPropertyFavorite(propertyId: string, action: 'add' | 'remove') {
    this.trackEvent({
      event: 'property_favorite',
      category: 'property',
      action: action,
      label: propertyId
    })
  }

  trackPropertyCompare(propertyId: string, action: 'add' | 'remove') {
    this.trackEvent({
      event: 'property_compare',
      category: 'property',
      action: action,
      label: propertyId
    })
  }

  trackAppointmentBooking(propertyId: string, appointmentType: string) {
    this.trackEvent({
      event: 'appointment_booking',
      category: 'appointment',
      action: 'book',
      label: appointmentType,
      properties: {
        propertyId
      }
    })
  }

  trackChatMessage(messageType: 'user' | 'bot', messageLength: number) {
    this.trackEvent({
      event: 'chat_message',
      category: 'chat',
      action: 'send',
      label: messageType,
      value: messageLength
    })
  }

  trackSearch(searchTerm: string, resultsCount: number, filters?: Record<string, any>) {
    this.trackEvent({
      event: 'search',
      category: 'search',
      action: 'search',
      label: searchTerm,
      value: resultsCount,
      properties: {
        filters
      }
    })
  }

  trackContact(method: 'phone' | 'whatsapp' | 'email' | 'form', context?: string) {
    this.trackEvent({
      event: 'contact',
      category: 'contact',
      action: method,
      label: context
    })
  }

  // Get analytics data
  getEvents(category?: string): AnalyticsEvent[] {
    if (category) {
      return this.events.filter(event => event.category === category)
    }
    return [...this.events]
  }

  getPageViews(): PageViewEvent[] {
    return [...this.pageViews]
  }

  getEventCount(category?: string): number {
    return this.getEvents(category).length
  }

  getPopularPages(limit: number = 10): Array<{page: string, views: number}> {
    const pageCounts: Record<string, number> = {}
    
    this.pageViews.forEach(pageView => {
      pageCounts[pageView.page] = (pageCounts[pageView.page] || 0) + 1
    })

    return Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  }

  getPopularEvents(limit: number = 10): Array<{event: string, count: number}> {
    const eventCounts: Record<string, number> = {}
    
    this.events.forEach(event => {
      const key = `${event.category}:${event.action}`
      eventCounts[key] = (eventCounts[key] || 0) + 1
    })

    return Object.entries(eventCounts)
      .map(([event, count]) => ({ event, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // Export data
  exportData() {
    return {
      events: this.events,
      pageViews: this.pageViews,
      totalEvents: this.events.length,
      totalPageViews: this.pageViews.length,
      popularPages: this.getPopularPages(),
      popularEvents: this.getPopularEvents()
    }
  }

  // Clear data
  clearData() {
    this.events = []
    this.pageViews = []
    this.saveToStorage()
  }

  // External analytics integration
  private sendToExternalAnalytics(event: AnalyticsEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.properties
      })
    }

    // Facebook Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', event.action, {
        content_category: event.category,
        content_name: event.label,
        value: event.value,
        ...event.properties
      })
    }
  }

  private sendPageViewToExternalAnalytics(pageView: PageViewEvent) {
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_title: pageView.title,
        page_location: pageView.url
      })
    }
  }

  // Utility methods
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  private getUserId(): string {
    let userId = localStorage.getItem('analytics_user_id')
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('analytics_user_id', userId)
    }
    return userId
  }
}

// Create singleton instance
export const analytics = new Analytics()
