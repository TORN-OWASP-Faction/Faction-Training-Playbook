<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import FormulaLab from '$lib/FormulaLab.svelte';

  // energy you get per $1,000,000 spent (higher = better value)
  const energyValue = [
    { l: 'LSD', e: 2439, note: '~$410/E' },
    { l: 'Xanax', e: 294, note: '~$3,400/E · +75 happy' },
    { l: 'Energy drink', e: 15, note: '~$65k/E · emergencies' }
  ];
  const evMax = Math.max(...energyValue.map((d) => d.e));
  // effective happy from a single +25 candy under stacking multipliers
  const candyStack = [
    { l: 'Base', h: 25 },
    { l: '+ Voracity ×1.5', h: 38 },
    { l: '+ Book ×2', h: 50 },
    { l: 'World Diabetes ×3', h: 75 },
    { l: 'All stacked ×9', h: 225 }
  ];
  const csMax = Math.max(...candyStack.map((d) => d.h));
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Training · deep dive</span>
  <h1>The training <em>math</em></h1>
  <p class="lede">Exactly how gym gains are calculated — the accepted community formula, what every term means, and why happy jumps work. If you just want it to do the work for you, use the <a href="{base}/planner/">live planner</a>.</p>
  <p style="margin-top:.6rem"><a href="{base}/#idea">← Back to the guide</a></p>
</div></header>

<section><div class="wrap">
  <span class="eyebrow">The shape of it</span>
  <h2>The base formula</h2>
  <p class="lede">At the top level, a single train is four things multiplied together:</p>
  <div class="callout" style="margin-top:1rem">
    <p class="mono" style="font-size:1rem;color:var(--amber);margin:0;letter-spacing:.01em">Stat Gain = Energy Spent × Gym Modifier × f(Stat Size) × g(Happiness)</p>
  </div>
  <p style="color:var(--muted);margin-top:1rem">More energy per train = proportionally more gain. Better gym (more dots) = more gain. Your current stat total and — above all — your <strong>happiness</strong> shape the rest. Happy is the lever you control minute to minute, and it matters most when your stats are still small.</p>

  <h3 style="margin-top:1.4rem">Try it — the interactive model</h3>
  <p style="color:var(--muted);margin:.2em 0 0">Set your stat, gym dots, energy and perks, then drag <b>Happy</b> and watch the gain curve. This is the exact V2.0 formula below, computed live on your numbers.</p>
  <FormulaLab />
</div></section>

<section><div class="wrap">
  <span class="eyebrow">The exact model</span>
  <h2>Training Formula V2.0</h2>
  <p class="lede">The most accurate community model (by Vladar). One train's gain:</p>
  <div class="callout" style="margin-top:1rem">
    <pre class="mono" style="margin:0;white-space:pre-wrap;font-size:.86rem;color:var(--ink);line-height:1.6">dS = ( S · ROUND(1 + 0.07·ROUND(LN(1 + H/250),4),4)
       + 8·H^1.05
       + (1 − (H/99999)²)·A
       + B
       + RANDBETWEEN(−C, C) )
     · (1/200000) · G · E
     · (1+PERK%₁) · (1+PERK%₂) · …</pre>
  </div>
  <div class="grid2" style="margin-top:1.2rem">
    <div class="card">
      <h3>What each symbol is</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">dS</span><div>Gain from one train.</div></li>
        <li><span class="k">S</span><div>Your current total of the stat being trained, <b>capped at 50,000,000</b> for this term.</div></li>
        <li><span class="k">H</span><div>Your <b>starting happy</b> for the train.</div></li>
        <li><span class="k">G</span><div>Gym dots ÷ 10 (the API stores them ×10, e.g. 73 → 7.3).</div></li>
        <li><span class="k">E</span><div>Energy per train (5 / 10 / 25 / 50).</div></li>
        <li><span class="k">PERK%</span><div>Each training perk, <b>multiplied</b> in (property, faction, education).</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Per-stat constants (A, B, C)</h3>
      <div class="tbl-scroll" style="margin-top:.6rem">
        <table>
          <thead><tr><th>Stat</th><th>A</th><th>B</th><th>C</th></tr></thead>
          <tbody>
            <tr><td>Strength</td><td class="mono">1600</td><td class="mono">1700</td><td class="mono">700</td></tr>
            <tr><td>Speed</td><td class="mono">1600</td><td class="mono">2000</td><td class="mono">1350</td></tr>
            <tr><td>Dexterity</td><td class="mono">1800</td><td class="mono">1500</td><td class="mono">1000</td></tr>
            <tr><td>Defense</td><td class="mono">2100</td><td class="mono">−600</td><td class="mono">1500</td></tr>
          </tbody>
        </table>
      </div>
      <p style="color:var(--faint);font-size:.8rem;margin:.6rem 0 0"><b>C</b> is only the size of the random spread (RANDBETWEEN) — leave it out of any prediction; treat the rest as the expected gain.</p>
    </div>
  </div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">What falls out of it</span>
  <h2>The rules that matter</h2>
  <div class="callout">
    <ul class="rules">
      <li><span class="k">ln</span><div><b>Happy has diminishing returns but never stops helping</b> — the ln term keeps rising, so a big jump is always worth more per point than the last.</div></li>
      <li><span class="k">×</span><div><b>Perks multiply, they don't add.</b> +2% property × +15% faction × +1% education = ×1.02 × 1.15 × 1.01 ≈ <b>+19.7%</b> on every train, forever.</div></li>
      <li><span class="k">↓</span><div><b>Training costs happy</b> — you lose 40–60% of the energy you spend as happy, which bounds how long a jump lasts before it decays.</div></li>
      <li><span class="k">⏱</span><div><b>Spend a jump before the reset.</b> Happy above your max resets to max at :00 / :15 / :30 / :45.</div></li>
      <li><span class="k">50M</span><div><b>The stat term caps at 50M</b> — beyond that, S stops adding, so happy and gym dots carry the gains.</div></li>
    </ul>
  </div>
  <Character variant="trainer" name="Rep" tag="Coach's Tip" initial="M" img="trainer.png">
    "You don't have to love the math — but respect what it says: consistent happy + stacked perks beat any one heroic session. Set it up once, then just show up."
  </Character>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">Making the call</span>
  <h2>Cost vs. gain — how to decide</h2>
  <p class="lede">Every training choice reduces to one number: <strong>how much stat does this dollar (or this energy point) buy?</strong> Rank your options on that and the "best" method becomes obvious for <em>your</em> situation. Plug real numbers into the <a href="{base}/planner/">live planner</a> — this is the reasoning behind it.</p>

  <div class="card" style="margin-top:1.2rem">
    <h3>1 · Permanent multipliers first</h3>
    <p style="margin:.3em 0 0;color:var(--muted)">Property happy, gym-gain <b>education</b>, and the faction perks are <b>×(1+PERK%)</b> on <em>every future train</em> — a one-time cost with an unbounded payoff. Their stat-per-dollar beats any consumable over a playing career, so buy these before you spend a cent on candy. A +1% gym-gain course pays out forever.</p>
  </div>

  <div class="card" style="margin-top:1rem">
    <h3>2 · Buy energy by cost-per-energy</h3>
    <p style="margin:.3em 0 0;color:var(--muted)">Energy is the raw input (the <b>E</b> in the formula). Compare sources by $ per energy:</p>
    <div class="tbl-scroll" style="margin-top:.6rem"><table>
      <thead><tr><th>Source</th><th>Energy</th><th>~ $/energy</th><th>Cooldown</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Natural regen</td><td class="mono">5 / 10–15 min</td><td class="mono">free</td><td class="mono">—</td><td>Never let it cap.</td></tr>
        <tr><td>LSD</td><td class="mono">+50</td><td class="mono">~$410</td><td class="mono">2 h drug</td><td>Cheapest cash energy; some happy too.</td></tr>
        <tr><td>Xanax</td><td class="mono">+250</td><td class="mono">~$3,400</td><td class="mono">8 h drug</td><td>Daily backbone: energy <em>and</em> +75 happy. OD risk.</td></tr>
        <tr><td>Energy drink</td><td class="mono">+5–30</td><td class="mono">~$45k–86k</td><td class="mono">none</td><td>Expensive per point — for cooldowns/emergencies, not bulk.</td></tr>
        <tr><td>Point refill</td><td class="mono">+150</td><td class="mono">points</td><td class="mono">none</td><td>For pushes, not daily.</td></tr>
      </tbody>
    </table></div>
    <div class="viz">
      <div class="vcap">Energy you get per $1,000,000 — longer is better value</div>
      {#each energyValue as d}
        <div class="vrow"><span class="vlab">{d.l}</span><span class="vtrack"><span class="vbar" style="width:{Math.max(2, (d.e / evMax) * 100)}%"></span></span><span class="vval mono">{d.e.toLocaleString()} E</span></div>
        <div class="vnote">{d.note}</div>
      {/each}
    </div>
    <p style="color:var(--faint);font-size:.8rem;margin:.6rem 0 0">LSD is the cheapest cash energy; Xanax is the workhorse (energy + happy); energy drinks are for emergencies, not bulk. Drugs share <b>one</b> drug cooldown — each dose adds to it, so you can't chain Xanax back-to-back. Time your doses around it; see <a href="{base}/medical/">Field medicine</a> for OD and cooldown management.</p>
  </div>

  <div class="card" style="margin-top:1rem">
    <h3>3 · Is a happy jump worth it?</h3>
    <p style="margin:.3em 0 0;color:var(--muted)">Happy is a <b>multiplier on the energy you then spend</b> — you're buying a higher <code>g(Happy)</code> and cashing it in across a burst of trains. The break-even:</p>
    <div class="callout" style="margin-top:.6rem">
      <p class="mono" style="margin:0;font-size:.86rem;color:var(--ink)">(gain/E at jump happy − gain/E at base happy) × energy you'll dump  &gt;  cost of the happy items</p>
    </div>
    <p style="margin:.6rem 0 0;color:var(--muted)">So the more energy you can dump in one window, the more a jump pays for itself. <b>Small energy on hand → cheap candy top-up. A big banked bar (Xanax stack) → an eDVD / premium jump earns its cost.</b> That ratio of happy-to-energy is exactly what Hank's / Baldr's Ratio formalizes.</p>
  </div>

  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>4 · Candy multiplies — hugely</h3>
      <p style="margin:.3em 0 0;color:var(--muted)">The same +25 candy is worth wildly different happy depending on your stacked multipliers:</p>
      <div class="viz">
        <div class="vcap">Effective happy from one +25 candy</div>
        {#each candyStack as d}
          <div class="vrow"><span class="vlab">{d.l}</span><span class="vtrack"><span class="vbar" style="width:{Math.max(2, (d.h / csMax) * 100)}%"></span></span><span class="vval mono">{d.h}</span></div>
        {/each}
      </div>
      <p style="color:var(--faint);font-size:.8rem;margin:.6rem 0 0">On <b>World Diabetes Day</b> (×9) candy is far cheaper per happy than eDVD; off-event, eDVD wins for big single jumps. The <a href="{base}/planner/">planner</a> ranks your items by $-per-happy.</p>
    </div>
    <div class="card">
      <h3>5 · Gym dots &amp; books</h3>
      <p style="margin:.3em 0 0;color:var(--muted)"><b>G</b> multiplies gain directly — unlocking the next gym is often a bigger jump than any consumable, so keep progressing gyms. Books like "Yes Please Diabetes" (×2 candy) pay off only if you jump on candy often enough to beat the book's cost.</p>
    </div>
  </div>

  <Character variant="banker" name="Ledger" tag="Worth the Cost?" initial="V" img="banker.png">
    "Cheap and inexpensive aren't the same thing. The right buy is the one with the best stat-per-dollar for where you are today — not the biggest number, and not what someone richer told you to buy."
  </Character>
</div></section>

<footer><div class="wrap">
  <strong>The training math.</strong> Formula credit: <strong>Vladar [1996140]</strong> (Training Formula V2.0); CE/nerve &amp; success factors from <strong>Owen [2087327]</strong>. Part of the <a href="{base}/">Faction Training Playbook</a> — see <a href="{base}/credits/">all credits</a>.
</div></footer>

<style>
  .viz{margin-top:.8rem;display:grid;gap:.35rem}
  .vcap{font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:var(--faint);font-weight:600;margin-bottom:.15rem}
  .vrow{display:grid;grid-template-columns:9rem 1fr auto;gap:.6rem;align-items:center}
  .vlab{font-size:.82rem;color:var(--muted);text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .vtrack{background:var(--raised);border-radius:2px;height:1.15rem;overflow:hidden}
  .vbar{display:block;height:100%;background:var(--amber);border-radius:2px;min-width:2px}
  .vval{font-size:.8rem;color:var(--ink);white-space:nowrap;font-variant-numeric:tabular-nums}
  .vnote{grid-column:1;margin:-.2rem 0 .1rem;font-size:.68rem;color:var(--faint);padding-left:9.6rem}
  @media(max-width:560px){.vrow{grid-template-columns:6.5rem 1fr auto}.vnote{padding-left:7.1rem}}
</style>
