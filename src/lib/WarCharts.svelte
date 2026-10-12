<script>
  // How a ranked war played out over time: running totals as lines, and hits per time slot as bars.
  // Two sliders pick the time window; both charts and the totals table follow it.
  let { timeline, rows, positions, start, end, us, them } = $props();

  // Categorical palette for the dark surface, in fixed order (checked for colour-blind separation).
  const COLORS = ['#3987e5', '#d95926', '#199e70', '#c98500', '#d55181', '#008300', '#9085e9', '#e66767'];
  const MAX_SERIES = 8;

  const stop = $derived(end ?? Math.max(timeline.at(-1)?.t ?? start, Math.floor(Date.now() / 1000)));
  const minutes = $derived(Math.max(1, Math.ceil((stop - start) / 60)));

  let fromMin = $state(0);
  let toMin = $state(Infinity);
  const from = $derived(start + Math.min(fromMin, minutes - 5) * 60);
  const to = $derived(start + Math.min(toMin, minutes) * 60);
  function setFrom(v) { fromMin = Math.min(+v, Math.min(toMin, minutes) - 5); }
  function setTo(v) { toMin = Math.max(+v, fromMin + 5); }
  function wholeWar() { fromMin = 0; toMin = Infinity; }
  function lastHours(h) { toMin = Infinity; fromMin = Math.max(0, minutes - h * 60); }

  let view = $state('factions');
  let metric = $state('respect');
  const METRICS = {
    respect: { label: 'Respect gained', delta: (e) => (e.us ? e.respect : 0) },
    lost: { label: 'Respect lost', delta: (e) => (e.us ? 0 : e.respect) },
    net: { label: 'Respect +/-', delta: (e) => (e.us ? e.respect : -e.respect) },
    hits: { label: 'War hits', delta: (e) => (e.us ? 1 : 0) }
  };
  const metricKeys = $derived(view === 'factions' ? ['respect', 'hits'] : Object.keys(METRICS));
  $effect(() => { if (!metricKeys.includes(metric)) metric = 'respect'; });

  const nameOf = Object.fromEntries(rows.map((r) => [r.id, r.name]));
  const gainedBy = (ids) => timeline.reduce((s, e) => s + (e.us && ids(e.id) ? e.respect : 0), 0);

  // Positions, biggest respect first. Past seven, the rest share one "Other" line.
  const NO_POSITION = 'Not in faction now';
  const posOf = (id) => positions[id] ?? NO_POSITION;
  const positionGroups = $derived.by(() => {
    const all = [...new Set(rows.map((r) => posOf(r.id)))];
    all.sort((a, b) => gainedBy((id) => posOf(id) === b) - gainedBy((id) => posOf(id) === a));
    if (all.length <= MAX_SERIES) return all.map((p) => ({ label: p, has: (id) => posOf(id) === p }));
    const top = all.slice(0, MAX_SERIES - 1);
    return [...top.map((p) => ({ label: p, has: (id) => posOf(id) === p })),
      { label: 'Other positions', has: (id) => !top.includes(posOf(id)) }];
  });

  // Chosen players keep their colour while others are added or removed.
  const byRespect = [...rows].sort((a, b) => b.respect - a.respect);
  let picked = $state(byRespect.slice(0, 5).map((r, i) => ({ id: r.id, color: COLORS[i] })));
  let addId = $state('');
  const pickable = $derived([...rows].filter((r) => !picked.some((p) => p.id === r.id)).sort((a, b) => a.name.localeCompare(b.name)));
  function addPlayer() {
    const id = +addId;
    if (!id || picked.length >= MAX_SERIES) return;
    const color = COLORS.find((c) => !picked.some((p) => p.color === c));
    picked = [...picked, { id, color }];
    addId = '';
  }
  const removePlayer = (id) => (picked = picked.filter((p) => p.id !== id));

  const series = $derived.by(() => {
    if (view === 'factions') {
      const field = metric === 'hits' ? () => 1 : (e) => e.respect;
      return [
        { label: us, color: COLORS[0], delta: (e) => (e.us ? field(e) : 0) },
        { label: them, color: COLORS[1], delta: (e) => (e.us ? 0 : field(e)) }
      ];
    }
    const delta = METRICS[metric].delta;
    if (view === 'positions') {
      return positionGroups.map((g, i) => ({ label: g.label, color: COLORS[i], delta: (e) => (g.has(e.id) ? delta(e) : 0) }));
    }
    return picked.map((p) => ({ label: nameOf[p.id] ?? `[${p.id}]`, color: p.color, delta: (e) => (e.id === p.id ? delta(e) : 0) }));
  });

  // Running total of each series: a list of [time, value] at every change, starting at 0 when the war starts.
  const lines = $derived(series.map((s) => {
    const pts = [[start, 0]];
    let v = 0;
    for (const e of timeline) {
      const d = s.delta(e);
      if (d) { v += d; pts.push([e.t, v]); }
    }
    return { ...s, pts };
  }));

  function valueAt(pts, t) {
    let lo = 0, hi = pts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (pts[mid][0] <= t) lo = mid; else hi = mid - 1;
    }
    return pts[lo][1];
  }

  // ---- line chart geometry ----
  // The charts take the width of their box, so text stays the same size on wide and narrow screens.
  let boxWidth = $state(900);
  const W = $derived(Math.max(320, boxWidth));
  const H = 340, m = { l: 64, r: 20, t: 16, b: 34 };
  const pw = $derived(W - m.l - m.r), ph = H - m.t - m.b;
  const X = (t) => m.l + ((t - from) / (to - from)) * pw;

  const yRange = $derived.by(() => {
    // Fit the values inside the window, so a zoomed-in window shows real movement instead of flat lines.
    let lo = Infinity, hi = -Infinity;
    for (const l of lines) {
      for (const [t, v] of l.pts) if (t >= from && t <= to) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      const v0 = valueAt(l.pts, from);
      lo = Math.min(lo, v0); hi = Math.max(hi, v0);
    }
    if (hi === lo) hi = lo + 1;
    return niceRange(lo, hi);
  });
  const Y = (v) => m.t + ph - ((v - yRange.lo) / (yRange.hi - yRange.lo)) * ph;

  function niceRange(lo, hi) {
    const raw = (hi - lo) / 5;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((k) => k * mag).find((s) => s >= raw);
    const a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step;
    const ticks = [];
    for (let v = a; v <= b + step / 2; v += step) ticks.push(Math.round(v * 1000) / 1000);
    return { lo: a, hi: b, ticks };
  }

  // Step line: a total stays flat until the next hit changes it.
  function pathFor(pts) {
    let d = `M${X(from).toFixed(1)} ${Y(valueAt(pts, from)).toFixed(1)}`;
    for (const [t, v] of pts) {
      if (t <= from || t > to) continue;
      d += `H${X(t).toFixed(1)}V${Y(v).toFixed(1)}`;
    }
    return d + `H${X(to).toFixed(1)}`;
  }

  const timeTicks = $derived.by(() => {
    const span = to - from;
    const most = Math.max(4, Math.floor(pw / 110));
    const step = [900, 1800, 3600, 7200, 10800, 21600, 43200, 86400].find((s) => span / s <= most) ?? 86400;
    const out = [];
    for (let t = Math.ceil(from / step) * step; t <= to; t += step) out.push(t);
    return out;
  });
  const clock = (t) => new Date(t * 1000).toLocaleString('en-GB', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' });
  const dayClock = (t) => new Date(t * 1000).toLocaleString('en-GB', { timeZone: 'UTC', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const tickLabel = (t) => (t % 86400 === 0 || to - from > 86400 * 2 ? dayClock(t) : clock(t));

  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
  const fmt = (v) => (metric === 'net' && v > 0 ? '+' : '') + nf.format(v);

  let hoverT = $state(null);
  function onMove(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * W;
    hoverT = vx < m.l || vx > W - m.r ? null : from + ((vx - m.l) / pw) * (to - from);
  }
  function onKey(e) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const stepT = (to - from) / 60;
    hoverT = Math.min(to, Math.max(from, (hoverT ?? to) + (e.key === 'ArrowRight' ? stepT : -stepT)));
  }
  const readout = $derived(hoverT === null ? [] : lines.map((l) => ({ ...l, v: valueAt(l.pts, hoverT) })).sort((a, b) => b.v - a.v));
  const tipLeft = $derived(hoverT === null ? 0 : (X(hoverT) / W) * 100);

  // ---- hits per time slot: ours above the line, theirs below ----
  const binSize = $derived([900, 1800, 3600, 7200, 10800, 21600].find((s) => (to - from) / s <= Math.max(24, pw / 14)) ?? 43200);
  const bins = $derived.by(() => {
    const first = Math.floor(from / binSize) * binSize;
    const out = [];
    for (let t = first; t < to; t += binSize) out.push({ t, us: 0, them: 0 });
    for (const e of timeline) {
      if (e.t < first || e.t >= to) continue;
      const b = out[Math.floor((e.t - first) / binSize)];
      if (e.us) b.us++; else b.them++;
    }
    return out;
  });
  const BH = 200, bm = { t: 14, b: 26 };
  const bph = BH - bm.t - bm.b;
  const binMax = $derived(Math.max(1, ...bins.map((b) => Math.max(b.us, b.them))));
  const mid = bm.t + bph / 2;
  const BY = (n) => (n / binMax) * (bph / 2 - 2);
  const BX = (t) => m.l + ((t - bins[0].t) / (bins.length * binSize)) * pw;
  const barW = $derived(Math.max(1, pw / bins.length - 2));

  let hoverBin = $state(null);
  function onBinMove(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * W;
    const i = Math.floor(((vx - m.l) / pw) * bins.length);
    hoverBin = i >= 0 && i < bins.length ? i : null;
  }
  const slotName = (s) => (s < 3600 ? `${s / 60} minutes` : s === 3600 ? 'hour' : `${s / 3600} hours`);

  // ---- totals inside the window ----
  const windowRows = $derived(lines.map((l) => ({ label: l.label, color: l.color, change: valueAt(l.pts, to) - valueAt(l.pts, from), total: valueAt(l.pts, to) })));
  const windowHits = $derived(bins.reduce((s, b) => ({ us: s.us + b.us, them: s.them + b.them }), { us: 0, them: 0 }));
  const isWhole = $derived(from === start && to === stop);
</script>

<div class="wc">
  <div class="hd">
    <h3>How the war played out</h3>
    <p class="note">Each line is a running total from the start of the war. Move the sliders to zoom in on part of it. Times are TCT.</p>
  </div>

  <div class="controls">
    <label>Show
      <select bind:value={view}>
        <option value="factions">Both factions</option>
        <option value="positions">Our positions</option>
        <option value="players">Chosen players</option>
      </select>
    </label>
    <label>Measure
      <select bind:value={metric}>
        {#each metricKeys as k}<option value={k}>{view === 'factions' && k === 'respect' ? 'Respect (war score)' : METRICS[k].label}</option>{/each}
      </select>
    </label>
    {#if view === 'players'}
      <label>Add a player
        <span class="add">
          <select bind:value={addId} disabled={picked.length >= MAX_SERIES}>
            <option value="">{picked.length >= MAX_SERIES ? `Up to ${MAX_SERIES} players` : 'Pick a member'}</option>
            {#each pickable as r}<option value={r.id}>{r.name}</option>{/each}
          </select>
          <button class="btn-c" onclick={addPlayer} disabled={!addId}>Add</button>
        </span>
      </label>
    {/if}
  </div>

  <div class="window">
    <div class="sl">
      <span>From <b class="mono">{dayClock(from)}</b></span>
      <input type="range" min="0" max={minutes} step="5" value={Math.min(fromMin, minutes)} oninput={(e) => setFrom(e.currentTarget.value)} aria-label="Window start" />
    </div>
    <div class="sl">
      <span>To <b class="mono">{dayClock(to)}</b></span>
      <input type="range" min="0" max={minutes} step="5" value={Math.min(toMin, minutes)} oninput={(e) => setTo(e.currentTarget.value)} aria-label="Window end" />
    </div>
    <div class="presets">
      <button class="btn-c" onclick={wholeWar} disabled={isWhole}>Whole war</button>
      <button class="btn-c" onclick={() => lastHours(6)}>Last 6 h</button>
      <button class="btn-c" onclick={() => lastHours(24)}>Last 24 h</button>
    </div>
  </div>

  <div class="legend">
    {#each lines as l, i (l.label)}
      <span>
        <i class="key" style="background:{l.color}"></i>{l.label}
        {#if view === 'players'}<button class="x" aria-label="Remove {l.label}" onclick={() => removePlayer(picked[i].id)}>×</button>{/if}
      </span>
    {/each}
  </div>

  <div class="plot" bind:clientWidth={boxWidth} role="slider" tabindex="0" aria-label="Running totals over time. Use the left and right arrow keys to move through time."
    aria-valuemin={from} aria-valuemax={to} aria-valuenow={hoverT ?? to}
    aria-valuetext={readout.length ? `${dayClock(hoverT)}: ` + readout.map((r) => `${r.label} ${fmt(r.v)}`).join(', ') : 'Move to read values'}
    onpointermove={onMove} onpointerleave={() => (hoverT = null)} onkeydown={onKey} onblur={() => (hoverT = null)}>
    <svg viewBox="0 0 {W} {H}" aria-hidden="true">
      <defs><clipPath id="wc-clip"><rect x={m.l} y={m.t - 2} width={pw} height={ph + 4} /></clipPath></defs>
      {#each yRange.ticks as v}
        <line class="grid" class:zero={v === 0} x1={m.l} y1={Y(v)} x2={W - m.r} y2={Y(v)} />
        <text class="ax" x={m.l - 8} y={Y(v) + 4} text-anchor="end">{nf.format(v)}</text>
      {/each}
      {#each timeTicks as t}
        <text class="ax" x={X(t)} y={H - 10} text-anchor="middle">{tickLabel(t)}</text>
      {/each}
      <g clip-path="url(#wc-clip)">
        {#each lines as l (l.label)}<path class="line" d={pathFor(l.pts)} style="stroke:{l.color}" />{/each}
      </g>
      {#if hoverT !== null}
        <line class="cross" x1={X(hoverT)} y1={m.t} x2={X(hoverT)} y2={m.t + ph} />
        {#each readout as r}<circle cx={X(hoverT)} cy={Y(r.v)} r="4" style="fill:{r.color}" class="dot" />{/each}
      {/if}
    </svg>
    {#if hoverT !== null}
      <div class="tip" class:flip={tipLeft > 60} style="left:{tipLeft}%">
        <div class="tiphd">{dayClock(hoverT)} TCT</div>
        {#each readout as r}<div class="row"><i class="key" style="background:{r.color}"></i><b class="mono">{fmt(r.v)}</b><span>{r.label}</span></div>{/each}
      </div>
    {/if}
  </div>

  <h4>War hits per {slotName(binSize)}</h4>
  <div class="legend">
    <span><i class="key" style="background:{COLORS[0]}"></i>{us} (above the line)</span>
    <span><i class="key" style="background:{COLORS[1]}"></i>{them} (below the line)</span>
  </div>
  <div class="plot" role="img" aria-label="War hits per {slotName(binSize)} in this window: {us} {windowHits.us}, {them} {windowHits.them}."
    onpointermove={onBinMove} onpointerleave={() => (hoverBin = null)}>
    <svg viewBox="0 0 {W} {BH}" aria-hidden="true">
      <line class="grid zero" x1={m.l} y1={mid} x2={W - m.r} y2={mid} />
      <text class="ax" x={m.l - 8} y={bm.t + 4} text-anchor="end">{binMax}</text>
      <text class="ax" x={m.l - 8} y={mid + 4} text-anchor="end">0</text>
      <text class="ax" x={m.l - 8} y={bm.t + bph + 4} text-anchor="end">{binMax}</text>
      {#each bins as b, i}
        {#if hoverBin === i}<rect class="hl" x={BX(b.t)} y={bm.t} width={barW + 2} height={bph} />{/if}
        {#if b.us}<rect x={BX(b.t) + 1} y={mid - 1 - BY(b.us)} width={barW} height={BY(b.us)} rx="2" style="fill:{COLORS[0]}" />{/if}
        {#if b.them}<rect x={BX(b.t) + 1} y={mid + 1} width={barW} height={BY(b.them)} rx="2" style="fill:{COLORS[1]}" />{/if}
      {/each}
      {#each timeTicks as t}
        <text class="ax" x={m.l + ((t - bins[0].t) / (bins.length * binSize)) * pw} y={BH - 6} text-anchor="middle">{tickLabel(t)}</text>
      {/each}
    </svg>
    {#if hoverBin !== null}
      {@const b = bins[hoverBin]}
      {@const left = ((BX(b.t) + barW / 2) / W) * 100}
      <div class="tip" class:flip={left > 60} style="left:{left}%">
        <div class="tiphd">{dayClock(b.t)} – {clock(b.t + binSize)} TCT</div>
        <div class="row"><i class="key" style="background:{COLORS[0]}"></i><b class="mono">{b.us}</b><span>{us}</span></div>
        <div class="row"><i class="key" style="background:{COLORS[1]}"></i><b class="mono">{b.them}</b><span>{them}</span></div>
      </div>
    {/if}
  </div>

  <div class="tbl-scroll"><table class="sum">
    <caption>{isWhole ? 'Whole war' : `${dayClock(from)} – ${dayClock(to)} TCT`} · {view === 'factions' && metric === 'respect' ? 'Respect (war score)' : METRICS[metric].label}</caption>
    <thead><tr><th>Line</th><th class="num">In this window</th><th class="num">Total at the end of it</th></tr></thead>
    <tbody>
      {#each windowRows as r (r.label)}
        <tr><td><i class="key" style="background:{r.color}"></i>{r.label}</td><td class="num mono">{fmt(r.change)}</td><td class="num mono">{fmt(r.total)}</td></tr>
      {/each}
    </tbody>
  </table></div>
</div>

<style>
  .wc{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.1rem;margin-top:1.4rem}
  .hd h3{margin:0}
  h4{margin:1.4rem 0 0;font-size:.95rem}
  .note{color:var(--muted);font-size:.88rem;margin:.3rem 0 0}
  .controls{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:.9rem}
  label{display:grid;gap:.3rem;font-size:.68rem;text-transform:uppercase;letter-spacing:.05em;color:var(--faint);font-weight:600}
  select{font-family:inherit;font-size:.9rem;color:var(--ink);background:var(--raised);border:1px solid var(--border);
    border-radius:2px;padding:.45rem .6rem;min-width:11rem;text-transform:none;letter-spacing:0;font-weight:400}
  .add{display:flex;gap:.4rem}
  .window{display:grid;grid-template-columns:1fr 1fr auto;gap:.6rem 1.2rem;align-items:end;margin-top:1rem}
  .sl{display:grid;gap:.25rem;font-size:.82rem;color:var(--muted)}
  .sl b{color:var(--ink);font-weight:500}
  .sl input{width:100%;accent-color:var(--amber)}
  .presets{display:flex;flex-wrap:wrap;gap:.4rem}
  .legend{display:flex;flex-wrap:wrap;gap:.5rem 1.2rem;margin-top:.8rem;font-size:.82rem;color:var(--muted)}
  .legend span{display:inline-flex;align-items:center;gap:.45rem}
  .key{display:inline-block;width:14px;height:3px;border-radius:2px;flex:none;margin-inline-end:.4rem;vertical-align:middle}
  .legend .key{margin:0}
  .x{font:inherit;cursor:pointer;color:var(--faint);background:none;border:0;padding:0 .2rem;font-size:1rem;line-height:1}
  .x:hover{color:var(--ink)}
  .plot{position:relative;margin-top:.5rem;outline:none;border-radius:2px;touch-action:pan-y}
  .plot:focus-visible{box-shadow:0 0 0 2px var(--amber)}
  svg{display:block;width:100%;height:auto}
  .grid{stroke:var(--grid);stroke-width:1}
  .grid.zero{stroke:var(--axis)}
  .ax{fill:var(--faint);font-size:12px;font-family:"IBM Plex Mono",monospace}
  .line{fill:none;stroke-width:2;stroke-linejoin:round}
  .cross{stroke:var(--axis);stroke-width:1}
  .dot{stroke:var(--surface);stroke-width:2}
  .hl{fill:var(--raised)}
  .tip{position:absolute;top:.4rem;transform:translateX(12px);background:var(--bg);border:1px solid var(--border);border-radius:3px;
    padding:.5rem .65rem;font-size:.8rem;pointer-events:none;min-width:11rem;max-width:16rem;box-shadow:var(--shadow);z-index:2}
  .tip.flip{transform:translateX(calc(-100% - 12px))}
  .tiphd{color:var(--faint);font-size:.72rem;margin-bottom:.3rem}
  .row{display:flex;align-items:center;gap:.4rem;color:var(--muted)}
  .row b{color:var(--ink);font-weight:500;min-width:3.5rem;text-align:end}
  .row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row .key{margin:0}
  .tbl-scroll{overflow-x:auto;margin-top:1.2rem}
  .sum{width:100%;border-collapse:collapse;font-size:.88rem}
  .sum caption{text-align:start;color:var(--faint);font-size:.78rem;padding-bottom:.4rem}
  .sum th,.sum td{padding:.4rem .6rem;border-bottom:1px solid var(--border);text-align:start}
  .sum th{color:var(--faint);font-weight:500;font-size:.78rem}
  .sum .num{text-align:end}
  @media(max-width:700px){.window{grid-template-columns:1fr}}
  @media(max-width:560px){.tip,.tip.flip{left:0!important;right:0;top:auto;bottom:calc(100% + 4px);transform:none;max-width:none}}
</style>
