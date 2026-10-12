<script>
  import CrimeHero from '$lib/CrimeHero.svelte';
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import ScoutChart from '$lib/ScoutChart.svelte';
  import Character from '$lib/Character.svelte';
  import data from '$lib/data/burglary.json';
  // Safety levels in the order the data lists them, from safe to unknown.
  const levelColor = ['var(--c-trainer)', 'var(--amber)', 'var(--amber)', 'var(--c-militia)', 'var(--c-militia)', 'var(--c-militia)', 'var(--faint)'];
  const categories = [
    ['Residential', 'from CS 1', 'RESIDENTIAL TARGETS'],
    ['Commercial', 'from CS 25', 'COMMERCIAL TARGETS'],
    ['Industrial', 'from CS 50', 'INDUSTRIAL TARGETS']
  ].map(([label, unlock, key]) => [label, unlock, data.locations.rows.filter((r) => r[0] === key).map((r) => r.slice(1))]);
  const kit = [
    {"name": "Flashlight", "enhancer": true, "where": "Bits 'n' Bobs · Tool Shed", "text": "+5% CS and CE, and unlocks better outcomes."},
    {"name": "Jemmy", "where": "Bits 'n' Bobs · Mobile Home", "text": "Forces and pries things open."},
    {"name": "Rope", "where": "SFC · Mobile Home · Tool Shed", "text": "Climb up or down some targets."},
    {"name": "Credit Card", "where": "wallets, many places", "text": "Shimmies open some locked doors. A very common drop."},
    {"name": "Lockpicks", "where": "Tool Shed · Cottage · Cabin", "text": "Opens locks of any kind."},
    {"name": "Window Breaker", "where": "Beach Hut · Lake House", "text": "Breaks windows. Gets you into most houses."},
    {"name": "Skeleton Key", "where": "Self-Storage · Shipyard", "text": "Opens the more advanced targets."}
  ];
</script>

<CrimeHero title="Burglary" lede="Identify a place worth robbing, case it until it's safe, then break in and take what isn't nailed down. Below are the drop tables, casing rates and scouting numbers. Filter and sort them." kitTitle="The seven tools" items={kit} note="None are used up and none are required, but you need them for uniques and the best loot. You find them all while doing the crime." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>What you need</h2>
  <p class="lede">Get the Flashlight first. The other six tools come as you burgle (see the list at the top of the page).</p>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Case before you crack. The safety read on the table below is the difference between a payday and a hospital bed. Rush it and you're just donating to the guard dog."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Targets</span>
  <h2>Locations &amp; casing</h2>
  <p class="lede">CS to unlock, safety, how many times to case, sample size and casing success rate per target. Click a header to sort.</p>
  <ul class="safety">
    {#each data.safety as [level, text], i}
      <li style="--lvl:{levelColor[i]}"><b>{level}</b><span>{text}</span></li>
    {/each}
  </ul>
  {#each categories as [label, unlock, rows]}
    <h3 class="cat-h">{label} <span>{unlock}</span></h3>
    <DataTable columns={data.locations.columns.slice(1)} rows={rows} caption="Burglary: {label.toLowerCase()} targets" search={false} />
  {/each}
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Loot</span>
  <h2>Item outcomes</h2>
  <p class="lede">What drops where. Filter by an item or a target.</p>
  <DataTable columns={data.outcomes.columns} rows={data.outcomes.rows} caption="Burglary — item outcomes by target" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Scouting</span>
  <h2>Scouted targets by skill level</h2>
  <p class="lede">What you'll find when you scout, by Crime Skill. Each line is one target's share of the scouts in its category: new targets appear as your CS rises, and the early ones fade out. Hover (or tab in and use the arrow keys) to see every target at a given level.</p>
  <ScoutChart columns={data.scouting.columns} rows={data.scouting.rows} />
  <details class="raw">
    <summary>Show the raw numbers</summary>
    <DataTable columns={data.scouting.columns} rows={data.scouting.rows} caption="Scouted target distribution by CS level (counts, then percentages). Wide table, so scroll sideways." />
  </details>
</div></section>

<footer><div class="wrap">
  <strong>Burglary data.</strong> Droptables, casing rates and scouting distribution compiled by <strong>Emforus [2535044]</strong> in the Burglary Consolidated spreadsheet, linked from the in-depth guide. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16353303" target="_blank" rel="noopener">Burglary forum guide</a> and the <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRAHkfnG4oFUhLM8RByNXI1POUw56FJ7WEqRnVyCvDNSmd24z1eCRIdgFQIRL0CCiOsqvZd_BubHfW6/pubhtml" target="_blank" rel="noopener">source sheet</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

<style>
  .safety{list-style:none;margin:1rem 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:.6rem}
  .safety li{background:var(--surface);border:1px solid var(--border);border-inline-start:3px solid var(--lvl);padding:.6rem .8rem;display:grid;gap:.15rem}
  .safety b{font-size:.78rem;text-transform:uppercase;letter-spacing:.05em}
  .safety span{color:var(--muted);font-size:.86rem;line-height:1.4}
  .cat-h{margin:1.4rem 0 .5rem;display:flex;gap:.5rem;align-items:baseline}
  .cat-h span{font-size:.8rem;color:var(--faint);font-family:"IBM Plex Mono",monospace;font-weight:400}
  .raw{margin-top:1rem}
  .raw summary{cursor:pointer;color:var(--muted);font-size:.85rem;padding:.3rem 0}
  .raw summary:hover{color:var(--ink)}
  .raw summary:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
</style>
