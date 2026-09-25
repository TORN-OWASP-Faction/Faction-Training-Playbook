## What this changes

<!-- One or two sentences. Link the issue if there is one: Closes #123 -->

## Type

- [ ] Content (a guide, correction or new page)
- [ ] Translation
- [ ] Tool or script review
- [ ] Code, design or accessibility

## Sources

<!-- Where the numbers and claims come from: Torn wiki, forum guide, Torn City Times, Torn API. Credit authors as Name [ID]. -->

## Checklist

- [ ] Follows the standards in AGENTS.md: plain words for new players, no filler
- [ ] Sources are credited on the page footer and on the Credits page
- [ ] No API keys, session tokens or other players' private data anywhere
- [ ] `npx svelte-check` has no errors or warnings
- [ ] `npm run build` succeeds
- [ ] `npm run i18n:check` passes (if you touched `src/lib/i18n/`)
- [ ] New pages are added to `src/lib/meta.js` (title, description, preview image)
- [ ] Checked at phone width (390px) and desktop (1280px)
- [ ] Screenshots attached for visual changes
