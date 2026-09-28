// A finished war report packed into a link, the way Path of Building shares builds:
// JSON, deflate-compressed, then base64url. The code goes after the # so it never reaches any server.

const MAX_BYTES = 512 * 1024;

function toBase64Url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(code) {
  const bin = atob(code.replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function encodeReport(data) {
  const json = new Blob([JSON.stringify(data)]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return toBase64Url(new Uint8Array(await new Response(json).arrayBuffer()));
}

// Accepts a bare code or a whole link. Stops reading past MAX_BYTES so a crafted code can't eat memory.
export async function decodeReport(input) {
  const code = input.trim().split('#').pop();
  const reader = new Blob([fromBase64Url(code)]).stream().pipeThrough(new DecompressionStream('deflate-raw')).getReader();
  const parts = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > MAX_BYTES) { await reader.cancel(); throw new Error('too big'); }
    parts.push(value);
  }
  return JSON.parse(await new Blob(parts).text());
}
