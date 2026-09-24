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
  refillPrice: 1.365e6, // 25 points (Gym Training Guide for Beginners)
  xtcPrice: 37e3, // YATA market value, Sep 2026
  jumpCost: 16.7e6, // one happy jump (Gym Training Guide for Beginners)
  jumpEnergy: 1150, // Happy Jump Training guide, method B
  jumpHappy: 35000,
  tripProfitPI: 660e3, // 15 long-haul plushies at ~$44k profit each (YATA, Sep 2026)
  tripProfitStd: 405e3, // 10 items, minus a long-haul ticket
  suitcaseCost: 10e6, // large suitcase: 15 -> 18 items a trip (Torn wiki, Travel)
  piRent: 12.5e6, // 3,600-happy PI for 30 days (Baldr)
  pilotPerDay: 30e3, // Property wiki
  piBudget: 15e6,
  donatorPackMonth: 23.5e6, // resale value of a donator pack (Baldr)
  bankRateShort: 0.0015, // per day on 2-week terms: between 43% APR (no merits) and 65% (10/10 bank merits), FFScouter, Sep 2026
  bankRateLong: 0.00211, // per day on 3-month terms with 10/10 bank merits: 77.19% APR, FFScouter, Sep 2026
  bankCap: 2e9,
  stockRatePerYear: 0.1, // Stock Market wiki: prices expected to rise ~10% a year
  perk: 0.1, // gym-gain perks: education + faction Steadfast + job
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

// Rent a PI when its extra flying profit (15 items, no tickets) covers its cost,
// or once you're earning enough that the rent is small change and you can take it for the happy.
function piWorthRenting(o, bank) {
  const cost = o.piRent / 30 + o.pilotPerDay;
  const trips = (o.daysPerWeek / 7) * Math.min(3, o.checkins / 2);
  const uplift = trips * (o.tripProfitPI - o.tripProfitStd);
  const income = trips * o.tripProfitPI + bank * o.bankRateShort;
  return uplift > cost || cost < income * 0.15;
}

export function simulate(pathKey, opts = {}) {
  const o = { ...DEFAULTS, ...opts };
  const path = PATHS[pathKey];
  const s = {
    cash: o.startCash, bank: 0, stocks: 0, wallet: 0, stats: o.startStats,
    gym: o.startGym, gymEnergy: 0, special: { frontline: false, gym3000: false },
    pi: false, piDue: 0, lastJump: -1e9, suitcase: false
  };
  const days = [];
  const bar = o.donator === 'no' ? 100 : 150;

  for (let d = 0; d < o.days; d++) {
    const active = evenly(d, o.daysPerWeek, 7);
    const piWorthIt = piWorthRenting(o, s.bank);
    const L = { day: d, active, natural: 0, xanax: 0, refill: 0, xtc: false, jump: false, gymEnergy: 0,
      statGain: 0, fly: 0, interest: 0, spendEnergy: 0, spendFixed: 0, spendGym: 0, dots: 0, happy: 0 };

    // Passive income arrives every day, played or not
    const rate = s.bank >= o.bankCap ? o.bankRateLong : o.bankRateShort;
    L.interest = s.bank * rate;
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
    const perTrip = s.pi ? o.tripProfitPI * (s.suitcase ? 18 / 15 : 1) : o.tripProfitStd;
    if (active) L.fly = Math.min(s.pi ? 4 : 3, o.checkins / 2) * perTrip;
    L.perTrip = perTrip;
    const income = L.interest + L.fly;

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

    L.cash = s.cash; L.bank = s.bank; L.stocks = s.stocks; L.wallet = s.wallet;
    L.networth = s.cash + s.bank + s.stocks + s.wallet;
    L.stats = s.stats; L.gym = s.gym; L.pi = s.pi; L.suitcase = s.suitcase; L.special = { ...s.special };
    days.push(L);
  }
  return days;
}

export function milestoneDays(days, key, marks) {
  return marks.map((m) => { const hit = days.find((x) => x[key] >= m); return hit ? hit.day : null; });
}
