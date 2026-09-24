// Day-by-day progression model behind the Paths page. Plain functions so it can be checked outside the browser.
// Every default below comes from the sources credited on the page; the page lets readers change them.

// Standard gyms: [name, cost, dots per stat (str, spd, def, dex; null = can't train it), energy in this gym to unlock the next]. Torn wiki, Gym.
export const GYMS = [
  ['Premier Fitness', 10, [2, 2, 2, 2], 200],
  ['Average Joes', 100, [2.4, 2.4, 2.8, 2.4], 500],
  ["Woody's Workout", 250, [2.8, 3.2, 3, 2.8], 1000],
  ['Beach Bods', 500, [3.2, 3.2, 3.2, null], 2000],
  ['Silver Gym', 1000, [3.4, 3.6, 3.4, 3.2], 2750],
  ['Pour Femme', 2500, [3.4, 3.6, 3.6, 3.8], 3000],
  ['Davies Den', 5000, [3.7, null, 3.7, 3.7], 3500],
  ['Global Gym', 10000, [4, 4, 4, 4], 4000],
  ['Knuckle Heads', 50000, [4.8, 4.4, 4, 4.2], 6000],
  ['Pioneer Fitness', 100000, [4.4, 4.5, 4.8, 4.4], 7000],
  ['Anabolic Anomalies', 250000, [5, 4.5, 5.2, 4.5], 8000],
  ['Core', 500000, [5, 5.2, 5, 5], 11000],
  ['Racing Fitness', 1e6, [5, 5.4, 4.8, 5.2], 12420],
  ['Complete Cardio', 2e6, [5.5, 5.8, 5.5, 5.2], 18000],
  ['Legs, Bums and Tums', 3e6, [null, 5.6, 5.6, 5.8], 18100],
  ['Deep Burn', 5e6, [6, 6, 6, 6], 24140],
  ['Apollo Gym', 7.5e6, [6, 6.2, 6.4, 6.2], 31260],
  ['Gun Shop', 1e7, [6.6, 6.4, 6.2, 6.2], 36610],
  ['Force Training', 1.5e7, [6.4, 6.6, 6.4, 6.8], 46640],
  ["Cha Cha's", 2e7, [6.4, 6.4, 6.8, 7], 56520],
  ['Atlas', 3e7, [7, 6.4, 6.4, 6.6], 67775],
  ['Last Round', 5e7, [6.8, 6.6, 7, 6.6], 84535],
  ['The Edge', 7.5e7, [6.8, 7, 7, 6.8], 106305],
  ["George's", 1e8, [7.3, 7.3, 7.3, 7.3], Infinity]
];
const CHA_CHAS = 19, GEORGES = 23;

export const MONEY_MILESTONES = [1e8, 5e8, 1e9, 2e9, 5e9];
export const STAT_MILESTONES = [5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7, 5e7, 1e8, 5e8, 1e9];

// Stock benefit blocks: [ticker, what it pays, cost of the first block, payout value per year]. Each extra block of
// the same stock costs double for the same payout. FFScouter investment calculator, 24 Sep 2026.
export const BLOCKS = [
  ['SYM', 'Drug Pack weekly', 378.6e6, 223e6],
  ['FHG', 'Feathery Hotel Coupon weekly', 1.77e9, 730.9e6],
  ['TCT', '$1M monthly', 33.4e6, 11.8e6],
  ['PRN', 'Erotic DVD weekly', 642.8e6, 225.4e6],
  ['MUN', 'Six-pack of energy drinks weekly', 2.71e9, 837.4e6],
  ['GRN', '$4M monthly', 164.6e6, 47.1e6],
  ['IOU', '$12M monthly', 536.9e6, 141.3e6],
  ['THS', 'Medical supplies weekly', 58.6e6, 14.8e6],
  ['TMI', '$25M monthly', 1.37e9, 294.4e6],
  ['HRG', 'Random property monthly', 2.67e9, 535.2e6],
  ['EWM', 'Grenades weekly', 286.1e6, 56.3e6],
  ['TSB', '$50M monthly', 3.51e9, 588.7e6],
  ['LSC', 'Lottery voucher weekly', 293e6, 47e6],
  ['CNC', '$80M monthly', 6.2e9, 941.9e6],
  ['ASS', 'Six-pack of alcohol weekly', 360e6, 46.6e6],
  ['PTS', '100 points weekly', 813.7e6, 163.1e6] // 10M shares; 100 points at $31,357 (Torn API)
];
const TCI_COST = 1.75e9; // +10% bank interest, passive: 1.5M shares at the Sep 2026 price (Torn API)

// trainShare: fraction of each day's income that buys energy (stats); the rest builds capital (money).
// Everyone puts ~90% toward the PI until it's rented (Baldr: PI first).
export const PATHS = {
  income: { label: 'Income first', trainShare: (s) => (s.bank >= 2e9 ? 0.5 : 0.1), jumpEvery: 0, ratioBuild: false },
  balanced: { label: 'Balanced', trainShare: (s) => (s.bank >= 2e9 ? 0.7 : 0.45), jumpEvery: 7, ratioBuild: true },
  stats: { label: 'Stats first', trainShare: () => 0.8, jumpEvery: 2, ratioBuild: true }
};

export const DEFAULTS = {
  days: 1826,
  daysPerWeek: 7,
  checkins: 5, // log-ins per active day
  donator: 'real', // 'no' | 'real' (paid with real money) | 'ingame' (packs bought with game cash)
  startStats: 5000,
  startCash: 2e6,
  startGym: 4, // Silver Gym
  xanaxPrice: 850e3, // YATA market value, Sep 2026
  refillPrice: 784e3, // 25 points at $31,357 (Torn API points market, Sep 2026)
  xtcPrice: 37e3, // YATA market value, Sep 2026
  jumpCost: 25.8e6, // 5 bought eDVDs ($4.32M each), XTC, 4 Xanax to stack, a refill (Torn API prices, Sep 2026). Job eDVDs make it cheaper
  jumpEnergy: 1150, // Happy Jump Training guide, method B
  jumpHappy: 35000,
  tripProfitPI: 660e3, // 15 long-haul plushies at ~$44k profit each (YATA, Sep 2026)
  tripProfitStd: 405e3, // 10 items, minus a long-haul ticket
  suitcaseCost: 10e6, // large suitcase: 15 -> 18 items a trip (Torn wiki, Travel)
  piRent: 12.5e6, // 3,600-happy PI for 30 days (Baldr)
  pilotPerDay: 30e3, // Property wiki
  piBudget: 15e6,
  donatorPackMonth: 23.5e6, // resale value of a donator pack (Baldr)
  startAge: 60, // account age in days when the projection starts (a fresh level 15)
  extraItems: 0, // extra travel items per trip, e.g. from the faction Excursion upgrade (up to +10)
  eduDoneDays: [], // days on which each course in the path's education plan finishes (from the page)
  bankAprShort: 0.4334, // 2-week terms with no bank merits (FFScouter, Sep 2026)
  bankAprLong: 0.5146, // 3-month terms with no bank merits; used once $2B is invested
  bankCap: 2e9,
  stockRatePerYear: 0.1, // shares held toward the next block: price growth only (~10% a year, Stock Market wiki)
  perk: 0.02, // gym-gain perks: Sports Science education. Faction Steadfast and job perks come on top
  happyPre: 1925, // rented Ranch before the PI
  happyPI: 3600 // rented 3,600-happy PI (Baldr's sweet spot)
};

const STAT_A = 1775, STAT_B = 1150; // Training Formula V2.0 constants, averaged over the four stats

// Training Formula V2.0 (Vladar): expected gain per point of energy. The stat term stops growing at 50M.
export function gainPerEnergy(statSize, happy, dots, perk) {
  const s = Math.min(statSize, 5e7);
  const core = s * (1 + 0.07 * Math.log(1 + happy / 250)) + 8 * happy ** 1.05 + (1 - (happy / 99999) ** 2) * STAT_A + STAT_B;
  return (core / 200000) * dots * (1 + perk);
}

export function naturalEnergy(checkins, donator) {
  const bar = donator === 'no' ? 100 : 150;
  const perDay = bar * 4.8; // a full bar every 5 hours
  const overnightLoss = perDay / 3 - bar; // 8 hours asleep regenerates past a full bar
  return checkins > 0 ? Math.min(perDay - overnightLoss, checkins * bar) : 0;
}

function bestDots(gym, special) {
  const dots = [0, 0, 0, 0];
  for (let g = 0; g <= gym; g++) GYMS[g][2].forEach((d, i) => { if (d !== null && d > dots[i]) dots[i] = d; });
  if (special.frontline) { dots[0] = Math.max(dots[0], 7.5); dots[1] = Math.max(dots[1], 7.5); }
  if (special.gym3000) dots[0] = Math.max(dots[0], 8);
  return dots.reduce((a, b) => a + b, 0) / 4;
}

// Spread n events evenly over a period of p days.
const evenly = (d, n, p) => Math.floor(((d + 1) * n) / p) > Math.floor((d * n) / p);

// Pay from cash first, then the bank (1–2 week terms free up often), then the training wallet.
function pay(s, amount) {
  if (s.cash + s.bank + s.wallet < amount) return false;
  let rest = amount;
  const fromCash = Math.min(s.cash, rest); s.cash -= fromCash; rest -= fromCash;
  const fromBank = Math.min(s.bank, rest); s.bank -= fromBank; rest -= fromBank;
  s.wallet -= rest;
  return true;
}

// Every medal or honor earns one merit (Merit wiki). These are the awards the model can see; thresholds and names
// come from the Torn API award lists. Levels, crimes and fights earn more that the model doesn't track.
const NETWORTH_MEDALS = [['Apprentice', 1e5, 3], ['Entrepreneur', 2.5e5, 3], ['Executive', 5e5, 3], ['Millionaire', 1e6, 3],
  ['Multimillionaire', 2.5e6, 7], ['Capitalist', 1e7, 7], ['Plutocrat', 2.5e7, 14], ['Aristocrat', 1e8, 14], ['Mogul', 2.5e8, 28],
  ['Billionaire', 1e9, 28], ['Multibillionaire', 2.5e9, 56], ['Baron', 1e10, 56], ['Oligarch', 2.5e10, 112], ['Tycoon', 1e11, 112]];
const STAT_HONORS = [['Lean', 100], ['Fit', 1e3], ['Healthy', 1e4], ['Toned', 1e5], ['Athletic', 1e6], ['Conditioned', 1e7],
  ['Pumped', 1e8], ['Jacked', 1e9], ['Ripped', 1e10], ['Shredded', 1e11]];
// One honor per stat at each size; the model assumes your total is spread across the four stats
const PER_STAT_HONORS = [[1e6, 'Abaddon, Supersonic, Behemoth, Draco'], [1e7, 'Powerhouse, Turbocharged, Reinforced, Free Runner'],
  [1e8, 'Mighty Roar, Lightspeed, Bulletproof, Alpinist'], [1e9, 'Well Built, Arrowshot, Shielded, Funambulist']];
const TRIP_AWARDS = [['Frequent Flyer (medal)', 25], ['Jetlagged', 100], ['Mile High Club (honor)', 100], ['Mile High Club (medal)', 500],
  ['There And Back Again', 1000]];
const AIR_DAY_HONORS = [['Tourist', 7], ['Frequent Flyer (honor)', 31], ['Globetrotter', 365]];
const IMPORT_HONORS = [['Mule', 100], ['Smuggler', 1000], ['Trafficker', 10000]];
const COURSE_HONORS = [['Smart Alec', 10], ['Clever Dick', 25], ['Wise Guy', 50], ['Whiz Kid', 100]];
const FACTION_MEDALS = ['Apprentice', 'Committed', 'Loyal', 'Dedicated', 'Faithful', 'Allegiant', 'Devoted', 'Dutiful', 'Flawless', 'Honorable']
  .map((n, i) => [`${n} Faction Member`, (i + 1) * 100]);

function buildAwards() {
  const list = [];
  for (const [name, at, hold] of NETWORTH_MEDALS) list.push({ name, merits: 1, networth: at, hold });
  for (const [name, at] of STAT_HONORS) list.push({ name, merits: 1, test: (s) => s.stats >= at });
  for (const [at, names] of PER_STAT_HONORS) list.push({ name: names, merits: 4, test: (s) => s.stats / 4 >= at });
  for (const [name, at] of TRIP_AWARDS) list.push({ name, merits: 1, test: (s) => s.trips >= at });
  // 50 trips to each of the four long-haul countries the model flies (Argentina, UAE, China, South Africa)
  list.push({ name: 'Maradona, Land Of Promise, Year Of The Dragon, Cape Town', merits: 4, test: (s) => s.trips >= 200 });
  for (const [name, at] of AIR_DAY_HONORS) list.push({ name, merits: 1, test: (s) => s.airHours / 24 >= at });
  for (const [name, at] of IMPORT_HONORS) list.push({ name, merits: 1, test: (s) => s.imports >= at });
  for (const [name, at] of COURSE_HONORS) list.push({ name, merits: 1, test: (s) => s.courses >= at });
  for (const [name, at] of FACTION_MEDALS) list.push({ name, merits: 1, test: (s, d) => d >= at });
  list.push({ name: 'Pocket Money', merits: 1, test: (s) => s.bank > 0 });
  list.push({ name: 'Moneybags', merits: 1, test: (s) => s.stocks + s.blockValue >= 1e8 });
  list.push({ name: 'Green, Green Grass', merits: 1, test: (s) => s.bank >= 1e9 });
  return list;
}


// Merits on hand by account age, fitted to 90 real players' award counts (each award is a merit):
// median ~60 under 3 months, ~130 at 3–12 months, ~195 at 1–2 years. merits ≈ 22.6 × age^0.33 (R² 0.49).
export const meritsByAge = (days) => Math.floor(22.6 * Math.max(1, days) ** 0.329);

// Where each path spends merits, in order: [upgrade, level to reach]. Upgrade n costs n merits (55 for 10/10).
export const MERIT_PLANS = {
  income: [['Education Length', 10], ['Bank Interest', 10], ['Protection', 10], ['Evasion', 10]],
  balanced: [['Education Length', 10], ['Bank Interest', 5], ['Main stat', 10], ['Second stat', 10], ['Bank Interest', 10]],
  stats: [['Main stat', 10], ['Second stat', 10], ['Education Length', 10], ['Bank Interest', 3], ['Third stat', 10], ['Fourth stat', 10]]
};

// Daily bank rate: live base APR, +5% per Bank Interest merit, +10% with the TCI block.
function bankRate(o, capped, tci, merits) {
  return ((capped ? o.bankAprLong : o.bankAprShort) * (1 + 0.05 * merits) * (tci ? 1.1 : 1)) / 365;
}

// The next block to save for: the best yearly return for its price, even if it costs more than you have yet.
// (Buying whatever is affordable fills up on weak second blocks; working down the list returns more.)
// TCI's return is the extra bank interest it adds.
function nextBlock(s, o) {
  let best = null;
  for (const [code, , cost1, payout] of BLOCKS) {
    const owned = s.blocks[code] || 0;
    const cost = cost1 * 2 ** owned;
    if (owned >= 3) continue;
    if (!best || payout / cost > best.roi) best = { code, cost, payout, roi: payout / cost };
  }
  if (!s.tci) {
    const extra = 0.1 * Math.min(s.bank, o.bankCap) * bankRate(o, s.bank >= o.bankCap, false, s.merit['Bank Interest'] || 0) * 365;
    if (extra / TCI_COST > best.roi) best = { code: 'TCI', cost: TCI_COST, payout: 0, roi: extra / TCI_COST };
  }
  return best;
}

// Rent a PI when its extra flying profit (15 items, no tickets) covers its cost,
// or once you're earning enough that the rent is small change and you can take it for the happy.
function piWorthRenting(o, bank) {
  const cost = o.piRent / 30 + o.pilotPerDay;
  const trips = (o.daysPerWeek / 7) * Math.min(3, o.checkins / 2);
  const uplift = trips * (o.tripProfitPI - o.tripProfitStd);
  const income = trips * o.tripProfitPI + bank * bankRate(o, false, false, 5);
  return uplift > cost || cost < income * 0.15;
}

export function simulate(pathKey, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const path = PATHS[pathKey];
  const s = {
    cash: o.startCash, bank: 0, stocks: 0, wallet: 0, stats: o.startStats,
    gym: o.startGym, gymEnergy: 0, special: { frontline: false, gym3000: false },
    pi: false, piDue: 0, lastJump: -1e9, suitcase: false,
    blocks: {}, blockValue: 0, blockPayout: 0, tci: false,
    trips: 0, airHours: 0, imports: 0, courses: 0,
    meritsEarned: 0, meritsSpent: 0, merit: {}, planStep: 0
  };
  const days = [];
  const bar = o.donator === 'no' ? 100 : 150;
  const awards = buildAwards();
  const earned = new Set(), since = {};
  const meritPlan = MERIT_PLANS[pathKey];

  for (let d = 0; d < o.days; d++) {
    const active = evenly(d, o.daysPerWeek, 7);
    const piWorthIt = piWorthRenting(o, s.bank);
    const L = { day: d, active, natural: 0, xanax: 0, refill: 0, xtc: false, jump: false, gymEnergy: 0,
      statGain: 0, fly: 0, interest: 0, spendEnergy: 0, spendFixed: 0, spendGym: 0, dots: 0, happy: 0 };

    // Passive income arrives every day, played or not
    const rate = bankRate(o, s.bank >= o.bankCap, s.tci, s.merit['Bank Interest'] || 0);
    L.interest = s.bank * rate;
    L.blockPay = s.blockPayout / 365; // block payouts, sold at market value
    L.bought = [];
    s.stocks *= 1 + o.stockRatePerYear / 365;

    // Fixed costs. Can't cover the PI? Move out until you can.
    if (s.pi && d >= s.piDue) {
      if (pay(s, o.piRent)) { L.spendFixed += o.piRent; s.piDue = d + 30; } else s.pi = false;
    }
    if (s.pi) { if (pay(s, o.pilotPerDay)) L.spendFixed += o.pilotPerDay; else s.pi = false; }
    if (o.donator === 'ingame' && pay(s, o.donatorPackMonth / 31)) L.spendFixed += o.donatorPackMonth / 31;

    // Energy for the day, bought from the training wallet
    const perStat = s.stats / 4;
    const baseHappy = (s.pi ? o.happyPI : o.happyPre) * 0.9; // training burns some happy as you go
    const sessions = [];
    if (active) {
      L.natural = naturalEnergy(o.checkins, o.donator);
      const slots = Math.min(3, o.checkins);
      const canJump = path.jumpEvery && perStat < 2e5 && d - s.lastJump >= path.jumpEvery && s.wallet >= o.jumpCost;
      if (canJump) {
        s.wallet -= o.jumpCost; L.spendEnergy += o.jumpCost; s.lastJump = d; L.jump = true;
        sessions.push({ e: o.jumpEnergy, h: o.jumpHappy });
      } else {
        L.xtc = s.stats < 1e5 && s.wallet >= o.xtcPrice;
        if (L.xtc) { s.wallet -= o.xtcPrice; L.spendEnergy += o.xtcPrice; }
        // In jump season, save for the next jump (its Xanax are stacked into it) instead of training Xanax in between
        const jumpSeason = path.jumpEvery && perStat < 2e5;
        const freeSlots = jumpSeason ? 0 : slots - (L.xtc ? 1 : 0);
        let budget = s.wallet;
        L.xanax = Math.max(0, Math.min(freeSlots, Math.floor(budget / o.xanaxPrice)));
        budget -= L.xanax * o.xanaxPrice;
        L.refill = !jumpSeason && pathKey !== 'income' && budget >= o.refillPrice ? 1 : 0;
        const cost = L.xanax * o.xanaxPrice + L.refill * o.refillPrice;
        s.wallet -= cost; L.spendEnergy += cost;
        const total = L.natural + 250 * L.xanax + bar * L.refill;
        if (L.xtc) sessions.push({ e: Math.min(400, total), h: baseHappy * 2 }, { e: Math.max(0, total - 400), h: baseHappy });
        else sessions.push({ e: total, h: baseHappy });
      }
    }

    // Train
    const dots = bestDots(s.gym, s.special);
    L.dots = dots; L.happy = sessions.length ? sessions[0].h : baseHappy;
    for (const ses of sessions) {
      const steps = Math.max(1, Math.ceil(ses.e / 50)), e = ses.e / steps;
      for (let i = 0; i < steps; i++) {
        const g = gainPerEnergy(s.stats / 4, ses.h, dots, o.perk) * e;
        s.stats += g; L.statGain += g;
      }
      s.gymEnergy += ses.e; L.gymEnergy += ses.e;
    }

    // Earn
    const items = s.pi ? 15 + (s.suitcase ? 3 : 0) + o.extraItems : 10 + o.extraItems;
    const perTrip = s.pi ? (o.tripProfitPI / 15) * items : (o.tripProfitStd / 10) * items;
    const tripsToday = active ? Math.min(s.pi ? 4 : 3, o.checkins / 2) : 0;
    L.fly = tripsToday * perTrip;
    // Long-haul round trips: ~5h20m with a PI, ~7h40m on standard tickets (China, Travel wiki)
    s.trips += tripsToday; s.airHours += tripsToday * (s.pi ? 5.33 : 7.63); s.imports += tripsToday * items;
    L.perTrip = perTrip;
    const income = L.interest + L.fly + L.blockPay;

    // Distribute what's left after running costs: PI first, then the path's split between energy (stats) and capital (money)
    const share = s.pi || !piWorthIt ? path.trainShare(s) : 0.1;
    const runningCosts = (s.pi ? o.piRent / 30 + o.pilotPerDay : 0) + (o.donator === 'ingame' ? o.donatorPackMonth / 31 : 0);
    const toTraining = Math.max(0, income - runningCosts) * share;
    s.wallet += toTraining;
    s.cash += income - toTraining;
    if (s.wallet > 6e7) { s.cash += s.wallet - 6e7; s.wallet = 6e7; }
    if (!s.pi && piWorthIt && s.cash >= o.piBudget) { s.pi = true; s.piDue = d; }
    // Once the PI is running, the large suitcase is the next buy (Baldr)
    if (s.pi && !s.suitcase && s.cash + s.bank >= o.piBudget + o.suitcaseCost && pay(s, o.suitcaseCost)) { s.suitcase = true; L.spendGym += o.suitcaseCost; }

    // Unlock gyms when the energy is in and the fee is affordable
    while (s.gym < GYMS.length - 1 && s.gymEnergy >= GYMS[s.gym][3] && s.cash >= GYMS[s.gym + 1][1]) {
      s.gymEnergy -= GYMS[s.gym][3]; s.gym++; s.cash -= GYMS[s.gym][1]; L.spendGym += GYMS[s.gym][1];
    }
    if (path.ratioBuild && !s.special.frontline && s.gym >= CHA_CHAS && s.cash >= 5e7) { s.special.frontline = true; s.cash -= 5e7; L.spendGym += 5e7; }
    if (path.ratioBuild && !s.special.gym3000 && s.gym >= GEORGES && s.cash >= 1e8) { s.special.gym3000 = true; s.cash -= 1e8; L.spendGym += 1e8; }

    // Park spare cash: bank up to the cap, then stock blocks. Keep next month's rent on hand;
    // until the PI is rented, save toward it (or, if it won't pay for itself, keep a $15M float).
    const reserve = s.pi || !piWorthIt ? o.piBudget : Infinity;
    if (s.cash > reserve) {
      let spare = s.cash - reserve;
      const toBank = Math.min(spare, Math.max(0, o.bankCap - s.bank));
      s.bank += toBank; spare -= toBank; s.stocks += spare; s.cash = reserve;
    }

    // Buy a benefit block whenever it returns more than the same money earns where it sits now
    for (let i = 0; i < 5; i++) {
      const capped = s.bank >= o.bankCap;
      const b = nextBlock(s, o);
      const alternative = capped ? o.stockRatePerYear : bankRate(o, false, s.tci, s.merit['Bank Interest'] || 0) * 365;
      if (b.roi <= alternative || s.stocks + (capped ? 0 : s.bank) < b.cost) break;
      const fromPool = Math.min(s.stocks, b.cost);
      s.stocks -= fromPool; s.bank -= b.cost - fromPool;
      if (b.code === 'TCI') s.tci = true;
      else { s.blocks[b.code] = (s.blocks[b.code] || 0) + 1; s.blockPayout += b.payout; }
      s.blockValue += b.cost; L.bought.push(b.code);
    }

    L.cash = s.cash; L.bank = s.bank; L.stocks = s.stocks; L.wallet = s.wallet;
    L.networth = s.cash + s.bank + s.stocks + s.wallet + s.blockValue;

    // Awards the model can see (shown on the page). Merits to spend come from the calibrated curve, which counts every award
    s.courses = o.eduDoneDays.filter((x) => x <= d).length;
    L.awards = [];
    for (const a of awards) {
      if (earned.has(a)) continue;
      let got = false;
      if (a.networth) {
        if (L.networth >= a.networth) { since[a.name] ??= d; got = d - since[a.name] >= a.hold; } else delete since[a.name];
      } else got = a.test(s, d);
      if (got) { earned.add(a); s.meritsEarned += a.merits; L.awards.push(a.name); }
    }
    L.meritsEarned = s.meritsEarned;
    L.meritsAvail = meritsByAge(o.startAge + d);
    L.upgrades = [];
    while (s.planStep < meritPlan.length) {
      const [upgrade, target] = meritPlan[s.planStep];
      const level = s.merit[upgrade] || 0;
      if (level >= target) { s.planStep++; continue; }
      if (L.meritsAvail - s.meritsSpent < level + 1) break;
      s.meritsSpent += level + 1; s.merit[upgrade] = level + 1; L.upgrades.push(`${upgrade} ${level + 1}/10`);
    }
    L.merit = { ...s.merit };
    L.blockValue = s.blockValue; L.blocks = { ...s.blocks }; L.tci = s.tci;
    L.stats = s.stats; L.gym = s.gym; L.pi = s.pi; L.suitcase = s.suitcase; L.special = { ...s.special };
    days.push(L);
  }
  return days;
}

export function milestoneDays(days, key, marks) {
  return marks.map((m) => { const hit = days.find((x) => x[key] >= m); return hit ? hit.day : null; });
}
