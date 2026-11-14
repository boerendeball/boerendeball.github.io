// Vaardighedenpaneel (inklapbaar): zes balken van tien blokjes.

import { h } from './dom.js';
import { paneel } from './behoeften.js';

// Labels volgen de artboards (Main/Desktop): daar heten mechanica en lichaam "Techniek" en "Conditie".
export const VAARDIGHEID_LABELS = {
  koken: 'Koken', mechanica: 'Techniek', charisma: 'Charisma', lichaam: 'Conditie', logica: 'Logica', creativiteit: 'Creativiteit',
};

const MAX_TOTAAL = 10 * Object.keys(VAARDIGHEID_LABELS).length;

/**
 * vandaagVaardigheden: { lichaam: 3, charisma: 2 } als het deurtje van vandaag nog te spelen is (besluit 164);
 * de blokjes die dat oplevert zijn `straks` (geel omrand).
 */
export function paneelVaardigheden(staat, { vandaagVaardigheden = null, open = false }) {
  let totaal = 0;
  const rijen = Object.keys(VAARDIGHEID_LABELS).map((sleutel) => {
    const n = Math.max(0, Math.min(10, staat.vaardigheden[sleutel] ?? 0));
    totaal += n;
    const straks = Math.min(10 - n, vandaagVaardigheden?.[sleutel] ?? 0);
    const label = VAARDIGHEID_LABELS[sleutel];
    const blokjes = [];
    for (let i = 0; i < 10; i++) {
      blokjes.push(h('span', { class: i < n ? 'vol' : (i < n + straks ? 'straks' : null) }));
    }
    return h('div', { class: 'vaard' }, [
      h('span', { class: 'vaard-label' }, label),
      h('span', { class: 'vaard-balk', role: 'img', 'aria-label': `${label}: ${n} van 10${straks ? `, vandaag ${straks} te verdienen` : ''}` }, blokjes),
      h('span', { class: 'vaard-nr' }, String(n)),
    ]);
  });
  const vandaagTotaal = vandaagVaardigheden ? Object.values(vandaagVaardigheden).reduce((a, b) => a + b, 0) : 0;
  const rechts = vandaagTotaal ? [h('span', { class: 'badge-paars' }, `Vandaag: +${vandaagTotaal} vaardigheid`)] : [];
  return paneel({
    titel: 'Vaardigheden',
    id: 'vaard-inhoud',
    klasse: 'paneel-vaard',
    open,
    rechts,
    inhoud: [
      h('div', { class: 'vaard-lijst' }, rijen),
      h('div', { class: 'vaard-voet' }, ['Elk gespeeld spelletje levert vaardigheidspunten op. Totaal: ', h('strong', { style: { color: 'var(--tekst)' } }, `${totaal} van ${MAX_TOTAAL}`), ' punten.']),
    ],
  });
}
