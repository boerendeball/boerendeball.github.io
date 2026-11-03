// Spellus op requestAnimationFrame met delta-tijd (seconden), pauze als de tab verborgen is.
//
// const lus = maakLus({ update(dt), teken() });
// lus.start(); lus.pauzeer(); lus.hervat(); lus.stop();

export function maakLus({ update, teken, maxDt = 0.05 }) {
  let frame = 0;
  let vorige = 0;
  let actief = false;
  let gepauzeerd = false;

  function tik(nu) {
    if (!actief) return;
    frame = requestAnimationFrame(tik);
    if (gepauzeerd) return;
    const dt = Math.min(maxDt, Math.max(0, (nu - vorige) / 1000));
    vorige = nu;
    update(dt);
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
    get gepauzeerd() { return gepauzeerd; },
  };
}
