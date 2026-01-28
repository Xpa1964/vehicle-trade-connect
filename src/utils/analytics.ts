/**
 * Analytics utility for tracking user events
 * Supports Google Analytics 4 and can be extended for other providers
 */

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

class AnalyticsService {
  private isEnabled: boolean = false;
  private debugMode: boolean = false;

  constructor() {
    // Enable analytics in production only
    this.isEnabled = import.meta.env.PROD;
    this.debugMode = import.meta.env.DEV;
  }

  /**
   * Initialize analytics (call this in App.tsx)
   */
  init(measurementId?: string) {
    if (!this.isEnabled && !this.debugMode) return;

    if (this.debugMode) {
      console.log('[Analytics] Initialized in debug mode');
      return;
    }

    // Initialize GA4 if measurement ID is provided
    if (measurementId && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      document.head.appendChild(script);

      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', measurementId, {
        send_page_view: true,
        anonymize_ip: true, // GDPR compliance
      });

      (window as any).gtag = gtag;
      console.log('[Analytics] GA4 initialized');
    }
  }

  /**
   * Track a custom event
   */
  trackEvent(event: AnalyticsEvent) {
    if (this.debugMode) {
      console.log('[Analytics] Event tracked:', event);
      return;
    }

    if (!this.isEnabled) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event,
      });
    }
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string) {
    if (this.debugMode) {
      console.log('[Analytics] Page view:', { path, title });
      return;
    }

    if (!this.isEnabled) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
      });
    }
  }

  /**
   * Track vehicle view
   */
  trackVehicleView(vehicleId: string, make: string, model: string) {
    this.trackEvent({
      action: 'view_item',
      category: 'Vehicle',
      label: `${make} ${model}`,
      item_id: vehicleId,
      item_name: `${make} ${model}`,
      item_category: 'Vehicle',
    });
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string, resultsCount: number) {
    this.trackEvent({
      action: 'search',
      category: 'Search',
      label: searchTerm,
      search_term: searchTerm,
      results_count: resultsCount,
    });
  }

  /**
   * Track contact form submission
   */
  trackContactSubmit(type: 'vehicle' | 'general' | 'support') {
    this.trackEvent({
      action: 'submit_form',
      category: 'Contact',
      label: type,
      form_type: type,
    });
  }

  /**
   * Track user registration
   */
  trackRegistration(method: 'email' | 'google') {
    this.trackEvent({
      action: 'sign_up',
      category: 'Authentication',
      label: method,
      method: method,
    });
  }

  /**
   * Track user login
   */
  trackLogin(method: 'email' | 'google') {
    this.trackEvent({
      action: 'login',
      category: 'Authentication',
      label: method,
      method: method,
    });
  }

  /**
   * Track vehicle publication
   */
  trackVehiclePublish(vehicleId: string) {
    this.trackEvent({
      action: 'publish_vehicle',
      category: 'Vehicle',
      label: vehicleId,
      vehicle_id: vehicleId,
    });
  }

  /**
   * Track filter usage
   */
  trackFilterUse(filterType: string, filterValue: string) {
    this.trackEvent({
      action: 'use_filter',
      category: 'Search',
      label: `${filterType}: ${filterValue}`,
      filter_type: filterType,
      filter_value: filterValue,
    });
  }

  /**
   * Track errors for monitoring
   */
  trackError(error: Error, context?: string) {
    if (this.debugMode) {
      console.error('[Analytics] Error tracked:', { error, context });
      return;
    }

    if (!this.isEnabled) return;

    this.trackEvent({
      action: 'exception',
      category: 'Error',
      label: error.message,
      description: error.message,
      fatal: false,
      context: context,
    });
  }

  /**
   * Track timing (performance metrics)
   */
  trackTiming(category: string, variable: string, value: number, label?: string) {
    if (this.debugMode) {
      console.log('[Analytics] Timing:', { category, variable, value, label });
      return;
    }

    if (!this.isEnabled) return;

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'timing_complete', {
        name: variable,
        value: value,
        event_category: category,
        event_label: label,
      });
    }
  }
}

// Singleton instance
export const analytics = new AnalyticsService();

// Export types
export type { AnalyticsEvent };
