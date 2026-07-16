/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Brand Palette ──────────────────────────────────────
        // Deep maroon — primary brand color
        maroon: {
          50:  '#fdf2f2',
          100: '#fce4e4',
          200: '#f9bdbd',
          300: '#f48787',
          400: '#ec4f4f',
          500: '#de2727',
          600: '#bc1c1c',
          700: '#8B2E2E',   // Used for lighter accents
          800: '#6B1E1E',   // DEFAULT — Primary brand maroon
          900: '#4A1515',   // Dark maroon — for deep backgrounds
          950: '#2d0b0b',
        },
        // Gold / Amber — secondary brand color
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#DFC070',   // Light gold
          400: '#C9A84C',   // DEFAULT — Primary gold
          500: '#A87D30',   // Dark gold
          600: '#8a6220',
          700: '#6b4d18',
        },
        // Navy — for sidebars and dark surfaces
        navy: {
          700: '#243460',
          800: '#1A2744',   // DEFAULT
          900: '#111b33',
          950: '#0a1020',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px 0 rgba(107,30,30,0.12)',
        sidebar: '2px 0 8px 0 rgba(0,0,0,0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%':           { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
