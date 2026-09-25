<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { goto, afterNavigate } from '$app/navigation';
  import { base } from '$app/paths';
  import Nav from '$lib/Nav.svelte';
  import { LOCALES, localeOf, splitLang, isTranslated, href, localize, loadMessages, translateUrl } from '$lib/i18n';
  import { pref, loadPref, savePref } from '$lib/i18n/pref.svelte.js';
  import { META, SITE_ORIGIN, SITE_NAME, GOATCOUNTER } from '$lib/meta.js';

  let { data, children } = $props();

  const REPO = 'https://github.com/TORN-OWASP-Faction/Faction-Training-Playbook';

  const path = $derived(splitLang(page.url.pathname.slice(base.length)).path);
  const translated = $derived(isTranslated(path));
  // The menu follows the page on translated pages, and the reader's choice on English-only ones.
  const uiLang = $derived(translated || !pref.lang ? data.lang : pref.lang);
  const uiLoc = $derived(localeOf(uiLang));

  let loaded = $state(null); // { lang, m }: menu strings for a language this page didn't ship with
  const m = $derived(uiLang === data.lang ? data.common : loaded?.lang === uiLang ? loaded.m : data.common);
  $effect(() => {
    const want = uiLang;
    if (want !== data.lang) loadMessages(want, 'common').then((msgs) => (loaded = { lang: want, m: msgs }));
  });

  $effect(() => {
    const loc = localeOf(data.lang);
    document.documentElement.lang = loc.html;
    document.documentElement.dir = loc.rtl ? 'rtl' : 'ltr';
  });

  // Someone who picked a language lands on its version of a translated page.
  $effect(() => {
    if (translated && data.lang === 'en' && pref.lang && pref.lang !== 'en') {
      goto(href(path + page.url.hash, pref.lang), { replaceState: true });
    }
  });

  let suggestion = $state(null); // { lang, m } offered from the browser's language

  // Visitor counts. The script counts the first page load; in-site navigation is counted here.
  onMount(() => {
    if (!GOATCOUNTER) return;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://gc.zgo.at/count.js';
    s.dataset.goatcounter = `https://${GOATCOUNTER}.goatcounter.com/count`;
    document.head.appendChild(s);
  });
  afterNavigate(({ type }) => {
    if (GOATCOUNTER && type !== 'enter') window.goatcounter?.count?.({ path: location.pathname });
  });

  onMount(async () => {
    loadPref();
    if (data.lang !== 'en') return savePref(data.lang);
    if (pref.lang) return;
    const lang = browserLang();
    if (lang && lang !== 'en') suggestion = { lang, m: await loadMessages(lang, 'common') };
  });

  function browserLang() {
    for (const tag of navigator.languages ?? []) {
      const t = tag.toLowerCase();
      const main = t.split('-')[0];
      if (main === 'en') return 'en';
      if (main === 'pt') return 'pt-br';
      if (main === 'zh') return t === 'zh-tw' || t === 'zh-hk' || t.includes('hant') ? null : 'zh-cn';
      if (main === 'tl') return 'fil';
      if (LOCALES.some((l) => l.code === main)) return main;
    }
    return null;
  }

  function pick(lang) {
    savePref(lang);
    suggestion = null;
    if (translated) goto(href(path + page.url.hash, lang));
  }

  const fill = (str, lang) => str.replace('{language}', localeOf(lang).name);

  // Link-preview tags. Translated pages take their title and intro from their own messages.
  const strip = (html) => html.replace(/<[^>]+>/g, '');
  const meta = $derived.by(() => {
    const [title, description, image] = META[path.split('#')[0]] ?? META['/'];
    const m = page.data?.m;
    const local = translated && m
      ? { title: m.title, description: strip(m.lede ?? m.hero?.lede ?? description) }
      : { title: path === '/' ? SITE_NAME : `${title} · ${SITE_NAME}`, description };
    return { ...local, image: `${SITE_ORIGIN}${base}/og/${image}.jpg`, url: SITE_ORIGIN + page.url.pathname };
  });
</script>

<svelte:head>
  <title>{meta.title}</title>
  <meta name="description" content={meta.description} />
  <meta name="theme-color" content="#C39A6B" />
  <link rel="canonical" href={meta.url} />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={meta.title} />
  <meta property="og:description" content={meta.description} />
  <meta property="og:url" content={meta.url} />
  <meta property="og:image" content={meta.image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={meta.title} />
  <meta property="og:locale" content={localeOf(data.lang).html.replace('-', '_')} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={meta.title} />
  <meta name="twitter:description" content={meta.description} />
  <meta name="twitter:image" content={meta.image} />
  {#if translated}
    {#each LOCALES as l}<link rel="alternate" hreflang={l.html} href={SITE_ORIGIN + base + localize(path, l.code)} />{/each}
    <link rel="alternate" hreflang="x-default" href={SITE_ORIGIN + base + path} />
  {/if}
  {#if path === '/'}
    {@html `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_ORIGIN + base + '/', inLanguage: localeOf(data.lang).html, description: meta.description })}</script>`}
  {/if}
</svelte:head>

<a class="skip" href="#main">{m.skip}</a>

<Nav {m} lang={uiLang} onpick={pick} />

{#if suggestion}
  {@const loc = localeOf(suggestion.lang)}
  <div class="bar" lang={loc.html} dir={loc.rtl ? 'rtl' : 'ltr'}><div class="wrap">
    <span>{fill(suggestion.m.suggest.text, suggestion.lang)}</span>
    <button class="btn-s primary" onclick={() => pick(suggestion.lang)}>{fill(suggestion.m.suggest.yes, suggestion.lang)}</button>
    <button class="btn-s" onclick={() => pick('en')}>{suggestion.m.suggest.no}</button>
  </div></div>
{/if}

{#if uiLang !== 'en' && !translated}
  <div class="bar" lang={uiLoc.html} dir={uiLoc.rtl ? 'rtl' : 'ltr'}><div class="wrap">
    <span>{m.notice.englishOnly}</span>
    <a href={translateUrl(uiLang, page.url.href)} target="_blank" rel="noopener">{m.notice.translate} ↗</a>
    <span class="dim">{m.notice.browserTip}</span>
  </div></div>
{:else if data.lang !== 'en'}
  <div class="bar"><div class="wrap">
    <span>{m.notice.machine}</span>
    <a href={REPO} target="_blank" rel="noopener">{m.notice.improve} ↗</a>
  </div></div>
{/if}

<main id="main" tabindex="-1">
  {@render children()}
</main>

<div class="repo" lang={uiLoc.html} dir={uiLoc.rtl ? 'rtl' : 'ltr'}><div class="wrap">
  <a class="gh" href={REPO} target="_blank" rel="noopener">
    <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>
    <span class="name" dir="ltr">TORN-OWASP-Faction / <b>Faction-Training-Playbook</b></span>
    <span class="cta">{m.repo.cta}</span>
  </a>
  <span class="hint">{m.repo.hint}</span>
  {#if GOATCOUNTER}<span class="hint">We count page visits with GoatCounter: no cookies, no personal data.</span>{/if}
</div></div>

<style>
  .skip{position:absolute;inset-inline-start:.8rem;top:-3rem;z-index:50;background:var(--amber);color:#111;font-weight:600;
    padding:.5rem .9rem;border-radius:4px;text-decoration:none}
  .skip:focus{top:.6rem}
  main:focus{outline:none}
  .bar{background:var(--raised);border-bottom:1px solid var(--border);font-size:.88rem;color:var(--ink)}
  .bar .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem 1rem;padding-top:.55rem;padding-bottom:.55rem}
  .bar .dim{color:var(--muted)}
  .btn-s{font:inherit;font-size:.85rem;cursor:pointer;border:1px solid var(--border);background:var(--surface);color:var(--ink);
    border-radius:4px;padding:.3rem .7rem}
  .btn-s.primary{background:var(--amber);border-color:var(--amber);color:#111;font-weight:600}
  .repo{padding:0 0 2.4rem;margin-top:-1.6rem;position:relative;z-index:2}
  .repo .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1rem}
  .gh{display:inline-flex;align-items:center;gap:.6rem;padding:.55rem .8rem;border:1px solid var(--border);border-radius:6px;
    background:var(--surface);color:var(--ink);text-decoration:none;font-size:.85rem}
  .gh svg{fill:var(--ink);flex:none}
  .gh .name{color:var(--muted)}
  .gh .name b{color:var(--ink);font-weight:600}
  .gh .cta{font-family:"IBM Plex Mono",monospace;font-size:.72rem;color:var(--amber);border-inline-start:1px solid var(--border);padding-inline-start:.6rem}
  .gh:hover{border-color:var(--amber)}
  .hint{color:var(--muted);font-size:.8rem}
  @media(max-width:560px){.gh .name{display:none}}
</style>
