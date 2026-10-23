// src/analytics/tracker.js
// Sends visitor / page-view / click events to the CodeIgniter 4 backend.

// Routes to CodeIgniter 4 backend (Vite dev proxy forwards /api -> localhost:8080)
const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

  async sendRequest(endpoint, payload, useBeacon = false) {
    const data = {
      visitor_id: getVisitorId(),
      session_id: getSessionId(),
      ...payload,
    };

    const url = `${API_URL}/${endpoint}`;
    const body = JSON.stringify(data);

    try {
      if (useBeacon && navigator.sendBeacon) {
        // sendBeacon cannot send custom headers, so we rely on the raw body — CI4 getJSON() parses it fine
        navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
        return;
      }

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      });
    } catch (err) {
      // Analytics should never break the app
      console.warn('[analytics] request failed:', err);
    }
  },

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Track initial visit
    this.sendRequest('track/visit', {
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer || '',
    });

    // Global click listener — captures clicks on all links/buttons/[data-analytics-event]
    const handler = (e) => {
      const target = e.target.closest?.('a, button, [data-analytics-event]') || null;
      if (!target) return;

      const customEvent = target.getAttribute('data-analytics-event');
      let eventName = customEvent || 'click';

      // Buttons inside the checkout modal get explicit funnel events
      const modalAncestor = target.closest?.('.checkout-modal-content');
      if (modalAncestor && !customEvent) {
        eventName = 'checkout_click';
      }

      const elementId = target.id || '';
      const elementText = (target.innerText || '').trim().substring(0, 100);

      this.sendRequest('track/event', {
        event_name: eventName,
        element_id: elementId,
        element_text: elementText,
        page_url: window.location.href,
        event_data: {
          tag: target.tagName,
          href: target.href || null,
        },
      });
    };

    // Capture phase so nothing gets swallowed by React synthetic events
    document.addEventListener('click', handler, true);

    // Heartbeat / end-session on tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendRequest('track/end-session', { exit_page: window.location.href }, true);
      } else {
        this.sendRequest('track/heartbeat', {});
      }
    });

    window.addEventListener('pagehide', () => {
      this.sendRequest('track/end-session', { exit_page: window.location.href }, true);
    });
  },

  trackPageView() {
    if (!this.isInitialized) this.init();
    this.sendRequest('track/page-view', {
      page_url: window.location.href,
      page_title: document.title,
    });
  },

  async trackEvent(eventName, eventData = {}) {
    if (!this.isInitialized) this.init();
    await this.sendRequest('track/event', {
      event_name: eventName,
      page_url: window.location.href,
      event_data: eventData,
    });
  },

  async endSession() {
    await this.sendRequest('track/end-session', {
      exit_page: window.location.href,
    });
  },

  async heartbeat() {
    await this.sendRequest('track/heartbeat', {});
  },
};

// Initialize on module load (browser only)
if (typeof window !== 'undefined') {
  Analytics.init();

  // Send heartbeat every 30 seconds
  setInterval(() => Analytics.heartbeat(), 30000);
}

export default Analytics;
