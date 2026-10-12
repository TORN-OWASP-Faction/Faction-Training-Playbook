<script>
  import CrimeHero from '$lib/CrimeHero.svelte';
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  import Character from '$lib/Character.svelte';

  const actions = {
    columns: ['Action', 'Nerve', 'Unlocks at', 'What it does', 'CS gain'],
    rows: [
      ['Gather', '4', 'Start', 'Bring 1-3+ people into your audience.', '150%'],
      ['Demonstrate', '2', 'Start', 'Show how a game is played. Needed before anyone bets.', '100%'],
      ['Hype', '2', 'Start', 'Raise attention and push people to bet. Only shows if the demo did not start betting.', '100%'],
      ['Lose', '2', 'Start', 'Lose the bet on purpose. You pay the bet amount.', '150%'],
      ['Win', '2', 'Start', 'Win the bet. You get the bet amount.', '225%'],
      ['Recruit Shill', '4', 'CS 60', 'Adds a shill who keeps part of the money you lose on purpose.', '200%'],
      ['Recruit Pickpocket', '4', 'CS 80', 'Adds a pickpocket who steals from the audience.', '200%'],
      ['Collect', '2', 'CS 60 / 80', 'Take back money from the shill or the pickpocket.', '200%']
    ]
  };

  const games = {
    columns: ['Game', 'Technique levels'],
    rows: [
      ['Cornhole', '7'],
      ['Snail Racing', '9'],
      ['Find the Lady', '11'],
      ['Shell Game', '12']
    ]
  };

  const meters = {
    columns: ['Meter', 'Goes up when', 'Goes down when', 'Effect'],
    rows: [
      ['Attention', 'You demo or hype. You lose a bet (more if it is their favorite game).', 'You win a bet.', 'Higher attention means they bet more often. At zero, they leave.'],
      ['Suspicion', 'You win a bet.', '-', 'Lowers their maximum attention.']
    ]
  };
  const kit = [
    {"name": "Megaphone", "enhancer": true, "where": "Pickpocketing · Laborer", "text": "+5% CS and CE. It can also bring more people when you gather an audience."}
  ];
</script>

<CrimeHero title="Hustling" lede="Gather a crowd, then get them to bet on rigged street games. You lose some bets on purpose to keep them hooked, and win others to take their money. Watch each person's attention and suspicion, and you can make money. Ignore them, and you will lose a lot." kitTitle="What you need" items={kit} note="You can start without it. Always carry some cash: you can't bet with nothing on hand." />

<section><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>What you need</h2>
  <p class="lede">You only need one tool, and you can start without it. There are no uniques in Hustling. The rewards are only money.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Cash on hand</h3><p style="margin:.3em 0 0;color:var(--muted)">You cannot bet with no money on hand. Always carry some cash, even a small amount.</p></div>
    <div class="card"><h3>Nerve</h3><p style="margin:.3em 0 0;color:var(--muted)">People leave 1-3 minutes after your last action with them. Have about 40+ nerve before you gather an audience.</p></div>
    <div class="card"><h3>Safe crime</h3><p style="margin:.3em 0 0;color:var(--muted)">Crits are rare. The author saw 3 crits in 1,200 tries, about a tenth of what he got in Pickpocketing.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Hustling 101</span>
  <h2>The actions</h2>
  <p class="lede">First you gather an audience. Then you pick a game, demo it, hype it, and take bets. CS gain is compared to a demo. Winning gives the most. These rates are approximate, from limited data.</p>
  <DataTable columns={actions.columns} rows={actions.rows} caption="Hustling: actions, nerve cost and CS gain" />
  <p style="margin-top:1rem;color:var(--muted)">CS depends only on the action. The game, the number of people, the money bet, a shill and your technique do not change it.</p>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">The crowd</span>
  <h2>Your audience</h2>
  <p class="lede">Each person has their own attention, suspicion, wealth and favorite game. Learn to read them.</p>
  <DataTable columns={meters.columns} rows={meters.rows} caption="Hustling: attention and suspicion" />
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Audience size</h3><p style="margin:.3em 0 0;color:var(--muted)">Your CS sets a cap on how many people you can hold. When you reach it, more gathers always fail. The exact cap is not known. Rule of thumb: about 4, plus 1 for every 20 CS. The most is 10 at max CS.</p></div>
    <div class="card"><h3>Heart icon</h3><p style="margin:.3em 0 0;color:var(--muted)">The game you are playing is their favorite. Their attention grows faster, and they keep betting while you play it, no matter their suspicion.</p></div>
    <div class="card"><h3>Money icon</h3><p style="margin:.3em 0 0;color:var(--muted)">They are betting and adding to the pool. Betting or not, their suspicion grows the same way.</p></div>
    <div class="card"><h3>Wealth</h3><p style="margin:.3em 0 0;color:var(--muted)">Icon color goes from gray to green. The brighter the green, the more they can bet. People with hearts seem to bet past their wealth limit.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">The games</span>
  <h2>Games and technique</h2>
  <p class="lede">Four games. They all work the same way. The differences are risk, bet size and the number of technique levels. Success rates go down a little in the harder games, but by barely one percentage point.</p>
  <div class="grid2" style="margin-top:1rem;align-items:start">
    <DataTable columns={games.columns} rows={games.rows} caption="Hustling: games, from easiest to hardest" />
    <div class="card"><h3>Technique</h3><p style="margin:.3em 0 0;color:var(--muted)">Your skill in one game. Higher technique means bigger bets in that game. Wins and losses raise it. A win gives about twice as much as a loss. Demo and hype give none. The audience does not seem to matter.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Helpers</span>
  <h2>Shill and pickpocket</h2>
  <p class="lede">Each takes one slot in your audience. You can have one of each at a time.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Shill <span class="tag" style="color:var(--muted);background:var(--surface)">CS 60 · blue</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Keeps part of the money you lose on purpose. Collect (2 nerve) to get some of it back. The exact rate is not known. The shill leaves after about 10 minutes, and any money you did not collect is gone.</p></div>
    <div class="card"><h3>Pickpocket <span class="tag" style="color:var(--muted);background:var(--surface)">CS 80 · red-brown</span></h3><p style="margin:.3em 0 0;color:var(--muted)">May steal from the audience every time you act. More people and more attention mean more tries. Collect (2 nerve) to get half of what was stolen. The riskiest helper, but the best one for money.</p></div>
  </div>
  <div class="callout" style="margin-top:1rem;border-left-color:var(--c-militia)">
    <h3 class="h3">Critical failures</h3>
    <p style="margin:.3em 0 0;color:var(--muted)">You can crit when you collect. From the shill, this means jail or nothing, and the shill leaves. In both cases you lose all the money the helper was holding.</p>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Word on the Street" initial="N" img="nico.png">
    "Your shill walks after ten minutes, and he takes the cash with him. Collect before he goes. It costs two nerve and gives good CS anyway."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Leveling</span>
  <h2>Raising your Crime Skill</h2>
  <p class="lede">Gather costs the most nerve for its CS, so gather as little as you can. Keep the people you have by keeping their attention up.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>The efficient route <span class="tag" style="color:var(--muted);background:var(--surface)">less money lost</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Gather a few people. Demo each game until someone shows a heart. Lose 2-3 times to max their attention. Then win until attention is low, but never empty. Repeat until they leave because suspicion is too high. After CS 60, a shill and a collect after every loss is an option if you have a lot of nerve.</p></div>
    <div class="card"><h3>The spamming route <span class="tag" style="color:var(--muted);background:var(--surface)">no thinking</span></h3><p style="margin:.3em 0 0;color:var(--muted)">Gather one person and lose until your nerve is gone. You need few gathers, but you burn cash, and your technique grows slower. After CS 60, a shill and a collect now and then softens the losses.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Technique</span>
  <h2>Maxing technique</h2>
  <p class="lede">Done right, you max CS and technique at about the same time.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Start</h3><p style="margin:.3em 0 0;color:var(--muted)">Gather once, maybe twice. Demo games from the bottom of the list up until a heart shows. Skip games you have already maxed. Ignore the shill and the pickpocket: they do nothing for technique.</p></div>
    <div class="card"><h3>Someone has a heart</h3><p style="margin:.3em 0 0;color:var(--muted)">Only that person matters. Lose until their attention is full. Win once or twice, then lose to fill it again. When suspicion reaches 80-90% of max, win until they leave. Expect about 10-15 games at 1.5 wins per loss.</p></div>
    <div class="card"><h3>No hearts</h3><p style="margin:.3em 0 0;color:var(--muted)">Lose until someone's attention is full, or total attention is over 60%. Win until attention is about 40%, then lose. Repeat until people stop betting. When suspicion reaches 60%, keep winning to make them leave.</p></div>
  </div>
  <Character variant="fixer" name={'Nico "The Line"'} tag="Nico Knows a Guy" initial="N" img="nico.png">
    "Find the heart. One mark who loves the game is worth more than a whole crowd of maybes. Play him until he walks."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Money</span>
  <h2>Making a profit</h2>
  <p class="lede">Many players are in the negative on this crime. Careless losses add up fast.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Play the hearts</h3><p style="margin:.3em 0 0;color:var(--muted)">People with hearts make you the most money. Demo each game and stay with the one that has the most hearts.</p></div>
    <div class="card"><h3>No hearts</h3><p style="margin:.3em 0 0;color:var(--muted)">Wait until attention is over half and at least 5 people are betting before you start to win. Don't lose tens of thousands on each loss. When bets reach $30-50k, start winning.</p></div>
    <div class="card"><h3>Use both helpers</h3><p style="margin:.3em 0 0;color:var(--muted)">For a long session, keep a shill and a pickpocket active. The shill pays back from your losses. The pickpocket earns from the size and attention of the crowd.</p></div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Merits</span>
  <h2>Honor bars and medals</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>Crowd Teaser</h3><p style="margin:.3em 0 0;color:var(--muted)">Reach CS 100.</p></div>
    <div class="card"><h3>Tekkers</h3><p style="margin:.3em 0 0;color:var(--muted)">Max technique in all four games.</p></div>
    <div class="card"><h3>Snake Oil</h3><p style="margin:.3em 0 0;color:var(--muted)">Win $100,000 from one bet. Fill your audience to the cap (10 at max CS). Get everyone's attention as high as you can, then switch between games until a $100k bet comes. Shell Game and Find the Lady make it easier. If your crowd is gray or dull green, let them leave and try again. Or just lose until bets reach $100k: you may need a full nerve bar and a couple of million in cash, with CS and technique maxed.</p></div>
    <div class="card"><h3>Fraud medals</h3><p style="margin:.3em 0 0;color:var(--muted)">Every try counts toward the Fraud crime medals, with Card Skimming and Scamming. The guide calls it a much more efficient way to chase these medals.</p></div>
  </div>
</div></section>

<footer><div class="wrap">
  <strong>Hustling guide.</strong> From the in-depth Hustling guide by <strong>Emforus [2535044]</strong>, built on player logs. Read the full <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16363421" target="_blank" rel="noopener">Hustling forum guide</a>. Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated.
</div></footer>
