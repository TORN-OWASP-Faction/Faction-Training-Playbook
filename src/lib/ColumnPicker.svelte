<script>
  // A "Columns" menu with a tick box per column. The hidden list is saved in this browser under storeKey.
  import { onMount } from 'svelte';

  let { columns, hidden = $bindable([]), storeKey } = $props();

  onMount(() => {
    try { hidden = JSON.parse(localStorage.getItem(storeKey) || '[]'); } catch { hidden = []; }
  });

  function toggle(key, shown) {
    hidden = shown ? hidden.filter((k) => k !== key) : [...hidden, key];
    try { localStorage.setItem(storeKey, JSON.stringify(hidden)); } catch { /* private window: lasts this visit */ }
  }
  function showAll() {
    hidden = [];
    try { localStorage.removeItem(storeKey); } catch { /* ignore */ }
  }
</script>

<details class="cp">
  <summary>Columns{hidden.length ? ` (${hidden.length} hidden)` : ''}</summary>
  <div class="menu">
    {#each columns as [key, label]}
      <label><input type="checkbox" checked={!hidden.includes(key)} onchange={(e) => toggle(key, e.currentTarget.checked)} /> {label}</label>
    {/each}
    {#if hidden.length}<button class="all" onclick={showAll}>Show all</button>{/if}
  </div>
</details>

<style>
  .cp{position:relative;display:inline-block}
  summary{cursor:pointer;list-style:none;font-size:.82rem;color:var(--ink);background:var(--raised);border:1px solid var(--border);
    border-radius:3px;padding:.35rem .7rem;user-select:none}
  summary::-webkit-details-marker{display:none}
  summary::after{content:' ▾';color:var(--faint)}
  .cp[open] summary{border-color:var(--amber)}
  .menu{position:absolute;z-index:30;top:calc(100% + .3rem);inset-inline-end:0;min-width:13rem;max-height:60vh;overflow-y:auto;
    background:var(--surface);border:1px solid var(--border);border-radius:3px;box-shadow:var(--shadow);padding:.4rem;display:grid}
  label{display:flex;align-items:center;gap:.5rem;font-size:.86rem;color:var(--ink);padding:.3rem .4rem;border-radius:2px;cursor:pointer;white-space:nowrap}
  label:hover{background:var(--raised)}
  input{accent-color:var(--amber)}
  .all{font:inherit;font-size:.82rem;color:var(--amber);background:none;border:0;border-top:1px solid var(--border);
    margin-top:.3rem;padding:.45rem .4rem .2rem;text-align:start;cursor:pointer}
</style>
