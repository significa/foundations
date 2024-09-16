const palette = {
  white: '#fff',
  black: '#000',
  neutral: {
    25: '#f9fafb',
    50: '#f4f4f5',
    75: '#ededee',
    100: '#e4e4e7',
    200: '#d4d4d8',
    300: '#a1a1aa',
    400: '#71717a',
    500: '#52525b',
    600: '#3f3f46',
    700: '#27272a',
    800: '#18181b',
    900: '#121212'
  }
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx,md,mdx}'],
  theme: {
    colors: palette
  }
};
