import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';

export default defineConfig({
  site: 'https://foundations.significa.co',
  env: {
    schema: {
      POSTHOG_KEY: envField.string({ context: 'client', access: 'public' }),
      POSTHOG_HOST: envField.string({ context: 'client', access: 'public' }),
    },
  },

  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'], // don't bundle pagefind.js, treat it as an external asset
      },
    },
    assetsInclude: '**/pagefind.js', // treat pagefind.js as an asset so it gets copied to the dist folder
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
