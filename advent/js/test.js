// Controle-scherm (#/test): bewijst dat de geïnjecteerde symbolen en currentColor werken en toont de staat.

import { h } from './ui/dom.js';
import { kopbalk } from './ui/kopbalk.js';
import { aantalSymbolen, scene, use, pino, persoon, dier, el } from './sprites.js';
import { lees, wis } from './staat.js';
import { ga } from './router.js';
import { dagVanVandaag, vandaag } from './datum.js';
import * as sap from './ui/sap.js';
import { maakTeller } from './ui/teller.js';

/** Beeldfeedback-proef (besluit 210): elk effect uit ui/sap.js los te bekijken. */
function sapProef() {
  const sc = scene(358, 150, { label: 'Proefscène voor beeldfeedback' });
  Object.assign(sc.style, { background: 'var(--gras-2)', borderRadius: '18px', maxWidth: '100%', height: 'auto' });
  const plant = el('g', { transform: 'translate(20 40)' }, [el('g', { class: 'sap-wieg' }, [use('s8-varen', 0, 30, 72, 60)])]);
  const lid = persoon(150, 60, { kleding: '#1FA3DC', huid: '#F6C9A8', haar: 'bh-kort', haarkleur: '#1E3A4C' });
  const binnen = el('g', {}, [...lid.childNodes]);
  lid.append(binnen);
  const gem = use('gem', 260, 70, 40, 40, '#FF5E5B');
  sc.append(plant, lid, gem);
  const munten = maakTeller({ icoon: el('svg', { viewBox: '0 0 48 48', width: 22, height: 22, 'aria-hidden': 'true' }, [use('s4-munt', 0, 0, 48, 48)]), waarde: 60, label: (n) => `Geld: ${n}` });
  const knop = (tekst, actie) => h('button', { type: 'button', class: 'knop-pil knop-pil-grijs', style: { padding: '8px 12px', fontSize: '14px' }, onclick: actie }, tekst);
  const kaart = h('div', { class: 'kaart', style: { marginTop: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' } });
  kaart.append(
    h('span', { class: 'kop', style: { fontSize: '18px' } }, 'Beeldfeedback'),
    sc,
    munten.element,
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' } }, [
      knop('wip', () => sap.wip(binnen)),
      knop('pop', () => sap.pop(binnen)),
      knop('schud', () => sap.schud(kaart)),
      knop('flits', () => sap.flits(kaart)),
      knop('sterren', () => sap.deeltjes(sc, 174, 70, { soort: 'ster', aantal: 7 })),
      knop('hartjes', () => sap.deeltjes(sc, 174, 70, { soort: 'hart', aantal: 5 })),
      knop('stof', () => sap.deeltjes(sc, 174, 132, { soort: 'stof', aantal: 4 })),
      knop('wolk hart', () => sap.bubbel(sc, 174, 58, 'hart')),
      knop('wolk boos', () => sap.bubbel(sc, 174, 58, 'boos')),
      knop('wolk !', () => sap.bubbel(sc, 174, 58, 'uitroep')),
      knop('wolk lamp', () => sap.bubbel(sc, 174, 58, 'lamp')),
      knop('vlieg + teller', () => {
        const inhoud = el('svg', { viewBox: '0 0 48 48' }, [use('s4-munt', 0, 0, 48, 48)]);
        sap.vlieg({ van: gem, naar: munten.element, inhoud }).then(() => munten.zet(munten.waarde + 20));
      }),
      knop('confetti', () => sap.confetti(kaart, { aantal: 24 })),
      knop('tril', () => sap.tril(40)),
    ]),
    h('p', { class: 'gedempt', style: { fontSize: '13px', margin: 0 } }, `reduced motion: ${sap.rustig() ? 'aan' : 'uit'}`),
  );
  kaart.style.position = 'relative';
  kaart.style.overflow = 'hidden';
  return kaart;
}

export function schermTest({ root }) {
  const s = scene(358, 300, { label: 'Sprite-controle' });
  s.style.background = 'var(--gras-2)';
  s.style.borderRadius = '22px';
  s.style.maxWidth = '100%';
  s.style.height = 'auto';
  const dekens = [['#39D353', 'vlinder'], ['#FFC93C', 'boom'], ['#5BC0EB', 'vogel']];
  dekens.forEach(([kleur, motief], i) => {
    const g = el('g', { transform: `translate(${16 + i * 80} 12)` });
    g.append(use('bed-onder', 0, 0, 64, 84));
    g.append(use('k-hoofd', 16, 14, 32, 32, '#F6C9A8'));
    g.append(use(['h-bob', 'h-krul', 'h-stekel'][i], 16, 14, 32, 32, ['#6B4A2B', '#1E3A4C', '#D97A00'][i]));
    g.append(use(['g-slaap', 'g-gaap', 'g-verrast'][i], 16, 14, 32, 32));
    g.append(use('bed-deken', 0, 0, 64, 84, kleur));
    g.append(use(`m-${motief}`, 10, 50, 14, 14));
    g.append(use(`m-${motief}`, 40, 54, 14, 14));
    g.append(use(`m-${motief}`, 25, 60, 12, 12));
    s.append(g);
  });
  s.append(pino(262, 20, 'staan'));
  s.append(pino(306, 20, 'loop', { flip: true }));
  s.append(persoon(16, 130, { kleding: '#1FA3DC', huid: '#F6C9A8', haar: 'bh-kort', haarkleur: '#1E3A4C' }));
  s.append(persoon(70, 130, { kleding: '#FF6FAE', huid: '#E8B48A', haar: 'bh-lang', haarkleur: '#6B4A2B', jurk: true, acc: ['acc-nonla'] }));
  s.append(persoon(124, 130, { kleding: '#39D353', huid: '#C98B5A', haar: 'bh-knot', haarkleur: '#1E3A4C', jurk: true, acc: ['acc-ketting'] }));
  s.append(persoon(178, 150, { kleding: '#FFC93C', huid: '#F6C9A8', haar: 'bh-stekel', haarkleur: '#D97A00', kind: true, acc: ['acc-pet'] }));
  s.append(dier(220, 160, 'lam'));
  s.append(dier(262, 160, 'gansje'));
  s.append(dier(304, 160, 'biggetje'));
  s.append(use('s4-munt', 16, 230, 48, 48));
  s.append(use('gem', 70, 230, 48, 48, '#5BC0EB'));
  s.append(use('gem', 110, 230, 48, 48, '#39D353'));
  s.append(use('gem', 150, 230, 48, 48, '#FF5E5B'));
  s.append(use('hx-tegel', 210, 222, 56, 66, '#39D353'));
  s.append(use('wk-staan', 290, 222, 48, 72));

  const staat = lees();
  root.append(h('div', { class: 'scherm' }, [
    sapProef(),
    kopbalk({ titel: 'Sprite-controle' }),
    h('div', { class: 'kaart', style: { marginTop: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' } }, [
      s,
      h('p', { class: 'gedempt', style: { fontSize: '13px', margin: 0, textAlign: 'center' } },
        `${aantalSymbolen()} symbolen geladen · datum ${vandaag().toLocaleDateString('nl-NL')} · dag ${dagVanVandaag()}`),
    ]),
    h('div', { class: 'kaart', style: { marginTop: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' } }, [
      h('span', { class: 'kop', style: { fontSize: '18px' } }, 'Spelstaat'),
      h('pre', { style: { margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'var(--gedempt-2)' } }, JSON.stringify(staat, null, 1)),
      h('button', { type: 'button', class: 'knop knop-rood', onclick: () => { wis(); ga('/test', { vervang: true }); location.reload(); } }, 'Staat wissen'),
    ]),
  ]));
}
