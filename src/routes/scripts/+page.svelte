<script>
  import { base } from '$app/paths';
</script>

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
        <li><span class="k">📱</span><div>Mobile: <b>Torn PDA</b> runs userscripts built-in; on Android, <b>Kiwi Browser</b> can install Chrome extensions.</div></li>
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
      <p class="what">Shows an estimated <b>Fair Fight / target strength</b> on profiles and attack lists — so you pick fights you win and chain efficiently.</p>
      <ol>
        <li>Install Tampermonkey (above).</li>
        <li>Register your 16-char key at <b>ffscouter.com</b> (paste key, accept terms, Sign Up).</li>
        <li>Install "FF Scouter V2" from Greasy Fork → Install.</li>
        <li>On your Torn profile, open <b>FF Scouter Settings</b>, paste the key, Verify.</li>
      </ol>
      <div class="link"><a href="https://ffscouter.com/guides/ff-scouter-v2-installation" target="_blank" rel="noopener">ffscouter.com install guide ↗</a></div>
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
  <p class="note">YATA, TornStats and Torn PDA are third-party but Torn-endorsed. TornTools and FF Scouter are community userscripts/extensions. Exact install screens change — follow each tool's own guide if a step looks different.</p>
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
      <li><span class="k">4</span><div>Reputable tools send your key only to <b>their own</b> service. Stick to the ones above and the official stores/Greasy Fork.</div></li>
    </ul>
  </div>
  <div class="say">
    <div class="av"><span class="mono-badge">R</span><img src="{base}/assets/militia.png" alt=""></div>
    <div><div><span class="nm">Rook</span><span class="tag">Rook's Rule</span></div>
      <p class="line">"Your API key is access. Treat it like the keys to the armory — hand out the least you can, and know who's holding a copy."</p></div>
  </div>
</div></section>

<footer><div class="wrap">
  <div style="display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;margin-bottom:.6rem">
    <span class="brandmark" style="color:var(--ink);font-size:1.2rem">TORN</span>
    <span class="mono" style="letter-spacing:.16em;font-size:.72rem;color:var(--muted)">GEAR UP · THEN FIGHT</span>
  </div>
  <strong>Scripts &amp; Tools.</strong> Part of the <a href="{base}/">Faction Training Playbook</a>. Setup steps summarized from each tool's docs — verify against the source if a screen differs.
  <p class="note">Sources: <a href="https://torntools.tornplayground.eu/" target="_blank" rel="noopener">TornTools</a> · <a href="https://ffscouter.com/guides/ff-scouter-v2-installation" target="_blank" rel="noopener">FF Scouter</a> · <a href="https://www.tornstats.com/" target="_blank" rel="noopener">TornStats</a> · <a href="https://yata.yt/" target="_blank" rel="noopener">YATA</a> · <a href="https://github.com/Manuito83/torn-pda" target="_blank" rel="noopener">Torn PDA</a> · <a href="https://wiki.torn.com/wiki/API" target="_blank" rel="noopener">Torn API</a></p>
</div></footer>
