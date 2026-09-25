<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Icon from '$lib/Icon.svelte';
  import { href, rich } from '$lib/i18n';

  let { m, lang } = $props();

  // Hide the Halloween banner once the event is over. Update EVENT_END for next year's event.
  const EVENT_END = new Date('2026-11-02T00:00:00Z');
  let eventOver = $state(false);
  onMount(() => (eventOver = Date.now() > EVENT_END));

  // Message keys in m.goals, with each goal's main page and its three shortcuts (same order as the labels).
  const GOALS = [
    ['new', 'compass', '/start/', ['/start/#week', '/start/#safe', '/glossary/']],
    ['train', 'dumbbell', '/training/', ['/training/#idea', '/training/#builds', '/planner/']],
    ['money', 'coins', '/travel/', ['/training/#money', '/travel/#yata', '/start/#selling']],
    ['plan', 'route', '/paths/', ['/paths/#planner', '/paths/#guides', '/paths/#faction']]
  ];

  const MORE = [
    ['crimes', 'skull', '/crimes/'], ['loadout', 'flag', '/loadout/'],
    ['medical', 'hospital', '/medical/'], ['scripts', 'wrench', '/scripts/']
  ];

  // [key, name, image, background, fallback initial, page they look after]
  const CREW = [
    ['banker', 'Vincent "Ledger" Moretti', 'banker.webp', 'bg_bank.webp', 'V', '/paths/'],
    ['trainer', 'Maya "Rep" Torres', 'trainer.webp', 'bg_gym.webp', 'M', '/training/'],
    ['militia', 'Marcus "Rook" Kane', 'militia.webp', 'bg_militia.webp', 'R', '/loadout/'],
    ['fixer', 'Nico "The Line" Vescari', 'nico.webp', 'bg_alley.webp', 'N', '/start/'],
    ['medic', 'Dr. "Patch" Moreau', 'medic.webp', 'bg_medic.webp', 'P', '/medical/'],
    ['racer', 'Axel "Gearbox" Rivera', 'racer.webp', 'bg_racing.webp', 'A', '/racing/']
  ];
</script>

<header class="hero"><div class="wrap">
  <span class="hero-badge">{m.badge}</span>
  <h1>{@html m.h1}</h1>
  <p class="lede">{m.lede}</p>
  {#if !eventOver}
    <a class="event" href={href('/halloween/', lang)}>
      <span class="ev-icon"><Icon name="ghost" size={24} /></span>
      <span><b>{m.event.title}</b><small>{m.event.text}</small></span>
      <span class="ev-go">{m.event.go} <span class="arrow" aria-hidden="true">→</span></span>
    </a>
  {/if}
</div></header>

<section class="goals-sec" aria-labelledby="goals-h"><div class="wrap">
  <span class="eyebrow">{m.choose.eyebrow}</span>
  <h2 id="goals-h">{m.choose.title}</h2>
  <ul class="goals">
    {#each GOALS as [key, icon, main, links]}
      {@const g = m.goals[key]}
      <li class="goal">
        <span class="gi"><Icon name={icon} size={22} /></span>
        <h3>{g.title}</h3>
        <p>{g.text}</p>
        <a class="go" href={href(main, lang)}>{g.go} <span class="arrow" aria-hidden="true">→</span></a>
        <ul class="sub">
          {#each links as path, i}<li><a href={href(path, lang)}>{g.links[i]}</a></li>{/each}
        </ul>
      </li>
    {/each}
  </ul>
</div></section>

<section aria-labelledby="more-h"><div class="wrap">
  <span class="eyebrow">{m.more.eyebrow}</span>
  <h2 id="more-h">{m.more.title}</h2>
  <ul class="more">
    {#each MORE as [key, icon, path]}
      {@const [title, text] = m.more.items[key]}
      <li><a href={href(path, lang)}>
        <span class="mi"><Icon name={icon} size={18} /></span>
        <span><b>{title}</b><small>{text}</small></span>
      </a></li>
    {/each}
  </ul>
</div></section>

<section aria-labelledby="crew-h"><div class="wrap">
  <span class="eyebrow">{m.crew.eyebrow}</span>
  <h2 id="crew-h">{m.crew.title}</h2>
  <p class="lede">{m.crew.lede}</p>
  <div class="hero-crew">
    {#each CREW as [key, name, img, bg, initial, path]}
      {@const [role, dom, alt] = m.crew.members[key]}
      <a class="crew {key}" href={href(path, lang)}>
        <div class="art" style="background-image:url('{base}/assets/{bg}')"></div>
        <div class="fallback" aria-hidden="true">{initial}</div>
        <div class="veil"></div>
        <img class="art" src="{base}/assets/{img}" {alt} style="background:none" loading="lazy">
        <div class="cap"><div class="role">{role}</div><div class="who" dir="ltr">{name}</div><div class="dom">{dom}</div></div>
      </a>
    {/each}
  </div>
</div></section>

<footer><div class="wrap">{@html rich(m.footer, lang)}</div></footer>

<style>
  .hero{padding-bottom:28px}
  .event{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem 1rem;margin-top:1.4rem;max-width:48rem;text-decoration:none;color:var(--ink);
    background:var(--surface);border:1px solid var(--border);border-inline-start:3px solid #e07b24;border-radius:3px;padding:.8rem 1rem}
  .event:hover{border-color:#e07b24}
  .ev-icon{color:#e07b24;flex:none}
  .event b{display:block}
  .event small{display:block;color:var(--muted);font-size:.88rem}
  .ev-go{margin-inline-start:auto;color:var(--amber);font-weight:600;white-space:nowrap}
  .goals-sec{border-top:0;padding-top:12px}
  .goals,.sub,.more{list-style:none;margin:0;padding:0}
  .goals{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:1rem;margin-top:1.2rem}
  .goal{display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1.3rem 1.2rem 1.1rem}
  .goal:hover{border-color:color-mix(in srgb,var(--amber) 55%,var(--border))}
  .gi{display:inline-flex;width:2.6rem;height:2.6rem;align-items:center;justify-content:center;border-radius:3px;
    color:var(--amber);background:var(--amber-soft);margin-bottom:.9rem}
  .goal h3{font-size:1.35rem}
  .goal p{color:var(--muted);margin:.2rem 0 1rem;flex:1}
  .go{align-self:flex-start;display:inline-flex;gap:.4rem;align-items:center;font-weight:600;text-decoration:none;
    color:#111;background:var(--amber);border-radius:3px;padding:.5rem .85rem}
  .go:hover{filter:brightness(1.08)}
  .sub{margin-top:.9rem;border-top:1px solid var(--border);padding-top:.6rem;display:grid;gap:.15rem}
  .sub a{display:block;color:var(--muted);text-decoration:none;font-size:.9rem;padding:.25rem 0}
  .sub a:hover{color:var(--ink)}
  .sub a::before{content:'›';color:var(--amber);margin-inline-end:.5rem}
  .more{display:grid;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr));gap:.8rem;margin-top:1.2rem}
  .more a{display:flex;gap:.8rem;align-items:flex-start;height:100%;text-decoration:none;color:var(--ink);
    background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:.9rem 1rem}
  .more a:hover{border-color:var(--amber)}
  .more b{display:block;font-weight:600}
  .more small{display:block;color:var(--muted);font-size:.86rem;margin-top:.15rem}
  .mi{flex:none;color:var(--amber);margin-top:.15rem}
  .hero-crew{grid-template-columns:repeat(3,minmax(0,1fr))}
  @media(max-width:900px){.hero-crew{grid-template-columns:repeat(2,minmax(0,1fr))}}
  @media(max-width:520px){.hero-crew{grid-template-columns:1fr}}
  a.crew{text-decoration:none;color:var(--ink)}
  a.crew:hover{border-color:var(--amber)}
  :global([dir="rtl"]) .sub a::before{content:'‹'}
  .arrow{display:inline-block}
  :global([dir="rtl"]) .arrow{transform:scaleX(-1)}
</style>
