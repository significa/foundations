import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { SITE_ORIGIN } from '@/lib/constants';

export const GET: APIRoute = async ({ site }) => {
  const pages = await getCollection('pages');

  const baseUrl = site ? site.href.replace(/\/$/, '') : SITE_ORIGIN;

  const entries = pages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}/${page.id}</loc>
  </url>`;
    })
    .join('');

  const raw = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(raw, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
