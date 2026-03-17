import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(`User-agent: *\nAllow: /\nDisallow: /preview/\n`);
};
