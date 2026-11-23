# Bouwt Kamer.dc.html (volle kamer + gedachtenwolk), Kamer-Leeg.dc.html (verse staat) en Kamer-Sprites.dc.html
# in design/artboards (specs/kamer.md, besluiten 201–206). Draai: python kamer_build.py (vanuit deze map).
from pathlib import Path
from kamer_sprites import (DEFS, use, pino, dier, g, tegelstapel, foto, poppetje, schaakbord,
                           HUIS, TEGEL_KLEUR, TEGEL_FIGUUR, GEM_KLEUR, KAMER_IDS)

UIT = Path(__file__).resolve().parent.parent / 'artboards'

HEAD = '''<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<title>{title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&amp;family=Nunito:wght@400;700;800&amp;display=swap" rel="stylesheet">
<style>
body{{margin:0;font-family:'Nunito',sans-serif;color:#1E3A4C}}
a{{color:#1E3A4C;text-decoration:none}}
.kop{{font-family:'Fredoka',sans-serif;font-weight:700;line-height:1.1}}
.ic{{display:block}}
.vloer{{background-image:repeating-linear-gradient(30deg,rgba(255,255,255,0.38) 0 2px,transparent 2px 40px),repeating-linear-gradient(150deg,rgba(255,255,255,0.38) 0 2px,transparent 2px 40px)}}
.kaart{{background:#FFFFFF;border-radius:22px;box-shadow:0 6px 0 0 #CDE4F0,0 12px 24px rgba(30,58,76,0.12)}}
.stat-label{{font-size:11px;font-weight:800;color:#4F6B7E;letter-spacing:0.5px}}
.lbl{{font-size:12px;font-weight:800;color:#4F6B7E;text-align:center}}
.vak{{display:flex;flex-direction:column;align-items:center;gap:6px}}
</style>
</helmet>
'''
TAIL = '''
</x-dc>
<script type="text/x-dc" data-dc-script data-props='%s'>
class Component extends DCLogic {
  renderVals() { return %s; }
}
</script>
</body>
</html>
'''

# ---------- de staat die een artboard laat zien ----------
VOL = {
    'gespeeld': set(range(1, 11)),
    'tegels': {f'{k}-{f}': n for (k, f), n in zip([(k, f) for k in TEGEL_KLEUR for f in TEGEL_FIGUUR], [3, 1, 2, 2, 3, 1, 1, 2, 3])},
    'edelstenen': {'groen': 2, 'blauw': 1, 'rood': 3},
    'karakters': ['lam', 'gansje', 'meisje', 'biggetje'],
    'familie': 'tan',
    'fotos': ['tan', 'nguyen', 'somchai'],
    'geld': 35,
    'producten': ['ketting', 'kniebeschermers', 'spray', 'schoenen'],
    'werkers': 5,
    'levels': [1, 2, 3, 4, 5],
}
LEEG = {'gespeeld': set(), 'tegels': {}, 'edelstenen': {}, 'karakters': [], 'familie': None, 'fotos': [],
        'geld': 0, 'producten': [], 'werkers': 0, 'levels': []}

# Vaste plek van elk tegeltype in de honingraat vooraan rechts (achterste rij 5, voorste rij 4).
TEGEL_PLEK = {}
for i, (k, f) in enumerate([(k, f) for k in TEGEL_KLEUR for f in TEGEL_FIGUUR]):
    TEGEL_PLEK[f'{k}-{f}'] = (196 + i * 36, 482) if i < 5 else (214 + (i - 5) * 36, 516)


def kamer_scene(st):
    """De kamer als SVG-inhoud (viewBox 0 0 358 560), van achter naar voor."""
    gs = st['gespeeld']
    o = []
    # muur, plint en vloer (zoals de slaapzaal van spel 1, eigen kleuren: besluit 206)
    o.append('<defs><pattern id="km-behang" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="2.5" fill="#FFE08A"/></pattern></defs>')
    o.append('<rect x="0" y="0" width="358" height="196" fill="#FFF1D6"/><rect x="0" y="0" width="358" height="196" fill="url(#km-behang)"/>')
    o.append('<rect x="0" y="192" width="358" height="8" fill="#C98B5A"/><rect x="0" y="200" width="358" height="360" fill="#F6EBDD"/>')
    o.append('<g opacity="0.35" stroke="#C2743C" stroke-width="2">' + ''.join(f'<line x1="0" y1="{y}" x2="358" y2="{y}"/>' for y in range(236, 560, 36)) + '</g>')
    # aan de muur
    o.append(use('raam', 147, 22, 64, 52))
    if 10 in gs:
        o.append(use('s10-slinger', -2, 2, 182, 36) + use('s10-slinger', 178, 2, 182, 36))
    for i, fam in enumerate(['tan', 'nguyen', 'somchai']):
        if fam in st['fotos']:
            o.append(foto(fam, 6 + i * 45, 12 + (i % 2) * 4, 0.34, [-4, 3, -2][i]))
    if 5 in gs:
        o.append('<line x1="232" y1="0" x2="232" y2="27" stroke="#4F6B7E" stroke-width="1.5"/>')
        o.append(use('s5-gloed', 192, 3, 80, 80) + use('s5-lampion', 220, 26, 24, 34, '#FF6FAE'))
    o.append(use('km-haak', 276, 58, 12, 14) + use('km-haak', 314, 58, 12, 14))
    if 6 in gs:
        o.append(use('s6-gi', 262, 64, 40, 40))
    if 'kniebeschermers' in st['producten']:
        o.append(use('s5-kniebeschermers', 303, 66, 34, 34))
    # wandplank onder het raam
    o.append(use('km-plank', 112, 124, 150, 18))
    if 2 in gs:
        o.append(use('s2-boeddha', 118, 96, 22, 28))
    if 3 in gs and st['familie']:
        o.append(use(HUIS[st['familie']], 142, 91, 48, 33))
    if 4 in gs:
        o.append(use('s4-camera', 194, 104, 26, 20))
    if 'spray' in st['producten']:
        o.append(use('s5-spray', 219, 98, 26, 26))
    if st["werkers"] > 0:     # in de app pas als deurtje 7 open is (besluit 205)
        o.append(use('werker', 245, 101, 18, 23))
    # kaptafel met spiegel, ketting en edelstenen
    o.append(use('km-kaptafel', 8, 74, 96, 130))
    if 'ketting' in st['producten']:
        o.append(use('s5-ketting', 39, 78, 34, 34))
    for kleur, x in [('groen', 14), ('blauw', 33), ('rood', 66)]:
        if st['edelstenen'].get(kleur, 0) > 0:
            o.append(use('gem', x, 131, 18, 18, GEM_KLEUR[kleur]))
    # nachtkastje met lampje en stethoscoop, spaarvarken
    o.append(use('km-nachtkastje', 194, 196, 44, 52))
    if 1 in gs:
        o.append(use('nachtlamp', 196, 166, 22, 30))
    if 9 in gs:
        o.append(use('km-stetho', 214, 184, 24, 16))
    # bed met roze deken en knuffels
    o.append(g(238, 164, 1.6, use('bed-onder', 0, 0, 64, 84) + use('bed-deken', 0, 0, 64, 84, '#FF6FAE')))
    if 'meisje' in st['karakters']:
        o.append(poppetje(281, 180, 0.5))
    for soort, x, y in [('lam', 244, 220), ('gansje', 274, 230), ('biggetje', 304, 220)]:
        if soort in st['karakters']:
            o.append(dier(x, y, soort, 0.58))
    if st['geld'] > 0:
        o.append(use('km-spaarvarken', 198, 262, 34, 27))
    if 'schoenen' in st['producten']:
        o.append(use('s5-schoenen', 296, 296, 34, 34))
    # kleedje en Pino
    o.append(use('kleedje', 96, 330, 150, 75))
    o.append(pino(146, 300, 'staan', 1.25))
    # ballonnen aan de tafel (finale)
    if 10 in gs:
        for x, y, kl in [(8, 376, '#FF6FAE'), (32, 362, '#FFC93C'), (56, 380, '#1FA3DC')]:
            o.append(use('s10-ballon', x, y, 28, 49, kl))
    # lage tafel met schaakbordje, taart en loep
    o.append(use('km-tafel', 14, 456, 128, 64))
    if st['levels']:
        o.append(schaakbord(20, 446, st['levels']))
    if 10 in gs:
        o.append(use('s10-taart', 80, 428, 38, 38))
    if 7 in gs:
        o.append(use('s7-loep', 112, 454, 26, 26))
    # tegels als stapeltjes in een honingraat vooraan rechts (achterste rij eerst)
    for sleutel, (cx, cy) in sorted(TEGEL_PLEK.items(), key=lambda kv: kv[1][1]):
        n = st['tegels'].get(sleutel, 0)
        if n > 0:
            k, f = sleutel.split('-')
            o.append(tegelstapel(cx, cy, k, f, n))
    return '\n'.join(o)


def kopbalk():
    return '''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Main.dc.html" aria-label="Terug naar de kalender" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">PINO'S KAMER</div>
      <div class="kop" style="font-size: 20px;">Mijn Kamer</div>
    </div>
  </div>'''


def scherm(st, wolk=None, titel='Pino’s kamer'):
    out = HEAD.format(title=titel) + DEFS
    out += '<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden;">'
    out += kopbalk()
    out += f'''
  <div style="margin: 12px 16px 0; height: 560px; border-radius: 22px; overflow: hidden; box-shadow: 0 6px 0 0 #CDE4F0; flex-shrink: 0;">
    <svg class="ic" viewBox="0 0 358 560" width="358" height="560" role="img" aria-label="Pino's kamer">
{kamer_scene(st)}
    </svg>
  </div>'''
    if wolk:
        icoon, naam, tekst = wolk
        out += f'''
  <div style="position: relative; margin: 22px 16px 0;">
    <span aria-hidden="true" style="position: absolute; left: 248px; top: -16px; width: 9px; height: 9px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 2px 0 0 #CDE4F0;"></span>
    <span aria-hidden="true" style="position: absolute; left: 238px; top: -6px; width: 14px; height: 14px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 2px 0 0 #CDE4F0;"></span>
    <div class="kaart" aria-live="polite" style="padding: 12px 16px; display: flex; gap: 14px; align-items: center;">
      <svg class="ic" viewBox="0 0 56 56" width="56" height="56" aria-hidden="true" style="flex-shrink: 0;">{icoon}</svg>
      <div style="display: flex; flex-direction: column; gap: 3px;">
        <div class="kop" style="font-size: 18px;">{naam}</div>
        <div style="font-size: 15px; line-height: 1.4; color: #35505F;">{tekst}</div>
      </div>
    </div>
  </div>'''
    out += '\n</div>' + TAIL % ('{"$preview":{"width":390,"height":844}}', '{}')
    return out


def sprites_blad():
    out = HEAD.format(title='Pino’s kamer – sprite-set') + DEFS
    out += '''<div class="vloer" style="width: 1000px; height: 560px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set Pino’s kamer</h1>
    <span class="stat-label">MEUBELS EN NIEUWE VOORWERPEN · DE REST KOMT UIT SPEL 1–10</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
    maten = {'km-plank': (150, 18), 'km-haak': (12, 14), 'km-kaptafel': (96, 130), 'km-nachtkastje': (44, 52), 'km-tafel': (128, 64),
             'km-spaarvarken': (40, 32), 'km-bordje': (60, 40), 'km-stetho': (48, 32), 'km-huisje': (48, 48), 'km-ster': (16, 16)}
    for sid in KAMER_IDS:
        w, h = maten[sid]
        z = 1.4 if max(w, h) <= 60 else 1.0
        out += f'<div class="vak"><svg class="ic" viewBox="0 0 {w} {h}" width="{w*z:.0f}" height="{h*z:.0f}">{use(sid, 0, 0, w, h)}</svg><span class="lbl">{sid}</span></div>'
    # de kamerknop op de Sim-kaart, met glinster-ster
    out += '''<div class="vak"><div style="position: relative; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 0 0 3px #1FA3DC, 0 4px 0 0 #CDE4F0; display: flex; align-items: center; justify-content: center;">
      <svg class="ic" viewBox="0 0 48 48" width="30" height="30">''' + use('km-huisje', 0, 0, 48, 48) + '''</svg>
      <svg class="ic" viewBox="0 0 16 16" width="16" height="16" style="position: absolute; right: -4px; top: -4px;">''' + use('km-ster', 0, 0, 16, 16) + '''</svg>
    </div><span class="lbl">kamerknop + ster</span></div>'''
    out += '''
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
    out += f'<div class="vak"><svg class="ic" viewBox="0 0 132 170" width="88" height="113">{foto("tan", 4, 4, 1.0)}</svg><span class="lbl">foto Tan</span></div>'
    out += f'<div class="vak"><svg class="ic" viewBox="0 0 132 170" width="88" height="113">{foto("nguyen", 4, 4, 1.0)}</svg><span class="lbl">foto Nguyễn</span></div>'
    out += f'<div class="vak"><svg class="ic" viewBox="0 0 132 170" width="88" height="113">{foto("somchai", 4, 4, 1.0)}</svg><span class="lbl">foto Somchai</span></div>'
    out += f'<div class="vak"><svg class="ic" viewBox="0 -8 60 48" width="90" height="72">{schaakbord(0, 0, [1, 2, 3, 4, 5])}</svg><span class="lbl">bordje, 5 levels</span></div>'
    out += f'<div class="vak"><svg class="ic" viewBox="0 0 48 72" width="48" height="72">{poppetje(6, 14, 1.2)}</svg><span class="lbl">poppetje</span></div>'
    out += f'<div class="vak"><svg class="ic" viewBox="0 0 48 56" width="72" height="84">{tegelstapel(24, 30, "groen", "vogel", 3, 40)}</svg><span class="lbl">tegelstapel (3)</span></div>'
    out += '''
  </div>
</div>''' + TAIL % ('{"$preview":{"width":1000,"height":560}}', '{}')
    return out


if __name__ == '__main__':
    tegel = tegelstapel(28, 30, 'groen', 'vogel', 1, 44)
    tekst = 'Een tegel met een mooie groene kleur en een witte vogel erop. Doet je denken aan een spel wat je eerder gespeeld hebt. Je hebt er 2.'
    (UIT / 'Kamer.dc.html').write_text(scherm(VOL, (tegel, 'Tegel', tekst), 'Pino’s kamer – vol'), encoding='utf-8')
    (UIT / 'Kamer-Leeg.dc.html').write_text(scherm(LEEG, None, 'Pino’s kamer – leeg'), encoding='utf-8')
    (UIT / 'Kamer-Sprites.dc.html').write_text(sprites_blad(), encoding='utf-8')
    print('ok')
