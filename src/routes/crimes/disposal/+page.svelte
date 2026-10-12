<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';

  const consumables = {
    columns: ['Item', 'Used for', 'How to get it'],
    rows: [
      ['Gas Can', 'Every Burn job', "Bits 'n' Bobs (for a time). Burglary: Bungalow, Farmhouse, Farm Storage and others."],
      ['Hydrochloric Acid', 'Every Dissolve job', 'Burglary: Cleaning Agency (12.3%), Beach Hut, Foundry. Pickpocketing: Mobster.'],
      ['Bricks', 'Vehicle with Sink', "Buy at Bits 'n' Bobs. Also from many crimes."],
      ['Bleach', 'Vehicle and Murder Weapon with Abandon', 'Burglary: Cleaning Agency (22.5%), Suburban Home, Market and many others.'],
      ['Paper Towels', 'Vehicle and Murder Weapon with Abandon', 'Burglary: Cleaning Agency, Dentists Office, Old Factory, Paper Mill.'],
      ['Disposable Masks', 'Biological Waste, every method', 'Buy at the Pharmacy.'],
      ['Lye', 'Body Part and Dead Body with Bury', 'Burglary: Cleaning Agency, Farm Storage.'],
      ['Bonesaw', 'Dead Body with Dissolve', 'Burglary: Secluded Cabin, Funeral Directors, Slaughterhouse.'],
      ['Rope + Anchor', 'Dead Body with Sink', 'Rope: SFC Junkyard and Burglary. Anchor: a unique from burgling the Shipyard.']
    ]
  };

  const methods = {
    columns: ['Method', 'Nerve', 'CS gain', 'Needs', 'Notes'],
    rows: [
      ['Abandon', '6', '100%', 'Bleach + Paper Towels for Vehicle and Murder Weapon. Handkerchief for Firearm.', 'Cheapest, but often unsafe.'],
      ['Bury', '8', '120%', 'Shovel, always. Lye for Body Part and Dead Body.', 'Not for Vehicle.'],
      ['Burn', '10', '144%', 'Gas Can, always.', 'Very safe for things that burn, like Documents and Old Furniture. Not for Building Debris or Broken Appliance.'],
      ['Sink', '12', '173%', 'Bricks for Vehicle. Rope + Anchor for Dead Body.', 'Open for every job. Great for heavy things. Light trash floats and fails.'],
      ['Dissolve', '14', '207%', 'Hydrochloric Acid, always. Bonesaw for Dead Body.', 'Fails almost every time, except on Body Part and Dead Body. Not for Vehicle or Biological Waste.']
    ]
  };

  const jobs = {
    columns: ['Job', 'Rarity', 'CS gain', 'Needs'],
    rows: [
      ['General Waste', 'Very common', '100%', '-'],
      ['Broken Appliance', 'Common', '107.5%', '-'],
      ['Old Furniture', 'Common', '107.5%', '-'],
      ['Building Debris', 'Very common', '115%', 'Wheelbarrow'],
      ['Vehicle', 'Uncommon', '130%', '-'],
      ['Documents', 'Uncommon', '145%', '-'],
      ['Industrial Waste', 'Uncommon', '160%', 'Wheelbarrow'],
      ['Biological Waste', 'Rare', '175%', 'Disposable Masks'],
      ['Murder Weapon', 'Very rare', '212.5%', '-'],
      ['Firearm', 'Very rare', '220%', 'Double Cut File (not for Dissolve)'],
      ['Body Part', 'Extremely rare', '350%', '-'],
      ['Dead Body', 'Extremely rare', '550%', '5× the usual materials']
    ]
  };

  const ratings = {
    columns: ['Job', 'Abandon', 'Bury', 'Burn', 'Sink', 'Dissolve', 'Use'],
    rows: [
      ['General Waste', 'Unsafe', 'Safe', 'Mod. unsafe', 'Risky', 'Very dangerous', 'Bury or Burn'],
      ['Broken Appliance', 'Unsafe', 'Risky', 'n/a', 'Safe', 'Very dangerous', 'Sink'],
      ['Old Furniture', 'Unsafe', 'Risky', 'Safe', 'Unsafe', 'Very dangerous', 'Burn'],
      ['Building Debris', 'Unsafe', 'Risky', 'n/a', 'Safe', 'n/a', 'Sink'],
      ['Vehicle', 'Unsafe', 'n/a', 'Mod. unsafe', 'Safe', 'n/a', 'Sink, or Burn'],
      ['Documents', 'Risky? (low data)', 'Unsafe? (low data)', 'Safe', 'Very dangerous', 'Very dangerous', 'Burn'],
      ['Industrial Waste', 'Dangerous', 'Unsafe', 'n/a', 'Safe', 'n/a', 'Sink'],
      ['Biological Waste', 'Dangerous? (low data)', 'Unsafe', 'Risky', 'Safe', 'n/a', 'Sink'],
      ['Firearm', 'No data', 'Unsafe', 'n/a', 'Mod. unsafe', 'Very dangerous', 'Sink'],
      ['Murder Weapon', 'No data', 'No data', 'n/a', 'Safe', 'Very dangerous', 'Sink'],
      ['Body Part', 'No data', 'No data', 'No data', 'Mod. unsafe? (low data)', 'Safe', 'Dissolve'],
      ['Dead Body', 'No data', 'No data', 'No data', 'No data', 'Safe? (low data)', 'Dissolve']
    ]
  };

  const legend = {
    columns: ['Rating', 'Success rate'],
    rows: [
      ['Safe', 'Over 95%'],
      ['Moderately unsafe', '90% to 95%'],
      ['Unsafe', '80% to 90%'],
      ['Risky', '60% to 80%'],
      ['Dangerous', 'Under 60%']
    ]
  };
  const kit = [
    {"name": "Latex Gloves", "enhancer": true, "text": "+5% CS and CE. A unique from Shoplifting (Jewelry Store) or Burglary (Dentists Office)."},
    {"name": "Shovel", "where": "every Bury job", "text": "SFC Cemetery, or Burglary (Tool Shed is best)."},
    {"name": "Wheelbarrow", "where": "Debris, Industrial", "text": "Burglary (Tool Shed, Suburban Home, Foundry). The Recycling Center sold it for a time."},
    {"name": "Double Cut File", "where": "Firearm", "text": "Pickpocketing (Homeless Person, Laborer) or Burglary (Tool Shed)."},
    {"name": "Handkerchief", "where": "Firearm + Abandon", "text": "Pickpocketing (Homeless Person, Businessman), SFC Cemetery, Burglary."}
  ];
</script>

<CrimeHero title="Disposal" lede="Get rid of things for people: trash, furniture, cars, guns, even bodies. Each job lets you pick a method, from Abandon to Dissolve. The right method depends on the job. Jobs come once a day, so time limits you here, not nerve." kitTitle="Enhancer and tools" items={kit} note="Tools are not used up. You only need one of each in your inventory. Most cannot be bought in stores, but you can buy them on the item market." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>Consumables</h2>
  <p class="lede">Disposal uses more materials than any other crime. Consumables are used up on every try that needs them. Most come from other crimes, but you can buy almost all of them on the item market.</p>
  <DataTable columns={consumables.columns} rows={consumables.rows} caption="Disposal: consumables and where to get them" />
  <div class="card" style="margin-top:1rem"><h3>Keep a car in your inventory</h3><p style="margin:.3em 0 0;color:var(--muted)">Some outcomes and three known uniques need a car in your inventory. Any car works. You do not need a driver's license or a racing license.</p></div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Disposal 101</span>
  <h2>Daily jobs</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>New jobs every day</h3><p style="margin:.3em 0 0;color:var(--muted)">A new set of jobs comes at 00:00 TCT. Every player gets the same jobs, but some only show at higher CS. At CS 100 there are about 16 jobs a day.</p></div>
    <div class="card"><h3>Use them or lose them</h3><p style="margin:.3em 0 0;color:var(--muted)">Jobs you don't do are gone at the end of the day. When you finish them all, no more come until the next day. Do every job, every day.</p></div>
    <div class="card"><h3>Common and rare jobs</h3><p style="margin:.3em 0 0;color:var(--muted)">Building Debris and General Waste come every day, often 2-3 times. Building Debris is about 18% of all jobs and General Waste about 16%. A Dead Body comes about once a week, if you are lucky.</p></div>
    <div class="card"><h3>Complexity</h3><p style="margin:.3em 0 0;color:var(--muted)">Harder jobs pay more and give more CS. But a failed hard job can cost you a lot of CS.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Jobs</span>
  <h2>The 12 jobs</h2>
  <p class="lede">CS gain is compared to General Waste. These numbers come from observation and are close, not exact.</p>
  <DataTable columns={jobs.columns} rows={jobs.rows} caption="Disposal: jobs, rarity, CS gain and required tools" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Methods</span>
  <h2>The 5 methods</h2>
  <p class="lede">Each method costs 2 more nerve than the one before and gives about 20% more CS. Some jobs block some methods (you can't bury a car or burn concrete).</p>
  <DataTable columns={methods.columns} rows={methods.rows} caption="Disposal: methods, nerve, CS gain and materials" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Best picks</span>
  <h2>Which method for which job</h2>
  <p class="lede">Data is thin because there are so few jobs each day. Ratings with a "?" have little data. Some "safe" ratings may not be fully safe. n/a means the method is not offered.</p>
  <DataTable columns={ratings.columns} rows={ratings.rows} caption="Disposal: how safe each method is for each job" />
  <div class="grid2" style="margin-top:1rem;align-items:start">
    <DataTable columns={legend.columns} rows={legend.rows} caption="What the ratings mean" />
    <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
      "Heavy stuff sinks. Paper burns. Acid is for bodies, nothing else. Dissolve a sofa and you just paid 14 nerve to fail."
    </Character>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Leveling</span>
  <h2>Raising your Crime Skill</h2>
  <p class="lede">Leveling is slow because jobs are limited. Nerve is not the limit, time is. So spend nerve to get more CS from each job.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>The plan</h3><p style="margin:.3em 0 0;color:var(--muted)">1. Do every job, every day.<br>2. Use the method with the highest success rate.<br>3. If more than one method is safe, pick the one that costs the most nerve.</p></div>
    <div class="card"><h3>Skip uniques for now</h3><p style="margin:.3em 0 0;color:var(--muted)">Higher CS means more jobs each day, so more CS each day. Go back for uniques later, when you are comfortable at your skill level.</p></div>
    <div class="card"><h3>How CS gain adds up</h3><p style="margin:.3em 0 0;color:var(--muted)">Method multiplier = 1.2 ^ ((nerve - 6) / 2). The final gain seems to be method multiplier × job multiplier. Example: Sink (173%) on a Vehicle (130%) is about 2.25× a General Waste Abandon.</p></div>
    <div class="card"><h3>Money</h3><p style="margin:.3em 0 0;color:var(--muted)">Pay is mostly cash. It changes a lot between jobs, but the method does not seem to change it much, if at all. Body Part and Dead Body jobs are good side income for little nerve.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Progression</span>
  <h2>Uniques</h2>
  <p class="lede">11 uniques: one for each job except Biological Waste. No CS locks were found. Three known uniques need a car in your inventory.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Uniques on worse methods</h3><p style="margin:.3em 0 0;color:var(--muted)">Some uniques sit on methods that are not the safest. The guide names three: Vehicle with Abandon, Industrial Waste with Bury, and Firearm with Bury.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "That shiny unique can wait. Every day you're higher, you get more jobs. The unique will still be there next month."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Trash Bandit</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Dissolving Agent</h3><p style="margin:.3em 0 0;color:var(--muted)">Dissolve a Dead Body in acid. Dead Bodies are random and come more at high CS. They are generally safe, so try it when you get one.</p></div>
    <div class="card"><h3>Illicit Services medals</h3><p style="margin:.3em 0 0;color:var(--muted)">Every try counts toward the Illicit Services medals. But high nerve costs and few jobs a day make Disposal a poor way to earn them.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Tools</span>
  <h2>Scripts</h2>
  <p class="lede"><b>Disposal Helper</b> colors each Disposal method by risk, using the table from this guide. We reviewed it and rated it low risk. See the <a href="{base}/scripts/">Scripts page</a> for the review and install link.</p>
</div></section>

<footer><div class="wrap">
  <strong>Disposal guide.</strong> From the in-depth Disposal guide by <strong>Emforus [2535044]</strong>, built on player logs. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16367936" target="_blank" rel="noopener">Disposal forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

