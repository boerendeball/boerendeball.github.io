// Spel 7 · Spot the peasant (specs/spel7.md, design/artboards/Spel7*.dc.html).
// Een fotoalbum met vijf polaroids, één per spel 2–6. Een tik op een polaroid opent dat spel in de zoekmodus
// (#/spel/n?zoek=1); wie daar de verstopte werker aantikt, komt hier terug (spellen/zoeken.js). Bij 5/5 is het spel af.

import { h } from '../ui/dom.js';
import { kopbalk } from '../ui/kopbalk.js';
import { toonResultaat } from '../ui/resultaat.js';
import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { ga } from '../router.js';
import { el, use, pino } from '../sprites.js';
import { dagInfo } from '../kalender.js';
import { aantalGevonden, zoekenMag } from './zoeken.js';
import { maakLaag } from './canvas.js';
import { tuinScene } from './spel2.js';
import { familieScene } from './spel3.js';
import { foto } from './spel4.js';
import { marktScene } from './spel5.js';
import * as spel6 from './spel6.js';
import * as F from './fotos.js';

const SPELLEN = [2, 3, 4, 5, 6];

// De foto in de polaroid is 100×96 (op 8,8). Uitsnede (viewBox) van de echte scène per spel, in scène-eenheden.
const FOTO = { x: 8, y: 8, b: 100, h: 96 };
const UITSNEDE = {
  2: [0, 500, 240, 230],    // linksonder in de tuin: Pino op de start, de eerste tegels en de bamboe
  3: [4, 0, 156, 150],      // familie Nguyễn met meisje en gansje
  5: [0, 44, 250, 240],     // kraam van Mai, put en krukje
  6: [62, 100, 230, 221],   // Pino met de ketting tussen de bezoekers
};

/** Zet een scène-SVG van een spel als uitgesneden foto in de polaroid. */
function alsFoto(svg, viewBox = null) {
  for (const a of ['class', 'role', 'aria-label', 'style']) svg.removeAttribute(a);
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('x', FOTO.x); svg.setAttribute('y', FOTO.y);
  svg.setAttribute('width', FOTO.b); svg.setAttribute('height', FOTO.h);
  if (viewBox) svg.setAttribute('viewBox', viewBox.join(' '));
  svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
  return svg;
}

/**
 * De foto van spel n, gebouwd met de scenebouwer van dat spel (besluit 107), zonder werker. Spel 6 tekent op
 * canvas: eerst een effen vlak, daarna (na het laden van de sprite sheet) de stille steeg als afbeelding.
 */
function fotoVan(n, s) {
  if (n === 2) return alsFoto(tuinScene(), UITSNEDE[2]);
  if (n === 3) return alsFoto(familieScene('nguyen', s.karakters, { werker: false }), UITSNEDE[3]);
  if (n === 4) {
    const familie = s.fotos[0] || s.familie || 'tan';
    return alsFoto(foto(familie, F.omgeving(familie).plekken[0].id));
  }
  if (n === 5) return alsFoto(marktScene(), UITSNEDE[5]);
  const plek = el('g', {}, [el('rect', { x: FOTO.x, y: FOTO.y, width: FOTO.b, height: FOTO.h, fill: '#556B8E' })]);
  steegFoto().then((url) => {
    if (url) plek.replaceChildren(el('image', { href: url, x: FOTO.x, y: FOTO.y, width: FOTO.b, height: FOTO.h }));
  });
  return plek;
}

let steegUrl = null;
/** De stille steeg van spel 6, uitgesneden en als PNG (één keer per bezoek gerasterd). */
async function steegFoto() {
  if (steegUrl) return steegUrl;
  try {
    await spel6.voorbereid();
    const { B, H } = spel6.STEEG;
    const laag = maakLaag(B, H);
    spel6.tekenStilleSteeg(laag.ctx);
    const [x, y, b, hg] = UITSNEDE[6];
    const k = 3;                                   // 300×288 px voor een foto van 100×96
    const uit = document.createElement('canvas');
    uit.width = FOTO.b * k; uit.height = FOTO.h * k;
    const c = uit.getContext('2d');
    c.imageSmoothingQuality = 'high';
    c.drawImage(laag.canvas, x * laag.schaal, y * laag.schaal, b * laag.schaal, hg * laag.schaal, 0, 0, uit.width, uit.height);
    steegUrl = uit.toDataURL('image/png');
  } catch (e) {
    console.error(e);
  }
  return steegUrl;
}

/** Polaroid 120×140 (s4-polaroid) met de foto van het spel; zoals spel7_sprites.polaroid(). */
function polaroid(n, gevonden, rot, s) {
  const kinderen = [use('s4-polaroid', 0, 0, 120, 140), fotoVan(n, s)];
  if (gevonden) kinderen.push(use('s7-stempel', 70, 100, 34, 34), use('s7-vink', 92, -8, 30, 30));
  else kinderen.push(el('rect', { x: 8, y: 8, width: 100, height: 96, fill: 'rgba(255,255,255,0.55)' }), use('s7-vraag', 70, 100, 34, 34));
  return el('svg', { class: 'ic', viewBox: '-12 -12 144 164', width: 160, height: 194, 'aria-hidden': 'true' }, [
    el('g', { transform: `rotate(${rot})` }, kinderen),
  ]);
}

export function start({ root, dag, info, klaar }) {
  const s = staat.lees();
  const gevonden = aantalGevonden(s);

  // Alle vijf gevonden en nog niet afgerond: afronden en het resultaatscherm tonen.
  if (gevonden === 5 && s.deurtjes[dag] !== 'gespeeld') {
    const eersteKeer = klaar();
    toonKlaar({ root, info, eersteKeer });
    return () => {};
  }

  // De speltitel staat alleen in het aria-label (geen tekst in het spel).
  const fotos = SPELLEN.map((n, i) => {
    const g = !!s.werkers[n];
    const mag = zoekenMag(n);
    const label = `Spel ${n}, ${dagInfo(n).titel}: werker ${g ? 'gevonden' : 'nog niet gevonden'}`;
    const svg = polaroid(n, g, i % 2 === 0 ? -3 : 3, s);
    const klasse = `s7-foto${n === 6 ? ' s7-foto-breed' : ''}${mag ? '' : ' s7-foto-dicht'}`;
    return mag
      ? h('button', { type: 'button', class: klasse, 'aria-label': label, onclick: () => ga(`/spel/${n}?zoek=1`) }, [svg])
      : h('div', { class: klasse, role: 'img', 'aria-label': label }, [svg]);
  });

  const teller = h('span', { class: 'teller-pil s7-teller', role: 'img', 'aria-label': `${gevonden} van de 5 werkers` }, [
    el('svg', { class: 'ic', viewBox: '0 0 48 48', width: 24, height: 24, 'aria-hidden': 'true' }, [use('s7-loep', 0, 0, 48, 48)]),
    h('span', {}, [String(gevonden), h('span', { class: 's7-van' }, ' / 5')]),
  ]);

  root.replaceChildren(h('div', { class: 'scherm spel s7' }, [
    kopbalk({ label: datum.dagLabel(dag), titel: info.titel, terugNaar: `/deur/${dag}`, terugLabel: 'Terug naar het deurtje', rechts: teller }),
    h('div', { class: 's7-album', role: 'group', 'aria-label': 'Fotoalbum van de spellen 2 tot en met 6' }, fotos),
    h('div', { class: 'kaart s7-voortgang', role: 'img', 'aria-label': `Voortgang: ${gevonden} van de 5` }, [
      h('span', { class: 's7-voortgang-bol', 'aria-hidden': 'true' }, [
        el('svg', { class: 'ic', viewBox: '4 -4 40 74', width: 22, height: 40 }, [use('wk-staan', 0, 0, 48, 72)]),
      ]),
      h('div', { class: 'balk balk-groen', 'aria-hidden': 'true' }, [h('span', { style: { width: `${gevonden * 20}%` } })]),
    ]),
  ]));
  return () => {};
}

function toonKlaar({ root, info, eersteKeer }) {
  // Vijf werkers op een rij met Pino ernaast (Spel7-Klaar.dc.html).
  const rij = el('svg', { class: 'ic s7-rij', viewBox: '0 0 300 100', width: 300, height: 100, role: 'img', 'aria-label': 'De vijf gevonden werkers op een rij naast Pino' }, [
    el('ellipse', { cx: 150, cy: 92, rx: 140, ry: 5, fill: '#CDE4F0' }),
    // Elke werker met de prop uit zijn eigen spel (besluit 108).
    ...['hark', 'kwast', 'zwaai', 'emmer', 'lampion'].map((pose, i) => use(`wk-${pose}`, 4 + i * 46, 27, 42, 63)),
    pino(246, 6, 'vinger', { flip: true }),
  ]);
  toonResultaat({
    root,
    icoon: info.icoon,
    label: `${info.titel.toUpperCase()} · KLAAR`,
    titel: 'Gevonden!',
    inhoud: rij,
    tegels: [{ label: 'GEVONDEN', waarde: '5/5', kleur: '#1F7A3A' }],
    beloning: { ...info.beloning, eersteKeer },
  });
}
