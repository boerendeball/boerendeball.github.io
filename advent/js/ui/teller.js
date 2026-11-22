// Teller in de kopbalk (icoon + getal, nooit een label; CLAUDE.md) die bij een nieuwe waarde optelt en
// pulseert (besluit 210). Het aria-label staat meteen op de eindwaarde.
//
// const munten = maakTeller({ icoon: use…, waarde: 60, label: (n) => `Geld: ${n}` });
// kopbalk({ …, rechts: munten.element }); munten.zet(40);

import { h } from './dom.js';
import { telOp, puls } from './sap.js';

export function maakTeller({ icoon, waarde = 0, label = (n) => String(n), klasse = '', getalKlasse = 'kop' }) {
  const getal = h('span', { class: getalKlasse }, String(waarde));
  const element = h('span', { class: ['teller-pil', klasse].filter(Boolean).join(' '), role: 'img', 'aria-label': label(waarde) }, [icoon, getal]);
  let huidig = waarde;

  function zet(n, { animeer = true } = {}) {
    if (n === huidig) return;
    const van = huidig;
    huidig = n;
    element.setAttribute('aria-label', label(n));
    if (!animeer) { telOp(getal, n, n); return; }
    telOp(getal, van, n, { duur: Math.min(700, 250 + Math.abs(n - van) * 8) });
    puls(element);
  }

  return { element, getal, zet, puls: () => puls(element), get waarde() { return huidig; } };
}
