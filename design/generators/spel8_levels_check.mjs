// Controleert de levels van spel 8 met dezelfde regels als de app.
// Gebruik (vanuit de repo-root):  node design/generators/spel8_levels_check.mjs [--pad]
// Eis: level 1–4 zijn zonder spray te halen, level 5 alleen met spray.
import { losOp } from '../../advent/js/spellen/schaak.js';
import { LEVELS } from '../../advent/js/spellen/schaak-levels.js';

const toonPad = process.argv.includes('--pad');
const naam = (a) => (a.soort === 'spray' ? 'spray' : `${a.soort} ${a.naar.join(',')}`);
let goed = true;
for (const level of LEVELS) {
  const zonder = losOp(level, { heeftSpray: false });
  const met = losOp(level, { heeftSpray: true });
  const eis = level.nr === 5 ? !zonder && !!met : !!zonder;
  if (!eis) goed = false;
  console.log(`Level ${level.nr} (${level.dier}): zonder spray ${zonder ? zonder.beurten + ' beurten' : 'onmogelijk'}, `
    + `met spray ${met ? met.beurten + ' beurten' : 'onmogelijk'}  ${eis ? 'OK' : 'FOUT'}`);
  if (toonPad) {
    const pad = (zonder || met);
    if (pad) console.log('   ' + pad.perBeurt.map((b) => b.map(naam).join(' + ')).join('  |  '));
  }
}
process.exit(goed ? 0 : 1);
