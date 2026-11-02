// Opstart van Pino's verjaardagskalender: sprites laden, staat lezen, routes registreren.

import { laadSprites, aantalSymbolen, scene, use, pino, persoon, dier } from './sprites.js';
import { lees, storageBeschikbaar, wis } from './staat.js';
import { route, startRouter, ga } from './router.js';
import { dagenTotVerjaardag, dagVanVandaag, isTest, vandaag } from './datum.js';

const app = document.getElementById('app');

/** Kleine DOM-helper: h('div', { class: 'kaart' }, [kinderen]). */
export function h(tag, attrs = {}, kinderen = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else e.setAttribute(k, String(v));
  }
  for (const kind of [].concat(kinderen)) {
    if (kind === null || kind === undefined) continue;
    e.append(typeof kind === 'string' ? document.createTextNode(kind) : kind);
  }
  return e;
}

let kalenderData = null;

async function laadKalenderData() {
  if (kalenderData) return kalenderData;
  const r = await fetch(new URL('../data/kalender.json', import.meta.url));
  kalenderData = await r.json();
  return kalenderData;
}

/* ---------- schermen ---------- */

// Tijdelijke kalenderschil; het echte kalenderscherm (Main/Desktop) komt in de volgende stap.
function schermKalender({ root }) {
  const staat = lees();
  const dagen = dagenTotVerjaardag();
  const scherm = h('div', { class: 'scherm' }, [
    h('section', { class: 'kaart', style: 'margin-top: 48px; padding: 18px; display: flex; flex-direction: column; gap: 12px;' }, [
      h('div', { style: 'display: flex; align-items: center; gap: 14px;' }, [
        h('div', { class: 'kop', 'aria-hidden': 'true', style: 'width: 72px; height: 72px; border-radius: 50%; background: var(--roze-licht); border: 4px solid #fff; box-shadow: 0 0 0 3px var(--teal); display: flex; align-items: center; justify-content: center; font-size: 34px; color: var(--roze-schaduw); flex-shrink: 0;' }, 'P'),
        h('h1', { class: 'kop', style: 'margin: 0; font-size: 28px;', html: "Pino's verjaardags&shy;kalender" }),
      ]),
      h('div', { style: 'display: flex; gap: 6px; flex-wrap: wrap;' }, [
        h('span', { class: 'chip' }, 'Verloskundige'),
        h('span', { class: 'chip chip-groen' }, 'Ganzenfluisteraar'),
        h('span', { class: 'chip chip-geel' }, 'Bordspelbaas'),
        h('span', { class: 'chip chip-paars' }, 'Jiujitsu'),
      ]),
    ]),
    h('section', { class: 'kaart', style: 'margin-top: 14px; padding: 16px 18px; display: flex; justify-content: space-between; align-items: baseline;' }, [
      h('span', { class: 'kop', style: 'font-size: 18px;' }, 'Behoeften'),
      h('span', { style: 'display: flex; align-items: baseline; gap: 6px;' }, [
        h('span', { class: 'kop', style: 'font-size: 28px; color: var(--geel-schaduw);' }, String(dagen)),
        h('span', { style: 'font-size: 13px; font-weight: 800; color: var(--gedempt);' }, 'dagen tot 3 dec'),
      ]),
    ]),
    h('p', { class: 'gedempt', style: 'font-size: 13px; margin: 18px 4px 0;' },
      `Fundament staat. Deurtjes, behoeften en vaardigheden volgen. ` +
      `(dag ${dagVanVandaag()} van 10${isTest() ? ', testmodus' : ''}, ` +
      `${Object.values(staat.deurtjes).filter((d) => d === 'gespeeld').length} gespeeld, ` +
      `opslag ${storageBeschikbaar() ? 'werkt' : 'niet beschikbaar'})`),
    h('p', { style: 'margin: 8px 4px 0;' }, [
      h('a', { href: '#/test', style: 'color: var(--teal-schaduw); font-weight: 700;' }, 'Sprite-controle →'),
    ]),
  ]);
  root.append(scherm);
}

// Controle-scherm: bewijst dat de geïnjecteerde symbolen en currentColor werken.
function schermTest({ root }) {
  const s = scene(358, 300, { label: 'Sprite-controle' });
  s.style.background = 'var(--gras-2)';
  s.style.borderRadius = '22px';
  // bedden (spel 1) in drie dekenkleuren met motief, kind ertussen
  const dekens = [['#39D353', 'vlinder'], ['#FFC93C', 'boom'], ['#5BC0EB', 'vogel']];
  dekens.forEach(([kleur, motief], i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${16 + i * 80} 12)`);
    g.append(use('bed-onder', 0, 0, 64, 84));
    g.append(use('k-hoofd', 16, 14, 32, 32, '#F6C9A8'));
    g.append(use(['h-bob', 'h-krul', 'h-stekel'][i], 16, 14, 32, 32, ['#6B4A2B', '#1E3A4C', '#D97A00'][i]));
    g.append(use(['g-slaap', 'g-gaap', 'g-verrast'][i], 16, 14, 32, 32));
    g.append(use('bed-deken', 0, 0, 64, 84, kleur));
    g.append(use(`m-${motief}`, 10, 50, 14, 14));
    g.append(use(`m-${motief}`, 40, 54, 14, 14));
    g.append(use(`m-${motief}`, 25, 60, 12, 12));
    s.append(g);
  });
  // Pino in drie poses
  s.append(pino(262, 20, 'staan'));
  s.append(pino(306, 20, 'loop', { flip: true }));
  // personen (spel 3) in drie kledingkleuren, plus een kind en dieren
  s.append(persoon(16, 130, { kleding: '#1FA3DC', huid: '#F6C9A8', haar: 'bh-kort', haarkleur: '#1E3A4C' }));
  s.append(persoon(70, 130, { kleding: '#FF6FAE', huid: '#E8B48A', haar: 'bh-lang', haarkleur: '#6B4A2B', jurk: true, acc: ['acc-nonla'] }));
  s.append(persoon(124, 130, { kleding: '#39D353', huid: '#C98B5A', haar: 'bh-knot', haarkleur: '#1E3A4C', jurk: true, acc: ['acc-ketting'] }));
  s.append(persoon(178, 150, { kleding: '#FFC93C', huid: '#F6C9A8', haar: 'bh-stekel', haarkleur: '#D97A00', kind: true, acc: ['acc-pet'] }));
  s.append(dier(220, 160, 'lam'));
  s.append(dier(262, 160, 'gansje'));
  s.append(dier(304, 160, 'biggetje'));
  // iconen en tegels
  s.append(use('s4-munt', 16, 230, 48, 48));
  s.append(use('gem', 70, 230, 48, 48, '#5BC0EB'));
  s.append(use('gem', 110, 230, 48, 48, '#39D353'));
  s.append(use('gem', 150, 230, 48, 48, '#FFC93C'));
  s.append(use('hx-tegel', 210, 222, 56, 66, '#39D353'));
  s.append(use('werker', 290, 222, 48, 72));

  const staat = lees();
  const scherm = h('div', { class: 'scherm' }, [
    h('header', { style: 'display: flex; align-items: center; gap: 12px; margin-bottom: 12px;' }, [
      h('button', { type: 'button', class: 'knop-rond', 'aria-label': 'Terug naar de kalender', onclick: () => ga('/') }, [pijlLinks()]),
      h('h1', { class: 'kop', style: 'margin: 0; font-size: 22px;' }, 'Sprite-controle'),
    ]),
    h('div', { class: 'kaart', style: 'padding: 16px; display: flex; flex-direction: column; gap: 12px; align-items: center;' }, [
      s,
      h('p', { class: 'gedempt', style: 'font-size: 13px; margin: 0; text-align: center;' },
        `${aantalSymbolen()} symbolen geladen · datum ${vandaag().toLocaleDateString('nl-NL')} · dag ${dagVanVandaag()}`),
    ]),
    h('div', { class: 'kaart', style: 'margin-top: 14px; padding: 16px; display: flex; flex-direction: column; gap: 10px;' }, [
      h('span', { class: 'kop', style: 'font-size: 18px;' }, 'Spelstaat'),
      h('pre', { style: 'margin: 0; font-size: 12px; white-space: pre-wrap; word-break: break-word; color: var(--gedempt-2);' }, JSON.stringify(staat, null, 1)),
      h('button', { type: 'button', class: 'knop knop-rood', onclick: () => { wis(); ga('/test', { vervang: true }); location.reload(); } }, 'Staat wissen'),
    ]),
  ]);
  root.append(scherm);
}

function pijlLinks() {
  const svg = scene(48, 48);
  svg.setAttribute('width', '22');
  svg.setAttribute('height', '22');
  svg.classList.add('ic');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', 'M30 10 L16 24 L30 38');
  p.setAttribute('fill', 'none');
  p.setAttribute('stroke', 'currentColor');
  p.setAttribute('stroke-width', '6');
  p.setAttribute('stroke-linecap', 'round');
  p.setAttribute('stroke-linejoin', 'round');
  svg.append(p);
  return svg;
}

function schermNietGevonden({ root }) {
  root.append(h('div', { class: 'scherm' }, [
    h('div', { class: 'kaart', style: 'margin-top: 48px; padding: 24px; text-align: center;' }, [
      h('p', { class: 'kop', style: 'margin: 0 0 12px; font-size: 22px;' }, 'Dit deurtje bestaat niet'),
      h('button', { type: 'button', class: 'knop', onclick: () => ga('/', { vervang: true }) }, 'Naar de kalender'),
    ]),
  ]));
}

/* ---------- opstart ---------- */

async function start() {
  try {
    await Promise.all([laadSprites(), laadKalenderData()]);
  } catch (e) {
    console.error(e);
    app.append(h('div', { class: 'scherm' }, [
      h('div', { class: 'kaart', style: 'margin-top: 48px; padding: 24px; text-align: center;' }, [
        h('p', { class: 'kop', style: 'margin: 0 0 8px; font-size: 22px;' }, 'De kalender kon niet laden'),
        h('p', { class: 'gedempt', style: 'margin: 0 0 16px;' }, 'Controleer de verbinding en probeer het opnieuw.'),
        h('button', { type: 'button', class: 'knop', onclick: () => location.reload() }, 'Opnieuw'),
      ]),
    ]));
    return;
  }

  route('/', schermKalender);
  route('/test', schermTest);
  startRouter(app, { fallback: schermNietGevonden });
}

start();
