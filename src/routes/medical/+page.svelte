<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import Icon from '$lib/Icon.svelte';
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Field medicine · survival through readiness</span>
  <h1>Field <em style="color:var(--c-medic)">medicine</em></h1>
  <p class="lede">Overdoses, hospital time, medical cooldowns and blood bags — what to use, when to use it, and how to be ready before the fight instead of scrambling during it.</p>
  <p style="margin-top:.6rem"><a href="{base}/">← Back to the guide</a></p>

  <Character variant="medic" name={'Dr. "Patch" Moreau'} tag="Gloves On" initial="P" img="medic.png">
    "Sit down. Two rules: hospital time and cooldowns are resources — spend them like they cost money. And you buy medical supplies <em>before</em> you need them, not while you're bleeding on my floor."
  </Character>
</div></header>

<!-- OVERDOSE -->
<section><div class="wrap">
  <span class="eyebrow">The mistake that costs a day</span>
  <h2>Overdose (OD)</h2>
  <p class="lede">Every drug carries a chance to overdose. An OD isn't a minor setback — it's the single most expensive avoidable mistake in the medbay.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>What an OD does</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">0</span><div>Empties your <b>happy, energy and nerve</b> bars — a happy-jump's worth of progress, gone.</div></li>
        <li><span class="k"><Icon name="hospital"/></span><div>Long hospital stay, plus your <b>drug cooldown balloons — up to 24 hours</b>.</div></li>
        <li><span class="k">✗</span><div>Some drugs do extra damage on OD (life loss, stat/happy wipes). A careless Xanax can cost you a whole day of training.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>How to not do it</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k"><Icon name="timer"/></span><div><b>Respect the drug cooldown</b> — cooldowns run from under an hour (Ketamine, Cannabis) up to 6–8h (Xanax). Don't re-dose early.</div></li>
        <li><span class="k">↑</span><div>OD risk rises the more you push drugs — <b>don't stack</b> multiple drugs back-to-back chasing a jump.</div></li>
        <li><span class="k"><Icon name="pill"/></span><div>Manage addiction; a heavily-addicted player ODs more and gains less. Rehab (Switzerland) resets it.</div></li>
      </ul>
    </div>
  </div>
  <Character variant="medic" name="Patch" tag="Medic's Orders" initial="P" img="medic.png">
    "If your plan starts with 'I'll probably be fine on one more Xanax' — check your cooldown first. The 24-hour version of 'probably' is a very long day."
  </Character>
</div></section>

<!-- SUPPLIES -->
<section><div class="wrap">
  <span class="eyebrow">What to use, and when</span>
  <h2>Medical supplies</h2>
  <p class="lede">Every medical item except Opium adds to your <b>medical cooldown</b> — a separate clock from your drug cooldown. Pick the right tool for the size of the problem.</p>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>First Aid Kit <span class="tag" style="color:var(--c-medic);background:var(--medic-soft)">everyday</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">−40 min hospital, +10% life, +15 min medical cooldown. Weaker than a blood bag but <b>anyone can use one</b> — the workhorse for short hospital stays and loss-selling.</p>
    </div>
    <div class="card">
      <h3>Blood Bag <span class="tag" style="color:var(--c-medic);background:var(--medic-soft)">heavy</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">−120–180 min hospital, +30–45% life, +30 min medical cooldown (scales with education &amp; faction upgrades). Comes in blood <b>types</b>. Your main tool for big hospital chunks — stockpile before a war.</p>
    </div>
    <div class="card">
      <h3>Opium <span class="tag" style="color:var(--c-medic);background:var(--medic-soft)">panic button</span></h3>
      <p style="margin:.3em 0 0;color:var(--muted)">Removes <b>all</b> standard hospital time, +50% life, and a <b>+30% passive defense</b> buff. Costs <b>no medical cooldown</b> — but adds a 120–180 min <b>drug</b> cooldown (and drug-OD risk). The war-day emergency exit.</p>
    </div>
    <div class="card">
      <h3>Others</h3>
      <p style="margin:.3em 0 0;color:var(--muted)">Morphine and similar restore life at a heavier medical-cooldown cost; keep a couple for emergencies. Check the wiki for current exact values — Ched tweaks these.</p>
    </div>
  </div>
</div></section>

<!-- COOLDOWNS -->
<section><div class="wrap">
  <span class="eyebrow">Two clocks, not one</span>
  <h2>Hospital time &amp; cooldowns</h2>
  <div class="callout" style="border-left-color:var(--c-medic)">
    <ul class="rules">
      <li><span class="k"><Icon name="hospital"/></span><div><b>Hospital time is a resource.</b> Sometimes the right move is to <b>wait it out</b> and save your kits — don't spend a blood bag to shave off ten minutes.</div></li>
      <li><span class="k"><Icon name="plus"/></span><div><b>Medical cooldown</b> (from FAKs/blood bags) is separate from your <b>drug cooldown</b> (from Xanax/Opium). Burning one doesn't touch the other — plan both.</div></li>
      <li><span class="k"><Icon name="revive"/></span><div><b>Revives</b> — a revivable player can be pulled from hospital by a faction/paid reviver. Enable revives before a war if leadership runs a revive team.</div></li>
    </ul>
  </div>
  <Character variant="medic" name="Patch" tag="Check Your Cooldown" initial="P" img="medic.png">
    "Don't burn medical cooldown fixing a problem that time solves for free. Save the kit for when ten minutes actually matters — like a chain."
  </Character>
</div></section>

<!-- WAR PREP -->
<section><div class="wrap">
  <span class="eyebrow">Before the fight</span>
  <h2>War prep &amp; stockpiles</h2>
  <p class="lede">The best medical emergency is the one you prepared for. Going into a war, every fighter should already be holding their own supplies.</p>
  <div class="card" style="margin-top:1rem">
    <h3>The pre-war checklist</h3>
    <ul class="rules" style="margin-top:.6rem">
      <li><span class="k"><Icon name="droplet"/></span><div>A stack of <b>blood bags</b> (and know your usable types) + <b>First Aid Kits</b> for quick exits.</div></li>
      <li><span class="k"><Icon name="skull"/></span><div>An <b>Opium</b> or two as the emergency hospital-clear — but respect its drug cooldown.</div></li>
      <li><span class="k"><Icon name="pill"/></span><div>Xanax for energy, meds for life — and enough of both to last the whole war, bought <b>beforehand</b> (prices spike mid-war).</div></li>
      <li><span class="k"><Icon name="revive"/></span><div>Revives on, reviver contacts saved, medical cooldown clear before the first hit.</div></li>
    </ul>
  </div>
  <Character variant="militia" name="Rook" tag="Field Note" initial="R" img="militia.png">
    "Bring meds, bring boosters, bring a plan. Nobody complains about preparation after the fight starts — and Patch has a very slow voice for people who didn't."
  </Character>
  <Character variant="banker" name="Ledger" tag="Money Talk" initial="V" img="banker.png">
    "Medical supplies look expensive until you price an hour in hospital during a war. An unavailable fighter costs the faction far more than a blood bag."
  </Character>
</div></section>

<footer><div class="wrap">
  <strong>Field medicine.</strong> Item values from the Torn wiki
  (<a href="https://wiki.torn.com/wiki/First_Aid_Kit" target="_blank" rel="noopener">First Aid Kit</a>,
  <a href="https://wiki.torn.com/wiki/Hospital" target="_blank" rel="noopener">Hospital</a>,
  <a href="https://wiki.torn.com/wiki/Cooldown" target="_blank" rel="noopener">Cooldown</a>,
  <a href="https://wiki.torn.com/wiki/Drug" target="_blank" rel="noopener">Drugs</a>) — exact numbers change with updates, education and faction upgrades. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>
