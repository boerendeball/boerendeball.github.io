// Opstart van Pino's verjaardagskalender: sprites en kalenderdata laden, routes registreren.

import { h } from './ui/dom.js';
import { laadSprites } from './sprites.js';
import { route, startRouter, ga } from './router.js';
import { zetKalenderData, schermKalender, schermDeur } from './kalender.js';
import { schermLaden } from './ui/laadscherm.js';
import { schermSpel } from './spellen/index.js';
import { schermTest } from './test.js';
import { wis, vulTestStaat } from './staat.js';
import { devModus } from './datum.js';

const app = document.getElementById('app');

// Dev-schakelaars in de URL (zie specs/README.md): ?reset=1 wist de staat, ?vul=1 vult testvoorraad.
function devSchakelaars() {
  let params;
  try { params = new URLSearchParams(location.search); } catch { return; }
  if (params.get('reset') === '1') wis();
  if (params.get('vul') === '1') vulTestStaat();
}

async function laadKalenderData() {
  const r = await fetch(new URL('../data/kalender.json', import.meta.url));
  if (!r.ok) throw new Error(`kalender.json niet geladen (${r.status})`);
  return r.json();
}

function schermNietGevonden({ root }) {
  root.append(h('div', { class: 'scherm' }, [
    h('div', { class: 'kaart', style: { marginTop: '48px', padding: '24px', textAlign: 'center' } }, [
      h('p', { class: 'kop', style: { margin: '0 0 12px', fontSize: '22px' } }, 'Dit deurtje bestaat niet'),
      h('button', { type: 'button', class: 'knop', onclick: () => ga('/', { vervang: true }) }, 'Naar de kalender'),
    ]),
  ]));
}

async function start() {
  try {
    const [, data] = await Promise.all([laadSprites(), laadKalenderData()]);
    zetKalenderData(data);
  } catch (e) {
    console.error(e);
    app.append(h('div', { class: 'scherm' }, [
      h('div', { class: 'kaart', style: { marginTop: '48px', padding: '24px', textAlign: 'center' } }, [
        h('p', { class: 'kop', style: { margin: '0 0 8px', fontSize: '22px' } }, 'De kalender kon niet laden'),
        h('p', { class: 'gedempt', style: { margin: '0 0 16px' } }, 'Controleer de verbinding en probeer het opnieuw.'),
        h('button', { type: 'button', class: 'knop', onclick: () => location.reload() }, 'Opnieuw'),
      ]),
    ]));
    return;
  }

  devSchakelaars();
  route('/', schermKalender);
  route('/deur/:n', schermDeur);
  route('/laden/:n', schermLaden);
  route('/spel/:n', schermSpel);
  route('/test', schermTest);
  // Ontwikkelaarsopties alleen in devmodus; de module laadt pas als je de pagina opent.
  if (devModus()) route('/dev', async (ctx) => (await import('./ontwikkelaar.js')).schermOntwikkelaar(ctx));
  startRouter(app, { fallback: schermNietGevonden });
}

start();
