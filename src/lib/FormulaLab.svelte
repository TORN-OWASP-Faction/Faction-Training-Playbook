<script>
  const STAT = { str: { A: 1600, B: 1700 }, spd: { A: 1600, B: 2000 }, dex: { A: 1800, B: 1500 }, def: { A: 2100, B: -600 } };
  let statKey = $state('str');
  let S = $state(1000000);
  let G = $state(7.3);
  let E = $state(10);
  let perk = $state(20);
  let H = $state(25000);

  const nf = new Intl.NumberFormat('en-US');
  function dS(h) {
    const st = STAT[statKey];
    const Sc = Math.min(Math.max(S, 0), 50_000_000);
    const br = Sc * (1 + 0.07 * Math.log(1 + h / 250)) + 8 * Math.pow(h, 1.05) + (1 - Math.pow(h / 99999, 2)) * st.A + st.B;
    return (br / 200000) * Math.max(G, 0) * Math.max(E, 0) * (1 + Math.max(perk, 0) / 100);
  }
  const gain = $derived(dS(H));

  const W = 900, Ht = 340, m = { l: 66, r: 18, t: 16, b: 34 }, xMax = 99999;
  const X = (h) => m.l + (h / xMax) * (W - m.l - m.r);
  const yMax = $derived.by(() => { let mx = 0; for (let i = 0; i <= 60; i++) mx = Math.max(mx, dS((i / 60) * xMax)); return mx * 1.05 || 1; });
  const Y = (v) => Ht - m.b - (v / yMax) * (Ht - m.t - m.b);
  const path = $derived.by(() => { let p = ''; for (let i = 0; i <= 100; i++) { const h = (i / 100) * xMax; p += (i ? 'L' : 'M') + X(h).toFixed(1) + ' ' + Y(dS(h)).toFixed(1); } return p; });
  const area = $derived(`${path} L${X(xMax).toFixed(1)} ${Y(0).toFixed(1)} L${X(0).toFixed(1)} ${Y(0).toFixed(1)} Z`);
  const yticks = $derived.by(() => [0, 1, 2, 3, 4].map((k) => (yMax * k) / 4));
  const fmt = (v) => (v >= 1000 ? nf.format(Math.round(v)) : v.toFixed(1));
</script>

<div class="lab">
  <div class="controls">
    <label>Stat<select bind:value={statKey}><option value="str">Strength</option><option value="spd">Speed</option><option value="dex">Dexterity</option><option value="def">Defense</option></select></label>
    <label>Stat total (S)<input type="number" min="0" bind:value={S} /></label>
    <label>Gym dots (G)<input type="number" min="0.1" step="0.1" bind:value={G} /></label>
    <label>Energy/train (E)<select bind:value={E}><option value={5}>5</option><option value={10}>10</option><option value={25}>25</option><option value={50}>50</option></select></label>
    <label>Perks %<input type="number" min="0" step="1" bind:value={perk} /></label>
  </div>

  <div class="slider">
    <div class="slabel"><span>Happy (H)</span><span class="mono hv">{nf.format(H)}</span></div>
    <input type="range" min="250" max="99999" step="250" bind:value={H} />
  </div>

  <div class="readout">
    <div class="big"><span class="mono">{fmt(gain)}</span></div>
    <div class="sub">estimated stat gain this train &nbsp;·&nbsp; at {nf.format(H)} happy</div>
  </div>

  <svg viewBox="0 0 {W} {Ht}" class="chart" role="img" aria-label="Gain per train vs happy">
    {#each yticks as t}
      <line class="grid" x1={m.l} y1={Y(t)} x2={W - m.r} y2={Y(t)} />
      <text class="ax" x={m.l - 8} y={Y(t) + 4} text-anchor="end">{fmt(t)}</text>
    {/each}
    {#each [[0, '0'], [25000, '25k'], [50000, '50k'], [75000, '75k'], [99999, 'max']] as [h, lbl]}
      <text class="ax" x={X(h)} y={Ht - m.b + 20} text-anchor="middle">{lbl}</text>
    {/each}
    <path class="area" d={area} />
    <path class="line" d={path} />
    <line class="cross" x1={X(H)} y1={m.t} x2={X(H)} y2={Ht - m.b} />
    <circle class="dot" cx={X(H)} cy={Y(gain)} r="5" />
  </svg>
  <p class="hint">Drag the happy slider and watch the gain climb — the curve is <em>your</em> numbers. Randomness (±C) is excluded, so this is the expected value.</p>
</div>

<style>
  .lab{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.1rem;margin-top:1.2rem}
  .controls{display:grid;grid-template-columns:repeat(5,1fr);gap:.7rem}
  @media(max-width:720px){.controls{grid-template-columns:repeat(2,1fr)}}
  label{display:grid;gap:.3rem;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--faint);font-weight:600}
  .controls > label{min-width:0}
  select,input{font-family:inherit;font-size:.9rem;color:var(--ink);background:var(--raised);border:1px solid var(--border);border-radius:2px;padding:.5rem .6rem;font-variant-numeric:tabular-nums;width:100%;min-width:0}
  .slider{margin-top:1rem}
  .slabel{display:flex;justify-content:space-between;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--faint);font-weight:600;margin-bottom:.35rem}
  .hv{color:var(--amber);font-size:.9rem}
  input[type=range]{width:100%;accent-color:var(--amber)}
  .readout{margin-top:1rem;display:flex;align-items:baseline;gap:.8rem;flex-wrap:wrap}
  .big{font-family:"Oswald",sans-serif;font-weight:700;font-size:2.4rem;line-height:1;color:var(--amber)}
  .readout .sub{color:var(--muted);font-size:.85rem}
  .chart{width:100%;height:auto;display:block;margin-top:1rem}
  .chart .grid{stroke:var(--grid);stroke-width:1}
  .chart .ax{fill:var(--muted);font-family:"IBM Plex Mono",monospace;font-size:11px}
  .chart .area{fill:var(--amber-soft)}
  .chart .line{fill:none;stroke:var(--amber);stroke-width:2.5;stroke-linejoin:round}
  .chart .cross{stroke:var(--axis);stroke-width:1;stroke-dasharray:3 3}
  .chart .dot{fill:var(--amber)}
  .hint{color:var(--faint);font-size:.8rem;margin:.5rem 0 0}
</style>
