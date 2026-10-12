// Education journey: a fixed first step, then the reader picks one priority at a time.
// Each track lists the courses that matter, best value first. Missing prerequisites are added in front
// automatically, and a course already in the plan is never added twice.
// A track with "after" is a degree that only shows up once the track it builds on is in the plan.
// Course effects and lengths come from the Torn API education list (src/lib/data/education.json).
import EDU from '$lib/data/education.json';

export const FIRST = {
  key: 'gym', label: 'Gym gains', icon: 'dumbbell', who: 'Everyone who trains',
  why: 'Each course adds 1% to every train of one stat, for good. It is the one line every build, company worker and crook still benefits from, and it gets more valuable the earlier you finish it.',
  courses: ['SPT1430', 'SPT2440', 'SPT2450', 'SPT2460', 'SPT2470']
};

export const TRACKS = [
  {
    key: 'fight', label: 'Fighting stats', icon: 'swords', who: 'Anyone who attacks, chains or wars',
    why: 'Passive bonuses add a percent to a battle stat all the time, in every fight. Pick the build you are growing into; the stats you lean on come first.',
    builds: [
      { key: 'attack', label: 'Attacker: Speed and Strength', note: 'Speed decides whether you land the hit, Strength how hard it lands.',
        courses: ['SPT2490', 'HAF2109', 'DEF2760', 'HAF2107', 'DEF2750', 'MTH2240', 'MTH2250', 'HAF2106', 'HAF2105', 'CBT2790'] },
      { key: 'defend', label: 'Defender: Defense and Dexterity', note: 'Defense soaks damage, Dexterity dodges. Psychology alone gives +15% Dexterity.',
        courses: ['SPT2500', 'PSY2670', 'PSY2660', 'DEF2740', 'PSY2650', 'DEF2730', 'MTH2260', 'MTH2320', 'PSY2640', 'DEF2710', 'HAF2104', 'HAF2108'] },
      { key: 'balanced', label: 'Balanced: a bit of everything', note: 'The biggest single course for each stat first. Good while you are still working out your role.',
        courses: ['SPT2490', 'SPT2500', 'PSY2670', 'DEF2740', 'DEF2760', 'HAF2109', 'PSY2660', 'DEF2750', 'HAF2107', 'DEF2730'] }
    ]
  },
  {
    key: 'weapons', label: 'Weapon damage', icon: 'zap', who: 'Regular attackers, after the fighting stats',
    why: 'Short courses that make every attack count: fewer reloads, more critical hits, more damage. Add the "Study of" course for the weapon type you use most (+1.00 accuracy).',
    courses: ['MTH2310', 'BIO2410', 'BIO2350', 'BIO2380'],
    extra: 'Melee users: Medieval History adds 2% melee damage, and Ancient Japanese History 10% with Japanese blades.'
  },
  {
    key: 'mastery', after: 'weapons', label: 'War degrees', icon: 'gem', who: 'Committed fighters with months to spare',
    why: 'Two long degrees fighters swear by. Military Arts lets you earn weapon experience, which raises damage and accuracy with each weapon you use. Mathematics cuts ammo use by 20% on top of the 5% from Discrete Mathematics.',
    courses: ['CBT3870', 'MTH3330']
  },
  {
    key: 'director', label: 'Run a company', icon: 'building', who: 'Company directors, or players about to become one',
    why: 'Business courses boost your whole company: staff effectiveness, productivity and product value. The Bachelor of Commerce unlocks the size, storage and staff room upgrades a growing company needs. Skip this line unless you direct a company.',
    courses: ['BUS2110', 'BUS2700', 'BUS2600', 'BUS2900', 'BUS2300', 'BUS2200', 'BUS2500', 'BUS2800', 'BUS2100', 'BUS2120', 'BUS2400', 'BUS3130']
  },
  {
    key: 'employee', label: 'Climb in a company', icon: 'up', who: 'Company employees chasing a better position',
    why: 'Education is a slow way to raise working stats. Company positions need tens of thousands of points, and a course gives a few hundred. Climb with director trains (+50 primary and +25 secondary each) and your daily passive gains instead, and keep your courses on the other priorities.',
    courses: [],
    tips: [
      'Ask your director for trains: each one gives +50 to your primary work stat and +25 to your secondary.',
      'The Education city job at Principal rank gives +100 to one work stat for 10 job points, and cuts every later course by 10%.',
      'The Working 9 Til 5 book adds 5% to all working stats (up to 2,500 each). Read it once you have about 50,000 in each.',
      'Skip the Bachelor of General Studies for this. Its +10% only applies to working stats from later courses. Over the 196 days of General Studies and every course after it, that comes to about 2,750 working stats, less than two days of director trains.'
    ]
  },
  {
    key: 'points', label: 'Points from the museum', icon: 'bank', who: 'Players who fly for flowers and plushies',
    why: 'The Bachelor of History opens the museum, where full sets of flowers, plushies and artifacts turn into points. The archaeology courses on the way let you find artifacts. It is long, so start it once your gym and fighting lines are done.',
    courses: ['HIS3210', 'HIS2160']
  },
  {
    key: 'support', label: 'Faction support', icon: 'droplet', who: 'Medics and players who keep the faction stocked',
    why: 'Intravenous Therapy lets you draw blood, so you can fill blood bags for faction wars. The two Biochemistry courses make medical items heal 20% more. The Bachelor of Biology lets you use needles in your temporary slot.',
    courses: ['BIO2127', 'BIO2360', 'BIO2370']
  },
  {
    key: 'biology', after: 'support', label: 'Bachelor of Biology', icon: 'gem', who: 'War medics who want needles',
    why: 'Lets you use needles (Epinephrine, Melatonin, Serotonin and more) in your temporary slot. Sports Medicine makes them 10% stronger.',
    courses: ['BIO3420', 'SPT2480']
  },
  {
    key: 'jail', label: 'Jail busting', icon: 'key', who: 'Busters, and anyone who spends time in jail',
    why: 'Law makes busting other players easier, bail cheaper, and your own escapes from jail safer.',
    courses: ['LAW2970', 'LAW2920', 'LAW2890', 'LAW2990', 'LAW2980', 'LAW2930']
  },
  {
    key: 'law', after: 'jail', label: 'Bachelor of Law', icon: 'gem', who: 'Dedicated busters',
    why: 'Busting becomes 50% easier and bailing 50% cheaper. It needs every Law course, so it is a long road.',
    courses: ['LAW3102']
  },
  {
    key: 'crimes', label: 'Crimes', icon: 'ghost', who: 'Players levelling Crimes 2.0',
    why: 'Computing unlocks Cracking, and the rig courses make it run cooler and faster. Psychology and Computing courses open more Scamming and Bootlegging options.',
    courses: ['CMT1520', 'CMT2570', 'CMT2128', 'CMT2129', 'PSY2132', 'CMT2230', 'CMT2130', 'CMT2131']
  },
  {
    key: 'psychology', after: 'crimes', label: 'Bachelor of Psychological Sciences', icon: 'gem', who: 'Long-term criminals',
    why: 'Adds 10% passive crime experience. Its courses also give +15% Dexterity, so defenders get there faster.',
    courses: ['PSY3690']
  },
  {
    key: 'sports', after: 'gym', label: 'Bachelor of Sports Science', icon: 'gem', who: 'Anyone still training hard',
    why: 'Another 1% on every train of every stat. Most of its courses also give passive stats, so it fits well after a fighting build.',
    courses: ['SPT3510']
  },
  {
    key: 'extras', label: 'Handy extras', icon: 'star', who: 'Short courses with one specific use',
    why: 'Each of these does one thing. Take the ones that match how you play.',
    courses: ['LAW2910', 'PSY2680', 'GEN2120', 'SPT2126', 'DEF2720']
  }
];

// Ready-made plans for readers who want the whole order without choosing each step.
// Each pick is the same shape the step-by-step planner stores.
export const PRESETS = [
  { key: 'attacker', label: 'Attacker', who: 'You chain, war and want to land big hits.',
    picks: [{ key: 'fight', build: 'attack' }, { key: 'weapons' }, { key: 'sports' }, { key: 'mastery' }] },
  { key: 'defender', label: 'Defender', who: 'You want to be hard to beat when others attack you.',
    picks: [{ key: 'fight', build: 'defend' }, { key: 'weapons' }, { key: 'sports' }, { key: 'mastery' }] },
  { key: 'medic', label: 'Faction medic', who: 'You keep the faction stocked with blood and heal in wars.',
    picks: [{ key: 'support' }, { key: 'fight', build: 'balanced' }, { key: 'biology' }, { key: 'weapons' }] },
  { key: 'collector', label: 'Flyer and collector', who: 'You fly for flowers and plushies and want points from sets.',
    picks: [{ key: 'points' }, { key: 'fight', build: 'balanced' }, { key: 'extras' }, { key: 'sports' }] },
  { key: 'director', label: 'Company director', who: 'You run a company or are about to.',
    picks: [{ key: 'director' }, { key: 'fight', build: 'balanced' }, { key: 'sports' }] },
  { key: 'crook', label: 'Career criminal', who: 'You spend your nerve on Crimes 2.0.',
    picks: [{ key: 'crimes' }, { key: 'fight', build: 'balanced' }, { key: 'psychology' }, { key: 'sports' }] },
  { key: 'buster', label: 'Jail buster', who: 'You bust people out of jail for merits and money.',
    picks: [{ key: 'jail' }, { key: 'law' }, { key: 'fight', build: 'balanced' }] }
];

// Short plain-word reason for a course, when the API text is long or empty.
export const REASON = {
  SPT1430: 'Opens Sports Science', HAF1103: 'Opens Health and Fitness', DEF1700: 'Opens Self Defense',
  PSY1630: 'Opens Psychology', MTH1220: 'Opens Mathematics', BIO1340: 'Opens Biology', CBT1780: 'Opens Combat Training',
  HIS1140: 'Opens History', LAW1880: 'Opens Law', BUS1100: 'Opens Business', CMT1520: 'Unlocks Cracking; opens Computing',
  GEN1112: 'Opens General Studies',
  SPT2126: 'Unlocks the Sports Shop', LAW2910: '5% off properties from the estate agent: take it before a big property buy',
  PSY2680: '+10% awareness: you find more items around the city', GEN2120: '+15% hunting (South Africa)',
  DEF2720: 'Adds a kick attack in fights'
};

export const course = (code) => ({ code, ...EDU[code] });

// Adds codes to the plan in order, putting any missing prerequisites in front of each one.
export function addCourses(plan, codes) {
  const out = [...plan];
  const add = (code) => {
    if (out.includes(code)) return;
    for (const pre of EDU[code].pre) add(pre);
    out.push(code);
  };
  codes.forEach(add);
  return out;
}

// Education Length merits take 2% each (up to 10), Principal rank and the WSU stock block 10% each.
// Since April 2024 the cuts add up rather than multiply, so the most is 40%.
export const cut = ({ merits, principal, wsu }) => merits * 0.02 + (principal ? 0.1 : 0) + (wsu ? 0.1 : 0);
