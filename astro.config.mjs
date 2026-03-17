// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://foundations.significa.co",
  integrations: [mdx(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    "/": "/about",
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "kanagawa-lotus",
        dark: "github-dark",
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
});
