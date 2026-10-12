<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import Item from '$lib/Item.svelte';
  import data from '$lib/data/forgery.json';

  const kit = [
    {"name": "Magnifying Glass", "enhancer": true, "where": "Shoplifting · Jewelry Store", "text": "+5% CS and CE. A unique find when all security is on."},
    {"name": "Personal Computer", "label": "Computer", "where": "Super Store", "text": "Needed for paper documents, with a printer and scissors."},
    {"name": "Printer", "text": "Needed for printing steps. A crit while printing can take it."},
    {"name": "Scissors", "text": "Needed with the computer and printer for paper documents."}
  ];

  const statLabels = { 'Nerve cost': 'Nerve', 'Material cost': 'Materials', 'Outcome sale value': 'Sells for', 'Expected profit': 'Profit', 'Profit per nerve': 'Per nerve' };

  let query = $state('');
  const matches = (m) => {
    const q = query.trim().toLowerCase();
    return !q || m.name.toLowerCase().includes(q) || m.sources.some(([s]) => s.toLowerCase().includes(q));
  };
  const groups = $derived([
    ['Tools', 'Not used up. You need one of each for the steps that use it.', data.materials.filter((m) => m.type === 'Tool' && matches(m))],
    ['Consumables', 'Used up as you work. Some give 100 uses per item.', data.materials.filter((m) => m.type === 'Consumable' && matches(m))]
  ]);
</script>

<CrimeHero title="Forgery" lede="Turn raw materials into documents, keys and badges, one step at a time. Below: every tool and material with where to find it, then every project with its steps, cost and profit." eyebrow="Crimes 2.0 · data" items={kit} note="Forgery uses more tools and materials than any other crime. The cards below list them all and where to find them." />

<section><div class="wrap">
  <span class="eyebrow">Materials</span>
  <h2>Tools and materials, and where to find them</h2>
  <p class="lede">Drop rates come from 358k Burglary logs and 125k Pickpocketing logs. "How many" is the guide's advice, based on CS gain and how many projects you will do.</p>
  <label class="filter">Find a material or a source
    <input type="search" bind:value={query} placeholder="e.g. Glue, Burglary, Canada" />
  </label>

  {#each groups as [title, blurb, list]}
    {#if list.length}
      <h3 class="group-h">{title} <span>{list.length}</span></h3>
      <p class="group-p">{blurb}</p>
      <div class="cards">
        {#each list as m}
          <article class="card mat">
            <div class="mat-h"><Item name={m.name} icon /><h4>{m.name}</h4></div>
            {#if m.howMany}<p class="many"><b>How many:</b> {m.howMany}</p>{/if}
            <ul class="src">
              {#each m.sources as [where, dropRate]}
                <li><span>{where}</span>{#if dropRate === 'UNKNOWN'}<i>not known</i>{:else if dropRate}<b>{dropRate}</b>{/if}</li>
              {/each}
            </ul>
          </article>
        {/each}
      </div>
    {/if}
  {/each}
  {#if groups.every(([, , list]) => !list.length)}<p class="group-p">Nothing matches "{query}".</p>{/if}
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Projects</span>
  <h2>Projects, steps and profit</h2>
  <p class="lede">Each project runs through its steps in order. Some steps take time before you can do the next one. ⚠ marks a risky step (more chance to fail). ☠ marks a dangerous one (its effect is not known yet).</p>
  <p class="group-p">Cardstock, Bond Paper, PVC Cards and Adhesive Plastic give 100 uses per item. Toner, spray cans, Glue and Inkwells top up a percentage. Uses are shared by every project, so leftovers carry over.</p>
  <div class="cards wide">
    {#each data.projects as pr}
      <article class="card proj">
        <div class="mat-h"><Item name={pr.outcome} icon /><h4>{pr.job}</h4><span class="tag cs">CS {pr.cs}</span></div>
        <dl class="pstats">
          {#each pr.stats as [k, v]}<div><dt>{statLabels[k] ?? k}</dt><dd>{v}</dd></div>{/each}
        </dl>
        {#if pr.note}<p class="many">{pr.note}</p>{/if}
        <ol class="psteps">
          {#each pr.steps as [step, time, tools, cons]}
            <li>
              <span class="step">{step.replace(/^#\d+:?\s*/, '')}</span>
              {#if time || tools || cons}
                <span class="meta">{[time && `⏱ ${time}`, tools, cons].filter(Boolean).join(' · ')}</span>
              {/if}
            </li>
          {/each}
        </ol>
      </article>
    {/each}
  </div>
</div></section>

<footer><div class="wrap">
  <strong>Forgery data.</strong> Materials, sources and projects from the Forgery sheet by <strong>Emforus [2535044]</strong>, linked from his in-depth Forgery guide. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16388086" target="_blank" rel="noopener">Forgery forum guide</a> and the <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSuPNjEqDg09GCYnHM7fDtWkcfUSDeu0pjkPvGcvrFvtb2FRmvtO-0BKcFWwwrTJtKF_1_bwembT6FW/pubhtml" target="_blank" rel="noopener">source sheet</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

<style>
  .filter{display:grid;gap:.3rem;max-width:26rem;margin:1rem 0;font-size:.85rem;color:var(--muted)}
  .filter input{font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--border);padding:.55rem .7rem}
  .filter input:focus-visible{outline:2px solid var(--amber);outline-offset:1px}
  .group-h{margin:1.6rem 0 .2rem;display:flex;gap:.5rem;align-items:baseline}
  .group-h span{font-size:.8rem;color:var(--faint);font-family:"IBM Plex Mono",monospace}
  .group-p{color:var(--muted);margin:0 0 .8rem;font-size:.92rem}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));gap:.8rem;align-items:start}
  .cards.wide{grid-template-columns:repeat(auto-fill,minmax(22rem,1fr));margin-top:1rem}
  @media(max-width:420px){.cards,.cards.wide{grid-template-columns:minmax(0,1fr)}}
  .card.mat,.card.proj{padding:14px 16px;display:flex;flex-direction:column;gap:.55rem}
  .mat-h{display:flex;align-items:center;gap:.6rem}
  .mat-h h4{margin:0;font-size:1rem}
  .mat-h .cs{margin-inline-start:auto;color:var(--c-fixer);background:var(--fixer-soft)}
  .many{margin:0;color:var(--muted);font-size:.86rem;line-height:1.4}
  .many b{color:var(--ink);font-weight:600}
  .src{list-style:none;margin:0;padding:0;border-top:1px solid var(--border)}
  .src li{display:flex;justify-content:space-between;gap:.8rem;padding:.35rem 0;border-bottom:1px solid var(--border);font-size:.86rem}
  .src li:last-child{border-bottom:0}
  .src b{font-family:"IBM Plex Mono",monospace;font-weight:500;color:var(--amber);white-space:nowrap}
  .src i{color:var(--faint);font-size:.8rem;white-space:nowrap}
  .pstats{display:grid;grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr));gap:.4rem;margin:0}
  .pstats div{border:1px solid var(--border);padding:.35rem .5rem}
  .pstats dt{font-size:.66rem;text-transform:uppercase;letter-spacing:.05em;color:var(--faint)}
  .pstats dd{margin:0;font-family:"Oswald",sans-serif;font-weight:700;font-variant-numeric:tabular-nums}
  .psteps{margin:0;padding-inline-start:1.3rem;display:grid;gap:.35rem;font-size:.88rem}
  .psteps .step{display:block}
  .psteps .meta{display:block;color:var(--muted);font-size:.8rem;font-family:"IBM Plex Mono",monospace}
</style>
