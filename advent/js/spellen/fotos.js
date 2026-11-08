// Spel 4 · regels zonder DOM (zie specs/spel4.md).
// Per familie: fotoplekken met hun frame, de looproutes van de familieleden als vaste tijdlijnen,
// wie er "in beeld" staat, de beoordeling van een tik en wat de familie betaalt.
// Coördinaten zijn scène-eenheden (viewBox 358×670); een positie is altijd het voetpunt (midden onder).

import * as fam from './familie.js';

export const B = 358;
export const H = 670;

export const MOMENT = 2;          // seconden dat iemand op zijn fotoplek staat (en lacht)
export const SNELHEID = 45;       // looptempo familie, eenheden per seconde
export const PINO_SNELHEID = 110; // Pino loopt sneller naar het fotopunt
export const IN_BEELD = 0.3;      // vanaf dit deel van het lichaam binnen het frame telt iemand mee
export const ROOD_MS = 750;       // rood frame bij een misklik
export const RAAK_MARGE = 10;     // extra raakvlak rond een familielid

/** Lichaam t.o.v. het voetpunt, per soort. */
const LICHAAM = {
  volwassen: { dx: -12, dy: -66, b: 24, h: 66 },
  kind: { dx: -9, dy: -48, b: 18, h: 48 },
  dier: { dx: -16, dy: -26, b: 32, h: 26 },
};

/** Wat elke familie betaalt voor drie foto's (besluit 48). */
export const BETALING = { nguyen: 100, somchai: 80, tan: 60 };

/**
 * Omgevingen per familie. plekken: fotoplekken met frame, doelen (rollen) en hun positie, en het fotopunt
 * van Pino. routes: per rol een lijst stops { p: [x, y], wacht } die na de fotoplek komen; de route eindigt
 * altijd met MOMENT seconden op de fotoplek. Rollen met dezelfde `cyclus` en dezelfde plek staan daar samen.
 * kijk: vaste kijkrichting per rol tijdens het moment (1 = rechts, -1 = links), bv. het dier naar zijn eten;
 * zonder kijk blijft de looprichting staan.
 */
export const OMGEVINGEN = {
  tan: {
    omgeving: 'strand',
    pino: { rust: [196, 640], richting: -1 },
    plekken: [
      { id: 'boog', frame: { x: 104, y: 296, b: 146, h: 140 }, doelen: { moeder: [158, 428], vader: [196, 428] }, fotopunt: [176, 518], richting: -1 },
      { id: 'kraam', frame: { x: 252, y: 334, b: 102, h: 120 }, doelen: { kind: [300, 442] }, fotopunt: [226, 538], richting: 1 },
      { id: 'handdoek', frame: { x: 250, y: 486, b: 104, h: 94 }, doelen: { dier: [302, 552] }, kijk: { dier: 1 }, fotopunt: [214, 594], richting: 1 },
    ],
    routes: {
      // Ouders lopen elk hun eigen rondje, maar staan elke 17 s samen 2 s onder de boog.
      moeder: { cyclus: 17, start: 5, stops: [{ p: [60, 452], wacht: 2 }, { p: [52, 600], wacht: 1.5 }] },
      vader: { cyclus: 17, start: 5, stops: [{ p: [226, 452], wacht: 2 }, { p: [318, 620], wacht: 2 }] },
      // Kind: parasol → naast de kraam (staat dan in het frame van de boog) → kraam.
      kind: { cyclus: 11, start: 4, stops: [{ p: [306, 500], wacht: 1.5 }, { p: [226, 452], wacht: 1.5 }] },
      // Dier: midden onderin → vóór de kraam (staat dan in het frame van de kraam) → handdoek.
      dier: { cyclus: 12, start: 3, stops: [{ p: [236, 600], wacht: 1 }, { p: [330, 468], wacht: 1 }] },
    },
  },
  nguyen: {
    omgeving: 'berg',
    pino: { rust: [330, 650], richting: -1 },
    plekken: [
      { id: 'hek', frame: { x: 44, y: 280, b: 136, h: 100 }, doelen: { moeder: [88, 364], vader: [134, 364] }, fotopunt: [112, 470], richting: -1 },
      { id: 'rotspunt', frame: { x: 244, y: 230, b: 96, h: 80 }, doelen: { kind: [290, 294] }, fotopunt: [262, 410], richting: 1 },
      { id: 'ijsje', frame: { x: 206, y: 518, b: 104, h: 74 }, doelen: { dier: [250, 568] }, kijk: { dier: 1 }, fotopunt: [172, 640], richting: 1 },
    ],
    routes: {
      // Ouders (18 s): moeder pad / naast het ijsje (in het frame van het gansje), vader pad / voorop het rotspunt
      // (in het frame van het meisje). Afgestemd met controleer(): hek 84 %, rotspunt 64 %, ijsje 83 % schoon.
      moeder: { cyclus: 18, start: 5, stops: [{ p: [120, 430], wacht: 2 }, { p: [226, 606], wacht: 1.5 }] },
      vader: { cyclus: 18, start: 5, stops: [{ p: [200, 440], wacht: 2 }, { p: [298, 320], wacht: 1.2 }] },
      // Meisje (12,5 s): bij de den → naast het hek (in het frame van de ouders) → rotspunt.
      kind: { cyclus: 12.5, start: 4, stops: [{ p: [250, 380], wacht: 1.5 }, { p: [166, 382], wacht: 1.5 }] },
      // Gansje (11 s): midden → bij de struik → ijsje.
      dier: { cyclus: 11, start: 3, stops: [{ p: [180, 560], wacht: 1 }, { p: [300, 482], wacht: 1 }] },
    },
  },
  somchai: {
    omgeving: 'markt',
    pino: { rust: [300, 652], richting: -1 },
    plekken: [
      { id: 'bloemkraam', frame: { x: 26, y: 290, b: 146, h: 136 }, doelen: { moeder: [70, 416], vader: [114, 416] }, fotopunt: [150, 508], richting: -1 },
      { id: 'dierentafel', frame: { x: 226, y: 334, b: 128, h: 146 }, doelen: { kind: [262, 470] }, kijk: { kind: 1 }, fotopunt: [196, 560], richting: 1 },
      { id: 'kool', frame: { x: 118, y: 568, b: 112, h: 80 }, doelen: { dier: [168, 624] }, kijk: { dier: 1 }, fotopunt: [80, 652], richting: 1 },
    ],
    routes: {
      // Ouders (17 s): moeder manden / bij de kool (in het frame van het lammetje), vader midden op het plein /
      // rechts vóór de dierentafel (in het frame van het jongetje). Afgestemd met controleer(): bloemenkraam 82 %,
      // dierentafel 58 %, kool 82 %. De verkoper achter de tafel is decor en telt niet mee.
      moeder: { cyclus: 17, start: 5, stops: [{ p: [60, 560], wacht: 2 }, { p: [130, 600], wacht: 1.5 }] },
      vader: { cyclus: 17, start: 5, stops: [{ p: [200, 380], wacht: 2.5 }, { p: [340, 490], wacht: 1 }] },
      // Jongetje (11,5 s): vóór de bloemenkraam (in het frame van de ouders) → bij de regenton → dierentafel.
      kind: { cyclus: 11.5, start: 4, stops: [{ p: [150, 440], wacht: 1.5 }, { p: [170, 500], wacht: 1.5 }] },
      // Lammetje (12 s): vóór de manden → linksonder → kool.
      dier: { cyclus: 12, start: 3, stops: [{ p: [100, 548], wacht: 1 }, { p: [44, 650], wacht: 1 }] },
    },
  },
};

/**
 * De omgeving van een familie. Tot de berg (Nguyễn) en de markt (Somchai) gebouwd zijn (fase 2/3), fotograferen
 * die families op het strand met de plekken en routes van Tan; de rollen zijn bij elke familie gelijk.
 */
export function omgeving(familieId) {
  if (OMGEVINGEN[familieId]) return OMGEVINGEN[familieId];
  return fam.familie(familieId) ? { ...OMGEVINGEN.tan, tijdelijk: true } : null;
}

/** Complete families die nog geen foto's hebben, in de volgorde waarin ze compleet werden. */
export function teFotograferen({ karakters = [], fotos = [], familie = null } = {}) {
  const volgorde = completeInVolgorde(karakters);
  // Oudere staat (of ?vul=1) kan een familie hebben zonder de bijbehorende kaarten: die telt ook mee.
  if (familie && !volgorde.includes(familie)) volgorde.unshift(familie);
  return volgorde.filter((id) => omgeving(id) && !fotos.includes(id));
}

/* ---------- familie en rollen ---------- */

/**
 * De familieleden van spel 4 met hun rol: moeder, vader, kind (vast lid of gekocht meisje) en dier (gekocht).
 * Elk lid: { rol, soort: 'volwassen' | 'kind' | 'dier', label, persoon | dier }.
 */
export function leden(familieId) {
  const f = fam.familie(familieId);
  if (!f) return [];
  const uit = [];
  f.leden.forEach((l, i) => {
    const { x, y, ...persoon } = l;
    if (l.kind) uit.push({ rol: 'kind', soort: 'kind', label: l.jurk ? 'Meisje' : 'Jongetje', persoon });
    else uit.push({ rol: i === 0 ? 'moeder' : 'vader', soort: 'volwassen', label: i === 0 ? 'Moeder' : 'Vader', persoon });
  });
  for (const p of f.plekken) {
    const k = fam.KARAKTERS[p.karakter];
    if (k.soort === 'dier') uit.push({ rol: 'dier', soort: 'dier', label: k.label, dier: k.dier });
    else uit.push({ rol: 'kind', soort: 'kind', label: k.label, persoon: k.persoon });
  }
  return uit;
}

/** Complete families in de volgorde waarin ze in spel 3 compleet werden (volgorde van de gekochte kaarten). */
export function completeInVolgorde(gekocht = []) {
  return fam.FAMILIES
    .filter((f) => fam.isCompleet(f, gekocht))
    .map((f) => ({ id: f.id, klaar: Math.max(-1, ...f.plekken.map((p) => gekocht.indexOf(p.karakter))) }))
    .sort((a, b) => a.klaar - b.klaar)
    .map((f) => f.id);
}

/** De eerste complete familie zonder foto's, of null als er geen is. */
export function volgendeFamilie(s = {}) {
  return teFotograferen(s)[0] || null;
}

/* ---------- routes ---------- */

const afstand = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1]);

/** Rekent een route om naar een tijdlijn van stukken { t0, t1, van, naar, toestand } over één cyclus. */
export function tijdlijn(route, thuis) {
  const stukken = [];
  let t = 0;
  let hier = thuis;
  const loop = (naar) => {
    const d = afstand(hier, naar) / SNELHEID;
    if (d > 0) stukken.push({ t0: t, t1: t + d, van: hier, naar, toestand: 'loop' });
    t += d;
    hier = naar;
  };
  const sta = (duur, toestand = 'staan') => {
    if (duur > 0) stukken.push({ t0: t, t1: t + duur, van: hier, naar: hier, toestand });
    t += duur;
  };
  route.stops.forEach((s, i) => {
    loop(s.p);
    // De speling tot de cyclusduur komt bij de laatste stop, zodat de fotoplek altijd op het eind valt.
    const isLaatste = i === route.stops.length - 1;
    const rest = isLaatste ? route.cyclus - (t + s.wacht + afstand(s.p, thuis) / SNELHEID + MOMENT) : 0;
    sta(s.wacht + Math.max(0, rest));
  });
  loop(thuis);
  sta(MOMENT, 'moment');
  return { stukken, duur: t, speling: route.cyclus - t };
}

/**
 * Maakt de tijdlijnen voor alle rollen van een omgeving. Is een route langer dan zijn cyclus, dan wordt de
 * cyclus verlengd; rollen die een fotoplek delen (de ouders) krijgen altijd dezelfde cyclus, zodat ze er samen staan.
 */
export function maakRoutes(omgeving) {
  const uit = {};
  for (const plek of omgeving.plekken) {
    const rollen = Object.keys(plek.doelen).filter((r) => omgeving.routes[r]);
    const nodig = Math.max(...rollen.map((r) => {
      const route = omgeving.routes[r];
      return Math.max(route.cyclus, tijdlijn({ ...route, cyclus: 0 }, plek.doelen[r]).duur);
    }));
    const cyclus = Math.ceil(nodig * 2) / 2;
    for (const rol of rollen) {
      const route = { ...omgeving.routes[rol], cyclus };
      uit[rol] = { ...tijdlijn(route, plek.doelen[rol]), cyclus, start: route.start || 0, plek: plek.id, kijk: plek.kijk?.[rol] || 0 };
    }
  }
  return uit;
}

/** Positie en toestand van een rol op speltijd t (seconden). */
export function stand(routeTijdlijn, t) {
  const { stukken, cyclus, start, kijk = 0 } = routeTijdlijn;
  const fase = (((t + start) % cyclus) + cyclus) % cyclus;
  let stuk = stukken[stukken.length - 1];
  for (const s of stukken) { if (fase < s.t1) { stuk = s; break; } }
  const u = stuk.t1 > stuk.t0 ? Math.min(1, Math.max(0, (fase - stuk.t0) / (stuk.t1 - stuk.t0))) : 1;
  const x = stuk.van[0] + (stuk.naar[0] - stuk.van[0]) * u;
  const y = stuk.van[1] + (stuk.naar[1] - stuk.van[1]) * u;
  // Kijkrichting: de looprichting van het laatste stuk met horizontale beweging.
  let richting = 1;
  const idx = stukken.indexOf(stuk);
  for (let i = 0; i < stukken.length; i++) {
    const s = stukken[(idx - i + stukken.length) % stukken.length];
    const dx = s.naar[0] - s.van[0];
    if (Math.abs(dx) > 0.5) { richting = dx < 0 ? -1 : 1; break; }
  }
  if (stuk.toestand === 'moment' && kijk) richting = kijk;
  return { x, y, toestand: stuk.toestand, richting, fase, loopFase: stuk.toestand === 'loop' ? fase - stuk.t0 : 0 };
}

/* ---------- in beeld ---------- */

export function lichaam(soort, x, y) {
  const l = LICHAAM[soort];
  return { x: x + l.dx, y: y + l.dy, b: l.b, h: l.h };
}

export function raakvlak(soort, x, y) {
  const r = lichaam(soort, x, y);
  return { x: r.x - RAAK_MARGE, y: r.y - RAAK_MARGE, b: r.b + 2 * RAAK_MARGE, h: r.h + 2 * RAAK_MARGE };
}

/** Deel van rechthoek a dat binnen rechthoek b valt (0..1). */
export function overlap(a, b) {
  const w = Math.min(a.x + a.b, b.x + b.b) - Math.max(a.x, b.x);
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (w <= 0 || h <= 0) return 0;
  return (w * h) / (a.b * a.h);
}

export function inBeeld(soort, x, y, frame) {
  return overlap(lichaam(soort, x, y), frame) >= IN_BEELD;
}

/** Frame om een familielid heen (voor het rode frame als hij niet op zijn plek staat). */
export function frameOm(soort, x, y) {
  const r = lichaam(soort, x, y);
  const b = Math.max(r.b + 36, 70);
  const h = r.h + 36;
  return { x: r.x + r.b / 2 - b / 2, y: r.y - 18, b, h };
}

/* ---------- een tik beoordelen ---------- */

/**
 * standen: { rol: { x, y, toestand, soort } } van alle familieleden op het moment van de tik.
 * gedaan: id's van plekken die al gefotografeerd zijn.
 * Geeft { uitkomst: 'goed' | 'fout' | 'niets', plek, frame }.
 */
export function beoordeel(omgeving, rol, standen, gedaan = []) {
  const plek = omgeving.plekken.find((p) => rol in p.doelen);
  if (!plek || gedaan.includes(plek.id)) return { uitkomst: 'niets' };
  const ik = standen[rol];
  const doelen = Object.keys(plek.doelen);
  const ikKlaar = ik.toestand === 'moment';
  const allenKlaar = doelen.every((d) => standen[d] && standen[d].toestand === 'moment');
  const indringers = Object.entries(standen)
    .filter(([r, s]) => !doelen.includes(r) && inBeeld(s.soort, s.x, s.y, plek.frame))
    .map(([r]) => r);
  if (allenKlaar && indringers.length === 0) return { uitkomst: 'goed', plek, frame: plek.frame };
  return { uitkomst: 'fout', plek, frame: ikKlaar ? plek.frame : frameOm(ik.soort, ik.x, ik.y), indringers };
}

/* ---------- controle (console / test) ---------- */

/**
 * Simuleert `duur` seconden en telt per fotoplek hoeveel momenten er waren en hoeveel daarvan minstens
 * `minSchoon` seconden zonder indringers. Eis uit de spec: minstens de helft schoon.
 */
export function controleer(familieId, { duur = 3600, stap = 0.05, minSchoon = 0.8 } = {}) {
  const omgeving = OMGEVINGEN[familieId] || OMGEVINGEN.tan;
  const routes = maakRoutes(omgeving);
  const soorten = Object.fromEntries(leden(familieId).map((l) => [l.rol, l.soort]));
  const uit = {};
  const speling = Object.fromEntries(Object.entries(routes).map(([r, rt]) => [r, Number(rt.speling.toFixed(2))]));
  for (const plek of omgeving.plekken) {
    const doelen = Object.keys(plek.doelen);
    let momenten = 0;
    let schoon = 0;
    let bezig = false;
    let schoonTijd = 0;
    for (let t = 0; t < duur; t += stap) {
      const standen = {};
      for (const [r, rt] of Object.entries(routes)) standen[r] = { ...stand(rt, t), soort: soorten[r] };
      const klaar = doelen.every((d) => standen[d].toestand === 'moment');
      if (klaar && !bezig) { bezig = true; momenten++; schoonTijd = 0; }
      if (klaar) {
        if (beoordeel(omgeving, doelen[0], standen).uitkomst === 'goed') schoonTijd += stap;
      } else if (bezig) {
        bezig = false;
        if (schoonTijd >= minSchoon) schoon++;
      }
    }
    uit[plek.id] = { momenten, schoon, deel: Number((schoon / Math.max(1, momenten)).toFixed(2)) };
  }
  return { plekken: uit, speling };
}
