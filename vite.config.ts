import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import viteReact from "@vitejs/plugin-react";
import mdx from '@mdx-js/rollup'

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { rehypePrettyCodeOptions } from "./src/lib/rehype-pretty-code";
import { rehypeRawCode } from "./src/lib/rehype-raw-code";
import { rehypeRewriteImports } from "./src/lib/rehype-rewrite-imports";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths(),
    tanstackStart({ customViteReactPlugin: true }),
    viteReact(),
    mdx({
        remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      rehypeRewriteImports,
      rehypeRawCode,
      [rehypePrettyCode, rehypePrettyCodeOptions],
    ],
    }),
  ],
});
