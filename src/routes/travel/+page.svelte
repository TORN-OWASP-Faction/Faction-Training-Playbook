<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import Icon from '$lib/Icon.svelte';

  // One-way flight minutes: standard ticket vs PI airstrip + pilot (70% of standard). Torn wiki, Travel.
  const dest = [
    { c: 'Mexico', std: 24, air: 17, cost: 6500, flower: 'Dahlia', plush: 'Jaguar' },
    { c: 'Cayman Islands', std: 33, air: 23, cost: 10000, flower: 'Banana Orchid', plush: 'Stingray' },
    { c: 'Canada', std: 39, air: 27, cost: 9000, flower: 'Crocus', plush: 'Wolverine' },
    { c: 'Hawaii', std: 127, air: 89, cost: 11000, flower: 'Orchid', plush: '—' },
    { c: 'United Kingdom', std: 151, air: 106, cost: 18000, flower: 'Heather', plush: 'Nessie · Red Fox' },
    { c: 'Argentina', std: 158, air: 111, cost: 21000, flower: 'Ceibo Flower', plush: 'Monkey' },
    { c: 'Switzerland', std: 166, air: 116, cost: 27000, flower: 'Edelweiss', plush: 'Chamois' },
    { c: 'Japan', std: 213, air: 149, cost: 32000, flower: 'Cherry Blossom', plush: '—' },
    { c: 'China', std: 229, air: 160, cost: 35000, flower: 'Peony', plush: 'Panda' },
    { c: 'UAE', std: 257, air: 180, cost: 32000, flower: 'Tribulus Omanense', plush: 'Camel' },
    { c: 'South Africa', std: 282, air: 197, cost: 40000, flower: 'African Violet', plush: 'Lion' }
  ];

  let mode = $state('air');
  const roundTrip = (d) => 2 * (mode === 'air' ? d.air : d.std);

  const hm = (m) => (m < 60 ? `${m}m` : `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`);
  const money = (n) => '$' + n.toLocaleString('en-US');

  // A full energy bar refills in 5h; Xanax cooldown is 6–8h.
  function fits(rt) {
    if (rt <= 60) return 'Between trains';
    if (rt < 300) return 'Part of a recharge';
    return 'A full energy bar';
  }

  // Chart geometry
  const W = 900, rowH = 30, top = 34, left = 132, right = 70;
  const xMax = 600;
  const chartH = top + dest.length * rowH + 30;
  const X = (m) => left + (m / xMax) * (W - left - right);
  const hours = [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600];

  const capacity = [
    { l: 'Standard ticket', v: 10 },
    { l: '+ PI airstrip & pilot', v: 15, hi: true },
    { l: '+ Faction Excursion (max)', v: 25 },
    { l: '+ Large suitcase', v: 28 },
    { l: '+ Smuggling for Beginners', v: 38 },
    { l: '+ 10★ Cruise Line job', v: 43 }
  ];
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Level 15+ · money</span>
  <h1>Flying for <em style="color:var(--c-fixer)">money</em></h1>
  <p class="lede">Level 15 unlocks travel, and travel is where money gets easy: fly abroad, buy flowers or plushies, fly home, sell to players. Here's how to start, how much cash you need before renting a Private Island, and how your flying changes depending on whether you're building stats or building money.</p>
  <p style="margin-top:.6rem"><a href="{base}/#money">← Back to Make money</a></p>

  <Character variant="fixer" name={'Nico "The Line"'} tag="Between Us" initial="N" img="nico.png">
    "Half this city runs on flowers and stuffed animals. Sounds stupid until you see the margins. Get your wings, get an island with a runway, and the money starts coming in on its own."
  </Character>
</div></header>

<!-- ENERGY VS TIME -->
<section><div class="wrap">
  <span class="eyebrow">The idea that makes it work</span>
  <h2>Flying spends time, not energy</h2>
  <p class="lede">Every money method costs either <b>energy</b> or <b>time</b>. Energy is what builds your stats, so the best earners are the ones that only cost time. Flying is one of them. You train, then take off, and you're back on the ground by the time your bar has refilled.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Costs energy <span class="tag" style="color:var(--c-medic);background:var(--medic-soft)">competes with training</span></h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">$</span><div><b>Selling losses</b>: 25e each. Only as a short burst toward a goal (see <a href="{base}/#sell-losses">Selling losses</a>).</div></li>
        <li><span class="k">⚔</span><div><b>War hits</b>: 25e each, but <b>$450k–$1M</b> a hit depending on respect. Worth it while a war is on.</div></li>
        <li><span class="k">✗</span><div><b>Mugging</b>: uses a lot of energy for uneven returns. Skip it until you're strong.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Costs time <span class="tag" style="color:var(--c-trainer);background:var(--ok-soft)">free for a trainer</span></h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k"><Icon name="flag"/></span><div><b>Flying</b>: flowers, plushies and contraband.</div></li>
        <li><span class="k">⇄</span><div><b>Trading</b>: buy low, sell high. Needs capital and a lot of time online.</div></li>
        <li><span class="k">N</span><div><b>Crimes</b> run on nerve, a separate bar. <b>Your job</b> pays and grows work stats either way.</div></li>
      </ul>
    </div>
  </div>
  <Character variant="trainer" name="Rep" tag="Coach's Tip" initial="M" img="trainer.png">
    "Your plane doesn't touch your energy bar. Dump your energy in the gym, then take off. A full bar takes five hours to refill, and a long-haul round trip takes about the same, so you land ready to train again."
  </Character>
</div></section>

<!-- THE LADDER -->
<section><div class="wrap">
  <span class="eyebrow">Where you are, what's next</span>
  <h2>The money ladder</h2>
  <p class="lede">Each step pays for the next one. Don't skip ahead: a bank investment before you have a PI is money that should have been an airstrip.</p>
  <ol class="ladder">
    <li>
      <div class="lv">Under 15</div>
      <div class="bd"><b>Shop flips</b>: buy 100 items a day from Bits N Bobs and the Sweet Shop and resell them for about <b>$50–70k/day</b>. If you need a jump-start, sell losses toward <em>one</em> goal (your first PI) and then stop.</div>
      <div class="nx">Goal: <b>reach level 15</b></div>
    </li>
    <li>
      <div class="lv">Just hit 15</div>
      <div class="bd"><b>Fly on standard tickets</b>: 10 items a trip, full flight times, and you pay for every ticket. Profit is thin, but it adds up. Keep your trips short.</div>
      <div class="nx">Goal: <b>~$15M PI budget</b></div>
    </li>
    <li class="key">
      <div class="lv">PI + airstrip</div>
      <div class="bd"><b>The big jump</b>: 15 items a trip, <b>30% faster</b>, <b>free flights</b>, plus the island's happy boosts every train. Flying now makes <b>$2–3M/day</b>, and $5–6M if you're very active.</div>
      <div class="nx">Next buy: <b>large suitcase</b> ($10M, +3)</div>
    </li>
    <li>
      <div class="lv">Build the bank</div>
      <div class="bd">Invest <b>1–2 weeks</b> at a time and top it up every time it matures. For a long while the bank is an expense, not income. Put merits into <b>education first, then banking</b>.</div>
      <div class="nx">Goal: <b>$2B invested</b></div>
    </li>
    <li>
      <div class="lv">Passive</div>
      <div class="bd">At $2B, switch to <b>2–3 month</b> terms at about <b>$5M/day</b> (rates vary). Put the payouts into <b>buy-and-hold stock blocks</b>. From here your money pays for your jumps without you doing anything.</div>
      <div class="nx">Money now <b>funds stats</b></div>
    </li>
  </ol>
  <Character variant="militia" name="Rook" tag="Faction Intel" initial="R" img="militia.png">
    "While you climb that ladder, war is your best payday. When we're at war, your energy earns more on the war board than anywhere else. Hit, then get back in the air."
  </Character>
</div></section>

<!-- PI BUDGET -->
<section id="pi"><div class="wrap">
  <span class="eyebrow">Before you sign the lease</span>
  <h2>How much you need for your first PI</h2>
  <p class="lede">The Private Island is the most important purchase you'll make. It pays for itself in extra items per trip, and the happy boosts every train. Aim to have about <b>$15M</b> before you rent:</p>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Line item</th><th>Cost</th><th>Why</th></tr></thead>
    <tbody>
      <tr><td><b>30-day rent</b>: 3,600-happy PI with airstrip</td><td class="mono">~$12–13M</td><td>The best value for the money. Your first one can be cheaper: some 2,550-happy PIs have an airstrip too.</td></tr>
      <tr><td><b>Pilot</b>: 1× staff</td><td class="mono">$25k/day ≈ $750k</td><td>No pilot means the airstrip does nothing. Staff fees keep adding up for the whole lease.</td></tr>
      <tr><td><b>First load of stock</b></td><td class="mono">well under $1M</td><td>Flowers and plushies are cheap to buy abroad. The profit is in the resale.</td></tr>
      <tr><td><b>Reserve</b></td><td class="mono">~$1M</td><td>So one slow day doesn't ground you. Keep it in the bank, not on you.</td></tr>
    </tbody>
  </table></div>
  <div class="grid2" style="margin-top:1rem">
    <div class="callout">
      <h3>Must-haves on the lease</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">✓</span><div>A <b>landing strip</b>, always. Double-check it on any PI under 3,600 happy.</div></li>
        <li><span class="k">✓</span><div><b>Hire a pilot</b> as soon as you move in.</div></li>
        <li><span class="k">✓</span><div><b>Rent, don't buy.</b> A bought PI starts at $500M. Renting costs a small fraction of that (you can't use the vault while renting, but that's fine).</div></li>
      </ul>
    </div>
    <div class="callout">
      <h3>Getting the $15M</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">1</span><div>Fly short standard-ticket runs every time you're free.</div></li>
        <li><span class="k">2</span><div>If you're short, sell losses as a <b>burst</b>: Xanax, ~14 losses, done. A few days of that covers the rent.</div></li>
        <li><span class="k">3</span><div>Ask leadership: the faction may front the first month.</div></li>
      </ul>
    </div>
  </div>
  <Character variant="banker" name="Ledger" tag="Worth the Cost?" initial="V" img="banker.png">
    "Twelve million for a month feels steep until you do the arithmetic: five extra items a trip, 30% off every flight, no ticket fees. The extra profit covers the rent and then some, and you get the happy for free on top."
  </Character>
</div></section>

<!-- WHERE TO FLY -->
<section id="where"><div class="wrap">
  <span class="eyebrow">Destinations</span>
  <h2>Where to fly</h2>
  <p class="lede">Every country sells one flower and most sell a plushie. Choose a route by how long you'll be away. With a PI, the short hops take under an hour and fit between trains. Long hauls last about as long as it takes your energy bar to refill.</p>

  <div class="card" style="margin-top:1rem">
    <div class="chart-hd">
      <h3>Round-trip time</h3>
      <div class="seg" role="group" aria-label="Travel method">
        <button class:on={mode === 'air'} aria-pressed={mode === 'air'} onclick={() => (mode = 'air')}>With PI airstrip</button>
        <button class:on={mode === 'std'} aria-pressed={mode === 'std'} onclick={() => (mode = 'std')}>Standard ticket</button>
      </div>
    </div>
    <div class="chart-scroll">
      <svg viewBox="0 0 {W} {chartH}" class="rt" role="img" aria-label="Round-trip flight time per destination, compared with a full energy refill and the Xanax cooldown">
        <rect class="band" x={X(360)} y={top - 6} width={X(480) - X(360)} height={dest.length * rowH + 6} />
        <text class="bandlbl" x={(X(360) + X(480)) / 2} y={top - 12} text-anchor="middle">Xanax cooldown 6–8h</text>
        {#each hours as h}
          <line class="grid" x1={X(h)} y1={top - 6} x2={X(h)} y2={top + dest.length * rowH} />
          <text class="ax" x={X(h)} y={chartH - 8} text-anchor="middle">{h / 60}h</text>
        {/each}
        <line class="ref" x1={X(300)} y1={top - 6} x2={X(300)} y2={top + dest.length * rowH} />
        <text class="reflbl" x={X(300) - 6} y={top - 12} text-anchor="end">Full energy bar 5h</text>
        {#each dest as d, i}
          {@const rt = roundTrip(d)}
          <g>
            <title>{d.c}: {hm(rt)} round trip ({d.flower}{d.plush !== '—' ? ' · ' + d.plush : ''})</title>
            <text class="lbl" x={left - 10} y={top + i * rowH + 15} text-anchor="end">{d.c}</text>
            <rect class="bar" class:long={rt >= 300} x={left} y={top + i * rowH + 4} width={Math.max(2, X(rt) - left)} height="16" rx="2" />
            <text class="val" x={X(rt) + 6} y={top + i * rowH + 16}>{hm(rt)}</text>
          </g>
        {/each}
      </svg>
    </div>
    <p class="note" style="margin-top:.4rem">Switch to <b>Standard ticket</b> to see what the airstrip saves you: every trip gets 30% shorter, and the long hauls fit inside one energy refill.</p>
  </div>

  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Destination</th><th>Flower</th><th>Plushie</th><th>One-way (std → PI)</th><th>Round trip</th><th>Ticket</th><th>Fits</th></tr></thead>
    <tbody>
      {#each dest as d}
        <tr>
          <td><b>{d.c}</b></td><td>{d.flower}</td><td>{d.plush}</td>
          <td class="mono">{hm(d.std)} → {hm(d.air)}</td>
          <td class="mono">{hm(roundTrip(d))}</td>
          <td class="mono">{mode === 'air' ? 'free' : money(d.cost)}</td>
          <td>{fits(roundTrip(d))}</td>
        </tr>
      {/each}
    </tbody>
  </table></div>
  <p class="note" style="margin-top:.6rem">Buy and sell prices change constantly, so check <b>YATA</b>'s foreign-stock page before you fly (it shows what's in stock abroad right now) and <b>weav3r</b> for bazaar sell prices. Both are on the <a href="{base}/scripts/">Scripts</a> page. Each country's <b>Black Market</b> also sells contraband, which is priced like flowers and plushies and often profitable.</p>
</div></section>

<!-- WHY IT SELLS -->
<section><div class="wrap">
  <span class="eyebrow">Why the demand never dries up</span>
  <h2>Sets &amp; the Museum</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Everyone's building sets</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">11</span><div>A <b>flower set</b> is one flower from each of the 11 countries.</div></li>
        <li><span class="k">13</span><div>A <b>plushie set</b> is the 10 from abroad plus the Kitten, Sheep and Teddy Bear from Bits N Bobs.</div></li>
        <li><span class="k">10</span><div>The <b>Museum</b> trades a full set for <b>10 points</b>, which sell for cash. <b>Museum Day</b> adds 10%.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>What that means for you</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">$</span><div>Prices follow the <b>point price</b>. When points go up, flowers and plushies go up too.</div></li>
        <li><span class="k"><Icon name="grad"/></span><div>The Museum unlocks with the <b>Bachelor of History</b>. With it you can sell to the Museum yourself instead of to other players.</div></li>
        <li><span class="k">⇄</span><div>Players without the degree have to sell to someone who has it. That's the market you're selling into.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<!-- TWO LANES -->
<section id="lanes"><div class="wrap">
  <span class="eyebrow">Short term vs long term</span>
  <h2>Building for stats vs building for money</h2>
  <p class="lede">Every player trains, because energy refills whether you use it or not. The difference is <b>where your money goes</b> and <b>how you fly</b>. Most players lean one way, so pick yours on purpose.</p>

  <div class="grid2" style="margin-top:1rem">
    <div class="callout">
      <h3>Short term: everyone chases money first</h3>
      <p style="margin:.4rem 0 0;color:var(--muted)">For your first month or two at 15, focus on money until the PI is rented and next month's rent is already saved. The island helps both lanes: its happy boosts your training and its airstrip boosts your flying. Until you have it, you're weak at both.</p>
    </div>
    <div class="callout">
      <h3>Long term: both lanes end at $2B</h3>
      <p style="margin:.4rem 0 0;color:var(--muted)">A stats player and a money player end up in the same place: $2B invested and paying out on its own. After that, the interest pays for your happy jumps. The only question is which one you get first.</p>
    </div>
  </div>

  <div class="tbl-scroll" style="margin-top:1rem"><table class="lanes">
    <thead><tr><th></th><th>Stats-first <span class="mono lane-note">fighters · war</span></th><th>Money-first <span class="mono lane-note">economy · passive</span></th></tr></thead>
    <tbody>
      <tr><th>Goal</th><td>Win fights, carry wars</td><td>Grow networth to reach passive income</td></tr>
      <tr><th>Energy</th><td>Gym and happy jumps, plus war hits during wars</td><td>Still the gym (never waste it). Losses only as a burst toward a goal</td></tr>
      <tr><th>You buy</th><td><b>Consumables that become stats</b>: Xanax, XTC, eDVDs, candy, gym-gain education</td><td><b>Capital that compounds</b>: suitcase, Smuggling book, bank deposits, stock blocks, History degree</td></tr>
      <tr><th>Property</th><td>The highest-happy PI you can afford, with an airstrip</td><td>The cheapest PI that has an airstrip; happy matters less</td></tr>
      <tr><th>How you fly</th><td>Long hauls timed to your recharge: dump energy, take off, and land to a full bar</td><td>Back-to-back runs, aiming for the most items per hour you're online</td></tr>
      <tr><th>Routes</th><td>China, UAE, South Africa (5–6.5h round trip with PI, about one energy refill or one Xanax cooldown)</td><td>Short hops if you can be there for every landing, or the highest-margin items if you can't</td></tr>
      <tr><th>Grows fast</th><td>Battle stats</td><td>Networth</td></tr>
      <tr><th>Grows slow</th><td>Networth. The bank waits.</td><td>Battle stats. You're more likely to get mugged or bullied.</td></tr>
    </tbody>
  </table></div>
  <p class="note" style="margin-top:.6rem">Not sure which one you are? Ask leadership what the faction needs from you. Fighters are usually stats-first; players who fund the faction are money-first.</p>
</div></section>

<!-- CAPACITY -->
<section><div class="wrap">
  <span class="eyebrow">More items, more profit</span>
  <h2>Carry more per trip</h2>
  <p class="lede">Profit per trip is items carried times margin, so every extra slot pays on every flight. Buy them in this order: <b>PI first</b> (biggest impact), then the <b>large suitcase</b>.</p>
  <div class="card" style="margin-top:1rem">
    <h3>Items per trip as you stack upgrades</h3>
    <div class="bars capbars" style="margin-top:.8rem">
      {#each capacity as c}
        <div class="bar-row{c.hi ? ' hi' : ''}">
          <div class="lbl">{c.l}</div>
          <div class="track"><div class="fill" style="width:{(c.v / 43) * 100}%"><span class="v">{c.v}</span></div></div>
        </div>
      {/each}
    </div>
    <ul class="rules" style="margin-top:1rem">
      <li><span class="k"><Icon name="flag"/></span><div><b>Faction Excursion</b> is a faction upgrade (+1 per level, up to +10). Ask leadership where it stands.</div></li>
      <li><span class="k"><Icon name="backpack"/></span><div>Suitcases don't stack; only your biggest one counts: small +1 ($2M), medium +2 ($4M), large +3 ($10M).</div></li>
      <li><span class="k">×2</span><div><b>Tourism Day (27 September)</b> doubles your capacity. Plan a big day of flying around it.</div></li>
      <li><span class="k">+5</span><div>A <b>7★ Flower Shop</b> or <b>7★ Toy Shop</b> job adds 5 flowers or 5 plushies; a <b>3★ Lingerie Store</b> adds 2 items (and makes property upkeep free at 7★).</div></li>
    </ul>
  </div>
</div></section>

<!-- PROTECT IT -->
<section><div class="wrap">
  <span class="eyebrow">Keep what you make</span>
  <h2>Don't fly home to get mugged</h2>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">✈</span><div>Nobody can attack you <b>while you're in the air</b>. <b>Abroad</b>, anyone in the same country can. Buy fast and leave.</div></li>
      <li><span class="k">$</span><div>Cash in your pocket can be mugged. After selling, move it right away: <b>bank investment</b> (locked but safe), <b>stocks</b> (0.1% fee to sell), <b>ghost trades</b> (6 hours max), the <b>faction vault</b>, or <b>points</b>.</div></li>
      <li><span class="k"><Icon name="pill"/></span><div>Selling in bulk makes you a target. Spread out big sales and don't advertise your balance.</div></li>
    </ul>
  </div>
  <Character variant="banker" name="Ledger" tag="Money Talk" initial="V" img="banker.png">
    "The flight earns money, and the bank keeps it. Money sitting in your pocket just gets taken. Land, sell, deposit, and do it in that order every time."
  </Character>
</div></section>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:.6rem">
    <span class="brandmark" style="color:var(--ink);font-size:1.2rem">TORN</span>
    <span class="mono" style="letter-spacing:.16em;font-size:.72rem;color:var(--muted)">TRAIN · TAKE OFF · LAND FULL</span>
  </div>
  <strong>Flying for money.</strong> Money ladder, PI financing and the long-term passive plan are from <strong>Baldr [1847600]</strong>'s Basic Advice ("Making Money", "Financing your first Private Island", "Long Term Lazy plan", "How To Store Money"). Flight times, ticket costs and carry capacity are from the Torn wiki's Travel page; PI costs and pilot fees are from the Property page; energy refill time and drug cooldowns are from the Energy and Drug pages; Museum sets are from the Museum page. Rates and prices change, so treat the dollar figures as ballparks. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .ladder{list-style:none;margin:1.2rem 0 0;padding:0;display:grid;gap:.5rem;counter-reset:lad}
  .ladder li{counter-increment:lad;display:grid;grid-template-columns:8.5rem 1fr 12rem;gap:1rem;align-items:center;
    background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:.8rem 1rem}
  .ladder li.key{border-color:var(--c-fixer);background:var(--fixer-soft)}
  .ladder .lv{font-family:"Oswald",sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--ink);font-size:.95rem}
  .ladder .lv::before{content:counter(lad);display:inline-block;width:1.5rem;color:var(--c-fixer);font-family:"IBM Plex Mono",monospace}
  .ladder .bd{color:var(--muted);font-size:.92rem}
  .ladder .nx{font-size:.82rem;color:var(--faint);border-left:1px solid var(--border);padding-left:.9rem}
  .ladder .nx b{color:var(--ink)}
  @media(max-width:760px){.ladder li{grid-template-columns:1fr}.ladder .nx{border-left:0;padding-left:0}}

  .chart-hd{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap}
  .seg{display:inline-flex;border:1px solid var(--border);border-radius:3px;overflow:hidden}
  .seg button{font:inherit;font-size:.8rem;cursor:pointer;background:none;border:0;color:var(--muted);padding:.4rem .8rem}
  .seg button + button{border-left:1px solid var(--border)}
  .seg button.on{background:var(--raised);color:var(--ink)}
  .seg button:focus-visible{outline:2px solid var(--amber);outline-offset:-2px}
  .chart-scroll{overflow-x:auto;margin-top:.8rem}
  .rt{width:100%;min-width:620px;height:auto;display:block}
  .rt .grid{stroke:var(--grid);stroke-width:1}
  .rt .ax{fill:var(--faint);font-family:"IBM Plex Mono",monospace;font-size:11px}
  .rt .band{fill:var(--medic-soft)}
  .rt .bandlbl{fill:var(--c-medic);font-family:"IBM Plex Mono",monospace;font-size:10.5px}
  .rt .ref{stroke:var(--c-trainer);stroke-width:1.5;stroke-dasharray:4 3}
  .rt .reflbl{fill:var(--c-trainer);font-family:"IBM Plex Mono",monospace;font-size:10.5px}
  .rt .lbl{fill:var(--muted);font-size:12px}
  .rt .bar{fill:var(--amber-fill)}
  .rt .bar.long{fill:var(--amber)}
  .rt .val{fill:var(--ink);font-family:"IBM Plex Mono",monospace;font-size:11px}
  .rt g:hover .bar{fill:var(--c-fixer)}

  .capbars .bar-row{grid-template-columns:13rem 1fr}
  @media(max-width:560px){.capbars .bar-row{grid-template-columns:1fr}.capbars .bar-row .lbl{text-align:left}}
  table.lanes tbody th{text-align:left;color:var(--faint);font-family:"IBM Plex Mono",monospace;
    font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;vertical-align:top}
  .lane-note{display:block;font-size:.66rem;color:var(--faint);font-weight:400;text-transform:none;letter-spacing:.02em}
</style>
