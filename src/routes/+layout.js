import { loadMessages } from '$lib/i18n';

export const prerender = true;
export const trailingSlash = 'always';

export const load = async ({ params }) => {
  const lang = params.lang ?? 'en';
  return { lang, common: await loadMessages(lang, 'common') };
};
