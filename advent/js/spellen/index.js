// Register van de spellen. Elk spel is een module spellen/spel{n}.js met:
//   export function start({ root, dag, info, klaar }) → opruimfunctie
//   export async function voorbereid({ dag, info })   (optioneel; bv. sprite sheet rasteren)
// klaar({ vaardigheid, score }) schrijft de spelstaat; het spel toont zelf zijn resultaatscherm.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { ga } from '../router.js';
import { dagInfo } from '../kalender.js';

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

export async function schermSpel({ root, params }) {
  const n = Number(params.n);
  if (!(n >= 1 && n <= datum.AANTAL_DAGEN)) { ga('/', { vervang: true }); return; }
  const info = dagInfo(n);
  const nu = datum.vandaag();
  if (!datum.deurOpen(n, nu)) { ga(`/deur/${n}`, { vervang: true }); return; }

  const klaar = ({ vaardigheid = info.vaardigheid, score = null } = {}) => {
    staat.rondSpelAf(n, { vaardigheid, score });
  };

  const module = await laadSpel(n);
  if (module && typeof module.start === 'function') {
    return module.start({ root, dag: n, info, klaar });
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
