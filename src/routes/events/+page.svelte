<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Character from '$lib/Character.svelte';
  import { EVENTS, MONTHS, when, status } from '$lib/data/events.js';

  let { data } = $props();

  // Until the page loads in the browser, count from the build time so the prerendered HTML matches.
  let clock = $state(0);
  const now = $derived(clock || data.builtAt);
  onMount(() => (clock = Date.now()));

  const withStatus = $derived(EVENTS.map((e) => ({ e, s: status(e, now) })));
  const upcoming = $derived([...withStatus].sort((a, b) => a.s.days - b.s.days).slice(0, 3));
  const byMonth = $derived(MONTHS.map((m, i) => [m, withStatus.filter(({ e }) => +e[1].slice(0, 2) === i + 1)]).filter(([, list]) => list.length));

  const link = (html) => html.replace(/href="\//g, `href="${base}/`);
  const inDays = (s) => (s.live ? 'On now' : s.days === 1 ? 'Tomorrow' : `In ${s.days} days`);
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Plan around them</span>
  <h1>Events <em>calendar</em></h1>
  <p class="lede">Torn runs an event almost every month. Most last a day and boost one thing. Here's what each one does and how a new player should use it.</p>

  <h2 class="sr" id="next-h">Coming up</h2>
  <ol class="next" aria-labelledby="next-h">
    {#each upcoming as { e, s }}
      <li class:live={s.live}>
        <span class="when mono">{inDays(s)}</span>
        <b>{e[0]}</b>
        <small>{when(e)}</small>
        <p>{@html link(e[4])}</p>
      </li>
    {/each}
  </ol>
</div></header>

<section id="top"><div class="wrap">
  <span class="eyebrow">If you only plan for five</span>
  <h2>Worth planning for</h2>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">$</span><div><b>Tourism Day</b> (26–28 Sep): twice the items per trip.</div></li>
      <li><span class="k">W</span><div><b>Employee Appreciation Day</b> (early March): triple working stats from company training.</div></li>
      <li><span class="k">E</span><div><b>CaffeineCon</b> (15 Oct): double energy from energy drinks.</div></li>
      <li><span class="k">M</span><div><b>Trick or Treat</b> (25 Oct – 1 Nov): an easy merit.</div></li>
      <li><span class="k">H</span><div><b>World Diabetes Day</b> (14 Nov): triple happy from candy, the cheapest big jump of the year.</div></li>
    </ul>
  </div>
  <Character variant="banker" name="Ledger" tag="Money Talk" initial="V" img="banker.png">
    "Events reward the players who bought ahead. Candy in early November, energy drinks in October, beer in July. Buy when nobody wants it, use it when it counts double."
  </Character>
</div></section>

<section id="year"><div class="wrap">
  <span class="eyebrow">Every event, in order</span>
  <h2>The year</h2>
  <p class="lede">Dates are this year's, from Torn's own calendar. Most events land on the same dates every year.</p>
  {#each byMonth as [month, list]}
    <h3 class="month">{month}</h3>
    <ul class="year">
      {#each list as { e, s }}
        <li class:live={s.live} class:pick={e[6]}>
          <div class="date mono">{when(e)}</div>
          <div class="body">
            <div class="name">
              <b>{e[0]}</b>
              {#if e[6]}<span class="tag pick-tag">Top pick</span>{/if}
              {#each e[5] as t}<span class="tag">{t}</span>{/each}
              {#if s.live}<span class="tag live-tag">On now</span>{/if}
            </div>
            <p class="says"><span>Torn says:</span> {e[3]}</p>
            <p class="do">{@html link(e[4])}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/each}
  <p class="note">Big events such as Trick or Treat start at your own event time, somewhere between 10:00 and 16:00 TCT. You can see and change it at the top of the in-game Calendar page. Competitions such as Elimination change from year to year, so check the Calendar for those.</p>
</div></section>

<footer><div class="wrap">
  <strong>Events calendar.</strong> Dates and descriptions from Torn's calendar (Torn API, September 2026); effects from the Torn wiki pages for each event, drug and item. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
  .next{list-style:none;margin:1.4rem 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:.8rem}
  .next li{background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:1rem 1.1rem;display:flex;flex-direction:column;gap:.15rem}
  .next li.live{border-color:var(--amber)}
  .next .when{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--amber)}
  .next b{font-family:"Oswald",sans-serif;font-size:1.3rem;font-weight:600}
  .next small{color:var(--muted)}
  .next p{margin:.4rem 0 0;color:var(--muted);font-size:.9rem}
  .month{margin:1.6rem 0 .5rem;font-size:.8rem;text-transform:uppercase;letter-spacing:.14em;color:var(--amber)}
  .year{list-style:none;margin:0;padding:0;border:1px solid var(--border);border-radius:3px;background:var(--surface)}
  .year li{display:grid;grid-template-columns:9rem minmax(0,1fr);gap:1rem;padding:.9rem 1rem;border-bottom:1px solid var(--border)}
  .year li:last-child{border-bottom:0}
  .year li.pick{box-shadow:inset 3px 0 0 var(--amber)}
  .year li.live{background:var(--amber-soft)}
  .date{color:var(--muted);font-size:.85rem;padding-top:.15rem}
  .name{display:flex;flex-wrap:wrap;align-items:center;gap:.35rem .5rem}
  .name b{font-size:1.02rem}
  .tag{font-family:"IBM Plex Mono",monospace;font-size:.68rem;color:var(--muted);border:1px solid var(--border);border-radius:2px;padding:1px 6px}
  .pick-tag{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 50%,var(--border))}
  .live-tag{color:#111;background:var(--amber);border-color:var(--amber)}
  .says{margin:.35rem 0 0;color:var(--muted);font-size:.88rem}
  .says span{font-family:"IBM Plex Mono",monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.06em;color:var(--faint)}
  .do{margin:.3rem 0 0}
  .note{color:var(--muted);font-size:.9rem;margin-top:1.2rem}
  :global([dir="rtl"]) .year li.pick{box-shadow:inset -3px 0 0 var(--amber)}
  @media(max-width:600px){.year li{grid-template-columns:1fr;gap:.3rem}}
</style>
