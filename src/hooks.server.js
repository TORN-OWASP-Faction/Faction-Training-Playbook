import { base } from '$app/paths';
import { splitLang, localeOf } from '$lib/i18n';

// Stamp lang and dir on <html> while prerendering, so each language's page ships correct.
export async function handle({ event, resolve }) {
  const loc = localeOf(splitLang(event.url.pathname.slice(base.length)).lang);
  return resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', loc.html).replace('%dir%', loc.rtl ? 'rtl' : 'ltr')
  });
}
