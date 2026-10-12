<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Item from '$lib/Item.svelte';

  const districts = {
    columns: ['District', 'Unlocks at', 'Risk', 'Paint for cash', 'Paint for rep'],
    rows: [
      ['East Side', 'Start', 'Lowest risk, the safest zone', 'Purple', 'Red'],
      ['West Side', 'Start', 'Police presence, play it carefully', 'Green', 'Blue'],
      ['North Side', 'Start', 'High risk, high failure rate', 'Green', 'Orange'],
      ['Residential District', 'CS 50 (found in East Side)', 'Lowest failure rate, best for grinding', 'White', 'Blue'],
      ['Red-Light District', 'CS 50 (found in West Side)', 'Highest failure rate and arrest risk', 'Green', 'Pink'],
      ['Financial District', 'Crew', 'Crew members only', 'Black', 'Red'],
      ['City Center', 'Crew', 'Crew members only', 'Green', 'Blue']
    ]
  };

  const reputation = {
    columns: ['Stars', 'Graffiti in the district', 'What it unlocks'],
    rows: [
      ['1 star', '25', 'First unique find. Spray cans can drop.'],
      ['2 stars', '50', 'Second unique find. Cash can drop.'],
      ['3 stars', '100', 'Third unique find. A little more cash.'],
      ['4 stars', '250', 'Fourth unique find. More cash.'],
      ['5 stars', '500', 'Much more cash. With CS 70 you can join a crew. Fifth unique find at CS 100.']
    ]
  };
  const kit = [
    {"name": "Ladder", "where": "CS 15 · West Side", "text": "Stops falls and bad outcomes from high places."},
    {"name": "Wire Cutters", "where": "CS 25 · North Side", "text": "Gets you into locked places, so you fail less."},
    {"name": "Paint Mask", "enhancer": true, "where": "CS 35 · East Side", "text": "+5% CS and CE, and unlocks the best cash outcomes. The biggest money factor in Graffiti."}
  ];
</script>

<CrimeHero title="Graffiti" lede="Tag walls across the city. Each district has its own risk, and in each one paint color decides what you get: one color pays the most cash, another builds reputation (stars) fastest. Pick the district for the risk, then pick the color for the goal." kitTitle="The three key items" items={kit} note="You find all three while doing Graffiti. You don't need them to start, but carry all three: they seem to stop some critical failures." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>What you need</h2>
  <p class="lede">Graffiti costs 3 nerve per try. All you need to start is a few spray cans in different colors. The three key items (see the top of the page) come later, while you do the crime.</p>
  <div class="card" style="margin-top:1rem"><h3>Spray cans</h3><p style="margin:.3em 0 0;color:var(--muted)">$5 each in Bits 'n' Bobs, also sold in the Print Store and on the item market. You need fewer than 100 to reach CS 100.</p></div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Districts</span>
  <h2>Where to spray, and which color</h2>
  <p class="lede">Seven districts in three tiers. Three are open from the start, two open at Crime Skill 50, and the last two need crew membership. Paint colors are the best guess from community logs; there is not much data on colors yet. Click a header to sort.</p>
  <DataTable columns={districts.columns} rows={districts.rows} caption="Graffiti: districts, risk and best paint color" />
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Don't spread yourself thin. Pick one district and take it to 5 stars, so you can join a crew as soon as you hit CS 70. After that, go wherever you like. East Side is where you learn without paying for it. North Side is where you find out if you learned."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Stars</span>
  <h2>Reputation</h2>
  <p class="lede">Each district has its own reputation, from 0 to 5 stars, based on how many tags you have there. About 80% of tries add reputation. More stars unlock unique finds and bigger cash.</p>
  <DataTable columns={reputation.columns} rows={reputation.rows} caption="Graffiti: reputation levels" />
  <div class="callout" style="margin-top:1rem;border-left-color:var(--c-militia)">
    <h3 class="h3">Your tags get cleaned up</h3>
    <p style="margin:.3em 0 0;color:var(--muted)">Every day the city removes some of your graffiti, and this can drop you a star. It is random, from a few tags to more than a dozen a day (once 100 in City Center). The more tags you have in a district, the faster they go. Districts lower on the list (Financial District, City Center) lose tags faster.</p>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">CS 70 + 5 stars</span>
  <h2>Joining a crew</h2>
  <p class="lede">The two best districts are locked behind crew membership. Many players miss how you join.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>What you need</h3><p style="margin:.3em 0 0;color:var(--muted)">1. <b>5-star reputation</b> in any one of the first five districts (the three starter districts, Residential or Red-Light).<br>2. <b>Crime Skill 70</b>.</p></div>
    <div class="card"><h3>How it happens</h3><p style="margin:.3em 0 0;color:var(--muted)">When you meet both conditions, a new unique find appears in that 5-star district. You must find it to join a crew. Reaching the conditions alone is not enough.</p></div>
    <div class="card"><h3>What you get</h3><p style="margin:.3em 0 0;color:var(--muted)">The <b>"Fresh Blud"</b> honor bar. The Financial District and City Center unlock for good. New outcomes open in every district too, with high-tier consumables and rare materials added.</p></div>
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
    <div class="card"><h3>Protect yourself</h3><p style="margin:.3em 0 0;color:var(--muted)">Carry all three key items: ladder, wire cutters and paint mask. They seem to stop some critical failures. The risk also depends on the district, so the riskier the district, the more crits you will see.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Paint color does nothing to your crit odds, or to your failure rate. Don't waste time on it. Pick your district for the risk and pick your color for the payout."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Let Us Spray</h3><p style="margin:.3em 0 0;color:var(--muted)">Honor bar for reaching CS 100.</p></div>
    <div class="card"><h3>Fresh Blud</h3><p style="margin:.3em 0 0;color:var(--muted)">Honor bar for joining a crew.</p></div>
  </div>
  <p style="margin-top:1rem;color:var(--muted)">Every try also counts toward the Vandalism crime medals. Vandalism is new in Crimes 2.0, so older players can earn all of these medals too.</p>
</div></section>

<footer><div class="wrap">
  <strong>Graffiti guide.</strong> Key items, reputation, decay, crews and paint colors from the in-depth Graffiti guide by <strong>Emforus [2535044]</strong>, built on more than 32,000 player logs. District loot from community guides. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16344567" target="_blank" rel="noopener">Graffiti forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

