import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.mdx",
    base: "./src/foundations",
    generateId: ({ entry }) => entry.replace("/page.mdx", ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const collections = {
  pages,
};

export { collections };
