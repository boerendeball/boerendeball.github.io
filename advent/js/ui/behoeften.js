// Behoeftenpaneel (inklapbaar): acht balken in groen/geel/rood, stemming en aantal open deurtjes.

import { h } from './dom.js';
import { icoon } from './iconen.js';

export const BEHOEFTE_LABELS = {
  verjaardag: 'Verjaardag vieren', gansjes: 'Gansjes', lammetjes: 'Lammetjes', snoepjes: 'Snoepjes',
  jiujitsu: 'Jiujitsu', bordspellen: 'Bordspellen', reizen: 'Reizen', sieraden: 'Sieraden',
};

export function balkKleur(pct) {
  if (pct >= 70) return 'groen';
  if (pct >= 25) return 'geel';
  return 'rood';
}

export function stemming(behoeften) {
  const waarden = Object.values(behoeften);
  const gem = waarden.reduce((a, b) => a + b, 0) / Math.max(1, waarden.length);
  if (gem >= 50) return { tekst: 'Goed', klasse: 'stemming-goed' };
  if (gem >= 30) return { tekst: 'Matig', klasse: 'stemming-matig' };
  return { tekst: 'Slecht', klasse: 'stemming-slecht' };
}

/** Inklapbaar paneel met kop (titel, rechts, pijl) en inhoud. */
export function paneel({ titel, rechts = [], inhoud, open = true, klasse = '', id }) {
  const inhoudEl = h('div', { class: 'paneel-inhoud', id, hidden: !open }, inhoud);
  const knop = h('button', { type: 'button', class: 'klap', 'aria-expanded': String(open), 'aria-controls': id, onclick: () => {
    const nu = knop.getAttribute('aria-expanded') !== 'true';
    knop.setAttribute('aria-expanded', String(nu));
    inhoudEl.hidden = !nu;
  } }, [
    h('span', { class: 'kop klap-titel' }, titel),
    h('span', { class: 'klap-rechts' }, [...rechts, h('span', { class: 'pijl', 'aria-hidden': 'true' }, [icoon('omlaag', 18)])]),
  ]);
  return h('section', { class: `kaart paneel ${klasse}` }, [knop, inhoudEl]);
}

export function paneelBehoeften(staat, { dagen, deurtjesOpen, open = true }) {
  const balken = Object.keys(BEHOEFTE_LABELS).map((sleutel) => {
    const pct = Math.round(staat.behoeften[sleutel] ?? 0);
    const label = BEHOEFTE_LABELS[sleutel];
    return h('div', { class: 'nood' }, [
      h('span', { class: 'nood-label' }, label),
      h('span', { class: `balk balk-${balkKleur(pct)}`, role: 'img', 'aria-label': `${label}: ${pct === 100 ? 'vol' : pct + ' procent'}` }, [
        h('span', { style: { width: `${pct}%` } }),
      ]),
    ]);
  });
  const st = stemming(staat.behoeften);
  return paneel({
    titel: 'Behoeften',
    id: 'nood-inhoud',
    klasse: 'paneel-nood',
    open,
    rechts: [h('span', { class: 'aftel' }, [
      h('span', { class: 'kop aftel-getal' }, String(dagen)),
      h('span', { class: 'aftel-tekst' }, dagen === 1 ? 'dag tot 3 dec' : 'dagen tot 3 dec'),
    ])],
    inhoud: [
      h('div', { class: 'nood-raster' }, balken),
      h('div', { class: 'paneel-voet' }, [
        h('span', {}, ['Stemming: ', h('strong', { class: st.klasse }, st.tekst)]),
        h('span', {}, `${deurtjesOpen} van 10 deurtjes open`),
      ]),
    ],
  });
}
