<script>
  // Where members got beaten during the war (Torn City or abroad), by whom, and how long they stayed alive.
  // With a live status log, places come from where the member was and time alive is measured;
  // without one, a beating counts as abroad when the attack got Torn's overseas bonus.
  import ColumnPicker from '$lib/ColumnPicker.svelte';
  import { placeAt, aliveTimes } from '$lib/warlive.js';

  let { rows, them, revives, beatings, log } = $props();

  const nf = new Intl.NumberFormat('en-US');
  const blank = () => ({ war: 0, bounty: 0, other: 0 });
  const sum = (o) => o.war + o.bounty + o.other;
  const avg = (list) => (list.length ? list.reduce((s, g) => s + g, 0) / list.length : null);
  const span = (sec) => {
    if (sec == null) return '—';
    if (sec < 60) return `${Math.round(sec)}s`;
    if (sec < 3600) return `${Math.round(sec / 60)}m`;
    return `${Math.floor(sec / 3600)}h ${Math.round((sec % 3600) / 60)}m`;
  };

  const alive = $derived(aliveTimes(log, beatings));
  const QUICK = 60;

  const members = $derived(rows.filter((r) => r.defense).map((r) => {
    const d = r.defense;
    const m = { id: r.id, name: r.name, torn: blank(), abroad: blank(), revives: d.revives, after: avg(d.gaps), quick: d.quick };
    for (const b of beatings) if (b.id === r.id) m[placeAt(log, b.id, b.t) ?? b.place][b.by]++;
    m.beaten = sum(m.torn) + sum(m.abroad);
    const mine = alive.filter((a) => a.id === r.id);
    m.aliveTorn = avg(mine.filter((a) => a.place === 'torn').map((a) => a.alive));
    m.aliveAbroad = avg(mine.filter((a) => a.place === 'abroad').map((a) => a.alive));
    m.fast = mine.filter((a) => a.alive <= QUICK).length;
    return m;
  }));

  const COLS = [
    ['name', 'Member'], ['beaten', 'Beaten'],
    ['torn.war', 'Torn: war'], ['torn.bounty', 'Torn: bounty'], ['torn.other', 'Torn: other'],
    ['abroad.war', 'Abroad: war'], ['abroad.bounty', 'Abroad: bounty'], ['abroad.other', 'Abroad: other'],
    ['aliveTorn', 'Alive in Torn (avg)'], ['aliveAbroad', 'Alive abroad (avg)'], ['fast', 'Beaten within 1 min'],
    ['revives', 'Revived'], ['after', 'Avg time to next hit'], ['quick', 'Hit within 5 min']
  ];
  const TIMES = new Set(['after', 'aliveTorn', 'aliveAbroad']);
  const get = (m, k) => k.split('.').reduce((o, p) => o?.[p], m);

  let hidden = $state([]);
  const shown = $derived(COLS.filter(([k]) => k === 'name' || !hidden.includes(k)));

  let sortKey = $state('beaten');
  let sortDir = $state(-1);
  function sortBy(k) {
    if (sortKey === k) sortDir = -sortDir;
    else { sortKey = k; sortDir = k === 'name' ? 1 : -1; }
  }
  const sorted = $derived([...members].sort((a, b) => {
    const x = get(a, sortKey), y = get(b, sortKey);
    return (typeof x === 'string' ? x.localeCompare(y) : (x ?? -1) - (y ?? -1)) * sortDir;
  }));

  const totals = $derived(members.reduce((t, m) => {
    for (const place of ['torn', 'abroad']) for (const by of ['war', 'bounty', 'other']) t[place][by] += m[place][by];
    t.quick += m.quick;
    return t;
  }, { torn: blank(), abroad: blank(), quick: 0 }));
  const allGaps = $derived(rows.flatMap((r) => r.defense?.gaps ?? []));
  const aliveIn = (place) => avg(alive.filter((a) => a.place === place).map((a) => a.alive));
  const fast = $derived(alive.filter((a) => a.alive <= QUICK));

  const show = (m, k) => (TIMES.has(k) ? span(get(m, k)) : k === 'name' ? m.name : nf.format(get(m, k) ?? 0));
</script>

<div class="df">
  <h3>Where members got beaten</h3>
  <p class="note">Every time someone beat one of our members during the war: in Torn City or abroad, and whether it was {them}, a bounty, or anyone else.</p>

  <div class="tiles">
    <div class="tile"><span>In Torn City</span><b class="mono">{nf.format(sum(totals.torn))}</b><small>{nf.format(totals.torn.war)} war · {nf.format(totals.torn.bounty)} bounty · {nf.format(totals.torn.other)} other</small></div>
    <div class="tile"><span>Abroad</span><b class="mono">{nf.format(sum(totals.abroad))}</b><small>{nf.format(totals.abroad.war)} war · {nf.format(totals.abroad.bounty)} bounty · {nf.format(totals.abroad.other)} other</small></div>
    {#if log}
      <div class="tile"><span>Alive in Torn</span><b class="mono">{span(aliveIn('torn'))}</b><small>average, out of hospital to beaten</small></div>
      <div class="tile"><span>Alive abroad</span><b class="mono">{span(aliveIn('abroad'))}</b><small>average, landed or out of hospital to beaten</small></div>
      <div class="tile"><span>Beaten within 1 min</span><b class="mono">{nf.format(fast.length)}</b><small>of getting out or landing · {nf.format(fast.filter((a) => a.early).length)} after leaving hospital early</small></div>
    {/if}
    <div class="tile"><span>After a revive</span><b class="mono">{span(avg(allGaps))}</b><small>average until the next hit · {revives} revives</small></div>
    <div class="tile"><span>Hit within 5 min</span><b class="mono">{nf.format(totals.quick)}</b><small>of being revived</small></div>
  </div>

  {#if members.length}
    <div class="tools"><ColumnPicker columns={COLS.slice(1)} bind:hidden storeKey="ftp:war-beaten-cols" /></div>
    <div class="tbl-scroll"><table>
      <thead><tr>
        {#each shown as [k, l]}
          <th class:num={k !== 'name'} aria-sort={sortKey === k ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}>
            <button onclick={() => sortBy(k)}>{l}{sortKey === k ? (sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>
        {/each}
      </tr></thead>
      <tbody>
        {#each sorted as m (m.id)}
          <tr>
            {#each shown as [k]}
              {#if k === 'name'}
                <td><a href="https://www.torn.com/profiles.php?XID={m.id}" target="_blank" rel="noopener">{m.name}</a></td>
              {:else}
                <td class="num mono" class:dim={!get(m, k)}>{show(m, k)}</td>
              {/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table></div>
  {:else}
    <p class="note">Nobody in the faction got beaten during this war.</p>
  {/if}

  <p class="note">"Avg time to next hit" counts from a successful revive to the next time that member got beaten. "Alive" counts from leaving hospital or landing to the next beating, so travel time is left out. Torn keeps no status history, so the alive times only exist for stretches the live recorder saw.
    {#if !log}No recording exists for this war, and abroad comes from Torn's overseas bonus on each attack.{/if}</p>
</div>

<style>
  .df{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.1rem;margin-top:1.4rem}
  h3{margin:0}
  .note{color:var(--muted);font-size:.88rem;margin:.4rem 0 0}
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:.7rem;margin:1rem 0}
  .tile{display:flex;flex-direction:column;gap:.1rem;background:var(--raised);border:1px solid var(--border);border-radius:3px;padding:.7rem .8rem}
  .tile span{font-family:"IBM Plex Mono",monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .tile b{font-family:"Oswald",sans-serif;font-size:1.5rem;font-weight:600}
  .tile small{color:var(--muted);font-size:.78rem}
  .tbl-scroll{overflow-x:auto}
  .tools{display:flex;justify-content:flex-end;margin-bottom:.5rem}
  table{width:100%;border-collapse:collapse;font-size:.86rem}
  th,td{padding:.4rem .55rem;border-bottom:1px solid var(--border);text-align:start;white-space:nowrap}
  th button{font:inherit;font-size:.74rem;color:var(--faint);background:none;border:0;padding:0;cursor:pointer;font-weight:500}
  th button:hover{color:var(--ink)}
  .num{text-align:end}
  .dim{color:var(--faint)}
</style>
