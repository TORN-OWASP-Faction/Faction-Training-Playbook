<script>
  // Revives during the war: who our members revived, and who revived our members.
  let { revives, us, them } = $props();

  const nf = new Intl.NumberFormat('en-US');
  const COLS = [['name', 'Member'], ['us', `For ${us}`], ['them', `For ${them}`], ['other', 'For anyone else'], ['total', 'Total'], ['failed', 'Failed']];

  let sortKey = $state('total');
  let sortDir = $state(-1);
  function sortBy(k) {
    if (sortKey === k) sortDir = -sortDir;
    else { sortKey = k; sortDir = k === 'name' ? 1 : -1; }
  }
  const members = $derived(revives.revivers.map((m) => ({ ...m, total: m.us + m.them + m.other })));
  const sorted = $derived([...members].sort((a, b) =>
    (sortKey === 'name' ? a.name.localeCompare(b.name) : a[sortKey] - b[sortKey]) * sortDir));
  const given = $derived(members.reduce((t, m) => ({ us: t.us + m.us, them: t.them + m.them, other: t.other + m.other }), { us: 0, them: 0, other: 0 }));
  const got = $derived(revives.received);
</script>

<div class="rv">
  <h3>Revives</h3>
  <p class="note">Successful revives during the war. Reviving the faction you're at war with helps their score, so the "For {them}" column is worth a look.</p>

  <div class="tiles">
    <div class="tile"><span>Our members gave</span><b class="mono">{nf.format(given.us + given.them + given.other)}</b>
      <small>{nf.format(given.us)} for us · {nf.format(given.them)} for {them} · {nf.format(given.other)} for others</small></div>
    <div class="tile"><span>Our members got</span><b class="mono">{nf.format(got.us + got.them + got.other)}</b>
      <small>{nf.format(got.us)} from us · {nf.format(got.them)} from {them} · {nf.format(got.other)} from others</small></div>
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
            <td><a href="https://www.torn.com/profiles.php?XID={m.id}" target="_blank" rel="noopener">{m.name}</a></td>
            {#each COLS.slice(1) as [k]}<td class="num mono" class:dim={!m[k]} class:warn={k === 'them' && m.them}>{nf.format(m[k])}</td>{/each}
          </tr>
        {/each}
      </tbody>
    </table></div>
  {:else}
    <p class="note">Nobody in the faction revived anyone during this war.</p>
  {/if}
</div>

<style>
  .rv{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.1rem;margin-top:1.4rem}
  h3{margin:0}
  .note{color:var(--muted);font-size:.88rem;margin:.4rem 0 0}
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:.7rem;margin:1rem 0}
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
  .warn{color:var(--crime);font-weight:600}
</style>
