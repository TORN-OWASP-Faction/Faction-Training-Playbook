<script>
  import { base } from '$app/paths';
  import Item from '$lib/Item.svelte';

  // items: [{ name, label?, enhancer?, where?, text }]. `name` is the Torn item name used for the picture.
  let { title, lede = '', eyebrow = 'Crimes 2.0 · guide', kitTitle = 'What you need', items = [], note = '' } = $props();
</script>

<header class="hero"><div class="wrap" class:hero-split={items.length}>
  <div>
    <span class="eyebrow">{eyebrow}</span>
    <h1>{title}</h1>
    {#if lede}<p class="lede">{lede}</p>{/if}
    <p style="margin-top:.6rem"><a href="{base}/crimes/">← Back to Crimes</a></p>
  </div>
  {#if items.length}
    <aside class="kit" aria-label="{title} key items">
      <h2 class="kit-h">{kitTitle}</h2>
      <ul>
        {#each items as it}
          <li>
            <Item name={it.name} icon />
            <div>
              <b>{it.label ?? it.name}</b>
              {#if it.enhancer}<span class="tag enh">enhancer</span>{/if}
              {#if it.where}<span class="where">{it.where}</span>{/if}
              <p>{it.text}</p>
            </div>
          </li>
        {/each}
      </ul>
      {#if note}<p class="kit-note">{note}</p>{/if}
    </aside>
  {/if}
</div></header>

<style>
  .hero-split{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,22rem);gap:2.5rem;align-items:center}
  @media(max-width:900px){.hero-split{grid-template-columns:minmax(0,1fr);gap:1.5rem}}
  .kit{background:var(--surface);border:1px solid var(--border);border-left:3px solid var(--c-fixer);padding:1rem 1.1rem}
  .kit-h{font-size:1rem;margin:0 0 .6rem;letter-spacing:.04em;text-transform:uppercase;color:var(--c-fixer)}
  .kit ul{list-style:none;margin:0;padding:0;display:grid;gap:.75rem}
  .kit li{display:grid;grid-template-columns:50px minmax(0,1fr);gap:.7rem;align-items:start}
  .kit li p{margin:.15em 0 0;color:var(--muted);font-size:.88rem;line-height:1.4}
  .kit .where{font-size:.75rem;color:var(--muted);white-space:nowrap}
  .kit .enh{color:var(--c-fixer);background:var(--fixer-soft)}
  .kit-note{margin:.8rem 0 0;padding-top:.7rem;border-top:1px solid var(--border);font-size:.82rem;color:var(--muted);line-height:1.4}
</style>
