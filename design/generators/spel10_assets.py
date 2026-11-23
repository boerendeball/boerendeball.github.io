# Zet de middernacht-symbolen van spel 10 (besluit 220) uit spel10_sprites.EXTRA10 in assets/sprites: spel10.svg,
# sprites.svg (vóór het kamerblok) en symbolen.json (sleutel "spel10"). Bestaande symbolen met hetzelfde id worden
# vervangen, dus het script mag vaker draaien. Draai: python spel10_assets.py (vanuit deze map).
import json
import re
from pathlib import Path
from spel10_sprites import EXTRA10

MAP = Path(__file__).resolve().parent.parent.parent / 'assets' / 'sprites'
IDS = ['s10-toren', 's10-pand-nacht', 's10-stoep-nacht', 's10-klinker-nacht', 's10-boom-nacht', 's10-koplicht-zij', 's10-koplicht-top']


def symbool(sid):
    m = re.search(r'<symbol id="' + re.escape(sid) + r'".*?</symbol>', EXTRA10, flags=re.S)
    assert m, sid
    return m.group(0)


def zet(tekst, voor_marker=None):
    for sid in IDS:
        nieuw = symbool(sid)
        oud = re.search(r'[ \t]*<symbol id="' + re.escape(sid) + r'".*?</symbol>\n?', tekst, flags=re.S)
        if oud:
            tekst = tekst[:oud.start()] + '  ' + nieuw + '\n' + tekst[oud.end():]
            continue
        plek = tekst.find(voor_marker) if voor_marker and voor_marker in tekst else tekst.rfind('</defs>')
        tekst = tekst[:plek] + '  ' + nieuw + '\n' + tekst[plek:]
    return tekst


for naam, marker in [('spel10.svg', None), ('sprites.svg', '<!-- KAMER: begin -->')]:
    pad = MAP / naam
    tekst = pad.read_text(encoding='utf-8')
    pad.write_text(zet(tekst, marker), encoding='utf-8', newline='')

index = json.loads((MAP / 'symbolen.json').read_text(encoding='utf-8'))
for sid in IDS:
    if sid not in index['spel10']:
        index['spel10'].append(sid)
(MAP / 'symbolen.json').write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{len(IDS)} symbolen van spel 10 bijgewerkt')
