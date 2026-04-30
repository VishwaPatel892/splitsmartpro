import { useState, useCallback } from 'react';

/**
 * useTheme – Manages dark/light mode preference with localStorage persistence.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      return localStorage.getItem('splitsmart_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const setTheme = useCallback((newTheme) => {
    try {
      localStorage.setItem('splitsmart_theme', newTheme);
    } catch {/* storage unavailable */}

    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}

export default useTheme;
