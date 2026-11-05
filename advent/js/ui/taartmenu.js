// Taartmenu (Sims-pie): opties rondom een middelpunt, boven een aangetikt element.
// Gebruikt op de kalender (Open deurtje / Gluren… / Briefje lezen / Annuleren) en in spel 2
// voor tegel- en edelsteenkeuze.
//
// toonTaartmenu({
//   anker: element | { left, top, width, height },  // waar het menu op staat
//   kloon: true,                         // element klonen en uitlichten (alleen bij een element)
//   midden: { tekst: 'P', sub: 'PINO' }, // of { element, klasse }, of null (geen middenbol)
//   opties: [{ richting: 'boven'|'rechts'|'onder'|'links', tekst, icoon, klasse, actie }],
//            // of radiaal: { hoek: graden (0 = rechts, -90 = boven), inhoud: element, label, uitgeschakeld }
//   straal: 104,                         // afstand middelpunt → midden van een radiale optie
//   hint: 'html',                        // tekstbubbel (optioneel)
//   label: 'Acties voor deurtje 27 november',
// }) → { sluit }

import { h, blokkeerScroll, focusVal } from './dom.js';
import { icoon } from './iconen.js';

const SPAAK = 92;         // lengte van de spaken
const AFSTAND = 66;       // afstand van middelpunt tot de binnenkant van een optie

export function toonTaartmenu({ anker, kloon = true, midden = { tekst: 'P', sub: 'PINO' }, opties, straal = 104, hint = null, label = 'Menu', dim = 'rgba(30, 58, 76, 0.38)', bijSluiten = null }) {
  let open = true;
  const isElement = anker instanceof Element;
  const rect = isElement ? anker.getBoundingClientRect() : anker;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const laag = h('div', { class: 'overlay taart-laag', style: { background: dim }, onclick: (ev) => { if (ev.target === laag) sluit(); } });

  // Kloon van het aangetikte element, uitgelicht boven de dimlaag.
  if (isElement && kloon) {
    const k = anker.cloneNode(true);
    k.removeAttribute('id');
    k.setAttribute('aria-hidden', 'true');
    k.classList.add('taart-anker');
    k.querySelectorAll('[id]').forEach((e) => e.removeAttribute('id'));
    Object.assign(k.style, { position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`, margin: 0 });
    laag.append(k);
  }

  const menu = h('div', { class: 'taart', role: 'menu', 'aria-label': label });
  const richtingen = { boven: -90, rechts: 0, onder: 90, links: 180 };
  const radiaal = (o) => typeof o.hoek === 'number';
  for (const o of opties) {
    const hoek = radiaal(o) ? o.hoek : (richtingen[o.richting] ?? 0);
    const lengte = radiaal(o) ? Math.max(0, straal - 30) : SPAAK;
    menu.append(h('span', { class: 'spaak', 'aria-hidden': 'true', style: { left: `${cx}px`, top: `${cy}px`, width: `${lengte}px`, transform: `rotate(${hoek}deg)` } }));
  }
  if (midden) {
    menu.append(h('div', { class: ['taart-midden', midden.klasse].filter(Boolean).join(' '), 'aria-hidden': 'true', style: { left: `${cx}px`, top: `${cy}px` } },
      midden.element ? [midden.element] : [h('span', { class: 'kop taart-midden-tekst' }, midden.tekst), midden.sub ? h('span', { class: 'taart-midden-sub' }, midden.sub) : null]));
  }

  const knoppen = [];
  for (const o of opties) {
    const inhoud = o.inhoud ? [o.inhoud] : [o.icoon ? (typeof o.icoon === 'string' ? icoon(o.icoon, 20) : o.icoon) : null, o.tekst];
    const knop = h('button', {
      type: 'button', role: 'menuitem', class: ['taart-optie', o.klasse].filter(Boolean).join(' '), 'data-richting': o.richting,
      'aria-label': o.label, disabled: !!o.uitgeschakeld, 'aria-disabled': o.uitgeschakeld ? 'true' : null,
      onclick: () => { if (o.uitgeschakeld) return; sluit(); o.actie && o.actie(); },
    }, inhoud);
    menu.append(knop);
    knoppen.push({ knop, o });
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
  for (const { knop, o } of knoppen) {
    const b = knop.offsetWidth;
    const hgt = knop.offsetHeight;
    let x; let y;
    if (radiaal(o)) {
      const a = (o.hoek * Math.PI) / 180;
      x = cx + straal * Math.cos(a) - b / 2;
      y = cy + straal * Math.sin(a) - hgt / 2;
    } else if (o.richting === 'boven') { x = cx - b / 2; y = cy - AFSTAND - hgt - 10; }
    else if (o.richting === 'onder') { x = cx - b / 2; y = cy + AFSTAND + 10; }
    else if (o.richting === 'links') { x = cx - AFSTAND - b + 10; y = cy - hgt / 2; }
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
    const actief = knoppen.filter((k) => !k.knop.disabled);
    const idx = actief.findIndex((k) => k.knop === document.activeElement);
    if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(ev.key) || !actief.length) return;
    ev.preventDefault();
    const stap = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? 1 : -1;
    const volgende = actief[(idx + stap + actief.length) % actief.length];
    volgende.knop.focus();
  }
  menu.addEventListener('keydown', opToets);

  function sluit() {
    if (!open) return;
    open = false;
    herstelFocus();
    laag.remove();
    blokkeerScroll(false);
    if (bijSluiten) bijSluiten();
  }

  return { sluit };
}
