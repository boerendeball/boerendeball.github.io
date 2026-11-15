// Spel 2 · Tuin van de koningin — logica van de jungletocht, zonder DOM (zie specs/spel2.md, besluit 166).
//
// De wereld is een onbegrensd hexraster met spitse bovenkant in axiale coördinaten: een vak is "q,r".
// Een minispeelveld is een bloem van 7 vakken: een midden (kano, tempel, boeddha of waterval) en 6 ringplekken.
// De tuin (staat.tuin) bevat de velden, de gelegde tegels, het huidige veld, Pino, de weg en de werker.

export const KLEUREN = ['groen', 'geel', 'blauw'];
export const FIGUREN = ['vlinder', 'boom', 'vogel'];
/** Alle negen tegeltypen in vaste volgorde (ook de volgorde in het taartmenu). */
export const TYPES = KLEUREN.flatMap((k) => FIGUREN.map((f) => `${k}-${f}`));

/** Aantal velden: het startveld met de kano + 6 nieuwe; het laatste ligt aan de weg (besluit 167). */
export const AANTAL_VELDEN = 7;
/** Tegels op het huidige veld voordat Pino een brug in de jungle mag leggen (de bruggetegel telt mee). */
export const TEGELS_VOOR_BRUG = 3;
/** Soort midden per veld, in volgorde. */
export const SOORTEN = ['kano', 'tempel', 'boeddha', 'waterval', 'tempel', 'boeddha', 'waterval'];
/** Op dit veld (index) staat de werker in de jungle, op dit veld (index) ligt de weg. */
export const WERKER_VELD = 2;
export const WEG_VELD = AANTAL_VELDEN - 1;

/* ---------- geometrie ---------- */

export const DX = 55;   // horizontale afstand tussen twee buren (zelfde maat als de hex-sprites, 56×66)
export const DY = 48;   // verticale afstand tussen twee rijen

export const vak = (q, r) => `${q},${r}`;
export const ontleed = (v) => v.split(',').map(Number);

const RICHTINGEN = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

/** Middelpunt van het bovenvlak in wereldcoördinaten. */
export function pixel(v) {
  const [q, r] = ontleed(v);
  return { x: DX * (q + r / 2), y: DY * r };
}

export function buren(v) {
  const [q, r] = ontleed(v);
  return RICHTINGEN.map(([dq, dr]) => vak(q + dq, r + dr));
}

export function afstand(a, b) {
  const [q1, r1] = ontleed(a);
  const [q2, r2] = ontleed(b);
  const dq = q1 - q2;
  const dr = r1 - r2;
  return (Math.abs(dq) + Math.abs(dr) + Math.abs(dq + dr)) / 2;
}

/** Het midden en de 6 ringplekken van een veld. */
export function bloem(c) {
  return [c, ...buren(c)];
}

/** Alle vakken binnen een rechthoek in wereldcoördinaten (met één vak marge), rij voor rij van achter naar voor. */
export function vakkenIn({ x, y, b, h }) {
  const uit = [];
  const r0 = Math.floor(y / DY) - 1;
  const r1 = Math.ceil((y + h) / DY) + 2;
  for (let r = r0; r <= r1; r += 1) {
    const q0 = Math.floor(x / DX - r / 2) - 1;
    const q1 = Math.ceil((x + b) / DX - r / 2) + 1;
    for (let q = q0; q <= q1; q += 1) uit.push(vak(q, r));
  }
  return uit;
}

/* ---------- tegels ---------- */

export const splits = (type) => type.split('-');

/** Twee tegels passen als ze precies één eigenschap delen (kleur óf figuur, niet allebei). */
export function past(a, b) {
  const [ka, fa] = splits(a);
  const [kb, fb] = splits(b);
  return (ka === kb) !== (fa === fb);
}

/**
 * Groep van een tegel voor één eigenschap (0 = kleur, 1 = figuur): alle tegels die via aangrenzende
 * tegels met diezelfde kleur (of hetzelfde figuur) met elkaar verbonden zijn. Geeft de vakken terug.
 */
export function groep(gelegd, v, eigenschap) {
  const waarde = splits(gelegd[v])[eigenschap];
  const gezien = new Set([v]);
  const rij = [v];
  while (rij.length) {
    const huidig = rij.shift();
    for (const b of buren(huidig)) {
      const t = gelegd[b];
      if (gezien.has(b) || !t || splits(t)[eigenschap] !== waarde) continue;
      gezien.add(b);
      rij.push(b);
    }
  }
  return [...gezien];
}

/**
 * In een groep (verbonden tegels met dezelfde kleur, of met hetzelfde figuur) mag elk tegeltype maar één
 * keer voorkomen: groen-vogel > blauw-vogel > geel-vogel, en daar mag geen tweede groen-vogel bij.
 * Dat geldt ook als een nieuwe tegel twee groepen aan elkaar knoopt (besluit 34).
 */
export function groepenUniek(gelegd, v, type) {
  const proef = { ...gelegd, [v]: type };
  return [0, 1].every((eigenschap) => {
    const typen = groep(proef, v, eigenschap).map((g) => proef[g]);
    return new Set(typen).size === typen.length;
  });
}

/**
 * Tegeltypen die op dit vak passen: ze moeten passen bij álle aangrenzende tegels en geen dubbel type in een
 * groep maken. Het midden van een veld is geen tegel; zonder aangrenzende tegel past dus elk type.
 */
export function kandidaten(gelegd, v) {
  const typen = buren(v).map((b) => gelegd[b]).filter(Boolean);
  return TYPES.filter((t) => typen.every((n) => past(t, n)) && groepenUniek(gelegd, v, t));
}

/* ---------- velden ---------- */

export const huidigVeld = (t) => t.velden[t.huidig];

/** Alle vakken die bij een veld horen (midden + ring). */
export function veldVakken(t) {
  const uit = new Set();
  for (const veld of t.velden) for (const v of bloem(veld.c)) uit.add(v);
  return uit;
}

/** Index van het veld waar dit vak bij hoort, of -1. */
export function veldVan(t, v) {
  return t.velden.findIndex((veld) => afstand(veld.c, v) <= 1);
}

/** Vakken op de weg (de hele rij, zover als nodig). */
export function isWeg(t, v) {
  return !!t.weg && ontleed(v)[1] === t.weg.rij;
}

export function tegelsOpVeld(t, i = t.huidig) {
  return buren(t.velden[i].c).filter((v) => t.gelegd[v]).length;
}

/** Vrije ringplekken van het huidige veld waar een tegel past. */
export function openRingplekken(t) {
  return buren(huidigVeld(t).c).filter((v) => !t.gelegd[v] && kandidaten(t.gelegd, v).length > 0);
}

/** Een vak dat al in gebruik is voor een veld, de werker of de weg (daar mag geen nieuw veld overheen). */
function bezetVoorVeld(t, v, al = veldVakken(t)) {
  return al.has(v) || v === t.werker || isWeg(t, v);
}

/**
 * Het midden van het nieuwe veld rond een brugplek: een buur van de brug op afstand 3 van het huidige midden,
 * zonder overlap met andere velden, de werker of de weg. Bij voorkeur in rechte lijn naar buiten.
 */
export function nieuwMidden(t, brug) {
  const o = huidigVeld(t).c;
  const al = veldVakken(t);
  const po = pixel(o);
  const pb = pixel(brug);
  const hoekUit = Math.atan2(pb.y - po.y, pb.x - po.x);
  const kandidaatMiddens = buren(brug)
    .filter((c) => afstand(c, o) === 3 && bloem(c).every((v) => !bezetVoorVeld(t, v, al)))
    .map((c) => {
      const pc = pixel(c);
      let verschil = Math.abs(Math.atan2(pc.y - pb.y, pc.x - pb.x) - hoekUit);
      if (verschil > Math.PI) verschil = 2 * Math.PI - verschil;
      return { c, verschil };
    })
    .sort((a, b) => a.verschil - b.verschil);
  return kandidaatMiddens.length ? kandidaatMiddens[0].c : null;
}

/**
 * Open plekken in de jungle waar Pino een brug kan leggen: pas na TEGELS_VOOR_BRUG tegels op het huidige veld
 * en niet vanaf het laatste veld. Een brugplek ligt op afstand 2 van het huidige midden, grenst aan een
 * gelegde tegel van het huidige veld, heeft een passende tegel en ruimte voor een nieuw veld.
 */
export function brugplekken(t) {
  if (t.huidig >= AANTAL_VELDEN - 1 || tegelsOpVeld(t) < TEGELS_VOOR_BRUG) return [];
  return grasplekken(t).filter((v) => buren(v).some((b) => t.gelegd[b] && afstand(b, huidigVeld(t).c) === 1)
    && kandidaten(t.gelegd, v).length > 0);
}

/** De open grasplekken rond het huidige veld: vakken op afstand 2 waar een nieuw veld zou passen. */
export function grasplekken(t) {
  if (t.huidig >= AANTAL_VELDEN - 1) return [];
  const c = huidigVeld(t).c;
  const al = veldVakken(t);
  return vakkenRond(c, 2).filter((v) => !bezetVoorVeld(t, v, al) && nieuwMidden(t, v));
}

/** Vakken precies op afstand n van c. */
export function vakkenRond(c, n) {
  const [q, r] = ontleed(c);
  const uit = [];
  for (let dq = -n; dq <= n; dq += 1) {
    for (let dr = Math.max(-n, -dq - n); dr <= Math.min(n, -dq + n); dr += 1) {
      const v = vak(q + dq, r + dr);
      if (afstand(v, c) === n) uit.push(v);
    }
  }
  return uit;
}

/** Glinstert het midden van veld i? Alle 6 ringplekken gevuld en de edelsteen nog niet gekozen. */
export function glinstert(t, i = t.huidig) {
  const veld = t.velden[i];
  return !veld.geoogst && buren(veld.c).every((v) => t.gelegd[v]);
}

/** Ringplekken van het laatste veld naast de weg: een tegel daar beëindigt het spel. */
export function isWegplek(t, v) {
  return !!t.weg && t.weg.plekken.includes(v);
}

/**
 * De weg bij het laatste veld: een horizontale rij twee rijen boven of onder het midden, aan de kant waar Pino
 * niet vandaan kwam en waar geen ander veld ligt. De twee ringplekken in de rij ertussen zijn de wegplekken.
 */
export function wegVoor(t, c, brug) {
  const [q, r] = ontleed(c);
  const rb = ontleed(brug)[1];
  const kanten = rb > r ? [-1, 1] : rb < r ? [1, -1] : [-1, 1];
  const vrij = (kant) => {
    if (rb === r + kant) return false;   // de brug zelf mag geen wegplek zijn
    const rij = r + 2 * kant;
    return !t.velden.some((veld) => Math.abs(ontleed(veld.c)[1] - rij) <= 1 && Math.abs(pixel(veld.c).x - pixel(c).x) < DX * 6);
  };
  const kant = kanten.find(vrij) ?? kanten[0];
  const plekken = kant < 0 ? [vak(q, r - 1), vak(q + 1, r - 1)] : [vak(q - 1, r + 1), vak(q, r + 1)];
  return { rij: r + 2 * kant, kant, plekken };
}

/** Werkerplek bij het derde veld: een junglevak op afstand 2, zo ver mogelijk van de brug. */
export function werkerPlekVoor(t, c, brug) {
  const al = veldVakken(t);
  for (const v of bloem(c)) al.add(v);
  const pb = pixel(brug);
  const vrij = vakkenRond(c, 2).filter((v) => !al.has(v) && !isWeg(t, v));
  vrij.sort((a, b) => {
    const pa = pixel(a); const pc = pixel(b);
    return Math.hypot(pc.x - pb.x, pc.y - pb.y) - Math.hypot(pa.x - pb.x, pa.y - pb.y);
  });
  return vrij[0] || null;
}

/* ---------- jungle ---------- */

/** Vaste pseudo-willekeur per vak (de jungle ziet er na herladen hetzelfde uit). */
export function hash(v, zout = 0) {
  const [q, r] = ontleed(v);
  let x = (q * 73856093) ^ (r * 19349663) ^ (zout * 83492791);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

const PLANTEN = ['s8-boom', 's8-bamboe', 'banaan', 's8-varen', 's8-boom', 'banaan', 's8-bamboe', 's4-palm'];

/** Welke plant er op een junglevak staat, met een kleine verschuiving. */
export function junglePlant(v) {
  return {
    id: PLANTEN[Math.floor(hash(v, 1) * PLANTEN.length)],
    dx: (hash(v, 2) - 0.5) * 16,
    dy: (hash(v, 3) - 0.5) * 10,
    flip: hash(v, 4) < 0.5,
    bloem: hash(v, 5) < 0.35,
  };
}

/* ---------- overgangen (zonder voorraad; die regelt staat.js) ---------- */

/** De tuin na het leggen van een brug: nieuw veld rond de brug, Pino erheen, en bij veld 3 en 7 werker en weg. */
export function metBrug(t, brug, type) {
  const c = nieuwMidden(t, brug);
  if (!c) return null;
  const uit = structuredClone(t);
  uit.gelegd[brug] = type;
  uit.velden.push({ c, soort: SOORTEN[uit.velden.length] || 'tempel', geoogst: false });
  uit.huidig = uit.velden.length - 1;
  uit.pino = brug;
  if (uit.huidig === WERKER_VELD) uit.werker = werkerPlekVoor(uit, c, brug);
  if (uit.huidig === WEG_VELD) uit.weg = wegVoor(uit, c, brug);
  return uit;
}

/* ---------- nieuwe tuin ---------- */

export function nieuweTuin() {
  return {
    velden: [{ c: vak(0, 0), soort: SOORTEN[0], geoogst: false }],
    huidig: 0,
    gelegd: {},
    pino: vak(0, 0),
    weg: null,
    werker: null,
    edelstenen: 0,
  };
}
