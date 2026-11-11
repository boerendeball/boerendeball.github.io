// Gedeeld resultaatscherm (Spel{n}-Klaar): bol met icoon, label, titel, één zin, scoretegels,
// beloningsblok en twee knoppen. Geen uitlegzin die de oplossing verraadt.

import { h } from './dom.js';
import { icoon, BOL_KLEUR, RING_KLEUR } from './iconen.js';
import { VAARDIGHEID_LABELS } from './vaardigheden.js';
import { ga } from '../router.js';

/**
 * toonResultaat({ root, icoon, label, titel, zin, inhoud, tegels: [{ label, waarde, kleur, icoon }],
 *                 beloning: { vaardigheid, eersteKeer, extra }, opnieuw, confetti })
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
  const scherm = h('div', { class: 'scherm resultaat' }, [
    confetti ? h('div', { class: 'confetti', 'aria-hidden': 'true' }) : null,
    kaart,
  ]);
  root.replaceChildren(scherm);
  queueMicrotask(() => kaart.querySelector('button')?.focus());
  return scherm;
}

function maakBeloning({ vaardigheid = null, eersteKeer = true, extra = null }) {
  const naam = vaardigheid ? VAARDIGHEID_LABELS[vaardigheid] : null;
  let regel;
  if (!naam) regel = [h('span', {}, 'Behoefte "Verjaardag" +10%')];
  else if (eersteKeer) regel = [`${naam} +1 `, h('span', { class: 'beloning-extra' }, '· Behoefte "Verjaardag" +10%')];
  else regel = [`${naam} al verdiend`];
  return h('div', { class: 'beloning' }, [
    h('div', { class: 'beloning-bol' }, [icoon('vaardigheid', 28)]),
    h('div', { class: 'beloning-tekst' }, [
      h('div', { class: 'beloning-label' }, 'VAARDIGHEID VERDIEND'),
      h('div', { class: 'beloning-regel' }, regel),
      extra ? h('div', { class: 'beloning-hint' }, extra) : null,
    ]),
  ]);
}
