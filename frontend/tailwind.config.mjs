/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: {
          50: '#fdfbf8',
          100: '#f7f3ee',
          200: '#ede6db',
          300: '#ddd1c0',
          400: '#c9b89e',
          500: '#b4a07e',
        },
        ink: {
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        amber: {
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
        },
        terra: {
          300: '#e4a07a',
          400: '#d4845a',
          500: '#c06840',
          600: '#a85030',
          700: '#8c3a1e',
        },
        estuary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.05em',
        widest: '0.2em',
        extreme: '0.4em',
      },
    },
  },
  plugins: [],
}
