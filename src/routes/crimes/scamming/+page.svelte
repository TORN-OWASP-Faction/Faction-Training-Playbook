<script>
  import CrimeHero from '$lib/CrimeHero.svelte';
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';

  const education = {
    columns: ['Course', 'Bachelor', 'What it unlocks'],
    rows: [
      ['Interpersonal Dynamics', 'Psychology', 'Shows the range where the pip can land before you send a response.'],
      ['Web Design and Development', 'Computer Science', 'The Phisher: collects email addresses slowly, on its own.'],
      ['Web Security and Penetration Testing', 'Computer Science', 'Data breach outcomes when you farm: 700-1,000 addresses about 10% of the time.'],
      ['Automated Data Mining & Processing', 'Computer Science', 'The Scraper: collects email addresses fast, on its own.']
    ]
  };

  const collectors = {
    columns: ['Tool', 'Addresses per day', 'Lifespan'],
    rows: [
      ['Phisher', '50-400', 'More than a week, then it stops'],
      ['Scraper', 'About 1,000', 'Can break after 2-4 days']
    ]
  };

  const categories = {
    columns: ['Scam', 'CS', 'Difficulty', 'Average payout', 'Notes'],
    rows: [
      ['Delivery', '1', 'Very Easy', '$560', 'Few reds, rarely concern, very wide reward zones. Great for early progress.'],
      ['Family', '1', 'Easy', '$15,460', 'Some wide red and sensitivity zones, so plan a little. Wide reward zones.'],
      ['Prize', '1', 'Very Easy', '$8,825', 'Only fail, temptation and safe zones. Quite a lot of red, so be careful.'],
      ['Charity', '20', 'Easy', '$25,615', 'Few reds but many hazards, mostly hesitation. High reward is thin. Safe if you aim for medium reward.'],
      ['Tech support', '20', 'Moderate', '$32,800', 'A lot of concern, which wastes nerve. Few reds. Reward zones are a fair size.'],
      ['Vacation', '40', 'Easy', '$37,950', 'Many reds, but just as many temptation zones. No concern. Use temptation to move fast.'],
      ['Tax', '40', 'Moderate', '$80,000', 'Slim zones, mostly neutral cells. Some red, concern and hesitation. Small reward zones. Can need a lot of nerve.'],
      ['Advance-fee', '60', 'Difficult', '$67,000', 'Some red and a lot of sensitivity. Temptation helps. Slim reward zones. Pays less than Job and Tax.'],
      ['Job', '60', 'Moderate', '$93,000', 'A lot of hesitation, some red. Few small safe zones. Reward zones only 7-8 cells wide. Good pay, but takes nerve.'],
      ['Romance', '80', 'Difficult', '$110,000', 'Mostly sensitivity, with some temptation and other hazards. Some fail cells and very thin reward zones.'],
      ['Investment', '80', 'Challenging', '$230,000', 'A lot of red and concern, thin reward zones. The best pay: up to 2.5M with the right mark.']
    ]
  };

  const responses = {
    columns: ['Response', 'Also called', 'What it does'],
    rows: [
      ['Strong Forward', 'Strong, Green', 'Moves the pip far to the right. Good for speed and to jump over hazards.'],
      ['Soft Forward', 'Soft, Blue', 'Moves the pip a little to the right. Good for small steps and to stop short of hazards.'],
      ['Backward', 'Back, Red', 'Moves the pip a little to the left. Use it to reach a better reward zone or to line up your next move.'],
      ['Accelerate', 'Accel, Boost, Yellow', 'Does not move the pip. Makes the next response move further. Stacks up to 5 times. Any other response resets it.'],
      ['Capitalize', '-', 'Only works when the pip is on a reward zone. Ends the scam and pays you.']
    ]
  };

  const capitalization = {
    columns: ['Capitalization', 'Cash multiplier', 'CS gain multiplier'],
    rows: [
      ['Low', '100%', '150%'],
      ['Medium', '200%', '250%'],
      ['High', '300%', '350%']
    ]
  };

  const cells = {
    columns: ['Cell', 'Result', 'What happens'],
    rows: [
      ['Neutral', 'Success', 'Nothing happens.'],
      ['Low / Medium / High Reward', 'Success', 'You can capitalize for a low, medium or high payout.'],
      ['Temptation', 'Success', 'Shifts the pip right to a safe cell (neutral or reward). It skips hazards and avoids fail cells when it can.'],
      ['Concern', 'Soft fail', 'You must resolve it: 3 nerve per try, and it often fails. Once resolved, the zone is removed.'],
      ['Sensitivity', 'Soft fail', 'Shifts the pip left to a neutral cell. It skips reward zones and hazards on the way.'],
      ['Hesitation', 'Soft fail', 'The target is blocked for 1-2 hours. Then the zone is removed.'],
      ['Fail', 'Critical failure', 'You lose the target. The worst outcome.']
    ]
  };

  const marks = {
    columns: ['Mark', 'Cash multiplier'],
    rows: [
      ['Young Adult', '100%'],
      ['Middle-Aged', '125%'],
      ['Senior', '150%'],
      ['Professional', '300%'],
      ['Affluent', '1,000%']
    ]
  };

  const csGain = {
    columns: ['Action', 'CS gain (response = 100%)', 'Notes'],
    rows: [
      ['Farm emails', '150%', 'Costs 8 nerve. The least efficient way to gain CS.'],
      ['Send a spam wave', '200%', 'Cannot fail. Second least efficient.'],
      ['Send a response', '100%', 'Persuading gives the most CS per nerve.'],
      ['Capitalize', '150% / 250% / 350%', 'Low / medium / high capitalization.']
    ]
  };
  const kit = [
    {"name": "Ergonomic Keyboard", "enhancer": true, "where": "Super Store · CS 60", "text": "+5% CS and CE. A unique find when shoplifting the Super Store with the checkpoint off."}
  ];
</script>

<CrimeHero title="Scamming" lede="Collect email addresses, send spam, then talk a mark into paying you. The last step is a small game: you move a pointer (the pip) along a bar of 50 colored cells and try to land on green. It is the most complex crime so far, and it rewards players who take it slow and think before each move." kitTitle="What you need" items={kit} note="No tools and no materials. Education courses matter much more here than in other crimes." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>What you need</h2>
  <p class="lede">No tools and no materials. The only item is the enhancer. Education courses matter much more here than in other crimes.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Three days per target</h3><p style="margin:.3em 0 0;color:var(--muted)">A target disappears 3 days after your last action on it. The timer starts when the target appears, and reading it does not count as an action. Finish your targets in time.</p></div>
  </div>
  <DataTable columns={education.columns} rows={education.rows} caption="Scamming: education courses that help" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Step 1</span>
  <h2>Email farming</h2>
  <p class="lede">Email addresses are your pool of possible victims. Farming costs 8 nerve. Sometimes you pay $250 to $3,000 for a batch of 200-700 addresses.</p>
  <div class="grid2" style="margin-top:1rem;align-items:start">
    <div class="card"><h3>Phisher and Scraper</h3><p style="margin:.3em 0 0;color:var(--muted)">After you finish the course, each farming try has a chance to start the tool. It can take more than a dozen tries. Once running, it collects addresses without you. It starts slow, speeds up a lot, then slows down near the end of its life. When it stops, farm again to reset it.</p></div>
    <DataTable columns={collectors.columns} rows={collectors.rows} caption="Passive email collectors" />
  </div>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>How many addresses?</h3><p style="margin:.3em 0 0;color:var(--muted)">Early on, 10,000 is enough if you send every spam category each day. 20,000 if you have spare nerve and use refills. From CS 40, aim for 100,000 or more. Get them after the Computer Science courses, so it costs less nerve.</p></div>
    <div class="card"><h3>Then stop farming</h3><p style="margin:.3em 0 0;color:var(--muted)">Farming is the worst way to gain CS. Get 10-20k addresses, let the Phisher and Scraper do the rest, and spend your nerve on real scams.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Step 2</span>
  <h2>Spam waves</h2>
  <p class="lede">Pick a category and send spam to all your addresses. Then wait for replies. Each reply is a target. The category sets the payout, the difficulty and a CS gain multiplier. Early on, any category is fine.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>More is faster</h3><p style="margin:.3em 0 0;color:var(--muted)">More addresses and more waves mean more replies, sooner. You can send several waves at once, of the same or different categories.</p></div>
    <div class="card"><h3>Diminishment</h3><p style="margin:.3em 0 0;color:var(--muted)">After a number of waves of one category, each new wave of that category brings fewer replies.</p></div>
    <div class="card"><h3>"Awaiting response..."</h3><p style="margin:.3em 0 0;color:var(--muted)">This message means your last wave queued some replies. They come over time until the queue is empty. If Job, Advance-fee or Tax waves queue nothing, you need more addresses. Some advanced scams give no replies at all below 100k addresses.</p></div>
    <div class="card"><h3>Target exhaustion</h3><p style="margin:.3em 0 0;color:var(--muted)">Send too many waves and you use up the possible targets for that scam. Then wait. Sending more waves seems to make it worse, so stop for a day or a few days.</p></div>
  </div>
  <p style="margin-top:1rem;color:var(--muted)">There are 11 categories. Three are open at the start, and two more unlock every 20 CS. The guide says the data here is still low, so treat these as rough. Payouts are base averages at low capitalization: the mark and capitalization level change the final pay a lot (x300-750%).</p>
  <DataTable columns={categories.columns} rows={categories.rows} caption="Scamming: spam categories" />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Step 3</span>
  <h2>Persuading the mark</h2>
  <p class="lede">The pip starts on cell 1 of the persuasion bar. Each response moves it a random number of cells. Every cell in the range has the same chance, even if it feels like the pip likes red. The icons change between scam types, but the position of the button is what counts.</p>
  <DataTable columns={responses.columns} rows={responses.rows} caption="Scamming: the five responses, left to right" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Accelerate</h3><p style="margin:.3em 0 0;color:var(--muted)">Each stack adds less than the one before. Pair 5 stacks with Strong Forward to jump over a cluster of hazards, or when no response is safe.</p></div>
    <div class="card"><h3>Ranges change with the scam</h3><p style="margin:.3em 0 0;color:var(--muted)">Strong Forward moves 10-19 cells on the first scams, but only 8-15 on Charity and Tech support. Higher scams most likely move less too.</p></div>
  </div>
  <DataTable columns={capitalization.columns} rows={capitalization.rows} caption="Capitalization levels" />
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Two tempting zones with a red cell between them? Soft Forward, not Strong. Land on the tempting one and it carries you past the red for free."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">The bar</span>
  <h2>What each cell does</h2>
  <p class="lede">Hover a cell in the game to see what it does. Neutral and reward cells are safe. Temptation helps. Sensitivity and hesitation are "safe hazards". Avoid concern if you can. Never land on red.</p>
  <DataTable columns={cells.columns} rows={cells.rows} caption="Scamming: persuasion bar cells" />
  <p style="margin-top:1rem;color:var(--muted)">If temptation or sensitivity has no valid cell to shift you to, you get a critical failure, as if you landed on red.</p>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Risk</span>
  <h2>Suspicion and critical failures</h2>
  <p class="lede">Persuading is the only part of Scamming that can crit. To stop you from stalling, red cells start to fill the bar from the left. The guide calls this suspicion. You usually get 10-11 suspicion increases per target.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>How it grows</h3><p style="margin:.3em 0 0;color:var(--muted)">It does not start until the pip leaves cell 1, so you can Accelerate safely at the start. Every response adds 1. It starts at -1, so it first hurts on your third response. It turns 1 more cell red each move, then 2, and so on, up to 8 at a time. It never turns your own cell red, but it can fill the whole bar.</p></div>
    <div class="card"><h3>Hazards add more</h3><p style="margin:.3em 0 0;color:var(--muted)">Sensitivity: +1. Hesitation: +1 when the wait ends. Each try to resolve concern: +1. Resolving concern: +2. So the "safe" hazards still hurt you.</p></div>
    <div class="card"><h3>Critical failure</h3><p style="margin:.3em 0 0;color:var(--muted)">Landing on a fail cell is an instant crit. You get the normal crit penalties and lose the target.</p></div>
    <div class="card"><h3>When to abandon</h3><p style="margin:.3em 0 0;color:var(--muted)">1. Suspicion is high (the left side is all red) and you land on concern. 2. No move can land you on a safe cell. 3. No reward zones are left. To abandon, click the mark's icon and confirm. On mobile, swipe right.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Money</span>
  <h2>The marks</h2>
  <p class="lede">The mark is picked when you read the reply. Their multiplier stacks on top of the capitalization multiplier, so some scams pay more than ten times others. The mark does not change the bar or how far the pip moves. Gender is only for flavor.</p>
  <DataTable columns={marks.columns} rows={marks.rows} caption="Scamming: mark cash multipliers" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Playing for cash</h3><p style="margin:.3em 0 0;color:var(--muted)">How often each mark appears seems not to depend on your CS or your number of addresses. Some players skip all Young Adults, or do only Tax and Job, where Professionals are common. Affluent marks are rare, and most common in the hardest scam.</p></div>
    <div class="card"><h3>Is it worth it?</h3><p style="margin:.3em 0 0;color:var(--muted)">CS 20 scams can pay up to 5-6k per nerve. The Phisher and Scraper soon pay back the nerve you spent on farming. The author expects this to become the most profitable crime once players reach the high scams. There are no item rewards.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Leveling</span>
  <h2>Raising your Crime Skill</h2>
  <p class="lede">Maxing Scamming takes a lot of nerve. Persuading gives the most CS per nerve, and capitalizing gives the most of all. Each scam category also has its own CS multiplier: CS 1 scams give no bonus, CS 20 scams give 150%.</p>
  <DataTable columns={csGain.columns} rows={csGain.rows} caption="Scamming: CS gain by action" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>The efficient path <span class="tag" style="color:var(--muted);background:var(--surface)">best CS per nerve</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Do the highest category you can, even if it is harder. Capitalize in as few responses as you can. Medium in 3-4 responses is as good as high in 6-7. Where the high zone is only 2 cells wide, take medium. Take low only when nothing else is safe.</p></div>
    <div class="card"><h3>The fast path <span class="tag" style="color:var(--muted);background:var(--surface)">more nerve, more CS</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Do only the highest scam that still gives you regular replies. Get onto a reward zone, the higher the better. Accelerate 5 times, then capitalize. Move back and forth with Soft Forward and Backward if you need to.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Line up a dozen marks, all sitting on reward zones. Boost each one five times, then cash them in one after another. Your crime chain is high when you capitalize, and that is where the CS is."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Alpha Mail</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Decepticon</h3><p style="margin:.3em 0 0;color:var(--muted)">Land on temptation, sensitivity, hesitation and concern, all in one successful scam. CS 60 and CS 80 scams may have the right bar for it. It is mostly luck. Don't land on the same hazard twice, and if you fail to resolve concern more than 3 times, suspicion will likely stop you.</p></div>
  </div>
  <p style="margin-top:1rem;color:var(--muted)">Scamming also counts toward the medals for its crime category.</p>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Tools</span>
  <h2>Scripts</h2>
  <p class="lede"><b>Crime Morale - Scamming Solver</b> gives scamming suggestions by reading Torn's own crime responses. We reviewed it and rated it low risk. The guide asks players to install <b>OutcomeDB</b> to help research. We rated it medium risk, because it sends data from every crime attempt to another server. See the <a href="{base}/scripts/">Scripts page</a> for the reviews and install links.</p>
</div></section>

<footer><div class="wrap">
  <strong>Scamming guide.</strong> From the in-depth Scamming guide by <strong>Emforus [2535044]</strong>, built on OutcomeDB data and player logs. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16418415" target="_blank" rel="noopener">Scamming forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>
