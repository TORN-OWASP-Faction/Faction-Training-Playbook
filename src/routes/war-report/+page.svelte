<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Character from '$lib/Character.svelte';
  import { loadFaction, buildExact, buildFromChains } from '$lib/warreport.js';
  import { copyTable } from '$lib/tablecopy.js';
  import PayoutCalc from '$lib/PayoutCalc.svelte';

  const KEY_STORE = 'ftp:war-report-key';

  let key = $state('');
  let remember = $state(false);
  let loading = $state(false);
  let error = $state('');
  let progress = $state('');
  let copied = $state('');

  let fac = $state(null); // { faction, exact, wars, names }
  let warId = $state(null);
  let report = $state(null); // { rows, official, chains?, exact, builtAt }
  let sortKey = $state('hits');
  let sortDir = $state(-1);

  onMount(() => {
    try {
      const saved = localStorage.getItem(KEY_STORE);
      if (saved) { key = saved; remember = true; }
    } catch { /* storage blocked: the key just isn't remembered */ }
  });

  function rememberKey() {
    try {
      if (remember) localStorage.setItem(KEY_STORE, key.trim());
      else localStorage.removeItem(KEY_STORE);
    } catch { /* ignore */ }
  }

  function forget() {
    key = ''; remember = false; fac = null; report = null;
    try { localStorage.removeItem(KEY_STORE); } catch { /* ignore */ }
  }

  async function load(e) {
    e?.preventDefault();
    error = ''; report = null; loading = true;
    try {
      fac = await loadFaction(key.trim());
      warId = fac.wars[0]?.id ?? null;
      rememberKey();
    } catch (err) {
      error = err.message; fac = null;
    }
    loading = false;
  }

  const war = $derived(fac?.wars.find((w) => w.id === warId));

  async function build() {
    error = ''; loading = true; progress = 'Starting…';
    try {
      const k = key.trim();
      const res = fac.exact
        ? await buildExact(k, war, fac.faction.id, fac.names, (m) => (progress = m))
        : await buildFromChains(k, war, fac.faction.id, fac.names, (m) => (progress = m));
      report = { ...res, exact: fac.exact, builtAt: new Date() };
    } catch (err) {
      error = err.message;
    }
    loading = false; progress = '';
  }

  const date = (t) => new Date(t * 1000).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' TCT';
  const outcome = (w) => (!w.end ? 'ongoing' : w.winner === fac.faction.id ? 'won' : 'lost');
  const nf = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

  // Columns: [key, label, shown in exact mode, shown in chain mode]
  const COLS = [
    ['hits', 'War hits', true, true], ['abroad', 'Abroad', true, true], ['unknown', 'Location unknown', false, true], ['score', 'Score', true, true],
    ['respect', 'Respect', true, false], ['leave', 'Leave', true, true], ['mug', 'Mug', true, true],
    ['hosp', 'Hosp', true, true], ['assists', 'Assists', true, false]
  ];
  const cols = $derived(COLS.filter(([k, , ex, ch]) => (report?.exact ? ex : ch) && ((k !== 'score' && k !== 'unknown') || report?.official)));

  const rows = $derived.by(() => {
    if (!report) return [];
    return [...report.rows].sort((a, b) => {
      const x = a[sortKey], y = b[sortKey];
      return (typeof x === 'string' ? x.localeCompare(y) : (x ?? -1) - (y ?? -1)) * sortDir;
    });
  });
  const total = (k) => rows.reduce((s, r) => s + (r[k] ?? 0), 0);

  function sortBy(k) {
    if (sortKey === k) sortDir = -sortDir;
    else { sortKey = k; sortDir = k === 'name' ? 1 : -1; }
  }

  // ---- copy ----
  const title = $derived(war ? `War report: ${fac.faction.name} vs ${war.them?.name ?? '?'}` : '');
  const cell = (r, k) => (r[k] == null ? '—' : nf.format(r[k]));

  const tableHead = () => ['Member', ...cols.map(([, l]) => l)];
  const tableBody = () => rows.map((r) => [r.name, ...cols.map(([k]) => cell(r, k))]);
  async function copy(kind) {
    copied = await copyTable(kind, title, kind === 'csv' ? ['Member', 'ID', ...cols.map(([, l]) => l)] : tableHead(),
      kind === 'csv' ? rows.map((r) => [r.name, r.id, ...cols.map(([k]) => r[k] ?? '')]) : tableBody());
  }
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">For faction leaders</span>
  <h1>War <em>report</em></h1>
  <p class="lede">Who made how many ranked war hits, and how many of them abroad. Useful for payouts, and for knowing who's covering targets overseas.</p>
  <Character variant="militia" name="Rook" tag="Faction Intel" initial="R" img="militia.png">
    "Hits abroad take more effort and pay more respect. The people making them deserve to be counted."
  </Character>
</div></header>

<section id="report"><div class="wrap">
  <form class="keycard card" onsubmit={load}>
    <label class="fld"><span>Your Torn API key</span>
      <input type="password" bind:value={key} autocomplete="off" spellcheck="false" maxlength="16" placeholder="16 characters" required /></label>
    <label class="tog"><input type="checkbox" bind:checked={remember} onchange={rememberKey} /> <span>Remember it on this device</span></label>
    <div class="row">
      <button class="btn-i" type="submit" disabled={loading || key.trim().length < 16}>{loading && !fac ? 'Loading…' : 'Load my faction'}</button>
      {#if key}<button class="btn-c" type="button" onclick={forget}>Forget key</button>{/if}
    </div>
    <p class="note">Your key goes straight from your browser to Torn's API and nowhere else. A <b>Limited</b> key works. For exact abroad counts, faction leadership also has to turn on <b>Faction API Access</b> for your position; the same key then works. Make a key at <a href="https://www.torn.com/preferences.php#tab=api" target="_blank" rel="noopener">Settings → API Key</a>.</p>
  </form>

  {#if error}<p class="err" role="alert">{error}</p>{/if}

  {#if fac}
    <div class="pick card">
      <div class="facline">
        <b>{fac.faction.name}</b>
        <span class="badge" class:exact={fac.exact}>{fac.exact ? 'Exact: faction API access' : 'Chain reports: abroad is approximate'}</span>
      </div>
      {#if !fac.exact}
        <div class="access" role="status">
          <p><b>⚠ This key can't read your faction's attack log.</b> The key itself is fine: a Limited key is enough. What's missing is a faction permission called <b>Faction API Access</b>, and only your faction's leader or co-leader can turn it on. Until then, kills abroad are an estimate from chain reports.</p>
          <p>Ask leadership to:</p>
          <ol>
            <li>Open <b>Faction → Controls → Positions</b> in Torn.</li>
            <li>Find the <b>Faction API Access</b> row. A ✕ means it's off for that position.</li>
            <li>Tick it for the position you hold, then save.</li>
          </ol>
          <div class="row">
            <button class="btn-c" onclick={load} disabled={loading}>{loading ? 'Checking…' : "It's on now: check again"}</button>
            <span class="note">Your current key should pick it up. If this warning stays, make a new Limited key.</span>
          </div>
        </div>
      {/if}
      {#if fac.wars.length}
        <label class="fld"><span>Ranked war</span>
          <select bind:value={warId}>
            {#each fac.wars as w (w.id)}
              <option value={w.id}>vs {w.them?.name ?? '?'} · {date(w.start)} · {outcome(w)} ({nf.format(w.us?.score ?? 0)}–{nf.format(w.them?.score ?? 0)})</option>
            {/each}
          </select></label>
        <div class="row">
          <button class="btn-i" onclick={build} disabled={loading}>{loading ? 'Working…' : report ? 'Refresh report' : 'Build report'}</button>
          <span class="prog" aria-live="polite">{progress}</span>
        </div>
      {:else}
        <p class="note">Your faction has no ranked wars on record yet.</p>
      {/if}
    </div>
  {/if}

  {#if report && war}
    <div class="tiles">
      <div class="tile"><span>War hits</span><b class="mono">{nf.format(total('hits'))}</b><small>{report.official ? "from Torn's war report" : 'from chain reports'}</small></div>
      <div class="tile"><span>Abroad</span><b class="mono">{nf.format(total('abroad'))}</b><small>{report.exact ? 'war hits outside Torn City' : 'overseas hits during chains'}</small></div>
      {#if !report.exact && report.official}
        <div class="tile"><span>Location unknown</span><b class="mono">{nf.format(total('unknown'))}</b><small>war hits made between chains</small></div>
      {/if}
      <div class="tile"><span>{report.official ? 'Score' : 'Respect'}</span><b class="mono">{nf.format(report.official ? total('score') : total('respect'))}</b><small>{outcome(war) === 'ongoing' ? 'so far' : outcome(war)}</small></div>
      <div class="tile"><span>Members</span><b class="mono">{rows.filter((r) => r.hits).length}</b><small>made a war hit</small></div>
    </div>

    {#if !report.exact}
      <div class="unlock">
        <b>This count of kills abroad is incomplete.</b>
        {#if report.official && total('unknown')}{nf.format(total('unknown'))} of {nf.format(total('hits'))} war hits were made while no chain was running, and Torn only records their location in the faction attack log.{:else}Torn only records where every hit happened in the faction attack log.{/if}
        Once leadership turns on <b>Faction API Access</b> for your position (see above), the report switches to the exact count by itself.
      </div>
    {/if}

    <div class="tbl-scroll"><table class="wr">
      <caption>{title} · built {report.builtAt.toLocaleTimeString()}</caption>
      <thead><tr>
        <th aria-sort={sortKey === 'name' ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}><button onclick={() => sortBy('name')}>Member</button></th>
        {#each cols as [k, l]}
          <th class="num" aria-sort={sortKey === k ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}><button onclick={() => sortBy(k)}>{l}{sortKey === k ? (sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>
        {/each}
      </tr></thead>
      <tbody>
        {#each rows as r (r.id)}
          <tr>
            <td><a href="https://www.torn.com/profiles.php?XID={r.id}" target="_blank" rel="noopener">{r.name}</a></td>
            {#each cols as [k]}<td class="num mono" class:hot={k === 'abroad' && r.abroad} class:dim={k === 'unknown' && !r.unknown}>{cell(r, k)}</td>{/each}
          </tr>
        {/each}
      </tbody>
    </table></div>

    <div class="row" style="margin-top:.8rem">
      <button class="btn-c" onclick={() => copy('discord')}>Copy for Discord</button>
      <button class="btn-c" onclick={() => copy('torn')}>Copy for Torn</button>
      <button class="btn-c" onclick={() => copy('csv')}>Copy as CSV</button>
      <span class="prog" aria-live="polite">{copied}</span>
    </div>

    <p class="note">
      {#if report.exact}
        Counted from your faction's attack log: every ranked-war hit that got Torn's overseas bonus counts as abroad.
      {:else}
        Abroad comes from {report.chains} chain report{report.chains === 1 ? '' : 's'} and counts every overseas hit made during a chain, war or not; hits made while no chain was running aren't in it. For exact numbers, use a key with faction API access.
      {/if}
      {#if report.official}War hits and score come from Torn's official war report.{:else if !war.end}Torn only publishes its official war report when the war ends, so hits are from chain reports until then.{/if}
    </p>

    <PayoutCalc {report} positions={fac.positions} info={{ faction: fac.faction.name, them: war.them?.name ?? '?', start: war.start, end: war.end, score: [war.us?.score ?? 0, war.them?.score ?? 0], exact: !!report.exact, official: !!report.official }} key={key.trim()} result={outcome(war)} {title} warId={war.id} />
  {/if}
</div></section>

<section id="how"><div class="wrap">
  <span class="eyebrow">Where the numbers come from</span>
  <h2>How it counts</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>With faction API access (exact)</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">1</span><div>Reads every outgoing attack from the war start, 100 at a time.</div></li>
        <li><span class="k">2</span><div>Keeps ranked-war hits only, and counts a hit as abroad when Torn applied the overseas bonus (fights outside Torn City).</div></li>
        <li><span class="k">3</span><div>Once the war ends, hits and score come from Torn's official war report.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>With any Limited key (approximate)</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">1</span><div>Reads the report for every chain your faction ran during the war, including one still going.</div></li>
        <li><span class="k">2</span><div>Abroad is each member's overseas hits during those chains, which can include a few non-war hits.</div></li>
        <li><span class="k">3</span><div>Hits and score still come from Torn's official war report once the war ends.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<footer><div class="wrap">
  <strong>War report.</strong> Built on Torn's API (faction attacks, chain reports and ranked war reports). Nothing is stored except, if you tick the box, your key in this browser. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .keycard,.pick{display:grid;gap:.7rem;border-radius:3px;max-width:44rem}
  .pick{margin-top:1rem}
  .fld{display:grid;gap:.25rem;font-size:.88rem;color:var(--muted)}
  .fld input,.fld select{font:inherit;font-size:.95rem;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.45rem .6rem;min-width:0;width:100%}
  .fld input{font-family:"IBM Plex Mono",monospace;letter-spacing:.05em}
  .tog{display:flex;gap:.5rem;align-items:center;font-size:.9rem;color:var(--ink);cursor:pointer}
  .tog input{accent-color:var(--amber);width:1rem;height:1rem}
  .row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}
  .note{color:var(--muted);font-size:.88rem;margin:.2rem 0 0}
  .err{margin-top:1rem;padding:.6rem .9rem;border:1px solid var(--crime-ink);border-radius:3px;background:var(--crime-soft);max-width:44rem}
  .btn-i,.btn-c{font:inherit;font-size:.9rem;border-radius:3px;padding:.45rem .9rem;cursor:pointer}
  .btn-i{background:var(--amber);border:1px solid var(--amber);color:#111;font-weight:600}
  .btn-i:disabled{opacity:.55;cursor:default}
  .btn-c{background:var(--surface);border:1px solid var(--border);color:var(--ink)}
  .btn-c:hover{border-color:var(--amber)}
  .prog{color:var(--muted);font-size:.88rem}
  .facline{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center}
  .badge{font-family:"IBM Plex Mono",monospace;font-size:.72rem;border:1px solid var(--amber);color:var(--amber);border-radius:2px;padding:2px 7px}
  .badge.exact{border-color:var(--trainer-ink);color:var(--trainer-ink)}
  .tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:.7rem;margin:1.2rem 0 1rem}
  .tiles .tile{display:flex;flex-direction:column;gap:.1rem;border-radius:3px}
  .tiles span{font-family:"IBM Plex Mono",monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .tiles b{font-family:"Oswald",sans-serif;font-size:1.6rem;font-weight:600}
  .tiles small{color:var(--muted);font-size:.8rem}
  table.wr caption{text-align:start;color:var(--muted);font-size:.85rem;padding:.4rem 0;caption-side:top}
  table.wr th button{font:inherit;font-weight:600;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-transform:inherit;letter-spacing:inherit}
  .num{text-align:end;white-space:nowrap}
  td.dim{color:var(--muted)}
  td.hot{color:var(--amber);font-weight:600}
  .access{margin-top:.9rem;padding:.8rem 1rem;border:1px solid var(--amber);border-radius:3px;background:var(--amber-soft);font-size:.92rem}
  .access p{margin:0 0 .5rem;max-width:none}
  .access ol{margin:0 0 .6rem;padding-inline-start:1.3rem;display:grid;gap:.2rem;list-style:decimal}
  .access li{display:list-item}
  .unlock{margin:0 0 1rem;padding:.8rem 1rem;border:1px solid var(--amber);border-radius:3px;background:var(--amber-soft);font-size:.92rem;max-width:none}
</style>
