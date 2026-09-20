<script>
  import CrimeData from '$lib/CrimeData.svelte';
  import data from '$lib/data/forgery.json';
</script>

<CrimeData
  title="Forgery"
  subtitle="Materials (and where to find them) plus each project's material requirements."
  tabs={data.tabs}
  author="Emforus [2535044]" />
