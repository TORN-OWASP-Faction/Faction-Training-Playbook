<script>
  import CrimeData from '$lib/CrimeData.svelte';
  import data from '$lib/data/cracking.json';
</script>

<CrimeData
  title="Cracking"
  subtitle="Targets and targeted services — filter by a target to see what it takes."
  tabs={data.tabs}
  author="Emforus [2535044]" />
