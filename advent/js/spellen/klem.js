// Regels van de armklem in spel 6 (specs/spel6.md), zonder DOM: het notenpatroon, de beoordeling van een druk
// en de worstelbalk ("hoe vrij is de dief"). Alle tijden in milliseconden sinds het begin van de klem.

/** De vier moves, van links naar rechts. Move 3 (knee on belly) lukt alleen met kniebeschermers (besluit 94). */
export const BANEN = ['sweep', 'side-control', 'knee-on-belly', 'rear-naked-choke'];
export const KNIE_BAAN = 2;

export const DUUR = 20000;          // ms tot de politie er is
export const VALTIJD = 1200;        // ms die een noot onderweg is van de bovenkant van de baan naar de knop
export const VENSTER = 180;         // ms voor of na het moment op de knop telt nog als raak
export const EERSTE = 1400;         // ms: de eerste noot bereikt de knop
export const SLOT = 400;            // ms voor het einde komt er geen noot meer
export const INTERVAL_START = 800;  // ms tussen twee noten aan het begin …
export const INTERVAL_EIND = 550;   // … en aan het eind
export const VOL = 100;             // worstelbalk vol: de dief is los
export const GEMIST = 20;           // een noot die voorbijgaat, of een knee on belly zonder kniebeschermers
export const MISDRUK = 10;          // een druk zonder noot in die baan
export const RAAK = 5;              // een treffer haalt dit van de balk af
export const KNIE_KANS = 0.36;      // aandeel knee on belly in het patroon
export const LOS_VANAF = 0.8;       // zonder kniebeschermers loopt de balk pas in het laatste stuk van de tijd vol
const POGINGEN = 400;

/**
 * Foutloos spel zonder kniebeschermers: elke knee on belly mislukt (+GEMIST), elke andere move lukt (−RAAK).
 * Geeft { los, tijd } terug: of de balk volloopt en bij welke noot.
 */
export function zonderKnie(noten) {
  let vrij = 0;
  for (const n of noten) {
    vrij = n.baan === KNIE_BAAN ? vrij + GEMIST : Math.max(0, vrij - RAAK);
    if (vrij >= VOL) return { los: true, tijd: n.tijd };
  }
  return { los: false, tijd: null };
}

/**
 * Het notenpatroon: [{ id, baan, tijd, status: 'open' }]; nooit drie keer achter elkaar dezelfde baan.
 * Het patroon is zo gekozen dat de klem zonder kniebeschermers net niet te halen is (besluit 99): ook met foutloos
 * spel loopt de balk vol, maar pas in het laatste stuk (LOS_VANAF). Met kniebeschermers is het een gewoon patroon.
 */
export function maakPatroon(rnd = Math.random) {
  const tijden = [];
  for (let t = EERSTE; t <= DUUR - SLOT; t += INTERVAL_START + (INTERVAL_EIND - INTERVAL_START) * (t / DUUR)) tijden.push(Math.round(t));
  const ander = () => { const b = Math.floor(rnd() * (BANEN.length - 1)); return b >= KNIE_BAAN ? b + 1 : b; };
  const drieOpRij = (banen, i) => i >= 2 && banen[i] === banen[i - 1] && banen[i] === banen[i - 2];
  const maak = (banen) => tijden.map((tijd, id) => ({ id, baan: banen[id], tijd, status: 'open' }));

  let beste = null;
  for (let poging = 0; poging < POGINGEN; poging += 1) {
    const banen = [];
    for (let i = 0; i < tijden.length; i += 1) {
      banen.push(rnd() < KNIE_KANS ? KNIE_BAAN : ander());
      // Drie op rij: de derde wordt een andere baan (bij drie keer knee on belly dus geen knee on belly).
      while (drieOpRij(banen, i)) banen[i] = banen[i] === KNIE_BAAN ? ander() : (banen[i] + 1 + Math.floor(rnd() * (BANEN.length - 1))) % BANEN.length;
    }
    const noten = maak(banen);
    const uit = zonderKnie(noten);
    if (uit.los && uit.tijd >= LOS_VANAF * DUUR) return noten;
    if (uit.los && (!beste || uit.tijd > beste.tijd)) beste = { noten, tijd: uit.tijd };
  }
  if (beste) return beste.noten;
  // Vangnet (praktisch onbereikbaar): de laatste acht noten zijn knie, knie, anders, knie, knie, anders, knie, knie.
  const banen = tijden.map(() => ander());
  for (let i = 1; i < banen.length; i += 1) while (drieOpRij(banen, i)) banen[i] = ander();
  const n = banen.length;
  [0, 1, 3, 4, 6, 7].forEach((k) => { if (n - 8 + k >= 0) banen[n - 8 + k] = KNIE_BAAN; });
  return maak(banen);
}

/** Nieuwe klem. knie = Pino draagt kniebeschermers (anders mislukt knee on belly altijd). */
export function maakKlem({ knie = false, rnd = Math.random } = {}) {
  return { noten: maakPatroon(rnd), knie, vrij: 0, raak: 0, gemist: 0, misdruk: 0, mislukt: 0, los: false };
}

function zetVrij(k, verschil) {
  k.vrij = Math.max(0, Math.min(VOL, k.vrij + verschil));
  if (k.vrij >= VOL) k.los = true;
}

/**
 * Pino drukt op een baan. Geeft terug:
 *   { soort: 'raak', noot }  de move lukt;
 *   { soort: 'knie', noot }  op tijd, maar knee on belly zonder kniebeschermers: de move mislukt (telt als gemist);
 *   { soort: 'mis' }         geen noot in die baan binnen het venster.
 */
export function druk(k, baan, nu) {
  if (k.los) return { soort: 'mis' };
  let beste = null;
  for (const n of k.noten) {
    if (n.status !== 'open' || n.baan !== baan) continue;
    const d = Math.abs(n.tijd - nu);
    if (d <= VENSTER && (!beste || d < Math.abs(beste.tijd - nu))) beste = n;
  }
  if (!beste) {
    k.misdruk += 1;
    zetVrij(k, MISDRUK);
    return { soort: 'mis' };
  }
  if (baan === KNIE_BAAN && !k.knie) {
    beste.status = 'mislukt';
    k.mislukt += 1;
    zetVrij(k, GEMIST);
    return { soort: 'knie', noot: beste };
  }
  beste.status = 'raak';
  k.raak += 1;
  zetVrij(k, -RAAK);
  return { soort: 'raak', noot: beste };
}

/** Elke frame: noten die voorbij zijn, tellen als gemist. Geeft de zojuist gemiste noten terug. */
export function tik(k, nu) {
  const gemist = [];
  if (k.los) return gemist;
  for (const n of k.noten) {
    if (n.status === 'open' && nu - n.tijd > VENSTER) {
      n.status = 'gemist';
      k.gemist += 1;
      zetVrij(k, GEMIST);
      gemist.push(n);
    }
  }
  return gemist;
}

/** De politie is er: de tijd is om en de dief is niet los. */
export function gehaald(k, nu) {
  return !k.los && nu >= DUUR;
}
