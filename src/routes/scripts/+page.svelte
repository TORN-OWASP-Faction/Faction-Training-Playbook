<script>
  import { base } from '$app/paths';
  import Icon from '$lib/Icon.svelte';
  import REVIEW from '$lib/data/script-review.json';
  import SITES from '$lib/data/site-review.json';
  import CodeViewer from '$lib/CodeViewer.svelte';

  let viewing = $state(null); // the script whose code is open

  const link = (html) => html.replace(/href="\//g, `href="${base}/`);

  const byName = Object.fromEntries(REVIEW.map((r) => [r.name, r]));

  // Our picks for newer players, grouped by what they help with. All reviewed Low risk except where noted.
  const PICKS = [
    ['Training and merits', ['GymIQ - Ratio Helper', 'Happy Jump Calculator', "Solenya's Merits Tracker", 'Merit Hunter+ QoL for Honors & Medals', 'Prayer Reminder']],
    ['Crimes', ['Crime Profitability', 'Crimes Rewards Value', 'Crimes 2.0 Hub', 'Arson Bang for Buck', 'Burglary Confidence Display', 'Pickpocketing Target Filter', 'Crime Morale - Scamming Solver', 'Disposal Helper', 'Shoplifting Monitor']],
    ['Money, travel and items', ['Torn Foreign Stock', 'Droqs Overseas Stock Reporter', 'Show Bazaar Listings in Market', 'Bazaar Filler', 'QOL: Item Intel', "Rem4rk's Item Wiki Links"]],
    ['Everyday', ['Torn Quick-Nav Hotkeys', 'Custom & Nearest Torn Events', 'Mission Reward Info', 'Descriptive Mission Titles', 'Torn Racing Guide']]
  ];

  // Plain-language reasons for the ones we'd steer players away from.
  const AVOID = [
    ['Trade Reputation', 'Its setup box says your key stays in your browser, but it sends the key to the author\'s own server on every lookup and vote, and uploads your Events page. It asks for a Public key, which limits the damage, but the claim is false.'],
    ['Torn Spy - Bazaar', 'Its server fills parts of Torn pages with its own content, including who you pay and how much when you buy a report. It also reports every profile and faction page you look at.'],
    ['Bookie Predictor', 'Says your key stays in your browser, then sends it with every request to the author\'s server. It also places bets with its own requests instead of Torn\'s bet form.'],
    ['Bootlegging Auto Genre Script', 'Clicks a crime button by itself when the page loads. Small, but it\'s automation, which Torn\'s rules ban.']
  ];

  let q = $state('');
  let risk = $state('All');
  let cat = $state('All');
  const CATS = ['All', ...new Set(REVIEW.map((r) => r.type))];
  const shown = $derived(REVIEW.filter((r) =>
    (risk === 'All' || r.risk === risk) && (cat === 'All' || r.type === cat) &&
    (!q.trim() || (r.name + ' ' + r.what).toLowerCase().includes(q.toLowerCase()))));
  const count = (level) => REVIEW.filter((r) => r.risk === level).length;
</script>

<svelte:head><title>Scripts &amp; tools · Faction Training Playbook</title></svelte:head>

<header class="hero"><div class="wrap">
  <span class="hero-badge">SET UP BEFORE THE FIGHT</span>
  <h1>Scripts &amp; <em>Tools</em></h1>
  <p class="lede">Torn's default UI hides half the game. These are the tools serious players run — what each one does and how to set it up. All read-only, all using your own API key.</p>

  <div class="say">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div><div><span class="nm">Rook</span><span class="tag">Field Note</span></div>
      <p class="line">"Nobody complains about preparation after the fight starts. Get these installed while it's quiet — you'll understand why when it isn't."</p></div>
  </div>
</div></header>

<!-- PREREQS -->
<section id="prereqs"><div class="wrap">
  <span class="eyebrow">Before anything else</span>
  <h2>Two things you need first</h2>
  <div class="grid" style="display:grid;gap:1rem;grid-template-columns:1fr 1fr;margin-top:1.2rem">
    <div class="card">
      <h3>A script manager</h3>
      <p class="what" style="color:var(--muted)">Userscripts (like FFScouter) run inside a script manager extension. Install one first:</p>
      <ul class="rules" style="margin-top:.7rem">
        <li><span class="k">PC</span><div><b>Tampermonkey</b> (Chrome / Edge / Safari) or <b>Violentmonkey</b>. Firefox supports both.</div></li>
        <li><span class="k"><Icon name="phone"/></span><div>Mobile: <b>Torn PDA</b> runs userscripts built-in; on Android, <b>Kiwi Browser</b> can install Chrome extensions.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>API keys — one per tool</h3>
      <p class="what" style="color:var(--muted)">Each tool needs a Torn API key. Make a <b>separate key per tool</b> with the <b>minimum access</b> it needs (Limited or Custom), at torn.com → Settings → API Key.</p>
      <ul class="rules" style="margin-top:.7rem">
        <li><span class="k">✓</span><div>Separate keys let you see each tool's usage in your key history and revoke just that one if needed.</div></li>
        <li><span class="k">✗</span><div>Never paste a <b>Full</b>-access key into a random script.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<!-- TOOLS -->
<section id="tools"><div class="wrap">
  <span class="eyebrow">The kit</span>
  <h2>The tools worth running</h2>
  <div class="tools">

    <div class="card tool">
      <div class="hd"><h3>TornTools</h3><span class="type">Extension</span></div>
      <p class="what">The big one — a browser extension that overlays quality-of-life everywhere in Torn: market values, travel, chain timer, OC, faction and inventory helpers.</p>
      <ol>
        <li>Install from the Chrome Web Store or Firefox Add-ons.</li>
        <li>Click the TornTools icon by the address bar.</li>
        <li>Paste a Limited API key; toggle the features you want.</li>
        <li>Android: install via <b>Kiwi Browser</b>.</li>
      </ol>
      <div class="link"><a href="https://torntools.tornplayground.eu/" target="_blank" rel="noopener">torntools.tornplayground.eu ↗</a></div>
    </div>

    <div class="card tool">
      <div class="hd"><h3>FF Scouter (V2)</h3><span class="type">Userscript</span></div>
      <p class="what">Shows an estimated <b>Fair Fight / target strength</b> on profiles and attack lists — so you pick fights you win and chain efficiently. Its site also runs a <b>Sell/Buy Losses</b> service with <b>prepaid contracts</b> — a safe, automatic way to sell losses (no scams, auto-verified, paid within the hour).</p>
      <ol>
        <li>Install Tampermonkey (above).</li>
        <li>Register your 16-char key at <b>ffscouter.com</b> (paste key, accept terms, Sign Up).</li>
        <li>Install "FF Scouter V2" from Greasy Fork → Install.</li>
        <li>On your Torn profile, open <b>FF Scouter Settings</b>, paste the key, Verify.</li>
        <li>To sell losses: go to <b>ffscouter.com → Sell Losses</b>, claim a prepaid slot, hit the target until you lose — it pays out automatically.</li>
      </ol>
      <div class="link"><a href="https://ffscouter.com/guides/ff-scouter-v2-installation" target="_blank" rel="noopener">install guide ↗</a> · <a href="https://ffscouter.com/sell-losses" target="_blank" rel="noopener">Sell Losses ↗</a></div>
    </div>

    <div class="card tool">
      <div class="hd"><h3>OC Success Chance</h3><span class="type">Userscript</span></div>
      <p class="what">On the faction OC page, Torn only shows each member's <b>per-slot</b> chance. This overlays the <b>whole crew's</b> computed success chance on every crime — so leaders can see at a glance which OCs are actually ready to run and which will bleed Scope.</p>
      <ol>
        <li>Install Tampermonkey / Violentmonkey (above).</li>
        <li>Open the Greasy Fork page and click <b>Install</b>.</li>
        <li>Go to <b>Faction → Organized Crimes</b>; a "Success Chance: %" line appears under each OC title.</li>
        <li>No API key needed — it reads the page and asks the tornprobability model for the team number.</li>
      </ol>
      <div class="link"><a href="https://greasyfork.org/en/scripts/526834-oc-success-chance-2-0" target="_blank" rel="noopener">greasyfork.org · OC Success Chance 2.0 ↗</a></div>
    </div>

    <div class="card tool">
      <div class="hd"><h3>TornStats</h3><span class="type">Website + script</span></div>
      <p class="what">Enemy <b>spies</b> (estimated stats), chain &amp; war tools, faction roster and stat tracking. A staple for war prep.</p>
      <ol>
        <li>Go to tornstats.com and sign in with your Torn API key.</li>
        <li>Optionally install its companion extension/script for in-page overlays.</li>
        <li>Import/refresh your faction and spies before a war.</li>
      </ol>
      <div class="link"><a href="https://www.tornstats.com/" target="_blank" rel="noopener">tornstats.com ↗</a></div>
    </div>

    <div class="card tool">
      <div class="hd"><h3>YATA</h3><span class="type">Website</span></div>
      <p class="what">Torn-endorsed helper site: chain &amp; target lists, travel / foreign-stock, awards tracking and faction tools.</p>
      <ol>
        <li>Go to yata.yt and sign in with your API key.</li>
        <li>Use the travel &amp; awards sections; sync targets for chaining.</li>
      </ol>
      <div class="link"><a href="https://yata.yt/" target="_blank" rel="noopener">yata.yt ↗</a></div>
    </div>

    <div class="card tool">
      <div class="hd"><h3>Torn PDA</h3><span class="type">Mobile app</span></div>
      <p class="what">The best way to play Torn on a phone — loads Torn with <b>userscript support</b> and API-powered shortcuts. iOS &amp; Android.</p>
      <ol>
        <li>Install from the App Store / Play Store.</li>
        <li>Add a Limited API key.</li>
        <li>Enable the userscripts you want (e.g. FF Scouter) inside the app.</li>
      </ol>
      <div class="link"><a href="https://github.com/Manuito83/torn-pda" target="_blank" rel="noopener">Torn PDA ↗</a></div>
    </div>

  </div>
  <p class="note">YATA, TornStats and Torn PDA are third-party but Torn-endorsed. TornTools, FF Scouter and OC Success Chance are community userscripts/extensions. Exact install screens change — follow each tool's own guide if a step looks different.</p>
</div></section>

<!-- MORE PICKS -->
<section id="picks"><div class="wrap">
  <span class="eyebrow">Checked, then picked</span>
  <h2>More scripts worth adding</h2>
  <p class="lede">We read the source of {REVIEW.length} community scripts. These are the ones we'd give a newer player: useful, readable, and within Torn's rules. Install them from Greasy Fork through Tampermonkey (or Torn PDA on mobile).</p>
  {#each PICKS as [group, names]}
    <h3 class="grp">{group}</h3>
    <div class="picks">
      {#each names as name}
        {@const r = byName[name]}
        {#if r}
          <div class="pick card">
            <a class="pn" href={r.url} target="_blank" rel="noopener">{r.name} <span aria-hidden="true">↗</span></a>
            <span class="pw">{r.what}</span>
            <span class="badges"><span class="risk {r.risk.toLowerCase()}">{r.risk} risk</span><span class="kb">{r.key}</span></span>
            <span class="acts">
              <a class="btn-i" href={r.install}>Install</a>
              <button class="btn-c" onclick={() => (viewing = r)}>View code</button>
            </span>
          </div>
        {/if}
      {/each}
    </div>
  {/each}
  <p class="note"><b>Install</b> opens your script manager's install screen (Tampermonkey or Violentmonkey). On Torn PDA, add the script from the app's userscript settings instead. <b>View code</b> shows the live source so you can check it yourself.</p>
  <p class="note">Show Bazaar Listings is rated Medium only because it shares the auction listings you view with TornW3B; it sends no key. Droqs and Mission Reward Info share shop stock and reward prices you see, anonymously. That's how they crowdsource their data.</p>
</div></section>

<!-- AVOID -->
<section id="avoid"><div class="wrap">
  <span class="eyebrow">Read before you install</span>
  <h2>Scripts to avoid</h2>
  <p class="lede">Out of {REVIEW.length}, {count('High')} are ones we'd tell players to skip. None is outright malware, but each breaks trust or Torn's rules:</p>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      {#each AVOID as [name, why]}<li><span class="k">✗</span><div><b>{name}.</b> {why}</div></li>{/each}
    </ul>
  </div>
  <p class="note">About a dozen more sit in a grey area: one click triggers a different action than the button shows, or a script asks for a Full key or log access it doesn't strictly need. They're marked in the table below.</p>
</div></section>

<!-- WEBSITES -->
<section id="sites"><div class="wrap">
  <span class="eyebrow">Beyond userscripts</span>
  <h2>Websites we checked</h2>
  <p class="lede">From the same collection and the community Notion list. Before you give any site a key, look for Torn's key disclosure: what it stores, who it shares with, and the lowest access it needs.</p>

  <h3 class="grp">Recommended</h3>
  <div class="picks">
    {#each SITES.recommend as [name, url, what, key, note]}
      <a class="pick card" href={url} target="_blank" rel="noopener">
        <span class="pn">{name} <span aria-hidden="true">↗</span></span>
        <span class="pw">{what}{#if note} <em>{note}</em>{/if}</span>
        <span class="badges"><span class="kb">{key}</span></span>
      </a>
    {/each}
  </div>

  <h3 class="grp">Good for some players</h3>
  <div class="tbl-scroll"><table class="rev">
    <thead><tr><th>Site</th><th>What it does</th><th>API key</th></tr></thead>
    <tbody>
      {#each SITES.some as [name, url, what, key, note]}
        <tr><td class="nm"><a href={url} target="_blank" rel="noopener">{name}</a></td><td class="why">{what}{#if note}<small>{@html link(note)}</small>{/if}</td><td class="kc">{key}</td></tr>
      {/each}
    </tbody>
  </table></div>

  <div class="grid2" style="margin-top:1.2rem;align-items:start">
    <div class="callout">
      <h3 style="margin-bottom:.5rem">Use with care</h3>
      <ul class="rules">
        {#each SITES.caution as [name, url, why]}<li><span class="k">!</span><div><a href={url} target="_blank" rel="noopener"><b>{name}</b></a>: {why}</div></li>{/each}
      </ul>
    </div>
    <div class="card">
      <h3 style="margin-bottom:.5rem">Skip</h3>
      <ul class="rules">
        {#each SITES.skip as [name, why]}<li><span class="k">✗</span><div><b>{name}</b>: {why}</div></li>{/each}
      </ul>
    </div>
  </div>
</div></section>

<!-- FULL REVIEW -->
<section id="checked"><div class="wrap">
  <span class="eyebrow">All {REVIEW.length}</span>
  <h2>Every script we checked</h2>
  <p class="lede">From Shaul's script collection. Filter by risk or type, or search by name.</p>
  <div class="filters">
    <input type="search" placeholder="Search scripts" bind:value={q} aria-label="Search scripts" />
    <div class="chips" role="group" aria-label="Risk">
      {#each ['All', 'Low', 'Medium', 'High'] as level}
        <button class="chip" aria-pressed={risk === level} onclick={() => (risk = level)}>{level}{level !== 'All' ? ` (${count(level)})` : ''}</button>
      {/each}
    </div>
    <label class="catsel">Type
      <select bind:value={cat}>{#each CATS as c}<option>{c}</option>{/each}</select>
    </label>
  </div>
  <p class="note" aria-live="polite">{shown.length} shown</p>
  <div class="tbl-scroll"><table class="rev">
    <thead><tr><th>Script</th><th>Risk</th><th>API key</th><th>Torn's rules</th><th>Updated</th><th>What it does, and why the rating</th></tr></thead>
    <tbody>
      {#each shown as r (r.name)}
        <tr>
          <td class="nm">{#if r.url}<a href={r.url} target="_blank" rel="noopener">{r.name}</a>{:else}{r.name}{/if}<small>{r.type}</small>
            <span class="rowacts">{#if r.risk !== 'High'}<a href={r.install}>Install</a> · {/if}<button onclick={() => (viewing = r)}>Code</button></span></td>
          <td><span class="risk {r.risk.toLowerCase()}">{r.risk}</span></td>
          <td class="kc">{r.key}</td>
          <td class:warn={r.rules !== 'OK'}>{r.rules}</td>
          <td class="mono upd">{r.updated || '—'}</td>
          <td class="why">{r.what}<small>{r.why}</small></td>
        </tr>
      {/each}
    </tbody>
  </table></div>
</div></section>

<!-- HOW WE CHECK -->
<section id="how"><div class="wrap">
  <span class="eyebrow">Our method</span>
  <h2>How we check a script</h2>
  <div class="grid2" style="margin-top:1rem">
    <div class="card">
      <h3>What we look for</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k">→</span><div><b>Where it sends data.</b> Only to Torn's API is best. A known service (FF Scouter, TornStats) is fine if the script says so.</div></li>
        <li><span class="k">🔑</span><div><b>Where your key goes,</b> and whether that matches what the script tells you.</div></li>
        <li><span class="k">1:1</span><div><b>Torn's rules:</b> scripts may only use the API or the page you're viewing, and one click can do one thing. Anything that acts on its own is automation, and banned.</div></li>
        <li><span class="k">?</span><div><b>Hidden code:</b> scrambled code, or code downloaded and run later.</div></li>
        <li><span class="k">↻</span><div><b>Upkeep:</b> not updated in 18 months counts against it.</div></li>
      </ul>
    </div>
    <div class="card">
      <h3>What the ratings mean</h3>
      <ul class="rules" style="margin-top:.6rem">
        <li><span class="k low">L</span><div><b>Low:</b> readable, talks only to Torn's API (or public data), no rule issues.</div></li>
        <li><span class="k med">M</span><div><b>Medium:</b> shares your key or game data with another site, needs a broad key, sits in a grey area, or is unmaintained.</div></li>
        <li><span class="k high">H</span><div><b>High:</b> misleads about your key, lets another server control what you pay, or automates the game.</div></li>
        <li><span class="k">!</span><div>Scripts update. We read the versions on Greasy Fork on 25 September 2026; a later update can change any of this.</div></li>
      </ul>
    </div>
  </div>
</div></section>

<!-- KEY SAFETY -->
<section id="keys"><div class="wrap">
  <span class="eyebrow">The rule that matters</span>
  <h2>Keep your keys clean</h2>
  <div class="callout" style="margin-top:1rem">
    <ul class="rules">
      <li><span class="k">1</span><div><b>One key per tool</b>, minimum access. If a tool only needs to read your profile, don't give it more.</div></li>
      <li><span class="k">2</span><div><b>Check your key history</b> in Torn settings now and then — you can see what each key touched.</div></li>
      <li><span class="k">3</span><div><b>Revoke on suspicion.</b> A key is free to remake; a compromised Full key is a bad day.</div></li>
      <li><span class="k">4</span><div>Reputable tools send your key only to <b>their own</b> service, and say so. Stick to the ones on this page and the official stores/Greasy Fork.</div></li>
      <li><span class="k">5</span><div><b>Use a Limited key</b> unless a tool truly needs more. Be wary of anything asking for <b>Full</b> access or your <b>logs</b>: your log records nearly everything you do.</div></li>
    </ul>
  </div>
  <div class="say">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div><div><span class="nm">Rook</span><span class="tag">Rook's Rule</span></div>
      <p class="line">"Your API key is access. Treat it like the keys to the armory — hand out the least you can, and know who's holding a copy."</p></div>
  </div>
</div></section>

<CodeViewer script={viewing} onclose={() => (viewing = null)} />

<style>
  .grp{margin:1.4rem 0 .6rem;font-size:.8rem;text-transform:uppercase;letter-spacing:.14em;color:var(--amber)}
  .picks{display:grid;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr));gap:.7rem}
  .pick{display:flex;flex-direction:column;gap:.35rem;text-decoration:none;color:var(--ink);padding:.9rem 1rem;border-radius:3px}
  .pick:hover{border-color:color-mix(in srgb,var(--amber) 55%,var(--border))}
  .pn{font-weight:600;color:var(--ink);text-decoration:none}
  .pn:hover{color:var(--amber)}
  .acts{display:flex;gap:.4rem;margin-top:.4rem}
  .btn-i,.btn-c{font:inherit;font-size:.85rem;border-radius:3px;padding:.3rem .7rem;cursor:pointer;text-decoration:none}
  .btn-i{background:var(--amber);color:#111;font-weight:600;border:1px solid var(--amber)}
  .btn-c{background:none;color:var(--ink);border:1px solid var(--border)}
  .btn-c:hover{border-color:var(--amber)}
  .rowacts{display:block;margin-top:.3rem;font-size:.8rem}
  .rowacts button{font:inherit;background:none;border:0;padding:0;color:var(--amber);cursor:pointer;text-decoration:underline}
  .pw{color:var(--muted);font-size:.86rem;flex:1}
  .pw em{display:block;font-style:normal;color:var(--faint);margin-top:.2rem}
  .badges{display:flex;flex-wrap:wrap;gap:.35rem;margin-top:.2rem}
  .kb{font-family:"IBM Plex Mono",monospace;font-size:.68rem;color:var(--muted);border:1px solid var(--border);border-radius:2px;padding:1px 6px}
  .risk{font-family:"IBM Plex Mono",monospace;font-size:.7rem;font-weight:600;border-radius:2px;padding:1px 6px;white-space:nowrap;border:1px solid}
  .risk.low{color:var(--energy);border-color:color-mix(in srgb,var(--energy) 50%,transparent);background:var(--energy-soft)}
  .risk.medium{color:var(--amber);border-color:color-mix(in srgb,var(--amber) 50%,transparent);background:var(--amber-soft)}
  .risk.high{color:#ff7a70;border-color:color-mix(in srgb,var(--crime) 70%,transparent);background:var(--crime-soft)}
  .k.low{color:var(--energy);background:var(--energy-soft);border-color:var(--energy-soft)}
  .k.med{color:var(--amber)}
  .k.high{color:#ff7a70;background:var(--crime-soft);border-color:var(--crime-soft)}
  .filters{display:flex;flex-wrap:wrap;gap:.6rem 1rem;align-items:center;margin-top:1rem}
  .filters input{font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:.45rem .7rem;min-width:0;flex:1 1 14rem;max-width:22rem}
  .chips{display:flex;flex-wrap:wrap;gap:.35rem}
  .catsel{display:flex;align-items:center;gap:.4rem;color:var(--muted);font-size:.9rem}
  .catsel select{font:inherit;color:var(--ink);background:var(--surface);border:1px solid var(--border);border-radius:3px;padding:.35rem .5rem}
  table.rev td{vertical-align:top;font-size:.9rem}
  table.rev .nm{min-width:11rem}
  table.rev .nm small,table.rev .why small{display:block;color:var(--muted);font-size:.8rem;margin-top:.2rem}
  table.rev .kc{min-width:9rem;color:var(--muted)}
  table.rev .upd{white-space:nowrap;color:var(--muted)}
  table.rev .why{min-width:22rem}
  table.rev td.warn{color:var(--amber)}
</style>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:.6rem">
    <span class="brandmark" style="color:var(--ink);font-size:1.2rem">TORN</span>
    <span class="mono" style="letter-spacing:.16em;font-size:.72rem;color:var(--muted)">GEAR UP · THEN FIGHT</span>
  </div>
  <strong>Scripts &amp; Tools.</strong> Part of the <a href="{base}/">Faction Training Playbook</a>. Setup steps summarized from each tool's docs — verify against the source if a screen differs.
  <p class="note">Sources: <a href="https://torntools.tornplayground.eu/" target="_blank" rel="noopener">TornTools</a> · <a href="https://ffscouter.com/guides/ff-scouter-v2-installation" target="_blank" rel="noopener">FF Scouter</a> · <a href="https://www.tornstats.com/" target="_blank" rel="noopener">TornStats</a> · <a href="https://yata.yt/" target="_blank" rel="noopener">YATA</a> · <a href="https://github.com/Manuito83/torn-pda" target="_blank" rel="noopener">Torn PDA</a> · <a href="https://greasyfork.org/en/scripts/526834-oc-success-chance-2-0" target="_blank" rel="noopener">OC Success Chance</a> (Allenone [2033011]) · <a href="https://wiki.torn.com/wiki/API" target="_blank" rel="noopener">Torn API</a></p>
  <p class="note">The website list also draws on the community <a href="https://fm2021.notion.site/f121b443e1e2460a82103d65971d9521" target="_blank" rel="noopener">List of Torn-related websites</a>. Sites were checked from their public pages on 25 September 2026; we never entered a key.</p>
  <p class="note">The script list comes from <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRa1lUYH8u_vNXVx9LKp7Ey3KO0fGahLIdWC42wut_puTPUX4spjM9PmeBCDXKDIRsrPs4xXNsFIzz4/pubhtml" target="_blank" rel="noopener">Shaul's Torn Script + Tool + Website Collection</a>. Ratings are our own reading of each script's source, based on Torn's scripting rules; they're a guide, not a guarantee.</p>
</div></footer>
