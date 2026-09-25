// Browser-only helpers for the message editor: clean HTML down to what Torn's editor accepts,
// and convert it to plain text or Discord markdown.

const KEEP = new Set(['P', 'BR', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE', 'SPAN', 'UL', 'OL', 'LI', 'A', 'HR', 'H3', 'H4']);
const RENAME = { DIV: 'P', FONT: 'SPAN', H1: 'H3', H2: 'H3', H5: 'H4', H6: 'H4', DEL: 'S' };
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'NOSCRIPT', 'TEMPLATE', 'META', 'LINK']);
const COLOR = /^(#[0-9a-f]{3,8}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\))$/i;

function clean(node, doc) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === Node.COMMENT_NODE) { child.remove(); continue; }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    let el = child;
    if (DROP.has(el.tagName)) { el.remove(); continue; }
    if (RENAME[el.tagName]) {
      const renamed = doc.createElement(RENAME[el.tagName]);
      const color = el.getAttribute('color') || el.style?.color;
      if (color) renamed.setAttribute('style', `color:${color}`);
      renamed.append(...el.childNodes);
      el.replaceWith(renamed);
      el = renamed;
    }
    clean(el, doc);
    if (!KEEP.has(el.tagName)) { el.replaceWith(...el.childNodes); continue; }
    const color = el.style?.color?.trim();
    const href = el.getAttribute('href');
    for (const attr of [...el.attributes]) el.removeAttribute(attr.name);
    if (el.tagName === 'SPAN') {
      if (color && COLOR.test(color)) el.setAttribute('style', `color:${color}`);
      else { el.replaceWith(...el.childNodes); continue; }
    }
    if (el.tagName === 'A') {
      if (href && /^https?:\/\//i.test(href)) el.setAttribute('href', href);
      else { el.replaceWith(...el.childNodes); continue; }
    }
  }
}

export function sanitize(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  clean(doc.body, doc);
  return doc.body.innerHTML.replace(/<p><\/p>/g, '').trim();
}

function walk(node, fmt) {
  let out = '';
  for (const n of node.childNodes) out += n.nodeType === Node.TEXT_NODE ? n.textContent.replace(/\s+/g, ' ') : fmt(n, () => walk(n, fmt));
  return out;
}

function discordNode(el, inner) {
  const text = inner();
  const t = text.trim();
  switch (el.tagName) {
    case 'B': case 'STRONG': return t ? `**${t}**` : '';
    case 'I': case 'EM': return t ? `*${t}*` : '';
    case 'U': return t ? `__${t}__` : '';
    case 'S': case 'STRIKE': return t ? `~~${t}~~` : '';
    case 'A': return `[${t}](${el.getAttribute('href')})`;
    case 'BR': return '\n';
    case 'HR': return '\n———\n';
    case 'H3': return `\n## ${t}\n`;
    case 'H4': return `\n### ${t}\n`;
    case 'LI': {
      const ordered = el.parentElement?.tagName === 'OL';
      return `${ordered ? [...el.parentElement.children].indexOf(el) + 1 + '.' : '-'} ${t}\n`;
    }
    case 'UL': case 'OL': return `${text}\n`;
    case 'P': return `${t}\n\n`;
    default: return text;
  }
}

const tidy = (s) => s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

export function toDiscord(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  return tidy(walk(doc.body, discordNode));
}

export function toPlain(html) {
  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const fmt = (el, inner) => {
    const t = inner();
    if (el.tagName === 'BR') return '\n';
    if (el.tagName === 'LI') return `- ${t.trim()}\n`;
    if (el.tagName === 'P' || /^H\d$/.test(el.tagName)) return `${t.trim()}\n\n`;
    if (el.tagName === 'HR') return '\n';
    return t;
  };
  return tidy(walk(doc.body, fmt));
}
