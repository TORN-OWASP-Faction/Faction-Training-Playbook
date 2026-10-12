import { LOCALES, localize, isTranslated } from '$lib/i18n';
import { pageUrl, sitemapPaths } from '$lib/sitemap.js';

export const prerender = true;
export const trailingSlash = 'never';

// Translated pages list every language version, so search engines show each reader their own.
function alternates(path) {
  if (!isTranslated(path)) return '';
  const links = LOCALES.map((l) => `<xhtml:link rel="alternate" hreflang="${l.html}" href="${pageUrl(localize(path, l.code))}"/>`);
  links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(path)}"/>`);
  return links.join('');
}

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapPaths().map(([loc, path]) => `<url><loc>${pageUrl(loc)}</loc>${alternates(path)}</url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
