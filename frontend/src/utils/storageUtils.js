/**
 * storageUtils – Safe wrappers around localStorage and sessionStorage.
 * Falls back gracefully if storage is unavailable (e.g. private browsing).
 */

// ── localStorage helpers ──────────────────────────────────────────────────

export const ls = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try { localStorage.removeItem(key); } catch {/* noop */}
  },

  clear() {
    try { localStorage.clear(); } catch {/* noop */}
  },
};

// ── sessionStorage helpers ─────────────────────────────────────────────────

export const ss = {
  get(key, fallback = null) {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try { sessionStorage.removeItem(key); } catch {/* noop */}
  },

  clear() {
    try { sessionStorage.clear(); } catch {/* noop */}
  },
};

// ── Named constants for storage keys ──────────────────────────────────────

export const STORAGE_KEYS = {
  USER:            'splitsmart_user',
  TOKEN:           'token',
  THEME:           'splitsmart_theme',
  CURRENCY:        'splitsmart_currency',
  FORM_STEP:       'ss_form_step',   // sessionStorage – multi-step form progress
  FILTER_STATE:    'ss_filter_state', // sessionStorage – temporary filter state
};
