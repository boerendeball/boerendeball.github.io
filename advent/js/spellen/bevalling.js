// Spel 10 · Bereik de bevalling — regels en afstelwaarden zonder DOM (specs/spel10.md).
// Fase 1: te voet door de avondstad (stap voor stap). Fase 2: in de auto over de weg (baanwissel per tik).

export const B = 358;
export const H = 640;

/* ---------- fase 1 · te voet ---------- */
export const KOLOMMEN = 9;
export const KOLOM_B = 36;
export const kolomX = (k) => 35 + k * KOLOM_B;      // midden van Pino in kolom k
export const START = { kolom: 4, rij: 0 };
// Voetpunt (y) per rij, van de startstoep naar de stoep met het ziekenhuisautootje.
// 0 startstoep · 1 berm · 2 klinkerpad · 3 berm · 4 weiland · 5 berm · 6 weiland · 7 berm · 8 en 9 rijstroken · 10 berm · 11 stoep
export const RIJ_Y = [616, 520, 490, 450, 420, 380, 350, 310, 280, 240, 200, 170];
export const DOELRIJ = RIJ_Y.length - 1;
export const STAP_DUUR = 0.12;          // s per stap
export const PINO_HALF = 10;            // halve breedte van Pino's voeten bij een botsing
export const AMBU = { x: 150, y: 136, w: 72, h: 40 };
export const INSTAP_AFSTAND = 45;       // px van het midden van het autootje waarbinnen Pino instapt
export const OMLOOP = B + 72;           // wie aan de ene kant verdwijnt, komt aan de andere kant terug

export const GANS_V = 22;               // px/s (langzaam)
export const SCHAAP_V = 16;             // px/s (langzaam)
export const AUTO_V = [160, 130];       // px/s (snel): onderste en bovenste rijstrook

const AUTO_KLEUR = ['#FF5E5B', '#FFC93C', '#5BC0EB', '#39D353'];
// y = bovenkant van de sprite; marge = wat er links en rechts van de sprite niet meetelt bij een botsing.
export const STROKEN = [
  { rij: 2, soort: 'gans', y: 452, v: GANS_V, w: 41, h: 34, marge: 9, xs: [106, 146, 186, 226, 266] },
  { rij: 4, soort: 'schaap', y: 388, v: -SCHAAP_V, w: 41, h: 34, marge: 7, xs: [106, 286] },
  { rij: 6, soort: 'schaap', y: 318, v: SCHAAP_V, w: 41, h: 34, marge: 7, xs: [36, 206] },
  { rij: 8, soort: 'auto', y: 248, v: -AUTO_V[0], w: 72, h: 40, marge: 6, xs: [120, 300], kleuren: [AUTO_KLEUR[2], AUTO_KLEUR[3]] },
  { rij: 9, soort: 'auto', y: 208, v: AUTO_V[1], w: 72, h: 40, marge: 6, xs: [30, 230], kleuren: [AUTO_KLEUR[0], AUTO_KLEUR[1]] },
];
export const AUTO_KLEUREN = AUTO_KLEUR;

export function maakVerkeer() {
  const lijst = [];
  for (const strook of STROKEN) {
    strook.xs.forEach((x, i) => lijst.push({ strook, x, kleur: strook.kleuren ? strook.kleuren[i % strook.kleuren.length] : null }));
  }
  return lijst;
}

export function beweegVerkeer(lijst, dt) {
  for (const e of lijst) {
    e.x += e.strook.v * dt;
    if (e.x >= B) e.x -= OMLOOP;
    else if (e.x < -72) e.x += OMLOOP;
  }
}

/** Het dier of de auto waar Pino (midden px, op rij) tegenaan staat, of null. */
export function raaktVoet(lijst, rij, px) {
  for (const e of lijst) {
    const st = e.strook;
    if (st.rij !== rij) continue;
    if (px + PINO_HALF > e.x + st.marge && px - PINO_HALF < e.x + st.w - st.marge) return e;
  }
  return null;
}

export function bijAmbu(rij, px) {
  return rij === DOELRIJ && Math.abs(px - (AMBU.x + AMBU.w / 2)) <= INSTAP_AFSTAND;
}

/* ---------- fase 2 · in de auto ---------- */
export const BAAN_X = [124, 240];       // midden van de linker- en rechterstrook
export const AUTO_Y = 366;              // bovenkant van Pino's auto (staat vast)
export const AUTO_B = 52;
export const AUTO_H = 88;
export const SNELHEID = 260;            // px/s
export const SNELHEID_REM = 90;         // px/s met de rem in
export const VERSNELLING = 500;         // px/s² optrekken en remmen
export const DUUR = 20;                 // s op volle snelheid
export const AFSTAND = SNELHEID * DUUR; // px tot het huis
export const WISSEL_DUUR = 0.15;        // s per baanwissel
export const TEGEN_V = 150;             // px/s tegenligger (komt ons tegemoet)
export const SLOOM_V = 100;             // px/s slome auto (zelfde richting)
export const POLITIE_V = 400;           // px/s politie (haalt in)
export const POLITIE_WEG = 900;         // px/s² zodra de politie voorbij is, trekt hij weg
export const GANS_AUTO_V = 26;          // px/s ganzen dwars over de weg
export const PAUZE = 0.5;               // s lege weg tussen twee situaties
export const EERSTE_PAUZE = 1;          // s voor de eerste situatie
export const STOP_NIEUW = 1100;         // px voor het huis: daarna komt er niets nieuws meer
export const REM_POLITIE = 2.5;         // s de rem vasthouden → er komt politie van achter
export const ZONE = 360;                // px voor het huis: de besturing gaat uit, de auto rolt uit
export const STOP_REM = 300;            // px/s² uitrollen bij het huis
export const KRUIP = 30;                // px/s laatste stukje
export const HUIS = { x: 298, y: 330, w: 60, h: 75 };   // y = bovenkant als de auto stilstaat
export const AANKOMST_DUUR = 1.8;       // s sterretjes en hartjes voor de finale

export const TEGEN_KLEUR = ['#FFC93C', '#FF5E5B', '#39D353'];
export const SLOOM_KLEUR = ['#5BC0EB', '#9B6BFF'];
export const SITUATIES = ['tegenligger', 'inhalen', 'politie', 'ganzen'];

/** Willekeurgenerator (mulberry32); zonder seed een willekeurige. */
export function maakRng(seed = null) {
  let a = (seed === null ? Math.floor(Math.random() * 2 ** 32) : seed) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** De n-de situatie: eerst een tegenligger, dan inhalen, daarna willekeurig (nooit twee keer dezelfde achter elkaar). */
export function kiesSituatie(n, vorige, rng) {
  if (n === 0) return 'tegenligger';
  if (n === 1) return 'inhalen';
  const keuze = SITUATIES.filter((naam) => naam !== vorige);
  return keuze[Math.floor(rng() * keuze.length)];
}

const wagen = (soort, baan, y, eigen, kleur = null) => ({ soort, baan, x: BAAN_X[baan], y, w: 56, h: 96, eigen, vx: 0, kleur, alpha: 1 });

export function maakPolitie(baan) {
  return wagen('politie', baan, H + 10, POLITIE_V);
}

/**
 * De objecten van een situatie. eigen = eigen snelheid in de rijrichting: op het scherm beweegt een object met
 * (rijsnelheid − eigen) omlaag. Een tegenligger heeft dus een negatieve eigen snelheid, een gans 0.
 * In elke situatie is de andere strook vrij, of komt hij op tijd vrij.
 */
export function maakSituatie(naam, baanPino, rng) {
  const kies = (lijst) => lijst[Math.floor(rng() * lijst.length)];
  if (naam === 'tegenligger') return [wagen('tegen', 0, -96, -TEGEN_V, kies(TEGEN_KLEUR))];
  if (naam === 'inhalen') return [wagen('tegen', 0, -140, -TEGEN_V, kies(TEGEN_KLEUR)), wagen('sloom', 1, -96, SLOOM_V, kies(SLOOM_KLEUR))];
  if (naam === 'politie') return [maakPolitie(baanPino)];
  // ganzen: drie op een rij in Pino's strook, ze waggelen naar de dichtstbijzijnde berm
  const kant = baanPino === 0 ? -1 : 1;
  return [-36, 0, 36].map((dx, i) => ({
    soort: 'gans', baan: baanPino, x: BAAN_X[baanPino] + dx, y: -44 + (i === 1 ? 8 : 0), w: 36, h: 30,
    eigen: 0, vx: kant * GANS_AUTO_V, kleur: null, alpha: 1,
  }));
}

/** Raakt Pino's auto (midden px) dit object? */
export function raaktAuto(px, o) {
  const half = o.soort === 'gans' ? 11 : 20;
  const boven = o.y + 6;
  const onder = o.y + o.h - 6;
  return Math.abs(px - o.x) < 20 + half && onder > AUTO_Y + 6 && boven < AUTO_Y + AUTO_H - 6;
}

/** Hoogste snelheid waarmee de auto nog precies bij het huis stilstaat. */
export function uitrolSnelheid(rest) {
  return Math.max(KRUIP, Math.sqrt(2 * STOP_REM * Math.max(0, rest)));
}
