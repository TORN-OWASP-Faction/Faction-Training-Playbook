<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import { naturalEnergy, gainPerEnergy } from '$lib/progression.js';

  const nf = new Intl.NumberFormat('en-US');
  const ENERGY_PER_ATTACK = 25;
  const dayEnergy = naturalEnergy(5, 'real'); // a donator checking in 5 times a day

  // [basket, treats collected to reach it, honor it earns]
  const LEVELS = [
    ['Spooky', 0], ['Creepy', 5], ['Freaky', 15], ['Frightful', 40, 'Phantastic'], ['Haunting', 90],
    ['Shocking', 190], ['Terrifying', 440, 'Something Humerus'], ['Horrifying', 940],
    ['Petrifying', 1940], ['Nightmarish', 4440, 'Oh My Gourd!']
  ];

  // [upgrade, treat cost, what it does]
  const FIRST_UPGRADES = [
    ['I See Dead People', 3, '+10% treat chance while you wear spooky clothing'],
    ["Here's Johnny!", 5, '+10% treat chance when a spooky weapon lands the final hit'],
    ['Doubler', 25, '20% chance a treat drop is doubled'],
    ['Tripler', 50, '10% chance a treat drop is tripled'],
    ['Quadrupler', 75, '5% chance a treat drop is quadrupled']
  ];
  let spent = 0;
  const upgrades = FIRST_UPGRADES.map(([name, cost, what]) => [name, cost, (spent += cost), what]);

  // Average treats collected after every 10 attacks (0, 10, 20 … 800), from simulating the wiki's odds: 35% base,
  // +5% per basket level, +10% each for clothing and weapon, upgrades bought in the order above.
  const TREATS_PER_10 = [0, 4, 9, 15, 21, 28, 35, 42, 51, 59, 67, 76, 85, 95, 106, 116, 127, 138, 149, 160, 172, 185, 198,
    211, 224, 237, 251, 264, 278, 291, 305, 319, 333, 347, 360, 374, 388, 402, 416, 430, 444, 458, 473, 487, 502, 517, 531,
    546, 560, 575, 590, 604, 619, 634, 648, 663, 678, 692, 707, 721, 736, 751, 765, 780, 795, 809, 824, 838, 853, 868, 882,
    897, 912, 927, 942, 957, 972, 988, 1003, 1019, 1034];

  function expectedTreats(attacks) {
    const i = attacks / 10;
    const last = TREATS_PER_10.length - 1;
    if (i >= last) return TREATS_PER_10[last] + (i - last) * 15.5;
    const lo = Math.floor(i);
    return TREATS_PER_10[lo] + (TREATS_PER_10[lo + 1] - TREATS_PER_10[lo]) * (i - lo);
  }

  // A new player: about 5k in the stat, Silver Gym (3.4 dots), normal happy vs a 35k happy jump.
  const newPlayerGain = gainPerEnergy(5000, 1925, 3.4, 0.02);
  const jumpTimes = Math.round(gainPerEnergy(5000, 35000, 3.4, 0.02) / newPlayerGain);

  let perDay = $state(250);
  let days = $state(7);
  const PRESETS = [['Just the merit', 250], ['Half my energy', 325], ['All my natural energy', dayEnergy]];

  const attacks = $derived(Math.floor(perDay / ENERGY_PER_ATTACK) * days);
  const treats = $derived(Math.round(expectedTreats(attacks)));
  const reached = $derived(LEVELS.filter(([, need]) => treats >= need));
  const merits = $derived(reached.filter(([, , honor]) => honor).length);
  const statsGivenUp = $derived(Math.round(attacks * ENERGY_PER_ATTACK * newPlayerGain));

</script>

<svelte:head><title>Halloween: Trick or Treat · Faction Training Playbook</title></svelte:head>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Seasonal event · usually 25 October – 1 November</span>
  <h1>Trick or <em>Treat</em></h1>
  <p class="lede">For one week a year, every attack you start can drop a treat into a Halloween basket. You spend treats on basket upgrades, and your first 40 earn a merit. This is everything a new player needs.</p>
  <div class="facts">
    <div class="tile"><span>When</span><b>25 Oct – 1 Nov</b><small>Baskets go on sale at 10:00 TCT</small></div>
    <div class="tile"><span>You need</span><b>Level 5 + $35</b><small>For the Halloween Basket</small></div>
    <div class="tile"><span>You earn</span><b>Treats</b><small>From attacks you start and win</small></div>
    <div class="tile"><span>Your goal</span><b>40 treats</b><small>Frightful basket = a merit</small></div>
  </div>
</div></header>

<section id="steps"><div class="wrap">
  <span class="eyebrow">The whole event</span>
  <h2>Six steps</h2>
  <ol class="steps" style="margin-top:1.2rem">
    <li><div><b>Be level 5 by 25 October.</b><small>You can't buy a basket before level 5.</small></div></li>
    <li><div><b>Buy a Halloween Basket.</b><small>$35 at Sally's Sweet Shop in the city. It restocks 1,000 baskets every 15 minutes, so if it's sold out, come back after the next restock. It counts toward your 100 items a day from city shops, so do your other city shopping first.</small></div></li>
    <li><div><b>Buy spooky gear.</b><small>Any spooky clothing and a spooky weapon each add +10% to your treat chance. Cheapest right now: an <b>Axe</b> (about $2–4k) and a <b>Kabuki Mask</b> (about $10k from a city shop), or a Scarred Man or Nun Mask (about $20k on the item market). During the event, an item's description says "Spooky: Yes".</small></div></li>
    <li><div><b>Unlock the two gear upgrades first.</b><small>Open your basket (Items → Special → Use) and buy <b>I See Dead People</b> (3 treats), then <b>Here's Johnny!</b> (5 treats). Until you do, the gear does nothing.</small></div></li>
    <li><div><b>Attack in your gear, and finish with the spooky weapon.</b><small>Only attacks you start <b>and win</b> can drop a treat. Losses and defends don't. Leave, mug or hospitalize: the chance is the same. <a href="#targets">Picking targets →</a></small></div></li>
    <li><div><b>Save your treats for upgrades.</b><small>Don't press "Exchange All Treats": it spends every treat you hold. Treats and basket progress carry over to next year.</small></div></li>
  </ol>
  <p class="note">Also free: log in on 31 October for the Halloween login honor. <a href="{base}/start/#week">More cheap merits →</a></p>
</div></section>

<section id="upgrades"><div class="wrap">
  <span class="eyebrow">Spend treats in this order</span>
  <h2>Your first upgrades</h2>
  <p class="lede">Upgrades use up treats. Buy them in this order, one as soon as you can afford it.</p>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>#</th><th>Upgrade</th><th class="num">Cost</th><th class="num">Spent so far</th><th>What it does</th></tr></thead>
    <tbody>
      {#each upgrades as [name, cost, total, what], i}
        <tr><td class="mono">{i + 1}</td><td class="nowrap"><b>{name}</b></td><td class="num mono">{cost}</td><td class="num mono">{total}</td><td>{what}</td></tr>
      {/each}
    </tbody>
  </table></div>
  <p class="note">After these, the order jumps between tiers. Follow Andyman's full chart in <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16192843&b=0&a=0" target="_blank" rel="noopener">IceBlueFire's forum guide</a>.</p>
</div></section>

<section id="levels"><div class="wrap">
  <span class="eyebrow">Free, automatic</span>
  <h2>Basket levels</h2>
  <p class="lede">Your basket levels up on its own. It counts every treat you've ever collected, spent or not, so buying upgrades never slows it down. Each level adds +5% to your treat chance.</p>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Basket</th><th class="num">Treats collected</th><th class="num">Chance</th><th class="num">With both gear upgrades</th><th>Honor</th></tr></thead>
    <tbody>
      {#each LEVELS as [name, need, honor], i}
        <tr class:goal={name === 'Frightful'}>
          <td><b>{name}</b></td><td class="num mono">{nf.format(need)}</td>
          <td class="num mono">{35 + i * 5}%</td><td class="num mono">{Math.min(100, 55 + i * 5)}%</td>
          <td>{#if honor}{honor} <span class="merit">+1 merit</span>{/if}</td>
        </tr>
      {/each}
    </tbody>
  </table></div>
</div></section>

<section id="energy"><div class="wrap">
  <span class="eyebrow">What it costs you</span>
  <h2>Plan your week</h2>
  <p class="lede">Every attack uses {ENERGY_PER_ATTACK} energy, and that's energy you don't train with. Pick how much you'll spend and see where your basket ends up.</p>
  <div class="planner">
    <div class="presets" role="group" aria-label="Quick picks">
      {#each PRESETS as [label, e]}
        <button class="chip" aria-pressed={perDay === e} onclick={() => (perDay = e)}>{label}</button>
      {/each}
    </div>
    <div class="sliders">
      <label>Energy a day for attacks: <b class="mono">{nf.format(perDay)}</b>
        <input type="range" min="0" max="1500" step="25" bind:value={perDay} />
      </label>
      <label>Event days you'll play: <b class="mono">{days}</b>
        <input type="range" min="1" max="7" step="1" bind:value={days} />
      </label>
    </div>
    <div class="results" aria-live="polite">
      <div class="tile"><span>Attacks</span><b class="mono">{nf.format(attacks)}</b><small>{Math.floor(perDay / ENERGY_PER_ATTACK)} a day</small></div>
      <div class="tile"><span>Treats, on average</span><b class="mono">{nf.format(treats)}</b><small>Luck swings this a lot</small></div>
      <div class="tile"><span>Basket</span><b>{reached.at(-1)[0]}</b><small>{merits ? `${merits} merit${merits > 1 ? 's' : ''}` : 'No merit yet: 40 treats'}</small></div>
      <div class="tile"><span>Training given up</span><b class="mono">~{nf.format(statsGivenUp)}</b><small>stats, at 5k in a stat</small></div>
    </div>
    <ol class="levels" aria-label="Basket levels">
      {#each LEVELS as [name, need, honor]}
        <li class:on={treats >= need} class:honor={honor}><span>{name}</span><small class="mono">{nf.format(need)}</small></li>
      {/each}
    </ol>
  </div>
  <p class="note">Averages from simulating the wiki's odds with the gear and upgrades above, assuming you win every attack; your luck will vary. A donator gets about {dayEnergy} natural energy a day. Without spooky gear, Frightful takes about 92 attacks instead of 67.</p>
  <Character variant="trainer" name="Rep" tag="Coach's Tip" initial="M" img="trainer.png">
    "Get your basket to Frightful for the merit, then go back to the gym. Your basket keeps its progress, so the next levels will still be there next October."
  </Character>
</div></section>

<section id="strats"><div class="wrap">
  <span class="eyebrow">Get more for less</span>
  <h2>Strategies that work</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Spend the right energy</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">↑</span><div><b>Never spend happy-jump energy on treats.</b> At your stats, a jump trains about {jumpTimes}× more per energy than a normal session. Attack on normal days and keep jump days for the gym.</div></li>
        <li><span class="k">⛓</span><div><b>Hit on your faction's chains.</b> A chain hit is still an attack, so it rolls for a treat and earns respect at the same time. Ask leadership when chains are planned during event week.</div></li>
        <li><span class="k">✓</span><div><b>Stop at your goal.</b> For most new players that's Frightful and its merit. After that, each treat costs training you won't get back.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Make every attack count</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">⚔</span><div><b>Fight with the Axe from the first hit</b> on weak targets, so the final hit is always spooky. On tougher ones, open with your gun and switch to the Axe when they're nearly down.</div></li>
        <li><span class="k">✓</span><div><b>Gear on before the first attack.</b> Equip the mask and the Axe, and check they say "Spooky: Yes".</div></li>
        <li><span class="k">$</span><div><b>Buy gear early.</b> Spooky items tend to get pricier as the event gets close. The Axe also sells in a city shop.</div></li>
        <li><span class="k">↻</span><div><b>Think in years.</b> Basket progress and upgrades never reset. Frightful this year; Shocking and Terrifying (a second merit) as your energy grows.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<section id="targets"><div class="wrap">
  <span class="eyebrow">Who to hit</span>
  <h2>Picking targets</h2>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">✓</span><div>Pick players you beat in a few hits. <a href="{base}/scripts/">FF Scouter</a> shows who. A lost fight drops no treat, wastes the energy and puts you in hospital.</div></li>
      <li><span class="k">Zz</span><div>The safest targets are low-level players with no faction who haven't been active for weeks (their profile shows Last Action). Easy wins, and nobody comes back for revenge.</div></li>
      <li><span class="k">↩</span><div>When you win, choose <b>Leave</b>. Every finish has the same treat chance, and Leave gives the most experience without taking their cash, so fewer people come back for revenge.</div></li>
      <li><span class="k">⚑</span><div>Never hit your own faction or its allies. Follow your faction's rules on who to attack, and ask leadership if you're not sure.</div></li>
      <li><span class="k">$</span><div>Don't carry cash while you're picking fights. <a href="{base}/start/#safe">Keep your money →</a></div></li>
    </ul>
  </div>
  <Character variant="militia" name="Rook" tag="Rook's Rule" initial="R" img="militia.png">
    "Easy wins, clean exits. You want treats, not a feud with someone twice your size."
  </Character>
</div></section>

<section id="exchange"><div class="wrap">
  <span class="eyebrow">Later on</span>
  <h2>Exchanging treats</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>What "Exchange All Treats" does</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">!</span><div>It swaps <b>every</b> treat you hold for candy, alcohol and energy drinks. Treats saved for upgrades are gone.</div></li>
        <li><span class="k">✓</span><div>In your first years, keep the treats. Upgrades pay you back every October.</div></li>
        <li><span class="k">10</span><div>Once you own the upgrades you want, exchange 100 at a time. With the Freebie upgrade, every 10 treats exchanged gives 1 free.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>What bigger baskets unlock</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">II</span><div><b>Frightful:</b> better candy, alcohol and energy drinks from exchanges.</div></li>
        <li><span class="k">III</span><div><b>Shocking:</b> Save Your Tears (+500 happy per treat exchanged, up to 99,999: a <a href="{base}/training/#idea">happy jump</a>), Dark Power (+5 energy per treat, up to 1,000) and Cold Sweat (+1 nerve per treat).</div></li>
        <li><span class="k">IV</span><div><b>Horrifying:</b> exchanges can turn into eDVDs and FHCs, plus Shadow of Doubt (+1,100 treats).</div></li>
        <li><span class="k">✗</span><div>Summoning M'aol takes 9,999 treats and years of saving. Not a new-player goal.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<footer><div class="wrap">
  <strong>Trick or Treat.</strong> Event rules, basket levels and upgrade costs from <strong>IceBlueFire [776]</strong>'s Halloween Trick or Treat Guide and the <a href="https://wiki.torn.com/wiki/Trick_or_Treat" target="_blank" rel="noopener">Trick or Treat</a> wiki page; upgrade order from Andyman; odds from Proxima's spooky-weapon chart. Item prices from the Torn API on 24 September 2026. Attack counts are our own simulation. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.8rem;margin-top:1.4rem}
  .facts .tile{display:flex;flex-direction:column;gap:.1rem;border-radius:3px}
  .facts span{font-family:"IBM Plex Mono",monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .facts b{font-family:"Oswald",sans-serif;font-size:1.35rem;font-weight:600}
  .facts small{color:var(--muted);font-size:.82rem}
  .note{color:var(--muted);font-size:.9rem;margin-top:.8rem}
  .num{text-align:end;white-space:nowrap}
  .nowrap{white-space:nowrap}
  tr.goal td{background:var(--amber-soft)}
  .planner{margin-top:1.2rem;background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.1rem 1.2rem;display:grid;gap:1rem}
  .presets{display:flex;flex-wrap:wrap;gap:.4rem}
  .sliders{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:.8rem 1.4rem}
  .sliders label{display:grid;gap:.3rem;color:var(--muted);font-size:.9rem}
  .sliders b{color:var(--ink)}
  .sliders input{width:100%;accent-color:var(--amber)}
  .results{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:.7rem}
  .results .tile{display:flex;flex-direction:column;gap:.1rem;border-radius:3px;background:var(--raised)}
  .results span{font-family:"IBM Plex Mono",monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .results b{font-family:"Oswald",sans-serif;font-size:1.5rem;font-weight:600}
  .results small{color:var(--muted);font-size:.8rem}
  .levels{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(5.2rem,1fr));gap:4px}
  .levels li{border:1px solid var(--border);border-radius:2px;padding:.35rem .45rem;display:flex;flex-direction:column;color:var(--muted);font-size:.78rem}
  .levels li small{font-size:.68rem}
  .levels li.on{background:var(--amber-soft);border-color:color-mix(in srgb,var(--amber) 45%,var(--border));color:var(--ink)}
  .levels li.honor{border-top:2px solid var(--amber)}
  .merit{font-family:"IBM Plex Mono",monospace;font-size:.7rem;color:var(--amber);border:1px solid var(--amber-soft);border-radius:3px;padding:1px 5px;margin-inline-start:.3rem;white-space:nowrap}
</style>
