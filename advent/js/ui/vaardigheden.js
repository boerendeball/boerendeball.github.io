// Vaardighedenpaneel (inklapbaar): zes balken van tien blokjes.

import { h } from './dom.js';
import { paneel } from './behoeften.js';
import { rustig, puls } from './sap.js';

// Labels volgen de artboards (Main/Desktop): daar heten mechanica en lichaam "Techniek" en "Conditie".
export const VAARDIGHEID_LABELS = {
  koken: 'Koken', mechanica: 'Techniek', charisma: 'Charisma', lichaam: 'Conditie', logica: 'Logica', creativiteit: 'Creativiteit',
};

const MAX_TOTAAL = 10 * Object.keys(VAARDIGHEID_LABELS).length;

/**
 * vandaagVaardigheden: { lichaam: 3, charisma: 2 } als het deurtje van vandaag nog te spelen is (besluit 164);
 * de blokjes die dat oplevert zijn `straks` (geel omrand).
 */
export function paneelVaardigheden(staat, { vandaagVaardigheden = null, open = false, vorige = null }) {
  let totaal = 0;
  let k = 0;
  const rijen = Object.keys(VAARDIGHEID_LABELS).map((sleutel) => {
    const n = Math.max(0, Math.min(10, staat.vaardigheden[sleutel] ?? 0));
    totaal += n;
    const straks = Math.min(10 - n, vandaagVaardigheden?.[sleutel] ?? 0);
    const label = VAARDIGHEID_LABELS[sleutel];
    // Net verdiende blokjes vullen zich één voor één, met een kleine puls (beeldfeedback, besluit 210).
    const oud = vorige && !rustig() ? Math.max(0, Math.min(n, vorige[sleutel] ?? n)) : n;
    const blokjes = [];
    for (let i = 0; i < 10; i++) {
      const blok = h('span', { class: i < oud ? 'vol' : (i >= n && i < n + straks ? 'straks' : null) });
      if (i >= oud && i < n) {
        setTimeout(() => { blok.classList.add('vol'); puls(blok, { schaal: 1.35, duur: 320 }); }, 500 + 220 * k++);
      }
      blokjes.push(blok);
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
