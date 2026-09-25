import { error } from '@sveltejs/kit';
import { base } from '$app/paths';
import { TEMPLATES, defaults } from '$lib/templates.js';
import { SITE_ORIGIN } from '$lib/meta.js';

// Plain-text copies of each template with [placeholders], for people who just want the HTML.
export const prerender = true;
export const trailingSlash = 'never';
export const entries = () => TEMPLATES.map((t) => ({ id: t.id }));

export function GET({ params }) {
  const tpl = TEMPLATES.find((t) => t.id === params.id);
  if (!tpl) error(404);
  const html = tpl.render(defaults(tpl), { site: SITE_ORIGIN + base })
    .replace(/(<\/(p|li|ul|ol)>)/g, '$1\n').replace(/(<ul>|<ol>)/g, '$1\n');
  return new Response(`<!-- ${tpl.name}: ${tpl.blurb} Replace anything in [brackets]. -->\n${html}`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
