const plugin = require('tailwindcss/plugin');

const neutral = {
  light: {
    '--color-neutral-25': '#f9fafb',
    '--color-neutral-50': '#f4f4f5',
    '--color-neutral-75': '#ededee',
    '--color-neutral-100': '#e4e4e7',
    '--color-neutral-200': '#d4d4d8',
    '--color-neutral-300': '#a1a1aa',
    '--color-neutral-400': '#71717a',
    '--color-neutral-500': '#52525b',
    '--color-neutral-600': '#3f3f46',
    '--color-neutral-700': '#27272a',
    '--color-neutral-800': '#18181b',
    '--color-neutral-900': '#121212'
  },
  dark: {
    '--color-neutral-25': '#121212',
    '--color-neutral-50': '#18181b',
    '--color-neutral-75': '#27272a',
    '--color-neutral-100': '#3f3f46',
    '--color-neutral-200': '#52525b',
    '--color-neutral-300': '#71717a',
    '--color-neutral-400': '#a1a1aa',
    '--color-neutral-500': '#d4d4d8',
    '--color-neutral-600': '#e4e4e7',
    '--color-neutral-700': '#ededee',
    '--color-neutral-800': '#f4f4f5',
    '--color-neutral-900': '#f9fafb'
  }
};

const palette = {
  white: '#fff',
  black: '#000',
  neutral: {
    25: 'var(--color-neutral-25)',
    50: 'var(--color-neutral-50)',
    75: 'var(--color-neutral-75)',
    100: 'var(--color-neutral-100)',
    200: 'var(--color-neutral-200)',
    300: 'var(--color-neutral-300)',
    400: 'var(--color-neutral-400)',
    500: 'var(--color-neutral-500)',
    600: 'var(--color-neutral-600)',
    700: 'var(--color-neutral-700)',
    800: 'var(--color-neutral-800)',
    900: 'var(--color-neutral-90)0'
  }
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,md,mdx}'],
  theme: {
    colors: palette
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ':root, [data-theme="light"], .light': neutral.light,
        '[data-theme="dark"], .dark': neutral.dark
      });
    })
  ]
};
