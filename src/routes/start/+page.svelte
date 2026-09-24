<script>
  import Start from '$lib/pages/Start.svelte';
  let { data } = $props();
</script>

<Start m={data.m} lang={data.lang} />
