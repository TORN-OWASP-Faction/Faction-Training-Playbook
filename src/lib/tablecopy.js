// Turn a table (header row + body rows of plain values) into text for Discord, HTML for Torn, or CSV,
// and put it on the clipboard.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function discordTable(title, head, body) {
  const widths = head.map((_, i) => Math.max(...[head, ...body].map((row) => String(row[i]).length)));
  const line = (row) => row.map((c, i) => (i ? String(c).padStart(widths[i]) : String(c).padEnd(widths[i]))).join('  ');
  return `**${title}**\n\`\`\`\n${[line(head), ...body.map(line)].join('\n')}\n\`\`\``;
}

export function htmlTable(title, head, body) {
  return `<p><b>${esc(title)}</b></p><table><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr>` +
    body.map((row) => `<tr>${row.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('') + '</table>';
}

export function csvTable(head, body) {
  const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
  return [head, ...body].map((row) => row.map(q).join(',')).join('\n');
}

// kind: 'discord' | 'torn' | 'csv'. Returns a message to show the player.
export async function copyTable(kind, title, head, body) {
  try {
    if (kind === 'torn') {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([htmlTable(title, head, body)], { type: 'text/html' }),
        'text/plain': new Blob([discordTable(title, head, body)], { type: 'text/plain' })
      })]);
    } else {
      await navigator.clipboard.writeText(kind === 'discord' ? discordTable(title, head, body) : csvTable(head, body));
    }
    return { torn: 'Copied as a table for Torn.', discord: 'Copied for Discord.', csv: 'Copied as CSV for a spreadsheet.' }[kind];
  } catch {
    return 'Your browser blocked copying.';
  }
}
