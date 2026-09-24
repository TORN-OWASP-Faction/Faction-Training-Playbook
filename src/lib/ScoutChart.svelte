<script>
  // Line chart of burglary scouting: each target's share of the scouts in its category, by Crime Skill.
  let { columns = [], rows = [] } = $props();

  const CATEGORIES = {
    Residential: ['Tool Shed', 'Beach Hut', 'Bungalow', 'Mobile Home', 'Cottage', 'Apartment', 'Suburban Home',
      'Secluded Cabin', 'Farmhouse', 'Lake House', 'Luxury Villa', 'Manor House'],
    Commercial: ['Self Storage Facility', 'Funeral Directors', 'Market', 'Postal Office', 'Cleaning Agency',
      'Barbershop', 'Liquor Store', 'Dentists Office', 'Chiropractors', 'Recruitment Agency', 'Advertising Agency'],
    Industrial: ['Dockside Warehouse', 'Farm Storage Unit', 'Shipyard', 'Printing Works', 'Brewery', 'Truckyard',
      'Old Factory', 'Slaughterhouse', 'Paper Mill', 'Foundry', 'Fertilizer Plant']
  };

  const levels = $derived(columns.slice(1).map(Number));
  const toNum = (s) => Number(String(s).replace(/,/g, '')) || 0;

  // The sheet lists raw counts first, then the same targets again as percentages; take the counts.
  const counts = $derived.by(() => {
    const out = {};
    for (const r of rows) if (!(r[0] in out)) out[r[0]] = r.slice(1).map(toNum);
    return out;
  });

  let category = $state('Residential');
  let target = $state('Cottage');
  let hover = $state(null);

  const names = $derived(CATEGORIES[category]);
  const totals = $derived(counts[`Any (${category.toLowerCase()})`]);

  // share[name][i] is a percentage, or null where the category has no scouts yet at that level
  const share = $derived.by(() => {
    const out = {};
    for (const n of names) out[n] = counts[n].map((c, i) => (totals[i] > 0 ? (c / totals[i]) * 100 : null));
    return out;
  });
  const firstLevel = $derived(totals.findIndex((t) => t > 0));

  function pickCategory(e) {
    category = e.currentTarget.value;
    target = CATEGORIES[category][0];
    hover = null;
  }

  // Geometry
  const W = 900, H = 380, m = { l: 48, r: 24, t: 28, b: 42 };
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const X = (lv) => m.l + ((lv - levels[0]) / (levels[levels.length - 1] - levels[0])) * pw;
  const yMax = $derived(Math.ceil(Math.max(...names.flatMap((n) => share[n].filter((v) => v !== null))) / 10) * 10);
  const Y = (v) => m.t + ph - (v / yMax) * ph;
  const yTicks = $derived(Array.from({ length: yMax / 10 + 1 }, (_, i) => i * 10));
  const xTicks = [5, 20, 40, 60, 80, 100];

  function pathFor(n) {
    let d = '';
    share[n].forEach((v, i) => {
      if (v === null) return;
      d += (d ? 'L' : 'M') + X(levels[i]).toFixed(1) + ' ' + Y(v).toFixed(1);
    });
    return d;
  }

  const sel = $derived(share[target]);
  const peak = $derived.by(() => {
    let best = 0;
    sel.forEach((v, i) => { if (v !== null && v > sel[best]) best = i; });
    return best;
  });
  const firstSeen = $derived(sel.findIndex((v) => v !== null && v > 0));

  function readoutAt(i) {
    if (i === null || totals[i] === 0) return null;
    return names.map((n) => ({ n, v: share[n][i] })).filter((r) => r.v > 0).sort((a, b) => b.v - a.v);
  }
  const readout = $derived(readoutAt(hover));

  // What a screen reader announces as the arrow keys move the crosshair
  const spoken = $derived.by(() => {
    const i = hover ?? peak;
    const r = readoutAt(i);
    if (!r) return `CS ${levels[i]}: no ${category.toLowerCase()} targets yet`;
    return `CS ${levels[i]}: ` + r.map((x) => `${x.n} ${x.v.toFixed(1)} percent`).join(', ');
  });

  function nearestIndex(clientX, box) {
    const vx = ((clientX - box.left) / box.width) * W;
    let best = 0;
    levels.forEach((lv, i) => { if (Math.abs(X(lv) - vx) < Math.abs(X(levels[best]) - vx)) best = i; });
    return best;
  }
  const onMove = (e) => (hover = nearestIndex(e.clientX, e.currentTarget.getBoundingClientRect()));
  function onKey(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const start = hover ?? peak;
    hover = Math.min(levels.length - 1, Math.max(0, start + (e.key === 'ArrowRight' ? 1 : -1)));
  }

  const pct = (v) => v.toFixed(1) + '%';
  const tipLeft = $derived(hover === null ? 0 : (X(levels[hover]) / W) * 100);
</script>

<div class="scout">
  <div class="controls">
    <label>Category
      <select value={category} onchange={pickCategory}>
        {#each Object.keys(CATEGORIES) as c}<option value={c}>{c}</option>{/each}
      </select>
    </label>
    <label>Highlight target
      <select bind:value={target}>
        {#each names as n}<option value={n}>{n}</option>{/each}
      </select>
    </label>
  </div>

  <p class="summary">
    <b>{target}</b>
    {#if firstSeen < 0}
      doesn't show up in this data.
    {:else}
      first shows up at <b>CS {levels[firstSeen]}</b> and peaks at <b>CS {levels[peak]}</b>, where it's
      <b>{pct(sel[peak])}</b> of {category.toLowerCase()} scouts.
    {/if}
  </p>

  <div class="legend">
    <span><i class="key sel"></i>{target}</span>
    <span><i class="key other"></i>Other {category.toLowerCase()} targets</span>
  </div>

  <div class="plot" role="slider" tabindex="0"
    aria-label="{category} scouting share by Crime Skill. Use the left and right arrow keys to step through levels."
    aria-valuemin={levels[0]} aria-valuemax={levels[levels.length - 1]} aria-valuenow={levels[hover ?? peak]} aria-valuetext={spoken}
    onpointermove={onMove} onpointerleave={() => (hover = null)} onkeydown={onKey} onblur={() => (hover = null)}>
    <svg viewBox="0 0 {W} {H}" aria-hidden="true">
      {#if firstLevel > 0}
        <rect class="locked" x={m.l} y={m.t} width={X(levels[firstLevel]) - m.l} height={ph} />
        <text class="lockedlbl" x={(m.l + X(levels[firstLevel])) / 2} y={m.t + ph / 2} text-anchor="middle">No {category.toLowerCase()} targets yet</text>
      {/if}
      {#each yTicks as t}
        <line class="grid" x1={m.l} y1={Y(t)} x2={W - m.r} y2={Y(t)} />
        <text class="ax" x={m.l - 8} y={Y(t) + 4} text-anchor="end">{t}%</text>
      {/each}
      {#each xTicks as lv}
        <text class="ax" x={X(lv)} y={H - m.b + 18} text-anchor="middle">{lv}</text>
      {/each}
      <text class="axt" x={m.l + pw / 2} y={H - 6} text-anchor="middle">Crime Skill (CS)</text>

      {#each names as n}
        {#if n !== target}<path class="line other" d={pathFor(n)} />{/if}
      {/each}
      <path class="line sel" d={pathFor(target)} />

      {#if firstSeen >= 0 && hover === null}
        <circle class="dot" cx={X(levels[peak])} cy={Y(sel[peak])} r="4" />
        <text class="peak" x={Math.min(W - m.r - 60, Math.max(m.l + 60, X(levels[peak])))} y={Y(sel[peak]) - 12}
          text-anchor="middle">peak {pct(sel[peak])} · CS {levels[peak]}</text>
      {/if}

      {#if hover !== null}
        <line class="cross" x1={X(levels[hover])} y1={m.t} x2={X(levels[hover])} y2={m.t + ph} />
        {#if sel[hover] !== null}<circle class="dot" cx={X(levels[hover])} cy={Y(sel[hover])} r="4" />{/if}
      {/if}
    </svg>

    {#if hover !== null}
      <div class="tip" class:flip={tipLeft > 60} style="left:{tipLeft}%">
        <div class="tiphd">CS {levels[hover]}
          <span>{totals[hover] ? totals[hover].toLocaleString('en-US') + ' scouts' : 'no data'}</span></div>
        {#if readout}
          {#each readout as r}
            <div class="row" class:me={r.n === target}>
              <i class="key" class:sel={r.n === target}></i><b>{pct(r.v)}</b><span>{r.n}</span>
            </div>
          {/each}
        {:else}
          <div class="row"><span>No {category.toLowerCase()} targets at this level.</span></div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .scout{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.1rem;margin-top:1.2rem}
  .controls{display:flex;flex-wrap:wrap;gap:.8rem}
  label{display:grid;gap:.3rem;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--faint);font-weight:600}
  select{font-family:inherit;font-size:.9rem;color:var(--ink);background:var(--raised);border:1px solid var(--border);
    border-radius:2px;padding:.45rem .6rem;min-width:13rem}
  select:focus-visible{outline:2px solid var(--amber);outline-offset:1px}
  .summary{margin:.9rem 0 0;color:var(--muted);font-size:.92rem}
  .summary b{color:var(--ink)}
  .legend{display:flex;flex-wrap:wrap;gap:1.2rem;margin-top:.6rem;font-size:.8rem;color:var(--muted)}
  .legend span{display:inline-flex;align-items:center;gap:.45rem}
  .key{display:inline-block;width:16px;height:2px;border-radius:1px;background:var(--faint);opacity:.6}
  .key.sel{background:var(--amber);opacity:1}

  .plot{position:relative;margin-top:.6rem;outline:none;border-radius:2px;touch-action:pan-y}
  .plot:focus-visible{box-shadow:0 0 0 2px var(--amber)}
  svg{width:100%;height:auto;display:block}
  .grid{stroke:var(--grid);stroke-width:1}
  .ax{fill:var(--faint);font-family:"IBM Plex Mono",monospace;font-size:11px}
  .axt{fill:var(--muted);font-size:11.5px}
  .locked{fill:var(--raised);opacity:.6}
  .lockedlbl{fill:var(--faint);font-size:12px}
  .line{fill:none;stroke-linejoin:round;stroke-linecap:round}
  .line.other{stroke:var(--faint);stroke-width:1.5;opacity:.45}
  .line.sel{stroke:var(--amber);stroke-width:2}
  .dot{fill:var(--amber);stroke:var(--surface);stroke-width:2}
  .peak{fill:var(--ink);font-family:"IBM Plex Mono",monospace;font-size:11px}
  .cross{stroke:var(--axis);stroke-width:1}

  .tip{position:absolute;top:.4rem;transform:translateX(12px);pointer-events:none;min-width:12rem;
    background:var(--raised);border:1px solid var(--border);border-radius:3px;padding:.5rem .6rem;box-shadow:var(--shadow);
    font-size:.78rem}
  .tip.flip{transform:translateX(calc(-100% - 12px))}
  .tiphd{font-family:"Oswald",sans-serif;font-weight:700;color:var(--ink);margin-bottom:.3rem;display:flex;gap:.6rem;justify-content:space-between}
  .tiphd span{font-family:"IBM Plex Mono",monospace;font-weight:400;color:var(--faint);font-size:.7rem}
  .row{display:grid;grid-template-columns:16px 3.2rem 1fr;align-items:center;gap:.45rem;color:var(--muted);line-height:1.5}
  .row b{color:var(--ink);font-family:"IBM Plex Mono",monospace;font-weight:600;text-align:right}
  .row span{white-space:nowrap}
  .row.me span{color:var(--ink);font-weight:600}
</style>
