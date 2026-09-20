<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import { onMount } from 'svelte';

  const STAT = { str: { A: 1600, B: 1700, C: 700 }, spd: { A: 1600, B: 2000, C: 1350 }, dex: { A: 1800, B: 1500, C: 1000 }, def: { A: 2100, B: -600, C: 1500 } };

  onMount(() => {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.getElementById('fchart');
    if (!svg) return;
    const cs = (n) => getComputedStyle(document.body).getPropertyValue(n).trim();
    const amber = cs('--amber') || '#C39A6B', grid = cs('--grid') || 'rgba(230,225,214,.08)', ink = cs('--ink') || '#E6E1D6', muted = cs('--muted') || '#9A948A';
    const W = 900, H = 380, m = { l: 54, r: 20, t: 20, b: 40 };
    const S = 10000, A = 1600, B = 1700;
    const bracket = (h) => S * (1 + 0.07 * Math.log(1 + h / 250)) + 8 * Math.pow(h, 1.05) + (1 - Math.pow(h / 99999, 2)) * A + B;
    const base0 = bracket(250), xMax = 100000, yMax = 90;
    const X = (h) => m.l + (h / xMax) * (W - m.l - m.r);
    const Y = (v) => H - m.b - (v / yMax) * (H - m.t - m.b);
    const mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
    const pts = [];
    for (let i = 0; i <= 120; i++) { let h = (i / 120) * xMax; if (h < 250) h = 250; pts.push([h, bracket(h) / base0]); }
    const line = pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join(' ');
    [0, 15, 30, 45, 60, 75, 90].forEach((g) => { const y = Y(g); svg.appendChild(mk('line', { x1: m.l, y1: y, x2: W - m.r, y2: y, stroke: grid, 'stroke-width': 1 })); const tx = mk('text', { x: m.l - 8, y: y + 4, 'text-anchor': 'end', 'font-size': 11, fill: muted }); tx.textContent = g + '×'; svg.appendChild(tx); });
    [[250, 'base'], [5000, '5k'], [25000, '25k'], [50000, '50k'], [100000, '99,999']].forEach((d) => { const x = X(d[0]); const tx = mk('text', { x, y: H - m.b + 20, 'text-anchor': 'middle', 'font-size': 11, fill: muted }); tx.textContent = d[1]; svg.appendChild(tx); });
    const defs = mk('defs', {}), lg = mk('linearGradient', { id: 'fg', x1: 0, y1: 0, x2: 0, y2: 1 });
    lg.appendChild(mk('stop', { offset: '0%', 'stop-color': amber, 'stop-opacity': .4 })); lg.appendChild(mk('stop', { offset: '100%', 'stop-color': amber, 'stop-opacity': .02 }));
    defs.appendChild(lg); svg.appendChild(defs);
    svg.appendChild(mk('path', { d: line + ` L${X(xMax)} ${Y(0)} L${X(250)} ${Y(0)} Z`, fill: 'url(#fg)' }));
    svg.appendChild(mk('path', { d: line, fill: 'none', stroke: amber, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }));
    [[5000, 'candy jump'], [25000, 'eDVD'], [99999, 'max']].forEach((d) => { const mult = bracket(d[0]) / base0, x = X(d[0]), y = Y(mult); svg.appendChild(mk('circle', { cx: x, cy: y, r: 4, fill: amber })); const anch = d[0] === 99999 ? 'end' : 'start'; const tx = mk('text', { x: d[0] === 99999 ? x - 6 : x + 8, y: y - 9, 'text-anchor': anch, 'font-size': 11, fill: ink, 'font-weight': 600 }); tx.textContent = `${d[1]} · ${Math.round(mult)}×`; svg.appendChild(tx); });
  });
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

  <div class="card" style="margin-top:1.4rem;overflow:hidden">
    <h3>Gym gain vs. happy <span style="color:var(--faint);font-weight:400;font-size:.8rem" class="mono">— relative to training at base happy</span></h3>
    <svg id="fchart" viewBox="0 0 900 380" style="width:100%;height:auto;display:block" role="img" aria-label="Gym gain multiple rising with happiness, ~1x at base up to ~88x at maximum"></svg>
    <p style="color:var(--faint);font-size:.8rem;margin:.4rem 0 0">Gain scales with <strong>ln(happy)</strong> plus a steeper happy term — which is the entire reason a happy jump (spike happy, dump energy) beats trickle-training.</p>
  </div>
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

<footer><div class="wrap">
  <strong>The training math.</strong> Formula credit: <strong>Vladar [1996140]</strong> (Training Formula V2.0); CE/nerve &amp; success factors from <strong>Owen [2087327]</strong>. Part of the <a href="{base}/">Faction Training Playbook</a> — see <a href="{base}/credits/">all credits</a>.
</div></footer>
