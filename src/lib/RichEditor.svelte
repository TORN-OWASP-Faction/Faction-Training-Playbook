<script>
  import { onMount } from 'svelte';
  import { sanitize } from '$lib/richtext.js';
  import { COLORS } from '$lib/templates.js';
  import Icon from '$lib/Icon.svelte';

  // html: the editor's content. oninput fires when the player edits by hand.
  let { html = $bindable(''), oninput, label = 'Message' } = $props();

  let el;
  let shown = ''; // what is currently in the editable area, so outside changes can be told apart from typing
  let active = $state({});
  let linkOpen = $state(false);
  let linkUrl = $state('https://');
  let savedRange = null;

  // Content set from outside (a template, a saved or imported message) is cleaned before it is shown:
  // an imported file could come from anyone.
  $effect(() => {
    if (el && html !== shown) { el.innerHTML = sanitize(html); shown = html; }
  });

  onMount(() => {
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('defaultParagraphSeparator', false, 'p');
    const update = () => {
      if (!el?.contains(document.getSelection()?.anchorNode)) return;
      active = Object.fromEntries(['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'].map((c) => [c, document.queryCommandState(c)]));
    };
    document.addEventListener('selectionchange', update);
    return () => document.removeEventListener('selectionchange', update);
  });

  function changed() {
    shown = el.innerHTML;
    html = shown;
    oninput?.();
  }

  function run(cmd, value = null) {
    el.focus();
    document.execCommand(cmd, false, value);
    changed();
  }

  // Pasted text keeps simple formatting only, so nothing Torn would strip or break sneaks in.
  function onPaste(e) {
    e.preventDefault();
    const pastedHtml = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    if (pastedHtml) document.execCommand('insertHTML', false, sanitize(pastedHtml));
    else document.execCommand('insertText', false, text);
    changed();
  }

  function openLink() {
    const sel = document.getSelection();
    savedRange = sel.rangeCount && el.contains(sel.anchorNode) ? sel.getRangeAt(0).cloneRange() : null;
    linkUrl = 'https://';
    linkOpen = true;
  }
  function addLink(e) {
    e.preventDefault();
    linkOpen = false;
    if (!/^https?:\/\/\S+\.\S+/.test(linkUrl)) return;
    el.focus();
    if (savedRange) { const sel = document.getSelection(); sel.removeAllRanges(); sel.addRange(savedRange); }
    if (document.getSelection().isCollapsed) document.execCommand('insertHTML', false, `<a href="${linkUrl.replace(/"/g, '%22')}">${linkUrl.replace(/</g, '&lt;')}</a>`);
    else document.execCommand('createLink', false, linkUrl);
    changed();
  }

  const TOOLS = [
    ['bold', 'B', 'Bold (Ctrl+B)'], ['italic', 'I', 'Italic (Ctrl+I)'], ['underline', 'U', 'Underline (Ctrl+U)'], ['strikeThrough', 'S', 'Strikethrough']
  ];
</script>

<div class="re">
  <div class="bar" role="toolbar" aria-label="Formatting">
    {#each TOOLS as [cmd, text, name]}
      <button type="button" class="t {cmd}" aria-label={name} title={name} aria-pressed={!!active[cmd]} onmousedown={(e) => e.preventDefault()} onclick={() => run(cmd)}>{text}</button>
    {/each}
    <span class="sep"></span>
    <button type="button" class="t" title="Heading" aria-label="Heading" onmousedown={(e) => e.preventDefault()} onclick={() => run('formatBlock', 'h3')}>H</button>
    <button type="button" class="t" title="Normal text" aria-label="Normal text" onmousedown={(e) => e.preventDefault()} onclick={() => run('formatBlock', 'p')}>¶</button>
    <button type="button" class="t" title="Bulleted list" aria-pressed={!!active.insertUnorderedList} onmousedown={(e) => e.preventDefault()} onclick={() => run('insertUnorderedList')}><span aria-hidden="true">•</span><span class="sr">Bulleted list</span></button>
    <button type="button" class="t" title="Numbered list" aria-pressed={!!active.insertOrderedList} onmousedown={(e) => e.preventDefault()} onclick={() => run('insertOrderedList')}><span aria-hidden="true">1.</span><span class="sr">Numbered list</span></button>
    <button type="button" class="t" title="Divider line" aria-label="Divider line" onmousedown={(e) => e.preventDefault()} onclick={() => run('insertHorizontalRule')}>—</button>
    <button type="button" class="t" title="Link" aria-label="Add a link" aria-expanded={linkOpen} onmousedown={(e) => e.preventDefault()} onclick={openLink}><Icon name="link" size={16} /></button>
    <span class="sep"></span>
    {#each Object.entries(COLORS) as [name, hex]}
      <button type="button" class="sw" title="{name} text" aria-label="{name} text" style="--sw:{hex}" onmousedown={(e) => e.preventDefault()} onclick={() => run('foreColor', hex)}></button>
    {/each}
    <span class="sep"></span>
    <button type="button" class="t" title="Clear formatting" aria-label="Clear formatting" onmousedown={(e) => e.preventDefault()} onclick={() => run('removeFormat')}>⨯</button>
    <button type="button" class="t" title="Undo (Ctrl+Z)" aria-label="Undo" onmousedown={(e) => e.preventDefault()} onclick={() => run('undo')}>↶</button>
    <button type="button" class="t" title="Redo (Ctrl+Y)" aria-label="Redo" onmousedown={(e) => e.preventDefault()} onclick={() => run('redo')}>↷</button>
  </div>
  {#if linkOpen}
    <form class="linkbox" onsubmit={addLink}>
      <label>Link address <input type="url" bind:value={linkUrl} required /></label>
      <button class="chip" type="submit">Add link</button>
      <button class="chip" type="button" onclick={() => (linkOpen = false)}>Cancel</button>
    </form>
  {/if}
  <div bind:this={el} class="area" contenteditable="true" role="textbox" aria-multiline="true" aria-label={label}
    tabindex="0" oninput={changed} onpaste={onPaste}></div>
</div>

<style>
  .re{border:1px solid var(--border);border-radius:3px;background:var(--surface)}
  .bar{display:flex;flex-wrap:wrap;gap:3px;align-items:center;padding:.4rem;border-bottom:1px solid var(--border);background:var(--raised)}
  .t{font:inherit;font-size:.9rem;min-width:2rem;height:2rem;padding:0 .4rem;display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:3px;background:none;color:var(--ink);cursor:pointer}
  .t:hover{border-color:var(--border);background:var(--surface)}
  .t[aria-pressed="true"]{background:var(--amber-soft);border-color:var(--amber);color:var(--amber)}
  .t.bold{font-weight:700} .t.italic{font-style:italic} .t.underline{text-decoration:underline} .t.strikeThrough{text-decoration:line-through}
  .sw{width:1.5rem;height:1.5rem;margin:0 1px;border-radius:50%;border:2px solid var(--raised);outline:1px solid var(--border);background:var(--sw);cursor:pointer}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .sep{width:1px;height:1.4rem;background:var(--border);margin:0 .25rem}
  .linkbox{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;padding:.5rem .6rem;border-bottom:1px solid var(--border);font-size:.9rem;color:var(--muted)}
  .linkbox label{display:flex;gap:.4rem;align-items:center;flex:1 1 14rem}
  .linkbox input{flex:1;min-width:0;font:inherit;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.3rem .5rem}
  .area{min-height:22rem;max-height:70vh;overflow:auto;padding:1rem 1.2rem;color:var(--ink);line-height:1.55;outline:none}
  .area:focus-visible{box-shadow:inset 0 0 0 2px var(--amber)}
  .area :global(p){margin:0 0 .7em;max-width:none}
  .area :global(ul),.area :global(ol){margin:0 0 .8em;padding-inline-start:1.4em}
  .area :global(ul){list-style:disc} .area :global(ol){list-style:decimal}
  .area :global(h3){font-size:1.15rem;margin:.4em 0}
  .area :global(hr){border:0;border-top:1px solid var(--border);margin:1em 0}
</style>
