// Spel 8: uitleg na de eerste spray (besluit 215, variant B uit design/spray-uitleg-voorstel). Een dialoogkaart
// met twee pagina's, alleen bewegende plaatjes, geen tekst:
//   1. Pino spuit, het dier wordt boos, krijgt een wolkje met een dof lampje en loopt van haar weg;
//   2. een tik op het verwarde dier naast Pino, daarna wisselen ze van plek.
// Elke pagina is een rijtje van vijf schaakvakken met de echte sprites en het dier van het level.

import { h } from '../ui/dom.js';
import { toonDialoog } from '../ui/overlay.js';
import { el, use } from '../sprites.js';
import * as staat from '../staat.js';

export const UITLEG_ID = 'spel8-spray';

const S = 36;                   // vakmaat, zoals op het bord
const Y = 64;                   // bovenkant van de rij vakken in het plaatje (viewBox 200 × 112)
const vakX = (c) => 10 + c * S;
const LICHT = '#D9CFA8';
const DONKER = '#8AA66E';

/** Heeft Pino deze uitleg al gezien? */
export function alGezien() {
  return staat.lees().uitleg.includes(UITLEG_ID);
}

function rijVakken() {
  const g = el('g');
  g.append(el('rect', { x: 5, y: Y - 5, width: 5 * S + 10, height: S + 10, rx: 5, fill: '#3D7A30' }));
  for (let c = 0; c < 5; c++) g.append(use('s8-vak', vakX(c), Y, S, S, c % 2 ? DONKER : LICHT));
  return g;
}

/** Een schaakstuk op vak c, zoals pinoEl/dierEl in spel8.js. */
const stuk = (id, c) => use(id, vakX(c) - 1, Y + S - 46, 38, 47);

function achtergrond() {
  return [el('rect', { width: 200, height: 112, fill: '#4E9A3E' }), use('s8-varen', 150, 6, 48, 40), use('s8-varen', -6, 10, 48, 40), rijVakken()];
}

/** Pagina 1: spuiten, boos worden, nadenken met een dof lampje en weglopen. */
function weglopen(dier) {
  return el('svg', { class: 's8u-plaatje', viewBox: '0 0 200 112', 'aria-hidden': 'true' }, [
    ...achtergrond(),
    el('g', { class: 's8u-weg' }, [stuk(`s8-stuk-${dier}-boos`, 1)]),
    el('g', { class: 's8u-wolk' }, [el('g', { class: 's8u-weg' }, [use('s8-wolk', vakX(1) + 16, Y - 52, 44, 37), use('s8-lamp-uit', vakX(1) + 29, Y - 47, 18, 18)])]),
    el('g', { class: 's8u-spuit' }, [stuk('s8-stuk-pino-spuit', 0)]),
    el('g', { class: 's8u-staan' }, [stuk('s8-stuk-pino', 0)]),
    el('g', { class: 's8u-nevel' }, [use('s8-nevel', (vakX(0) + vakX(1)) / 2 - 2, Y - 10, 40, 24)]),
  ]);
}

/** Pagina 2: een tik op het verwarde dier naast Pino, dan wisselen ze van plek (met twee gebogen pijlen). */
function wisselen(dier) {
  const mx = vakX(2);
  const lx = vakX(1) + S / 2;
  const rx = vakX(2) + S / 2;
  return el('svg', { class: 's8u-plaatje', viewBox: '0 0 200 112', 'aria-hidden': 'true' }, [
    ...achtergrond(),
    el('g', { class: 's8u-pijlen', fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      el('path', { d: `M${lx} ${Y - 30} Q${mx} ${Y - 46} ${rx} ${Y - 30} m-7 -5 l7 5 l-8 3` }),
      el('path', { d: `M${rx} ${Y + S + 8} Q${mx} ${Y + S + 22} ${lx} ${Y + S + 8} m7 5 l-7 -5 l8 -3` }),
    ]),
    el('g', { class: 's8u-dier' }, [stuk(`s8-stuk-${dier}-boos`, 2)]),
    el('g', { class: 's8u-pino' }, [stuk('s8-stuk-pino', 1)]),
    el('circle', { class: 's8u-tik', cx: vakX(2) + S / 2, cy: Y + S / 2 - 6, r: 15, fill: 'rgba(255,255,255,0.25)', stroke: '#fff', 'stroke-width': 3 }),
  ]);
}

const PAD = {
  rechts: 'M18 10 L32 24 L18 38',
  links: 'M30 10 L16 24 L30 38',
  vink: 'M11 25 L20 34 L37 15',
};
const lijnIcoon = (d) => el('svg', { class: 'ic', viewBox: '0 0 48 48', 'aria-hidden': 'true' }, [
  el('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
]);

/**
 * Toont de uitleg en onthoudt dat Pino hem zag. Geeft { sluit } terug; bijSluiten volgt na het sluiten
 * (vinkje, Escape of sluit() bij het opruimen van het spel).
 */
export function toonSprayUitleg({ dier, bijSluiten }) {
  staat.schrijf((s) => { if (!s.uitleg.includes(UITLEG_ID)) s.uitleg.push(UITLEG_ID); });

  let pagina = 0;
  const paginas = [weglopen(dier), wisselen(dier)];
  const vak = h('div', { class: 's8u-vak' }, [paginas[0]]);
  const stippen = [h('span', { class: 's8u-stip' }), h('span', { class: 's8u-stip' })];
  const terug = h('button', { type: 'button', class: 's8u-terug', 'aria-label': 'Vorige', onclick: () => naar(0) }, [lijnIcoon(PAD.links)]);
  const verder = h('button', { type: 'button', class: 's8u-verder', 'aria-label': 'Volgende', onclick: () => naar(1) }, [lijnIcoon(PAD.rechts)]);
  const klaar = h('button', { type: 'button', class: 's8u-klaar', 'aria-label': 'Klaar', onclick: () => d.sluit() }, [lijnIcoon(PAD.vink)]);
  const rechts = h('span', { class: 's8u-rechts' }, [verder]);

  function naar(n) {
    if (n === pagina || n < 0 || n > 1) return;
    pagina = n;
    vak.replaceChildren(paginas[n]);       // opnieuw in het document: de animatie begint vooraan
    stippen.forEach((s, i) => s.classList.toggle('aan', i === n));
    terug.classList.toggle('leeg', n === 0);
    terug.disabled = n === 0;
    rechts.replaceChildren(n === 0 ? verder : klaar);
    (n === 0 ? verder : klaar).focus();
  }

  // Vegen tussen de pagina's.
  let veegX = null;
  vak.addEventListener('pointerdown', (ev) => { veegX = ev.clientX; });
  vak.addEventListener('pointerup', (ev) => {
    if (veegX === null) return;
    const dx = ev.clientX - veegX;
    veegX = null;
    if (Math.abs(dx) > 30) naar(pagina + (dx < 0 ? 1 : -1));
  });
  vak.addEventListener('pointercancel', () => { veegX = null; });

  function opToets(ev) {
    if (ev.key === 'ArrowRight') { ev.preventDefault(); naar(pagina + 1); }
    else if (ev.key === 'ArrowLeft') { ev.preventDefault(); naar(pagina - 1); }
  }
  document.addEventListener('keydown', opToets);

  const d = toonDialoog({
    label: 'Spray: het dier is in de war en je kunt ermee wisselen',
    klasse: 's8-uitleg',
    inhoud: [
      h('div', { class: 'dialoog-bol s8u-bol', 'aria-hidden': 'true' }, [
        el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 60, height: 60 }, [use('s5-spray', 0, 0, 48, 48)]),
      ]),
      vak,
      h('div', { class: 's8u-onder' }, [terug, h('div', { class: 's8u-stippen', 'aria-hidden': 'true' }, stippen), rechts]),
    ],
    bijSluiten: () => {
      document.removeEventListener('keydown', opToets);
      if (bijSluiten) bijSluiten();
    },
  });
  stippen[0].classList.add('aan');
  terug.classList.add('leeg');
  terug.disabled = true;
  return d;
}
