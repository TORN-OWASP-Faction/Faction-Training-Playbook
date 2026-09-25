<script>
  import Character from '$lib/Character.svelte';
  import { naturalEnergy } from '$lib/progression.js';
  import { href, rich } from '$lib/i18n';

  let { m, lang } = $props();

  const donatorGain = Math.round((naturalEnergy(5, 'real') / naturalEnergy(5, 'no') - 1) * 100);
  const r = (str) => rich(str, lang, { donatorGain });

  const TOC = ['week', 'missions', 'safe', 'selling', 'books', 'drugs', 'scams', 'faction', 'routine'];

  // Badge shown beside each line of a list, in the same order as the lines in the messages.
  const K = {
    missionsNew: ['E', '↑', '!'],
    missionsReg: ['15', '✓', '✗'],
    safeTips: ['↻', '✗', '$'],
    sellWhere: ['IM', 'B', '⇄'],
    sellHow: ['$', '!', '⚑'],
    drugsWhat: ['↓', '%', '✗', '!'],
    drugsKeep: ['✈', 'M', '★', '⚑'],
    scams: ['$', '⇄', '🔑', '✈', '🏦', '🎲'],
    respect: ['R', '×', '↓'],
    help: ['OC', '⛓', '↺', '+', '✈'],
    day: ['E', '↑', 'X', 'N', '✈', 'JP', '$'],
    week: ['↻', '$', '🎓', 'OC'],
    month: ['🏝', '★', '$', '📖']
  };
</script>

{#snippet rules(lines, badges)}
  <ul class="rules">
    {#each lines as line, i}<li><span class="k" aria-hidden="true">{badges[i]}</span><div>{@html r(line)}</div></li>{/each}
  </ul>
{/snippet}

{#snippet table(head, rows, nowrapFirst = false)}
  <div class="tbl-scroll"><table>
    <thead><tr>{#each head as h}<th>{h}</th>{/each}</tr></thead>
    <tbody>
      {#each rows as row}
        <tr>{#each row as cell, i}<td class:nowrap={i === 0 && nowrapFirst}>{#if i === 0}<b>{cell}</b>{:else}{cell}{/if}</td>{/each}</tr>
      {/each}
    </tbody>
  </table></div>
{/snippet}

<header class="hero"><div class="wrap">
  <span class="eyebrow">{m.hero.eyebrow}</span>
  <h1>{@html m.hero.h1}</h1>
  <p class="lede">{@html r(m.hero.lede)}</p>
  <nav class="toc2" aria-label={m.hero.tocLabel}>
    {#each TOC as id}<a href="#{id}">{m.toc[id]}</a>{/each}
    <a href={href('/glossary/', lang)}>{m.toc.glossary}</a>
  </nav>
  <Character variant="banker" name="Ledger" tag={m.hero.quoteTag} initial="V" img="banker.png">{m.hero.quote}</Character>
</div></header>

<section id="week"><div class="wrap">
  <span class="eyebrow">{m.week.eyebrow}</span>
  <h2>{m.week.title}</h2>
  <ol class="steps" style="margin-top:1.2rem">
    {#each m.week.steps as [title, detail]}<li><div><b>{title}</b><small>{@html r(detail)}</small></div></li>{/each}
  </ol>

  <div class="card" style="margin-top:1.2rem">
    <h3>{m.week.merits.title}</h3>
    <p style="margin:.3em 0 .6rem;color:var(--muted)">{m.week.merits.intro}</p>
    {@render table(m.week.merits.head, m.week.merits.rows, true)}
  </div>
</div></section>

<section id="missions"><div class="wrap">
  <span class="eyebrow">{m.missions.eyebrow}</span>
  <h2>{m.missions.title}</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>{m.missions.newTitle}</h3>{@render rules(m.missions.new, K.missionsNew)}</div>
    <div class="card"><h3>{m.missions.regTitle}</h3>{@render rules(m.missions.reg, K.missionsReg)}</div>
  </div>
</div></section>

<section id="safe"><div class="wrap">
  <span class="eyebrow">{m.safe.eyebrow}</span>
  <h2>{m.safe.title}</h2>
  <p class="lede">{m.safe.lede}</p>
  <div style="margin-top:1rem">{@render table(m.safe.head, m.safe.rows, true)}</div>
  <div class="callout" style="margin-top:1rem">{@render rules(m.safe.tips, K.safeTips)}</div>
</div></section>

<section id="selling"><div class="wrap">
  <span class="eyebrow">{m.selling.eyebrow}</span>
  <h2>{m.selling.title}</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>{m.selling.whereTitle}</h3>{@render rules(m.selling.where, K.sellWhere)}</div>
    <div class="card"><h3>{m.selling.howTitle}</h3>{@render rules(m.selling.how, K.sellHow)}</div>
  </div>
</div></section>

<section id="books"><div class="wrap">
  <span class="eyebrow">{m.books.eyebrow}</span>
  <h2>{m.books.title}</h2>
  <p class="lede">{m.books.lede}</p>
  <div style="margin-top:1rem">{@render table(m.books.head, m.books.rows)}</div>
</div></section>

<section id="drugs"><div class="wrap">
  <span class="eyebrow">{m.drugs.eyebrow}</span>
  <h2>{m.drugs.title}</h2>
  <p class="lede">{@html r(m.drugs.lede)}</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>{m.drugs.whatTitle}</h3>{@render rules(m.drugs.what, K.drugsWhat)}</div>
    <div class="card"><h3>{m.drugs.keepTitle}</h3>{@render rules(m.drugs.keep, K.drugsKeep)}</div>
  </div>
</div></section>

<section id="scams"><div class="wrap">
  <span class="eyebrow">{m.scams.eyebrow}</span>
  <h2>{m.scams.title}</h2>
  <div class="callout" style="margin-top:1rem">{@render rules(m.scams.items, K.scams)}</div>
</div></section>

<section id="faction"><div class="wrap">
  <span class="eyebrow">{m.faction.eyebrow}</span>
  <h2>{m.faction.title}</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card"><h3>{m.faction.respectTitle}</h3>{@render rules(m.faction.respect, K.respect)}</div>
    <div class="card"><h3>{m.faction.helpTitle}</h3>{@render rules(m.faction.help, K.help)}</div>
  </div>
  <Character variant="militia" name="Rook" tag={m.faction.quoteTag} initial="R" img="militia.png">{m.faction.quote}</Character>
</div></section>

<section id="routine"><div class="wrap">
  <span class="eyebrow">{m.routine.eyebrow}</span>
  <h2>{m.routine.title}</h2>
  <div class="grid3" style="margin-top:1rem">
    <div class="card"><h3>{m.routine.dayTitle}</h3>{@render rules(m.routine.day, K.day)}</div>
    <div class="card"><h3>{m.routine.weekTitle}</h3>{@render rules(m.routine.week, K.week)}</div>
    <div class="card"><h3>{m.routine.monthTitle}</h3>{@render rules(m.routine.month, K.month)}</div>
  </div>
</div></section>

<footer><div class="wrap">{@html r(m.footer)}</div></footer>

<style>
  .toc2{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:1.2rem}
  .toc2 a{font-size:.82rem;text-decoration:none;color:var(--muted);border:1px solid var(--border);border-radius:3px;padding:.3rem .6rem;background:var(--surface)}
  .toc2 a:hover{color:var(--ink);border-color:var(--amber)}
  .card :global(.rules){margin-top:.6rem}
  .nowrap{white-space:nowrap}
  .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1rem}
  @media(max-width:900px){.grid3{grid-template-columns:1fr}}
</style>
