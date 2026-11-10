// Sprite sheet voor de canvas-spellen: rastert <symbol>s uit de geïnjecteerde sprites.svg naar bitmaps,
// per (id, kleur, schaal), met een marge zodat symbolen die buiten hun viewBox steken (pino-vinger) heel blijven.
//
// await laadSprites();                               // sprites.js
// await voorbereidSprites([{ id: 'bed-onder' }, { id: 'bed-deken', kleur: '#39D353' }], schaal);
// tekenSprite(ctx, 'bed-deken', x, y, { kleur: '#39D353' });   // in wereld-eenheden (CSS-px)

const SVG_NS = 'http://www.w3.org/2000/svg';
const MARGE = 24; // wereld-px rondom elk symbool (de grijparm z-arm van spel 6 steekt 19 px uit)

const cache = new Map();   // sleutel → { bitmap, w, h, marge, schaal }
const bezig = new Map();   // sleutel → Promise

function sleutel(id, kleur, schaal) {
  return `${id}|${kleur || ''}|${schaal}`;
}

function symbool(id) {
  const el = document.querySelector(`#sprites symbol[id="${id}"]`);
  if (!el) throw new Error(`symbool #${id} niet gevonden (zijn de sprites geladen?)`);
  return el;
}

function maatVan(el) {
  const vb = (el.getAttribute('viewBox') || '0 0 48 48').split(/[\s,]+/).map(Number);
  return { w: vb[2], h: vb[3] };
}

/** Verzamel een symbool plus alle symbolen waarnaar het (recursief) verwijst. */
function verzamel(id, gevonden = new Map()) {
  if (gevonden.has(id)) return gevonden;
  const el = symbool(id);
  gevonden.set(id, el);
  for (const u of el.querySelectorAll('use')) {
    const href = u.getAttribute('href') || u.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
    if (href.startsWith('#')) verzamel(href.slice(1), gevonden);
  }
  return gevonden;
}

function svgTekst(id, kleur) {
  const { w, h } = maatVan(symbool(id));
  const defs = [...verzamel(id).values()].map((el) => {
    const kopie = el.cloneNode(true);
    kopie.setAttribute('overflow', 'visible');
    return kopie.outerHTML;
  }).join('');
  const kleurAttr = kleur ? ` color="${kleur}"` : '';
  const vb = `${-MARGE} ${-MARGE} ${w + 2 * MARGE} ${h + 2 * MARGE}`;
  return `<svg xmlns="${SVG_NS}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${vb}" width="${w + 2 * MARGE}" height="${h + 2 * MARGE}" style="color:#1E3A4C">`
    + `<defs>${defs}</defs><use href="#${id}" xlink:href="#${id}" x="0" y="0" width="${w}" height="${h}" overflow="visible"${kleurAttr}/></svg>`;
}

async function rasteriseer(id, kleur, schaal) {
  const { w, h } = maatVan(symbool(id));
  const blob = new Blob([svgTekst(id, kleur)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    const bw = Math.ceil((w + 2 * MARGE) * schaal);
    const bh = Math.ceil((h + 2 * MARGE) * schaal);
    const canvas = document.createElement('canvas');
    canvas.width = bw;
    canvas.height = bh;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, bw, bh);
    return { bitmap: canvas, w, h, marge: MARGE, schaal };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Laad één sprite in de cache (of geef de bestaande terug). */
export function laadSprite(id, kleur = null, schaal = standaardSchaal()) {
  const k = sleutel(id, kleur, schaal);
  if (cache.has(k)) return Promise.resolve(cache.get(k));
  if (bezig.has(k)) return bezig.get(k);
  const p = rasteriseer(id, kleur, schaal).then((s) => { cache.set(k, s); bezig.delete(k); return s; });
  bezig.set(k, p);
  return p;
}

/** Laad een lijst sprites vooraf: [{ id, kleur }]. */
export function voorbereidSprites(lijst, schaal = standaardSchaal()) {
  return Promise.all(lijst.map(({ id, kleur = null }) => laadSprite(id, kleur, schaal)));
}

/** Schaal voor rasterisatie: devicePixelRatio, begrensd op 3. */
export function standaardSchaal() {
  return Math.min(3, Math.max(1, window.devicePixelRatio || 1));
}

/**
 * Teken een sprite op wereldpositie (x, y) met zijn natuurlijke maat (of w/h). flip spiegelt horizontaal
 * om het midden van de sprite. hoek (radialen) draait om draai = [px, py] in sprite-eenheden (standaard het
 * midden); met w/h wordt het draaipunt mee geschaald. De ctx moet al op wereld-eenheden staan (zie canvas.js).
 * Een sprite die nog niet geladen is, wordt overgeslagen en op de achtergrond geladen.
 */
export function tekenSprite(ctx, id, x, y, { kleur = null, flip = false, w = null, h = null, alpha = 1, hoek = 0, draai = null, schaal = standaardSchaal() } = {}) {
  const s = cache.get(sleutel(id, kleur, schaal));
  if (!s) { laadSprite(id, kleur, schaal); return; }
  const bw = w ?? s.w;
  const bh = h ?? s.h;
  const sx = bw / s.w;
  const sy = bh / s.h;
  ctx.save();
  if (alpha !== 1) ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  if (hoek) {
    const px = (draai ? draai[0] : s.w / 2) * sx;
    const py = (draai ? draai[1] : s.h / 2) * sy;
    ctx.translate(px, py); ctx.rotate(hoek); ctx.translate(-px, -py);
  }
  if (flip) { ctx.translate(bw, 0); ctx.scale(-1, 1); }
  ctx.drawImage(s.bitmap, -s.marge * sx, -s.marge * sy, (s.w + 2 * s.marge) * sx, (s.h + 2 * s.marge) * sy);
  ctx.restore();
}

export function spriteGeladen(id, kleur = null, schaal = standaardSchaal()) {
  return cache.has(sleutel(id, kleur, schaal));
}
