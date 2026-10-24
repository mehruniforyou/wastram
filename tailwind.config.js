/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          DEFAULT: '#E6A39B',
          50: '#FDF7F6',
          100: '#FAEDE9',
          200: '#F5DBD7',
          300: '#EEC5BF',
          400: '#E6A39B',
          500: '#D98278',
          600: '#C56257',
          700: '#A44A40',
        },
        navy: {
          DEFAULT: '#173B78',
          50: '#F0F4FA',
          100: '#E1E9F5',
          200: '#C4D4EB',
          300: '#9AB7DE',
          400: '#4D7EC0',
          500: '#2A5EA7',
          600: '#173B78',
          700: '#132F61',
          800: '#0E244B',
          900: '#091834',
        },
        gold: {
          DEFAULT: '#D49A35',
          50: '#FDF9F2',
          100: '#FBF2E3',
          200: '#F5E2C2',
          300: '#EDCE9B',
          400: '#E1B468',
          500: '#D49A35',
          600: '#B87E23',
          700: '#93601A',
        },
        ivory: '#FAF8F5',
        charcoal: {
          DEFAULT: '#1A1A1A',
          light: '#2E2E2E',
          muted: '#5A5A5A',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 2px 10px rgba(23, 59, 120, 0.04)',
        card: '0 4px 20px rgba(23, 59, 120, 0.06)',
        'card-hover': '0 12px 32px rgba(23, 59, 120, 0.12)',
        glow: '0 0 25px rgba(212, 154, 53, 0.25)',
      },
    },
  },
  plugins: [],
};
