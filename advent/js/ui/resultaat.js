// Gedeeld resultaatscherm (Spel{n}-Klaar): bol met icoon, label, titel, één zin, scoretegels,
// beloningsblok en twee knoppen. Geen uitlegzin die de oplossing verraadt.

import { h } from './dom.js';
import { icoon, BOL_KLEUR, RING_KLEUR } from './iconen.js';
import { VAARDIGHEID_LABELS } from './vaardigheden.js';
import { BEHOEFTE_LABELS } from './behoeften.js';
import { ga } from '../router.js';
import * as sap from './sap.js';

/**
 * toonResultaat({ root, icoon, label, titel, zin, inhoud, tegels: [{ label, waarde, kleur, icoon }],
 *                 beloning: { vaardigheden, behoeften, eersteKeer, extra }, opnieuw, confetti })
 * beloning: meestal { ...info.beloning, eersteKeer } (vaardigheden/behoeften uit data/kalender.json).
 * confetti: false bij een mislukte poging (spel 6: "Gestolen!"); dan ook geen beloning meegeven.
 * verder: { label, actie } vervangt de knop "Terug naar de kalender" (spel 8: "Volgend level").
 * inhoud: optioneel element onder de titel (bv. de polaroids van spel 4); tegel.icoon: element vóór de waarde.
 */
export function toonResultaat({ root, icoon: naam, label, titel, zin = null, inhoud = null, tegels = [], beloning = null, opnieuw = null, terugNaar = '/', confetti = true, verder = null }) {
  const kaart = h('section', { class: 'kaart resultaat-kaart', 'aria-labelledby': 'resultaat-titel' }, [
    h('div', { class: 'grote-bol resultaat-bol', style: { background: BOL_KLEUR[naam] || '#FFE0EE', boxShadow: `0 0 0 3px ${RING_KLEUR[naam] || '#FF6FAE'}, 0 8px 18px rgba(30,58,76,0.18)` } }, [icoon(naam, 84, { label: titel })]),
    h('div', { class: 'kopbalk-label' }, label),
    h('h1', { class: 'kop resultaat-titel', id: 'resultaat-titel' }, titel),
    zin ? h('p', { class: 'resultaat-zin' }, zin) : null,
    inhoud,
    tegels.length ? h('div', { class: 'tegels', style: { gridTemplateColumns: `repeat(${tegels.length}, minmax(0, 1fr))`, maxWidth: tegels.length === 1 ? '180px' : '' } }, tegels.map((t) =>
      h('div', { class: 'tegel' }, [
        h('span', { class: 'tegel-label' }, t.label),
        t.icoon
          ? h('span', { class: 'tegel-met-icoon' }, [t.icoon, h('span', { class: 'kop tegel-waarde', style: { color: t.kleur || 'var(--tekst)' } }, String(t.waarde))])
          : h('span', { class: 'kop tegel-waarde', style: { color: t.kleur || 'var(--tekst)' } }, String(t.waarde)),
      ]))) : null,
    beloning ? maakBeloning(beloning) : null,
    h('div', { class: 'resultaat-knoppen' }, [
      verder
        ? h('button', { type: 'button', class: 'knop-pil knop-pil-groen', onclick: verder.actie }, verder.label)
        : h('button', { type: 'button', class: 'knop-pil knop-pil-groen', onclick: () => ga(terugNaar) }, 'Terug naar de kalender'),
      opnieuw ? h('button', { type: 'button', class: 'knop-pil knop-pil-grijs', onclick: opnieuw }, 'Nog een keer') : null,
    ]),
  ]);
  const scherm = h('div', { class: 'scherm resultaat' }, [kaart]);
  root.replaceChildren(scherm);
  if (confetti) sap.confetti(scherm, { aantal: 36 });
  animeerResultaat(kaart, { gelukt: confetti });
  queueMicrotask(() => kaart.querySelector('button')?.focus());
  return scherm;
}

/**
 * Het resultaat bouwt stap voor stap op (beeldfeedback, besluit 210): de bol springt erin (bij een mislukking
 * zakt hij even door), dan de titel, de scoretegels één voor één terwijl hun getal optelt, de beloning en
 * als laatste de knoppen. Met reduced motion vervaagt alles kort en staan de getallen meteen goed.
 */
function animeerResultaat(kaart, { gelukt }) {
  const bol = kaart.querySelector('.resultaat-bol');
  if (gelukt) sap.pop(bol, { duur: 520 });
  else if (bol && !sap.rustig()) bol.animate?.([{ translate: '0 -10px', opacity: 0 }, { translate: '0 8px', opacity: 1, offset: 0.55 }, { translate: '0 0' }], { duration: 700, easing: 'ease-out' });
  let t = 180;
  for (const e of [kaart.querySelector('.kopbalk-label'), kaart.querySelector('.resultaat-titel'), kaart.querySelector('.resultaat-zin')]) {
    if (!e) continue;
    sap.verschijn(e, { dy: 10, vertraging: t });
    t += 90;
  }
  for (const tegel of kaart.querySelectorAll('.tegel')) {
    sap.verschijn(tegel, { dy: 14, schaal: 0.9, vertraging: t });
    const waarde = tegel.querySelector('.tegel-waarde');
    const tekst = waarde?.textContent ?? '';
    if (/^\d+$/.test(tekst) && Number(tekst) > 0) {
      const n = Number(tekst);
      waarde.textContent = '0';
      setTimeout(() => sap.telOp(waarde, 0, n, { duur: Math.min(900, 300 + n * 25) }).then(() => sap.puls(waarde)), t + 150);
    }
    t += 220;
  }
  const beloning = kaart.querySelector('.beloning');
  if (beloning) {
    sap.verschijn(beloning, { dy: 14, vertraging: t + 100 });
    setTimeout(() => sap.puls(beloning.querySelector('.beloning-bol'), { schaal: 1.25, duur: 360 }), t + 450);
    t += 250;
  }
  sap.verschijn(kaart.querySelector('.resultaat-knoppen'), { dy: 10, vertraging: t + 150 });
}

// "Verjaardag vieren" is te lang voor de regel; de rest volgt BEHOEFTE_LABELS.
const BEHOEFTE_KORT = { ...BEHOEFTE_LABELS, verjaardag: 'Verjaardag' };

/** Beloningsblok: de verdiende vaardigheden en behoeften van deze dag (besluit 164); bij herspelen "Al verdiend". */
function maakBeloning({ vaardigheden = {}, behoeften = {}, eersteKeer = true, extra = null }) {
  // Elk item breekt niet midden in ("Koken +2" blijft bij elkaar); tussen de items mag de regel wel breken.
  const lijst = (items) => items.flatMap((tekst, i) => [i ? ' · ' : null, h('span', { style: { whiteSpace: 'nowrap' } }, tekst)]);
  const vaardItems = Object.entries(vaardigheden).map(([k, n]) => `${VAARDIGHEID_LABELS[k] || k} +${n}`);
  const noodItems = Object.entries(behoeften).map(([k, n]) => `${BEHOEFTE_KORT[k] || k} +${n}%`);
  const vaard = vaardItems.length ? lijst(vaardItems) : null;
  const noden = noodItems.length ? lijst(noodItems) : null;
  return h('div', { class: 'beloning' }, [
    h('div', { class: 'beloning-bol' }, [icoon('vaardigheid', 28)]),
    h('div', { class: 'beloning-tekst' }, [
      h('div', { class: 'beloning-label' }, 'VAARDIGHEDEN VERDIEND'),
      ...(eersteKeer
        ? [vaard ? h('div', { class: 'beloning-regel' }, vaard) : null, noden ? h('div', { class: 'beloning-extra' }, noden) : null]
        : [h('div', { class: 'beloning-regel' }, 'Al verdiend')]),
      extra ? h('div', { class: 'beloning-hint' }, extra) : null,
    ]),
  ]);
}
