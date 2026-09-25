<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Character from '$lib/Character.svelte';
  import RichEditor from '$lib/RichEditor.svelte';
  import { TEMPLATES, defaults } from '$lib/templates.js';
  import { sanitize, toDiscord, toPlain } from '$lib/richtext.js';
  import { SITE_ORIGIN } from '$lib/meta.js';

  const SITE = SITE_ORIGIN + base;
  const STORE = 'ftp:faction-messages:v1';

  let tplId = $state(TEMPLATES[0].id);
  let values = $state(defaults(TEMPLATES[0]));
  let html = $state('');
  let edited = $state(false); // true once the text has been changed by hand, so knobs stop overwriting it
  let view = $state('edit');
  let status = $state('');

  const tpl = $derived(TEMPLATES.find((t) => t.id === tplId));
  const built = $derived(tpl.render(values, { site: SITE }));
  $effect(() => { if (!edited) html = built; });

  const clean = $derived(html ? sanitize(html) : '');
  const pretty = $derived(clean.replace(/(<\/(p|li|ul|ol|h3|h4)>|<hr>|<br>)/g, '$1\n').replace(/(<ul>|<ol>)/g, '$1\n'));

  function pick(id) {
    const t = TEMPLATES.find((x) => x.id === id);
    tplId = id; values = defaults(t); edited = false; loadedId = null; view = 'edit';
  }

  // ---- copy ----
  async function copy(kind) {
    try {
      if (kind === 'torn') {
        await navigator.clipboard.write([new ClipboardItem({
          'text/html': new Blob([clean], { type: 'text/html' }),
          'text/plain': new Blob([toPlain(clean)], { type: 'text/plain' })
        })]);
      } else {
        await navigator.clipboard.writeText(kind === 'html' ? pretty : toDiscord(clean));
      }
      status = { torn: 'Copied with formatting. Paste it into Torn.', html: 'HTML copied.', discord: 'Copied for Discord.' }[kind];
    } catch {
      status = "Your browser blocked copying. Select the text and copy it yourself.";
    }
  }

  // ---- saved templates (this browser only) ----
  let mine = $state([]);
  let loadedId = $state(null);
  let saveName = $state('');
  let confirmDelete = $state(null);

  function readStore() {
    try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch { return []; }
  }
  function writeStore() {
    try { localStorage.setItem(STORE, JSON.stringify(mine)); return true; }
    catch { status = "Couldn't save: this browser is blocking storage (private window?)."; return false; }
  }
  onMount(() => (mine = readStore()));

  const loaded = $derived(mine.find((m) => m.id === loadedId));

  function save(asNew) {
    const name = (asNew ? saveName : loaded?.name ?? saveName).trim();
    if (!name) { status = 'Give it a name first.'; return; }
    const item = { id: asNew || !loaded ? crypto.randomUUID() : loaded.id, name, tpl: tplId, values: $state.snapshot(values), html: clean, edited, updated: new Date().toISOString() };
    mine = [item, ...mine.filter((m) => m.id !== item.id)];
    if (writeStore()) { loadedId = item.id; saveName = ''; status = `Saved "${name}" in this browser.`; }
  }

  function load(item) {
    const t = TEMPLATES.find((x) => x.id === item.tpl) ?? TEMPLATES[0];
    tplId = t.id;
    values = { ...defaults(t), ...item.values };
    edited = item.edited;
    html = item.edited ? sanitize(item.html) : t.render(values, { site: SITE });
    loadedId = item.id; view = 'edit'; confirmDelete = null;
    status = `Loaded "${item.name}".`;
  }

  function remove(id) {
    mine = mine.filter((m) => m.id !== id);
    writeStore();
    if (loadedId === id) loadedId = null;
    confirmDelete = null;
    status = 'Deleted.';
  }

  function exportAll() {
    const blob = new Blob([JSON.stringify({ app: 'faction-training-playbook', version: 1, templates: mine }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'faction-messages.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Imported files could come from anyone: keep only known fields and clean the HTML.
  async function importFile(e) {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = '';
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      const list = (Array.isArray(data) ? data : data.templates ?? []).filter((m) => m && typeof m.name === 'string');
      const known = new Set(TEMPLATES.map((t) => t.id));
      const added = list.map((m) => ({
        id: crypto.randomUUID(),
        name: String(m.name).slice(0, 80),
        tpl: known.has(m.tpl) ? m.tpl : TEMPLATES[0].id,
        values: m.values && typeof m.values === 'object' ? JSON.parse(JSON.stringify(m.values)) : {},
        html: sanitize(String(m.html ?? '')),
        edited: !!m.edited,
        updated: new Date().toISOString()
      }));
      mine = [...added, ...mine];
      writeStore();
      status = `Imported ${added.length} template${added.length === 1 ? '' : 's'}.`;
    } catch {
      status = "That file isn't a faction messages export.";
    }
  }
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">For faction leaders</span>
  <h1>Faction <em>messages</em></h1>
  <p class="lede">War rules, reminders and event notices, ready to paste into your faction announcement or Discord. Pick a template, set the knobs, polish the wording, copy.</p>
  <Character variant="militia" name="Rook" tag="Faction Intel" initial="R" img="militia.png">
    "A war is won the day before it starts. Put the rules where everyone can see them, in words nobody can argue with."
  </Character>
</div></header>

<section id="build"><div class="wrap">
  <div class="picker" role="group" aria-label="Templates">
    {#each TEMPLATES as t}
      <button class="tpl" aria-pressed={tplId === t.id && !loadedId} onclick={() => pick(t.id)}>
        <b>{t.name}</b><small>{t.blurb}</small>
      </button>
    {/each}
  </div>

  <div class="work">
    <form class="knobs card" onsubmit={(e) => e.preventDefault()} aria-label="Template settings">
      <h2 class="h3">{tpl.name}</h2>
      {#each tpl.fields as f (tplId + f.key)}
        {#if f.type === 'toggle'}
          <label class="tog"><input type="checkbox" bind:checked={values[f.key]} /> <span>{f.label}</span></label>
        {:else if f.type === 'select'}
          <label class="fld"><span>{f.label}</span>
            <select bind:value={values[f.key]}>{#each f.options as [v, l]}<option value={v}>{l}</option>{/each}</select></label>
        {:else if f.type === 'textarea'}
          <label class="fld"><span>{f.label}</span><textarea rows="3" bind:value={values[f.key]}></textarea></label>
        {:else if f.type === 'number'}
          <label class="fld"><span>{f.label}</span><input type="number" min="0" bind:value={values[f.key]} /></label>
        {:else}
          <label class="fld"><span>{f.label}</span><input type={f.type} bind:value={values[f.key]} /></label>
        {/if}
      {/each}
    </form>

    <div class="out">
      {#if edited}
        <p class="warn">You've edited the text, so the settings on the left won't change it now.
          <button class="chip" onclick={() => (edited = false)}>Rebuild from settings</button></p>
      {/if}
      <div class="tabs" role="tablist" aria-label="View">
        {#each [['edit', 'Editor'], ['html', 'HTML'], ['discord', 'Discord']] as [id, name]}
          <button role="tab" aria-selected={view === id} class:on={view === id} onclick={() => (view = id)}>{name}</button>
        {/each}
      </div>
      <div hidden={view !== 'edit'}><RichEditor bind:html oninput={() => (edited = true)} label="{tpl.name} message" /></div>
      {#if view === 'html'}<pre class="raw">{pretty}</pre>{/if}
      {#if view === 'discord'}<pre class="raw">{toDiscord(clean)}</pre>{/if}

      <div class="actions">
        <button class="btn-i" onclick={() => copy('torn')}>Copy for Torn</button>
        <button class="btn-c" onclick={() => copy('html')}>Copy HTML</button>
        <button class="btn-c" onclick={() => copy('discord')}>Copy for Discord</button>
      </div>
      <p class="status" aria-live="polite">{status}</p>

      <div class="save card">
        <h2 class="h3">Save to this browser</h2>
        <p class="note">Saved templates never leave your device: no account, no server. Clearing your browser data deletes them, so export a backup.</p>
        <div class="saverow">
          {#if loaded}
            <button class="btn-c" onclick={() => save(false)}>Save changes to "{loaded.name}"</button>
          {/if}
          <label class="fld inline"><span class="sr">Name</span><input placeholder="Name, e.g. War vs Rival" bind:value={saveName} maxlength="80" /></label>
          <button class="btn-c" onclick={() => save(true)}>Save as new</button>
        </div>
        {#if mine.length}
          <ul class="mine">
            {#each mine as m (m.id)}
              <li class:cur={m.id === loadedId}>
                <span><b>{m.name}</b><small>{TEMPLATES.find((t) => t.id === m.tpl)?.name} · {new Date(m.updated).toLocaleDateString()}</small></span>
                <span class="mact">
                  <button class="chip" onclick={() => load(m)}>Open</button>
                  {#if confirmDelete === m.id}
                    <button class="chip danger" onclick={() => remove(m.id)}>Delete for good</button>
                    <button class="chip" onclick={() => (confirmDelete = null)}>Keep</button>
                  {:else}
                    <button class="chip" onclick={() => (confirmDelete = m.id)}>Delete</button>
                  {/if}
                </span>
              </li>
            {/each}
          </ul>
        {/if}
        <div class="saverow">
          <button class="btn-c" onclick={exportAll} disabled={!mine.length}>Export all</button>
          <label class="btn-c file">Import<input type="file" accept="application/json,.json" onchange={importFile} /></label>
        </div>
      </div>
    </div>
  </div>
</div></section>

<section id="tips"><div class="wrap">
  <span class="eyebrow">Before you post</span>
  <h2>Posting tips</h2>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">T</span><div><b>Torn:</b> "Copy for Torn" keeps the formatting when you paste into the faction announcement editor. If an editor only takes code, use "Copy HTML".</div></li>
      <li><span class="k">D</span><div><b>Discord:</b> "Copy for Discord" turns bold, lists and links into Discord formatting. Colours don't carry over.</div></li>
      <li><span class="k">⏱</span><div>Times are in TCT (Torn time, same as UTC), so members in every time zone read the same time.</div></li>
      <li><span class="k">✓</span><div>Post it once, then pin or link it rather than repeating it in chat.</div></li>
    </ul>
  </div>
</div></section>

<section id="raw"><div class="wrap">
  <span class="eyebrow">No tool needed</span>
  <h2>Raw templates</h2>
  <p class="lede">The same templates as plain HTML with [placeholders], for copying straight into your own editor.</p>
  <ul class="rawlist">
    {#each TEMPLATES as t}<li><a href="{base}/templates/{t.id}.txt" target="_blank" rel="noopener">{t.name}</a> <small>{t.id}.txt</small></li>{/each}
  </ul>
</div></section>

<footer><div class="wrap">
  <strong>Faction messages.</strong> Templates written for our faction; event dates come from our <a href="{base}/events/">Events calendar</a>. Everything you save stays in your own browser. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .picker{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:.6rem}
  .tpl{font:inherit;text-align:start;display:flex;flex-direction:column;gap:.2rem;padding:.8rem .9rem;border:1px solid var(--border);border-radius:3px;background:var(--surface);color:var(--ink);cursor:pointer}
  .tpl small{color:var(--muted);font-size:.8rem;line-height:1.35}
  .tpl:hover{border-color:color-mix(in srgb,var(--amber) 55%,var(--border))}
  .tpl[aria-pressed="true"]{border-color:var(--amber);background:var(--amber-soft)}
  .work{display:grid;grid-template-columns:minmax(0,22rem) minmax(0,1fr);gap:1.2rem;margin-top:1.2rem;align-items:start}
  .knobs{display:grid;gap:.7rem;border-radius:3px;position:sticky;top:4.2rem;max-height:calc(100dvh - 5rem);overflow:auto}
  .fld{display:grid;gap:.25rem;font-size:.88rem;color:var(--muted)}
  .fld input,.fld select,.fld textarea{font:inherit;font-size:.92rem;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.4rem .55rem;min-width:0;width:100%}
  .fld textarea{resize:vertical}
  .tog{display:flex;gap:.5rem;align-items:flex-start;font-size:.9rem;color:var(--ink);cursor:pointer}
  .tog input{margin-top:.25rem;accent-color:var(--amber);width:1rem;height:1rem;flex:none}
  .tabs{display:flex;gap:.2rem;border-bottom:1px solid var(--border);margin-bottom:.6rem}
  .tabs button{font:inherit;font-size:.9rem;background:none;border:0;border-bottom:2px solid transparent;color:var(--muted);padding:.45rem .8rem;cursor:pointer;margin-bottom:-1px}
  .tabs button.on{color:var(--ink);border-bottom-color:var(--amber)}
  .raw{margin:0;min-height:22rem;max-height:70vh;overflow:auto;padding:1rem;border:1px solid var(--border);border-radius:3px;background:#0b0b0b;color:#d9d4c9;
    font-family:"IBM Plex Mono",monospace;font-size:.8rem;white-space:pre-wrap;word-break:break-word}
  .actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.8rem}
  .btn-i,.btn-c{font:inherit;font-size:.9rem;border-radius:3px;padding:.45rem .9rem;cursor:pointer}
  .btn-i{background:var(--amber);border:1px solid var(--amber);color:#111;font-weight:600}
  .btn-c{background:var(--surface);border:1px solid var(--border);color:var(--ink)}
  .btn-c:hover{border-color:var(--amber)}
  .btn-c:disabled{opacity:.5;cursor:default}
  .file{position:relative;overflow:hidden}
  .file input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .file:focus-within{outline:2px solid var(--amber);outline-offset:2px}
  .status{min-height:1.4em;margin:.5rem 0 0;color:var(--muted);font-size:.9rem}
  .warn{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:0 0 .6rem;padding:.5rem .8rem;border:1px solid var(--amber);border-radius:3px;background:var(--amber-soft);font-size:.9rem;max-width:none}
  .save{margin-top:1rem;border-radius:3px}
  .save .note{color:var(--muted);font-size:.88rem;margin:.2rem 0 .7rem}
  .saverow{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin-top:.5rem}
  .inline{display:block;flex:1 1 12rem}
  .mine{list-style:none;margin:.8rem 0 0;padding:0;border:1px solid var(--border);border-radius:3px}
  .mine li{display:flex;flex-wrap:wrap;justify-content:space-between;gap:.5rem;align-items:center;padding:.55rem .7rem;border-bottom:1px solid var(--border)}
  .mine li:last-child{border-bottom:0}
  .mine li.cur{background:var(--amber-soft)}
  .mine small{display:block;color:var(--muted);font-size:.8rem}
  .mact{display:flex;gap:.3rem}
  .danger{border-color:var(--crime-ink)!important;color:var(--crime-ink)}
  .rawlist{list-style:none;margin:1rem 0 0;padding:0;display:grid;gap:.4rem}
  .rawlist small{color:var(--muted);font-family:"IBM Plex Mono",monospace;margin-inline-start:.4rem}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  @media(max-width:900px){.work{grid-template-columns:1fr}.knobs{position:static;max-height:none}}
</style>
