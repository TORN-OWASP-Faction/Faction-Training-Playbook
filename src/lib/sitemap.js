import { base } from '$app/paths';
import { LOCALES, localize, isTranslated } from '$lib/i18n';
import { META, SITE_ORIGIN } from '$lib/meta.js';

export const pageUrl = (path) => SITE_ORIGIN + base + path;

// Each entry is [the page's own path, the English path it is a version of].
// Pages marked noindex (like shared war reports, which are empty without their link) stay out.
export function sitemapPaths() {
  return Object.keys(META).filter((path) => META[path][3] !== 'noindex').flatMap((path) =>
    isTranslated(path) ? LOCALES.map((l) => [localize(path, l.code), path]) : [[path, path]]
  );
}
