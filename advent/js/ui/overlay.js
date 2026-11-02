// Overlays in Sims-stijl: een melding bovenin (toast) en een dialoogkaart over een gedimde kalender.

import { h, blokkeerScroll, focusVal } from './dom.js';
import { icoon } from './iconen.js';

/**
 * Dialoog over een dimlaag. Geeft { element, sluit } terug.
 * opties: { melding: { icoon, kleur, html }, inhoud: [elementen], label, dimKleur, bijSluiten }
 */
export function toonDialoog({ melding = null, inhoud = [], label = 'Dialoog', dim = 'rgba(30, 58, 76, 0.55)', bijSluiten = null, klasse = null }) {
  let open = true;
  const laag = h('div', { class: 'overlay', style: { background: dim } });
  const kaart = h('div', { class: ['dialoog', klasse].filter(Boolean).join(' '), role: 'dialog', 'aria-modal': 'true', 'aria-label': label, tabindex: '-1' }, inhoud);
  laag.append(kaart);
  if (melding) laag.prepend(maakMelding(melding));

  blokkeerScroll(true);
  document.body.append(laag);
  const herstelFocus = focusVal(kaart, sluit);

  function sluit() {
    if (!open) return;
    open = false;
    herstelFocus();
    laag.remove();
    blokkeerScroll(false);
    if (bijSluiten) bijSluiten();
  }

  return { element: kaart, sluit };
}

/** Melding bovenin ("Actie niet beschikbaar.", "Er wordt gebeld!"). */
export function maakMelding({ icoon: naam, kleur = '#FFF1D6', html, rinkelt = false }) {
  return h('div', { class: 'melding', role: 'status' }, [
    h('span', { class: 'melding-bol', style: { background: kleur } }, [icoon(naam, 26, { klasse: rinkelt ? 'rinkelt' : null })]),
    h('div', { class: 'melding-tekst', html }),
  ]);
}

/** Losse melding bovenin die vanzelf verdwijnt (zonder dialoog). */
export function toonMelding(opties, duur = 2600) {
  const m = maakMelding(opties);
  m.classList.add('melding-zwevend');
  document.body.append(m);
  setTimeout(() => { m.classList.add('melding-weg'); setTimeout(() => m.remove(), 300); }, duur);
  return m;
}
