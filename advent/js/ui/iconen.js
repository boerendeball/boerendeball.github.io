// Iconen van de kalender (48×48, uit de artboards) en deurtjes-iconen per dag.
// Tellers en producten die als sprite bestaan (loep, tijger, baby, …) komen via <use>.

const SVG_NS = 'http://www.w3.org/2000/svg';

const PADEN = {
  // kroon (dag 1): Pino's kroon met schaduwtint en glans (besluit 185)
  kroon: '<path d="M8 35 L5 13 L16 23 L24 8 L32 23 L43 13 L40 35z" fill="#FFC93C"/><path d="M24 8 L32 23 L43 13 L40 35 H24z" fill="rgba(0,0,0,0.1)"/><rect x="7" y="34" width="34" height="8" rx="3" fill="#D97A00"/><circle cx="24" cy="38" r="2.6" fill="#FF6FAE"/><circle cx="14.5" cy="38" r="1.8" fill="#8ED8F8"/><circle cx="33.5" cy="38" r="1.8" fill="#8ED8F8"/><circle cx="24" cy="8" r="3.4" fill="#FF6FAE"/><circle cx="5" cy="13" r="2.7" fill="#FF6FAE"/><circle cx="43" cy="13" r="2.7" fill="#FF6FAE"/><path d="M11 21 l1.6 9" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>',
  // tuin (dag 2): junglehex met boompje, met schaduwtint en glans (besluit 185)
  tuin: '<polygon points="24,5 43,15.5 43,35.5 24,46 5,35.5 5,15.5" fill="#2E7D1E"/><polygon points="24,2 43,12.5 43,32.5 24,43 5,32.5 5,12.5" fill="#1FA34A"/><polygon points="24,6 39.5,14.6 39.5,30.4 24,39 8.5,30.4 8.5,14.6" fill="#39D353"/><polygon points="24,6 39.5,14.6 39.5,30.4 24,39" fill="rgba(0,0,0,0.08)"/><path d="M11.6 15.6 L22 9.8" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/><g transform="translate(24 23) scale(1.4)"><rect x="-1" y="1.5" width="2" height="5.5" rx="0.6" fill="#FFFFFF"/><circle cx="0" cy="-4" r="5" fill="#FFFFFF"/><circle cx="-4" cy="-1.5" r="3.8" fill="#FFFFFF"/><circle cx="4" cy="-1.5" r="3.8" fill="#FFFFFF"/><circle cx="0" cy="0" r="3.5" fill="#FFFFFF"/><path d="M0 3.5 a3.5 3.5 0 0 0 3 -1.7 a3.8 3.8 0 0 0 4.6 -4.6 q-1.2 3.6 -4.4 3.4 q-0.6 2.2 -3.2 2.9z" fill="#CFEFD6"/></g>',
  // familie (dag 3): moeder met rijsthoed en vader met pet, ertussen een lege plek (besluit 185)
  familie: '<path d="M2 44 q0 -9 9 -9 q9 0 9 9z" fill="#C43B38"/><circle cx="11" cy="26" r="7.5" fill="#F6C9A8"/><path d="M3.5 25 v8 q2.4 -3 2.4 -8z M18.5 25 v8 q-2.4 -3 -2.4 -8z" fill="#2B1A0E"/><path d="M1 23 L11 12 L21 23z" fill="#D9B27C"/><path d="M1 23 h20" stroke="#C9A77A" stroke-width="2"/><circle cx="8.6" cy="27" r="1" fill="#1E3A4C"/><circle cx="13.4" cy="27" r="1" fill="#1E3A4C"/><path d="M8.8 29.8 q2.2 1.8 4.4 0" fill="none" stroke="#1E3A4C" stroke-width="1.1" stroke-linecap="round"/><path d="M28 44 q0 -9 9 -9 q9 0 9 9z" fill="#39D353"/><circle cx="37" cy="26" r="7.5" fill="#E8B48A"/><path d="M29.5 24 a7.5 7.5 0 0 1 15 0 v1.4 h-15z" fill="#1FA3DC"/><rect x="37" y="23.4" width="10.5" height="2.6" rx="1.3" fill="#0E7FB5"/><circle cx="34.6" cy="28" r="1" fill="#1E3A4C"/><circle cx="39.4" cy="28" r="1" fill="#1E3A4C"/><path d="M34.8 30.6 q2.2 1.8 4.4 0" fill="none" stroke="#1E3A4C" stroke-width="1.1" stroke-linecap="round"/><circle cx="24" cy="36" r="7" fill="#FFFFFF"/><circle cx="24" cy="36" r="7" fill="none" stroke="#1FA3DC" stroke-width="1.6" stroke-dasharray="3 2.4"/><g transform="translate(24 34.4) scale(0.8)"><path d="M-3 -2.6 a3.1 3.1 0 1 1 4.6 2.7 q-1.6 0.9 -1.6 2.6" fill="none" stroke="#0E7FB5" stroke-width="2.2" stroke-linecap="round"/><circle cx="0" cy="6.2" r="1.3" fill="#0E7FB5"/></g><path d="M24 9.4 c-2.2 -3 -6.2 -0.8 -4 2.4 l4 4 4 -4 c2.2 -3.2 -1.8 -5.4 -4 -2.4z" fill="#FF6FAE"/>',
  // camera (dag 4): camera met schaduwtint, ontspanknop en flits (besluit 185)
  camera: '<rect x="15" y="10" width="14" height="8" rx="2.5" fill="#35505F"/><rect x="5" y="15" width="38" height="27" rx="6" fill="#4F6B7E"/><path d="M5 34 h38 v2 a6 6 0 0 1 -6 6 h-26 a6 6 0 0 1 -6 -6z" fill="#35505F"/><rect x="5" y="21" width="38" height="3.4" fill="#FFC93C"/><circle cx="24" cy="29" r="10" fill="#FFFFFF"/><circle cx="24" cy="29" r="7.6" fill="#1FA3DC"/><path d="M24 36.6 a7.6 7.6 0 0 0 7.6 -7.6 h-3.6 a4 4 0 0 1 -4 4z" fill="#0E7FB5"/><circle cx="21.4" cy="26.4" r="2" fill="#FFFFFF"/><rect x="33" y="11.6" width="7" height="4.4" rx="2" fill="#FF6FAE"/><path d="M8.5 2.5 L10.18 6.82 L14.5 8.5 L10.18 10.18 L8.5 14.5 L6.82 10.18 L2.5 8.5 L6.82 6.82z" fill="#FFC93C"/><path d="M8.5 5.9 L9.228 7.772 L11.1 8.5 L9.228 9.228 L8.5 11.1 L7.772 9.228 L5.9 8.5 L7.772 7.772z" fill="#FFFFFF"/>',
  // bod (dag 5): twee tekstballonnen met een grote en een kleine munt, afdingen (besluit 185; verving de handdruk van besluit 109)
  bod: '<path d="M4 9 a5 5 0 0 1 5 -5 h18 a5 5 0 0 1 5 5 v12 a5 5 0 0 1 -5 5 h-12 l-6 6 v-6 a5 5 0 0 1 -5 -5z" fill="#0E7FB5"/><path d="M4 8 a5 5 0 0 1 5 -5 h18 a5 5 0 0 1 5 5 v12 a5 5 0 0 1 -5 5 h-12 l-6 5.4 v-5.4 a5 5 0 0 1 -5 -5z" fill="#1FA3DC"/><circle cx="18" cy="14.9" r="7" fill="#D97A00"/><circle cx="18" cy="13.4" r="7" fill="#FFC93C"/><circle cx="18" cy="13.4" r="4.34" fill="none" stroke="#D97A00" stroke-width="1.4"/><path d="M14.149999999999999 9.9 q1.75 -2.1 4.2 -2.24" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round" opacity="0.7"/><path d="M44 26 a5 5 0 0 0 -5 -5 h-14 a5 5 0 0 0 -5 5 v10 a5 5 0 0 0 5 5 h9 l5 5.5 v-5.5 a5 5 0 0 0 5 -5z" fill="#B23A6A"/><path d="M44 25 a5 5 0 0 0 -5 -5 h-14 a5 5 0 0 0 -5 5 v10 a5 5 0 0 0 5 5 h9 l5 5 v-5 a5 5 0 0 0 5 -5z" fill="#FF6FAE"/><circle cx="32" cy="30.9" r="4.8" fill="#D97A00"/><circle cx="32" cy="29.4" r="4.8" fill="#FFC93C"/><circle cx="32" cy="29.4" r="2.976" fill="none" stroke="#D97A00" stroke-width="1.0"/><path d="M29.36 27 q1.2 -1.44 2.88 -1.536" fill="none" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round" opacity="0.7"/>',
  // gi (dag 6): jiujitsu-pak met blauwe band, met rand zodat het loskomt van de bol (besluit 185)
  gi: '<path d="M15 6 L24 12 L33 6 L44 14 L39 26 L35 23.5 V43 H13 V23.5 L9 26 L4 14z" fill="#B8C9D6"/><path d="M15 4.6 L24 11 L33 4.6 L44 12.6 L39 24.6 L35 22 V41 H13 V22 L9 24.6 L4 12.6z" fill="#FFFFFF"/><path d="M24 11 L33 4.6 L44 12.6 L39 24.6 L35 22 V41 H24z" fill="#E6EDF2"/><path d="M15 4.6 L27 29 M33 4.6 L21 29" fill="none" stroke="#B8C9D6" stroke-width="2.2" stroke-linecap="round"/><path d="M19.4 7.8 L24 17 L28.6 7.8 L24 11z" fill="#F6C9A8"/><rect x="12" y="28" width="24" height="5.6" rx="2" fill="#1FA3DC"/><rect x="12" y="31" width="24" height="2.6" rx="1.3" fill="#0E7FB5"/><path d="M22.6 33 l-3 8.4 M25.6 33 l3.4 7.4" fill="none" stroke="#1FA3DC" stroke-width="3.6" stroke-linecap="round"/><rect x="21" y="27.4" width="6" height="6.8" rx="2" fill="#0E7FB5"/>',
  // loepFoto (dag 7): loep op een polaroid uit het album (besluit 185); de kale loep (sprite) blijft de teller in spel 7
  loepFoto: '<g transform="rotate(-8 20 22)"><rect x="5" y="5.6" width="29" height="34" rx="3" fill="#CDE4F0"/><rect x="5" y="4" width="29" height="34" rx="3" fill="#FFFFFF"/><rect x="8" y="7" width="23" height="21" rx="1.5" fill="#8ED8F8"/><path d="M8 21 q11.5 -5 23 0 v5.5 a1.5 1.5 0 0 1 -1.5 1.5 h-20 a1.5 1.5 0 0 1 -1.5 -1.5z" fill="#8BD35A"/><rect x="12.4" y="14" width="2.2" height="9" fill="#8B4A1E"/><circle cx="13.5" cy="13" r="4.4" fill="#1FA34A"/></g><path d="M34 35 L43 44" stroke="#8B4A1E" stroke-width="5.6" stroke-linecap="round"/><path d="M34 35 L43 44" stroke="#C2743C" stroke-width="2.6" stroke-linecap="round"/><circle cx="28" cy="29" r="10.5" fill="#DDF1FB" opacity="0.85"/><circle cx="28" cy="29" r="10.5" fill="none" stroke="#0E7FB5" stroke-width="3.4"/><path d="M21.6 26 q1.6 -4.4 6 -5" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>',
  // schaak (dag 8): Pino als roze pion tegenover de tijger-toren op twee bordvakken (besluit 185)
  schaak: '<path d="M3 37 h42 v5 a3 3 0 0 1 -3 3 h-36 a3 3 0 0 1 -3 -3z" fill="#3D7A30"/><rect x="3" y="33" width="21" height="9" rx="1.5" fill="#D9CFA8"/><rect x="24" y="33" width="21" height="9" rx="1.5" fill="#8AA66E"/><ellipse cx="13.5" cy="36.4" rx="7.6" ry="2.6" fill="#B23A6A"/><path d="M8.6 36 q1.4 -9 2.6 -14 h4.6 q1.2 5 2.6 14z" fill="#FF6FAE"/><path d="M13.5 22 h2.3 q1.2 5 2.6 14 h-4.9z" fill="rgba(0,0,0,0.12)"/><ellipse cx="13.5" cy="22.4" rx="5" ry="1.9" fill="#B23A6A"/><circle cx="13.5" cy="16" r="5.6" fill="#FF6FAE"/><path d="M10.4 13.4 q1.4 -1.8 3.4 -1.8" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity="0.6"/><g transform="translate(13.5 10.4) scale(0.5)"><path d="M-9 0 L-10 -7 L-5 -3 L0 -9 L5 -3 L10 -7 L9 0z" fill="#FFC93C"/><path d="M-9 0 h18 v3 h-18z" fill="#D97A00"/><circle cx="0" cy="-4.5" r="1.8" fill="#FF6FAE"/></g><ellipse cx="34.5" cy="36.4" rx="8.6" ry="2.8" fill="#D97A00"/><path d="M28 36 l1.6 -18 h9.8 l1.6 18z" fill="#FF8A3D"/><path d="M34.5 18 h4.9 l1.6 18 h-6.5z" fill="rgba(0,0,0,0.12)"/><path d="M27 8 h3.4 v3 h2.6 v-3 h3 v3 h2.6 v-3 h3.4 v10 h-15z" fill="#FF8A3D"/><path d="M34.5 11 h1.5 v-3 h0 v3 h2.6 v-3 h3.4 v10 h-7.5z" fill="rgba(0,0,0,0.12)"/><path d="M31 23 v7 M34.5 22 v9 M38 23 v7" stroke="#1E3A4C" stroke-width="1.8" stroke-linecap="round"/><circle cx="31.6" cy="13.6" r="1.1" fill="#1E3A4C"/><circle cx="37.4" cy="13.6" r="1.1" fill="#1E3A4C"/><path d="M29.6 11.4 l3 1 M39.4 11.4 l-3 1" stroke="#1E3A4C" stroke-width="1.2" stroke-linecap="round"/>',
  // vangen (dag 9): het bundeltje valt, het laken staat klaar (besluit 185); het losse bundeltje (sprite baby) blijft de teller in spel 9
  vangen: '<path d="M16 3 v7 M24 1.6 v6 M32 3 v7" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(24 22) scale(0.86)"><path d="M0 -15 q4 3 5 7 q8 2 11 11 q-7 6 -16 6 q-9 0 -16 -6 q3 -9 11 -11 q1 -4 5 -7z" fill="#FFD6E6"/><path d="M0 9 q9 0 16 -6 q-2 -6 -6 -8.5 q2 9 -10 14.5z" fill="#FFB8D4"/><circle cx="0" cy="0" r="6.5" fill="#F6C9A8"/><path d="M-3 -5.6 q3 -3.4 6 0" fill="none" stroke="#4A3426" stroke-width="1.8" stroke-linecap="round"/><circle cx="-2.3" cy="0" r="0.95" fill="#1E3A4C"/><circle cx="2.3" cy="0" r="0.95" fill="#1E3A4C"/><path d="M-1.8 2.6 q1.8 1.5 3.6 0" fill="none" stroke="#1E3A4C" stroke-width="1" stroke-linecap="round"/><circle cx="-4.3" cy="2" r="1.2" fill="#FF9BC8" opacity="0.75"/><circle cx="4.3" cy="2" r="1.2" fill="#FF9BC8" opacity="0.75"/></g><path d="M5 37 q19 -9 38 0 q-19 11 -38 0z" fill="#FFFFFF"/><path d="M5 37 q19 8 38 0 q-19 11 -38 0z" fill="#CDE4F0"/><circle cx="5" cy="37" r="4" fill="#F6C9A8"/><circle cx="43" cy="37" r="4" fill="#E8B48A"/>',
  // ziekenauto (dag 10): het witte elektrische ziekenhuisautootje (besluit 185); de taart blijft op het deurtje van 3 december en het Open-scherm
  ziekenauto: '<path d="M1 19 h7 M0 25.500 h5 M2 32 h5" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/><ellipse cx="27" cy="40.500" rx="18" ry="2.6" fill="rgba(30,58,76,0.18)"/><path d="M9 34 v-11 q0 -3 3 -4 l5 -1.600 l3 -7 q1 -2.400 3.600 -2.400 h11.400 q2.600 0 3.800 2.200 l4 7.200 q3.200 1 3.200 5 v12.600z" fill="#FFFFFF"/><path d="M9 30 h37 v4 a3 3 0 0 1 -3 3 h-31 a3 3 0 0 1 -3 -3z" fill="#CDE4F0"/><path d="M21.600 11.400 q0.500 -1.200 1.900 -1.200 h4.500 v7.800 h-9.200z" fill="#1FA3DC"/><path d="M30.400 10.200 h4.400 q1.400 0 2 1.100 l3.600 6.700 h-10z" fill="#0E7FB5"/><path d="M26 21.400 h4 v3.200 h3.200 v4 h-3.200 v3.200 h-4 v-3.200 h-3.200 v-4 h3.200z" fill="#FF5E5B"/><rect x="42.600" y="23.600" width="3.400" height="3.600" rx="1.2" fill="#FFC93C"/><circle cx="17" cy="37" r="5.400" fill="#1E3A4C"/><circle cx="17" cy="37" r="2.200" fill="#CFD8DC"/><circle cx="38" cy="37" r="5.400" fill="#1E3A4C"/><circle cx="38" cy="37" r="2.200" fill="#CFD8DC"/>',
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
  loep: ['s7-loep', 48, 48, null],
  tijger: ['s8-stuk-tijger', 48, 60, null],
  pion: ['s8-stuk-pino', 48, 60, null],          // Pino als pion (resultaatschermen spel 8)
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
  kroon: '#FFE0EE', tuin: '#D9F5DE', familie: '#FFF1D6', camera: '#DDF1FB', bod: '#FFF1D6',
  gi: '#DDF1FB', loep: '#DDF1FB', loepFoto: '#DDF1FB', tijger: '#D9F5DE', schaak: '#D9F5DE', pion: '#D9F5DE', baby: '#FFE0EE', vangen: '#DDF1FB', taart: '#FFE0EE', ziekenauto: '#DDF1FB',
  ketting: '#FFE0EE', kniebeschermers: '#DDF1FB', spray: '#D9F5DE', schoenen: '#FFE0EE',
};

/** Ringkleur rond de grote icoonbol (Open/Laden-scherm) per icoon. */
export const RING_KLEUR = {
  kroon: '#FF6FAE', tuin: '#39D353', familie: '#FFC93C', camera: '#1FA3DC', bod: '#FFC93C',
  gi: '#1FA3DC', loep: '#1FA3DC', loepFoto: '#1FA3DC', tijger: '#39D353', schaak: '#39D353', pion: '#39D353', baby: '#FF6FAE', vangen: '#1FA3DC', taart: '#FF6FAE', ziekenauto: '#1FA3DC',
  ketting: '#FF6FAE', kniebeschermers: '#1FA3DC', spray: '#39D353', schoenen: '#FF6FAE',
};
