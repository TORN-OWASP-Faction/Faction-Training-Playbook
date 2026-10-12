// Records each member's status during a war, so the report can time how long members stay alive.
// Torn keeps no status history, so this only sees what happens while a page is open and recording.
// The log is kept in this browser: { lastPoll, members: { [id]: [{ t, state, until, approx }] } }.
import { memberStatuses } from '$lib/warreport.js';

const POLL_MS = 30_000;
// A change seen after a longer gap than this has an unknown time, so it is left out of the timings.
// Browsers slow timers in background tabs to about once a minute, so the limit allows for that.
const MAX_GAP = 150;
const storeKey = (warId) => `ftp:war-live:${warId}`;

export function loadLog(warId) {
  try { return JSON.parse(localStorage.getItem(storeKey(warId)) || 'null'); } catch { return null; }
}

function saveLog(warId, log) {
  try { localStorage.setItem(storeKey(warId), JSON.stringify(log)); } catch { /* storage full or blocked */ }
}

export function clearLog(warId) {
  try { localStorage.removeItem(storeKey(warId)); } catch { /* ignore */ }
}

async function poll(key, warId) {
  const now = Math.floor(Date.now() / 1000);
  const statuses = await memberStatuses(key);
  const log = loadLog(warId) ?? { lastPoll: null, members: {} };
  const approx = !log.lastPoll || now - log.lastPoll > MAX_GAP;
  for (const s of statuses) {
    const list = (log.members[s.id] ??= []);
    const last = list.at(-1);
    if (last && last.state === s.state) continue;
    // A hospital stay that ran out on its own ended at its timer, which is exact.
    const ranOut = last?.state === 'Hospital' && last.until && last.until <= now;
    list.push({ t: ranOut ? last.until : now, state: s.state, until: s.until || null, approx: !last || (approx && !ranOut) });
  }
  log.lastPoll = now;
  saveLog(warId, log);
  return log;
}

// Starts reading statuses every 30 seconds. Returns a function that stops it.
export function startRecording(key, warId, onUpdate, onError) {
  let stopped = false;
  const tick = () => poll(key, warId).then((log) => !stopped && onUpdate(log)).catch((err) => !stopped && onError(err));
  tick();
  const timer = setInterval(tick, POLL_MS);
  return () => { stopped = true; clearInterval(timer); };
}

const OUT_OF = new Set(['Hospital', 'Traveling', 'Jail', 'Federal']);
const FREE = new Set(['Okay', 'Abroad']);

// Where a member was at time t, from the log: 'torn', 'abroad', or null when the log doesn't cover it.
export function placeAt(log, id, t) {
  const list = log?.members[id];
  if (!list?.length || t < list[0].t || t > log.lastPoll + MAX_GAP) return null;
  // The status read after a hit already shows hospital, so look just before the hit.
  let state = null;
  for (const c of list) { if (c.t >= t) break; state = c.state; }
  return state === 'Abroad' ? 'abroad' : state === 'Okay' ? 'torn' : null;
}

// Each time a member got out of hospital or landed, how long until they were beaten.
// Returns one entry per timed stretch: { id, place, from: 'hospital' | 'landed', early, alive (seconds) }.
// Stretches that ended without a beating (they flew, or the war or recording ended) are left out.
export function aliveTimes(log, beatings) {
  if (!log) return [];
  const out = [];
  for (const [idText, list] of Object.entries(log.members)) {
    const id = +idText;
    const hits = beatings.filter((b) => b.id === id);
    list.forEach((c, i) => {
      const prev = list[i - 1];
      if (!prev || c.approx || !FREE.has(c.state) || !OUT_OF.has(prev.state)) return;
      const hit = hits.find((b) => b.t >= c.t);
      const next = list[i + 1];
      if (!hit) return;
      // The stretch has to end with this hit, not with a flight or another change first.
      if (next && next.t + 60 < hit.t) return;
      out.push({
        id, place: c.state === 'Abroad' ? 'abroad' : 'torn',
        from: prev.state === 'Traveling' ? 'landed' : 'hospital',
        early: prev.state === 'Hospital' && !!prev.until && c.t < prev.until - 60,
        alive: hit.t - c.t
      });
    });
  }
  return out;
}
