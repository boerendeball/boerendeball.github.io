// Spel 8 · Schaken op nieuw niveau — de vijf levelkaarten (tekens: zie schaak.js).
// Gezocht met een computerzoeker en gecontroleerd met `node design/generators/spel8_levels_check.mjs`:
// level 1–4 zijn zonder spray te halen, level 5 alleen met spray.

export const LEVELS = [
  {
    nr: 1,
    dier: 'python',
    kaart: [            // drie pythons (pionnen)
      'Rb.....T',
      '...DD...',
      '.B....b.',
      '...R.RDR',
      'B.......',
      '.~~~....',
      '........',
      'P.......',
    ],
  },
  {
    nr: 2,
    dier: 'tijger',
    kaart: [            // makkelijker gemaakt (besluit 217): meer bomen als dekking, stam hoger, rotsen erbij
      '....B..T',
      'RB.BBB..',
      'B.B.B...',
      '.~~~...D',
      'R.S.....',
      'R.B.Bb..',
      '.......R',
      'P....B..',
    ],
  },
  {
    nr: 3,
    dier: 'luiaard',
    kaart: [
      '...D...T',
      '....B...',
      '....B..B',
      '..~..b.B',
      '..~B..B.',
      '..~.BR.B',
      '....B...',
      'P..S..B.',
    ],
  },
  {
    nr: 4,
    dier: 'leeuw',
    kaart: [
      '.......T',
      '.....R..',
      '.D.R....',
      '..bb....',
      '....S...',
      '..Rb~...',
      '..S.~..B',
      'P...~...',
    ],
  },
  {
    nr: 5,
    dier: 'krokodil',
    kaart: [
      '.S....bT',
      '........',
      '......B.',
      '........',
      '.BBBBB..',
      '.SbD..b.',
      '.SBRb~..',
      'P..b....',
    ],
  },
];
