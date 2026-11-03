// Invoer voor de spellen: toetsenbord (pijltjes, WASD, spatie/Enter) en D-pad-knoppen met vasthouden.
//
// const invoer = maakInvoer({
//   richtingen: { omhoog: knopEl, omlaag: knopEl, links: knopEl, rechts: knopEl },   // optioneel
//   acties: { actie: knopEl },                                                     // optioneel
//   bijActie(naam) {},                                                             // 'actie' | 'terug'
// });
// invoer.richting → { omhoog, omlaag, links, rechts } (booleans, live)
// invoer.as() → { dx, dy } genormaliseerd
// invoer.vernietig();

const TOETSEN = {
  ArrowUp: 'omhoog', ArrowDown: 'omlaag', ArrowLeft: 'links', ArrowRight: 'rechts',
  w: 'omhoog', s: 'omlaag', a: 'links', d: 'rechts',
  W: 'omhoog', S: 'omlaag', A: 'links', D: 'rechts',
};

export function maakInvoer({ richtingen = {}, acties = {}, bijActie = () => {}, toetsenbord = true } = {}) {
  const richting = { omhoog: false, omlaag: false, links: false, rechts: false };
  const opruimers = [];
  const ingedrukteToetsen = new Set();

  function luister(el, type, fn, opties) {
    el.addEventListener(type, fn, opties);
    opruimers.push(() => el.removeEventListener(type, fn, opties));
  }

  // D-pad-knoppen: vasthouden = richting aan.
  for (const [naam, el] of Object.entries(richtingen)) {
    if (!el) continue;
    const aan = (ev) => { ev.preventDefault(); richting[naam] = true; try { el.setPointerCapture(ev.pointerId); } catch { /* negeren */ } };
    const uit = () => { richting[naam] = false; };
    luister(el, 'pointerdown', aan);
    luister(el, 'pointerup', uit);
    luister(el, 'pointercancel', uit);
    luister(el, 'lostpointercapture', uit);
    luister(el, 'contextmenu', (ev) => ev.preventDefault());
    // Toetsenbordgebruikers die de knop focussen: spatie/Enter zet de richting kort aan.
    luister(el, 'keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); richting[naam] = true; } });
    luister(el, 'keyup', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') richting[naam] = false; });
  }

  // Actieknoppen: op pointerdown (snelheid), met toetsenbordfallback via click.
  for (const [naam, el] of Object.entries(acties)) {
    if (!el) continue;
    let viaPointer = false;
    luister(el, 'pointerdown', (ev) => { ev.preventDefault(); viaPointer = true; bijActie(naam); });
    luister(el, 'click', () => { if (viaPointer) { viaPointer = false; return; } bijActie(naam); });
    luister(el, 'contextmenu', (ev) => ev.preventDefault());
  }

  if (toetsenbord) {
    luister(window, 'keydown', (ev) => {
      if (ev.target && /^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return;
      const r = TOETSEN[ev.key];
      if (r) { ev.preventDefault(); richting[r] = true; ingedrukteToetsen.add(ev.key); return; }
      if ((ev.key === ' ' || ev.key === 'Enter') && !ev.repeat) {
        // Alleen als de focus niet op een knop staat (die handelt zijn eigen Enter/spatie af).
        if (ev.target && ev.target.tagName === 'BUTTON') return;
        ev.preventDefault();
        bijActie('actie');
      } else if (ev.key === 'Escape') {
        bijActie('terug');
      }
    });
    luister(window, 'keyup', (ev) => {
      const r = TOETSEN[ev.key];
      if (r) { ingedrukteToetsen.delete(ev.key); richting[r] = [...ingedrukteToetsen].some((k) => TOETSEN[k] === r); }
    });
    luister(window, 'blur', () => { for (const k of Object.keys(richting)) richting[k] = false; ingedrukteToetsen.clear(); });
  }

  return {
    richting,
    as() {
      let dx = (richting.rechts ? 1 : 0) - (richting.links ? 1 : 0);
      let dy = (richting.omlaag ? 1 : 0) - (richting.omhoog ? 1 : 0);
      if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
      return { dx, dy };
    },
    vernietig() { for (const f of opruimers) f(); opruimers.length = 0; },
  };
}
