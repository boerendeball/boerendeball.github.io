// Taartmenu (Sims-pie): opties rondom een middelpunt, boven een aangetikt element.
// Gebruikt op de kalender (Open deurtje / Gluren… / Briefje lezen / Annuleren) en in spel 2
// voor tegel- en edelsteenkeuze.
//
// toonTaartmenu({
//   anker: element,                      // waar het menu op staat (wordt gekloond en uitgelicht)
//   midden: { tekst: 'P', sub: 'PINO' }, // of { element }
//   opties: [{ richting: 'boven'|'rechts'|'onder'|'links', tekst, icoon, klasse, actie }],
//   hint: 'html',                        // tekstbubbel (optioneel)
//   label: 'Acties voor deurtje 27 november',
// }) → { sluit }

import { h, blokkeerScroll, focusVal } from './dom.js';
import { icoon } from './iconen.js';

const SPAAK = 92;         // lengte van de spaken
const AFSTAND = 66;       // afstand van middelpunt tot de binnenkant van een optie

export function toonTaartmenu({ anker, midden = { tekst: 'P', sub: 'PINO' }, opties, hint = null, label = 'Menu', dim = 'rgba(30, 58, 76, 0.38)' }) {
  let open = true;
  const rect = anker.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const laag = h('div', { class: 'overlay taart-laag', style: { background: dim }, onclick: (ev) => { if (ev.target === laag) sluit(); } });

  // Kloon van het aangetikte element, uitgelicht boven de dimlaag.
  const kloon = anker.cloneNode(true);
  kloon.removeAttribute('id');
  kloon.setAttribute('aria-hidden', 'true');
  kloon.classList.add('taart-anker');
  kloon.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
  Object.assign(kloon.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: 0 });
  laag.append(kloon);

  const menu = h('div', { class: 'taart', role: 'menu', 'aria-label': label });
  const richtingen = { boven: -90, rechts: 0, onder: 90, links: 180 };
  for (const o of opties) {
    const hoek = richtingen[o.richting] ?? 0;
    menu.append(h('span', { class: 'spaak', 'aria-hidden': 'true', style: { left: `${cx}px`, top: `${cy}px`, width: `${SPAAK}px`, transform: `rotate(${hoek}deg)` } }));
  }
  const middenEl = h('div', { class: 'taart-midden', 'aria-hidden': 'true', style: { left: `${cx}px`, top: `${cy}px` } },
    midden.element ? [midden.element] : [h('span', { class: 'kop taart-midden-tekst' }, midden.tekst), midden.sub ? h('span', { class: 'taart-midden-sub' }, midden.sub) : null]);
  menu.append(middenEl);

  const knoppen = [];
  for (const o of opties) {
    const knop = h('button', { type: 'button', role: 'menuitem', class: ['taart-optie', o.klasse].filter(Boolean).join(' '), 'data-richting': o.richting,
      onclick: () => { sluit(); o.actie && o.actie(); } },
      [o.icoon ? (typeof o.icoon === 'string' ? icoon(o.icoon, 20) : o.icoon) : null, o.tekst]);
    menu.append(knop);
    knoppen.push({ knop, richting: o.richting });
  }
  laag.append(menu);

  let hintEl = null;
  if (hint) {
    hintEl = h('div', { class: 'taart-hint', html: hint });
    laag.append(hintEl);
  }

  blokkeerScroll(true);
  document.body.append(laag);

  // Posities bepalen nadat de knoppen een maat hebben.
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const klem = (v, min, max) => Math.max(min, Math.min(max, v));
  for (const { knop, richting } of knoppen) {
    const b = knop.offsetWidth;
    const hgt = knop.offsetHeight;
    let x; let y;
    if (richting === 'boven') { x = cx - b / 2; y = cy - AFSTAND - hgt - 10; }
    else if (richting === 'onder') { x = cx - b / 2; y = cy + AFSTAND + 10; }
    else if (richting === 'links') { x = cx - AFSTAND - b + 10; y = cy - hgt / 2; }
    else { x = cx + AFSTAND - 10; y = cy - hgt / 2; }
    knop.style.left = `${klem(x, 8, vw - b - 8)}px`;
    knop.style.top = `${klem(y, 8, vh - hgt - 8)}px`;
  }
  if (hintEl) {
    const hb = hintEl.offsetHeight;
    const boven = cy - AFSTAND - 56 - 24 - hb;
    hintEl.style.top = boven > 80 ? `${boven}px` : `${klem(cy + AFSTAND + 56 + 70, 0, vh - hb - 16)}px`;
  }

  const herstelFocus = focusVal(menu, sluit);

  // Pijltjestoetsen tussen opties.
  function opToets(ev) {
    const idx = knoppen.findIndex((k) => k.knop === document.activeElement);
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(ev.key)) return;
    ev.preventDefault();
    const stap = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : -1;
    const volgende = knoppen[(idx + stap + knoppen.length) % knoppen.length];
    volgende.knop.focus();
  }
  menu.addEventListener('keydown', opToets);

  function sluit() {
    if (!open) return;
    open = false;
    herstelFocus();
    laag.remove();
    blokkeerScroll(false);
  }

  return { sluit };
}
