import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },

    borderRadius: {
      '2xl': '24px',
      xl: '16px',
      lg: '8px',
      md: '4px',
      sm: '2px',
      full: '100px',
    },

    extend: {
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
      },

      colors: {
        primary: {
          DEFAULT: 'hsl(200,76%,60%)',
          '25': 'hsl(200,76%,85%)',
          '50': 'hsl(200,76%,80%)',
          '100': 'hsl(200,76%,75%)',
          '200': 'hsl(200,76%,70%)',
          '300': 'hsl(200,76%,65%)',
          '400': 'hsl(200,76%,60%)',
          '500': 'hsl(200,76%,55%)',
          '600': 'hsl(200,76%,50%)',
          '700': 'hsl(200,76%,40%)',
          '800': 'hsl(200,76%,30%)',
          '900': 'hsl(200,76%,20%)',
        },
      },

      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },

        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },

        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
