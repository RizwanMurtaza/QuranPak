/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        cream: {
          50: '#fefdf9',
          100: '#fdf6e3',
          200: '#f9ead1',
          300: '#f3d9a8',
          400: '#ebc474',
          500: '#e3af47',
          600: '#d69e2e',
          700: '#b7791f',
          800: '#975a16',
          900: '#744210',
        },
        islamic: {
          green: '#059669',
          emerald: '#10b981',
          teal: '#14b8a6',
          gold: '#f59e0b',
          amber: '#d97706',
          charcoal: '#374151',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      fontFamily: {
        'arabic': ['Scheherazade New', 'Amiri', 'Noto Naskh Arabic', 'Arabic Typesetting', 'serif'],
        'quran': ['Scheherazade New', 'serif'],
        'sans': ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
        'serif': ['Inter', 'Georgia', 'serif'],
        'mono': ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'arabic-sm': ['1.125rem', { lineHeight: '1.75rem' }],
        'arabic-base': ['1.25rem', { lineHeight: '1.875rem' }],
        'arabic-lg': ['1.5rem', { lineHeight: '2.25rem' }],
        'arabic-xl': ['1.875rem', { lineHeight: '2.5rem' }],
        'arabic-2xl': ['2.25rem', { lineHeight: '3rem' }],
      },
      boxShadow: {
        'verse': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'word': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}