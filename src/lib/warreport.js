// Ranked war report from the Torn API, run entirely in the browser. The key is only ever sent to api.torn.com.
//
// Two ways to count, depending on the key:
//  - exact:  the faction attack log (needs a key with faction API access). Each attack says whether it was a
//            ranked-war hit and whether the overseas bonus applied, so war hits abroad are counted exactly.
//  - chains: chain reports (any key). "Abroad" there counts every overseas hit made during a chain, war or not,
//            and hits made while no chain was running are missed.
// Once a war has ended, Torn's official war report gives every member's exact war hits and score, so both
// methods take hits and score from it and use their own data for the rest.

const API = 'https://api.torn.com/v2';

const ERRORS = {
  0: 'Torn returned an unknown error. Try again in a minute.',
  2: "That key isn't valid. Check you copied all 16 characters.",
  5: 'Too many requests. Torn allows about 100 a minute per key; wait a minute and try again.',
  8: 'Torn has temporarily blocked this IP. Try again later.',
  9: 'The Torn API is down for maintenance.',
  10: 'That key belongs to a player in federal jail.',
  13: "That key's owner has been inactive too long for the API.",
  16: "That key's access level is too low. Use a Limited key.",
  18: 'That key is paused. Unpause it in Torn settings.'
};

export class ApiError extends Error {}

async function call(key, pathOrUrl) {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : API + pathOrUrl;
  let res;
  try {
    res = await fetch(url, { headers: { Authorization: `ApiKey ${key}` } });
  } catch {
    throw new ApiError("Couldn't reach the Torn API. Check your connection.");
  }
  const data = await res.json();
  if (data.error) throw new ApiError(ERRORS[data.error.code] ?? `Torn API error: ${data.error.error}`);
  return data;
}

export async function loadFaction(key) {
  const [info, basic, wars, members] = await Promise.all([
    call(key, '/key/info'),
    call(key, '/faction/basic'),
    call(key, '/faction/rankedwars?limit=20'),
    call(key, '/faction/members')
  ]);
  const faction = basic.basic;
  return {
    faction,
    exact: !!info.info.access.faction,
    wars: wars.rankedwars.map((w) => {
      const us = w.factions.find((f) => f.id === faction.id);
      const them = w.factions.find((f) => f.id !== faction.id);
      return { id: w.id, start: w.start, end: w.end || null, target: w.target, winner: w.winner, us, them };
    }),
    names: Object.fromEntries(members.members.map((m) => [m.id, m.name])),
    positions: Object.fromEntries(members.members.map((m) => [m.id, m.position]))
  };
}

const WINS = new Set(['Attacked', 'Mugged', 'Hospitalized', 'Arrested', 'Looted', 'Bounty', 'Special']);

function row(rows, id, name) {
  rows[id] ??= { id, name: name ?? `[${id}]`, hits: 0, score: null, abroad: 0, unknown: 0, respect: 0, lost: 0, net: 0, taken: 0, leave: 0, mug: 0, hosp: 0, assists: 0, losses: 0 };
  return rows[id];
}

// The official report (members' hits and score, plus the rewards) only exists once the war is over.
async function official(key, war, factionId) {
  if (!war.end) return null;
  try {
    const rep = (await call(key, `/faction/${war.id}/rankedwarreport`)).rankedwarreport;
    return rep.factions.find((f) => f.id === factionId) ?? null;
  } catch {
    return null;
  }
}

function applyOfficial(rows, members) {
  if (!members) return false;
  for (const m of members) {
    const r = row(rows, m.id, m.name);
    r.hits = m.attacks;
    r.score = m.score;
  }
  return true;
}

// Every attack one way (outgoing or incoming) in the war window, 100 per page.
async function readAttacks(key, war, direction, onProgress, onAttack) {
  await readPages(key, war, `/faction/attacks?filters=${direction}`, 'attacks', `${direction} attacks`, onProgress, onAttack);
}

async function readPages(key, war, path, field, what, onProgress, onItem) {
  const to = war.end ?? Math.floor(Date.now() / 1000);
  let next = `${path}${path.includes('?') ? '&' : '?'}from=${war.start}&to=${to}&limit=100&sort=ASC`;
  let read = 0;
  while (next) {
    const data = await call(key, next);
    data[field].forEach(onItem);
    read += data[field].length;
    onProgress?.(`Read ${read} ${what}…`);
    next = data[field].length === 100 ? data._metadata?.links?.next : null;
  }
}

// Where and by whom each member got beaten during the war, and how long they lasted after a revive.
// "Abroad" is any fight that got Torn's overseas bonus; the attack log doesn't say which country.
export const BEATEN_BY = ['war', 'bounty', 'other'];
const emptyDefense = () => ({ torn: { war: 0, bounty: 0, other: 0 }, abroad: { war: 0, bounty: 0, other: 0 }, revives: 0, gaps: [], quick: 0 });
const QUICK = 5 * 60;

async function buildDefense(key, war, factionId, beatings, rows, onProgress) {
  for (const b of beatings) {
    const d = (rows[b.id].defense ??= emptyDefense());
    d[b.place][b.by]++;
  }
  // Who our members revived (us, the enemy or anyone else), and who revived our members.
  const side = (f) => (f?.id === factionId ? 'us' : f?.id === war.them?.id ? 'them' : 'other');
  const revivers = {};
  const received = { us: 0, them: 0, other: 0 };
  const revives = [];
  await readPages(key, war, '/faction/revives', 'revives', 'revives', onProgress, (r) => {
    const ok = /success/i.test(r.result);
    if (r.reviver?.faction?.id === factionId) {
      const m = (revivers[r.reviver.id] ??= { id: r.reviver.id, name: r.reviver.name, us: 0, them: 0, other: 0, failed: 0 });
      if (ok) m[side(r.target?.faction)]++; else m.failed++;
    }
    if (r.target?.faction?.id === factionId && ok) {
      received[side(r.reviver?.faction)]++;
      revives.push({ id: r.target.id, t: r.timestamp });
    }
  });
  for (const r of revives) {
    if (!rows[r.id]) continue;
    const d = (rows[r.id].defense ??= emptyDefense());
    d.revives++;
    const next = beatings.find((b) => b.id === r.id && b.t > r.t);
    if (!next) continue;
    d.gaps.push(next.t - r.t);
    if (next.t - r.t <= QUICK) d.quick++;
  }
  return { count: revives.length, revivers: Object.values(revivers), received };
}

// Exact: every outgoing and incoming attack in the war window.
// The timeline holds one entry per war hit won, by either side, for the charts:
// { t: unix seconds, us: true when we made the hit, id: our member who hit or was hit, respect }.
export async function buildExact(key, war, factionId, names, onProgress) {
  const rows = {};
  const timeline = [];
  await readAttacks(key, war, 'outgoing', onProgress, (a) => {
    if (!a.is_ranked_war || !a.attacker) return;
    const r = row(rows, a.attacker.id, a.attacker.name ?? names[a.attacker.id]);
    if (a.result === 'Assist') { r.assists++; return; }
    if (!WINS.has(a.result)) { r.losses++; return; }
    r.hits++;
    r.respect += a.respect_gain;
    if (a.modifiers?.overseas > 1) r.abroad++;
    if (a.result === 'Attacked') r.leave++;
    else if (a.result === 'Mugged') r.mug++;
    else if (a.result === 'Hospitalized') r.hosp++;
    timeline.push({ t: a.ended, us: true, id: a.attacker.id, respect: a.respect_gain });
  });
  // The enemy's war score is the respect they gain from beating us, so that is what each member "lost".
  // Every other win against a member is kept too, to show who beat them and where.
  const beatings = [];
  await readAttacks(key, war, 'incoming', onProgress, (a) => {
    if (!WINS.has(a.result) || (a.defender.faction && a.defender.faction.id !== factionId)) return;
    const r = row(rows, a.defender.id, a.defender.name ?? names[a.defender.id]);
    const by = a.result === 'Bounty' ? 'bounty' : a.attacker?.faction?.id === war.them?.id ? 'war' : 'other';
    beatings.push({ t: a.ended, id: a.defender.id, place: a.modifiers?.overseas > 1 ? 'abroad' : 'torn', by });
    if (!a.is_ranked_war || !a.attacker) return;
    r.taken++;
    r.lost += a.respect_gain;
    timeline.push({ t: a.ended, us: false, id: a.defender.id, respect: a.respect_gain });
  });
  beatings.sort((x, y) => x.t - y.t);
  const reviveStats = await buildDefense(key, war, factionId, beatings, rows, onProgress);
  timeline.sort((x, y) => x.t - y.t);
  for (const r of Object.values(rows)) r.net = r.respect - r.lost;
  const ours = await official(key, war, factionId);
  const hasOfficial = applyOfficial(rows, ours?.members);
  const chainReports = await loadWarChains(key, war, onProgress);
  return { rows: Object.values(rows).filter((r) => r.hits || r.abroad || r.assists || r.losses || r.taken || r.defense), official: hasOfficial, rewards: ours?.rewards ?? null, chainReports, timeline, revives: reviveStats };
}

// Every chain that ran during the war, including one still going.
export async function loadWarChains(key, war, onProgress) {
  const to = war.end ?? Math.floor(Date.now() / 1000);
  const list = (await call(key, `/faction/chains?from=${war.start}&to=${to}&limit=100`)).chains;
  const ids = list.map((c) => c.id);
  const current = (await call(key, '/faction/chainreport')).chainreport;
  const reports = [];
  if (current && current.start >= war.start && !ids.includes(current.id)) reports.push(current);
  for (const [i, id] of ids.entries()) {
    onProgress?.(`Reading chain ${i + 1} of ${ids.length}…`);
    reports.push((await call(key, `/faction/${id}/chainreport`)).chainreport);
  }
  return reports;
}

// Chains: add up the chain reports, then take hits and score from the official report when there is one.
export async function buildFromChains(key, war, factionId, names, onProgress) {
  const reports = await loadWarChains(key, war, onProgress);
  const rows = {};
  for (const rep of reports) {
    for (const a of rep.attackers) {
      const r = row(rows, a.id, names[a.id]);
      r.hits += a.attacks.war;
      r.abroad += a.attacks.overseas;
      r.respect += a.respect.total;
      r.leave += a.attacks.leave;
      r.mug += a.attacks.mug;
      r.hosp += a.attacks.hospitalize;
      r.assists += a.attacks.assists;
      r.losses += a.attacks.losses;
    }
  }
  // War hits made while no chain was running have no location on record: count them per member.
  const inChains = Object.fromEntries(Object.values(rows).map((r) => [r.id, r.hits]));
  const ours = await official(key, war, factionId);
  const hasOfficial = applyOfficial(rows, ours?.members);
  for (const r of Object.values(rows)) r.unknown = Math.max(0, r.hits - (inChains[r.id] ?? 0));
  return { rows: Object.values(rows).filter((r) => r.hits || r.abroad), chains: reports.length, official: hasOfficial, rewards: ours?.rewards ?? null, chainReports: reports };
}

// Current market price of each item id, for valuing war rewards.
export async function itemPrices(key, ids) {
  if (!ids.length) return {};
  const data = await call(key, `/torn/${ids.join(',')}/items`);
  return Object.fromEntries(data.items.map((i) => [i.id, i.value?.market_price ?? 0]));
}

// Every item's name, id and market price (one call), for valuing awards by name.
let catalog = null;
export async function itemCatalog(key) {
  catalog ??= (await call(key, '/torn/items')).items.map((i) => ({ id: i.id, name: i.name, price: i.value?.market_price ?? 0 }));
  return catalog;
}

// Account age in days for each player id, one profile call each (kept small: only candidates are asked).
const ageCache = {};
export async function playerAges(key, ids, onProgress) {
  const todo = ids.filter((id) => ageCache[id] == null);
  for (const [i, id] of todo.entries()) {
    onProgress?.(`Checking account ages ${i + 1} of ${todo.length}…`);
    ageCache[id] = (await call(key, `/user/${id}/profile`)).profile.age;
  }
  return Object.fromEntries(ids.map((id) => [id, ageCache[id]]));
}
