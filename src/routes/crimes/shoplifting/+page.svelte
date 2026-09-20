<script>
  import CrimeData from '$lib/CrimeData.svelte';
  import data from '$lib/data/shoplifting.json';
</script>

<CrimeData
  title="Shoplifting"
  subtitle="Per-shop droptables, unique outcomes and the ammo breakdown. Each shop is its own sortable/filterable table — search an item to see where it drops."
  tabs={data.tabs}
  author="Emforus [2535044]" />
