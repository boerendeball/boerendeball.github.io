// Spel 10 · Bereik de bevalling — regels en afstelwaarden zonder DOM (specs/spel10.md).
// Fase 1: te voet door de avondstad (stap voor stap). Fase 2: in de auto over de weg (baanwissel per tik).

export const B = 358;
export const H = 640;

/* ---------- fase 1 · te voet ---------- */
export const KOLOMMEN = 9;
export const KOLOM_B = 36;
export const kolomX = (k) => 35 + k * KOLOM_B;      // midden van Pino in kolom k
export const START = { kolom: 4, rij: 0 };
// Alle looprijen zijn even hoog (besluit 155), van de startstoep (rij 0) naar de stoep met het ziekenhuisautootje:
// 25 stappen (besluit 157). De stad is hoger dan het beeld; het beeld schuift mee met Pino (zie camera()).
export const RIJ_SOORT = [
  'stoep', 'berm', 'pad', 'berm', 'wei', 'berm', 'wei', 'berm', 'weg', 'weg', 'berm',
  'wei', 'berm', 'pad', 'berm', 'wei', 'wei', 'berm', 'weg', 'weg', 'berm',
  'pad', 'berm', 'wei', 'berm', 'stoep',
];
export const RIJEN = RIJ_SOORT.length;
export const RIJ_H = 40;
export const STAD_BOVEN = 120;                                    // lucht en grachtenpanden boven de bovenste stoep
export const STAD_ONDER = 40;                                     // stoep onder de startrij
export const STAD_H = STAD_BOVEN + RIJEN * RIJ_H + STAD_ONDER;     // hoogte van de hele stad
export const rijTop = (rij) => STAD_H - STAD_ONDER - (rij + 1) * RIJ_H;   // bovenkant van de band van een rij
export const PINO_IN_BEELD = 450;                                 // zo ver van de bovenrand staat Pino als het beeld meeschuift
export const CAMERA_TEMPO = 7;                                    // per s: hoe vlot het beeld Pino volgt
/** Bovenkant van het beeld (in stad-coördinaten) bij Pino's voetpunt y. */
export const camera = (y) => Math.max(0, Math.min(STAD_H - H, y - PINO_IN_BEELD));
export const RIJ_Y = Array.from({ length: RIJEN }, (_, rij) => rijTop(rij) + RIJ_H - 6);   // voetpunt per rij
export const DOELRIJ = RIJEN - 1;
export const STAP_DUUR = 0.12;          // s per stap
export const PINO_HALF = 10;            // halve breedte van Pino's voeten bij een botsing
export const AMBU = { x: 150, y: rijTop(DOELRIJ) - 2, w: 72, h: 40 };
export const INSTAP_AFSTAND = 45;       // px van het midden van het autootje waarbinnen Pino instapt
export const OMLOOP = B + 72;           // wie aan de ene kant verdwijnt, komt aan de andere kant terug

export const GANS_V = 22;               // px/s (langzaam)
// Ganzen lopen in groepjes: een oude gans (wit) voorop, de jonkies er in een rij achteraan (besluit 159).
export const GANS_ZICHT = 130;          // px: zo ver vooruit ziet een oude gans Pino (op zijn pad of in de rij ernaast)
export const GANS_LOS = 220;            // px: verder weg dan dit raakt hij haar kwijt
export const GANS_REN = 95;             // px/s: een boze gans rent op Pino af
export const GANS_KALM = 0.7;           // s na het kwijtraken loopt hij weer gewoon door
export const KUIKEN_REN = 120;          // px/s: zo hard rennen de jonkies achter een boze gans aan
export const KUIKEN_GAT = [38, 26];     // px tussen de oude gans en het eerste jonkie, en tussen de jonkies
const OUD = { w: 50, h: 42, marge: 12, voet: 34 };    // voet = y van de voeten onder de bovenkant van de rij
const JONG = { w: 30, h: 25, marge: 6, voet: 33 };
export const SCHAAP_V = 30;             // px/s (langzaam, maar vlotter dan de ganzen)
export const SCHAAP_LOOPT = [2.5, 5];   // s lopen tot het weer gaat grazen
export const SCHAAP_GRAAST = [1.5, 3];  // s grazen
export const SCHAAP_AFSTAND = 70;       // px: een schaap wacht als het schaap voor hem dichterbij is
export const AUTO_V = [160, 130];       // px/s (snel): onderste en bovenste rijstrook van de eerste weg
export const AUTO_V2 = [180, 150];      // px/s: de tweede weg
export const BAND_Y = 33;               // y van de wielas in de auto-sprite: de banden rijden midden op de rijstrook (besluit 158)

const AUTO_KLEUR = ['#FF5E5B', '#FFC93C', '#5BC0EB', '#39D353'];
// y = bovenkant van de sprite; marge = wat er links en rechts van de sprite niet meetelt bij een botsing.
// ganzen: groepen = [[x van de oude gans, aantal jonkies], …]
const gans = (rij, v, groepen) => ({ rij, soort: 'gans', v, groepen });
const schaap = (rij, v, xs) => ({ rij, soort: 'schaap', y: rijTop(rij) + 2, v, w: 41, h: 34, marge: 7, xs });
const auto = (rij, v, xs, kleuren) => ({ rij, soort: 'auto', y: rijTop(rij) + RIJ_H / 2 - BAND_Y, v, w: 72, h: 40, marge: 6, xs, kleuren });
export const STROKEN = [
  gans(2, GANS_V, [[250, 4]]),
  schaap(4, -SCHAAP_V, [106, 286]),
  schaap(6, SCHAAP_V, [36, 206]),
  auto(8, -AUTO_V[0], [120, 300], [AUTO_KLEUR[2], AUTO_KLEUR[3]]),
  auto(9, AUTO_V[1], [30, 230], [AUTO_KLEUR[0], AUTO_KLEUR[1]]),
  schaap(11, -SCHAAP_V, [60, 240]),
  gans(13, -GANS_V, [[20, 2], [230, 2]]),
  schaap(15, SCHAAP_V, [10, 190]),
  schaap(16, -SCHAAP_V, [120, 310]),
  auto(18, -AUTO_V2[0], [60, 250], [AUTO_KLEUR[1], AUTO_KLEUR[0]]),
  auto(19, AUTO_V2[1], [10, 200], [AUTO_KLEUR[3], AUTO_KLEUR[2]]),
  gans(21, GANS_V, [[150, 3], [330, 1]]),
  schaap(23, SCHAAP_V, [80, 270]),
];
export const AUTO_KLEUREN = AUTO_KLEUR;

const tussen = ([a, b], rng) => a + rng() * (b - a);

export function maakVerkeer(rng = Math.random) {
  const lijst = [];
  for (const strook of STROKEN) {
    if (strook.soort === 'gans') {
      const top = rijTop(strook.rij);
      const kijkt = Math.sign(strook.v);
      for (const [x, jongen] of strook.groepen) {
        const leider = { strook, soort: 'gans', x, y: top + OUD.voet - OUD.h, w: OUD.w, h: OUD.h, marge: OUD.marge, kijkt, boos: false, kalm: 0 };
        lijst.push(leider);
        let voor = leider;
        for (let i = 0; i < jongen; i += 1) {
          const midden = voor.x + voor.w / 2 - kijkt * KUIKEN_GAT[i === 0 ? 0 : 1];
          const jong = { strook, soort: 'kuiken', x: midden - JONG.w / 2, y: top + JONG.voet - JONG.h, w: JONG.w, h: JONG.h, marge: JONG.marge, kijkt, leider, voor, eerste: i === 0 };
          lijst.push(jong);
          voor = jong;
        }
      }
      continue;
    }
    strook.xs.forEach((x, i) => {
      const e = { strook, soort: strook.soort, x, y: strook.y, w: strook.w, h: strook.h, marge: strook.marge, kleur: strook.kleuren ? strook.kleuren[i % strook.kleuren.length] : null };
      // schapen lopen en grazen om beurten, elk in zijn eigen tempo
      if (strook.soort === 'schaap') { e.graast = false; e.staat = false; e.timer = tussen(SCHAAP_LOOPT, rng) * (0.3 + 0.7 * rng()); }
      lijst.push(e);
    });
  }
  return lijst;
}

/** Loopt een schaap te dicht op het schaap voor hem? (afstand in de looprichting, met omloop) */
function schaapVoor(lijst, e) {
  const richting = Math.sign(e.strook.v);
  return lijst.some((o) => {
    if (o === e || o.strook !== e.strook) return false;
    const d = (((o.x - e.x) * richting) % OMLOOP + OMLOOP) % OMLOOP;
    return d > 0 && d < SCHAAP_AFSTAND;
  });
}

/** Kortste verschil a − b over de omloop (tussen −OMLOOP/2 en +OMLOOP/2). */
const omloopVerschil = (a, b) => ((((a - b) + OMLOOP / 2) % OMLOOP) + OMLOOP) % OMLOOP - OMLOOP / 2;

/**
 * Oude gans: loopt zijn pad af. Ziet hij Pino voor zich (op zijn pad of in de rij ernaast, binnen GANS_ZICHT),
 * dan wordt hij boos en rent hij op haar af; hij blijft op zijn pad. Raakt hij haar kwijt, dan loopt hij na
 * GANS_KALM weer door in zijn eigen richting.
 */
function beweegGans(e, dt, pino) {
  const st = e.strook;
  const midden = e.x + e.w / 2;
  const dichtbij = !!pino && Math.abs(pino.rij - st.rij) <= 1;
  const dx = pino ? pino.x - midden : 0;
  if (!e.boos && dichtbij && midden > 0 && midden < B && dx * e.kijkt > 0 && Math.abs(dx) < GANS_ZICHT) e.boos = true;
  if (!e.boos) { e.x += st.v * dt; return; }
  if (dichtbij && Math.abs(dx) < GANS_LOS) {
    e.kalm = GANS_KALM;
    if (Math.abs(dx) > 3) { e.kijkt = Math.sign(dx); e.x += e.kijkt * Math.min(GANS_REN * dt, Math.abs(dx)); }
  } else {
    e.kalm -= dt;
    if (e.kalm <= 0) { e.boos = false; e.kijkt = Math.sign(st.v); }
  }
}

/** Jonkie: loopt altijd achter zijn voorganger aan, aan de kant waar de oude gans vandaan komt. */
function beweegKuiken(e, dt) {
  const { leider, voor } = e;
  const doel = voor.x + voor.w / 2 - leider.kijkt * KUIKEN_GAT[e.eerste ? 0 : 1];
  const verschil = omloopVerschil(doel, e.x + e.w / 2);
  const tempo = leider.boos ? KUIKEN_REN : Math.abs(e.strook.v) * 2;
  const stap = Math.sign(verschil) * Math.min(Math.abs(verschil), tempo * dt);
  e.x += stap;
  e.loopt = Math.abs(stap) > 0.01;
  e.kijkt = Math.abs(verschil) > 2 ? Math.sign(verschil) : leider.kijkt;
}

/** pino = { rij, x } zolang ze te voet is (voor de ganzen), anders null. */
export function beweegVerkeer(lijst, dt, rng = Math.random, pino = null) {
  for (const e of lijst) {
    if (e.soort === 'gans') beweegGans(e, dt, pino);
    else if (e.soort === 'kuiken') beweegKuiken(e, dt);
    else {
      if (e.soort === 'schaap') {
        e.timer -= dt;
        if (e.timer <= 0) { e.graast = !e.graast; e.timer = tussen(e.graast ? SCHAAP_GRAAST : SCHAAP_LOOPT, rng); }
        e.staat = e.graast || schaapVoor(lijst, e);
        if (e.staat) continue;
      }
      e.x += e.strook.v * dt;
    }
    if (e.x >= B) e.x -= OMLOOP;
    else if (e.x < -72) e.x += OMLOOP;
  }
}

/** Het dier of de auto waar Pino (midden px, op rij) tegenaan staat, of null. */
export function raaktVoet(lijst, rij, px) {
  for (const e of lijst) {
    const st = e.strook;
    if (st.rij !== rij) continue;
    if (px + PINO_HALF > e.x + e.marge && px - PINO_HALF < e.x + e.w - e.marge) return e;
  }
  return null;
}

export function bijAmbu(rij, px) {
  return rij === DOELRIJ && Math.abs(px - (AMBU.x + AMBU.w / 2)) <= INSTAP_AFSTAND;
}

/* ---------- fase 2 · in de auto ---------- */
export const BAAN_X = [124, 240];       // midden van de linker- en rechterstrook
export const AUTO_Y = 366;              // bovenkant van Pino's auto (staat vast tot het laatste stukje naar het huis)
export const AUTO_B = 52;
export const AUTO_H = 88;
export const SNELHEID = 260;            // px/s
export const SNELHEID_REM = 90;         // px/s met de rem in
export const VERSNELLING = 500;         // px/s² optrekken en remmen
export const DUUR = 30;                 // s op volle snelheid (besluit 160)
export const AFSTAND = SNELHEID * DUUR; // px tot het huis
export const WISSEL_DUUR = 0.15;        // s per baanwissel
export const TEGEN_V = 150;             // px/s tegenligger (komt ons tegemoet)
export const SLOOM_V = 100;             // px/s slome auto (zelfde richting)
export const POLITIE_V = 400;           // px/s politie (haalt in, altijd op de rechterstrook)
export const POLITIE_TEGEN = 1.4;       // s na de politie is de tegenligger in beeld: remmen om achter de politie in te voegen
export const POLITIE_WEG = 900;         // px/s² zodra de politie voorbij is, trekt hij weg
export const GANS_AUTO_V = 26;          // px/s ganzen dwars over de weg
export const PAUZE = 0.5;               // s lege weg tussen twee situaties
export const EERSTE_PAUZE = 1;          // s voor de eerste situatie
export const STOP_NIEUW = 1100;         // px voor het huis: daarna komt er niets nieuws meer
export const REM_POLITIE = 2.5;         // s de rem vasthouden → er komt politie van achter
export const ZONE = 520;                // px voor het huis: de besturing gaat uit, de auto rijdt zelf naar het huis
export const STOP_REM = 300;            // px/s² uitrollen bij het huis
export const KRUIP = 30;                // px/s laatste stukje
// De weg eindigt bij het huis, bovenaan het beeld (besluit 161). Het laatste stukje schuift de weg niet meer
// en rijdt de auto zelf omhoog naar het einde van de weg.
export const EINDE_Y = 124;             // y van het einde van de weg als de auto stilstaat
export const HUIS = { x: 131, y: 2, w: 96, h: 120 };    // midden boven de weg; y = bovenkant als de auto stilstaat
export const STOP_Y = 150;              // bovenkant van Pino's auto als hij voor het huis stilstaat
export const OPRIJDEN = AUTO_Y - STOP_Y;                // px die de auto zelf omhoog rijdt
export const SCHUIF_MAX = AFSTAND - OPRIJDEN;           // zo ver schuift de weg
/** Hoe ver de weg geschoven is bij deze afgelegde afstand. */
export const schuif = (afstand) => Math.min(afstand, SCHUIF_MAX);
/** Bovenkant van Pino's auto bij deze afgelegde afstand. */
export const autoY = (afstand) => AUTO_Y - Math.max(0, afstand - SCHUIF_MAX);
/** Midden van Pino's auto: het laatste stukje stuurt hij naar het midden van de weg. */
export const autoX = (afstand, x) => x + ((BAAN_X[0] + BAAN_X[1]) / 2 - x) * Math.max(0, Math.min(1, (afstand - SCHUIF_MAX) / (OPRIJDEN * 0.7)));
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

/** De politie komt van achter en rijdt altijd op de rechterstrook (besluit 162). */
export function maakPolitie() {
  return wagen('politie', 1, H + 10, POLITIE_V);
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
  // politie: van achter op de rechterstrook, en tegelijk een tegenligger die net na het uitwijken bij Pino is.
  // Ze moet dus remmen: dan is de politie eerder voorbij en kan ze achter hem invoegen (besluit 163).
  if (naam === 'politie') return [maakPolitie(), wagen('tegen', 0, -96 - POLITIE_TEGEN * (SNELHEID + TEGEN_V), -TEGEN_V, kies(TEGEN_KLEUR))];
  // ganzen: een oude gans voorop met twee jonkies erachter, in Pino's strook; ze waggelen naar de dichtstbijzijnde berm
  const kant = baanPino === 0 ? -1 : 1;
  return [-36, 0, 36].map((dx, i) => ({
    soort: 'gans', baan: baanPino, x: BAAN_X[baanPino] + dx, y: -44 + (i === 1 ? 8 : 0), w: 36, h: 30,
    eigen: 0, vx: kant * GANS_AUTO_V, kleur: null, alpha: 1, oud: dx === kant * 36,
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
