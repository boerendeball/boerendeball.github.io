// Vaardighedenpaneel (inklapbaar): zes balken van tien blokjes.

import { h } from './dom.js';
import { paneel } from './behoeften.js';

// Labels volgen de artboards (Main/Desktop): daar heten mechanica en lichaam "Techniek" en "Conditie".
export const VAARDIGHEID_LABELS = {
  koken: 'Koken', mechanica: 'Techniek', charisma: 'Charisma', lichaam: 'Conditie', logica: 'Logica', creativiteit: 'Creativiteit',
};

export function paneelVaardigheden(staat, { vandaagVaardigheid = null, gespeeldTotaal = 0, open = false }) {
  const rijen = Object.keys(VAARDIGHEID_LABELS).map((sleutel) => {
    const n = Math.max(0, Math.min(10, staat.vaardigheden[sleutel] ?? 0));
    const straks = sleutel === vandaagVaardigheid && n < 10;
    const label = VAARDIGHEID_LABELS[sleutel];
    const blokjes = [];
    for (let i = 0; i < 10; i++) {
      blokjes.push(h('span', { class: i < n ? 'vol' : (straks && i === n ? 'straks' : null) }));
    }
    return h('div', { class: 'vaard' }, [
      h('span', { class: 'vaard-label' }, label),
      h('span', { class: 'vaard-balk', role: 'img', 'aria-label': `${label}: ${n} van 10${straks ? ', vandaag te verdienen' : ''}` }, blokjes),
      h('span', { class: 'vaard-nr' }, String(n)),
    ]);
  });
  const rechts = vandaagVaardigheid
    ? [h('span', { class: 'badge-paars' }, `Vandaag: +1 ${VAARDIGHEID_LABELS[vandaagVaardigheid]}`)]
    : [];
  return paneel({
    titel: 'Vaardigheden',
    id: 'vaard-inhoud',
    klasse: 'paneel-vaard',
    open,
    rechts,
    inhoud: [
      h('div', { class: 'vaard-lijst' }, rijen),
      h('div', { class: 'vaard-voet' }, ['Elk gespeeld spelletje levert een vaardigheidspunt op. Totaal: ', h('strong', { style: { color: 'var(--tekst)' } }, `${gespeeldTotaal} van 10`), ' punten.']),
    ],
  });
}
