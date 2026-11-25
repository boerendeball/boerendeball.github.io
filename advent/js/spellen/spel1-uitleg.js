// Spel 1: uitleg van Chop chop (besluit 225), de eerste keer dat Pino spel 1 vanaf dag 5 opent. Een dialoogkaart
// zoals de spray-uitleg van spel 8 (besluit 215): bovenaan de titel "Chop Chop Mode" (in plaats van de bol), daarna
// twee pagina's met alleen bewegende plaatjes, verder geen tekst.
//   1. een tik op de haasknop: de knop wordt geel en Pino rent door de slaapzaal;
//   2. een tik op een gapend kind: Pino loopt er vanzelf heen en onderbreekt het (vinger, verrast gezicht).
// De opmaak (bol, plaatjesvak, stippen, knoppen) is die van spel 8 (`.s8u-*`); alleen de plaatjes zijn `.s1u-*`.

import { h } from '../ui/dom.js';
import { toonDialoog } from '../ui/overlay.js';
import { el, use } from '../sprites.js';
import * as staat from '../staat.js';

export const UITLEG_ID = 'spel1-chopchop';

const W = 200;
const H = 112;
const BED = { x: 120, y: 22 };              // bed van pagina 2 (64×84, zoals in de slaapzaal)
const PINO_START = { x: 4, y: 22 };          // Pino op pagina 2 voordat ze loopt
const PINO_EIND = { x: 82, y: 22 };          // links naast het bed (bed-x − 38, zoals in het spel)
const SCHOUDER = [31, 36];                   // rechterschouder in het 48×72-frame (spel1.js)
const MOND = [32, 38];                       // mond van het kind t.o.v. het bed (spel1.js)

/** Heeft Pino deze uitleg al gezien? */
export function alGezien() {
  return staat.lees().uitleg.includes(UITLEG_ID);
}

/** Achterwand met stippen, plint en de houten vloer van de slaapzaal. */
function zaal() {
  const g = el('g');
  g.append(el('rect', { width: W, height: H, fill: '#F6EBDD' }));
  g.append(el('rect', { width: W, height: 20, fill: '#FFE0EE' }));
  for (let x = 8; x < W; x += 16) g.append(el('circle', { cx: x, cy: 9, r: 1.8, fill: 'rgba(255, 155, 200, 0.5)' }));
  g.append(el('rect', { y: 18, width: W, height: 5, fill: '#C98B5A' }));
  for (const y of [48, 80]) g.append(el('line', { x1: 0, y1: y, x2: W, y2: y, stroke: 'rgba(194, 116, 60, 0.35)', 'stroke-width': 2 }));
  return g;
}

const pinoSprite = (id) => use(id, 0, 0, 48, 72);

/** Een rondje op de plek van een tik (zoals in spel 8); op de witte knop in teal, anders wit. */
const tikRing = (cx, cy, klasse, r = 12, kleur = '#FFFFFF', vulling = 'rgba(255,255,255,0.25)') =>
  el('circle', { class: klasse, cx, cy, r, fill: vulling, stroke: kleur, 'stroke-width': 3 });

/** Pagina 1: tik op de haasknop, de knop wordt geel en Pino rent van links naar rechts. */
function rennen() {
  const kx = 178; const ky = 40;
  const knop = (vlak, rand) => [
    el('circle', { cx: kx, cy: ky + 2, r: 15, fill: rand }),
    el('circle', { cx: kx, cy: ky, r: 15, fill: vlak }),
    use('s1-haas', kx - 12, ky - 12, 24, 24),
  ];
  const strepen = el('g', { fill: 'none', stroke: '#1FA3DC', 'stroke-width': 3, 'stroke-linecap': 'round' }, [
    el('path', { d: 'M-4 30 h-12 M-2 42 h-16 M-4 54 h-10' }),
  ]);
  return el('svg', { class: 's8u-plaatje', viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, [
    zaal(),
    el('g', {}, knop('#FFFFFF', '#CDE4F0')),
    el('g', { class: 's1u-knop-aan' }, knop('#FFC93C', '#D97A00')),
    el('g', { transform: 'translate(6 34)' }, [
      el('g', { class: 's1u-ren' }, [
        el('g', { class: 's1u-strepen' }, [strepen]),
        el('g', { class: 's1u-ren-staan' }, [pinoSprite('pino-staan')]),
        el('g', { class: 's1u-ren-loop' }, [pinoSprite('pino-loop')]),
      ]),
    ]),
    tikRing(kx, ky, 's1u-tik-knop', 19, '#1FA3DC', 'rgba(31,163,220,0.15)'),
  ]);
}

/** Pagina 2: tik op het gapende kind, Pino loopt naast het bed en steekt haar vinger in de mond. */
function onderbreken() {
  // Het bed van het gapende kind (rij 1, kolom 2 uit de slaapzaal: geel, boom, h-krul).
  const kind = (gezicht) => [
    use('k-hoofd', BED.x + 16, BED.y + 14, 32, 32, '#E8B48A'),
    use('h-krul', BED.x + 16, BED.y + 14, 32, 32, '#2B1A0E'),
    use(gezicht, BED.x + 16, BED.y + 14, 32, 32),
  ];
  const bed = [
    use('bed-onder', BED.x, BED.y, 64, 84),
    el('g', { class: 's1u-gaap' }, kind('g-gaap')),
    el('g', { class: 's1u-verrast' }, kind('g-verrast')),
    use('bed-deken', BED.x, BED.y, 64, 84, '#FFC93C'),
    use('m-boom', BED.x + 10, BED.y + 50, 14, 14),
    use('m-boom', BED.x + 40, BED.y + 54, 14, 14),
    use('m-boom', BED.x + 25, BED.y + 60, 12, 12),
  ];
  // De wijzende arm zoals in spel1.js (wijs): om de schouder gedraaid naar de mond en iets gerekt.
  const sx = PINO_EIND.x + SCHOUDER[0];
  const sy = PINO_EIND.y + SCHOUDER[1];
  const dx = BED.x + MOND[0] - sx;
  const dy = BED.y + MOND[1] - sy;
  const rek = Math.max(1, Math.min(1.6, Math.hypot(dx, dy) / 30));
  const hoek = (Math.atan2(dy, dx) * 180) / Math.PI;
  const arm = el('g', { transform: `translate(${sx} ${sy}) rotate(${hoek.toFixed(1)})` }, [
    use('pino-arm-vinger', -4 * rek, -5, 40 * rek, 10, null, { preserveAspectRatio: 'none' }),
  ]);
  return el('svg', { class: 's8u-plaatje', viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true' }, [
    zaal(),
    // Pino staat vóór het bed in de tekenvolgorde (haar voeten liggen hoger dan de onderkant van het bed).
    el('g', { transform: `translate(${PINO_START.x} ${PINO_START.y})` }, [
      el('g', { class: 's1u-loop' }, [
        el('g', { class: 's1u-loop-staan' }, [pinoSprite('pino-staan')]),
        el('g', { class: 's1u-loop-loop' }, [pinoSprite('pino-loop')]),
        el('g', { class: 's1u-loop-wijs' }, [pinoSprite('pino-romp'), pinoSprite('pino-arm-links')]),
      ]),
    ]),
    ...bed,
    el('g', { class: 's1u-arm' }, [arm]),
    tikRing(BED.x + 32, BED.y + 32, 's1u-tik-kind'),
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
export function toonChopUitleg({ bijSluiten }) {
  try { staat.schrijf((s) => { if (!s.uitleg.includes(UITLEG_ID)) s.uitleg.push(UITLEG_ID); }); } catch { /* storage geweigerd */ }

  let pagina = 0;
  const paginas = [rennen(), onderbreken()];
  const vak = h('div', { class: 's8u-vak s1u-vak' }, [paginas[0]]);
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
    label: 'Chop chop: met de haasknop gaat alles sneller, en tik je op een gapend kind, dan loopt Pino erheen',
    klasse: 's8-uitleg s1-uitleg',
    inhoud: [
      // Titel in plaats van de bol met het icoon (wens Benjamin, 25 november): de naam van de modus, geen uitleg.
      h('h2', { class: 'kop dialoog-titel s1u-titel' }, 'Chop Chop Mode'),
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
