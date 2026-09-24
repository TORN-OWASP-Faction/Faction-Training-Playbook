// The reader's chosen language, kept in this browser only. null until they pick one.
export const pref = $state({ lang: null });

export function loadPref() {
  try { pref.lang = localStorage.getItem('lang'); } catch { pref.lang = null; }
}

export function savePref(lang) {
  pref.lang = lang;
  try { localStorage.setItem('lang', lang); } catch { /* private window: the choice lasts this visit */ }
}
