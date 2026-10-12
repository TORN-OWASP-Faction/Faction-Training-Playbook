<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import data from '$lib/data/cracking.json';

  const kit = [
    {"name": "Office Chair", "enhancer": true, "where": "Shoplifting · Cyber Force", "text": "+5% CS and CE. A unique find when the guard is away."},
    {"name": "Personal Computer", "label": "Computer", "where": "Super Store", "text": "Required. Without a computer the crime stays locked."}
  ];

  const dollars = (s) => Number(s.replace(/[$,]/g, ''));

  // One card per target, best average pay first.
  const targets = Object.values(
    data.tabs[0].rows.reduce((acc, [target, service, min, max, avg, bruteN, bruteRate, crackN, crackRate]) => {
      acc[target] ??= { name: target, services: [] };
      acc[target].services.push({ service, min, max, avg, bruteN, bruteRate, crackN, crackRate });
      return acc;
    }, {})
  )
    .map((t) => {
      const avgs = t.services.map((s) => dollars(s.avg));
      return { ...t, low: Math.min(...avgs), high: Math.max(...avgs) };
    })
    .sort((a, b) => b.high - a.high);

  const money = (n) => '$' + n.toLocaleString('en-US');

  let query = $state('');
  const shown = $derived(
    targets.filter((t) => {
      const q = query.trim().toLowerCase();
      return !q || t.name.toLowerCase().includes(q) || t.services.some((s) => s.service.toLowerCase().includes(q));
    })
  );
</script>

<CrimeHero title="Cracking" lede="Crack passwords for pay. Each target offers several services, and each service pays in its own range. Below is every target and service with its pay and how often players succeeded." eyebrow="Crimes 2.0 · data" items={kit} note="Every 25 CS a new rig chassis unlocks. Fill it with CPUs, PSUs and cooling parts to brute-force more characters at once. The Computer Science courses help too." />

<section><div class="wrap">
  <span class="eyebrow">Targets</span>
  <h2>Targets and what they pay</h2>
  <p class="lede">{targets.length} targets, best paying first. Success is how often a brute-force try, and then the final crack, worked in the sample. Data last updated 4 March 2024.</p>
  <label class="filter">Find a target or a service
    <input type="search" bind:value={query} placeholder="e.g. Police, firewall" />
  </label>

  <div class="cards">
    {#each shown as t}
      <article class="card tgt">
        <div class="tgt-h"><h3>{t.name}</h3><span class="pay">{t.low === t.high ? money(t.high) : `${money(t.low)} – ${money(t.high)}`}</span></div>
        <table class="mini">
          <thead><tr><th scope="col">Service</th><th scope="col">Average</th><th scope="col">Range</th><th scope="col">Success</th></tr></thead>
          <tbody>
            {#each t.services as s}
              <tr>
                <th scope="row">{s.service}</th>
                <td class="num">{s.avg}</td>
                <td class="num range">{s.min} – {s.max}</td>
                <td class="num" title="Brute-force: {s.bruteRate} of {s.bruteN} tries. Crack: {s.crackRate} of {s.crackN} tries.">{s.bruteRate} / {s.crackRate}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </article>
    {/each}
  </div>
  {#if !shown.length}<p class="none">Nothing matches "{query}".</p>{/if}
</div></section>

<footer><div class="wrap">
  <strong>Cracking data.</strong> Targets, pay and success rates from the Cracking sheet by <strong>Emforus [2535044]</strong>, linked from his in-depth Cracking guide. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16373016" target="_blank" rel="noopener">Cracking forum guide</a> and the <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vSFZvD2QLXHWEGNeJhY7m_qPXfMWHy3NqJzEel7tv3pnWXvuTHg9m4o06oNTAFum9wc74RZk4HF5-BV/pubhtml?gid=1634233937&single=true" target="_blank" rel="noopener">source sheet</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

<style>
  .filter{display:grid;gap:.3rem;max-width:26rem;margin:1rem 0;font-size:.85rem;color:var(--muted)}
  .filter input{font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--border);padding:.55rem .7rem}
  .filter input:focus-visible{outline:2px solid var(--amber);outline-offset:1px}
  .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,30rem),1fr));gap:.8rem;align-items:start}
  .card.tgt{padding:14px 16px}
  .tgt-h{display:flex;justify-content:space-between;align-items:baseline;gap:.8rem;flex-wrap:wrap;margin-bottom:.4rem}
  .tgt-h h3{margin:0;font-size:1.05rem}
  .pay{font-family:"IBM Plex Mono",monospace;font-size:.82rem;color:var(--amber)}
  .mini{width:100%;min-width:0;border-collapse:collapse;font-size:.84rem}
  .mini th,.mini td{text-align:start;padding:.32rem .35rem;border-top:1px solid var(--border);vertical-align:top}
  .mini thead th{color:var(--faint);font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;border-top:0}
  .mini tbody th{font-weight:500}
  .num{font-variant-numeric:tabular-nums;white-space:nowrap}
  .range{color:var(--muted)}
  .none{color:var(--muted)}
  @media(max-width:520px){.range{display:none}.mini thead th:nth-child(3){display:none}}
</style>
