// Spel 2 · Tuin van de koningin — zie specs/spel2.md.
// Kalm spel (SVG-DOM): leg met de tegels uit spel 1 een pad van Pino naar de tuinpoort.
// Tegels passen als ze precies één eigenschap delen; het menu toont alleen passende tegels.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { toonTaartmenu } from '../ui/taartmenu.js';
import { gemSvg, GEMS } from '../ui/edelstenen.js';
import { el, use, groep, scene } from '../sprites.js';
import * as hex from './hex.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { werkerGevonden, terugKnop, werkerVak } from './zoeken.js';

/* ---------- tuning ---------- */
const STAP_DUUR = 260;        // ms per vak als Pino aan het eind naar de poort loopt
const EIND_PAUZE = 450;       // ms stilstand bij de poort voor het resultaatscherm
const MENU_STRAAL = 104;      // px middelpunt → tegeloptie (artboard Spel2-Menu)
const GEM_STRAAL = 96;        // px middelpunt → edelsteenoptie (artboard Spel2-Edelsteen)

/* ---------- scène ---------- */
const B = 358;
const H = 744;
const KLEUR = { groen: '#39D353', geel: '#FFC93C', blauw: '#5BC0EB' };
const GRIJS = '#B8C3CC';      // tegel die op is (vaste kleur, geen filter)
const TOP = '28,6 50,18 50,42 28,54 6,42 6,18';   // binnenste bovenvlak van een hex (56×66)
const FONKEL = 'l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z';

// Decor: [symbool, x, y, b, h, { kleur, flip }]. Wordt samen met de vakken op onderkant-y gesorteerd.
const DECOR = [
  // bomen en lianen achter de bovenste rij
  ['s8-boom', 112, -6, 44, 56],
  ['s8-boom', 166, -12, 44, 56, { flip: true }],
  ['s8-boom', 222, -4, 44, 56],
  ['s8-liaan', 96, -14, 120, 40],
  ['s8-liaan', 178, -16, 120, 40, { flip: true }],
  // paviljoen van de koningin achter de poort
  ['s8-tempel', 276, -4, 54, 68],
  // lotusvijver met sala en kraanvogels (linksboven)
  ['vijver', -4, 40, 120, 100],
  ['m-kraan', 6, 102, 24, 32],
  ['m-kraan', 84, 108, 22, 30, { flip: true }],
  // bananenperk rechts
  ['banaan', 280, 262, 72, 64],
  ['s8-varen', 228, 316, 48, 40],
  ['banaan', 250, 322, 72, 64, { flip: true }],
  ['s8-bloem', 236, 360, 16, 20],
  ['s8-bloem', 262, 372, 16, 20],
  ['banaan', 296, 360, 64, 58],
  ['s8-bloem', 290, 412, 16, 20],
  ['s8-varen', 312, 404, 44, 36, { flip: true }],
  // bamboe links
  ['s8-bamboe', -2, 400, 56, 70],
  ['s8-bamboe', 26, 448, 52, 66],
  // palm rechtsonder
  ['s4-palm', 274, 540, 84, 136],
  ['s8-varen', 300, 640, 48, 40],
  // bloemenperk rechtsonder
  ['s8-varen', 240, 684, 48, 40],
  ['s8-bloem', 262, 702, 16, 20],
  ['s8-bloem', 292, 694, 16, 20],
  ['s8-bloem', 318, 708, 16, 20],
  ['s8-bloem', 340, 690, 16, 20],
  ['s8-varen', 306, 708, 48, 40, { flip: true }],
];

/** Polletjes gras en bloemen in de randgaten (links naast oneven rijen, rechts naast even rijen). */
function randDecor() {
  const uit = [];
  for (let r = 0; r < hex.ROWS; r += 1) {
    const y = hex.OY + r * hex.DY;
    if (r % 2) { if (hex.opBord(hex.vak(0, r))) uit.push(['s8-gras', 2, y - 4, 24, 16], ['s8-bloem', 6, y + 10, 12, 15]); }
    else if (hex.opBord(hex.vak(5, r))) uit.push(['s8-gras', 332, y - 2, 24, 16]);
  }
  return uit;
}

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

function decorEl([id, x, y, w, hh, opt = {}]) {
  if (opt.flip) return el('g', { transform: `translate(${x + w} ${y}) scale(-1 1)` }, [use(id, 0, 0, w, hh, opt.kleur)]);
  return use(id, x, y, w, hh, opt.kleur);
}

const WERKER_SCHAAL = 0.6;   // de werker (wk-hark) op vak (3,10)

const leegTuin = () => ({ gelegd: {}, geoogst: [], edelstenen: 0 });

/** Decor en vakken, gesorteerd op onderkant-y (tekenvolgorde achter → voor). tekenVak(v) tekent één vak. */
function tuinItems(tekenVak) {
  const items = [...DECOR, ...randDecor()].map((d) => ({ y: d[2] + d[4], maak: () => decorEl(d) }));
  for (const v of hex.alleVakken()) {
    const { y } = hex.middelpunt(v);
    items.push({ y: y + 33, maak: () => tekenVak(v) });
  }
  return items.sort((a, b) => a.y - b.y);
}

/** Het kale vak: uitgang, gelegde tegel (of de starttegel) of gras. */
function vakTekening(v, gelegd) {
  const { x, y } = hex.middelpunt(v);
  const type = hex.typeVan(gelegd, v);
  if (v === hex.UITGANG) return hexSym('hx-uitgang', x, y);
  if (type) return hexTegel(x, y, type);
  return hexSym('hx-gras', x, y);
}

/**
 * De tuin zoals hij nu in de staat staat, stil en zonder knoppen, open vakken, fonkels of werker, met Pino op
 * de start. Voor de polaroid in het album van spel 7 (besluit 107); viewBox = de hele scène.
 */
export function tuinScene() {
  const gelegd = (staat.lees().tuin || leegTuin()).gelegd;
  const svg = el('svg', { viewBox: `0 0 ${B} ${H}`, 'aria-hidden': 'true' });
  const wereld = el('g');
  const start = hex.middelpunt(hex.START);
  const pinoBasis = start.y + 33.5;
  let pinoGezet = false;
  const pinoG = el('g', { transform: `translate(${start.x - 24} ${start.y - 66})` }, [use('pino-staan', 0, 0, 48, 72)]);
  for (const it of tuinItems((v) => vakTekening(v, gelegd))) {
    if (!pinoGezet && it.y > pinoBasis) { wereld.append(pinoG); pinoGezet = true; }
    wereld.append(it.maak());
  }
  if (!pinoGezet) wereld.append(pinoG);
  svg.append(maakGrond(), wereld);
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
  let klaarGezet = false;
  let menu = null;
  let rafId = 0;
  const timers = new Set();
  const wacht = (ms) => new Promise((ok) => { const t = setTimeout(() => { timers.delete(t); ok(); }, ms); timers.add(t); });

  const tuin = () => staat.lees().tuin || leegTuin();

  /* ---------- DOM ---------- */
  // Geen edelsteenteller in spel 2: hoeveel edelstenen Pino heeft, ziet ze pas in spel 3 (besluiten.md #35).
  const svg = scene(B, H, { label: 'Tropische tuin met een zeshoekig gazon, een lotusvijver met sala en kraanvogels, bananenplanten, bamboe en een palm; Pino staat linksonder, de tuinpoort is rechtsboven' });
  svg.classList.add('tuin-scene');
  const wereld = el('g');
  svg.append(maakGrond(), wereld);
  const knoppen = h('div', { class: 'tuin-knoppen' });

  const scherm = h('div', { class: 'scherm spel spel2' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', ...terugKnop(zoek) }),
    // De ruimte onder de kopbalk bepaalt de maat: de scène schaalt mee zodat ze altijd helemaal in beeld is.
    h('div', { class: 'tuin-ruimte' }, [h('div', { class: 'scene-kaart tuin-kaart' }, [svg, knoppen])]),
  ]);
  root.replaceChildren(scherm);

  /* ---------- Pino ---------- */
  const pinoG = el('g', { class: 'tuin-pino' });
  const pinoPos = { ...hex.middelpunt(hex.START), basis: 0, flip: false, pose: 'staan' };
  function tekenPino() {
    pinoG.setAttribute('transform', `translate(${(pinoPos.x - 24).toFixed(1)} ${(pinoPos.y - 66).toFixed(1)})`);
    pinoG.replaceChildren(groep(0, 0, { flip: pinoPos.flip }, [use(`pino-${pinoPos.pose}`, 0, 0, 48, 72)]));
  }
  // Pino komt direct na het vak waar ze op staat (en vóór de rij eronder).
  function plaatsPino(basis) {
    pinoPos.basis = basis;
    const na = [...wereld.children].find((c) => c !== pinoG && Number(c.dataset.y) > basis);
    wereld.insertBefore(pinoG, na || null);
  }

  /* ---------- tekenen ---------- */
  function render(nieuw = null) {
    const t = tuin();
    const open = new Set(klaarGezet ? [] : hex.openVakken(t.gelegd));
    const fonkels = new Set(klaarGezet ? [] : hex.omringdeVakken(t.gelegd, t.geoogst));
    const items = tuinItems((v) => tekenVak(v, t, open.has(v), fonkels.has(v), v === nieuw));
    wereld.replaceChildren();
    for (const it of items) {
      const e = it.maak();
      e.dataset.y = String(it.y);
      wereld.append(e);
    }
    tekenPino();
    plaatsPino(hex.middelpunt(hex.START).y + 33.5);
    maakKnoppen(t, open, fonkels);
  }

  function tekenVak(v, t, isOpen, fonkel, nieuw) {
    const { x, y } = hex.middelpunt(v);
    const g = el('g', { class: nieuw && !rustig ? 'tuin-vak valt-in' : 'tuin-vak' });
    const type = hex.typeVan(t.gelegd, v);
    g.append(vakTekening(v, t.gelegd));
    if (isOpen && !fonkel) {
      const r = hexRect(x, y);
      g.append(el('polygon', { points: TOP, transform: `translate(${r.x} ${r.y})`, fill: 'rgba(255,255,255,0.22)', stroke: 'rgba(255,255,255,0.9)', 'stroke-width': 1.5, 'stroke-dasharray': '4 3', 'stroke-linejoin': 'round' }));
    }
    if (fonkel) g.append(el('path', { class: 'tuin-fonkel', d: `M${x} ${y - 14} ${FONKEL}`, fill: '#FFC93C' }));
    if (v === hex.WERKER && type) {
      // Harkt het gazon, met zijn voeten midden op het vak (besluit 108).
      const w = werkerVak(x, y + 4, WERKER_SCHAAL);
      g.append(el('g', { class: 'tuin-werker' }, [use('wk-hark', w.x, w.y, w.b, w.h)]));
    }
    return g;
  }

  /* ---------- klikdoelen: echte knoppen over de scène ---------- */
  const pct = (v, totaal) => `${((v / totaal) * 100).toFixed(3)}%`;

  function vakKnop(v, klasse, label, actie) {
    const { x, y } = hex.middelpunt(v);
    return h('button', {
      type: 'button', class: `tuin-knop ${klasse}`, 'aria-label': label, 'data-vak': v,
      style: { left: pct(x - 28, B), top: pct(y - 31, H), width: pct(56, B), height: pct(56, H) },
      onclick: (ev) => actie(v, ev.currentTarget),
    });
  }

  function maakKnoppen(t, open, fonkels) {
    knoppen.replaceChildren();
    if (klaarGezet) return;
    for (const v of fonkels) knoppen.append(vakKnop(v, 'tuin-knop-fonkel', 'Edelsteen', kiesEdelsteen));
    for (const v of open) if (!fonkels.has(v)) knoppen.append(vakKnop(v, 'tuin-knop-vak', 'Vak', kiesTegel));
    // De verstopte werker is pas aanklikbaar als spel 7 open is (specs/spel7.md).
    if (t.gelegd[hex.WERKER] && datum.deurOpen(7)) {
      const { x, y } = hex.middelpunt(hex.WERKER);
      knoppen.append(h('button', {
        type: 'button', class: 'tuin-knop tuin-knop-werker', 'aria-label': 'Werker',
        style: { left: pct(x - 18, B), top: pct(y - 40, H), width: pct(36, B), height: pct(46, H) },
        onclick: vindWerker,
      }));
    }
  }

  function middenHex(inhoud, klasse) {
    const schaal = svg.getBoundingClientRect().width / B;
    const s = el('svg', { viewBox: '0 0 56 66', width: 56 * schaal, height: 66 * schaal, 'aria-hidden': 'true' }, inhoud);
    return { element: s, klasse: `taart-midden-hex ${klasse}` };
  }

  /* ---------- tegel kiezen ---------- */
  function kiesTegel(v, knop) {
    if (menu || klaarGezet) return;
    const s = staat.lees();
    const typen = hex.kandidaten(tuin().gelegd, v);
    const n = typen.length;
    const opties = typen.map((type, i) => {
      const aantal = s.tegels[type] || 0;
      const [k, f] = hex.splits(type);
      return {
        hoek: 90 + ((i + 1) * 360) / (n + 1),
        klasse: 'taart-hex',
        label: `Tegel ${k} ${f}, ${aantal}`,
        uitgeschakeld: aantal <= 0,
        inhoud: h('span', { class: 'taart-hex-inhoud' }, [
          el('svg', { viewBox: '0 0 68 80', width: 68, height: 80, 'aria-hidden': 'true' }, [hexTegel(34, 38, type, 62, aantal > 0 ? null : GRIJS)]),
          h('span', { class: 'aantal', 'aria-hidden': 'true' }, String(aantal)),
        ]),
        actie: () => legTegel(v, type),
      };
    });
    opties.push({ hoek: 90, klasse: 'taart-annuleer', label: 'Annuleren', inhoud: el('svg', { viewBox: '0 0 48 48', width: 20, height: 20, 'aria-hidden': 'true' }, [el('path', { d: 'M12 12 L36 36 M36 12 L12 36', stroke: '#4F6B7E', 'stroke-width': 6, 'stroke-linecap': 'round' })]) });
    menu = toonTaartmenu({
      anker: knop.getBoundingClientRect(), kloon: false, straal: MENU_STRAAL, label: 'Kies een tegel', dim: 'rgba(30, 58, 76, 0.42)',
      midden: middenHex([use('hx-doel', 0, 0, 56, 66)], 'taart-midden-doel'),
      opties, bijSluiten: () => { menu = null; },
    });
  }

  function legTegel(v, type) {
    if (klaarGezet || gestopt) return;
    if (!staat.legTuinTegel(v, type)) return;
    render(v);
    if (hex.bereiktUitgang(tuin().gelegd)) einde();
  }

  /* ---------- edelsteen kiezen ---------- */
  function kiesEdelsteen(v, knop) {
    if (menu || klaarGezet) return;
    const { x, y } = hexRect(28, 33);
    menu = toonTaartmenu({
      anker: knop.getBoundingClientRect(), kloon: false, straal: GEM_STRAAL, label: 'Kies een edelsteen', dim: 'rgba(30, 58, 76, 0.42)',
      midden: middenHex([use('hx-gras', x, y, 56, 66), el('path', { d: `M28 19 ${FONKEL}`, fill: '#FFC93C' })], 'taart-midden-goud'),
      opties: GEMS.map((k, i) => ({
        hoek: [-150, -90, -30][i], klasse: 'taart-rond', label: `Kies ${k}e edelsteen`,
        inhoud: gemSvg(k, 44),
        actie: () => { if (staat.oogstEdelsteen(v, k)) render(); },
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

  /* ---------- einde: Pino loopt over het pad naar de poort ---------- */
  async function einde() {
    klaarGezet = true;
    const t = tuin();
    const route = hex.pad(t.gelegd);
    render();
    if (!rustig) {
      for (let i = 1; i < route.length && !gestopt; i += 1) await stap(route[i - 1], route[i], i);
    } else {
      Object.assign(pinoPos, hex.middelpunt(hex.UITGANG));
      plaatsPino(pinoPos.y + 33.5);
      tekenPino();
    }
    pinoPos.pose = 'staan';
    tekenPino();
    await wacht(EIND_PAUZE);
    if (gestopt) return;
    const tegels = Object.keys(t.gelegd).length;
    const edelstenen = t.edelstenen || 0;
    const eersteKeer = klaar({ vaardigheid: info.vaardigheid, score: { tegels, edelstenen } });
    staat.wisTuin();
    toonResultaat({
      root,
      icoon: info.icoon,
      label: `${info.titel.toUpperCase()} · KLAAR`,
      titel: 'Het pad is gelegd!',
      zin: 'De koningin wandelt met droge voeten naar de poort. Zelfs de kraanvogels maken een buiging.',
      tegels: [{ label: 'TEGELS', waarde: tegels, kleur: '#1F7A3A' }],
      beloning: { vaardigheid: info.vaardigheid, eersteKeer },
      opnieuw,
    });
  }

  function stap(van, naar, i) {
    const a = hex.middelpunt(van);
    const b = hex.middelpunt(naar);
    if (b.x !== a.x) pinoPos.flip = b.x < a.x;
    plaatsPino(Math.max(a.y, b.y) + 33.5);
    return new Promise((ok) => {
      const t0 = performance.now();
      const frame = (nu) => {
        if (gestopt) { ok(); return; }
        const f = Math.min(1, (nu - t0) / STAP_DUUR);
        pinoPos.x = a.x + (b.x - a.x) * f;
        pinoPos.y = a.y + (b.y - a.y) * f - Math.sin(f * Math.PI) * 6;
        pinoPos.pose = (i + (f > 0.5 ? 1 : 0)) % 2 ? 'loop' : 'staan';
        tekenPino();
        if (f < 1) rafId = requestAnimationFrame(frame);
        else ok();
      };
      rafId = requestAnimationFrame(frame);
    });
  }

  /* ---------- start ---------- */
  render();
  if (datum.isTest()) window.pinoDebug = { spel: 2, hex, tuin, render };

  return () => {
    gestopt = true;
    cancelAnimationFrame(rafId);
    for (const t of timers) clearTimeout(t);
    if (menu) menu.sluit();
    if (window.pinoDebug && window.pinoDebug.spel === 2) delete window.pinoDebug;
  };
}

/** Grond: jungle-gras met wat donkere en lichte vlekken, zodat het gazon in de tuin ligt en niet in een kader. */
function maakGrond() {
  const g = el('g', { 'aria-hidden': 'true' });
  g.append(el('rect', { x: 0, y: 0, width: B, height: H, fill: '#5FB05A' }));
  const vlekken = [[30, 260, 40, 18, '#4E9A3E'], [330, 200, 36, 16, '#4E9A3E'], [20, 620, 34, 14, '#4E9A3E'], [190, 736, 120, 14, '#4E9A3E'],
    [180, 20, 150, 26, '#4E9A3E'], [335, 480, 30, 60, '#4E9A3E'], [12, 360, 24, 50, '#8BD35A'], [348, 300, 18, 40, '#8BD35A']];
  for (const [cx, cy, rx, ry, fill] of vlekken) g.append(el('ellipse', { cx, cy, rx, ry, fill }));
  return g;
}
