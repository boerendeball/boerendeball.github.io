// Spel 3 · Complete the family — zie specs/spel3.md.
// Kalm spel (SVG-DOM): koop met de edelstenen uit spel 2 karakterkaarten; elk karakter springt
// met sterretjes op zijn vaste plek bij een familie. Een complete familie kijkt weer blij.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import { edelsteenPil, gemSvg, GEMS } from '../ui/edelstenen.js';
import { el, use, persoon, dier } from '../sprites.js';
import * as fam from './familie.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { werkerGevonden, terugKnop, werkerVak } from './zoeken.js';

/* ---------- tuning ---------- */
const POP_DUUR = 520;         // ms: karakter springt op zijn plek (CSS .fam-pop)
const HUP_VERTRAGING = 420;   // ms na de pop: de complete familie hupt en kijkt blij
const EIND_PAUZE = 1100;      // ms na de laatste hup tot het resultaatscherm
const STERREN = 6;            // sterretjes rond een nieuw karakter

/* ---------- scène (viewBox 0 0 358 150, uit spel3_build2.py) ---------- */
const B = 358;
const H = 150;
const STER = 'l2.2 6.6 6.6 2.2 -6.6 2.2 -2.2 6.6 -2.2 -6.6 -6.6 -2.2 6.6 -2.2z';
const WERKER = werkerVak(198, 110, 0.62);   // half achter de villa; schildert hem wit (wk-kwast, besluit 108)

function persoonVan(opties, gezicht) {
  const { x, y, ...rest } = opties;
  return persoon(x, y, { ...rest, gezicht });
}

/** Het karakter op zijn plek in de scène. */
function karakterOpPlek(plek, gezicht) {
  const k = fam.KARAKTERS[plek.karakter];
  if (k.soort === 'dier') return dier(plek.x, plek.y, k.dier);
  return persoon(plek.x - 2, plek.y - 14, { ...k.persoon, gezicht });
}

/** Sterretjes die vanuit het midden van een plek naar buiten vliegen (CSS .fam-ster). */
function sterren(plek) {
  const cx = plek.x + 24;
  const cy = plek.y + 18;
  const g = el('g', { class: 'fam-sterren', 'aria-hidden': 'true' });
  for (let i = 0; i < STERREN; i += 1) {
    const hoek = (-90 + (360 / STERREN) * i + 15) * (Math.PI / 180);
    const afstand = 26 + (i % 2) * 8;
    const s = el('path', { class: 'fam-ster', d: `M${cx} ${cy - 9} ${STER}`, fill: i % 3 === 1 ? '#FFFFFF' : '#FFC93C' });
    s.style.setProperty('--dx', `${(Math.cos(hoek) * afstand).toFixed(1)}px`);
    s.style.setProperty('--dy', `${(Math.sin(hoek) * afstand).toFixed(1)}px`);
    s.style.animationDelay = `${(i % 3) * 40}ms`;
    g.append(s);
  }
  return g;
}

function sceneLabel(f, gekocht) {
  const compleet = fam.isCompleet(f, gekocht);
  const leeg = f.plekken.filter((p) => !gekocht.includes(p.karakter)).length;
  const erbij = f.plekken.filter((p) => gekocht.includes(p.karakter)).map((p) => fam.KARAKTERS[p.karakter].label.toLowerCase());
  const extra = erbij.length ? `, met ${erbij.join(' en ')}` : '';
  if (compleet) return `Een familie voor ${f.omschrijving}${extra}; iedereen kijkt blij`;
  return `Een familie voor ${f.omschrijving}${extra}; ze kijken bedroefd, ${leeg === 1 ? 'één plek is' : `${leeg} plekken zijn`} nog leeg`;
}

/**
 * Eén familie als SVG-scène 358×150. Ook gebruikt door de popup van spel 4 (spellen/index.js).
 * opties.nieuw: karakter dat net gekocht is (pop + sterretjes); opties.hup: de familie is net compleet.
 */
export function familieScene(familieId, gekocht = [], { nieuw = null, hup = false, werker = true } = {}) {
  const f = fam.familie(familieId);
  const compleet = fam.isCompleet(f, gekocht);
  const gezicht = compleet ? 'b-blij' : 'b-bedroefd';
  const svg = el('svg', { class: 'fam-scene', viewBox: `0 0 ${B} ${H}`, width: B, height: H, role: 'img', 'aria-label': sceneLabel(f, gekocht) });
  svg.append(
    el('rect', { x: 0, y: 0, width: B, height: H, fill: f.lucht }),
    el('rect', { x: 0, y: 104, width: B, height: 46, fill: f.grond }),
    el('rect', { x: 0, y: 104, width: B, height: 4, fill: 'rgba(0,0,0,0.08)' }),
  );
  if (f.werker && werker) svg.append(el('g', { class: 'fam-werker' }, [
    // Gespiegeld: de kwast steekt aan de zichtbare kant uit, de verfpot staat achter de villa.
    // (Een extra groep, zodat de hup-animatie (CSS transform) de spiegeling niet overschrijft.)
    el('g', {}, [el('g', { transform: `translate(${WERKER.x + WERKER.b} ${WERKER.y}) scale(-1 1)` }, [use('wk-kwast', 0, 0, WERKER.b, WERKER.h)])]),
  ]));
  svg.append(use(f.huis, 186, 4, 160, 110));

  // Leden en gekochte karakters, met wat de familie compleet maakt; bij hup springt de hele groep.
  const groep = el('g', { class: hup ? 'fam-groep fam-hup' : 'fam-groep' });
  groep.style.setProperty('--hup-vertraging', `${POP_DUUR + HUP_VERTRAGING - 300}ms`);
  for (const lid of f.leden) groep.append(el('g', { class: 'fam-lid' }, [persoonVan(lid, gezicht)]));
  const plekken = el('g');
  for (const p of f.plekken) {
    if (gekocht.includes(p.karakter)) {
      const isNieuw = p.karakter === nieuw;
      groep.append(el('g', { class: isNieuw ? 'fam-lid fam-pop' : 'fam-lid' }, [karakterOpPlek(p, gezicht)]));
      if (isNieuw) plekken.append(sterren(p));
    } else {
      plekken.append(use('plek', p.x, p.y, 48, 40));
    }
  }
  svg.append(plekken, groep);
  // Sterretjes bovenop alles.
  const s = plekken.querySelector('.fam-sterren');
  if (s) svg.append(s);
  return svg;
}

/**
 * Plaatje op een karakterkaart (viewBox 0 0 48 52). Een persoon loopt in zijn 48×72-frame van de haarkruin
 * (y 5) tot de schaduw (y 72); die 67 eenheden schalen we op 50, horizontaal gecentreerd en tegen de onderrand.
 */
const KAART_B = 48;
const KAART_H = 52;
const PERSOON_BOVEN = 5;
const PERSOON_HOOGTE = 72 - PERSOON_BOVEN;

function kaartPlaatje(id) {
  const k = fam.KARAKTERS[id];
  let inhoud;
  if (k.soort === 'dier') inhoud = dier(0, 8, k.dier);
  else {
    const totaal = (KAART_H - 2) / PERSOON_HOOGTE;            // werkelijke schaal (incl. ×0,72 voor een kind)
    const schaal = totaal / (k.persoon.kind ? 0.72 : 1);
    inhoud = persoon(KAART_B / 2 - 24 * totaal, KAART_H - 72 * totaal, { ...k.persoon, schaal, gezicht: 'b-bedroefd' });
  }
  return el('svg', { class: 'ic', viewBox: '0 0 48 52', width: 60, height: 65, 'aria-hidden': 'true' }, [inhoud]);
}

/* ---------- spel ---------- */

export function start({ root, dag, info, klaar, zoek = false }) {
  const rustig = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let gestopt = false;
  let bezig = false;      // laatste kaart gekocht, wacht op het resultaatscherm
  const timers = new Set();
  const wacht = (ms) => new Promise((ok) => { const t = setTimeout(() => { timers.delete(t); ok(); }, ms); timers.add(t); });
  const gekocht = () => staat.lees().karakters;

  /* ---------- DOM ---------- */
  const pil = edelsteenPil();
  const scenes = {};
  const familieKaarten = fam.FAMILIES.map((f) => {
    const kaart = h('div', { class: 'familie', 'data-familie': f.id });
    scenes[f.id] = kaart;
    return kaart;
  });
  const kaartKnoppen = {};
  const bak = h('div', { class: 'kaart kaartenbak' }, [
    h('div', { class: 'kaartenrij' }, fam.KAARTEN.map((k) => {
      const knop = h('button', {
        type: 'button', class: 'kaartje', 'data-karakter': k.id, onclick: () => koop(k),
        onanimationend: (ev) => { if (ev.animationName === 'schud') knop.classList.remove('schud'); },
      }, [
        kaartPlaatje(k.id),
        h('span', { class: 'prijs' }, Object.entries(k.prijs).flatMap(([kleur, n]) => Array.from({ length: n }, () => gemSvg(kleur, 16)))),
      ]);
      kaartKnoppen[k.id] = knop;
      return knop;
    })),
  ]);

  const scherm = h('div', { class: 'scherm spel spel3' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', ...terugKnop(zoek), rechts: pil.element }),
    h('div', { class: 'families' }, familieKaarten),
    bak,
  ]);
  root.replaceChildren(scherm);

  /* ---------- tekenen ---------- */
  function tekenFamilie(f, opties = {}) {
    const kaart = scenes[f.id];
    kaart.replaceChildren(familieScene(f.id, gekocht(), { ...opties, nieuw: rustig ? null : opties.nieuw, hup: rustig ? false : opties.hup }));
    // De verstopte werker is pas aanklikbaar als spel 7 open is (specs/spel7.md).
    if (f.werker && datum.deurOpen(7)) {
      const pct = (v, t) => `${((v / t) * 100).toFixed(3)}%`;
      kaart.append(h('button', {
        type: 'button', class: 'fam-knop-werker', 'aria-label': 'Werker',
        style: { left: pct(WERKER.x - 4, B), top: pct(WERKER.y - 4, H), width: pct(WERKER.b + 8, B), height: pct(WERKER.h + 8, H) },
        onclick: vindWerker,
      }));
    }
  }

  function werkKaartenBij() {
    const s = staat.lees();
    for (const k of fam.KAARTEN) {
      const knop = kaartKnoppen[k.id];
      if (s.karakters.includes(k.id)) {
        if (!knop.classList.contains('kaartje-weg')) knop.classList.add('kaartje-leeg');
        knop.disabled = true;
        knop.setAttribute('aria-hidden', 'true');
        knop.tabIndex = -1;
        continue;
      }
      const kan = fam.betaalbaar(k.prijs, s.edelstenen);
      knop.classList.toggle('kaartje-duur', !kan);
      if (kan) knop.removeAttribute('aria-disabled'); else knop.setAttribute('aria-disabled', 'true');
      knop.setAttribute('aria-label', `${fam.KARAKTERS[k.id].label}, ${fam.prijsTekst(k.prijs)}`);
    }
  }

  /* ---------- kopen ---------- */
  function koop(k) {
    if (gestopt || bezig) return;
    const knop = kaartKnoppen[k.id];
    if (gekocht().includes(k.id)) return;
    if (!fam.betaalbaar(k.prijs, staat.lees().edelstenen)) {
      if (!rustig) { knop.classList.remove('schud'); void knop.offsetWidth; knop.classList.add('schud'); }
      return;
    }
    // Eerst de wegklasse: koopKarakter meldt de wijziging meteen aan werkKaartenBij (abonnee).
    if (!rustig) knop.classList.add('kaartje-weg');
    if (!staat.koopKarakter(k.id, k.prijs)) { knop.classList.remove('kaartje-weg'); return; }
    const f = fam.familieVan(k.id);
    const nuCompleet = fam.isCompleet(f, gekocht());
    if (nuCompleet && !staat.lees().familie) staat.zetFamilie(f.id);
    werkKaartenBij();
    tekenFamilie(f, { nieuw: k.id, hup: nuCompleet });
    if (fam.alleCompleet(gekocht())) einde();
  }

  /* ---------- werker (spel 7) ---------- */
  function vindWerker() {
    werkerGevonden(3, { zoek });
    const w = scenes.nguyen.querySelector('.fam-werker');
    if (w && !rustig) { w.classList.remove('hup'); void w.getBBox(); w.classList.add('hup'); }
  }

  /* ---------- einde ---------- */
  async function einde() {
    bezig = true;
    await wacht(rustig ? 600 : POP_DUUR + HUP_VERTRAGING + EIND_PAUZE);
    if (gestopt) return;
    const s = staat.lees();
    const over = GEMS.reduce((som, k) => som + (s.edelstenen[k] || 0), 0);
    const eersteKeer = klaar({ score: { over } });
    pil.opruim();
    toonResultaat({
      root,
      icoon: info.icoon,
      label: `${info.titel.toUpperCase()} · KLAAR`,
      titel: 'Iedereen is weer thuis!',
      zin: 'Drie huizen, drie families en niemand die nog iets mist. Zelfs het biggetje knort tevreden.',
      beloning: { ...info.beloning, eersteKeer },
    });
  }

  /* ---------- start ---------- */
  for (const f of fam.FAMILIES) tekenFamilie(f);
  werkKaartenBij();
  // Al afgerond: de lege bak hoeft er niet meer te staan.
  if (fam.alleCompleet(gekocht())) bak.hidden = true;
  const afmeld = staat.abonneer(werkKaartenBij);
  if (datum.isTest()) window.pinoDebug = { spel: 3, fam, staat };

  return () => {
    gestopt = true;
    for (const t of timers) clearTimeout(t);
    afmeld();
    pil.opruim();
    if (window.pinoDebug && window.pinoDebug.spel === 3) delete window.pinoDebug;
  };
}
