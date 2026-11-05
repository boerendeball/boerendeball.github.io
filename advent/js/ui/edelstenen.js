// Edelstenen in de UI: een losse edelsteen als SVG-icoon en de pil met drie tellers voor in de kopbalk.
// De pil werkt zichzelf bij via staat.abonneer; roep de opruimfunctie aan bij het verlaten van het scherm.

import { h } from './dom.js';
import { el, use } from '../sprites.js';
import * as staat from '../staat.js';

export const GEMS = ['blauw', 'groen', 'geel'];
export const GEM_KLEUR = { blauw: '#5BC0EB', groen: '#39D353', geel: '#FFC93C' };
const TEKST_KLEUR = { blauw: '#0E6A98', groen: '#1F7A3A', geel: '#9A5B00' };

export function gemSvg(kleur, maat) {
  return el('svg', { viewBox: '0 0 48 48', width: maat, height: maat, class: 'ic', 'aria-hidden': 'true' }, [use('gem', 2, 2, 44, 44, GEM_KLEUR[kleur])]);
}

/** Pil "◆ 2  ◆ 2  ◆ 1". Geeft { element, opruim } terug. */
export function edelsteenPil() {
  const getallen = {};
  const element = h('div', { class: 'teller-pil edelsteen-pil', role: 'img' }, GEMS.map((k) => {
    getallen[k] = h('span', { class: 'kop', style: { color: TEKST_KLEUR[k] } }, '0');
    return h('span', { class: 'edelsteen-teller' }, [gemSvg(k, 20), getallen[k]]);
  }));
  const werkBij = (s) => {
    for (const k of GEMS) getallen[k].textContent = String(s.edelstenen[k] || 0);
    element.setAttribute('aria-label', `Edelstenen: ${s.edelstenen.blauw || 0} blauw, ${s.edelstenen.groen || 0} groen, ${s.edelstenen.geel || 0} geel`);
  };
  werkBij(staat.lees());
  return { element, opruim: staat.abonneer(werkBij) };
}
