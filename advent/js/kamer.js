// Pino's kamer (#/kamer, specs/kamer.md, besluiten 201–207): een kamer in poppenhuisstijl die zich vult met wat
// Pino verzamelt en speelt. Tik op een voorwerp → naam en omschrijving in een gedachtenwolk onder de scène.
// Posities komen uit design/generators/kamer_build.py (kamer_scene), viewBox 358×560.

import { h } from './ui/dom.js';
import { kopbalk } from './ui/kopbalk.js';
import { el, use, groep, persoon, dier, pino } from './sprites.js';
import { GEM_KLEUR } from './ui/edelstenen.js';
import { leden } from './spellen/fotos.js';
import * as staat from './staat.js';
import * as datum from './datum.js';
import { zichtbareVoorwerpen, tekstVoor, volleStaat } from './kamer-inhoud.js';

const B = 358;
const H = 560;
const TEGEL_KLEUR = { groen: '#39D353', geel: '#FFC93C', blauw: '#5BC0EB' };
const HUIS = { tan: 'huis-paal', nguyen: 'huis-villa', somchai: 'huis-shop' };
const LEVEL_STUK = { 1: 'python', 2: 'tijger', 3: 'luiaard', 4: 'leeuw', 5: 'krokodil' };
const FOTO_X = { tan: 6, nguyen: 51, somchai: 96 };
const FOTO_Y = { tan: 12, nguyen: 16, somchai: 12 };
const FOTO_ROT = { tan: -4, nguyen: 3, somchai: -2 };

let teksten = null;
async function haalTeksten() {
  if (teksten) return teksten;
  try {
    const r = await fetch(new URL('../data/kamer.json', import.meta.url));
    teksten = await r.json();
  } catch {
    teksten = { voorwerpen: {} };
  }
  return teksten;
}

const pct = (v, t) => `${((v / t) * 100).toFixed(3)}%`;

/* ---------- bouwstenen (JS-port van kamer_sprites.py) ---------- */

function hexTegel(cx, cy, kleur, figuur, s = 34) {
  const x = cx - s / 2;
  const y = cy - (s * 58) / 112 - 4;
  const n = s / 56;
  const g = el('g', {}, [use('hx-tegel', x, y, s, (s * 66) / 56, TEGEL_KLEUR[kleur])]);
  if (figuur === 'vlinder') {
    const m = 15 * n;
    for (const [mx, my] of [[28, 13], [16, 33], [40, 33]]) g.append(use('m-vlinder', x + mx * n - m / 2, y + my * n - m / 2 + 4 * n, m, m));
  } else {
    const m = 30 * n;
    g.append(use(`m-${figuur}`, cx - m / 2, y + 14 * n, m, m));
  }
  return g;
}

/** Een platte tegel in driekwartaanzicht: dezelfde tegel, verticaal half zo hoog, met het midden op (cx, cy). */
function platteTegel(cx, cy, kleur, figuur, s) {
  const t = hexTegel(cx, cy + (s * 58) / 112 + 4 - (s * 33) / 56, kleur, figuur, s);
  return el('g', { transform: `translate(${cx} ${cy}) scale(1 0.5) translate(${-cx} ${-cy})` }, [t]);
}

/**
 * Een stapeltje platte tegels op de vloer, als speelgoed rond het kleed (besluit 223): hooguit drie getekend, elke
 * tegel 2,6 px hoger, met een zachte schaduw eronder. (cx, cy) is het midden van de onderste tegel.
 */
function tegelstapel(cx, cy, kleur, figuur, aantal, s = 26) {
  const g = el('g', {}, [el('ellipse', { cx, cy: cy + s * 0.22, rx: s * 0.55, ry: s * 0.2, fill: 'rgba(139, 74, 30, 0.18)' })]);
  for (let i = 0; i < Math.min(3, Math.max(1, aantal)); i++) g.append(platteTegel(cx, cy - i * 2.6, kleur, figuur, s));
  return g;
}

/** Omgeving uit spel 4 in het fotovlak (100×96 op 8,8 van s4-polaroid). */
function fotoAchtergrond(familie) {
  const lucht = el('rect', { x: 8, y: 8, width: 100, height: 96, fill: '#8ED8F8' });
  if (familie === 'tan') {
    return [lucht, el('circle', { cx: 90, cy: 22, r: 8, fill: '#FFE08A' }), el('rect', { x: 8, y: 58, width: 100, height: 12, fill: '#1FA3DC' }), el('rect', { x: 8, y: 68, width: 100, height: 36, fill: '#FDE9B6' })];
  }
  if (familie === 'nguyen') {
    return [lucht, el('path', { d: 'M8 70 l26 -34 l22 26 l20 -30 l32 38 v8 h-100z', fill: '#5FB05A' }), el('path', { d: 'M56 62 l20 -30 l8 10 l-14 26z', fill: '#4E9A3E' }), el('rect', { x: 8, y: 76, width: 100, height: 28, fill: '#8BD35A' })];
  }
  return [lucht, el('path', { d: 'M8 40 h50 l-6 12 h-38z', fill: '#FF5E5B' }), el('path', { d: 'M58 40 h50 v12 h-56z', fill: '#FFC93C' }), el('rect', { x: 8, y: 76, width: 100, height: 28, fill: '#F2CF8A' })];
}

/** Polaroid met de familie zoals Pino ze in spel 4 fotografeerde. */
function foto(familie, x, y, s, rot) {
  const plekken = { volwassen: [[12, 30], [42, 28]], kind: [[70, 46]], dier: [[74, 80]] };
  const tel = { volwassen: 0, kind: 0, dier: 0 };
  const mensen = leden(familie).map((l) => {
    const [px, py] = plekken[l.soort][tel[l.soort]++] || plekken[l.soort][0];
    return l.soort === 'dier' ? dier(px, py, l.dier, { schaal: 0.5 }) : persoon(px, py, { ...l.persoon, schaal: 0.78 });
  });
  const clip = `km-foto-${familie}`;
  return el('g', { transform: `translate(${x} ${y}) scale(${s}) rotate(${rot})` }, [
    use('s4-polaroid', 0, 0, 120, 140),
    el('clipPath', { id: clip }, [el('rect', { x: 8, y: 8, width: 100, height: 96 })]),
    el('g', { 'clip-path': `url(#${clip})` }, [...fotoAchtergrond(familie), ...mensen]),
  ]);
}

function schaakbord(x, y, levels) {
  const g = groep(x, y, {}, [use('km-bordje', 0, 0, 60, 40)]);
  // Voetpunt per level op de vakjes van het bord (vakjes y 3–27), zigzag voor/achter; achterste stukken eerst.
  // Het stuk (15×19) heeft zijn voetmidden op (7,5; 16,5). Zelfde als schaakbord() in kamer_sprites.py.
  const plekken = [[9.5, 24], [20, 13], [30.5, 24], [41, 13], [51, 24]];
  for (const lv of [...levels].sort((a, b) => plekken[a - 1][1] - plekken[b - 1][1] || a - b)) {
    const [vx, vy] = plekken[lv - 1];
    g.append(use(`s8-stuk-${LEVEL_STUK[lv]}`, vx - 7.5, vy - 16.5, 15, 19));
  }
  return g;
}

/* ---------- voorwerpen: tekening, zichtbare rand (icoon in de wolk) en tikvlak ---------- */

/** Voor elk voorwerp: { knoop, rand, vak } in scène-coördinaten. */
function tekenVoorwerp(v) {
  const r = (x, y, w, hh) => ({ x, y, w, h: hh });
  switch (v.soort) {
    case 'slinger': return { knoop: el('g', {}, [use('s10-slinger', -2, 2, 182, 36), use('s10-slinger', 178, 2, 182, 36)]), rand: r(178, 2, 180, 36), vak: r(252, 0, 106, 40) };
    case 'foto': {
      const x = FOTO_X[v.familie];
      const y = FOTO_Y[v.familie];
      return { knoop: foto(v.familie, x, y, 0.34, FOTO_ROT[v.familie]), rand: r(x - 2, y - 4, 46, 56), vak: r(x - 2, y - 4, 45, 58) };
    }
    case 'lampion': return {
      knoop: el('g', {}, [el('line', { x1: 232, y1: 0, x2: 232, y2: 27, stroke: '#4F6B7E', 'stroke-width': 1.5 }), use('s5-gloed', 192, 3, 80, 80), use('s5-lampion', 220, 26, 24, 34, '#FF6FAE')]),
      rand: r(214, 20, 36, 44), vak: r(214, 18, 36, 46),
    };
    case 'gi': return { knoop: use('s6-gi', 262, 64, 40, 40), rand: r(262, 64, 40, 40), vak: r(258, 60, 44, 46) };
    case 'kniebeschermers': return { knoop: use('s5-kniebeschermers', 303, 66, 34, 34), rand: r(303, 66, 34, 34), vak: r(302, 60, 40, 46) };
    case 'boeddha': return { knoop: use('s2-boeddha', 118, 96, 22, 28), rand: r(116, 94, 26, 32), vak: r(112, 90, 30, 36) };
    case 'huisje': return { knoop: use(HUIS[v.familie], 142, 91, 48, 33), rand: r(142, 91, 48, 33), vak: r(142, 90, 50, 36) };
    case 'camera': return { knoop: use('s4-camera', 194, 104, 26, 20), rand: r(194, 102, 26, 22), vak: r(192, 90, 27, 36) };
    case 'spray': return { knoop: use('s5-spray', 219, 98, 26, 26), rand: r(219, 98, 26, 26), vak: r(219, 90, 25, 36) };
    case 'werker': return { knoop: use('werker', 245, 101, 18, 23), rand: r(243, 99, 22, 27), vak: r(244, 90, 24, 36) };
    case 'ketting': return { knoop: use('s5-ketting', 39, 78, 34, 34), rand: r(39, 78, 34, 34), vak: r(38, 76, 36, 40) };
    case 'steen-groen': return { knoop: use('gem', 14, 131, 18, 18, GEM_KLEUR.groen), rand: r(14, 131, 18, 18), vak: r(6, 120, 27, 36) };
    case 'steen-blauw': return { knoop: use('gem', 33, 131, 18, 18, GEM_KLEUR.blauw), rand: r(33, 131, 18, 18), vak: r(33, 120, 19, 36) };
    case 'steen-rood': return { knoop: use('gem', 66, 131, 18, 18, GEM_KLEUR.rood), rand: r(66, 131, 18, 18), vak: r(60, 120, 32, 36) };
    case 'nachtlamp': return { knoop: use('nachtlamp', 196, 166, 22, 30), rand: r(196, 166, 22, 30), vak: r(190, 160, 26, 38) };
    case 'stetho': return { knoop: use('km-stetho', 214, 184, 24, 16), rand: r(214, 184, 24, 16), vak: r(216, 174, 24, 30) };
    case 'meisje': return {
      knoop: persoon(281, 180, { kleding: '#5BC0EB', huid: '#E8B48A', haar: 'bh-lang', haarkleur: '#FFC93C', jurk: true, kind: true, schaal: 0.5 }),
      rand: r(281, 180, 18, 26), vak: r(272, 172, 36, 40),
    };
    case 'lam': return { knoop: dier(244, 220, 'lam', { schaal: 0.58 }), rand: r(244, 220, 28, 24), vak: r(242, 214, 32, 34) };
    case 'gansje': return { knoop: dier(274, 230, 'gansje', { schaal: 0.58 }), rand: r(274, 230, 28, 24), vak: r(274, 224, 30, 34) };
    case 'biggetje': return { knoop: dier(304, 220, 'biggetje', { schaal: 0.58 }), rand: r(304, 220, 28, 24), vak: r(304, 214, 34, 34) };
    case 'spaarvarken': return { knoop: use('km-spaarvarken', 198, 262, 34, 27), rand: r(198, 262, 34, 27), vak: r(196, 256, 38, 36) };
    case 'schoenen': return { knoop: use('s5-schoenen', 296, 296, 34, 34), rand: r(296, 296, 34, 34), vak: r(294, 294, 38, 38) };
    case 'ballonnen': return {
      knoop: el('g', {}, [[8, 376, '#FF6FAE'], [32, 362, '#FFC93C'], [56, 380, '#1FA3DC']].map(([x, y, k]) => use('s10-ballon', x, y, 28, 49, k))),
      rand: r(8, 362, 76, 67), vak: r(6, 358, 80, 70),
    };
    case 'schaakbord': return { knoop: schaakbord(20, 446, v.levels), rand: r(18, 438, 64, 48), vak: r(18, 436, 62, 48) };
    case 'taart': return { knoop: use('s10-taart', 80, 428, 38, 38), rand: r(80, 428, 38, 38), vak: r(80, 424, 36, 40) };
    case 'loep': return { knoop: use('s7-loep', 112, 454, 26, 26), rand: r(112, 454, 26, 26), vak: r(116, 446, 30, 34) };
    case 'tegel': {
      const [cx, cy] = tegelPlek(v.kleur, v.figuur);
      const k = Math.min(3, v.aantal);
      return {
        knoop: tegelstapel(cx, cy, v.kleur, v.figuur, v.aantal),
        rand: r(cx - 15, cy - 9 - (k - 1) * 2.6, 30, 24 + (k - 1) * 2.6),
        vak: r(cx - 18, cy - 16, 36, 32),
      };
    }
    default: return null;
  }
}

/** Vaste plek per tegeltype: losse stapeltjes verspreid over de vloer rond het kleed (besluit 223). */
const TEGEL_PLEK = [[176, 424], [218, 436], [262, 420], [306, 440], [334, 482], [196, 478], [244, 498], [292, 506], [158, 506]];
function tegelPlek(kleur, figuur) {
  return TEGEL_PLEK[['groen', 'geel', 'blauw'].indexOf(kleur) * 3 + ['vlinder', 'boom', 'vogel'].indexOf(figuur)];
}

/** Tekenvolgorde van achter naar voor (ook de Tab-volgorde van de tikvlakken). */
const VOLGORDE = ['slinger', 'foto', 'lampion', 'gi', 'kniebeschermers', 'boeddha', 'huisje', 'camera', 'spray', 'werker',
  'ketting', 'steen-groen', 'steen-blauw', 'steen-rood', 'nachtlamp', 'stetho', 'meisje', 'lam', 'gansje', 'biggetje',
  'spaarvarken', 'schoenen', 'ballonnen', 'schaakbord', 'taart', 'loep', 'tegel'];

/** Vaste delen achter alles: muur, plint, vloer en raam. */
function muurEnVloer() {
  return [
    el('defs', {}, [el('pattern', { id: 'km-behang', width: 24, height: 24, patternUnits: 'userSpaceOnUse' }, [el('circle', { cx: 12, cy: 12, r: 2.5, fill: '#FFE08A' })])]),
    el('rect', { x: 0, y: 0, width: B, height: 196, fill: '#FFF1D6' }),
    el('rect', { x: 0, y: 0, width: B, height: 196, fill: 'url(#km-behang)' }),
    el('rect', { x: 0, y: 192, width: B, height: 8, fill: '#C98B5A' }),
    el('rect', { x: 0, y: 200, width: B, height: H - 200, fill: '#F6EBDD' }),
    el('g', { opacity: 0.35, stroke: '#C2743C', 'stroke-width': 2 }, Array.from({ length: 9 }, (_, i) => el('line', { x1: 0, y1: 236 + i * 36, x2: B, y2: 236 + i * 36 }))),
    use('raam', 147, 22, 64, 52),
  ];
}

/** Meubels, elk direct na het voorwerp `na` in VOLGORDE getekend, zodat voorwerpen ervoor of erachter vallen. */
const MEUBELS = [
  { na: 'lampion', knopen: () => [use('km-haak', 276, 58, 12, 14), use('km-haak', 314, 58, 12, 14)] },
  { na: 'kniebeschermers', knopen: () => [use('km-plank', 112, 124, 150, 18)] },
  { na: 'werker', knopen: () => [use('km-kaptafel', 8, 74, 96, 130)] },
  { na: 'steen-rood', knopen: () => [use('km-nachtkastje', 194, 196, 44, 52)] },
  { na: 'stetho', knopen: () => [groep(238, 164, { schaal: 1.6 }, [use('bed-onder', 0, 0, 64, 84), use('bed-deken', 0, 0, 64, 84, '#FF6FAE')])] },
  { na: 'schoenen', knopen: () => [use('kleedje', 96, 330, 150, 75), pino(146, 300, 'staan', { schaal: 1.25 })] },
  { na: 'ballonnen', knopen: () => [use('km-tafel', 14, 456, 128, 64)] },
];

/* ---------- scherm ---------- */

export function schermKamer({ root }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Testmodus ?kamer=vol (specs/kamer.md): een volle kamer zonder de echte staat te lezen of te schrijven.
  const testVol = datum.isTest() && leesParam('kamer') === 'vol';
  const s = testVol ? volleStaat() : staat.lees();
  const nu = datum.vandaag();
  const status = (n) => (testVol ? 'gespeeld' : datum.deurStatus(n, s, nu));
  const voorwerpen = zichtbareVoorwerpen(s, status);
  // Gezien (besluit 205): de ster op de kamerknop gaat uit. Niet in de testkamer: die is niet echt.
  if (!testVol) staat.markeerKamerGezien(voorwerpen.map((v) => v.id));

  const svg = el('svg', { viewBox: `0 0 ${B} ${H}`, class: 'km-scene', role: 'img', 'aria-label': "Pino's kamer" });
  const kaart = h('div', { class: 'km-scene-kaart' }, [svg]);
  const wolkIcoon = h('div', { class: 'km-wolk-icoon', 'aria-hidden': 'true' });
  const wolkNaam = h('div', { class: 'kop km-wolk-naam' });
  const wolkTekst = h('div', { class: 'km-wolk-tekst' });
  const wolk = h('div', { class: 'km-wolk', hidden: true }, [
    h('span', { class: 'km-wolk-stip km-wolk-stip-1', 'aria-hidden': 'true' }),
    h('span', { class: 'km-wolk-stip km-wolk-stip-2', 'aria-hidden': 'true' }),
    h('div', { class: 'kaart km-wolk-kaart' }, [wolkIcoon, h('div', { class: 'km-wolk-tekstblok' }, [wolkNaam, wolkTekst])]),
  ]);
  const live = h('div', { class: 'visueel-verborgen', 'aria-live': 'polite' });

  // De wolk staat in de scène bij het voorwerp (besluit 216), zodat hij op elke telefoon in beeld is.
  kaart.append(wolk);
  root.append(h('div', { class: 'scherm km' }, [
    kopbalk({ label: "PINO'S KAMER", titel: 'Mijn Kamer' }),
    kaart,
    live,
  ]));

  // Muur, vloer en meubels, met de voorwerpen ertussen in tekenvolgorde.
  for (const k of muurEnVloer()) svg.append(k);
  const getekend = voorwerpen.map((v) => ({ v, ...tekenVoorwerp(v) })).filter((t) => t.knoop);
  getekend.sort((a, b) => VOLGORDE.indexOf(a.v.soort) - VOLGORDE.indexOf(b.v.soort) || (a.vak.y - b.vak.y) || (a.vak.x - b.vak.x));
  const rang = (soort) => VOLGORDE.indexOf(soort);
  let meubel = 0;
  const meubelsTot = (r) => {
    while (meubel < MEUBELS.length && rang(MEUBELS[meubel].na) < r) { for (const k of MEUBELS[meubel].knopen()) svg.append(k); meubel++; }
  };
  for (const t of getekend) {
    meubelsTot(rang(t.v.soort));
    t.wrap = el('g', { class: 'km-voorwerp' }, [t.knoop]);
    svg.append(t.wrap);
  }
  meubelsTot(Infinity);

  // Tikvlakken: doorzichtige knoppen in procenten over de scène (zoals werkerVak in spellen/zoeken.js).
  let actief = null;
  const sluit = () => {
    if (!actief) return;
    actief.knop.setAttribute('aria-pressed', 'false');
    actief = null;
    wolk.hidden = true;
  };
  const toon = (t) => {
    if (actief === t) { sluit(); return; }
    if (actief) actief.knop.setAttribute('aria-pressed', 'false');
    actief = t;
    t.knop.setAttribute('aria-pressed', 'true');
    const { naam, tekst } = tekstVoor(t.v, teksten);
    const { x, y, w, h: hh } = t.rand;
    const zijde = Math.max(w, hh);
    wolkIcoon.replaceChildren(el('svg', { viewBox: `${x + w / 2 - zijde / 2} ${y + hh / 2 - zijde / 2} ${zijde} ${zijde}`, width: 56, height: 56, class: 'ic' }, [t.knoop.cloneNode(true)]));
    wolkNaam.textContent = naam;
    wolkTekst.textContent = tekst;
    wolk.hidden = false;
    plaatsWolk();
    if (!rustig) wolk.animate([{ opacity: 0, transform: 'scale(0.92)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 160, easing: 'ease-out' });
    live.textContent = `${naam}. ${tekst}`;
    if (!rustig) t.wrap.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }, { transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
  };

  /**
   * Zet de wolk boven het voorwerp, of eronder als er boven te weinig ruimte is (bv. de slinger en de foto's),
   * horizontaal gecentreerd op het voorwerp en altijd binnen de scène. De stipjes wijzen naar het voorwerp.
   */
  const RAND = 8;      // px vrij aan de rand van de scène
  const AFSTAND = 30;  // px tussen wolk en voorwerp (ruimte voor de stipjes)
  function plaatsWolk() {
    if (!actief) return;
    const W = kaart.clientWidth;
    const Hk = kaart.clientHeight;
    const k = W / B;
    const { x, y, w, h: hh } = actief.rand;
    const breedte = Math.min(W - 2 * RAND, 320);
    wolk.style.width = `${breedte}px`;
    const hoogte = wolk.offsetHeight;
    const midden = (x + w / 2) * k;
    const links = Math.min(Math.max(midden - breedte / 2, RAND), W - breedte - RAND);
    const boven = y * k - AFSTAND - hoogte >= RAND;
    const top = boven ? y * k - AFSTAND - hoogte : Math.min((y + hh) * k + AFSTAND, Hk - hoogte - RAND);
    wolk.style.left = `${links}px`;
    wolk.style.top = `${top}px`;
    wolk.classList.toggle('km-wolk-onder', !boven);
    wolk.style.setProperty('--stip-x', `${Math.min(Math.max(midden - links, 22), breedte - 22)}px`);
    wolk.style.transformOrigin = `${midden - links}px ${boven ? '100%' : '0%'}`;
  }
  const opMaat = () => plaatsWolk();
  window.addEventListener('resize', opMaat);

  haalTeksten().then(() => {
    for (const t of getekend) {
      const label = t.v.aantal >= 2 && t.v.soort !== 'spaarvarken' && t.v.soort !== 'schaakbord' && t.v.soort !== 'werker'
        ? `${tekstVoor(t.v, teksten).naam}, ${t.v.aantal}` : tekstVoor(t.v, teksten).naam;
      t.knop = h('button', {
        type: 'button', class: 'km-vak', 'aria-label': label, 'aria-pressed': 'false',
        style: { left: pct(t.vak.x, B), top: pct(t.vak.y, H), width: pct(t.vak.w, B), height: pct(t.vak.h, H) },
        onclick: (e) => { e.stopPropagation(); toon(t); },
      });
      kaart.append(t.knop);
    }
  });

  // Buiten tikken (op muur of vloer) of Escape sluit de wolk.
  kaart.addEventListener('click', sluit);
  const opToets = (e) => { if (e.key === 'Escape') sluit(); };
  document.addEventListener('keydown', opToets);
  return () => { document.removeEventListener('keydown', opToets); window.removeEventListener('resize', opMaat); };
}

function leesParam(naam) {
  try { return new URLSearchParams(location.search).get(naam); } catch { return null; }
}
