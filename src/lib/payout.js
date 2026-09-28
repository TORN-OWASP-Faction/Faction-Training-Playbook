// War payout maths. Members earn points (RP); the member pool is a tier % of everything the war paid out,
// and each member gets pool × their points ÷ everyone's points, so payouts always add up to the pool.

export const DEFAULT_RULES = { warPct: 100, bonusPct: 100, reallocate: true, oow: 1.5, assist: 4, minChain: 25 };

// [tier, % of rewards on a win, % on a loss]
export const DEFAULT_TIERS = [['Bronze', 70, 40], ['Silver', 75, 45], ['Gold', 80, 50], ['Platinum', 85, 55], ['Diamond', 90, 60]];

export const DEFAULT_SPLITS = [
  { name: 'Faction cut', qty: 1, price: 0, sold: false, note: '' },
  { name: 'War resupply: points', qty: 0, price: 0, sold: false, note: '' },
  { name: 'War resupply: drugs', qty: 0, price: 0, sold: false, note: '' },
  { name: 'War reimbursements: revives', qty: 0, price: 0, sold: false, note: 'Paid directly to revivers' }
];

// Points per member from the war report rows (official score) and the war's chain reports.
// Torn's war score already includes chain-bonus respect, so reallocating takes each bonus away from
// whoever landed it and shares that chain's bonuses by how many hits each member made in it.
export function memberPoints(rows, chainReports, rules) {
  const pts = {};
  const get = (id, name) => (pts[id] ??= { id, name, score: 0, hits: 0, landed: 0, share: 0, oow: 0, assists: 0 });
  for (const r of rows) Object.assign(get(r.id, r.name), { score: r.score ?? 0, hits: r.hits ?? 0 });

  for (const c of chainReports) {
    const chainHits = c.attackers.reduce((s, a) => s + a.attacks.total, 0);
    const bonus = (c.bonuses ?? []).reduce((s, b) => s + b.respect, 0);
    const long = c.details.chain > rules.minChain;
    for (const b of c.bonuses ?? []) get(b.attacker_id).landed += b.respect;
    for (const a of c.attackers) {
      const p = get(a.id);
      if (chainHits) p.share += (bonus * a.attacks.total) / chainHits;
      if (long) {
        p.oow += Math.max(0, a.attacks.total - a.attacks.war);
        p.assists += a.attacks.assists;
      }
    }
  }

  return Object.values(pts).map((p) => {
    const war = rules.reallocate ? Math.max(0, p.score - p.landed) : p.score;
    const bonus = rules.reallocate ? p.share : 0;
    const rp = (war * rules.warPct) / 100 + (bonus * rules.bonusPct) / 100 + p.oow * rules.oow + p.assists * rules.assist;
    return { id: p.id, name: p.name, hits: p.hits, war, bonus, oow: p.oow, assists: p.assists, rp };
  });
}

export function payout({ totalMade, spent, pct, points }) {
  const pool = (totalMade * pct) / 100;
  const netRP = points.reduce((s, p) => s + p.rp, 0);
  const perPoint = netRP ? pool / netRP : 0;
  const hits = points.reduce((s, p) => s + p.hits, 0);
  const pays = points.map((p) => ({ ...p, pay: p.rp * perPoint }));
  return {
    pool,
    profit: totalMade - spent,
    keeps: totalMade - spent - pool,
    netRP,
    perPoint,
    perHit: hits ? pool / hits : 0,
    check: pool - pays.reduce((s, p) => s + p.pay, 0),
    pays
  };
}

// Special awards (donator packs, event items…) given for a rule, valued at market price.
// rule: 'score' best score above min | 'newScore' best score above min among players younger than maxAge days
//       'abroad' most kills abroad | 'hits' most war hits | 'manual' leadership picks, reason says why
export const AWARD_RULES = [['score', 'Best score'], ['newScore', 'Best score, newer players'], ['abroad', 'Most kills abroad'], ['hits', 'Most war hits'], ['manual', "Leadership's pick"]];

export const DEFAULT_AWARDS = [
  { rule: 'score', min: 200, maxAge: 150, reason: '', item: 'Donator Pack', qty: 1, price: 0, winner: null },
  { rule: 'newScore', min: 50, maxAge: 150, reason: '', item: 'Donator Pack', qty: 1, price: 0, winner: null },
  { rule: 'manual', min: 0, maxAge: 150, reason: 'for exemplary teamwork', item: 'Donator Pack', qty: 1, price: 0, winner: null },
  { rule: 'abroad', min: 0, maxAge: 150, reason: '', item: 'Business Class Ticket', qty: 1, price: 0, winner: null }
];

export function awardText(a) {
  switch (a.rule) {
    case 'score': return `to the best score above ${a.min}`;
    case 'newScore': return `to the best score (player under ${a.maxAge} days and score above ${a.min})`;
    case 'abroad': return 'to the most kills abroad';
    case 'hits': return 'to the most war hits';
    default: return a.reason || "at leadership's discretion";
  }
}

// rows: war report rows (score, hits, abroad). ages: { id: account age in days }. Returns a row or null.
export function awardWinner(a, rows, ages = {}) {
  const best = (list, key) => list.reduce((top, r) => (!top || r[key] > top[key] ? r : top), null);
  switch (a.rule) {
    case 'score': return best(rows.filter((r) => (r.score ?? 0) > a.min), 'score');
    case 'newScore': return best(rows.filter((r) => (r.score ?? 0) > a.min && ages[r.id] != null && ages[r.id] < a.maxAge), 'score');
    case 'abroad': return best(rows.filter((r) => r.abroad > 0), 'abroad');
    case 'hits': return best(rows.filter((r) => r.hits > 0), 'hits');
    default: return null;
  }
}
