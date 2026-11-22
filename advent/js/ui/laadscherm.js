// Laadscherm met Nederlandse "reticulating splines"-teksten. Laadt ondertussen de spelmodule
// (en laat die zijn sprite sheet voorbereiden) en gaat dan door naar #/spel/n.

import { h } from './dom.js';
import { icoon, BOL_KLEUR, RING_KLEUR } from './iconen.js';
import * as datum from '../datum.js';
import { ga } from '../router.js';
import { dagInfo } from '../kalender.js';
import { laadSpel } from '../spellen/index.js';
import * as staat from '../staat.js';

let laadteksten = null;
// Lang genoeg om een paar laadzinnen en de tip te lezen (besluit 199): vier zinnen van 1,25 s, dus ± 5 s tot "Klaar!".
// Bij een spel dat al gespeeld is (de tip is dan bekend) drie zinnen van 1,1 s. Ook met ?test=1 even lang, zodat je
// het laadscherm ziet zoals Pino het ziet.
const STAP_MS = 1250;
const MIN_STAPPEN = 4;
const STAP_MS_OPNIEUW = 1100;
const MIN_STAPPEN_OPNIEUW = 3;
const KLAAR_MS = 600;

async function haalTeksten() {
  if (laadteksten) return laadteksten;
  try {
    const r = await fetch(new URL('../../data/laadteksten.json', import.meta.url));
    laadteksten = await r.json();
  } catch {
    laadteksten = ['Splines aan het reticuleren…'];
  }
  return laadteksten;
}

function schud(lijst) {
  const a = [...lijst];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function schermLaden({ root, params }) {
  const n = Number(params.n);
  if (!(n >= 1 && n <= datum.AANTAL_DAGEN)) { ga('/', { vervang: true }); return; }
  const info = dagInfo(n);
  let gestopt = false;
  let timer = null;

  const balk = h('span', { style: { width: '0%' } });
  const procent = h('span', {}, '0%');
  const huidig = h('div', { class: 'kop laden-huidig', 'aria-live': 'polite' }, '…');
  const klaarLijst = h('div', { class: 'laden-klaar' });
  const voortgang = h('div', { role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0', 'aria-label': 'Laadvoortgang', class: 'balk balk-groen balk-dik' }, [balk]);

  root.append(h('div', { class: 'scherm laden' }, [
    h('section', { class: 'kaart laden-kaart' }, [
      h('div', { class: 'grote-bol laden-bol', style: { background: BOL_KLEUR[info.icoon], boxShadow: `0 0 0 3px ${RING_KLEUR[info.icoon]}, 0 8px 18px rgba(30,58,76,0.18)` } }, [icoon(info.icoon, 84, { label: info.titel })]),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
        h('div', { class: 'kopbalk-label' }, datum.dagLabel(n)),
        h('h1', { class: 'kop laden-titel' }, info.titel),
        h('div', { class: 'laden-sub' }, 'wordt geladen'),
      ]),
      h('div', { class: 'laden-balk' }, [
        voortgang,
        h('div', { class: 'laden-balk-tekst' }, [h('span', {}, 'Even geduld…'), procent]),
      ]),
      huidig,
      klaarLijst,
    ]),
    h('div', { class: 'kaart-plat laden-tip' }, [
      h('div', { class: 'laden-tip-bol' }, [icoon('lamp', 24)]),
      // Eigen tip per dag uit kalender.json (besluit 165), anders de algemene tip. Het laadscherm is geen spelscherm,
      // dus hier mag een hint staan; in het spel zelf niet.
      h('div', {}, [h('strong', {}, 'Tip:'), ` ${info.tip || 'elk gespeeld spelletje vult een behoefte aan. Op 3 december staat alles op groen.'}`]),
    ]),
  ]));

  (async () => {
    const teksten = schud(await haalTeksten());
    if (gestopt) return;
    let stap = 0;
    let moduleKlaar = false;
    const opnieuw = staat.lees().deurtjes[n] === 'gespeeld';
    const stapMs = opnieuw ? STAP_MS_OPNIEUW : STAP_MS;
    const minStappen = opnieuw ? MIN_STAPPEN_OPNIEUW : MIN_STAPPEN;
    const totaal = minStappen + 1;
    // De balk loopt rustig en gelijkmatig vol: elke stap schuift hij in precies de duur van die stap naar het volgende
    // punt. Met prefers-reduced-motion zet basis.css de overgang uit en springt hij per stap.
    balk.style.transition = `width ${stapMs}ms linear`;

    // Spelmodule (en eventuele voorbereiding, zoals de sprite sheet) parallel laden.
    const voorbereiding = laadSpel(n)
      .then((m) => (m && typeof m.voorbereid === 'function' ? m.voorbereid({ dag: n, info }) : null))
      .catch((e) => { console.error(e); })
      .then(() => { moduleKlaar = true; });

    function zet(pct, tekst) {
      balk.style.width = `${pct}%`;
      procent.textContent = `${pct}%`;
      voortgang.setAttribute('aria-valuenow', String(pct));
      if (tekst) huidig.textContent = tekst;
    }
    const pctNa = (k) => Math.min(96, Math.round(8 + (k / totaal) * 88));

    function volgende() {
      if (gestopt) return;
      if (stap > 0) {
        klaarLijst.append(h('div', { class: 'laden-regel' }, [h('span', { class: 'laden-vink', 'aria-hidden': 'true' }, [icoon('vink', 14)]), h('span', {}, teksten[(stap - 1) % teksten.length])]));
        while (klaarLijst.children.length > 3) klaarLijst.firstChild.remove();
      }
      if (stap >= minStappen && moduleKlaar) {
        balk.style.transition = 'width 0.3s ease';
        zet(100, 'Klaar!');
        timer = setTimeout(() => { if (!gestopt) ga(`/spel/${n}`, { vervang: true }); }, KLAAR_MS);
        return;
      }
      // Het percentage toont waar de balk aan het eind van deze stap is; de balk zelf glijdt erheen.
      zet(pctNa(stap + 1), teksten[stap % teksten.length]);
      stap += 1;
      timer = setTimeout(volgende, stapMs);
    }
    volgende();
    await voorbereiding;
  })();

  return () => { gestopt = true; if (timer) clearTimeout(timer); };
}
