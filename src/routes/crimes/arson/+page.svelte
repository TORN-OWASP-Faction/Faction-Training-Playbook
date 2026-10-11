<script>
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Item from '$lib/Item.svelte';

  const actions = {
    columns: ['Action', 'Nerve', 'What it does', 'CS gain'],
    rows: [
      ['Inquire', '0', 'Read the story of the job. Also keeps the job for the next day.', '-'],
      ['Breach', '3', 'Get into the target. It can fail.', '100%'],
      ['Plant evidence', '5', 'Only for some jobs. Needs a special item.', '-'],
      ['Place', '5', 'Put down starter fuel. Do it at least once before you ignite.', '133%'],
      ['Ignite', '5', 'Start the fire. Too little fuel can fail; too much can crit.', '300%'],
      ['Stoke', '5', 'Add fuel to a burning fire.', '200%'],
      ['Dampen', '5', 'Make the fire smaller.', '200%'],
      ['Collect', '2', 'Take your pay if the job was a success.', '600%']
    ]
  };

  const flammability = {
    columns: ['Flammability', 'Fire growth', 'Max destruction', 'Time to burn down'],
    rows: [
      ['1', 'x1', '0.4% per second', '250 s'],
      ['2', 'x1.5', '0.8% per second', '125 s'],
      ['3', 'x2', '1.2% per second', '83 s'],
      ['4', 'x2.5', '1.6% per second', '63 s'],
      ['5', 'x3', '2% per second', '50 s']
    ]
  };

  const rurality = {
    columns: ['Rurality', 'Response time'],
    rows: [['1', '30 s'], ['2', '60 s'], ['3', '120 s'], ['4', '240 s'], ['5', '480 s']]
  };

  const requirements = {
    columns: ['Requirement', 'What you must do', 'Use'],
    rows: [
      ['Insurance claim', 'Keep suspicion very low.', 'Oxygen, Potassium Nitrate, Kerosene. Methane removes suspicion.'],
      ['Accidental cause', 'Keep suspicion low (less strict than insurance).', 'Oxygen, Potassium Nitrate.'],
      ['Highly suspicious', 'Suspicion must be high.', 'Gasoline, Magnesium.'],
      ['High visibility', 'Use at least 4 visible fuels.', 'Diesel, Magnesium, Flamethrower. Easiest: 3 Diesel, then ignite with the Flamethrower.'],
      ['Total destruction', 'Destruction must reach 100%.', 'Thermite raises the destruction cap. Magnesium slows the firefighters.'],
      ['More than X%', 'Destruction must go past X% (X% itself is fine).', ''],
      ['Less than X%', 'Destruction must not go past X% (X% itself is fine).', 'Dampen near the end.'],
      ['Damage range', 'Destruction must be between X% and Y%.', ''],
      ['Specific accelerant', 'Only fuels of that type. Igniters and dampeners are always allowed.', 'Gaseous = Oxygen, Methane, Hydrogen.'],
      ['Plant evidence', 'Place the named item before the fire.', 'The item depends on the job.']
    ]
  };

  const unlocks = {
    columns: ['Unlocks', 'Kind', 'CS', 'Unique job', 'How to clear it'],
    rows: [
      ['Chase Swindlehurst', 'Contact', '1', 'Shack - Cut to the Chase', 'A few cans of Gasoline.'],
      ['Marvelous Mudenda', 'Contact', '5', 'Bordello - Hell Fire', '3-4 cans of Gasoline.'],
      ['Oxygen', 'Gaseous', '5', 'Dental Surgery - A Bitter Taste', 'Plenty of Gasoline.'],
      ['Potassium Nitrate', 'Solid', '10', 'Barn - The Bolted Horse', 'A lot of Oxygen, to start and to stoke.'],
      ['Diesel', 'Liquid', '15', 'Gas Station - Blown to High Heaven', 'Hard. Start with Oxygen and dampen right away, without waiting.'],
      ['Magnesium', 'Solid', '20', 'Firework Store - Sky High Prices', 'Gasoline + Potassium Nitrate, stoke with more Potassium Nitrate. Needs a Glitter Bomb.'],
      ['Methane', 'Gaseous', '25', 'Restroom - Shit Happens', 'You cannot fail this one.'],
      ['Molotov Cocktail', 'Igniter', '30', 'Recording Studio - Roast Beef', '4 Diesel and dampen near the end, or 1 Gasoline and stoke with Oxygen twice right after.'],
      ['Kerosene', 'Liquid', '40', 'Aircraft Hangar - Plane and Simple', 'Diesel or Methane to start, then some Oxygen.'],
      ['Denise David', 'Contact', '48', 'Bookies - Improving the Odds', 'Start with Diesel and Magnesium, stoke with Diesel.'],
      ['Ethan McChad', 'Contact', '50', 'Clock Tower - Cooking Time', 'Same as Denise David.'],
      ['Thermite', 'Solid', '50', 'Foundry - Hot Under the Collar', 'Burns slowly but help is far away. Take your time.'],
      ['Sand', 'Dampener', '60', 'Raceway - Finish Line', 'A little Kerosene and 1 Potassium Nitrate to start, then stoke with Methane.'],
      ['Hydrogen', 'Gaseous', '70', 'Homeless Camp - Bummed Out', '3 Kerosene, then stoke with Methane once or twice near the end.'],
      ['Flamethrower', 'Igniter', '80', 'Pest Control Hub - Bugging Me', 'A lot of Oxygen: start with 2-3, stoke near the end, maybe more than once.'],
      ['Fire Extinguisher', 'Dampener', '90', 'Fire Station - Stop, Drop and Lol', '2 Thermite and 3 Kerosene, ignite with the Flamethrower.']
    ]
  };

  const diminishing = {
    columns: ['Times done', 'Place', 'Stoke', 'Dampen'],
    rows: [
      ['1st', '133%', '200%', '200%'],
      ['2nd', '99.8%', '150%', '150%'],
      ['3rd', '74.8%', '112.5%', '112.5%'],
      ['4th', '56.1%', '84.4%', '84.4%'],
      ['5th', '42.1%', '63.3%', '63.3%'],
      ['6th', '31.6%', '47.5%', '47.5%']
    ]
  };
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Crimes 2.0 · guide</span>
  <h1>Arson</h1>
  <p class="lede">Take a job, break in, place fuel, light it, then manage the fire until the firefighters arrive. Arson is the most complex crime in Torn so far, and the most time-gated: there is only a fixed number of jobs each day.</p>
  <p style="margin-top:.6rem"><a href="{base}/crimes/">← Back to Crimes</a></p>
</div></header>

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>What you need</h2>
  <p class="lede">There are 15 tools and materials, plus some special items for certain jobs. Try to have two of each tool and a couple of hundred of each material, if you can afford it. Gasoline and Potassium Nitrate are cheap, and most of the rest comes easily from Search for Cash and Burglary.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3><Item name="Windproof Lighter" /> <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">enhancer</span></h3><p style="margin:.3em 0 0;color:var(--muted)">+5% CS and CE gains, and it takes the place of the normal Lighter. A unique find when you burgle the Secluded Cabin. You can lose it on a critical failure.</p></div>
    <div class="card"><h3>Time and nerve</h3><p style="margin:.3em 0 0;color:var(--muted)">A job moves fast once it starts. Have 2-3 free minutes and enough nerve to finish it. Keep 40+ nerve until you know what you are doing.</p></div>
    <div class="card"><h3>New jobs every day</h3><p style="margin:.3em 0 0;color:var(--muted)">A new set of jobs comes at 00:00 TCT. Every player gets the same jobs, but some only show at higher CS. When you finish them all, there are no more until the next day. Jobs you don't touch are gone at the end of the day.</p></div>
    <div class="card"><h3>Keep a job for tomorrow</h3><p style="margin:.3em 0 0;color:var(--muted)">Inquire on a job (0 nerve) and it stays until you do it. But if the same job would come again while you still hold it, the new one will not appear. Clear kept jobs soon.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Arson is a daily habit, not a binge. Do every job every day. A job you skip is money you will never see again."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Arson 101</span>
  <h2>The actions</h2>
  <p class="lede">Eight actions. CS gain shows how much skill each one gives compared to Breach. Collecting gives by far the most.</p>
  <DataTable columns={actions.columns} rows={actions.rows} caption="Arson: actions, nerve cost and CS gain" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">The fire</span>
  <h2>How the fire works</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Intensity</h3><p style="margin:.3em 0 0;color:var(--muted)">How strongly it burns. It sets the most damage the target can take. Shown by the fire's color, from yellow to red. <b>Don't stoke or dampen at red</b>; it will very likely crit.</p></div>
    <div class="card"><h3>Momentum</h3><p style="margin:.3em 0 0;color:var(--muted)">Unburned fuel, shown by how much the flames move. It pushes intensity up and burns away over time. Wait for it to die down before you stoke, or you may set yourself on fire.</p></div>
    <div class="card"><h3>Suspicion</h3><p style="margin:.3em 0 0;color:var(--muted)">How much the fire looks like it was set on purpose. Every fuel adds some, except Methane, which removes it. For insurance jobs, the limit is about 3 × the number of areas.</p></div>
    <div class="card"><h3>Visibility</h3><p style="margin:.3em 0 0;color:var(--muted)">How easy the fire is to see. Higher visibility means the firefighters are called sooner. Only Diesel, Magnesium and the Flamethrower raise it, and nothing lowers it.</p></div>
    <div class="card"><h3>Destruction</h3><p style="margin:.3em 0 0;color:var(--muted)">The damage done, shown by the red bar. It grows until it meets intensity, then stops until you add fuel. Thermite raises how fast it can grow.</p></div>
    <div class="card"><h3>Areas</h3><p style="margin:.3em 0 0;color:var(--muted)">Each flame on the side is one area (1 to 5). Each area burns on its own, so total destruction needs every area at full intensity. Gas fuels spread the most, solids the least.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Targets</span>
  <h2>Flammability and rurality</h2>
  <p class="lede">The location sets both. Old wooden buildings burn faster than concrete or metal. Busy places and business centers get help fast, while remote or industrial places give you time to work.</p>
  <div class="grid2" style="margin-top:1rem;align-items:start">
    <DataTable columns={flammability.columns} rows={flammability.rows} caption="Flammability: how fast the target burns" />
    <DataTable columns={rurality.columns} rows={rurality.rows} caption="Rurality: how long the firefighters take to arrive" />
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Jobs</span>
  <h2>Job requirements</h2>
  <p class="lede">Most jobs have none. If a job has requirements, you must meet all of them or you get nothing.</p>
  <DataTable columns={requirements.columns} rows={requirements.rows} caption="Arson: job requirements and what to use" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Firestarting</span>
  <h2>Starters, ignition and dampening</h2>
  <p class="lede">Fuels placed as starters spread 25% further. Use no more than 5 starters in total.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Liquid starters <span class="tag" style="color:var(--muted);background:var(--surface)">Gasoline, Diesel, Kerosene</span></h3><p style="margin:.3em 0 0;color:var(--muted)">The best and safest choice. Use up to the number of areas + 1 (max 5). Diesel also lowers the crit chance on ignition.</p></div>
    <div class="card"><h3>Solid starters <span class="tag" style="color:var(--muted);background:var(--surface)">Potassium Nitrate, Magnesium, Thermite</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Good with liquids on small targets (3 areas or fewer). Don't use them alone, with gas, or two at once unless you add Diesel; the crit chance goes up a lot.</p></div>
    <div class="card"><h3>Gas starters <span class="tag" style="color:var(--muted);background:var(--surface)">Oxygen, Methane, Hydrogen</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Usually better for stoking. Hydrogen is the exception and is best as a starter. If you use Methane, put it last so it clears the suspicion.</p></div>
    <div class="card"><h3>Igniters</h3><p style="margin:.3em 0 0;color:var(--muted)"><b>Lighter</b>: simple; crit chance depends on how much fuel you placed. <b>Molotov</b> (CS 30): starts with more momentum, like an extra Gasoline. <b>Flamethrower</b> (CS 80): random and risky, good for high visibility.</p></div>
    <div class="card"><h3>Dampeners</h3><p style="margin:.3em 0 0;color:var(--muted)"><b>Blanket</b>: not used up, but crits about 1 in 5 at low CS. <b>Sand</b> (CS 60): twice as strong and half as risky. <b>Fire Extinguisher</b> (CS 90): about as strong as Sand and safer, but costs three times as much.</p></div>
    <div class="card"><h3>Stoking</h3><p style="margin:.3em 0 0;color:var(--muted)">Fuels that are safe as starters can be dangerous when stoking. The Lighter adds a little (good for hitting an exact %). A Molotov boosts the weakest area. The Flamethrower is the riskiest, so use it early, while the fire is small.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">The clock</span>
  <h2>Firefighters and pay</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>First responders</h3><p style="margin:.3em 0 0;color:var(--muted)">After the fire starts, they are called after a random time (rurality and visibility change this), then travel for the response time. The siren blinks faster as they get close. The closer they are, the higher your risk of <b>jail</b> when you stoke or dampen. When they arrive, you can't do anything more.</p></div>
    <div class="card"><h3>Magnesium trick</h3><p style="margin:.3em 0 0;color:var(--muted)">Firefighters make the fire die 5× faster. Each Magnesium you used halves that. Several Magnesium and high momentum when they arrive can keep the fire at full for a long time. This is useful for total destruction in busy places.</p></div>
    <div class="card"><h3>How pay works</h3><p style="margin:.3em 0 0;color:var(--muted)">No damage requirement: pay × destruction (90% destroyed = 90% pay). Less than X%: pay goes down if you stop short (22% on a 25% job = 88% pay). More than X%, damage range and total destruction: full pay. Then ±10% random.</p></div>
    <div class="card"><h3>Is it worth it?</h3><p style="margin:.3em 0 0;color:var(--muted)">Pay is modest. If you play only for profit, about $4-5k per nerve is easy, but you have to limit which materials you use.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Leveling</span>
  <h2>Raising your Crime Skill</h2>
  <p class="lede">Place, stoke and dampen give less CS each time you repeat them on the same job. Try not to do the same action more than 3 times.</p>
  <DataTable columns={diminishing.columns} rows={diminishing.rows} caption="CS gain for repeated actions on one job" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>The efficient path <span class="tag" style="color:var(--muted);background:var(--surface)">less nerve</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Start big: 1 Gasoline or Diesel per area, plus 1 solid if the target needs it. Stoke only if the job needs it. Take as few actions as you can, because Collect gives the most CS. To save more nerve, skip jobs that force you to use several fuels (total destruction, high suspicion or visibility, more than X%).</p></div>
    <div class="card"><h3>The fast path <span class="tag" style="color:var(--muted);background:var(--surface)">more CS per day</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Start small with 1 liquid fuel, then stoke and dampen 3-6 times each. On targets with 2+ areas, wait 5 seconds after ignition, then dampen each side area (never the main one), stoke with a liquid, and repeat. On 1-area targets don't dampen at all, because it will likely crit. It needs a lot of nerve, so a nerve company like a pub helps. With less nerve, do 2 places, 2 stokes and 2 dampens.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Failed a unique job? It comes back tomorrow. Some people fail them on purpose, so they get an extra job each day to grind. Just don't burn your expensive fuel doing it."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Progression</span>
  <h2>Uniques: contacts and materials</h2>
  <p class="lede">16 uniques, and every one is about progress. Clear the job and you get the unique; there is no luck. 4 unlock contacts with new, better-paying jobs, and 12 unlock new materials. If you fail a unique job, it comes back the next day.</p>
  <DataTable columns={unlocks.columns} rows={unlocks.rows} caption="Arson: unique jobs, what they unlock and how to clear them" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Hotshot</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Arsonal</h3><p style="margin:.3em 0 0;color:var(--muted)">Use every igniter, fuel and dampener at least once. The last one unlocks at CS 90.</p></div>
    <div class="card"><h3>Cooking With Gas</h3><p style="margin:.3em 0 0;color:var(--muted)">Destroy a size 5 target in 30 seconds or less. You need Thermite (CS 50): about 5 Thermite plus Kerosene, with a Molotov or Oxygen ready for a side area that won't reach 100%. You get it when the fire dies, even if the job fails.</p></div>
    <div class="card"><h3>Vandalism medals</h3><p style="margin:.3em 0 0;color:var(--muted)">Arson counts toward the Vandalism crime medals, together with Graffiti.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Tools</span>
  <h2>Scripts</h2>
  <p class="lede"><b>Arson Bang for Buck</b> shows how to clear each job and how much each one pays per nerve. We reviewed it and rated it low risk. See the <a href="{base}/scripts/">Scripts page</a> for the review and install link.</p>
</div></section>

<footer><div class="wrap">
  <strong>Arson guide.</strong> From the in-depth Arson guide by <strong>Emforus [2535044]</strong>, built on player logs. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>
