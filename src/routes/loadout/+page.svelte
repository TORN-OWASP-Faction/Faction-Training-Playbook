<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import Icon from '$lib/Icon.svelte';

  const rifles = [
    ['Armalite', 'Top pick', 'Highest damage AND accuracy of any rifle. Reloads every 5 turns.'],
    ['Enfield', 'Great', '7 turns before reload (most of any rifle) and +3 accuracy over the Tarvor — one reload gets you ~14 turns.'],
    ['Tarvor', 'Good', 'Reloads every 5 turns; ~+2–3 damage over Enfield, but you reload more to reach the same turn count.'],
    ['Sig 552', 'Barely', 'Highest raw damage (~+1) but 5+ less accuracy than Armalite/Enfield. Only if you can\'t get the others.']
  ];
  const pistols = [
    ['BT MP9', 'Top pick', 'With Revitalize it hands you extra energy — more war hits, more respect, more retals, and it pins enemies / caps meds. The only weapon that pays for itself.'],
    ['Qsz-92', 'Assassinate', 'Best of the Assassinate pistols — big one-turn damage (needs a trigger + accuracy mod, ideally tracer ammo).'],
    ['Cobra Derringer', 'Assassinate', 'Second-best Assassinate option.'],
    ['Desert Eagle', 'Barely', 'Almost-as-high damage but very low accuracy — a fallback only.'],
    ['Milkor MGL / China Lake', 'Niche', 'Only really do the med-capping job — far less versatile than the MP9.']
  ];
  const melee = [
    ['Diamond Blade / Metal Nunchakus', 'Top pick', 'The default best melee damage/accuracy.'],
    ['Macana', 'Accuracy', 'Less damage but a lot more accuracy than the top blades.'],
    ['Kodachi', 'Damage', 'Highest damage via the +10% Japanese-blades education — but 5–7 less accuracy, so extra misses can eat the gain.']
  ];
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">War · gear for maximum output</span>
  <h1>War <em style="color:var(--c-militia)">loadout</em></h1>
  <p class="lede">When your stats are there, gear decides how much work you actually do in a war. This is the min-maxer's shortlist: of dozens of weapons, only a handful are truly viable at the top. Buy those, skip the rest.</p>
  <p style="margin-top:.6rem"><a href="{base}/">← Back to the guide</a></p>

  <Character variant="militia" name="Rook" tag="Field Note" initial="R" img="militia.png">
    "Stats first — a shiny gun on weak stats is a shiny way to lose. But once you can hold your own, the right loadout is the difference between padding the scoreboard and carrying the war. Buy a rifle before anything else."
  </Character>
</div></header>

<!-- FRAMING -->
<section><div class="wrap">
  <span class="eyebrow">Read this first</span>
  <h2>This is endgame min-maxing</h2>
  <div class="callout">
    <ul class="rules">
      <li><span class="k">1</span><div><b>Stats beat gear.</b> If you're still building, put your money into <a href="{base}/training/#money">income</a> and training — come back for the loadout when you're actually warring.</div></li>
      <li><span class="k">2</span><div><b>Most weapons are temporary.</b> Treat the ones you loot or buy as resell fodder. The only <b>permanent</b> keepers are the <b>red</b> (upgraded) versions of the weapons below.</div></li>
      <li><span class="k">3</span><div><b>The perk is half the weapon.</b> A viable weapon with the wrong perk is a mediocre weapon — chase the perks called out below, not just the base gun.</div></li>
    </ul>
  </div>
</div></section>

<!-- PRIMARY -->
<section><div class="wrap">
  <span class="eyebrow">Buy this first</span>
  <h2>Primary — rifles</h2>
  <p class="lede">Rifles out-perform everything else and should be your <b>first</b> purchase. Ranked best to worst:</p>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Rifle</th><th>Tier</th><th>Why</th></tr></thead>
    <tbody>
      {#each rifles as [name, tier, why]}<tr><td><b>{name}</b></td><td class="mono">{tier}</td><td>{why}</td></tr>{/each}
    </tbody>
  </table></div>
  <div class="card" style="margin-top:1rem">
    <h3>Best rifle perks</h3>
    <ul class="rules" style="margin-top:.6rem">
      <li><span class="k">★</span><div><b>Powerful</b> — best if you run <b>special ammo</b> (no diminishing returns, doesn't fight piercing).</div></li>
      <li><span class="k">+</span><div><b>Penetrate / Puncture</b> — the pick if you don't use special ammo often.</div></li>
      <li><span class="k">≈</span><div><b>Deadeye / Expose</b> — slightly less damage; the rare <b>double</b> Deadeye+Expose is the strongest rifle in the game.</div></li>
      <li><span class="k">→</span><div><b>Sureshot</b> vs dexterity-heavy targets; <b>Specialist</b> only on an Enfield (costs a mod slot for a Recoil Pad, but huge sustained damage).</div></li>
    </ul>
  </div>
</div></section>

<!-- SECONDARY -->
<section><div class="wrap">
  <span class="eyebrow">The war carry</span>
  <h2>Secondary — pistols</h2>
  <p class="lede">One weapon dominates this slot. Ranked best to worst:</p>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Pistol</th><th>Role</th><th>Why</th></tr></thead>
    <tbody>
      {#each pistols as [name, tier, why]}<tr><td><b>{name}</b></td><td class="mono">{tier}</td><td>{why}</td></tr>{/each}
    </tbody>
  </table></div>
  <Character variant="militia" name="Rook" tag="Faction Intel" initial="R" img="militia.png">
    "A BT MP9 with Revitalize is the one gun that earns money — every extra hit is more respect and more war payout. On a strong player it pins high-stat enemies and caps their meds so the rest of the crew can pile in freely. Get one unless your med cooldown can't keep up with the extra energy."
  </Character>
  <div class="card" style="margin-top:1rem">
    <h3>Pistol perks</h3>
    <ul class="rules" style="margin-top:.6rem">
      <li><span class="k">★</span><div><b>Revitalize</b> (BT MP9) — extra energy = more hits = more respect/retals. Nothing beats it.</div></li>
      <li><span class="k"><Icon name="skull"/></span><div><b>Stricken</b> — caps meds; good for merc hits / selling hospital time.</div></li>
      <li><span class="k">↯</span><div><b>Assassinate</b> — huge one-turn damage, but needs trigger + accuracy mods (and tracer ammo to land it), and a strong melee to back it up. Better with <b>Double Tap</b>.</div></li>
      <li><span class="k">↑</span><div><b>Motivation</b> — a 5-minute stat buff that boosts the damage of your other weapons.</div></li>
    </ul>
  </div>
</div></section>

<!-- MELEE -->
<section><div class="wrap">
  <span class="eyebrow">The backup</span>
  <h2>Melee</h2>
  <p class="lede">Melee is weaker against Parry and the 10★ Strip Club perks, but a good one backs up an Assassinate pistol. Viable picks:</p>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>Melee</th><th>Tier</th><th>Why</th></tr></thead>
    <tbody>
      {#each melee as [name, tier, why]}<tr><td><b>{name}</b></td><td class="mono">{tier}</td><td>{why}</td></tr>{/each}
    </tbody>
  </table></div>
  <div class="card" style="margin-top:1rem">
    <h3>Melee perks</h3>
    <ul class="rules" style="margin-top:.6rem">
      <li><span class="k">★</span><div><b>Fury / Rage</b> — highest overall damage (an extra attack), but RNG.</div></li>
      <li><span class="k">+</span><div><b>Penetrate / Puncture</b> — consistent damage if you dislike RNG.</div></li>
      <li><span class="k">🩸</span><div><b>Bleed</b> — best on the high-damage Kodachi.</div></li>
      <li><span class="k">◈</span><div><b>Bloodlust</b> if you're a frequent group-fight victim (pairs with EOD armor); <b>Eviscerate / Motivation</b> for a debuff/buff you apply then swap to your rifle.</div></li>
      <li><span class="k">⊘</span><div><b>Parry</b> vs melee/Plunder players; <b>Plunder</b> is for mugging, not for winning the fight.</div></li>
    </ul>
  </div>
</div></section>

<!-- AMMO / MODS -->
<section><div class="wrap">
  <span class="eyebrow">The details that stack up</span>
  <h2>Ammo &amp; mods</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Ammo</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">★</span><div><b>Special ammo</b> is what makes <b>Powerful</b> the top rifle perk — no diminishing returns.</div></li>
        <li><span class="k">→</span><div><b>Tracer ammo</b> secures an <b>Assassinate</b> hit when accuracy is tight.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Mods</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">⚙</span><div><b>Recoil Pad</b> is the mod cost of running <b>Specialist</b> on an Enfield.</div></li>
        <li><span class="k">⚙</span><div><b>Assassinate</b> needs a <b>trigger + accuracy</b> mod pair to be reliable.</div></li>
      </ul>
    </div>
  </div>
  <p class="note" style="margin-top:1rem">Armor and full mod choices are covered in the complete guide — this page distils the weapon meta. See <a href="{base}/medical/">Field medicine</a> for the meds and cooldowns that keep you in the fight.</p>
</div></section>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:.6rem">
    <span class="brandmark" style="color:var(--ink);font-size:1.2rem">TORN</span>
    <span class="mono" style="letter-spacing:.16em;font-size:.72rem;color:var(--muted)">STATS FIRST · THEN GEAR</span>
  </div>
  <strong>War loadout.</strong> Distilled from <strong>"Fight better than a top 100 player"</strong> by <strong>MasterF1re [2854737]</strong>, with the weapons section by <strong>mug [553318]</strong>, in Torn's Tutorials &amp; Guides. It's an advanced, opinionated meta — weapon values and perks shift with updates, so verify against the wiki and current market. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>
