// src/analytics/tracker.js

// Using Vite environment variables
const API_URL = import.meta.env.VITE_ANALYTICS_API_URL || 'https://gurunetra.sfinteriordecoration.com/api';

/**
 * Generate a random unique ID
 */
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Get or create visitor ID
 */
function getVisitorId() {
  let vid = localStorage.getItem('analytics_vid');
  if (!vid) {
    vid = generateId();
    localStorage.setItem('analytics_vid', vid);
  }
  return vid;
}

/**
 * Get or create session ID
 */
function getSessionId() {
  let sid = sessionStorage.getItem('analytics_sid');
  if (!sid) {
    sid = generateId();
    sessionStorage.setItem('analytics_sid', sid);
  }
  return sid;
}

const Analytics = {
  isInitialized: false,
  heartbeatInterval: null,

  async sendRequest(endpoint, payload, useBeacon = false) {
    const data = {
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      ...payload
    };

    try {
      if (useBeacon && navigator.sendBeacon) {
        // sendBeacon is better for unload events
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(`${API_URL}/${endpoint}`, blob);
      } else {
        await fetch(`${API_URL}/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          // Don't keep connections alive unnecessarily
          keepalive: endpoint === 'end-session.php'
        });
      }
    } catch (e) {
      // Fail silently, never break the app
      console.warn('Analytics tracking failed silently.', e);
    }
  },

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Track initial visit
    this.sendRequest('track-visit.php', {
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || ''
    });

    // Start heartbeat
    this.startHeartbeat();

    // Listen for visibility change to send heartbeat / end session
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendRequest('end-session.php', { exit_page: window.location.href }, true);
      } else {
        this.sendRequest('heartbeat.php', {});
      }
    });

    // Handle window unload
    window.addEventListener('pagehide', () => {
      this.sendRequest('end-session.php', { exit_page: window.location.href }, true);
    });

    // Listen for clicks on tracked elements
    document.addEventListener('click', this.handleClick.bind(this));
  },

  trackPageView() {
    this.sendRequest('page-view.php', {
      page_url: window.location.href,
      page_title: document.title
    });
  },

  trackEvent(eventName, eventData = {}) {
    this.sendRequest('track-event.php', {
      event_name: eventName,
      page_url: window.location.href,
      event_data: eventData
    });
  },

  startHeartbeat() {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    // Send heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.sendRequest('heartbeat.php', {});
      }
    }, 30000);
  },

  handleClick(e) {
    // Find closest anchor, button, or element with data-analytics-event
    const target = e.target.closest('a, button, [role="button"], [data-analytics-event]');
    
    if (!target) return;

    const eventName = target.getAttribute('data-analytics-event') || 'click';
    const elementId = target.id || '';
    const elementText = target.innerText ? target.innerText.substring(0, 100).trim() : '';
    
    // Ignore empty clicks that don't have an ID or specific event
    if (!elementId && !target.getAttribute('data-analytics-event') && target.tagName !== 'BUTTON' && target.tagName !== 'A') {
      return;
    }

    this.sendRequest('track-event.php', {
      event_name: eventName,
      element_id: elementId,
      element_text: elementText,
      page_url: window.location.href,
      event_data: {
        tag: target.tagName,
        href: target.href || null
      }
    });
  }
};

export default Analytics;
