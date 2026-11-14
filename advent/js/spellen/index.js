// Register van de spellen. Elk spel is een module spellen/spel{n}.js met:
//   export function start({ root, dag, info, klaar, zoek }) → opruimfunctie
//   (zoek = true in de zoekmodus van spel 7, #/spel/n?zoek=1; zie spellen/zoeken.js)
//   export async function voorbereid({ dag, info })   (optioneel; bv. sprite sheet rasteren)
// klaar({ score }) schrijft de spelstaat (met info.beloning); het spel toont zelf zijn resultaatscherm.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { ga } from '../router.js';
import { dagInfo } from '../kalender.js';
import { toonDialoog } from '../ui/overlay.js';
import { el, use, pino } from '../sprites.js';
import { zoekenMag } from './zoeken.js';

const cache = {};

/** Laadt spellen/spel{n}.js; null als het bestand (nog) niet bestaat. */
export async function laadSpel(n) {
  if (n in cache) return cache[n];
  try {
    cache[n] = await import(`./spel${n}.js`);
  } catch (e) {
    // Een module die niet bestaat geeft een TypeError (fetch mislukt); echte fouten in een spel komen wel door.
    if (e instanceof TypeError) cache[n] = null;
    else throw e;
  }
  return cache[n];
}

export async function schermSpel({ root, params, query = new URLSearchParams() }) {
  const n = Number(params.n);
  if (!(n >= 1 && n <= datum.AANTAL_DAGEN)) { ga('/', { vervang: true }); return; }
  const info = dagInfo(n);
  const nu = datum.vandaag();
  if (!datum.deurOpen(n, nu)) { ga(`/deur/${n}`, { vervang: true }); return; }

  // Zoekmodus van spel 7 (#/spel/n?zoek=1): alleen voor een doorgespeeld spel 2–6 terwijl deurtje 7 open is;
  // anders terug naar het album (besluit 101).
  const zoek = query.get('zoek') === '1';
  if (zoek && !zoekenMag(n, nu)) { ga(datum.deurOpen(7, nu) ? '/spel/7' : '/', { vervang: true }); return; }

  /** Schrijft de afronding weg; geeft true terug als dit de eerste afronding van deze dag was. */
  const klaar = ({ score = null } = {}) => staat.rondSpelAf(n, { beloning: info.beloning, score });

  // Spel 4 heeft het gezin uit spel 3 nodig (besluit 41).
  if (n === 4 && !staat.lees().familie) return geenFamilie({ root, n, info });

  // Spel 6 heeft de ketting uit spel 5 nodig: die wil de dief hebben (besluit 81). In testmodus slaat ?knie=0|1
  // de controle over, zodat het spel los te spelen is. In de zoekmodus komt de dief niet, dus geen controle.
  if (n === 6 && !zoek && !staat.lees().producten.includes('ketting') && !(datum.isTest() && /^[01]$/.test(zoekParam('knie') || ''))) {
    return geenKetting({ root, n, info });
  }

  const module = await laadSpel(n);
  if (module && typeof module.start === 'function') {
    return module.start({ root, dag: n, info, klaar, zoek });
  }

  // Placeholder zolang het spel nog niet gebouwd is.
  root.append(h('div', { class: 'scherm' }, [
    kopbalk({ label: datum.dagLabel(n), titel: info.titel }),
    h('section', { class: 'kaart', style: { marginTop: '24px', padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' } }, [
      h('p', { class: 'kop', style: { margin: 0, fontSize: '22px' } }, 'Dit spel wordt nog gebouwd'),
      h('p', { class: 'gedempt', style: { margin: 0 } }, `Spel ${n} komt hier.`),
      datum.isTest() ? h('button', { type: 'button', class: 'knop knop-groen', onclick: () => { klaar(); ga('/'); } }, 'Rond af (test)') : null,
    ]),
  ]));
}

function zoekParam(naam) {
  try { return new URLSearchParams(location.search).get(naam); } catch { return null; }
}

/** Spel 6 zonder ketting uit spel 5: popup met een rustige steeg; er valt niets te stelen (besluit 81). */
function geenKetting({ root, n, info }) {
  root.replaceChildren(h('div', { class: 'scherm spel' }, [
    kopbalk({ label: datum.dagLabel(n), titel: info.titel, terugNaar: `/deur/${n}`, terugLabel: 'Terug naar het deurtje' }),
  ]));
  const kasseien = [];
  for (let y = 0; y < 120; y += 28) {
    for (let x = 0; x < 300; x += 28) kasseien.push(el('rect', { x: x + ((y / 28) % 2 ? 14 : 0) + 1, y: y + 1, width: 26, height: 26, rx: 4, fill: '#4E6384' }));
  }
  const lampion = (x, y, kleur) => el('g', { transform: `translate(${x} ${y})` }, [use('s5-gloed', -28, -22, 80, 80), use('s5-lampion', 0, 0, 24, 34, kleur)]);
  const scene = el('svg', { class: 'geen-ketting-scene', viewBox: '0 0 300 120', role: 'img', 'aria-label': 'Pino staat in een rustige steeg op de nachtmarkt' }, [
    el('rect', { x: 0, y: 0, width: 300, height: 120, fill: '#556B8E' }),
    ...kasseien,
    el('path', { d: 'M0 14 q75 20 150 0 t150 0', fill: 'none', stroke: '#8B4A1E', 'stroke-width': 2.5 }),
    lampion(40, 22, '#FF5E5B'), lampion(138, 16, '#FFC93C'), lampion(236, 22, '#FF8A3D'),
    pino(126, 40),
  ]);
  let weg = false;
  const d = toonDialoog({
    label: 'Nog niets te stelen',
    klasse: 'dialoog-geen-familie',
    inhoud: [
      h('div', { class: 'geen-familie-scene' }, [scene]),
      h('h2', { class: 'kop dialoog-titel' }, 'Een rustige avond'),
      h('p', { class: 'dialoog-tekst' }, 'Pino draagt nog niets moois om haar hals. In de steeg kijkt niemand naar haar om.'),
      h('button', { type: 'button', class: 'knop-pil knop-pil-groen', onclick: () => { weg = true; d.sluit(); ga('/'); } }, 'Terug naar de kalender'),
    ],
    bijSluiten: () => { if (!weg) ga('/'); },
  });
  return () => { weg = true; d.sluit(); };
}

/** Spel 4 zonder complete familie uit spel 3: popup met de bedroefde familie Nguyễn (besluit 41). */
async function geenFamilie({ root, n, info }) {
  const spel3 = await laadSpel(3);
  root.replaceChildren(h('div', { class: 'scherm spel' }, [
    kopbalk({ label: datum.dagLabel(n), titel: info.titel, terugNaar: `/deur/${n}`, terugLabel: 'Terug naar het deurtje' }),
  ]));
  let weg = false;
  const d = toonDialoog({
    label: 'Nog geen familie compleet',
    klasse: 'dialoog-geen-familie',
    inhoud: [
      h('div', { class: 'geen-familie-scene' }, spel3 ? [spel3.familieScene('nguyen', [], { werker: false })] : []),
      h('h2', { class: 'kop dialoog-titel' }, 'Nog geen familiefoto'),
      h('p', { class: 'dialoog-tekst' }, "Nog geen enkele familie is compleet. Er kunnen nog geen foto's gemaakt worden."),
      h('button', { type: 'button', class: 'knop-pil knop-pil-groen', onclick: () => { weg = true; d.sluit(); ga('/'); } }, 'Terug naar de kalender'),
    ],
    bijSluiten: () => { if (!weg) ga('/'); },
  });
  return () => { weg = true; d.sluit(); };
}
