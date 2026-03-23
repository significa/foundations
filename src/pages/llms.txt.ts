import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { link, markdown } from '@/lib/utils/markdown';
import { getNavigationItems } from '@/lib/utils/navigation';

export const GET: APIRoute = async () => {
  const pages = await getCollection('pages');
  const items = await getNavigationItems(pages);

  return new Response(
    markdown(
      '# Significa Foundations',
      '',
      '> Foundations is an opinionated collection of components, patterns, and guidelines for building modern digital products.',
      '',
      'Foundations is a React 19 component library built with TypeScript and Tailwind CSS v4. It provides production-ready UI primitives, reusable hooks, utility functions, and higher-level components — designed to be copied into your project and adapted to your needs.',
      '',
      'Each page listed includes full documentation and source code.',
      '',
      markdown(
        ...items.map((item) => {
          return markdown(
            `## ${item.title}`,
            '',
            markdown(
              ...item.children.map((child) => {
                const description = pages.find((page) => page.id === child.id)
                  ?.data.description;

                return `- ${link(child.title, `${child.href}/llms.txt`)}: ${description || ''}`;
              })
            ),
            ''
          );
        }),
        ''
      )
    )
  );
};
