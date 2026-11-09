// Spel 5 · Negotiate trade deal (specs/spel5.md, design/artboards/Spel5*.dc.html).
// Pino loopt over de nachtmarkt (D-pad of pijltjestoetsen) en dingt bij vier handelaars af op het product van de
// ronde. Vanaf ronde 2 staat er een wisselkraam voor edelstenen. Na de ketting is het productenalbum het startpunt.
// De regels (prijzen, niveaus, bieden) staan in markt.js.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { toonDialoog } from '../ui/overlay.js';
import { toonTaartmenu } from '../ui/taartmenu.js';
import { icoon } from '../ui/iconen.js';
import { gemSvg, GEMS } from '../ui/edelstenen.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { el, use, groep, scene, persoon, pino } from '../sprites.js';
import { maakLus } from './lus.js';
import { maakInvoer } from '../invoer.js';
import * as M from './markt.js';

const B = 358;
const H = 582;
const SNELHEID = 120;          // px per seconde (scène-eenheden)
const JOYSTICK_VERTRAGING = 250;  // ms vasthouden voordat de joystick verschijnt (besluiten.md #23, zoals spel 1)

/** De vier handelaars: kraampositie (artboard Spel5), luifel, waar en persoon (spel5_sprites.py). */
const INFO = {
  mai: { naam: 'Mai', x: 8, y: 54, luifel: '#FF6FAE', waar: 'sieraden', portret: '#FFE0EE',
    persoon: { kleding: '#9B6BFF', huid: '#E8B48A', haar: 'bh-lang', haarkleur: '#1E3A4C', jurk: true, acc: ['acc-nonla'] } },
  arun: { naam: 'Arun', x: 220, y: 54, luifel: '#1FA3DC', waar: 'sieraden', portret: '#FFE3D6',
    persoon: { kleding: '#FF8A3D', huid: '#E8B48A', haar: 'bh-kort', haarkleur: '#4A3426' } },
  siti: { naam: 'Siti', x: 8, y: 344, luifel: '#39D353', waar: 'stof', portret: '#E9F8EC',
    persoon: { kleding: '#39D353', huid: '#F6C9A8', haar: 'bh-knot', haarkleur: '#2B1A0E' } },
  minh: { naam: 'Minh', x: 220, y: 344, luifel: '#FFC93C', waar: 'lampion', portret: '#FFF1D6',
    persoon: { kleding: '#5BC0EB', huid: '#E8B48A', haar: 'bh-stekel', haarkleur: '#2B1A0E', acc: ['acc-nonla'] } },
};
const WISSELAAR = { kleding: '#FFC93C', huid: '#C98B5A', haar: 'bh-kort', haarkleur: '#2B1A0E', acc: ['acc-bril'] };
const WISSEL = { x: 131, y: 466, s: 0.75 };            // wisselkraam op de plek van de onderste mat (besluit 65)

/** Waar de producten van latere rondes klein liggen, zonder interactie (besluit 66). */
const LATER = { kniebeschermers: 'siti', spray: 'minh', schoenen: 'arun' };

/** Loopgebied (voetpunt van Pino) en obstakels in scène-coördinaten. */
const GRENS = { x0: 14, x1: 344, y0: 178, y1: 576 };
const OBSTAKELS = [
  { x0: 10, x1: 126, y0: 404, y1: 466 },     // toonbank Siti
  { x0: 222, x1: 338, y0: 404, y1: 466 },    // toonbank Minh
  { x0: 146, x1: 212, y0: 280, y1: 312 },    // waterput
  { x0: 106, x1: 130, y0: 314, y1: 326 },    // krukje
  { x0: 189, x1: 203, y0: 392, y1: 404 },    // lantaarnpaal
];
const OBSTAKEL_WISSEL = { x0: 136, x1: 226, y0: 512, y1: 556 };
/** Waar Pino moet staan om te praten. */
const ZONES = [
  { id: 'mai', x0: 8, x1: 138, y0: 178, y1: 224 },
  { id: 'arun', x0: 220, x1: 350, y0: 178, y1: 224 },
  { id: 'siti', x0: 8, x1: 138, y0: 466, y1: 522 },
  { id: 'minh', x0: 220, x1: 350, y0: 466, y1: 522 },
];
const ZONE_WISSEL = { id: 'wissel', x0: 128, x1: 232, y0: 556, y1: 580 };
const WERKER = { x: 176, y: 242, b: 16, h: 20 };       // half achter de put (spel 7)

const pct = (v, t) => `${((v / t) * 100).toFixed(3)}%`;
const binnen = (r, x, y) => x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
const isOpen = (dag) => datum.deurOpen(dag);

function svgIcoon(id, maat, { kleur = null, label = null } = {}) {
  return el('svg', { class: 'ic', viewBox: '0 0 48 48', width: maat, height: maat, role: label ? 'img' : null, 'aria-label': label, 'aria-hidden': label ? null : 'true' },
    [use(id, 0, 0, 48, 48, kleur)]);
}
const munt = (maat) => svgIcoon('s4-munt', maat);

function lampion(x, y, kleur) {
  return groep(x, y, {}, [use('s5-gloed', -28, -22, 80, 80), use('s5-lampion', 0, 0, 24, 34, kleur)]);
}

/** Portret van een handelaar (hoofd en schouders), voor het onderhandelscherm en het resultaat. */
function portretSvg(id, gezicht = 'b-blij', w = 68, hg = 62) {
  return el('svg', { class: 'ic', viewBox: '0 -4 48 44', width: w, height: hg, 'aria-hidden': 'true' }, [persoon(0, 0, { ...INFO[id].persoon, gezicht })]);
}

/** Het gezicht van een handelaar hoort bij zijn stemming (besluit 77). */
const GEZICHT = { blij: 'b-blij', twijfel: 'b-twijfel', verdrietig: 'b-bedroefd', boos: 'b-boos' };
const STEMMING_LABEL = { blij: 'Stemming: blij', twijfel: 'Stemming: twijfelt', verdrietig: 'Stemming: verdrietig', boos: 'Stemming: boos' };

/* ---------- start: album of markt ---------- */

export function start(opties) {
  // Album en markt wisselen in hetzelfde scherm; de router houdt één opruimfunctie vast.
  let opruim = null;
  const toon = (modus) => {
    if (opruim) opruim();
    opruim = modus === 'album'
      ? album({ ...opties, naarMarkt: () => toon('markt'), bekijk: () => toon('kijk') })
      : markt({ ...opties, kijken: modus === 'kijk', opnieuw: () => toon('markt') });
  };
  // Nog geen ketting: meteen de markt (ronde 1). Daarna is het album het startpunt (besluit 67).
  toon(staat.lees().producten.includes('ketting') ? 'album' : 'markt');
  return () => { if (opruim) opruim(); opruim = null; };
}

/** De lopende ronde, of een nieuwe voor het eerstvolgende product (cyclus: besluit 58). */
function huidigeRonde() {
  const s = staat.lees();
  const product = M.volgendProduct(s.producten);
  if (!product) return null;
  const gevraagd = datum.isTest() ? new URLSearchParams(location.search).get('niveau') : null;
  let { cyclus, ronde } = s.markt;
  if (ronde && ronde.product === product.id && (!gevraagd || ronde.niveau === gevraagd)) return ronde;
  if (!cyclus) cyclus = M.nieuweCyclus();
  const niveau = M.NIVEAUS.includes(gevraagd) ? gevraagd : cyclus[s.markt.stap] || 'simpel';
  ronde = M.maakRonde(product.id, niveau);
  staat.bewaarMarkt({ cyclus, ronde });
  return ronde;
}

/* ---------- markt ---------- */

function markt({ root, dag, info, klaar, opnieuw, kijken = false }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const s0 = staat.lees();
  let ronde = kijken ? null : huidigeRonde();
  const product = ronde ? M.product(ronde.product) : null;
  // Kijkmodus (spel 7) of niets meer te koop: alleen rondlopen, geen handel en geen wisselkraam.
  const metWissel = !!ronde && s0.producten.includes('ketting');
  const obstakels = metWissel ? [...OBSTAKELS, OBSTAKEL_WISSEL] : OBSTAKELS;
  const zones = !ronde ? [] : metWissel ? [...ZONES, ZONE_WISSEL] : ZONES;

  let gestopt = false;
  let bezig = false;           // onderhandelscherm of taartmenu open
  let af = false;
  const timers = new Set();
  const wacht = (ms) => new Promise((ok) => { const id = setTimeout(() => { timers.delete(id); ok(); }, ms); timers.add(id); });

  /* ---------- scène ---------- */
  const svg = scene(B, H, { label: 'Nachtmarkt met lampions, vier kramen, een waterput en Pino' });
  svg.classList.add('s5-scene');

  const grond = el('g', { class: 's5-grond' });
  grond.append(el('rect', { x: 0, y: 0, width: B, height: H, fill: '#556B8E' }));
  for (let yy = 0; yy < H; yy += 28) {
    const off = (yy / 28) % 2 ? 14 : 0;
    for (let xx = 0; xx < B; xx += 28) grond.append(el('rect', { x: xx + off + 1, y: yy + 1, width: 26, height: 26, rx: 4, fill: '#4E6384' }));
  }
  grond.append(el('path', { d: 'M0 28 q90 22 180 0 t178 0', fill: 'none', stroke: '#8B4A1E', 'stroke-width': 2.5 }));
  [[18, '#FF5E5B'], [78, '#FFC93C'], [138, '#FF5E5B'], [198, '#FF8A3D'], [258, '#FF5E5B'], [318, '#FFC93C']]
    .forEach(([x, k], i) => grond.append(lampion(x, [36, 44, 40, 36, 42, 38][i], k)));
  grond.append(use('s5-mat', 126, 170, 96, 40));
  if (!metWissel) grond.append(use('s5-mat', 126, 500, 96, 40));

  const laag = el('g', { class: 's5-laag' });
  svg.append(grond, laag);

  // Sorteerbare dingen (tekenvolgorde op voet-y): kramen, put met werker, krukje, lantaarnpaal, wisselkraam, Pino.
  const dingen = [];
  const handelaarKnoop = {};
  for (const id of M.HANDELAARS) {
    const i = INFO[id];
    const hk = el('g', { class: 's5-handelaar' }, [persoon(41, 28, i.persoon)]);
    handelaarKnoop[id] = hk;
    const delen = [use('s5-kraam-achter', 0, 0, 130, 120, i.luifel), hk, use('s5-kraam-voor', 0, 0, 130, 120), use(`s5-waar-${i.waar}`, 14, 58, 100, 30)];
    // Het product van de ronde ligt op alle vier de toonbanken (niet de ketting: die hangt al tussen de sieraden).
    if (product && product.id !== 'ketting') delen.push(use(product.symbool, 94, 44, 28, 28));
    // Latere producten liggen klein bij hun eigen kraam, zonder interactie (besluit 66).
    for (const p of M.PRODUCTEN) {
      if (LATER[p.id] !== id || s0.producten.includes(p.id) || (product && product.id === p.id)) continue;
      delen.push(use(p.symbool, 18, 53, 18, 18));
    }
    dingen.push({ y: i.y + 116, knoop: groep(i.x, i.y, {}, delen) });
  }
  const werkerKnoop = use('werker', WERKER.x, WERKER.y, WERKER.b, WERKER.h);
  dingen.push({ y: 308, knoop: el('g', {}, [werkerKnoop, use('s5-put', 143, 228, 72, 84)]) });
  dingen.push({ y: 324, knoop: use('s5-kruk', 106, 296, 24, 28) });
  dingen.push({ y: 400, knoop: el('g', {}, [el('rect', { x: 194, y: 330, width: 4, height: 70, fill: '#8B4A1E' }), lampion(186, 308, '#FF8A3D')]) });
  if (metWissel) {
    dingen.push({ y: WISSEL.y + 116 * WISSEL.s, knoop: groep(WISSEL.x, WISSEL.y, { schaal: WISSEL.s }, [
      use('s5-kraam-achter', 0, 0, 130, 120, '#9B6BFF'), persoon(41, 28, WISSELAAR), use('s5-kraam-voor', 0, 0, 130, 120), use('s5-waar-wissel', 14, 58, 100, 30),
    ]) });
  }
  const pinoStaat = { x: 270, y: 247, richting: -1, pose: 'staan', sleutel: '', fase: 0 };
  const pinoKnoop = el('g', { class: 's5-pino' });
  const pinoDing = { y: pinoStaat.y, knoop: pinoKnoop };
  dingen.push(pinoDing);
  for (const d of dingen) laag.append(d.knoop);

  /* ---------- DOM ---------- */
  const geldGetal = h('span', {}, String(s0.geld));
  const geldPil = h('span', { class: 'teller-pil s5-geld', role: 'img', 'aria-label': `Portemonnee: ${s0.geld} munten` }, [munt(24), geldGetal]);
  const afmelden = staat.abonneer((s) => {
    geldGetal.textContent = String(s.geld);
    geldPil.setAttribute('aria-label', `Portemonnee: ${s.geld} munten`);
  });

  const knoppenLaag = h('div', { class: 's5-knoppen' });
  if (datum.deurOpen(7)) {
    knoppenLaag.append(h('button', {
      type: 'button', class: 's5-knop-werker', 'aria-label': 'Werker', onclick: vindWerker,
      style: { left: pct(WERKER.x - 8, B), top: pct(WERKER.y - 6, H), width: pct(WERKER.b + 16, B), height: pct(WERKER.h + 12, H) },
    }));
  }
  const kaart = h('div', { class: 'scene-kaart s5-kaart' }, [svg, knoppenLaag]);

  const pijl = (naam, label) => h('button', { type: 'button', class: 'knop-icoon', 'aria-label': label }, [icoon(naam, 22)]);
  const knopOp = pijl('pijlOmhoog', 'Omhoog');
  const knopLinks = pijl('pijlLinks', 'Links');
  const knopNeer = pijl('pijlOmlaag', 'Omlaag');
  const knopRechts = pijl('pijlRechts', 'Rechts');
  const praatKnop = h('button', { type: 'button', class: 's5-praat-knop', 'aria-label': 'Praat met de handelaar', disabled: true, onclick: praat }, [
    el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 60, height: 60, 'aria-hidden': 'true' }, [
      use('s5-praat', 0, 0, 48, 48, '#FFFFFF'),
      el('circle', { cx: 17, cy: 22, r: 2.5, fill: '#1FA3DC' }), el('circle', { cx: 24, cy: 22, r: 2.5, fill: '#1FA3DC' }), el('circle', { cx: 31, cy: 22, r: 2.5, fill: '#1FA3DC' }),
    ]),
  ]);
  const besturing = h('div', { class: 'besturing s5-besturing' }, [
    h('div', { class: 'dpad s5-dpad', role: 'group', 'aria-label': 'Loop met de pijlen' }, [h('span'), knopOp, h('span'), knopLinks, knopNeer, knopRechts]),
    praatKnop,
  ]);

  const scherm = h('div', { class: 'scherm spel spel5' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', rechts: geldPil }),
    h('div', { class: 's5-ruimte' }, [kaart]),
    besturing,
  ]);
  root.replaceChildren(scherm);

  // Zoals spel 1 (besluiten 23/24): vasthouden op het scherm = joystick, korte tik = praten. Daarnaast de D-pad,
  // de tekstballonknop en het toetsenbord. Knoppen in het vlak (D-pad, werker) blijven gewoon knoppen.
  const invoer = maakInvoer({
    richtingen: { omhoog: knopOp, omlaag: knopNeer, links: knopLinks, rechts: knopRechts },
    joystick: { element: scherm, vertraging: JOYSTICK_VERTRAGING, tik: 'actie' },
    bijActie: (naam) => { if (naam === 'actie' && !bezig) praat(); },
  });

  /* ---------- lopen ---------- */
  function vrij(x, y) {
    if (x < GRENS.x0 || x > GRENS.x1 || y < GRENS.y0 || y > GRENS.y1) return false;
    return !obstakels.some((r) => binnen(r, x, y));
  }
  let zone = null;
  let kanPraten = false;

  function update(dt) {
    if (!bezig && !af) {
      const { dx, dy } = invoer.as();
      if (dx || dy) {
        const nx = pinoStaat.x + dx * SNELHEID * dt;
        const ny = pinoStaat.y + dy * SNELHEID * dt;
        if (vrij(nx, pinoStaat.y)) pinoStaat.x = nx;
        if (vrij(pinoStaat.x, ny)) pinoStaat.y = ny;
        if (Math.abs(dx) > 0.1) pinoStaat.richting = dx < 0 ? -1 : 1;
        pinoStaat.pose = 'loop';
        pinoStaat.fase += dt;
      } else {
        pinoStaat.pose = 'staan';
      }
    }
    if (groepLeden.length) samenzweer(dt);
    const nieuw = zones.find((z) => binnen(z, pinoStaat.x, pinoStaat.y)) || null;
    const kan = !!nieuw && !weg(nieuw.id);
    if (nieuw !== zone || kan !== kanPraten) {
      zone = nieuw;
      kanPraten = kan;
      praatKnop.disabled = !kan;
      praatKnop.setAttribute('aria-label', zone && zone.id === 'wissel' ? 'Edelstenen ruilen' : 'Praat met de handelaar');
    }
  }

  function teken() {
    const sleutel = `${pinoStaat.pose}|${pinoStaat.richting}`;
    if (sleutel !== pinoStaat.sleutel) {
      pinoStaat.sleutel = sleutel;
      pinoKnoop.replaceChildren(pino(-24, -71, pinoStaat.pose, { flip: pinoStaat.richting < 0 }));
    }
    const wip = !rustig && pinoStaat.pose === 'loop' ? -Math.abs(Math.sin(pinoStaat.fase * Math.PI * 5)) * 2 : 0;
    pinoKnoop.setAttribute('transform', `translate(${pinoStaat.x.toFixed(1)} ${(pinoStaat.y + wip).toFixed(1)})`);
    pinoDing.y = pinoStaat.y;
    sorteer();
  }

  let volgorde = [];
  function sorteer() {
    const nieuw = [...dingen].sort((a, b) => a.y - b.y);
    if (nieuw.length === volgorde.length && nieuw.every((d, i) => d === volgorde[i])) return;
    volgorde = nieuw;
    for (const d of nieuw) laag.append(d.knoop);
  }

  /* ---------- samenzweren (alleen Moeilijk, besluit 74) ---------- */
  // De twee bezoekers lopen naar de kraam van de gastheer (Mai linksboven óf Minh rechtsonder), praten daar met z'n
  // drieën met een boos gezicht en lopen terug. De vierde handelaar doet niet mee en blijft gewoon staan.
  // Een bezoeker loopt eerst achter zijn eigen toonbank langs naar buiten (getekend in zijn kraam) en daarna los over
  // de markt (getekend in de gesorteerde laag, zodat hij netjes voor of achter de put, het krukje en Pino staat).
  const THUIS = Object.fromEntries(M.HANDELAARS.map((id) => [id, { x: INFO[id].x + 65, y: INFO[id].y + 100 }]));
  /** Per gastheer, per bezoeker: [uitgang achter de eigen toonbank, …tussenpunten, plek bij de gastheer]. */
  const ROUTES = {
    mai: { siti: [[156, 444], [100, 214]], arun: [[205, 154], [152, 168]] },
    minh: { siti: [[156, 444], [206, 452]], arun: [[205, 154], [250, 498]] },
  };
  const LOOP = 100;                                   // px per seconde
  const PRATEN = 2.4;                                 // seconden
  const gastheer = ronde && ronde.niveau === 'moeilijk' && !kijken ? (ronde.gastheer || null) : null;
  const bezoekers = gastheer && ROUTES[gastheer] ? Object.keys(ROUTES[gastheer]).filter((id) => M.spantSamen(ronde, id)) : [];
  const groepLeden = bezoekers.length ? [gastheer, ...bezoekers] : [];

  const paden = {};
  const los = {};
  for (const id of bezoekers) {
    const punten = [THUIS[id], ...ROUTES[gastheer][id].map(([x, y]) => ({ x, y }))];
    const stukken = [];
    let totaal = 0;
    for (let n = 1; n < punten.length; n++) {
      const lengte = Math.hypot(punten[n].x - punten[n - 1].x, punten[n].y - punten[n - 1].y);
      stukken.push({ van: punten[n - 1], naar: punten[n], lengte, binnen: n === 1 });
      totaal += lengte;
    }
    paden[id] = { stukken, totaal };
    const knoop = el('g', { class: 's5-handelaar-los' });
    los[id] = { knoop, ding: { y: THUIS[id].y, knoop }, sleutel: '' };
    dingen.push(los[id].ding);
    laag.append(knoop);
  }
  const HEEN = Math.max(0, ...bezoekers.map((id) => paden[id].totaal)) / LOOP;
  // Maar één keer per ronde (besluit 75): kort nadat Pino ergens lager heeft geboden dan de vraagprijs.
  // ronde.lagerBod en ronde.samengezworen worden bewaard, zodat weglopen en terugkomen dit niet herhaalt.
  const sz = { wacht: null, t: -1 };
  /** Plan het samenzweren (één keer); het begint zodra de markt weer loopt, dus na het onderhandelscherm. */
  function planSamenzweren() {
    if (!groepLeden.length || !ronde.lagerBod || ronde.samengezworen || sz.t >= 0 || sz.wacht !== null) return;
    sz.wacht = 0.8;
  }
  planSamenzweren();

  /** Gezicht van een handelaar volgens zijn stemming in deze ronde. */
  function gezichtVan(id) {
    return GEZICHT[ronde ? M.stemmingVan(ronde.handelaars[id]) : 'blij'];
  }
  const getekend = {};
  const loopWip = (t) => (rustig ? 0 : -Math.abs(Math.sin(t * Math.PI * 5)) * 2);
  const praatWip = (t, n) => (rustig ? 0 : -Math.max(0, Math.sin(t * Math.PI * 3 + (n * 2 * Math.PI) / 3)) * 2);

  /** Plek op het pad na `afstand` px: { x, y, binnen } (binnen = nog achter de eigen toonbank). */
  function opPad(id, afstand) {
    let rest = Math.max(0, afstand);
    for (const s of paden[id].stukken) {
      if (rest <= s.lengte) {
        const u = s.lengte ? rest / s.lengte : 1;
        return { x: s.van.x + (s.naar.x - s.van.x) * u, y: s.van.y + (s.naar.y - s.van.y) * u, binnen: s.binnen && u < 1 };
      }
      rest -= s.lengte;
    }
    const laatste = paden[id].stukken[paden[id].stukken.length - 1].naar;
    return { x: laatste.x, y: laatste.y, binnen: false };
  }

  /** Teken een handelaar thuis (in zijn kraam, verschoven met dx) of los op de markt. */
  function zet(id, { x, y, binnen = true }, wip, gezicht, flip) {
    const sleutel = `${gezicht}|${flip}`;
    if (binnen) {
      if (los[id] && los[id].sleutel) { los[id].knoop.replaceChildren(); los[id].sleutel = ''; }
      if (getekend[id] !== sleutel) {
        getekend[id] = sleutel;
        handelaarKnoop[id].replaceChildren(persoon(41, 28, { ...INFO[id].persoon, gezicht, flip }));
      }
      const dx = x - THUIS[id].x;
      handelaarKnoop[id].setAttribute('transform', dx || wip ? `translate(${dx.toFixed(1)} ${wip.toFixed(2)})` : '');
    } else {
      if (getekend[id]) { handelaarKnoop[id].replaceChildren(); getekend[id] = ''; }
      if (los[id].sleutel !== sleutel) {
        los[id].sleutel = sleutel;
        los[id].knoop.replaceChildren(persoon(-24, -72, { ...INFO[id].persoon, gezicht, flip }));
      }
      los[id].knoop.setAttribute('transform', `translate(${x.toFixed(1)} ${(y + wip).toFixed(2)})`);
      los[id].ding.y = y;
    }
  }

  /** Doet deze handelaar nu mee aan het samenzweren? Dan kan Pino niet met hem praten. */
  function weg(id) {
    return sz.t >= 0 && groepLeden.includes(id);
  }

  function samenzweer(dt) {
    if (sz.t < 0) {
      if (sz.wacht === null) return;
      sz.wacht -= dt;
      if (sz.wacht > 0) return;
      sz.t = 0;
      ronde = { ...ronde, samengezworen: true };
      staat.bewaarMarkt({ ronde });
    }
    sz.t += dt;
    const t = sz.t;
    const praten = t >= HEEN && t < HEEN + PRATEN;
    const klaar = t >= 2 * HEEN + PRATEN;
    groepLeden.forEach((id, n) => {
      if (id === gastheer) {
        zet(id, THUIS[id], praten ? praatWip(t, n) : 0, praten ? 'b-boos' : gezichtVan(id), false);
        return;
      }
      const L = paden[id].totaal;
      let afstand; let terug = false;
      if (t < HEEN) afstand = Math.min(L, t * LOOP);
      else if (t < HEEN + PRATEN) afstand = L;
      else { afstand = Math.max(0, L - (t - HEEN - PRATEN) * LOOP); terug = true; }
      if (klaar) afstand = 0;
      const p = opPad(id, afstand);
      const loopt = !klaar && !praten && afstand > 0 && afstand < L;
      // Kijkrichting: tijdens het lopen de looprichting, tijdens het praten naar de gastheer.
      const voor = opPad(id, afstand + (terug ? -1 : 1));
      let flip = loopt ? (voor.x < p.x) : false;
      if (praten) flip = THUIS[gastheer].x < p.x;
      if (klaar || afstand === 0) flip = false;
      zet(id, p, praten ? praatWip(t, n) : loopt ? loopWip(t) : 0, praten ? 'b-boos' : gezichtVan(id), flip);
    });
    if (klaar) {
      sz.t = -1;
      sz.wacht = null;
    }
  }

  /* ---------- praten ---------- */
  function praat() {
    if (gestopt || bezig || af || !zone || weg(zone.id)) return;
    if (zone.id === 'wissel') openWissel();
    else onderhandel(zone.id);
  }

  function pauzeer() {
    bezig = true;
    for (const k of Object.keys(invoer.richting)) invoer.richting[k] = false;
    pinoStaat.pose = 'staan';
    lus.pauzeer();
    teken();
  }
  function hervat() {
    bezig = false;
    for (const k of Object.keys(invoer.richting)) invoer.richting[k] = false;
    if (!gestopt && !af) lus.hervat();
  }

  /** Onderhandelscherm (Spel5-Onderhandel): portret + stemming, vraagprijs, stepper, weglopen en bieden. */
  function onderhandel(id) {
    pauzeer();
    const i = INFO[id];
    let hd = ronde.handelaars[id];
    const geld = () => staat.lees().geld;
    let bod = M.startBod(hd, geld());
    let dealt = false;

    const badge = h('span', { class: 's5-badge', role: 'img' });
    const uitsnede = h('div', { class: 's5-portret-uitsnede' });
    // Badge én gezicht tonen dezelfde stemming; ook de handelaar in de scène kijkt zo (besluit 77).
    const zetStemming = (stemming) => {
      badge.replaceChildren(svgIcoon(`s5-stemming-${stemming}`, 26));
      badge.setAttribute('aria-label', STEMMING_LABEL[stemming]);
      uitsnede.replaceChildren(portretSvg(id, GEZICHT[stemming]));
      zet(id, THUIS[id], 0, GEZICHT[stemming], false);
    };
    zetStemming(M.stemmingVan(hd));
    const portret = h('div', { class: 's5-portret', style: { background: i.portret } }, [uitsnede, badge]);

    const vraag = h('div', { class: 's5-vraag', role: 'img', 'aria-label': `${i.naam} vraagt ${hd.v} munten` }, [
      svgIcoon(product.symbool, 40), h('span', { class: 's5-bedrag' }, [munt(26), h('span', { class: 'kop s5-vraagprijs' }, String(hd.v))]),
    ]);

    const bodGetal = h('span', { class: 'kop s5-bod' }, '');
    const biedGetal = h('span', { class: 'kop' }, '');
    const min = h('button', { type: 'button', class: 's5-stap', 'aria-label': 'Bod verlagen' }, '−');
    const plus = h('button', { type: 'button', class: 's5-stap', 'aria-label': 'Bod verhogen' }, '+');
    const weg = h('button', { type: 'button', class: 's5-weg', 'aria-label': 'Weglopen', onclick: () => d.sluit() }, [svgIcoon('s5-wegloop', 26, { kleur: '#4F6B7E' })]);
    const bied = h('button', { type: 'button', class: 's5-bied', onclick: doeBod }, [
      el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 26, height: 26, 'aria-hidden': 'true' }, [use('s5-praat', 0, 0, 48, 48, '#0E3D1C')]), munt(24), biedGetal,
    ]);

    function toonBod() {
      const max = M.maxBod(hd, geld());
      bod = Math.max(Math.min(M.STAP, max), Math.min(bod, max));
      bodGetal.textContent = String(bod);
      biedGetal.textContent = String(bod);
      bied.setAttribute('aria-label', `Bied ${bod} munten`);
      min.disabled = dealt || bod <= M.STAP;
      plus.disabled = dealt || bod >= max;
      bied.disabled = dealt || bod < M.STAP;
      weg.disabled = dealt;
    }
    function stap(richting) {
      if (dealt) return;
      bod += richting * M.STAP;
      toonBod();
    }
    // Vasthouden herhaalt; toetsenbord (klik zonder aanwijzer) zet één stap.
    function maakHerhaal(knop, richting) {
      let t1 = null; let t2 = null;
      const stop = () => { clearTimeout(t1); clearInterval(t2); t1 = t2 = null; };
      knop.addEventListener('pointerdown', (ev) => {
        ev.preventDefault();
        stap(richting);
        t1 = setTimeout(() => { t2 = setInterval(() => stap(richting), 90); }, 380);
      });
      for (const e of ['pointerup', 'pointerleave', 'pointercancel']) knop.addEventListener(e, stop);
      knop.addEventListener('click', (ev) => { if (ev.detail === 0) stap(richting); });
      knop.addEventListener('contextmenu', (ev) => ev.preventDefault());
      return stop;
    }
    const stopMin = maakHerhaal(min, -1);
    const stopPlus = maakHerhaal(plus, 1);

    async function doeBod() {
      if (dealt) return;
      const uit = M.bied(ronde, id, bod);
      ronde = uit.ronde;
      hd = ronde.handelaars[id];
      // Moeilijk: het eerste afgewezen bod onder de vraagprijs zet het samenzweren in gang (besluit 75).
      if (!uit.ja && ronde.niveau === 'moeilijk' && bod < hd.v && !ronde.lagerBod) ronde = { ...ronde, lagerBod: true };
      staat.bewaarMarkt({ ronde });
      planSamenzweren();
      zetStemming(uit.stemming);
      if (uit.ja) {
        dealt = true;
        toonBod();
        const betaald = bod;
        await wacht(rustig ? 300 : 800);
        if (gestopt) return;
        d.sluit();
        deal(id, betaald);
        return;
      }
      if (!rustig) portret.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 350 });
      if (hd.beledigd) bod = M.maxBod(hd, geld());
      toonBod();
    }

    const kaartInhoud = [
      h('div', { class: 's5-rij' }, [portret, vraag]),
      h('div', { class: 's5-stepper', role: 'group', 'aria-label': 'Jouw bod' }, [min, h('span', { class: 's5-bedrag s5-bod-vak' }, [munt(28), bodGetal]), plus]),
      h('div', { class: 's5-acties' }, [weg, bied]),
    ];
    const d = toonDialoog({
      label: `Onderhandelen met ${i.naam}`, klasse: 's5-onderhandel', dim: 'rgba(30, 58, 76, 0.5)', inhoud: kaartInhoud,
      bijSluiten: () => { stopMin(); stopPlus(); d.element.removeEventListener('keydown', opToets); if (!dealt) hervat(); },
    });
    function opToets(ev) {
      if (ev.key === 'ArrowUp' || ev.key === 'ArrowRight') { ev.preventDefault(); stap(1); }
      else if (ev.key === 'ArrowDown' || ev.key === 'ArrowLeft') { ev.preventDefault(); stap(-1); }
    }
    d.element.addEventListener('keydown', opToets);
    toonBod();
    queueMicrotask(() => bied.focus());
  }

  /* ---------- wisselkraam (besluit 65) ---------- */
  function wisselRechthoek() {
    const r = svg.getBoundingClientRect();
    const k = r.width / B;
    const b = 130 * WISSEL.s * k;
    return { left: r.left + WISSEL.x * k, top: r.top + (WISSEL.y + 20) * k, width: b, height: 70 * k };
  }

  function openWissel() {
    pauzeer();
    const s = staat.lees();
    const midden = h('div', { class: 's5-wissel-midden', role: 'img', 'aria-label': `${s.geld} munten` }, [munt(26), h('span', { class: 'kop' }, String(s.geld))]);
    toonTaartmenu({
      anker: wisselRechthoek(),
      kloon: false,
      midden: { element: midden, klasse: 's5-wissel-bol' },
      straal: 100,
      label: 'Edelstenen ruilen',
      opties: GEMS.map((kleur, n) => {
        const aantal = s.edelstenen[kleur] || 0;
        return {
          hoek: [-150, -90, -30][n],
          klasse: 's5-gem-optie',
          label: `${{ blauw: 'Blauwe', groen: 'Groene', geel: 'Gele' }[kleur]} edelsteen, ${aantal}`,
          uitgeschakeld: aantal <= 0,
          inhoud: h('span', { class: 's5-gem-inhoud' }, [gemSvg(kleur, 44), h('span', { class: 'aantal' }, String(aantal))]),
          actie: () => {
            const bedrag = staat.wisselEdelsteen(kleur, M.KOERS[kleur]);
            if (bedrag) plusBadge(bedrag);
            if (!gestopt) openWissel();   // het menu blijft open tot Pino ernaast tikt
          },
        };
      }),
      bijSluiten: () => hervat(),
    });
  }

  function plusBadge(bedrag) {
    const r = geldPil.getBoundingClientRect();
    const b = h('div', { class: 's5-plus', 'aria-hidden': 'true', style: { left: `${r.left}px`, top: `${r.bottom + 6}px` } }, [munt(20), h('span', { class: 'kop' }, `+${bedrag}`)]);
    document.body.append(b);
    if (rustig) { setTimeout(() => b.remove(), 900); return; }
    const anim = b.animate([{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1, offset: 0.25 }, { transform: 'translateY(-10px)', opacity: 0 }], { duration: 1100, easing: 'ease-out' });
    anim.onfinish = () => b.remove();
    setTimeout(() => b.remove(), 1500);
  }

  /* ---------- werker (spel 7) ---------- */
  function vindWerker() {
    staat.markeerWerkerGevonden(5);
    if (rustig) return;
    werkerKnoop.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 350, iterations: 2 });
  }

  /* ---------- deal en resultaat ---------- */
  function deal(id, bod) {
    af = true;
    lus.stop();
    const laagste = M.laagstePrijs(ronde);
    staat.koopProduct({ product: product.id, bod, laagste });
    const eersteKeer = klaar({ vaardigheid: info.vaardigheid });
    const s = staat.lees();
    const volgende = M.beschikbaarProduct(s.producten, isOpen);
    toonResultaat({
      root,
      icoon: product.id,
      label: `${info.titel.toUpperCase()} · KLAAR`,
      titel: 'Deal!',
      inhoud: handdruk(id),
      tegels: [
        { label: 'BETAALD', waarde: bod, kleur: '#1F7A3A', icoon: munt(20) },
        { label: 'LAAGSTE', waarde: laagste, kleur: '#0E6A98', icoon: munt(20) },
        { label: 'OVER', waarde: s.geld, kleur: '#9A5B00', icoon: munt(20) },
      ],
      beloning: { vaardigheid: info.vaardigheid, eersteKeer },
      opnieuw: volgende ? opnieuw : null,
    });
  }

  /* ---------- start ---------- */
  // Terug op de markt: wie al verdrietig of boos is, kijkt nog steeds zo.
  if (ronde) for (const id of M.HANDELAARS) zet(id, THUIS[id], 0, gezichtVan(id), false);
  const lus = maakLus({ update, teken });
  update(0);
  teken();
  lus.start();
  if (datum.isTest()) window.pinoDebug = { spel: 5, get ronde() { return ronde; }, pino: pinoStaat };

  return () => {
    gestopt = true;
    lus.stop();
    invoer.vernietig();
    afmelden();
    for (const id of timers) clearTimeout(id);
    document.querySelectorAll('.s5-plus').forEach((n) => n.remove());
    if (window.pinoDebug && window.pinoDebug.spel === 5) delete window.pinoDebug;
  };
}

/** Pino en de handelaar met een blije badge (Spel5-Klaar). */
function handdruk(id) {
  return el('svg', { class: 'ic s5-handdruk', viewBox: '0 0 200 90', width: 220, height: 99, role: 'img', 'aria-label': `Pino en ${INFO[id].naam} sluiten de deal` }, [
    el('ellipse', { cx: 100, cy: 84, rx: 80, ry: 5, fill: '#CDE4F0' }),
    pino(40, 6, 'vinger'),
    persoon(104, 6, { ...INFO[id].persoon, flip: true }),
    use('s5-stemming-blij', 86, 0, 28, 28),
  ]);
}

/* ---------- productenalbum (besluit 67) ---------- */

function album({ root, dag, info, naarMarkt, bekijk }) {
  const s = staat.lees();
  const spel7 = datum.deurOpen(7);
  const rijen = M.albumToestand(s.producten, isOpen);
  const scores = s.scores[5] || {};

  // Slinger met lampions boven de prijskaartjes.
  const slinger = el('svg', { class: 's5-slinger', viewBox: '0 0 326 44', 'aria-hidden': 'true', preserveAspectRatio: 'xMidYMin meet' }, [
    el('path', { d: 'M0 10 q81 22 163 0 t163 0', fill: 'none', stroke: '#8B4A1E', 'stroke-width': 2.5 }),
    ...[[30, 16, '#FF5E5B'], [110, 18, '#FFC93C'], [190, 14, '#FF5E5B'], [270, 18, '#FF8A3D']].map(([x, y, k]) => use('s5-lampion', x, y, 16, 23, k)),
  ]);

  const kaartjes = rijen.map(({ product: p, toestand }, n) => {
    const naam = p.label;
    const productSvg = el('svg', { class: `ic s5-product${toestand === 'dicht' ? ' s5-silhouet' : ''}`, viewBox: '0 0 48 48', width: 72, height: 72, 'aria-hidden': 'true' },
      [use(p.symbool, 0, 0, 48, 48)]);
    const voet = [];
    // Geen deurtje-icoon: waar een product voor nodig is, ontdekt Pino zelf (besluit 72).
    if (toestand === 'gekocht' && scores[p.id]) voet.push(h('span', { class: 's5-betaald' }, [munt(18), h('span', { class: 'kop' }, String(scores[p.id].betaald))]));

    const label = toestand === 'gekocht' ? `${naam}, gekocht${scores[p.id] ? `, ${scores[p.id].betaald} munten` : ''}`
      : toestand === 'dicht' ? `${naam}, op slot` : `${naam}, nog niet gekocht`;
    const kinderen = [
      h('span', { class: 's5-gaatje', 'aria-hidden': 'true' }),
      productSvg,
      h('div', { class: 's5-kaartje-voet' }, voet),
      toestand === 'gekocht' ? h('span', { class: 's5-stempel', 'aria-hidden': 'true' }, [icoon('vink', 30)]) : null,
      toestand === 'dicht' ? h('span', { class: 's5-slot', 'aria-hidden': 'true' }, [icoon('slot', 30)]) : null,
    ];
    const kaartje = toestand === 'gekocht' && spel7
      ? h('button', { type: 'button', class: 's5-kaartje s5-kaartje-gekocht', 'aria-label': `${label}. Markt bekijken`, onclick: bekijk }, kinderen)
      : h('div', { class: `s5-kaartje s5-kaartje-${toestand}`, role: 'img', 'aria-label': label }, kinderen);
    return h('div', { class: `s5-hanger s5-hanger-${n + 1}` }, [
      h('span', { class: 's5-touwtje', 'aria-hidden': 'true' }),
      kaartje,
      toestand === 'beurt'
        ? h('button', { type: 'button', class: 's5-markt-knop', 'aria-label': 'Naar de markt', onclick: naarMarkt }, [
          el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 30, height: 30, 'aria-hidden': 'true' }, [use('s5-praat', 0, 0, 48, 48, '#FFFFFF'),
            el('circle', { cx: 17, cy: 22, r: 2.2, fill: '#1FA3DC' }), el('circle', { cx: 24, cy: 22, r: 2.2, fill: '#1FA3DC' }), el('circle', { cx: 31, cy: 22, r: 2.2, fill: '#1FA3DC' })]),
        ])
        : null,
    ]);
  });

  const geldPil = h('span', { class: 'teller-pil s5-geld', role: 'img', 'aria-label': `Portemonnee: ${s.geld} munten` }, [munt(24), h('span', {}, String(s.geld))]);
  root.replaceChildren(h('div', { class: 'scherm spel s5-album' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', rechts: geldPil }),
    h('section', { class: 'kaart s5-albumkaart' }, [
      // Filter voor het lichtblauwe silhouet van producten waarvan het spel nog dicht is (statisch, beweegt niet).
      el('svg', { width: 0, height: 0, class: 's5-defs', 'aria-hidden': 'true' }, [
        el('filter', { id: 's5-sil' }, [el('feFlood', { 'flood-color': '#B8C9D6' }), el('feComposite', { in2: 'SourceAlpha', operator: 'in' })]),
      ]),
      slinger,
      h('div', { class: 's5-kaartjes' }, kaartjes),
    ]),
  ]));
  queueMicrotask(() => root.querySelector('.s5-markt-knop')?.focus({ preventScroll: true }));
  return () => {};
}
