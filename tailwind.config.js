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
        nishorama: {
          brown: '#482922',
          red: '#FF2F00',
          orange: '#FF5400',
          gold: '#F6C582',
          cream: '#FAF8F5',
          grey: '#F5F5F5',
          light: '#EFEFEF',
          dark: '#1C1C1C'
        }
      },
      fontFamily: {
        archivo: ['var(--font-archivo)', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        capsule: '0 4px 20px rgba(72, 41, 34, 0.08)',
        glass: 'inset 0 0 3px rgba(255, 255, 255, 0.85)',
      },
    },
  },
  plugins: [],
};
