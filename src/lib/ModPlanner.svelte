<script>
  import { base } from '$app/paths';

  // data: the weapon-mods.json catalog. gun: the chosen weapon ({ name, mods: [mod ids it accepts] }).
  // names: { group id: display name }.
  let { data, gun, names } = $props();

  const ACCURACY = ['sight', 'brake', 'grip'];
  // Each goal lists, for each of the two slots, the kinds of mod to try in order. The first kind the gun takes wins.
  const GOALS = [
    { id: 'allround', label: 'Hit more, and harder', use: 'Chains and war hits: the all-round choice.', slots: [ACCURACY, ['laser']] },
    { id: 'accuracy', label: 'Land every hit', use: 'Stack accuracy for hard-to-hit targets.', slots: [ACCURACY, ['grip', 'trigger', 'brake']] },
    { id: 'first', label: 'One big first hit', use: 'Assassinate builds: the trigger only works on turn one.', slots: [['trigger'], ACCURACY] },
    { id: 'long', label: 'Last through long fights', use: 'Fewer reloads and more ammo, for Specialist guns and long war fights.', slots: [['recoil', 'extmag', 'extramag'], ['extmag', 'extramag']] },
    { id: 'stealth', label: 'Quiet hits', use: 'Mugs and bounties, when you’d rather they didn’t see who hit them.', slots: [['suppressor'], ['sight', 'grip', 'laser']] },
    { id: 'damage', label: 'More damage', use: 'Chokes on shotguns, crits on everything else.', slots: [['choke', 'laser'], ['laser', ...ACCURACY]] },
    { id: 'defense', label: 'Make them miss', use: 'Lights lower your opponent’s accuracy while you use the gun.', slots: [['light'], [...ACCURACY, 'laser']] }
  ];
  let goalId = $state('allround');
  const goal = $derived(GOALS.find((g) => g.id === goalId));

  const tiersOf = (g) => data.mods.filter((m) => m.group === g && gun.mods.includes(m.id));
  const clash = (a, b) => (a === 'suppressor' && b === 'brake') || (a === 'brake' && b === 'suppressor');

  const main = $derived(goal.slots[0].find((g) => tiersOf(g).length));
  const second = $derived(goal.slots[1].find((g) => g !== main && !clash(main, g) && tiersOf(g).length));

  // Steady climb: tier one of both first, then always the cheaper next tier. Rush: finish the main line, then the second.
  const mid = (m) => (m.price[0] + m.price[1]) / 2;
  function climb(a, b) {
    const A = tiersOf(a), B = b ? tiersOf(b) : [];
    const out = [A.shift(), ...(B.length ? [B.shift()] : [])];
    while (A.length || B.length) out.push(!B.length || (A.length && mid(A[0]) <= mid(B[0])) ? A.shift() : B.shift());
    return out;
  }
  const rush = (a, b) => [...tiersOf(a), ...(b ? tiersOf(b) : [])];

  function withTotals(steps) {
    let lo = 0, hi = 0;
    return steps.map((m) => { lo += m.price[0]; hi += m.price[1]; return { ...m, total: [lo, hi] }; });
  }
  const routes = $derived(main ? [
    { id: 'climb', title: 'Steady climb', sub: 'Start cheap, get stronger a little at a time.', steps: withTotals(climb(main, second)), mark: 2, markText: 'Both slots working' },
    { id: 'rush', title: 'Rush the top', sub: `Max ${names[main]} first, then build ${second ? names[second] : 'nothing else'}.`, steps: withTotals(rush(main, second)), mark: tiersOf(main).length, markText: `${names[main]} maxed` }
  ] : []);

  const credits = (r) => `${r[0].toLocaleString('en-US')}–${r[1].toLocaleString('en-US')}`;
  const isDual = $derived(gun.name.startsWith('Dual '));
</script>

<div class="planner">
  <fieldset class="goals">
    <legend>What do you want the gun to do?</legend>
    {#each GOALS as g (g.id)}
      <label class="goal" class:on={goalId === g.id}>
        <input type="radio" name="goal" value={g.id} bind:group={goalId} />
        <b>{g.label}</b>
        <small>{g.use}</small>
      </label>
    {/each}
  </fieldset>

  {#if !main}
    <p class="warn">A {gun.name} can't take any of the mods for this goal. Pick another goal or another gun.</p>
  {:else}
    <div class="pair">
      <span class="pl">Your pair for the {gun.name}</span>
      <div class="chips">
        <span class="chip-m a"><img src="{base}/assets/mods/{tiersOf(main).at(-1).id}.webp" alt="" width="65" height="40" /> {names[main]}</span>
        {#if second}<span class="plus" aria-hidden="true">+</span><span class="chip-m b"><img src="{base}/assets/mods/{tiersOf(second).at(-1).id}.webp" alt="" width="65" height="40" /> {names[second]}</span>{/if}
      </div>
      {#if !second}<p class="note">This gun can't take a second mod that suits this goal. Fill the other slot with whatever fits (see below).</p>{/if}
      {#if isDual}<p class="note">Dual weapons get half of every mod's bonus.</p>{/if}
    </div>

    <p class="note">Torn only sells a tier once you own every tier below it, so no route can skip a tier. Both routes end with the same mods and the same total; the difference is the order you buy them in.</p>

    <div class="routes">
      {#each routes as r (r.id)}
        <div class="route" role="group" aria-label={r.title}>
          <h3>{r.title}</h3>
          <p class="note">{r.sub}</p>
          <ol class="flow">
            {#each r.steps as m, i (m.id)}
              <li class="step" class:b={m.group === second}>
                <span class="n mono">{i + 1}</span>
                <img src="{base}/assets/mods/{m.id}.webp" alt="" width="65" height="40" loading="lazy" />
                <div class="what"><b>{m.name}</b><small>{m.effect}</small></div>
                <div class="cost mono"><span>{credits(m.price)}</span><small>total {credits(m.total)}</small></div>
              </li>
              {#if i + 1 === r.mark && i + 1 < r.steps.length}<li class="mark">{r.markText}</li>{/if}
            {/each}
            <li class="mark end">Finished: {credits(r.steps.at(-1).total)} credits</li>
          </ol>
        </div>
      {/each}
    </div>
    <p class="note">Credits are the range players have seen in the mission shop. Special offers can cost half as much, so waiting for one on the expensive steps lowers every total here.</p>
  {/if}
</div>

<style>
  .planner{display:grid;gap:1rem;margin-top:1rem}
  .goals{border:0;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:.5rem}
  .goals legend{font-size:.88rem;color:var(--muted);margin-bottom:.5rem;padding:0}
  .goal{display:grid;gap:.15rem;border:1px solid var(--border);border-radius:3px;padding:.6rem .8rem;cursor:pointer;background:var(--surface)}
  .goal:hover{border-color:var(--amber)}
  .goal.on{border-color:var(--amber);background:var(--amber-soft)}
  .goal:focus-within{outline:2px solid var(--amber);outline-offset:2px}
  .goal input{position:absolute;opacity:0;width:1px;height:1px}
  .goal small{color:var(--muted);font-size:.82rem}
  .pair{display:grid;gap:.5rem}
  .pl{font-family:"IBM Plex Mono",monospace;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted)}
  .chips{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center}
  .chip-m{display:inline-flex;gap:.6rem;align-items:center;border:1px solid var(--border);border-radius:3px;padding:.3rem .8rem .3rem .3rem;font-weight:600;background:var(--surface)}
  .chip-m.a{border-color:var(--amber)}
  .chip-m.b{border-color:var(--c-militia)}
  .plus{color:var(--muted);font-size:1.2rem}
  .routes{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,22rem),1fr));gap:1.5rem}
  .route h3{margin:0}
  .flow{list-style:none;padding:0;margin:.8rem 0 0;display:grid;gap:1.1rem}
  .step{position:relative;display:grid;grid-template-columns:auto 65px 1fr auto;gap:.7rem;align-items:center;border:1px solid var(--border);border-inline-start:3px solid var(--amber);border-radius:3px;padding:.5rem .7rem;background:var(--surface)}
  .step.b{border-inline-start-color:var(--c-militia)}
  /* the arrow down to the next box */
  .step:not(:last-child)::after,.mark:not(.end)::after{content:"";position:absolute;inset-inline-start:2.1rem;bottom:-1.05rem;height:1rem;border-inline-start:2px solid var(--border)}
  .mark{position:relative;font-family:"IBM Plex Mono",monospace;font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--trainer-ink);padding-inline-start:1.4rem}
  .mark.end{color:var(--amber);font-weight:600}
  .n{font-size:.8rem;color:var(--muted);min-width:1.2rem;text-align:center}
  .step img{width:65px;height:40px;object-fit:contain}
  .what{display:grid;min-width:0}
  .what small{color:var(--muted);font-size:.82rem}
  .cost{display:grid;text-align:end;font-size:.82rem;white-space:nowrap}
  .cost small{color:var(--muted);font-size:.72rem}
  .note{color:var(--muted);font-size:.88rem;margin:0}
  .warn{padding:.6rem .9rem;border:1px solid var(--amber);border-radius:3px;background:var(--amber-soft);margin:0}
  @media (max-width:520px){
    .step{grid-template-columns:auto 52px 1fr}
    .step img{width:52px;height:32px}
    .cost{grid-column:2/-1;text-align:start;display:flex;gap:.6rem;flex-wrap:wrap}
  }
</style>
