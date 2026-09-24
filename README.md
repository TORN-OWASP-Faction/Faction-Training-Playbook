# Faction Training Playbook

A Torn guide site for our faction: training, money, crimes, war prep, and a live jump
planner. Built with SvelteKit + Tailwind and published as static HTML to GitHub Pages.

Live: https://torn-owasp-faction.github.io/Faction-Training-Playbook/

## Pages

| Route | What it covers |
|---|---|
| `/` | Front page: pick a goal (new, stronger, money, long game) and meet the crew |
| `/start/` | New players: first week, missions, keeping money safe, selling, books, drugs, scams, factions, routine |
| `/glossary/` | Torn words and abbreviations in plain language |
| `/training/` | The training guide: happy jumps and the jump routine, level ≤15 path, making money, income brackets, builds, schedules, items, education |
| `/paths/` | Income first, stats first or balanced: interactive planner, milestones, merits, education and faction upgrades |
| `/training/formula/` | Training Formula V2.0 explained, with an interactive gain chart and cost-vs-gain charts |
| `/travel/` | Flying for money: money ladder, first-PI budget, routes, stats-first vs money-first |
| `/medical/` | Overdoses, medical items and cooldowns |
| `/loadout/` | War loadout: which weapons and perks are worth buying |
| `/crimes/` | Crimes 2.0 and OC 2.0 (checkpoints, CPR) |
| `/crimes/oc-scenarios/` | Every OC's slots, roles and role weights |
| `/crimes/{burglary,shoplifting,cracking,forgery}/` | Sortable drop tables |
| `/planner/` | Live jump planner (uses your Torn API key) |
| `/scripts/` | Recommended scripts and tools, and how to set them up |
| `/credits/` | Sources and authors |

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in build/
```

- Pages live in `src/routes/`; shared components (`Nav`, `Character`, `DataTable`, `Tabs`,
  `Icon`, `FormulaLab`) in `src/lib/`.
- Crime and OC tables load JSON from `src/lib/data/`.
- Character art and backgrounds are in `static/assets/`.
- Global styles are in `src/app.css`.

## Languages

The menu, front page, Start here and Glossary are in 20 languages; `/es/start/`, `/ja/`, and so on.
The other pages are English only and offer Google Translate in the reader's language.

- Text lives in `src/lib/i18n/<language>/{common,home,start,glossary}.json`. English (`en/`) is the source.
- The translations were machine-drafted. Corrections from native speakers are welcome as pull requests.
- Keep game names (items, books, honors, properties, companies) in English, the way Torn shows them.
- Keep the HTML tags, `href` paths and `{placeholders}` exactly as in English. Missing strings fall back to English.
- `npm run i18n:check` compares every language with English and lists anything missing or broken.
- To add a language, add it to `LOCALES` in `src/lib/i18n/index.js` and create its folder.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes
it to Pages. In **Settings → Pages**, the source must be set to **GitHub Actions**. The
workflow sets `BASE_PATH` to the repo name so links work under the project subpath.

## The live planner & your API key

- **Save & fetch prices** needs a **Limited** key. It pulls live item values and the gym
  list in one call.
- **Fetch my profile** needs a **Custom** key with gym + battle-stats access. It fills in
  stat total, active gym, happy, energy and gym-gain perks.
- Your key is stored **only in your browser** (`localStorage`) and sent **only** to
  `api.torn.com`. "Forget key" clears it. Create or revoke keys at
  **torn.com → Settings → API Key**.
- Read-only: no automation, no writes. Gains use Training Formula V2.0 (Vladar) with
  randomness excluded, so the numbers are expected values, not guarantees.

## Sources

All game mechanics come from the Torn wiki and community guides; every author is credited
on `/credits/`.
