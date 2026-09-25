<script>
  import { base } from '$app/paths';
  let { variant = 'fixer', name, tag = '', initial = '', img = '', children } = $props();
</script>

<div class="say {variant}">
  <div class="av">
    <span class="mono-badge">{initial}</span>
    {#if img}<img src="{base}/assets/{img.replace(/\.png$/, '-sm.webp')}" alt="" width="48" height="72" loading="lazy" onerror={(e) => e.target.remove()} />{/if}
  </div>
  <div class="body">
    <div class="hd"><span class="nm">{name}</span>{#if tag}<span class="tag">{tag}</span>{/if}</div>
    <p class="line">{@render children()}</p>
  </div>
</div>
