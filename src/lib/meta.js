// Page titles, descriptions and preview images for link previews (Discord, X, etc.).
// Keys are paths without the base or language prefix; images live in static/og/.

export const SITE_ORIGIN = 'https://torn-owasp-faction.github.io';
export const SITE_NAME = 'Faction Training Playbook';

export const META = {
  '/': [SITE_NAME, 'Free, plain-language Torn guides from our faction: your first week, training, making money, crimes, racing and more.', 'home'],
  '/start/': ['Start here', 'The first-week checklist for new Torn players: setup, keeping your money safe, selling, books, drugs, scams and your routine.', 'start'],
  '/glossary/': ['Glossary', 'Torn words and abbreviations in plain language, each linked to the page that explains it.', 'glossary'],
  '/training/': ['Training guide', 'Happy jumps, builds, schedules, the best gym for each stat, items and education: turn energy into stats fast.', 'training'],
  '/training/formula/': ['Training math', 'Training Formula V2.0 explained, with an interactive gains chart.', 'training'],
  '/planner/': ['Jump planner', 'Plan a happy jump with live prices from your own Torn API key.', 'training'],
  '/paths/': ['Paths and milestones', 'Income first, stats first or balanced: an interactive planner with timelines, milestones, merits and education.', 'paths'],
  '/travel/': ['Flying for money', 'Flowers, plushies and contraband: when to rent a Private Island, the Travel 2.0 rules and the Tourism Day plan.', 'travel'],
  '/racing/': ['Racing', "Gearbox's guide to Torn racing: your first race, classes and cars, what to upgrade in each class, and six merits.", 'racing'],
  '/halloween/': ['Trick or Treat', 'Halloween for new players: get a basket, the upgrade order, a week planner and an easy merit.', 'halloween'],
  '/events/': ['Events calendar', 'Every Torn event this year, what it does, and how a new player should use it.', 'events'],
  '/scripts/': ['Scripts and tools', 'The tools worth running, plus a safety review of 134 community scripts and 37 websites.', 'scripts'],
  '/crimes/': ['Crimes', 'How Crimes 2.0 works, how to build your nerve, and organized crime.', 'crimes'],
  '/crimes/oc-scenarios/': ['OC scenarios', "Every organized crime's slots, roles and role weights.", 'crimes'],
  '/crimes/burglary/': ['Burglary data', 'Burglary targets, casing rates and drop tables.', 'crimes'],
  '/crimes/shoplifting/': ['Shoplifting data', 'Shoplifting drop tables by store.', 'crimes'],
  '/crimes/cracking/': ['Cracking data', 'Cracking data tables.', 'crimes'],
  '/crimes/forgery/': ['Forgery data', 'Forgery data tables.', 'crimes'],
  '/loadout/': ['War loadout', 'Which weapons and armor are worth buying, and how to fight above your weight.', 'loadout'],
  '/medical/': ['Field medicine', 'Overdoses, medical items, cooldowns and staying useful in a war.', 'medical'],
  '/messages/': ['Faction messages', 'War rules, termed war terms, OC and travel reminders, and upcoming events: set a few options, polish the wording, and paste it into Torn or Discord.', 'messages'],
  '/credits/': ['Credits', 'The players and guides this playbook is built on.', 'home']
};

// GoatCounter site code for visitor counts (no cookies, no personal data), e.g. 'faction-playbook'
// for https://faction-playbook.goatcounter.com. Leave empty to turn counting off.
export const GOATCOUNTER = '';
