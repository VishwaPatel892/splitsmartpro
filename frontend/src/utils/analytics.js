/**
 * analytics.js – Lightweight page-view & event tracking utility.
 * Fires Google Analytics 4 (gtag) events when the script is loaded,
 * and safely no-ops in development or if gtag is unavailable.
 */

const GA_ID = import.meta.env.VITE_GA_ID || ''; // Set VITE_GA_ID in .env

/** Internal helper – calls gtag only when available */
function gtag(...args) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

/**
 * trackPageView – Call on route change.
 * @param {string} path  – e.g. '/dashboard'
 * @param {string} title – e.g. 'Dashboard | SplitSmart Pro'
 */
export function trackPageView(path, title) {
  if (!GA_ID) return;
  gtag('config', GA_ID, { page_path: path, page_title: title });
}

/**
 * trackEvent – Call for user actions (button clicks, form submissions, etc.)
 * @param {string} category – e.g. 'Expense'
 * @param {string} action   – e.g. 'Added'
 * @param {string} label    – e.g. 'Goa Trip'
 * @param {number} value    – optional numeric value
 */
export function trackEvent(category, action, label = '', value) {
  if (!GA_ID) return;
  gtag('event', action, {
    event_category: category,
    event_label:    label,
    value,
  });
}
