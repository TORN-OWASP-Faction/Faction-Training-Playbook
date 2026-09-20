<script>
  let { columns = [], rows = [], search = true, caption = '', note = [], group = false } = $props();
  let q = $state('');
  let sortCol = $state(-1);
  let dir = $state(1);

  function num(v) {
    const n = parseFloat(String(v).replace(/[, %$]/g, ''));
    return isNaN(n) ? null : n;
  }
  const filtered = $derived.by(() => {
    let r = rows;
    if (q.trim()) {
      const s = q.toLowerCase();
      r = r.filter((row) => row.some((c) => String(c).toLowerCase().includes(s)));
    }
    if (sortCol >= 0) {
      r = [...r].sort((a, b) => {
        const an = num(a[sortCol]), bn = num(b[sortCol]);
        const c = an != null && bn != null ? an - bn : String(a[sortCol]).localeCompare(String(b[sortCol]));
        return c * dir;
      });
    }
    return r;
  });
  function sortBy(i) {
    if (sortCol === i) dir = -dir;
    else { sortCol = i; dir = 1; }
  }
</script>

<div class="dt">
  {#if search}
    <input class="dt-search" placeholder="Filter…" bind:value={q} aria-label="Filter table" />
  {/if}
  <div class="dt-scroll">
    <table>
      {#if caption}<caption>{caption}</caption>{/if}
      <thead>
        <tr>
          {#each columns as c, i}
            <th onclick={() => sortBy(i)} class:sorted={sortCol === i}>
              {c}<span class="ar">{sortCol === i ? (dir > 0 ? '▲' : '▼') : '↕'}</span>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each filtered as row, i}
          {@const cont = group && i > 0 && filtered[i - 1][0] === row[0]}
          <tr class:cont>
            {#each row as cell, j}
              {#if j === 0 && cont}<td class="grp"></td>{:else}<td>{cell}</td>{/if}
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="dt-count">{filtered.length} of {rows.length} rows</div>
  {#if note && note.length}
    <div class="dt-notes">{#each note as n}<p>{n}</p>{/each}</div>
  {/if}
</div>

<style>
  .dt{margin-top:1rem}
  .dt-search{width:100%;max-width:22rem;font-family:inherit;font-size:.9rem;color:var(--ink);
    background:var(--raised);border:1px solid var(--border);border-radius:2px;padding:.5rem .7rem;margin-bottom:.6rem}
  .dt-scroll{overflow-x:auto;border:1px solid var(--border);border-radius:3px;background:var(--surface)}
  table{border-collapse:collapse;width:100%;font-size:.86rem;min-width:32rem}
  caption{caption-side:top;text-align:left;color:var(--faint);font-size:.75rem;padding:.5rem .7rem}
  th,td{text-align:left;padding:.5rem .7rem;border-bottom:1px solid var(--border);
    font-variant-numeric:tabular-nums;vertical-align:top}
  td{overflow-wrap:anywhere;max-width:26rem;min-width:3rem}
  thead th{position:sticky;top:0;background:var(--raised);cursor:pointer;user-select:none;white-space:nowrap;
    font-family:"Oswald",sans-serif;font-weight:600;text-transform:uppercase;letter-spacing:.04em;font-size:.72rem;color:var(--muted)}
  thead th.sorted{color:var(--ink)}
  .ar{opacity:.5;margin-left:.3em;font-size:.85em}
  tbody tr:hover{background:var(--raised)}
  tbody tr:last-child td{border-bottom:none}
  .dt-count{color:var(--faint);font-size:.75rem;margin-top:.4rem;font-family:"IBM Plex Mono",monospace}
  tr.cont td{border-top:0}
  tr.cont td:first-child{border-bottom:0}
  .dt-notes{margin-top:.7rem;display:grid;gap:.35rem}
  .dt-notes p{margin:0;font-size:.78rem;color:var(--faint);max-width:70ch;line-height:1.5}
</style>
