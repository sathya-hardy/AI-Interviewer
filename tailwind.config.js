/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          900: '#0f1117',
          800: '#1a1d27',
          700: '#252836',
          600: '#2e3244',
        },
        accent: {
          amber: '#f59e0b',
          'amber-hover': '#d97706',
          teal: '#14b8a6',
          'teal-hover': '#0d9488',
        },
        text: {
          primary: '#ffffff',
          body: '#e8e6e3',
          muted: '#9ca3af',
          dim: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 24px rgba(245, 158, 11, 0.18), 0 0 48px rgba(245, 158, 11, 0.08)',
        'glow-amber-lg': '0 0 40px rgba(245, 158, 11, 0.25)',
        'glow-teal': '0 0 24px rgba(20, 184, 166, 0.18), 0 0 48px rgba(20, 184, 166, 0.08)',
        'glow-teal-lg': '0 0 40px rgba(20, 184, 166, 0.25)',
        'card': '0 1px 3px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.15)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.3), 0 16px 48px rgba(0,0,0,0.2)',
        'modal': '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 80px rgba(245,158,11,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s infinite linear',
        'mesh': 'meshMove 20s ease-in-out infinite alternate',
        'stagger-1': 'fadeSlideIn 0.5s ease-out 0ms both',
        'stagger-2': 'fadeSlideIn 0.5s ease-out 100ms both',
        'stagger-3': 'fadeSlideIn 0.5s ease-out 200ms both',
        'stagger-4': 'fadeSlideIn 0.5s ease-out 300ms both',
        'stagger-5': 'fadeSlideIn 0.5s ease-out 400ms both',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% -200%' },
          '100%': { backgroundPosition: '200% 200%' },
        },
        meshMove: {
          '0%': { transform: 'translate(0%, 0%) scale(1)' },
          '50%': { transform: 'translate(5%, -3%) scale(1.1)' },
          '100%': { transform: 'translate(-3%, 5%) scale(1.05)' },
        },
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
