// Spel 6 · Selfdefense — zie specs/spel6.md.
// Canvas-actiespel in twee fasen. Fase 1: Pino loopt de eerste START_PAUZE ms vrij over de nachtmarkt (joystick of
// pijltjes, zoals spel 1 en 5); dan gaat de besturing uit, loopt een dief naar haar toe en grijpt naar haar ketting;
// de rode knop verschijnt en ze heeft REACTIE ms. Fase 2: Pino houdt hem in een armklem tot de politie er is;
// move-iconen vallen in vier banen naar de vier knoppen en moeten worden ingedrukt als ze óp de knop liggen
// (regels in klem.js). Een gelukte move toont kort zijn scène; knee on belly lukt alleen met kniebeschermers.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { el, use } from '../sprites.js';
import { maakLus } from './lus.js';
import { voorbereidSprites, tekenSprite } from './spritesheet.js';
import { maakCanvas, maakLaag, rondeRect } from './canvas.js';
import { maakInvoer } from '../invoer.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { werkerGevonden, terugKnop, werkerVak } from './zoeken.js';
import { ga } from '../router.js';
import * as K from './klem.js';

/* ---------- tuning (specs/spel6.md) ---------- */
const START_PAUZE = 2000;     // ms: zo lang loopt iedereen blij rond voordat de dief verschijnt
const REACTIE = 2000;         // ms om op de rode knop te drukken
const SNELHEID = 120;         // px/s: Pino loopt, zolang de dief er nog niet is
const JOYSTICK_VERTRAGING = 250;  // ms vasthouden voordat de joystick verschijnt (besluiten.md #23, zoals spel 1)
const DIEF_SNELHEID = 130;    // px/s aanlopen
const VLUCHT_SNELHEID = 170;  // px/s wegrennen (na de greep en als hij uit de klem loskomt)
const VLUCHT_NA = 500;        // ms na het verdwijnen van de dief opent het resultaat
const POLITIE_RIT = 600;      // ms: de politieauto rijdt de scène in
const POLITIE_BLIJF = 1500;   // ms tot het resultaat na het einde van de klem
const KNOP_FLITS = 180;       // ms ring om een move-knop na een druk of een gemiste noot
const MOVE_SCENE = 900;       // ms: de scène van een gelukte move fadet in en uit
const KNIE_POP = 900;         // ms: de ontbrekende kniebeschermers poppen op in de knop

/* ---------- scène (358 × 530; posities uit steeg() in design/generators/spel6_build2.py) ---------- */
const B = 358;
const H = 530;
const PINO_START = { x: 155, y: 200 };
// Waar Pino mag lopen (linkerbovenhoek van haar 48×72-frame): zo passen de klem en de worstelbalk overal binnen de
// scène en boven de banen, en blijft ze onder de toonbanken.
const LOOP = { x0: 56, x1: 254, y0: 150, y1: 212 };
const DIEF_START = B + 14;
// Alles hieronder is ten opzichte van Pino: de dief loopt naar waar zij op dat moment staat.
const DIEF_NAAST = { x: 46, y: 2 };                   // daar staat de dief als hij grijpt
const KLEM = { x: -46, y: -4 };                       // s6-klem 140×90
const BALK = { x: -51, y: 98, b: 150, h: 12 };        // worstelbalk onder het tweetal
const POLITIE = { b: 88, y: 36 };                     // politieauto naast de klem
const WERKER = werkerVak(317, 230, 0.7);           // half achter bezoeker 4; draagt een lampion (wk-lampion, besluit 108)
const DIEF_KLEUR = '#2F3A4A';
const DIEF_HUID = '#E8B48A';

// Onder de scène (10 px ertussen) ligt een strook van 150 px met de rode knop of de vier ronde move-knoppen.
// Het notencanvas ligt over scène én strook heen, zodat een noot tot op zijn knop valt.
const STROOK_TOP = H + 10;
const HK = STROOK_TOP + 150;                          // hoogte van scène + strook
const BAAN_B = 83.5;                                  // vier banen, gelijk aan de vier knoppen onder de scène
const BAAN_TUSSEN = 8;
const BAAN_TOP = 324;
const NOOT_START = BAAN_TOP + 22;
const RAAK_Y = STROOK_TOP + BAAN_B / 2;               // het midden van de knop: daar moet de noot liggen
const NOOT_KLEIN = 0.55;                              // de noot groeit van 55 % naar de maat van de knop
const baanMidden = (i) => i * (BAAN_B + BAAN_TUSSEN) + BAAN_B / 2;

const LAMPIONS = [[18, 36, '#FF5E5B'], [78, 44, '#FFC93C'], [138, 40, '#FF5E5B'], [198, 36, '#FF8A3D'], [258, 42, '#FF5E5B'], [318, 38, '#FFC93C']];
const KRAMEN = [
  { x: 8, y: 50, luifel: '#39D353', waar: 'stof', persoon: { kleding: '#39D353', huid: '#F6C9A8', haar: 'bh-knot', haarkleur: '#2B1A0E' } },
  { x: 220, y: 50, luifel: '#FFC93C', waar: 'lampion', persoon: { kleding: '#5BC0EB', huid: '#E8B48A', haar: 'bh-stekel', haarkleur: '#2B1A0E', acc: ['acc-nonla'] } },
];
// Marktbezoekers (BEZOEKERS in spel6_sprites.py).
const BEZOEKERS = [
  { kleding: '#39D353', huid: '#E8B48A', haar: 'bh-kort', haarkleur: '#2B1A0E' },
  { kleding: '#1FA3DC', huid: '#C98B5A', haar: 'bh-knot', haarkleur: '#1E3A4C', jurk: true },
  { kleding: '#FFC93C', huid: '#E8B48A', haar: 'bh-lang', haarkleur: '#2B1A0E', jurk: true, acc: ['acc-nonla'] },
  { kleding: '#9B6BFF', huid: '#F6C9A8', haar: 'bh-stekel', haarkleur: '#4A3426' },
  { kleding: '#FF8A3D', huid: '#C98B5A', haar: 'bh-kort', haarkleur: '#4A3426', acc: ['acc-bril'] },
  { kleding: '#C43B38', huid: '#E8B48A', haar: 'bh-knot', haarkleur: '#2B1A0E', jurk: true },
];
// Waar ze lopen: vaste rij (y), heen en weer tussen x0 en x1 met v px/s. v = 0: staat stil (vóór de werker).
const MENIGTE = [
  { wie: 0, y: 118, s: 0.78, x0: 132, x1: 166, v: 16 },
  { wie: 1, y: 128, s: 0.8, x0: 186, x1: 214, v: 13 },
  { wie: 3, y: 176, s: 0.86, x0: 10, x1: 46, v: 17 },
  { wie: 4, y: 184, s: 0.9, x0: 276, x1: 276, v: 0, werker: true },
  { wie: 2, y: 196, s: 0.9, x0: 66, x1: 112, v: 19 },
  { wie: 5, y: H - 120, s: 1, x0: 8, x1: 84, v: 23 },
  { wie: 1, y: H - 96, s: 1, kind: true, x0: 100, x1: 158, v: 30 },
  { wie: 3, y: H - 116, s: 1, x0: 224, x1: 282, v: 21 },
  { wie: 0, y: H - 84, s: 0.96, x0: 172, x1: 244, v: 26 },
];
const MOVE_LABEL = { sweep: 'Sweep', 'side-control': 'Side control', 'knee-on-belly': 'Knee on belly', 'rear-naked-choke': 'Rear naked choke' };
const TOETS_BAAN = {
  ArrowLeft: 0, ArrowDown: 1, ArrowUp: 2, ArrowRight: 3,
  Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3, Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3,
};

function persoonSprites(p) {
  const lijst = [{ id: p.jurk ? 'b-jurk' : 'b-lijf', kleur: p.kleding }, { id: 'b-handen', kleur: p.huid }, { id: 'b-hoofd', kleur: p.huid }, { id: p.haar, kleur: p.haarkleur }];
  for (const a of p.acc || []) lijst.push({ id: a });
  return lijst;
}

function spriteLijst() {
  const lijst = [
    { id: 's5-kraam-voor' }, { id: 's5-gloed' }, { id: 'wk-lampion' },
    { id: 'b-blij' }, { id: 'b-bang' }, { id: 'b-lach' },
    { id: 'pino-staan' }, { id: 'pino-loop' }, { id: 'pino-sip' }, { id: 's6-ketting' }, { id: 's6-tril' },
    { id: 'b-lijf', kleur: DIEF_KLEUR }, { id: 'b-lijf-los', kleur: DIEF_KLEUR }, { id: 'b-handen', kleur: DIEF_HUID }, { id: 'b-hoofd', kleur: DIEF_HUID },
    { id: 'z-kap' }, { id: 'z-gezicht' }, { id: 'z-blij' }, { id: 'z-arm' }, { id: 'z-arm-hang' }, { id: 's5-ketting' },
    { id: 's6-klem' }, { id: 's6-klem-ketting' }, { id: 's6-klem-knie' }, { id: 's6-politie' },
  ];
  for (const k of ['#FF5E5B', '#FFC93C', '#FF8A3D']) lijst.push({ id: 's5-lampion', kleur: k });
  for (const k of KRAMEN) lijst.push({ id: 's5-kraam-achter', kleur: k.luifel }, { id: `s5-waar-${k.waar}` }, ...persoonSprites(k.persoon));
  for (const b of BEZOEKERS) lijst.push(...persoonSprites(b));
  for (const m of K.BANEN) lijst.push({ id: `s6-knop-${m}` });
  return lijst;
}

/** Wordt door het laadscherm aangeroepen: sprite sheet klaarzetten. */
export async function voorbereid() {
  await voorbereidSprites(spriteLijst());
}

/* ---------- steeg tekenen (gedeeld door het spel en de polaroid in spel 7) ---------- */

/** Bezoekers op hun beginplek. */
function beginMenigte() {
  return MENIGTE.map((m, i) => ({
    ...m, p: { ...BEZOEKERS[m.wie], kind: !!m.kind },
    x: m.x0 + (m.x1 - m.x0) * ((i * 0.37) % 1), richting: i % 2 ? 1 : -1, pauze: 0, fase: i * 0.7,
  }));
}

function tekenLampion(c, x, y, kleur) {
  tekenSprite(c, 's5-gloed', x - 28, y - 22, { w: 80, h: 80 });
  tekenSprite(c, 's5-lampion', x, y, { w: 24, h: 34, kleur });
}

/** Kasseien, lampionslinger en lampions. */
function tekenSteegGrond(g) {
  g.fillStyle = '#556B8E'; g.fillRect(0, 0, B, H);
  g.fillStyle = '#4E6384';
  for (let y = 0; y < H; y += 28) {
    const verschuif = (y / 28) % 2 ? 14 : 0;
    for (let x = 0; x < B; x += 28) { rondeRect(g, x + verschuif + 1, y + 1, 26, 26, 4); g.fill(); }
  }
  g.strokeStyle = '#8B4A1E'; g.lineWidth = 2.5;
  g.stroke(new Path2D('M0 28 q90 22 180 0 t178 0'));
  for (const [x, y, kleur] of LAMPIONS) tekenLampion(g, x, y, kleur);
}

// Persoon 48×72 (kind × 0,72): lijf of jurk → hoofd → haar → gezicht → accessoires.
function tekenPersoon(c, p, x, y, { schaal = 1, flip = false, gezicht = 'b-blij' } = {}) {
  const k = schaal * (p.kind ? 0.72 : 1);
  const o = { w: 48 * k, h: 72 * k, flip };
  tekenSprite(c, p.jurk ? 'b-jurk' : 'b-lijf', x, y, { ...o, kleur: p.kleding });
  tekenSprite(c, 'b-handen', x, y, { ...o, kleur: p.huid });
  tekenSprite(c, 'b-hoofd', x, y, { ...o, kleur: p.huid });
  tekenSprite(c, p.haar, x, y, { ...o, kleur: p.haarkleur });
  tekenSprite(c, gezicht, x, y, o);
  for (const a of p.acc || []) tekenSprite(c, a, x, y, o);
}

function tekenKraam(c, k, gezicht) {
  tekenSprite(c, 's5-kraam-achter', k.x, k.y, { kleur: k.luifel });
  tekenPersoon(c, k.persoon, k.x + 41, k.y + 28, { gezicht });
  tekenSprite(c, 's5-kraam-voor', k.x, k.y);
  tekenSprite(c, `s5-waar-${k.waar}`, k.x + 14, k.y + 58, { w: 100, h: 30 });
}

function tekenLantaarnpaal(c) {
  c.fillStyle = '#8B4A1E'; c.fillRect(338, H - 118, 4, 60);
  tekenLampion(c, 330, H - 150, '#FF8A3D');
}

/** Maat van de steeg (scène-eenheden). */
export const STEEG = { B, H };

/**
 * De steeg in rust, stil: kramen, bezoekers op hun beginplek, de lantaarnpaal en Pino met de ketting op haar
 * startplek; zonder werker en dief. c is een context in scène-eenheden (B × H). Eerst voorbereid() afwachten.
 * Voor de polaroid in het album van spel 7 (besluit 107).
 */
export function tekenStilleSteeg(c) {
  tekenSteegGrond(c);
  for (const k of KRAMEN) tekenKraam(c, k, 'b-blij');
  const lagen = beginMenigte().map((m) => ({
    y: m.y + 72 * m.s * (m.kind ? 0.72 : 1),
    f: () => tekenPersoon(c, m.p, m.x, m.y, { schaal: m.s, flip: m.richting < 0 }),
  }));
  lagen.push({ y: H - 58, f: () => tekenLantaarnpaal(c) });
  lagen.push({ y: PINO_START.y + 72, f: () => { tekenSprite(c, 'pino-staan', PINO_START.x, PINO_START.y); tekenSprite(c, 's6-ketting', PINO_START.x, PINO_START.y); } });
  lagen.sort((a, b) => a.y - b.y);
  for (const l of lagen) l.f();
}

/** Heeft Pino kniebeschermers? In testmodus overschrijft ?knie=0|1 de staat (specs/ontwikkelaarsopties.md). */
function heeftKnie() {
  if (datum.isTest()) {
    let p = null;
    try { p = new URLSearchParams(location.search).get('knie'); } catch { /* negeren */ }
    if (p === '0' || p === '1') return p === '1';
  }
  return staat.lees().producten.includes('kniebeschermers');
}

export function start({ root, dag, info, klaar, zoek = false }) {
  let opruim = null;
  const ronde = () => { if (opruim) opruim(); opruim = speel({ root, dag, info, klaar, zoek, opnieuw: ronde }); };
  ronde();
  return () => { if (opruim) opruim(); opruim = null; };
}

function speel({ root, dag, info, klaar, opnieuw, zoek = false }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const knie = heeftKnie();
  let gestopt = false;

  /* ---------- DOM ---------- */
  const svgIcoon = (id, maat, kleur = null) => el('svg', { class: 'ic', viewBox: '0 0 48 48', width: maat, height: maat, 'aria-hidden': 'true' }, [use(id, 0, 0, 48, 48, kleur)]);

  const politieVulling = h('span', { style: { width: '0%' } });
  const politieTijd = h('span', { class: 'kop s6-tijd' }, formatteerTijd(K.DUUR / 1000));
  const politieKaart = h('div', { class: 'kaart tijdkaart s6-politie s6-weg', role: 'img', 'aria-label': 'Politie onderweg' }, [
    svgIcoon('s6-politie', 34),
    h('span', { class: 'balk s6-balk', 'aria-hidden': 'true' }, [politieVulling]),
    politieTijd,
  ]);

  const { canvas, ctx, begin } = maakCanvas(B, H, { label: 'Drukke steeg op de nachtmarkt met kramen, lampions en bezoekers; Pino staat in het midden' });
  const knoppenLaag = h('div', { class: 's6-knoppen' });
  if (datum.deurOpen(7)) {
    knoppenLaag.append(h('button', {
      type: 'button', class: 's6-knop-werker', 'aria-label': 'Werker', onclick: vindWerker,
      style: { left: pct(WERKER.x - 8, B), top: pct(WERKER.y - 6, H), width: pct(WERKER.b + 16, B), height: pct(WERKER.h + 12, H) },
    }));
  }
  const kaart = h('div', { class: 'scene-kaart s6-kaart' }, [canvas, knoppenLaag]);
  // Noten: eigen canvas over scène en knoppenstrook, zonder pointer-events (de knoppen eronder blijven knoppen).
  const noten = maakCanvas(B, HK, { klasse: 's6-noten' });

  // Rode reactieknop met slinkende ring (alleen icoon); verschijnt pas als de dief zijn hand uitsteekt.
  const OMTREK = 2 * Math.PI * 70;
  const ring = el('circle', { cx: 80, cy: 80, r: 70, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-dasharray': OMTREK, 'stroke-dashoffset': 0, transform: 'rotate(-90 80 80)' });
  const reageerKnop = h('button', { type: 'button', class: 's6-reageer', 'aria-label': 'Reageer nu', hidden: true }, [
    el('svg', { class: 'ic s6-ring', viewBox: '0 0 160 160', 'aria-hidden': 'true' }, [
      el('circle', { cx: 80, cy: 80, r: 70, fill: 'none', stroke: 'rgba(255,255,255,0.35)', 'stroke-width': 8 }), ring,
    ]),
    svgIcoon('s6-reageer', 60, '#FFFFFF'),
  ]);
  // Ronde move-knoppen met de tekening van de move; geen tekst, en ook de toetsen 1–4 staan nergens.
  const moveSvg = (id, klasse) => el('svg', { class: klasse, viewBox: '0 0 100 100', 'aria-hidden': 'true' }, [use(id, 0, 0, 100, 100)]);
  const moveKnoppen = K.BANEN.map((m) => h('button', { type: 'button', class: 's6-move', 'aria-label': MOVE_LABEL[m] }, [moveSvg(`s6-knop-${m}`, 'ic s6-move-icoon')]));
  const moves = h('div', { class: 's6-moves', role: 'group', 'aria-label': 'Jiujitsu-moves', hidden: true }, moveKnoppen);

  const scherm = h('div', { class: 'scherm spel spel6' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', ...terugKnop(zoek) }),
    politieKaart,
    h('div', { class: 's6-veld' }, [h('div', { class: 's6-kolom' }, [kaart, h('div', { class: 's6-onder' }, [reageerKnop, moves]), noten.canvas])]),
  ]);
  root.replaceChildren(scherm);

  /* ---------- spelstaat ---------- */
  // fase: rust → nadert → greep → klem → politie (gelukt) | vlucht (mislukt)
  const s = { fase: 'rust', t: 0, klok: 0, reactie: null, werkerHup: 0, vluchtKlaar: null, af: false };
  const dief = { x: DIEF_START, y: PINO_START.y + DIEF_NAAST.y, zichtbaar: false, flip: false, grijpt: false, buit: false, loopt: false };
  const pino = { x: PINO_START.x, y: PINO_START.y, richting: 1, loopTijd: 0, pose: 'staan', ketting: true };
  const menigte = beginMenigte();
  let klem = null;
  // Testmodus: de staat plus stap(ms) om het spel met de hand vooruit te zetten (in stappen van hooguit 50 ms).
  if (datum.isTest()) {
    window.pinoDebug = {
      spel: 6, s, pino, dief, get klem() { return klem; }, reageer, drukBaan,
      stap(ms = 16) { for (let rest = ms; rest > 0 && !s.af; rest -= 50) update(Math.min(50, rest) / 1000); if (!s.af) teken(); },
    };
  }

  /* ---------- invoer ---------- */
  const acties = { actie: reageerKnop };
  moveKnoppen.forEach((knop, i) => { acties[`baan${i}`] = knop; });
  const invoer = maakInvoer({
    acties,
    bijActie(naam) {
      if (naam === 'terug') { ga(zoek ? '/spel/7' : `/deur/${dag}`); return; }
      if (naam === 'actie') reageer();
      else if (naam.startsWith('baan')) drukBaan(Number(naam.slice(4)));
    },
  });
  function opToets(ev) {
    // Op de fysieke toets, met ev.key als terugval (toetsenborden zonder ev.code); nergens zichtbaar in de UI.
    const baan = TOETS_BAAN[ev.code] ?? TOETS_BAAN[`Digit${ev.key}`];
    if (baan === undefined || ev.repeat || ev.metaKey || ev.ctrlKey) return;
    ev.preventDefault();
    drukBaan(baan);
  }
  window.addEventListener('keydown', opToets);
  // Lopen (alleen in de eerste START_PAUZE ms): joystick door vasthouden op het scherm, of pijltjes/WASD. Een eigen
  // invoer, zodat de hele besturing in één keer uit kan zodra de dief verschijnt.
  const loopInvoer = maakInvoer({ joystick: { element: scherm, vertraging: JOYSTICK_VERTRAGING } });

  /* ---------- regels ---------- */
  function naarFase(fase) { s.fase = fase; s.t = 0; }

  function reageer() {
    if (s.fase !== 'greep' || gestopt) return;
    s.reactie = s.t;
    reageerKnop.hidden = true;
    moves.hidden = false;
    politieKaart.classList.remove('s6-weg');
    klem = K.maakKlem({ knie });
    dief.zichtbaar = false;
    naarFase('klem');
  }

  function drukBaan(baan) {
    if (s.fase !== 'klem' || gestopt) return;
    const r = K.druk(klem, baan, s.t);
    knopFlits(baan, r.soort === 'raak' ? 'raak' : 'mis');
    if (r.soort === 'raak') toonMove(K.BANEN[baan]);
    else if (r.soort === 'knie') toonKnieMis(baan);
  }

  const timers = new Set();
  const straks = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };

  // Paarse ring om de knop bij een gelukte move, rode bij een misser.
  const knopTimers = new Map();
  function knopFlits(baan, soort) {
    const knop = moveKnoppen[baan];
    knop.classList.remove('s6-move-raak', 's6-move-mis');
    knop.classList.add(`s6-move-${soort}`);
    clearTimeout(knopTimers.get(baan));
    knopTimers.set(baan, setTimeout(() => knop.classList.remove('s6-move-raak', 's6-move-mis'), KNOP_FLITS));
  }

  // De scène van de gelukte move fadet kort in en uit, midden in de scène boven de banen.
  function toonMove(move) {
    kaart.querySelectorAll('.s6-gelukt').forEach((e) => e.remove());
    const d = h('div', { class: 's6-gelukt', 'aria-hidden': 'true' }, [moveSvg(`s6-scene-${move}`, 'ic')]);
    kaart.append(d);
    straks(() => d.remove(), MOVE_SCENE);
  }

  // Knee on belly zonder kniebeschermers: de ontbrekende kniebeschermers poppen kort op in de knop.
  function toonKnieMis(baan) {
    const knop = moveKnoppen[baan];
    knop.querySelectorAll('.s6-knie-mis').forEach((e) => e.remove());
    const d = h('span', { class: 's6-knie-mis', 'aria-hidden': 'true' }, [
      el('svg', { class: 'ic', viewBox: '0 0 48 48' }, [
        use('s5-kniebeschermers', 0, 0, 48, 48, null, { opacity: 0.45 }),
        el('path', { d: 'M9 9 L39 39 M39 9 L9 39', fill: 'none', stroke: '#FF5E5B', 'stroke-width': 5, 'stroke-linecap': 'round' }),
      ]),
    ]);
    knop.append(d);
    straks(() => d.remove(), KNIE_POP);
  }

  /** De dief gaat er met de ketting vandoor, terug naar waar hij vandaan kwam. */
  function vlucht() {
    reageerKnop.hidden = true;
    politieKaart.classList.add('s6-weg');
    pino.pose = 'sip';
    pino.ketting = false;
    Object.assign(dief, { x: pino.x + DIEF_NAAST.x, y: pino.y + DIEF_NAAST.y, zichtbaar: true, flip: true, grijpt: true, buit: true, loopt: true });
    s.vluchtKlaar = null;
    naarFase('vlucht');
  }

  function update(dt) {
    const ms = dt * 1000;
    s.klok += ms;
    s.t += ms;
    if (s.werkerHup > 0) s.werkerHup = Math.max(0, s.werkerHup - ms);

    // Bezoekers lopen heen en weer zolang er niets aan de hand is.
    if (s.fase === 'rust' || s.fase === 'nadert') {
      for (const m of menigte) {
        if (!m.v) continue;
        if (m.pauze > 0) { m.pauze -= ms; continue; }
        m.x += m.richting * m.v * dt;
        if (m.x <= m.x0 || m.x >= m.x1) {
          m.x = Math.max(m.x0, Math.min(m.x1, m.x));
          m.richting *= -1;
          m.pauze = 400 + Math.random() * 1000;
        }
      }
    }

    if (s.fase === 'rust') {
      const { dx, dy } = loopInvoer.as();
      if (dx || dy) {
        pino.x = Math.max(LOOP.x0, Math.min(LOOP.x1, pino.x + dx * SNELHEID * dt));
        pino.y = Math.max(LOOP.y0, Math.min(LOOP.y1, pino.y + dy * SNELHEID * dt));
        if (dx) pino.richting = dx > 0 ? 1 : -1;
        pino.loopTijd += dt;
        pino.pose = Math.floor(pino.loopTijd / 0.18) % 2 === 0 ? 'loop' : 'staan';
      } else {
        pino.loopTijd = 0;
        pino.pose = 'staan';
      }
      // In de zoekmodus van spel 7 komt de dief niet: Pino loopt vrij rond tussen de bezoekers (besluit 106).
      if (!zoek && s.t >= START_PAUZE) {
        // De dief komt: besturing uit, Pino blijft staan waar ze is en hij loopt naar die plek.
        loopInvoer.vernietig();
        pino.pose = 'staan';
        Object.assign(dief, { x: DIEF_START, y: pino.y + DIEF_NAAST.y, zichtbaar: true, loopt: true });
        naarFase('nadert');
      }
    } else if (s.fase === 'nadert') {
      dief.x -= DIEF_SNELHEID * dt;
      if (dief.x <= pino.x + DIEF_NAAST.x) {
        dief.x = pino.x + DIEF_NAAST.x;
        dief.loopt = false;
        dief.grijpt = true;
        for (const m of menigte) m.pauze = 0;
        reageerKnop.hidden = false;
        naarFase('greep');
      }
    } else if (s.fase === 'greep') {
      ring.setAttribute('stroke-dashoffset', String(OMTREK * Math.min(1, s.t / REACTIE)));
      if (s.t >= REACTIE) vlucht();
    } else if (s.fase === 'klem') {
      K.tik(klem, s.t).forEach((n) => knopFlits(n.baan, 'mis'));
      const rest = Math.max(0, K.DUUR - s.t);
      politieVulling.style.width = `${Math.min(100, (s.t / K.DUUR) * 100)}%`;
      const tekst = formatteerTijd(Math.ceil(rest / 1000));
      if (politieTijd.textContent !== tekst) politieTijd.textContent = tekst;
      if (klem.los) { moves.hidden = true; vlucht(); }
      else if (K.gehaald(klem, s.t)) { moves.hidden = true; naarFase('politie'); }
    } else if (s.fase === 'vlucht') {
      dief.x += VLUCHT_SNELHEID * dt;
      if (dief.x > B + 24 && s.vluchtKlaar === null) s.vluchtKlaar = s.t;
      if (s.vluchtKlaar !== null && s.t - s.vluchtKlaar >= VLUCHT_NA) einde(false);
    } else if (s.fase === 'politie') {
      if (s.t >= POLITIE_BLIJF) einde(true);
    }
  }

  /* ---------- achtergrond (één keer) ---------- */
  const achtergrond = maakLaag(B, H);
  function tekenAchtergrond() { tekenSteegGrond(achtergrond.ctx); }

  /* ---------- tekenen ---------- */
  const wip = (fase) => (rustig ? 0 : -Math.abs(Math.sin((s.klok / 1000 + fase) * Math.PI * 5)) * 2);

  // Omstanders: blij, bang vanaf de greep (en als de dief ontsnapt), lachend als de politie er is.
  function gezichtNu() {
    if (s.fase === 'greep' || s.fase === 'vlucht') return 'b-bang';
    if (s.fase === 'politie') return 'b-lach';
    return 'b-blij';
  }

  function tekenBezoeker(m, gezicht) {
    const loopt = (s.fase === 'rust' || s.fase === 'nadert') && m.v && m.pauze <= 0;
    const k = m.s * (m.kind ? 0.72 : 1);
    // Wie schrikt, kijkt naar het midden; wie loopt, kijkt in de looprichting.
    const flip = loopt ? m.richting < 0 : (s.fase === 'rust' || s.fase === 'nadert' ? m.richting < 0 : m.x + 24 * k > pino.x + 24);
    if (m.werker) {
      const hup = s.werkerHup > 0 && !rustig ? -Math.abs(Math.sin((s.werkerHup / 350) * Math.PI)) * 6 : 0;
      tekenSprite(ctx, 'wk-lampion', WERKER.x, WERKER.y + hup, { w: WERKER.b, h: WERKER.h });
    }
    tekenPersoon(ctx, m.p, m.x, m.y + (loopt ? wip(m.fase) : 0), { schaal: m.s, flip, gezicht });
  }

  function tekenPino() {
    const flip = pino.pose !== 'sip' && pino.richting < 0;
    tekenSprite(ctx, `pino-${pino.pose}`, pino.x, pino.y, { flip });
    if (pino.ketting) tekenSprite(ctx, 's6-ketting', pino.x, pino.y, { flip });
    if (s.fase === 'greep') {
      const tril = rustig ? 0 : Math.sin(s.klok / 28) * 1.5;
      tekenSprite(ctx, 's6-tril', pino.x + 6 + tril, pino.y + 17, { w: 36, h: 36 });
    }
  }

  // De dief: gewoon lijf met twee armen, of (grijpend/rennend) armloos lijf + grijparm + hangende arm.
  function tekenDief() {
    const y = dief.y + (dief.loopt ? wip(0.3) : 0);
    const o = { flip: dief.flip };
    tekenSprite(ctx, dief.grijpt ? 'b-lijf-los' : 'b-lijf', dief.x, y, { ...o, kleur: DIEF_KLEUR });
    if (!dief.grijpt) tekenSprite(ctx, 'b-handen', dief.x, y, { ...o, kleur: DIEF_HUID });
    tekenSprite(ctx, 'b-hoofd', dief.x, y, { ...o, kleur: DIEF_HUID });
    tekenSprite(ctx, 'z-kap', dief.x, y, o);
    tekenSprite(ctx, dief.buit ? 'z-blij' : 'z-gezicht', dief.x, y, o);
    if (dief.grijpt) {
      tekenSprite(ctx, 'z-arm-hang', dief.x, y, o);
      tekenSprite(ctx, 'z-arm', dief.x, y, o);
    }
    if (dief.buit) tekenSprite(ctx, 's5-ketting', dief.flip ? dief.x + 53 : dief.x - 21, y + 28, { w: 16, h: 16 });
  }

  function tekenKlem() {
    const schud = rustig || s.fase !== 'klem' ? 0 : Math.sin(s.klok / 45) * (klem.vrij / K.VOL) * 2.5;
    const x = pino.x + KLEM.x + schud;
    const y = pino.y + KLEM.y;
    tekenSprite(ctx, 's6-klem', x, y);
    tekenSprite(ctx, 's6-klem-ketting', x, y);
    if (knie) tekenSprite(ctx, 's6-klem-knie', x, y);
  }

  function tekenBalk() {
    ctx.fillStyle = '#E6EFF5';
    const bx = pino.x + BALK.x;
    const by = pino.y + BALK.y;
    rondeRect(ctx, bx, by, BALK.b, BALK.h, BALK.h / 2); ctx.fill();
    const w = BALK.b * (klem.vrij / K.VOL);
    if (w <= 0) return;
    ctx.save();
    rondeRect(ctx, bx, by, Math.max(BALK.h, w), BALK.h, BALK.h / 2); ctx.clip();
    ctx.fillStyle = '#FF5E5B'; ctx.fillRect(bx, by, w + BALK.h, BALK.h);
    ctx.fillStyle = '#C43B38'; ctx.fillRect(bx, by + BALK.h - 4, w + BALK.h, 4);
    ctx.restore();
  }

  function tekenPolitie() {
    const f = Math.min(1, s.t / POLITIE_RIT);
    // Rechts naast de klem als daar ruimte is, anders links; de auto rijdt van die kant de scène in.
    const rechts = pino.x + KLEM.x + 150 + POLITIE.b <= B - 4;
    const doel = rechts ? pino.x + KLEM.x + 150 : pino.x + KLEM.x - POLITIE.b - 8;
    const van = rechts ? B + 10 : -POLITIE.b - 10;
    const x = van + (doel - van) * (rustig ? 1 : 1 - (1 - f) * (1 - f));
    tekenSprite(ctx, 's6-politie', x, pino.y + POLITIE.y, { w: POLITIE.b, h: POLITIE.b, flip: !rechts });
  }

  // Vier doorzichtige banen boven de knoppen (op de scène).
  function tekenBanen() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
    for (let i = 0; i < K.BANEN.length; i += 1) {
      rondeRect(ctx, i * (BAAN_B + BAAN_TUSSEN), BAAN_TOP, BAAN_B, H - BAAN_TOP + 20, 16); ctx.fill();
    }
  }

  // De noten vallen van de bovenkant van de baan tot óp hun knop onder de scène en groeien daarbij naar de maat
  // van de knop: het moment om te drukken is als de noot de knop bedekt. Er is geen aparte raaklijn.
  function tekenNoten() {
    const c = noten.ctx;
    noten.begin();
    if (s.fase !== 'klem') return;
    for (const n of klem.noten) {
      if (n.status !== 'open') continue;
      const rest = n.tijd - s.t;
      if (rest > K.VALTIJD) continue;
      const f = 1 - rest / K.VALTIJD;                              // 0 bovenin, 1 op de knop, > 1 erna
      const y = NOOT_START + f * (RAAK_Y - NOOT_START);
      const x = baanMidden(n.baan);
      const r = (BAAN_B / 2) * (NOOT_KLEIN + (1 - NOOT_KLEIN) * Math.min(1, f));
      c.globalAlpha = Math.min(1, (K.VALTIJD - rest) / 150);
      c.fillStyle = '#FFFFFF';
      c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
      c.lineWidth = 3;
      c.strokeStyle = '#9B6BFF';
      c.beginPath(); c.arc(x, y, r - 1.5, 0, Math.PI * 2); c.stroke();
      const m = r * 1.76;                                          // de tekening vult 88 % van de schijf, zoals in de knop
      tekenSprite(c, `s6-knop-${K.BANEN[n.baan]}`, x - m / 2, y - m / 2, { w: m, h: m });
      c.globalAlpha = 1;
    }
  }

  function teken() {
    begin();
    achtergrond.teken(ctx);
    const gezicht = gezichtNu();
    for (const k of KRAMEN) tekenKraam(ctx, k, gezicht);
    // tekenvolgorde achter → voor op voet-y
    const lagen = menigte.map((m) => ({ y: m.y + 72 * m.s * (m.kind ? 0.72 : 1), f: () => tekenBezoeker(m, gezicht) }));
    lagen.push({ y: H - 58, f: () => tekenLantaarnpaal(ctx) });
    const inKlem = s.fase === 'klem' || s.fase === 'politie';
    if (inKlem) lagen.push({ y: pino.y + KLEM.y + 88, f: tekenKlem });
    else lagen.push({ y: pino.y + 72, f: tekenPino });
    if (dief.zichtbaar) lagen.push({ y: dief.y + 72, f: tekenDief });
    if (s.fase === 'politie') lagen.push({ y: pino.y + POLITIE.y + 84, f: tekenPolitie });
    lagen.sort((a, b) => a.y - b.y);
    for (const l of lagen) l.f();
    if (inKlem) tekenBalk();
    if (s.fase === 'klem') tekenBanen();
    tekenNoten();
  }

  /* ---------- werker (spel 7) ---------- */
  function vindWerker() {
    werkerGevonden(6, { zoek });
    s.werkerHup = 700;
  }

  /* ---------- einde ---------- */
  function einde(gelukt) {
    if (gestopt || s.af) return;
    s.af = true;
    lus.stop();
    invoer.vernietig();
    loopInvoer.vernietig();
    window.removeEventListener('keydown', opToets);
    const totaal = klem ? klem.noten.length : 0;
    const tegels = [];
    if (s.reactie !== null) tegels.push({ label: 'REACTIE', waarde: `${(s.reactie / 1000).toFixed(1).replace('.', ',')}s`, kleur: '#1F7A3A' });
    if (klem) tegels.push({ label: 'MOVES', waarde: `${klem.raak}/${totaal}`, kleur: '#0E6A98' });
    if (gelukt) {
      const eersteKeer = klaar({ vaardigheid: info.vaardigheid, score: { reactie: Math.round(s.reactie), raak: klem.raak, totaal } });
      staat.vulBehoefte('jiujitsu', 100);   // de behoefte "jiujitsu" gaat naar 100 % (besluit 100)
      toonResultaat({
        root, icoon: info.icoon, label: `${info.titel.toUpperCase()} · KLAAR`, titel: 'Osssuu',
        inhoud: tafereel(true), tegels, beloning: { vaardigheid: info.vaardigheid, eersteKeer }, opnieuw,
      });
    } else {
      // Mislukt: geen vaardigheidspunt, de ketting blijft in de staat (besluit 82–83).
      toonResultaat({
        root, icoon: 'ketting', label: info.titel.toUpperCase(), titel: 'Gestolen!',
        inhoud: tafereel(false), tegels, opnieuw, confetti: false,
      });
    }
  }

  /* ---------- start ---------- */
  const lus = maakLus({ update, teken });
  voorbereid().then(() => {
    if (gestopt) return;
    tekenAchtergrond();
    teken();
    lus.start();
  }).catch((e) => console.error(e));

  return () => {
    gestopt = true;
    lus.stop();
    invoer.vernietig();
    loopInvoer.vernietig();
    window.removeEventListener('keydown', opToets);
    for (const id of knopTimers.values()) clearTimeout(id);
    for (const id of timers) clearTimeout(id);
    if (window.pinoDebug && window.pinoDebug.s === s) delete window.pinoDebug;
  };
}

/** Het tafereel op het resultaatscherm: Pino in gi naast de boze dief en de politieauto, of de blije dief met de ketting. */
function tafereel(gelukt) {
  const dief = (x, y, gezicht) => el('g', { transform: `translate(${x} ${y})` }, [
    use('b-lijf', 0, 0, 48, 72, DIEF_KLEUR), use('b-handen', 0, 0, 48, 72, DIEF_HUID), use('b-hoofd', 0, 0, 48, 72, DIEF_HUID), use('z-kap', 0, 0, 48, 72), use(gezicht, 0, 0, 48, 72),
  ]);
  const basis = [
    el('rect', { x: 4, y: 2, width: 232, height: 92, rx: 18, fill: '#DDF1FB' }),
    el('ellipse', { cx: 120, cy: 86, rx: 100, ry: 5, fill: '#CDE4F0' }),
  ];
  const delen = gelukt
    ? [use('s6-politie', 140, 16, 96, 72), dief(96, 12, 'z-gezicht'), use('pino-gi', 30, 12, 48, 72)]
    : [use('pino-sip', 52, 12, 48, 72), dief(128, 12, 'z-blij'), use('s5-ketting', 158, 60, 16, 16)];
  return el('svg', {
    class: 'ic s6-tafereel', viewBox: '0 0 240 96', width: 250, height: 100, role: 'img',
    'aria-label': gelukt ? 'Pino in een witte gi met blauwe band; de dief staat er boos naast, bij de politieauto' : 'Pino kijkt verdrietig; de dief staat er blij naast met de ketting in zijn hand',
  }, [...basis, ...delen]);
}

function pct(v, t) {
  return `${((v / t) * 100).toFixed(3)}%`;
}

function formatteerTijd(sec) {
  const m = Math.floor(sec / 60);
  const r = Math.max(0, Math.round(sec % 60));
  return `${m}:${r < 10 ? '0' : ''}${r}`;
}
