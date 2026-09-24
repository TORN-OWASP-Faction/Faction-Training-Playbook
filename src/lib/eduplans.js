// Education order for each path. One course runs at a time, so this is a queue; every course's prerequisites come earlier.
// Effects and lengths come from the Torn API education list (src/lib/data/education.json).
const SPT_GYM = ['SPT1430', 'SPT2440', 'SPT2450', 'SPT2460', 'SPT2470'];
const SPT_REST = ['SPT2490', 'SPT2500', 'SPT2126', 'SPT2480', 'SPT3510'];
const HISTORY = ['HIS1140', 'HIS2150', 'HIS2160', 'HIS2170', 'HIS2180', 'HIS2190', 'HIS2200', 'HIS3210'];

export const EDU_PLANS = {
  stats: [
    ...SPT_GYM, ...SPT_REST,
    'PSY1630', 'PSY2670', 'PSY2660', 'PSY2650',
    'DEF1700', 'DEF2740', 'DEF2760', 'DEF2750', 'DEF2730',
    'BIO1340', 'BIO2410', 'BIO2350',
    'MTH1220', 'MTH2310',
    'CBT1780', 'CBT2850'
  ],
  balanced: [
    ...SPT_GYM, ...SPT_REST,
    'PSY1630', 'PSY2670', 'PSY2660',
    'DEF1700', 'DEF2740', 'DEF2760',
    ...HISTORY
  ],
  income: [
    ...SPT_GYM,
    ...HISTORY,
    'DEF1700', 'DEF2740', 'DEF2730', 'DEF2710',
    'LAW1880', 'LAW2910',
    ...SPT_REST
  ]
};

// Why each course is in a plan, in plain words (the API's perk text is kept for the detail column)
export const EDU_WHY = {
  SPT1430: 'Opens Sports Science', SPT2440: '+1% Strength gym gains', SPT2450: '+1% Speed gym gains',
  SPT2460: '+1% Defense gym gains', SPT2470: '+1% Dexterity gym gains', SPT2490: '+2% passive Speed and Strength',
  SPT2500: '+2% passive Defense and Dexterity', SPT2126: 'Needed for the degree', SPT2480: 'Needed for the degree',
  SPT3510: '+1% gym gains on every stat', PSY1630: 'Opens Psychology', PSY2670: '+8% passive Dexterity',
  PSY2660: '+4% passive Dexterity', PSY2650: '+2% passive Dexterity', DEF1700: 'Opens Self Defense',
  DEF2740: '+3% passive Defense', DEF2760: '+3% passive Speed', DEF2750: '+2% passive Speed',
  DEF2730: '+2% passive Defense', DEF2710: '+1% passive Defense', BIO1340: 'Opens Biology',
  BIO2410: '+3% critical-hit chance', BIO2350: '+1% damage with all weapons', MTH1220: 'Opens Mathematics',
  MTH2310: '−5% ammo use', CBT1780: 'Opens Combat Training', CBT2850: '+1 accuracy with rifles',
  HIS1140: 'Opens History', HIS2150: 'Needed for the degree', HIS2160: '+10% Japanese-blade damage',
  HIS2170: '+2% melee damage', HIS2180: 'Needed for the degree', HIS2190: 'Needed for the degree',
  HIS2200: 'Needed for the degree', HIS3210: 'Unlocks the Museum: trade sets for points',
  LAW1880: 'Opens Law', LAW2910: '5% off buying a property (worth it before you buy a PI)'
};
