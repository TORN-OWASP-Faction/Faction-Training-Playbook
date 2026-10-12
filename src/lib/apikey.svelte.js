// The reader's Torn API key, set once in the header and kept in this browser only.
// Pages read apiKey.value and send it to api.torn.com, nowhere else.
const STORE = 'ftp:api-key';
// Keys saved by the planner and war report before the header field existed.
const OLD_STORES = ['ftp:war-report-key', 'tornApiKey'];

export const apiKey = $state({ value: '' });

export function loadKey() {
  try {
    let key = localStorage.getItem(STORE);
    if (!key) {
      key = OLD_STORES.map((s) => localStorage.getItem(s)).find(Boolean) ?? '';
      if (key) localStorage.setItem(STORE, key);
    }
    OLD_STORES.forEach((s) => localStorage.removeItem(s));
    apiKey.value = key;
  } catch { /* storage blocked: the reader types the key each visit */ }
}

export function saveKey(key) {
  apiKey.value = key.trim();
  try { localStorage.setItem(STORE, apiKey.value); } catch { /* private window: the key lasts this visit */ }
}

export function forgetKey() {
  apiKey.value = '';
  try { localStorage.removeItem(STORE); } catch { /* ignore */ }
}
