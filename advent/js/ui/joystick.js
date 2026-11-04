// Virtuele joystick voor touch en muis (besluiten.md #23), herbruikbaar in elk spel.
//
// Druk ergens op het vlak en hou vast: na `vertraging` ms (250) verschijnt op de drukplek een ring met een knop.
// Beweeg de vinger/cursor: de knop schuift binnen de ring mee en as() geeft de richting (en kracht 0–1).
// Loslaten: de joystick verdwijnt en as() is weer (0, 0). Een korte tik zonder beweging roept bijTik aan.
//
// const joystick = maakJoystick({ element: schermEl, vertraging: 250, bijTik: () => onderbreek() });
// joystick.as() → { dx, dy }   joystick.actief   joystick.vernietig()
//
// Pointer-events op knoppen en links in het vlak worden genegeerd, zodat die gewoon blijven werken.

import { h } from './dom.js';

const STANDAARD = {
  vertraging: 250,    // ms vasthouden voordat de joystick verschijnt
  straal: 34,         // px maximale uitslag van de knop (ring 120 px, knop 52 px)
  doodZone: 0.12,     // deel van de straal zonder beweging
  tikDuur: 250,       // ms: korter dan dit zonder beweging = tik (en de joystick is dan nog niet verschenen)
  tikBeweging: 10,    // px: meer beweging dan dit is geen tik
};

export function maakJoystick({ element, vertraging = STANDAARD.vertraging, straal = STANDAARD.straal, doodZone = STANDAARD.doodZone, bijTik = null, bijStart = null, bijStop = null } = {}) {
  if (!element) throw new Error('joystick: element ontbreekt');
  const opruimers = [];
  const knop = h('div', { class: 'joystick-knop', 'aria-hidden': 'true' });
  const ring = h('div', { class: 'joystick', 'aria-hidden': 'true' }, [h('div', { class: 'joystick-ring' }), knop]);

  let pointerId = null;
  let timer = null;
  let begin = null;        // { x, y, t } van de druk
  let laatste = null;      // laatste pointerpositie
  let actief = false;
  let vector = { dx: 0, dy: 0 };

  function luister(el, type, fn, opties) {
    el.addEventListener(type, fn, opties);
    opruimers.push(() => el.removeEventListener(type, fn, opties));
  }

  function toon(x, y) {
    actief = true;
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    document.body.append(ring);
    // reflow afdwingen en dan zichtbaar maken, zodat de intredeanimatie afspeelt (ook zonder rAF)
    void ring.offsetWidth;
    ring.classList.add('joystick-zichtbaar');
    if (laatste) werkBij(laatste.x, laatste.y);
    if (bijStart) bijStart();
  }

  function werkBij(x, y) {
    if (!actief || !begin) return;
    let dx = x - begin.x;
    let dy = y - begin.y;
    const lengte = Math.hypot(dx, dy);
    if (lengte > straal) { dx = (dx / lengte) * straal; dy = (dy / lengte) * straal; }
    knop.style.transform = `translate(${dx}px, ${dy}px)`;
    const kracht = Math.min(1, lengte / straal);
    if (kracht < doodZone) {
      vector = { dx: 0, dy: 0 };
    } else {
      // kracht opnieuw schalen zodat de doodzone op 0 begint
      const k = (kracht - doodZone) / (1 - doodZone);
      vector = { dx: (dx / (lengte || 1)) * k, dy: (dy / (lengte || 1)) * k };
    }
  }

  function stop({ tik = false } = {}) {
    if (timer) { clearTimeout(timer); timer = null; }
    const wasActief = actief;
    actief = false;
    vector = { dx: 0, dy: 0 };
    pointerId = null;
    begin = null;
    laatste = null;
    ring.classList.remove('joystick-zichtbaar');
    knop.style.transform = '';
    ring.remove();
    if (wasActief && bijStop) bijStop();
    if (tik && bijTik) bijTik();
  }

  function opKnop(ev) {
    return !!(ev.target && ev.target.closest && ev.target.closest('button, a, input, select, textarea'));
  }

  luister(element, 'pointerdown', (ev) => {
    if (pointerId !== null || opKnop(ev)) return;
    if (ev.pointerType === 'mouse' && ev.button !== 0) return;
    ev.preventDefault();
    pointerId = ev.pointerId;
    begin = { x: ev.clientX, y: ev.clientY, t: performance.now() };
    laatste = { x: ev.clientX, y: ev.clientY };
    try { element.setPointerCapture(ev.pointerId); } catch { /* negeren */ }
    timer = setTimeout(() => { timer = null; if (pointerId !== null) toon(begin.x, begin.y); }, vertraging);
  });

  luister(element, 'pointermove', (ev) => {
    if (ev.pointerId !== pointerId) return;
    laatste = { x: ev.clientX, y: ev.clientY };
    if (actief) werkBij(ev.clientX, ev.clientY);
  });

  const einde = (ev) => {
    if (ev.pointerId !== pointerId) return;
    const duur = begin ? performance.now() - begin.t : Infinity;
    const beweging = begin && laatste ? Math.hypot(laatste.x - begin.x, laatste.y - begin.y) : Infinity;
    const tik = !actief && ev.type === 'pointerup' && duur < STANDAARD.tikDuur && beweging < STANDAARD.tikBeweging;
    stop({ tik });
  };
  luister(element, 'pointerup', einde);
  luister(element, 'pointercancel', einde);
  luister(element, 'lostpointercapture', (ev) => { if (ev.pointerId === pointerId) stop(); });
  luister(element, 'contextmenu', (ev) => { if (pointerId !== null) ev.preventDefault(); });
  luister(window, 'blur', () => stop());

  element.classList.add('joystick-vlak');
  opruimers.push(() => element.classList.remove('joystick-vlak'));

  return {
    as() { return vector; },
    get actief() { return actief; },
    vernietig() { stop(); for (const f of opruimers) f(); opruimers.length = 0; },
  };
}
