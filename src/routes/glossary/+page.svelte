<script>
  import Glossary from '$lib/pages/Glossary.svelte';
  let { data } = $props();
</script>

<Glossary m={data.m} lang={data.lang} />
