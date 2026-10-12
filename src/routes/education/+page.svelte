<script>
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import Icon from '$lib/Icon.svelte';
  import Character from '$lib/Character.svelte';
  import DataTable from '$lib/DataTable.svelte';
  import EDU from '$lib/data/education.json';
  import { FIRST, TRACKS, PRESETS, REASON, addCourses, cut } from '$lib/edujourney.js';

  const STORE = 'ftp:edu-journey';

  // Each pick is { key, build? }. The gym line is always first and isn't stored.
  let picks = $state([]);
  let choosingBuild = $state(false);
  let speed = $state({ merits: 0, principal: false, wsu: false });
  let copied = $state('');

  let loaded = $state(false);
  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (saved) { picks = saved.picks ?? []; speed = { ...speed, ...saved.speed }; }
    } catch { /* storage blocked: start fresh */ }
    loaded = true;
  });
  // Save after loading, so the empty starting plan never overwrites a saved one.
  $effect(() => {
    const data = JSON.stringify({ picks, speed });
    if (!loaded) return;
    try { localStorage.setItem(STORE, data); } catch { /* private window: the plan lasts this visit */ }
  });

  const track = (key) => TRACKS.find((t) => t.key === key);
  const coursesOf = (pick) => {
    const t = track(pick.key);
    return t.builds ? t.builds.find((b) => b.key === pick.build).courses : t.courses;
  };

  // The plan as steps: what each pick added, after the courses already planned.
  const steps = $derived.by(() => {
    let plan = addCourses([], FIRST.courses);
    const out = [{ ...FIRST, added: plan }];
    for (const p of picks) {
      const next = addCourses(plan, coursesOf(p));
      const t = track(p.key);
      const build = t.builds?.find((b) => b.key === p.build);
      out.push({ ...t, label: build ? build.label : t.label, note: build?.note, added: next.slice(plan.length) });
      plan = next;
    }
    return out;
  });
  const plan = $derived(steps.flatMap((s) => s.added));

  const picked = $derived(new Set(picks.map((p) => p.key)));
  const options = $derived(TRACKS.filter((t) => !picked.has(t.key) && (!t.after || t.after === 'gym' || picked.has(t.after))));
  // How much a track would add on top of the current plan.
  const preview = (t, courses = t.courses) => addCourses(plan, courses).slice(plan.length);

  function choose(t, build) {
    if (t.builds && !build) { choosingBuild = true; return; }
    picks = [...picks, { key: t.key, ...(build ? { build } : {}) }];
    choosingBuild = false;
  }
  // Total plan length for a ready-made plan, with the reader's time cuts.
  function presetCodes(preset) {
    let codes = addCourses([], FIRST.courses);
    for (const p of preset.picks) codes = addCourses(codes, coursesOf(p));
    return codes;
  }
  function usePreset(preset) {
    if (picks.length && !confirm(`Replace your current plan with the ${preset.label} plan?`)) return;
    picks = preset.picks.map((p) => ({ ...p }));
    choosingBuild = false;
    document.getElementById('flow')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const pickLabel = (p) => {
    const t = track(p.key);
    return t.builds ? t.builds.find((b) => b.key === p.build).label.split(':')[0] : t.label;
  };
  function undo() { picks = picks.slice(0, -1); }
  function reset() { picks = []; choosingBuild = false; }

  const share = $derived(cut(speed));
  const len = (code) => EDU[code].days * (1 - share);
  const sum = (codes) => codes.reduce((s, c) => s + len(c), 0);
  const days = (d) => (d < 10 ? d.toFixed(1).replace(/\.0$/, '') : Math.round(d)) + (d === 1 ? ' day' : ' days');
  const totalDays = $derived(sum(plan));
  const finish = $derived(new Date(Date.now() + totalDays * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
  const why = (code) => REASON[code] ?? (EDU[code].perk || 'Needed for the degree');

  async function copyPlan() {
    const lines = steps.map((s, i) => `${i + 1}. ${s.label}\n` + (s.added.length ? s.added.map((c) => `   ${c} ${EDU[c].name} (${days(len(c))})`).join('\n') : '   No courses: see the tips on the page'));
    const text = `My education plan (${plan.length} courses, about ${days(totalDays)}, done around ${finish})\n\n${lines.join('\n')}`;
    try { await navigator.clipboard.writeText(text); copied = 'Copied'; } catch { copied = 'Copy failed'; }
    setTimeout(() => (copied = ''), 2000);
  }

  // Reference table: every course, and which tracks use it.
  const usedBy = {};
  for (const t of [FIRST, ...TRACKS]) {
    for (const v of t.builds ?? [t]) for (const c of v.courses) (usedBy[c] ??= new Set()).add(t.label);
  }
  const SUBJECT = { BUS: 'Business', HIS: 'History', MTH: 'Mathematics', CMT: 'Computing', BIO: 'Biology', SPT: 'Sports Science',
    PSY: 'Psychology', DEF: 'Self Defense', CBT: 'Combat Training', LAW: 'Law', HAF: 'Health and Fitness', GEN: 'General Studies' };
  const allRows = Object.entries(EDU).map(([code, c]) => [code, c.name, SUBJECT[code.slice(0, 3)], c.days, c.perk || '—', [...(usedBy[code] ?? [])].join(', ')]);
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Train · Money · Faction</span>
  <h1>Education <em>journey</em></h1>
  <p class="lede">Every course runs in the background, one at a time, and the whole catalogue takes over six years. So the order matters more than anything. Start with the gym line, then pick what you want next, one priority at a time.</p>
  <Character variant="banker" name="Ledger" tag="Before You Buy" initial="V" img="banker.png">
    "Courses cost pocket change. What they really cost is time, and you only get one course at a time. Spend those months on what you'll actually use."
  </Character>
</div></header>

<section id="faster"><div class="wrap">
  <span class="eyebrow">Before you start</span>
  <h2>Make every course shorter</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Cuts that last forever</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">20%</span><div><b>Education Length merits:</b> 2% off per merit, up to 10 merits.</div></li>
        <li><span class="k">10%</span><div><b>Principal</b>, the top rank of the Education city job. You keep the cut after you leave the job.</div></li>
        <li><span class="k">10%</span><div><b>The WSU stock block</b> (1,000,000 shares of West Side University).</div></li>
      </ul>
      <p class="note">They add up, so all three take 40% off. A cut only applies to courses you start after you get it.</p>
    </div>
    <div class="card">
      <h3>Good to know</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k"><Icon name="alert"/></span><div><b>Drugs can get you kicked out of a course</b>, and you start it again from the beginning.</div></li>
        <li><span class="k"><Icon name="timer"/></span><div><b>Job points</b> in a Fitness Center (1★) or Hair Salon (7★) take 30 minutes off your current course each. A Book of Carols from Christmas Town takes 6 hours.</div></li>
        <li><span class="k"><Icon name="star"/></span><div><b>Awards:</b> 16 in total, one for each of the 12 degrees and 4 for numbers of courses finished.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<section id="plan"><div class="wrap">
  <span class="eyebrow">Your plan</span>
  <h2>Pick your next priority</h2>
  <p class="lede">The first step is the same for everyone. After that, choose what matters most to you right now. When it's done, pick the next one. The plan adds any intro courses a pick needs, and never adds a course twice.</p>

  <h3 class="sub">Just want a map? Start from a ready-made plan</h3>
  <div class="presets">
    {#each PRESETS as preset}
      {@const codes = presetCodes(preset)}
      <button class="preset" onclick={() => usePreset(preset)}>
        <b>{preset.label}</b>
        <span>{preset.who}</span>
        <ol class="route">
          <li>Gym gains</li>
          {#each preset.picks as p}<li>{pickLabel(p)}</li>{/each}
        </ol>
        <small class="mono">{codes.length} courses · {days(sum(codes))}</small>
      </button>
    {/each}
  </div>
  <p class="note">A ready-made plan fills in the steps below. You can still undo steps or add more priorities after it.</p>

  <div class="speed card">
    <label>Education Length merits
      <select bind:value={speed.merits}>{#each Array(11) as _, i}<option value={i}>{i}</option>{/each}</select></label>
    <label class="tog"><input type="checkbox" bind:checked={speed.principal} /> Principal</label>
    <label class="tog"><input type="checkbox" bind:checked={speed.wsu} /> WSU block</label>
    <span class="cutnote">Courses are <b>{Math.round(share * 100)}%</b> shorter</span>
  </div>

  <div class="layout" id="flow">
    <ol class="flow">
      {#each steps as s, i}
        <li class="step">
          <div class="node"><span class="num">{i + 1}</span></div>
          <div class="body card">
            <div class="sh">
              <Icon name={s.icon} />
              <h3>{s.label}</h3>
              <span class="meta mono">{s.added.length} course{s.added.length === 1 ? '' : 's'} · {days(sum(s.added))}</span>
            </div>
            <p class="who">{s.who}</p>
            <p>{s.why}</p>
            {#if s.note}<p class="note">{s.note}</p>{/if}
            {#if s.extra}<p class="note">{s.extra}</p>{/if}
            {#if s.tips}<ul class="tips">{#each s.tips as t}<li>{t}</li>{/each}</ul>{/if}
            {#if s.added.length}
              <ol class="courses">
                {#each s.added as c}
                  <li><span class="code mono">{c}</span><span class="cn">{EDU[c].name}</span><span class="cd mono">{days(len(c))}</span><span class="cw">{why(c)}</span></li>
                {/each}
              </ol>
            {:else if !s.tips}
              <p class="note">Every course for this is already in your plan.</p>
            {/if}
          </div>
        </li>
      {/each}

      <li class="step next">
        <div class="node"><span class="num">{steps.length + 1}</span></div>
        <div class="body">
          {#if choosingBuild}
            {@const fight = track('fight')}
            <h3>Which build are you growing into?</h3>
            <div class="opts">
              {#each fight.builds as b}
                {@const add = preview(fight, b.courses)}
                <button class="opt" onclick={() => choose(fight, b.key)}>
                  <b>{b.label}</b><span>{b.note}</span><small class="mono">+{add.length} courses · {days(sum(add))}</small>
                </button>
              {/each}
            </div>
            <button class="btn-c" onclick={() => (choosingBuild = false)}>Back</button>
          {:else if options.length}
            <h3>What matters most to you next?</h3>
            <div class="opts">
              {#each options as t}
                {@const add = t.builds ? null : preview(t)}
                <button class="opt" class:deg={t.after} onclick={() => choose(t)}>
                  <b><Icon name={t.icon} /> {t.label}</b><span>{t.who}</span>
                  <small class="mono">{t.builds ? 'Choose a build' : add.length ? `+${add.length} course${add.length === 1 ? '' : 's'} · ${days(sum(add))}` : 'Advice, no courses'}</small>
                </button>
              {/each}
            </div>
          {:else}
            <h3>That's everything on this page.</h3>
            <p class="note">The rest of the catalogue is in the table below.</p>
          {/if}
        </div>
      </li>
    </ol>

    <aside class="sum card">
      <h3>Your plan</h3>
      <div class="big mono">{days(totalDays)}</div>
      <p class="note">{plan.length} courses, one after another. If you start today and never pause, you finish around <b>{finish}</b>.</p>
      <div class="row">
        <button class="btn-i" onclick={copyPlan}>Copy plan</button>
        {#if picks.length}<button class="btn-c" onclick={undo}>Undo last pick</button><button class="btn-c" onclick={reset}>Start over</button>{/if}
      </div>
      <span class="prog" aria-live="polite">{copied}</span>
      <p class="note">Your picks are saved in this browser.</p>
    </aside>
  </div>
</div></section>

<section id="all"><div class="wrap">
  <span class="eyebrow">Reference</span>
  <h2>Every course</h2>
  <p class="lede">All {allRows.length} courses from Torn's own list. Days are without any time cut. "Used for" shows which priority on this page includes the course.</p>
  <DataTable columns={['Code', 'Course', 'Subject', 'Days', 'Effect', 'Used for']} rows={allRows} />
</div></section>

<footer><div class="wrap">
  <strong>Education journey.</strong> Course lengths and effects come from Torn's API. Time cuts come from the Torn wiki's Education page. Fighting picks follow the "Educations for War/Attacking" forum guide. Company advice follows FFScouter's <a href="https://ffscouter.com/guides/working-stats" target="_blank" rel="noopener">Working Stats</a> guide. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .sub{margin:1.4rem 0 .7rem}
  .presets{display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:.7rem}
  .preset{font:inherit;text-align:start;cursor:pointer;display:grid;gap:.35rem;align-content:start;padding:.85rem .95rem;border-radius:3px;
    background:var(--surface);border:1px solid var(--border);color:var(--ink)}
  .preset:hover,.preset:focus-visible{border-color:var(--amber);outline:none;background:var(--raised)}
  .preset b{font-family:"Oswald",sans-serif;font-size:1.1rem;font-weight:600}
  .preset span{color:var(--muted);font-size:.86rem}
  .preset small{color:var(--amber);font-size:.78rem}
  .route{list-style:none;margin:.2rem 0;padding:0;display:flex;flex-wrap:wrap;gap:.25rem .3rem;font-size:.8rem;color:var(--ink)}
  .route li{background:var(--raised);border:1px solid var(--border);border-radius:2px;padding:.1rem .4rem}
  .route li + li::before{content:'→ ';color:var(--faint)}
  .speed{display:flex;flex-wrap:wrap;align-items:center;gap:.8rem 1.4rem;margin-top:1.2rem;padding:.9rem 1.1rem}
  .speed label{display:flex;align-items:center;gap:.5rem;font-size:.9rem;color:var(--ink)}
  .speed select{font:inherit;color:var(--ink);background:var(--raised);border:1px solid var(--border);border-radius:3px;padding:.3rem .5rem}
  .speed input{accent-color:var(--amber);width:1rem;height:1rem}
  .cutnote{color:var(--muted);font-size:.9rem;margin-inline-start:auto}
  .cutnote b{color:var(--amber)}

  .layout{display:grid;grid-template-columns:minmax(0,1fr) 18rem;gap:1.4rem;align-items:start;margin-top:1.4rem}
  .flow{list-style:none;margin:0;padding:0;display:grid;gap:0}
  .step{display:grid;grid-template-columns:2.6rem minmax(0,1fr);gap:.9rem;position:relative;padding-bottom:1.2rem}
  .step::before{content:'';position:absolute;inset-inline-start:1.3rem;top:2.6rem;bottom:0;width:2px;background:var(--border);transform:translateX(-1px)}
  .step.next::before{display:none}
  .node{display:flex;justify-content:center}
  .num{display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;background:var(--raised);border:2px solid var(--amber);
    font-family:"Oswald",sans-serif;font-weight:600;color:var(--amber)}
  .next .num{border-style:dashed;color:var(--muted);border-color:var(--muted)}
  .body{padding:1rem 1.1rem}
  .next .body{padding:.3rem 0 0}
  .sh{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem .7rem;color:var(--amber)}
  .sh h3{margin:0;color:var(--ink)}
  .meta{margin-inline-start:auto;color:var(--muted);font-size:.8rem}
  .who{color:var(--amber);font-size:.85rem;margin:.3rem 0 .4rem}
  .body p{margin:.3rem 0}
  .note{color:var(--muted);font-size:.88rem}
  .tips{margin:.5rem 0 0;padding-inline-start:1.2rem;color:var(--ink);font-size:.92rem}
  .tips li{margin:.25rem 0}
  .courses{list-style:none;margin:.8rem 0 0;padding:0;border-top:1px solid var(--border)}
  .courses li{display:grid;grid-template-columns:5.2rem minmax(10rem,16rem) 5rem minmax(0,1fr);gap:.3rem .8rem;align-items:baseline;
    padding:.45rem 0;border-bottom:1px solid var(--border);font-size:.9rem}
  .code{color:var(--faint);font-size:.8rem}
  .cn{color:var(--ink);font-weight:500}
  .cd{color:var(--muted);font-size:.82rem;text-align:end}
  .cw{color:var(--muted)}

  .next h3{margin:0 0 .7rem}
  .opts{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:.7rem;margin-bottom:.8rem}
  .opt{font:inherit;text-align:start;cursor:pointer;display:grid;gap:.3rem;padding:.8rem .9rem;border-radius:3px;
    background:var(--surface);border:1px solid var(--border);color:var(--ink)}
  .opt:hover,.opt:focus-visible{border-color:var(--amber);outline:none;background:var(--raised)}
  .opt b{display:flex;align-items:center;gap:.45rem;font-size:.98rem}
  .opt span{color:var(--muted);font-size:.86rem}
  .opt small{color:var(--amber);font-size:.78rem}
  .opt.deg{border-style:dashed}

  .sum{position:sticky;top:5rem;padding:1rem 1.1rem;display:grid;gap:.5rem}
  .sum h3{margin:0}
  .big{font-family:"Oswald",sans-serif;font-size:2rem;font-weight:600;color:var(--amber)}
  .row{display:flex;flex-wrap:wrap;gap:.5rem}
  .btn-i,.btn-c{font:inherit;font-size:.9rem;border-radius:3px;padding:.45rem .9rem;cursor:pointer}
  .btn-i{background:var(--amber);border:1px solid var(--amber);color:#111;font-weight:600}
  .btn-c{background:var(--surface);border:1px solid var(--border);color:var(--ink)}
  .btn-c:hover{border-color:var(--amber)}
  .prog{color:var(--muted);font-size:.85rem;min-height:1.2em}

  @media(max-width:900px){
    .layout{grid-template-columns:1fr}
    .sum{position:static;order:-1}
  }
  @media(max-width:640px){
    .courses li{grid-template-columns:4.6rem minmax(0,1fr) auto}
    .cw{grid-column:1/-1}
    .cutnote{margin-inline-start:0}
  }
</style>
