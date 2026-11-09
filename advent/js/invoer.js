// Invoer voor de spellen: toetsenbord (pijltjes, WASD, spatie/Enter) en D-pad-knoppen met vasthouden.
//
// const invoer = maakInvoer({
//   richtingen: { omhoog: knopEl, omlaag: knopEl, links: knopEl, rechts: knopEl },   // optioneel (D-pad)
//   acties: { actie: knopEl },                                                     // optioneel (actieknop)
//   joystick: { element: schermEl, vertraging: 250, tik: 'actie' },                // optioneel (ui/joystick.js)
//   bijActie(naam) {},                                                             // 'actie' | 'terug'
// });
// invoer.richting → { omhoog, omlaag, links, rechts } (booleans, live; alleen lezen)
// invoer.los() → alle vastgehouden toetsen/knoppen loslaten
// invoer.as() → { dx, dy }: toetsenbord/D-pad genormaliseerd, anders de joystick (analoog, kracht 0–1)
// invoer.vernietig();

import { maakJoystick } from './ui/joystick.js';

// Op fysieke toets (ev.code), niet op ev.key: met Shift of Caps Lock wordt 'd' een 'D', waardoor
// keydown en keyup niet meer bij elkaar passen en een richting blijft hangen.
const TOETSEN = {
  ArrowUp: 'omhoog', ArrowDown: 'omlaag', ArrowLeft: 'links', ArrowRight: 'rechts',
  KeyW: 'omhoog', KeyS: 'omlaag', KeyA: 'links', KeyD: 'rechts',
};
// Terugval voor (virtuele) toetsenborden die geen ev.code meegeven.
const TOETSEN_KEY = {
  ArrowUp: 'ArrowUp', ArrowDown: 'ArrowDown', ArrowLeft: 'ArrowLeft', ArrowRight: 'ArrowRight',
  w: 'KeyW', s: 'KeyS', a: 'KeyA', d: 'KeyD',
};
const toetsCode = (ev) => (ev.code && TOETSEN[ev.code] ? ev.code : TOETSEN_KEY[(ev.key || '').length === 1 ? ev.key.toLowerCase() : ev.key] || null);

export function maakInvoer({ richtingen = {}, acties = {}, joystick = null, bijActie = () => {}, toetsenbord = true } = {}) {
  const richting = { omhoog: false, omlaag: false, links: false, rechts: false };
  const opruimers = [];
  const ingedrukteToetsen = new Set();                                      // ev.code's van vastgehouden toetsen
  const knop = { omhoog: false, omlaag: false, links: false, rechts: false }; // vastgehouden D-pad-knoppen

  // richting = D-pad OF toetsenbord; steeds opnieuw afgeleid, zodat de ene bron de andere niet uitzet.
  function herbereken() {
    for (const k of Object.keys(richting)) richting[k] = knop[k];
    for (const c of ingedrukteToetsen) richting[TOETSEN[c]] = true;
  }
  function losAlles() {
    ingedrukteToetsen.clear();
    for (const k of Object.keys(knop)) knop[k] = false;
    herbereken();
  }

  let stick = null;
  if (joystick && joystick.element) {
    const { tik = null, ...rest } = joystick;
    stick = maakJoystick({ ...rest, bijTik: tik ? () => bijActie(tik) : null });
    opruimers.push(() => stick.vernietig());
  }

  function luister(el, type, fn, opties) {
    el.addEventListener(type, fn, opties);
    opruimers.push(() => el.removeEventListener(type, fn, opties));
  }

  // D-pad-knoppen: vasthouden = richting aan.
  for (const [naam, el] of Object.entries(richtingen)) {
    if (!el) continue;
    const aan = (ev) => { ev.preventDefault(); knop[naam] = true; herbereken(); try { el.setPointerCapture(ev.pointerId); } catch { /* negeren */ } };
    const uit = () => { knop[naam] = false; herbereken(); };
    luister(el, 'pointerdown', aan);
    luister(el, 'pointerup', uit);
    luister(el, 'pointercancel', uit);
    luister(el, 'lostpointercapture', uit);
    luister(el, 'contextmenu', (ev) => ev.preventDefault());
    // Toetsenbordgebruikers die de knop focussen: spatie/Enter zet de richting kort aan.
    luister(el, 'keydown', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); aan(ev); } });
    luister(el, 'keyup', (ev) => { if (ev.key === ' ' || ev.key === 'Enter') uit(); });
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
      const c = toetsCode(ev);
      if (c) {
        ev.preventDefault();
        // Met Cmd/Ctrl ingedrukt komen er (op macOS) geen keyups voor andere toetsen: niet onthouden.
        if (ev.metaKey || ev.ctrlKey) return;
        ingedrukteToetsen.add(c); herbereken(); return;
      }
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
      const c = toetsCode(ev);
      if (c) { ingedrukteToetsen.delete(c); herbereken(); }
      else if (ev.key === 'Meta') losAlles(); // na Cmd zijn keyups mogelijk ingeslikt
    });
    luister(window, 'blur', losAlles);
    luister(document, 'visibilitychange', () => { if (document.hidden) losAlles(); });
  }

  return {
    richting,
    as() {
      let dx = (richting.rechts ? 1 : 0) - (richting.links ? 1 : 0);
      let dy = (richting.omlaag ? 1 : 0) - (richting.omhoog ? 1 : 0);
      if (dx && dy) { dx *= Math.SQRT1_2; dy *= Math.SQRT1_2; }
      if (!dx && !dy && stick) return stick.as();
      return { dx, dy };
    },
    get joystick() { return stick; },
    /** Alle vastgehouden toetsen en knoppen loslaten (bv. als een dialoog opent of sluit). */
    los: losAlles,
    vernietig() { for (const f of opruimers) f(); opruimers.length = 0; },
  };
}
