# Faction Training Playbook

A self-hosted Torn training guide with a live jump planner. Two pages, no build step,
no server, no dependencies (fonts load from Google Fonts; everything else ships in-repo).

- **`index.html`** — the **guide**: happy-jump mechanics, a level-≤15 path, level-15+
  routines by income bracket, builds & scaling, schedules, item/education references, and
  an offline jump calculator. Your three guides (Ledger, Rep, Rook) narrate it.
- **`planner.html`** — the **live jump planner**: pulls live item prices, your gyms, and
  your profile (stats/happy/energy/perks) from the Torn API and shows happy reached, total
  stat gain, gain/energy and cost-per-stat, using Training Formula V2.0.

The two pages link to each other. All figures use the accepted community formula.

## Host on GitHub Pages
1. Push this repo (`index.html`, `planner.html`, and `assets/` at the root).
2. **Settings → Pages** → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. Live at `https://torn-owasp-faction.github.io/Faction-Training-Playbook/`
   (planner at `…/planner.html`).

Or open the files locally in a browser — they work the same.

## The live planner & your API key
- **Save & fetch prices** — needs a **Limited** key. Pulls live item market values *and*
  the gym list in one call.
- **Fetch my profile** — needs a **Custom** key with gym + battle-stats access. Auto-fills
  stat total, active gym (dots + energy), happy baseline, current energy, and detected
  gym-gain perk %.
- Your key is stored **only in your browser** (`localStorage`) and sent **only** to
  `api.torn.com`. Nothing else leaves the page. "Forget key" clears it. Create/revoke keys
  at **torn.com → Settings → API Key**.
- Prices use each item's Torn `market_value` (a market average, not the single lowest
  listing); items are matched by name against the live list, so an unmatched item stays blank.

## What it does NOT do
No automation, no writes — read-only API calls only. Gains use Training Formula V2.0
(Vladar): happy decays ~50% of energy spent per train and randomness is excluded, so the
gain shown is an expected value, not a guarantee.

## Files
```
index.html      the guide (self-contained)
planner.html    the live jump planner (self-contained)
assets/         character art + backgrounds (banker/trainer/militia, bg_bank/bg_gym/bg_militia)
LICENSE
```
