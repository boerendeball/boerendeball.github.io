// Spel 10 · Bereik de bevalling + finale — zie specs/spel10.md.
// Canvas-actiespel in twee fasen: te voet door de avondstad (stap voor stap), dan in de auto over de weg
// (baanwissel per tik, rem). Botsen = voorbij. Aangekomen bij het huis volgt de verjaardagsfinale (DOM).

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { BEHOEFTE_LABELS } from '../ui/behoeften.js';
import { maakLus } from './lus.js';
import { voorbereidSprites, tekenSprite } from './spritesheet.js';
import { maakCanvas, maakLaag } from './canvas.js';
import { maakInvoer } from '../invoer.js';
import { el, use, dier } from '../sprites.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { ga } from '../router.js';
import * as R from './bevalling.js';

/* ---------- tuning (specs/spel10.md; de spelregels staan in bevalling.js) ---------- */
const HOP = 5;                 // px sprongetje per stap
const INSTAP_PINO = 0.4;       // s Pino verdwijnt in het autootje
const INSTAP_DONKER = 0.25;    // s het beeld gaat dicht
const INSTAP_LICHT = 0.25;     // s en weer open op de weg
const BEVRIES_BOTS = 0.8;      // s stilstand na een botsing
const STER_DUUR = 0.5;
const HART_DUUR = 1.4;
const UITFADEN = 0.3;          // s verkeer dat bij het huis nog op de weg is, verdwijnt

/* ---------- scène (design/generators/spel10_build2.py) ---------- */
const { B, H } = R;
const NACHT = '#2B4A66';
const PANDEN = [[-8, '#C98B5A'], [50, '#FFF1D6'], [108, '#8AA0AF'], [166, '#C43B38'], [224, '#E8A9C4'], [282, '#FFF1D6'], [340, '#C98B5A']];
const STERREN = [[20, 12, 8], [60, 30, 6], [120, 10, 7], [180, 26, 5], [240, 14, 6], [340, 40, 5], [90, 44, 5]];
// lantaarns op de bovenste stoep en op de startstoep: [x, hoogte boven de rij-bovenkant, schaal]
const LANTAARNS_STAD = [[R.DOELRIJ, 40, 28, 0.8], [R.DOELRIJ, 300, 28, 0.8], [0, 24, 12, 0.9], [0, 316, 12, 0.9]];
const WIP_SCHAAP = [16, 1.6];   // rad/s en px: het huppeltje van een lopend schaap
const WIP_GANS = [9, 1.2];      // rad/s en px: waggelen
const WIP_BOOS = [22, 1.6];     // een boze gans rent
const HAP = [9, 0.8];          // rad/s en px: een grazend schaap hapt
const BOMEN_WEG = [[2, 120], [316, 60], [0, 420], [318, 330], [8, 560]];
const LANTAARNS_WEG = [[36, 230, 0.9], [322, 460, 0.9]];
const HUIS_KLEUR = '#FFF1D6';
const MOEDER_KLEUR = '#FF6FAE';
const HART_KLEUR = '#FF6FAE';

const LABEL_STAD = 'Avondstad: Pino staat met haar tas op de stoep. Voor haar klinkerpaden met ganzen, weilanden met schapen en twee wegen met auto\'s; helemaal aan de overkant staat het witte ziekenhuisautootje';
const LABEL_WEG = 'Avondweg van boven: Pino rijdt in het witte ziekenhuisautootje tussen het andere verkeer door';

function spriteLijst() {
  const lijst = ['s10-maan', 's10-ster', 's10-gloed', 's10-ambu', 's10-stoep', 's10-stoeprand', 's10-ambu-top', 's10-politie-top',
    's10-paaltje', 's10-tas', 's9-lantaarn', 's9-klinker', 's8-boom', 'd-lam', 's10-lam-graas', 'd-gansje', 's10-gans', 's10-gans-boos', 'pino-loop', 's9-stetho'].map((id) => ({ id }));
  for (const kleur of new Set(PANDEN.map(([, k]) => k))) lijst.push({ id: 's10-pand', kleur });
  for (const kleur of R.AUTO_KLEUREN) lijst.push({ id: 's10-auto', kleur });
  for (const kleur of [...R.TEGEN_KLEUR, ...R.SLOOM_KLEUR]) lijst.push({ id: 's10-auto-top', kleur });
  lijst.push({ id: 's9-huisje', kleur: HUIS_KLEUR }, { id: 's9-moeder', kleur: MOEDER_KLEUR }, { id: 's9-hart', kleur: HART_KLEUR });
  return lijst;
}

/** Wordt door het laadscherm aangeroepen: sprite sheet klaarzetten. */
export async function voorbereid() {
  await voorbereidSprites(spriteLijst());
}

/** In testmodus start ?fase=2 meteen in de auto en ?fase=finale meteen in de finale (specs/ontwikkelaarsopties.md). */
function beginFase() {
  if (datum.isTest()) {
    let p = null;
    try { p = new URLSearchParams(location.search).get('fase'); } catch { /* negeren */ }
    if (p === '2') return 'auto';
    if (p === 'finale') return 'finale';
  }
  return 'voet';
}

export function start({ root, dag, info, klaar }) {
  let opruim = null;
  const ronde = () => {
    if (opruim) opruim();
    opruim = beginFase() === 'finale' ? toonFinale({ root, info }) : speel({ root, dag, info, klaar, opnieuw: ronde });
  };
  ronde();
  return () => { if (opruim) opruim(); opruim = null; };
}

/* ---------- knop-iconen (uit het artboard) ---------- */
const svg = (maat, kinderen, stijl = null) => el('svg', { class: 'ic', viewBox: '0 0 48 48', width: maat, height: maat, 'aria-hidden': 'true', style: stijl }, kinderen);
const lijn = (d, dikte = 6) => el('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': dikte, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
const pijlLinks = () => svg(30, [lijn('M30 10 L16 24 L30 38')]);
const pijlRechts = () => svg(30, [lijn('M18 10 L32 24 L18 38')]);
const pijlOmhoog = () => svg(36, [lijn('M10 30 L24 16 L38 30')]);
const stuur = (graden) => svg(34, [
  el('circle', { cx: 24, cy: 24, r: 18, fill: 'none', stroke: 'currentColor', 'stroke-width': 5 }),
  el('circle', { cx: 24, cy: 24, r: 5, fill: 'currentColor' }),
  lijn('M24 24 L8 18 M24 24 L40 18 M24 24 V42', 5),
], `transform: rotate(${graden}deg)`);
const rempedaal = () => svg(36, [
  el('path', { d: 'M12 8 h24 l4 26 h-32z', fill: '#FFFFFF' }),
  el('path', { d: 'M16 14 h16 M15 20 h18 M14 26 h20', stroke: '#FF5E5B', 'stroke-width': 2.5, 'stroke-linecap': 'round' }),
  el('rect', { x: 20, y: 34, width: 8, height: 8, rx: 2, fill: '#FFFFFF' }),
  el('rect', { x: 14, y: 40, width: 20, height: 4, rx: 2, fill: '#FFFFFF' }),
]);

const TOETS = {
  ArrowLeft: 'links', KeyA: 'links', ArrowRight: 'rechts', KeyD: 'rechts',
  ArrowUp: 'omhoog', KeyW: 'omhoog', ArrowDown: 'rem', KeyS: 'rem', Space: 'rem',
};

function speel({ root, dag, info, klaar, opnieuw }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rng = R.maakRng();
  const begin0 = beginFase();
  let gestopt = false;

  /* ---------- DOM: kopbalk (geen teller), afstandskaart, scène, drie icoon-knoppen ---------- */
  const balkVulling = h('span', { style: { width: '0%' } });
  const afstand = h('div', {
    class: 'kaart tijdkaart s10-afstand s10-weg', role: 'progressbar', 'aria-label': 'Afstand tot de bevalling',
    'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0,
  }, [
    el('svg', { class: 'ic', viewBox: '0 0 72 40', width: 50, height: 28, 'aria-hidden': 'true' }, [use('s10-ambu', 0, 0, 72, 40)]),
    h('span', { class: 'balk s10-balk', 'aria-hidden': 'true' }, [balkVulling]),
    el('svg', { class: 'ic', viewBox: '0 0 48 60', width: 26, height: 32, 'aria-hidden': 'true' }, [use('s9-huisje', 0, 0, 48, 60, HUIS_KLEUR)]),
  ]);
  const { canvas, ctx, begin } = maakCanvas(B, H, { label: LABEL_STAD });
  const knop = (label, inhoud, klasse = '') => h('button', { type: 'button', class: `s10-knop ${klasse}`.trim(), 'aria-label': label }, [inhoud]);
  const knopLinks = knop('Naar links', pijlLinks());
  const knopOmhoog = knop('Vooruit', pijlOmhoog(), 's10-knop-teal');
  const knopRechts = knop('Naar rechts', pijlRechts());
  const knopStuurL = knop('Stuur naar links', stuur(-35));
  const knopRem = knop('Remmen', rempedaal(), 's10-knop-rood');
  const knopStuurR = knop('Stuur naar rechts', stuur(35));
  const rijVoet = h('div', { class: 's10-knoppen', role: 'group', 'aria-label': 'Lopen' }, [knopLinks, knopOmhoog, knopRechts]);
  const rijAuto = h('div', { class: 's10-knoppen', role: 'group', 'aria-label': 'Rijden', hidden: true }, [knopStuurL, knopRem, knopStuurR]);
  const scherm = h('div', { class: 'scherm spel spel10' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje' }),
    afstand,
    h('div', { class: 's10-veld' }, [h('div', { class: 'scene-kaart s10-kaart' }, [canvas])]),
    rijVoet,
    rijAuto,
  ]);
  root.replaceChildren(scherm);

  /* ---------- spelstaat ---------- */
  const s = { fase: 'voet', scene: 'stad', klok: 0, cam: R.camera(R.RIJ_Y[R.START.rij]), overgang: 0, bevries: 0, aankomst: 0, gelukt: false, af: false, onkwetsbaar: false };
  const pino = {
    kolom: R.START.kolom, rij: R.START.rij, x: R.kolomX(R.START.kolom), y: R.RIJ_Y[R.START.rij],
    vanX: 0, vanY: 0, t: 1, richting: 1, wacht: null, alpha: 1,
  };
  const verkeer = R.maakVerkeer(rng);
  const rit = {
    baan: 1, x: R.BAAN_X[1], vanX: R.BAAN_X[1], t: 1, v: R.SNELHEID, afstand: 0, rem: false, remTijd: 0,
    objecten: [], nummer: 0, vorige: null, pauze: R.EERSTE_PAUZE, zone: false,
  };
  const sterren = [];
  const harten = [];
  let remToets = false;
  let procent = -1;

  function naarAuto() {
    s.fase = 'auto'; s.scene = 'weg';
    rijVoet.hidden = true; rijAuto.hidden = false;
    afstand.classList.remove('s10-weg');
    canvas.setAttribute('aria-label', LABEL_WEG);
  }

  /* ---------- invoer: één tik = één stap of één baanwissel; de rem werkt zolang hij ingedrukt is ---------- */
  function actie(naam) {
    if (naam === 'terug') { ga(`/deur/${dag}`); return; }
    const richting = naam === 'stuurLinks' ? 'links' : naam === 'stuurRechts' ? 'rechts' : naam;
    if (s.fase === 'voet') stap(richting);
    else if (s.fase === 'auto' && richting !== 'omhoog') wissel(richting === 'links' ? 0 : 1);
  }
  const invoer = maakInvoer({
    toetsenbord: false,
    richtingen: { omlaag: knopRem },
    acties: { links: knopLinks, omhoog: knopOmhoog, rechts: knopRechts, stuurLinks: knopStuurL, stuurRechts: knopStuurR },
    bijActie: actie,
  });
  const toetsNaam = (ev) => TOETS[ev.code] || TOETS[ev.key] || (ev.key === ' ' ? 'rem' : null);
  function toetsNeer(ev) {
    if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
    if (ev.key === 'Escape') { actie('terug'); return; }
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
    const naam = toetsNaam(ev);
    if (!naam) return;
    if (ev.key === ' ' && ev.target && ev.target.tagName === 'BUTTON') return;   // de knop handelt zijn eigen spatie af
    ev.preventDefault();
    if (ev.repeat) return;
    if (naam === 'rem') remToets = true;
    else actie(naam);
  }
  function toetsOp(ev) { if (toetsNaam(ev) === 'rem') remToets = false; }
  function toetsLos() { remToets = false; }
  window.addEventListener('keydown', toetsNeer);
  window.addEventListener('keyup', toetsOp);
  window.addEventListener('blur', toetsLos);

  /* ---------- fase 1: te voet ---------- */
  function stap(naam) {
    if (pino.t < 1) { pino.wacht = naam; return; }
    let { kolom, rij } = pino;
    if (naam === 'omhoog') rij += 1; else kolom += naam === 'rechts' ? 1 : -1;
    if (rij > R.DOELRIJ || kolom < 0 || kolom >= R.KOLOMMEN) return;
    if (naam !== 'omhoog') pino.richting = naam === 'rechts' ? 1 : -1;
    pino.vanX = pino.x; pino.vanY = pino.y; pino.kolom = kolom; pino.rij = rij; pino.t = 0;
  }

  function updateVoet(dt) {
    R.beweegVerkeer(verkeer, dt, rng, pino);
    if (pino.t < 1) {
      pino.t = Math.min(1, pino.t + dt / R.STAP_DUUR);
      pino.x = pino.vanX + (R.kolomX(pino.kolom) - pino.vanX) * pino.t;
      pino.y = pino.vanY + (R.RIJ_Y[pino.rij] - pino.vanY) * pino.t;
    }
    // het beeld schuift mee: Pino blijft op dezelfde hoogte in beeld tot de bovenkant van de stad in zicht is
    const doel = R.camera(R.RIJ_Y[pino.rij]);
    s.cam = rustig ? doel : s.cam + (doel - s.cam) * Math.min(1, dt * R.CAMERA_TEMPO);
    if (Math.abs(doel - s.cam) < 0.05) s.cam = doel;
    const raak = R.raaktVoet(verkeer, pino.rij, pino.x);
    if (raak && !s.onkwetsbaar) { bots(pino.x, pino.y - 30 - s.cam); return; }
    if (pino.t >= 1) {
      if (R.bijAmbu(pino.rij, pino.x)) { s.fase = 'instap'; s.overgang = 0; pino.wacht = null; return; }
      if (pino.wacht) { const naam = pino.wacht; pino.wacht = null; stap(naam); }
    }
  }

  function updateInstap(dt) {
    R.beweegVerkeer(verkeer, dt, rng);
    s.overgang += dt;
    pino.alpha = Math.max(0, 1 - s.overgang / INSTAP_PINO);
    if (s.scene === 'stad' && s.overgang >= INSTAP_PINO + INSTAP_DONKER) { naarAuto(); s.fase = 'instap'; }
    if (s.overgang >= INSTAP_PINO + INSTAP_DONKER + INSTAP_LICHT) s.fase = 'auto';
  }

  /* ---------- fase 2: in de auto ---------- */
  function wissel(baan) {
    if (rit.zone || baan === rit.baan) return;
    rit.vanX = rit.x; rit.baan = baan; rit.t = 0;
  }

  function updateAuto(dt) {
    const rest = R.AFSTAND - rit.afstand;
    if (!rit.zone && rest <= R.ZONE) {
      // bij het huis: de besturing gaat uit, de auto gaat rechts rijden en rijdt zelf naar het einde van de weg
      if (rit.baan !== 1) wissel(1);
      rit.zone = true;
    }
    rit.rem = !rit.zone && (invoer.richting.omlaag || remToets);
    const doel = rit.rem ? R.SNELHEID_REM : R.SNELHEID;
    if (rit.v < doel) rit.v = Math.min(doel, rit.v + R.VERSNELLING * dt);
    else rit.v = Math.max(doel, rit.v - R.VERSNELLING * dt);
    if (rit.zone) rit.v = Math.min(rit.v, R.uitrolSnelheid(rest));
    rit.afstand = Math.min(R.AFSTAND, rit.afstand + rit.v * dt);

    if (rit.t < 1) {
      rit.t = Math.min(1, rit.t + dt / R.WISSEL_DUUR);
      rit.x = rit.vanX + (R.BAAN_X[rit.baan] - rit.vanX) * rit.t;
    }

    for (const o of rit.objecten) {
      o.y += (rit.v - o.eigen) * dt;
      o.x += o.vx * dt;
      if (o.soort === 'politie' && o.y + o.h < R.AUTO_Y - 30) o.eigen += R.POLITIE_WEG * dt;   // voorbij: hij trekt weg
      if (rit.zone) o.alpha -= dt / UITFADEN;
    }
    for (let i = rit.objecten.length - 1; i >= 0; i -= 1) {
      const o = rit.objecten[i];
      // boven uit beeld verdwijnt alleen wie van ons wegrijdt; een tegenligger kan ver vooruit klaarstaan
      if (o.y > H + 30 || (o.y + o.h < -170 && o.eigen > 0) || o.alpha <= 0) rit.objecten.splice(i, 1);
    }

    if (!rit.zone) {
      // wie te lang op de rem staat, krijgt de politie achter zich
      rit.remTijd = rit.rem ? rit.remTijd + dt : 0;
      if (rit.remTijd >= R.REM_POLITIE && !rit.objecten.some((o) => o.soort === 'politie')) {
        rit.objecten.push(R.maakPolitie());
        rit.remTijd = 0;
      }
      if (!rit.objecten.length && rest > R.STOP_NIEUW) {
        rit.pauze -= dt;
        if (rit.pauze <= 0) {
          const naam = R.kiesSituatie(rit.nummer, rit.vorige, rng);
          rit.objecten.push(...R.maakSituatie(naam, rit.baan, rng));
          rit.nummer += 1; rit.vorige = naam; rit.pauze = R.PAUZE;
        }
      }
      if (!s.onkwetsbaar) {
        const raak = rit.objecten.find((o) => R.raaktAuto(rit.x, o));
        if (raak) { bots((rit.x + raak.x) / 2, Math.max(R.AUTO_Y, Math.min(R.AUTO_Y + R.AUTO_H, raak.y + raak.h / 2))); return; }
      }
    }

    const p = Math.round((rit.afstand / R.AFSTAND) * 100);
    balkVulling.style.width = `${(rit.afstand / R.AFSTAND) * 100}%`;
    if (p !== procent) { procent = p; afstand.setAttribute('aria-valuenow', String(p)); }

    if (rit.zone && R.AFSTAND - rit.afstand < 0.5) {
      rit.afstand = R.AFSTAND; rit.v = 0;
      balkVulling.style.width = '100%';
      s.fase = 'aankomst'; s.aankomst = 0;
      const hx = R.HUIS.x + R.HUIS.w / 2;
      for (let i = 0; i < 8; i += 1) {
        const hoek = (i / 8) * Math.PI * 2;
        sterren.push({ x: hx, y: R.HUIS.y + 70, vx: Math.cos(hoek) * 60, vy: Math.sin(hoek) * 60, t: 0 });
      }
      for (let i = 0; i < 4; i += 1) harten.push({ x: hx - 30 + i * 20, y: R.HUIS.y + 44 - (i % 2) * 10, t: -i * 0.2 });
    }
  }

  function bots(x, y) {
    s.fase = 'botsing'; s.bevries = BEVRIES_BOTS;
    for (let i = 0; i < 7; i += 1) {
      const hoek = (i / 7) * Math.PI * 2;
      sterren.push({ x, y, vx: Math.cos(hoek) * 60, vy: Math.sin(hoek) * 60, t: 0 });
    }
  }

  function update(dt) {
    s.klok += dt;
    for (const e of sterren) { e.t += dt; e.x += e.vx * dt; e.y += e.vy * dt; }
    for (const e of harten) { e.t += dt; if (e.t > 0) e.y -= 24 * dt; }
    for (const [lijst, duur] of [[sterren, STER_DUUR], [harten, HART_DUUR]]) {
      for (let i = lijst.length - 1; i >= 0; i -= 1) if (lijst[i].t >= duur) lijst.splice(i, 1);
    }
    if (s.fase === 'voet') updateVoet(dt);
    else if (s.fase === 'instap') updateInstap(dt);
    else if (s.fase === 'auto') updateAuto(dt);
    else if (s.fase === 'aankomst') { s.aankomst += dt; if (s.aankomst >= R.AANKOMST_DUUR) { s.gelukt = true; einde(); } }
    else if (s.fase === 'botsing') { s.bevries -= dt; if (s.bevries <= 0) einde(); }
  }

  /* ---------- tekenen ---------- */
  const stad = maakLaag(B, R.STAD_H);

  function lantaarn(g, x, y, k) {
    tekenSprite(g, 's10-gloed', x - 28 * k, y - 26 * k, { w: 80 * k, h: 80 * k });
    tekenSprite(g, 's9-lantaarn', x, y, { w: 24 * k, h: 80 * k });
  }

  function stoep(g, y, hoogte) {
    g.save();
    g.beginPath(); g.rect(0, y, B, hoogte); g.clip();
    for (let yy = 0; yy < hoogte; yy += 32) for (let x = 0; x < B; x += 32) tekenSprite(g, 's10-stoep', x, y + yy, { w: 32, h: 32 });
    g.restore();
  }

  function stoeprand(g, y) {
    for (let x = 0; x < B; x += 24) tekenSprite(g, 's10-stoeprand', x, y, { w: 24, h: 6 });
  }

  function tekenStadLaag() {
    const g = stad.ctx;
    g.fillStyle = NACHT; g.fillRect(0, 0, B, R.STAD_H);
    tekenSprite(g, 's10-maan', 296, 6, { w: 40, h: 40 });
    for (const [x, y, maat] of STERREN) tekenSprite(g, 's10-ster', x, y, { w: maat, h: maat });
    // Alle banden liggen op de rijen van bevalling.js: elke looprij is RIJ_H hoog (besluit 155).
    const top = R.rijTop;
    const hh = R.RIJ_H;
    const stoepBoven = top(R.DOELRIJ);
    PANDEN.forEach(([x, kleur], i) => tekenSprite(g, 's10-pand', x, stoepBoven - 90 + (i % 2) * 6, { w: 56, h: 90, kleur }));
    g.fillStyle = '#4E9A3E'; g.fillRect(0, stoepBoven, B, R.STAD_H - stoepBoven);
    const soort = (rij) => R.RIJ_SOORT[rij];
    for (let rij = 1; rij < R.DOELRIJ; rij += 1) {
      const y = top(rij);
      if (soort(rij) === 'weg') {
        // rijstrook: witte rand aan de buitenkant, gele streep tussen twee stroken
        g.fillStyle = '#4F6B7E'; g.fillRect(0, y, B, hh);
        g.fillStyle = '#FFFFFF';
        if (soort(rij + 1) !== 'weg') g.fillRect(0, y, B, 3);
        if (soort(rij - 1) !== 'weg') g.fillRect(0, y + hh - 3, B, 3);
        else {
          g.strokeStyle = '#FFE08A'; g.lineWidth = 3; g.setLineDash([22, 22]);
          g.beginPath(); g.moveTo(0, y + hh); g.lineTo(B, y + hh); g.stroke(); g.setLineDash([]);
        }
      } else if (soort(rij) === 'wei') {
        g.fillStyle = '#8BD35A'; g.fillRect(0, y, B, hh);
        g.strokeStyle = '#5FB05A'; g.lineWidth = 2;
        for (const yy of [y, y + hh]) { g.beginPath(); g.moveTo(0, yy); g.lineTo(B, yy); g.stroke(); }
      } else if (soort(rij) === 'pad') {
        // ganzenpad: klinkerstrook
        g.save();
        g.beginPath(); g.rect(0, y, B, hh); g.clip();
        for (let r = 0; r < 2; r += 1) for (let x = 0; x < B; x += 32) tekenSprite(g, 's9-klinker', x, y + r * 32, { w: 32, h: 32 });
        g.restore();
      }
    }
    // bovenste stoep met het ziekenhuisautootje, en de startstoep
    stoep(g, stoepBoven, hh); stoeprand(g, stoepBoven + hh);
    stoep(g, top(0), R.STAD_H - top(0)); stoeprand(g, top(0));
    for (const [rij, x, boven, k] of LANTAARNS_STAD) lantaarn(g, x, top(rij) - boven, k);
    tekenSprite(g, 's10-ambu', R.AMBU.x, R.AMBU.y, { w: R.AMBU.w, h: R.AMBU.h });
  }

  function tekenPino() {
    const hop = rustig || pino.t >= 1 ? 0 : Math.sin(pino.t * Math.PI) * HOP;
    const opties = { flip: pino.richting < 0, alpha: pino.alpha };
    for (const id of ['pino-loop', 's9-stetho', 's10-tas']) tekenSprite(ctx, id, pino.x - 24, pino.y - 68 - hop, opties);
  }

  function tekenStad() {
    // de stad is hoger dan het beeld: teken het stuk dat de camera ziet (afgerond op hele beeldpunten, tegen trillen)
    const cam = Math.round(s.cam * stad.schaal) / stad.schaal;
    ctx.save();
    ctx.translate(0, -cam);
    stad.teken(ctx);
    const lagen = [];
    for (const e of verkeer) {
      const st = e.strook;
      if (e.y + e.h < cam - 10 || e.y > cam + H + 10) continue;   // buiten beeld
      const flip = st.v < 0;
      if (e.soort === 'auto') lagen.push({ y: e.y + e.h, f: () => tekenSprite(ctx, 's10-auto', e.x, e.y, { kleur: e.kleur, flip }) });
      else if (e.soort === 'gans') {
        // oude gans: wit met de borst vooruit; boos met gestrekte hals en open snavel
        const [tempo, uitslag] = e.boos ? WIP_BOOS : WIP_GANS;
        const wip = rustig ? 0 : Math.sin(s.klok * tempo + e.x * 0.1) * uitslag;
        lagen.push({ y: e.y + e.h, f: () => tekenSprite(ctx, e.boos ? 's10-gans-boos' : 's10-gans', e.x, e.y + wip, { w: e.w, h: e.h, flip: e.kijkt < 0 }) });
      } else if (e.soort === 'kuiken') {
        const [tempo, uitslag] = e.leider.boos ? WIP_BOOS : WIP_GANS;
        const wip = rustig || !e.loopt ? 0 : Math.sin(s.klok * tempo + e.x * 0.3) * uitslag * 0.7;
        lagen.push({ y: e.y + e.h - 0.5, f: () => tekenSprite(ctx, 'd-gansje', e.x, e.y + wip, { w: e.w, h: e.h, flip: e.kijkt < 0 }) });
      } else {
        // schaap: huppelt vlot tijdens het lopen, hapt met de kop omlaag tijdens het grazen
        const id = e.graast ? 's10-lam-graas' : 'd-lam';
        let wip = 0;
        if (!rustig && e.graast) wip = Math.max(0, Math.sin(s.klok * HAP[0] + e.x)) * HAP[1];
        else if (!rustig && !e.staat) wip = -Math.abs(Math.sin(s.klok * WIP_SCHAAP[0] / 2 + e.x * 0.1)) * WIP_SCHAAP[1];
        lagen.push({ y: e.y + e.h, f: () => tekenSprite(ctx, id, e.x, e.y + wip, { w: e.w, h: e.h, flip }) });
      }
    }
    if (pino.alpha > 0) lagen.push({ y: pino.y + 0.5, f: tekenPino });
    lagen.sort((a, b) => a.y - b.y);
    for (const l of lagen) l.f();
    ctx.restore();
  }

  function tekenWeg() {
    // De weg schuift met de afgelegde afstand, tot het einde van de weg bovenaan in beeld staat (besluit 161).
    const af = R.schuif(rit.afstand);
    const tekort = R.SCHUIF_MAX - af;             // zo ver ligt het einde van de weg nog boven zijn eindplek
    const eindY = R.EINDE_Y - tekort;             // y van het einde van de weg
    const huisY = R.HUIS.y - tekort;
    const eindInBeeld = eindY > -10;
    const wegBoven = Math.max(0, eindY);
    ctx.fillStyle = '#4E9A3E'; ctx.fillRect(0, 0, B, H);
    ctx.fillStyle = '#4F6B7E'; ctx.fillRect(60, wegBoven, 238, H - wegBoven);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(60, wegBoven, 5, H - wegBoven); ctx.fillRect(293, wegBoven, 5, H - wegBoven);
    if (eindInBeeld) ctx.fillRect(60, eindY, 238, 5);
    ctx.save();
    ctx.beginPath(); ctx.rect(0, wegBoven + 14, B, H); ctx.clip();
    ctx.strokeStyle = '#FFE08A'; ctx.lineWidth = 4; ctx.setLineDash([30, 30]); ctx.lineDashOffset = -(af % 60);
    ctx.beginPath(); ctx.moveTo(179, -60); ctx.lineTo(179, H); ctx.stroke();
    ctx.setLineDash([]); ctx.lineDashOffset = 0;
    ctx.restore();

    // berm: paaltjes, bomen en lantaarns schuiven mee met de weg; paaltjes staan alleen langs de weg
    for (let y = ((40 + af) % 110) - 110; y < H; y += 110) {
      if (y < eindY - 6) continue;
      tekenSprite(ctx, 's10-paaltje', 30, y, { w: 10, h: 26 });
      tekenSprite(ctx, 's10-paaltje', 320, y, { w: 10, h: 26 });
    }
    const decor = [];
    for (const [x, y0] of BOMEN_WEG) decor.push({ x, y: (y0 + af) % H, f: (y) => tekenSprite(ctx, 's8-boom', x, y, { w: 44, h: 56 }) });
    for (const [x, y0, k] of LANTAARNS_WEG) decor.push({ x, y: (y0 + af) % H, f: (y) => lantaarn(ctx, x, y, k) });
    decor.sort((a, b) => a.y - b.y);
    for (const d of decor) {
      for (const y of [d.y - H, d.y]) if (y > -100) d.f(y);
    }

    if (huisY > -R.HUIS.h - 20) {
      // het huis staat waar de weg eindigt, met de vrouw achter het verlichte raam
      const { x, w, h: hh } = R.HUIS;
      const k = w / 48;
      tekenSprite(ctx, 's9-huisje', x, huisY, { w, h: hh, kleur: HUIS_KLEUR });
      const rx = x + 12 * k; const ry = huisY + 34 * k; const rw = 8 * k; const rh = 10 * k;
      ctx.fillStyle = '#FFE08A'; ctx.fillRect(rx, ry, rw, rh);
      ctx.save();
      ctx.beginPath(); ctx.rect(rx, ry, rw, rh); ctx.clip();
      tekenSprite(ctx, 's9-moeder', rx + rw / 2 - 10, ry + 1, { w: 20, h: 21.5, kleur: MOEDER_KLEUR });
      ctx.restore();
      tekenSprite(ctx, 's10-gloed', rx + rw / 2 - 40, ry + rh / 2 - 40, { w: 80, h: 80 });
    }

    const objecten = [...rit.objecten].sort((a, b) => a.y - b.y);
    for (const o of objecten) {
      const alpha = Math.max(0, Math.min(1, o.alpha));
      if (o.soort === 'gans') {
        const wip = rustig ? 0 : Math.sin(s.klok * 9 + o.x * 0.2) * 1.2;
        if (o.oud) tekenSprite(ctx, 's10-gans', o.x - 25, o.y - 8 + wip, { w: 50, h: 42, flip: o.vx < 0, alpha });
        else tekenSprite(ctx, 'd-gansje', o.x - 15, o.y + 7 + wip, { w: 30, h: 25, flip: o.vx < 0, alpha });
      } else if (o.soort === 'politie') {
        tekenSprite(ctx, 's10-politie-top', o.x - 28, o.y, { alpha });
      } else {
        tekenSprite(ctx, 's10-auto-top', o.x - 28, o.y, { kleur: o.kleur, alpha, hoek: o.soort === 'tegen' ? Math.PI : 0 });
      }
    }
    const tril = s.fase === 'botsing' && !rustig ? Math.sin(s.klok * 60) * 2 : 0;
    tekenSprite(ctx, 's10-ambu-top', R.autoX(rit.afstand, rit.x) - R.AUTO_B / 2 + tril, R.autoY(rit.afstand), { w: R.AUTO_B, h: R.AUTO_H });
  }

  function teken() {
    begin();
    if (s.scene === 'stad') tekenStad(); else tekenWeg();
    for (const e of harten) {
      if (e.t <= 0) continue;
      const f = e.t / HART_DUUR;
      tekenSprite(ctx, 's9-hart', e.x - 8, e.y - 8, { w: 16, h: 16, kleur: HART_KLEUR, alpha: 1 - f * f });
    }
    for (const e of sterren) {
      const f = e.t / STER_DUUR;
      tekenSprite(ctx, 's10-ster', e.x - 7, e.y - 7, { w: 14, h: 14, alpha: 1 - f * f });
    }
    if (s.fase === 'instap') {
      // het beeld gaat even dicht tussen de stad en de weg
      const t = s.overgang - INSTAP_PINO;
      const donker = t <= 0 ? 0 : t < INSTAP_DONKER ? t / INSTAP_DONKER : Math.max(0, 1 - (t - INSTAP_DONKER) / INSTAP_LICHT);
      if (donker > 0) { ctx.globalAlpha = donker; ctx.fillStyle = NACHT; ctx.fillRect(0, 0, B, H); ctx.globalAlpha = 1; }
    }
  }

  /* ---------- einde ---------- */
  function ruimOp() {
    lus.stop();
    invoer.vernietig();
    window.removeEventListener('keydown', toetsNeer);
    window.removeEventListener('keyup', toetsOp);
    window.removeEventListener('blur', toetsLos);
  }

  let finaleWeg = null;
  function einde() {
    if (gestopt || s.af) return;
    s.af = true;
    ruimOp();
    if (s.gelukt) {
      klaar({ vaardigheid: info.vaardigheid });
      // in de finale staan alle behoeften op groen
      staat.schrijf((st) => { for (const naam of Object.keys(st.behoeften)) st.behoeften[naam] = 100; });
      finaleWeg = toonFinale({ root, info });
    } else {
      // Botsing: geen beloning en het deurtje blijft ongespeeld; "Nog een keer" begint weer te voet (besluit 151).
      toonResultaat({
        root, icoon: info.icoon, label: info.titel.toUpperCase(), titel: 'Oeps…',
        inhoud: tafereelSip(), opnieuw, confetti: false,
      });
    }
  }

  /* ---------- start ---------- */
  const lus = maakLus({ update, teken });
  if (begin0 === 'auto') naarAuto();
  if (datum.isTest()) {
    window.pinoDebug = {
      spel: 10, s, pino, rit, verkeer,
      /** Zet het spel met de hand ms vooruit (stappen van 20 ms) en teken. */
      stap(ms) { for (let i = 0; i < Math.round(ms / 20) && !s.af; i += 1) update(0.02); if (!s.af) teken(); },
      actie,
    };
  }
  voorbereid().then(() => {
    if (gestopt) return;
    tekenStadLaag();
    teken();
    lus.start();
  }).catch((e) => console.error(e));

  return () => {
    gestopt = true;
    ruimOp();
    if (finaleWeg) finaleWeg();
    if (window.pinoDebug && window.pinoDebug.s === s) delete window.pinoDebug;
  };
}

/** Het tafereel op het resultaatscherm na een botsing: een verdrietige Pino met haar tas, een gansje kijkt toe. */
function tafereelSip() {
  return el('svg', {
    class: 'ic s10-tafereel', viewBox: '0 0 260 104', width: 260, height: 104, role: 'img',
    'aria-label': 'Pino kijkt verdrietig; een gansje kijkt naar haar op',
  }, [
    el('rect', { x: 4, y: 2, width: 252, height: 100, rx: 18, fill: '#DDF1FB' }),
    el('ellipse', { cx: 130, cy: 92, rx: 108, ry: 5, fill: '#CDE4F0' }),
    el('g', { transform: 'translate(94 18)' }, [use('pino-sip', 0, 0, 48, 72), use('s9-stetho', 0, 0, 48, 72)]),
    dier(150, 52, 'gansje', { flip: true }),
  ]);
}

/* ---------- finale (DOM, mag tekst: geen spel meer) ---------- */
const BRIEFJE_PLACEHOLDER = '[Het laatste briefje – de verjaardagsboodschap.]';

function toonFinale({ root, info }) {
  const ballon = (kleur, breedte, stijl) => el('svg', {
    class: 'ic s10-ballon', viewBox: '0 0 40 70', width: breedte, height: breedte * 1.75, 'aria-hidden': 'true', style: stijl,
  }, [use('s10-ballon', 0, 0, 40, 70, kleur)]);

  const tafereel = el('svg', {
    class: 'ic s10-feest-tafereel', viewBox: '0 0 300 90', width: 300, height: 90, role: 'img',
    'aria-label': 'Pino met de pasgeboren baby op de arm, tussen een lammetje en twee gansjes',
  }, [
    el('ellipse', { cx: 150, cy: 84, rx: 130, ry: 5, fill: '#CDE4F0' }),
    dier(30, 40, 'lam'),
    // twee-armen-regel: armloos lijf, de bundel voor de borst, de armen eromheen
    el('g', { transform: 'translate(126 8)' }, [
      use('p-basis', 0, 0, 48, 72), use('s9-bundel', 8, 30, 32, 32, '#FFD6E6'),
      use('s9-armen-om', 0, 0, 48, 72, '#F6C9A8'), use('s9-handen-om', 0, 0, 48, 72, '#F6C9A8'),
      el('rect', { x: 18, y: 62, width: 5, height: 6, rx: 2, fill: '#B23A6A' }),
      el('rect', { x: 25, y: 62, width: 5, height: 6, rx: 2, fill: '#B23A6A' }),
    ]),
    dier(200, 44, 'gansje'),
    dier(244, 44, 'gansje', { schaal: 0.9 }),
  ]);

  const knop = h('button', { type: 'button', class: 'knop-pil s10-feest-knop', onclick: () => ga('/') }, 'Terug naar de kalender');
  const scherm = h('div', { class: 'scherm s10-finale' }, [
    h('div', { class: 's10-confetti', 'aria-hidden': 'true' }),
    el('svg', { class: 'ic s10-slinger', viewBox: '0 0 200 40', preserveAspectRatio: 'none', 'aria-hidden': 'true' }, [use('s10-slinger', 0, 0, 200, 40)]),
    ballon('#1FA3DC', 44, 'left: 18px; top: 100px'),
    ballon('#FFC93C', 44, 'right: 26px; top: 80px; animation-delay: 0.6s'),
    ballon('#9B6BFF', 36, 'right: 54px; top: 160px; animation-delay: 1.2s'),
    h('section', { class: 'kaart s10-feest-kaart', 'aria-labelledby': 's10-feest-titel' }, [
      h('div', { class: 's10-taart-bol' }, [
        el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 104, height: 104, role: 'img', 'aria-label': 'Verjaardagstaart met drie kaarsjes' }, [use('s10-taart', 0, 0, 48, 48)]),
      ]),
      h('div', { class: 's10-feest-label' }, '3 DECEMBER · DEURTJE 10 VAN 10'),
      h('h1', { class: 'kop s10-feest-titel', id: 's10-feest-titel' }, 'Hartelijk gefeliciteerd, Pino!'),
      tafereel,
      h('div', { class: 's10-noden' }, Object.values(BEHOEFTE_LABELS).map((label) => h('div', { class: 's10-nood' }, [
        h('span', { class: 's10-nood-label' }, label),
        h('span', { class: 's10-nood-balk', role: 'img', 'aria-label': `${label}: helemaal vol` }, [h('span')]),
      ]))),
      h('div', { class: 's10-briefje' }, [
        el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 28, height: 28, 'aria-hidden': 'true' }, [use('s9-hart', 0, 0, 48, 48, '#FF6FAE')]),
        h('div', { class: 's10-briefje-tekst' }, [
          h('div', { class: 's10-briefje-label' }, 'BRIEFJE VOOR PINO'),
          h('p', {}, info.briefje || BRIEFJE_PLACEHOLDER),
        ]),
      ]),
      knop,
    ]),
  ]);
  document.body.classList.add('s10-feest');
  root.replaceChildren(scherm);
  queueMicrotask(() => knop.focus());
  return () => document.body.classList.remove('s10-feest');
}
