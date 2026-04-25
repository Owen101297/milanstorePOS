import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        xs: ['13px', { lineHeight: '28px' }],
        sm: ['14px', { lineHeight: '28px' }],
        base: ['14px', { lineHeight: '28px' }],
        lg: ['16px', { lineHeight: '28px' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        bold: '700',
        black: '900',
      },
      spacing: {
        1: '10px',
        2: '15px',
        3: '20px',
        4: '22px',
        5: '30px',
        6: '40px',
        7: '100px',
      },
      colors: {
        brand: {
          primary: '#62cb31',
          dark: '#333333',
          darker: '#2d2d2d',
          sidebar: '#505050',
        },
        text: {
          primary: '#f3f7f9',
          secondary: '#a3afb7',
          tertiary: '#6a6c6f',
          inverse: '#34495e',
        },
        surface: {
          base: '#000000',
          muted: '#333333',
          raised: '#ffffff',
          strong: '#25d366',
        },
        status: {
          error: '#e74c3c',
          warning: '#f1c40f',
          info: '#5dade2',
          success: '#62cb31',
        },
        border: {
          default: '#f3f7f9',
          muted: 'rgba(163, 175, 183, 0.9)',
        },
      },
      borderRadius: {
        xs: '25px',
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        1: '2px 2px 3px 0px rgb(153, 153, 153)',
        2: '0px 2px 4px 0px rgba(0, 0, 0, 0.08)',
        3: '0px 4px 12px 0px rgba(0, 0, 0, 0.15)',
        4: '0 6px 12px rgba(0,0,0,.175)',
      },
      transitionDuration: {
        instant: '200ms',
        fast: '300ms',
      },
      ringColor: {
        DEFAULT: '#62cb31',
      },
      ringOffsetWidth: {
        DEFAULT: '2px',
      },
    },
  },
  plugins: [],
} satisfies Config