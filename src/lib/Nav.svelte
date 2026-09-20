<script>
  import { base } from '$app/paths';

  let open = $state(null); // 'guide' | 'crimes' | null

  const guide = [
    ['The idea', '#idea'], ['Level ≤15', '#new'], ['Make money', '#money'],
    ['By income', '#brackets'], ['Builds', '#builds'], ['Schedules', '#schedule'],
    ['Items', '#items'], ['Education', '#edu'], ['Charts', '#ref'],
    ['Training math ↗', 'training/formula/'], ['Field medicine ↗', 'medical/']
  ].map(([l, h]) => [l, `${base}/${h}`]);

  const crimes = [
    ['Overview', `${base}/crimes/`], ['How crimes work', `${base}/crimes/#how`],
    ['Build your nerve', `${base}/crimes/#nerve`], ['OC & faction', `${base}/crimes/#oc`],
    ['— Data tables —', ''],
    ['Burglary', `${base}/crimes/burglary/`], ['Shoplifting', `${base}/crimes/shoplifting/`],
    ['Cracking', `${base}/crimes/cracking/`], ['Forgery', `${base}/crimes/forgery/`]
  ];

  const toggle = (id) => (open = open === id ? null : id);
  const close = () => (open = null);
  const onDocClick = (e) => { if (!e.target.closest('.nav-inner')) close(); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
</script>

<svelte:window onclick={onDocClick} onkeydown={onKey} />

<nav class="toc"><div class="wrap nav-inner">
  <div class="nd" onmouseenter={() => (open = 'guide')} onmouseleave={close} role="none">
    <button class="ndbtn" aria-haspopup="true" aria-expanded={open === 'guide'} onclick={() => toggle('guide')}>Guide<span class="ar">▾</span></button>
    {#if open === 'guide'}
      <div class="menu">
        {#each guide as [label, href]}<a href={href} onclick={close}>{label}</a>{/each}
      </div>
    {/if}
  </div>

  <div class="nd" onmouseenter={() => (open = 'crimes')} onmouseleave={close} role="none">
    <button class="ndbtn" aria-haspopup="true" aria-expanded={open === 'crimes'} onclick={() => toggle('crimes')}>Crimes<span class="ar">▾</span></button>
    {#if open === 'crimes'}
      <div class="menu">
        {#each crimes as [label, href]}
          {#if label.startsWith('—')}<div class="mdiv">{label.replace(/—/g, '').trim()}</div>
          {:else}<a href={href} onclick={close}>{label}</a>{/if}
        {/each}
      </div>
    {/if}
  </div>

  <a class="top" href="{base}/planner/">Planner</a>
  <a class="top" href="{base}/scripts/">Scripts</a>
  <a class="top" href="{base}/credits/">Credits</a>
  <span class="toc-spacer"></span>
  <span class="brandmark">TORN</span>
</div></nav>

<style>
  nav.toc :global(.wrap){overflow:visible}
  .nd{position:relative;display:inline-flex}
  .ndbtn{font:inherit;cursor:pointer;color:var(--muted);font-size:.95rem;font-weight:500;
    background:none;border:0;padding:.45rem .8rem;border-radius:2px;white-space:nowrap;display:inline-flex;align-items:center;gap:.3em}
  .ndbtn:hover,.ndbtn[aria-expanded="true"]{color:var(--ink);background:var(--raised)}
  .ndbtn .ar{font-size:.7em;opacity:.7}
  .menu{position:absolute;top:100%;left:0;min-width:12rem;display:flex;flex-direction:column;
    background:var(--surface);border:1px solid var(--border);border-radius:3px;box-shadow:var(--shadow);
    padding:.3rem;z-index:40}
  .menu a{color:var(--muted);text-decoration:none;font-size:.9rem;padding:.4rem .6rem;border-radius:2px;white-space:nowrap}
  .menu a:hover{color:var(--ink);background:var(--raised)}
  .mdiv{font-family:"IBM Plex Mono",monospace;font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;
    color:var(--faint);padding:.5rem .6rem .25rem;border-top:1px solid var(--border);margin-top:.2rem}
  .top{color:var(--muted);text-decoration:none;font-size:.95rem;white-space:nowrap;padding:.45rem .8rem;border-radius:2px;font-weight:500}
  .top:hover{color:var(--ink);background:var(--raised)}
</style>
