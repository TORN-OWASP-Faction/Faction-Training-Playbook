<script>
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Icon from '$lib/Icon.svelte';
  import data from '$lib/data/oc-scenarios.json';

  // slot-count distribution across the 32 modelled scenarios
  const dist = [3, 4, 5, 6].map((n) => ({
    slots: n,
    count: data.rows.filter((r) => r[1] === n).length
  }));
  const distMax = Math.max(...dist.map((d) => d.count));
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Crimes 2.0 · data</span>
  <h1>OC <em>scenarios</em></h1>
  <p class="lede">Every Organized Crime the community model tracks — its slot count and the exact roles it needs. This is the same scenario list the <a href="{base}/scripts/">OC Success Chance</a> script reads to compute your crew's odds.</p>
  <p style="margin-top:.6rem"><a href="{base}/crimes/#oc">← Back to Crimes</a></p>
</div></header>

<!-- HOW TO READ IT -->
<section><div class="wrap">
  <span class="eyebrow">Reading the roster</span>
  <h2>Roles, tiers &amp; what it takes to fill a slot</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Slots aren't interchangeable</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">%</span><div>Each role weights <b>crime XP, battle stats and job stats differently</b> — a great Muscle can be a poor Hacker. Put people where their stats fit.</div></li>
        <li><span class="k">≥</span><div>Roles have a practical <b>CPR floor</b>: faction worksheets run higher slots at <b>~70–80 CPR minimum</b> before they'll fill them.</div></li>
        <li><span class="k">Σ</span><div>Roles carry <b>different weight</b> toward the crew's success — the <b>Key role</b> column below is each crime's heaviest slot (e.g. Break the Bank leans <b>32%</b> on Muscle 3). A weak member there hurts far more than in a minor slot.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Bigger crime, bigger everything</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k"><Icon name="backpack"/></span><div>Higher tiers <b>burn consumables per run</b> — from a few thousand $ up to <b>millions</b> in parts (drills, charges, viruses) each attempt.</div></li>
        <li><span class="k"><Icon name="fuel"/></span><div>They cost more <b>Scope</b> to spawn (a tier-4 group runs ~4 Scope) — but clear one and it more than pays that back.</div></li>
        <li><span class="k">$</span><div>Rewards scale hard: top-tier runs average <b>hundreds of millions</b> gross. One weak slot dropping you from 85% to 55% success is real money per attempt.</div></li>
      </ul>
    </div>
  </div>

  <div class="card" style="margin-top:1rem">
    <h3>Crew sizes across the {data.rows.length} tracked scenarios</h3>
    <p style="margin:.3em 0 .8rem;color:var(--muted)">How many roles you need to staff, by scenario count. Bigger crews mean more slots to keep above their CPR floor.</p>
    <div class="bars">
      {#each dist as d}
        <div class="bar-row">
          <div class="lbl">{d.slots} slots</div>
          <div class="track"><div class="fill" style="width:{(d.count / distMax) * 100}%"><span class="v">{d.count} OCs</span></div></div>
        </div>
      {/each}
    </div>
  </div>

  <Character variant="militia" name="Rook" tag="Faction Intel" initial="R" img="militia.png">
    "Know the roster before you spawn. A six-slot crime with two members below floor isn't a crime — it's four people wasting a 6-day timer and the faction's Scope. Fill it right or don't run it."
  </Character>
</div></section>

<!-- THE TABLE -->
<section><div class="wrap">
  <span class="eyebrow">The full list</span>
  <h2>All scenarios, roles &amp; weights</h2>
  <p class="lede">Roles are listed <b>heaviest first</b> with each one's share of the crew's success. The <b>Key role</b> is the slot to fill first and never leave weak. Filter by a role (e.g. "Hacker") to see which OCs need it, or sort by slot count. {data.rows.length} scenarios.</p>
  <DataTable columns={data.columns} rows={data.rows} caption="OC 2.0 scenarios — slots, key role & role weights" />
</div></section>

<footer><div class="wrap">
  <strong>OC scenarios.</strong> Scenario list, role names and role weights from the
  <a href="https://tornprobability.com" target="_blank" rel="noopener">TornProbability</a> model (used by the OC Success Chance script by Allenone [2033011]);
  tier, CPR, item-burn and reward figures from community OC 2.0 worksheets and the
  <a href="https://wiki.torn.com/wiki/Organized_Crime_2.0" target="_blank" rel="noopener">Torn wiki</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Torn adds and tweaks scenarios — treat this as a living snapshot.
</div></footer>
