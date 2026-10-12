<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import data from '$lib/data/shoplifting.json';

  const kit = [
    {"name": "Mountain Bike", "enhancer": true, "where": "SFC Junkyard · Cyclist", "text": "+5% CS and CE, and unlocks some valuable outcomes. A crit can take it."},
    {"name": "Torn City Times", "where": "SFC Subway (unique)", "text": "Unlocks more outcomes in every store. It seems to raise success and lower notoriety, but this is not proven."}
  ];

  const dropColumns = ['Outcome', 'Times seen', 'Drop rate', 'Requirements', 'Notes'];
  const uniqueColumns = ['Store', 'Security', 'Outcome', 'CS'];

  let active = $state(0);
  const store = $derived(data.stores[active]);
  const shares = $derived(store.overall.filter(([, pct]) => pct !== '0.00%'));

  // Arrow keys move between store tabs, like the shared Tabs component.
  function onKey(e) {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    active = (active + step + data.stores.length) % data.stores.length;
    document.getElementById(`store-tab-${active}`)?.focus();
  }
</script>

<CrimeHero title="Shoplifting" lede="Steal from eight stores, from the candy shop to the gun shop. Each store has its own security, and security going down on a schedule is your window. Pick a store below to see what it drops, how often, and what a critical failure costs." eyebrow="Crimes 2.0 · data" items={kit} note="Nothing is used up and neither item is required. Each store's security goes down on a schedule: steal when it is off." />

<section><div class="wrap">
  <span class="eyebrow">Stores</span>
  <h2>Drops by store</h2>
  <p class="lede">Every number comes from player logs. Times seen is how often the outcome showed up in the sample.</p>

  <div class="tablist" role="tablist" tabindex="-1" onkeydown={onKey}>
    {#each data.stores as s, i}
      <button role="tab" id="store-tab-{i}" aria-controls="store-panel" aria-selected={i === active}
        tabindex={i === active ? 0 : -1} class="tab" class:active={i === active} onclick={() => (active = i)}>{s.name}</button>
    {/each}
  </div>

  <div id="store-panel" role="tabpanel" aria-labelledby="store-tab-{active}">
    <div class="tiles">
      <div class="tile"><div class="k">Sample size</div><div class="v">{store.sample}</div><div class="sub">attempts logged</div></div>
      <div class="tile"><div class="k">Uniques</div><div class="v">{store.uniques}</div><div class="sub">one-time finds</div></div>
      <div class="tile"><div class="k">Critical fails</div><div class="v">{store.crits}</div><div class="sub">in the sample</div></div>
      {#each shares as [label, pct]}
        <div class="tile"><div class="k">{label}</div><div class="v">{pct}</div><div class="sub">of successes</div></div>
      {/each}
    </div>

    {#key active}
      <DataTable columns={dropColumns} rows={store.drops} caption="{store.name}: item drops" />
    {/key}

    <div class="grid2" style="margin-top:1rem">
      <div class="card">
        <h3>Critical failures</h3>
        <ul class="bars">
          {#each store.crit.filter(([, pct]) => pct !== '0.00%') as [label, pct]}
            <li><span>{label}</span><span class="bar"><span style="width:{pct}"></span></span><b>{pct}</b></li>
          {/each}
        </ul>
        <table class="mini">
          <thead><tr><th scope="col">Result</th><th scope="col">Lowest</th><th scope="col">Highest</th></tr></thead>
          <tbody>
            {#each store.ranges as [label, min, max]}
              <tr><th scope="row">{label}</th><td>{min === 'NOT FOUND' ? 'Not seen' : min}</td><td>{max === 'NOT FOUND' ? 'Not seen' : max}</td></tr>
            {/each}
          </tbody>
        </table>
      </div>
      {#if store.money.length}
        <div class="card">
          <h3>Cash</h3>
          <p style="margin:.3em 0 .6rem;color:var(--muted)">Some successes here pay cash instead of items.</p>
          <table class="mini">
            <tbody>
              {#each store.money as [label, amount]}<tr><th scope="row">{label}</th><td>{amount}</td></tr>{/each}
            </tbody>
          </table>
        </div>
      {/if}
      {#if store.ammo.length}
        <div class="card">
          <h3>Ammo</h3>
          <p style="margin:.3em 0 .6rem;color:var(--muted)">Some successes here pay ammo.</p>
          <table class="mini">
            <thead><tr><th scope="col">Type</th><th scope="col">Amounts</th><th scope="col">Drop rate</th></tr></thead>
            <tbody>
              {#each store.ammo as [type, amounts, rate]}<tr><th scope="row">{type}</th><td>{amounts}</td><td>{rate}</td></tr>{/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Uniques</span>
  <h2>Unique finds</h2>
  <p class="lede">Each one drops only once. You need the CS shown, and the store's security must be all on or all off.</p>
  <DataTable columns={uniqueColumns} rows={data.uniques} caption="Shoplifting: unique outcomes" group={true} />
</div></section>

<footer><div class="wrap">
  <strong>Shoplifting data.</strong> Drop rates, critical failures and uniques from the Shoplifting drop tables by <strong>Emforus [2535044]</strong>, linked from his in-depth Shoplifting guide. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16346491" target="_blank" rel="noopener">Shoplifting forum guide</a> and the <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRZErkpqrwUpQCQ2uyigOB8OONVTGBhdpI_4UvMP6OWF8ZLxDWZQMVNGgLGdC8yCPLgAhiav9gmdp2Q/pubhtml" target="_blank" rel="noopener">source sheet</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

<style>
  .tablist{display:flex;gap:.4rem;overflow-x:auto;border-bottom:1px solid var(--border);margin-top:1.2rem;scrollbar-width:none}
  .tablist::-webkit-scrollbar{display:none}
  .tab{font:inherit;cursor:pointer;background:none;border:0;border-bottom:2px solid transparent;padding:.55rem .9rem .6rem;
    white-space:nowrap;color:var(--muted);margin-bottom:-1px;font-family:"Oswald",sans-serif;font-weight:700;
    text-transform:uppercase;letter-spacing:.06em;font-size:.9rem}
  .tab:hover{color:var(--ink)}
  .tab.active{color:var(--ink);border-bottom-color:var(--c-fixer)}
  .tab:focus-visible{outline:2px solid var(--amber);outline-offset:-2px}
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.7rem;margin:1rem 0}
  .bars{list-style:none;margin:.6rem 0 1rem;padding:0;display:grid;gap:.45rem}
  .bars li{display:grid;grid-template-columns:6.5rem minmax(0,1fr) 4rem;gap:.6rem;align-items:center;font-size:.9rem}
  .bars b{text-align:end;font-variant-numeric:tabular-nums}
  .bar{height:.5rem;background:var(--border);display:block}
  .bar span{display:block;height:100%;background:var(--c-militia)}
  .mini{width:100%;min-width:0;border-collapse:collapse;font-size:.88rem}
  .mini th,.mini td{text-align:start;padding:.35rem .4rem;border-top:1px solid var(--border)}
  .mini thead th{color:var(--faint);font-size:.72rem;text-transform:uppercase;letter-spacing:.05em;border-top:0}
  .mini tbody th{color:var(--muted);font-weight:500}
</style>
