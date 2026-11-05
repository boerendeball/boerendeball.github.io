// Spelstaat: één sleutel in localStorage, altijd in try/catch (privémodus kan storage weigeren).
// Velden volgen design/economie-en-spelstaat.md. Bij ontbrekende of kapotte storage draait alles
// verder op een staat in het geheugen; de app blijft dan speelbaar binnen één sessie.

const SLEUTEL = 'pino-advent';
const VERSIE = 1;

const abonnees = new Set();
let huidige = null;
let storageWerkt = true;

export function legeStaat() {
  return {
    versie: VERSIE,
    deurtjes: {},                 // { "1": "open" | "gespeeld" }  (dicht = niet aanwezig)
    briefjesGelezen: [],
    tegels: {},                   // { "groen-vlinder": 2, ... }  (spel 1 → spel 2)
    edelstenen: { blauw: 0, groen: 0, geel: 0 },   // spel 2 → spel 3
    tuin: null,                   // spel 2, onaf pad: { gelegd: { "3,10": "groen-vogel" }, geoogst: ["2,11"], edelstenen: 1 }
    familie: null,                // "nguyen" | "tan" | "somchai"  (spel 3 → spel 4)
    geld: 0,                      // spel 4 → spel 5 → spel 6
    werkers: { 2: false, 3: false, 4: false, 5: false, 6: false },   // spel 7
    levels: { gehaald: [], actief: 1 },            // spel 8
    vaardigheden: { koken: 0, mechanica: 0, charisma: 0, lichaam: 0, logica: 0, creativiteit: 0 },
    behoeften: { verjaardag: 0, gansjes: 100, lammetjes: 100, snoepjes: 100, jiujitsu: 45, bordspellen: 20, reizen: 10, sieraden: 15 },
    scores: {},                   // per spel een klein object, bv. { "1": { onderbroken: 7 } }
    telefoonGezien: 0,            // laatste dag waarop de telefoon-notificatie is getoond
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
  uit.versie = VERSIE;
  return uit;
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
  if (!huidige) huidige = laad();
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

/* Spel 2: de tuin blijft bewaard tot het pad af is (de tegels uit spel 1 zijn bewust schaars). */

function tuinVan(s) {
  if (!s.tuin || typeof s.tuin !== 'object') s.tuin = { gelegd: {}, geoogst: [], edelstenen: 0 };
  return s.tuin;
}

/** Legt een tegel uit de voorraad op een vak van de tuin; false als die tegel op is. */
export function legTuinTegel(vak, type) {
  let gelukt = false;
  schrijf((s) => {
    if ((s.tegels[type] || 0) <= 0) return;
    s.tegels[type] -= 1;
    tuinVan(s).gelegd[vak] = type;
    gelukt = true;
  });
  return gelukt;
}

/** Edelsteen uit een omringd tuinvak: één keer per vak. */
export function oogstEdelsteen(vak, kleur) {
  let gelukt = false;
  schrijf((s) => {
    const tuin = tuinVan(s);
    if (tuin.geoogst.includes(vak)) return;
    tuin.geoogst.push(vak);
    tuin.edelstenen = (tuin.edelstenen || 0) + 1;
    s.edelstenen[kleur] = (s.edelstenen[kleur] || 0) + 1;
    gelukt = true;
  });
  return gelukt;
}

export function wisTuin() {
  return schrijf((s) => { s.tuin = null; });
}

export function voegEdelsteenToe(kleur, aantal = 1) {
  return schrijf((s) => { s.edelstenen[kleur] = (s.edelstenen[kleur] || 0) + aantal; });
}

export function betaalEdelstenen(prijs) {
  // prijs: { blauw: 1, geel: 1 }
  const s = lees();
  for (const [kleur, n] of Object.entries(prijs)) {
    if ((s.edelstenen[kleur] || 0) < n) return false;
  }
  schrijf((st) => { for (const [kleur, n] of Object.entries(prijs)) st.edelstenen[kleur] -= n; });
  return true;
}

export function zetFamilie(naam) {
  return schrijf((s) => { s.familie = naam; });
}

export function wijzigGeld(verschil) {
  return schrijf((s) => { s.geld = Math.max(0, s.geld + verschil); });
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
 * Elk afgerond spel: +1 vaardigheid (max 10) en +10 % "Verjaardag vieren", alleen bij de eerste afronding
 * van die dag (besluiten.md #9). Score wordt altijd bijgewerkt. Geeft terug of dit de eerste keer was.
 */
export function rondSpelAf(dag, { vaardigheid = null, score = null } = {}) {
  let eersteKeer = false;
  schrijf((s) => {
    eersteKeer = s.deurtjes[dag] !== 'gespeeld';
    s.deurtjes[dag] = 'gespeeld';
    if (eersteKeer) {
      if (vaardigheid && vaardigheid in s.vaardigheden) {
        s.vaardigheden[vaardigheid] = Math.min(10, s.vaardigheden[vaardigheid] + 1);
      }
      s.behoeften.verjaardag = Math.min(100, s.behoeften.verjaardag + 10);
    }
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
    s.edelstenen = { blauw: 3, groen: 3, geel: 3 };
    s.familie = s.familie || 'tan';
    s.geld = Math.max(s.geld, 60);
    s.levels = { gehaald: [1, 2], actief: 3 };
  });
}

export function vulBehoefte(naam, verschil) {
  return schrijf((s) => {
    s.behoeften[naam] = Math.max(0, Math.min(100, (s.behoeften[naam] || 0) + verschil));
  });
}
