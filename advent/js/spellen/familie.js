// Spel 3 · gegevens en regels zonder DOM (zie specs/spel3.md).
// Families, vaste leden, lege plekken en de vier karakterkaarten met hun prijs en vaste familie.
// Posities en kleuren komen uit design/generators/spel3_build2.py (scène 358×150).

const HUID = '#E8B48A';
const HUID_DONKER = '#C98B5A';
const HAAR = '#2B1A0E';

/** Uiterlijk van de karakters die je kunt kopen (persoon() of dier()). */
export const KARAKTERS = {
  lam: { soort: 'dier', dier: 'lam', label: 'Lammetje' },
  gansje: { soort: 'dier', dier: 'gansje', label: 'Gansje' },
  meisje: { soort: 'persoon', label: 'Meisje', persoon: { kleding: '#5BC0EB', huid: HUID, haar: 'bh-lang', haarkleur: '#FFC93C', jurk: true, kind: true } },
  biggetje: { soort: 'dier', dier: 'biggetje', label: 'Biggetje' },
};

/** De kaarten in de bak, altijd dezelfde, in deze volgorde (besluit 38). */
export const KAARTEN = [
  { id: 'lam', prijs: { groen: 2 } },
  { id: 'gansje', prijs: { geel: 1 } },
  { id: 'meisje', prijs: { geel: 1, blauw: 1 } },
  { id: 'biggetje', prijs: { blauw: 1, geel: 1 } },
];

/**
 * Families. leden: persoon()-opties met positie; plekken: { karakter, x, y } (x,y = linksboven van de plek 48×40).
 * Een persoon-karakter (meisje) staat als kind op (x − 2, y − 14), net als het dochtertje van Tan.
 */
export const FAMILIES = [
  {
    id: 'nguyen', huis: 'huis-villa', lucht: '#DDF1FB', grond: '#8BD35A', werker: true,
    omschrijving: 'een villa met rood getrapt dak',
    leden: [
      { x: 14, y: 66, kleding: '#9B6BFF', huid: HUID, haar: 'bh-knot', haarkleur: HAAR, jurk: true, acc: ['acc-ketting'] },
      { x: 62, y: 66, kleding: '#1E3A4C', huid: HUID, haar: 'bh-kort', haarkleur: HAAR, acc: ['acc-hoed'] },
    ],
    plekken: [{ karakter: 'meisje', x: 112, y: 100 }, { karakter: 'gansje', x: 156, y: 100 }],
  },
  {
    id: 'tan', huis: 'huis-paal', lucht: '#BFE6FA', grond: '#9ADB7A',
    omschrijving: 'een paalwoning bij de rijstvelden',
    leden: [
      { x: 14, y: 66, kleding: '#C43B38', huid: HUID, haar: 'bh-lang', haarkleur: HAAR, jurk: true, acc: ['acc-nonla'] },
      { x: 62, y: 66, kleding: '#39D353', huid: HUID, haar: 'bh-kort', haarkleur: HAAR, acc: ['acc-pet'] },
      { x: 110, y: 86, kleding: '#5BC0EB', huid: HUID, haar: 'bh-lang', haarkleur: '#FFC93C', jurk: true, kind: true, acc: ['acc-rijsthoed-kind'] },
    ],
    plekken: [{ karakter: 'biggetje', x: 146, y: 100 }],
  },
  {
    id: 'somchai', huis: 'huis-shop', lucht: '#FFE0EE', grond: '#D9B27C',
    omschrijving: 'een roze shophouse',
    leden: [
      { x: 14, y: 66, kleding: '#FF6FAE', huid: HUID_DONKER, haar: 'bh-knot', haarkleur: HAAR, jurk: true, acc: ['acc-bril'] },
      { x: 62, y: 66, kleding: '#1FA3DC', huid: HUID, haar: 'bh-stekel', haarkleur: HAAR },
      { x: 110, y: 86, kleding: '#FFC93C', huid: HUID_DONKER, haar: 'bh-stekel', haarkleur: HAAR, kind: true },
    ],
    plekken: [{ karakter: 'lam', x: 150, y: 100 }],
  },
];

export function familie(id) {
  return FAMILIES.find((f) => f.id === id) || null;
}

export function kaart(id) {
  return KAARTEN.find((k) => k.id === id) || null;
}

/** Bij welke familie hoort dit karakter? */
export function familieVan(karakter) {
  return FAMILIES.find((f) => f.plekken.some((p) => p.karakter === karakter)) || null;
}

export function isCompleet(fam, gekocht) {
  const f = typeof fam === 'string' ? familie(fam) : fam;
  return !!f && f.plekken.every((p) => gekocht.includes(p.karakter));
}

export function alleCompleet(gekocht) {
  return FAMILIES.every((f) => isCompleet(f, gekocht));
}

export function betaalbaar(prijs, edelstenen) {
  return Object.entries(prijs).every(([kleur, n]) => (edelstenen[kleur] || 0) >= n);
}

/** "twee groene edelstenen", "een gele en een blauwe edelsteen" (voor aria-labels). */
export function prijsTekst(prijs) {
  const bijv = { groen: 'groene', geel: 'gele', blauw: 'blauwe' };
  const delen = Object.entries(prijs).map(([kleur, n]) => `${n === 1 ? 'een' : n === 2 ? 'twee' : n} ${bijv[kleur] || kleur}`);
  // "twee groene edelstenen", maar "een gele en een blauwe edelsteen".
  const meervoud = delen.length === 1 && Object.values(prijs)[0] > 1;
  return `${delen.join(' en ')} ${meervoud ? 'edelstenen' : 'edelsteen'}`;
}
