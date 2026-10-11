<script>
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Item from '$lib/Item.svelte';

  const districts = {
    columns: ['District', 'Unlocks at', 'Risk', 'Paint for cash', 'Paint for rep'],
    rows: [
      ['East Side', 'Start', 'Lowest risk, the safest zone', 'Purple', 'Red'],
      ['West Side', 'Start', 'Police presence, play it carefully', 'Green', 'Blue'],
      ['North Side', 'Start', 'High risk, high failure rate', 'Green', 'Orange'],
      ['Residential District', 'CS 50', 'Lowest failure rate, best for grinding', 'White', 'Blue'],
      ['Red-Light District', 'CS 50', 'Highest failure rate and arrest risk', 'Green', 'Pink'],
      ['Financial District', 'Crew', 'Crew members only', 'Black', 'Red'],
      ['City Center', 'Crew', 'Crew members only', 'Green', 'Blue']
    ]
  };
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Crimes 2.0 · guide</span>
  <h1>Graffiti</h1>
  <p class="lede">Tag walls across the city. Each district has its own risk, and in each one paint color decides what you get: one color pays the most cash, another builds reputation (stars) fastest. Pick the district for the risk, then pick the color for the goal.</p>
  <p style="margin-top:.6rem"><a href="{base}/crimes/">← Back to Crimes</a></p>
</div></header>

<section><div class="wrap">
  <span class="eyebrow">Districts</span>
  <h2>Where to spray, and which color</h2>
  <p class="lede">Seven districts in three tiers. Three are open from the start, two open at Crime Skill 50, and the last two need crew membership. Click a header to sort.</p>
  <DataTable columns={districts.columns} rows={districts.rows} caption="Graffiti: districts, risk and best paint color" />
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "New to the can? Rotate through East, West and North Side until your skill is up. East Side is where you learn without paying for it. North Side is where you find out if you learned."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">CS 70 + 5 stars</span>
  <h2>Joining a crew</h2>
  <p class="lede">The two best districts are locked behind crew membership. Many players miss how you join.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>What you need</h3><p style="margin:.3em 0 0;color:var(--muted)">1. <b>5-star reputation</b> in any one of the first five districts (the three starter districts, Residential or Red-Light).<br>2. <b>Crime Skill 70</b>.</p></div>
    <div class="card"><h3>How it happens</h3><p style="margin:.3em 0 0;color:var(--muted)">When you meet both conditions, a special star appears in that 5-star district. Claim it and you join a crew.</p></div>
    <div class="card"><h3>What you get</h3><p style="margin:.3em 0 0;color:var(--muted)">The <b>"Fresh Blud"</b> honor bar. The Financial District and City Center unlock for good. The loot in every earlier district gets better too, with high-tier consumables and rare materials added.</p></div>
    <div class="card"><h3>Is it worth it?</h3><p style="margin:.3em 0 0;color:var(--muted)">Yes, if you want the big payouts. The best rewards in Graffiti all come after you join a crew.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Loot</span>
  <h2>The advanced districts</h2>
  <p class="lede">The best rewards come from the later districts.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Residential District</h3><p style="margin:.3em 0 0;color:var(--muted)">Cash goes up with each star: from about <b>$30,000</b> up to about <b>$125,000</b>.</p></div>
    <div class="card"><h3>Red-Light District</h3><p style="margin:.3em 0 0;color:var(--muted)">4 <Item name="Morphine" />, 800 rounds of special ammo, PCP, <Item name="Opium" /> with empty blood bags. At CS 100 with 5 stars: a full box of medical supplies.</p></div>
    <div class="card"><h3>Financial District <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">crew</span></h3><p style="margin:.3em 0 0;color:var(--muted)">400 special rounds, 25 card skimmers, bottles of Speed, a <Item name="Can of Goose Juice" />, and the rare Neumune Tablet.</p></div>
    <div class="card"><h3>City Center <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">crew</span></h3><p style="margin:.3em 0 0;color:var(--muted)">A high-speed drive enhancer (for Bootlegging), medical crates, 4 Molotov cocktails, Tequila and Sake, and a <b>$500,000</b> cash jackpot at 5 stars.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Risk</span>
  <h2>Critical failures</h2>
  <p class="lede">About <b>10%</b> of failed tags become critical failures. In Graffiti they are mild compared to high-tier crimes, but they still slow you down.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Usually</h3><p style="margin:.3em 0 0;color:var(--muted)">You lose the spray can you are using, or a small part of your health.</p></div>
    <div class="card"><h3>In risky districts</h3><p style="margin:.3em 0 0;color:var(--muted)">In the Red-Light District or North Side, a critical failure can put you in <b>jail for 1 to 5 hours</b>.</p></div>
    <div class="card"><h3>Worst case</h3><p style="margin:.3em 0 0;color:var(--muted)">A bad critical failure can <b>destroy your wire cutters or your paint mask</b>.</p></div>
    <div class="card"><h3>Protect yourself</h3><p style="margin:.3em 0 0;color:var(--muted)">Carry all three key items (backpack, wire cutters and paint mask). They lower your failure rate a lot and protect you from hazards. Always have the mask and wire cutters in the Red-Light District, because the guards there show no mercy.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Paint color does nothing to your crit odds. Don't waste time on it. Pick your district for the risk and pick your color for the payout."
  </Character>
</div></section>

<footer><div class="wrap">
  <strong>Graffiti guide.</strong> Districts, paint colors and rewards come from community guides. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>
