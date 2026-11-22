// Pino's kamer zonder DOM (specs/kamer.md, besluiten 201–207): welke voorwerpen er in de kamer staan bij een
// gegeven spelstaat, met welk aantal, en de tekst voor de gedachtenwolk. Los te testen.

export const TEGEL_KLEUREN = ['groen', 'geel', 'blauw'];
export const TEGEL_FIGUREN = ['vlinder', 'boom', 'vogel'];
export const STEEN_KLEUREN = ['groen', 'blauw', 'rood'];
export const FAMILIES = ['tan', 'nguyen', 'somchai'];
export const PRODUCTEN = ['ketting', 'kniebeschermers', 'spray', 'schoenen'];

/** Aandenken per gespeeld spel (besluit 203): voorwerp-id's die verschijnen zodra deurtje n gespeeld is. */
const AANDENKEN = { 1: ['nachtlamp'], 2: ['boeddha'], 3: ['huisje'], 4: ['camera'], 5: ['lampion'], 6: ['gi'], 7: ['loep'], 9: ['stetho'], 10: ['taart', 'ballonnen', 'slinger'] };

/**
 * Alle voorwerpen die nu in de kamer staan, als lijst { id, soort, aantal?, kleur?, figuur?, familie? }.
 * `soort` is de sleutel in kamer.json. `status(n)` geeft de deurstatus ('dicht' | 'open' | 'vandaag' | 'gespeeld').
 * Niets wordt getekend wat er nog niet is (besluit 205): geen lege plekken.
 */
export function zichtbareVoorwerpen(s, status) {
  const uit = [];
  const gespeeld = (n) => s.deurtjes?.[n] === 'gespeeld';
  const voeg = (id, soort = id, extra = {}) => uit.push({ id, soort, ...extra });

  for (const [n, ids] of Object.entries(AANDENKEN)) {
    if (!gespeeld(Number(n))) continue;
    for (const id of ids) {
      if (id === 'huisje') { if (FAMILIES.includes(s.familie)) voeg(id, id, { familie: s.familie }); }
      else voeg(id);
    }
  }

  // Tegels: per type een stapeltje, zodra er een is (besluit 200/205: na spel 1 mag dat).
  for (const kleur of TEGEL_KLEUREN) {
    for (const figuur of TEGEL_FIGUREN) {
      const n = s.tegels?.[`${kleur}-${figuur}`] || 0;
      if (n > 0) voeg(`tegel-${kleur}-${figuur}`, 'tegel', { aantal: n, kleur, figuur });
    }
  }
  for (const kleur of STEEN_KLEUREN) {
    const n = s.edelstenen?.[kleur] || 0;
    if (n > 0) voeg(`steen-${kleur}`, `steen-${kleur}`, { aantal: n, kleur });
  }
  for (const k of ['lam', 'gansje', 'biggetje', 'meisje']) if (s.karakters?.includes(k)) voeg(k);
  for (const f of FAMILIES) if (s.fotos?.includes(f)) voeg(`foto-${f}`, 'foto', { familie: f });
  if ((s.geld || 0) > 0) voeg('spaarvarken', 'spaarvarken', { aantal: s.geld });
  for (const p of PRODUCTEN) if (s.producten?.includes(p)) voeg(p);

  // De werker bestaat voor Pino pas als deurtje 7 open is (CLAUDE.md, besluit 205).
  const werkers = Object.values(s.werkers || {}).filter(Boolean).length;
  if (werkers > 0 && status(7) !== 'dicht') voeg('werker', 'werker', { aantal: werkers });

  const levels = (s.levels?.gehaald || []).filter((n) => n >= 1 && n <= 5);
  if (levels.length) voeg('schaakbord', 'schaakbord', { aantal: levels.length, levels: [...levels].sort() });

  return uit;
}

/** Vul {n}, {kleur} en {figuur} in. */
function vul(tekst, waarden) {
  return tekst.replace(/\{(\w+)\}/g, (heel, naam) => (naam in waarden ? String(waarden[naam]) : heel));
}

/** Naam en omschrijving voor de gedachtenwolk (besluit 204). `teksten` is kamer.json. */
export function tekstVoor(voorwerp, teksten) {
  const t = teksten?.voorwerpen?.[voorwerp.soort];
  if (!t) return { naam: voorwerp.soort, tekst: '' };
  const waarden = {
    n: voorwerp.aantal,
    kleur: teksten.kleuren?.[voorwerp.kleur] ?? voorwerp.kleur,
    figuur: teksten.figuren?.[voorwerp.figuur] ?? voorwerp.figuur,
  };
  let tekst = vul(t.tekst, waarden);
  const n = voorwerp.aantal;
  if (n >= 2 && t.aantal) tekst += ` ${vul(t.aantal, waarden)}`;
  else if (n === 1 && t.aantalEen) tekst += ` ${vul(t.aantalEen, waarden)}`;
  return { naam: t.naam, tekst };
}

/** Is er iets wat Pino nog niet in de kamer gezien heeft? (glinster-ster, besluit 205) */
export function heeftNieuws(voorwerpen, gezien = []) {
  const bekend = new Set(gezien);
  return voorwerpen.some((v) => !bekend.has(v.id));
}

/** Testmodus `?kamer=vol`: een volle kamer zonder de echte staat aan te raken. */
export function volleStaat() {
  const tegels = {};
  const aantallen = [3, 1, 2, 2, 3, 1, 1, 2, 3];
  let i = 0;
  for (const k of TEGEL_KLEUREN) for (const f of TEGEL_FIGUREN) tegels[`${k}-${f}`] = aantallen[i++];
  return {
    deurtjes: Object.fromEntries(Array.from({ length: 10 }, (_, j) => [j + 1, 'gespeeld'])),
    tegels,
    edelstenen: { groen: 2, blauw: 1, rood: 3 },
    karakters: ['lam', 'gansje', 'meisje', 'biggetje'],
    familie: 'tan',
    fotos: [...FAMILIES],
    geld: 35,
    producten: [...PRODUCTEN],
    werkers: { 2: true, 3: true, 4: true, 5: true, 6: true },
    levels: { gehaald: [1, 2, 3, 4, 5], actief: 5 },
  };
}
