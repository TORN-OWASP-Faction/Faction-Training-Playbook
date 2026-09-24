import { base } from '$app/paths';

// code: URL segment and folder name. html: the lang attribute. gt: Google Translate's code.
export const LOCALES = [
  { code: 'en', name: 'English', html: 'en', gt: 'en' },
  { code: 'es', name: 'Español', html: 'es', gt: 'es' },
  { code: 'pt-br', name: 'Português (Brasil)', html: 'pt-BR', gt: 'pt' },
  { code: 'fr', name: 'Français', html: 'fr', gt: 'fr' },
  { code: 'de', name: 'Deutsch', html: 'de', gt: 'de' },
  { code: 'it', name: 'Italiano', html: 'it', gt: 'it' },
  { code: 'nl', name: 'Nederlands', html: 'nl', gt: 'nl' },
  { code: 'pl', name: 'Polski', html: 'pl', gt: 'pl' },
  { code: 'ro', name: 'Română', html: 'ro', gt: 'ro' },
  { code: 'ru', name: 'Русский', html: 'ru', gt: 'ru' },
  { code: 'uk', name: 'Українська', html: 'uk', gt: 'uk' },
  { code: 'tr', name: 'Türkçe', html: 'tr', gt: 'tr' },
  { code: 'sv', name: 'Svenska', html: 'sv', gt: 'sv' },
  { code: 'ar', name: 'العربية', html: 'ar', gt: 'ar', rtl: true },
  { code: 'hi', name: 'हिन्दी', html: 'hi', gt: 'hi' },
  { code: 'id', name: 'Bahasa Indonesia', html: 'id', gt: 'id' },
  { code: 'fil', name: 'Filipino', html: 'fil', gt: 'tl' },
  { code: 'vi', name: 'Tiếng Việt', html: 'vi', gt: 'vi' },
  { code: 'zh-cn', name: '简体中文', html: 'zh-CN', gt: 'zh-CN' },
  { code: 'ja', name: '日本語', html: 'ja', gt: 'ja' }
];

export const localeOf = (code) => LOCALES.find((l) => l.code === code) ?? LOCALES[0];
export const isLocale = (code) => LOCALES.some((l) => l.code === code);

// Pages that exist in every language. Everything else is English only.
const TRANSLATED = ['/', '/start/', '/glossary/'];

// "/es/start/#week" -> { lang: 'es', path: '/start/#week' }. Expects a path without the base.
export function splitLang(path) {
  const seg = path.split('/')[1];
  if (seg !== 'en' && isLocale(seg)) return { lang: seg, path: path.slice(seg.length + 1) || '/' };
  return { lang: 'en', path };
}

export const isTranslated = (path) => TRANSLATED.includes(path.split('#')[0]);

// Site path for a page in a language, without the base.
export function localize(path, lang) {
  if (lang === 'en' || !isTranslated(path)) return path;
  return `/${lang}${path}`;
}

export const href = (path, lang) => base + localize(path, lang);

// Message strings may hold simple markup. Links are written as href="/travel/" and pick up
// the base path and the reader's language here. {name} placeholders are filled from vars.
export function rich(str, lang, vars = {}) {
  return str
    .replace(/href="(\/[^"]*)"/g, (_, p) => `href="${href(p, lang)}"`)
    .replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

const files = import.meta.glob('./*/*.json', { import: 'default' });

// Missing strings fall back to English, so a half-done translation still renders.
function withFallback(en, local) {
  if (Array.isArray(en)) return en.map((v, i) => withFallback(v, local?.[i]));
  if (en && typeof en === 'object') {
    return Object.fromEntries(Object.entries(en).map(([k, v]) => [k, withFallback(v, local?.[k])]));
  }
  return typeof local === typeof en ? local : en;
}

export async function loadMessages(lang, ns) {
  const en = await files[`./en/${ns}.json`]();
  const load = files[`./${lang}/${ns}.json`];
  if (lang === 'en' || !load) return en;
  return withFallback(en, await load());
}

export function translateUrl(lang, url) {
  const gt = localeOf(lang).gt;
  return `https://translate.google.com/translate?sl=en&tl=${gt}&u=${encodeURIComponent(url)}`;
}

// Shared load and prerender entries for pages that exist in every language.
export const pageLoad = (ns) => async ({ params }) => ({ m: await loadMessages(params.lang ?? 'en', ns) });
export const langEntries = () => LOCALES.filter((l) => l.code !== 'en').map((l) => ({ lang: l.code }));
