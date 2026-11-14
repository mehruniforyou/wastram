/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './data/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Wastram Official Brand Palette
        wastram: {
          navy: '#0B2D7F',        // Primary: Royal Navy Blue (25%)
          navyDark: '#071F59',    // Deep Royal Navy for hover/contrast
          navyLight: '#1A3F99',   // Highlight Royal Navy
          pink: '#F4A7B7',        // Secondary: Heritage Pink (12%)
          pinkLight: '#FDF1F4',   // Tinted Heritage Pink for backgrounds
          pinkMuted: '#EAA0B0',   // Border accent
          orange: '#F58220',      // Accent: Marigold Orange (4%)
          orangeHover: '#DE6F12', // Marigold Orange active state
          gold: '#D4AF37',        // Premium Accent: Golden Thread (6%)
          goldMuted: '#C29B27',   // Deeper thread gold
          goldLight: '#FAF5E6',   // Champagne gold background tint
          ivory: '#FAF9F6',       // Background: Ivory White (45%)
          ceramic: '#4A7BC6',     // Supporting: Ceramic Blue (8%)
          ceramicLight: '#EEF4FC',// Ceramic Blue soft wash
          ceramicDark: '#3866AB', // Ceramic Blue interactive
        },
        nishorama: {
          brown: '#0B2D7F',
          red: '#F58220',
          orange: '#F58220',
          gold: '#D4AF37',
          cream: '#FAF9F6',
          grey: '#F3F4F8',
          light: '#EEF4FC',
          dark: '#071F59'
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['var(--font-serif)', '"Cormorant Garamond"', 'Playfair Display', 'Georgia', 'serif'],
        display: ['var(--font-display)', '"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        archivo: ['var(--font-archivo)', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 10px rgba(11, 45, 127, 0.04)',
        card: '0 4px 20px rgba(11, 45, 127, 0.06)',
        cardHover: '0 12px 32px rgba(11, 45, 127, 0.12)',
        elevated: '0 20px 40px -15px rgba(11, 45, 127, 0.15)',
        gold: '0 4px 20px rgba(212, 175, 55, 0.18)',
        navy: '0 8px 24px rgba(11, 45, 127, 0.18)',
      },
    },
  },
  plugins: [],
};
