# Sprite-set spel 7 – Spot the peasant (fotoalbum met polaroids van spel 2 t/m 6) – poppenhuisstijl
from spel6_sprites import DEFS as DEFS6, use, persoon, kraam, lampion, pino, zakkenroller, pino_tas, bezoeker
from spel2_sprites import hex_gras, hex_tegel, hex_doel
from spel4_sprites import moeder_tan, vader_tan, meisje_tan, big_tan, pino_foto
EXTRA7='''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
  <!-- VERGROOTGLAS 48x48, VINK-BADGE 48x48, WERKER-STEMPEL (gevonden) en VRAAGTEKEN-WERKER (nog niet) 48x48 -->
  <symbol id="s7-loep" viewBox="0 0 48 48"><circle cx="20" cy="20" r="13" fill="#DDF1FB" stroke="#1E3A4C" stroke-width="5"/><path d="M30 30 L42 42" stroke="#1E3A4C" stroke-width="7" stroke-linecap="round"/><circle cx="16" cy="16" r="3" fill="#FFFFFF"/></symbol>
  <symbol id="s7-vink" viewBox="0 0 48 48"><circle cx="24" cy="26" r="22" fill="#1FA34A"/><circle cx="24" cy="23" r="21" fill="#39D353"/><path d="M13 24 L21 32 L36 15" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="s7-stempel" viewBox="0 0 48 48"><circle cx="24" cy="26" r="22" fill="#C9A77A"/><circle cx="24" cy="23" r="21" fill="#FFF1D6"/><circle cx="24" cy="23" r="17" fill="none" stroke="#C43B38" stroke-width="2" stroke-dasharray="4 3"/><use href="#werker" x="14" y="10" width="20" height="25"/></symbol>
  <symbol id="s7-vraag" viewBox="0 0 48 48"><circle cx="24" cy="26" r="22" fill="#8AA0AF"/><circle cx="24" cy="23" r="21" fill="#B8C9D6"/><g fill="#FFFFFF"><rect x="18" y="20" width="12" height="14" rx="3"/><circle cx="24" cy="14" r="6"/><path d="M14 13 h20 l-4 -5 h-12z"/></g><text x="24" y="31" text-anchor="middle" font-size="12" font-weight="700" fill="#8AA0AF" font-family="Fredoka, sans-serif">?</text></symbol>
  <!-- FOTOHOEKJES 24x24 (albumhoekjes, currentColor) -->
  <symbol id="s7-hoekje" viewBox="0 0 24 24"><path d="M0 0 h24 v24z" fill="currentColor"/></symbol>
</defs>
</svg>'''
DEFS=DEFS6+EXTRA7

# ---- mini-scènes 100x96 (passen in de fotorand van s4-polaroid op x8 y8) ----
def scene2():
    s='<rect width="100" height="96" fill="#8BD35A"/>'
    for r,cy in enumerate([22,44,66,88]):
        for c in range(5):
            cx=12+c*21+(10 if r%2 else 0)
            s+=hex_gras(cx,cy,24)
    s+=hex_tegel(33,44,'groen','boom',24)+hex_tegel(54,44,'geel','vlinder',24)+hex_tegel(43,66,'blauw','vogel',24)+hex_doel(64,66,24)
    s+=use('vijver',52,-2,52,44)+use('banaan',-6,52,40,36)
    return s
def scene3():
    return ('<rect width="100" height="96" fill="#DDF1FB"/><rect y="66" width="100" height="30" fill="#8BD35A"/><rect y="66" width="100" height="3" fill="rgba(0,0,0,0.08)"/>'
            +use('huis-villa',34,16,80,55)+persoon(4,34,'#9B6BFF','#E8B48A','bh-knot','#2B1A0E',jurk=True,acc=('acc-ketting',),s=0.6)
            +persoon(28,38,'#1E3A4C','#E8B48A','bh-kort','#2B1A0E',acc=('acc-hoed',),s=0.6))
def scene4():
    return ('<rect width="100" height="96" fill="#8ED8F8"/><rect y="30" width="100" height="26" fill="#1FA3DC"/><rect y="30" width="100" height="2" fill="#FFFFFF" opacity="0.7"/><rect y="56" width="100" height="40" fill="#FDE9B6"/><path d="M0 56 q25 -6 50 0 t50 0" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.85"/>'
            +use('s4-rots',6,12,40,26)+use('s4-boot',44,34,36,14)+use('s4-palm',-4,20,36,58)+use('s4-boog',50,42,46,46)
            +moeder_tan(10,62,0.42)+vader_tan(24,64,0.42)+pino_foto(72,66,0.42,flip=True))
def scene5():
    s='<rect width="100" height="96" fill="#556B8E"/>'
    for yy in range(0,96,16):
        for xx in range(0,100,16):
            off=8 if (yy//16)%2 else 0
            s+=f'<rect x="{xx+off+1}" y="{yy+1}" width="14" height="14" rx="3" fill="#4E6384"/>'
    s+='<path d="M0 12 q25 10 50 0 t50 0" fill="none" stroke="#8B4A1E" stroke-width="2"/>'
    s+=lampion(8,14,'#FF5E5B',0.5)+lampion(40,18,'#FFC93C',0.5)+lampion(72,14,'#FF8A3D',0.5)
    s+=f'<g transform="translate(2 22) scale(0.56)">{kraam("Mai",0,0)}</g>'
    s+=use('s5-put',62,34,36,42)+pino(26,56,'loop',0.5)
    return s
def scene6():
    s='<rect width="100" height="96" fill="#556B8E"/>'
    for yy in range(0,96,16):
        for xx in range(0,100,16):
            off=8 if (yy//16)%2 else 0
            s+=f'<rect x="{xx+off+1}" y="{yy+1}" width="14" height="14" rx="3" fill="#4E6384"/>'
    s+=lampion(14,6,'#FF5E5B',0.5)+lampion(70,8,'#FFC93C',0.5)
    s+=bezoeker(0,4,14,0.46)+bezoeker(2,30,10,0.46)+bezoeker(4,74,18,0.46)+bezoeker(1,8,56,0.5)+bezoeker(3,76,54,0.5)
    s+=zakkenroller(52,40,s=0.52)+pino_tas(30,36,0.52)+use('s6-tril',46,48,14,14)
    return s
SCENES={2:scene2,3:scene3,4:scene4,5:scene5,6:scene6}

def polaroid(nr, gevonden, x=0, y=0, rot=0):
    """Polaroid 120x140 met mini-scène; gevonden = vink + stempel, anders vervaagd + vraagteken-werker."""
    out=f'<g transform="translate({x} {y}) rotate({rot})">'+use('s4-polaroid',0,0,120,140)
    out+=f'<svg x="8" y="8" width="100" height="96" viewBox="0 0 100 96">{SCENES[nr]()}</svg>'
    if gevonden:
        out+=use('s7-stempel',70,100,34,34)+use('s7-vink',92,-8,30,30)
    else:
        out+='<rect x="8" y="8" width="100" height="96" fill="rgba(255,255,255,0.55)"/>'+use('s7-vraag',70,100,34,34)
    return out+'</g>'
