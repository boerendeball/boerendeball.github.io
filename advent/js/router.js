// Hash-router: #/ (kalender), #/deur/3, #/spel/3, #/briefje/3, #/finale, #/test.
// Een hash werkt op GitHub Pages zonder 404-trucs en overleeft herladen.
// Een scherm-functie krijgt { root, params, pad, query } en mag een opruimfunctie teruggeven.
// query = URLSearchParams van het deel na '?' in de hash (bv. #/spel/5?zoek=1, de zoekmodus van spel 7).

const routes = [];
let root = null;
let opruimen = null;
let nietGevonden = null;

export function route(patroon, scherm) {
  const delen = patroon.split('/').filter(Boolean);
  routes.push({ delen, scherm });
}

export function huidigPad() {
  const h = location.hash.replace(/^#/, '');
  return h.startsWith('/') ? h : '/' + h;
}

/** Navigeer. Met vervang=true komt het scherm niet in de geschiedenis (bv. laden → spel). */
export function ga(pad, { vervang = false } = {}) {
  if (vervang) {
    location.replace('#' + pad);
  } else {
    location.hash = pad;
  }
}

export function terug(standaard = '/') {
  if (history.length > 1) history.back();
  else ga(standaard, { vervang: true });
}

/** Splitst '/spel/5?zoek=1' in het pad en de query (de query hoort bij de hash, niet bij location.search). */
function splitsQuery(pad) {
  const i = pad.indexOf('?');
  return i < 0 ? { pad, query: new URLSearchParams() } : { pad: pad.slice(0, i), query: new URLSearchParams(pad.slice(i + 1)) };
}

function zoek(pad) {
  const delen = pad.split('/').filter(Boolean);
  for (const r of routes) {
    if (r.delen.length !== delen.length) continue;
    const params = {};
    let past = true;
    for (let i = 0; i < delen.length; i++) {
      if (r.delen[i].startsWith(':')) params[r.delen[i].slice(1)] = decodeURIComponent(delen[i]);
      else if (r.delen[i] !== delen[i]) { past = false; break; }
    }
    if (past) return { scherm: r.scherm, params };
  }
  return null;
}

function toon() {
  if (typeof opruimen === 'function') {
    try { opruimen(); } catch (e) { console.error(e); }
  }
  opruimen = null;
  root.replaceChildren();
  window.scrollTo(0, 0);

  const { pad, query } = splitsQuery(huidigPad());
  const gevonden = zoek(pad) || (nietGevonden && { scherm: nietGevonden, params: {} });
  if (!gevonden) return;
  const resultaat = gevonden.scherm({ root, params: gevonden.params, pad, query });
  if (resultaat && typeof resultaat.then === 'function') {
    resultaat.then((f) => { opruimen = f; }, (e) => console.error(e));
  } else {
    opruimen = resultaat;
  }
}

export function startRouter(element, { fallback = null } = {}) {
  root = element;
  nietGevonden = fallback;
  window.addEventListener('hashchange', toon);
  toon();
}
