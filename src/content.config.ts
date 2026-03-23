import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { previewLoader, previewMetaSchema } from '@/lib/preview';

const previews = defineCollection({
  loader: previewLoader({
    pattern: '**/*.preview.tsx',
    base: './src/foundations',
    generateId: ({ entry }) => {
      const filename = entry.split('/').pop() || '';
      return filename.replace('.preview.tsx', '');
    },
  }),
  schema: z.object({
    file: z.string(),
    meta: previewMetaSchema,
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: '**/page.mdx',
    base: './src/foundations',
    generateId: ({ entry }) => entry.replace('/page.mdx', ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    preview: reference('previews').optional(),
    files: z.array(z.string()).optional(),
    dependencies: z
      .array(
        z.object({
          name: z.string(),
          href: z.string(),
        })
      )
      .optional(),
    folder: z.string().optional(),
    meta: z
      .object({
        order: z.number().optional(),
      })
      .optional(),
  }),
});

const collections = {
  pages,
  previews,
};

export { collections };
