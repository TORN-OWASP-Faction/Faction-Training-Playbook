<script>
  let { items = [], accent = 'var(--amber)' } = $props();
  let active = $state(0);
</script>

<div class="tabs" style="--acc:{accent}">
  <div class="tablist" role="tablist">
    {#each items as it, i}
      <button
        role="tab"
        class="tab"
        class:active={i === active}
        aria-selected={i === active}
        onclick={() => (active = i)}
      >
        <span class="tl">{it.label}</span>
        {#if it.note}<span class="tn">{it.note}</span>{/if}
      </button>
    {/each}
  </div>

  <div class="panel" role="tabpanel">
    <table class="kv">
      <tbody>
        {#each items[active].rows as [k, v]}
          <tr><th>{k}</th><td>{v}</td></tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .tabs{margin-top:1.2rem}
  .tablist{display:flex;gap:.4rem;overflow-x:auto;border-bottom:1px solid var(--border);
    scrollbar-width:none;-ms-overflow-style:none}
  .tablist::-webkit-scrollbar{display:none}
  .tab{font:inherit;cursor:pointer;background:none;border:0;border-bottom:2px solid transparent;
    padding:.55rem .9rem .6rem;display:flex;flex-direction:column;gap:.1rem;white-space:nowrap;color:var(--muted);margin-bottom:-1px}
  .tab .tl{font-family:"Oswald",sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:.95rem}
  .tab .tn{font-family:"IBM Plex Mono",monospace;font-size:.68rem;color:var(--faint)}
  .tab:hover{color:var(--ink)}
  .tab.active{color:var(--ink);border-bottom-color:var(--acc)}
  .tab.active .tn{color:var(--acc)}
  .panel{background:var(--surface);border:1px solid var(--border);border-top:0;border-radius:0 0 3px 3px;padding:.3rem 1.1rem}
  table.kv{border-collapse:collapse;width:100%;min-width:0}
  .kv th{text-align:left;vertical-align:top;color:var(--faint);font-family:"IBM Plex Mono",monospace;
    font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;font-weight:600;
    padding:.7rem 1.2rem .7rem 0;white-space:nowrap;width:1%;border-bottom:1px solid var(--border)}
  .kv td{padding:.7rem 0;color:var(--ink);font-size:.95rem;border-bottom:1px solid var(--border)}
  .kv tr:last-child th,.kv tr:last-child td{border-bottom:0}
</style>
