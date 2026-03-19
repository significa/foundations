import { site } from 'astro:config/server';
import { getCollection, getEntry } from 'astro:content';
import path from 'node:path';
import type { APIRoute } from 'astro';
import z from 'zod';
import {
  code,
  createComponentResolver,
  defineComponent,
  link,
  markdown,
} from '@/lib/utils/markdown';

const resolveComponents = createComponentResolver([
  defineComponent({
    name: 'Preview',
    props: z.object({
      slug: z.string(),
    }),
    parser: async ({ slug }) => {
      const preview = await getEntry('previews', slug);

      if (!preview) {
        return `**Error:** Preview with slug "${slug}" not found.`;
      }

      return code(path.join(process.cwd(), preview.data.file));
    },
  }),
  defineComponent({
    name: 'PropsTable',
    props: z.object({
      definition: z.record(
        z.string(),
        z.object({
          default: z.union([z.string(), z.boolean(), z.number()]).optional(),
          required: z.boolean().optional(),
          type: z.union([z.string(), z.array(z.string())]),
          description: z.string().optional(),
        })
      ),
    }),
    parser: async ({ definition }) => {
      return markdown(
        '| Prop | Type | Default | Required | Description |',
        '| ---- | ---- | ------- | -------- | ----------- |',
        ...Object.entries(definition).map(([propName, propDef]) => {
          const type = Array.isArray(propDef.type)
            ? propDef.type.join(' \\| ')
            : propDef.type;

          const defaultValue = propDef.default || '-';
          const required = propDef.required ? 'Yes' : 'No';
          const description = propDef.description || '-';

          return `| ${propName} | ${type} | ${defaultValue} | ${required} | ${description} |`;
        })
      );
    },
  }),
]);

export const GET = (async ({ params }) => {
  const page = await getEntry('pages', params.path || '');

  if (!site) {
    throw new Error('Site URL is not defined');
  }

  if (!page) {
    return new Response('Not found', { status: 404 });
  }

  const dependencies = page.data.dependencies?.map(
    ({ name, href }) => `- ${link(name, href)}`
  );

  const files = page.data.files
    ? await Promise.all(page.data.files.map(code))
    : undefined;

  const content = markdown(
    `# ${page.data.title}`,
    '',
    page.data.description,
    ...(dependencies ? ['', '## Dependencies', '', ...dependencies] : []),
    ...(files ? ['', '## Source Code', '', ...files] : []),
    '',
    '',
    await resolveComponents(page.body || '')
  );

  return new Response(content);
}) satisfies APIRoute;

export async function getStaticPaths() {
  const pages = await getCollection('pages');

  return pages.map((page) => ({
    params: { path: page.id },
  }));
}
