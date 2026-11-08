// Spel 4 · decor per omgeving (specs/spel4.md): strand (Tan), uitzichtpunt op een berg (Nguyễn), dagmarkt (Somchai).
// Elke omgeving: achter() = alles wat altijd achter de familie ligt, rekwisieten() = dingen die met de familie
// mee gesorteerd worden op hun voet-y, werker = de verstopte werker voor spel 7, label = beschrijving voor de scène.
// Scène 358×670; het strand komt uit design/generators/spel4_build.py (strand()), berg en markt uit spel4_build.py (berg(), markt()).

import { el, use, persoon } from '../sprites.js';

const pad = (d, attrs) => el('path', { d, ...attrs });
const rect = (x, y, width, height, fill, extra = {}) => el('rect', { x, y, width, height, fill, ...extra });
const stippen = (fill, lijst) => el('g', { fill }, lijst.map(([cx, cy, r]) => el('circle', { cx, cy, r })));
const werkerKnoop = (w) => el('g', { class: 's4-werker' }, [use('werker', w.x, w.y, w.b, w.h)]);

/* ---------- strand ---------- */

const STRAND_WERKER = { x: 38, y: 314, b: 16, h: 20 };   // half achter de palmstam

function strandAchter() {
  return el('g', { class: 's4-achter' }, [
    rect(0, 0, 358, 200, '#8ED8F8'),
    use('s4-zon', 266, 22, 60, 60),
    use('s4-wolk', 22, 42, 96, 36), use('s4-wolk', 176, 78, 66, 25),
    use('s4-meeuw', 112, 116, 24, 12), use('s4-meeuw', 140, 104, 20, 10), use('s4-meeuw', 62, 130, 16, 8),
    rect(0, 152, 358, 150, '#1FA3DC'),
    rect(0, 152, 358, 5, '#FFFFFF', { opacity: 0.7 }),
    rect(0, 268, 358, 34, '#0E7FB5'),
    pad('M30 206 h54 M150 232 h40 M60 250 h36 M240 200 h30', { stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.7 }),
    use('s4-rots', 12, 96, 130, 86), use('s4-rots', 196, 124, 84, 56),
    use('s4-pier', 268, 160, 80, 140),
    use('s4-boot', 118, 222, 112, 45),
    pad('M0 302 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v368 h-358z', { fill: '#F2CF8A' }),
    pad('M0 296 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v8 q-30 10 -60 0 t-60 0 t-60 0 t-60 0 t-60 0 t-60 0z', { fill: '#FFFFFF', opacity: 0.85 }),
    pad('M0 316 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v354 h-358z', { fill: '#FDE9B6' }),
    pad('M0 316 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0', { fill: 'none', stroke: '#F2CF8A', 'stroke-width': 3 }),
    stippen('#F2CF8A', [[70, 380, 4], [150, 470, 4], [300, 600, 4], [40, 640, 4], [220, 650, 3], [330, 400, 3]]),
    use('s4-schelp', 58, 452, 18, 16), use('s4-schelp', 322, 560, 16, 14), use('s4-zeester', 200, 610, 20, 20),
    // De handdoek ligt plat op het zand: altijd achter wie erop staat.
    use('s4-handdoek', 262, 520, 80, 44),
  ]);
}

function strandRekwisieten() {
  return [
    { y: 319, werker: true, knoop: werkerKnoop(STRAND_WERKER) },
    { y: 320, knoop: use('s4-palm', 4, 194, 80, 130) },
    { y: 418, knoop: use('s4-kraam', 232, 322, 120, 100) },
    { y: 424, knoop: use('s4-boog', 112, 300, 130, 130) },
    { y: 442, knoop: use('s4-bank', 20, 398, 84, 48) },
    { y: 496, knoop: use('s4-bal', 92, 466, 32, 32) },
    { y: 516, knoop: use('s4-parasol', 288, 436, 72, 84) },
  ];
}

/* ---------- uitzichtpunt op een berg ---------- */

const BERG_WERKER = { x: 206, y: 432, b: 16, h: 20 };    // half achter de voet van de verrekijker

function bergAchter() {
  return el('g', { class: 's4-achter' }, [
    rect(0, 0, 358, 340, '#8ED8F8'),
    use('s4-zon', 34, 30, 54, 54),
    use('s4-wolk', 150, 36, 96, 36), use('s4-wolk', 268, 92, 66, 25),
    use('s4-meeuw', 120, 110, 22, 11), use('s4-meeuw', 96, 124, 16, 8),
    use('s4-bergen', 0, 140, 358, 190),
    // Het rotspunt steekt uit boven de diepte; zijn voorkant sluit aan op het gras van het uitzichtpunt.
    use('s4-rotspunt', 230, 268, 120, 64),
    rect(0, 322, 246, 5, '#A7B2BC'), rect(334, 322, 24, 5, '#7D8A96'),
    rect(0, 326, 358, 344, '#8BD35A'),
    rect(0, 326, 246, 5, '#5FB05A'), rect(334, 326, 24, 5, '#5FB05A'),
    el('g', { fill: '#9ADB7A' }, [
      el('ellipse', { cx: 70, cy: 400, rx: 44, ry: 12 }), el('ellipse', { cx: 250, cy: 500, rx: 54, ry: 14 }),
      el('ellipse', { cx: 120, cy: 640, rx: 60, ry: 14 }), el('ellipse', { cx: 320, cy: 610, rx: 40, ry: 10 }),
    ]),
    // grindpad van het trapje naar het hek
    pad('M44 676 Q70 566 150 520 T126 372', { fill: 'none', stroke: '#F2CF8A', 'stroke-width': 40, 'stroke-linecap': 'round' }),
    pad('M44 676 Q70 566 150 520 T126 372', { fill: 'none', stroke: '#FDE9B6', 'stroke-width': 32, 'stroke-linecap': 'round' }),
    stippen('#F2CF8A', [[60, 600, 3], [140, 520, 3], [120, 420, 2.5], [90, 560, 2.5]]),
    use('s4-trap', 4, 628, 90, 50),
    stippen('#FFFFFF', [[30, 380, 2.5], [210, 600, 2.5], [330, 460, 2.5], [180, 380, 2]]),
    stippen('#FF9BC8', [[24, 470, 2.5], [300, 660, 2.5], [200, 640, 2]]),
    stippen('#FFC93C', [[340, 380, 2.5], [150, 600, 2]]),
    // Het ijsje ligt plat op het gras: altijd achter wie ervan eet.
    use('s4-ijsje', 262, 552, 35, 25),
  ]);
}

function bergRekwisieten() {
  return [
    { y: 340, knoop: use('s4-hek', 12, 290, 200, 52) },
    { y: 426, knoop: use('s4-den', 300, 330, 54, 96) },
    { y: 459, werker: true, knoop: werkerKnoop(BERG_WERKER) },
    { y: 460, knoop: use('s4-kijker', 186, 388, 44, 72) },
    { y: 470, knoop: use('s4-struik', 290, 436, 56, 36) },
    { y: 474, knoop: use('s4-bank', 20, 430, 84, 48) },
    { y: 588, knoop: use('s4-wegwijzer', 36, 520, 44, 70) },
    { y: 634, knoop: use('s4-struik', 128, 600, 56, 36) },
  ];
}

/* ---------- dagmarkt ---------- */

const MARKT_WERKER = { x: 228, y: 402, b: 16, h: 20 };   // half achter de dierentafel
// De verkoper staat achter de dierentafel (decor: telt niet mee als iemand die in beeld staat).
const VERKOPER = { kleding: '#39D353', huid: '#C98B5A', haar: 'bh-kort', haarkleur: '#2B1A0E', acc: ['acc-nonla'] };

function marktAchter() {
  const tegels = [];
  for (let y = 336; y < 670; y += 38) tegels.push(`M0 ${y} H358`);
  for (let x = -120; x < 400; x += 46) tegels.push(`M${x} 304 L${x + 70} 670`);
  return el('g', { class: 's4-achter' }, [
    rect(0, 0, 358, 140, '#8ED8F8'),
    use('s4-wolk', 40, 18, 80, 30), use('s4-wolk', 236, 40, 66, 25),
    use('s4-gevels', 0, 86, 358, 210),
    rect(0, 290, 358, 14, '#DDE7EE'),
    rect(0, 300, 358, 4, '#CFD8DC'),
    rect(0, 304, 358, 366, '#EADFC4'),
    pad(tegels.join(' '), { stroke: '#DCCFAE', 'stroke-width': 2 }),
    stippen('#FF6FAE', [[90, 440, 2.5], [60, 452, 2], [130, 470, 2]]),
    stippen('#39D353', [[270, 640, 2.5], [250, 660, 2]]),
  ]);
}

function marktRekwisieten() {
  return [
    { y: 392, knoop: use('s4-bloemkraam', 22, 284, 130, 110) },
    // Dierentafel: verkoper erachter, kooien met twee katten en een vliegende eekhoorn erop; het jongetje staat ervoor.
    { y: 396, knoop: persoon(293 - 24, 394 - 71, VERKOPER) },
    { y: 443, werker: true, knoop: werkerKnoop(MARKT_WERKER) },
    { y: 444, knoop: use('s4-dierentafel', 232, 378, 120, 70) },
    { y: 444.5, knoop: el('g', {}, [
      use('s4-kooi-kat', 240, 360, 34, 40, '#FF8A3D'),
      use('s4-kooi-eekhoorn', 276, 360, 34, 40),
      use('s4-kooi-kat', 312, 360, 34, 40, '#A7B2BC'),
    ]) },
    { y: 468, knoop: use('s4-ton', 192, 420, 36, 48) },
    { y: 530, knoop: use('s4-manden', 16, 470, 90, 60) },
    { y: 596, knoop: use('s4-groentekraam', 214, 500, 130, 100) },
    { y: 624, knoop: use('s4-kool', 190, 604, 24, 20) },
    { y: 632, knoop: use('s4-bank', 24, 588, 84, 48) },
  ];
}

/* ---------- register ---------- */

export const DECOR = {
  strand: {
    achter: strandAchter, rekwisieten: strandRekwisieten, werker: STRAND_WERKER,
    label: 'Tropisch strand met zee, kalksteenrotsen, een longtailboot en een pier. Op het zand staan een palmboom, een fruitkraam, '
      + 'een bloemenboog, een bankje en een parasol, en er ligt een handdoek. De familie loopt over het strand; Pino heeft een fototoestel.',
  },
  berg: {
    achter: bergAchter, rekwisieten: bergRekwisieten, werker: BERG_WERKER,
    label: 'Uitzichtpunt op een berg met groene bergtoppen en wolken in de verte. Op het gras staan een houten hek langs de rand, '
      + 'een uitstekend rotspunt, een verrekijker op een paal, een bankje, een wegwijzer, struiken en een den, en er ligt een ijsje op de grond. '
      + 'De familie loopt rond; Pino heeft een fototoestel.',
  },
  markt: {
    achter: marktAchter, rekwisieten: marktRekwisieten, werker: MARKT_WERKER,
    label: 'Een dagmarkt voor een rij gekleurde winkelhuizen, met een bloemenkraam, een groentekraam, een tafel met een verkoper en kooien met katten en een vliegende eekhoorn, manden met fruit, '
      + 'een regenton en een bankje; bij de groentekraam ligt een kool op de grond. De familie loopt rond; Pino heeft een fototoestel.',
  },
};
