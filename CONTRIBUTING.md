# Contributing

Thanks for helping new Torn players. There are two ways to help, and the first needs no code at all.

## 1. Open an issue

Pick the form that fits on the [new issue page](https://github.com/TORN-OWASP-Faction/Faction-Training-Playbook/issues/new/choose):

- **Add or fix a guide:** something is wrong, out of date, or missing.
- **Suggest a script, tool or website:** we review it before listing it.
- **Fix a translation:** a translated page reads wrong or uses the wrong game word.

A good suggestion links its source (a Torn wiki page, a forum guide, a Torn City Times article, or the Torn API) and
says who should be credited. "I tested it in game on <date>" works too.

Never paste an API key into an issue, a pull request, or anywhere else on GitHub.

## 2. Send a pull request

For people comfortable with Git.

```bash
git clone https://github.com/TORN-OWASP-Faction/Faction-Training-Playbook.git
cd Faction-Training-Playbook
npm install
npm run dev          # http://localhost:5173
```

Before you open the pull request:

```bash
npx svelte-check     # 0 errors, 0 warnings
npm run build
npm run i18n:check   # if you touched src/lib/i18n/
```

The pull request template has a short checklist. The full standards (writing style, the six characters, colours and
accessibility, images, languages, safety) are in [AGENTS.md](AGENTS.md). It's written for AI coding agents, but it's
the same checklist a maintainer uses to review your change.

### The short version

- Write for a new player: plain words, short sentences, say what to do and why.
- Every number has a source, credited on the page and on the Credits page.
- Keep code simple and consistent with what's already there.
- Game names stay in English, the way Torn shows them.
- New pages go in `src/lib/meta.js` so they get a title, a link preview and a sitemap entry.

## Translations

The menu, front page, Start here and Glossary are in 20 languages (`src/lib/i18n/<language>/`). They were
machine-drafted, so native speakers are especially welcome. Keep the HTML tags, links and `{placeholders}` exactly as in
English, and run `npm run i18n:check`.

## Credits

Contributors whose guides or corrections are used are credited on the site's Credits page.
