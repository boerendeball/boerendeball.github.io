// Spel 2 · Waar is die groene vogel nou!? — zie specs/spel2.md (herontwerp, besluit 166).
// Kalm spel (SVG-DOM): een jungletocht over minispeelveldjes. Pino begint in een kano, legt tegels rond het
// midden van een veld en daarna een brug in de jungle, waarna er een nieuw veld groeit. Het zevende veld ligt
// aan een weg; een tegel naast de weg laat een taxi komen. Tegels passen als ze precies één eigenschap delen;
// het menu toont alleen passende tegels. Een volle ring laat het midden glinsteren: daar ligt een edelsteen.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { toonTaartmenu } from '../ui/taartmenu.js';
import { icoon } from '../ui/iconen.js';
import { ga } from '../router.js';
import { gemSvg, GEMS, GEM_BIJV, GEM_KLEUR } from '../ui/edelstenen.js';
import { el, use, groep, scene } from '../sprites.js';
import * as hex from './hex.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { werkerGevonden, terugKnop, werkerVak } from './zoeken.js';
import * as sap from '../ui/sap.js';

/* ---------- tuning ---------- */
const CAMERA_BREEDTE = 310;   // wereldeenheden in beeld (≈ 5,6 hexbreedtes: één veld met jungle eromheen)
const CAMERA_DUUR = 700;      // ms camera naar een nieuw veld
const HUP_DUUR = 300;         // ms per hex dat Pino hupt
const GROEI_STAP = 60;        // ms tussen de vakken van een groeiend veld
const MENU_STRAAL = 104;      // px middelpunt → tegeloptie (artboard Spel2-Menu)
const MENU_STRAAL_GROOT = 116; // px bij meer dan 4 opties (kleinere tegels, besluit 172)
const GEM_STRAAL = 96;        // px middelpunt → edelsteenoptie (artboard Spel2-Edelsteen)
const TAXI_SCHAAL = 1.5;      // s10-auto (72×40) op wereldschaal
const EIND_PAUZE = 400;       // ms stilstand voor het resultaatscherm
const WEG_BOVEN = -14;        // bovenrand van de weg t.o.v. het midden van de wegrij (wereldeenheden)
const WEG_ONDER = 16;         // onderrand; de tegels in de rijen ernaast beginnen bij +19 en eindigen bij −16
const TAXI_WIELEN = 8;        // de wielen van de taxi staan op wegY + 8 (midden van het asfalt)

/* ---------- kleuren en vormen ---------- */
const KLEUR = { groen: '#39D353', geel: '#FFC93C', blauw: '#5BC0EB' };
const GRIJS = '#B8C3CC';      // tegel die op is (vaste kleur, geen filter)
const TAXI_GEEL = '#FFC93C';
const TOP = '28,6 50,18 50,42 28,54 6,42 6,18';   // binnenste bovenvlak van een hex (56×66)
const FONKEL = 'l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z';
const MIDDEN_OBJECT = {
  tempel: ['s8-tempel', 44, 56],
  boeddha: ['s2-boeddha', 44, 56],
  waterval: ['s2-waterval', 48, 56],
};
const MIDDEN_LABEL = { kano: 'Kano', tempel: 'Tempel', boeddha: 'Beeld', waterval: 'Waterval' };
// Plantmaten op wereldschaal: [breedte, hoogte]; hoge planten alleen ver van de velden.
const PLANT_MAAT = { 's8-boom': [53, 67], 's8-bamboe': [50, 64], banaan: [64, 57], 's4-palm': [60, 98], 's8-varen': [44, 37] };
const HOOG = new Set(['s8-boom', 's8-bamboe', 's4-palm', 'banaan']);
const WERKER_SCHAAL = 0.6;

/* ---------- tekenhulpjes (JS-port van spel2_sprites.py) ---------- */

function hexRect(cx, cy, s = 56) {
  return { x: cx - s / 2, y: cy - (s * 58) / 112 - 4, w: s, h: (s * 66) / 56 };
}

function hexSym(id, cx, cy, s = 56) {
  const r = hexRect(cx, cy, s);
  return use(id, r.x, r.y, r.w, r.h);
}

/** Tegel met motief; kleur kan een vaste kleur zijn (grijs als de tegel op is). */
function hexTegel(cx, cy, type, s = 56, kleur = null) {
  const [k, f] = hex.splits(type);
  const { x, y, w, h: hh } = hexRect(cx, cy, s);
  const g = el('g');
  g.append(use('hx-tegel', x, y, w, hh, kleur || KLEUR[k]));
  const n = s / 56;
  if (f === 'vlinder') {
    const m = 15 * n;
    for (const [mx, my] of [[28, 13], [16, 33], [40, 33]]) g.append(use('m-vlinder', x + mx * n - m / 2, y + my * n - m / 2 + 4 * n, m, m));
  } else {
    const m = 30 * n;
    g.append(use(`m-${f}`, cx - m / 2, y + 14 * n, m, m));
  }
  return g;
}

// De drie kuiltjes in hx-midden en hx-kano (besluit 194), t.o.v. het midden van het veld.
const KUILEN = [[-12, 10], [0, 16], [12, 10]];
const STEEN = 14;   // breedte van een edelsteen in een kuiltje

/** De gekozen edelstenen in de kuiltjes; nieuw = de laatste valt er net in. */
function stenenTekening(cx, cy, stenen = [], nieuw = false) {
  return el('g', {}, stenen.slice(0, KUILEN.length).map((kleur, i) => {
    const [dx, dy] = KUILEN[i];
    const steen = use('gem', cx + dx - STEEN / 2, cy + dy - STEEN + 3, STEEN, STEEN, GEM_KLEUR[kleur]);
    return nieuw && i === stenen.length - 1 ? el('g', { class: 'tuin-steen-in' }, [steen]) : steen;
  }));
}

/** Het midden van een veld: stenen platform met tempel, beeld of waterval, of water met de kano; met de gekozen stenen. */
function middenTekening(soort, cx, cy, stenen = [], nieuw = false) {
  const g = el('g');
  if (soort === 'kano') g.append(hexSym('hx-kano', cx, cy));
  else {
    g.append(hexSym('hx-midden', cx, cy));
    const [id, b, hg] = MIDDEN_OBJECT[soort];
    g.append(use(id, cx - b / 2, cy + 8 - hg, b, hg));
  }
  g.append(stenenTekening(cx, cy, stenen, nieuw));
  return g;
}

function plantTekening(v, p, { laag = false } = {}) {
  const plant = hex.junglePlant(v);
  const id = laag && HOOG.has(plant.id) ? 's8-varen' : plant.id;
  const [b, hg] = PLANT_MAAT[id];
  const x = p.x - b / 2 + plant.dx;
  const y = p.y + 16 - hg + plant.dy;
  const g = el('g', { class: 'tuin-plant' });
  // De plant wiegt zacht om zijn voet (beeldfeedback, besluit 210); de bloem ervoor staat stil.
  const wieg = el('g', { class: 'sap-wieg', style: wiegStijl(v) },
    [plant.flip ? el('g', { transform: `translate(${x + b} ${y}) scale(-1 1)` }, [use(id, 0, 0, b, hg)]) : use(id, x, y, b, hg)]);
  g.append(wieg);
  if (plant.bloem) g.append(use('s8-bloem', p.x + (plant.dx > 0 ? -18 : 10), p.y + 2, 12, 15));
  return g;
}

/**
 * Wiegen per plant: eigen hoek en tempo uit het vaknummer. render() bouwt de planten steeds opnieuw; de negatieve
 * vertraging rekent vanaf de klok van de pagina, zodat een nieuwe plant op dezelfde plek in de zwaai verdergaat.
 */
function wiegStijl(v) {
  const n = Math.abs(Number(String(v).split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)));
  const duur = 3 + (n % 7) * 0.2;
  const hoek = 1.6 + (n % 5) * 0.3;
  const fase = (performance.now() / 1000 + (n % 13) * 0.37) % (2 * duur);
  return `--wieg-duur:${duur.toFixed(2)}s;--wieg-hoek:${hoek.toFixed(1)}deg;--vertraging:-${fase.toFixed(2)}s`;
}

function sterPad(x, y, schaal = 1) {
  return el('path', { d: `M${x} ${y - 9 * schaal} ${FONKEL}`, fill: '#FFC93C', transform: schaal === 1 ? null : `translate(${x * (1 - schaal)} ${y * (1 - schaal)}) scale(${schaal})` });
}

/* ---------- de wereld tekenen (gedeeld door het spel en de polaroid van spel 7) ---------- */

/**
 * Bouwt alle tekenbare items voor een rechthoek in wereldcoördinaten, gesorteerd op onderkant-y.
 * opts: { open: Set, brug: Set, glinster: Set(veldindex), nieuw: vak, groei: Map(vak → volgorde), weg: Set(vakken die verdwijnen) }
 */
function wereldItems(t, rect, opts = {}) {
  const items = [];
  const veldVakken = hex.veldVakken(t);
  const graspl = opts.gras || new Set();
  for (const v of hex.vakkenIn(rect)) {
    const p = hex.pixel(v);
    const basis = p.y + 33;
    if (hex.isWeg(t, v)) continue;                         // de weg ligt in de grondlaag
    const vi = veldVakken.has(v) ? hex.veldVan(t, v) : -1;
    if (vi >= 0) {
      const veld = t.velden[vi];
      const groei = opts.groei && opts.groei.has(v) ? opts.groei.get(v) : null;
      const klasse = ['tuin-vak', groei !== null ? 'groeit' : '', v === opts.nieuw ? 'valt-in' : ''].filter(Boolean).join(' ');
      const g = el('g', { class: klasse, style: groei !== null ? `animation-delay:${groei * GROEI_STAP}ms` : null, 'data-vak': v });
      if (v === veld.c) {
        g.append(middenTekening(veld.soort, p.x, p.y, veld.geoogst ? [] : veld.stenen));
        if (opts.glinster && opts.glinster.has(vi)) {
          for (const [dx, dy, s, d] of [[-20, -30, 0.8, 0], [18, -40, 1, 0.5], [22, -12, 0.7, 0.9], [-16, -6, 0.6, 0.3]]) {
            const ster = sterPad(p.x + dx, p.y + dy, s);
            ster.setAttribute('class', 'tuin-glinster');
            ster.setAttribute('style', `animation-delay:${d}s`);
            g.append(ster);
          }
        }
      } else if (t.gelegd[v]) {
        g.append(hexTegel(p.x, p.y, t.gelegd[v]));
      } else {
        g.append(hexSym('hx-gras', p.x, p.y));
      }
      if (opts.open && opts.open.has(v)) g.append(oplichting(p));
      items.push({ y: basis, el: g });
    } else if (t.gelegd[v]) {
      // een tegel buiten een veld komt niet voor (een brug wordt meteen deel van het nieuwe veld)
      items.push({ y: basis, el: hexTegel(p.x, p.y, t.gelegd[v]) });
    } else if (graspl.has(v) || v === t.werker) {
      // open plek in de jungle: een plukje gras zonder tegelrand, zodat het veld zelf herkenbaar blijft
      const g = el('g', { class: 'tuin-vak', 'data-vak': v }, [
        el('ellipse', { cx: p.x, cy: p.y + 2, rx: 25, ry: 17, fill: '#5FB05A' }),
        el('ellipse', { cx: p.x - 2, cy: p.y, rx: 20, ry: 12, fill: '#8BD35A' }),
        use('s8-gras', p.x - 18 + hex.hash(v, 13) * 8, p.y - 8, 14, 9),
        use('s8-gras', p.x + 4 + hex.hash(v, 14) * 8, p.y + 4, 12, 8),
      ]);
      if (opts.open && opts.open.has(v)) g.append(oplichting(p));
      if (v === t.werker && opts.werker !== false) {
        const w = werkerVak(p.x, p.y + 4, WERKER_SCHAAL);
        g.append(el('g', { class: 'tuin-werker' }, [use('wk-hark', w.x, w.y, w.b, w.h)]));
      }
      items.push({ y: basis, el: g });
    } else {
      // jungle: dichtbij een veld alleen lage planten, zodat de vakken zichtbaar blijven
      const dichtbij = t.velden.some((veld) => hex.afstand(veld.c, v) <= 2) || (t.weg && Math.abs(hex.ontleed(v)[1] - t.weg.rij) <= 1);
      const plant = plantTekening(v, p, { laag: dichtbij });
      if (opts.verdwijnt && opts.verdwijnt.has(v)) plant.classList.add('verdwijnt');
      items.push({ y: p.y + 16, el: plant });
    }
  }
  // planten die verdwijnen omdat er een veld groeit, worden er nog even overheen getekend
  if (opts.verdwijnt) {
    for (const v of opts.verdwijnt) {
      const p = hex.pixel(v);
      const plant = plantTekening(v, p, { laag: true });
      plant.classList.add('verdwijnt');
      items.push({ y: p.y + 34, el: plant });
    }
  }
  return items.sort((a, b) => a.y - b.y);
}

function oplichting(p) {
  const r = hexRect(p.x, p.y);
  // De hover/focus-markering zit ook hier (klasse .tuin-hover op het vak), in de scène en dus onder Pino; de
  // knoppen zelf liggen boven de hele scène en mogen niets tekenen, anders komt de markering over Pino (#176).
  return el('polygon', { class: 'tuin-open', points: TOP, transform: `translate(${r.x} ${r.y})`, fill: 'rgba(255,255,255,0.22)', stroke: 'rgba(255,255,255,0.9)', 'stroke-width': 1.5, 'stroke-dasharray': '4 3', 'stroke-linejoin': 'round' });
}

/** Grondlaag: junglebodem met donkere vlekken, en de weg als die er is. */
function grondLaag(t, rect) {
  const g = el('g', { 'aria-hidden': 'true' });
  g.append(el('rect', { x: rect.x - 200, y: rect.y - 200, width: rect.b + 400, height: rect.h + 400, fill: '#4E9A3E' }));
  for (const v of hex.vakkenIn(rect)) {
    if (hex.hash(v, 7) > 0.45) continue;
    const p = hex.pixel(v);
    g.append(el('ellipse', { cx: p.x + (hex.hash(v, 8) - 0.5) * 40, cy: p.y + (hex.hash(v, 9) - 0.5) * 30, rx: 18 + hex.hash(v, 10) * 16, ry: 8 + hex.hash(v, 11) * 6, fill: hex.hash(v, 12) < 0.5 ? '#2E7D1E' : '#5FB05A' }));
  }
  if (t.weg) {
    const y = hex.DY * t.weg.rij;
    const x0 = rect.x - 400;
    const b = rect.b + 800;
    // De weg blijft binnen WEG_BOVEN..WEG_ONDER rond het midden van de rij: de tegels in de rijen erboven en
    // eronder (bovenvlak vanaf +19, voorkant tot −16) raken hem zo nooit (besluit 176).
    g.append(el('rect', { x: x0, y: y + WEG_BOVEN, width: b, height: 4, fill: '#CFD8DC' }));
    g.append(el('rect', { x: x0, y: y + WEG_BOVEN + 4, width: b, height: WEG_ONDER - WEG_BOVEN - 8, fill: '#4F6B7E' }));
    g.append(el('rect', { x: x0, y: y + WEG_ONDER - 4, width: b, height: 4, fill: '#DDE7EE' }));
    g.append(el('line', { x1: x0, y1: y + 1, x2: x0 + b, y2: y + 1, stroke: '#FFC93C', 'stroke-width': 2.5, 'stroke-dasharray': '14 10' }));
  }
  return g;
}

const pinoTekening = (p, { pose = 'staan', flip = false, kano = false } = {}) =>
  el('g', { transform: `translate(${(p.x - 24).toFixed(1)} ${(p.y - (kano ? 60 : 66)).toFixed(1)})` }, [groep(0, 0, { flip }, [use(`pino-${pose}`, 0, 0, 48, 72)])]);

/**
 * De tuin zoals hij nu in de staat staat, stil en zonder knoppen, open plekken, glinster of werker, met Pino op
 * haar plek. Voor de polaroid in het album van spel 7 (besluit 107): rond het startveld met de kano.
 */
export function tuinScene() {
  const t = staat.lees().tuin && Array.isArray(staat.lees().tuin.velden) ? staat.lees().tuin : hex.nieuweTuin();
  const rect = { x: -180, y: -190, b: 360, h: 360 };
  const svg = el('svg', { viewBox: `${rect.x} ${rect.y} ${rect.b} ${rect.h}`, 'aria-hidden': 'true' });
  const wereld = el('g');
  const pp = hex.pixel(t.pino);
  let gezet = false;
  for (const it of wereldItems(t, rect, { gras: new Set(), werker: false })) {
    if (!gezet && it.y > pp.y + 33.5) { wereld.append(pinoTekening(pp, { kano: t.pino === t.velden[0].c })); gezet = true; }
    wereld.append(it.el);
  }
  if (!gezet) wereld.append(pinoTekening(pp));
  svg.append(grondLaag(t, rect), wereld);
  return svg;
}

/* ---------- spel ---------- */

export function start({ root, dag, info, klaar, zoek = false }) {
  let opruim = null;
  const ronde = () => { if (opruim) opruim(); opruim = speel({ root, dag, info, klaar, zoek, opnieuw: ronde }); };
  ronde();
  return () => { if (opruim) opruim(); opruim = null; };
}

function speel({ root, dag, info, klaar, opnieuw, zoek = false }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gestopt = false;
  let bezig = false;          // animatie loopt: geen invoer
  let klaarGezet = false;
  let menu = null;
  const rafs = new Set();
  const timers = new Set();
  const wacht = (ms) => new Promise((ok) => { const t = setTimeout(() => { timers.delete(t); ok(); }, ms); timers.add(t); });
  const frame = (fn) => { const id = requestAnimationFrame((nu) => { rafs.delete(id); fn(nu); }); rafs.add(id); };
  // Animatie via rAF. Een browser kan rAF stilleggen (tab op de achtergrond, verborgen paneel); daarom maakt een
  // timer de animatie alsnog af als de frames uitblijven, zodat het spel nooit halverwege blijft hangen.
  const anim = (duur, stap) => new Promise((ok) => {
    if (rustig || duur <= 0) { stap(1); ok(); return; }
    const t0 = performance.now();
    let af = false;
    const klaarMet = () => { if (af) return; af = true; clearTimeout(vangnet); timers.delete(vangnet); if (!gestopt) stap(1); ok(); };
    const vangnet = setTimeout(klaarMet, duur + 400);
    timers.add(vangnet);
    const tik = (nu) => {
      if (af) return;
      if (gestopt) { klaarMet(); return; }
      const f = Math.min(1, (nu - t0) / duur);
      stap(f);
      if (f < 1) frame(tik); else klaarMet();
    };
    frame(tik);
  });
  const glad = (f) => (f < 0.5 ? 2 * f * f : 1 - ((-2 * f + 2) ** 2) / 2);

  staat.beginTuin(hex.nieuweTuin());
  const tuin = () => staat.lees().tuin;

  /* ---------- DOM ---------- */
  // Geen edelsteenteller in spel 2: hoeveel edelstenen Pino heeft, ziet ze pas in spel 3 (besluit 35).
  const svg = scene(10, 10, { label: 'Jungle met een minispeelveld van zeshoekige tegelplekken rond een midden; Pino staat op het veld' });
  svg.removeAttribute('width'); svg.removeAttribute('height');
  svg.classList.add('tuin-scene');
  const grond = el('g');
  const wereld = el('g');
  const effecten = el('g', { 'aria-hidden': 'true' });
  svg.append(grond, wereld, effecten);
  const knoppen = h('div', { class: 'tuin-knoppen' });
  const kaart = h('div', { class: 'scene-kaart tuin-kaart' }, [svg, knoppen]);

  const scherm = h('div', { class: 'scherm spel spel2' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', ...terugKnop(zoek) }),
    // De ruimte onder de kopbalk bepaalt de maat; de camera past de viewBox aan die maat aan (besluit 173).
    h('div', { class: 'tuin-ruimte' }, [kaart]),
  ]);
  root.replaceChildren(scherm);

  /* ---------- camera ---------- */
  const cam = { x: 0, y: 0 };   // wereldpunt in het midden van het beeld
  const maat = { b: 1, h: 1 };  // px van de kaart
  const camRect = (c = cam) => {
    const b = CAMERA_BREEDTE;
    const hg = b * (maat.h / maat.b);
    return { x: c.x - b / 2, y: c.y - hg / 2, b, h: hg };
  };
  function zetViewBox() {
    const r = camRect();
    svg.setAttribute('viewBox', `${r.x.toFixed(2)} ${r.y.toFixed(2)} ${r.b.toFixed(2)} ${r.h.toFixed(2)}`);
  }
  const camDoel = () => {
    const p = hex.pixel(hex.huidigVeld(tuin()).c);
    return { x: p.x, y: p.y + 6 };
  };
  /** Wereld → px binnen de kaart. */
  function naarPx(wx, wy) {
    const r = camRect();
    return { x: ((wx - r.x) / r.b) * maat.b, y: ((wy - r.y) / r.h) * maat.h };
  }

  /* ---------- Pino ---------- */
  const pinoG = el('g', { class: 'tuin-pino' });
  const pino = { ...hex.pixel(tuin().pino), pose: 'staan', flip: false, kano: tuin().pino === tuin().velden[0].c, zichtbaar: true };
  function tekenPino() {
    pinoG.replaceChildren(pino.zichtbaar ? pinoTekening(pino, pino) : el('g'));
  }
  // Pino komt direct na het vak waar ze op staat (en vóór de rij eronder).
  function plaatsPino(basis) {
    const na = [...wereld.children].find((c) => c !== pinoG && Number(c.dataset.y) > basis);
    wereld.insertBefore(pinoG, na || null);
  }

  /* ---------- tekenen ---------- */
  let laatsteRect = null;
  function render({ nieuw = null, groei = null, verdwijnt = null, rect = null } = {}) {
    if (meet()) zetViewBox();   // maat altijd vers: knoppen en viewBox horen bij dezelfde kaartmaat
    const t = tuin();
    const vrij = !klaarGezet && !bezig;
    const open = new Set(vrij ? [...hex.openRingplekken(t), ...hex.brugplekken(t)] : []);
    const glinster = new Set(!klaarGezet && hex.glinstert(t) ? [t.huidig] : []);
    const gras = new Set(hex.grasplekken(t));
    laatsteRect = rect || camRect();
    const ruim = { x: laatsteRect.x - 60, y: laatsteRect.y - 80, b: laatsteRect.b + 120, h: laatsteRect.h + 160 };
    grond.replaceChildren(grondLaag(t, ruim));
    wereld.replaceChildren();
    for (const it of wereldItems(t, ruim, { open, glinster, gras, nieuw, groei, verdwijnt })) {
      it.el.dataset.y = String(it.y);
      wereld.append(it.el);
    }
    tekenPino();
    plaatsPino(pino.y + 33.5);
    maakKnoppen(t, open, glinster);
  }

  /* ---------- klikdoelen: echte knoppen over de scène ---------- */
  function hexKnop(v, klasse, label, actie) {
    const p = hex.pixel(v);
    const a = naarPx(p.x - 28, p.y - 31);
    const b = naarPx(p.x + 28, p.y + 25);
    const markeer = (aan) => () => wereld.querySelector(`[data-vak="${v}"]`)?.classList.toggle('tuin-hover', aan);
    return h('button', {
      type: 'button', class: `tuin-knop ${klasse}`, 'aria-label': label, 'data-vak': v,
      style: { left: `${a.x}px`, top: `${a.y}px`, width: `${b.x - a.x}px`, height: `${b.y - a.y}px` },
      onclick: (ev) => actie(v, ev.currentTarget),
      onpointerenter: (ev) => { if (ev.pointerType === 'mouse') markeer(true)(); },
      onpointerleave: markeer(false),
      onfocus: (ev) => { if (ev.currentTarget.matches(':focus-visible')) markeer(true)(); },
      onblur: markeer(false),
    });
  }

  function maakKnoppen(t, open, glinster) {
    knoppen.replaceChildren();
    if (klaarGezet || bezig) return;
    const veld = hex.huidigVeld(t);
    if (glinster.has(t.huidig)) knoppen.append(hexKnop(veld.c, 'tuin-knop-midden', MIDDEN_LABEL[veld.soort], kiesEdelsteen));
    for (const v of open) knoppen.append(hexKnop(v, 'tuin-knop-vak', hex.veldVan(t, v) >= 0 ? 'Vak' : 'Open plek', kiesTegel));
    // De verstopte werker is pas aanklikbaar als spel 7 open is (specs/spel7.md).
    if (t.werker && datum.deurOpen(7)) {
      const p = hex.pixel(t.werker);
      const a = naarPx(p.x - 18, p.y - 44);
      const b = naarPx(p.x + 18, p.y + 6);
      knoppen.append(h('button', {
        type: 'button', class: 'tuin-knop tuin-knop-werker', 'aria-label': 'Werker',
        style: { left: `${a.x}px`, top: `${a.y}px`, width: `${b.x - a.x}px`, height: `${b.y - a.y}px` },
        onclick: vindWerker,
      }));
    }
  }

  // Het menumidden ligt precies op het vak in de scène (besluit 193): het menu centreert op de knop, en het midden
  // van de knop is het midden van het bovenvlak (TOP, y 30 in een 56×66-hex). Daarom ligt y 30 in het midden van de
  // viewBox (−11 + 82/2); de rand en wat erboven uitsteekt (tempel, waterval) vallen er met overflow buiten.
  function middenHex(inhoud, klasse) {
    const schaal = maat.b / CAMERA_BREEDTE;
    const s = el('svg', { viewBox: '0 -11 56 82', width: 56 * schaal, height: 82 * schaal, 'aria-hidden': 'true', overflow: 'visible' }, inhoud);
    return { element: s, klasse: `taart-midden-hex ${klasse}` };
  }

  /* ---------- tegel kiezen (ringplek of brug) ---------- */
  function kiesTegel(v, knop) {
    if (menu || klaarGezet || bezig) return;
    const s = staat.lees();
    const typen = hex.kandidaten(tuin().gelegd, v);
    // Heeft Pino van geen enkele passende tegel er nog één, dan komt er een kroonknop bij die naar spel 1 gaat,
    // waar de tegels vandaan komen (besluit 200). Alleen het kroon-icoon, geen uitleg.
    const op = typen.length > 0 && typen.every((type) => !(s.tegels[type] > 0));
    const n = typen.length + (op ? 1 : 0);
    // Naast een lege plek (de eerste tegel op het startveld) passen alle 9 types: dan kleinere tegels op een
    // grotere ring, zodat de opties niet over elkaar vallen.
    const klein = n > 4;
    const [tb, th] = klein ? [52, 62] : [68, 80];
    const opties = typen.map((type) => {
      const aantal = s.tegels[type] || 0;
      const [k, f] = hex.splits(type);
      return {
        klasse: klein ? 'taart-hex taart-hex-klein' : 'taart-hex',
        label: `Tegel ${k} ${f}, ${aantal}`,
        uitgeschakeld: aantal <= 0,
        inhoud: h('span', { class: 'taart-hex-inhoud' }, [
          el('svg', { viewBox: '0 0 68 80', width: tb, height: th, 'aria-hidden': 'true' }, [hexTegel(34, 38, type, 62, aantal > 0 ? null : GRIJS)]),
          h('span', { class: 'aantal', 'aria-hidden': 'true' }, String(aantal)),
        ]),
        actie: () => (hex.veldVan(tuin(), v) >= 0 ? legTegel(v, type) : legBrug(v, type)),
      };
    });
    if (op) {
      // in het midden van de rij, dus (ongeveer) bovenaan de ring
      opties.splice(Math.floor(opties.length / 2), 0, {
        klasse: 'taart-rond s2-kroon', label: 'Naar deurtje 1', inhoud: icoon('kroon', 40), actie: () => ga('/deur/1'),
      });
    }
    opties.forEach((o, i) => { o.hoek = 90 + ((i + 1) * 360) / (n + 1); });
    opties.push({ hoek: 90, klasse: 'taart-annuleer', label: 'Annuleren', inhoud: el('svg', { viewBox: '0 0 48 48', width: 20, height: 20, 'aria-hidden': 'true' }, [el('path', { d: 'M12 12 L36 36 M36 12 L12 36', stroke: '#4F6B7E', 'stroke-width': 6, 'stroke-linecap': 'round' })]) });
    menu = toonTaartmenu({
      anker: knop.getBoundingClientRect(), kloon: false, straal: klein ? MENU_STRAAL_GROOT : MENU_STRAAL, label: 'Kies een tegel', dim: 'rgba(30, 58, 76, 0.42)',
      midden: middenHex([use('hx-doel', 0, 0, 56, 66)], 'taart-midden-doel'),
      opties, bijSluiten: () => { menu = null; },
    });
  }

  /** Een tegel op een ringplek: Pino hupt erheen, en pas daarna kan de speler verder (besluit 177). */
  async function legTegel(v, type) {
    if (klaarGezet || gestopt || bezig) return;
    if (!staat.legTuinTegel(v, type)) return;
    if (hex.isWegplek(tuin(), v)) { einde(v); return; }
    const wasVol = hex.glinstert(tuin());
    bezig = true;
    render({ nieuw: v });   // zonder knoppen zolang Pino onderweg is
    // De tegel valt neer met een stofwolkje en veert even na (beeldfeedback, besluit 210).
    const pv = hex.pixel(v);
    na(180, () => {
      sap.deeltjes(effecten, pv.x, pv.y + 14, { soort: 'stof', aantal: 4, afstand: 18 });
      sap.wip(wereld.querySelector(`[data-vak="${v}"]`), { sterkte: 0.5 });
    });
    await hup(pv);
    bezig = false;
    if (gestopt) return;
    render();
    // Ring net vol: een extra sterrenregen en het midden veert op. De glinster zelf is er al; dit verklapt niets.
    if (!wasVol && hex.glinstert(tuin())) {
      const c = hex.huidigVeld(tuin()).c;
      const pc = hex.pixel(c);
      sterretjes(pc.x, pc.y - 20, 14, 46);
      sap.wip(wereld.querySelector(`[data-vak="${c}"]`), { sterkte: 0.8 });
    }
  }

  /** Iets na een korte pauze, zonder het spel op te houden (timer wordt opgeruimd bij het verlaten). */
  function na(ms, fn) {
    const tm = setTimeout(() => { timers.delete(tm); if (!gestopt) fn(); }, ms);
    timers.add(tm);
  }

  /* ---------- brug: een nieuw veld groeit in de jungle ---------- */
  async function legBrug(v, type) {
    if (klaarGezet || gestopt) return;
    const oud = tuin();
    const nieuw = hex.metBrug(oud, v, type);
    if (!nieuw || !staat.legTuinBrug(nieuw, type)) return;
    bezig = true;
    const c = hex.huidigVeld(nieuw).c;
    const vakken = hex.bloem(c);
    const groei = new Map(vakken.filter((x) => x !== v).map((x, i) => [x, i]));
    const verdwijnt = new Set(vakken.filter((x) => x !== v && !hex.grasplekken(oud).includes(x)));
    render({ nieuw: v, groei: rustig ? null : groei, verdwijnt: rustig ? null : verdwijnt, rect: verenigd(camRect(), camRect(camDoel())) });
    if (!rustig) {
      await wacht(GROEI_STAP * vakken.length + 250);
      const pc = hex.pixel(c);
      sterretjes(pc.x, pc.y - 10, 10, 34);
      await wacht(250);
    }
    await hup(hex.pixel(v), { kano: false });
    await camNaar(camDoel());
    bezig = false;
    render();
  }

  function verenigd(a, b) {
    const x = Math.min(a.x, b.x); const y = Math.min(a.y, b.y);
    return { x, y, b: Math.max(a.x + a.b, b.x + b.b) - x, h: Math.max(a.y + a.h, b.y + b.h) - y };
  }

  /**
   * Pino hupt in een rechte lijn naar een punt, met een boogje per hex. Standaard tijdens het huppen boven alles;
   * met { opDiepte: true } wordt ze elk frame op haar diepte gezet (bij de taxi, die op de weg staat).
   */
  async function hup(doel, { kano = false, opDiepte = false } = {}) {
    const van = { x: pino.x, y: pino.y };
    const afst = Math.hypot(doel.x - van.x, doel.y - van.y);
    const hops = Math.max(1, Math.round(afst / hex.DX));
    if (doel.x !== van.x) pino.flip = doel.x < van.x;
    pino.kano = false;
    if (!opDiepte) wereld.append(pinoG);
    let geland = 0;
    await anim(hops * HUP_DUUR, (f) => {
      const fh = (f * hops) % 1;
      // Bij elke landing een stofje onder haar voeten (beeldfeedback, besluit 210).
      const landing = Math.min(hops, Math.floor(f * hops + 1e-6));
      if (landing > geland) {
        geland = landing;
        const lx = van.x + ((doel.x - van.x) * landing) / hops;
        const ly = van.y + ((doel.y - van.y) * landing) / hops;
        if (!kano || landing < hops) sap.deeltjes(effecten, lx, ly + 6, { soort: 'stof', aantal: 2, afstand: 12 });
      }
      const grondY = van.y + (doel.y - van.y) * f;
      pino.x = van.x + (doel.x - van.x) * f;
      pino.y = grondY - Math.sin(fh * Math.PI) * 12;
      pino.pose = fh < 0.5 && f < 1 ? 'loop' : 'staan';
      tekenPino();
      if (opDiepte) plaatsPino(grondY + 33.5);
    });
    Object.assign(pino, { x: doel.x, y: doel.y, pose: 'staan', kano });
    tekenPino();
    plaatsPino(pino.y + 33.5);
  }

  async function camNaar(doel) {
    const van = { ...cam };
    knoppen.replaceChildren();
    await anim(CAMERA_DUUR, (f) => {
      const g = glad(f);
      cam.x = van.x + (doel.x - van.x) * g;
      cam.y = van.y + (doel.y - van.y) * g;
      zetViewBox();
    });
  }

  /** Sterretjes die vanuit een punt naar buiten vliegen en vervagen. */
  function sterretjes(x, y, n = 8, afst = 26) {
    if (rustig) return;
    for (let i = 0; i < n; i += 1) {
      const hoek = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const s = el('g', { class: 'tuin-ster-uit', style: `--dx:${(Math.cos(hoek) * afst).toFixed(1)}px;--dy:${(Math.sin(hoek) * afst * 0.8).toFixed(1)}px` }, [sterPad(x, y, 0.5 + Math.random() * 0.5)]);
      effecten.append(s);
      const tm = setTimeout(() => { timers.delete(tm); s.remove(); }, 800);
      timers.add(tm);
    }
  }

  // Na de derde steen vliegen de drie stenen samen uit de kuiltjes omhoog en vervagen (besluit 194).
  function stenenWeg(p, stenen = []) {
    if (rustig || !stenen.length) return;
    const g = el('g', { class: 'tuin-stenen-weg' }, [stenenTekening(p.x, p.y, stenen)]);
    effecten.append(g);
    const tm = setTimeout(() => { timers.delete(tm); g.remove(); }, 800);
    timers.add(tm);
  }

  /* ---------- edelsteen kiezen ---------- */
  // Een volle ring geeft STENEN_PER_RING edelstenen (besluit 192): het menu gaat na elke keuze opnieuw open tot ze
  // alle drie gekozen zijn. Sluit Pino het menu eerder, dan blijft het midden glinsteren voor de rest.
  async function kiesEdelsteen(v, knop, vervolg = false) {
    if (menu || klaarGezet || bezig) return;
    const t = tuin();
    const vi = t.huidig;
    const veld = t.velden[vi];
    const p = hex.pixel(veld.c);
    if (!vervolg) {
      sterretjes(p.x, p.y - 20, 12, 40);
      if (!rustig) { bezig = true; knoppen.replaceChildren(); await wacht(450); bezig = false; render(); }
    }
    if (gestopt) return;
    const middenKnop = knoppen.querySelector('.tuin-knop-midden');
    const anker = (middenKnop || knop).getBoundingClientRect();
    menu = toonTaartmenu({
      anker, kloon: false, straal: GEM_STRAAL, label: 'Kies een edelsteen', dim: 'rgba(30, 58, 76, 0.42)',
      midden: middenHex([middenTekening(veld.soort, 28, 33, veld.stenen, vervolg)], 'taart-midden-goud'),
      opties: GEMS.map((k, i) => ({
        hoek: [-150, -90, -30][i], klasse: 'taart-rond', label: `Kies ${GEM_BIJV[k]} edelsteen`,
        inhoud: gemSvg(k, 44),
        actie: async () => {
          const rest = staat.oogstEdelsteen(vi, k);
          if (rest < 0) return;
          sterretjes(p.x, p.y - 20, 8, 30);
          render();
          // Het midden veert op als de steen in zijn kuiltje valt (beeldfeedback, besluit 210).
          na(160, () => sap.wip(wereld.querySelector(`[data-vak="${veld.c}"]`), { sterkte: 0.5 }));
          if (rest === 0) { stenenWeg(p, tuin().velden[vi].stenen); return; }
          if (!rustig) { bezig = true; await wacht(300); bezig = false; }
          if (gestopt || klaarGezet || tuin().huidig !== vi) return;
          kiesEdelsteen(v, knoppen.querySelector('.tuin-knop-midden') || knop, true);
        },
      })),
      bijSluiten: () => { menu = null; },
    });
  }

  /* ---------- werker (spel 7) ---------- */
  function vindWerker() {
    werkerGevonden(2, { zoek });
    const w = svg.querySelector('.tuin-werker');
    if (w && !rustig) { w.classList.remove('hup'); void w.getBBox(); w.classList.add('hup'); }
  }

  /* ---------- einde: de taxi komt Pino ophalen ---------- */
  async function einde(v) {
    klaarGezet = true;
    bezig = true;
    const t = tuin();
    render({ nieuw: v });
    await wacht(rustig ? 0 : 250);
    await hup(hex.pixel(v));
    const wegY = hex.DY * t.weg.rij;
    const tb = 72 * TAXI_SCHAAL; const th = 40 * TAXI_SCHAAL;
    // Ligt de weg vóór het veld, dan stopt de taxi met zijn lage achterkant onder Pino, zodat het dak en het
    // dakbord niet over haar heen vallen; ligt de weg erachter, dan staat ze er toch vóór.
    const stopX = t.weg.kant > 0 ? pino.x - 16 : pino.x - tb / 2;
    const r = camRect();
    const taxi = el('g', { class: 'tuin-taxi' }, [
      use('s10-auto', 0, 0, tb, th, TAXI_GEEL),
      use('s2-taxibord', 32 * TAXI_SCHAAL, 0, 14 * TAXI_SCHAAL, 7 * TAXI_SCHAAL),
    ]);
    const zetTaxi = (x) => taxi.setAttribute('transform', `translate(${x.toFixed(1)} ${(wegY + TAXI_WIELEN - th * (38.5 / 40)).toFixed(1)})`);
    const vanX = r.x - tb - 20;
    zetTaxi(rustig ? stopX : vanX);
    // De taxi staat op de weg en wordt op diepte gesorteerd zoals een vak in de wegrij (besluit 176): ligt de weg
    // achter het veld, dan staat Pino ervóór; ligt hij ervoor, dan rijdt de taxi vóór haar langs.
    taxi.dataset.y = String(wegY + 33.4);
    wereld.insertBefore(taxi, [...wereld.children].find((c) => c !== pinoG && Number(c.dataset.y) > wegY + 33.4) || null);
    plaatsPino(pino.y + 33.5);
    await anim(1300, (f) => zetTaxi(vanX + (stopX - vanX) * (1 - (1 - f) ** 3)));
    await wacht(rustig ? 0 : 200);
    // Pino stapt in: hup naar het portier aan haar kant van de taxi (weg erachter: vóór de taxi; weg ervoor:
    // achter de taxi langs) en weg.
    const deurY = t.weg.kant < 0 ? wegY + 16 : wegY - 18;
    await hup({ x: pino.x, y: deurY }, { opDiepte: true });
    pino.zichtbaar = false;
    tekenPino();
    sterretjes(pino.x, deurY - 30, 6, 18);
    await wacht(rustig ? 0 : 350);
    const totX = r.x + r.b + 40;
    await anim(1100, (f) => zetTaxi(stopX + (totX - stopX) * f * f));
    await wacht(EIND_PAUZE);
    if (gestopt) return;
    const tegels = Object.keys(t.gelegd).length;
    const edelstenen = t.edelstenen || 0;
    const eersteKeer = klaar({ score: { tegels, edelstenen, velden: t.velden.length } });
    staat.wisTuin();
    toonResultaat({
      root,
      icoon: info.icoon,
      label: `${info.titel.toUpperCase()} · KLAAR`,
      titel: 'Van kano tot taxi!',
      zin: "Tempels, boeddha's en watervallen: Pino heeft de hele tuin van de koningin doorkruist.",
      tegels: [{ label: 'TEGELS', waarde: tegels, kleur: '#1F7A3A' }],
      beloning: { ...info.beloning, eersteKeer },
      opnieuw,
    });
  }

  /* ---------- maat en start ---------- */
  function meet() {
    const r = kaart.getBoundingClientRect();
    if (r.width < 10 || r.height < 10) return false;
    maat.b = r.width; maat.h = r.height;
    return true;
  }
  const opMaat = () => {
    if (gestopt || !meet()) return;
    zetViewBox();
    if (!bezig && !menu) render();
  };
  const ro = new ResizeObserver(opMaat);
  ro.observe(kaart);
  window.addEventListener('resize', opMaat);

  Object.assign(cam, camDoel());
  meet();
  zetViewBox();
  render();
  if (datum.isTest()) window.pinoDebug = { spel: 2, hex, tuin, render, cam };

  return () => {
    gestopt = true;
    ro.disconnect();
    window.removeEventListener('resize', opMaat);
    for (const id of rafs) cancelAnimationFrame(id);
    for (const t of timers) clearTimeout(t);
    if (menu) menu.sluit();
    if (window.pinoDebug && window.pinoDebug.spel === 2) delete window.pinoDebug;
  };
}
