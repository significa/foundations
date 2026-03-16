import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { previewLoader } from "./lib/loaders";

const pages = defineCollection({
  loader: glob({
    pattern: "**/page.mdx",
    base: "./src/foundations",
    generateId: ({ entry }) => entry.replace("/page.mdx", ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    meta: z
      .object({
        folder: z.string(),
      })
      .optional(),
  }),
});

const previews = defineCollection({
  loader: previewLoader({
    pattern: "**/*.preview.tsx",
    base: "./src/foundations",
    generateId: ({ entry }) => {
      const filename = entry.split("/").pop() || "";
      return filename.replace(".preview.tsx", "");
    },
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
