import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { previewLoader } from "./lib/loaders";

const pages = defineCollection({
  loader: glob({
    pattern: "about/page.mdx",
    base: "./src/foundations",
    generateId: ({ entry }) => entry.replace("/page.mdx", ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const previews = defineCollection({
  loader: previewLoader({
    pattern: "about/*.preview.tsx",
    base: "./src/foundations",
    generateId: ({ entry }) => entry.replace(".preview.tsx", ""),
  }),
  schema: z.object({
    file: z.string(),
  }),
});

const collections = {
  pages,
  previews,
};

export { collections };
