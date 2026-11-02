// Kleine DOM-helper: h('div', { class: 'kaart', onclick: fn }, [kinderen]).
// Attributen: strings/getallen worden gezet; on<event> koppelt een listener; html zet innerHTML.

export function h(tag, attrs = {}, kinderen = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === null || v === undefined || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  voeg(e, kinderen);
  return e;
}

export function voeg(ouder, kinderen) {
  for (const kind of [].concat(kinderen)) {
    if (kind === null || kind === undefined || kind === false) continue;
    ouder.append(typeof kind === 'string' || typeof kind === 'number' ? document.createTextNode(String(kind)) : kind);
  }
  return ouder;
}

/** Eerste letter hoofdletter. */
export function hoofdletter(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** Zet of haal scroll-blokkade op body (dialogen, taartmenu). */
export function blokkeerScroll(aan) {
  document.body.classList.toggle('geen-scroll', aan);
}

/** Focus-val voor een dialoog: Tab blijft binnen, Escape sluit. Geeft opruimfunctie terug. */
export function focusVal(container, sluit) {
  const vorige = document.activeElement;
  const selector = 'button, [href], input, [tabindex]:not([tabindex="-1"])';
  function focusbaar() { return [...container.querySelectorAll(selector)].filter((e) => !e.disabled); }
  function opToets(ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); sluit(); return; }
    if (ev.key !== 'Tab') return;
    const lijst = focusbaar();
    if (!lijst.length) return;
    const eerste = lijst[0];
    const laatste = lijst[lijst.length - 1];
    if (ev.shiftKey && document.activeElement === eerste) { ev.preventDefault(); laatste.focus(); }
    else if (!ev.shiftKey && document.activeElement === laatste) { ev.preventDefault(); eerste.focus(); }
  }
  document.addEventListener('keydown', opToets);
  queueMicrotask(() => { const l = focusbaar(); (l[0] || container).focus(); });
  return () => {
    document.removeEventListener('keydown', opToets);
    if (vorige && typeof vorige.focus === 'function' && document.contains(vorige)) vorige.focus();
  };
}
