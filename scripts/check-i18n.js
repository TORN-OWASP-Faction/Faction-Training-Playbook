// Checks every translation against English: same keys, same list lengths, same markup,
// links and {placeholders}. Run with: npm run i18n:check
import { readFileSync, readdirSync, existsSync } from 'node:fs';

const DIR = new URL('../src/lib/i18n/', import.meta.url);
const namespaces = readdirSync(new URL('en/', DIR)).filter((f) => f.endsWith('.json'));
const locales = readdirSync(DIR, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'en').map((d) => d.name);

// Tags with their attributes, and {placeholders}, sorted so word order can change freely.
const markup = (s) => [...s.matchAll(/<[^>]+>|\{\w+\}/g)].map((x) => x[0]).sort().join(' ');

function compare(en, local, where, problems) {
  if (Array.isArray(en)) {
    if (!Array.isArray(local) || local.length !== en.length) return problems.push(`${where}: expected a list of ${en.length}`);
    en.forEach((v, i) => compare(v, local[i], `${where}[${i}]`, problems));
  } else if (en && typeof en === 'object') {
    if (!local || typeof local !== 'object') return problems.push(`${where}: missing`);
    for (const k of Object.keys(en)) compare(en[k], local[k], `${where}.${k}`, problems);
    for (const k of Object.keys(local)) if (!(k in en)) problems.push(`${where}.${k}: not in English`);
  } else if (typeof local !== 'string' || !local.trim()) {
    problems.push(`${where}: missing`);
  } else if (markup(en) !== markup(local)) {
    problems.push(`${where}: markup differs\n    en: ${markup(en)}\n    got: ${markup(local)}`);
  }
}

let failed = false;
for (const lang of locales) {
  const problems = [];
  for (const ns of namespaces) {
    const file = new URL(`${lang}/${ns}`, DIR);
    if (!existsSync(file)) { problems.push(`${ns}: file missing`); continue; }
    const en = JSON.parse(readFileSync(new URL(`en/${ns}`, DIR)));
    compare(en, JSON.parse(readFileSync(file)), ns.replace('.json', ''), problems);
  }
  if (problems.length) failed = true;
  console.log(problems.length ? `✗ ${lang}\n  ${problems.join('\n  ')}` : `✓ ${lang}`);
}
process.exit(failed ? 1 : 0);
