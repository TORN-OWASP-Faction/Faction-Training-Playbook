<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import PathChart from '$lib/PathChart.svelte';
  import { simulate, milestoneDays, gainPerEnergy, naturalEnergy, MONEY_MILESTONES, STAT_MILESTONES, DEFAULTS, GYMS, PATHS } from '$lib/progression.js';

  const ORDER = ['income', 'balanced', 'stats'];
  // Validated categorical steps for the dark surface (dataviz reference palette, slots 1–3)
  const COLORS = { income: '#d95926', balanced: '#3987e5', stats: '#199e70' };

  // Controls
  let selected = $state('balanced');
  let daysPerWeek = $state(7);
  let checkins = $state(5);
  let donator = $state('real');
  let startStats = $state(5000);
  let startCash = $state(2000000);
  let xanaxPrice = $state(DEFAULTS.xanaxPrice);
  let tripProfitPI = $state(DEFAULTS.tripProfitPI);
  let bankShort = $state(DEFAULTS.bankRateShort * 100);
  let bankLong = $state(DEFAULTS.bankRateLong * 100);
  let perk = $state(DEFAULTS.perk * 100);
  let stockRate = $state(DEFAULTS.stockRatePerYear * 100);

  const TIME_OPTIONS = [
    [1, '~15 min · 1 check-in'], [2, '~30 min · 2 check-ins'], [3, '~45 min · 3 check-ins'],
    [4, '~1 hour · 4 check-ins'], [5, '~1½ hours · 5 check-ins'], [6, '2+ hours · 6 check-ins']
  ];

  const num = (v, d) => (Number.isFinite(+v) && +v >= 0 ? +v : d);
  const opts = $derived({
    daysPerWeek, checkins, donator,
    startStats: num(startStats, 5000), startCash: num(startCash, 0),
    xanaxPrice: num(xanaxPrice, DEFAULTS.xanaxPrice), tripProfitPI: num(tripProfitPI, DEFAULTS.tripProfitPI),
    bankRateShort: num(bankShort, 0) / 100, bankRateLong: num(bankLong, 0) / 100, perk: num(perk, 0) / 100,
    stockRatePerYear: num(stockRate, 0) / 100
  });
  const runs = $derived(Object.fromEntries(ORDER.map((k) => [k, simulate(k, opts)])));
  const horizon = $derived(runs.income.length - 1);

  // Compact numbers: 1.5B, 250M, 12k (no trailing ".0")
  const compact = (v) => {
    const [div, unit] = v >= 1e9 ? [1e9, 'B'] : v >= 1e6 ? [1e6, 'M'] : v >= 1e3 ? [1e3, 'k'] : [1, ''];
    const x = v / div;
    return (x >= 100 || unit === 'k' || unit === '' ? Math.round(x) : +x.toFixed(1)) + unit;
  };
  const money = (v) => '$' + compact(v);
  const count = (v) => compact(v);
  const when = (d) => (d === null || d === undefined ? 'beyond 5 years' : d === 0 ? 'now' : d < 60 ? `day ${d}` : d < 730 ? `month ${Math.round(d / 30.4)}` : `year ${(d / 365).toFixed(1)}`);

  const moneySeries = $derived(ORDER.map((k) => ({ key: k, label: PATHS[k].label, color: COLORS[k], values: runs[k].map((d) => Math.max(d.networth, 1e6)) })));
  const statSeries = $derived(ORDER.map((k) => ({ key: k, label: PATHS[k].label, color: COLORS[k], values: runs[k].map((d) => d.stats) })));
  const moneyMarks = [[1e6, '$1M'], [1e7, '$10M'], [1e8, '$100M'], [5e8, '$500M'], [1e9, '$1B'], [2e9, '$2B'], [5e9, '$5B'], [1e10, '$10B']].map(([v, label]) => ({ v, label }));
  const statMarks = [[1e3, '1k'], [1e4, '10k'], [1e5, '100k'], [1e6, '1M'], [1e7, '10M'], [1e8, '100M'], [1e9, '1B'], [1e10, '10B']].map(([v, label]) => ({ v, label }));
  const topMoney = $derived(Math.max(1e9, ...moneySeries.flatMap((s) => s.values)) * 1.4);
  const topStats = $derived(Math.max(1e6, ...statSeries.flatMap((s) => s.values)) * 1.4);

  const moneyWhen = $derived(ORDER.map((k) => milestoneDays(runs[k], 'networth', MONEY_MILESTONES)));
  const statWhen = $derived(ORDER.map((k) => milestoneDays(runs[k], 'stats', STAT_MILESTONES)));
  const piDay = $derived(Object.fromEntries(ORDER.map((k) => [k, runs[k].findIndex((d) => d.pi)])));

  // Crosshair shared by both charts; clicking a day opens it in the breakdown
  let hover = $state(null);
  let inspect = $state(180);
  const pick = (d) => { inspect = d; document.getElementById('math')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  // The breakdown for one day of the selected path
  const day = $derived(runs[selected][Math.min(inspect, horizon)]);
  const before = $derived(inspect > 0 ? runs[selected][inspect - 1] : { stats: opts.startStats, bank: 0, networth: opts.startCash });
  const perStat = $derived(before.stats / 4);
  const perE = $derived(gainPerEnergy(perStat, day.happy, day.dots, opts.perk));
  const trips = $derived(day.active ? Math.min(day.pi ? 4 : 3, checkins / 2) : 0);
  const shareToday = $derived(PATHS[selected].trainShare({ bank: before.bank }));
  const barMax = $derived(donator === 'no' ? 100 : 150);
  const naturalMax = $derived(naturalEnergy(6, donator));

  const GUIDES = {
    income: {
      tag: 'Rich first, strong later', color: COLORS.income,
      who: "Traders, flyers, and anyone who'd rather be rich before they're strong. You build passive income first, then let it pay for your training.",
      split: 'Of every dollar left after rent, <b>10% buys energy and 90% builds capital</b> until $2B is banked. Then it flips to <b>50/50</b>, and your interest pays for your training.',
      floor: "<b>Your stat floor:</b> natural energy goes into the gym every day, no exceptions, plus an XTC while you're small. Flying costs time, not energy, so this costs you nothing.",
      money: [
        ['Rent a PI with an airstrip and hire a pilot. Nothing else comes first.'],
        ['Large suitcase ($10M, +3 items), a Stock Ticker (50 points) so you have somewhere safe to park cash, and everything else into 1–2 week bank terms. Merits: education length first, then bank interest.'],
        ["Keep banking. Two cheap blocks that save time: IST (~$32M, free education) and WSU (~$64M, −10% education time)."],
        ["Still banking. Don't buy a PI yet: a bought PI with a vault runs $0.9–1.95B and would gut your investment."],
        ["The bank's $2B cap. Switch to 2–3 month terms (about $4.2M/day at today's rates). Training share rises to 50%: the interest now pays for 3 Xanax and a refill every day. Spare money goes into buy-and-hold stock blocks, bought on dips."],
        ["TCI (~$1.2B, +10% bank interest). Buy your own PI with a vault once it won't dent the $2B. SYS (~$1.4B) if you keep cash in a company vault. WLT (~$4.3B) is the flyer's endgame: a private jet that ignores flight delays."]
      ]
    },
    balanced: {
      tag: 'Both, on purpose', color: COLORS.balanced,
      who: "Most players. You grow stats steadily while your bank builds, so you're useful in fights without ever being broke.",
      split: 'Of every dollar left after rent, <b>45% buys energy and 55% builds capital</b> until $2B is banked. Then <b>70/30</b> toward training, paid for by interest.',
      floor: "<b>Both floors at once:</b> never skip natural energy, and never spend below next month's rent. The split does the rest.",
      money: [
        ['Rent a PI with an airstrip and hire a pilot.'],
        ['Large suitcase. 1–2 Xanax a day, and a happy jump about once a week while you\'re under 200k per stat. Everything else into 1–2 week bank terms.'],
        ["Gym fees get real: Cha Cha's ($20M), then Frontline or Balboas ($50M, needs one pair of stats 25% ahead, so follow Baldr's ratio). IST and WSU. Keep banking."],
        ["George's ($100M), then your single-stat specialist gym ($100M, 8.0 dots, needs one stat 25% ahead of the next). Bank the rest."],
        ['Switch to 2–3 month terms. Training share rises to 70%: max training every day, paid for by interest. Stock blocks with what\'s left.'],
        ['Same endgame buys as income first: TCI, your own PI with a vault, SYS or WLT.']
      ]
    },
    stats: {
      tag: 'Strong first, rich later', color: COLORS.stats,
      who: "Fighters and war hitters. You put almost everything into energy early, and accept being poor for longer.",
      split: 'Of every dollar left after rent, <b>80% buys energy and 20% builds capital</b>, always. That 20% is your money floor. Without it you never reach passive income.',
      floor: "<b>Your money floor:</b> always hold next month's rent and pilot (~$13.4M) plus a Xanax, and bank your 20% no matter what. Keep flying: it costs time, not energy.",
      money: [
        ['Rent a PI with an airstrip and hire a pilot. Even for stats: its happy (3,600 vs ~1,900) and the extra flying profit both feed your training.'],
        ['80% into energy: Xanax daily, XTC while small, a happy jump every few days while under 200k per stat (~$16.7M each). The other 20% goes to the bank.'],
        ["Gym fees come first: Cha Cha's ($20M), Frontline or Balboas ($50M). Keep your 20% banking."],
        ["George's ($100M) and your specialist gym ($100M). This is where stats-first spends its first big money."],
        ["You get here late, but it's the turning point: at $2B, interest alone funds max training, and stats-first stops being poor."],
        ['Endgame buys as the others: TCI, your own PI with a vault, SYS or WLT.']
      ]
    }
  };
  const MONEY_ROWS = ['$15M', '$100M', '$500M', '$1B', '$2B', '$5B'];
  let guide = $state('income');

  const PLAYBOOK = [
    [5e3, 'Happy is everything', "Below ~100k stats, happy decides most of your gains. Get the PI, take an XTC when you train, top up with candy. Start Sports Science (your first bachelor's, +1% gym gains per course)."],
    [5e4, 'Jump season', "Happy jumps pay best here: at small stats a jump gives about 3.5× what the same energy does on Xanax alone. Pick your build now (Baldr's ratio is the safe default) so the specialist gyms open later."],
    [5e5, 'Switch to steady', 'Past ~200–400k in a single stat, jumps stop paying for themselves. Move to steady "basic training": natural energy, 3 Xanax and a refill, about 1,500 energy a day.'],
    [1e6, 'Climb the gyms', "Unlock Cha Cha's, then Frontline or Balboas (7.5 dots, needs a pair of stats 25% ahead). Keep unlocking toward George's."],
    [1e7, 'Specialist gyms', "George's (7.3) unlocks the 8.0 single-stat gyms. On basic training, going from 1M to 50M in one stat takes about two months."],
    [1e8, 'Big numbers', 'At 50M per stat, a month of basic training adds about +200%. Growth slows past that (a 1B stat grows about 13% a month). Stat books: wait until that stat is at 200M.'],
    [1e9, 'Endgame', 'Energy cans and FHCs lose their edge around 2B; stat enhancers get cheaper from about 1.6–2.5B.']
  ];
</script>

<svelte:head><title>Progression paths · Faction Training Playbook</title></svelte:head>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Your plan · level 15 and up</span>
  <h1>Pick your <em>path</em></h1>
  <p class="lede">Income first, balanced, or stats first. Each path is a rule for splitting your money between <b>energy</b> (which becomes stats) and <b>capital</b> (which becomes more money). Set how much you play and see where each one gets you.</p>
  <p style="margin-top:.6rem"><a href="{base}/">← Back to the guide</a></p>

  <div class="paths3">
    {#each ORDER as k}
      <button class="pathcard" class:on={selected === k} style="--pc:{COLORS[k]}" onclick={() => { selected = k; guide = k; }} aria-pressed={selected === k}>
        <span class="pc-k">{PATHS[k].label}</span>
        <span class="pc-t">{GUIDES[k].tag}</span>
      </button>
    {/each}
  </div>
</div></header>

<!-- WHY THERE'S A FLOOR -->
<section><div class="wrap">
  <span class="eyebrow">The rule under every path</span>
  <h2>You never build only one</h2>
  <p class="lede">Flying costs time, not energy, so every path trains and every path earns. What changes is where the money goes. An income player who skips the gym gets farmed, and a stats player with no bank never reaches the passive income that pays for endgame training.</p>
  <div class="grid2" style="margin-top:1rem">
    <Character variant="banker" name="Ledger" tag="Money Talk" initial="V" img="banker.png">
      "Rich and weak is a target. Keep your natural energy in the gym no matter which path you're on. It's free."
    </Character>
    <Character variant="trainer" name="Rep" tag="Coach's Tip" initial="M" img="trainer.png">
      "Strong and broke is a dead end. Bank a slice of every day. At $2B, the interest pays for the training you're doing now."
    </Character>
  </div>
</div></section>

<!-- PLANNER -->
<section id="planner"><div class="wrap">
  <span class="eyebrow">Your timeline</span>
  <h2>Project your climb</h2>
  <p class="lede">Tell it how you play. It runs all three paths day by day for five years using the training formula, real gym unlocks, flying profit and bank interest. Hover to compare the paths; click any day to see the math behind it.</p>

  <div class="panel">
    <div class="controls">
      <label>Days a week you play
        <span class="rng"><input type="range" min="1" max="7" bind:value={daysPerWeek} /><b>{daysPerWeek}</b></span>
      </label>
      <label>Time online per play day
        <select bind:value={checkins}>{#each TIME_OPTIONS as [v, t]}<option value={v}>{t}</option>{/each}</select>
      </label>
      <label>Donator
        <select bind:value={donator}>
          <option value="real">Yes, paid with real money</option>
          <option value="ingame">Yes, bought in game (~$23.5M/mo)</option>
          <option value="no">No</option>
        </select>
      </label>
      <label>Starting total stats<input type="number" min="0" step="1000" bind:value={startStats} /></label>
      <label>Starting cash<input type="number" min="0" step="1000000" bind:value={startCash} /></label>
    </div>
    <details class="adv">
      <summary>Assumptions you can change</summary>
      <div class="controls">
        <label>Xanax price ($)<input type="number" min="0" step="10000" bind:value={xanaxPrice} /></label>
        <label>Profit per trip with a PI ($)<input type="number" min="0" step="10000" bind:value={tripProfitPI} /></label>
        <label>Bank, short terms (%/day)<input type="number" min="0" step="0.01" bind:value={bankShort} /></label>
        <label>Bank at $2B (%/day)<input type="number" min="0" step="0.01" bind:value={bankLong} /></label>
        <label>Gym-gain perks (%)<input type="number" min="0" step="1" bind:value={perk} /></label>
        <label>Stocks past $2B (%/year)<input type="number" min="0" step="1" bind:value={stockRate} /></label>
      </div>
      <p class="note">Defaults: Xanax and XTC at YATA market value; a trip is 15 long-haul plushies at ~$44k profit each (18 once you buy the large suitcase); bank rates are FFScouter's live APRs (2-week terms 43–65% depending on bank merits, 3-month 77% with all 10); stocks count price growth only (~10%/yr, Stock Market wiki). The first benefit blocks return 31–59% a year in payouts, so raise it if you'll buy blocks. All Sep 2026.</p>
    </details>

    <p class="readout">
      With this schedule you use <b>{Math.round(naturalEnergy(checkins, donator))}</b> of the {naturalMax} natural energy a day can give{#if checkins < 5}. Checking in more often wastes less of it{/if}.
      {#if piDay[selected] >= 0} On <b>{PATHS[selected].label.toLowerCase()}</b>, you rent a PI on <b>{when(piDay[selected])}</b>.
      {:else} At this schedule a PI costs more than its extra flying earns, so the model keeps you in a cheaper rental.{/if}
    </p>

    <div class="legend">
      {#each ORDER as k}
        <button class="lg" class:on={selected === k} onclick={() => (selected = k)} aria-pressed={selected === k}>
          <i class="key" style="background:{COLORS[k]}"></i>{PATHS[k].label}
        </button>
      {/each}
    </div>

    <h3 class="ch">Networth <span>(cash + bank + stocks)</span></h3>
    <PathChart title="Networth over five years" series={moneySeries} {selected} marks={moneyMarks} yMin={1e6} yMax={topMoney} fmt={money} {hover} onhover={(d) => (hover = d)} onpick={pick} />
    <h3 class="ch">Total battle stats</h3>
    <PathChart title="Total battle stats over five years" series={statSeries} {selected} marks={statMarks} yMin={Math.max(100, Math.min(opts.startStats, 1e3))} yMax={topStats} fmt={count} {hover} onhover={(d) => (hover = d)} onpick={pick} />
  </div>

  <div class="grid2 tops" style="margin-top:1.2rem">
    <div class="card">
      <h3>Money milestones</h3>
      <div class="tbl-scroll"><table class="ms">
        <thead><tr><th>Networth</th>{#each ORDER as k}<th class:on={selected === k}><i class="key" style="background:{COLORS[k]}"></i>{PATHS[k].label}</th>{/each}</tr></thead>
        <tbody>
          {#each MONEY_MILESTONES as m, i}
            <tr><td class="mono"><b>{money(m)}</b></td>{#each ORDER as k, j}<td class:on={selected === k} class:none={moneyWhen[j][i] === null}>{when(moneyWhen[j][i])}</td>{/each}</tr>
          {/each}
        </tbody>
      </table></div>
    </div>
    <div class="card">
      <h3>Stat milestones</h3>
      <div class="tbl-scroll"><table class="ms">
        <thead><tr><th>Total stats</th>{#each ORDER as k}<th class:on={selected === k}><i class="key" style="background:{COLORS[k]}"></i>{PATHS[k].label}</th>{/each}</tr></thead>
        <tbody>
          {#each STAT_MILESTONES as m, i}
            {#if m > opts.startStats}
              <tr><td class="mono"><b>{count(m)}</b></td>{#each ORDER as k, j}<td class:on={selected === k} class:none={statWhen[j][i] === null}>{when(statWhen[j][i])}</td>{/each}</tr>
            {/if}
          {/each}
        </tbody>
      </table></div>
    </div>
  </div>

  <Character variant="militia" name="Rook" tag="Side Note" initial="R" img="militia.png">
    "None of this counts war pay, because it isn't guaranteed. But join your faction's wars when they come: a good hit pays $450k–$1M depending on respect, and a war Xanax pays for itself several times over. Fighting can get you to your goal a lot faster."
  </Character>
</div></section>

<!-- MATH -->
<section id="math"><div class="wrap">
  <span class="eyebrow">Show your work</span>
  <h2>The math, one day at a time</h2>
  <p class="lede">Pick a day (or click one on the charts) to see exactly what the model did for <b style="color:{COLORS[selected]}">{PATHS[selected].label}</b>. Every number here feeds the charts above.</p>
  <label class="dayrng">Day {inspect}{inspect >= 60 ? ` · ${when(inspect)}` : ''}
    <input type="range" min="0" max={horizon} bind:value={inspect} />
  </label>

  {#if !day.active}
    <div class="callout" style="margin-top:1rem"><p style="margin:0;color:var(--muted)"><b style="color:var(--ink)">A day off.</b> No energy and no flying. The bank still pays <b class="mono">{money(day.interest)}</b> in interest, which is why passive income matters most to players who can't log in every day.</p></div>
  {:else}
    <div class="grid3" style="margin-top:1rem">
      <div class="card">
        <h3>1 · Energy in</h3>
        <table class="ledger"><tbody>
          <tr><td>Natural regen</td><td class="mono">{Math.round(day.natural)}</td></tr>
          <tr class="sub"><td colspan="2">min({naturalMax}, {checkins} check-ins × {barMax} bar). A full bar refills every 5 hours; sleep wastes some.</td></tr>
          {#if day.jump}
            <tr><td>Happy jump (stacked)</td><td class="mono">{Math.round(day.gymEnergy)}</td></tr>
            <tr class="sub"><td colspan="2">A 1,150-energy stack trained at ~35,000 happy.</td></tr>
          {:else}
            <tr><td>Xanax × {day.xanax}</td><td class="mono">{day.xanax * 250}</td></tr>
            <tr><td>Point refill</td><td class="mono">{day.refill * barMax}</td></tr>
            {#if day.xtc}<tr class="sub"><td colspan="2">XTC taken: the first 400 energy train at double happy.</td></tr>{/if}
          {/if}
          <tr class="tot"><td>Into the gym</td><td class="mono">{Math.round(day.gymEnergy)}</td></tr>
        </tbody></table>
      </div>

      <div class="card">
        <h3>2 · Stats out</h3>
        <table class="ledger"><tbody>
          <tr><td>Gym</td><td>{GYMS[day.gym][0]}{day.special.gym3000 ? ' + Gym 3000' : day.special.frontline ? ' + Frontline' : ''}</td></tr>
          <tr><td>Gym dots (G)</td><td class="mono">{day.dots.toFixed(2)}</td></tr>
          <tr><td>Happy (H)</td><td class="mono">{Math.round(day.happy).toLocaleString('en-US')}</td></tr>
          <tr><td>Stat size (S, per stat)</td><td class="mono">{count(perStat)}</td></tr>
          <tr><td>Gain per energy</td><td class="mono">{perE >= 100 ? Math.round(perE).toLocaleString('en-US') : perE.toFixed(1)}</td></tr>
          <tr class="tot"><td>Stats gained today</td><td class="mono">+{count(day.statGain)}</td></tr>
        </tbody></table>
        <p class="formula">(S·(1 + 0.07·ln(1 + H/250)) + 8·H<sup>1.05</sup> + (1 − (H/99,999)²)·A + B) ÷ 200,000 × G × (1 + {opts.perk * 100}%)</p>
      </div>

      <div class="card">
        <h3>3 · Money</h3>
        <table class="ledger"><tbody>
          <tr><td>Flying</td><td class="mono">+{money(day.fly)}</td></tr>
          <tr class="sub"><td colspan="2">{trips} trips × {money(day.perTrip)} ({day.pi ? (day.suitcase ? 'PI + suitcase, 18 items' : 'PI, 15 items') : 'standard, 10 items'}); a round trip takes two check-ins.</td></tr>
          <tr><td>Bank interest</td><td class="mono">+{money(day.interest)}</td></tr>
          <tr><td>Rent, pilot, donator</td><td class="mono">−{money(day.spendFixed)}</td></tr>
          <tr><td>Energy bought</td><td class="mono">−{money(day.spendEnergy)}</td></tr>
          {#if day.spendGym}<tr><td>Gyms &amp; gear</td><td class="mono">−{money(day.spendGym)}</td></tr>{/if}
          <tr class="sub"><td colspan="2">{Math.round(shareToday * 100)}% of today's income after rent goes to energy; the rest to capital.</td></tr>
          <tr class="tot"><td>Networth</td><td class="mono">{money(day.networth)}</td></tr>
          <tr class="sub"><td colspan="2">Bank {money(day.bank)} · stocks {money(day.stocks)} · cash {money(day.cash + day.wallet)}</td></tr>
        </tbody></table>
      </div>
    </div>
  {/if}

  <details class="adv" style="margin-top:1.2rem">
    <summary>How the model works, and how close it gets</summary>
    <div class="grid2" style="margin-top:.8rem">
      <ul class="rules">
        <li><span class="k">E</span><div><b>Energy.</b> A full bar every 5 hours, captured only when you check in (and a night's sleep wastes some). Up to 3 Xanax a day (6–8h cooldown), a daily refill, and happy jumps, each bought from the path's energy budget.</div></li>
        <li><span class="k">S</span><div><b>Stats.</b> Training Formula V2.0 on your current gym. Gyms unlock after the wiki's energy requirement and fee; balanced and stats-first also buy the specialist gyms (Frontline, Gym 3000).</div></li>
        <li><span class="k">$</span><div><b>Money.</b> Flying needs two check-ins per round trip. A PI is rented only when its extra items cover its cost. Spare cash goes to the bank (to $2B), then stocks (~10% a year).</div></li>
        <li><span class="k">✗</span><div><b>Left out on purpose:</b> war pay, trading, crimes, OC payouts, stock dividends and mugging losses. Real players usually earn a little more and lose a little more.</div></li>
      </ul>
      <div>
        <p style="margin:0 0 .5rem;color:var(--muted)">Checked against the guides' own numbers:</p>
        <table class="ledger"><tbody>
          <tr><td>1M → 50M in one stat, ~1,500 energy/day</td><td class="mono">guide 59 days · model 50</td></tr>
          <tr><td>50M stat, one month of basic training</td><td class="mono">guide +212% · model +200–209%</td></tr>
        </tbody></table>
        <p class="note" style="margin-top:.5rem">So the stat curve runs about 15% fast in the 1M–50M range and on target above it. Treat every date here as a ballpark, not a promise.</p>
      </div>
    </div>
  </details>
</div></section>

<!-- GUIDES -->
<section id="guides"><div class="wrap">
  <span class="eyebrow">Where the money goes</span>
  <h2>The three guides</h2>
  <div class="tabrow" role="tablist">
    {#each ORDER as k}
      <button role="tab" aria-selected={guide === k} class:on={guide === k} style="--pc:{COLORS[k]}" onclick={() => (guide = k)}>{PATHS[k].label}</button>
    {/each}
  </div>

  {#each ORDER as k, j}
    {#if guide === k}
      {@const g = GUIDES[k]}
      <div class="gpanel" style="--pc:{g.color}">
        <p class="lede" style="margin-top:0">{g.who}</p>
        <div class="grid2" style="margin-top:.8rem">
          <div class="callout"><p style="margin:0;color:var(--muted)">{@html g.split}</p></div>
          <div class="callout"><p style="margin:0;color:var(--muted)">{@html g.floor}</p></div>
        </div>
        <div class="tbl-scroll" style="margin-top:1rem"><table class="gt">
          <thead><tr><th>Networth</th><th>When <span class="lane-note">(your settings)</span></th><th>Where the money goes</th></tr></thead>
          <tbody>
            {#each MONEY_ROWS as label, i}
              <tr>
                <td class="mono"><b>{label}</b></td>
                <td class="mono nowrap">{i === 0 ? (piDay[k] >= 0 ? when(piDay[k]) : 'when it pays') : when(moneyWhen[j][i - 1])}</td>
                <td>{g.money[i][0]}</td>
              </tr>
            {/each}
          </tbody>
        </table></div>
      </div>
    {/if}
  {/each}

  <h3 style="margin-top:2rem">Stat milestones: what changes as you grow</h3>
  <p style="color:var(--muted);margin:.2em 0 0">The stat game is the same on every path; only the speed differs. Per-stat figures are roughly a quarter of your total.</p>
  <div class="tbl-scroll" style="margin-top:.8rem"><table class="gt">
    <thead><tr><th>From</th><th>Stage</th><th>What to do</th>{#each ORDER as k}<th class="nowrap"><i class="key" style="background:{COLORS[k]}"></i>{PATHS[k].label}</th>{/each}</tr></thead>
    <tbody>
      {#each PLAYBOOK as [at, stage, text]}
        {@const i = STAT_MILESTONES.indexOf(at)}
        <tr>
          <td class="mono"><b>{count(at)}</b></td><td class="nowrap"><b>{stage}</b></td><td>{text}</td>
          {#each ORDER as k, j}<td class="mono nowrap" class:none={at > opts.startStats && statWhen[j][i] === null}>{at <= opts.startStats ? 'done' : when(statWhen[j][i])}</td>{/each}
        </tr>
      {/each}
    </tbody>
  </table></div>
</div></section>

<footer><div class="wrap">
  <strong>Progression paths.</strong> Built on Training Formula V2.0 (<strong>Vladar [1996140]</strong>); gym dots and unlock energy from the Torn wiki's Gym page; money order, PI financing and the $2B bank plan from <strong>Baldr [1847600]</strong>'s Basic Advice; energy budgets and happy-jump thresholds from the community guides (Weekly Energy, (Re)Quantify Your Impatience, Gym &amp; Stats Training Like a Pro 2026, Happy Jump Training, Gym Training Guide for Beginners, Training Gains Explained); stock block prices from OP Merit Breakdown; item prices from YATA. Dates are model estimates. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .paths3{display:grid;grid-template-columns:repeat(3,1fr);gap:.7rem;margin-top:1.4rem}
  .pathcard{font:inherit;text-align:left;cursor:pointer;display:grid;gap:.2rem;padding:.8rem 1rem;border-radius:3px;
    background:var(--surface);border:1px solid var(--border);border-top:3px solid var(--pc);color:var(--ink)}
  .pathcard.on{background:var(--raised);border-color:var(--pc)}
  .pathcard:focus-visible{outline:2px solid var(--pc);outline-offset:2px}
  .pc-k{font-family:"Oswald",sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
  .pc-t{color:var(--muted);font-size:.85rem}
  @media(max-width:640px){.paths3{grid-template-columns:1fr}}

  .panel{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.1rem;margin-top:1.2rem}
  .controls{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.8rem}
  label{display:grid;gap:.3rem;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--faint);font-weight:600}
  select,input[type=number]{font-family:inherit;font-size:.9rem;color:var(--ink);background:var(--raised);border:1px solid var(--border);
    border-radius:2px;padding:.45rem .6rem;font-variant-numeric:tabular-nums;width:100%}
  select:focus-visible,input:focus-visible{outline:2px solid var(--amber);outline-offset:1px}
  .rng{display:flex;align-items:center;gap:.6rem}
  .rng input{flex:1;accent-color:var(--amber)}
  .rng b{font-family:"IBM Plex Mono",monospace;color:var(--ink);font-size:.95rem}
  .adv{margin-top:.9rem}
  .adv summary{cursor:pointer;color:var(--muted);font-size:.85rem}
  .adv summary:hover{color:var(--ink)}
  .adv .controls{margin-top:.8rem}
  .readout{margin:1rem 0 0;color:var(--muted);font-size:.9rem}
  .readout b{color:var(--ink)}

  .legend{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
  .lg{font:inherit;font-size:.82rem;cursor:pointer;display:inline-flex;align-items:center;gap:.45rem;background:none;
    border:1px solid var(--border);border-radius:3px;padding:.3rem .6rem;color:var(--muted)}
  .lg.on{color:var(--ink);background:var(--raised)}
  .lg:focus-visible{outline:2px solid var(--amber);outline-offset:1px}
  .key{display:inline-block;width:16px;height:3px;border-radius:1px;vertical-align:middle;margin-right:.35rem}
  .lg .key{margin-right:0}
  .ch{margin:1.2rem 0 .3rem;font-size:1rem}
  .ch span{font-family:"IBM Plex Sans",sans-serif;font-weight:400;color:var(--faint);font-size:.8rem;text-transform:none}

  .tops{align-items:start}
  table.ms th,table.ms td{white-space:nowrap}
  table.ms .on{color:var(--ink)}
  table.ms td.on{background:var(--raised)}
  .none{color:var(--faint)}
  .nowrap{white-space:nowrap}
  .lane-note{font-size:.66rem;color:var(--faint);font-weight:400;text-transform:none}

  .dayrng{margin-top:1rem;max-width:40rem}
  .dayrng input{width:100%;accent-color:var(--amber)}
  .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
  @media(max-width:900px){.grid3{grid-template-columns:1fr}}
  table.ledger{width:100%;min-width:0;border-collapse:collapse;margin-top:.5rem;font-size:.88rem}
  .grid3 > *{min-width:0}
  .ledger td{padding:.35rem 0;border-bottom:1px solid var(--border);color:var(--muted);vertical-align:top}
  .ledger td:last-child{text-align:right;color:var(--ink);padding-left:.8rem}
  .ledger tr.sub td{border-bottom:0;padding-top:0;font-size:.75rem;color:var(--faint);text-align:left}
  .ledger tr.tot td{color:var(--ink);font-weight:600;border-bottom:0}
  .formula{margin:.8rem 0 0;font-family:"IBM Plex Mono",monospace;font-size:.72rem;color:var(--faint);line-height:1.6}

  .tabrow{display:flex;gap:.4rem;margin-top:1rem;border-bottom:1px solid var(--border);overflow-x:auto}
  .tabrow button{font:inherit;cursor:pointer;background:none;border:0;border-bottom:2px solid transparent;padding:.55rem .9rem;
    color:var(--muted);font-family:"Oswald",sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:-1px}
  .tabrow button.on{color:var(--ink);border-bottom-color:var(--pc)}
  .tabrow button:focus-visible{outline:2px solid var(--pc);outline-offset:-2px}
  .gpanel{padding-top:1rem}
  table.gt td{vertical-align:top}
</style>
