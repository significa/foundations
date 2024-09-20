const plugin = require('tailwindcss/plugin');

const colors = {
  // in oklch color space
  // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
  '--color-background': '97.72% 0 0',
  '--color-primary': '25% 0 0',
  '--color-accent': '87.99% 0.17372425704675545 92.92368848780228'
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
      accent: 'oklch(var(--color-accent) / <alpha-value>)'
    }
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({ ':root': colors });
    })
  ]
};
