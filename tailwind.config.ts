import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C97E',
          dark: '#9A7A2E',
        },
        dark: {
          DEFAULT: '#0a0a0a',
          100: '#111111',
          200: '#1a1a1a',
          300: '#242424',
          400: '#2e2e2e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0a0',
          muted: '#666666',
        },
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E2C97E 50%, #9A7A2E 100%)',
        'gold-radial': 'radial-gradient(ellipse at center, #C9A84C22 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'grain': 'grain 0.5s steps(1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 1%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(2%, -2%)' },
          '50%': { transform: 'translate(-3%, 2%)' },
          '60%': { transform: 'translate(1%, -3%)' },
          '70%': { transform: 'translate(-2%, 1%)' },
          '80%': { transform: 'translate(3%, 3%)' },
          '90%': { transform: 'translate(-1%, -1%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
