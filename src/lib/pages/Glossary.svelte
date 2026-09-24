<script>
  import { href, rich } from '$lib/i18n';

  let { m, lang } = $props();

  // The page that explains each term, in the same order as the terms in the messages.
  const LINKS = [
    ['/training/#idea', '/crimes/#nerve', '/training/#idea', '/training/#idea', '/training/#builds', '/paths/#guides', '/training/formula/', null],
    ['/medical/', '/training/#items', '/training/#items', '/training/#items', '/start/#routine', '/medical/', '/medical/', null],
    ['/travel/#pi', '/start/#week', '/start/#selling', '/start/#selling', '/start/#safe', '/start/#routine', '/paths/#guides', '/travel/', '/training/#sell-losses'],
    ['/paths/#guides', '/paths/#guides', '/paths/#guides', '/paths/#guides', '/start/#week'],
    ['/start/#safe', '/medical/', '/medical/', null, '/scripts/', '/paths/#faction', '/start/#faction', '/start/#faction', '/start/#faction', '/crimes/#oc', '/crimes/#nerve'],
    ['/travel/#yata', '/scripts/', '/scripts/', '/scripts/']
  ];
</script>

<svelte:head><title>{m.title}</title></svelte:head>

<header class="hero"><div class="wrap">
  <span class="eyebrow">{m.eyebrow}</span>
  <h1>{@html m.h1}</h1>
  <p class="lede">{m.lede}</p>
  <p style="margin-top:.6rem"><a href={href('/start/', lang)}>{m.back}</a></p>
</div></header>

{#each m.groups as group, g}
  <section><div class="wrap">
    <h2>{group.title}</h2>
    <dl class="gl">
      {#each group.terms as [term, meaning], i}
        {@const link = LINKS[g][i]}
        <div class="row">
          <dt>{term}</dt>
          <dd>{meaning}{#if link} <a href={href(link, lang)}>{m.more}</a>{/if}</dd>
        </div>
      {/each}
    </dl>
  </div></section>
{/each}

<footer><div class="wrap">{@html rich(m.footer, lang)}</div></footer>

<style>
  .gl{margin:1rem 0 0;display:grid;gap:0;border:1px solid var(--border);border-radius:3px;background:var(--surface)}
  .row{display:grid;grid-template-columns:11rem 1fr;gap:1rem;padding:.7rem 1rem;border-bottom:1px solid var(--border)}
  .row:last-child{border-bottom:0}
  dt{font-family:"IBM Plex Mono",monospace;font-weight:600;color:var(--ink)}
  dd{margin:0;color:var(--muted)}
  dd a{white-space:nowrap}
  @media(max-width:560px){.row{grid-template-columns:1fr;gap:.2rem}}
</style>
