<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { decodeReport } from '$lib/sharecode.js';
  import { copyTable } from '$lib/tablecopy.js';

  let rep = $state(null);
  let error = $state('');
  let pasted = $state('');
  let opening = $state(true);

  onMount(() => {
    open(location.hash.slice(1));
    const onHash = () => open(location.hash.slice(1));
    addEventListener('hashchange', onHash);
    return () => removeEventListener('hashchange', onHash);
  });

  async function open(input) {
    error = '';
    if (!input.trim()) { opening = false; return; }
    try {
      rep = clean(await decodeReport(input));
      const code = input.trim().split('#').pop();
      if (location.hash.slice(1) !== code) history.replaceState(null, '', '#' + code);
    } catch {
      rep = null;
      error = "That isn't a war report link or code. Check you copied all of it; links are long.";
    }
    opening = false;
  }

  // The link could come from anyone: keep known fields only, as plain strings and finite numbers.
  const num = (v) => (Number.isFinite(+v) ? +v : 0);
  const str = (v, max = 80) => String(v ?? '').slice(0, max);
  const list = (v, max) => (Array.isArray(v) ? v.slice(0, max) : []);
  function clean(d) {
    if (d?.v !== 1) throw new Error('unknown version');
    const w = d.war ?? {}, t = d.tot ?? {};
    return {
      war: {
        faction: str(w.faction), them: str(w.them), start: num(w.start), end: num(w.end) || null,
        result: w.result === 'win' ? 'win' : 'loss', score: [num(w.score?.[0]), num(w.score?.[1])], exact: !!w.exact, official: !!w.official
      },
      tot: { made: num(t.made), splits: num(t.splits), awards: num(t.awards), fromProfit: t.fromProfit !== false, pct: num(t.pct), pool: num(t.pool), keeps: num(t.keeps), perPoint: num(t.perPoint) },
      rewards: list(d.rewards, 50).map((r) => ({ name: str(r?.[0]), qty: num(r?.[1]), price: num(r?.[2]) })),
      splits: list(d.splits, 50).map((s) => ({ name: str(s?.[0]), total: num(s?.[1]) })),
      awards: list(d.awards, 30).map((a) => ({ qty: num(a?.[0]), item: str(a?.[1]), text: str(a?.[2], 160), id: num(a?.[3]) || null, name: str(a?.[4]), value: num(a?.[5]) })),
      members: list(d.m, 300).map((m) => ({ id: num(m?.[0]), name: str(m?.[1], 40), hits: num(m?.[2]), abroad: num(m?.[3]), score: num(m?.[4]), rp: num(m?.[5]), pay: num(m?.[6]) }))
    };
  }

  const money = (v) => (v < 0 ? '−$' : '$') + Math.round(Math.abs(v)).toLocaleString('en-US');
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });
  const date = (t) => new Date(t * 1000).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const profile = (id) => `https://www.torn.com/profiles.php?XID=${id}`;
  const sum = (k) => rep.members.reduce((s, m) => s + m[k], 0);

  const COLS = [['hits', 'War hits'], ['abroad', 'Abroad'], ['score', 'Score'], ['rp', 'RP'], ['pay', 'Payout']];
  const fmt = (k, v) => (k === 'pay' ? money(v) : nf.format(v));
  let sortKey = $state('pay');
  let sortDir = $state(-1);
  const sorted = $derived(rep ? [...rep.members].sort((a, b) =>
    (sortKey === 'name' ? a.name.localeCompare(b.name) : a[sortKey] - b[sortKey]) * sortDir) : []);
  function sortBy(k) { if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = k === 'name' ? 1 : -1; } }

  const title = $derived(rep ? `${rep.war.faction} vs ${rep.war.them}` : '');
  let copied = $state('');
  async function copy(kind) {
    const head = ['Member', ...(kind === 'csv' ? ['ID'] : []), ...COLS.map(([, l]) => l)];
    const body = sorted.map((m) => [m.name || `[${m.id}]`, ...(kind === 'csv' ? [m.id] : []), ...COLS.map(([k]) => (kind === 'csv' ? m[k] : fmt(k, m[k])))]);
    copied = await copyTable(kind, `Payouts: ${title}`, head, body);
  }
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Shared war report</span>
  {#if rep}
    <h1>{rep.war.faction} <em>vs</em> {rep.war.them}</h1>
    <p class="lede">
      Ranked war, {date(rep.war.start)}{rep.war.end ? ` to ${date(rep.war.end)}` : ''}.
      <span class="result" class:won={rep.war.result === 'win'}>{rep.war.result === 'win' ? 'Won' : 'Lost'}</span>
      {nf.format(rep.war.score[0])} to {nf.format(rep.war.score[1])}.
    </p>
  {:else}
    <h1>War <em>report</em></h1>
    <p class="lede">A finished ranked war report someone shared with you: hits, kills abroad, awards and payouts.</p>
  {/if}
</div></header>

<section><div class="wrap">
  {#if rep}
    <div class="tiles">
      <div class="tile"><span>War hits</span><b class="mono">{nf.format(sum('hits'))}</b></div>
      <div class="tile"><span>Abroad</span><b class="mono">{nf.format(sum('abroad'))}</b><small>{rep.war.exact ? 'war hits outside Torn City' : 'overseas hits during chains'}</small></div>
      <div class="tile"><span>Members paid</span><b class="mono">{rep.members.length}</b></div>
      <div class="tile"><span>Total made</span><b class="mono">{money(rep.tot.made)}</b></div>
      <div class="tile"><span>Member pool</span><b class="mono">{money(rep.tot.pool)}</b><small>{nf.format(rep.tot.pct)}% of total made</small></div>
      <div class="tile"><span>Pay per point</span><b class="mono">{money(rep.tot.perPoint)}</b></div>
    </div>

    {#if rep.awards.length}
      <h2 class="h3">Special awards</h2>
      <ul class="awards">
        {#each rep.awards as a}
          <li class="card">
            <span class="what">{a.qty} {a.item} {a.text}</span>
            <span class="who">{#if a.id}<a href={profile(a.id)} target="_blank" rel="noopener">{a.name || `[${a.id}]`}</a> <small>[{a.id}]</small>{:else}To be decided{/if}</span>
            <span class="val mono">{money(a.value)}</span>
          </li>
        {/each}
      </ul>
    {/if}

    <h2 class="h3">Payouts</h2>
    <div class="tbl-scroll"><table class="wr">
      <thead><tr>
        <th aria-sort={sortKey === 'name' ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}><button onclick={() => sortBy('name')}>Member</button></th>
        {#each COLS as [k, l]}<th class="num" aria-sort={sortKey === k ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}><button onclick={() => sortBy(k)}>{l}{sortKey === k ? (sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>{/each}
      </tr></thead>
      <tbody>
        {#each sorted as m (m.id)}
          <tr><td><a href={profile(m.id)} target="_blank" rel="noopener">{m.name || `[${m.id}]`}</a></td>{#each COLS as [k]}<td class="num mono" class:pay={k === 'pay'}>{fmt(k, m[k])}</td>{/each}</tr>
        {/each}
      </tbody>
    </table></div>
    <div class="row">
      <button class="btn-c" onclick={() => copy('discord')}>Copy for Discord</button>
      <button class="btn-c" onclick={() => copy('torn')}>Copy for Torn</button>
      <button class="btn-c" onclick={() => copy('csv')}>Copy as CSV</button>
      <span class="note" aria-live="polite">{copied}</span>
    </div>

    <div class="money">
      <div>
        <h2 class="h3">Rewards</h2>
        <table class="small"><tbody>
          {#each rep.rewards as r}<tr><td>{r.qty} × {r.name}</td><td class="num mono">{money(r.qty * r.price)}</td></tr>{/each}
          <tr class="tot"><th>Total made</th><td class="num mono">{money(rep.tot.made)}</td></tr>
        </tbody></table>
      </div>
      <div>
        <h2 class="h3">Where it went</h2>
        <table class="small"><tbody>
          {#each rep.splits as s}<tr><td>{s.name}</td><td class="num mono">{money(s.total)}</td></tr>{/each}
          {#if rep.tot.fromProfit && rep.tot.awards}<tr><td>Special awards</td><td class="num mono">{money(rep.tot.awards)}</td></tr>{/if}
          <tr><td>Member payouts ({nf.format(rep.tot.pct)}%)</td><td class="num mono">{money(rep.tot.pool)}</td></tr>
          <tr class="tot"><th>Faction keeps</th><td class="num mono">{money(rep.tot.keeps)}</td></tr>
        </tbody></table>
      </div>
    </div>

    <p class="note">
      {#if !rep.war.exact}Abroad counts every overseas hit made during a chain, not only war hits.{/if}
      {#if !rep.war.official}This was shared before the war ended, so the numbers may have changed since.{/if}
      Made with the <a href="{base}/war-report/">War report</a>: build your own faction's with a Limited API key.
    </p>
  {:else if !opening}
    <form class="card paste" onsubmit={(e) => { e.preventDefault(); open(pasted); }}>
      <label class="fld"><span>Paste a report link or code</span>
        <textarea bind:value={pasted} rows="4" spellcheck="false" placeholder="https://…/war-report/view/#… or just the code"></textarea></label>
      <div class="row"><button class="btn-i" type="submit" disabled={!pasted.trim()}>Open report</button></div>
      {#if error}<p class="err" role="alert">{error}</p>{/if}
      <p class="note">Faction leaders make these links on the <a href="{base}/war-report/">War report</a> page. The report is stored inside the link, so nothing is looked up or sent anywhere.</p>
    </form>
  {/if}
</div></section>

<style>
  .result{font-weight:600;color:var(--crime-ink)}
  .result.won{color:var(--trainer-ink)}
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:.7rem;margin:0 0 1.6rem}
  .tiles .tile{display:flex;flex-direction:column;gap:.1rem;border-radius:3px}
  .tiles span{font-family:"IBM Plex Mono",monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .tiles b{font-family:"Oswald",sans-serif;font-size:1.5rem;font-weight:600}
  .tiles small{color:var(--muted);font-size:.8rem}
  .awards{list-style:none;padding:0;margin:.6rem 0 1.8rem;display:grid;gap:.5rem}
  .awards li{display:grid;grid-template-columns:1fr auto auto;gap:.4rem 1.2rem;align-items:baseline;border-radius:3px;padding:.75rem 1rem}
  .awards .who small{color:var(--muted)}
  .awards .val{color:var(--muted);font-size:.88rem}
  @media (max-width:640px){.awards li{grid-template-columns:1fr auto}.awards .what{grid-column:1/-1}}
  table.wr th button{font:inherit;font-weight:600;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-transform:inherit;letter-spacing:inherit}
  td.pay{color:var(--amber);font-weight:600}
  .num{text-align:end;white-space:nowrap}
  .row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-top:.8rem}
  .money{display:grid;grid-template-columns:repeat(auto-fit,minmax(18rem,1fr));gap:1rem 2rem;margin:2rem 0 1rem}
  table.small{min-width:0;margin-top:.5rem}
  table.small td,table.small th{padding:.45rem .6rem}
  table.small .tot th,table.small .tot td{font-weight:600;border-bottom:0}
  .note{color:var(--muted);font-size:.88rem;margin:.3rem 0 0}
  .paste{display:grid;gap:.7rem;border-radius:3px;max-width:44rem}
  .fld{display:grid;gap:.25rem;font-size:.88rem;color:var(--muted)}
  textarea{font:inherit;font-family:"IBM Plex Mono",monospace;font-size:.82rem;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.5rem .6rem;width:100%;resize:vertical}
  .btn-i,.btn-c{font:inherit;font-size:.9rem;border-radius:3px;padding:.45rem .9rem;cursor:pointer}
  .btn-i{background:var(--amber);border:1px solid var(--amber);color:#111;font-weight:600}
  .btn-i:disabled{opacity:.55;cursor:default}
  .btn-c{background:var(--surface);border:1px solid var(--border);color:var(--ink)}
  .btn-c:hover{border-color:var(--amber)}
  .err{margin:0;padding:.6rem .9rem;border:1px solid var(--crime-ink);border-radius:3px;background:var(--crime-soft)}
</style>
