// Spelstaat: één sleutel in localStorage, altijd in try/catch (privémodus kan storage weigeren).
// Velden volgen design/economie-en-spelstaat.md. Bij ontbrekende of kapotte storage draait alles
// verder op een staat in het geheugen; de app blijft dan speelbaar binnen één sessie.

const SLEUTEL = 'pino-advent';
const VERSIE = 2;

// Beginwaarden van de behoeften (besluit 164). Met de beloningen per dag uit data/kalender.json komt na
// alle tien spellen elke behoefte precies op 100 en elke vaardigheid op 10.
export const START_BEHOEFTEN = { verjaardag: 0, gansjes: 30, lammetjes: 30, snoepjes: 20, jiujitsu: 45, bordspellen: 20, reizen: 10, sieraden: 15 };
const START_VAARDIGHEDEN = { koken: 0, mechanica: 0, charisma: 0, lichaam: 0, logica: 0, creativiteit: 0 };

const abonnees = new Set();
let huidige = null;
let storageWerkt = true;
let beloningen = null;            // { [dag]: { vaardigheden, behoeften } }, gezet door app.js na het laden van kalender.json

export function legeStaat() {
  return {
    versie: VERSIE,
    deurtjes: {},                 // { "1": "open" | "gespeeld" }  (dicht = niet aanwezig)
    briefjesGelezen: [],
    tegels: {},                   // { "groen-vlinder": 2, ... }  (spel 1 → spel 2)
    edelstenen: { groen: 0, blauw: 0, rood: 0 },   // spel 2 → spel 3 (besluit 192)
    tuin: null,                   // spel 2, onaffe tocht: { velden, huidig, gelegd, pino, weg, werker, edelstenen } (spellen/hex.js)
    karakters: [],                // spel 3: gekochte kaarten ("lam" | "gansje" | "meisje" | "biggetje"), blijven bewaard
    familie: null,                // "nguyen" | "tan" | "somchai": de eerste complete familie (spel 3 → spel 4)
    fotos: [],                    // spel 4: families die al gefotografeerd zijn ("tan" | "nguyen" | "somchai")
    geld: 0,                      // spel 4 → spel 5 → spel 6; vanaf ronde 2 ook uit de wisselkraam (spel 2 → 5)
    producten: [],                // spel 5: 'ketting' | 'kniebeschermers' | 'spray' | 'schoenen' (→ spel 6, 8, 9)
    markt: { cyclus: null, stap: 0, ronde: null },   // spel 5: niveaucyclus en de lopende ronde (besluit 58)
    werkers: { 2: false, 3: false, 4: false, 5: false, 6: false },   // spel 7
    levels: { gehaald: [], actief: 1 },            // spel 8
    vaardigheden: { ...START_VAARDIGHEDEN },
    behoeften: { ...START_BEHOEFTEN },
    scores: {},                   // per spel een klein object, bv. { "1": { onderbroken: 7 } }
    telefoonGezien: 0,            // laatste dag waarop de telefoon-notificatie is getoond
    kamer: { gezien: [] },        // Pino's kamer: voorwerp-id's die bij het laatste bezoek zichtbaar waren (besluit 205)
  };
}

function migreer(data) {
  if (!data || typeof data !== 'object') return legeStaat();
  // Voeg ontbrekende velden toe zodat oudere staat blijft werken; nieuwe versies zetten hier hun stappen bij.
  const basis = legeStaat();
  const uit = { ...basis, ...data };
  for (const veld of ['edelstenen', 'werkers', 'levels', 'vaardigheden', 'behoeften']) {
    uit[veld] = { ...basis[veld], ...(data[veld] || {}) };
  }
  // Gele edelstenen bestaan niet meer (besluit 192): wat Pino aan geel had, wordt rood.
  if ('geel' in uit.edelstenen) {
    uit.edelstenen.rood = (uit.edelstenen.rood || 0) + (uit.edelstenen.geel || 0);
    delete uit.edelstenen.geel;
  }
  if (!Array.isArray(uit.karakters)) uit.karakters = [];
  if (!Array.isArray(uit.fotos)) uit.fotos = [];
  if (!Array.isArray(uit.producten)) uit.producten = [];
  uit.markt = { ...basis.markt, ...(data.markt && typeof data.markt === 'object' ? data.markt : {}) };
  uit.kamer = { gezien: Array.isArray(data.kamer?.gezien) ? data.kamer.gezien : [] };
  // Spel 2 is herontworpen (besluit 166): een tuin uit het oude 6×14-raster kan niet verder. Wis hem en geef de
  // tegels die erin lagen terug aan de voorraad, zodat er niemand tegels kwijtraakt.
  if (uit.tuin && typeof uit.tuin === 'object' && !Array.isArray(uit.tuin.velden)) {
    uit.tegels = { ...(uit.tegels || {}) };
    for (const type of Object.values(uit.tuin.gelegd || {})) uit.tegels[type] = (uit.tegels[type] || 0) + 1;
    uit.tuin = null;
  }
  // Versie 1 gaf +1 vaardigheid per spel en begon met gansjes/lammetjes/snoepjes op 100: opnieuw berekenen
  // uit de gespeelde deurtjes zodra de beloningstabel er is (besluit 164).
  if (!(data.versie >= 2)) uit._herbereken = true;
  uit.versie = VERSIE;
  return uit;
}

/** Tel een beloning op bij de staat: vaardigheden max 10, behoeften max 100. */
function telOp(s, beloning) {
  if (!beloning) return;
  for (const [naam, n] of Object.entries(beloning.vaardigheden || {})) {
    if (naam in s.vaardigheden) s.vaardigheden[naam] = Math.min(10, s.vaardigheden[naam] + n);
  }
  for (const [naam, n] of Object.entries(beloning.behoeften || {})) {
    if (naam in s.behoeften) s.behoeften[naam] = Math.max(0, Math.min(100, s.behoeften[naam] + n));
  }
}

/** Vaardigheden en behoeften = beginwaarden + de beloningen van alle gespeelde deurtjes. */
function herbereken(s) {
  s.vaardigheden = { ...START_VAARDIGHEDEN };
  s.behoeften = { ...START_BEHOEFTEN };
  for (const [dag, status] of Object.entries(s.deurtjes)) {
    if (status === 'gespeeld') telOp(s, beloningen[dag]);
  }
}

function herberekenIndienNodig() {
  if (!huidige || !huidige._herbereken || !beloningen) return;
  herbereken(huidige);
  delete huidige._herbereken;
  bewaar();
}

/** De beloning per dag uit data/kalender.json (app.js roept dit aan na het laden). */
export function zetBeloningen(dagen) {
  beloningen = {};
  for (const d of dagen) beloningen[d.dag] = d.beloning || null;
  herberekenIndienNodig();
}

function laad() {
  try {
    const ruw = localStorage.getItem(SLEUTEL);
    return ruw ? migreer(JSON.parse(ruw)) : legeStaat();
  } catch {
    storageWerkt = false;
    return legeStaat();
  }
}

function bewaar() {
  try {
    localStorage.setItem(SLEUTEL, JSON.stringify(huidige));
    storageWerkt = true;
  } catch {
    storageWerkt = false;
  }
}

/** Huidige staat (gedeeld object; wijzig via schrijf()). */
export function lees() {
  if (!huidige) { huidige = laad(); herberekenIndienNodig(); }
  return huidige;
}

/** Wijzig de staat met een functie, bewaar en meld het aan abonnees. */
export function schrijf(muteer) {
  const s = lees();
  muteer(s);
  bewaar();
  for (const fn of abonnees) fn(s);
  return s;
}

/** Reageer op wijzigingen; geeft een afmeldfunctie terug. */
export function abonneer(fn) {
  abonnees.add(fn);
  return () => abonnees.delete(fn);
}

/** Alles wissen (ontwikkelaarsschakelaar). */
export function wis() {
  huidige = legeStaat();
  try { localStorage.removeItem(SLEUTEL); } catch { /* negeren */ }
  for (const fn of abonnees) fn(huidige);
}

export function storageBeschikbaar() {
  lees();
  return storageWerkt;
}

/* ---------- hulpjes voor de ketens ---------- */

export function markeerDeur(dag, status) {
  return schrijf((s) => { s.deurtjes[dag] = status; });
}

export function markeerBriefjeGelezen(dag) {
  return schrijf((s) => { if (!s.briefjesGelezen.includes(dag)) s.briefjesGelezen.push(dag); });
}

/** Spel 1: tegel met kleur + figuur van een deken. */
export function voegTegelToe(kleur, figuur, aantal = 1) {
  const id = `${kleur}-${figuur}`;
  return schrijf((s) => { s.tegels[id] = (s.tegels[id] || 0) + aantal; });
}

export function neemTegel(kleur, figuur) {
  const id = `${kleur}-${figuur}`;
  let gelukt = false;
  schrijf((s) => {
    if ((s.tegels[id] || 0) > 0) { s.tegels[id] -= 1; gelukt = true; }
  });
  return gelukt;
}

/* Spel 2: de tuin (jungletocht) blijft bewaard tot het spel af is; de tegels uit spel 1 zijn bewust schaars.
   De vorm van de tuin en de regels staan in spellen/hex.js; hier alleen het bewaren en de voorraad. */

/** Zet een nieuwe tuin als er nog geen (geldige) is. */
export function beginTuin(nieuw) {
  return schrijf((s) => { if (!s.tuin || !Array.isArray(s.tuin.velden)) s.tuin = nieuw; });
}

/** Legt een tegel uit de voorraad op een ringplek van de tuin; Pino gaat erop staan. False als die tegel op is. */
export function legTuinTegel(vak, type) {
  let gelukt = false;
  schrijf((s) => {
    if (!s.tuin || (s.tegels[type] || 0) <= 0) return;
    s.tegels[type] -= 1;
    s.tuin.gelegd[vak] = type;
    s.tuin.pino = vak;
    gelukt = true;
  });
  return gelukt;
}

/** Legt een brug in de jungle: één tegel uit de voorraad en de tuin wordt de (al berekende) nieuwe tuin. */
export function legTuinBrug(nieuweTuin, type) {
  let gelukt = false;
  schrijf((s) => {
    if (!nieuweTuin || (s.tegels[type] || 0) <= 0) return;
    s.tegels[type] -= 1;
    s.tuin = nieuweTuin;
    gelukt = true;
  });
  return gelukt;
}

/** Edelsteen uit een veld waarvan de ring vol ligt: één keer per veld. */
/** Edelstenen per volle ring (besluit 192): Pino kiest ze één voor één, elke kleur mag vaker. */
export const STENEN_PER_RING = 3;

/** Eén edelsteen uit de ring van dit veld. Geeft het aantal dat Pino daarna nog mag kiezen, of -1 als het niet kon. */
export function oogstEdelsteen(veldIndex, kleur) {
  let rest = -1;
  schrijf((s) => {
    const veld = s.tuin && s.tuin.velden[veldIndex];
    if (!veld || veld.geoogst) return;
    veld.gekozen = (veld.gekozen || 0) + 1;
    veld.stenen = [...(veld.stenen || []), kleur];   // de kleuren liggen in de kuiltjes van het midden (besluit 194)
    if (veld.gekozen >= STENEN_PER_RING) veld.geoogst = true;
    s.tuin.edelstenen = (s.tuin.edelstenen || 0) + 1;
    s.edelstenen[kleur] = (s.edelstenen[kleur] || 0) + 1;
    rest = STENEN_PER_RING - veld.gekozen;
  });
  return rest;
}

export function wisTuin() {
  return schrijf((s) => { s.tuin = null; });
}

export function voegEdelsteenToe(kleur, aantal = 1) {
  return schrijf((s) => { s.edelstenen[kleur] = (s.edelstenen[kleur] || 0) + aantal; });
}

export function betaalEdelstenen(prijs) {
  // prijs: { rood: 3 } of { blauw: 4, groen: 3 }
  const s = lees();
  for (const [kleur, n] of Object.entries(prijs)) {
    if ((s.edelstenen[kleur] || 0) < n) return false;
  }
  schrijf((st) => { for (const [kleur, n] of Object.entries(prijs)) st.edelstenen[kleur] -= n; });
  return true;
}

/** Spel 3: koop een karakterkaart; false als hij al gekocht is of de edelstenen niet genoeg zijn. */
export function koopKarakter(id, prijs) {
  let gelukt = false;
  schrijf((s) => {
    if (s.karakters.includes(id)) return;
    for (const [kleur, n] of Object.entries(prijs)) if ((s.edelstenen[kleur] || 0) < n) return;
    for (const [kleur, n] of Object.entries(prijs)) s.edelstenen[kleur] -= n;
    s.karakters.push(id);
    gelukt = true;
  });
  return gelukt;
}

export function zetFamilie(naam) {
  return schrijf((s) => { s.familie = naam; });
}

/** Spel 4: de foto's van deze familie zijn gemaakt; de familie betaalt één keer. Geeft het bedrag terug (0 als al betaald). */
export function markeerFotos(familie, bedrag) {
  let betaald = 0;
  schrijf((s) => {
    if (s.fotos.includes(familie)) return;
    s.fotos.push(familie);
    s.geld = Math.max(0, s.geld + bedrag);
    betaald = bedrag;
  });
  return betaald;
}

export function wijzigGeld(verschil) {
  return schrijf((s) => { s.geld = Math.max(0, s.geld + verschil); });
}

/* Spel 5: de markt (specs/spel5.md). De regels zelf staan in spellen/markt.js. */

/** Bewaar de lopende ronde (en de cyclus), zodat weglopen en terugkomen niets wist (besluit 58). */
export function bewaarMarkt({ cyclus, ronde }) {
  return schrijf((s) => {
    if (cyclus !== undefined) s.markt.cyclus = cyclus;
    if (ronde !== undefined) s.markt.ronde = ronde;
  });
}

/** Wisselkraam: één edelsteen tegen een vaste koers (besluit 65). Geeft het bedrag terug (0 als de steen op is). */
export function wisselEdelsteen(kleur, bedrag) {
  let gekregen = 0;
  schrijf((s) => {
    if ((s.edelstenen[kleur] || 0) <= 0) return;
    s.edelstenen[kleur] -= 1;
    s.geld += bedrag;
    gekregen = bedrag;
  });
  return gekregen;
}

/**
 * Deal: het product is gekocht voor `bod`. De cyclus gaat een stap verder (na drie rondes een nieuwe cyclus)
 * en de ronde is voorbij. De behoefte "sieraden" vult zich via de beloning van spel 5: de eerste afronding
 * daarvan is altijd de ketting (besluit 68 en 164).
 */
export function koopProduct({ product, bod, laagste }) {
  return schrijf((s) => {
    if (!s.producten.includes(product)) s.producten.push(product);
    s.geld = Math.max(0, s.geld - bod);
    s.scores[5] = { ...(s.scores[5] || {}), [product]: { betaald: bod, laagste } };
    s.markt.stap += 1;
    if (s.markt.stap >= 3) { s.markt.cyclus = null; s.markt.stap = 0; }
    s.markt.ronde = null;
  });
}

/** Pino's kamer: wat er nu staat, is gezien (de glinster-ster op de kamerknop gaat uit; besluit 205). */
export function markeerKamerGezien(ids) {
  return schrijf((s) => { s.kamer = { gezien: [...ids] }; });
}

export function markeerWerkerGevonden(spel) {
  return schrijf((s) => { s.werkers[spel] = true; });
}

export function markeerLevelGehaald(level) {
  return schrijf((s) => {
    if (!s.levels.gehaald.includes(level)) s.levels.gehaald.push(level);
    s.levels.actief = Math.max(s.levels.actief, Math.min(5, level + 1));
  });
}

/**
 * Elk afgerond spel: de beloning van die dag (vaardigheden en behoeften, uit data/kalender.json), alleen bij
 * de eerste afronding (besluit 9 en 164). Score wordt altijd bijgewerkt. Geeft terug of dit de eerste keer was.
 */
export function rondSpelAf(dag, { beloning = beloningen?.[dag] ?? null, score = null } = {}) {
  let eersteKeer = false;
  schrijf((s) => {
    eersteKeer = s.deurtjes[dag] !== 'gespeeld';
    s.deurtjes[dag] = 'gespeeld';
    if (eersteKeer) telOp(s, beloning);
    if (score) s.scores[dag] = { ...(s.scores[dag] || {}), ...score };
  });
  return eersteKeer;
}

/** Ontwikkelaarsschakelaar (?vul=1): voorraad voor alle ketens, zodat elk spel los te testen is. */
export function vulTestStaat() {
  return schrijf((s) => {
    for (const kleur of ['groen', 'geel', 'blauw']) {
      for (const figuur of ['vlinder', 'boom', 'vogel']) s.tegels[`${kleur}-${figuur}`] = 3;
    }
    s.edelstenen = { groen: 6, blauw: 5, rood: 6 };   // precies genoeg voor alle vier de kaarten in spel 3
    s.familie = s.familie || 'tan';
    // Familie Tan echt compleet maken (spel 4 kijkt naar de gekochte kaarten).
    if (s.familie === 'tan' && !s.karakters.includes('biggetje')) s.karakters.push('biggetje');
    s.geld = Math.max(s.geld, 240);   // precies genoeg voor de ketting in ronde 1 van spel 5 (besluit 64)
    s.levels = { gehaald: [1, 2], actief: 3 };
  });
}

export function vulBehoefte(naam, verschil) {
  return schrijf((s) => {
    s.behoeften[naam] = Math.max(0, Math.min(100, (s.behoeften[naam] || 0) + verschil));
  });
}
