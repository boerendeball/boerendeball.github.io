// Spel 8 · Check mate — regels zonder DOM (zie specs/spel8.md).
//
// Bord: 8×8, een vak is [kolom, rij] met rij 0 bovenaan. Een level is een kaart van 8 strings:
//   .  leeg vak        ~  rivier (vast)     B  boom (vast)     b  bamboe (vast)
//   R  rots (vast)     S  boomstam (Pino wisselt ermee van plek) T  tempel (doel)
//   P  Pino            D  een dier (één of meer, allemaal hetzelfde stuk)
// Een spelstand is { pino, dieren: [{ pos, verward }], stammen, sprayGebruikt }.
// Een spelstand is onveranderlijk: elke functie die iets verandert, geeft een nieuwe stand terug.
// Het spel (spel8.js) en de oplosser (losOp, ook gebruikt door design/generators/spel8_levels_check.mjs)
// gebruiken dezelfde regels.

export const N = 8;

export const STUKKEN = {
  python: 'pion',
  tijger: 'toren',
  luiaard: 'paard',
  leeuw: 'loper',
  krokodil: 'koningin',
};

/** Pino: één vak recht. */
export const RECHT = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const SCHUIN = [[1, -1], [1, 1], [-1, 1], [-1, -1]];
const ALLE = [...RECHT, ...SCHUIN];
const SPRONGEN = [[1, -2], [2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2]];

export const sleutel = ([c, r]) => `${c},${r}`;
const gelijk = (a, b) => a[0] === b[0] && a[1] === b[1];
const binnen = ([c, r]) => c >= 0 && c < N && r >= 0 && r < N;
const plus = ([c, r], [dc, dr]) => [c + dc, r + dr];
const manhattan = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
const koning = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));

/* ---------- level ---------- */

/**
 * Leest een levelkaart. Geeft de vaste gegevens (bord) en de beginstand terug.
 * @param {{ dier: string, kaart: string[] }} level
 */
export function leesLevel(level) {
  const vast = new Map();   // sleutel → 'boom' | 'bamboe' | 'rots' | 'water'
  const stammen = [];
  let pino = null, tempel = null;
  const dieren = [];
  const SOORT = { '~': 'water', B: 'boom', b: 'bamboe', R: 'rots' };
  level.kaart.forEach((regel, r) => {
    if (regel.length !== N) throw new Error(`Rij ${r} heeft ${regel.length} tekens`);
    [...regel].forEach((t, c) => {
      const v = [c, r];
      if (SOORT[t]) vast.set(sleutel(v), SOORT[t]);
      else if (t === 'S') stammen.push(v);
      else if (t === 'T') tempel = v;
      else if (t === 'P') pino = v;
      else if (t === 'D') dieren.push({ pos: v, verward: 0 });
      else if (t !== '.') throw new Error(`Onbekend teken "${t}"`);
    });
  });
  if (!level.kaart || level.kaart.length !== N) throw new Error('Een kaart heeft 8 rijen');
  if (!pino || !dieren.length || !tempel) throw new Error('Pino, minstens één dier en de tempel zijn verplicht');
  const bord = { dier: level.dier, stuk: STUKKEN[level.dier], vast, tempel };
  const stand = { pino, dieren, stammen: sorteer(stammen), sprayGebruikt: false };
  return { bord, stand };
}

const sorteer = (vakken) => [...vakken].sort((a, b) => a[1] - b[1] || a[0] - b[0]);
const heeftStam = (stand, v) => stand.stammen.some((s) => gelijk(s, v));

const heeftDier = (stand, v, behalve = -1) => stand.dieren.some((d, i) => i !== behalve && gelijk(d.pos, v));

/** Mag dier `i` op dit vak staan (los van Pino)? Andere dieren staan in de weg. */
function vrijVoorDier(bord, stand, v, i) {
  return binnen(v) && !bord.vast.has(sleutel(v)) && !heeftStam(stand, v) && !gelijk(v, bord.tempel) && !heeftDier(stand, v, i);
}

/* ---------- het dier ---------- */

/**
 * Alle vakken waar dier `i` vanaf `van` heen kan. Het vak van Pino hoort erbij als het dier haar kan slaan.
 * `pino` is het vak van Pino (blokkeert glijden; daar stopt het slaan).
 */
export function dierDoelen(bord, stand, van, i, pino = stand.pino) {
  const doelen = [];
  const kan = (v) => vrijVoorDier(bord, stand, v, i);
  switch (bord.stuk) {
    case 'pion': {
      // Eén vak recht vooruit (rij +1, naar Pino's kant); slaan alleen schuin vooruit.
      const voor = plus(van, [0, 1]);
      if (kan(voor) && !gelijk(voor, pino)) doelen.push(voor);
      for (const d of [[-1, 1], [1, 1]]) {
        const v = plus(van, d);
        if (gelijk(v, pino)) doelen.push(v);
      }
      break;
    }
    case 'paard':
      for (const d of SPRONGEN) {
        const v = plus(van, d);
        if (gelijk(v, pino) || kan(v)) doelen.push(v);
      }
      break;
    default: {
      const richtingen = bord.stuk === 'toren' ? RECHT : bord.stuk === 'loper' ? SCHUIN : ALLE;
      for (const d of richtingen) {
        let v = plus(van, d);
        while (binnen(v)) {
          if (gelijk(v, pino)) { doelen.push(v); break; }
          if (!kan(v)) break;
          doelen.push(v);
          v = plus(v, d);
        }
      }
    }
  }
  return doelen;
}

/** Aantal zetten dat het dier vanaf `van` nodig heeft om Pino (die stilstaat) te slaan; Infinity als dat niet kan. */
function zettenTotPino(bord, stand, van, i) {
  if (gelijk(van, stand.pino)) return 0;
  const gezien = new Set([sleutel(van)]);
  let rand = [van];
  for (let d = 1; rand.length && d < 64; d++) {
    const volgende = [];
    for (const v of rand) {
      for (const w of dierDoelen(bord, stand, v, i)) {
        if (gelijk(w, stand.pino)) return d;
        const k = sleutel(w);
        if (!gezien.has(k)) { gezien.add(k); volgende.push(w); }
      }
    }
    rand = volgende;
  }
  return Infinity;
}

/**
 * De zet die dier `i` kiest: Pino slaan als dat kan; anders het vak met de minste eigen zetten tot Pino,
 * dan de kleinste Manhattan-afstand, dan de vaste volgorde. `null` = geen zet mogelijk.
 */
export function kiesDierZet(bord, stand, i) {
  const doelen = dierDoelen(bord, stand, stand.dieren[i].pos, i);
  if (!doelen.length) return null;
  const slaan = doelen.find((v) => gelijk(v, stand.pino));
  if (slaan) return slaan;
  let beste = null, besteD = Infinity, besteM = Infinity;
  for (const v of doelen) {
    const d = zettenTotPino(bord, stand, v, i);
    const m = manhattan(v, stand.pino);
    if (beste === null || d < besteD || (d === besteD && m < besteM)) { beste = v; besteD = d; besteM = m; }
  }
  return beste;
}

/** Hoeveel beurten het dier in de war is na de spray. */
export const VERWARD_BEURTEN = 2;

/** Vaste "willekeur": een getal uit de stand, zodat het spel en de oplosser hetzelfde doen. */
function lot(stand, i, n) {
  const d = stand.dieren[i];
  const tekst = `${sleutel(stand.pino)}|${sleutel(d.pos)}|${stand.stammen.map(sleutel).join(';')}|${d.verward}`;
  let h = 2166136261;
  for (let i = 0; i < tekst.length; i++) h = Math.imul(h ^ tekst.charCodeAt(i), 16777619);
  return (h >>> 0) % n;
}

/**
 * Zet van dier `i` in de war: een willekeurige zet die verder van Pino af gaat (Manhattan) en Pino niet slaat.
 * Is die er niet, dan een zet op gelijke afstand, dan een willekeurige andere zet (nooit slaan); anders blijft het staan.
 */
function verwardeZet(bord, stand, i) {
  const hier = stand.dieren[i].pos;
  const doelen = dierDoelen(bord, stand, hier, i).filter((v) => !gelijk(v, stand.pino));
  if (!doelen.length) return null;
  const nu = manhattan(hier, stand.pino);
  const weg = doelen.filter((v) => manhattan(v, stand.pino) > nu);
  const opzij = doelen.filter((v) => manhattan(v, stand.pino) === nu);
  const keuze = weg.length ? weg : opzij.length ? opzij : doelen;
  return keuze[lot(stand, i, keuze.length)];
}

/**
 * De beurt van de dieren: ze zetten na elkaar (volgorde van de kaart: rij voor rij), elk met de stand na de
 * vorige zet. Een dier in de war (na de spray) loopt VERWARD_BEURTEN beurten een andere kant op dan naar Pino.
 * Geeft { stand, zetten: [{ i, van, naar, verward }], gevangen }; bij gevangen stopt de beurt meteen.
 */
export function zetDieren(bord, stand) {
  let s = stand;
  const zetten = [];
  for (let i = 0; i < s.dieren.length; i++) {
    const dier = s.dieren[i];
    const verward = dier.verward > 0;
    const naar = (verward ? verwardeZet(bord, s, i) : kiesDierZet(bord, s, i)) || dier.pos;
    const dieren = s.dieren.map((d, j) => (j === i ? { pos: naar, verward: verward ? d.verward - 1 : 0 } : d));
    s = { ...s, dieren };
    zetten.push({ i, van: dier.pos, naar, verward });
    if (gelijk(naar, s.pino)) return { stand: s, zetten, gevangen: true };
  }
  return { stand: s, zetten, gevangen: false };
}

/** Staat dit dier op een van de 8 buurvakken van Pino? */
export const naastPino = (stand, d) => koning(stand.pino, d.pos) === 1;

/* ---------- Pino ---------- */

/** Kan Pino sprayen? (een dier op een van de 8 buurvakken, nog niet gesprayd in dit level) */
export function kanSprayen(stand) {
  return !stand.sprayGebruikt && stand.dieren.some((d) => naastPino(stand, d));
}

/**
 * Alle acties van Pino in deze beurt:
 *   { soort: 'stap', naar, richting }  — ook naar het vak van een dier (dan is ze gevangen) en naar de tempel
 *   { soort: 'wissel', stam, naar, richting } — Pino wisselt van plek met een stam recht naast haar (naar = stam)
 *   { soort: 'wissel', dier, naar, richting } — idem met een dier dat in de war is (dier = index)
 *   { soort: 'spray' } — alleen als `heeftSpray` en er een dier naast Pino staat
 */
export function pinoActies(bord, stand, { heeftSpray = false } = {}) {
  const acties = [];
  for (const richting of RECHT) {
    const v = plus(stand.pino, richting);
    if (!binnen(v) || bord.vast.has(sleutel(v))) continue;
    if (heeftStam(stand, v)) {
      // Pino wisselt van plek met de stam: zij staat daarna op het vak van de stam, de stam op haar oude vak.
      acties.push({ soort: 'wissel', stam: v, naar: v, richting });
      continue;
    }
    // Een dier dat in de war is (na de spray), is net als een stam te wisselen.
    const dier = stand.dieren.findIndex((d) => gelijk(d.pos, v) && d.verward > 0);
    if (dier >= 0) {
      acties.push({ soort: 'wissel', dier, naar: v, richting });
      continue;
    }
    acties.push({ soort: 'stap', naar: v, richting });
  }
  if (heeftSpray && kanSprayen(stand)) acties.push({ soort: 'spray' });
  return acties;
}

/**
 * Voert een actie van Pino uit. Geeft { stand, uitkomst } met uitkomst 'gewonnen', 'gevangen' of null.
 */
export function pasToe(bord, stand, actie) {
  switch (actie.soort) {
    case 'stap': {
      const nieuw = { ...stand, pino: actie.naar };
      if (heeftDier(stand, actie.naar)) return { stand: nieuw, uitkomst: 'gevangen' };
      if (gelijk(actie.naar, bord.tempel)) return { stand: nieuw, uitkomst: 'gewonnen' };
      return { stand: nieuw, uitkomst: null };
    }
    case 'wissel': {
      if (actie.dier !== undefined) {
        const dieren = stand.dieren.map((d, i) => (i === actie.dier ? { ...d, pos: stand.pino } : d));
        return { stand: { ...stand, pino: actie.naar, dieren }, uitkomst: null };
      }
      const stammen = sorteer(stand.stammen.map((s) => (gelijk(s, actie.stam) ? stand.pino : s)));
      return { stand: { ...stand, pino: actie.stam, stammen }, uitkomst: null };
    }
    case 'spray': {
      // Alle dieren naast Pino raken in de war.
      const dieren = stand.dieren.map((d) => (naastPino(stand, d) ? { ...d, verward: VERWARD_BEURTEN } : d));
      return { stand: { ...stand, dieren, sprayGebruikt: true }, uitkomst: null };
    }
    default:
      throw new Error(`Onbekende actie ${actie.soort}`);
  }
}

/* ---------- oplosser ---------- */

/**
 * Alle mogelijke beurten van Pino: hooguit één stap, één wissel met een stam en (als ze die heeft) één spray,
 * in elke volgorde.
 * Een beurt heeft minstens één handeling; daarna kan Pino de zandloper drukken.
 * Geeft per beurt { acties, stand, uitkomst } (uitkomst 'gewonnen' of 'gevangen' beëindigt de beurt meteen).
 */
export function* beurten(bord, stand, heeftSpray) {
  function* verder(s, acties, gedaan) {
    for (const actie of pinoActies(bord, s, { heeftSpray: heeftSpray && !gedaan.spray })) {
      if (gedaan[actie.soort]) continue;
      const na = pasToe(bord, s, actie);
      const reeks = [...acties, actie];
      yield { acties: reeks, stand: na.stand, uitkomst: na.uitkomst };
      if (!na.uitkomst) yield* verder(na.stand, reeks, { ...gedaan, [actie.soort]: true });
    }
  }
  yield* verder(stand, [], {});
}

const standSleutel = (s) => `${sleutel(s.pino)}|${s.dieren.map((d) => sleutel(d.pos) + ':' + d.verward).join(';')}|${s.stammen.map(sleutel).join(';')}|${+s.sprayGebruikt}`;

/**
 * Zoekt (BFS) de kortste reeks acties van Pino waarmee ze de tempel haalt zonder gevangen te worden.
 * Geeft { beurten, acties, perBeurt } of null als het level zo niet te halen is.
 */
export function losOp(level, { heeftSpray = false, maxStanden = 500000 } = {}) {
  const { bord, stand } = leesLevel(level);
  const gezien = new Map([[standSleutel(stand), null]]);
  let rand = [{ stand, pad: [] }];
  let aantal = 0;
  while (rand.length) {
    const volgende = [];
    for (const { stand: s, pad } of rand) {
      for (const beurt of beurten(bord, s, heeftSpray)) {
        if (beurt.uitkomst === 'gewonnen') return { beurten: pad.length + 1, acties: [...pad, beurt.acties].flat(), perBeurt: [...pad, beurt.acties] };
        if (beurt.uitkomst === 'gevangen') continue;
        const dier = zetDieren(bord, beurt.stand);
        if (dier.gevangen) continue;
        const k = standSleutel(dier.stand);
        if (gezien.has(k)) continue;
        gezien.set(k, true);
        if (++aantal > maxStanden) return null;
        volgende.push({ stand: dier.stand, pad: [...pad, beurt.acties] });
      }
    }
    rand = volgende;
  }
  return null;
}
