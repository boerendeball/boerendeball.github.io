// Ballonnetje voor een product uit spel 5 dat Pino mist (besluit 208 en 209): wit rondje met rode rand en een rood
// puntje naar de knop eronder, daarin het product licht vervaagd en een klein rood "!?". Geen tekst: "!?" is een teken.
// Plek, maat en animatie bepaalt het spel zelf (klasse .ontbreekt in css/spel.css).

import { h } from './dom.js';
import { el, use } from '../sprites.js';

/** Het "!?" in een eigen kleur en lijndikte (twee keer tekenen: wit als rand, rood erover). */
function vraag(kleur, dik) {
  return [
    el('path', { d: 'M40 30 V50 M57 32 a8.5 8.5 0 1 1 12 7.7 q-4 2 -4 7.3 v1.5', fill: 'none', stroke: kleur, 'stroke-width': dik, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    el('circle', { cx: 40, cy: 61, r: dik / 2 + 0.6, fill: kleur }),
    el('circle', { cx: 65, cy: 61, r: dik / 2 + 0.6, fill: kleur }),
  ];
}

/**
 * Maakt het ballonnetje (span.ontbreekt + klasse) voor product-symbool id, bv. 's5-kniebeschermers' of 's5-spray'.
 * Verhouding breedte : hoogte = 100 : 116 (het puntje steekt onder het rondje uit).
 */
export function ontbreektBallon(id, { klasse = '', style = {} } = {}) {
  return h('span', { class: `ontbreekt ${klasse}`.trim(), 'aria-hidden': 'true', style }, [
    el('svg', { class: 'ic', viewBox: '0 0 100 116' }, [
      el('path', { d: 'M40 92 L50 112 L60 92z', fill: '#FF5E5B' }),
      el('circle', { cx: 50, cy: 50, r: 46, fill: '#FFFFFF', stroke: '#FF5E5B', 'stroke-width': 5 }),
      use(id, 20, 9, 60, 60, null, { opacity: 0.65 }),
      // klein, onder het product, zodat het product zelf goed zichtbaar blijft
      el('g', { transform: 'translate(50 78) scale(0.42) translate(-52.5 -43)' }, [...vraag('#FFFFFF', 13), ...vraag('#FF5E5B', 8)]),
    ]),
  ]);
}
