// 2026 dates and the "Torn says" text come from Torn's calendar (API torn/calendar).
// Most one-day events run 48 hours, from 13:45 TCT the day before to 13:45 TCT the day after.
// A date with a time is the exact start or end. A date without a time means the whole day.
// [name, start 'MM-DD' or 'MM-DD HH:MM', end the same, what Torn says, what a new player should do (may hold links), tags, top pick]
export const EVENTS = [
  ["New Year's Day", '01-01', '01-01', 'Not on the calendar, but it counts as a holiday login.',
    'Log in today. It\'s one of the holiday logins on our <a href="/start/#week">cheap merits</a> list.', ['Merit']],
  ['Awareness Week', '01-19', '01-25', 'Increased awareness for one week.',
    'Awareness is how often you find items lying around the city. Nothing to prepare: play as usual and pick up what you find.', ['Money']],
  ['Weekend Road Trip', '01-31 12:00', '02-02 12:00', 'Double racing points & racing skill.',
    'Only matters if you race. If you do, race as much as you can this weekend. <a href="/racing/">Racing →</a>', ['Racing']],
  ["Valentine's Day", '02-13 13:45', '02-15 13:45', 'Love Juice reduces the energy cost of attacking & reviving.',
    'Log in for the holiday login. If your faction chains today, Love Juice makes each hit cost less energy.', ['Merit', 'Fighting']],
  ['Employee Appreciation Day', '03-05 12:00', '03-07 12:00', 'Job points received tripled & training effects tripled.',
    'Be in a company by March. For these 48 hours, director training gives triple working stats (150 instead of 50), and up to 20 saved trains are tripled too. Ask your director to train you. <a href="/paths/#guides">Jobs →</a>',
    ['Training', 'Money'], true],
  ["St Patrick's Day", '03-16 13:45', '03-18 13:45', 'Alcohol effects are doubled & Green Stout appears in city.',
    'Alcohol gives nerve. Drink what you have for double nerve and spend it on <a href="/crimes/">crimes</a>. Each drink still adds an hour of booster cooldown.', ['Nerve']],
  ['Easter Egg Hunt', '04-02 13:45', '04-08 13:45', 'Easter eggs appear at random throughout Torn. Pick them up, then use them for their effects.',
    'Eggs pop up on random pages, so click them when you see one. Check what an egg sells for before you use it.', ['Money']],
  ['420 Day', '04-19 13:45', '04-21 13:45', 'Cannabis effects are tripled.',
    'Cannabis normally gives 8–12 nerve; today 24–36. It still adds drug cooldown and addiction, and an overdose empties your nerve. <a href="/medical/">Drugs →</a>', ['Nerve']],
  ['Museum Day', '05-17 13:45', '05-19 13:45', '10% bonus to museum point rewards.',
    'Save full flower and plushie sets and trade them in today for 10% more points. <a href="/travel/">Flying for money →</a>', ['Money']],
  ['World Blood Donor Day', '06-13 13:45', '06-15 13:45', 'Life and cooldown penalties for drawing blood are halved.',
    'Blood bags stock your faction for wars. Today filling them costs half the life and cooldown, so ask if your faction needs some. <a href="/medical/">Field medicine →</a>', ['Faction']],
  ['World Population Day', '07-10 13:45', '07-12 13:45', 'Level and weapon EXP gained while attacking is doubled.',
    'The best day of the year to attack for levels. Use the weapon you want to get better with.', ['Fighting']],
  ['World Tiger Day', '07-28 13:45', '07-30 13:45', 'Hunting experience is increased by x5.',
    'Hunting happens in South Africa. If you can fly there, hunt today for five times the skill.', ['Travel']],
  ['International Beer Day', '08-06 13:45', '08-08 13:45', 'Beer items are five times more effective.',
    'A Bottle of Beer gives 1 nerve, 5 today, and costs next to nothing. Stock up the week before. Each one still adds an hour of booster cooldown.', ['Nerve']],
  ['Tourism Day', '09-26 13:45', '09-28 13:45', 'Travel capacity doubled.',
    'Twice the items per trip, bonuses included. Under Travel 2.0 the extra slots vanish if the event ends while you\'re abroad: fly out before it starts, and fill up before it ends. <a href="/travel/#tourism">The plan →</a>',
    ['Money'], true],
  ['CaffeineCon', '10-14 13:45', '10-16 13:45', 'Energy drink effects are doubled.',
    'Save your energy drinks for today: each can gives double energy. Use them inside a <a href="/training/#idea">happy jump</a>.', ['Training'], true],
  ['Trick or Treat', '10-25 13:45', '11-01 13:45', 'Dress up and attack others to fill your basket with treats.',
    'Your first 40 treats earn a merit. Log in on 31 October for the holiday login too. <a href="/halloween/">Full guide →</a>', ['Merit', 'Fighting'], true],
  ['World Diabetes Day', '11-13 13:45', '11-15 13:45', 'Candy effects are tripled.',
    'Candy gives triple happy for the whole 48 hours. The cheapest big happy jump of the year, so stock candy in early November. <a href="/training/#items">Items →</a>',
    ['Training'], true],
  ['Torn Anniversary', '11-15', '11-15', 'Torn turns 22 years old.', 'Log in today for the holiday login.', ['Merit']],
  ['Black Friday', '11-27', '11-27', "Torn's yearly dollar sale sees many bazaars listing goods for $1.",
    'Items listed for $1 sell in seconds. Check bazaars early in the day, and don\'t expect the big items.', ['Money']],
  ['Slash Wednesday', '12-08 13:45', '12-10 13:45', 'Hospital times reduced by 75%.',
    'Losing a fight costs a quarter of the usual hospital time. A good day to take harder fights or help your faction chain.', ['Fighting']],
  ['Christmas Town', '12-19 13:45', '12-31 13:45', "Torn's festive theme park opens: search official and player-made maps for treasure and avoid traps.",
    'Walk the official map every day for free items and watch for traps. Log in on Christmas Day for the holiday login.', ['Money', 'Merit']]
];

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const DAY = 86400000;
export const utc = (y, md) => Date.UTC(y, +md.slice(0, 2) - 1, +md.slice(3, 5), +md.slice(6, 8) || 0, +md.slice(9, 11) || 0);
const endOf = (y, md) => (md.length > 5 ? utc(y, md) : utc(y, md) + DAY);
export const label = (md) => `${+md.slice(3, 5)} ${MONTHS[+md.slice(0, 2) - 1]}${md.length > 5 ? ' ' + md.slice(6) : ''}`;
export const when = ([, start, end]) => {
  if (start === end) return label(start);
  const tct = start.length > 5 || end.length > 5 ? ' TCT' : '';
  return `${label(start)} – ${label(end)}${tct}`;
};

// Events repeat every year on about the same dates, so count TCT calendar days to the next start.
// days is 0 when the event starts later today.
export function status([, start, end], now) {
  const y = new Date(now).getUTCFullYear();
  if (now >= utc(y, start) && now < endOf(y, end)) return { live: true, days: 0 };
  const next = utc(y, start) > now ? utc(y, start) : utc(y + 1, start);
  const dayOf = (t) => Math.floor(t / DAY);
  return { live: false, days: dayOf(next) - dayOf(now) };
}
