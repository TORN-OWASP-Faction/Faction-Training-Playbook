<script>
  import { onMount, untrack } from 'svelte';
  import { memberPoints, payout, awardText, awardWinner, AWARD_RULES, DEFAULT_RULES, DEFAULT_TIERS, DEFAULT_SPLITS, DEFAULT_AWARDS, DEFAULT_EXCLUDED } from '$lib/payout.js';
  import { itemPrices, itemCatalog, playerAges } from '$lib/warreport.js';
  import { copyTable } from '$lib/tablecopy.js';
  import { encodeReport } from '$lib/sharecode.js';
  import { base } from '$app/paths';

  // report: the built war report (rows, rewards, chainReports). result: 'won' | 'lost'. positions: { id: faction position }.
  // info: the war's faction names, times and scores, for the share link.
  let { report, positions = {}, info, key, result, title, warId } = $props();

  const STORE = 'ftp:war-payout:v1';

  // Rewards come from Torn's war report; prices are filled in by hand or from market value.
  let rewards = $state([]);
  $effect(() => {
    const items = report.rewards?.items ?? [];
    const pts = report.rewards?.points ? [{ id: null, name: 'Points', qty: report.rewards.points, price: 0, sold: false }] : [];
    rewards = [...items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity, price: 0, sold: false })), ...pts];
  });

  // Faction setup, remembered in this browser.
  let splits = $state(structuredClone(DEFAULT_SPLITS));
  let tiers = $state(structuredClone(DEFAULT_TIERS));
  let tierName = $state('Silver');
  let outcome = $state('loss');
  let extra = $state(false);
  let extraPct = $state(5);
  let rules = $state({ ...DEFAULT_RULES });
  let awards = $state(structuredClone(DEFAULT_AWARDS));
  let awardsFromProfit = $state(true);
  let excluded = $state([...DEFAULT_EXCLUDED]);
  let excludedIds = $state([]);
  let ready = false;

  // Winners belong to one war: a new report goes back to picking them automatically.
  $effect(() => {
    report;
    untrack(() => { for (const a of awards) a.winner = null; });
  });

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved?.splits) splits = saved.splits;
      if (saved?.tiers) tiers = saved.tiers;
      if (saved?.tierName) tierName = saved.tierName;
      if (saved?.extraPct != null) extraPct = saved.extraPct;
      if (saved?.rules) rules = { ...DEFAULT_RULES, ...saved.rules };
      if (Array.isArray(saved?.awards)) awards = cleanAwards(saved.awards);
      if (saved?.awardsFromProfit === false) awardsFromProfit = false;
      if (Array.isArray(saved?.excluded)) excluded = cleanList(saved.excluded);
      if (Array.isArray(saved?.excludedIds)) { excludedIds = cleanIds(saved.excludedIds); idsText = excludedIds.join(', '); }
    } catch { /* storage blocked or old data: keep defaults */ }
    ready = true;
  });
  $effect(() => {
    const data = JSON.stringify({ splits, tiers, tierName, extraPct, rules, awards: awardDefs(), awardsFromProfit, excluded, excludedIds });
    if (!ready) return;
    try { localStorage.setItem(STORE, data); } catch { /* ignore */ }
  });
  $effect(() => { outcome = result === 'won' ? 'win' : 'loss'; });

  let pricing = $state('');
  async function fillPrices() {
    pricing = 'Fetching market prices…';
    try {
      const prices = await itemPrices(key, rewards.filter((r) => r.id).map((r) => r.id));
      for (const r of rewards) if (r.id && prices[r.id]) r.price = prices[r.id];
      pricing = 'Filled with current market value. Change any price you actually sold for.';
    } catch (err) {
      pricing = err.message;
    }
  }

  const n = (v) => (Number.isFinite(+v) ? +v : 0);
  const money = (v) => (v < 0 ? '−$' : '$') + Math.round(Math.abs(v)).toLocaleString('en-US');
  const pctOf = (v, of) => (of ? ((v / of) * 100).toFixed(1) + '%' : '—');

  const totalMade = $derived(rewards.reduce((s, r) => s + n(r.qty) * n(r.price), 0));
  const splitsSpent = $derived(splits.reduce((s, r) => s + n(r.qty) * n(r.price), 0));
  const awardsTotal = $derived(awards.reduce((s, a) => s + n(a.qty) * n(a.price), 0));
  const spent = $derived(splitsSpent + (awardsFromProfit ? awardsTotal : 0));
  const tier = $derived(tiers.find((t) => t[0] === tierName) ?? tiers[0]);
  const pct = $derived(n(outcome === 'win' ? tier[1] : tier[2]) + (extra ? n(extraPct) : 0));
  const points = $derived(memberPoints(report.rows, report.chainReports ?? [], rules));
  const res = $derived(payout({ totalMade, spent, pct, points }));

  let sortKey = $state('pay');
  let sortDir = $state(-1);
  const sorted = $derived([...res.pays].filter((p) => p.rp > 0).sort((a, b) =>
    (typeof a[sortKey] === 'string' ? a[sortKey].localeCompare(b[sortKey]) : a[sortKey] - b[sortKey]) * sortDir));
  function sortBy(k) { if (sortKey === k) sortDir = -sortDir; else { sortKey = k; sortDir = k === 'name' ? 1 : -1; } }

  const COLS = [['hits', 'War hits'], ['war', 'War respect'], ['bonus', 'Bonus share'], ['oow', 'Out-of-war'], ['assists', 'Assists'], ['rp', 'RP'], ['pay', 'Payout']];
  const fmt = (k, v) => (k === 'pay' ? money(v) : k === 'war' || k === 'bonus' || k === 'rp' ? v.toFixed(2) : String(v));

  // ---- special awards ----
  const byId = $derived(Object.fromEntries(report.rows.map((r) => [r.id, r])));
  const members = $derived([...report.rows].sort((a, b) => (a.name ?? '').localeCompare(b.name ?? '')));
  let ages = $state({});
  let catalog = $state([]);
  let awardMsg = $state('');

  // Every position in the faction, most common first, for the "can't win" choices.
  const positionList = $derived(Object.entries(Object.values(positions).reduce((c, p) => ({ ...c, [p]: (c[p] ?? 0) + 1 }), {}))
    .sort((a, b) => b[1] - a[1]));
  function toggleExcluded(pos, on) {
    excluded = on ? [...excluded, pos] : excluded.filter((p) => p !== pos);
  }
  // Player IDs typed or pasted in any form: "3214737", "Name [3214737]", or a list of either.
  let idsText = $state('');
  function readIds() {
    excludedIds = cleanIds(idsText.match(/\d+/g) ?? []);
    idsText = excludedIds.join(', ');
  }
  const eligible = $derived(report.rows.filter((r) => !excluded.includes(positions[r.id]) && !excludedIds.includes(r.id)));

  const winnerOf = (a) => (a.winner != null ? byId[a.winner] ?? null : awardWinner(a, eligible, ages));
  const ageCandidates = $derived([...new Set(awards.filter((a) => a.rule === 'newScore')
    .flatMap((a) => eligible.filter((r) => (r.score ?? 0) > n(a.min)).map((r) => r.id)))]);
  const agesMissing = $derived(ageCandidates.some((id) => ages[id] == null));

  function why(a, w) {
    if (!w) return '';
    if (a.rule === 'abroad') return `${w.abroad} abroad`;
    if (a.rule === 'hits') return `${w.hits} war hits`;
    if (a.rule === 'score' || a.rule === 'newScore') return `score ${(w.score ?? 0).toFixed(1)}${ages[w.id] != null ? ` · ${ages[w.id]} days old` : ''}`;
    return '';
  }

  function priceFromCatalog(a) {
    const hit = catalog.find((i) => i.name.toLowerCase() === a.item.trim().toLowerCase());
    if (hit) a.price = hit.price;
  }

  async function lookUpAwards() {
    awardMsg = 'Fetching market prices…';
    try {
      catalog = await itemCatalog(key);
      for (const a of awards) priceFromCatalog(a);
      if (ageCandidates.length) ages = { ...ages, ...(await playerAges(key, ageCandidates, (m) => (awardMsg = m))) };
      const unpriced = awards.filter((a) => !catalog.some((i) => i.name.toLowerCase() === a.item.trim().toLowerCase()));
      awardMsg = unpriced.length
        ? `Filled in what Torn knows. No market item called ${unpriced.map((a) => `"${a.item}"`).join(', ')}: enter that value by hand.`
        : 'Filled with current market value. Winners are picked from this war; change any you like.';
    } catch (err) {
      awardMsg = err.message;
    }
  }

  function awardLine(a) {
    const w = winnerOf(a);
    return `${n(a.qty)} ${a.item} ${awardText(a)}. ${w ? `${w.name ?? ''} [${w.id}]`.trim() : 'Winner to be decided'}`;
  }

  async function copyAwards() {
    try {
      await navigator.clipboard.writeText(awards.map(awardLine).join('\n'));
      awardMsg = 'Copied the award lines.';
    } catch {
      awardMsg = 'Your browser blocked copying.';
    }
  }

  // Award rules without this war's winners, for setups and remembering between visits.
  const awardDefs = () => awards.map(({ winner, ...a }) => a);

  // ---- named setups and file export/import ----
  const SETUPS = 'ftp:war-payout-setups:v1';
  let setups = $state([]);
  let setupName = $state('');
  let chosen = $state('');
  let setupMsg = $state('');
  let confirmDelete = $state(false);

  onMount(() => {
    try { setups = JSON.parse(localStorage.getItem(SETUPS) || '[]'); } catch { setups = []; }
  });
  function storeSetups() {
    try { localStorage.setItem(SETUPS, JSON.stringify(setups)); return true; }
    catch { setupMsg = "Couldn't save: this browser is blocking storage."; return false; }
  }

  const current = () => $state.snapshot({ splits, tiers, tierName, extra, extraPct, rules, awards: awardDefs(), awardsFromProfit, excluded, excludedIds });

  function apply(setup) {
    splits = setup.splits; tiers = setup.tiers; tierName = setup.tierName;
    extra = setup.extra; extraPct = setup.extraPct; rules = setup.rules;
    if (setup.awards) awards = setup.awards;
    awardsFromProfit = setup.awardsFromProfit;
    if (setup.excluded) excluded = setup.excluded;
    if (setup.excludedIds) { excludedIds = setup.excludedIds; idsText = excludedIds.join(', '); }
  }

  function saveSetup(asNew) {
    const existing = setups.find((x) => x.name === chosen);
    const name = (asNew ? setupName : chosen).trim();
    if (!name) { setupMsg = 'Give the setup a name first.'; return; }
    const entry = { name, ...current(), saved: new Date().toISOString() };
    setups = [entry, ...setups.filter((x) => x.name !== name && (asNew || x !== existing))];
    if (storeSetups()) { chosen = name; setupName = ''; setupMsg = `Saved "${name}".`; }
  }

  function loadSetup() {
    const found = setups.find((x) => x.name === chosen);
    if (!found) return;
    apply(clean(found));
    setupMsg = `Loaded "${found.name}".`;
    confirmDelete = false;
  }

  function deleteSetup() {
    setups = setups.filter((x) => x.name !== chosen);
    storeSetups();
    setupMsg = `Deleted "${chosen}".`;
    chosen = ''; confirmDelete = false;
  }

  function exportFile() {
    const data = {
      app: 'faction-training-playbook', kind: 'war-payout', version: 1,
      name: chosen || 'War payout', exported: new Date().toISOString(),
      war: { id: warId, title }, outcome,
      rewards: $state.snapshot(rewards).map(({ id, name, qty, price, sold }) => ({ id, name, qty, price, sold })),
      ...current(),
      awards: awards.map((a) => ({ ...$state.snapshot(a), winner: winnerOf(a)?.id ?? null }))
    };
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    a.download = `war-payout-${warId ?? 'setup'}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setupMsg = 'Exported. Share the file with whoever runs the numbers.';
  }

  // A file could come from anyone: keep known fields only, as plain strings and finite numbers.
  const num = (v, d = 0) => (Number.isFinite(+v) ? +v : d);
  const str = (v, max = 80) => String(v ?? '').slice(0, max);
  function clean(d) {
    return {
      splits: (Array.isArray(d.splits) ? d.splits : []).slice(0, 50).map((x) => ({ name: str(x?.name), qty: num(x?.qty), price: num(x?.price), sold: !!x?.sold, note: str(x?.note, 120) })),
      tiers: (Array.isArray(d.tiers) && d.tiers.length ? d.tiers : DEFAULT_TIERS).slice(0, 12).map((t) => [str(t?.[0], 30), num(t?.[1]), num(t?.[2])]),
      tierName: str(d.tierName, 30),
      extra: !!d.extra,
      extraPct: num(d.extraPct, 5),
      rules: Object.fromEntries(Object.entries(DEFAULT_RULES).map(([k, v]) => [k, typeof v === 'boolean' ? (d.rules?.[k] ?? v) === true : num(d.rules?.[k], v)])),
      awards: Array.isArray(d.awards) ? cleanAwards(d.awards) : null,
      awardsFromProfit: d.awardsFromProfit !== false,
      excluded: Array.isArray(d.excluded) ? cleanList(d.excluded) : null,
      excludedIds: Array.isArray(d.excludedIds) ? cleanIds(d.excludedIds) : null
    };
  }
  const cleanList = (list) => list.slice(0, 30).map((x) => str(x, 40));
  const cleanIds = (list) => [...new Set(list.map(Number).filter((x) => Number.isInteger(x) && x > 0))].slice(0, 200);
  function cleanAwards(list) {
    const ruleIds = AWARD_RULES.map(([id]) => id);
    return list.slice(0, 30).map((a) => ({
      rule: ruleIds.includes(a?.rule) ? a.rule : 'manual',
      min: num(a?.min), maxAge: num(a?.maxAge, 150), reason: str(a?.reason, 160),
      item: str(a?.item), qty: num(a?.qty, 1), price: num(a?.price), winner: null
    }));
  }

  async function importFile(e) {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = '';
    if (!file) return;
    try {
      const d = JSON.parse(await file.text());
      if (d?.kind !== 'war-payout') throw new Error();
      apply(clean(d));
      let note = '';
      if (d.war?.id === warId && Array.isArray(d.rewards)) {
        for (const r of rewards) {
          const match = d.rewards.find((x) => (x.id && x.id === r.id) || x.name === r.name);
          if (match) { r.price = num(match.price); r.sold = !!match.sold; }
        }
        if (d.outcome === 'win' || d.outcome === 'loss') outcome = d.outcome;
        if (Array.isArray(d.awards)) d.awards.slice(0, awards.length).forEach((x, i) => { if (byId[x?.winner]) awards[i].winner = x.winner; });
        note = ' Reward prices and award winners for this war were filled in too.';
      } else if (d.war?.id) {
        note = ' The file is from a different war, so only the setup was loaded.';
      }
      setupMsg = `Imported "${str(d.name)}".${note}`;
    } catch {
      setupMsg = "That file isn't a war payout export.";
    }
  }

  // ---- share the finished report as a link (see sharecode.js) ----
  let shareUrl = $state('');
  let shareMsg = $state('');
  const r1 = (v) => Math.round(n(v) * 10) / 10;

  function snapshot() {
    const row = Object.fromEntries(report.rows.map((r) => [r.id, r]));
    return {
      v: 1,
      war: { id: warId, ...info, result: outcome },
      tot: { made: Math.round(totalMade), splits: Math.round(splitsSpent), awards: Math.round(awardsTotal), fromProfit: awardsFromProfit, pct, pool: Math.round(res.pool), keeps: Math.round(res.keeps), perPoint: Math.round(res.perPoint) },
      rewards: rewards.map((r) => [r.name, n(r.qty), n(r.price)]),
      splits: splits.filter((s) => n(s.qty) * n(s.price)).map((s) => [s.name, n(s.qty) * n(s.price)]),
      awards: awards.map((a) => { const w = winnerOf(a); return [n(a.qty), a.item, awardText(a), w?.id ?? null, w?.name ?? null, n(a.qty) * n(a.price)]; }),
      m: res.pays.filter((p) => p.rp > 0).sort((a, b) => b.pay - a.pay)
        .map((p) => [p.id, p.name ?? '', p.hits, row[p.id]?.abroad ?? 0, r1(row[p.id]?.score), r1(p.rp), Math.round(p.pay)])
    };
  }

  async function makeShareLink() {
    try {
      shareUrl = `${location.origin}${base}/war-report/view/#${await encodeReport(snapshot())}`;
      shareMsg = shareUrl.length > 2000
        ? `The link is ${shareUrl.length.toLocaleString()} characters, more than one Discord message holds. Send it as a file, or share the code and have people paste it on the view page.`
        : `Link ready (${shareUrl.length.toLocaleString()} characters). If you change anything above, make a new one.`;
    } catch {
      shareMsg = "This browser can't make share links. Try an up-to-date Chrome, Firefox, Edge or Safari.";
    }
  }

  async function copyShare(what) {
    try {
      await navigator.clipboard.writeText(what === 'code' ? shareUrl.split('#')[1] : shareUrl);
      shareMsg = what === 'code' ? 'Copied the code. It opens on the view page under "Paste a report".' : 'Copied the link.';
    } catch {
      shareMsg = 'Your browser blocked copying. Select the link and copy it by hand.';
    }
  }

  let copied = $state('');
  async function copy(kind) {
    const head = ['Member', ...COLS.map(([, l]) => l)];
    const body = sorted.map((p) => [p.name ?? `[${p.id}]`, ...COLS.map(([k]) => (kind === 'csv' ? (k === 'pay' ? Math.round(p.pay) : +p[k].toFixed(2)) : fmt(k, p[k])))]);
    copied = await copyTable(kind, `Payouts: ${title}`, head, body);
  }
</script>

<div class="pc">
  <h2>Payouts</h2>
  <p class="lede">Value the rewards, take out the faction's splits, pick the tier, and every member's payout follows from their points.</p>

  <!-- SETUPS -->
  <div class="setups card">
    <div class="bh"><h3>Setups</h3><span class="note">Splits, tiers and point rules, saved by name in this browser. Export to share with the rest of leadership.</span></div>
    <div class="setrow">
      <label class="fld"><span>Saved setup</span>
        <select bind:value={chosen}>
          <option value="">Choose a setup…</option>
          {#each setups as x (x.name)}<option value={x.name}>{x.name}</option>{/each}
        </select></label>
      <button class="btn-c" onclick={loadSetup} disabled={!chosen}>Load</button>
      <button class="btn-c" onclick={() => saveSetup(false)} disabled={!chosen}>Save changes</button>
      {#if confirmDelete}
        <button class="btn-c danger" onclick={deleteSetup}>Delete for good</button>
        <button class="btn-c" onclick={() => (confirmDelete = false)}>Keep</button>
      {:else}
        <button class="btn-c" onclick={() => (confirmDelete = true)} disabled={!chosen}>Delete</button>
      {/if}
    </div>
    <div class="setrow">
      <label class="fld grow"><span>New setup name</span><input bind:value={setupName} maxlength="80" placeholder="e.g. Standard ranked war" /></label>
      <button class="btn-c" onclick={() => saveSetup(true)}>Save as new</button>
      <button class="btn-c" onclick={exportFile}>Export to file</button>
      <label class="btn-c file">Import a file<input type="file" accept="application/json,.json" onchange={importFile} /></label>
    </div>
    {#if setupMsg}<p class="note" aria-live="polite">{setupMsg}</p>{/if}
  </div>

  <!-- REWARDS -->
  <div class="block card">
    <div class="bh"><h3>Rewards</h3><button class="btn-c" onclick={fillPrices} disabled={!rewards.some((r) => r.id)}>Fill market prices</button></div>
    {#if pricing}<p class="note" aria-live="polite">{pricing}</p>{/if}
    <div class="tbl-scroll"><table class="ed">
      <thead><tr><th>Item</th><th class="num">Qty</th><th class="num">Price each</th><th class="num">Total</th><th>Sold</th><th><span class="sr">Remove</span></th></tr></thead>
      <tbody>
        {#each rewards as r, i}
          <tr>
            <td><input aria-label="Item name" bind:value={r.name} /></td>
            <td class="num"><input class="qty" type="number" min="0" aria-label="{r.name} quantity" bind:value={r.qty} /></td>
            <td class="num"><input class="amt" type="number" min="0" step="1000" aria-label="{r.name} price each" bind:value={r.price} /></td>
            <td class="num mono">{money(n(r.qty) * n(r.price))}</td>
            <td><input type="checkbox" aria-label="{r.name} sold" bind:checked={r.sold} /></td>
            <td><button class="x" aria-label="Remove {r.name}" onclick={() => rewards.splice(i, 1)}>×</button></td>
          </tr>
        {/each}
      </tbody>
      <tfoot><tr><td><button class="chip" onclick={() => rewards.push({ id: null, name: 'Other', qty: 1, price: 0, sold: false })}>+ Add a row</button></td><td></td><th class="num">Total made</th><td class="num mono"><b>{money(totalMade)}</b></td><td colspan="2"></td></tr></tfoot>
    </table></div>
  </div>

  <!-- SPLITS -->
  <div class="block card">
    <div class="bh"><h3>Faction splits</h3><span class="note">Entered by hand; saved in this browser for next time.</span></div>
    <div class="tbl-scroll"><table class="ed">
      <thead><tr><th>Split</th><th class="num">Qty</th><th class="num">Price each</th><th class="num">Total</th><th class="num">% of made</th><th>Sold</th><th>Note</th><th><span class="sr">Remove</span></th></tr></thead>
      <tbody>
        {#each splits as s, i}
          <tr>
            <td><input aria-label="Split name" bind:value={s.name} /></td>
            <td class="num"><input class="qty" type="number" min="0" aria-label="{s.name} quantity" bind:value={s.qty} /></td>
            <td class="num"><input class="amt" type="number" min="0" step="1000" aria-label="{s.name} price each" bind:value={s.price} /></td>
            <td class="num mono">{money(n(s.qty) * n(s.price))}</td>
            <td class="num mono">{pctOf(n(s.qty) * n(s.price), totalMade)}</td>
            <td><input type="checkbox" aria-label="{s.name} sold" bind:checked={s.sold} /></td>
            <td><input aria-label="{s.name} note" bind:value={s.note} /></td>
            <td><button class="x" aria-label="Remove {s.name}" onclick={() => splits.splice(i, 1)}>×</button></td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr><td><button class="chip" onclick={() => splits.push({ name: 'New split', qty: 1, price: 0, sold: false, note: '' })}>+ Add a split</button></td><td></td><th class="num">Total spent</th><td class="num mono"><b>{money(splitsSpent)}</b></td><td class="num mono">{pctOf(splitsSpent, totalMade)}</td><td colspan="3"></td></tr>
        <tr><td colspan="2"></td><th class="num">Profit after splits</th><td class="num mono"><b>{money(totalMade - splitsSpent)}</b></td><td class="num mono">{pctOf(totalMade - splitsSpent, totalMade)}</td><td colspan="3"></td></tr>
      </tfoot>
    </table></div>
  </div>

  <!-- SPECIAL AWARDS -->
  <div class="block card">
    <div class="bh">
      <h3>Special awards</h3>
      <button class="btn-c" onclick={lookUpAwards}>{agesMissing ? 'Look up values and account ages' : 'Look up market values'}</button>
    </div>
    <p class="note">Donator packs, event items and other perks for standout play. Winners are picked from this war's numbers; pick someone else from the list to override.</p>
    {#if awardMsg}<p class="note" aria-live="polite">{awardMsg}</p>{/if}
    <fieldset class="excl">
      <legend>Can't win awards</legend>
      {#each positionList as [pos, count] (pos)}
        <label class="tog"><input type="checkbox" checked={excluded.includes(pos)} onchange={(e) => toggleExcluded(pos, e.currentTarget.checked)} /> <span>{pos} <small>({count})</small></span></label>
      {/each}
      <label class="fld ids"><span>Players by ID</span>
        <input bind:value={idsText} onchange={readIds} placeholder="e.g. 1234567, 2345678 or Name [1234567]" /></label>
      {#if excludedIds.length}
        <p class="note">Skipping {excludedIds.map((id) => (byId[id]?.name ? `${byId[id].name} [${id}]` : `[${id}]`)).join(', ')}.</p>
      {/if}
      <p class="note">Ticked positions and listed players are skipped when winners are picked. Leadership can still choose them by hand.</p>
    </fieldset>
    <div class="tbl-scroll"><table class="ed awards">
      <thead><tr><th>Goes to</th><th>Item</th><th class="num">Qty</th><th class="num">Value each</th><th class="num">Total</th><th>Winner</th><th><span class="sr">Remove</span></th></tr></thead>
      <tbody>
        {#each awards as a, i}
          {@const w = winnerOf(a)}
          <tr>
            <td class="rule">
              <select aria-label="Award {i + 1} rule" bind:value={a.rule}>{#each AWARD_RULES as [id, label]}<option value={id}>{label}</option>{/each}</select>
              {#if a.rule === 'score' || a.rule === 'newScore'}
                <label class="inl">score above <input class="qty" type="number" min="0" bind:value={a.min} /></label>
              {/if}
              {#if a.rule === 'newScore'}
                <label class="inl">account under <input class="qty" type="number" min="1" bind:value={a.maxAge} /> days</label>
              {/if}
              {#if a.rule === 'manual'}
                <input aria-label="Award {i + 1} reason" bind:value={a.reason} maxlength="160" placeholder="for exemplary teamwork" />
              {/if}
            </td>
            <td><input aria-label="Award {i + 1} item" list="award-items" bind:value={a.item} onchange={() => priceFromCatalog(a)} /></td>
            <td class="num"><input class="qty" type="number" min="0" aria-label="{a.item} quantity" bind:value={a.qty} /></td>
            <td class="num"><input class="amt" type="number" min="0" step="1000" aria-label="{a.item} value each" bind:value={a.price} /></td>
            <td class="num mono">{money(n(a.qty) * n(a.price))}</td>
            <td class="winner">
              <select aria-label="Award {i + 1} winner" bind:value={a.winner}>
                <option value={null}>{a.rule === 'manual' ? 'Choose a member…' : `Auto: ${w && a.winner == null ? w.name ?? `[${w.id}]` : 'no one qualifies'}`}</option>
                {#each members as m (m.id)}<option value={m.id}>{m.name ?? `[${m.id}]`}</option>{/each}
              </select>
              {#if a.rule === 'newScore' && a.winner == null && agesMissing}
                <small>Look up account ages to find this winner.</small>
              {:else if w}
                <small>{why(a, w)}</small>
              {/if}
            </td>
            <td><button class="x" aria-label="Remove award {i + 1}" onclick={() => awards.splice(i, 1)}>×</button></td>
          </tr>
        {/each}
      </tbody>
      <tfoot><tr><td><button class="chip" onclick={() => awards.push({ rule: 'manual', min: 0, maxAge: 150, reason: '', item: 'Donator Pack', qty: 1, price: 0, winner: null })}>+ Add an award</button></td><td></td><td></td><th class="num">Awards total</th><td class="num mono"><b>{money(awardsTotal)}</b></td><td colspan="2"></td></tr></tfoot>
    </table></div>
    <datalist id="award-items">{#each catalog as it (it.id)}<option value={it.name}></option>{/each}</datalist>
    {#if 'chains' in report && awards.some((a) => a.rule === 'abroad')}
      <p class="note">This report uses chain data, so "abroad" counts every overseas hit made during a chain, not only war hits. A key with faction API access counts war hits abroad exactly.</p>
    {/if}
    <div class="row">
      <label class="tog"><input type="checkbox" bind:checked={awardsFromProfit} /> <span>Pay for awards out of the war's profit</span></label>
      <button class="btn-c" onclick={copyAwards}>Copy award lines</button>
    </div>
    <pre class="lines" aria-label="Award lines preview">{awards.map(awardLine).join('\n')}</pre>
  </div>

  <!-- TIER -->
  <div class="block card">
    <div class="bh"><h3>Payout tier</h3></div>
    <div class="tierrow">
      <label class="fld"><span>Tier</span><select bind:value={tierName}>{#each tiers as t}<option value={t[0]}>{t[0]} ({t[1]}% win · {t[2]}% loss)</option>{/each}</select></label>
      <label class="fld"><span>War result</span><select bind:value={outcome}><option value="win">Win</option><option value="loss">Loss</option></select></label>
      <label class="tog"><input type="checkbox" bind:checked={extra} /> <span>Discretionary bonus</span></label>
      {#if extra}<label class="fld small"><span>Bonus %</span><input type="number" min="0" max="100" bind:value={extraPct} /></label>{/if}
    </div>
    <p class="note">Members share <b>{pct}%</b> of the total made: {money(res.pool)}.</p>
    <details>
      <summary>Edit tiers</summary>
      <table class="ed tiers"><thead><tr><th>Tier</th><th class="num">Win %</th><th class="num">Loss %</th></tr></thead>
        <tbody>{#each tiers as t}<tr><td><input aria-label="Tier name" bind:value={t[0]} /></td><td class="num"><input class="qty" type="number" min="0" max="100" aria-label="{t[0]} win %" bind:value={t[1]} /></td><td class="num"><input class="qty" type="number" min="0" max="100" aria-label="{t[0]} loss %" bind:value={t[2]} /></td></tr>{/each}</tbody>
      </table>
    </details>
    <details>
      <summary>Point rules</summary>
      <div class="rules-grid">
        <label class="fld"><span>War hit respect counts (%)</span><input type="number" min="0" bind:value={rules.warPct} /></label>
        <label class="tog"><input type="checkbox" bind:checked={rules.reallocate} /> <span>Share chain bonuses by participation</span></label>
        <label class="fld"><span>Chain bonus counts (%)</span><input type="number" min="0" bind:value={rules.bonusPct} disabled={!rules.reallocate} /></label>
        <label class="fld"><span>Points per out-of-war hit</span><input type="number" min="0" step="0.1" bind:value={rules.oow} /></label>
        <label class="fld"><span>Points per assist</span><input type="number" min="0" step="0.1" bind:value={rules.assist} /></label>
        <label class="fld"><span>Only in chains of more than (hits)</span><input type="number" min="0" bind:value={rules.minChain} /></label>
      </div>
      <button class="chip" onclick={() => { rules = { ...DEFAULT_RULES }; tiers = structuredClone(DEFAULT_TIERS); }}>Reset tiers and rules</button>
    </details>
  </div>

  <!-- SUMMARY -->
  <div class="sum">
    <div class="tile"><span>Total made</span><b class="mono">{money(totalMade)}</b></div>
    <div class="tile"><span>Splits</span><b class="mono">{money(splitsSpent)}</b><small>{pctOf(splitsSpent, totalMade)}</small></div>
    <div class="tile"><span>Special awards</span><b class="mono">{money(awardsTotal)}</b><small>{awardsFromProfit ? 'paid from profit' : 'paid separately'}</small></div>
    <div class="tile"><span>Member pool</span><b class="mono">{money(res.pool)}</b><small>{pct}% of total made</small></div>
    <div class="tile"><span>Faction keeps</span><b class="mono">{money(res.keeps)}</b><small>{awardsFromProfit ? 'after splits, awards, pool' : 'after splits and pool'}</small></div>
    <div class="tile"><span>Net RP</span><b class="mono">{res.netRP.toFixed(2)}</b></div>
    <div class="tile"><span>Pay per point</span><b class="mono">{money(res.perPoint)}</b></div>
    <div class="tile"><span>Pay per hit</span><b class="mono">{money(res.perHit)}</b><small>average</small></div>
    <div class="tile"><span>Check sum</span><b class="mono">{money(res.check)}</b><small>pool minus payouts</small></div>
  </div>
  {#if res.keeps < 0}
    <p class="warn" role="alert">The member pool is {money(-res.keeps)} more than what's left after the splits. Lower the splits, the awards or the tier.</p>
  {/if}
  {#if !report.official}
    <p class="warn">Payouts use Torn's official war report, which only exists once the war ends. Until then these numbers use chain data and will change.</p>
  {/if}

  <!-- PAYOUT TABLE -->
  <div class="tbl-scroll"><table class="wr">
    <thead><tr>
      <th aria-sort={sortKey === 'name' ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}><button onclick={() => sortBy('name')}>Member</button></th>
      {#each COLS as [k, l]}<th class="num" aria-sort={sortKey === k ? (sortDir > 0 ? 'ascending' : 'descending') : 'none'}><button onclick={() => sortBy(k)}>{l}{sortKey === k ? (sortDir > 0 ? ' ↑' : ' ↓') : ''}</button></th>{/each}
    </tr></thead>
    <tbody>
      {#each sorted as p (p.id)}
        <tr><td>{p.name ?? `[${p.id}]`}</td>{#each COLS as [k]}<td class="num mono" class:paycell={k === 'pay'}>{fmt(k, p[k])}</td>{/each}</tr>
      {/each}
    </tbody>
  </table></div>
  <div class="row">
    <button class="btn-c" onclick={() => copy('discord')}>Copy for Discord</button>
    <button class="btn-c" onclick={() => copy('torn')}>Copy for Torn</button>
    <button class="btn-c" onclick={() => copy('csv')}>Copy as CSV</button>
    <span class="note" aria-live="polite">{copied}</span>
  </div>
  <div class="block card share">
    <div class="bh"><h3>Share the final report</h3><button class="btn-i" onclick={makeShareLink}>Make a share link</button></div>
    <p class="note">Packs the payouts, awards, rewards and splits into one link anyone can open: no key needed, nothing to install. The report lives inside the link itself and is never uploaded, so only people you give it to can see it.</p>
    {#if shareUrl}
      <label class="fld"><span>Share link</span><input class="link" readonly value={shareUrl} onfocus={(e) => e.currentTarget.select()} /></label>
      <div class="row">
        <button class="btn-c" onclick={() => copyShare('link')}>Copy link</button>
        <button class="btn-c" onclick={() => copyShare('code')}>Copy code only</button>
        <a class="btn-c" href={shareUrl} target="_blank" rel="noopener">Open it</a>
      </div>
    {/if}
    {#if shareMsg}<p class="note" aria-live="polite">{shareMsg}</p>{/if}
  </div>

  <p class="note">RP = war respect (minus chain bonuses you landed) + your share of each chain's bonuses by hits in that chain + {rules.oow} per out-of-war hit + {rules.assist} per assist, the last two only in chains of more than {rules.minChain} hits. Payout = pool × your RP ÷ net RP, so the payouts always add up to the pool.</p>
</div>

<style>
  .pc{margin-top:2.4rem}
  .pc h2{margin-bottom:.2rem}
  .block,.setups{margin-top:1rem;border-radius:3px}
  .setrow{display:flex;flex-wrap:wrap;gap:.5rem;align-items:flex-end;margin-top:.5rem}
  .setrow .fld select{min-width:14rem}
  .grow{flex:1 1 14rem}
  .grow input{width:100%}
  .file{position:relative;overflow:hidden}
  .file input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .file:focus-within{outline:2px solid var(--amber);outline-offset:2px}
  .danger{border-color:var(--crime-ink)!important;color:var(--crime-ink)}
  .bh{display:flex;flex-wrap:wrap;gap:.6rem 1rem;align-items:center;justify-content:space-between;margin-bottom:.6rem}
  .bh h3{margin:0}
  table.ed{min-width:0;width:100%}
  table.ed td,table.ed th{padding:.35rem .5rem;vertical-align:middle}
  table.ed input:not([type="checkbox"]){font:inherit;font-size:.9rem;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.3rem .45rem;width:100%;min-width:7rem}
  table.ed input.qty{min-width:4rem;max-width:6rem;text-align:end}
  table.ed input.amt{min-width:9rem;text-align:end}
  table.ed tfoot th{text-align:end;color:var(--muted);font-weight:600}
  table.tiers{max-width:26rem;margin:.6rem 0}
  .x{font:inherit;font-size:1.1rem;line-height:1;background:none;border:1px solid transparent;border-radius:3px;color:var(--muted);cursor:pointer;padding:.15rem .45rem}
  .x:hover{color:var(--crime-ink);border-color:var(--border)}
  .tierrow{display:flex;flex-wrap:wrap;gap:.8rem 1.2rem;align-items:flex-end}
  .fld{display:grid;gap:.25rem;font-size:.88rem;color:var(--muted)}
  .fld input,.fld select{font:inherit;font-size:.92rem;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.4rem .55rem;min-width:0}
  .fld.small input{width:5rem}
  .tog{display:flex;gap:.5rem;align-items:center;font-size:.9rem;color:var(--ink);cursor:pointer;padding-bottom:.4rem}
  .tog input{accent-color:var(--amber);width:1rem;height:1rem}
  details{margin-top:.8rem}
  summary{cursor:pointer;color:var(--amber);font-size:.92rem}
  .rules-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:.7rem 1rem;margin:.7rem 0}
  .sum{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5rem,1fr));gap:.6rem;margin:1.2rem 0 1rem}
  .sum .tile{display:flex;flex-direction:column;gap:.1rem;border-radius:3px}
  .sum span{font-family:"IBM Plex Mono",monospace;font-size:.68rem;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
  .sum b{font-family:"Oswald",sans-serif;font-size:1.35rem;font-weight:600}
  .sum small{color:var(--muted);font-size:.8rem}
  .warn{padding:.6rem .9rem;border:1px solid var(--amber);border-radius:3px;background:var(--amber-soft);max-width:none}
  td.paycell{color:var(--amber);font-weight:600}
  .row{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-top:.8rem}
  .note{color:var(--muted);font-size:.88rem;margin:.3rem 0 0}
  .btn-c{font:inherit;font-size:.9rem;border-radius:3px;padding:.4rem .85rem;cursor:pointer;background:var(--surface);border:1px solid var(--border);color:var(--ink)}
  .btn-c:hover{border-color:var(--amber)}
  .btn-c:disabled{opacity:.5;cursor:default}
  table.wr th button{font:inherit;font-weight:600;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-transform:inherit;letter-spacing:inherit}
  .num{text-align:end;white-space:nowrap}
  .share{display:grid;gap:.6rem}
  .share .bh{margin-bottom:0}
  .link{font-family:"IBM Plex Mono",monospace;font-size:.8rem!important}
  a.btn-c{text-decoration:none;display:inline-block}
  .btn-i{font:inherit;font-size:.9rem;border-radius:3px;padding:.4rem .85rem;cursor:pointer;background:var(--amber);border:1px solid var(--amber);color:#111;font-weight:600}
  .excl{display:flex;flex-wrap:wrap;gap:.2rem 1.2rem;align-items:center;border:1px solid var(--border);border-radius:3px;padding:.5rem .9rem .6rem;margin:.6rem 0 .8rem}
  .excl legend{font-size:.85rem;color:var(--muted);padding:0 .3rem}
  .excl .tog{padding-bottom:0}
  .excl small{color:var(--muted)}
  .excl .note{flex-basis:100%}
  .excl .ids{flex-basis:100%;margin-top:.3rem}
  table.awards td{vertical-align:top}
  table.awards select{font:inherit;font-size:.9rem;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.3rem .4rem;width:100%;min-width:11rem}
  .rule{display:grid;gap:.35rem;min-width:13rem}
  .inl{display:flex;gap:.4rem;align-items:center;font-size:.85rem;color:var(--muted);white-space:nowrap}
  .winner{min-width:12rem}
  .winner small{display:block;color:var(--muted);font-size:.8rem;margin-top:.25rem}
  .lines{font-family:"IBM Plex Mono",monospace;font-size:.82rem;white-space:pre-wrap;background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.6rem .8rem;margin:.6rem 0 0;color:var(--ink)}
  .tbl-scroll{position:relative}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
</style>
