// Faction message templates. Each has form fields ("knobs") and a render(values) that builds the message HTML.
// Output sticks to simple tags (p, b, i, u, ul, li, a, hr, span colour) so it pastes cleanly into Torn's editor.

import { EVENTS, status, when } from '$lib/data/events.js';

// Colours for headings: at least 4.5:1 on dark backgrounds (Torn's dark mode) and 3:1 on light ones.
export const COLORS = { red: '#e0645f', green: '#2e9e50', amber: '#c98010', blue: '#4a8fd0', grey: '#8a8a8a' };

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const title = (text, color) => `<p><b><span style="color:${color}">${text}</span></b></p>`;
const heading = (text) => `<p><b><u>${text}</u></b></p>`;
const list = (items) => {
  const kept = items.filter(Boolean);
  return kept.length ? `<ul>${kept.map((i) => `<li>${i}</li>`).join('')}</ul>` : '';
};
const lines = (text) => esc(text).split(/\n+/).filter((l) => l.trim()).map((l) => `<li>${l}</li>`).join('');
const extra = (text) => (text?.trim() ? heading('Also') + `<ul>${lines(text)}</ul>` : '');
const contact = (who, where) =>
  who?.trim() || where?.trim()
    ? `<p><i>Questions? Ask ${esc(who?.trim() || 'leadership')}${where?.trim() ? ` in ${esc(where)}` : ''}.</i></p>`
    : '';

// "2026-09-27" + "18:00" -> "Saturday 27 September, 18:00 TCT"
export function tct(date, time) {
  if (!date) return '[date] TCT';
  const [y, m, d] = date.split('-').map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
  return `${day}${time ? `, ${time}` : ''} TCT`;
}

const FINISH = { leave: 'Leave', hosp: 'Hospitalize', mug: 'Mug' };

export const TEMPLATES = [
  {
    id: 'war',
    name: 'Ranked war rules',
    blurb: 'A normal, all-out ranked war: when it starts, how to prepare, and how to hit.',
    fields: [
      { key: 'enemy', label: 'Enemy faction', type: 'text', value: '[Enemy faction]' },
      { key: 'date', label: 'Start date (TCT)', type: 'date', value: '' },
      { key: 'time', label: 'Start time (TCT)', type: 'time', value: '18:00' },
      { key: 'online', label: 'Ask everyone to be online at the start', type: 'toggle', value: true },
      { key: 'stack', label: 'Energy to bring', type: 'select', value: 'full', options: [['none', "Don't ask"], ['full', 'A full energy bar'], ['xan2', 'Full bar + 2 Xanax'], ['stack', 'Full stack (4 Xanax, then refill)']] },
      { key: 'travel', label: 'No flying this many hours before (0 = off)', type: 'number', value: 6 },
      { key: 'targets', label: 'Who to hit', type: 'select', value: 'ff', options: [['ff', 'Targets you can beat (check FF Scouter)'], ['assigned', 'Assigned targets only'], ['any', 'Anyone on their list']] },
      { key: 'finish', label: 'Finish every hit with', type: 'select', value: 'hosp', options: [['hosp', 'Hospitalize'], ['leave', 'Leave'], ['mug', 'Mug']] },
      { key: 'chain', label: 'Keep our chain alive', type: 'toggle', value: true },
      { key: 'revives', label: 'Revives', type: 'select', value: 'members', options: [['members', 'Revive faction members'], ['request', 'Revives on request only'], ['off', 'No revives during the war']] },
      { key: 'meds', label: 'Carry medical items', type: 'toggle', value: true },
      { key: 'payout', label: 'Payout (optional)', type: 'text', value: '' },
      { key: 'who', label: 'Contact', type: 'text', value: 'leadership' },
      { key: 'where', label: 'Where to ask', type: 'text', value: 'Discord #war' },
      { key: 'extra', label: 'Extra rules (one per line)', type: 'textarea', value: '' }
    ],
    render: (v) => [
      title(`RANKED WAR vs ${esc(v.enemy)}`, COLORS.red),
      `<p>Starts <b>${tct(v.date, v.time)}</b>.</p>`,
      heading('Before it starts'),
      list([
        v.online && 'Be <b>online at the start</b>. The first hour decides most wars.',
        { full: 'Arrive with a <b>full energy bar</b>.', xan2: 'Arrive with a <b>full energy bar plus 2 Xanax</b> worth of energy.', stack: 'Arrive with a <b>full stack</b>: 4 Xanax, then your refill.' }[v.stack],
        +v.travel > 0 && `<b>Don't fly</b> within ${+v.travel} hours of the start. Delays can strand you abroad.`,
        v.meds && 'Stock <b>Blood Bags and First Aid Kits</b>.',
        'Put your cash somewhere safe.'
      ]),
      heading('During the war'),
      list([
        { ff: 'Hit targets you can <b>beat in a few hits</b>. Check FF Scouter first.', assigned: 'Hit <b>your assigned targets only</b>.', any: 'Hit anyone on their member list.' }[v.targets],
        `Finish every hit with <b>${FINISH[v.finish]}</b>.`,
        v.chain && '<b>Keep our chain alive:</b> call your hit in chat, and never let the timer drop below a minute.',
        { members: 'Revive faction members when you can.', request: 'Revive on request only.', off: '<b>No revives</b> during the war.' }[v.revives],
        "Don't attack anyone outside the war."
      ]),
      v.payout?.trim() ? `<p><b>Payout:</b> ${esc(v.payout)}</p>` : '',
      extra(v.extra),
      contact(v.who, v.where)
    ].join('')
  },
  {
    id: 'termed',
    name: 'Termed war rules',
    blurb: 'A war fought to agreed terms. Everyone must follow them, or the deal falls apart.',
    fields: [
      { key: 'enemy', label: 'Other faction', type: 'text', value: '[Other faction]' },
      { key: 'date', label: 'Start date (TCT)', type: 'date', value: '' },
      { key: 'time', label: 'Start time (TCT)', type: 'time', value: '18:00' },
      { key: 'outcome', label: 'Agreed outcome', type: 'select', value: 'we', options: [['we', 'We win'], ['they', 'They win'], ['score', 'Agreed score, then stop']] },
      { key: 'score', label: 'Target score', type: 'text', value: '' },
      { key: 'end', label: 'War ends when', type: 'text', value: 'the target score is reached' },
      { key: 'finish', label: 'Allowed finish', type: 'select', value: 'leave', options: [['leave', 'Leave'], ['hosp', 'Hospitalize'], ['mug', 'Mug']] },
      { key: 'called', label: 'Only hit when leadership calls it', type: 'toggle', value: true },
      { key: 'nochain', label: 'No chaining', type: 'toggle', value: true },
      { key: 'nobounty', label: 'No bounties', type: 'toggle', value: true },
      { key: 'nooutside', label: "Don't hit them outside the war", type: 'toggle', value: true },
      { key: 'who', label: 'Contact', type: 'text', value: 'leadership' },
      { key: 'where', label: 'Where to ask', type: 'text', value: 'Discord #war' },
      { key: 'extra', label: 'Extra terms (one per line)', type: 'textarea', value: '' }
    ],
    render: (v) => [
      title(`TERMED WAR with ${esc(v.enemy)}`, COLORS.amber),
      `<p>Starts <b>${tct(v.date, v.time)}</b>. This war runs to <b>agreed terms</b>. Breaking them costs us the deal and our name.</p>`,
      heading('The terms'),
      list([
        { we: '<b>We win</b> this war.', they: '<b>They win</b> this war. Do not push past the agreed score.', score: 'Both sides stop at the <b>agreed score</b>.' }[v.outcome],
        v.score?.trim() && `Target score: <b>${esc(v.score)}</b>.`,
        v.end?.trim() && `The war ends when ${esc(v.end)}.`
      ]),
      heading('How to hit'),
      list([
        `Finish every hit with <b>${FINISH[v.finish]}</b>. Nothing else.`,
        v.called && '<b>Only hit when leadership calls it.</b>',
        v.nochain && '<b>No chaining</b> on them.',
        v.nobounty && '<b>No bounties</b> on their members.',
        v.nooutside && "<b>Don't attack them outside the war</b>, before or after.",
        'Not sure if a hit is allowed? <b>Ask first.</b>'
      ]),
      extra(v.extra),
      contact(v.who, v.where)
    ].join('')
  },
  {
    id: 'oc',
    name: 'OC reminder',
    blurb: "Get everyone into their organized crime on time, with the right items.",
    fields: [
      { key: 'date', label: 'Join by date (TCT)', type: 'date', value: '' },
      { key: 'time', label: 'Join by time (TCT)', type: 'time', value: '' },
      { key: 'scope', label: 'Who it is for', type: 'select', value: 'all', options: [['all', 'Everyone'], ['none', 'Anyone not in an OC yet'], ['named', 'Named players']] },
      { key: 'names', label: 'Names (if named)', type: 'text', value: '' },
      { key: 'slot', label: 'Join the slot you were given', type: 'toggle', value: true },
      { key: 'cpr', label: 'Check your pass rate (CPR) before joining', type: 'toggle', value: true },
      { key: 'item', label: 'Item to have ready (optional)', type: 'text', value: '' },
      { key: 'notravel', label: "Don't be abroad when it starts", type: 'toggle', value: true },
      { key: 'who', label: 'Contact', type: 'text', value: 'leadership' },
      { key: 'where', label: 'Where to ask', type: 'text', value: 'Discord #oc' },
      { key: 'extra', label: 'Extra notes (one per line)', type: 'textarea', value: '' }
    ],
    render: (v) => [
      title('OC REMINDER', COLORS.blue),
      `<p>${{ all: 'Everyone', none: "Anyone who isn't in an organized crime yet", named: v.names?.trim() ? esc(v.names) : '[names]' }[v.scope]}: join your OC${v.date ? ` by <b>${tct(v.date, v.time)}</b>` : ''}.</p>`,
      list([
        v.slot && 'Join the <b>slot you were given</b>, not the first open one.',
        v.cpr && 'Check your <b>pass rate (CPR)</b> for the role before you join.',
        v.item?.trim() && `Have your <b>${esc(v.item)}</b> in your inventory.`,
        v.notravel && "<b>Don't be abroad</b> when the crime starts, or it can fail.",
        'Tell us when you are in.'
      ]),
      extra(v.extra),
      contact(v.who, v.where)
    ].join('')
  },
  {
    id: 'run',
    name: 'Flower and plushie run',
    blurb: 'Rally a travel run: what to bring back, where from, and who to hand it to.',
    fields: [
      { key: 'what', label: 'What to bring', type: 'select', value: 'both', options: [['flowers', 'Flowers'], ['plushies', 'Plushies'], ['both', 'Flowers and plushies'], ['contraband', 'Contraband']] },
      { key: 'where', label: 'Where from', type: 'text', value: 'Mexico, Cayman Islands, Canada' },
      { key: 'goal', label: 'What it is for', type: 'select', value: 'museum', options: [['museum', 'Museum sets for faction points'], ['armory', 'Faction stock'], ['buy', 'Faction buys them from you'], ['own', 'Your own profit']] },
      { key: 'price', label: 'Price paid per item (if the faction buys)', type: 'text', value: '' },
      { key: 'deliver', label: 'Send them to', type: 'text', value: '' },
      { key: 'date', label: 'Date (TCT, optional)', type: 'date', value: '' },
      { key: 'time', label: 'Time (TCT, optional)', type: 'time', value: '' },
      { key: 'tourism', label: 'Tourism Day (double capacity)', type: 'toggle', value: false },
      { key: 'safety', label: 'Add travel safety tips', type: 'toggle', value: true },
      { key: 'who', label: 'Contact', type: 'text', value: 'leadership' },
      { key: 'chan', label: 'Where to ask', type: 'text', value: 'Discord #travel' },
      { key: 'extra', label: 'Extra notes (one per line)', type: 'textarea', value: '' }
    ],
    render: (v) => {
      const what = { flowers: 'flowers', plushies: 'plushies', both: 'flowers and plushies', contraband: 'contraband' }[v.what];
      return [
        title(`${what.toUpperCase()} RUN`, COLORS.green),
        `<p>Fly out${v.date ? ` on <b>${tct(v.date, v.time)}</b>` : ''} and bring back <b>${what}</b>${v.where?.trim() ? ` from ${esc(v.where)}` : ''}.</p>`,
        list([
          { museum: 'We are building <b>Museum sets</b> for faction points.', armory: 'They go into <b>faction stock</b>.', buy: `The faction <b>buys them from you</b>${v.price?.trim() ? ` at <b>${esc(v.price)}</b> each` : ''}.`, own: 'Keep the profit: this one is for you.' }[v.goal],
          v.deliver?.trim() && `Send them to <b>${esc(v.deliver)}</b> with a trade.`,
          v.tourism && "It's <b>Tourism Day</b>: capacity doubles. Be abroad <b>before</b> it starts, and fill up before it ends.",
          v.safety && 'Check <b>YATA</b> for stock before you fly.',
          v.safety && "Don't carry cash, and don't take off right before a war or OC."
        ]),
        extra(v.extra),
        contact(v.who, v.chan)
      ].join('');
    }
  },
  {
    id: 'events',
    name: 'Upcoming events',
    blurb: "What's coming up in Torn, with a tip for each. Dates come from our Events calendar.",
    fields: [
      { key: 'intro', label: 'Intro line', type: 'text', value: 'Here is what is coming up in Torn.' },
      { key: 'count', label: 'How many events', type: 'select', value: '4', options: [['3', 'Next 3'], ['4', 'Next 4'], ['6', 'Next 6'], ['8', 'Next 8']] },
      { key: 'picks', label: 'Only the big ones (top picks)', type: 'toggle', value: false },
      { key: 'tips', label: 'Add a tip for each', type: 'toggle', value: true },
      { key: 'extra', label: 'Faction plans (one per line)', type: 'textarea', value: '' }
    ],
    // site: absolute address of the playbook, so links in the tips keep working inside Torn.
    render: (v, { now = Date.now(), site = '' } = {}) => {
      const upcoming = EVENTS.filter((e) => !v.picks || e[6])
        .map((e) => ({ e, s: status(e, now) }))
        .sort((a, b) => a.s.days - b.s.days)
        .slice(0, +v.count);
      const tip = (html) => html.replace(/href="\//g, `href="${site}/`);
      const soon = (s) => (s.live ? 'on now' : s.days === 1 ? 'tomorrow' : `in ${s.days} days`);
      return [
        title('COMING UP IN TORN', COLORS.amber),
        v.intro?.trim() ? `<p>${esc(v.intro)}</p>` : '',
        `<ul>${upcoming.map(({ e, s }) => `<li><b>${e[0]}</b>: ${when(e)} (${soon(s)}).${v.tips ? ` ${tip(e[4])}` : ''}</li>`).join('')}</ul>`,
        extra(v.extra),
        site ? `<p><i>Full calendar: <a href="${site}/events/">${site.replace(/^https?:\/\//, '')}/events/</a></i></p>` : ''
      ].join('');
    }
  }
];

export const defaults = (tpl) => Object.fromEntries(tpl.fields.map((f) => [f.key, f.value]));
