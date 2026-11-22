// Beeldfeedback ("sap", besluit 210): de app heeft geen geluid, dus het beeld laat voelen wat er gebeurt.
// Kleine effecten voor DOM en SVG. Alles is een toevoeging: valt een effect weg (oude browser, reduced
// motion), dan werkt het scherm precies zoals zonder. Zie specs/beeldfeedback.md.
//
//   rustig()                              reduced motion aan?
//   wip(el, { sterkte })                  squash & stretch bij een tik
//   pop(el, { vertraging, duur })         verschijnen met overshoot
//   verschijn(el, { dy, vertraging })     binnenkomen: omhoog schuiven en iets groeien
//   krimp(el, { duur })                   verdwijnen (omgekeerde pop) → Promise
//   puls(el)                              kort opzwellen (teller, knop)
//   schud(el, { sterkte, duur })          horizontaal schudden
//   flits(houder, { kleur, duur, piek })  gekleurde laag die opflitst en vervaagt
//   vlieg({ van, naar, inhoud, duur })    icoon vliegt in een boog van A naar B → Promise
//   deeltjes(svg, x, y, { soort, … })     sterren/hartjes/stofjes spatten uit een punt (SVG, wereldeenheden)
//   bubbel(svg, x, y, soort, { duur })    reactiewolkje boven een personage: hart | boos | uitroep | lamp
//   confetti(houder, { aantal })          vallende confetti in de paletkleuren
//   telOp(el, van, naar, { duur })        getal telt op of af → Promise
//   tril(ms)                              kort trillen (alleen Android; max. 80 ms)
//   leven(svg)                            wachtanimaties voor elk element met data-sap (zie daar)
//
// Vervormen gebeurt met de losse CSS-eigenschappen `scale` en `translate`. Die komen bovenop een bestaande
// `transform` (gecentreerd taartmenu, SVG-groep met transform-attribuut) in plaats van die te vervangen.

import { el, use } from '../sprites.js';

let mq = null;

/** Reduced motion aan? (Live gelezen, zodat een wijziging in de instellingen meteen telt.) */
export function rustig() {
  try {
    mq = mq || window.matchMedia('(prefers-reduced-motion: reduce)');
    return mq.matches;
  } catch {
    return false;
  }
}

/** element.animate met vangnet; geeft de animatie of null. */
function animeer(doel, frames, opties) {
  if (!doel || typeof doel.animate !== 'function') return null;
  try { return doel.animate(frames, opties); } catch { return null; }
}

/** Promise die afloopt als de animatie klaar is, of uiterlijk na de duur + marge (verborgen tab, geen animatie). */
function klaar(anim, duur) {
  return new Promise((los) => {
    let gedaan = false;
    const af = () => { if (!gedaan) { gedaan = true; los(); } };
    if (anim && anim.finished) anim.finished.then(af, af);
    setTimeout(af, duur + 250);
  });
}

function isSvg(e) {
  return typeof SVGElement !== 'undefined' && e instanceof SVGElement;
}

/** Draaipunt voor scale: onderaan in het midden of in het midden (SVG: van het element zelf). */
function draaipunt(e, onder) {
  if (isSvg(e)) e.style.transformBox = 'fill-box';
  e.style.transformOrigin = onder ? '50% 100%' : '50% 50%';
}

/**
 * Het element dat vervormd wordt. Een SVG-element met een transform-attribuut (positie, schaal, spiegeling) krijgt
 * een binnenste groep: een ander draaipunt op het element zelf zou ook de schaal en spiegeling in dat attribuut
 * verschuiven, waardoor het personage of voorwerp van zijn plek raakt.
 */
function doelVoor(e) {
  if (!e || !isSvg(e)) return e;
  // Een <use> met x/y: de browser rekent fill-box (en dus het draaipunt) zonder die x/y, waardoor het element om
  // een punt ver weg draait en over het scherm schuift. Daarom komt er een groep omheen die wel goed meet.
  if (e.tagName.toLowerCase() === 'use') {
    const ouder = e.parentNode;
    if (ouder && ouder.classList?.contains('sap-omhulsel') && ouder.childElementCount === 1) return ouder;
    const omhulsel = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    omhulsel.setAttribute('class', 'sap-omhulsel');
    if (ouder) ouder.insertBefore(omhulsel, e);
    omhulsel.append(e);
    return omhulsel;
  }
  if (!e.getAttribute('transform') || e.tagName.toLowerCase() !== 'g') return e;
  const eerste = e.firstElementChild;
  if (eerste && eerste.classList.contains('sap-binnen') && e.childElementCount === 1) return eerste;
  const binnen = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  binnen.setAttribute('class', 'sap-binnen');
  while (e.firstChild) binnen.append(e.firstChild);
  e.append(binnen);
  return binnen;
}

/* ---------- vervormen ---------- */

export function wip(e, { sterkte = 1 } = {}) {
  if (!e || rustig()) return null;
  e = doelVoor(e);
  draaipunt(e, true);
  const s = sterkte;
  return animeer(e, [
    { scale: '1 1' },
    { scale: `${1 + 0.1 * s} ${1 - 0.12 * s}`, offset: 0.28 },
    { scale: `${1 - 0.05 * s} ${1 + 0.08 * s}`, offset: 0.62 },
    { scale: '1 1' },
  ], { duration: 300, easing: 'ease-out' });
}

export function pop(e, { vertraging = 0, duur = 420 } = {}) {
  if (!e) return null;
  if (rustig()) return animeer(e, [{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: vertraging, fill: 'backwards' });
  e = doelVoor(e);
  draaipunt(e, false);
  return animeer(e, [
    { scale: '0', opacity: 0 },
    { scale: '1.14', opacity: 1, offset: 0.6 },
    { scale: '1', opacity: 1 },
  ], { duration: duur, delay: vertraging, easing: 'cubic-bezier(0.3, 1.3, 0.6, 1)', fill: 'backwards' });
}

/** Binnenkomen: omhoog schuiven en iets groeien (dialoog, melding, laadregel). Negatieve dy = van boven. */
export function verschijn(e, { dy = 16, schaal = 0.94, duur = 280, vertraging = 0 } = {}) {
  if (!e) return null;
  if (rustig()) return animeer(e, [{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: vertraging, fill: 'backwards' });
  return animeer(e, [
    { translate: `0 ${dy}px`, scale: `${schaal}`, opacity: 0 },
    { translate: '0 0', scale: '1', opacity: 1 },
  ], { duration: duur, delay: vertraging, easing: 'cubic-bezier(0.3, 1.25, 0.6, 1)', fill: 'backwards' });
}

export function krimp(e, { duur = 180 } = {}) {
  if (!e) return Promise.resolve();
  e = doelVoor(e);
  draaipunt(e, false);
  const anim = rustig()
    ? animeer(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' })
    : animeer(e, [{ scale: '1', opacity: 1 }, { scale: '0.3', opacity: 0 }], { duration: duur, easing: 'ease-in', fill: 'forwards' });
  return klaar(anim, duur);
}

export function puls(e, { schaal = 1.16, duur = 260 } = {}) {
  if (!e || rustig()) return null;
  e = doelVoor(e);
  draaipunt(e, false);
  return animeer(e, [{ scale: '1' }, { scale: `${schaal}`, offset: 0.4 }, { scale: '1' }], { duration: duur, easing: 'ease-out' });
}

export function schud(e, { sterkte = 6, duur = 340 } = {}) {
  if (!e || rustig()) return null;
  const s = sterkte;
  return animeer(e, [
    { translate: '0 0' },
    { translate: `${-s}px 0`, offset: 0.15 },
    { translate: `${s}px 0`, offset: 0.35 },
    { translate: `${-0.6 * s}px 0`, offset: 0.55 },
    { translate: `${0.4 * s}px 0`, offset: 0.75 },
    { translate: '0 0' },
  ], { duration: duur, easing: 'ease-out' });
}

/* ---------- wachtanimaties via script ---------- */

/**
 * Laat een scène leven: elk element met data-sap krijgt een oneindige, zachte animatie (besluit 210).
 *   data-sap="wieg 2 3400"    zwaaien om de voet: hoek (graden), duur (ms)
 *   data-sap="hang 3 2800"    zwaaien aan een draad (draaipunt bovenaan het midden van de tekening)
 *   data-sap="haak 4 2600"    zwaaien om het eigen nulpunt (0,0): leg de inhoud zo neer dat (0,0) het haakje is
 *   data-sap="dobber -3 2600" op en neer: afstand (px, eenheden van de SVG), duur
 *   data-sap="drijf 8 9000"   heen en weer drijven: afstand, duur (wolken)
 *   data-sap="adem 1.025 2800" ademen: schaal, duur
 *   data-sap="gloei 0.5 1800" licht en donker: laagste dekking, duur
 * Via de Web Animations API in plaats van CSS: een scène die knopen herordent (diepte sorteren) zou een
 * CSS-animatie bij elke verplaatsing opnieuw laten beginnen; een scriptanimatie loopt gewoon door.
 * Elk element krijgt een eigen fase. Met reduced motion: niets. Geeft de animaties terug.
 */
export function leven(wortel) {
  if (!wortel || rustig()) return [];
  const lijst = [];
  const elementen = wortel.matches?.('[data-sap]') ? [wortel, ...wortel.querySelectorAll('[data-sap]')] : wortel.querySelectorAll('[data-sap]');
  let i = 0;
  for (const e of elementen) {
    const [soort, a, d] = e.getAttribute('data-sap').split(/\s+/);
    const waarde = Number(a);
    const duur = Number(d) || 3000;
    let frames;
    let doel = e;
    if (soort === 'haak') {
      // Zwaaien om het eigen nulpunt (0,0) van het element: zet de inhoud zo neer dat (0,0) het haakje is.
      frames = [{ rotate: `${-(waarde || 3)}deg` }, { rotate: `${waarde || 3}deg` }];
    } else if (soort === 'wieg' || soort === 'hang') {
      doel = doelVoor(e);
      draaipunt(doel, soort === 'wieg');
      if (soort === 'hang') doel.style.transformOrigin = '50% 0';
      frames = [{ rotate: `${-(waarde || 2)}deg` }, { rotate: `${waarde || 2}deg` }];
    } else if (soort === 'dobber') frames = [{ translate: '0 0' }, { translate: `0 ${waarde || -3}px` }];
    else if (soort === 'drijf') frames = [{ translate: `${-(waarde || 6)}px 0` }, { translate: `${waarde || 6}px 0` }];
    else if (soort === 'adem') { doel = doelVoor(e); draaipunt(doel, true); frames = [{ scale: '1 1' }, { scale: `1 ${waarde || 1.025}` }]; }
    else if (soort === 'gloei') frames = [{ opacity: waarde || 0.6 }, { opacity: 1 }];
    else continue;
    // Gouden-snedefase: buren lopen niet gelijk op.
    const fase = ((i++ * 0.618) % 1) * duur * 2;
    const anim = animeer(doel, frames, { duration: duur, iterations: Infinity, direction: 'alternate', easing: 'ease-in-out', delay: -fase });
    if (anim) lijst.push(anim);
  }
  return lijst;
}

/* ---------- licht ---------- */

/** Gekleurde laag over een element (dat position: relative krijgt als het static is). */
export function flits(houder, { kleur = '#FFFFFF', duur = 280, piek = 0.8, rand = false } = {}) {
  if (!houder || rustig()) return null;
  try { if (getComputedStyle(houder).position === 'static') houder.style.position = 'relative'; } catch { /* negeren */ }
  const laag = document.createElement('div');
  laag.className = 'sap-flits';
  laag.setAttribute('aria-hidden', 'true');
  if (rand) laag.style.boxShadow = `inset 0 0 0 10px ${kleur}`;
  else laag.style.background = kleur;
  houder.append(laag);
  const anim = animeer(laag, [{ opacity: 0 }, { opacity: piek, offset: 0.2 }, { opacity: 0 }], { duration: duur, easing: 'ease-out' });
  klaar(anim, duur).then(() => laag.remove());
  return anim;
}

/* ---------- vliegen ---------- */

function puntVan(x) {
  if (x && typeof x.getBoundingClientRect === 'function') {
    const r = x.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }
  return x;
}

/**
 * Een icoon (element) vliegt in een boog van `van` naar `naar` (elementen of { x, y } in viewport-px).
 * Het vliegende element staat fixed boven alles en verdwijnt bij aankomst. Met reduced motion: meteen klaar.
 */
export function vlieg({ van, naar, inhoud, duur = 620, boog = 70, maat = 28, eindSchaal = 0.7 }) {
  const a = puntVan(van);
  const b = puntVan(naar);
  if (!a || !b || !inhoud || rustig()) return Promise.resolve();
  const vlieger = document.createElement('div');
  vlieger.className = 'sap-vlieger';
  vlieger.setAttribute('aria-hidden', 'true');
  vlieger.style.width = `${maat}px`;
  vlieger.style.height = `${maat}px`;
  vlieger.append(inhoud);
  document.body.append(vlieger);
  // Kwadratische bezier met het controlepunt boven het midden; 9 tussenpunten als keyframes.
  const cx = (a.x + b.x) / 2;
  const cy = Math.min(a.y, b.y) - boog;
  const frames = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * cx + t * t * b.x;
    const y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * cy + t * t * b.y;
    const s = 1 + (eindSchaal - 1) * t + 0.15 * Math.sin(Math.PI * t);
    frames.push({ transform: `translate(${x - maat / 2}px, ${y - maat / 2}px) scale(${s})`, offset: t });
  }
  const anim = animeer(vlieger, frames, { duration: duur, easing: 'ease-in-out', fill: 'forwards' });
  return klaar(anim, duur).then(() => vlieger.remove());
}

/* ---------- deeltjes en wolkjes (SVG) ---------- */

const DEELTJE = {
  ster: { id: 's10-ster', maat: 12, afstand: 30, duur: 700 },
  hart: { id: 's9-hart', maat: 16, afstand: 26, duur: 900, kleur: '#FF6FAE' },   // s9-hart kleurt via currentColor
  stof: { id: 's9-stof', maat: 16, afstand: 14, duur: 450 },
  flits: { id: 's4-flits', maat: 14, afstand: 28, duur: 650 },
};

/**
 * Deeltjes in een SVG (svg of g), in de eenheden van die SVG. soort: ster | hart | stof | flits.
 * Stof blijft laag en waait opzij; de rest spat rondom uit. Met reduced motion: niets.
 */
export function deeltjes(svg, x, y, { soort = 'ster', aantal = 6, afstand = null, maat = null, kleur = null, duur = null } = {}) {
  if (!svg || rustig()) return;
  const d = DEELTJE[soort] || DEELTJE.ster;
  const m = maat ?? d.maat;
  const af = afstand ?? d.afstand;
  const ms = duur ?? d.duur;
  const groep = el('g', { class: 'sap-deeltjes', 'aria-hidden': 'true', transform: `translate(${x} ${y})` });
  for (let i = 0; i < aantal; i++) {
    let hoek;
    if (soort === 'stof') hoek = (i % 2 ? 0 : Math.PI) + (Math.random() - 0.5) * 0.6 - 0.25;
    else hoek = (i / aantal) * Math.PI * 2 + (Math.random() - 0.5) * 0.5 - Math.PI / 2;
    const r = af * (0.7 + Math.random() * 0.5);
    // x/y op 0 en de verschuiving in een groep eromheen: anders draait/schaalt de browser de <use> om een verkeerd punt.
    const u = use(d.id, 0, 0, m, m, kleur ?? d.kleur ?? null);
    u.setAttribute('class', 'sap-deeltje');
    u.style.setProperty('--dx', `${(Math.cos(hoek) * r).toFixed(1)}px`);
    u.style.setProperty('--dy', `${(Math.sin(hoek) * r * (soort === 'stof' ? 0.4 : 1)).toFixed(1)}px`);
    u.style.animationDuration = `${ms}ms`;
    groep.append(el('g', { transform: `translate(${-m / 2} ${-m / 2})` }, [u]));
  }
  svg.append(groep);
  setTimeout(() => groep.remove(), ms + 150);
}

function heeftSymbool(id) {
  return !!document.getElementById(id);
}

/** Inhoud van een wolkje; zolang de sprites van besluit 211 er nog niet zijn, een eenvoudige eigen tekening. */
function bubbelInhoud(soort, m) {
  const delen = [];
  if (heeftSymbool('bub-wolk')) delen.push(use('bub-wolk', 0, 0, m, m));
  else {
    delen.push(el('ellipse', { cx: m / 2, cy: m * 0.42, rx: m * 0.46, ry: m * 0.36, fill: '#CDE4F0' }));
    delen.push(el('ellipse', { cx: m / 2, cy: m * 0.4, rx: m * 0.46, ry: m * 0.36, fill: '#FFFFFF' }));
    delen.push(el('path', { d: `M${m * 0.42} ${m * 0.7} L${m * 0.5} ${m * 0.92} L${m * 0.6} ${m * 0.7}z`, fill: '#FFFFFF' }));
  }
  const i = m * 0.52;
  const ix = (m - i) / 2;
  const iy = m * 0.4 - i / 2;
  if (soort === 'hart') delen.push(use('s9-hart', ix, iy, i, i, '#FF6FAE'));
  else if (soort === 'lamp') delen.push(use('s8-lamp-aan', ix, iy, i, i));
  else if (soort === 'boos') {
    if (heeftSymbool('bub-boos')) delen.push(use('bub-boos', ix, iy, i, i));
    else delen.push(el('path', { d: `M${ix} ${iy + i * 0.5} q${i * 0.12} ${-i * 0.4} ${i * 0.25} 0 t${i * 0.25} 0 t${i * 0.25} 0 t${i * 0.25} 0`, fill: 'none', stroke: '#C43B38', 'stroke-width': m * 0.08, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  } else if (soort === 'uitroep') {
    if (heeftSymbool('bub-uitroep')) delen.push(use('bub-uitroep', ix, iy, i, i));
    else delen.push(
      el('rect', { x: m / 2 - m * 0.055, y: iy + i * 0.02, width: m * 0.11, height: i * 0.62, rx: m * 0.055, fill: '#FF5E5B' }),
      el('circle', { cx: m / 2, cy: iy + i * 0.88, r: m * 0.065, fill: '#FF5E5B' }),
    );
  }
  return delen;
}

/**
 * Reactiewolkje boven een personage: (x, y) is het punt waar het staartje naar wijst (boven het hoofd),
 * in de eenheden van de SVG. Pop't, blijft even staan en vervaagt. Met reduced motion: staat stil en verdwijnt.
 */
export function bubbel(svg, x, y, soort, { duur = 1400, maat = 30 } = {}) {
  if (!svg) return null;
  const binnen = el('g', { class: rustig() ? null : 'sap-bubbel' }, bubbelInhoud(soort, maat));
  binnen.style.animationDuration = `${duur}ms`;
  const groep = el('g', { class: 'sap-bubbel-plek', 'aria-hidden': 'true', transform: `translate(${x - maat / 2} ${y - maat * 0.95})` }, [binnen]);
  svg.append(groep);
  setTimeout(() => groep.remove(), duur + 50);
  return groep;
}

/* ---------- feest ---------- */

const CONFETTI_KLEUREN = ['#FF6FAE', '#FFC93C', '#39D353', '#9B6BFF', '#1FA3DC', '#FF8A3D', '#FF5E5B'];

/** Vallende confetti over een houder (position relative/absolute). Met reduced motion: blijft verspreid liggen. */
export function confetti(houder, { aantal = 32, kleuren = CONFETTI_KLEUREN, golf = 0 } = {}) {
  const laag = document.createElement('div');
  laag.className = 'sap-confetti';
  laag.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < aantal; i++) {
    const stuk = document.createElement('span');
    stuk.className = 'sap-confetti-stuk';
    const breed = i % 3 === 0;
    stuk.style.left = `${(i * 37 + Math.random() * 20) % 100}%`;
    stuk.style.width = `${breed ? 12 : 8}px`;
    stuk.style.height = `${breed ? 6 : 10}px`;
    stuk.style.background = kleuren[i % kleuren.length];
    stuk.style.setProperty('--x', `${Math.round((Math.random() - 0.5) * 80)}px`);
    stuk.style.setProperty('--draai', `${Math.round(360 + Math.random() * 540) * (i % 2 ? 1 : -1)}deg`);
    stuk.style.setProperty('--rust-y', `${Math.round(10 + Math.random() * 70)}%`);
    stuk.style.animationDelay = `${golf + Math.round(Math.random() * 900)}ms`;
    stuk.style.animationDuration = `${2400 + Math.round(Math.random() * 1400)}ms`;
    laag.append(stuk);
  }
  houder.append(laag);
  return laag;
}

/* ---------- getallen ---------- */

const telTokens = new WeakMap();

/** Getal in een element telt van `van` naar `naar`. Met reduced motion staat het meteen goed. */
export function telOp(e, van, naar, { duur = 500, opmaak = (n) => String(n) } = {}) {
  if (!e) return Promise.resolve();
  const token = {};
  telTokens.set(e, token);
  if (rustig() || van === naar) {
    e.textContent = opmaak(naar);
    return Promise.resolve();
  }
  return new Promise((los) => {
    const start = performance.now();
    const stap = (nu) => {
      if (telTokens.get(e) !== token) { los(); return; }
      const t = Math.min(1, (nu - start) / duur);
      const f = 1 - (1 - t) * (1 - t);
      e.textContent = opmaak(Math.round(van + (naar - van) * f));
      if (t < 1) requestAnimationFrame(stap);
      else los();
    };
    requestAnimationFrame(stap);
    // Verborgen tab: rAF staat stil; zorg dat het getal toch klopt.
    setTimeout(() => { if (telTokens.get(e) === token) e.textContent = opmaak(naar); los(); }, duur + 400);
  });
}

/* ---------- trillen ---------- */

/** Kort trillen op Android (besluit 210): hooguit 80 ms, nooit herhaald. Op iPhone gebeurt niets. */
export function tril(ms = 20) {
  try {
    if (typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
    // Zonder eerdere tik weigert de browser het (met een melding in de console); dan niet proberen.
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    navigator.vibrate(Math.min(80, Math.max(0, ms)));
  } catch { /* negeren */ }
}
