// Spellus op requestAnimationFrame met delta-tijd (seconden), pauze als de tab verborgen is.
//
// const lus = maakLus({ update(dt), teken(), effecten(dt) });
// lus.start(); lus.pauzeer(); lus.hervat(); lus.stop();
// lus.bevries(70): hit-stop (besluit 210). De spellogica krijgt even dt = 0, maar effecten(dt) (deeltjes,
// schok, flits) en teken() lopen door. Met reduced motion doet bevries niets.

import { rustig } from '../ui/sap.js';

export function maakLus({ update, teken, effecten = null, maxDt = 0.05 }) {
  let frame = 0;
  let vorige = 0;
  let actief = false;
  let gepauzeerd = false;
  let bevrorenTot = 0;

  function tik(nu) {
    if (!actief) return;
    frame = requestAnimationFrame(tik);
    if (gepauzeerd) return;
    const dt = Math.min(maxDt, Math.max(0, (nu - vorige) / 1000));
    vorige = nu;
    update(nu < bevrorenTot ? 0 : dt);
    if (effecten) effecten(dt);
    teken();
  }

  function opZichtbaarheid() {
    if (document.hidden) {
      gepauzeerd = true;
    } else if (actief) {
      gepauzeerd = false;
      vorige = performance.now();
    }
  }

  return {
    start() {
      if (actief) return;
      actief = true;
      gepauzeerd = document.hidden;
      vorige = performance.now();
      document.addEventListener('visibilitychange', opZichtbaarheid);
      frame = requestAnimationFrame(tik);
    },
    stop() {
      actief = false;
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', opZichtbaarheid);
    },
    pauzeer() { gepauzeerd = true; },
    hervat() { gepauzeerd = false; vorige = performance.now(); },
    bevries(ms) {
      if (rustig()) return;
      bevrorenTot = Math.max(bevrorenTot, performance.now() + ms);
    },
    get gepauzeerd() { return gepauzeerd; },
  };
}
