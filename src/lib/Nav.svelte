<script>
  import { base } from '$app/paths';

  const guide = [
    ['The idea', '#idea'], ['Level ≤15', '#new'], ['Make money', '#money'],
    ['By income', '#brackets'], ['Builds', '#builds'], ['Schedules', '#schedule'],
    ['Items', '#items'], ['Education', '#edu'], ['Charts', '#ref']
  ];
  const crimes = [
    ['Overview', `${base}/crimes`], ['How crimes work', `${base}/crimes#how`],
    ['Build your nerve', `${base}/crimes#nerve`], ['OC & faction', `${base}/crimes#oc`],
    ['Burglary data', `${base}/crimes/burglary`]
  ];
</script>

<nav class="toc"><div class="wrap">
  <details class="nd">
    <summary>Guide</summary>
    <div class="menu">
      {#each guide as [label, href]}<a href="{base}/{href}">{label}</a>{/each}
    </div>
  </details>

  <details class="nd">
    <summary>Crimes</summary>
    <div class="menu">
      {#each crimes as [label, href]}<a href={href}>{label}</a>{/each}
    </div>
  </details>

  <a class="top" href="{base}/planner">Planner</a>
  <a class="top" href="{base}/scripts">Scripts</a>
  <a class="top" href="{base}/credits">Credits</a>
  <span class="toc-spacer"></span>
  <span class="brandmark">TORN</span>
</div></nav>

<style>
  .nd{position:relative}
  .nd>summary{list-style:none;cursor:pointer;color:var(--muted);font-size:.95rem;font-weight:500;
    padding:.45rem .8rem;border-radius:2px;white-space:nowrap;user-select:none}
  .nd>summary::-webkit-details-marker{display:none}
  .nd>summary::after{content:"▾";font-size:.7em;margin-left:.35em;opacity:.7}
  .nd>summary:hover{color:var(--ink);background:var(--raised)}
  .nd[open]>summary{color:var(--ink)}
  .menu{position:absolute;top:calc(100% + 4px);left:0;min-width:12rem;display:none;flex-direction:column;
    background:var(--surface);border:1px solid var(--border);border-radius:3px;box-shadow:var(--shadow);
    padding:.3rem;z-index:30}
  .nd[open]>.menu{display:flex}
  .menu a{color:var(--muted);text-decoration:none;font-size:.9rem;padding:.4rem .6rem;border-radius:2px;white-space:nowrap}
  .menu a:hover{color:var(--ink);background:var(--raised)}
  .top{color:var(--muted);text-decoration:none;font-size:.95rem;white-space:nowrap;padding:.45rem .8rem;border-radius:2px;font-weight:500}
  .top:hover{color:var(--ink);background:var(--raised)}
  /* open on hover for pointer devices */
  @media (hover:hover){ .nd:hover>.menu{display:flex} }
</style>
