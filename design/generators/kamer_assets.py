# Zet de symbolen van Pino's kamer (kamer_sprites.EXTRA_KAMER) in assets/sprites: kamer.svg (alleen de kamer),
# sprites.svg (alles; een eerder ingevoegd kamerblok wordt vervangen) en symbolen.json (sleutel "kamer").
# Draai: python kamer_assets.py (vanuit deze map). Mag vaker draaien.
import json
import re
from pathlib import Path
from kamer_sprites import EXTRA_KAMER, KAMER_IDS

MAP = Path(__file__).resolve().parent.parent.parent / 'assets' / 'sprites'
BEGIN, EIND = '<!-- KAMER: begin -->', '<!-- KAMER: einde -->'

symbolen = re.findall(r'<symbol id="km-[^"]+".*?</symbol>', EXTRA_KAMER, flags=re.S)
ids = [re.match(r'<symbol id="([^"]+)"', s).group(1) for s in symbolen]
assert ids == KAMER_IDS, (ids, KAMER_IDS)
blok = BEGIN + '\n' + '\n'.join(symbolen) + '\n' + EIND + '\n'

(MAP / 'kamer.svg').write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" '
    'style="position:absolute" aria-hidden="true">\n<defs>\n' + blok + '</defs>\n</svg>\n', encoding='utf-8')

pad = MAP / 'sprites.svg'
tekst = pad.read_text(encoding='utf-8')
tekst = re.sub(re.escape(BEGIN) + r'.*?' + re.escape(EIND) + r'\n?', '', tekst, flags=re.S)
plek = tekst.rfind('</defs>')
tekst = tekst[:plek] + blok + tekst[plek:]
pad.write_text(tekst, encoding='utf-8', newline='')

index = json.loads((MAP / 'symbolen.json').read_text(encoding='utf-8'))
index['kamer'] = ids
(MAP / 'symbolen.json').write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{len(ids)} kamersymbolen; totaal {tekst.count("<symbol ")} in sprites.svg')
