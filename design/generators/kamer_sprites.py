# Sprite-set Pino's kamer (specs/kamer.md, besluiten 201–206) – poppenhuisstijl
# Meubels en een paar losse voorwerpen; de rest van de kamer bestaat uit symbolen van spel 1–10.
# Muur en vloer zijn geen symbolen: die tekent de scène zelf (zoals de slaapzaal van spel 1).
from spel10_sprites import DEFS as DEFS10, use, pino
from spel3_sprites import dier, persoon
from spel2_sprites import hex_tegel
from spel4_sprites import (moeder_tan, vader_tan, meisje_tan, moeder_nguyen, vader_nguyen, meisje_nguyen,
                           moeder_somchai, vader_somchai, jongetje_somchai)

SCHADUW = 'rgba(30,58,76,0.18)'

EXTRA_KAMER = f'''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
  <!-- WANDPLANK 150x18 met twee steunen -->
  <symbol id="km-plank" viewBox="0 0 150 18"><rect x="0" y="0" width="150" height="6" rx="2" fill="#D98E55"/><rect x="0" y="5" width="150" height="6" rx="1.5" fill="#C2743C"/><path d="M14 11 h10 l-10 7z M126 11 h10 v7z" fill="#8B4A1E"/></symbol>
  <!-- HAAKJE 12x14 -->
  <symbol id="km-haak" viewBox="0 0 12 14"><circle cx="6" cy="4" r="4" fill="#C2743C"/><circle cx="5" cy="3" r="1.5" fill="#D98E55"/><path d="M6 6 v4 q0 3 3 3 q2 0 2 -3" fill="none" stroke="#8B4A1E" stroke-width="2" stroke-linecap="round"/></symbol>
  <!-- KAPTAFEL 96x130: ronde spiegel op een tafeltje met twee laatjes -->
  <symbol id="km-kaptafel" viewBox="0 0 96 130"><ellipse cx="48" cy="127" rx="44" ry="3" fill="{SCHADUW}"/>
    <rect x="44" y="58" width="8" height="16" fill="#C2743C"/>
    <ellipse cx="48" cy="32" rx="30" ry="32" fill="#D98E55"/><ellipse cx="51" cy="34" rx="27" ry="29" fill="#C2743C"/><ellipse cx="48" cy="32" rx="23" ry="25" fill="#DDF1FB"/>
    <path d="M34 22 q6 -12 18 -13 l-14 26z" fill="#FFFFFF" opacity="0.7"/><path d="M58 44 l4 -8 v10z" fill="#FFFFFF" opacity="0.5"/>
    <rect x="2" y="72" width="92" height="10" rx="3" fill="#D98E55"/><rect x="6" y="80" width="84" height="30" fill="#C2743C"/>
    <rect x="11" y="85" width="35" height="19" rx="2" fill="#D98E55"/><rect x="50" y="85" width="35" height="19" rx="2" fill="#D98E55"/>
    <circle cx="28.5" cy="94.5" r="2.2" fill="#8B4A1E"/><circle cx="67.5" cy="94.5" r="2.2" fill="#8B4A1E"/>
    <rect x="10" y="110" width="7" height="17" rx="1.5" fill="#8B4A1E"/><rect x="79" y="110" width="7" height="17" rx="1.5" fill="#8B4A1E"/></symbol>
  <!-- NACHTKASTJE 44x52 -->
  <symbol id="km-nachtkastje" viewBox="0 0 44 52"><ellipse cx="22" cy="50" rx="20" ry="2.5" fill="{SCHADUW}"/>
    <rect x="0" y="0" width="44" height="9" rx="2.5" fill="#D98E55"/><rect x="3" y="8" width="38" height="34" fill="#C2743C"/>
    <rect x="7" y="12" width="30" height="12" rx="2" fill="#D98E55"/><rect x="7" y="27" width="30" height="12" rx="2" fill="#D98E55"/>
    <circle cx="22" cy="18" r="1.8" fill="#8B4A1E"/><circle cx="22" cy="33" r="1.8" fill="#8B4A1E"/>
    <rect x="5" y="42" width="5" height="8" fill="#8B4A1E"/><rect x="34" y="42" width="5" height="8" fill="#8B4A1E"/></symbol>
  <!-- LAGE TAFEL 128x64 (bovenblad schuin van boven gezien) -->
  <symbol id="km-tafel" viewBox="0 0 128 64"><ellipse cx="64" cy="61" rx="60" ry="3" fill="{SCHADUW}"/>
    <rect x="26" y="30" width="7" height="22" fill="#8B4A1E"/><rect x="95" y="30" width="7" height="22" fill="#8B4A1E"/>
    <rect x="0" y="0" width="128" height="32" rx="7" fill="#D98E55"/><path d="M12 10 h56 M40 20 h64" stroke="#C2743C" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <rect x="0" y="26" width="128" height="9" rx="3" fill="#C2743C"/>
    <rect x="8" y="34" width="8" height="26" rx="1.5" fill="#8B4A1E"/><rect x="112" y="34" width="8" height="26" rx="1.5" fill="#8B4A1E"/></symbol>
  <!-- SPAARVARKEN 40x32 met een munt in de gleuf -->
  <symbol id="km-spaarvarken" viewBox="0 0 40 32"><ellipse cx="20" cy="30" rx="14" ry="2" fill="{SCHADUW}"/>
    <rect x="9" y="22" width="5" height="7" rx="1.5" fill="#FF6FAE"/><rect x="25" y="22" width="5" height="7" rx="1.5" fill="#FF6FAE"/>
    <path d="M5 15 q-4 -1 -3 -5 q1 -2 3 0" fill="none" stroke="#FF6FAE" stroke-width="1.6" stroke-linecap="round"/>
    <ellipse cx="20" cy="16" rx="15" ry="11" fill="#FF9BC8"/><path d="M20 27 a15 11 0 0 0 15 -11 h-6 a9 8 0 0 1 -9 8z" fill="#FF6FAE" opacity="0.55"/>
    <path d="M22 7 l4 -6 l3 7z" fill="#FF6FAE"/><ellipse cx="34.5" cy="17" rx="4" ry="3.5" fill="#FF6FAE"/><circle cx="33.5" cy="17" r="0.9" fill="#B23A6A"/><circle cx="35.8" cy="17" r="0.9" fill="#B23A6A"/>
    <circle cx="28.5" cy="12.5" r="1.4" fill="#1E3A4C"/><ellipse cx="27" cy="17" rx="2" ry="1.2" fill="#FF6FAE"/>
    <rect x="12" y="5" width="9" height="2.4" rx="1.2" fill="#B23A6A"/><rect x="14" y="0" width="5" height="6" rx="1.5" fill="#FFC93C"/><rect x="17" y="0" width="2" height="6" rx="1" fill="#D97A00"/></symbol>
  <!-- SCHAAKBORDJE 60x40: 4x4 vakken in de kleuren van spel 8, met een rand -->
  <symbol id="km-bordje" viewBox="0 0 60 40"><ellipse cx="30" cy="38" rx="28" ry="2" fill="{SCHADUW}"/>
    <rect x="0" y="26" width="60" height="8" rx="2" fill="#2E7D1E"/><rect x="0" y="0" width="60" height="30" rx="3" fill="#3D7A30"/>
    ''' + ''.join(f'<rect x="{4+c*13}" y="{3+r*6}" width="13" height="6" fill="{"#D9CFA8" if (r+c)%2==0 else "#8AA66E"}"/>' for r in range(4) for c in range(4)) + f'''</symbol>
  <!-- STETHOSCOOP 48x32, liggend -->
  <symbol id="km-stetho" viewBox="0 0 48 32"><ellipse cx="24" cy="29" rx="20" ry="2.5" fill="{SCHADUW}"/>
    <path d="M8 4 v8 a8 8 0 0 0 16 0 v-8" fill="none" stroke="#2F3A4A" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M16 20 q2 8 12 6 q6 -1 8 -5" fill="none" stroke="#2F3A4A" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="8" cy="4" r="2.2" fill="#B8C4D0"/><circle cx="24" cy="4" r="2.2" fill="#B8C4D0"/>
    <circle cx="40" cy="19" r="6.5" fill="#B8C4D0" stroke="#2F3A4A" stroke-width="1.5"/><circle cx="39" cy="18" r="3" fill="#DDE7EE"/></symbol>
  <!-- KAMERKNOP-ICOON 48x48 (huisje) en GLINSTER-STER 16x16 voor op de knop -->
  <symbol id="km-huisje" viewBox="0 0 48 48"><rect x="10" y="22" width="28" height="20" rx="2" fill="#FFF1D6"/><rect x="31" y="22" width="7" height="20" fill="#FFE08A"/>
    <path d="M5 24 L24 7 L43 24 L39 27 L24 13.5 L9 27z" fill="#FF6FAE"/><path d="M24 7 L43 24 L39 27 L24 13.5z" fill="#B23A6A"/>
    <rect x="15" y="28" width="9" height="14" rx="1.5" fill="#D98E55"/><circle cx="21.5" cy="35.5" r="1.1" fill="#8B4A1E"/><rect x="27" y="27" width="8" height="7" rx="1.5" fill="#8ED8F8"/>
    <rect x="8" y="41" width="32" height="3" rx="1.5" fill="#C2743C"/></symbol>
  <symbol id="km-ster" viewBox="0 0 16 16"><path d="M8 0.8 l2 4.6 5 0.5 -3.8 3.3 1.1 4.9 -4.3 -2.6 -4.3 2.6 1.1 -4.9 -3.8 -3.3 5 -0.5z" fill="#FFC93C" stroke="#D97A00" stroke-width="1.2" stroke-linejoin="round"/></symbol>
</defs>
</svg>'''

DEFS = DEFS10 + EXTRA_KAMER

KAMER_IDS = ['km-plank', 'km-haak', 'km-kaptafel', 'km-nachtkastje', 'km-tafel', 'km-spaarvarken', 'km-bordje', 'km-stetho', 'km-huisje', 'km-ster']

# ---------- samengestelde voorwerpen (bouwstenen voor de scène en voor kamer.js) ----------

HUIS = {'tan': 'huis-paal', 'nguyen': 'huis-villa', 'somchai': 'huis-shop'}
TEGEL_KLEUR = ['groen', 'geel', 'blauw']
TEGEL_FIGUUR = ['vlinder', 'boom', 'vogel']
GEM_KLEUR = {'groen': '#39D353', 'blauw': '#5BC0EB', 'rood': '#FF5E5B'}
LEVEL_STUK = {1: 'python', 2: 'tijger', 3: 'luiaard', 4: 'leeuw', 5: 'krokodil'}


def g(x, y, s=1.0, inhoud='', rot=0):
    r = f' rotate({rot})' if rot else ''
    return f'<g transform="translate({x} {y}) scale({s}){r}">{inhoud}</g>'


def tegelstapel(cx, cy, kleur, figuur, aantal, s=34):
    """Een stapeltje tegels (hooguit drie getekend) met het midden van het bovenvlak op (cx, cy)."""
    out = ''
    for i in range(min(3, max(1, aantal)) - 1, -1, -1):
        out += hex_tegel(cx, cy - i * 3.5, kleur, figuur, s)
    return out


def foto_achtergrond(familie):
    """De omgeving uit spel 4 in het fotovlak (100x96 op 8,8 in s4-polaroid)."""
    lucht = '<rect x="8" y="8" width="100" height="96" fill="#8ED8F8"/>'
    if familie == 'tan':     # tropisch strand
        return lucht + '<circle cx="90" cy="22" r="8" fill="#FFE08A"/><rect x="8" y="58" width="100" height="12" fill="#1FA3DC"/><rect x="8" y="68" width="100" height="36" fill="#FDE9B6"/>'
    if familie == 'nguyen':  # uitzichtpunt op een berg
        return lucht + '<path d="M8 70 l26 -34 l22 26 l20 -30 l32 38 v8 h-100z" fill="#5FB05A"/><path d="M56 62 l20 -30 l8 10 l-14 26z" fill="#4E9A3E"/><rect x="8" y="76" width="100" height="28" fill="#8BD35A"/>'
    # somchai: dagmarkt met parasols
    return lucht + '<path d="M8 40 h50 l-6 12 h-38z" fill="#FF5E5B"/><path d="M58 40 h50 v12 h-56z" fill="#FFC93C"/><rect x="8" y="76" width="100" height="28" fill="#F2CF8A"/>'


def foto(familie, x, y, s=0.36, rot=0):
    """Polaroid met de familie zoals Pino ze in spel 4 fotografeerde."""
    leden = {
        'tan': moeder_tan(12, 30, 0.78) + vader_tan(42, 28, 0.78) + meisje_tan(70, 46, 0.78) + dier(74, 80, 'biggetje', 0.5),
        'nguyen': moeder_nguyen(12, 30, 0.78) + vader_nguyen(42, 28, 0.78) + meisje_nguyen(70, 46, 0.78) + dier(74, 80, 'gansje', 0.5),
        'somchai': moeder_somchai(12, 30, 0.78) + vader_somchai(42, 28, 0.78) + jongetje_somchai(70, 46, 0.78) + dier(74, 80, 'lam', 0.5),
    }[familie]
    clip = f'kmfoto-{familie}'
    inhoud = (use('s4-polaroid', 0, 0, 120, 140) + f'<clipPath id="{clip}"><rect x="8" y="8" width="100" height="96"/></clipPath>'
              + f'<g clip-path="url(#{clip})">' + foto_achtergrond(familie) + leden + '</g>')
    return g(x, y, s, inhoud, rot)


def poppetje(x, y, s=0.5):
    """Het meisje uit spel 3 als poppetje (zelfde uiterlijk als op de kaart: blauwe jurk, blond lang haar)."""
    return persoon(x, y, '#5BC0EB', '#E8B48A', 'bh-lang', '#FFC93C', jurk=True, kind=True, s=s)


def schaakbord(x, y, levels, s=1.0):
    """Bordje met een stuk per gehaald level (python, tijger, luiaard, leeuw, krokodil)."""
    out = use('km-bordje', 0, 0, 60, 40)
    # Voetpunt (midden van de voet) per level, op de vakjes van het bord (vakjes y 3-27): zigzag voor/achter.
    # Het stuk (15x19) heeft zijn voetmidden op (7.5, 16.5). Achterste stukken eerst tekenen.
    plekken = [(9.5, 24), (20, 13), (30.5, 24), (41, 13), (51, 24)]
    for lv in sorted(levels, key=lambda lv: (plekken[lv - 1][1], lv)):
        vx, vy = plekken[lv - 1]
        out += use(f's8-stuk-{LEVEL_STUK[lv]}', vx - 7.5, vy - 16.5, 15, 19)
    return g(x, y, s, out)
