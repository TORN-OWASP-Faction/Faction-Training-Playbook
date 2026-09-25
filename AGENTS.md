# AGENTS.md

Instructions for AI coding agents (and a checklist for humans) working on the Faction Training Playbook.
Read this before changing anything. If a request conflicts with these rules, say so instead of quietly breaking them.

## What this is

A static guide site for new Torn City players, run by the TORN-OWASP-Faction. SvelteKit 2 with Svelte 5 runes,
`adapter-static`, Tailwind v3 plus a hand-written design system in `src/app.css`. It is prerendered and published to
GitHub Pages by `.github/workflows/deploy.yml` under the `/Faction-Training-Playbook` base path.

Live: https://torn-owasp-faction.github.io/Faction-Training-Playbook/

## Commands

```bash
npm install
npm run dev              # http://localhost:5173
npx svelte-check         # must report 0 errors and 0 warnings
npm run build            # static site in build/
npm run i18n:check       # every translation matches English structure and markup
```

Before calling any change done: `svelte-check`, `build`, and `i18n:check` (if `src/lib/i18n/` changed) all pass, and you have
looked at the changed pages at 390px and 1280px wide.

## Code

- Simple, readable code that looks like the code around it. Plain functions and data, no abstraction layers, no
  "might need it later" options (YAGNI).
- Svelte 5 runes (`$state`, `$derived`, `$effect`, `$props`). No stores or legacy `export let`.
- Comments only for odd game rules or API quirks, never to explain syntax.
- Few dependencies. Write the small thing yourself before adding a package. No analytics or trackers other than the
  optional GoatCounter setting in `src/lib/meta.js`.
- Links use `{base}` (or `href()` from `$lib/i18n` on translated pages). Never hard-code `/Faction-Training-Playbook`.
- Game data that can be fetched (items, gyms, companies, calendar) comes from the Torn API or the wiki, not from memory.

## Writing

- The reader is a new player. Plain words, short sentences, active voice. Say what to do, then why.
- No filler, no hype, no "In this guide we will…". Headings say what the section gives the reader.
- Every number or mechanic has a source: Torn wiki, a forum guide, the Torn City Times, or the Torn API. Mark anything
  that is our own estimate or simulation as such on the page.
- Credit every source in the page footer and on `/credits/`, as `Name [ID]`. Link forum threads we summarize.
- Pages should be complete on their own: players shouldn't need to leave to get the gist. Link the source as well.
- Game names stay in English exactly as Torn shows them (items, honors, properties, companies, crimes).
- Dates that change yearly (events) come from Torn's calendar or the newspaper, with the year stated.

## The crew

Six recurring characters narrate the site through the `Character` component. Keep each one's voice and domain.

| Character | Domain | Voice | Colour token |
|---|---|---|---|
| Vincent "Ledger" Moretti | Money, property, education, when not to spend | Dry, numbers-first | `--c-banker` |
| Maya "Rep" Torres | Gym, happy, energy, routines | Coach, repetition beats shortcuts | `--c-trainer` |
| Marcus "Rook" Kane | Factions, war, preparation, safety | Terse, military | `--c-militia` |
| Nico "The Line" Vescari | Quick money, travel, crimes, introductions | Street-smart, a little shady | `--c-fixer` |
| Dr. "Patch" Moreau | Overdoses, medical, recovery | Calm, clinical | `--c-medic` |
| Axel "Gearbox" Rivera | Racing, driving skill, cars | Calm, concise, mechanical analogies | `--c-racer` |

One or two character lines per section at most. They add a point, they don't repeat the text.

## Design and accessibility

- Dark design system in `src/app.css`. Use its tokens; don't add new greys or reds.
- Text colour must reach 4.5:1. Use `--ink`, `--muted` or `--faint` for text; for red or green text use
  `--crime-ink`, `--medic-ink` or `--trainer-ink`, never the raw `--c-*` colours (those are for borders and bars).
- Links inside text stay underlined. Every input has a label. Headings go in order (h1, h2, h3). Everything works by keyboard.
- Use logical CSS properties (`margin-inline-start`, `border-inline-start`, `text-align: start`) so Arabic pages lay out right to left.
- Target: Lighthouse accessibility 100 on every page.

## Images and performance

- Character art is WebP: portraits 800px wide (`name.webp`), avatars 160px (`name-sm.webp`), backgrounds 1280px (`bg_*.webp`).
  No PNG or JPEG art over ~300 KB.
- Link-preview images are 1200×630 JPEGs in `static/og/`.
- Images below the fold get `loading="lazy"`; the main image of a page may get `fetchpriority="high"`.

## Languages

- The menu (`common`), front page (`home`), Start here (`start`) and Glossary (`glossary`) exist in 20 languages under
  `src/lib/i18n/<lang>/`. Every other page is English only.
- Change the English file first. Then update all 19 other languages, or leave the key missing (English shows) and say so
  in the PR. Run `npm run i18n:check`.
- Keep HTML tags, `href` paths and `{placeholders}` identical to English. Links are written as `href="/path/"`; the base
  path and language prefix are added at render.

## New pages

1. Add the route under `src/routes/`.
2. Add its title, description and preview image to `src/lib/meta.js`. The sitemap, browser title and link previews all come from there.
3. Link it from the menu (`src/lib/Nav.svelte`, labels in every `common.json`) and credit its sources.

## Safety and privacy

- Never commit API keys, session tokens, or other players' private data. Player names and IDs appear only to credit authors.
- Faction or player data used for calibration is anonymised before it goes near the repo.
- Anything we recommend on the Scripts page is reviewed first: read the source, check where the API key goes, and check it
  against Torn's scripting rules (API or current page only, one click one action, no automation).

## Commits

- Short imperative subject line, then a few bullet points on what changed and why.
- No AI attribution of any kind: no `Co-Authored-By` trailers, no "Generated with" lines.
- Don't commit or push unless asked.
