<script>
  import { base } from '$app/paths';
</script>

<header class="hero"><div class="wrap">
  <span class="hero-badge">NERVE INTO PROGRESS</span>
  <h1>Crimes <em>2.0</em></h1>
  <p class="lede">Crimes turn a bar you'd otherwise waste into money, items, and the crime experience that powers Organized Crimes. Here's how the system works, how to grow it safely, and what each crime is actually good for.</p>

  <div class="say fixer">
    <div class="av"><span class="mono-badge">N</span><img src="{base}/assets/nico.png" alt=""></div>
    <div><div><span class="nm">Nico "The Line"</span><span class="tag">Word on the Street</span></div>
      <p class="line">"Nerve's just money you haven't collected yet. Spend it before it caps — but spend it on crimes you can actually pull off. Get greedy early and you'll pay for it."</p></div>
  </div>
</div></header>

<section><div class="wrap">
  <div class="callout" style="border-left-color:var(--c-fixer)">
    <h3>Interactive drop-table data</h3>
    <p style="margin:.3em 0 .7em;color:var(--muted)">Community-compiled droptables and rates, converted to sortable/filterable tables (credit: Emforus [2535044]).</p>
    <div style="display:flex;gap:.6rem;flex-wrap:wrap">
      <a class="hero-badge" href="{base}/crimes/burglary/" style="text-decoration:none">Burglary →</a>
      <a class="hero-badge" href="{base}/crimes/shoplifting/" style="text-decoration:none">Shoplifting →</a>
      <a class="hero-badge" href="{base}/crimes/cracking/" style="text-decoration:none">Cracking →</a>
      <a class="hero-badge" href="{base}/crimes/forgery/" style="text-decoration:none">Forgery →</a>
    </div>
  </div>
</div></section>

<!-- HOW -->
<section id="how"><div class="wrap">
  <span class="eyebrow">The system</span>
  <h2>How crimes work</h2>
  <div class="grid2" style="margin-top:1.2rem">
    <div class="card">
      <h3>Two things you earn</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">CS</span><div><b>Crime Skill</b> — a level with a progress bar, tracked <b>per crime</b>. It's the number you watch climb as you specialise.</div></li>
        <li><span class="k">CE</span><div><b>Crime Experience</b> — hidden, shared across all crimes. It sets your <b>Natural Nerve Bar</b> and feeds <b>Organized Crime</b> success. This is the one that matters faction-wide.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Three outcomes</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">✓</span><div><b>Success</b> — cash and/or items, plus CE and CS.</div></li>
        <li><span class="k">–</span><div><b>Fail</b> (orange) — no reward, but no loss either.</div></li>
        <li><span class="k">✗</span><div><b>Critical fail</b> (red) — lose CE and CS (can drop a whole level), plus jail, hospital, or lost items/cash.</div></li>
      </ul>
    </div>
  </div>
  <p style="color:var(--muted);margin-top:1rem">Every crime costs <b>Nerve</b>. Your nerve bar refills over time — the whole game is spending it on the right crime before it sits full.</p>
</div></section>

<!-- NERVE / CE -->
<section id="nerve"><div class="wrap">
  <span class="eyebrow">Grow it safely</span>
  <h2>Build your nerve (CE)</h2>
  <p class="lede">Your Natural Nerve Bar rises in steps of 5 as your hidden CE crosses thresholds — and each step gets harder to reach. Higher CE also raises your success chance and unlocks harder crimes.</p>

  <div class="say militia">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div><div><span class="nm">Rook</span><span class="tag">Faction Intel</span></div>
      <p class="line">"CE isn't just your nerve bar — it's what makes you useful in an Organized Crime. Build it steady now and you're an asset when the faction needs bodies for an OC. Waste your bar and you're dead weight."</p></div>
  </div>

  <div class="callout" style="margin-top:1.1rem">
    <h3>The one rule: don't over-reach</h3>
    <p style="margin:.4rem 0 0;color:var(--muted)">A <b>critical fail cuts your CE by a percentage</b>, not a flat amount — one or two bad results on a high-nerve crime can erase days of progress. Only move up to a harder crime as your natural nerve bar rises. When in doubt, grind the crime you pass reliably.</p>
  </div>

  <div class="card" style="margin-top:1rem">
    <h3>Raise your success rate</h3>
    <ul class="rules" style="margin-top:.6rem">
      <li><span class="k">+2%</span><div>Buy the crime's <b>enhancer item</b> early — you'll do thousands of attempts, so 2% is a lot of extra successes.</div></li>
      <li><span class="k">☺</span><div><b>Happiness</b> and <b>merits</b> both help — the same happy that boosts gym gains helps crimes.</div></li>
      <li><span class="k">🎓</span><div><b>Bachelor of Psychological Sciences</b> (education) and the <b>Federal Judge</b> rank in the Law city job.</div></li>
      <li><span class="k">⚑</span><div>The faction <b>Criminality</b> upgrade tree — a faction-wide boost worth pushing for.</div></li>
    </ul>
  </div>
  <div class="say banker">
    <div class="av"><span class="mono-badge">V</span><img src="{base}/assets/banker.png" alt=""></div>
    <div><div><span class="nm">Ledger</span><span class="tag">Worth the Cost?</span></div>
      <p class="line">"The enhancer pays for itself. Over thousands of attempts, two percent more successes is a return most investments would envy. Buy it the day you commit to a crime."</p></div>
  </div>
</div></section>

<!-- OC / FACTION -->
<section id="oc"><div class="wrap">
  <span class="eyebrow">Why your grind matters to everyone</span>
  <h2>Your crimes power the faction's OCs</h2>
  <p class="lede">Individual crimes aren't just personal income — they're the fuel for <b>Organized Crimes (OC 2.0)</b>, one of a faction's biggest sources of cash, items and respect. The whole thing runs on a chain that starts with you doing crimes.</p>

  <div class="card" style="margin-top:1.2rem">
    <h3>The chain</h3>
    <p class="mono" style="margin:.5rem 0 0;color:var(--c-fixer);font-size:.86rem;letter-spacing:.02em">
      do crimes → raise CE → raise NNB → higher CPR → OC succeeds → faction cash · items · respect · Scope</p>
    <p style="margin:.6rem 0 0;color:var(--muted)">Your <b>CPR (Checkpoint Pass Rate)</b> — your success chance in an OC role — is driven mainly by your <b>Natural Nerve Bar</b>, and NNB only rises by committing crimes. No crime grind, no NNB, no CPR: you become the slot that drags the whole crew's payout down.</p>
  </div>

  <div class="say militia">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div><div><span class="nm">Rook</span><span class="tag">Faction Intel</span></div>
      <p class="line">"An OC is only as strong as its weakest slot. Every crime you grind on a quiet day is you keeping your CPR up so you don't cost the crew a payout. Skip it and you're the reason we fail — and everyone sees whose number was red."</p></div>
  </div>

  <div class="grid2" style="margin-top:1.1rem">
    <div class="card">
      <h3>Roles &amp; CPR</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">%</span><div>An OC has <b>slots (roles)</b>. Each open slot shows a coloured <b>success chance</b> for you — that's your CPR for that role.</div></li>
        <li><span class="k">NNB</span><div>CPR rises mainly with your <b>NNB</b> (crimes), plus the role's <b>required item</b>. Put people in roles they actually pass.</div></li>
        <li><span class="k">?</span><div>There's a hidden factor too — an OC can occasionally clear even with a lower score — but don't plan around luck.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Tiers &amp; rewards</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">1–10</span><div>OCs run in difficulty tiers. Higher tier = higher CPR required, but <b>~double the rewards</b> of the tier below (cash, items, respect).</div></li>
        <li><span class="k">↑</span><div>Building NNB is what unlocks the bigger, better-paying OC roles. Your personal grind is the faction's access to the top tiers.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Scope — the faction's fuel</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">⛽</span><div>Spawning an OC costs <b>Scope</b>. A faction starts at <b>25</b>, caps at <b>100</b>, and it only regenerates <b>+1/day</b>.</div></li>
        <li><span class="k">+</span><div>You earn <b>1 + the OC's tier</b> in Scope for each one you <b>clear</b> — so successes fund more OCs; failures burn Scope for nothing.</div></li>
        <li><span class="k">✓</span><div>That's why members' readiness matters faction-wide: the faction should only run OCs its people can pass, or it bleeds Scope.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>Boost OC success</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">⚑</span><div>The same crime boosters carry over: <b>happy, merits, education, the faction Criminality tree</b>.</div></li>
        <li><span class="k">🏢</span><div>A <b>Law Firm</b> company special boosts OC success — handy if a member works there.</div></li>
        <li><span class="k">🎒</span><div>Bring the role's <b>required item</b> — a missing item can block an otherwise-ready member (this is where the faction armory earns its keep).</div></li>
      </ul>
    </div>
  </div>

  <div class="say banker">
    <div class="av"><span class="mono-badge">V</span><img src="{base}/assets/banker.png" alt=""></div>
    <div><div><span class="nm">Ledger</span><span class="tag">Money Talk</span></div>
      <p class="line">"Rewards roughly double every tier. A faction that keeps its members' CPR high and its Scope funded is running a compounding income line — not busywork. Treat OC readiness as an asset on the books."</p></div>
  </div>

  <div class="callout" style="margin-top:1.1rem">
    <h3>What it means for staff</h3>
    <p style="margin:.4rem 0 0;color:var(--muted)">Match each member to the highest role they reliably pass, make sure they have the required item (loan from the armory if not), and time slot-filling to when people finish their current OC. Don't leave a high-NNB member sitting in a low role — that's value left on the table. (This is exactly what the faction bot's OC optimizer is built to automate.)</p>
  </div>
</div></section>

<!-- THE CRIMES -->
<section id="list"><div class="wrap">
  <span class="eyebrow">Pick your lane</span>
  <h2>The crimes</h2>
  <p class="lede">Twelve crimes across six categories (more on the way). Some are money, some are pure skill/CE, some drop items, some are time-gated. Specialise, but keep your CE climbing.</p>

  <div class="cat">
    <div class="cat-h">Theft</div>
    <div class="crimes">
      <div class="crime"><div class="top"><span class="nm">Search for Cash</span><span class="pill money">Money</span></div><p>The starter. Search spots (Trash, Subway, Junkyard; unlock Beach, Cemetery, Fountain) for cash and items. Your bread-and-butter early earner and CE builder.</p></div>
      <div class="crime"><div class="top"><span class="nm">Shoplifting</span><span class="pill items">Items</span></div><p>Lift goods from shops — a source of candy, jewelry and <b>rings</b> (yes, wedding rings). Learn each shop's drop rates.</p></div>
      <div class="crime"><div class="top"><span class="nm">Pickpocketing</span><span class="pill skill">Skill</span></div><p>Fast and low-risk, but light on income. Great for grinding CS/CE without much downside.</p></div>
      <div class="crime"><div class="top"><span class="nm">Burglary</span><span class="pill money">Money</span></div><p>Break into houses — scout first, mind the drop tables and safety. Higher-value hauls once you can handle it.</p></div>
    </div>
  </div>

  <div class="cat">
    <div class="cat-h">Counterfeiting</div>
    <div class="crimes">
      <div class="crime"><div class="top"><span class="nm">Bootlegging</span><span class="pill money">Money</span></div><p>Copy and sell media on a timer — a steady, semi-passive earner once your setup is running.</p></div>
      <div class="crime"><div class="top"><span class="nm">Forgery</span><span class="pill items">Items</span></div><p>Forge documents (ID badges, ATM keys) from material components on timers, with fixed item outputs. More parts to juggle than Bootlegging.</p></div>
    </div>
  </div>

  <div class="cat">
    <div class="cat-h">Vandalism</div>
    <div class="crimes">
      <div class="crime"><div class="top"><span class="nm">Graffiti</span><span class="pill skill">Skill</span></div><p>Tag locations with color/location mechanics — a low-risk CS/CE builder.</p></div>
      <div class="crime"><div class="top"><span class="nm">Arson</span><span class="pill skill">Skill</span></div><p>Newer vandalism crime — burn targets. Note it can <b>hospitalize</b> you rather than jail you.</p></div>
    </div>
  </div>

  <div class="cat">
    <div class="cat-h">Fraud</div>
    <div class="crimes">
      <div class="crime"><div class="top"><span class="nm">Card Skimming</span><span class="pill money">Money</span></div><p>Skim card data from machines on time-dependent windows. Fail and you can <b>lose your card details</b> — timing matters.</p></div>
      <div class="crime"><div class="top"><span class="nm">Hustling</span><span class="pill money">Money</span></div><p>Street cons and hustles for cash.</p></div>
      <div class="crime"><div class="top"><span class="nm">Scamming</span><span class="pill money">Money</span></div><p>The most complex crime yet — work the <b>mark</b> and <b>persuasion</b> bars; even player age factors in. High skill ceiling.</p></div>
    </div>
  </div>

  <div class="cat">
    <div class="cat-h">Illicit Services</div>
    <div class="crimes">
      <div class="crime"><div class="top"><span class="nm">Disposal</span><span class="pill time">Time-gated</span></div><p>A daily-job system — the most time-gated crime out. Patience is the whole game here.</p></div>
    </div>
  </div>

  <div class="cat">
    <div class="cat-h">Cybercrime</div>
    <div class="crimes">
      <div class="crime"><div class="top"><span class="nm">Cracking</span><span class="pill skill">Skill</span></div><p>Crack passwords, Wordle-style — a mix of Disposal and Pickpocketing. Puzzle-brained players do well here.</p></div>
    </div>
  </div>
</div></section>

<!-- PLAN -->
<section id="plan"><div class="wrap">
  <span class="eyebrow">The play</span>
  <h2>What to actually do</h2>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">1</span><div><b>Never sit on a full nerve bar</b> — that's wasted CE and cash, same as capped energy is wasted stats.</div></li>
      <li><span class="k">2</span><div><b>Grind the hardest crime you pass reliably</b>, not the hardest one available. Move up only as your natural nerve bar rises.</div></li>
      <li><span class="k">3</span><div><b>Buy the enhancer</b> for your main crime immediately (+2% over thousands of attempts).</div></li>
      <li><span class="k">4</span><div><b>Money now vs. CE for later:</b> chase the money crimes (Search for Cash, Bootlegging, Burglary, Card Skimming, Scamming) when you need cash; grind the safe ones to bank CE for OCs.</div></li>
      <li><span class="k">5</span><div><b>Stack success boosters</b> — happy, merits, education, Law job, faction Criminality tree.</div></li>
    </ul>
  </div>
  <div class="say fixer">
    <div class="av"><span class="mono-badge">N</span><img src="{base}/assets/nico.png" alt=""></div>
    <div><div><span class="nm">Nico "The Line"</span><span class="tag">There's Another Way</span></div>
      <p class="line">"Crimes are the one earner nobody can mug off you — it's already in your pocket by the time you look up. Slow, steady, and yours. Ledger approves. That should tell you something."</p></div>
  </div>
</div></section>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:.6rem">
    <span class="brandmark" style="color:var(--ink);font-size:1.2rem">TORN</span>
    <span class="mono" style="letter-spacing:.16em;font-size:.72rem;color:var(--muted)">SLOW MONEY IS STILL MONEY</span>
  </div>
  <strong>Crimes 2.0.</strong> Part of the <a href="{base}/">Faction Training Playbook</a>. Summarized from the community Crimes 2.0 in-depth guides and the Torn wiki; per-crime mechanics change as crimes are updated — check the wiki or a crime's guide for exact drop tables and numbers.
  <p class="note">Sources: Torn wiki (<a href="https://wiki.torn.com/wiki/Crimes_2.0" target="_blank" rel="noopener">Crimes 2.0</a>, <a href="https://wiki.torn.com/wiki/Organized_Crime_2.0" target="_blank" rel="noopener">Organized Crime 2.0</a>) &amp; the community per-crime and OC 2.0 guides. Scope, CPR and tier details per the OC 2.0 wiki; exact numbers can change.</p>
</div></footer>
