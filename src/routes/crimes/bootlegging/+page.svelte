<script>
  import { base } from '$app/paths';
  import CrimeHero from '$lib/CrimeHero.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';
  import Item from '$lib/Item.svelte';

  const options = {
    columns: ['Option', 'What it does', 'Unlocks at'],
    rows: [
      ['Copy DVDs', 'Turn blank DVDs into copies of a genre. Copies take time to finish.', 'Start'],
      ['Sell DVDs', 'Sell your copies for cash. All unique finds come from here.', 'Start'],
      ['Online store', 'Build the store, then it sells your DVDs over time. You collect the money.', 'CS 50 + two courses']
    ]
  };

  const ratio = {
    columns: ['Genre', 'Copy this many', 'Note'],
    rows: [
      ['Action', '10', 'Sells the most'],
      ['Fantasy', '7', ''],
      ['Comedy', '7', 'Less needed when you sell yourself. The online store sells more.'],
      ['Drama', '5.5', ''],
      ['Thriller', '4', ''],
      ['Horror', '3', ''],
      ['Romance', '3', ''],
      ['Sci-Fi', '2', 'Sells the least']
    ]
  };

  const uniques = {
    columns: ['CS', 'Unique find'],
    rows: [
      ['55', 'Special ammunition'],
      ['70', 'Lottery voucher'],
      ['85', 'Prayer beads'],
      ['100', 'Erotic DVD']
    ]
  };

  const crits = {
    columns: ['Action', 'What a critical failure can do'],
    rows: [
      ['Copying', 'Jail. Lose blank DVDs, your computer or laptop, some money, or your High-Speed Drive.'],
      ['Selling', 'Jail. Lose some life or some DVDs. Big CS loss.'],
      ['Online store', 'Lose all the money waiting to be collected (confirmed). Lose the whole store (only seen in the logs, nobody has had it).']
    ]
  };

  const csGain = {
    columns: ['Action', 'CS gain compared to one copy'],
    rows: [
      ['Copy', '1x'],
      ['Sell', 'About 4x'],
      ['Store setup (success)', 'About 6x, but it costs 10 nerve'],
      ['Store collect', 'About half, or less'],
      ['Store running', 'Some CS over time. One player at CS 93 said +3% in 24 hours.']
    ]
  };
  const kit = [
    {"name": "Personal Computer", "where": "Super Store", "text": "Needed to copy. A Laptop works too."},
    {"name": "Blank DVDs", "where": "Super Store", "text": "Used up as you copy. You can add several packs at once."},
    {"name": "High-Speed Drive", "enhancer": true, "text": "+5% CS gain and copies twice as fast. Not needed."}
  ];
</script>

<CrimeHero title="Bootlegging" lede="Copy DVDs, then sell them. At CS 50 you can build an online store that sells your DVDs for you over time. It is not a big earner, but it is easy, and it is the best crime for Counterfeiting medals." kitTitle="What you need" items={kit} note="A crit while copying can take your computer or your High-Speed Drive." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>Getting set up</h2>
  <p class="lede">Buy a computer and some blank DVDs at the Super Store and you can start. The crime page has three options.</p>
  <DataTable columns={options.columns} rows={options.rows} caption="Bootlegging: the three options" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3><Item name="High-Speed Drive" /> <span class="tag" style="color:var(--c-fixer);background:var(--fixer-soft)">enhancer</span></h3><p style="margin:.3em 0 0;color:var(--muted)">It once cost about 17M. Now it costs less than 100k and drops from many places: searching the Junkyard (crushing rate below 25%), Graffiti in City Center, Shoplifting the Super Store, and burgling an apartment.</p></div>
    <div class="card"><h3>Education</h3><p style="margin:.3em 0 0;color:var(--muted)">CMT1520: Introduction to Computing and CMT2230: Web Design and Development, both in the Computer Science bachelor. You need them for the online store and its honor bar, not for CS.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Step 1</span>
  <h2>Copying DVDs</h2>
  <p class="lede">Click the DVD icon to add blank DVDs, then pick a genre. Every genre gives the same CS and has the same success rate. Only selling makes the genre matter.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Copies per try</h3><p style="margin:.3em 0 0;color:var(--muted)">Early on you get 3-5 copies per try. On average this goes up by about 1.1 every 5 CS (0.22 per level), all the way to CS 100. The gap between the lowest and highest result also grows, from 3 to almost 20.</p></div>
    <div class="card"><h3>Copy speed</h3><p style="margin:.3em 0 0;color:var(--muted)">Every 5 CS levels, each DVD takes 2 seconds less to copy. The High-Speed Drive halves the copy time.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Step 2</span>
  <h2>Selling DVDs</h2>
  <p class="lede">Have a few copies of every genre. With more variety you sell more DVDs at once, so you get more CS and more money. Your CS only changes how many DVDs you sell at a time. On average a sale made about $2,000.</p>
  <DataTable columns={ratio.columns} rows={ratio.rows} caption="Rough ratio to copy, so no genre runs out first" />
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Selling is where the skill is, and where the pain is. A crit on a sale costs CS based on the nerve you spent. I saw a guy drop from CS 13 to CS 8 on one bad sale. Another went from 7 to 1."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Uniques</span>
  <h2>Unique finds</h2>
  <p class="lede">There are 4, and all come from selling. Once you reach the CS, every sale has a chance to give the find. Stock a lot of DVDs so you can sell many times when one opens up.</p>
  <DataTable columns={uniques.columns} rows={uniques.rows} caption="Bootlegging: unique finds and the CS they need" />
  <p style="margin-top:1rem;color:var(--muted)">Items: <Item name="Lottery Voucher" />, <Item name="Erotic DVD" />.</p>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">CS 50</span>
  <h2>The online store</h2>
  <p class="lede">You need CS 50 and both courses. First you build the store, then it sells your stock slowly over time. You collect the money for 1 nerve.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Building it</h3><p style="margin:.3em 0 0;color:var(--muted)">Each try costs 10 nerve and adds 1-9% progress. Success seems to be around 80%. Players report 20 to 40 tries to launch it.</p></div>
    <div class="card"><h3>Customers</h3><p style="margin:.3em 0 0;color:var(--muted)">More customers means more sales. Growth seems exponential: the more customers you have, the faster you get new ones. The only known way to grow is to never run out of any genre.</p></div>
    <div class="card"><h3>Turning it off</h3><p style="margin:.3em 0 0;color:var(--muted)">Click the dial next to the collect button to pause the store. Use this when you want to stockpile DVDs to sell yourself.</p></div>
    <div class="card"><h3>When to collect</h3><p style="margin:.3em 0 0;color:var(--muted)">No clear best time. The author waits a few hours, but it does not seem to matter much.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Risk</span>
  <h2>Critical failures</h2>
  <DataTable columns={crits.columns} rows={crits.rows} caption="Bootlegging: critical failures by action" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Leveling</span>
  <h2>Raising your Crime Skill</h2>
  <p class="lede">Selling gives the most CS for your nerve. A sale is worth about 4 copies.</p>
  <DataTable columns={csGain.columns} rows={csGain.rows} caption="Bootlegging: CS gain per action" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>The fastest path</h3><p style="margin:.3em 0 0;color:var(--muted)">1. Copy a mix of genres, using the ratio above.<br>2. Sell when you have a lot of DVDs of different genres.<br>3. Don't open the online store until you are happy with your CS, or until you go for its honor bar.</p></div>
    <div class="card"><h3>Why skip the store?</h3><p style="margin:.3em 0 0;color:var(--muted)">The store sells your DVDs for you. Every DVD it sells is one you can't sell for CS, so you would need to copy even more.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Money</span>
  <h2>Is it worth it?</h2>
  <p class="lede">Not for profit. The store sells DVDs at $20 each. The author, at CS 100, worked it out at about $500 for 2 nerve, or about $50k a day from natural nerve regen alone. The main reason to build the store is its honor bar.</p>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Box Office</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Online Entrepreneur</h3><p style="margin:.3em 0 0;color:var(--muted)">Get 10,000 customers in the online store. Keep it stocked with every genre for about 15-16 days. The store sells around 20,000 DVDs on the way.</p></div>
    <div class="card"><h3>Cinephile</h3><p style="margin:.3em 0 0;color:var(--muted)">Sell 10,000 DVDs of each genre. Direct sales and store sales both count. Start early, and do the slow genres first. Click the banner on the Bootlegging page to see your progress.</p></div>
    <div class="card"><h3>Counterfeiting medals</h3><p style="margin:.3em 0 0;color:var(--muted)">Every Bootlegging try counts, whatever the nerve. That makes it the best crime for these medals. All 15 need 10,000 crimes, and a 1-nerve store collect counts too.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Want the Counterfeiting medals cheap? Put a few DVDs in to copy, and collect from the store every time one sells. One nerve, one crime on your record."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Tools</span>
  <h2>Scripts</h2>
  <p class="lede">We reviewed two Bootlegging scripts and recommend neither. <b>Bootlegging Auto Genre Script</b> picks the genre you need most, but it does the click for you, which breaks the rules. We rated it high risk. <b>Quick DVD</b> adds a link that copies the least-stocked genre. It is a grey area and may no longer work. We rated it medium risk. See the <a href="{base}/scripts/">Scripts page</a> for the reviews.</p>
</div></section>

<footer><div class="wrap">
  <strong>Bootlegging guide.</strong> From the in-depth Bootlegging guide by <strong>Emforus [2535044]</strong>, built on about 17,500 player logs. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16341811" target="_blank" rel="noopener">Bootlegging forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>

