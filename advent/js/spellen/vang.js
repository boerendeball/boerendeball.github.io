// Spel 9 · Vang de baby — regels zonder DOM (specs/spel9.md).
// Posities zijn voetpunten (midden-onder van een personage) in scène-eenheden (358 × 680).

/* ---------- tuning ---------- */
export const DUUR = 20;                 // s vangen
export const STOP_VALLEN = 17;          // s daarna laat de ooievaar niets meer vallen
export const VALTIJD = 4;               // s van snavel tot gras
export const EERSTE_WORP = 1;           // s
export const MAX_IN_LUCHT = 3;          // zoveel baby's hangen er hooguit tegelijk in de lucht (besluit 138)
export const INTERVAL = [2, 3];         // s tussen twee worpen (willekeurig)
export const SNELHEID_SCHOENEN = 160;   // px/s op de voorgrond (schaal 1)
export const SNELHEID_HAKKEN = 55;      // px/s zonder sportschoenen
export const MAN_RENT = 240;            // px/s man met baby
export const MAN_LOOPT_IN = 200;        // px/s nieuwe man het veld in

/* ---------- vangstrook ---------- */
export const B = 358;
export const H = 680;
export const STROOK = { boven: 296, onder: 470 };            // grasbanen
export const VELD = { xMin: 26, xMax: B - 26, yMin: 316, yMax: 462 }; // waar voetpunten mogen komen
// Mannen blijven zo ver van de rand dat Pino er altijd achter past om ze naar het midden te duwen (besluit 135).
export const MAN_VELD = { xMin: 68, xMax: B - 68, yMin: 346, yMax: 432 };
export const LAND = { ...MAN_VELD };  // waar een baby kan landen: overal waar een man kan staan
export const SCHAAL_VER = 0.7;          // schaal op de bovenrand; op de onderrand 1
export const SPRONG = [38, 92];         // px afstand van een landingspunt tot de vanger die erbij hoort
export const VANG_X = 28;               // px (× schaal) naast het midden van het laken dat nog vangt
export const VANG_Y = 16;               // px diepte
export const BOTS_PINO = 16;            // halve breedte (× schaal) van Pino bij het duwen
export const BOTS_MAN = 18;             // halve breedte (× schaal) van een man
export const BOTS_DIEP = 26;            // px diepte waarbinnen Pino en een man elkaar raken
export const START_MANNEN = [[72, 430], [182, 430], [286, 430]];
export const PINO_START = [116, 452];

/** Schaal van alles op de vangstrook: klein bovenaan (ver weg), 1 onderaan. */
export function schaalOp(y) {
  const f = Math.max(0, Math.min(1, (y - VELD.yMin) / (VELD.yMax - VELD.yMin)));
  return SCHAAL_VER + (1 - SCHAAL_VER) * f;
}

/** De grasbanen met perspectief: n banen van boven naar onder, elke baan een vaste factor hoger dan de vorige. */
export function banen(n = 8, factor = 1.11) {
  const totaal = STROOK.onder - STROOK.boven;
  const eerste = totaal * (factor - 1) / (factor ** n - 1);
  const uit = [];
  let y = STROOK.boven;
  for (let i = 0; i < n; i += 1) {
    const h = eerste * factor ** i;
    uit.push({ y, h, licht: i % 2 === 0 });
    y += h;
  }
  return uit;
}

/** Seedbare random (mulberry32); zonder seed Math.random. */
export function maakRng(seed = null) {
  if (seed === null) return Math.random;
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Tijd tot de volgende worp. */
export function volgendeWorp(rng) {
  return INTERVAL[0] + (INTERVAL[1] - INTERVAL[0]) * rng();
}

/**
 * Landingspunt voor een nieuwe baby: op SPRONG afstand van een vanger die nog geen baby boven zich heeft, zodat
 * Pino altijd moet duwen maar het met sportschoenen te halen is. mannen = [{ x, y }] (vrije vangers; voor een man
 * die nog inloopt zijn plek van bestemming).
 */
export function kiesLanding(mannen, rng) {
  if (!mannen.length) {
    return { x: LAND.xMin + (LAND.xMax - LAND.xMin) * rng(), y: LAND.yMin + (LAND.yMax - LAND.yMin) * rng() };
  }
  const man = mannen[Math.floor(rng() * mannen.length)];
  for (let i = 0; i < 12; i += 1) {
    const hoek = rng() * Math.PI * 2;
    const afstand = SPRONG[0] + (SPRONG[1] - SPRONG[0]) * rng();
    const x = man.x + Math.cos(hoek) * afstand;
    const y = man.y + Math.sin(hoek) * afstand * 0.8;
    if (x >= LAND.xMin && x <= LAND.xMax && y >= LAND.yMin && y <= LAND.yMax) return { x, y, man };
  }
  // geen plek gevonden in de ring: schuif het punt het veld in
  return {
    x: Math.max(LAND.xMin, Math.min(LAND.xMax, man.x + (man.x < B / 2 ? SPRONG[0] : -SPRONG[0]))),
    y: Math.max(LAND.yMin, Math.min(LAND.yMax, man.y - SPRONG[0])),
    man,
  };
}

/** Vangt de man (voetpunt x, y) een baby die op (lx, ly) landt? */
export function vangt(man, lx, ly) {
  return Math.abs(man.x - lx) <= VANG_X * schaalOp(man.y) && Math.abs(man.y - ly) <= VANG_Y;
}

/** Raken Pino (px, py) en een man (mx, my) elkaar? */
export function raakt(px, py, mx, my) {
  return Math.abs(px - mx) < BOTS_PINO * schaalOp(py) + BOTS_MAN * schaalOp(my) && Math.abs(py - my) < BOTS_DIEP;
}

/** Staan twee mannen in elkaar? */
export function mannenBotsen(ax, ay, bx, by) {
  return Math.abs(ax - bx) < BOTS_MAN * (schaalOp(ay) + schaalOp(by)) && Math.abs(ay - by) < BOTS_DIEP;
}

/** Voetpunt van een man binnen zijn veld houden (kleiner dan dat van Pino). */
export function binnenManVeld(x, y) {
  return { x: Math.max(MAN_VELD.xMin, Math.min(MAN_VELD.xMax, x)), y: Math.max(MAN_VELD.yMin, Math.min(MAN_VELD.yMax, y)) };
}

/** Voetpunt van Pino binnen het veld houden. */
export function binnenVeld(x, y) {
  return { x: Math.max(VELD.xMin, Math.min(VELD.xMax, x)), y: Math.max(VELD.yMin, Math.min(VELD.yMax, y)) };
}
