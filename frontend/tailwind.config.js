/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:        '#0F172A',
          bgDeep:    '#020617',
          card:      '#1E293B',
          border:    '#334155',
          primary:   '#6366F1',
          primaryHv: '#4F46E5',
          textPri:   '#F8FAFC',
          textSec:   '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 32px 0 rgba(0,0,0,0.45)',
        glow: '0 0 24px 4px rgba(99,102,241,0.18)',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #020617 0%, #0F172A 50%, #0f1535 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.7' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
