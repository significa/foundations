const plugin = require('tailwindcss/plugin');

const colors = {
  // in oklch color space
  // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
  '--color-background': '97.72% 0 0',
  '--color-primary': '25% 0 0',
  '--color-accent': '87.99% 0.17372425704675545 92.92368848780228',
  '--color-error': '59.28% 0.227 23.31'
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,md,mdx}'],
  theme: {
    colors: {
      white: '#fff',
      black: '#000',
      current: 'currentColor',
      transparent: 'transparent',
      background: 'oklch(var(--color-background) / <alpha-value>)',
      primary: 'oklch(var(--color-primary) / <alpha-value>)',
      accent: 'oklch(var(--color-accent) / <alpha-value>)',
      error: 'oklch(var(--color-error) / <alpha-value>)'
    },
    extend: {
      keyframes: {
        slideDown: {
          from: { height: '0px' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0px' }
        }
      },
      animation: {
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addBase }) {
      addBase({ ':root': colors });
    })
  ]
};
