<script>
  import { base } from '$app/paths';
  import { itemId } from '$lib/data/items.js';

  // A Torn item's picture next to its name. `icon` shows only the picture (its name becomes the alt text and tooltip).
  // `label` changes the text shown without changing which item's picture is used.
  let { name, label = name, icon = false } = $props();
  const id = $derived(itemId(name));
</script>

{#if id && icon}
  <img class="item-icon" src="{base}/assets/items/{id}.webp" alt={name} title={name} width="50" height="25" loading="lazy" decoding="async" />
{:else if id}
  <span class="itm"><img src="{base}/assets/items/{id}.webp" alt="" width="50" height="25" loading="lazy" decoding="async" />{label}</span>
{:else}{label}{/if}

<style>
  .itm{display:inline-flex;align-items:center;gap:.4em;vertical-align:middle}
  .itm img,.item-icon{width:50px;height:25px;object-fit:contain;flex:none;vertical-align:middle}
</style>
