// De verstopte werker (spel 7). Gedeeld door spel 2–6: markeren, melding (loep + x/5) en in de zoekmodus
// (#/spel/n?zoek=1) na de hupjes terug naar het album van spel 7 (besluit 101).

import * as staat from '../staat.js';
import * as datum from '../datum.js';
import { toonMelding } from '../ui/overlay.js';
import { ga } from '../router.js';

/** Mag spel n in de zoekmodus geopend worden? Spel 2–6, doorgespeeld, en deurtje 7 is open (besluit 101). */
export function zoekenMag(n, nu = datum.vandaag()) {
  return n >= 2 && n <= 6 && datum.deurOpen(7, nu) && staat.lees().deurtjes[n] === 'gespeeld';
}

/**
 * Kader van de werker (wk-*, 48×72) met zijn voeten op (voetX, voetY) in scène-eenheden: { x, y, b, h }.
 * De voeten staan in het symbool op y 68 (besluit 108).
 */
export function werkerVak(voetX, voetY, schaal) {
  return { x: voetX - 24 * schaal, y: voetY - 68 * schaal, b: 48 * schaal, h: 72 * schaal };
}

/** Hoe lang de werker hupt (2 × 350 ms) voordat de zoekmodus terug naar het album gaat. */
export const HUP_MS = 700;

export function aantalGevonden(s = staat.lees()) {
  return [2, 3, 4, 5, 6].filter((n) => s.werkers[n]).length;
}

/**
 * Markeert de werker van spel n als gevonden en toont de melding (alleen de eerste keer). In de zoekmodus gaat
 * het spel daarna terug naar het album, tenzij Pino intussen zelf al ergens anders heen is gegaan.
 */
export function werkerGevonden(n, { zoek = false } = {}) {
  const nieuw = !staat.lees().werkers[n];
  staat.markeerWerkerGevonden(n);
  if (nieuw) toonMelding({ icoon: 'loep', kleur: '#DDF1FB', html: `<strong>${aantalGevonden()}</strong> / 5` }, 1800);
  if (!zoek) return;
  const hier = location.hash;
  setTimeout(() => { if (location.hash === hier) ga('/spel/7', { vervang: true }); }, HUP_MS + 250);
}

/** Terugknop van de kopbalk: in de zoekmodus naar het album van spel 7. */
export function terugKnop(zoek) {
  return zoek ? { terugNaar: '/spel/7', terugLabel: 'Terug naar het album' } : {};
}
