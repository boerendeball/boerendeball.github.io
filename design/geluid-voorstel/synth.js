// Proefje voor specs/onderzoek-muziek.md: alle muziek en effecten in code met de Web Audio API.
// Geen audiobestanden, geen packages. Alle melodieën zijn eigen composities voor dit proefje.
//
// API (dezelfde vorm als het voorgestelde advent/js/geluid.js):
//   ontgrendel()             AudioContext maken/hervatten; alleen vanuit een tik of toets aanroepen
//   speel(naam)              geluidseffect afspelen (zie EFFECTEN)
//   muziek(naam | null)      thema starten (zie THEMAS) of stoppen, met korte fade
//   zetAan(bool), isAan()    alles aan/uit; bewaard in localStorage (in try/catch)
//   zetVolume(0..1), zetDucking(bool), zetTempo(factor)

const SLEUTEL = 'pino-geluid-proef';

const instelling = { aan: true, volume: 0.8, ducking: true, tempo: 1 };
try {
  const opgeslagen = JSON.parse(localStorage.getItem(SLEUTEL) || 'null');
  if (opgeslagen && typeof opgeslagen === 'object') {
    if (typeof opgeslagen.aan === 'boolean') instelling.aan = opgeslagen.aan;
    if (typeof opgeslagen.volume === 'number') instelling.volume = Math.min(1, Math.max(0, opgeslagen.volume));
  }
} catch { /* privémodus of kapotte waarde: standaard houden */ }

function bewaar() {
  try { localStorage.setItem(SLEUTEL, JSON.stringify({ aan: instelling.aan, volume: instelling.volume })); } catch { /* negeren */ }
}

let ctx = null;
let master = null;
let duck = null;       // muziek → duck → muziekBus: hier wordt de muziek zachter gezet bij effecten
let muziekBus = null;
let effectBus = null;
let ruis = null;
let speelt = null;     // lopend thema

// ---------------------------------------------------------------- basis

const NOOT = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };

/** 'A4' → 440 */
export function hz(naam) {
  const m = /^([A-G][#b]?)(\d)$/.exec(naam);
  if (!m) throw new Error(`Onbekende noot ${naam}`);
  const midi = NOOT[m[1]] + (Number(m[2]) + 1) * 12;
  return 440 * 2 ** ((midi - 69) / 12);
}

export function ontgrendel() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 12; comp.ratio.value = 4;
    comp.attack.value = 0.003; comp.release.value = 0.2;
    master = ctx.createGain();
    master.gain.value = instelling.volume;
    duck = ctx.createGain();
    muziekBus = ctx.createGain(); muziekBus.gain.value = 0.5;
    effectBus = ctx.createGain(); effectBus.gain.value = 0.9;
    duck.connect(muziekBus);
    muziekBus.connect(master);
    effectBus.connect(master);
    master.connect(comp);
    comp.connect(ctx.destination);
    ruis = maakRuis(2);
    // Verborgen tab: alles stil (spaart batterij, en de rAF-lus van de spellen staat dan ook stil).
    document.addEventListener('visibilitychange', () => {
      if (!ctx) return;
      if (document.hidden) ctx.suspend();
      else if (instelling.aan) ctx.resume();
    });
  }
  // 'suspended' (autoplay) of 'interrupted' (iOS na een telefoontje): hervatten mag alleen na een tik.
  if (instelling.aan && ctx.state !== 'running') ctx.resume();
  return ctx;
}

function maakRuis(sec) {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * sec), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** Klokvormige omhullende: snel op, exponentieel uit. */
function omhul(g, t, a, piek, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, piek), t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

/** Eén oscillator met omhullende. */
function toon(doel, t, { f, type = 'sine', a = 0.005, d = 0.3, vol = 0.3, naar = null, glij = null, detune = 0, filter = null }) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (naar) o.frequency.exponentialRampToValueAtTime(naar, t + (glij ?? a + d));
  if (detune) o.detune.value = detune;
  const g = ctx.createGain();
  omhul(g, t, a, vol, d);
  if (filter) {
    const fl = ctx.createBiquadFilter();
    fl.type = filter.type || 'lowpass';
    fl.frequency.value = filter.f;
    fl.Q.value = filter.q ?? 0.7;
    o.connect(fl); fl.connect(g);
  } else {
    o.connect(g);
  }
  g.connect(doel);
  o.start(t);
  o.stop(t + a + d + 0.05);
  return o;
}

/** Gefilterde ruisstoot (tikjes, shaker, sluiter, botsing, spray). */
function ruisStoot(doel, t, { d = 0.1, vol = 0.3, type = 'bandpass', f = 3000, q = 1, naar = null, a = 0.002 }) {
  const s = ctx.createBufferSource();
  s.buffer = ruis;
  const fl = ctx.createBiquadFilter();
  fl.type = type;
  fl.frequency.setValueAtTime(f, t);
  if (naar) fl.frequency.exponentialRampToValueAtTime(naar, t + a + d);
  fl.Q.value = q;
  const g = ctx.createGain();
  omhul(g, t, a, vol, d);
  s.connect(fl); fl.connect(g); g.connect(doel);
  s.start(t, Math.random() * 0.4);
  s.stop(t + a + d + 0.05);
}

/** Aangehouden toon (orgel, toeter): op, vasthouden, uit. Met lichte vibrato. */
function houd(doel, t, { f, lengte, types = ['square'], mix = [1], vol = 0.1, a = 0.02, r = 0.08, filterF = 2200, vibrato = 0 }) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + a);
  g.gain.setValueAtTime(vol, t + Math.max(a, lengte));
  g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(a, lengte) + r);
  const fl = ctx.createBiquadFilter();
  fl.type = 'lowpass'; fl.frequency.value = filterF;
  fl.connect(g); g.connect(doel);
  let lfo = null;
  if (vibrato) {
    lfo = ctx.createOscillator(); lfo.frequency.value = 5.5;
    const diep = ctx.createGain(); diep.gain.value = vibrato;
    lfo.connect(diep);
    lfo.start(t); lfo.stop(t + lengte + r + 0.05);
    lfo.uit = diep;
  }
  types.forEach((type, i) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f * (i === 0 ? 1 : 2);
    const og = ctx.createGain(); og.gain.value = mix[i] ?? 0.5;
    o.connect(og); og.connect(fl);
    if (lfo) lfo.uit.connect(o.detune);
    o.start(t); o.stop(t + lengte + r + 0.05);
  });
}

// ---------------------------------------------------------------- instrumenten
// Elk instrument: (doel, t, f, lengte in seconden, vel 0..1)

const INSTRUMENT = {
  marimba(d, t, f, _l, v) {
    toon(d, t, { f, a: 0.004, d: 0.5, vol: 0.32 * v });
    toon(d, t, { f: f * 3.99, a: 0.002, d: 0.07, vol: 0.06 * v });
  },
  bel(d, t, f, _l, v) {
    toon(d, t, { f, a: 0.003, d: 1.3, vol: 0.18 * v });
    toon(d, t, { f: f * 2.76, a: 0.002, d: 0.45, vol: 0.05 * v });
    toon(d, t, { f: f * 5.4, a: 0.002, d: 0.18, vol: 0.025 * v });
  },
  epiano(d, t, f, _l, v) {
    toon(d, t, { f, a: 0.01, d: 1.1, vol: 0.13 * v });
    toon(d, t, { f, type: 'triangle', a: 0.01, d: 0.8, vol: 0.04 * v, detune: 7 });
    toon(d, t, { f: f * 2, a: 0.004, d: 0.3, vol: 0.03 * v });
  },
  kalimba(d, t, f, _l, v) {
    toon(d, t, { f, type: 'triangle', a: 0.003, d: 0.4, vol: 0.2 * v });
    toon(d, t, { f: f * 3, a: 0.002, d: 0.04, vol: 0.05 * v });
  },
  speeldoos(d, t, f, _l, v) {
    toon(d, t, { f, a: 0.002, d: 1.6, vol: 0.16 * v });
    toon(d, t, { f: f * 4, a: 0.001, d: 0.22, vol: 0.035 * v });
  },
  chip(d, t, f, l, v) {
    toon(d, t, { f, type: 'square', a: 0.004, d: Math.max(0.12, l * 0.95), vol: 0.07 * v, filter: { f: 2600 } });
  },
  chipBas(d, t, f, l, v) {
    toon(d, t, { f, type: 'triangle', a: 0.004, d: Math.max(0.1, l * 0.9), vol: 0.22 * v });
  },
  bas(d, t, f, _l, v) {
    toon(d, t, { f, a: 0.006, d: 0.55, vol: 0.32 * v });
    toon(d, t, { f, type: 'triangle', a: 0.006, d: 0.25, vol: 0.08 * v });
  },
  orgel(d, t, f, l, v) {
    houd(d, t, { f, lengte: l * 0.92, types: ['square', 'sawtooth'], mix: [0.6, 0.35], vol: 0.06 * v, filterF: 2400, vibrato: 7 });
  },
  gong(d, t, f, _l, v) {
    toon(d, t, { f, a: 0.03, d: 3.2, vol: 0.16 * v });
    toon(d, t, { f: f * 2.32, a: 0.03, d: 1.6, vol: 0.05 * v });
    toon(d, t, { f: f * 4.1, a: 0.02, d: 0.6, vol: 0.02 * v });
  },
  trom(d, t, _f, _l, v) {
    toon(d, t, { f: 140, naar: 45, glij: 0.12, a: 0.002, d: 0.25, vol: 0.45 * v });
  },
  shaker(d, t, _f, _l, v) {
    ruisStoot(d, t, { type: 'highpass', f: 7000, d: 0.05, vol: 0.09 * v });
  },
  hout(d, t, _f, _l, v) {
    toon(d, t, { f: 1050, naar: 900, a: 0.001, d: 0.06, vol: 0.18 * v });
    ruisStoot(d, t, { f: 2500, q: 4, d: 0.03, vol: 0.08 * v });
  },
};

// ---------------------------------------------------------------- thema's
// Een spoor is een reeks stappen (achtsten). 'C5' = noot, 'A3+C4+E4' = akkoord, 'x' = slag, '.' = rust,
// '-' = vorige noot aanhouden. '|' scheidt maten en wordt genegeerd. Kortere sporen herhalen zich.

const herhaal = (s, n) => Array(n).fill(s).join(' | ');
const rust = (n) => Array(n).fill('.').join(' ');

export const THEMAS = {
  kalender: {
    titel: 'Kalender · bossa met marimba',
    uitleg: 'Rustige bossa nova in F: marimba-melodie, zachte elektrische piano, bas, shaker en houtblokje. Eigen interpretatie van "koopmodus-muziek": jazzy en ontspannen, zonder te lijken op een bestaand nummer.',
    bpm: 100,
    sporen: [
      { inst: 'marimba', vol: 1, noten: 'A4 . C5 . E5 - D5 C5 | D5 - F#4 . A4 . C5 . | Bb4 . D5 . F5 - E5 D5 | C5 - - . G4 . Bb4 . | A4 C5 F5 . E5 . C5 . | D5 . C5 . A4 . F#4 . | G4 . Bb4 . D5 . C5 . | E4 . G4 . C5 - . .' },
      { inst: 'epiano', vol: 0.8, noten: herhaal('A3+C4+E4 . . A3+C4+E4 . . A3+C4+E4 . | F#3+A3+C4 . . F#3+A3+C4 . . F#3+A3+C4 . | F3+Bb3+D4 . . F3+Bb3+D4 . . F3+Bb3+D4 . | E3+G3+Bb3 . . E3+G3+Bb3 . . E3+G3+Bb3 .', 2) },
      { inst: 'bas', vol: 0.9, noten: herhaal('F2 . . C3 C3 . . . | D2 . . A2 A2 . . . | G2 . . D3 D3 . . . | C2 . . G2 G2 . . .', 2) },
      { inst: 'shaker', vol: 0.8, noten: '. x . x . x . x' },
      { inst: 'hout', vol: 0.5, noten: 'x . . x . . x . | . . x . x . . .' },
    ],
  },
  speelgoed: {
    titel: 'Kalender (variant) · speelgoed-chiptune',
    uitleg: 'Vrolijk en snel in C: zachte blokgolf, driehoeksbas, trommeltje. Leuk, maar meer "spelcomputer" dan "poppenhuis".',
    bpm: 132,
    sporen: [
      { inst: 'chip', vol: 1, noten: 'C5 E5 G5 E5 C6 - G5 . | A4 C5 F5 C5 A5 - F5 . | G4 B4 D5 G5 F5 E5 D5 . | E5 - C5 - G4 - . . | A4 C5 E5 A5 G5 - E5 . | F5 E5 D5 C5 A4 - C5 . | D5 - G5 - F5 E5 D5 B4 | C5 - - - . . . .' },
      { inst: 'chipBas', vol: 1, noten: 'C3 C4 C3 C4 C3 C4 C3 C4 | F2 F3 F2 F3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3 | C3 C4 C3 C4 C3 C4 C3 C4 | A2 A3 A2 A3 A2 A3 A2 A3 | F2 F3 F2 F3 F2 F3 F2 F3 | G2 G3 G2 G3 G2 G3 G2 G3 | C3 C4 C3 C4 C3 . . .' },
      { inst: 'trom', vol: 0.8, noten: 'x . . . x . . .' },
      { inst: 'shaker', vol: 1, noten: '. x . x . x . x' },
    ],
  },
  speeldoos: {
    titel: 'Spel 1 · speeldoos in de slaapzaal',
    uitleg: 'Wiegeliedje in 3/4 op een speeldoos. Past bij een zaal vol slapende kinderen; in de laatste seconden kan het tempo omhoog.',
    bpm: 92,
    sporen: [
      { inst: 'speeldoos', vol: 1, noten: 'E6 . D6 . C6 . | G5 - - - . . | A5 . C6 . E6 . | D6 - - - . . | E6 . D6 . C6 . | G5 . A5 . B5 . | C6 - - - . . | . . . . G5 .' },
      { inst: 'speeldoos', vol: 0.7, noten: 'C4 . G4 . E5 . | C4 . G4 . E5 . | F3 . C4 . A4 . | G3 . D4 . B4 . | C4 . G4 . E5 . | G3 . D4 . B4 . | C4 . G4 . E5 . | G3 . D4 . B4 .' },
    ],
  },
  tropen: {
    titel: 'Spel 2–8 · pentatonische marimba',
    uitleg: 'Vijftonige toonladder (D–E–F♯–A–B) op marimba en kalimba, houtblokje, af en toe een zachte gong. Een knipoog naar Zuidoost-Azië zonder karikatuur. Voor de nachtmarkt (5, 6): zelfde thema, trager en met bel in plaats van marimba.',
    bpm: 96,
    sporen: [
      { inst: 'marimba', vol: 1, noten: 'A4 . B4 . D5 . E5 . | F#5 - E5 . D5 . B4 . | A4 . F#4 . A4 - - . | E4 . F#4 . A4 . . . | D5 . E5 . F#5 . A5 . | B5 - A5 . F#5 . E5 . | D5 . B4 . A4 . F#4 . | E4 . . . D4 - - .' },
      { inst: 'kalimba', vol: 0.7, noten: 'D4 . A4 . D5 . A4 . | B3 . F#4 . B4 . F#4 .' },
      { inst: 'bas', vol: 0.7, noten: 'D3 . . . . . A2 . | B2 . . . . . F#2 .' },
      { inst: 'hout', vol: 0.45, noten: '. . x . . . x .' },
      { inst: 'gong', vol: 1, noten: 'D2 ' + rust(63) },
    ],
  },
  draaiorgel: {
    titel: 'Spel 9 · draaiorgel-wals in het dorp',
    uitleg: 'Hollandse wals in 3/4 met orgelklank en hoempapa. Hoort bij molen, tulpen en klinkerpad; ook bruikbaar voor de avondstad van spel 10 (fase 1).',
    bpm: 150,
    sporen: [
      { inst: 'orgel', vol: 1, noten: 'G4 . C5 . E5 . | G5 - - . E5 . | F5 . D5 . B4 . | G4 - - - . . | A4 . C5 . F5 . | A5 - - . F5 . | G5 . E5 . C5 . | D5 - - - . .' },
      { inst: 'orgel', vol: 0.55, noten: 'C3 . E4+G4 . E4+G4 . | G2 . E4+G4 . E4+G4 . | G2 . B3+F4 . B3+F4 . | D3 . B3+F4 . B3+F4 . | F2 . A3+C4 . A3+C4 . | C3 . A3+C4 . A3+C4 . | C3 . E4+G4 . E4+G4 . | G2 . B3+F4 . B3+F4 .' },
      { inst: 'trom', vol: 0.6, noten: 'x . . . . .' },
      { inst: 'hout', vol: 0.35, noten: '. . x . x .' },
    ],
  },
};

/** Parseert een spoor naar { stappen: Map(stap → { f: [hz], lengte }), lengte }. */
function parseer(noten) {
  const tokens = noten.replace(/\|/g, ' ').trim().split(/\s+/);
  const stappen = new Map();
  let vorige = null;
  tokens.forEach((tk, i) => {
    if (tk === '.') { vorige = null; return; }
    if (tk === '-') { if (vorige) vorige.lengte += 1; return; }
    const f = tk === 'x' ? [0] : tk.split('+').map(hz);
    vorige = { f, lengte: 1 };
    stappen.set(i, vorige);
  });
  return { stappen, lengte: tokens.length };
}

export function muziek(naam) {
  stopMuziek();
  if (!naam) return;
  const thema = THEMAS[naam];
  if (!thema || !ontgrendel()) return;
  const nu = ctx.currentTime;
  const uit = ctx.createGain();
  uit.gain.setValueAtTime(0.0001, nu);
  uit.gain.exponentialRampToValueAtTime(1, nu + 0.4);
  uit.connect(duck);
  const st = { naam, thema, uit, sporen: thema.sporen.map((s) => ({ ...s, ...parseer(s.noten) })), g: 0, t: nu + 0.1, timer: 0 };
  st.timer = setInterval(() => plan(st), 25);
  plan(st);
  speelt = st;
}

function stopMuziek() {
  if (!speelt) return;
  const st = speelt;
  speelt = null;
  clearInterval(st.timer);
  const nu = ctx.currentTime;
  st.uit.gain.cancelScheduledValues(nu);
  st.uit.gain.setValueAtTime(Math.max(0.0001, st.uit.gain.value), nu);
  st.uit.gain.exponentialRampToValueAtTime(0.0001, nu + 0.35);
  setTimeout(() => st.uit.disconnect(), 3500);   // nagalm (gong, bel) laten uitklinken
}

export function speeltNu() { return speelt?.naam ?? null; }

/** Vooruitplannen ("a tale of two clocks"): elke 25 ms alles inplannen wat in de komende 150 ms valt. */
function plan(st) {
  if (ctx.state !== 'running') return;
  const stapDuur = (60 / (st.thema.bpm * instelling.tempo)) / 2;
  // Liep de klok weg (achtergrond, haperen)? Dan niet alle gemiste noten tegelijk spelen.
  if (st.t < ctx.currentTime - 0.05) st.t = ctx.currentTime + 0.02;
  while (st.t < ctx.currentTime + 0.15) {
    for (const sp of st.sporen) {
      const ev = sp.stappen.get(st.g % sp.lengte);
      if (ev) for (const f of ev.f) INSTRUMENT[sp.inst](st.uit, st.t, f, ev.lengte * stapDuur, sp.vol ?? 1);
    }
    st.g += 1;
    st.t += stapDuur;
  }
}

// ---------------------------------------------------------------- effecten
// Elk effect: (doel, t) → duur in seconden (voor de ducking).

const arpeggio = (d, t, noten, stap, inst = 'marimba', v = 1) => {
  noten.forEach((n, i) => INSTRUMENT[inst](d, t + i * stap, hz(n), stap, v));
  return noten.length * stap + 0.4;
};

export const EFFECTEN = {
  // Kalender
  tik: { groep: 'Kalender', titel: 'Tik (knop)', f(d, t) { toon(d, t, { f: 1400, a: 0.001, d: 0.03, vol: 0.12 }); ruisStoot(d, t, { f: 4000, q: 2, d: 0.015, vol: 0.05 }); return 0.05; } },
  taartOpen: { groep: 'Kalender', titel: 'Taartmenu open', f(d, t) { toon(d, t, { f: 320, naar: 900, a: 0.004, d: 0.09, vol: 0.22 }); INSTRUMENT.marimba(d, t + 0.06, hz('E5'), 0.1, 0.8); return 0.3; } },
  taartKies: { groep: 'Kalender', titel: 'Taartmenu kiezen', f(d, t) { return arpeggio(d, t, ['E5', 'A5'], 0.07); } },
  taartDicht: { groep: 'Kalender', titel: 'Taartmenu annuleren', f(d, t) { return arpeggio(d, t, ['A5', 'E5'], 0.07, 'marimba', 0.7); } },
  deur: { groep: 'Kalender', titel: 'Deurtje open', f(d, t) { INSTRUMENT.hout(d, t, 0, 0, 1); INSTRUMENT.hout(d, t + 0.12, 0, 0, 0.8); return arpeggio(d, t + 0.28, ['C5', 'E5', 'G5', 'C6'], 0.06, 'bel', 1) + 0.3; } },
  slot: { groep: 'Kalender', titel: 'Deurtje dicht (op slot)', f(d, t) { toon(d, t, { f: 180, type: 'square', a: 0.003, d: 0.08, vol: 0.08, filter: { f: 900 } }); toon(d, t + 0.12, { f: 150, type: 'square', a: 0.003, d: 0.1, vol: 0.08, filter: { f: 900 } }); return 0.3; } },
  gans: { groep: 'Kalender', titel: 'Gans: kwak kwak kwaaak', f(d, t) {
    const kwak = (tt, lengte, f) => toon(d, tt, { f, naar: f * 0.8, type: 'sawtooth', a: 0.01, d: lengte, vol: 0.12, filter: { type: 'bandpass', f: 1100, q: 3 } });
    kwak(t, 0.12, 520); kwak(t + 0.2, 0.12, 540); kwak(t + 0.42, 0.35, 560);
    return 0.85;
  } },
  telefoon: { groep: 'Kalender', titel: 'Er wordt gebeld!', f(d, t) {
    // Eigen bel: twee tonen, snel aan/uit gezet, twee keer per beurt.
    for (const start of [0, 1.3]) {
      for (let i = 0; i < 18; i++) {
        const tt = t + start + i * 0.05;
        toon(d, tt, { f: 1320, a: 0.002, d: 0.04, vol: 0.06 });
        toon(d, tt, { f: 1580, a: 0.002, d: 0.04, vol: 0.05 });
      }
    }
    return 2.3;
  } },
  briefje: { groep: 'Kalender', titel: 'Briefje openvouwen', f(d, t) { ruisStoot(d, t, { f: 1500, naar: 4500, q: 0.8, d: 0.18, vol: 0.12 }); ruisStoot(d, t + 0.2, { f: 2500, naar: 6000, q: 0.8, d: 0.14, vol: 0.09 }); return 0.4; } },
  vaardigheid: { groep: 'Kalender', titel: 'Vaardigheid omhoog', f(d, t) { return arpeggio(d, t, ['G5', 'B5', 'D6', 'G6'], 0.08, 'bel', 0.9); } },

  // Spellen
  stap: { groep: 'Spellen', titel: 'Stapje', f(d, t) { ruisStoot(d, t, { type: 'lowpass', f: 700, d: 0.05, vol: 0.12 }); return 0.06; } },
  plop: { groep: 'Spellen', titel: 'Plop (onderbreken, spel 1)', f(d, t) { toon(d, t, { f: 700, naar: 180, a: 0.003, d: 0.12, vol: 0.28 }); return 0.15; } },
  gaap: { groep: 'Spellen', titel: 'Gaap (spel 1)', f(d, t) { toon(d, t, { f: 330, naar: 210, glij: 0.9, type: 'sawtooth', a: 0.15, d: 0.8, vol: 0.09, filter: { type: 'bandpass', f: 800, q: 2 } }); return 1; } },
  tegel: { groep: 'Spellen', titel: 'Tegel leggen (spel 2)', f(d, t) { toon(d, t, { f: 620, naar: 480, a: 0.001, d: 0.07, vol: 0.2 }); ruisStoot(d, t, { f: 1800, q: 2, d: 0.04, vol: 0.12 }); return 0.1; } },
  groei: { groep: 'Spellen', titel: 'Nieuw veld groeit (spel 2)', f(d, t) { return arpeggio(d, t, ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5'], 0.05, 'kalimba'); } },
  glinster: { groep: 'Spellen', titel: 'Glinster (ring vol)', f(d, t) {
    const noten = ['A6', 'F#6', 'B6', 'D7', 'A6', 'E7', 'B6', 'F#7'];
    noten.forEach((n, i) => toon(d, t + i * 0.045 + Math.random() * 0.01, { f: hz(n), a: 0.002, d: 0.25, vol: 0.05 }));
    return 0.6;
  } },
  steenGroen: { groep: 'Spellen', titel: 'Edelsteen groen', f(d, t) { INSTRUMENT.bel(d, t, hz('E6'), 0, 1); INSTRUMENT.bel(d, t + 0.09, hz('B6'), 0, 0.7); return 0.6; } },
  steenBlauw: { groep: 'Spellen', titel: 'Edelsteen blauw', f(d, t) { INSTRUMENT.bel(d, t, hz('F#6'), 0, 1); INSTRUMENT.bel(d, t + 0.09, hz('C#7'), 0, 0.7); return 0.6; } },
  steenRood: { groep: 'Spellen', titel: 'Edelsteen rood', f(d, t) { INSTRUMENT.bel(d, t, hz('D6'), 0, 1); INSTRUMENT.bel(d, t + 0.09, hz('A6'), 0, 0.7); return 0.6; } },
  munt: { groep: 'Spellen', titel: 'Munt', f(d, t) { toon(d, t, { f: 1760, a: 0.002, d: 0.25, vol: 0.12 }); toon(d, t, { f: 1760 * 2.4, a: 0.002, d: 0.08, vol: 0.04 }); toon(d, t + 0.07, { f: 2350, a: 0.002, d: 0.35, vol: 0.1 }); return 0.45; } },
  kassa: { groep: 'Spellen', titel: 'Betalen (munten rinkelen)', f(d, t) {
    for (let i = 0; i < 6; i++) toon(d, t + i * 0.055 + Math.random() * 0.02, { f: 1600 + Math.random() * 900, a: 0.002, d: 0.18, vol: 0.06 });
    return 0.6;
  } },
  sluiter: { groep: 'Spellen', titel: 'Fotosluiter (spel 4)', f(d, t) { ruisStoot(d, t, { f: 3000, q: 1.5, d: 0.025, vol: 0.25 }); ruisStoot(d, t + 0.07, { f: 1800, q: 1.5, d: 0.05, vol: 0.2 }); return 0.15; } },
  goed: { groep: 'Spellen', titel: 'Goed', f(d, t) { return arpeggio(d, t, ['C5', 'E5', 'G5'], 0.07); } },
  fout: { groep: 'Spellen', titel: 'Fout (zacht)', f(d, t) { toon(d, t, { f: hz('E4'), type: 'square', a: 0.01, d: 0.16, vol: 0.06, filter: { f: 1100 } }); toon(d, t + 0.18, { f: hz('C4'), type: 'square', a: 0.01, d: 0.25, vol: 0.06, filter: { f: 900 } }); return 0.45; } },
  toeter: { groep: 'Spellen', titel: 'Toeter (taxi, auto)', f(d, t) {
    houd(d, t, { f: 392, lengte: 0.12, types: ['square', 'square'], mix: [0.5, 0.25], vol: 0.07, filterF: 1800 });
    houd(d, t + 0.18, { f: 392, lengte: 0.22, types: ['square', 'square'], mix: [0.5, 0.25], vol: 0.07, filterF: 1800 });
    return 0.5;
  } },
  whoosh: { groep: 'Spellen', titel: 'Woesj (wisselen, missen)', f(d, t) { ruisStoot(d, t, { f: 400, naar: 3000, q: 2, a: 0.08, d: 0.2, vol: 0.12 }); return 0.3; } },
  spray: { groep: 'Spellen', titel: 'Spray (spel 8)', f(d, t) { ruisStoot(d, t, { type: 'highpass', f: 5000, a: 0.02, d: 0.45, vol: 0.12 }); return 0.5; } },
  boem: { groep: 'Spellen', titel: 'Botsing', f(d, t) { toon(d, t, { f: 110, naar: 40, a: 0.002, d: 0.35, vol: 0.4 }); ruisStoot(d, t, { type: 'lowpass', f: 2500, naar: 300, d: 0.5, vol: 0.3 }); return 0.6; } },
  vang: { groep: 'Spellen', titel: 'Gevangen! (spel 9)', f(d, t) { toon(d, t, { f: 220, naar: 520, a: 0.005, d: 0.18, vol: 0.2, type: 'triangle' }); INSTRUMENT.bel(d, t + 0.12, hz('E6'), 0, 0.6); return 0.5; } },

  // Resultaat en finale
  gewonnen: { groep: 'Resultaat', titel: 'Gewonnen (jingle)', f(d, t) {
    arpeggio(d, t, ['C5', 'E5', 'G5'], 0.1);
    INSTRUMENT.epiano(d, t + 0.32, hz('C4'), 0, 1); INSTRUMENT.epiano(d, t + 0.32, hz('E4'), 0, 1); INSTRUMENT.epiano(d, t + 0.32, hz('G4'), 0, 1);
    INSTRUMENT.marimba(d, t + 0.32, hz('C6'), 0, 1);
    INSTRUMENT.bel(d, t + 0.32, hz('G6'), 0, 0.6);
    INSTRUMENT.shaker(d, t + 0.32, 0, 0, 1);
    return 1.4;
  } },
  helaas: { groep: 'Resultaat', titel: 'Helaas (jingle)', f(d, t) {
    ['G4', 'F#4', 'F4'].forEach((n, i) => houd(d, t + i * 0.28, { f: hz(n), lengte: 0.22, types: ['sawtooth'], vol: 0.06, filterF: 1000, vibrato: 0 }));
    houd(d, t + 0.84, { f: hz('E4'), lengte: 0.6, types: ['sawtooth'], vol: 0.06, filterF: 1000, vibrato: 18 });
    return 1.6;
  } },
  feest: { groep: 'Resultaat', titel: 'Finale: feest (toeter + confetti)', f(d, t) {
    toon(d, t, { f: 300, naar: 700, glij: 0.5, type: 'sawtooth', a: 0.03, d: 0.55, vol: 0.08, filter: { type: 'bandpass', f: 1200, q: 1.5 } });
    for (let i = 0; i < 14; i++) toon(d, t + 0.5 + i * 0.04 + Math.random() * 0.02, { f: 2000 + Math.random() * 2500, a: 0.002, d: 0.15, vol: 0.035 });
    arpeggio(d, t + 0.55, ['F5', 'A5', 'C6', 'F6'], 0.09, 'bel');
    return 1.8;
  } },
};

export function speel(naam) {
  const e = EFFECTEN[naam];
  // Ook als resume() nog loopt (Safari) inplannen: het klinkt zodra de context draait.
  if (!e || !instelling.aan || !ontgrendel()) return;
  const t = ctx.currentTime + 0.01;
  const duur = e.f(effectBus, t);
  if (instelling.ducking && speelt) {
    duck.gain.cancelScheduledValues(t);
    duck.gain.setTargetAtTime(0.35, t, 0.03);
    duck.gain.setTargetAtTime(1, t + duur, 0.2);
  }
}

// ---------------------------------------------------------------- instellingen

export function isAan() { return instelling.aan; }

export function zetAan(aan) {
  instelling.aan = !!aan;
  bewaar();
  if (!ctx) return;
  if (instelling.aan) ctx.resume(); else ctx.suspend();
}

export function zetVolume(v) {
  instelling.volume = Math.min(1, Math.max(0, v));
  bewaar();
  if (master) master.gain.setTargetAtTime(instelling.volume, ctx.currentTime, 0.05);
}
export function volume() { return instelling.volume; }

export function zetDucking(aan) { instelling.ducking = !!aan; }
export function zetTempo(factor) { instelling.tempo = factor; }
