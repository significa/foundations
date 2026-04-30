import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import { themes } from './src/lib/shiki';

export default defineConfig({
  site: 'https://foundations.significa.co',
  env: {
    schema: {
      // Both optional. Without them, PostHog analytics is skipped at runtime.
      POSTHOG_KEY: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
      POSTHOG_HOST: envField.string({
        context: 'client',
        access: 'public',
        optional: true,
      }),
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
      themes,
    },
  },
  devToolbar: {
    enabled: false,
  },
});
