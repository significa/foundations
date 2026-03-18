// @ts-check

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://foundations.significa.co',
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    '/': '/about',
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'kanagawa-lotus',
        dark: 'github-dark',
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
});
