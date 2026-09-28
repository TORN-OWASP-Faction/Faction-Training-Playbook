<script>
  import { base } from '$app/paths';
  import Character from '$lib/Character.svelte';
  import ModPlanner from '$lib/ModPlanner.svelte';
  import DATA from '$lib/data/weapon-mods.json';

  const GROUPS = [
    ['sight', 'Sights', 'Accuracy. The main accuracy line, with four tiers.'],
    ['laser', 'Lasers', 'Critical hit chance. Fits almost every gun.'],
    ['brake', 'Brakes', 'Accuracy at the cost of 3 stealth. Cheaper than sights, but can’t share a gun with a suppressor.'],
    ['grip', 'Grip', 'A little accuracy for very few credits. One tier only.'],
    ['trigger', 'Triggers', 'A big accuracy boost, but only on the first turn of a fight.'],
    ['suppressor', 'Suppressors', 'Stealth, so the target is less likely to see who hit them. Costs 5% damage.'],
    ['extmag', 'Extended mags', 'More rounds per magazine, so you reload less often.'],
    ['extramag', 'Extra mags', 'Spare magazines, so you run out of ammo later in long fights.'],
    ['recoil', 'Recoil pad', 'Fires fewer rounds per turn (25% ammo conservation), so a magazine lasts longer.'],
    ['choke', 'Chokes', 'Damage, shotguns only.'],
    ['light', 'Lights', 'Lowers your opponent’s accuracy and stealth.'],
    ['mount', 'Mounts', 'Accuracy, but you lose 30% dexterity, so you get hit more. Most players skip these.']
  ];
  const NAMES = Object.fromEntries(GROUPS.map(([id, name]) => [id, name]));
  const byGroup = (g) => DATA.mods.filter((m) => m.group === g);
  const credits = (r) => (r ? `${r[0].toLocaleString('en-US')}–${r[1].toLocaleString('en-US')}` : '—');
  const lineCost = (g) => byGroup(g).reduce((s, m) => [s[0] + m.price[0], s[1] + m.price[1]], [0, 0]);

  // Gun picker: every gun with mod slots, grouped by type, straight from Torn's item data.
  const TYPES = [...new Set(DATA.weapons.map((w) => w.type))];
  let gunId = $state(DATA.weapons.find((w) => w.name.startsWith('ArmaLite'))?.id ?? DATA.weapons[0].id);
  const gun = $derived(DATA.weapons.find((w) => w.id === gunId));
  // One gun choice drives both the planner and the fit list.
  const fits = $derived(GROUPS.filter(([g]) => byGroup(g).some((m) => gun.mods.includes(m.id))));
  const noFit = $derived(GROUPS.filter(([g]) => !byGroup(g).some((m) => gun.mods.includes(m.id))));
  const isDual = $derived(gun.name.startsWith('Dual '));
  const TYPE_PHRASE = { SMG: 'an SMG', 'Heavy artillery': 'heavy artillery', Mechanical: 'a mechanical weapon', 'Machine gun': 'a machine gun' };
  const typePhrase = (t) => TYPE_PHRASE[t] ?? `a ${t.toLowerCase()}`;
</script>

<header class="hero"><div class="wrap">
  <span class="eyebrow">Fight · mission credit upgrades</span>
  <h1>Weapon <em style="color:var(--c-militia)">mods</em></h1>
  <p class="lede">Attachments for your guns, bought with mission credits. You keep them for good and can move them from gun to gun. Here's what each one does, what it costs, what fits your gun, and when it's worth spending the credits.</p>
  <p style="margin-top:.6rem"><a href="{base}/loadout/">← War loadout</a></p>

  <Character variant="militia" name="Rook" tag="Armory Note" initial="R" img="militia.png">
    "Credits are slow to earn, so spend them where they count. A cheap tier-one sight and laser on the gun you actually fight with beats a shelf of top-tier mods you bought too early."
  </Character>
</div></header>

<!-- RULES -->
<section id="rules"><div class="wrap">
  <span class="eyebrow">How they work</span>
  <h2>The rules in one minute</h2>
  <div class="callout">
    <ul class="rules">
      <li><span class="k">1</span><div><b>Mission shop only.</b> Mods are bought with <a href="{base}/start/#missions">mission credits</a>. Cash can't buy them, so they compete with books for your credits.</div></li>
      <li><span class="k">2</span><div><b>Tiers unlock in order.</b> The next tier of a mod only shows up in the shop once you own every tier below it. There are 12 kinds of mod and 30 tiers in total.</div></li>
      <li><span class="k">3</span><div><b>They're yours to move.</b> Mods sit in your mod inventory. Attach or remove them on your equipped guns from the Items page (the <b>+</b> on the weapon). A new gun doesn't mean new mods.</div></li>
      <li><span class="k">4</span><div><b>Two per gun, different kinds.</b> Each gun takes two mods, and they have to be different kinds: a sight and a laser, not two sights. A suppressor and a brake can't go on together.</div></li>
      <li><span class="k">5</span><div><b>Guns only.</b> Primary and secondary weapons take mods; melee and temporary weapons don't. Each gun type takes different mods: <a href="#picker">check yours below</a>.</div></li>
      <li><span class="k">6</span><div><b>Dual weapons get half.</b> On dual guns (Dual Uzis, Dual 92G Berettas…) every mod gives half its bonus, and some kinds don't fit at all.</div></li>
      <li><span class="k">7</span><div><b>Watch for special offers.</b> The shop's price for a mod changes from one offer to the next, and special offers can be half price or less. It's worth waiting for one on the expensive tiers.</div></li>
    </ul>
  </div>
</div></section>

<!-- WHEN -->
<section id="when"><div class="wrap">
  <span class="eyebrow">When to buy</span>
  <h2>Match mods to your stage</h2>
  <div class="stages">
    <div class="card stage">
      <span class="tag">New player</span>
      <h3>Not yet</h3>
      <p>Early fights are won on stats, not attachments. Your first credits do more as <a href="{base}/start/#books">books</a>. Skip mods until you're fighting with a gun every day.</p>
    </div>
    <div class="card stage">
      <span class="tag">Hitting regularly</span>
      <h3>Cheap tier ones</h3>
      <p>Once you chain or make war hits with a gun you'll keep, buy the first tier of two kinds for that gun. Tier one gives by far the most per credit:</p>
      <ul>
        <li><b>1mW Laser</b>: +2% crit for {credits(DATA.mods.find((m) => m.id === 5).price)}</li>
        <li><b>Reflex Sight</b>: +1.00 accuracy for {credits(DATA.mods.find((m) => m.id === 1).price)}</li>
        <li><b>Custom Grip</b>: +0.75 accuracy for only {credits(DATA.mods.find((m) => m.id === 25).price)}</li>
      </ul>
    </div>
    <div class="card stage">
      <span class="tag">Serious war fighter</span>
      <h3>Climb the two you use</h3>
      <p>Take the two kinds your build needs up the tiers, matched to your weapon's perk (see <a href="{base}/loadout/">War loadout</a>). Wait for special offers on the top tiers; they're where the real cost is.</p>
    </div>
  </div>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>Why tier one first</h3>
      <p>A Reflex Sight gives +1.00 accuracy. Each tier after it adds only another +0.25, for about double the last tier's price. A full sight line costs {credits(lineCost('sight'))} credits for +1.75 in total, and more than half of that is the last tier alone.</p>
    </div>
    <div class="card">
      <h3>Old tiers aren't wasted</h3>
      <p>You have to buy every lower tier to unlock the next, but you keep them. When your primary gets the new sight, move the old one to your secondary.</p>
    </div>
  </div>
</div></section>

<!-- PAIRS -->
<section id="pairs"><div class="wrap">
  <span class="eyebrow">Two slots</span>
  <h2>Good pairs to start from</h2>
  <div class="tbl-scroll" style="margin-top:1rem"><table>
    <thead><tr><th>If you…</th><th>Try</th><th>Why</th></tr></thead>
    <tbody>
      <tr><td><b>Chain and war hit</b> with a rifle, pistol or SMG</td><td class="mono">Sight + Laser</td><td>Hit more often, and crit more when you do. The all-round choice.</td></tr>
      <tr><td><b>Want accuracy only</b></td><td class="mono">Sight + Grip</td><td>Two different kinds that both add accuracy. The grip is nearly free.</td></tr>
      <tr><td><b>Run an Assassinate pistol</b></td><td class="mono">Trigger + accuracy</td><td>Assassinate is one huge first-turn hit, and the trigger's bonus is first turn only. <a href="{base}/loadout/">Loadout →</a></td></tr>
      <tr><td><b>Run a Specialist Enfield</b></td><td class="mono">Recoil Pad + one</td><td>Specialist means one magazine, so the pad stretches it. <a href="{base}/loadout/">Loadout →</a></td></tr>
      <tr><td><b>Use a shotgun</b></td><td class="mono">Choke + Laser</td><td>Shotguns can't take sights; the choke adds up to 10% damage.</td></tr>
      <tr><td><b>Want quiet hits</b> (mugs, bounties)</td><td class="mono">Suppressor + Sight</td><td>Stealth hides who hit them more often. Don't pair it with a brake: they can't go on together.</td></tr>
    </tbody>
  </table></div>
  <p class="note" style="margin-top:.6rem">These are starting points, not rules. Your weapon's perk matters more than any mod.</p>
</div></section>

<!-- PLANNER -->
<section id="planner"><div class="wrap">
  <span class="eyebrow">Plan your pair</span>
  <h2>Mod planner</h2>
  <p class="lede">Pick your gun and what you want it to do. You get the two mods to aim for, and two routes to get there, step by step.</p>
  <label class="pick"><span>Your gun</span>
    <select bind:value={gunId}>
      {#each TYPES as t}
        <optgroup label={t}>
          {#each DATA.weapons.filter((w) => w.type === t) as w (w.id)}<option value={w.id}>{w.name} ({w.slot.toLowerCase()})</option>{/each}
        </optgroup>
      {/each}
    </select></label>
  <ModPlanner data={DATA} {gun} names={NAMES} />
</div></section>

<!-- PICKER -->
<section id="picker"><div class="wrap">
  <span class="eyebrow">Straight from Torn's item data</span>
  <h2>What fits your gun</h2>
  <p class="note">The <a href="#planner">{gun.name}</a> is {typePhrase(gun.type)} and takes {fits.length} of the 12 kinds of mod.{isDual ? ' As a dual weapon, every mod gives it half the bonus.' : ''}</p>
  <div class="fitgrid">
    {#each fits as [g, name, what]}
      <div class="fit card">
        <b>{name}</b>
        <span>{byGroup(g).filter((m) => gun.mods.includes(m.id)).map((m) => m.name).join(' → ')}</span>
        <small>{what}</small>
      </div>
    {/each}
  </div>
  {#if noFit.length}<p class="note">Doesn't fit: {noFit.map(([, name]) => name).join(', ')}.</p>{/if}
</div></section>

<!-- EVERY MOD -->
<section id="all"><div class="wrap">
  <span class="eyebrow">Every mod and price</span>
  <h2>All 30 mods</h2>
  <p class="lede">Prices are in mission credits: the range players have seen in the shop, and the lower range seen as special offers.</p>
  <div class="modgrid">
    {#each GROUPS as [g, name, what]}
      {@const list = byGroup(g)}
      <div class="card modcard">
        <h3>{name}</h3>
        <p class="what">{what}</p>
        <div class="tbl-scroll"><table class="mods">
          <thead><tr><th>Tier</th><th>Mod</th><th>Effect</th><th class="num">Credits</th><th class="num">Offer</th></tr></thead>
          <tbody>
            {#each list as m (m.id)}<tr><td class="mono">{m.tier}</td><td>{m.name}</td><td>{m.effect}</td><td class="num mono">{credits(m.price)}</td><td class="num mono">{credits(m.offer)}</td></tr>{/each}
          </tbody>
        </table></div>
        <p class="fits"><b>Fits:</b> {list[0].fits.join(', ')}{#if list.length > 1} · <b>whole line:</b> {credits(lineCost(g))}{/if}</p>
      </div>
    {/each}
  </div>
</div></section>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:.6rem">
    <span class="brandmark" style="color:var(--ink);font-size:1.2rem">TORN</span>
    <span class="mono" style="letter-spacing:.16em;font-size:.72rem;color:var(--muted)">TIER ONE FIRST · THEN CLIMB</span>
  </div>
  <strong>Weapon mods.</strong> Mods, effects and which guns take them come from the Torn API (checked {DATA.fetched}). Prices are from the <a href="https://wiki.torn.com/wiki/Weapon_Mod" target="_blank" rel="noopener">Weapon Mod wiki page</a>, compiled by <strong>Lord_Gorgen [1629756]</strong> in his <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=15979865" target="_blank" rel="noopener">Weapon mods guide</a>, with weapon types from <strong>Andyman [471591]</strong>'s <a href="https://www.torn.com/forums.php#/p=threads&f=61&t=16173680" target="_blank" rel="noopener">Weapon Attachments by Weapon Type</a>. Mod images are Torn's, via the Torn wiki. Shop prices move, so treat them as a guide. Part of the <a href="{base}/">Faction Training Playbook</a>.
</div></footer>

<style>
  .stages{display:grid;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr));gap:1rem;margin-top:1rem}
  .stage{display:grid;gap:.4rem;align-content:start}
  .stage h3{margin:0}
  .stage p{margin:0}
  .stage ul{margin:.2rem 0 0;padding-inline-start:1.1rem;display:grid;gap:.25rem;font-size:.92rem}
  .tag{font-family:"IBM Plex Mono",monospace;font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:var(--c-militia)}
  .pick{display:grid;gap:.3rem;max-width:26rem;margin-top:1rem;font-size:.88rem;color:var(--muted)}
  .pick select{font:inherit;font-size:.95rem;color:var(--ink);background:var(--bg2);border:1px solid var(--border);border-radius:3px;padding:.5rem .6rem}
  .fitgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(15rem,1fr));gap:.7rem;margin-top:1rem}
  .fit{display:grid;gap:.25rem;border-radius:3px;padding:.8rem 1rem}
  .fit span{font-size:.9rem}
  .fit small{color:var(--muted);font-size:.82rem}
  .modgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,30rem),1fr));gap:1rem;margin-top:1rem}
  .modcard{display:grid;gap:.5rem;align-content:start}
  .modcard h3,.modcard p{margin:0}
  .what{color:var(--muted);font-size:.92rem}
  table.mods{min-width:30rem;font-size:.86rem}
  table.mods td,table.mods th{padding:.45rem .6rem}
  .fits{font-size:.85rem;color:var(--muted)}
  .num{text-align:end;white-space:nowrap}
  .note{color:var(--muted);font-size:.88rem}
</style>
