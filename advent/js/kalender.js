// Kalenderschermen: Main/Desktop, taartmenu op een deurtje, Vergrendeld, Open deurtje, briefje, telefoon.

import { h, voeg, hoofdletter } from './ui/dom.js';
import { icoon, BOL_KLEUR, RING_KLEUR } from './ui/iconen.js';
import { toonDialoog } from './ui/overlay.js';
import { toonTaartmenu } from './ui/taartmenu.js';
import { paneelBehoeften } from './ui/behoeften.js';
import { paneelVaardigheden } from './ui/vaardigheden.js';
import { kopbalk } from './ui/kopbalk.js';
import * as staat from './staat.js';
import * as datum from './datum.js';
import { ga } from './router.js';

let data = null;

export function zetKalenderData(d) { data = d; }
export function dagInfo(n) { return data.dagen[n - 1]; }

const isDesktop = () => window.matchMedia('(min-width: 1000px)').matches;

function weekdagDatum(n) {
  const d = datum.datumVanDag(n);
  const weekdag = new Intl.DateTimeFormat('nl-NL', { weekday: 'long' }).format(d);
  return `${hoofdletter(weekdag)} ${datum.langeDatum(n)}`;
}

/* ---------- Main / Desktop ---------- */

export function schermKalender({ root, telefoon = true }) {
  const s = staat.lees();
  const nu = datum.vandaag();
  const vandaagDag = datum.dagVanVandaag(nu);
  const statussen = {};
  for (let n = 1; n <= datum.AANTAL_DAGEN; n++) statussen[n] = datum.deurStatus(n, s, nu);
  const deurtjesOpen = Object.values(statussen).filter((st) => st !== 'dicht').length;
  const gespeeldTotaal = Object.values(statussen).filter((st) => st === 'gespeeld').length;
  const dagen = datum.dagenTotVerjaardag(nu);

  // Vandaag te verdienen vaardigheid (alleen als het deurtje van vandaag nog niet gespeeld is).
  const vandaagInfo = vandaagDag >= 1 && vandaagDag <= 10 ? dagInfo(vandaagDag) : null;
  const vandaagVaardigheid = vandaagInfo && statussen[vandaagDag] === 'vandaag' ? vandaagInfo.vaardigheid : null;

  // Gedachtenwolkje: het icoon van morgen (voor de start: dag 1).
  const morgen = vandaagDag === 0 ? 1 : vandaagDag + 1;
  const morgenInfo = morgen <= 10 ? dagInfo(morgen) : null;

  const kalender = h('div', { class: 'kalender' }, [
    h('div', { class: 'wolk-decor wolk-decor-1', 'aria-hidden': 'true' }),
    h('div', { class: 'wolk-decor wolk-decor-2', 'aria-hidden': 'true' }),

    // Sim-kaart
    h('section', { class: 'kaart sim-kaart', 'aria-label': 'Pino' }, [
      h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px' } }, [
        h('div', { class: 'avatar-wrap' }, [
          morgenInfo ? h('div', { class: 'wolkje', role: 'img', 'aria-label': 'Pino denkt aan morgen' }, [
            h('span', { class: 'wolk-tekst' }, 'Morgen…'),
            h('span', { class: 'wolk-icoon' }, [icoon(morgenInfo.icoon, 30), h('span', { class: 'wolk-vraag' }, '?')]),
          ]) : null,
          morgenInfo ? h('span', { class: 'wolk-stip wolk-stip-1', 'aria-hidden': 'true' }) : null,
          morgenInfo ? h('span', { class: 'wolk-stip wolk-stip-2', 'aria-hidden': 'true' }) : null,
          h('div', { class: 'kop avatar', 'aria-hidden': 'true' }, 'P'),
        ]),
        h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px', flex: '1', minWidth: '0' } }, [
          h('h1', { class: 'kop sim-titel', html: "Pino's verjaardags&shy;kalender" }),
          h('div', { class: 'sim-sub' }, '24 november t/m 3 december'),
        ]),
      ]),
      h('div', { class: 'chips' }, [
        h('span', { class: 'chip' }, 'Verloskundige'),
        h('span', { class: 'chip chip-groen' }, 'Ganzenfluisteraar'),
        h('span', { class: 'chip chip-geel' }, 'Bordspelbaas'),
        h('span', { class: 'chip chip-paars' }, 'Jiujitsu'),
        h('span', { class: 'chip chip-roze chip-desktop' }, 'Zoetekauw'),
        h('span', { class: 'chip chip-desktop' }, 'Wereldreiziger'),
      ]),
    ]),

    paneelBehoeften(s, { dagen, deurtjesOpen, open: true }),

    // Rechterkolom op desktop; op mobiel (display: contents) vallen deze blokken in het raster van de kalender.
    h('div', { class: 'rechts' }, [
      h('div', { class: 'deurkop' }, [
        h('h2', { class: 'kop deurkop-titel', style: { margin: 0 } }, isDesktop() ? 'Kies een deurtje' : 'Deurtjes'),
        h('div', { class: 'deurkop-sub' }, isDesktop() && vandaagDag >= 1 && vandaagDag <= 10 ? `Vandaag: ${weekdagDatum(vandaagDag).toLowerCase()}` : '24 nov – 3 dec'),
      ]),
      h('div', { class: 'deuren', role: 'list' }, Array.from({ length: datum.AANTAL_DAGEN }, (_, i) => maakDeur(i + 1, statussen[i + 1]))),
      h('div', { class: 'kaart kalender-voet' }, [
        h('span', {}, 'Elke dag een nieuw spelletje – gemaakt voor Pino'),
        h('strong', {}, '24 nov – 3 dec'),
      ]),
    ]),

    paneelVaardigheden(s, { vandaagVaardigheid, gespeeldTotaal, open: isDesktop() }),
  ]);
  root.append(kalender);

  // Telefoon: één keer per dag rinkelen als het deurtje van vandaag open is en nog niet gespeeld.
  if (telefoon && vandaagInfo && statussen[vandaagDag] === 'vandaag' && s.telefoonGezien !== vandaagDag) {
    toonTelefoon(vandaagDag);
  }
}

function maakDeur(n, status) {
  const info = dagInfo(n);
  const [dagNr, maand] = datum.kortLabel(n).split(' ');
  const jarig = n === datum.AANTAL_DAGEN;
  const knop = h('button', { type: 'button', class: 'deur', 'data-deur': n, role: 'listitem' });

  if (status === 'dicht') {
    knop.classList.add('deur-dicht');
    if (jarig) knop.classList.add('deur-jarig');
    knop.setAttribute('aria-label', `${datum.langeDatum(n)}${jarig ? ', verjaardag' : ''}, nog gesloten`);
    voeg(knop, [
      h('span', { class: 'kop deur-nr' }, dagNr),
      h('span', { class: 'datum' }, jarig ? `${maand} · JARIG` : maand),
      jarig ? h('span', { class: 'deur-taart' }, [icoon('taart', 30)]) : null,
      h('span', { class: 'deur-slot' }, [icoon('slot', 26)]),
    ]);
  } else {
    knop.classList.add(status === 'vandaag' ? 'deur-vandaag' : 'deur-open');
    if (jarig) knop.classList.add('deur-jarig');
    const statusTekst = status === 'gespeeld' ? 'gespeeld' : status === 'vandaag' ? 'vandaag' : 'open';
    knop.setAttribute('aria-label', `${datum.langeDatum(n)}, ${statusTekst}: ${info.titel}`);
    let pil;
    if (status === 'gespeeld') pil = h('span', { class: 'pil pil-groen' }, 'Gespeeld');
    else if (status === 'vandaag') pil = h('span', { class: 'pil pil-vandaag' }, 'Vandaag!');
    else pil = h('span', { class: 'pil pil-geel' }, 'Te spelen');
    knop.append(
      h('span', { class: 'datum' }, jarig ? `${dagNr} ${maand} · JARIG` : `${dagNr} ${maand}`),
      h('span', { class: 'bol', style: { background: BOL_KLEUR[info.icoon] || '#E3F4FC' } }, [icoon(info.icoon, 40)]),
      pil,
    );
  }
  knop.addEventListener('click', () => openTaartmenu(knop, n, status));
  return knop;
}

/* ---------- taartmenu op een deurtje ---------- */

function openTaartmenu(anker, n, status) {
  const dicht = status === 'dicht';
  toonTaartmenu({
    anker,
    label: `Acties voor deurtje ${datum.langeDatum(n)}`,
    hint: '<strong>Tik op een deurtje</strong> en kies wat Pino gaat doen. Gluren mag, maar de gans houdt de wacht.',
    opties: [
      { richting: 'boven', tekst: 'Open deurtje', icoon: 'deur', klasse: 'taart-optie-groen', actie: () => (dicht ? toonVergrendeld(n) : ga(`/laden/${n}`)) },
      { richting: 'rechts', tekst: 'Gluren…', icoon: 'oog', actie: () => (dicht ? toonVergrendeld(n) : ga(`/deur/${n}`)) },
      { richting: 'onder', tekst: 'Briefje lezen', icoon: 'hart', actie: () => (dicht ? toonVergrendeld(n) : toonBriefje(n)) },
      { richting: 'links', tekst: 'Annuleren', icoon: 'kruis', klasse: 'taart-optie-grijs' },
    ],
  });
}

/* ---------- Vergrendeld ---------- */

export function toonVergrendeld(n) {
  const nu = datum.vandaag();
  const vandaagDag = datum.dagVanVandaag(nu);
  const doel = datum.datumVanDag(n, nu.getFullYear());
  const vandaagMiddernacht = new Date(nu.getFullYear(), nu.getMonth(), nu.getDate());
  const verschil = Math.max(1, Math.round((doel - vandaagMiddernacht) / 86400000));
  const pct = Math.max(8, Math.min(95, 100 - verschil * 22));
  const naarVandaag = vandaagDag >= 1 && vandaagDag <= 10 && vandaagDag !== n;

  const d = toonDialoog({
    label: 'Dit deurtje is nog vergrendeld',
    melding: { icoon: 'slot', kleur: '#FFF1D6', html: '<strong>Actie niet beschikbaar.</strong> Dit deurtje is nog vergrendeld.' },
    inhoud: [
      h('div', { class: 'dialoog-bol', style: { background: '#D9F5DE' } }, [icoon('gans', 88, { label: 'Gans die de weg verspert' })]),
      h('div', { class: 'dialoog-sub', style: { color: 'var(--roze-schaduw)' } }, 'KWAK KWAK KWAAAK!'),
      h('h2', { class: 'kop dialoog-titel' }, 'Nog even wachten, Pino!'),
      h('p', { class: 'dialoog-tekst', html: `Dit deurtje gaat pas open op <strong>${datum.langeDatum(n)}</strong>. De gans laat je er nog niet langs.` }),
      h('div', { class: 'dialoog-vak' }, [
        h('div', { class: 'dialoog-vak-kop' }, [
          h('span', {}, 'Ontgrendelt over'),
          h('span', { class: 'kop dialoog-vak-getal' }, `${verschil} ${verschil === 1 ? 'dag' : 'dagen'}`),
        ]),
        h('span', { class: 'balk balk-groen', 'aria-hidden': 'true' }, [h('span', { style: { width: `${pct}%` } })]),
      ]),
      h('button', { type: 'button', class: 'knop-pil knop-pil-teal', onclick: () => d.sluit() }, 'Oké, ik wacht wel'),
      naarVandaag ? h('button', { type: 'button', class: 'dialoog-link', onclick: () => { d.sluit(); ga(`/deur/${vandaagDag}`); } }, 'Naar het deurtje van vandaag') : null,
    ],
  });
  return d;
}

/* ---------- Briefje ---------- */

export function toonBriefje(n) {
  const info = dagInfo(n);
  staat.markeerBriefjeGelezen(n);
  const d = toonDialoog({
    label: `Briefje voor Pino, ${datum.langeDatum(n)}`,
    inhoud: [
      h('div', { class: 'dialoog-bol', style: { background: '#FFE0EE', boxShadow: '0 0 0 3px var(--roze), 0 8px 18px rgba(30,58,76,0.18)' } }, [icoon('hart', 72)]),
      h('div', { class: 'dialoog-sub', style: { color: 'var(--roze-schaduw)' } }, 'BRIEFJE VOOR PINO'),
      h('h2', { class: 'kop dialoog-titel' }, weekdagDatum(n)),
      h('p', { class: 'dialoog-tekst' }, info.briefje || '[Een persoonlijk zinnetje per dag – herinnering, grapje of hint voor het volgende deurtje.]'),
      h('button', { type: 'button', class: 'knop-pil knop-pil-teal', onclick: () => d.sluit() }, 'Fijn!'),
    ],
  });
  return d;
}

/* ---------- Telefoon ---------- */

export function toonTelefoon(n) {
  const info = dagInfo(n);
  staat.schrijf((s) => { s.telefoonGezien = n; });
  const d = toonDialoog({
    label: 'Er wordt gebeld',
    dim: 'rgba(30, 58, 76, 0.45)',
    melding: { icoon: 'telefoon', kleur: '#E3F4FC', html: '<strong>Er wordt gebeld!</strong> Een nieuw deurtje staat voor je klaar.', rinkelt: true },
    inhoud: [
      h('div', { class: 'dialoog-bol', style: { background: '#E3F4FC', boxShadow: '0 0 0 3px var(--teal), 0 8px 18px rgba(30,58,76,0.18)' } }, [
        h('span', { class: 'golf', 'aria-hidden': 'true' }),
        h('span', { class: 'golf', 'aria-hidden': 'true', style: { animationDelay: '0.8s' } }),
        icoon('telefoonGroot', 84, { label: 'Ouderwetse telefoon die rinkelt', klasse: 'rinkelt' }),
      ]),
      h('div', { class: 'dialoog-sub', style: { color: 'var(--teal-schaduw)' } }, 'RING RING!'),
      h('h2', { class: 'kop dialoog-titel' }, `Deurtje ${datum.langeDatum(n)} is open!`),
      h('p', { class: 'dialoog-tekst', html: `Dag ${n} van 10 staat klaar: <strong>${info.titel}</strong>. Neem op om te zien wat Pino vandaag te doen heeft.` }),
      h('div', { class: 'beller' }, [
        h('div', { class: 'beller-bol' }, [icoon('gansKlein', 30)]),
        h('div', {}, [h('div', { class: 'beller-label' }, 'BELLER'), h('div', { class: 'beller-naam' }, 'De Gans · Kalendercentrale')]),
      ]),
      h('div', { class: 'dialoog-knoppen' }, [
        h('button', { type: 'button', class: 'knop-pil knop-pil-grijs', style: { flex: '1' }, onclick: () => d.sluit() }, 'Later'),
        h('button', { type: 'button', class: 'knop-pil knop-pil-groen', style: { flex: '1.4' }, onclick: () => {
          d.sluit();
          const deur = document.querySelector(`[data-deur="${n}"]`);
          if (deur) {
            deur.scrollIntoView({ block: 'center' });
            requestAnimationFrame(() => openTaartmenu(deur, n, 'vandaag'));
          }
        } }, [icoon('telefoon', 20), 'Opnemen']),
      ]),
    ],
  });
  return d;
}

/* ---------- Open deurtje ---------- */

export function schermDeur({ root, params }) {
  const n = Number(params.n);
  if (!(n >= 1 && n <= datum.AANTAL_DAGEN)) { ga('/', { vervang: true }); return; }
  const s = staat.lees();
  const nu = datum.vandaag();
  const status = datum.deurStatus(n, s, nu);
  if (status === 'dicht') {
    schermKalender({ root, telefoon: false });
    const d = toonVergrendeld(n);
    return () => d.sluit();
  }
  const info = dagInfo(n);
  const dagen = datum.dagenTotVerjaardag(nu);
  const chipTekst = status === 'gespeeld' ? 'Gespeeld' : status === 'vandaag' ? 'Spel van vandaag' : `Spel van dag ${n}`;
  const chipKlasse = status === 'gespeeld' ? 'chip chip-groen' : 'chip';

  root.append(h('div', { class: 'scherm open' }, [
    kopbalk({ label: `DAG ${n} VAN 10`, titel: weekdagDatum(n) }),
    h('section', { class: 'kaart open-kaart' }, [
      h('div', { class: 'grote-bol', style: { background: BOL_KLEUR[info.icoon], boxShadow: `0 0 0 3px ${RING_KLEUR[info.icoon]}, 0 8px 18px rgba(30,58,76,0.18)` } }, [icoon(info.icoon, 96, { label: info.titel })]),
      h('span', { class: chipKlasse }, chipTekst),
      h('h2', { class: 'kop open-titel' }, info.titel),
      info.omschrijving ? h('p', { class: 'open-tekst' }, info.omschrijving) : null,
      info.chips && info.chips.length ? h('div', { class: 'open-chips' }, info.chips.map((c) => h('span', { class: 'chip' }, c))) : null,
      h('button', { type: 'button', class: 'knop-pil knop-pil-groen', style: { marginTop: '4px' }, onclick: () => ga(`/laden/${n}`) }, [icoon('speel', 22), status === 'gespeeld' ? 'Speel opnieuw' : 'Speel nu']),
    ]),
    h('section', { class: 'kaart briefje-kaart', 'aria-label': 'Briefje voor Pino' }, [
      h('div', { class: 'briefje-bol' }, [icoon('hart', 26)]),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
        h('div', { class: 'briefje-label' }, 'BRIEFJE VOOR PINO'),
        h('p', { class: 'briefje-tekst' }, info.briefje || '[Een persoonlijk zinnetje per dag – herinnering, grapje of hint voor het volgende deurtje.]'),
      ]),
    ]),
    h('div', { class: 'open-voet' }, [
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, [
        h('span', { class: 'open-voet-label' }, 'VERJAARDAGSDRANG'),
        h('span', { class: 'open-voet-tekst', html: dagen === 0 ? 'Vandaag is het <strong>3 december</strong>!' : `Nog <strong>${dagen} ${dagen === 1 ? 'dag' : 'dagen'}</strong> tot 3 december` }),
      ]),
      h('div', { class: 'open-voet-bol' }, [icoon('taart', 30)]),
    ]),
  ]));
  staat.markeerBriefjeGelezen(n);
  if (status === 'vandaag' && s.deurtjes[n] !== 'open') staat.markeerDeur(n, 'open');
}
