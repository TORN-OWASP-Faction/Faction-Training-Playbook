<script>
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import data from '$lib/data/burglary.json';
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Crimes 2.0 · data</span>
  <h1>Burglary</h1>
  <p class="lede">Identify a place worth robbing, case it until it's safe, then break in and take what isn't nailed down. Below are the live droptables, casing rates and scouting distribution — filter and sort them.</p>
  <p style="margin-top:.6rem"><a href="{base}/crimes/">← Back to Crimes</a></p>
</div></header>

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>What you need</h2>
  <p class="lede">Burglary uses six reusable tools (not consumed) — each opens different targets and outcomes. Get the enhancer first.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Flashlight <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">enhancer</span></h3><p style="margin:.3em 0 0;color:var(--muted)">+5% CE &amp; CS and unlocks better outcomes. Unique find while shoplifting Bits 'n' Bobs, or burgling the Tool Shed with lockpicks.</p></div>
    <div class="card"><h3>Jemmy</h3><p style="margin:.3em 0 0;color:var(--muted)">Pry / force open targets. From shoplifting Bits 'n' Bobs or burgling the Mobile Home.</p></div>
    <div class="card"><h3>Rope</h3><p style="margin:.3em 0 0;color:var(--muted)">Climb up/down certain targets. Searching the junkyard/beach, casing the Mobile Home, burgling the Tool Shed &amp; Beach Hut.</p></div>
    <div class="card"><h3>Credit cards, lockpicks &amp; more</h3><p style="margin:.3em 0 0;color:var(--muted)">Credit cards shimmy some locks (very common drop); lockpicks pick others. Six tools total — different locations need different ones.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Case before you crack. The safety read on the table below is the difference between a payday and a hospital bed. Rush it and you're just donating to the guard dog."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Targets</span>
  <h2>Locations &amp; casing</h2>
  <p class="lede">CS to unlock, safety, recommended casing, sample size and casing success rate per target. Click a header to sort.</p>
  <DataTable columns={data.locations.columns} rows={data.locations.rows} caption="Burglary — locations & casing rates" group={true} />
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
  <p class="lede">Distribution of targets you'll scout at each Crime Skill level (columns = CS). Wide table — scroll sideways.</p>
  <DataTable columns={data.scouting.columns} rows={data.scouting.rows} caption="Scouted target distribution by CS level" />
</div></section>

<footer><div class="wrap">
  <strong>Burglary data.</strong> Droptables, casing rates and scouting distribution compiled by <strong>Emforus [2535044]</strong> in the Burglary Consolidated spreadsheet, linked from the in-depth guide. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>
