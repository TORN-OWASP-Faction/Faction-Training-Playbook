<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Item from '$lib/Item.svelte';

  const locations = {
    columns: ['Location', 'To get in', 'Success rate cycle', 'Best time', 'Noteworthy finds'],
    rows: [
      ['Trash', 'No key item', 'Weekly. Starts at 0% on Monday 18:00 TCT and climbs in a straight line all week.', 'Early Monday, just before 08:00 TCT. Then it drops to 0%.', 'Card skimmers, spray cans, the 7 rotten items.'],
      ['Subway', '-', 'Daily. Follows how many players are active.', 'Changes during the day.', 'Billfolds (about 9%). Office Key at CS 85.'],
      ['Junkyard', '-', 'Highest on Sunday and Monday morning. Not steady the rest of the week.', 'Sunday and Monday morning.', 'Spray cans, card skimmers, spy cameras, rope, blank DVDs, computer parts, enhancers, Metal Detector.'],
      ['Beach', 'Metal Detector', 'The tide. High and low periods during the day and across the month.', 'Low tide (70%+) for Sand.', 'Cemetery Key, stash boxes, Sand.'],
      ['Cemetery', 'Cemetery Key', 'Fixed: 25% or 75% by time of day. Weekdays 9 to 5, groundskeeping lowers success a lot but opens some outcomes.', 'Outside weekday working hours.', 'Hit contracts, car keys, fertilizer, candles.'],
      ['Fountain', 'CS 75, no key item', 'Monthly. 0% on the 1st, slowly rises.', 'The 30th or 31st.', 'Loot containers, spray cans (green), some consumables.']
    ]
  };
  const kit = [
    {"name": "Glasses", "enhancer": true, "where": "Subway", "text": "+5% CS and CE gains. Also from pickpocketing a businesswoman."},
    {"name": "Metal Detector", "where": "CS 30 · Junkyard", "text": "Opens the Beach."},
    {"name": "Cemetery Key", "where": "CS 50 · Beach", "text": "Opens the Cemetery. Some later crimes may have extra outcomes if you have it."},
    {"name": "Lost and Found Office Key", "label": "Office Key", "where": "CS 85 · Subway", "text": "New outcomes on the Subway, and at least one unique."}
  ];
</script>

<CrimeHero title="Search for Cash" lede="The first crime in Crimes 2.0. You search six places for cash and items. Each place has its own success rate that moves with the time of day, the day of the week or the day of the month. Learn the cycles and search where the bar is highest." kitTitle="The four key items" items={kit} note="You find all four while doing this crime, so you don't need to buy them. Each unique drops only once per player." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>How it works</h2>
  <p class="lede">You need nothing to start. Pick a place and press "Attempt". As your Crime Skill (CS) goes up, new outcomes and unique finds show up.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Success bars</h3><p style="margin:.3em 0 0;color:var(--muted)">Each place shows its chance of success as a colored bar. The chance changes over time: some places by the hour, some by the day, and the Beach and Fountain over the whole month.</p></div>
    <div class="card"><h3>Uniques</h3><p style="margin:.3em 0 0;color:var(--muted)">A unique find is marked with a star under the "Attempt" button. You can find each one only once. There are 34 in this crime.</p></div>
    <div class="card"><h3>Mostly cash</h3><p style="margin:.3em 0 0;color:var(--muted)">Most searches give a small amount of cash. In the Trash, 86% of searches give cash and 14% give an item. The Subway is also mostly cash. The Junkyard gives items most often.</p></div>
    <div class="card"><h3>Materials for later crimes</h3><p style="margin:.3em 0 0;color:var(--muted)">Search for Cash is a good source of materials you need later, like spray cans and card skimmers. New crime materials and enhancers often get added to the Junkyard first.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Locations</span>
  <h2>The six places to search</h2>
  <p class="lede">Values and finds are very different between places, but no place is clearly better than the others. Click a header to sort.</p>
  <DataTable columns={locations.columns} rows={locations.rows} caption="Search for Cash: locations, success cycles and noteworthy finds" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Subway <span class="tag" style="color:var(--muted);background:var(--surface)">most consistent</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Probably the most steady place. The Office Key here does not open a new place. It adds new outcomes on the Subway.</p></div>
    <div class="card"><h3>Junkyard <span class="tag" style="color:var(--muted);background:var(--surface)">possibly the best</span></h3><p style="margin:.3em 0 0;color:var(--muted)">The highest rate of items instead of cash, and the place most likely to give crime components.</p></div>
    <div class="card"><h3>Beach <span class="tag" style="color:var(--muted);background:var(--surface)">careful</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Most finds are junk. It has the highest injury values and is the place most likely to send new players to hospital.</p></div>
    <div class="card"><h3>Cemetery <span class="tag" style="color:var(--muted);background:var(--surface)">backup</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Loot is mostly plain, but the fixed rate makes it a good choice when other places are low. Hit contracts and car keys are theorized to be parts for future crimes.</p></div>
    <div class="card"><h3>Fountain</h3><p style="margin:.3em 0 0;color:var(--muted)">Safe or unsafe for very long periods. The loot is weak, so it is mainly good for CS and green spray cans.</p></div>
    <div class="card"><h3>Trash</h3><p style="margin:.3em 0 0;color:var(--muted)">Mostly useless rewards, with a few exceptions. It is the only place with the rotten items for the Spoiled Rotten honor bar.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Don't search where you like. Search where the bar is high. Trash on Monday morning, Junkyard on Sunday, Fountain at the end of the month. And when everything is low, the Cemetery is always there."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Risk</span>
  <h2>Critical failures</h2>
  <p class="lede">A critical failure costs you CS. Sometimes you also lose items, lose life or go to jail.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Injuries</h3><p style="margin:.3em 0 0;color:var(--muted)">The Beach hurts the most. New players can end up in hospital there.</p></div>
    <div class="card"><h3>Key items</h3><p style="margin:.3em 0 0;color:var(--muted)">The guide author had no reports of anyone losing a Search for Cash key item to a critical failure.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Pay Dirt</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Spoiled Rotten</h3><p style="margin:.3em 0 0;color:var(--muted)">Find all 7 rotten items. They come only from the Trash, and only items you find count, so buying or trading them does nothing. When last tested, the last two were very rare and locked to CS 45.</p></div>
    <div class="card"><h3>Shore Thing</h3><p style="margin:.3em 0 0;color:var(--muted)">Find <Item name="Sand" /> at the Beach. It only drops at low tide (70%+). You need nothing, but a <Item name="Bucket" /> raises your chance a lot. It is a common outcome, not a unique, so there is no star. It can take up to 600 nerve.</p></div>
    <div class="card"><h3>Theft medals</h3><p style="margin:.3em 0 0;color:var(--muted)">Every attempt counts toward the Theft crime medals.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Going for Shore Thing? Bring a Bucket and only search the Beach at low tide. Don't look for a star. Sand is a normal drop, it just takes time."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Tools</span>
  <h2>Scripts</h2>
  <p class="lede"><b>Search for Cash Suggester</b> highlights the suggested place to search on the crimes page, based on the success rates and the time of day. We reviewed it and rated it low risk. See the <a href="{base}/scripts/">Scripts page</a> for the review and install link.</p>
</div></section>

<footer><div class="wrap">
  <strong>Search for Cash guide.</strong> From the in-depth Search for Cash guide by <strong>Emforus [2535044]</strong>, built on 262,000 player logs. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16343473" target="_blank" rel="noopener">Search for Cash forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

