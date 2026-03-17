import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const pages = await getCollection('pages');

  const baseUrl = site
    ? site.href.replace(/\/$/, '')
    : 'https://foundations.significa.co';

  const urls = pages
    .map((page) => {
      return `
  <url>
    <loc>${baseUrl}/${page.id}</loc>
  </url>`;
    })
    .join('');

  const raw = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(raw, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};
