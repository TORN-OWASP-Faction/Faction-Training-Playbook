<script>
  import '../app.css';
  import Nav from '$lib/Nav.svelte';
  let { children } = $props();
</script>

<Nav />
{@render children()}

<div class="repo"><div class="wrap">
  <a class="gh" href="https://github.com/TORN-OWASP-Faction/Faction-Training-Playbook" target="_blank" rel="noopener">
    <svg viewBox="0 0 16 16" width="22" height="22" aria-hidden="true"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"/></svg>
    <span class="name">TORN-OWASP-Faction / <b>Faction-Training-Playbook</b></span>
    <span class="cta">View on GitHub ↗</span>
  </a>
  <span class="hint">Spot a mistake or have a guide to add? Open an issue or send a pull request.</span>
</div></div>

<style>
  .repo{padding:0 0 2.4rem;margin-top:-1.6rem;position:relative;z-index:2}
  .repo .wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1rem}
  .gh{display:inline-flex;align-items:center;gap:.6rem;padding:.55rem .8rem;border:1px solid var(--border);border-radius:6px;
    background:var(--surface);color:var(--ink);text-decoration:none;font-size:.85rem}
  .gh svg{fill:var(--ink);flex:none}
  .gh .name{color:var(--muted)}
  .gh .name b{color:var(--ink);font-weight:600}
  .gh .cta{font-family:"IBM Plex Mono",monospace;font-size:.72rem;color:var(--amber);border-left:1px solid var(--border);padding-left:.6rem}
  .gh:hover{border-color:var(--amber)}
  .gh:focus-visible{outline:2px solid var(--amber);outline-offset:2px}
  .hint{color:var(--faint);font-size:.8rem}
  @media(max-width:560px){.gh .name{display:none}}
</style>
