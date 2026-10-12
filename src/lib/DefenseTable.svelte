<script>
  // Where members got beaten during the war (Torn City or abroad), by whom, and how long they lasted after a revive.
  let { rows, them, revives } = $props();

  const nf = new Intl.NumberFormat('en-US');
  const sum = (o) => o.war + o.bounty + o.other;
  const avg = (gaps) => (gaps.length ? gaps.reduce((s, g) => s + g, 0) / gaps.length : null);
  const span = (sec) => {
    if (sec == null) return '—';
    if (sec < 60) return `${Math.round(sec)}s`;
    if (sec < 3600) return `${Math.round(sec / 60)}m`;
    return `${Math.floor(sec / 3600)}h ${Math.round((sec % 3600) / 60)}m`;
  };

  const members = $derived(rows.filter((r) => r.defense).map((r) => {
    const d = r.defense;
    return { id: r.id, name: r.name, torn: d.torn, abroad: d.abroad, beaten: sum(d.torn) + sum(d.abroad),
      revives: d.revives, after: avg(d.gaps), quick: d.quick };
  }));

  const COLS = [
    ['name', 'Member'], ['beaten', 'Beaten'],
    ['torn.war', 'Torn: war'], ['torn.bounty', 'Torn: bounty'], ['torn.other', 'Torn: other'],
    ['abroad.war', 'Abroad: war'], ['abroad.bounty', 'Abroad: bounty'], ['abroad.other', 'Abroad: other'],
    ['revives', 'Revived'], ['after', 'Avg time to next hit'], ['quick', 'Hit within 5 min']
  ];
  const get = (m, k) => k.split('.').reduce((o, p) => o?.[p], m);

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
  }, { torn: { war: 0, bounty: 0, other: 0 }, abroad: { war: 0, bounty: 0, other: 0 }, quick: 0 }));
  const allGaps = $derived(rows.flatMap((r) => r.defense?.gaps ?? []));

  const show = (m, k) => (k === 'after' ? span(m.after) : k === 'name' ? m.name : nf.format(get(m, k) ?? 0));
</script>

<div class="df">
  <h3>Where members got beaten</h3>
  <p class="note">Every time someone beat one of our members during the war: in Torn City or abroad, and whether it was {them}, a bounty, or anyone else. The attack log says only "abroad", not which country.</p>

  <div class="tiles">
    <div class="tile"><span>In Torn City</span><b class="mono">{nf.format(sum(totals.torn))}</b><small>{nf.format(totals.torn.war)} war · {nf.format(totals.torn.bounty)} bounty · {nf.format(totals.torn.other)} other</small></div>
    <div class="tile"><span>Abroad</span><b class="mono">{nf.format(sum(totals.abroad))}</b><small>{nf.format(totals.abroad.war)} war · {nf.format(totals.abroad.bounty)} bounty · {nf.format(totals.abroad.other)} other</small></div>
    <div class="tile"><span>After a revive</span><b class="mono">{span(avg(allGaps))}</b><small>average until the next hit · {revives} revives</small></div>
    <div class="tile"><span>Hit within 5 min</span><b class="mono">{nf.format(totals.quick)}</b><small>of being revived</small></div>
  </div>

  {#if members.length}
    <div class="tbl-scroll"><table>
      <thead><tr>
        {#each COLS as [k, l]}
          <th class:num={k !== 'name'} aria-sort={sortKey === k ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}>
            <button onclick={() => sortBy(k)}>{l}{sortKey === k ? (sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>
        {/each}
      </tr></thead>
      <tbody>
        {#each sorted as m (m.id)}
          <tr>
            {#each COLS as [k]}
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

  <p class="note">"Avg time to next hit" counts from a successful revive to the next time that member got beaten, only when they got beaten again before the war ended. Leaving hospital on a timer or with your own meds isn't in Torn's logs, so only revives are timed.</p>
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
  table{width:100%;border-collapse:collapse;font-size:.86rem}
  th,td{padding:.4rem .55rem;border-bottom:1px solid var(--border);text-align:start;white-space:nowrap}
  th button{font:inherit;font-size:.74rem;color:var(--faint);background:none;border:0;padding:0;cursor:pointer;font-weight:500}
  th button:hover{color:var(--ink)}
  .num{text-align:end}
  .dim{color:var(--faint)}
</style>
