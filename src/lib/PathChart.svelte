<script>
  // Log-scale line chart of the three paths over time. The y-axis ticks are the milestones.
  let { title, series = [], selected, marks = [], yMin, yMax, fmt, hover = null, onhover = () => {}, onpick = () => {} } = $props();

  const W = 900, H = 300, m = { l: 62, r: 64, t: 16, b: 34 };
  const pw = W - m.l - m.r, ph = H - m.t - m.b;
  const n = $derived(series[0]?.values.length ?? 1);
  const X = (d) => m.l + (d / Math.max(1, n - 1)) * pw;
  const lo = $derived(Math.log10(yMin)), hi = $derived(Math.log10(yMax));
  const Y = (v) => m.t + ph - ((Math.log10(Math.max(v, yMin)) - lo) / (hi - lo)) * ph;
  const years = $derived(Array.from({ length: Math.floor((n - 1) / 365) + 1 }, (_, i) => i * 365));

  function pathFor(values) {
    let d = '';
    for (let i = 0; i < values.length; i += 2) d += (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(values[i]).toFixed(1);
    const last = values.length - 1;
    return d + 'L' + X(last).toFixed(1) + ' ' + Y(values[last]).toFixed(1);
  }

  // Direct end labels, unless the lines finish too close together to label cleanly
  const ends = $derived(series.map((s) => ({ ...s, y: Y(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y));
  const labelEnds = $derived(ends.every((e, i) => i === 0 || e.y - ends[i - 1].y >= 14));

  const rows = $derived(hover === null ? [] : series.map((s) => ({ ...s, v: s.values[hover] })).sort((a, b) => b.v - a.v));
  const tipLeft = $derived(hover === null ? 0 : (X(hover) / W) * 100);

  function dayAt(e) {
    const box = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - box.left) / box.width) * W;
    return Math.round(Math.min(1, Math.max(0, (vx - m.l) / pw)) * (n - 1));
  }
  function onKey(e) {
    const step = e.shiftKey ? 30 : 7;
    if (e.key === 'ArrowRight') onhover(Math.min(n - 1, (hover ?? 0) + step));
    else if (e.key === 'ArrowLeft') onhover(Math.max(0, (hover ?? 0) - step));
    else if (e.key === 'Enter' && hover !== null) onpick(hover);
    else return;
    e.preventDefault();
  }
  const spoken = $derived(hover === null ? `${title}: move with the arrow keys`
    : `Day ${hover}: ` + rows.map((r) => `${r.label} ${fmt(r.v)}`).join(', '));
  const when = (d) => (d < 60 ? `day ${d}` : `month ${Math.round(d / 30.4)}`);
</script>

<div class="pc">
  <div class="plot" role="slider" tabindex="0" aria-label="{title}. Arrow keys move a week (Shift for a month); Enter inspects that day."
    aria-valuemin="0" aria-valuemax={n - 1} aria-valuenow={hover ?? 0} aria-valuetext={spoken}
    onpointermove={(e) => onhover(dayAt(e))} onpointerleave={() => onhover(null)} onclick={(e) => onpick(dayAt(e))} onkeydown={onKey}>
    <svg viewBox="0 0 {W} {H}" aria-hidden="true">
      {#each marks as mk}
        {#if mk.v >= yMin && mk.v <= yMax}
          <line class="grid" x1={m.l} y1={Y(mk.v)} x2={W - m.r} y2={Y(mk.v)} />
          <text class="ax" x={m.l - 8} y={Y(mk.v) + 4} text-anchor="end">{mk.label}</text>
        {/if}
      {/each}
      {#each years as yd, i}
        <text class="ax" x={X(yd)} y={H - m.b + 18} text-anchor={i === 0 ? 'start' : 'middle'}>{i === 0 ? 'Now' : `${i}y`}</text>
      {/each}
      {#each series as s}
        <path class="line" class:sel={s.key === selected} d={pathFor(s.values)} style="stroke:{s.color}" />
      {/each}
      {#each ends as e}
        <circle cx={X(n - 1)} cy={e.y} r="4" class="enddot" style="fill:{e.color}" />
        {#if labelEnds}<text class="endlbl" class:sel={e.key === selected} x={X(n - 1) + 8} y={e.y + 4}>{fmt(e.values[n - 1])}</text>{/if}
      {/each}
      {#if hover !== null}
        <line class="cross" x1={X(hover)} y1={m.t} x2={X(hover)} y2={m.t + ph} />
        {#each rows as r}<circle cx={X(hover)} cy={Y(r.v)} r="4" class="enddot" style="fill:{r.color}" />{/each}
      {/if}
    </svg>
    {#if hover !== null}
      <div class="tip" class:flip={tipLeft > 58} style="left:{tipLeft}%">
        <div class="tiphd">{when(hover)}</div>
        {#each rows as r}
          <div class="row" class:me={r.key === selected}><i class="key" style="background:{r.color}"></i><b>{fmt(r.v)}</b><span>{r.label}</span></div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .pc{overflow-x:auto}
  .plot{position:relative;outline:none;border-radius:2px;touch-action:pan-x pan-y;cursor:crosshair;min-width:620px}
  .plot:focus-visible{box-shadow:0 0 0 2px var(--amber)}
  svg{width:100%;height:auto;display:block}
  .grid{stroke:var(--grid);stroke-width:1}
  .ax{fill:var(--faint);font-family:"IBM Plex Mono",monospace;font-size:11px}
  .line{fill:none;stroke-width:1.5;opacity:.5;stroke-linejoin:round;stroke-linecap:round}
  .line.sel{stroke-width:2.5;opacity:1}
  .enddot{stroke:var(--surface);stroke-width:2}
  .endlbl{fill:var(--muted);font-family:"IBM Plex Mono",monospace;font-size:11px}
  .endlbl.sel{fill:var(--ink);font-weight:600}
  .cross{stroke:var(--axis);stroke-width:1}
  .tip{position:absolute;top:.3rem;transform:translateX(12px);pointer-events:none;background:var(--raised);
    border:1px solid var(--border);border-radius:3px;padding:.45rem .6rem;box-shadow:var(--shadow);font-size:.78rem;white-space:nowrap}
  .tip.flip{transform:translateX(calc(-100% - 12px))}
  .tiphd{font-family:"Oswald",sans-serif;font-weight:700;color:var(--ink);margin-bottom:.25rem;text-transform:capitalize}
  .row{display:grid;grid-template-columns:14px 4.2rem auto;gap:.45rem;align-items:center;color:var(--muted);line-height:1.55}
  .row b{color:var(--ink);font-family:"IBM Plex Mono",monospace;font-weight:600;text-align:right}
  .row.me span{color:var(--ink);font-weight:600}
  .key{display:inline-block;width:14px;height:2px;border-radius:1px}
</style>
