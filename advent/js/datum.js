// Datumlogica van de kalender: tien deurtjes van 24 november t/m 3 december.
// Testen: ?test=1 opent alle deurtjes; ?dag=5 doet alsof het dag 5 is; ?datum=2025-11-27 zet een vaste datum.

export const AANTAL_DAGEN = 10;

// [maand (1-12), dag] per deurtje 1..10
const DATUMS = [
  [11, 24], [11, 25], [11, 26], [11, 27], [11, 28], [11, 29], [11, 30],
  [12, 1], [12, 2], [12, 3],
];

const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

function zoekParam(naam) {
  try {
    return new URLSearchParams(location.search).get(naam);
  } catch {
    return null;
  }
}

export function isTest() {
  return zoekParam('test') === '1';
}

/**
 * Devmodus (specs/ontwikkelaarsopties.md): lokale host of privé-LAN-adres (npx serve), of ?dev=1.
 * Alleen dan bestaan de pagina #/dev en de knop ernaartoe op de kalender.
 */
export function devModus() {
  if (zoekParam('dev') === '1') return true;
  const host = location.hostname.replace(/^\[|\]$/g, '');
  if (host === 'localhost' || host === '127.0.0.1' || host === '::1') return true;
  if (host.endsWith('.localhost') || host.endsWith('.test')) return true;
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
}

/** Kalenderjaar: het jaar van vandaag. */
export function kalenderJaar(nu = echtNu()) {
  return nu.getFullYear();
}

function echtNu() {
  return new Date();
}

/** "Nu", met testoverschrijving via ?dag= of ?datum=. */
export function vandaag() {
  const dag = Number(zoekParam('dag'));
  if (dag >= 1 && dag <= AANTAL_DAGEN) {
    const d = datumVanDag(dag, kalenderJaar());
    d.setHours(12, 0, 0, 0);
    return d;
  }
  const vast = zoekParam('datum');
  if (vast && /^\d{4}-\d{2}-\d{2}$/.test(vast)) {
    const [j, m, d] = vast.split('-').map(Number);
    return new Date(j, m - 1, d, 12);
  }
  return echtNu();
}

/** Datum (lokale middernacht) van deurtje n. */
export function datumVanDag(n, jaar = kalenderJaar()) {
  const [m, d] = DATUMS[n - 1];
  return new Date(jaar, m - 1, d);
}

/** Welke dag van de kalender is het? 0 = nog niet begonnen, 1..10, 11 = voorbij. */
export function dagVanVandaag(nu = vandaag()) {
  const jaar = nu.getFullYear();
  const start = datumVanDag(1, jaar);
  const vandaagMiddernacht = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());
  if (vandaagMiddernacht < start) return 0;
  const dagNaVerjaardag = new Date(jaar, 11, 4);
  if (vandaagMiddernacht >= dagNaVerjaardag) return AANTAL_DAGEN + 1;
  for (let n = AANTAL_DAGEN; n >= 1; n--) {
    if (vandaagMiddernacht >= datumVanDag(n, jaar)) return n;
  }
  return 0;
}

/** Mag deurtje n open? */
export function deurOpen(n, nu = vandaag()) {
  if (isTest()) return true;
  return dagVanVandaag(nu) >= n;
}

/** Status van deurtje n voor de kalender: 'dicht' | 'open' | 'vandaag' | 'gespeeld'. */
export function deurStatus(n, staat, nu = vandaag()) {
  if (staat.deurtjes[n] === 'gespeeld') return 'gespeeld';
  if (!deurOpen(n, nu)) return 'dicht';
  return dagVanVandaag(nu) === n ? 'vandaag' : 'open';
}

/** Hele dagen tot 3 december (0 op de dag zelf en daarna). */
export function dagenTotVerjaardag(nu = vandaag()) {
  const doel = datumVanDag(AANTAL_DAGEN, nu.getFullYear());
  const vandaagMiddernacht = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());
  const verschil = Math.round((doel - vandaagMiddernacht) / 86400000);
  return Math.max(0, verschil);
}

/** "24 NOV" voor op het deurtje. */
export function kortLabel(n) {
  const [m, d] = DATUMS[n - 1];
  return `${d} ${MAANDEN[m - 1].slice(0, 3).toUpperCase()}`;
}

/** "DAG 1 · 24 NOVEMBER" voor de kopbalk van een spel. */
export function dagLabel(n) {
  const [m, d] = DATUMS[n - 1];
  const extra = n === AANTAL_DAGEN ? ' · JARIG' : '';
  return `DAG ${n} · ${d} ${MAANDEN[m - 1].toUpperCase()}${extra}`;
}

/** "24 november" in lopende tekst. */
export function langeDatum(n) {
  const [m, d] = DATUMS[n - 1];
  return `${d} ${MAANDEN[m - 1]}`;
}
