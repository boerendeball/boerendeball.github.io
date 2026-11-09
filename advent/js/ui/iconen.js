// Iconen van de kalender (48×48, uit de artboards) en deurtjes-iconen per dag.
// Spel-iconen die als sprite bestaan (gi, loep, tijger, baby, taart) komen via <use>.

const SVG_NS = 'http://www.w3.org/2000/svg';

const PADEN = {
  kroon: '<path d="M8 36 L6 14 L17 24 L24 10 L31 24 L42 14 L40 36z" fill="#FFC93C"/><rect x="8" y="36" width="32" height="6" rx="2" fill="#D97A00"/><circle cx="24" cy="10" r="3" fill="#FF6FAE"/><circle cx="6" cy="14" r="2.5" fill="#1FA3DC"/><circle cx="42" cy="14" r="2.5" fill="#1FA3DC"/><circle cx="24" cy="30" r="3" fill="#FF6FAE"/>',
  tuin: '<polygon points="24,2 44,13 44,35 24,46 4,35 4,13" fill="#1FA34A"/><polygon points="24,6 40,15 40,33 24,42 8,33 8,15" fill="#39D353"/><g transform="translate(24 25) scale(1.5)"><circle cx="0" cy="-4" r="5" fill="#FFFFFF" opacity="0.95"/><circle cx="-4" cy="-1.5" r="3.8" fill="#FFFFFF" opacity="0.95"/><circle cx="4" cy="-1.5" r="3.8" fill="#FFFFFF" opacity="0.95"/><circle cx="0" cy="0" r="3.5" fill="#FFFFFF" opacity="0.95"/><rect x="-1" y="1.5" width="2" height="5.5" rx="0.6" fill="#FFFFFF" opacity="0.95"/></g>',
  familie: '<circle cx="10" cy="27" r="7" fill="#FFFFFF"/><path d="M16 26 l6 1.5 -6 1.5z" fill="#FF8A3D"/><circle cx="12" cy="25" r="1.2" fill="#1E3A4C"/><path d="M8 29 q2 2 4 0" fill="none" stroke="#1E3A4C" stroke-width="1" stroke-linecap="round"/><circle cx="24" cy="27" r="7" fill="#FFF7EA"/><circle cx="18" cy="22" r="2.5" fill="#FFF7EA"/><circle cx="30" cy="22" r="2.5" fill="#FFF7EA"/><ellipse cx="24" cy="29" rx="4" ry="3" fill="#4A3426"/><circle cx="22.5" cy="28" r="0.8" fill="#FFFFFF"/><circle cx="25.5" cy="28" r="0.8" fill="#FFFFFF"/><path d="M22.5 30.5 q1.5 1.5 3 0" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round"/><circle cx="38" cy="27" r="7" fill="#FFB8D4"/><path d="M32 22 l2 -5 3 3z M44 22 l-2 -5 -3 3z" fill="#FFB8D4"/><ellipse cx="38" cy="29" rx="3" ry="2" fill="#FF6FAE"/><circle cx="37" cy="29" r="0.7" fill="#B23A6A"/><circle cx="39" cy="29" r="0.7" fill="#B23A6A"/><circle cx="35.5" cy="26" r="1" fill="#1E3A4C"/><circle cx="40.5" cy="26" r="1" fill="#1E3A4C"/><path d="M35 32 q3 2.5 6 0" fill="none" stroke="#B23A6A" stroke-width="1" stroke-linecap="round"/><circle cx="8" cy="23" r="1.6" fill="#FF6FAE"/><circle cx="40" cy="23" r="1.6" fill="#FF6FAE"/><path d="M24 12 c-3 -4 -8 -1 -5 3 l5 5 5 -5 c3 -4 -2 -7 -5 -3z" fill="#FF6FAE"/><path d="M10 9 c-2 -2.5 -5 -0.5 -3 2 l3 3 3 -3 c2 -2.5 -1 -4.5 -3 -2z" fill="#FFC93C"/><path d="M38 9 c-2 -2.5 -5 -0.5 -3 2 l3 3 3 -3 c2 -2.5 -1 -4.5 -3 -2z" fill="#5BC0EB"/>',
  camera: '<rect x="16" y="9" width="14" height="7" rx="2" fill="#1E3A4C"/><rect x="6" y="14" width="36" height="26" rx="5" fill="#1E3A4C"/><circle cx="24" cy="27" r="9" fill="#5BC0EB"/><circle cx="24" cy="27" r="5" fill="#0E7FB5"/><circle cx="21" cy="24" r="1.8" fill="#FFFFFF"/><rect x="34" y="18" width="5" height="3" rx="1" fill="#FFC93C"/><path d="M4 6 l3 3 M44 6 l-3 3" stroke="#FFC93C" stroke-width="2.5" stroke-linecap="round"/>',
  munten: '<circle cx="17" cy="31" r="10" fill="#E6EFF5" stroke="#8AA0AF" stroke-width="2"/><circle cx="17" cy="31" r="5" fill="none" stroke="#8AA0AF" stroke-width="2"/><circle cx="31" cy="20" r="10" fill="#E6EFF5" stroke="#8AA0AF" stroke-width="2"/><circle cx="31" cy="20" r="5" fill="none" stroke="#8AA0AF" stroke-width="2"/>',
  taart: '<rect x="8" y="24" width="32" height="16" rx="4" fill="#F4C7A1"/><path d="M8 24 h32 v5 q-4 5 -8 0 t-8 0 t-8 0 t-8 0z" fill="#FF6FAE"/><rect x="15" y="12" width="3" height="12" rx="1.5" fill="#5BC0EB"/><rect x="23" y="10" width="3" height="14" rx="1.5" fill="#FFC93C"/><rect x="31" y="12" width="3" height="12" rx="1.5" fill="#9B6BFF"/><circle cx="16.5" cy="10" r="2.5" fill="#FF8A3D"/><circle cx="24.5" cy="8" r="2.5" fill="#FF8A3D"/><circle cx="32.5" cy="10" r="2.5" fill="#FF8A3D"/>',
  slot: '<path d="M17 20 v-5 a7 7 0 0 1 14 0 v5" fill="none" stroke="#B8860B" stroke-width="3.5"/><rect x="12" y="20" width="24" height="20" rx="6" fill="#FFC93C"/><circle cx="24" cy="29" r="3" fill="#6B4A10"/>',
  terug: '<path d="M30 10 L16 24 L30 38" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
  omlaag: '<path d="M12 18 L24 30 L36 18" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  hart: '<path d="M24 42 C10 32 4 24 4 16 a10 10 0 0 1 20 -4 a10 10 0 0 1 20 4 c0 8 -6 16 -20 26z" fill="#FF6FAE"/>',
  oog: '<path d="M4 24 q20 -22 40 0 q-20 22 -40 0z" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="24" cy="24" r="6" fill="currentColor"/>',
  kruis: '<path d="M12 12 L36 36 M36 12 L12 36" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>',
  deur: '<rect x="8" y="6" width="32" height="36" rx="5" fill="#0E3D1C"/><rect x="14" y="12" width="20" height="24" rx="3" fill="#39D353"/><circle cx="29" cy="24" r="2.5" fill="#0E3D1C"/>',
  speel: '<path d="M14 8 L40 24 L14 40z" fill="currentColor"/>',
  telefoon: '<path d="M14 6 h8 l4 10 -6 4 c2 6 6 10 12 12 l4 -6 10 4 v8 c0 2 -2 4 -4 4 C22 42 6 26 6 10 c0 -2 2 -4 4 -4z" fill="currentColor"/>',
  gans: '<ellipse cx="20" cy="30" rx="13" ry="8" fill="#FFFFFF"/><rect x="27" y="12" width="6" height="18" rx="3" fill="#FFFFFF"/><circle cx="31" cy="12" r="5" fill="#FFFFFF"/><path d="M35 12 l7 2 -7 2z" fill="#FF8A3D"/><circle cx="32" cy="11" r="1.2" fill="#1E3A4C"/><path d="M29 8 l5 1.5" stroke="#1E3A4C" stroke-width="1.5" stroke-linecap="round"/><rect x="15" y="36" width="3" height="6" rx="1.5" fill="#FF8A3D"/><rect x="23" y="36" width="3" height="6" rx="1.5" fill="#FF8A3D"/><path d="M6 10 l-3 -4 M9 8 l-1 -5 M4 14 l-4 -1" stroke="#1E3A4C" stroke-width="1.5" stroke-linecap="round"/>',
  gansKlein: '<ellipse cx="20" cy="30" rx="13" ry="8" fill="#FFFFFF"/><rect x="27" y="12" width="6" height="18" rx="3" fill="#FFFFFF"/><circle cx="31" cy="12" r="5" fill="#FFFFFF"/><path d="M35 12 l7 2 -7 2z" fill="#FF8A3D"/><circle cx="32" cy="11" r="1.2" fill="#1E3A4C"/>',
  lamp: '<path d="M24 6 a12 12 0 0 1 7 21.7 V32 H17 v-4.3 A12 12 0 0 1 24 6z" fill="#FFC93C"/><rect x="18" y="34" width="12" height="4" rx="2" fill="#9A5B00"/><rect x="20" y="39" width="8" height="3" rx="1.5" fill="#9A5B00"/>',
  vink: '<path d="M10 26 L20 36 L38 14" fill="none" stroke="#1F7A3A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>',
  huis: '<path d="M8 24 L24 10 L40 24 V40 H30 V30 H18 V40 H8z" fill="currentColor"/>',
  vaardigheid: '<path d="M10 30 q14 -20 28 0" fill="none" stroke="#6B3FCF" stroke-width="6" stroke-linecap="round"/><circle cx="10" cy="30" r="5" fill="#6B3FCF"/><circle cx="38" cy="30" r="5" fill="#6B3FCF"/>',
  // hand die naar rechts wijst (actieknop spel 1)
  hand: '<path d="M6 20 a4 4 0 0 1 4 -4 h4 v-3 a3.5 3.5 0 0 1 7 0 v3 h20 a4 4 0 0 1 0 8 h-14 v3.5 a3.5 3.5 0 0 1 -0.5 1.8 a3.5 3.5 0 0 1 -1 6 a3.5 3.5 0 0 1 -2 6 h-8 a9.5 9.5 0 0 1 -9.5 -9.5z" fill="#FFFFFF"/><path d="M18 28 h8 M18 34.5 h7 M18 41 h5" stroke="#FF5E5B" stroke-width="2" stroke-linecap="round"/>',
  // D-pad-chevrons (stroke 6, currentColor)
  pijlOmhoog: '<path d="M10 30 L24 16 L38 30" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  pijlLinks: '<path d="M30 10 L16 24 L30 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  pijlOmlaag: '<path d="M10 18 L24 32 L38 18" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  pijlRechts: '<path d="M18 10 L32 24 L18 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>',
  // kroon zonder zijstippen (teller in de kopbalk van spel 1)
  kroonKlein: '<path d="M8 36 L6 14 L17 24 L24 10 L31 24 L42 14 L40 36z" fill="#FFC93C"/><rect x="8" y="36" width="32" height="6" rx="2" fill="#D97A00"/><circle cx="24" cy="30" r="3" fill="#FF6FAE"/>',
  // tandwiel (knop naar de ontwikkelaarsopties, alleen in devmodus)
  tandwiel: '<g fill="currentColor"><rect x="20" y="3" width="8" height="10" rx="2"/><rect x="20" y="35" width="8" height="10" rx="2"/><rect x="3" y="20" width="10" height="8" rx="2"/><rect x="35" y="20" width="10" height="8" rx="2"/><rect x="20" y="3" width="8" height="10" rx="2" transform="rotate(45 24 24)"/><rect x="20" y="35" width="8" height="10" rx="2" transform="rotate(45 24 24)"/><rect x="3" y="20" width="10" height="8" rx="2" transform="rotate(45 24 24)"/><rect x="35" y="20" width="10" height="8" rx="2" transform="rotate(45 24 24)"/><circle cx="24" cy="24" r="14"/></g><circle cx="24" cy="24" r="6" fill="#FFFFFF"/>',
};

// Telefoon 64×64 (belscherm).
const TELEFOON_GROOT = '<rect x="8" y="30" width="48" height="26" rx="8" fill="#FF6FAE"/><rect x="14" y="36" width="36" height="14" rx="4" fill="#FFE0EE"/><circle cx="22" cy="43" r="3" fill="#B23A6A"/><circle cx="32" cy="43" r="3" fill="#B23A6A"/><circle cx="42" cy="43" r="3" fill="#B23A6A"/><path d="M10 26 c0 -8 10 -12 22 -12 s22 4 22 12 v4 h-10 v-4 c0 -2 -5 -4 -12 -4 s-12 2 -12 4 v4 h-10z" fill="#B23A6A"/><rect x="30" y="20" width="4" height="10" fill="#B23A6A"/>';

// Deurtjes-iconen die als sprite bestaan: [symbool, viewBox-breedte, -hoogte, kleur]
const SPRITE_ICONEN = {
  gi: ['s6-gi', 48, 48, null],
  loep: ['s7-loep', 48, 48, null],
  tijger: ['s8-stuk-tijger', 48, 60, null],
  baby: ['s9-bundel', 48, 48, '#FFD6E6'],
  klok: ['s9-klok', 48, 48, null],
  // producten van de markt (spel 5)
  ketting: ['s5-ketting', 48, 48, null],
  kniebeschermers: ['s5-kniebeschermers', 48, 48, null],
  spray: ['s5-spray', 48, 48, null],
  schoenen: ['s5-schoenen', 48, 48, null],
};

function maakSvg(vbB, vbH, maat, attrs) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${vbB} ${vbH}`);
  svg.setAttribute('width', String(maat));
  svg.setAttribute('height', String(Math.round(maat * vbH / vbB)));
  svg.classList.add('ic');
  if (attrs.label) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', attrs.label);
  } else {
    svg.setAttribute('aria-hidden', 'true');
  }
  if (attrs.klasse) svg.classList.add(attrs.klasse);
  return svg;
}

/** Icoon op naam. maat in px; label maakt het een role="img". */
export function icoon(naam, maat = 24, { label = null, klasse = null } = {}) {
  if (naam === 'telefoonGroot') {
    const svg = maakSvg(64, 64, maat, { label, klasse });
    svg.innerHTML = TELEFOON_GROOT;
    return svg;
  }
  if (SPRITE_ICONEN[naam]) {
    const [id, b, hh, kleur] = SPRITE_ICONEN[naam];
    const svg = maakSvg(b, hh, maat, { label, klasse });
    const u = document.createElementNS(SVG_NS, 'use');
    u.setAttribute('href', `#${id}`);
    u.setAttribute('width', String(b));
    u.setAttribute('height', String(hh));
    if (kleur) u.setAttribute('color', kleur);
    svg.append(u);
    return svg;
  }
  const svg = maakSvg(48, 48, maat, { label, klasse });
  svg.innerHTML = PADEN[naam] || '';
  return svg;
}

/** Achtergrondkleur van de icoonbol per deurtje (dag 1–4 uit het ontwerp, 5–10 in dezelfde reeks). */
export const BOL_KLEUR = {
  kroon: '#FFE0EE', tuin: '#D9F5DE', familie: '#FFF1D6', camera: '#DDF1FB', munten: '#FFF1D6',
  gi: '#E3F4FC', loep: '#DDF1FB', tijger: '#D9F5DE', baby: '#FFE0EE', taart: '#FFE0EE',
  ketting: '#FFE0EE', kniebeschermers: '#DDF1FB', spray: '#D9F5DE', schoenen: '#FFE0EE',
};

/** Ringkleur rond de grote icoonbol (Open/Laden-scherm) per icoon. */
export const RING_KLEUR = {
  kroon: '#FF6FAE', tuin: '#39D353', familie: '#FFC93C', camera: '#1FA3DC', munten: '#FFC93C',
  gi: '#1FA3DC', loep: '#1FA3DC', tijger: '#39D353', baby: '#FF6FAE', taart: '#FF6FAE',
  ketting: '#FF6FAE', kniebeschermers: '#1FA3DC', spray: '#39D353', schoenen: '#FF6FAE',
};
