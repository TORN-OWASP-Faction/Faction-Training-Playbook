import { pageUrl, sitemapPaths } from '$lib/sitemap.js';

export const prerender = true;
export const trailingSlash = 'never';

// Plain text sitemap: one full URL per line, nothing else.
export function GET() {
  const body = sitemapPaths().map(([loc]) => pageUrl(loc)).join('\n') + '\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
