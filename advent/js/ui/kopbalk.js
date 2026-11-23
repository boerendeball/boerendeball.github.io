// Kopbalk van een spel- of deurtjesscherm: terugknop, klein label, titel en optioneel iets rechts (teller).

import { h } from './dom.js';
import { icoon } from './iconen.js';
import { ga } from '../router.js';

/** terugActie (optioneel) vervangt de navigatie naar terugNaar, bv. terug naar het leveloverzicht binnen een spel. */
export function kopbalk({ label, titel, rechts = null, terugNaar = '/', terugLabel = 'Terug naar de kalender', terugActie = null }) {
  return h('header', { class: 'kopbalk' }, [
    h('button', { type: 'button', class: 'knop-rond', 'aria-label': terugLabel, onclick: terugActie || (() => ga(terugNaar)) }, [icoon('terug', 24)]),
    h('div', { class: 'kopbalk-tekst' }, [
      label ? h('div', { class: 'kopbalk-label' }, label) : null,
      // Lange speltitels (besluit 219) krijgen een kleinere letter, zodat ze op twee regels passen; een getal blijft
      // aan het woord erna vast ("6 rooie").
      h('h1', { class: `kop kopbalk-titel${String(titel || '').length > 18 ? ' kopbalk-titel-lang' : ''}` }, typeof titel === 'string' ? titel.replace(/(\d) /g, '$1 ') : titel),
    ]),
    rechts ? h('div', { class: 'kopbalk-rechts' }, rechts) : null,
  ]);
}
