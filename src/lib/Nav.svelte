<script>
  import { page } from '$app/state';
  import { afterNavigate } from '$app/navigation';
  import Icon from '$lib/Icon.svelte';
  import { LOCALES, href, localeOf } from '$lib/i18n';

  let { m, lang, onpick } = $props();

  let open = $state(null); // which group's links are showing
  let menuOpen = $state(false); // the whole menu, on narrow screens

  // [message key or plain game name, path]. A missing path is a divider.
  const GROUPS = [
    { id: 'train', links: [
      ['guide', '/training/'], ['idea', '/training/#idea'], ['new', '/training/#new'], ['builds', '/training/#builds'],
      ['schedule', '/training/#schedule'], ['items', '/training/#items'], ['edu', '/training/#edu'],
      ['planner', '/planner/'], ['math', '/training/formula/']
    ] },
    { id: 'money', links: [
      ['makeMoney', '/training/#money'], ['travel', '/travel/'], ['paths', '/paths/'],
      ['faction', '/paths/#faction'], ['safe', '/start/#safe']
    ] },
    { id: 'crimes', links: [
      ['overview', '/crimes/'], ['how', '/crimes/#how'], ['nerve', '/crimes/#nerve'], ['oc', '/crimes/#oc'],
      ['ocScenarios', '/crimes/oc-scenarios/'], ['dataTables'],
      ['Burglary', '/crimes/burglary/'], ['Shoplifting', '/crimes/shoplifting/'],
      ['Cracking', '/crimes/cracking/'], ['Forgery', '/crimes/forgery/']
    ] },
    { id: 'fight', links: [['loadout', '/loadout/'], ['medical', '/medical/'], ['factionBasics', '/start/#faction'], ['halloween', '/halloween/']] },
    { id: 'more', links: [['scripts', '/scripts/'], ['glossary', '/glossary/'], ['credits', '/credits/']] }
  ];

  const label = (key) => m.nav.links[key] ?? key;
  const here = (link) => !link.includes('#') && page.url.pathname === href(link, lang);
  const groupHere = (g) => g.links.some(([, p]) => p && page.url.pathname === href(p.split('#')[0], lang));

  afterNavigate(() => { open = null; menuOpen = false; });

  function onKey(e) {
    if (e.key !== 'Escape' || !(open || menuOpen)) return;
    const btn = document.getElementById(open ? `nd-${open}` : 'menubtn');
    open = null;
    if (!btn?.offsetParent) menuOpen = false;
    btn?.focus();
  }
  const onDocClick = (e) => { if (!e.target.closest('nav.toc')) { open = null; menuOpen = false; } };
  const onFocusOut = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) open = null; };
</script>

<svelte:window onclick={onDocClick} onkeydown={onKey} />

<nav class="toc" aria-label={m.nav.label} lang={localeOf(lang).html} dir={localeOf(lang).rtl ? 'rtl' : 'ltr'}><div class="wrap nav-inner">
  <a class="brand" href={href('/', lang)} aria-label={m.homeLabel}><span class="dot" aria-hidden="true"></span>Playbook</a>

  <button id="menubtn" class="menubtn" aria-expanded={menuOpen} aria-controls="navlist" onclick={() => (menuOpen = !menuOpen)}>
    <Icon name={menuOpen ? 'x' : 'menu'} size={18} /><span>{m.menu}</span>
  </button>

  <ul id="navlist" class="navlist" class:open={menuOpen}>
    <li><a class="top start" href={href('/start/', lang)} aria-current={here('/start/') ? 'page' : undefined}>{m.nav.start}</a></li>
    {#each GROUPS as g}
      <li class="nd" onfocusout={onFocusOut}>
        <button id="nd-{g.id}" class="ndbtn" class:here={groupHere(g)} aria-expanded={open === g.id} aria-controls="menu-{g.id}"
          onclick={() => (open = open === g.id ? null : g.id)}>
          {m.nav.groups[g.id]}<span class="ar" aria-hidden="true">▾</span>
        </button>
        <ul id="menu-{g.id}" class="menu" hidden={open !== g.id}>
          {#each g.links as [key, path]}
            {#if path}
              <li><a href={href(path, lang)} aria-current={here(path) ? 'page' : undefined}>{label(key)}</a></li>
            {:else}
              <li class="mdiv" aria-hidden="true">{label(key)}</li>
            {/if}
          {/each}
        </ul>
      </li>
    {/each}
  </ul>

  <label class="langpick">
    <Icon name="globe" size={16} />
    <span class="sr">{m.language}</span>
    <select value={lang} onchange={(e) => onpick(e.currentTarget.value)}>
      {#each LOCALES as l}<option value={l.code} lang={l.html}>{l.name}</option>{/each}
    </select>
  </label>
</div></nav>

<style>
  nav.toc :global(.wrap){overflow:visible}
  .nav-inner{gap:.3rem}
  .brand{display:inline-flex;align-items:center;gap:.45rem;font-family:"Oswald","Arial Narrow",sans-serif;font-weight:600;
    font-size:1.1rem;letter-spacing:.06em;text-transform:uppercase;color:var(--ink)!important;margin-inline-end:.4rem}
  .brand .dot{width:.55rem;height:.55rem;border-radius:50%;background:var(--amber)}
  .navlist{display:flex;align-items:center;gap:.2rem;list-style:none;margin:0;padding:0;flex:1}
  .nd{position:relative}
  .ndbtn{font:inherit;cursor:pointer;color:var(--muted);font-size:.95rem;font-weight:500;
    background:none;border:0;padding:.45rem .8rem;border-radius:2px;white-space:nowrap;display:inline-flex;align-items:center;gap:.3em}
  .ndbtn:hover,.ndbtn[aria-expanded="true"]{color:var(--ink);background:var(--raised)}
  .ndbtn.here{color:var(--ink);box-shadow:inset 0 -2px 0 var(--amber)}
  .ndbtn .ar{font-size:.7em;opacity:.7}
  .menu{position:absolute;top:100%;inset-inline-start:0;min-width:13rem;list-style:none;margin:0;
    background:var(--surface);border:1px solid var(--border);border-radius:3px;box-shadow:var(--shadow);padding:.3rem;z-index:40}
  .menu a{display:block;color:var(--muted);font-size:.92rem;padding:.45rem .6rem;border-radius:2px}
  .menu a:hover{color:var(--ink);background:var(--raised)}
  .menu a[aria-current="page"],.top[aria-current="page"]{color:var(--ink);background:var(--raised)}
  .mdiv{font-family:"IBM Plex Mono",monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;
    color:var(--faint);padding:.55rem .6rem .25rem;border-top:1px solid var(--border);margin-top:.2rem}
  .top{display:inline-block;color:var(--muted);font-size:.95rem;white-space:nowrap;padding:.45rem .8rem;border-radius:2px;font-weight:500}
  .top:hover{color:var(--ink);background:var(--raised)}
  .top.start{color:var(--amber)}
  .langpick{display:inline-flex;align-items:center;gap:.35rem;color:var(--muted);margin-inline-start:auto}
  .langpick select{font:inherit;font-size:.85rem;color:var(--ink);background:var(--surface);border:1px solid var(--border);
    border-radius:4px;padding:.3rem .4rem;max-width:11rem;cursor:pointer}
  .langpick select:hover{border-color:var(--amber)}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .menubtn{display:none;font:inherit;font-size:.9rem;color:var(--ink);background:var(--surface);border:1px solid var(--border);
    border-radius:4px;padding:.35rem .6rem;align-items:center;gap:.4rem;cursor:pointer;order:3}

  @media(max-width:960px){
    .nav-inner{flex-wrap:wrap;position:relative}
    .menubtn{display:inline-flex}
    .langpick{order:2}
    .langpick select{max-width:8.5rem}
    .navlist{display:none;order:4;flex:1 0 100%;flex-direction:column;align-items:stretch;gap:0;
      max-height:calc(100dvh - 4rem);overflow-y:auto;padding:.4rem 0 .6rem;border-top:1px solid var(--border);margin-top:.5rem}
    .navlist.open{display:flex}
    .top,.ndbtn{display:flex;width:100%;padding:.7rem .4rem;font-size:1rem}
    .ndbtn{justify-content:space-between}
    .ndbtn.here{box-shadow:none}
    .menu{position:static;box-shadow:none;border:0;border-inline-start:2px solid var(--border);border-radius:0;
      margin:0 0 .4rem;margin-inline-start:.4rem;padding:0;padding-inline-start:.4rem;background:none}
    .menu a{padding:.6rem .6rem}
  }
  @media(max-width:480px){
    .brand{padding-inline:.2rem;margin-inline-end:0}
    .langpick select{max-width:6rem}
  }
</style>
