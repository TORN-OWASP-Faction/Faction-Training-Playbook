<script>
  import { base } from '$app/paths';
  import DataTable from '$lib/DataTable.svelte';
  let { title, subtitle = '', tabs = [], author = '' } = $props();
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Crimes 2.0 · data</span>
  <h1>{title}</h1>
  {#if subtitle}<p class="lede">{subtitle}</p>{/if}
  <p style="margin-top:.6rem"><a href="{base}/crimes/">← Back to Crimes</a></p>
</div></header>

{#each tabs as tab}
  <section><div class="wrap">
    <h2>{tab.name}</h2>
    <DataTable columns={tab.columns} rows={tab.rows} caption={tab.name} />
  </div></section>
{/each}

<footer><div class="wrap">
  <strong>{title} data.</strong>
  {#if author}Compiled by <strong>{author}</strong> — linked from the in-depth guide.{/if}
  Part of the <a href="{base}/crimes/">Crimes 2.0 guide</a>. Numbers change as the crime is updated; check the guide/wiki for the latest.
</div></footer>
