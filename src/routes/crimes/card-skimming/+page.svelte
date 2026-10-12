<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Item from '$lib/Item.svelte';

  const subcrimes = {
    columns: ['Sub-crime', 'Nerve', 'Needs', 'CS gain', 'On a crit'],
    rows: [
      ['Install skimmer', '6', 'Card Skimmer + Spy Camera (both used up)', 'High, always the same', 'You lose 1 skimmer and 1 camera.'],
      ['Recover skimmer', 'Not given', 'An installed skimmer', 'Grows with the details it holds', 'You lose the skimmer, the camera and all its details. Jail for 1-3 hours.'],
      ['Sell card details', 'Not given', 'Personal Computer or Laptop', 'Small, about half of an install', 'You lose all your card details.']
    ]
  };

  const locations = {
    columns: ['Location', 'Unlocks at', 'Details per hour', 'Safety', 'How often skimmers are found'],
    rows: [
      ['Gas Station', 'CS 25', 'about 0.4', 'Safest', 'Days or weeks for 1 of 20.'],
      ['Bus Station', 'Start', 'about 0.6', 'Very safe', 'Just a few each week.'],
      ['Post Office', 'Start', 'about 0.75', 'Safe', 'A few days for 1 of 20.'],
      ['Subway Station', 'Start', 'about 0.9 (0.8-1 by time of day)', 'Minor risk', 'About 1 per day with 20 installed.'],
      ['College Campus', 'Start', 'about 1.1', 'Moderate risk', 'About 3 per day with 20 installed.'],
      ['Airport Terminal', 'CS 50', 'about 1.3 (best around noon)', 'High risk', '4 to 8 per day.'],
      ['Bank Branch', 'CS 100', 'about 1.7', 'Not known yet', 'Seems the same as Airport. Needs more data.'],
      ['Casino Lobby', 'CS 75', 'about 2.15', 'Very high risk', 'Over half, even if you are away only a short time.']
    ]
  };

  const sales = {
    columns: ['Details sold at once', 'Pay per detail'],
    rows: [
      ['1 - 100', '$100 - $160'],
      ['101 - 1,000', '$130 - $190'],
      ['1,001 - 9,999', '$160 - $220'],
      ['10,000+', '$190 - $250']
    ]
  };

  const paths = {
    columns: ['Path', 'Speed', 'Nerve use', 'Best for'],
    rows: [
      ['Install, recover at once, repeat', 'Fastest', 'Highest. A recover with 0 details gives about 1/3 of the CS of an install.', 'Players with a lot of nerve and boosters.'],
      ['Install, wait 6-12 hours, recover', 'Slow', 'Good. 6-7 details match an install. 13 details make recovery 50% more efficient.', 'Most players. The author calls it simply more efficient.'],
      ['Install, wait 2-3 weeks, recover', 'Slowest', 'Best by far', 'Players who work on other crimes. Use a safe location like Post Office or Bus Station.']
    ]
  };
  const kit = [
    {"name": "Card Skimmer", "where": "$175 · Mexico", "text": "Used up when you install, and you get it back when you recover."},
    {"name": "Spy Camera", "where": "$130 · Super Store", "text": "Also needed to install. Comes back when you recover."},
    {"name": "Personal Computer", "where": "$1,350 · Super Store", "text": "Needed to sell card details. A Laptop also works."},
    {"name": "Duct Tape", "enhancer": true, "where": "Shoplifting · Bits 'N' Bobs", "text": "+5% CS and CE. It may also raise success rate, but there is no hard proof."}
  ];
</script>

<CrimeHero title="Card Skimming" lede="Put card skimmers on ATMs, let them collect card details over time, then recover them and sell the details online. It is a slow, passive crime. You set it up and do other crimes while you wait." kitTitle="What you need" items={kit} note="Only Duct Tape is optional. The rest are required, but they are rarely lost." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>Getting the items</h2>
  <p class="lede">The items are easy to get, and you keep them most of the time. Only a critical failure takes them away.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3><Item name="Card Skimmer" /></h3><p style="margin:.3em 0 0;color:var(--muted)">Buy in Mexico for $175. You can also find them when you search the Junkyard (Search for Cash), and as a unique find in the Subway (Search for Cash) and in City Center (Graffiti).</p></div>
    <div class="card"><h3><Item name="Spy Camera" /></h3><p style="margin:.3em 0 0;color:var(--muted)">Buy in the Super Store for $130. You can also find them when you search the Junkyard, or shoplift the Super Store.</p></div>
    <div class="card"><h3><Item name="Personal Computer" /> or <Item name="Laptop" /></h3><p style="margin:.3em 0 0;color:var(--muted)">Buy a computer in the Super Store for $1,350, or find one when you shoplift the Super Store.</p></div>
    <div class="card"><h3><Item name="Duct Tape" /> <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">enhancer</span></h3><p style="margin:.3em 0 0;color:var(--muted)">A unique find when you shoplift in Bits 'N' Bobs.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Card Skimming 101</span>
  <h2>The three sub-crimes</h2>
  <p class="lede">Install, recover, sell. You can have at most 20 skimmers installed across all locations. To place more, recover some, or wait until some are found and removed.</p>
  <DataTable columns={subcrimes.columns} rows={subcrimes.rows} caption="Card Skimming: sub-crimes, cost and risk" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Installing</h3><p style="margin:.3em 0 0;color:var(--muted)">The CS gain is the same in every location. Only the crime progression bonus and the crime chain bonus change it. A normal failure gives nothing.</p></div>
    <div class="card"><h3>Recovering</h3><p style="margin:.3em 0 0;color:var(--muted)">Your skimmers are listed at the bottom of the crime page. Click the keypad icon next to <b>Recover</b> to see what happened to each one. A normal failure blocks that ATM for 10-30 minutes.</p></div>
    <div class="card"><h3>More details, more CS</h3><p style="margin:.3em 0 0;color:var(--muted)">Each stored detail seems to add about 15.5% to the CS from a recover. There seems to be no cap, up to 250 details or more. A skimmer with hundreds of details can give you several levels at once.</p></div>
    <div class="card"><h3>Selling</h3><p style="margin:.3em 0 0;color:var(--muted)">All your details sell at once. The amount does not seem to change the CS. The location the details came from does not change the price or the CS.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Locations</span>
  <h2>Where to install</h2>
  <p class="lede">Eight locations. Faster locations collect more details, but skimmers there are found more often. When a skimmer is found, you lose it and all its details. The rates are averages from the author's own notes. Click a header to sort.</p>
  <DataTable columns={locations.columns} rows={locations.rows} caption="Card Skimming: locations, speed and safety" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Safety is about being found</h3><p style="margin:.3em 0 0;color:var(--muted)">Failure and crit rates are about the same in every location, for both install and recover. The big difference is how often skimmers are found.</p></div>
    <div class="card"><h3>Your activity matters</h3><p style="margin:.3em 0 0;color:var(--muted)">Skimmers seem to be found only when you are inactive: asleep or flying. Go away for a long time and you may lose most of them. Recover them before a long break.</p></div>
    <div class="card"><h3>Time of day</h3><p style="margin:.3em 0 0;color:var(--muted)">Subway and Airport seem to collect faster when Torn is busy (noon and afternoon TCT) and slower in the evening and early morning.</p></div>
    <div class="card"><h3>State of emergency</h3><p style="margin:.3em 0 0;color:var(--muted)">When a dirty bomb is armed, Bus Station and Subway Station are locked. You cannot install or recover there, but your skimmers keep collecting.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Online all day? Use College, Airport or Casino. Going to bed? Move them to the Subway first. Your gear only gets found when you're not looking."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Leveling</span>
  <h2>Raising your Crime Skill</h2>
  <p class="lede">Installing gives the same CS as recovering a skimmer with 13 details. So how you level depends on your nerve, how often you play and how patient you are.</p>
  <DataTable columns={paths.columns} rows={paths.rows} caption="Card Skimming: three ways to level" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Don't sell for CS</h3><p style="margin:.3em 0 0;color:var(--muted)">Selling does not help your CS. Skip it, or sell once you have over 10,000 details stored.</p></div>
    <div class="card"><h3>Doing other crimes too?</h3><p style="margin:.3em 0 0;color:var(--muted)">Put your skimmers in a safe location and leave them for weeks. Recover when you have hundreds of details (some players wait for 200, others for 500). This is the most efficient way to level.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Install and recover in the morning and at night. In between, spend your nerve on another crime. The skimmers work while you don't."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Money</span>
  <h2>Selling card details</h2>
  <p class="lede">The more details you sell at once, the better the price. These ranges come from observation only, so they may not be exact.</p>
  <DataTable columns={sales.columns} rows={sales.rows} caption="Card Skimming: pay per detail by sale size" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Wait and sell big</h3><p style="margin:.3em 0 0;color:var(--muted)">The average price goes up by about $30 at each step: 100, 1,000 and 10,000 details. Nobody has tested 100,000 yet.</p></div>
    <div class="card"><h3>How much per day?</h3><p style="margin:.3em 0 0;color:var(--muted)">Casino Lobby collects about 50 details per day. At about $200 each, that is about $10,000 per skimmer per day, or $200k per day with all 20. The author calls this "somewhat alright": not great, not bad.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Progression</span>
  <h2>Uniques</h2>
  <p class="lede">Card Skimming has no unique finds. The guide notes it is the only crime without any. It is not known if some will be added later.</p>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>King PIN</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Zero Liability</h3><p style="margin:.3em 0 0;color:var(--muted)">Recover one skimmer with 250 details. Easy way: put 20 skimmers in College Campus for about two weeks and replace the ones that are found. Or put them in Gas Station for a month or more and just leave them.</p></div>
    <div class="card"><h3>Line of Credit</h3><p style="margin:.3em 0 0;color:var(--muted)">Sell 10,000 details at once. Just save details for a long time. For the least nerve, use Gas Station.</p></div>
    <div class="card"><h3>Fraud medals</h3><p style="margin:.3em 0 0;color:var(--muted)">Every attempt counts toward the Fraud crime medals, together with Hustling and Scamming.</p></div>
  </div>
</div></section>

<footer><div class="wrap">
  <strong>Card Skimming guide.</strong> From the in-depth Card Skimming guide by <strong>Emforus [2535044]</strong>, built on player logs and the author's own notes. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16350490" target="_blank" rel="noopener">Card Skimming forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

