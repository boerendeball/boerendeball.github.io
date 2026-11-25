# Zet nieuwe symbolen van spel 1 uit spel1_sprites.DEFS in assets/sprites: spel1.svg, sprites.svg (vóór het
# kamerblok) en symbolen.json (sleutel "spel1"). Bestaande symbolen met hetzelfde id worden vervangen, dus het
# script mag vaker draaien. Draai: python spel1_assets.py (vanuit deze map).
# Nu: s1-haas, het icoon van de Chop chop-knop (besluit 225).
import json
import re
from pathlib import Path
from spel1_sprites import DEFS

MAP = Path(__file__).resolve().parent.parent.parent / 'assets' / 'sprites'
IDS = ['s1-haas']


def symbool(sid):
    m = re.search(r'<symbol id="' + re.escape(sid) + r'".*?</symbol>', DEFS, flags=re.S)
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


for naam, marker in [('spel1.svg', None), ('sprites.svg', '<!-- KAMER: begin -->')]:
    pad = MAP / naam
    tekst = pad.read_text(encoding='utf-8')
    pad.write_text(zet(tekst, marker), encoding='utf-8', newline='')

index = json.loads((MAP / 'symbolen.json').read_text(encoding='utf-8'))
for sid in IDS:
    if sid not in index['spel1']:
        index['spel1'].append(sid)
(MAP / 'symbolen.json').write_text(json.dumps(index, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'{len(IDS)} symbolen van spel 1 bijgewerkt')
