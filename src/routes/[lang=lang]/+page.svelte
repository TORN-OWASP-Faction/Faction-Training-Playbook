<script>
  import Home from '$lib/pages/Home.svelte';
  let { data } = $props();
</script>

<Home m={data.m} lang={data.lang} />
