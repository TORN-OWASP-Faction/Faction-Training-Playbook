<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Character from '$lib/Character.svelte';

  // 2026 dates and the "Torn says" text come from Torn's calendar (API torn/calendar).
  // [name, start MM-DD, end MM-DD, what Torn says, what a new player should do (may hold links), tags, top pick]
  const EVENTS = [
    ["New Year's Day", '01-01', '01-01', 'Not on the calendar, but it counts as a holiday login.',
      'Log in today. It\'s one of the holiday logins on our <a href="/start/#week">cheap merits</a> list.', ['Merit']],
    ['Awareness Week', '01-19', '01-25', 'Increased awareness for one week.',
      'Awareness is how often you find items lying around the city. Nothing to prepare: play as usual and pick up what you find.', ['Money']],
    ['Weekend Road Trip', '01-31', '02-02', 'Double racing points & racing skill.',
      'Only matters if you race. If you do, race as much as you can this weekend. <a href="/racing/">Racing →</a>', ['Racing']],
    ["Valentine's Day", '02-14', '02-14', 'Love Juice reduces the energy cost of attacking & reviving.',
      'Log in for the holiday login. If your faction chains today, Love Juice makes each hit cost less energy.', ['Merit', 'Fighting']],
    ['Employee Appreciation Day', '03-05', '03-07', 'Job points received tripled & training effects tripled.',
      'Be in a company by March. For these 48 hours, director training gives triple working stats (150 instead of 50), and up to 20 saved trains are tripled too. Ask your director to train you. <a href="/paths/#guides">Jobs →</a>',
      ['Training', 'Money'], true],
    ["St Patrick's Day", '03-17', '03-17', 'Alcohol effects are doubled & Green Stout appears in city.',
      'Alcohol gives nerve. Drink what you have for double nerve and spend it on <a href="/crimes/">crimes</a>. Each drink still adds an hour of booster cooldown.', ['Nerve']],
    ['Easter Egg Hunt', '04-02', '04-08', 'Easter eggs appear at random throughout Torn. Pick them up, then use them for their effects.',
      'Eggs pop up on random pages, so click them when you see one. Check what an egg sells for before you use it.', ['Money']],
    ['420 Day', '04-20', '04-20', 'Cannabis effects are tripled.',
      'Cannabis normally gives 8–12 nerve; today 24–36. It still adds drug cooldown and addiction, and an overdose empties your nerve. <a href="/medical/">Drugs →</a>', ['Nerve']],
    ['Museum Day', '05-18', '05-18', '10% bonus to museum point rewards.',
      'Save full flower and plushie sets and trade them in today for 10% more points. <a href="/travel/">Flying for money →</a>', ['Money']],
    ['World Blood Donor Day', '06-14', '06-14', 'Life and cooldown penalties for drawing blood are halved.',
      'Blood bags stock your faction for wars. Today filling them costs half the life and cooldown, so ask if your faction needs some. <a href="/medical/">Field medicine →</a>', ['Faction']],
    ['World Population Day', '07-11', '07-11', 'Level and weapon EXP gained while attacking is doubled.',
      'The best day of the year to attack for levels. Use the weapon you want to get better with.', ['Fighting']],
    ['World Tiger Day', '07-29', '07-29', 'Hunting experience is increased by x5.',
      'Hunting happens in South Africa. If you can fly there, hunt today for five times the skill.', ['Travel']],
    ['International Beer Day', '08-07', '08-07', 'Beer items are five times more effective.',
      'A Bottle of Beer gives 1 nerve, 5 today, and costs next to nothing. Stock up the week before. Each one still adds an hour of booster cooldown.', ['Nerve']],
    ['Tourism Day', '09-27', '09-27', 'Travel capacity doubled for flights leaving during this event.',
      'Carry twice the flowers or plushies per trip. Only flights that take off today (TCT) count, so plan to leave as many times as you can. The Smuggling For Beginners book stacks on top. <a href="/travel/">Flying for money →</a>',
      ['Money'], true],
    ['CaffeineCon', '10-15', '10-15', 'Energy drink effects are doubled.',
      'Save your energy drinks for today: each can gives double energy. Use them inside a <a href="/training/#idea">happy jump</a>.', ['Training'], true],
    ['Trick or Treat', '10-25', '11-01', 'Dress up and attack others to fill your basket with treats.',
      'Your first 40 treats earn a merit. Log in on 31 October for the holiday login too. <a href="/halloween/">Full guide →</a>', ['Merit', 'Fighting'], true],
    ['World Diabetes Day', '11-14', '11-14', 'Candy effects are tripled.',
      'Candy gives triple happy, from 12 hours before the day to 12 hours after. The cheapest big happy jump of the year, so stock candy in early November. <a href="/training/#items">Items →</a>',
      ['Training'], true],
    ['Torn Anniversary', '11-15', '11-15', 'Torn turns 22 years old.', 'Log in today for the holiday login.', ['Merit']],
    ['Black Friday', '11-27', '11-27', "Torn's yearly dollar sale sees many bazaars listing goods for $1.",
      'Items listed for $1 sell in seconds. Check bazaars early in the day, and don\'t expect the big items.', ['Money']],
    ['Slash Wednesday', '12-09', '12-09', 'Hospital times reduced by 75%.',
      'Losing a fight costs a quarter of the usual hospital time. A good day to take harder fights or help your faction chain.', ['Fighting']],
    ['Christmas Town', '12-19', '12-31', "Torn's festive theme park opens: search official and player-made maps for treasure and avoid traps.",
      'Walk the official map every day for free items and watch for traps. Log in on Christmas Day for the holiday login.', ['Money', 'Merit']]
  ];

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DAY = 86400000;
  const utc = (y, md) => Date.UTC(y, +md.slice(0, 2) - 1, +md.slice(3));
  const label = (md) => `${+md.slice(3)} ${MONTHS[+md.slice(0, 2) - 1]}`;
  const when = ([, start, end]) => (start === end ? label(start) : `${label(start)} – ${label(end)}`);

  let { data } = $props();

  // Events repeat every year on about the same dates, so count days to the next time each one starts.
  // Until the page loads in the browser, count from the build time so the prerendered HTML matches.
  let clock = $state(0);
  const now = $derived(clock || data.builtAt);
  onMount(() => (clock = Date.now()));

  function status([, start, end]) {
    const y = new Date(now).getUTCFullYear();
    if (now >= utc(y, start) && now < utc(y, end) + DAY) return { live: true, days: 0 };
    const next = utc(y, start) > now ? utc(y, start) : utc(y + 1, start);
    return { live: false, days: Math.ceil((next - now) / DAY) };
  }

  const withStatus = $derived(EVENTS.map((e) => ({ e, s: status(e) })));
  const upcoming = $derived([...withStatus].sort((a, b) => a.s.days - b.s.days).slice(0, 3));
  const byMonth = $derived(MONTHS.map((m, i) => [m, withStatus.filter(({ e }) => +e[1].slice(0, 2) === i + 1)]).filter(([, list]) => list.length));

  const link = (html) => html.replace(/href="\//g, `href="${base}/`);
  const inDays = (s) => (s.live ? 'On now' : s.days === 1 ? 'Tomorrow' : `In ${s.days} days`);
</script>

<svelte:head><title>Events calendar · Faction Training Playbook</title></svelte:head>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Plan around them</span>
  <h1>Events <em>calendar</em></h1>
  <p class="lede">Torn runs an event almost every month. Most last a day and boost one thing. Here's what each one does and how a new player should use it.</p>

  <h2 class="sr" id="next-h">Coming up</h2>
  <ol class="next" aria-labelledby="next-h">
    {#each upcoming as { e, s }}
      <li class:live={s.live}>
        <span class="when mono">{inDays(s)}</span>
        <b>{e[0]}</b>
        <small>{when(e)}</small>
        <p>{@html link(e[4])}</p>
      </li>
    {/each}
  </ol>
</div></header>

<section id="top"><div class="wrap">
  <span class="eyebrow">If you only plan for five</span>
  <h2>Worth planning for</h2>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">$</span><div><b>Tourism Day</b> (27 Sep): twice the items per trip.</div></li>
      <li><span class="k">W</span><div><b>Employee Appreciation Day</b> (early March): triple working stats from company training.</div></li>
      <li><span class="k">E</span><div><b>CaffeineCon</b> (15 Oct): double energy from energy drinks.</div></li>
      <li><span class="k">M</span><div><b>Trick or Treat</b> (25 Oct – 1 Nov): an easy merit.</div></li>
      <li><span class="k">H</span><div><b>World Diabetes Day</b> (14 Nov): triple happy from candy, the cheapest big jump of the year.</div></li>
    </ul>
  </div>
  <Character variant="banker" name="Ledger" tag="Money Talk" initial="V" img="banker.png">
    "Events reward the players who bought ahead. Candy in early November, energy drinks in October, beer in July. Buy when nobody wants it, use it when it counts double."
  </Character>
</div></section>

<section id="year"><div class="wrap">
  <span class="eyebrow">Every event, in order</span>
  <h2>The year</h2>
  <p class="lede">Dates are this year's, from Torn's own calendar. Most events land on the same dates every year.</p>
  {#each byMonth as [month, list]}
    <h3 class="month">{month}</h3>
    <ul class="year">
      {#each list as { e, s }}
        <li class:live={s.live} class:pick={e[6]}>
          <div class="date mono">{when(e)}</div>
          <div class="body">
            <div class="name">
              <b>{e[0]}</b>
              {#if e[6]}<span class="tag pick-tag">Top pick</span>{/if}
              {#each e[5] as t}<span class="tag">{t}</span>{/each}
              {#if s.live}<span class="tag live-tag">On now</span>{/if}
            </div>
            <p class="says"><span>Torn says:</span> {e[3]}</p>
            <p class="do">{@html link(e[4])}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/each}
  <p class="note">Big events such as Trick or Treat start at your own event time, somewhere between 10:00 and 16:00 TCT. You can see and change it at the top of the in-game Calendar page. Competitions such as Elimination change from year to year, so check the Calendar for those.</p>
</div></section>

<footer><div class="wrap">
  <strong>Events calendar.</strong> Dates and descriptions from Torn's calendar (Torn API, September 2026); effects from the Torn wiki pages for each event, drug and item. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .next{list-style:none;margin:1.4rem 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:.8rem}
  .next li{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1rem 1.1rem;display:flex;flex-direction:column;gap:.15rem}
  .next li.live{border-color:var(--amber)}
  .next .when{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--amber)}
  .next b{font-family:"Oswald",sans-serif;font-size:1.3rem;font-weight:600}
  .next small{color:var(--muted)}
  .next p{margin:.4rem 0 0;color:var(--muted);font-size:.9rem}
  .month{margin:1.6rem 0 .5rem;font-size:.8rem;text-transform:uppercase;letter-spacing:.14em;color:var(--amber)}
  .year{list-style:none;margin:0;padding:0;border:1px solid var(--border);border-radius:3px;background:var(--surface)}
  .year li{display:grid;grid-template-columns:9rem minmax(0,1fr);gap:1rem;padding:.9rem 1rem;border-bottom:1px solid var(--border)}
  .year li:last-child{border-bottom:0}
  .year li.pick{box-shadow:inset 3px 0 0 var(--amber)}
  .year li.live{background:var(--amber-soft)}
  .date{color:var(--muted);font-size:.85rem;padding-top:.15rem}
  .name{display:flex;flex-wrap:wrap;align-items:center;gap:.35rem .5rem}
  .name b{font-size:1.02rem}
  .tag{font-family:"IBM Plex Mono",monospace;font-size:.68rem;color:var(--muted);border:1px solid var(--border);border-radius:2px;padding:1px 6px}
  .pick-tag{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 50%,var(--border))}
  .live-tag{color:#111;background:var(--amber);border-color:var(--amber)}
  .says{margin:.35rem 0 0;color:var(--muted);font-size:.88rem}
  .says span{font-family:"IBM Plex Mono",monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:var(--faint)}
  .do{margin:.3rem 0 0}
  .note{color:var(--muted);font-size:.9rem;margin-top:1.2rem}
  :global([dir="rtl"]) .year li.pick{box-shadow:inset -3px 0 0 var(--amber)}
  @media(max-width:600px){.year li{grid-template-columns:1fr;gap:.3rem}}
</style>
