// Spel 5 · regels van de nachtmarkt zonder DOM (specs/spel5.md, besluiten 58–67).
// Alles is puur: een ronde is een gewoon object dat in staat.markt.ronde bewaard wordt, en `bied()` geeft een
// nieuwe ronde terug. `rnd` is een functie () → [0, 1) zodat de regels met een vaste reeks te testen zijn.

export const HANDELAARS = ['mai', 'arun', 'siti', 'minh'];
export const NIVEAUS = ['simpel', 'matig', 'moeilijk'];

/** De vier producten, één per ronde, met de laagst haalbare prijs P en het spel waarvoor ze nodig zijn. */
export const PRODUCTEN = [
  { id: 'ketting', p: 240, spel: null, label: 'Ketting met roze steen', symbool: 's5-ketting' },
  { id: 'kniebeschermers', p: 160, spel: 6, label: 'Kniebeschermers', symbool: 's5-kniebeschermers' },
  { id: 'spray', p: 180, spel: 8, label: 'Jungledieren-spray', symbool: 's5-spray' },
  { id: 'schoenen', p: 200, spel: 9, label: 'Sportschoenen', symbool: 's5-schoenen' },
];

/** Wisselkraam: vaste koers per edelsteen (besluit 65). */
export const KOERS = { blauw: 100, groen: 80, geel: 60 };

export const STAP = 5;          // stepper en alle bedragen: veelvouden van 5
export const MAX_NEE = 3;       // daarna beledigd: alleen nog de vraagprijs

export function product(id) {
  return PRODUCTEN.find((p) => p.id === id) || null;
}

/** Het eerstvolgende product dat nog niet gekocht is (vaste volgorde), of null als alles gekocht is. */
export function volgendProduct(producten) {
  return PRODUCTEN.find((p) => !producten.includes(p.id)) || null;
}

/* ---------- toeval ---------- */

function kies(rnd, lijst) {
  return lijst[Math.floor(rnd() * lijst.length) % lijst.length];
}

function schud(rnd, lijst) {
  const uit = [...lijst];
  for (let i = uit.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1)) % (i + 1);
    [uit[i], uit[j]] = [uit[j], uit[i]];
  }
  return uit;
}

/** n verschillende veelvouden van 5 uit [min, max], onderling minstens `afstand` uit elkaar. */
export function kiesVerschillend(rnd, min, max, n, afstand) {
  const kandidaten = [];
  for (let v = min; v <= max; v += STAP) kandidaten.push(v);
  for (let poging = 0; poging < 200; poging++) {
    const uit = schud(rnd, kandidaten).slice(0, n).sort((a, b) => a - b);
    if (uit.every((v, i) => i === 0 || v - uit[i - 1] >= afstand)) return uit;
  }
  // Valt het niet te loten, dan gelijk verdeeld (komt met de huidige constanten niet voor).
  return Array.from({ length: n }, (_, i) => min + Math.round(((max - min) * i) / Math.max(1, n - 1) / STAP) * STAP);
}

/* ---------- cyclus en ronde ---------- */

/** Altijd eerst Simpel, daarna Matig en Moeilijk in willekeurige volgorde (besluit 58). */
export function nieuweCyclus(rnd = Math.random) {
  return ['simpel', ...schud(rnd, ['matig', 'moeilijk'])];
}

function handelaar(v, g) {
  return { v, g, nee: 0, afgewezen: 0, laatsteBod: null, vrijeNee: false, beledigd: false };
}

/**
 * Een nieuwe ronde voor één product op één niveau (besluit 59/64). P is altijd de laagst haalbare prijs.
 *   simpel:   goedkoopste V = P, de andere drie uit P+15…P+60 (≥ 10 uit elkaar); G = V
 *   matig:    gedeelde V uit P+40…P+50; drie handelaars geven geen korting (G = V), één wel (G = P) maar
 *             twijfelt de eerste keer (besluit 79)
 *   moeilijk: gedeelde V; Mai (linksboven) óf Minh (rechtsonder) is gastheer en krijgt de twee handelaars
 *             naast/boven/onder zich op bezoek; die drie spannen samen met K = P+20/P+25 (besluit 74).
 *             De vierde spant niet samen en zakt tot B = P.
 */
export function maakRonde(productId, niveau, rnd = Math.random) {
  const P = product(productId).p;
  const volgorde = schud(rnd, HANDELAARS);
  const handelaars = {};
  let k = null;
  let samenzweerders = [];
  let gastheer = null;
  let korting = null;
  if (niveau === 'simpel') {
    const prijzen = [P, ...kiesVerschillend(rnd, P + 15, P + 60, 3, 10)];
    volgorde.forEach((id, i) => { handelaars[id] = handelaar(prijzen[i], prijzen[i]); });
  } else {
    const V = P + kies(rnd, [40, 45, 50]);
    if (niveau === 'matig') {
      korting = volgorde[0];
      for (const id of HANDELAARS) handelaars[id] = handelaar(V, id === korting ? P : V);
    } else {
      k = P + kies(rnd, [20, 25]);
      gastheer = kies(rnd, Object.keys(GROEPEN));
      samenzweerders = [gastheer, ...GROEPEN[gastheer]];
      for (const id of HANDELAARS) handelaars[id] = handelaar(V, samenzweerders.includes(id) ? k : P);
    }
  }
  return { product: productId, niveau, k, gastheer, samenzweerders, korting, handelaars };
}

/**
 * Moeilijk: de gastheer en de twee die naar zijn kraam toe lopen (besluit 74). Mai (linksboven) krijgt Siti (onder)
 * en Arun (rechts); Minh (rechtsonder) krijgt Siti (links) en Arun (boven). De vierde blijft erbuiten.
 */
export const GROEPEN = { mai: ['siti', 'arun'], minh: ['siti', 'arun'] };

/** Spant handelaar id in deze ronde samen? (Oudere bewaarde rondes hadden één buitenstaander en geen lijst.) */
export function spantSamen(ronde, id) {
  if (ronde.niveau !== 'moeilijk') return false;
  if (Array.isArray(ronde.samenzweerders)) return ronde.samenzweerders.includes(id);
  return id !== ronde.buitenstaander;
}

/** De laagste prijs die in deze ronde te halen was (= P van het product). */
export function laagstePrijs(ronde) {
  return product(ronde.product).p;
}

/** Hoogste bod dat Pino kan doen: de vraagprijs, maar nooit meer dan ze heeft (afgerond op 5). */
export function maxBod(h, geld) {
  return Math.max(0, Math.floor(Math.min(h.v, geld) / STAP) * STAP);
}

/** Startbod in het onderhandelscherm: het laatste bod, anders de vraagprijs (besluit 76); nooit meer dan het geld. */
export function startBod(h, geld) {
  const max = maxBod(h, geld);
  if (h.beledigd) return max;
  const basis = h.laatsteBod ?? h.v;
  return Math.max(Math.min(STAP, max), Math.min(basis, max));
}

/**
 * Stemming van een handelaar (besluit 77): blij zolang er niets is afgewezen, verdrietig na het eerste afgewezen
 * lagere bod, boos vanaf het tweede (en als hij beledigd is). In Matig twijfelt de handelaar die korting geeft de
 * eerste keer dat Pino genoeg biedt (besluit 79). Het gezicht van de handelaar volgt de stemming.
 */
export function stemmingVan(h) {
  if (!h) return 'blij';
  if (h.beledigd) return 'boos';
  if (h.twijfelt) return 'twijfel';
  const n = h.afgewezen || 0;
  return n === 0 ? 'blij' : n === 1 ? 'verdrietig' : 'boos';
}

/**
 * Pino biedt `bod` bij handelaar `id`. Geeft { ja, stemming, ronde } terug; `ronde` is een nieuwe kopie.
 * stemming: 'blij' (deal) | 'twijfel' (Matig, de eerste keer genoeg geboden bij wie korting geeft) | 'verdrietig' (eerste afgewezen bod) | 'boos' (daarna, of beledigd).
 */
export function bied(ronde, id, bod) {
  const nieuw = { ...ronde, handelaars: { ...ronde.handelaars } };
  const h = { ...ronde.handelaars[id] };
  nieuw.handelaars[id] = h;
  const vorigeBod = h.laatsteBod;
  const vorigeVrij = h.vrijeNee;
  h.laatsteBod = bod;
  h.vrijeNee = false;

  // Elk afgewezen bod maakt hem verdrietiger (ook de nee die niet meetelt), behalve als hij twijfelt;
  // alleen getelde nee's maken hem beledigd.
  const nee = (telt = true, twijfel = false) => {
    h.twijfelt = twijfel;
    if (!twijfel) h.afgewezen = (h.afgewezen || 0) + 1;
    if (telt) {
      h.nee += 1;
      if (h.nee >= MAX_NEE) h.beledigd = true;
    }
    return { ja: false, stemming: stemmingVan(h), ronde: nieuw };
  };

  // Beledigd: alleen de vraagprijs is nog goed.
  if (h.beledigd) return bod >= h.v ? { ja: true, stemming: 'blij', ronde: nieuw } : nee(false);

  // Moeilijk, wie niet samenspant: tussen B en K eerst nee (telt niet), hetzelfde bod direct daarna ja (besluit 61/73).
  if (ronde.niveau === 'moeilijk' && !spantSamen(ronde, id)) {
    if (bod >= ronde.k) return { ja: true, stemming: 'blij', ronde: nieuw };
    if (bod >= h.g) {
      if (vorigeVrij && vorigeBod === bod) return { ja: true, stemming: 'blij', ronde: nieuw };
      h.vrijeNee = true;
      return nee(false);
    }
    return nee();
  }

  // Matig, de handelaar die korting geeft: een bod tussen zijn grens en de vraagprijs laat hem de eerste keer
  // twijfelen (nee, telt niet mee); daarna gaat hij akkoord (besluit 79).
  if (ronde.niveau === 'matig' && (ronde.korting ? id === ronde.korting : h.g < h.v) && bod >= h.g && bod < h.v) {
    if (h.getwijfeld) return { ja: true, stemming: 'blij', ronde: nieuw };
    h.getwijfeld = true;
    return nee(false, true);
  }

  if (bod >= h.g) return { ja: true, stemming: 'blij', ronde: nieuw };
  return nee();
}

/* ---------- productenalbum (besluit 67) ---------- */

/**
 * Toestand van elk kaartje in het album:
 *   'gekocht' | 'beurt' (marktknop) | 'wacht' (spel open, eerder product nog niet gekocht) | 'dicht' (spel nog dicht)
 * `isOpen(dag)` zegt of het deurtje van een spel open is.
 */
export function albumToestand(producten, isOpen) {
  const volgende = volgendProduct(producten);
  return PRODUCTEN.map((p) => {
    if (producten.includes(p.id)) return { product: p, toestand: 'gekocht' };
    const open = p.spel === null || isOpen(p.spel);
    if (!open) return { product: p, toestand: 'dicht' };
    return { product: p, toestand: volgende && volgende.id === p.id ? 'beurt' : 'wacht' };
  });
}

/** Kan er nu een ronde gespeeld worden? Geeft het product terug, of null. */
export function beschikbaarProduct(producten, isOpen) {
  const rij = albumToestand(producten, isOpen).find((r) => r.toestand === 'beurt');
  return rij ? rij.product : null;
}
