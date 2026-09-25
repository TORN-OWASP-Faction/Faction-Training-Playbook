<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import Tabs from '$lib/Tabs.svelte';

  // [class, total racing points earned to reach it, Baldr's car pick, points to spend on arrival, points to carry forward]
  const CLASSES = [
    ['E', 0, 'Papani Colé', 1, 24],
    ['D', 25, 'Tabata RM2', 15, 84],
    ['C', 100, 'Chevalier CZ06', 63, 171],
    ['B', 250, 'Volt MNG or Colina Tanprice', 130, 266],
    ['A', 475, 'Veloria LFA or Edomondo NSX', 266, null]
  ];

  // Grando's upgrades per class, best value first. [upgrade, racing points]
  const UPGRADES = {
    E: [['Strip Out', 1]],
    D: [['Strip Out', 1], ['Fast Road Tyres', 6], ['Polished Throttle Body', 4], ['Uprated Air Filter Element', 2], ['Back Box', 2]],
    C: [['Strip Out', 1], ['Track/Rally Tyres', 6], ['Competition Polished Throttle Body', 6], ['Full Exhaust System', 6],
      ['Uprated Air Filter Element', 2], ['Stage One Turbo Kit', 12], ['Grooved & Drilled Brake Discs', 6],
      ['Competition Racing Fuel Pump', 6], ['Uprated Forged Pistons', 6], ['Ultra-Light Flywheel', 6],
      ['Fixed Rear Spoiler', 3], ['Ported and Polished Head', 3]],
    B: [['Strip Out', 1], ['Track/Rally/Rally-Cross Tyres', 6], ['Bored Out Engine & Forged Pistons', 6],
      ['Competition Polished Throttle Body', 6], ['Forced Induction Kit', 6], ['Full Exhaust System', 6], ['Stage Two Turbo Kit', 12],
      ['Adjustable Rear Spoiler', 6], ['Paddle Shift/Rally Gearbox (Long/Short)', 10], ['Grooved & Drilled Brake Discs', 6],
      ['Competition Racing Fuel Pump', 6], ['Stainless Steel 4-1 Manifold', 6], ['Ultra-Light Flywheel', 6], ['Ported and Polished Head', 3],
      ['Coil-over Suspension (Hard/Soft/Medium)', 8], ['4 Pot Uprated Brakes', 8], ['Competition Racing Brake Pads', 6],
      ['Air Cooling Ducts for Brakes', 6], ['Front Mounted Intercooler', 6], ['4 Pin Differential', 4], ['Air Forced Engine Cooling', 4],
      ['Quick Shift', 2]],
    A: [['Strip Out', 1], ['Track/Rally/Rally-Cross Tyres', 6], ['Bored Out Engine & Forged Pistons', 6], ['Custom Forced Induction Kit', 6],
      ['Competition Polished Throttle Body', 6], ['Full Exhaust System', 6], ['Adjustable Rear Spoiler', 6], ['Competition Racing Camshaft', 6],
      ['Super Octane Fuel Plus Nitrous', 6], ['Front Diffuser', 8], ['Rear Diffuser', 8], ['Paddle Shift/Rally Gearbox (Long/Short)', 10],
      ['Grooved & Drilled Brake Discs', 6], ['Competition Racing Fuel Pump', 6], ['Stainless Steel 4-1 Manifold', 6], ['Ultra-Light Flywheel', 6],
      ['Ported and Polished Head', 3], ['Adjustable Coil-over/Group N Rally Suspension', 8], ['Stage Three Turbo Kit', 18],
      ['6 Pot Uprated Brakes', 10], ['Stage Three Remap', 10], ['Air Cooling Ducts for Brakes', 6], ['Competition Racing Brake Pads', 6],
      ['Front Mounted Intercooler', 6], ['4 Pin Differential', 4], ['Air Forced Engine Cooling', 4], ['Quick Shift', 2],
      ['Ultra Lightweight Alloys', 8], ['Competition Race Clutch', 6], ['Lightweight Flocked Dash', 6], ['Polycarbonate Windows', 6],
      ['Carbon Fiber Boot', 6], ['Carbon Fiber Roof', 6], ['Carbon Fiber Bonnet', 6], ['Fast Road Brake Fluid', 4], ['Braided Brake Hoses', 4],
      ['Polyurethane Bushes Front', 4], ['Polyurethane Bushes Rear', 4], ['Upper Front Strut Brace', 4], ['Lower Front Strut Brace', 4],
      ['Rear Strut Brace', 4], ['Adjustable Rear Control Arms', 4], ['Front Adjustable Tie Rods', 4], ['Racing Steering Wheel', 4],
      ['Brake Balance Bias Control', 6]]
  };

  // Baldr's alternative for Class B: a Colina Tanprice, upgraded only with parts you keep in Class A. [area, [upgrade, points]]
  const COLINA = [
    ['Aerodynamics', [['Adjustable Rear Spoiler', 6], ['Air Forced Engine Cooling', 4], ['Air Cooling Ducts for Brakes', 6]]],
    ['Brakes', [['Competition Racing Brake Pads', 6], ['Grooved & Drilled Brake Discs', 6], ['Fast Road Brake Fluid', 4], ['Braided Brake Hoses', 4], ['Brake Balance Bias Control', 6]]],
    ['Engine', [['Ported and Polished Head', 3], ['Competition Polished Throttle Body', 6], ['Competition Racing Fuel Pump', 6], ['Front Mounted Intercooler', 6], ['Bored Out Engine & Forged Pistons', 6]]],
    ['Exhaust', [['Full Exhaust System', 6], ['Stainless Steel 4-1 Manifold', 6]]],
    ['Suspension', [['Polyurethane Bushes Front', 4], ['Polyurethane Bushes Rear', 4], ['Upper Front Strut Brace', 4], ['Lower Front Strut Brace', 4], ['Rear Strut Brace', 4], ['Adjustable Rear Control Arms', 4], ['Front Adjustable Tie Rods', 4]]],
    ['Transmission', [['Quick Shift', 2], ['4 Pin Differential', 4], ['Competition Race Clutch', 6], ['Ultra-Light Flywheel', 6], ['Rally Gearbox (Long)', 10]]],
    ['Weight reduction', [['Strip Out', 1], ['Racing Steering Wheel', 4], ['Lightweight Flocked Dash', 6], ['Polycarbonate Windows', 6], ['Carbon Fiber Trunk', 6], ['Carbon Fiber Roof', 6]]],
    ['Wheels & tyres', [['Rally Tyres', 6]]]
  ];
  const colinaTotal = COLINA.reduce((sum, [, list]) => sum + total(list), 0);
  const upgradeTabs = Object.entries(UPGRADES).map(([cls, list]) => ({
    label: `Class ${cls}`,
    note: `${total(list)} point${total(list) > 1 ? 's' : ''}`,
    rows: list.map(([name, pts], i) => [`${i + 1} · ${pts} pt${pts > 1 ? 's' : ''}`, name])
  }));

  function total(list) {
    return list.reduce((sum, [, pts]) => sum + pts, 0);
  }

  const MERITS = [
    ['Driving Elite', 'Reach Class A (475 racing points earned).', 'Usually first'],
    ['Chequered Past', 'Win 100 races.', 'Along the way'],
    ['Redline', 'Win 250 races in the same car. Custom races count.', 'After Class A'],
    ['Motorhead', 'Reach a driving skill of 10.', 'Later'],
    ['On Track', 'Earn 2,500 racing points.', 'Usually last'],
    ['Wrecked', 'Crash during a race.', 'Random: early or late']
  ];
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Racing · with Gearbox</span>
  <h1>Learn the <em>road</em></h1>
  <p class="lede">Racing won't make you money. It costs a little, uses time instead of energy or nerve, and pays out six merits along the way. Here's how to start without wasting your points.</p>
  <div class="facts">
    <div class="tile"><span>To start</span><b>50 points</b><small>A racing license, about $1.6M</small></div>
    <div class="tile"><span>It costs you</span><b>Time</b><small>1–1.5 hours per official race</small></div>
    <div class="tile"><span>The catch</span><b>No flying</b><small>You can't travel while in a race</small></div>
    <div class="tile"><span>You earn</span><b>6 merits</b><small>Over months, not days</small></div>
  </div>
</div></header>

<section id="gearbox"><div class="wrap">
  <span class="eyebrow">New to the crew</span>
  <h2>Meet Gearbox</h2>
  <div class="meet">
    <div class="crew racer portrait">
      <div class="art" style="background-image:url('{base}/assets/bg_racing.webp')"></div>
      <div class="fallback" aria-hidden="true">A</div>
      <div class="veil"></div>
      <img class="art" src="{base}/assets/racer.webp" alt="Axel Rivera, the racer, holding his helmet" style="background:none" fetchpriority="high">
      <div class="cap"><div class="role">Racer · Driving</div><div class="who">Axel "Gearbox" Rivera</div><div class="dom">Racing · driving skill · cars · upgrades</div></div>
    </div>
    <div class="bio">
      <p class="lede" style="margin-top:0">Gearbox came up through street racing and learned that nerve only gets a driver so far. He knows engines, tires and roads, and, more to the point, when not to push. He treats driving skill the way Rep treats battle stats: built lap by lap, never bought overnight.</p>
      <blockquote>"The car gives you potential. The driver decides how much of it gets used."</blockquote>
      <h3>How he thinks about a race</h3>
      <ul class="rules">
        <li><span class="k">1</span><div><b>Driver:</b> your driving skill. It grows every race, win or lose.</div></li>
        <li><span class="k">2</span><div><b>Machine:</b> the right car for your class, with the upgrades that matter.</div></li>
        <li><span class="k">3</span><div><b>Road:</b> some cars suit some tracks. The records tell you which.</div></li>
        <li><span class="k">4</span><div><b>Consistency:</b> clean finishes, race after race.</div></li>
      </ul>
      <p class="crewnote">Nico knows where to find the car. Ledger tells you whether you can afford it. Gearbox tells you whether you can actually drive it.</p>
    </div>
  </div>
</div></section>

<section id="start"><div class="wrap">
  <span class="eyebrow">Before the flag</span>
  <h2>Your first race</h2>
  <ol class="steps" style="margin-top:1.2rem">
    <li><div><b>Buy a racing license.</b><small>50 points at the Points Building. It's not the driver's license from education; that's a different thing, and you don't need it.</small></div></li>
    <li><div><b>Buy a Class E car: the Papani Colé.</b><small>About $10k. Check <a href="{base}/start/#selling">weav3r</a> for the best price. Don't buy a faster car: you can't use its speed until you've built the skill.</small></div></li>
    <li><div><b>Go to the Racetrack and join an official race.</b><small>City → Racetrack, in the Red Light district → Official Events. A race starts when it fills or an hour after the first driver joins.</small></div></li>
    <li><div><b>Race as often as you can.</b><small>Every race adds driving skill. Finishing in the top 3 earns racing points, which buy upgrades and move you up a class.</small></div></li>
    <li><div><b>Spend 1 point, then save.</b><small>In Class E, buy the Strip Out (1 point) and nothing else. <a href="#points">Why you save →</a></small></div></li>
  </ol>
  <Character variant="racer" name="Gearbox" tag="Pit Advice" initial="A" img="racer.png">
    "Buy the car you can use, not the one you can brag about. Class E teaches you the road. Run it again."
  </Character>
</div></section>

<section id="classes"><div class="wrap">
  <span class="eyebrow">E to A</span>
  <h2>Classes and cars</h2>
  <p class="lede">You move up a class by racing points <b>earned</b> in official races, not points you still hold, so saving never slows you down. Each class means a new car, and points spent on the old car stay with it.</p>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Class</th><th class="num">Points earned to reach</th><th>Car to buy (Baldr)</th><th class="num">Spend on arrival</th><th class="num">Carry to the next class</th></tr></thead>
    <tbody>
      {#each CLASSES as [cls, reach, car, spend, carry]}
        <tr>
          <td><b>Class {cls}</b>{#if cls === 'A'} <span class="merit">+1 merit</span>{/if}</td>
          <td class="num mono">{reach}</td><td>{car}</td>
          <td class="num mono">{spend}{#if cls === 'A'} (full){/if}</td><td class="num mono">{carry ?? '—'}</td>
        </tr>
      {/each}
    </tbody>
  </table></div>
  <p class="note">Before buying a car in a new class, open Statistics at the Racetrack. It lists the top five cars on every track. Pick the car that shows up most often, on the most tracks. Racing points from company specials buy upgrades but don't count toward your class.</p>
</div></section>

<section id="points"><div class="wrap">
  <span class="eyebrow">Garage talk</span>
  <h2>Spend points like this</h2>
  <p class="lede">The mistake nearly everyone makes: spending every point to win now, then arriving in the next class with nothing, against drivers with upgraded cars and more skill. Follow this and you reach Class A with exactly 266 points, enough to upgrade your first A car fully (plus about $700k in parts).</p>
  <Tabs items={upgradeTabs} accent="var(--c-racer)" />
  <p class="note">Buy top to bottom: the list runs from most speed per point to least. If you arrive with fewer points than the plan, stop early and buy the rest as you earn them. In Class A, the 266 points buy everything except safety upgrades, which don't make you faster; they only shorten hospital after a crash.</p>

  <div class="grid2" style="margin-top:1.2rem;align-items:start">
    <div class="card">
      <h3>Class B: Volt MNG or Colina Tanprice?</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">V</span><div><b>Volt MNG:</b> follow the Class B list above and save 40–50 points for your first A car. The safe, common route.</div></li>
        <li><span class="k">C</span><div><b>Colina Tanprice:</b> no saving. Upgrade it with parts you keep in Class A (the list on the right) and it becomes your first A car. It's the best car on the Mudpit even in A and fine on dirt, but weaker on tarmac, and there are more tarmac tracks. It's also expensive now.</div></li>
        <li><span class="k">=</span><div>Both work. Baldr used the Volt; players who took the Colina were happy with it too.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>The Colina route ({colinaTotal} points)</h3>
      <div class="colina">
        {#each COLINA as [area, list]}
          <div><span class="area">{area}</span>{#each list as [name, pts]}<div class="part"><span>{name}</span><span class="mono">{pts}</span></div>{/each}</div>
        {/each}
      </div>
      <p class="note" style="margin-top:.6rem">Short of points when you reach B? Leave Braided Brake Hoses, Fast Road Brake Fluid, Racing Steering Wheel and both front strut braces until last.</p>
    </div>
  </div>

  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">A</span><div><b>One car or two in Class A?</b> Put everything into your first A car until you have the 250-win merit or nothing left to buy. After that, some drivers build a second car so they have one for tarmac and one for dirt.</div></li>
      <li><span class="k">!</span><div>Upgrades stay with the car. Un-enlisting a car strips its upgrades, and you can't sell an enlisted car.</div></li>
    </ul>
  </div>
  <Character variant="racer" name="Gearbox" tag="Garage Talk" initial="A" img="racer.png">
    "Don't chase horsepower yet. Every point you save in D is a point you get to use in A, where it matters."
  </Character>
</div></section>

<section id="merits"><div class="wrap">
  <span class="eyebrow">Six of them</span>
  <h2>Racing merits</h2>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Honor</th><th>How</th><th>When you'll usually get it</th></tr></thead>
    <tbody>{#each MERITS as [name, how, when]}<tr><td class="nowrap"><b>{name}</b></td><td>{how}</td><td>{when}</td></tr>{/each}</tbody>
  </table></div>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">250</span><div><b>The Redline shortcut:</b> once you're in Class A, set up 1-lap custom races on the Speedway (the shortest track) with friends. Custom wins count toward 250 in one car. They give no racing points, but you can fit around 20 races an hour.</div></li>
      <li><span class="k">×2</span><div><b>Weekend Road Trip</b> (end of January) doubles racing points and skill. <a href="{base}/events/">Events calendar →</a></div></li>
    </ul>
  </div>
</div></section>

<section id="stuck"><div class="wrap">
  <span class="eyebrow">Can't finish top 3?</span>
  <h2>When you're stuck</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>More skill</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">↻</span><div>Keep racing. You gain skill even when you don't place.</div></li>
        <li><span class="k">100</span><div>Long races give more skill. Some drivers run 100-lap unofficial races just for it.</div></li>
        <li><span class="k">★</span><div>A 10★ Mechanic Shop gives +50% driving skill gain.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>More points</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">1★</span><div>Mechanic Shop and Car Dealership both have a 1★ special that turns 5 job points into a racing point.</div></li>
        <li><span class="k">3★</span><div>Both also give 75% off car parts at 3★.</div></li>
        <li><span class="k">7★</span><div>A 7★ Mechanic Shop means you lose no parts when you crash.</div></li>
      </ul>
    </div>
  </div>
  <Character variant="racer" name="Gearbox" tag="Racecraft" initial="A" img="racer.png">
    "Stop watching the other car. Drive yours. One clean race teaches you more than three crashes."
  </Character>
</div></section>

<section id="worth"><div class="wrap">
  <span class="eyebrow">Should you race?</span>
  <h2>Is it worth it for you?</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Race if</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">✓</span><div>You're online a lot anyway and have hours you aren't flying.</div></li>
        <li><span class="k">✓</span><div>You want the merits. Six permanent upgrades is a real reward.</div></li>
        <li><span class="k">✓</span><div>You're training stats, not flying all day. Racing uses no energy.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Wait if</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">✈</span><div>You fly flowers and plushies back to back. You can't travel mid-race. <a href="{base}/travel/">Flying for money →</a></div></li>
        <li><span class="k">$</span><div>$1.6M for the license is a big share of what you have. Get your <a href="{base}/start/#week">first week</a> set up first.</div></li>
      </ul>
    </div>
  </div>
  <Character variant="banker" name="Ledger" tag="Money Talk" initial="V" img="banker.png">
    "I asked him whether tires were an appreciating asset. He asked me to leave. Race for the merits, not the money."
  </Character>
</div></section>

<footer><div class="wrap">
  <strong>Racing.</strong> License, cars, classes and saving points from <strong>Baldr [1847600]</strong>'s <a href="https://www.torn.com/forums.php#/p=threads&f=21&t=15963648&b=0&a=0" target="_blank" rel="noopener">TORN Racing FAQ</a>; the per-class upgrade plan from <strong>Grando</strong>'s <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16324174&b=0&a=0" target="_blank" rel="noopener">What to upgrade in each class</a>; the Speedway shortcut from <strong>Madmiketyson [979994]</strong>'s <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=15958708&b=0&a=0" target="_blank" rel="noopener">Quick Route to Racing Merits</a>. Gearbox is our own character. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.8rem;margin-top:1.4rem}
  .facts .tile{display:flex;flex-direction:column;gap:.1rem;border-radius:3px}
  .facts span{font-family:"IBM Plex Mono",monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .facts b{font-family:"Oswald",sans-serif;font-size:1.35rem;font-weight:600}
  .facts small{color:var(--muted);font-size:.82rem}
  .meet{display:grid;grid-template-columns:minmax(0,20rem) minmax(0,1fr);gap:1.6rem;margin-top:1.2rem;align-items:start}
  .portrait{min-height:26rem}
  .bio h3{margin-top:1.2rem}
  .bio .rules{margin-top:.6rem}
  blockquote{margin:1rem 0;padding:.2rem 0;padding-inline-start:1rem;border-inline-start:3px solid var(--c-racer);font-style:italic;color:var(--ink);font-size:1.05rem}
  .crewnote{color:var(--muted);margin-top:1.2rem;font-size:.95rem}
  .note{color:var(--muted);font-size:.9rem;margin-top:.8rem}
  .num{text-align:end;white-space:nowrap}
  .nowrap{white-space:nowrap}
  .colina{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:.6rem 1rem;margin-top:.6rem;font-size:.86rem}
  .colina .area{display:block;font-family:"IBM Plex Mono",monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:.15rem}
  .colina .part{display:flex;justify-content:space-between;gap:.6rem;border-bottom:1px solid var(--border);padding:.12rem 0}
  .colina .part .mono{color:var(--muted)}
  .merit{font-family:"IBM Plex Mono",monospace;font-size:.7rem;color:var(--amber);border:1px solid var(--amber-soft);border-radius:3px;padding:1px 5px;margin-inline-start:.3rem;white-space:nowrap}
  @media(max-width:760px){.meet{grid-template-columns:1fr}.portrait{min-height:22rem;max-width:22rem}}
</style>
