// Spel 8 · Check mate — zie specs/spel8.md.
// Kalm spel (SVG-DOM): vijf levels op een stenen 8×8-bord in de jungle, elk tegen roofdieren die bewegen als
// een schaakstuk (level 1: drie pythons, daarna één dier). Pino zet per beurt hooguit één stap en één wissel met een stam (en
// eventueel de spray), daarna de zandloper: de dieren denken na (wolkje met lampje) en zetten na elkaar. Regels zonder DOM in spellen/schaak.js, kaarten in schaak-levels.js.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { el, use, scene } from '../sprites.js';
import * as schaak from './schaak.js';
import { LEVELS } from './schaak-levels.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';

/* ---------- tuning ---------- */
const STAP_DUUR = 260;        // ms: Pino één vak, een stam één vak
const GLIJ_DUUR = 150;        // ms per vak voor glijdende dieren (minstens STAP_DUUR)
const SPRONG_DUUR = 380;      // ms: sprong van het paard (luiaard)
const DENK_DUUR = 900;        // ms: wolkje met dof lampje
const LAMP_DUUR = 300;        // ms: lampje aan, dan zet het dier
const SPRAY_DUUR = 700;       // ms: Pino spuit, nevelwolkje
const VERLOREN_PAUZE = 1200;  // ms: verdrietige Pino en blij dier, dan het resultaatscherm
const GEWONNEN_PAUZE = 600;   // ms: Pino bij de tempel, dan het resultaatscherm
const KRUIS_POP = 900;        // ms: spray met kruis als Pino geen spray heeft

/* ---------- scène (maten uit design/generators/spel8_build2.py) ---------- */
const B = 358;
const H = 582;
const S = 36;      // bordvak
const BX = 35;     // linkerbovenhoek van het bord
const BY = 150;
const VAK_LICHT = '#D9CFA8';
const VAK_DONKER = '#8AA66E';
const BORD_RAND = '#3D7A30';
const OBSTAKEL = { boom: 's8-boom', bamboe: 's8-bamboe', rots: 's8-rots' };
const RICHTING_NAAM = { '0,-1': 'omhoog', '1,0': 'naar rechts', '0,1': 'omlaag', '-1,0': 'naar links' };
const PIJL = { ArrowUp: [0, -1], ArrowRight: [1, 0], ArrowDown: [0, 1], ArrowLeft: [-1, 0] };

const vakXY = ([c, r]) => ({ x: BX + c * S, y: BY + r * S });
const gelijk = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];

/** Heeft Pino de jungledieren-spray? In testmodus overschrijft ?spray=0|1 de staat (specs/ontwikkelaarsopties.md). */
function heeftSpray() {
  if (datum.isTest()) {
    let p = null;
    try { p = new URLSearchParams(location.search).get('spray'); } catch { /* negeren */ }
    if (p === '0' || p === '1') return p === '1';
  }
  return staat.lees().producten.includes('spray');
}

/** In testmodus start ?level=n meteen op het bord van level n. */
function gevraagdLevel() {
  if (!datum.isTest()) return null;
  let p = null;
  try { p = Number(new URLSearchParams(location.search).get('level')); } catch { /* negeren */ }
  return p >= 1 && p <= LEVELS.length ? p : null;
}

const levelsStaat = () => staat.lees().levels || { gehaald: [], actief: 1 };

/** Het level dat nu aan de beurt is: het laagste niet-gehaalde (of 5 als alles gehaald is). */
function actiefLevel() {
  const { gehaald } = levelsStaat();
  return LEVELS.find((l) => !gehaald.includes(l.nr))?.nr ?? LEVELS.length;
}

const isOpen = (nr) => nr === 1 || levelsStaat().gehaald.includes(nr) || levelsStaat().gehaald.includes(nr - 1);

/** Een schaakstuk (48×60) als losse SVG, voor levelkaarten en resultaatschermen. */
function stukSvg(id, maat, klasse = null) {
  return el('svg', { class: `ic ${klasse || ''}`.trim(), viewBox: '-4 -8 56 72', width: maat, height: Math.round((maat * 72) / 56), 'aria-hidden': 'true' }, [use(id, 0, 0, 48, 60)]);
}

/* ---------- start: leveloverzicht of bord ---------- */

export function start({ root, dag, info, klaar }) {
  let opruim = null;
  let gevangen = 0;   // keer gevangen in deze sessie (resultaattegel GEVANGEN)
  const toon = (modus, nr = null) => {
    if (opruim) opruim();
    opruim = modus === 'levels'
      ? overzicht({ root, dag, info, speel: (n) => toon('bord', n) })
      : bord({
        root, dag, info, klaar, nr,
        naarOverzicht: () => toon('levels'),
        opnieuw: () => toon('bord', nr),
        volgende: () => toon('bord', Math.min(LEVELS.length, nr + 1)),
        gevangenTeller: { plus: () => { gevangen += 1; }, waarde: () => gevangen },
      });
  };
  const direct = gevraagdLevel();
  toon(direct ? 'bord' : 'levels', direct);
  return () => { if (opruim) opruim(); opruim = null; };
}

/* ---------- leveloverzicht (Spel8-Levels) ---------- */

function overzicht({ root, dag, info, speel }) {
  const { gehaald } = levelsStaat();
  const actief = actiefLevel();
  const teller = h('span', { class: 'teller-pil s8-teller', role: 'img', 'aria-label': `${gehaald.length} van de ${LEVELS.length} levels gehaald` }, [
    el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 26, height: 26, 'aria-hidden': 'true' }, [use('s8-vlag', 0, 0, 48, 48)]),
    h('span', {}, [String(gehaald.length), h('span', { class: 's8-teller-van' }, ` / ${LEVELS.length}`)]),
  ]);

  const kaarten = LEVELS.map((l) => {
    const klaarGezet = gehaald.includes(l.nr);
    const open = isOpen(l.nr);
    const status = klaarGezet ? 'klaar' : open && l.nr === actief ? 'actief' : open ? 'open' : 'dicht';
    const label = { klaar: `Level ${l.nr}, gehaald`, actief: `Level ${l.nr}, nu aan de beurt`, open: `Level ${l.nr}`, dicht: `Level ${l.nr}, nog vergrendeld` }[status];
    const badge = klaarGezet ? 's7-vink' : status === 'dicht' ? 's8-slot' : null;
    return h('button', {
      type: 'button', class: `s8-level s8-level-${status}`, 'aria-label': label, disabled: status === 'dicht',
      onclick: () => speel(l.nr),
    }, [
      h('span', { class: 's8-level-nr', 'aria-hidden': 'true' }, String(l.nr)),
      stukSvg(`s8-stuk-${l.dier}`, 92, 's8-level-stuk'),
      badge ? el('svg', { class: 'ic s8-badge', viewBox: '0 0 48 48', 'aria-hidden': 'true' }, [use(badge, 0, 0, 48, 48)]) : null,
    ]);
  });

  const scherm = h('div', { class: 'scherm spel spel8 s8-overzicht' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', rechts: teller }),
    h('div', { class: 's8-levels', role: 'group', 'aria-label': 'Vijf levels' }, [
      ...kaarten,
      h('div', { class: 's8-level-pino', 'aria-hidden': 'true' }, [stukSvg('s8-stuk-pino', 92)]),
    ]),
    h('button', { type: 'button', class: 'knop knop-groen s8-speel', 'aria-label': `Speel level ${actief}`, onclick: () => speel(actief) }, [
      el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 26, height: 26, 'aria-hidden': 'true' }, [use('s8-speel', 0, 0, 48, 48)]),
      h('span', { class: 'kop' }, String(actief)),
    ]),
  ]);
  root.replaceChildren(scherm);
  return () => {};
}

/* ---------- het bord ---------- */

function bord({ root, dag, info, klaar, nr, naarOverzicht, opnieuw, volgende, gevangenTeller }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const level = LEVELS[nr - 1];
  const { bord: b, stand: begin } = schaak.leesLevel(level);
  const spray = heeftSpray();
  let stand = begin;
  let gedaan = {};                 // wat Pino deze beurt al deed: { stap, wissel, spray }
  let fase = 'pino';               // 'pino' | 'bezig' | 'dier' | 'einde'
  let gestopt = false;
  let rafId = 0;
  const timers = new Set();
  const wacht = (ms) => new Promise((ok) => { const t = setTimeout(() => { timers.delete(t); ok(); }, ms); timers.add(t); });

  // Tekenstaat bovenop de spelstand: poses, bewegende stukken, wolkje.
  const beeld = {
    pino: 's8-stuk-pino',
    dierStemming: '',              // '' | '-blij' (verloren); boos volgt uit `verward`
    bewegend: null,                // { wie: 'pino' | 'dier' | 'wissel', i, van, naar, x, y } tijdens een animatie
    wolk: false,                   // wolkjes boven de dieren
    lampAan: new Set(),            // dieren waarvan het lampje aan is
    nevel: [],                     // vakken van de dieren die Pino net besproeit
  };

  /* ---------- DOM ---------- */
  const svg = scene(B, H, { label: `Level ${nr}: jungle met in de grond een versleten stenen schaakbord van acht bij acht vakken; Pino als roze pion, de tempel en ${begin.dieren.length > 1 ? `${begin.dieren.length} roofdieren` : 'een roofdier'} als schaakstuk` });
  svg.classList.add('s8-scene');
  const grond = jungleAchter();
  const vakken = grond.querySelector('.s8-vakken');
  for (let r = 0; r < schaak.N; r++) {
    for (let c = 0; c < schaak.N; c++) {
      const { x, y } = vakXY([c, r]);
      vakken.append(b.vast.get(schaak.sleutel([c, r])) === 'water'
        ? use('s8-vak-water', x, y, S, S)
        : use('s8-vak', x, y, S, S, (c + r) % 2 ? VAK_DONKER : VAK_LICHT));
    }
  }
  const wereld = el('g');
  svg.append(grond, wereld, jungleVoor());
  const knoppen = h('div', { class: 's8-knoppen' });

  const sprayKnop = h('button', { type: 'button', class: 's8-rond s8-spray', 'aria-label': 'Spray', onclick: () => sprayen() }, [
    el('svg', { class: 'ic s8-spray-icoon', viewBox: '0 0 48 48', 'aria-hidden': 'true' }, [use('s5-spray', 0, 0, 48, 48)]),
  ]);
  const zandloper = h('button', { type: 'button', class: 's8-rond s8-zandloper', 'aria-label': 'Beurt klaar: het dier zet', onclick: () => beurtKlaar() }, [
    el('svg', { class: 'ic', viewBox: '0 0 48 48', 'aria-hidden': 'true' }, [use('s8-wacht', 0, 0, 48, 48)]),
  ]);

  const scherm = h('div', { class: 'scherm spel spel8 s8-bordscherm' }, [
    kopbalk({ label: `DAG 8 · LEVEL ${nr} VAN ${LEVELS.length}`, titel: info.titel, terugLabel: 'Terug naar de levels', terugActie: naarOverzicht }),
    h('div', { class: 's8-ruimte' }, [h('div', { class: 's8-kolom' }, [
      h('div', { class: 'scene-kaart s8-kaart' }, [svg, knoppen]),
      h('div', { class: 's8-besturing' }, [sprayKnop, zandloper]),
    ])]),
  ]);
  root.replaceChildren(scherm);

  /* ---------- tekenen ---------- */
  const opties = () => (fase === 'pino' ? schaak.pinoActies(b, stand).filter((a) => !gedaan[a.soort]) : []);

  function render() {
    const acties = opties();
    wereld.replaceChildren();
    // markering van de vakken waar Pino heen kan en de stammen waarmee ze kan wisselen (onder de objecten)
    for (const a of acties) {
      const { x, y } = vakXY(a.naar);
      wereld.append(el('rect', { x: x + 2.5, y: y + 2.5, width: S - 5, height: S - 5, rx: 4, fill: 'rgba(255,255,255,0.22)', stroke: 'rgba(255,255,255,0.9)', 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }));
    }
    // objecten en stukken rij voor rij (achter → voor)
    const bew = beeld.bewegend;
    for (let r = 0; r < schaak.N; r++) {
      for (let c = 0; c < schaak.N; c++) {
        const v = [c, r];
        const { x, y } = vakXY(v);
        const soort = b.vast.get(schaak.sleutel(v));
        if (OBSTAKEL[soort]) wereld.append(use(OBSTAKEL[soort], x - 1, y + S - 47, 38, 48));
        if (gelijk(v, b.tempel)) wereld.append(use('s8-tempel', x - 1, y + S - 47, 38, 48));
        if (stand.stammen.some((s) => gelijk(s, v)) && !(bew?.wie === 'wissel' && gelijk(bew.naar, v))) wereld.append(use('s8-stam', x - 1, y + S - 47, 38, 48));
        stand.dieren.forEach((d, i) => { if (gelijk(v, d.pos) && !((bew?.wie === 'dier' || bew?.wie === 'wisseldier') && bew.i === i)) wereld.append(dierEl(x, y, d)); });
        if (gelijk(v, stand.pino) && !['pino', 'wissel', 'wisseldier'].includes(bew?.wie)) wereld.append(pinoEl(x, y));
      }
    }
    // wat beweegt, ligt tijdens de animatie bovenop
    if (bew) {
      // wissel: de stam schuift naar Pino's oude vak, Pino springt op het vak van de stam
      if (bew.wie === 'wissel') {
        wereld.append(use('s8-stam', bew.terug.x - 1, bew.terug.y + S - 47, 38, 48));
        wereld.append(pinoEl(bew.x, bew.y));
      }
      // wissel met een verward dier: hetzelfde, met het dier in plaats van de stam
      if (bew.wie === 'wisseldier') {
        wereld.append(dierEl(bew.terug.x, bew.terug.y, stand.dieren[bew.i]));
        wereld.append(pinoEl(bew.x, bew.y));
      }
      if (bew.wie === 'dier') wereld.append(dierEl(bew.x, bew.y, stand.dieren[bew.i]));
      if (bew.wie === 'pino') wereld.append(pinoEl(bew.x, bew.y));
    }
    for (const pos of beeld.nevel) {
      const p = vakXY(stand.pino);
      const d = vakXY(pos);
      wereld.append(el('g', { class: rustig ? '' : 's8-nevel' }, [use('s8-nevel', (p.x + d.x) / 2 - 2, (p.y + d.y) / 2 - 10, 40, 24)]));
    }
    if (beeld.wolk) {
      stand.dieren.forEach((d, i) => {
        const { x, y } = vakXY(d.pos);
        wereld.append(el('g', { class: 's8-wolk' }, [
          use('s8-wolk', x + 16, y - 52, 44, 37),
          use(beeld.lampAan.has(i) ? 's8-lamp-aan' : 's8-lamp-uit', x + 29, y - 47, 18, 18),
        ]));
      });
    }
    maakKnoppen(acties);
    werkBesturingBij();
  }

  function pinoEl(x, y) { return use(beeld.pino, x - 1, y + S - 46, 38, 47); }
  function dierEl(x, y, d) {
    const stemming = beeld.dierStemming || (d.verward > 0 ? '-boos' : '');
    return use(`s8-stuk-${level.dier}${stemming}`, x - 1, y + S - 46, 38, 47);
  }

  /* ---------- klikdoelen over de scène ---------- */
  const pct = (v, totaal) => `${((v / totaal) * 100).toFixed(3)}%`;

  function maakKnoppen(acties) {
    knoppen.replaceChildren();
    for (const a of acties) {
      const { x, y } = vakXY(a.naar);
      const richting = RICHTING_NAAM[a.richting.join(',')];
      knoppen.append(h('button', {
        type: 'button', class: 's8-vak-knop', 'aria-label': a.soort !== 'wissel' ? `Stap ${richting}` : a.dier !== undefined ? `Wissel met het dier ${richting}` : `Wissel met de stam ${richting}`,
        style: { left: pct(x, B), top: pct(y, H), width: pct(S, B), height: pct(S, H) },
        onclick: () => doe(a),
      }));
    }
  }

  function werkBesturingBij() {
    const pinoBeurt = fase === 'pino';
    zandloper.disabled = !pinoBeurt || !Object.keys(gedaan).length;
    // De spray kan alleen als er een dier naast Pino staat (ook zonder spray, dan volgt het kruis).
    sprayKnop.disabled = !pinoBeurt || gedaan.spray || !schaak.kanSprayen(stand);
  }

  /* ---------- Pino ---------- */
  async function doe(actie) {
    if (fase !== 'pino' || gedaan[actie.soort]) return;
    fase = 'bezig';
    render();
    if (actie.soort === 'stap') await beweeg('pino', stand.pino, actie.naar, STAP_DUUR);
    if (actie.soort === 'wissel') {
      if (actie.dier !== undefined) await beweeg('wisseldier', stand.pino, actie.naar, STAP_DUUR, 10, actie.dier);
      else await beweeg('wissel', stand.pino, actie.stam, STAP_DUUR, 10);
    }
    if (gestopt) return;
    const na = schaak.pasToe(b, stand, actie);
    stand = na.stand;
    gedaan = { ...gedaan, [actie.soort]: true };
    if (na.uitkomst === 'gevangen') return verloren();
    if (na.uitkomst === 'gewonnen') return gewonnen();
    fase = 'pino';
    render();
  }

  async function sprayen() {
    if (fase !== 'pino' || gedaan.spray || !schaak.kanSprayen(stand)) return;
    if (!spray) { toonSprayMis(); return; }
    fase = 'bezig';
    beeld.pino = 's8-stuk-pino-spuit';
    beeld.nevel = stand.dieren.filter((d) => schaak.naastPino(stand, d)).map((d) => d.pos);
    stand = schaak.pasToe(b, stand, { soort: 'spray' }).stand;   // de dieren ernaast raken in de war (rood en boos)
    gedaan = { ...gedaan, spray: true };
    render();
    await wacht(SPRAY_DUUR);
    if (gestopt) return;
    beeld.pino = 's8-stuk-pino';
    beeld.nevel = [];
    fase = 'pino';
    render();
  }

  // Geen spray: de spray met een rood kruis popt kort op in de knop (zoals de kniebeschermers in spel 6).
  function toonSprayMis() {
    sprayKnop.querySelectorAll('.s8-spray-mis').forEach((e) => e.remove());
    const d = h('span', { class: 's8-spray-mis', 'aria-hidden': 'true' }, [
      el('svg', { class: 'ic', viewBox: '0 0 48 48' }, [
        use('s5-spray', 0, 0, 48, 48, null, { opacity: 0.45 }),
        el('path', { d: 'M9 9 L39 39 M39 9 L9 39', fill: 'none', stroke: '#FF5E5B', 'stroke-width': 5, 'stroke-linecap': 'round' }),
      ]),
    ]);
    sprayKnop.append(d);
    const t = setTimeout(() => { timers.delete(t); d.remove(); }, KRUIS_POP);
    timers.add(t);
  }

  /* ---------- de dieren ---------- */
  async function beurtKlaar() {
    if (fase !== 'pino' || !Object.keys(gedaan).length) return;
    fase = 'dier';
    beeld.wolk = true;
    beeld.lampAan = new Set();
    render();
    await wacht(rustig ? DENK_DUUR / 2 : DENK_DUUR);
    if (gestopt) return;
    // Dieren in de war houden een dof lampje en lopen zomaar een kant op.
    beeld.lampAan = new Set(stand.dieren.map((d, i) => (d.verward > 0 ? -1 : i)).filter((i) => i >= 0));
    render();
    await wacht(LAMP_DUUR);
    if (gestopt) return;
    const beurt = schaak.zetDieren(b, stand);
    beeld.wolk = false;
    // De dieren zetten na elkaar; de getoonde stand loopt mee.
    for (const zet of beurt.zetten) {
      if (!gelijk(zet.van, zet.naar)) {
        const afstand = Math.max(Math.abs(zet.naar[0] - zet.van[0]), Math.abs(zet.naar[1] - zet.van[1]));
        const springt = b.stuk === 'paard';
        await beweeg('dier', zet.van, zet.naar, springt ? SPRONG_DUUR : Math.max(STAP_DUUR, afstand * GLIJ_DUUR), springt ? 18 : 3, zet.i);
        if (gestopt) return;
      }
      stand = { ...stand, dieren: stand.dieren.map((d, j) => (j === zet.i ? beurt.stand.dieren[j] : d)) };
    }
    stand = beurt.stand;
    if (beurt.gevangen) return verloren();
    gedaan = {};
    fase = 'pino';
    render();
  }

  /* ---------- animatie ---------- */
  function beweeg(wie, van, naar, duur, hop = 6, i = 0) {
    const a = vakXY(van);
    const z = vakXY(naar);
    if (rustig) return Promise.resolve();
    return new Promise((ok) => {
      const t0 = performance.now();
      const frame = (nu) => {
        if (gestopt) { ok(); return; }
        const f = Math.min(1, (nu - t0) / duur);
        const e = f < 0.5 ? 2 * f * f : 1 - ((-2 * f + 2) ** 2) / 2;   // ease-in-out
        beeld.bewegend = {
          wie, i, naar, x: a.x + (z.x - a.x) * e, y: a.y + (z.y - a.y) * e - Math.sin(f * Math.PI) * hop,
          terug: { x: z.x + (a.x - z.x) * e, y: z.y + (a.y - z.y) * e },   // bij een wissel: de stam gaat de andere kant op
        };
        render();
        if (f < 1) rafId = requestAnimationFrame(frame);
        else { beeld.bewegend = null; ok(); }
      };
      rafId = requestAnimationFrame(frame);
    });
  }

  /* ---------- einde ---------- */
  async function verloren() {
    fase = 'einde';
    beeld.pino = 's8-stuk-pino-sip';
    beeld.dierStemming = '-blij';
    beeld.wolk = false;
    beeld.nevel = [];
    render();
    gevangenTeller.plus();
    await wacht(VERLOREN_PAUZE);
    if (gestopt) return;
    toonResultaat({
      root,
      icoon: 'pion',
      label: `${info.titel.toUpperCase()} · LEVEL ${nr}`,
      titel: 'Gevangen!',
      inhoud: tafereel(),
      tegels: [{ label: 'LEVEL', waarde: nr, kleur: '#C43B38' }],
      opnieuw,
      confetti: false,
    });
  }

  async function gewonnen() {
    fase = 'einde';
    render();
    staat.markeerLevelGehaald(nr);
    await wacht(GEWONNEN_PAUZE);
    if (gestopt) return;
    const gehaald = levelsStaat().gehaald.length;
    const tegels = [
      { label: 'LEVELS', waarde: `${gehaald}/${LEVELS.length}`, kleur: '#1F7A3A' },
      { label: 'GEVANGEN', waarde: `${gevangenTeller.waarde()}×`, kleur: '#C43B38' },
    ];
    if (nr < LEVELS.length) {
      toonResultaat({
        root, icoon: 'pion', label: `${info.titel.toUpperCase()} · LEVEL ${nr}`, titel: `Level ${nr}!`,
        inhoud: stukkenRij(), tegels, opnieuw, verder: { label: 'Volgend level', actie: volgende },
      });
      return;
    }
    // Level 5: het spel is af (besluit: pas na level 5 afronden).
    const eersteKeer = klaar({ score: { levels: gehaald, gevangen: gevangenTeller.waarde() } });
    toonResultaat({
      root, icoon: 'pion', label: `${info.titel.toUpperCase()} · KLAAR`, titel: 'Schaakmat!',
      inhoud: stukkenRij(true), tegels, beloning: { ...info.beloning, eersteKeer }, opnieuw: naarOverzicht,
    });
  }

  /** De vijf stukken op een rij (gehaald in kleur, de rest vaag), na level 5 met de tempel erachter. */
  function stukkenRij(metTempel = false) {
    const { gehaald } = levelsStaat();
    const n = LEVELS.length + (metTempel ? 1 : 0);
    const svgRij = el('svg', { class: 's8-rij', viewBox: `0 0 ${n * 52} 76`, 'aria-hidden': 'true' });
    svgRij.append(el('ellipse', { cx: (n * 52) / 2, cy: 70, rx: (n * 52) / 2 - 6, ry: 5, fill: '#E6EFF5' }));
    LEVELS.forEach((l, i) => {
      svgRij.append(el('g', { opacity: gehaald.includes(l.nr) ? 1 : 0.3 }, [use(`s8-stuk-${l.dier}`, i * 52 + 2, 12, 48, 60)]));
    });
    if (metTempel) svgRij.append(use('s8-tempel', LEVELS.length * 52 + 2, 6, 48, 61));
    return svgRij;
  }

  /** Verloren: de verdrietige Pino en een blij dier. */
  function tafereel() {
    return el('svg', { class: 's8-rij s8-tafereel', viewBox: '0 0 120 76', 'aria-hidden': 'true' }, [
      el('ellipse', { cx: 60, cy: 70, rx: 54, ry: 5, fill: '#E6EFF5' }),
      use('s8-stuk-pino-sip', 8, 12, 48, 60),
      use(`s8-stuk-${level.dier}-blij`, 64, 12, 48, 60),
    ]);
  }

  /* ---------- toetsenbord ---------- */
  function toets(ev) {
    if (ev.altKey || ev.ctrlKey || ev.metaKey) return;
    if (PIJL[ev.key]) {
      ev.preventDefault();
      const d = PIJL[ev.key];
      const a = opties().find((x) => x.richting[0] === d[0] && x.richting[1] === d[1]);
      if (a) doe(a);
    } else if (ev.key === ' ' || ev.key === 'Enter') {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON' && ev.key === 'Enter') return;
      ev.preventDefault();
      beurtKlaar();
    } else if (ev.key === 's' || ev.key === 'S') {
      if (!sprayKnop.disabled) sprayen();
    }
  }
  document.addEventListener('keydown', toets);

  /* ---------- start ---------- */
  render();
  if (datum.isTest()) {
    window.pinoDebug = {
      spel: 8, schaak, level, bord: b,
      stand: () => stand,
      oplossing: () => schaak.losOp(level, { heeftSpray: spray }),
      /** Speelt de oplossing van de oplosser na via de gewone knoppenlogica. */
      speelOplossing: async () => {
        const opl = schaak.losOp(level, { heeftSpray: spray });
        if (!opl) return 'geen oplossing';
        for (const beurt of opl.perBeurt) {
          for (const a of beurt) {
            while (fase !== 'pino') { if (fase === 'einde' || gestopt) return 'klaar'; await wacht(50); }
            if (a.soort === 'spray') await sprayen(); else await doe(opties().find((x) => x.soort === a.soort && gelijk(x.naar, a.naar)) || a);
          }
          if (fase === 'einde') return 'klaar';
          await beurtKlaar();
        }
        return fase;
      },
    };
  }

  return () => {
    gestopt = true;
    cancelAnimationFrame(rafId);
    for (const t of timers) clearTimeout(t);
    document.removeEventListener('keydown', toets);
    if (window.pinoDebug && window.pinoDebug.spel === 8) delete window.pinoDebug;
  };
}

/* ---------- jungle (port van jungle() in design/generators/spel8_build2.py) ---------- */

/** Achter: grond, jungle boven het bord, het bord zelf en de zijkanten. */
function jungleAchter() {
  const g = el('g', { 'aria-hidden': 'true' });
  g.append(el('rect', { x: 0, y: 0, width: B, height: H, fill: '#4E9A3E' }));
  const vlekken = el('g', { fill: '#5FB05A', opacity: 0.5 });
  for (const [cx, cy, rx, ry] of [[60, 110, 26, 8], [300, 100, 30, 9], [40, 500, 28, 8], [320, 520, 24, 7], [180, 470, 34, 8]]) vlekken.append(el('ellipse', { cx, cy, rx, ry }));
  g.append(vlekken);
  for (const [x, y] of [[14, 120], [330, 130], [20, 460], [336, 470], [150, 468], [250, 480], [60, 560], [300, 560], [200, 112]]) g.append(use('s8-gras', x, y, 24, 16));
  g.append(
    use('s8-grootboom', -18, -10, 90, 110), use('s8-grootboom', 70, -30, 90, 110), use('s8-grootboom', 190, -28, 90, 110), use('s8-grootboom', 286, -12, 90, 110),
    use('s8-bamboe', 150, 40, 44, 56), use('s8-bamboe', 258, 56, 44, 56),
    use('s8-liaan', 40, 0, 120, 40), use('s8-liaan', 220, -6, 120, 40),
    use('s8-varen', 6, 96, 48, 40), use('s8-varen', 118, 100, 48, 40), use('s8-varen', 300, 92, 48, 40),
    use('s8-bloem', 70, 118, 16, 20, '#FF6FAE'), use('s8-bloem', 236, 116, 16, 20, '#FF5E5B'),
  );
  // het schaakbord: versleten stenen vakken, vlak in de grond (de rivier hoort bij het level en komt erbij)
  g.append(el('rect', { x: BX - 5, y: BY - 5, width: 8 * S + 10, height: 8 * S + 10, rx: 6, fill: BORD_RAND }));
  const vakken = el('g', { class: 's8-vakken' });
  g.append(vakken);
  g.append(
    use('s8-varen', -14, 250, 48, 40), use('s8-varen', 324, 210, 48, 40), use('s8-varen', -10, 380, 48, 40), use('s8-varen', 322, 350, 48, 40),
    use('s8-bloem', 10, 330, 16, 20, '#FFC93C'), use('s8-bloem', 336, 300, 16, 20, '#9B6BFF'),
  );
  return g;
}

/** Voor: jungle onder het bord. */
function jungleVoor() {
  return el('g', { 'aria-hidden': 'true' }, [
    use('s8-varen', 30, 448, 48, 40), use('s8-varen', 270, 452, 48, 40),
    use('s8-grootboom', -26, 470, 90, 110), use('s8-grootboom', 292, 478, 90, 110),
    use('s8-bamboe', 120, 500, 44, 56), use('s8-boom', 216, 506, 44, 56),
    use('s8-bloem', 100, 540, 16, 20, '#FF6FAE'), use('s8-bloem', 190, 552, 16, 20, '#FF5E5B'), use('s8-bloem', 268, 536, 16, 20, '#FFC93C'),
  ]);
}
