<script>
  import CrimeHero from '$lib/CrimeHero.svelte';
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Item from '$lib/Item.svelte';

  const tiers = {
    columns: ['Risk level', 'Marks', 'CS gain', 'Success rate', 'When to do them'],
    rows: [
      ['Safe', 'Drunk Man, Drunk Woman, Homeless Person, Junkie, Elderly Man, Elderly Woman', '100%', '~97.5%', 'From the start. You can stay here to CS 100, but it is slow.'],
      ['Moderately unsafe', 'Classy Lady, Laborer, Postal Worker, Young Man, Young Woman, Student', '150%', '~92.5%', 'From CS 10. The best group for steady growth.'],
      ['Unsafe', 'Rich Kid, Sex Worker, Thug', '200%', '~85%', 'From CS 40, and only when they are distracted.'],
      ['Risky', 'Jogger, Businessman, Businesswoman, Gang Member, Mobster', '250%', '~75%', 'From CS 50 if you take risks. Fairly good near CS 65. Expect many crits.'],
      ['Dangerous', 'Cyclist', '300%', '~50%', 'From CS 80. Wait until CS 85-90 to be careful.'],
      ['Very dangerous', 'Police Officer', '350%', '<10%', 'Avoid. Tests at CS 90-95 still say no. Max your skill first.']
    ]
  };

  const builds = {
    columns: ['Build', 'Where you see it'],
    rows: [
      ['Average', 'The most common build.'],
      ['Athletic', 'Very common in joggers, cyclists and thugs.'],
      ['Skinny', 'More common in women.'],
      ['Muscular', 'More common in laborers, sex workers and others.'],
      ['Heavyset', 'Fairly uncommon. Mostly seen in civilians.']
    ]
  };

  const marks = {
    columns: ['Mark', 'Risk', 'Unique', 'Statuses', 'Advice'],
    rows: [
      ['Drunk Man', 'Safe', '6x Bottle of Beer', 'Distracted, Stumbling', 'Avoid when distracted or muscular.'],
      ['Drunk Woman', 'Safe', '2x Bottle of Pumpkin Brew', 'Distracted, Stumbling', 'Avoid when distracted.'],
      ['Elderly Man', 'Safe', '1x Bag of Tootsie Rolls', 'Walking', 'Always safe.'],
      ['Elderly Woman', 'Safe', '1x Opium', 'Walking', 'Always safe.'],
      ['Homeless Person', 'Safe', '4x Morphine, 1x Soap on a Rope, 3x Brick, 1x Toothbrush', 'Begging, Loitering', 'Avoid when loitering.'],
      ['Junkie', 'Safe', '1x Ecstasy, 1x LSD, 1x PCP, 1x Speed', 'Loitering, Stumbling', 'Avoid when loitering or muscular.'],
      ['Young Man', 'Moderately unsafe', '1x Ketamine', 'Walking, On Phone, Listening to music', 'Always safe.'],
      ['Young Woman', 'Moderately unsafe', '1x Ecstasy', 'Walking, Distracted, On Phone, Listening to music', 'Best when on phone.'],
      ['Student', 'Moderately unsafe', '1x Laptop, 1x Cannabis, 1x Coin Purse, 1x Cell Phone', 'Walking, On Phone, Listening to music, Running', 'Best when on phone. Avoid when athletic.'],
      ['Classy Lady', 'Moderately unsafe', '1x Pair of High Heels', 'Walking, On Phone', 'Generally bad. Best when heavyset.'],
      ['Laborer', 'Moderately unsafe', '1x Megaphone', 'Walking, Distracted, On Phone', 'Avoid when distracted.'],
      ['Postal Worker', 'Moderately unsafe', '1x Lottery Voucher', 'Walking, Distracted', 'Low data. Best when walking?'],
      ['Rich Kid', 'Unsafe', '1x Six-Pack of Alcohol', 'Walking, On Phone, Listening to music', 'Low data. Best when walking? Best when skinny or heavyset.'],
      ['Sex Worker', 'Unsafe', '1x Thong', 'Distracted, On Phone, Soliciting', 'Best when on phone.'],
      ['Thug', 'Unsafe', '1x PCP, 1x Cut-Throat Razor, 1x Billfold', 'Walking, Loitering, Running', 'Best when running. Avoid when muscular.'],
      ['Businessman', 'Risky', '2x Speed', 'Walking, On Phone', 'Avoid when walking or skinny.'],
      ['Businesswoman', 'Risky', '1x Glasses', 'Walking, On Phone', 'Low data. Avoid when heavyset? Avoid walking.'],
      ['Gang Member', 'Risky', '1x each Spray Can: Red, Purple, Blue, 1x Wire Cutters', 'Loitering', 'Avoid when muscular.'],
      ['Jogger', 'Risky', '1x Can of Crocozade', 'Walking, Jogging', 'Best when walking.'],
      ['Mobster', 'Risky', 'Money ($561,000?-$772,000?). CS 100 only.', 'Walking', 'Avoid entirely, ideally.'],
      ['Cyclist', 'Dangerous', '1x Mountain Bike. CS 100 only.', 'Cycling', 'Very good from CS 80. Can give Xanax.'],
      ['Police Officer', 'Very dangerous', '1x Billfold, 1x Police Badge', 'Walking, Running', 'Avoid, even at max skill.']
    ]
  };
  const kit = [
    {"name": "Cut-Throat Razor", "enhancer": true, "where": "Bits 'n' Bobs · Barbershop · Thug", "text": "+5% CS and CE. It unlocks some outcomes, and you need it for several uniques."}
  ];
</script>

<CrimeHero title="Pickpocketing" lede="Marks walk past for a few seconds. You read who they are, what they are doing and their body type, then choose to strike or wait. It is fast and needs quick choices. The money is low, but the uniques are good." kitTitle="What you need" items={kit} note="Nothing else is needed. A unique find when shoplifting Bits 'n' Bobs, burgling the Barbershop or pickpocketing the Thug." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>What you need</h2>
  <p class="lede">You need nothing to start. Only one item helps, the Cut-Throat Razor (see the top of the page), and it is worth getting.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Marks are global</h3><p style="margin:.3em 0 0;color:var(--muted)">Every player sees the same marks. If you pickpocket a mark, it does not go away for anyone else. New marks appear and old ones leave every few seconds.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Pickpocketing 101</span>
  <h2>Three things decide your success</h2>
  <p class="lede">There are 22 marks, and all of them are open from the start. In order of importance, look at: who the mark is, what they are doing (status), and their body type (build).</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>1. The mark</h3><p style="margin:.3em 0 0;color:var(--muted)">The biggest factor for success and for loot. Harder marks give more CS. As your CS goes up, every mark gets less dangerous.</p></div>
    <div class="card"><h3>2. The status</h3><p style="margin:.3em 0 0;color:var(--muted)">The wrong status can cut your success rate by 10% or more. Some uniques also need a certain status.</p></div>
    <div class="card"><h3>3. The build</h3><p style="margin:.3em 0 0;color:var(--muted)">Less important than status, but it still matters. A few outcomes need a certain build.</p></div>
    <div class="card"><h3>Status rules</h3><p style="margin:.3em 0 0;color:var(--muted)">The less aware the mark, the easier. Phone and music are good. Moving marks can go either way: cyclists and joggers are better walking, the Thug is better running. Ask yourself: can you keep up and still not be seen?</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Marks</span>
  <h2>Risk levels</h2>
  <p class="lede">CS gain is compared to the safest marks (100%). Success rates were measured at about CS 20-30 and mostly ignore status, so use them as a rough guide. Some samples are small.</p>
  <DataTable columns={tiers.columns} rows={tiers.rows} caption="Pickpocketing: mark risk levels, CS gain and success rate" />
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Young people on their phones are your main work. They show up all the time, they don't look up, and they give 50% more CS than a drunk. Leave the cops alone."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Body type</span>
  <h2>Builds</h2>
  <p class="lede">There are five builds. Not every mark has all of them.</p>
  <DataTable columns={builds.columns} rows={builds.rows} caption="Pickpocketing: builds" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Risk</span>
  <h2>Critical failures</h2>
  <p class="lede">Any mark can crit. It is unknown if status changes the crit chance, but for now it does not seem to.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Penalties</h3><p style="margin:.3em 0 0;color:var(--muted)">Lose life (9 to 1,672 logged). Jail (37 minutes to 6 hours 11 minutes logged, about 1 hour 20 minutes on average). Hospital (5 hours 28 minutes to 11 hours 23 minutes logged). Civilians give shorter jail time than police.</p></div>
    <div class="card"><h3>CS loss grows with the mark</h3><p style="margin:.3em 0 0;color:var(--muted)">A crit takes about 10 times the CS that mark would give you. So a crit on a Police Officer costs about 3 times as much CS as a crit on an Elderly Woman. Hard marks too early will slow you down a lot.</p></div>
    <div class="card"><h3>Self-hospital</h3><p style="margin:.3em 0 0;color:var(--muted)">Logged hospital stays came from Cyclists (about 5 hours) and Thugs (about 11 hours). If you want a long hospital stay and don't care about CS, these two are an option.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Leveling</span>
  <h2>Raising your Crime Skill</h2>
  <p class="lede">Move to harder marks as your CS grows. When your current marks give too little CS, step up one level. The guide's advice is steady growth, not big risks.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>CS 1-20 <span class="tag" style="color:var(--muted);background:var(--surface)">safe</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Start with safe marks. Move up at CS 10-20.</p></div>
    <div class="card"><h3>CS 10-70 <span class="tag" style="color:var(--muted);background:var(--surface)">moderately unsafe</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Young Man and Young Woman are the best: high success and they appear often. Good growth even with fails and crits.</p></div>
    <div class="card"><h3>CS 35-90 <span class="tag" style="color:var(--muted);background:var(--surface)">unsafe</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Try them from CS 40. Only hit marks that are distracted.</p></div>
    <div class="card"><h3>CS 65+ and 80+ <span class="tag" style="color:var(--muted);background:var(--surface)">risky, dangerous</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Risky marks get fairly good near CS 65. Cyclists are worth it from CS 80, and they can drop Xanax.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Uniques</span>
  <h2>Every mark, one unique each</h2>
  <p class="lede">22 uniques, one per mark. All but two are open at any time: the Cyclist's and the Mobster's need CS 100. The Laborer's unique changed from a Box of Medical Supplies to a Megaphone. The advice comes from the author's own play and limited data, so expect changes. A question mark means the guide was not sure.</p>
  <DataTable columns={marks.columns} rows={marks.rows} caption="Pickpocketing: every mark, its unique, statuses and advice" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Money</span>
  <h2>Loot</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Normal loot</h3><p style="margin:.3em 0 0;color:var(--muted)">Income is low. You mostly get billfolds and cardholders. These can rarely hold a Lawyer's Business Card, Feathery Hotel Coupon or Business Class Ticket, so they are a fairly easy source of those items.</p></div>
    <div class="card"><h3>Uniques</h3><p style="margin:.3em 0 0;color:var(--muted)">The uniques are fairly good money. The crime also needs much less nerve than Burglary.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Pocketeer</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Pig Rustler</h3><p style="margin:.3em 0 0;color:var(--muted)">Pickpocket a <b>running</b> Police Officer and get the <Item name="Police Badge" />. Very hard: about 10% success. You can wait for high CS, or try running cops at CS 1, where you can't lose CS. The author would not do it, but it works if you only want the bar.</p></div>
    <div class="card"><h3>Slim Pickings</h3><p style="margin:.3em 0 0;color:var(--muted)">Pickpocket 10 Skinny marks in a row with success.</p></div>
    <div class="card"><h3>Theft medals</h3><p style="margin:.3em 0 0;color:var(--muted)">Every try counts toward the Theft crime medals, with Search for Cash, Shoplifting and Burglary.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Want the badge with no pain? Hit running cops while you are still CS 1. You have no skill to lose. Only do it if you don't care about your CE."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Tools</span>
  <h2>Scripts</h2>
  <p class="lede"><b>Pickpocketing Target Filter</b> highlights marks by type and timing and greys out the ones you don't want. <b>Crime Morale</b> gives pickpocketing suggestions. We reviewed both and rated them low risk. See the <a href="{base}/scripts/">Scripts page</a> for the reviews and install links.</p>
</div></section>

<footer><div class="wrap">
  <strong>Pickpocketing guide.</strong> From the in-depth Pickpocketing guide by <strong>Emforus [2535044]</strong>, built on about 8,400 player logs. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16358739" target="_blank" rel="noopener">Pickpocketing forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>
