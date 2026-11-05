// Spel 2 · Tuin van de koningin — logica van het hexraster, zonder DOM (zie specs/spel2.md).
//
// Raster: 6 kolommen × 14 rijen, "odd-r": oneven rijen schuiven een halve hex naar rechts.
// Een vak is een string "c,r". Het bord is { "c,r": "kleur-figuur" } met alleen de gelegde tegels;
// de starttegel, de uitgang en de decorvakken zijn vast en staan hier als constanten.

export const COLS = 6;
export const ROWS = 14;

export const KLEUREN = ['groen', 'geel', 'blauw'];
export const FIGUREN = ['vlinder', 'boom', 'vogel'];
/** Alle negen tegeltypen in vaste volgorde (ook de volgorde in het taartmenu). */
export const TYPES = KLEUREN.flatMap((k) => FIGUREN.map((f) => `${k}-${f}`));

export const START = '0,13';
export const START_TYPE = 'groen-boom';
export const UITGANG = '5,0';
export const WERKER = '3,10';

/** Randvakken die decor zijn (vijver, bananen, bamboe, bloemen): geen bord, niet te betegelen. */
export const DECOR = new Set([
  '0,0', '1,0', '0,1',          // lotusvijver met sala
  '5,5', '4,6', '5,6', '5,7',   // bananenperk rechts
  '0,8', '0,9',                 // bamboe links
  '5,11', '5,12',               // palm rechtsonder
  '4,13', '5,13',               // bloemenperk rechtsonder
]);

/* ---------- geometrie ---------- */

export const OX = 28;
export const OY = 76;
export const DX = 55;
export const DY = 48;

export const vak = (c, r) => `${c},${r}`;
export const ontleed = (v) => v.split(',').map(Number);

/** Middelpunt van het bovenvlak in scènecoördinaten. */
export function middelpunt(v) {
  const [c, r] = ontleed(v);
  return { x: OX + c * DX + (r % 2 ? DX / 2 : 0), y: OY + r * DY };
}

export function opBord(v) {
  const [c, r] = ontleed(v);
  return c >= 0 && c < COLS && r >= 0 && r < ROWS && !DECOR.has(v);
}

/** Alle (niet-decor) vakken, rij voor rij van achter naar voor. */
export function alleVakken() {
  const uit = [];
  for (let r = 0; r < ROWS; r += 1) for (let c = 0; c < COLS; c += 1) if (opBord(vak(c, r))) uit.push(vak(c, r));
  return uit;
}

/** De zes buurposities (ook buiten het raster of op decor). */
export function burenRuw(v) {
  const [c, r] = ontleed(v);
  const oneven = r % 2 === 1;
  const d = oneven
    ? [[-1, 0], [1, 0], [0, -1], [1, -1], [0, 1], [1, 1]]
    : [[-1, 0], [1, 0], [-1, -1], [0, -1], [-1, 1], [0, 1]];
  return d.map(([dc, dr]) => vak(c + dc, r + dr));
}

/** Buren die op het bord liggen. */
export function buren(v) {
  return burenRuw(v).filter(opBord);
}

/* ---------- tegels ---------- */

export const splits = (type) => type.split('-');

/** Twee tegels passen als ze precies één eigenschap delen (kleur óf figuur, niet allebei). */
export function past(a, b) {
  const [ka, fa] = splits(a);
  const [kb, fb] = splits(b);
  return (ka === kb) !== (fa === fb);
}

/** Type van een vak: gelegde tegel, starttegel of null (gras/uitgang). */
export function typeVan(bord, v) {
  if (v === START) return START_TYPE;
  return bord[v] || null;
}

/** Bezet = er ligt iets dat telt voor omringen: start, gelegde tegel of uitgang. */
export function bezet(bord, v) {
  return v === START || v === UITGANG || !!bord[v];
}

/** Een leeg grasvak (geen start, uitgang, decor of tegel). */
export function isGras(bord, v) {
  return opBord(v) && v !== START && v !== UITGANG && !bord[v];
}

/**
 * Groep van een tegel voor één eigenschap (0 = kleur, 1 = figuur): alle tegels die via aangrenzende
 * tegels met diezelfde kleur (of hetzelfde figuur) met elkaar verbonden zijn. Geeft de vakken terug.
 */
export function groep(bord, v, eigenschap) {
  const waarde = splits(typeVan(bord, v))[eigenschap];
  const gezien = new Set([v]);
  const rij = [v];
  while (rij.length) {
    const huidig = rij.shift();
    for (const b of buren(huidig)) {
      const t = typeVan(bord, b);
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
 * Dat geldt ook als een nieuwe tegel twee groepen aan elkaar knoopt.
 */
export function groepenUniek(bord, v, type) {
  const proef = { ...bord, [v]: type };
  return [0, 1].every((eigenschap) => {
    const typen = groep(proef, v, eigenschap).map((g) => typeVan(proef, g));
    return new Set(typen).size === typen.length;
  });
}

/**
 * Tegeltypen die op dit vak passen: ze moeten passen bij álle aangrenzende tegels (start telt mee,
 * gras en uitgang niet) en geen dubbel tegeltype in een groep maken. Zonder aangrenzende tegel: geen kandidaten.
 */
export function kandidaten(bord, v) {
  const typen = buren(v).map((b) => typeVan(bord, b)).filter(Boolean);
  if (!typen.length) return [];
  return TYPES.filter((t) => typen.every((n) => past(t, n)) && groepenUniek(bord, v, t));
}

/** Grasvakken naast de start of een gelegde tegel met minstens één passend tegeltype. */
export function openVakken(bord) {
  return alleVakken().filter((v) => isGras(bord, v) && kandidaten(bord, v).length > 0);
}

/** Grasvakken (nog niet geoogst) waarvan alle zes buren bezet zijn. */
export function omringdeVakken(bord, geoogst = []) {
  return alleVakken().filter((v) => isGras(bord, v)
    && !geoogst.includes(v)
    && burenRuw(v).every((b) => opBord(b) && bezet(bord, b)));
}

/** Kortste pad over start en gelegde tegels naar de uitgang (inclusief beide), of null. */
export function pad(bord) {
  const vorige = new Map([[START, null]]);
  const rij = [START];
  while (rij.length) {
    const v = rij.shift();
    if (buren(v).includes(UITGANG)) {
      const uit = [UITGANG];
      for (let p = v; p; p = vorige.get(p)) uit.unshift(p);
      return uit;
    }
    for (const b of buren(v)) {
      if (!vorige.has(b) && b !== UITGANG && typeVan(bord, b)) { vorige.set(b, v); rij.push(b); }
    }
  }
  return null;
}

export function bereiktUitgang(bord) {
  return pad(bord) !== null;
}
