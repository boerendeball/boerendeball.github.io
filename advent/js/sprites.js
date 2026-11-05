// Sprites: laadt assets/sprites/sprites.svg één keer en zet de <symbol>s in het document,
// zodat <use href="#id" color="…"> met currentColor werkt (externe sprites.svg#id doet dat niet).
// Daarnaast kleine bouwstenen om SVG-scènes op te bouwen, als JS-port van de Python-helpers
// in design/generators (use(), pino(), persoon(), dier()).

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';
const SPRITES_URL = new URL('../../assets/sprites/sprites.svg', import.meta.url);

let geladen = null;

/** Laad en injecteer de sprites (idempotent). */
export function laadSprites() {
  if (geladen) return geladen;
  geladen = (async () => {
    const antwoord = await fetch(SPRITES_URL);
    if (!antwoord.ok) throw new Error(`sprites.svg niet geladen (${antwoord.status})`);
    let tekst = await antwoord.text();
    // C2PA-metadata van de ontwerptool is niet nodig in de app.
    tekst = tekst.replace(/<metadata[\s\S]*?<\/metadata>/, '');
    const doc = new DOMParser().parseFromString(tekst, 'image/svg+xml');
    const fout = doc.querySelector('parsererror');
    if (fout) throw new Error('sprites.svg is geen geldige SVG');
    const svg = document.importNode(doc.documentElement, true);
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.id = 'sprites';
    svg.style.position = 'absolute';
    svg.style.overflow = 'hidden';
    document.body.prepend(svg);
    return svg;
  })();
  return geladen;
}

export function aantalSymbolen() {
  return document.querySelectorAll('#sprites symbol').length;
}

/* ---------- bouwstenen ---------- */

/** Maak een SVG-element met attributen. Kinderen mogen elementen of strings zijn. */
export function el(naam, attrs = {}, kinderen = []) {
  const e = document.createElementNS(SVG_NS, naam);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    e.setAttribute(k, String(v));
  }
  for (const kind of kinderen) {
    if (kind === null || kind === undefined) continue;
    e.append(typeof kind === 'string' ? document.createTextNode(kind) : kind);
  }
  return e;
}

/**
 * <use href="#id"> op positie x,y met breedte/hoogte en optionele kleur (currentColor).
 * Vergeet je de kleur bij een symbool dat currentColor gebruikt, dan valt die terug op de tekstkleur.
 */
export function use(id, x = 0, y = 0, w, h, kleur = null, extra = {}) {
  const u = el('use', { x, y, width: w, height: h, ...extra });
  u.setAttribute('href', `#${id}`);
  u.setAttributeNS(XLINK_NS, 'xlink:href', `#${id}`); // oudere Safari
  if (kleur) u.setAttribute('color', kleur);
  return u;
}

/** Een <g> met translate/scale(/spiegel), zoals de Python-helpers dat doen. */
export function groep(x = 0, y = 0, { schaal = 1, flip = false, breedte = 48, klasse = null } = {}, kinderen = []) {
  let t = `translate(${x} ${y})`;
  if (schaal !== 1) t += ` scale(${schaal})`;
  if (flip) t += ` scale(-1 1) translate(-${breedte} 0)`;
  return el('g', { transform: t, class: klasse }, kinderen);
}

/** Een lege scène-SVG (ontwerp: 358 px breed). */
export function scene(breedte, hoogte, { label = null, klasse = 'scene' } = {}) {
  return el('svg', {
    viewBox: `0 0 ${breedte} ${hoogte}`,
    width: breedte,
    height: hoogte,
    class: klasse,
    role: label ? 'img' : null,
    'aria-label': label,
    'aria-hidden': label ? null : 'true',
  });
}

/* ---------- personages (zie assets/sprites/README.md) ---------- */

/** Pino 48×72: pose = 'staan' | 'loop' | 'vinger' | 'foto' | 'duw' … (pose-symbolen bevatten p-basis). */
export function pino(x, y, pose = 'staan', { schaal = 1, flip = false } = {}) {
  return groep(x, y, { schaal, flip }, [use(`pino-${pose}`, 0, 0, 48, 72)]);
}

/**
 * Persoon 48×72: lijf of jurk → hoofd → haar → blij gezicht → accessoires.
 * kleding/huid/haarkleur zijn kleuren; haar is een bh-* symbool-id; acc een lijst acc-* id's;
 * gezicht is 'b-blij' (standaard) of 'b-bedroefd'.
 */
export function persoon(x, y, { kleding, huid, haar = 'bh-kort', haarkleur, jurk = false, acc = [], schaal = 1, kind = false, flip = false, gezicht = 'b-blij' }) {
  const k = schaal * (kind ? 0.72 : 1);
  const delen = [
    use(jurk ? 'b-jurk' : 'b-lijf', 0, 0, 48, 72, kleding),
    use('b-hoofd', 0, 0, 48, 72, huid),
    use(haar, 0, 0, 48, 72, haarkleur),
    use(gezicht, 0, 0, 48, 72),
    ...acc.map((a) => use(a, 0, 0, 48, 72)),
  ];
  return groep(x, y, { schaal: k, flip }, delen);
}

/** Dier 48×40: soort = 'lam' | 'gansje' | 'biggetje'. */
export function dier(x, y, soort, { schaal = 1, flip = false } = {}) {
  return groep(x, y, { schaal, flip }, [use(`d-${soort}`, 0, 0, 48, 40)]);
}
