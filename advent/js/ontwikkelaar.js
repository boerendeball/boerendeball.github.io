// Ontwikkelaarsopties (#/dev, specs/ontwikkelaarsopties.md): alle dev-schakelaars met de hand aan/uit.
// Alleen in devmodus (datum.devModus()). De URL blijft de bron van waarheid: een schakelaar herschrijft
// location.search en herlaadt op #/dev. reset/vul zijn hier knoppen en gaan bij elke wijziging uit de URL.

import { h } from './ui/dom.js';
import { kopbalk } from './ui/kopbalk.js';
import * as staat from './staat.js';
import * as datum from './datum.js';
import { dagInfo } from './kalender.js';
import { ga } from './router.js';
import { NIVEAUS } from './spellen/markt.js';
import { FAMILIES } from './spellen/familie.js';

const SCROLL_SLEUTEL = 'pino-dev-scroll';
const FAMILIENAMEN = { tan: 'Tan', nguyen: 'Nguyễn', somchai: 'Somchai' };
const STATUSPIL = {
  dicht: ['Dicht', 'dev-pil-dicht'],
  open: ['Te spelen', 'dev-pil-open'],
  vandaag: ['Vandaag', 'dev-pil-vandaag'],
  gespeeld: ['Gespeeld', 'dev-pil-gespeeld'],
};

function params() {
  try { return new URLSearchParams(location.search); } catch { return new URLSearchParams(); }
}

/** Zet of wis parameters (null/'' = weg), haalt reset/vul weg en herlaadt op #/dev met dezelfde scrollpositie. */
function pasToe(wijzig, { alles = false } = {}) {
  const p = params();
  if (alles) for (const k of [...p.keys()]) if (k !== 'dev') p.delete(k);
  p.delete('reset');
  p.delete('vul');
  for (const [k, v] of Object.entries(wijzig)) {
    if (v === null || v === undefined || v === '') p.delete(k);
    else p.set(k, String(v));
  }
  try { sessionStorage.setItem(SCROLL_SLEUTEL, String(window.scrollY)); } catch { /* negeren */ }
  const q = p.toString();
  location.replace(`${location.pathname}${q ? `?${q}` : ''}#/dev`);
}

function herstelScroll() {
  let y = null;
  try {
    y = sessionStorage.getItem(SCROLL_SLEUTEL);
    sessionStorage.removeItem(SCROLL_SLEUTEL);
  } catch { /* negeren */ }
  if (y === null) return;
  // Direct (de inhoud staat al in de DOM) en nog eens na het laden van de fonts, die de hoogte kunnen veranderen.
  const naar = () => window.scrollTo(0, Number(y) || 0);
  naar();
  setTimeout(naar, 150);
}

/* ---------- bouwstenen ---------- */

function sectie(titel, kinderen, extraKlasse = '') {
  return h('section', { class: `kaart dev-kaart ${extraKlasse}`.trim() }, [
    h('h2', { class: 'kop dev-kop' }, titel),
    ...kinderen,
  ]);
}

function schakelaar({ label, uitleg = null, aan, bijWijzig, uit = false }) {
  const invoer = h('input', { type: 'checkbox', role: 'switch', class: 'dev-switch', checked: aan, disabled: uit, onchange: (e) => bijWijzig(e.target.checked) });
  return h('label', { class: `dev-rij dev-schakel${uit ? ' dev-uit' : ''}` }, [
    h('span', { class: 'dev-rij-tekst' }, [
      h('span', { class: 'dev-rij-label' }, label),
      uitleg ? h('span', { class: 'dev-rij-uitleg' }, uitleg) : null,
    ]),
    invoer,
  ]);
}

/** Rij keuzeknoppen; waarde null = "Automatisch"/"Echt". */
function keuzes({ opties, gekozen, bijKies, uit = false, klasse = '' }) {
  return h('div', { class: `dev-keuzes ${klasse}`.trim(), role: 'group' }, opties.map(([waarde, tekst]) => {
    const actief = (gekozen ?? null) === waarde;
    return h('button', {
      type: 'button',
      class: `dev-keuze${actief ? ' actief' : ''}`,
      'aria-pressed': actief ? 'true' : 'false',
      disabled: uit,
      onclick: () => { if (!actief) bijKies(waarde); },
    }, tekst);
  }));
}

function melding(tekst, soort = 'groen') {
  return h('p', { class: `dev-melding dev-melding-${soort}`, role: 'status' }, tekst);
}

/* ---------- secties ---------- */

function nuKaart() {
  const p = params();
  const nu = datum.vandaag();
  const dag = datum.dagVanVandaag(nu);
  const dagTekst = dag === 0 ? 'nog niet begonnen' : dag > datum.AANTAL_DAGEN ? 'voorbij' : `dag ${dag}`;
  const actief = [...p.entries()];
  const datumTekst = new Intl.DateTimeFormat('nl-NL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(nu);

  return sectie('Nu', [
    h('p', { class: 'dev-nu' }, [h('strong', {}, datumTekst), ` · ${dagTekst}`]),
    h('p', { class: 'dev-rij-uitleg' }, `${location.host} · opslag ${staat.storageBeschikbaar() ? 'werkt' : 'werkt niet (alleen in het geheugen)'}`),
    h('div', { class: 'dev-chips' }, actief.length
      ? actief.map(([k, v]) => h('span', { class: 'chip' }, `${k}=${v}`))
      : [h('span', { class: 'chip chip-groen' }, 'geen opties aan')]),
    actief.some(([k]) => k !== 'dev')
      ? h('button', { type: 'button', class: 'knop knop-klein dev-knop-wit', onclick: () => pasToe({}, { alles: true }) }, 'Alles uit')
      : null,
  ]);
}

function datumKaart() {
  const p = params();
  const dag = p.get('dag');
  const vast = p.get('datum');
  const dagKeuzes = [[null, 'Echt'], ...Array.from({ length: datum.AANTAL_DAGEN }, (_, i) => [String(i + 1), String(i + 1)])];
  const datumVeld = h('input', {
    type: 'date', id: 'dev-datum', class: 'dev-datum', value: vast || '',
    onchange: (e) => { if (e.target.value) pasToe({ datum: e.target.value, dag: null }); },
  });

  return sectie('Datum en deurtjes', [
    schakelaar({
      label: 'Alle deurtjes open',
      uitleg: 'test=1 · ook nodig voor "Rond af (test)", window.pinoDebug, familie en niveau',
      aan: datum.isTest(),
      bijWijzig: (aan) => pasToe({ test: aan ? '1' : null }),
    }),
    h('div', { class: 'dev-blok' }, [
      h('span', { class: 'dev-rij-label' }, 'Doe alsof het dag … is'),
      h('span', { class: 'dev-rij-uitleg' }, dag ? `dag=${dag} · ${datum.langeDatum(Number(dag))}` : 'echte datum (of de vaste datum hieronder)'),
      keuzes({ opties: dagKeuzes, gekozen: dag, klasse: 'dev-keuzes-dag', bijKies: (w) => pasToe({ dag: w, datum: null }) }),
    ]),
    h('div', { class: 'dev-blok' }, [
      h('label', { class: 'dev-rij-label', for: 'dev-datum' }, 'Vaste datum'),
      h('span', { class: 'dev-rij-uitleg' }, 'datum=jjjj-mm-dd · dag en datum sluiten elkaar uit'),
      h('div', { class: 'dev-datum-rij' }, [
        datumVeld,
        h('button', { type: 'button', class: 'knop knop-klein dev-knop-wit', disabled: !vast, onclick: () => pasToe({ datum: null }) }, 'Wis'),
      ]),
    ]),
  ]);
}

function staatKaart() {
  const p = params();
  const vak = h('div', { class: 'dev-staat' });
  const meldingVak = h('div', {});

  const toonSamenvatting = () => {
    const s = staat.lees();
    const tegels = Object.values(s.tegels).reduce((a, b) => a + b, 0);
    const gespeeld = Object.entries(s.deurtjes).filter(([, v]) => v === 'gespeeld').map(([k]) => k);
    const regels = [
      ['Geld', String(s.geld)],
      ['Edelstenen', `blauw ${s.edelstenen.blauw} · groen ${s.edelstenen.groen} · geel ${s.edelstenen.geel}`],
      ['Tegels', String(tegels)],
      ['Familie', s.familie ? FAMILIENAMEN[s.familie] || s.familie : '–'],
      ['Karakters', s.karakters.join(', ') || '–'],
      ["Foto's", s.fotos.map((f) => FAMILIENAMEN[f] || f).join(', ') || '–'],
      ['Producten', s.producten.join(', ') || '–'],
      ['Gespeeld', gespeeld.length ? gespeeld.join(', ') : '–'],
    ];
    vak.replaceChildren(h('dl', { class: 'dev-dl' }, regels.flatMap(([k, v]) => [h('dt', {}, k), h('dd', {}, v)])));
  };
  toonSamenvatting();
  staatVernieuwen = toonSamenvatting;

  const doe = (tekst, fn) => { fn(); meldingVak.replaceChildren(melding(tekst)); };
  const urlActies = ['reset', 'vul'].filter((k) => p.get(k) === '1');

  return sectie('Spelstaat', [
    urlActies.length ? h('div', { class: 'dev-melding dev-melding-geel' }, [
      h('span', {}, `${urlActies.map((k) => `${k}=1`).join(' en ')} staat in de URL en gaat bij elk herladen opnieuw af.`),
      h('button', { type: 'button', class: 'knop knop-klein dev-knop-wit', onclick: () => pasToe({}) }, 'Uit de URL halen'),
    ]) : null,
    h('div', { class: 'dev-knoppen' }, [
      h('button', { type: 'button', class: 'knop knop-klein knop-groen', onclick: () => doe('Testvoorraad gevuld.', staat.vulTestStaat) }, 'Testvoorraad vullen'),
      h('button', {
        type: 'button', class: 'knop knop-klein',
        onclick: () => doe('De telefoon rinkelt weer op de kalender.', () => staat.schrijf((s) => { s.telefoonGezien = 0; })),
      }, 'Telefoon opnieuw'),
      h('button', {
        type: 'button', class: 'knop knop-klein knop-rood',
        onclick: () => {
          if (!window.confirm('De hele spelstaat wissen? Dit kan niet ongedaan worden.')) return;
          doe('Spelstaat gewist.', staat.wis);
        },
      }, 'Staat wissen'),
    ]),
    meldingVak,
    vak,
    h('a', { href: '#/test', class: 'dev-link' }, 'Ruwe staat en sprites (#/test) →'),
  ]);
}

function spelKaart() {
  const p = params();
  const test = datum.isTest();
  const uitleg = test ? null : 'Werkt alleen met alle deurtjes open';
  const families = FAMILIES.map((f) => f.id).sort((a, b) => ['tan', 'nguyen', 'somchai'].indexOf(a) - ['tan', 'nguyen', 'somchai'].indexOf(b));

  return sectie('Per spel', [
    h('div', { class: `dev-blok${test ? '' : ' dev-uit'}` }, [
      h('span', { class: 'dev-rij-label' }, 'Spel 4 · familie'),
      h('span', { class: 'dev-rij-uitleg' }, uitleg || 'familie=… · anders de eerste complete familie zonder foto\'s'),
      keuzes({
        opties: [[null, 'Automatisch'], ...families.map((id) => [id, FAMILIENAMEN[id] || id])],
        gekozen: p.get('familie'), uit: !test, bijKies: (w) => pasToe({ familie: w }),
      }),
    ]),
    h('div', { class: `dev-blok${test ? '' : ' dev-uit'}` }, [
      h('span', { class: 'dev-rij-label' }, 'Spel 5 · niveau'),
      h('span', { class: 'dev-rij-uitleg' }, uitleg || 'niveau=… · anders volgt de cyclus (besluit 58)'),
      keuzes({
        opties: [[null, 'Automatisch'], ...NIVEAUS.map((n) => [n, n.charAt(0).toUpperCase() + n.slice(1)])],
        gekozen: p.get('niveau'), uit: !test, bijKies: (w) => pasToe({ niveau: w }),
      }),
    ]),
    h('div', { class: `dev-blok${test ? '' : ' dev-uit'}` }, [
      h('span', { class: 'dev-rij-label' }, 'Spel 6 · kniebeschermers'),
      h('span', { class: 'dev-rij-uitleg' }, uitleg || 'knie=0|1 · anders volgens de staat; met een keuze start spel 6 ook zonder ketting'),
      keuzes({
        opties: [[null, 'Uit de staat'], ['1', 'Met'], ['0', 'Zonder']],
        gekozen: p.get('knie'), uit: !test, bijKies: (w) => pasToe({ knie: w }),
      }),
    ]),
    h('div', { class: `dev-blok${test ? '' : ' dev-uit'}` }, [
      h('span', { class: 'dev-rij-label' }, 'Spel 8 · spray'),
      h('span', { class: 'dev-rij-uitleg' }, uitleg || 'spray=0|1 · anders volgens de staat; zonder spray is level 5 niet te halen'),
      keuzes({
        opties: [[null, 'Uit de staat'], ['1', 'Met'], ['0', 'Zonder']],
        gekozen: p.get('spray'), uit: !test, bijKies: (w) => pasToe({ spray: w }),
      }),
    ]),
    h('div', { class: `dev-blok${test ? '' : ' dev-uit'}` }, [
      h('span', { class: 'dev-rij-label' }, 'Spel 8 · level'),
      h('span', { class: 'dev-rij-uitleg' }, uitleg || 'level=1–5 · start meteen op het bord van dat level'),
      keuzes({
        opties: [[null, 'Overzicht'], ...[1, 2, 3, 4, 5].map((n) => [String(n), String(n)])],
        gekozen: p.get('level'), uit: !test, bijKies: (w) => pasToe({ level: w }),
      }),
    ]),
  ]);
}

// Verversen na elke staatswijziging (staat.abonneer in schermOntwikkelaar).
let dagenVernieuwen = () => {};
let staatVernieuwen = () => {};

function snelKaart() {
  const lijst = h('div', { class: 'dev-dagen', role: 'list' });

  const vul = () => {
    const s = staat.lees();
    const nu = datum.vandaag();
    lijst.replaceChildren(...Array.from({ length: datum.AANTAL_DAGEN }, (_, i) => {
      const n = i + 1;
      const info = dagInfo(n);
      const status = datum.deurStatus(n, s, nu);
      const [pilTekst, pilKlasse] = STATUSPIL[status];
      const vinkje = h('input', {
        type: 'checkbox', checked: s.deurtjes[n] === 'gespeeld',
        onchange: (e) => {
          const aan = e.target.checked;
          staat.schrijf((st) => { if (aan) st.deurtjes[n] = 'gespeeld'; else delete st.deurtjes[n]; });
        },
      });
      return h('div', { class: 'dev-dag', role: 'listitem' }, [
        h('div', { class: 'dev-dag-kop' }, [
          h('span', { class: 'dev-dag-titel' }, [h('strong', {}, `Dag ${n}`), ` · ${datum.kortLabel(n).toLowerCase()} · ${info.titel}`]),
          h('span', { class: `pil ${pilKlasse}` }, pilTekst),
        ]),
        h('div', { class: 'dev-dag-knoppen' }, [
          h('button', { type: 'button', class: 'dev-keuze', onclick: () => ga(`/spel/${n}`) }, 'Spel'),
          h('button', { type: 'button', class: 'dev-keuze', onclick: () => ga(`/laden/${n}`) }, 'Laden'),
          h('button', { type: 'button', class: 'dev-keuze', onclick: () => ga(`/deur/${n}`) }, 'Deur'),
          h('label', { class: 'dev-vink' }, [vinkje, 'gespeeld']),
        ]),
      ]);
    }));
  };
  vul();
  dagenVernieuwen = vul;

  return sectie('Snel naar', [
    h('div', { class: 'dev-knoppen' }, [
      h('button', { type: 'button', class: 'knop knop-klein', onclick: () => ga('/') }, 'Kalender'),
      h('button', { type: 'button', class: 'knop knop-klein dev-knop-wit', onclick: () => ga('/test') }, 'Sprite-controle'),
    ]),
    lijst,
  ], 'dev-breed');
}

function urlKaart() {
  const meldingVak = h('div', {});
  return sectie('URL', [
    h('code', { class: 'dev-url' }, location.href),
    h('div', { class: 'dev-knoppen' }, [
      h('button', {
        type: 'button', class: 'knop knop-klein dev-knop-wit',
        onclick: async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            meldingVak.replaceChildren(melding('Gekopieerd.'));
          } catch {
            meldingVak.replaceChildren(melding('Kopiëren lukte niet; selecteer de URL hierboven.', 'geel'));
          }
        },
      }, 'Kopieer'),
    ]),
    meldingVak,
  ], 'dev-breed');
}

/* ---------- scherm ---------- */

export function schermOntwikkelaar({ root }) {
  const opruim = staat.abonneer(() => { staatVernieuwen(); dagenVernieuwen(); });
  root.append(h('div', { class: 'scherm dev-scherm' }, [
    kopbalk({ label: 'ONTWIKKELAAR', titel: 'Ontwikkelaarsopties' }),
    h('div', { class: 'dev-raster' }, [
      nuKaart(),
      datumKaart(),
      staatKaart(),
      spelKaart(),
      snelKaart(),
      urlKaart(),
    ]),
  ]));
  herstelScroll();
  return () => { opruim(); dagenVernieuwen = () => {}; staatVernieuwen = () => {}; };
}
