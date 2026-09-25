<script>
  // Shows a script's live source from Greasy Fork (or GitHub) so players can check it before installing.
  let { script = null, onclose } = $props();

  let dialog;
  let status = $state('idle'); // idle | loading | ready | error
  let code = $state('');
  let q = $state('');

  // Quick searches for the things our review looked at.
  const PRESETS = [
    ['Network calls', /fetch\s*\(|XMLHttpRequest|GM_xmlhttpRequest|GM\.xmlHttpRequest|\$\.(ajax|get|post)\s*\(|sendBeacon|WebSocket\(/],
    ['API key', /api[_ ]?key|apikey|[?&]key=|X-Torn-Api-Key/i],
    ['Clicks', /\.click\s*\(\s*\)|dispatchEvent\s*\(|\.submit\s*\(/],
    ['Timers', /setInterval\s*\(|setTimeout\s*\(/]
  ];
  let preset = $state(null);

  $effect(() => {
    if (!script) return;
    q = ''; preset = null; code = ''; status = 'loading';
    dialog?.showModal();
    const url = script.install;
    fetch(url).then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => { if (script?.install === url) { code = text; status = 'ready'; } })
      .catch(() => { if (script?.install === url) status = 'error'; });
  });

  const lines = $derived(code ? code.split('\n') : []);
  const header = $derived(code.match(/==UserScript==([\s\S]*?)==\/UserScript==/)?.[1] ?? '');
  const tag = (name) => [...header.matchAll(new RegExp('@' + name + '\\s+(.+)', 'g'))].map((m) => m[1].trim());
  const version = $derived(tag('version')[0] ?? '');
  // Every site the script names, declared or not: a quick answer to "where can this send data?"
  const IGNORE = /^(www\.)?(w3\.org|schema\.org|example\.com)$/;
  const reaches = $derived([...new Set([
    ...tag('connect'),
    ...[...code.matchAll(/https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/gi)].map((m) => m[1].toLowerCase())
  ])].filter((h) => h !== '*' && !IGNORE.test(h)).sort());
  const changed = $derived(status === 'ready' && script?.reviewed && version && version !== script.reviewed);

  const matcher = $derived(preset ? PRESETS.find(([n]) => n === preset)[1] : q.trim().length > 1 ? q.trim().toLowerCase() : null);
  const hits = $derived.by(() => {
    if (!matcher) return [];
    const out = [];
    lines.forEach((l, i) => {
      const hit = typeof matcher === 'string' ? l.toLowerCase().includes(matcher) : matcher.test(l);
      if (hit) out.push([i + 1, l.length > 220 ? l.slice(0, 220) + ' …' : l]);
    });
    return out;
  });
  const gutter = $derived(lines.map((_, i) => i + 1).join('\n'));

  function close() {
    dialog?.close();
  }
</script>

<dialog bind:this={dialog} class="cv" aria-labelledby="cv-title" onclose={() => onclose?.()}>
  {#if script}
    <header>
      <div>
        <h2 id="cv-title">{script.name}</h2>
        <p class="meta">
          {#if status === 'ready'}Version {version || '?'} · {lines.length.toLocaleString('en-US')} lines{:else}Loading the live code…{/if}
          {#if script.reviewed} · we reviewed {script.reviewed}{/if}
        </p>
      </div>
      <button class="x" onclick={close} aria-label="Close">×</button>
    </header>

    {#if changed}
      <p class="warn">This script has been updated since we reviewed it. Our rating may no longer match the code below.</p>
    {/if}

    {#if status === 'error'}
      <p class="warn">Couldn't load the code. Open it on the script's own page instead.</p>
    {:else if status === 'ready'}
      <div class="reach">
        <span class="lbl">Sites named in the code</span>
        {#if reaches.length}{#each reaches as r}<code>{r}</code>{/each}{:else}<em>None</em>{/if}
      </div>
      <div class="tools">
        <input type="search" placeholder="Search the code" bind:value={q} oninput={() => (preset = null)} aria-label="Search the code" />
        {#each PRESETS as [name]}
          <button class="chip" aria-pressed={preset === name} onclick={() => { preset = preset === name ? null : name; q = ''; }}>{name}</button>
        {/each}
      </div>
      {#if matcher}
        <p class="count" aria-live="polite">{hits.length} matching line{hits.length === 1 ? '' : 's'}{hits.length > 400 ? ', showing the first 400' : ''}</p>
        <div class="code"><table class="hits"><tbody>
          {#each hits.slice(0, 400) as [n, l]}<tr><td class="n">{n}</td><td><pre>{l}</pre></td></tr>{/each}
        </tbody></table></div>
      {:else}
        <div class="code full"><pre class="gut" aria-hidden="true">{gutter}</pre><pre class="src">{code}</pre></div>
      {/if}
    {/if}

    <footer>
      {#if script.risk !== 'High'}<a class="btn-i" href={script.install}>Install</a>{/if}
      <a href={script.url} target="_blank" rel="noopener">Open the script's page ↗</a>
      <span class="hint">Shown live from the source, as text; nothing here runs.</span>
    </footer>
  {/if}
</dialog>

<style>
  .cv{width:min(72rem,calc(100vw - 2rem));max-height:calc(100dvh - 2rem);padding:0;border:1px solid var(--border);border-radius:4px;
    background:var(--bg2);color:var(--ink);box-shadow:var(--shadow)}
  .cv[open]{display:flex;flex-direction:column}
  .cv::backdrop{background:rgba(0,0,0,.7)}
  header{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start;padding:1rem 1.2rem .6rem;border-bottom:1px solid var(--border)}
  h2{font-size:1.3rem;margin:0}
  .meta{margin:.2rem 0 0;color:var(--muted);font-size:.85rem}
  .x{font:inherit;font-size:1.6rem;line-height:1;background:none;border:0;color:var(--muted);cursor:pointer;padding:.1rem .4rem}
  .x:hover{color:var(--ink)}
  .warn{margin:.6rem 1.2rem 0;padding:.5rem .8rem;border:1px solid var(--amber);border-radius:3px;background:var(--amber-soft);font-size:.9rem;max-width:none}
  .reach{display:flex;flex-wrap:wrap;gap:.35rem;align-items:center;padding:.7rem 1.2rem 0;font-size:.8rem}
  .reach .lbl{font-family:"IBM Plex Mono",monospace;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-size:.68rem;margin-inline-end:.3rem}
  .reach code{font-family:"IBM Plex Mono",monospace;background:var(--surface);border:1px solid var(--border);border-radius:2px;padding:1px 6px;word-break:break-all}
  .reach em{color:var(--muted)}
  .tools{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;padding:.7rem 1.2rem}
  .tools input{font:inherit;font-size:.9rem;color:var(--ink);background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:.35rem .6rem;flex:1 1 12rem;min-width:0;max-width:18rem}
  .count{margin:0 1.2rem .4rem;color:var(--muted);font-size:.85rem}
  .code{flex:1;min-height:12rem;overflow:auto;margin:0 1.2rem;border:1px solid var(--border);border-radius:3px;background:#0b0b0b}
  .code pre{margin:0;font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:.78rem;line-height:1.5;white-space:pre;color:#d9d4c9}
  .full{display:flex;align-items:flex-start}
  .gut{padding:.6rem .6rem;text-align:end;color:#5c5750;user-select:none;border-inline-end:1px solid var(--border);position:sticky;left:0;background:#0b0b0b}
  .src{padding:.6rem .8rem;flex:1}
  table.hits{border-collapse:collapse;min-width:0;width:100%}
  table.hits td{padding:.15rem .6rem;border-bottom:1px solid #1c1c1c;vertical-align:top}
  table.hits td.n{font-family:"IBM Plex Mono",monospace;font-size:.75rem;color:#5c5750;text-align:end;width:1%;white-space:nowrap}
  footer{display:flex;flex-wrap:wrap;gap:.6rem 1rem;align-items:center;padding:.8rem 1.2rem 1rem;font-size:.9rem;border-top:1px solid var(--border);margin-top:.8rem}
  .hint{color:var(--muted);font-size:.8rem}
  .btn-i{background:var(--amber);color:#111;font-weight:600;text-decoration:none;border-radius:3px;padding:.4rem .8rem}
</style>
