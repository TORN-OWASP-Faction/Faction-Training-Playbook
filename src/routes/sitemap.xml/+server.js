import { base } from '$app/paths';
import { LOCALES, localize, isTranslated } from '$lib/i18n';
import { META, SITE_ORIGIN } from '$lib/meta.js';

export const prerender = true;
export const trailingSlash = 'never';

const url = (path) => SITE_ORIGIN + base + path;

// Translated pages list every language version, so search engines show each reader their own.
function alternates(path) {
  if (!isTranslated(path)) return '';
  const links = LOCALES.map((l) => `<xhtml:link rel="alternate" hreflang="${l.html}" href="${url(localize(path, l.code))}"/>`);
  links.push(`<xhtml:link rel="alternate" hreflang="x-default" href="${url(path)}"/>`);
  return links.join('');
}

export function GET() {
  const paths = Object.keys(META).flatMap((path) =>
    isTranslated(path) ? LOCALES.map((l) => [localize(path, l.code), path]) : [[path, path]]
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(([loc, path]) => `<url><loc>${url(loc)}</loc>${alternates(path)}</url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
