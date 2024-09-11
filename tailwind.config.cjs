/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx,md,mdx}',
    './src/components/**/*.{js,jsx,ts,tsx,md,mdx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [],
  presets: [
    require('@significa/svelte-ui/tailwind-preset')({
      fonts: {
        sans: {
          name: 'Significa Sans',
          fontFaces: [
            {
              fontWeight: '400',
              src: `url('/fonts/significa-regular.woff2') format('woff2')`,
              ascentOverride: '95%'
            },
            {
              fontWeight: '500',
              src: `url('/fonts/significa-medium.woff2') format('woff2')`,
              ascentOverride: '95%'
            },
            {
              fontWeight: '600',
              src: `url('/fonts/significa-semibold.woff2') format('woff2')`,
              ascentOverride: '95%'
            }
          ]
        }
      }
    })
  ]
};
