import { defineCollection, reference } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { previewLoader } from "@/lib/preview";

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
    meta: z
      .object({
        layout: z.enum(["centered", "fullscreen", "padded"]).optional(),
      })
      .optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: "**/page.mdx",
    base: "./src/foundations",
    generateId: ({ entry }) => entry.replace("/page.mdx", ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    preview: reference("previews").optional(),
    files: z.array(z.string()).optional(),
    dependencies: z
      .array(
        z.object({
          name: z.string(),
          href: z.string(),
        })
      )
      .optional(),
  }),
});

const collections = {
  pages,
  previews,
};

export { collections };
