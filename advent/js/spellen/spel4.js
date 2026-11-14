// Spel 4 · (Social)ize the family (specs/spel4.md, design/artboards/Spel4.dc.html).
// De familie uit spel 3 loopt los over het strand; op een vast moment staat iemand precies goed en lacht.
// Tik dan op hem of haar: Pino loopt erheen en maakt de foto. Te vroeg, te laat of iemand anders in beeld:
// een rood frame. Drie foto's per familie; de familie betaalt (besluit 48).

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { werkerGevonden, terugKnop } from './zoeken.js';
import { el, use, groep, scene, persoon, pino } from '../sprites.js';
import { maakLus } from './lus.js';
import * as F from './fotos.js';
import * as fam from './familie.js';
import { DECOR } from './decor4.js';

const WIT = '#FFFFFF';
const ROOD = '#FF5E5B';
const SIL = { moeder: 'sil-moeder', vader: 'sil-vader', kind: 'sil-kind' };
const SIL_DIER = { biggetje: 'sil-big', gansje: 'sil-gans', lam: 'sil-lam' };
const MOMENT_DIER = { biggetje: 'd-biggetje-lig', gansje: 'd-gansje-eet', lam: 'd-lam-eet' };   // dier op zijn fotoplek

/** Silhouet voor de filmstrook en lege polaroids; het dier hangt af van de familie. */
function silhouet(rol, familieId) {
  if (rol !== 'dier') return SIL[rol];
  const dier = F.leden(familieId).find((l) => l.rol === 'dier');
  return SIL_DIER[dier && dier.dier] || 'sil-big';
}

/* ---------- tekenhulpen ---------- */

/** Het frame van de zoeker (zelfde vorm als s4-zoeker) voor elke maat. */
function zoeker({ x, y, b, h }, kleur) {
  const x0 = x + 4, y0 = y + 4, x1 = x + b - 4, y1 = y + h - 4;
  const cx = x + b / 2, cy = y + h / 2;
  const hoek = Math.min(22, b / 3, h / 3);
  const rand = hoek - 6;
  return el('g', { class: 's4-zoeker', 'aria-hidden': 'true' }, [
    el('path', {
      d: `M${x0} ${y0 + hoek} V${y0 + 6} a6 6 0 0 1 6 -6 h${rand} M${x1 - hoek} ${y0} h${rand} a6 6 0 0 1 6 6 v${rand} `
        + `M${x1} ${y1 - hoek} v${rand} a6 6 0 0 1 -6 6 h-${rand} M${x0 + hoek} ${y1} h-${rand} a6 6 0 0 1 -6 -6 v-${rand}`,
      fill: 'none', stroke: kleur, 'stroke-width': 5, 'stroke-linecap': 'round',
    }),
    el('circle', { cx, cy, r: 5, fill: 'none', stroke: kleur, 'stroke-width': 3 }),
    el('path', { d: `M${cx} ${cy - 12} v5 M${cx} ${cy + 7} v5 M${cx - 12} ${cy} h5 M${cx + 7} ${cy} h5`, stroke: kleur, 'stroke-width': 2.5, 'stroke-linecap': 'round' }),
  ]);
}

/** Tekening van een familielid rond zijn voetpunt (0,0). */
function lidTekening(lid, pose, richting) {
  const flip = richting < 0;
  if (lid.soort === 'dier') {
    const id = pose === 'moment' && MOMENT_DIER[lid.dier] ? MOMENT_DIER[lid.dier] : `d-${lid.dier}`;
    return groep(-24, -38, { flip }, [use(id, 0, 0, 48, 40)]);
  }
  const gezicht = pose === 'moment' ? 'b-lach' : 'b-blij';
  if (lid.soort === 'kind') return persoon(-24 * 0.72, -71 * 0.72, { ...lid.persoon, kind: true, flip, gezicht });
  return persoon(-24, -71, { ...lid.persoon, flip, gezicht });
}

const pct = (v, t) => `${((v / t) * 100).toFixed(3)}%`;

/**
 * De foto van één fotoplek, opgebouwd uit de gegevens: het decor met alleen de gefotografeerde familieleden
 * lachend op hun plek, uitgesneden op het frame. Zo zien resultaatscherm en album er altijd hetzelfde uit
 * (en kan spel 7 dezelfde foto's tonen). De verstopte werker staat er bewust niet op.
 */
export function foto(familieId, plekId) {
  const omg = F.omgeving(familieId);
  const plek = omg.plekken.find((p) => p.id === plekId);
  const decor = DECOR[omg.omgeving];
  const leden = F.leden(familieId);
  const dingen = decor.rekwisieten().filter((r) => !r.werker);
  for (const [rol, [x, y]] of Object.entries(plek.doelen)) {
    const lid = leden.find((l) => l.rol === rol);
    // Kijk naar het midden van het frame.
    const richting = x <= plek.frame.x + plek.frame.b / 2 ? 1 : -1;
    dingen.push({ y, knoop: el('g', { transform: `translate(${x} ${y})` }, [lidTekening(lid, 'moment', richting)]) });
  }
  dingen.sort((a, b) => a.y - b.y);
  const { x, y, b, h: hg } = plek.frame;
  return el('svg', { class: 's4-foto', viewBox: `${x} ${y} ${b} ${hg}`, preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': 'true' },
    [decor.achter(), ...dingen.map((d) => d.knoop)]);
}

/** Polaroid zonder foto: lichtblauw met de silhouetten van wie erop hoort. */
function legePolaroid(rollen, familieId) {
  return el('svg', { class: 's4-foto s4-foto-leeg', viewBox: `0 0 ${24 * rollen.length + 24} 56`, 'aria-hidden': 'true' },
    rollen.map((r, i) => use(silhouet(r, familieId), 12 + i * 24, 12, 24, 32, '#B8C9D6')));
}

/* ---------- spel ---------- */

export function start(opties) {
  // Spel en album wisselen in hetzelfde scherm; de router houdt één opruimfunctie vast.
  let opruim = null;
  const toon = (familieId, { kijken = false } = {}) => {
    if (opruim) opruim();
    opruim = familieId
      ? speel({ ...opties, familieId, kijken, opnieuw: () => toon(F.volgendeFamilie(staat.lees())) })
      : album({ ...opties, fotografeer: toon, bekijk: (id) => toon(id, { kijken: true }) });
  };
  // In de zoekmodus van spel 7 is het album van spel 4 altijd het startpunt (besluit 105).
  toon(opties.zoek ? null : kiesFamilie());
  return () => { if (opruim) opruim(); opruim = null; };
}

/**
 * Nog geen enkele familie op de foto: meteen het spel met de eerste complete familie. Daarna is het album het
 * startpunt (besluit 55): daar kies je een complete familie zonder foto's met de cameraknop.
 */
function kiesFamilie() {
  const s = staat.lees();
  if (datum.isTest()) {
    const gevraagd = new URLSearchParams(location.search).get('familie');
    if (gevraagd && F.omgeving(gevraagd)) return gevraagd;
  }
  return s.fotos.length === 0 ? F.volgendeFamilie(s) : null;
}

/* ---------- album ---------- */

const STANDAARD_ROLLEN = [['moeder', 'vader'], ['kind'], ['dier']];

/**
 * Album met negen polaroids: per familie drie foto's, of lege polaroids als die familie nog niet op de foto is.
 * Een complete familie zonder foto's krijgt een cameraknop die het fotospel voor die familie start.
 * Is spel 7 open, dan opent een tik op de foto's van een familie haar omgeving (besluit 50), zodat de werker daar
 * alsnog te vinden is.
 */
function album({ root, dag, info, fotografeer, bekijk, zoek = false }) {
  const spel7 = datum.deurOpen(7);
  const s = staat.lees();
  const kan = F.teFotograferen(s);
  const volgorde = F.completeInVolgorde(s.karakters);
  const families = [...volgorde, ...fam.FAMILIES.map((f) => f.id).filter((id) => !volgorde.includes(id))];
  const paginas = families.map((id) => {
    const omg = F.omgeving(id);
    const klaar = !!omg && s.fotos.includes(id);
    const vakken = klaar
      ? omg.plekken.map((plek) => foto(id, plek.id))
      : (omg ? omg.plekken.map((p) => Object.keys(p.doelen)) : STANDAARD_ROLLEN).map((rollen) => legePolaroid(rollen, id));
    return h('div', { class: `kaart s4-albumpagina${kan.includes(id) ? ' s4-albumpagina-open' : ''}` }, [
      (klaar && spel7
        ? (kinderen) => h('button', { type: 'button', class: 's4-polaroids s4-album-bekijk', 'aria-label': "Foto's bekijken", onclick: () => bekijk(id) }, kinderen)
        : (kinderen) => h('div', { class: 's4-polaroids', role: 'img', 'aria-label': klaar ? "Drie foto's van een familie" : "Nog geen foto's" }, kinderen))(
        vakken.map((v, i) => h('div', { class: `s4-polaroid s4-polaroid-${i + 1}${klaar ? '' : ' s4-polaroid-leeg'}` }, [v]))),
      kan.includes(id)
        ? h('button', { type: 'button', class: 's4-album-knop', 'aria-label': "Foto's maken", onclick: () => fotografeer(id) }, [svgIcoon('s4-camera', 48, 36, 40, 30)])
        : null,
    ]);
  });
  root.replaceChildren(h('div', { class: 'scherm spel s4-album' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', ...terugKnop(zoek) }),
    h('div', { class: 's4-albumpaginas' }, paginas),
  ]));
  queueMicrotask(() => root.querySelector('.s4-album-knop')?.focus({ preventScroll: true }));
  return () => {};
}

/* ---------- spel ---------- */

/**
 * Het fotospel voor één familie. kijken: alleen bekijken vanuit het album (spel 7): de familie staat lachend op
 * haar fotoplekken, de filmstrook is vol, er valt niets te fotograferen of te verdienen; de werker is te vinden.
 */
function speel({ root, dag, info, klaar, opnieuw, familieId, kijken = false, zoek = false }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const omg = F.omgeving(familieId);
  const routes = F.maakRoutes(omg);
  const leden = F.leden(familieId).filter((l) => routes[l.rol]);
  let gestopt = false;
  let bezig = false;         // Pino is een foto aan het maken
  let af = false;
  let t = 0;                 // speltijd in seconden (staat stil als de tab verborgen is)
  let opnames = 0;
  let miskliks = 0;
  const gedaan = [];         // id's van gefotografeerde plekken
  const geparkeerd = {};     // rol → { x, y } van wie al op de foto staat en blijft staan
  const fotos = {};          // plek-id → svg-uitsnede
  const timers = new Set();
  const wacht = (ms) => new Promise((ok) => { const id = setTimeout(() => { timers.delete(id); ok(); }, ms); timers.add(id); });

  /* ---------- DOM ---------- */
  const tellerGetal = h('span', {}, '0');
  const teller = h('span', { class: 'teller-pil s4-teller', role: 'img', 'aria-label': 'Filmrolletje: 0 opnames' }, [
    svgIcoon('s4-film', 48, 48, 26, 26), tellerGetal,
  ]);

  const decor = DECOR[omg.omgeving];
  const WERKER = decor.werker;
  const svg = scene(F.B, F.H, { label: decor.label });
  svg.classList.add('s4-scene');
  const laag = el('g', { class: 's4-laag' });
  const frameLaag = el('g', { class: 's4-frames' });
  const flits = el('rect', { class: 's4-flits', x: 0, y: 0, width: F.B, height: F.H, fill: '#FFFFFF', opacity: 0 });
  svg.append(decor.achter(), laag, frameLaag, flits);

  // Sorteerbare dingen: rekwisieten, familieleden en Pino.
  const dingen = decor.rekwisieten().map((r) => ({ ...r }));
  const werkerKnoop = dingen.find((d) => d.werker).knoop;
  for (const d of dingen) laag.append(d.knoop);

  const lidStaat = {};
  for (const lid of leden) {
    const knoop = el('g', { class: 's4-lid' });
    const d = { y: 0, knoop, lid };
    dingen.push(d);
    laag.append(knoop);
    lidStaat[lid.rol] = { d, sleutel: '', x: 0, y: 0, toestand: 'staan', soort: lid.soort };
  }

  const pinoStaat = { x: omg.pino.rust[0], y: omg.pino.rust[1], richting: omg.pino.richting, pose: 'staan', sleutel: '', doel: null, aangekomen: null };
  const pinoKnoop = el('g', { class: 's4-pino' });
  const pinoDing = { y: pinoStaat.y, knoop: pinoKnoop };
  dingen.push(pinoDing);
  laag.append(pinoKnoop);

  // Knoppen over de scène: één per familielid (bewegen mee) en de werker (spel 7).
  const knoppenLaag = h('div', { class: 's4-knoppen' });
  const knoppen = {};
  for (const lid of kijken ? [] : leden) {
    const knop = h('button', { type: 'button', class: 's4-knop', 'aria-label': lid.label, onclick: () => tik(lid.rol) });
    knoppen[lid.rol] = knop;
    knoppenLaag.append(knop);
  }
  if (datum.deurOpen(7)) {
    knoppenLaag.append(h('button', {
      type: 'button', class: 's4-knop s4-knop-werker', 'aria-label': 'Werker', onclick: vindWerker,
      style: { left: pct(WERKER.x - 6, F.B), top: pct(WERKER.y - 6, F.H), width: pct(WERKER.b + 12, F.B), height: pct(WERKER.h + 12, F.H) },
    }));
  }

  // Filmstrook: één vakje per fotoplek met de silhouetten van wie erop moet.
  const vakjes = {};
  const strook = h('div', { class: 's4-filmstrook', role: 'group', 'aria-label': 'Filmstrook' }, omg.plekken.map((plek) => {
    const rollen = Object.keys(plek.doelen);
    const sil = el('svg', { class: 'ic s4-sil', viewBox: `0 0 ${24 * rollen.length} 32`, width: 24 * rollen.length, height: 32, 'aria-hidden': 'true' },
      rollen.map((r, i) => use(silhouet(r, familieId), i * 24, 0, 24, 32, '#9DB4C4')));
    const vak = h('div', { class: 's4-vak', role: 'img', 'aria-label': 'Nog geen foto' }, [sil]);
    vakjes[plek.id] = vak;
    return vak;
  }));

  const kaart = h('div', { class: 'scene-kaart s4-kaart' }, [svg, knoppenLaag]);
  const scherm = h('div', { class: 'scherm spel spel4' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', ...terugKnop(zoek), rechts: kijken ? null : teller }),
    h('div', { class: 's4-ruimte' }, [kaart]),
    strook,
  ]);
  root.replaceChildren(scherm);

  /* ---------- per frame ---------- */
  function standen() {
    const uit = {};
    for (const [rol, ls] of Object.entries(lidStaat)) uit[rol] = { x: ls.x, y: ls.y, toestand: ls.toestand, soort: ls.soort };
    return uit;
  }

  function update(dt) {
    t += dt;
    for (const lid of leden) {
      const ls = lidStaat[lid.rol];
      if (geparkeerd[lid.rol]) {
        Object.assign(ls, geparkeerd[lid.rol], { toestand: 'moment', loopFase: 0 });
      } else {
        const s = F.stand(routes[lid.rol], t);
        Object.assign(ls, { x: s.x, y: s.y, toestand: s.toestand, richting: s.richting, loopFase: s.loopFase });
      }
    }
    // Pino loopt naar zijn doel.
    if (pinoStaat.doel) {
      const [dx, dy] = [pinoStaat.doel[0] - pinoStaat.x, pinoStaat.doel[1] - pinoStaat.y];
      const afst = Math.hypot(dx, dy);
      const stap = F.PINO_SNELHEID * dt;
      if (Math.abs(dx) > 0.5) pinoStaat.richting = dx < 0 ? -1 : 1;
      if (afst <= stap) {
        pinoStaat.x = pinoStaat.doel[0];
        pinoStaat.y = pinoStaat.doel[1];
        pinoStaat.doel = null;
        const klaarOk = pinoStaat.aangekomen;
        pinoStaat.aangekomen = null;
        if (klaarOk) klaarOk();
      } else {
        pinoStaat.x += (dx / afst) * stap;
        pinoStaat.y += (dy / afst) * stap;
        pinoStaat.loopFase = (pinoStaat.loopFase || 0) + dt;
      }
    }
  }

  function teken() {
    for (const lid of leden) {
      const ls = lidStaat[lid.rol];
      const pose = ls.toestand;
      const sleutel = `${pose}|${ls.richting}`;
      if (sleutel !== ls.sleutel) {
        ls.sleutel = sleutel;
        ls.d.knoop.replaceChildren(lidTekening(lid, pose, ls.richting));
      }
      const wip = !rustig && pose === 'loop' ? -Math.abs(Math.sin(ls.loopFase * Math.PI * 4)) * 2 : 0;
      ls.d.knoop.setAttribute('transform', `translate(${ls.x.toFixed(1)} ${(ls.y + wip).toFixed(1)})`);
      ls.d.y = ls.y;
      if (knoppen[lid.rol]) {
        const r = F.raakvlak(ls.soort, ls.x, ls.y);
        const k = knoppen[lid.rol].style;
        k.left = pct(r.x, F.B); k.top = pct(r.y, F.H); k.width = pct(r.b, F.B); k.height = pct(r.h, F.H);
      }
    }
    const ps = `${pinoStaat.pose}|${pinoStaat.richting}`;
    if (ps !== pinoStaat.sleutel) {
      pinoStaat.sleutel = ps;
      pinoKnoop.replaceChildren(pino(-24, -71, pinoStaat.pose, { flip: pinoStaat.richting < 0 }));
    }
    const pwip = !rustig && pinoStaat.pose === 'loop' ? -Math.abs(Math.sin((pinoStaat.loopFase || 0) * Math.PI * 5)) * 2 : 0;
    pinoKnoop.setAttribute('transform', `translate(${pinoStaat.x.toFixed(1)} ${(pinoStaat.y + pwip).toFixed(1)})`);
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

  /* ---------- frame ---------- */
  let roodTimer = null;
  function toonFrame(frame, kleur) {
    frameLaag.replaceChildren(zoeker(frame, kleur));
  }
  function wisFrame() {
    frameLaag.replaceChildren();
  }

  /* ---------- tikken ---------- */
  function tik(rol) {
    if (gestopt || bezig || af) return;
    const r = F.beoordeel(omg, rol, standen(), gedaan);
    if (r.uitkomst === 'niets') return;
    opnames++;
    tellerGetal.textContent = String(opnames);
    teller.setAttribute('aria-label', `Filmrolletje: ${opnames} opnames`);
    if (r.uitkomst === 'fout') {
      miskliks++;
      toonFrame(r.frame, ROOD);
      clearTimeout(roodTimer);
      roodTimer = setTimeout(wisFrame, F.ROOD_MS);
      return;
    }
    clearTimeout(roodTimer);
    wisFrame();
    maakFoto(r.plek);
  }

  async function maakFoto(plek) {
    bezig = true;
    // De doelen blijven vanaf nu op hun plek staan (en lachen).
    for (const [rol, p] of Object.entries(plek.doelen)) geparkeerd[rol] = { x: p[0], y: p[1] };
    // Pino loopt naar het fotopunt bij deze plek.
    pinoStaat.pose = 'loop';
    await new Promise((ok) => { pinoStaat.doel = plek.fotopunt; pinoStaat.aangekomen = ok; });
    if (gestopt) return;
    pinoStaat.pose = 'foto';
    pinoStaat.richting = plek.richting;
    toonFrame(plek.frame, WIT);
    await wacht(rustig ? 250 : 450);
    if (gestopt) return;
    flitsAf();
    fotos[plek.id] = foto(familieId, plek.id);
    await wacht(rustig ? 150 : 250);
    if (gestopt) return;
    await vulVakje(plek);
    if (gestopt) return;
    wisFrame();
    pinoStaat.pose = 'staan';
    gedaan.push(plek.id);
    bezig = false;
    if (gedaan.length === omg.plekken.length) einde();
  }

  function flitsAf() {
    const camera = use('s4-flits', pinoStaat.x - 14, pinoStaat.y - 52, 28, 28, null, { class: 's4-flits-ster' });
    frameLaag.append(camera);
    if (!rustig) flits.animate([{ opacity: 0 }, { opacity: 0.85 }, { opacity: 0 }], { duration: 280, easing: 'ease-out' });
    wacht(320).then(() => camera.remove());
  }

  async function vulVakje(plek, { vliegen = !rustig } = {}) {
    const vak = vakjes[plek.id];
    const polaroid = h('div', { class: 's4-polaroid-klein' }, [fotos[plek.id].cloneNode(true)]);
    vak.replaceChildren(polaroid);
    vak.classList.add('s4-vak-vol');
    vak.setAttribute('aria-label', 'Foto gemaakt');
    if (!vliegen) return;
    // De foto vliegt van het frame naar zijn vakje.
    const van = frameRechthoek(plek.frame);
    const naar = polaroid.getBoundingClientRect();
    const vlieger = h('div', { class: 's4-polaroid-klein s4-vlieger' }, [fotos[plek.id].cloneNode(true)]);
    Object.assign(vlieger.style, { left: `${naar.left}px`, top: `${naar.top}px`, width: `${naar.width}px`, height: `${naar.height}px` });
    document.body.append(vlieger);
    polaroid.style.visibility = 'hidden';
    const sx = van.width / naar.width;
    const sy = van.height / naar.height;
    const anim = vlieger.animate([
      { transform: `translate(${van.left - naar.left}px, ${van.top - naar.top}px) scale(${sx}, ${sy})`, transformOrigin: '0 0' },
      { transform: 'translate(0, 0) scale(1, 1) rotate(-4deg)', transformOrigin: '0 0' },
    ], { duration: 600, easing: 'cubic-bezier(.3,.7,.4,1)' });
    // Met een tijdslimiet: een gepauzeerde animatie (verborgen tab, energiebesparing) mag het spel niet laten vastlopen.
    await Promise.race([new Promise((ok) => { anim.onfinish = ok; anim.oncancel = ok; }), wacht(800)]);
    vlieger.remove();
    polaroid.style.visibility = '';
  }

  function frameRechthoek(frame) {
    const r = svg.getBoundingClientRect();
    const k = r.width / F.B;
    return { left: r.left + frame.x * k, top: r.top + frame.y * k, width: frame.b * k, height: frame.h * k };
  }

  /* ---------- werker (spel 7) ---------- */
  function vindWerker() {
    werkerGevonden(4, { zoek });
    if (rustig) return;
    werkerKnoop.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], { duration: 350, iterations: 2 });
  }

  /* ---------- einde ---------- */
  async function einde() {
    af = true;
    await wacht(rustig ? 400 : 900);
    if (gestopt) return;
    lus.stop();
    const bedrag = staat.markeerFotos(familieId, F.BETALING[familieId] || 0);
    const eersteKeer = klaar({ score: { opnames, miskliks } });
    const volgende = F.volgendeFamilie(staat.lees());
    toonResultaat({
      root,
      icoon: info.icoon,
      label: `${info.titel.toUpperCase()} · KLAAR`,
      titel: 'Drie plaatjes voor het album!',
      inhoud: polaroids(),
      tegels: [{ label: 'VERDIEND', waarde: bedrag, kleur: '#9A5B00', icoon: svgIcoon('s4-munt', 48, 48, 22, 22) }],
      beloning: { ...info.beloning, eersteKeer },
      opnieuw: volgende ? opnieuw : null,
    });
  }

  function polaroids() {
    return h('div', { class: 's4-polaroids', role: 'img', 'aria-label': "Drie foto's van de familie" },
      omg.plekken.map((plek, i) => h('div', { class: `s4-polaroid s4-polaroid-${i + 1}` }, [fotos[plek.id] || null])));
  }

  /* ---------- start ---------- */
  if (kijken) {
    // Alleen bekijken: iedereen staat al op de foto.
    af = true;
    for (const plek of omg.plekken) {
      for (const [rol, [x, y]] of Object.entries(plek.doelen)) {
        const richting = plek.kijk?.[rol] || (x <= plek.frame.x + plek.frame.b / 2 ? 1 : -1);
        geparkeerd[rol] = { x, y, richting };
      }
      gedaan.push(plek.id);
      fotos[plek.id] = foto(familieId, plek.id);
      vulVakje(plek, { vliegen: false });
    }
  }
  const lus = maakLus({ update, teken });
  update(0);
  teken();
  lus.start();
  if (datum.isTest()) window.pinoDebug = { spel: 4, familie: familieId, omg, routes, standen, get t() { return t; }, controleer: () => F.controleer(familieId) };

  return () => {
    gestopt = true;
    lus.stop();
    clearTimeout(roodTimer);
    for (const id of timers) clearTimeout(id);
    document.querySelectorAll('.s4-vlieger').forEach((n) => n.remove());
    if (window.pinoDebug && window.pinoDebug.spel === 4) delete window.pinoDebug;
  };
}

function svgIcoon(id, vb, vh, w, hgt) {
  return el('svg', { class: 'ic', viewBox: `0 0 ${vb} ${vh}`, width: w, height: hgt, 'aria-hidden': 'true' }, [use(id, 0, 0, vb, vh)]);
}
