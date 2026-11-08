# Bouwt Spel4.dc.html, Spel4-Klaar.dc.html en Spel4-Sprites.dc.html in poppenhuisstijl
from spel4_sprites import DEFS, use, moeder_tan, vader_tan, meisje_tan, big_tan, pino_foto, sil
HEAD='''<!doctype html>
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
a{{color:#1E3A4C;text-decoration:none}}a:hover{{color:#0E7FB5}}
.kop{{font-family:'Fredoka',sans-serif;font-weight:700;line-height:1.1}}
.ic{{display:block}}
.vloer{{background-image:repeating-linear-gradient(30deg,rgba(255,255,255,0.38) 0 2px,transparent 2px 40px),repeating-linear-gradient(150deg,rgba(255,255,255,0.38) 0 2px,transparent 2px 40px)}}
.kaart{{background:#FFFFFF;border-radius:22px;box-shadow:0 6px 0 0 #CDE4F0,0 12px 24px rgba(30,58,76,0.12)}}
.stat-label{{font-size:11px;font-weight:800;color:#4F6B7E;letter-spacing:0.5px}}
.film{{flex:1;height:64px;border-radius:12px;background:#F3F8FB;border:3px dashed #B8C9D6;box-sizing:border-box;display:flex;align-items:flex-end;justify-content:center;gap:2px;padding-bottom:8px}}
.film-actief{{border-style:solid;border-color:#1FA3DC;background:#DDF1FB;box-shadow:0 0 0 3px rgba(31,163,220,0.3)}}
.knop{{font-family:'Nunito',sans-serif;font-weight:800;font-size:18px;border-radius:999px;border:0;cursor:pointer;min-height:54px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:8px}}
.tegel{{display:flex;flex-direction:column;align-items:center;gap:4px;background:#F3F8FB;border-radius:16px;padding:12px 8px}}
.tegel-label{{font-size:11px;font-weight:800;color:#4F6B7E;letter-spacing:0.5px}}
.lbl{{font-size:12px;font-weight:800;color:#4F6B7E;text-align:center}}
.vak{{display:flex;flex-direction:column;align-items:center;gap:6px}}
</style>
</helmet>
'''
TAIL='''
</x-dc>
<script type="text/x-dc" data-dc-script data-props='%s'>
class Component extends DCLogic {
  renderVals() { return %s; }
}
</script>
</body>
</html>
'''
def g(x,y,inner,s=1.0): return f'<g transform="translate({x} {y}) scale({s})">{inner}</g>'

# ---------- de strandscène (358 x 670), tekenvolgorde achter → voor ----------
def strand(zoeker=True):
    s=''
    # lucht
    s+='<rect x="0" y="0" width="358" height="200" fill="#8ED8F8"/>'
    s+=use('s4-zon',266,22,60,60)
    s+=use('s4-wolk',22,42,96,36)+use('s4-wolk',176,78,66,25)
    s+=use('s4-meeuw',112,116,24,12)+use('s4-meeuw',140,104,20,10)+use('s4-meeuw',62,130,16,8)
    # zee (ver → dichtbij), schaduwtint onderaan
    s+='<rect x="0" y="152" width="358" height="150" fill="#1FA3DC"/>'
    s+='<rect x="0" y="152" width="358" height="5" fill="#FFFFFF" opacity="0.7"/>'
    s+='<rect x="0" y="268" width="358" height="34" fill="#0E7FB5"/>'
    s+='<path d="M30 206 h54 M150 232 h40 M60 250 h36 M240 200 h30" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity="0.7"/>'
    s+=use('s4-rots',12,96,130,86)+use('s4-rots',196,124,84,56)
    s+=use('s4-pier',268,160,80,140)
    s+=use('s4-boot',118,222,112,45)
    # zand met branding (golvende zoom)
    s+='<path d="M0 302 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v368 h-358z" fill="#F2CF8A"/>'
    s+='<path d="M0 296 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v8 q-30 10 -60 0 t-60 0 t-60 0 t-60 0 t-60 0 t-60 0z" fill="#FFFFFF" opacity="0.85"/>'
    s+='<path d="M0 316 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 v354 h-358z" fill="#FDE9B6"/>'
    s+='<path d="M0 316 q30 -10 60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#F2CF8A" stroke-width="3"/>'
    # zandstippen, schelpen
    s+='<g fill="#F2CF8A"><circle cx="70" cy="380" r="4"/><circle cx="150" cy="470" r="4"/><circle cx="300" cy="600" r="4"/><circle cx="40" cy="640" r="4"/><circle cx="220" cy="650" r="3"/><circle cx="330" cy="400" r="3"/></g>'
    s+=use('s4-schelp',58,452,18,16)+use('s4-schelp',322,560,16,14)+use('s4-zeester',200,610,20,20)
    # verstopte werker (spel 7), half achter de palmstam
    s+=use('werker',38,314,16,20)
    # rekwisieten op het zand (achter → voor)
    s+=use('s4-palm',4,194,80,130)
    s+=use('s4-kraam',232,322,120,100)
    s+=use('s4-boog',112,300,130,130)
    s+=use('s4-bank',20,398,84,48)
    s+=use('s4-parasol',288,436,72,84)
    s+=use('s4-handdoek',262,520,80,44)
    s+=use('s4-bal',92,466,32,32)
    # familie Tan loopt over het strand; Pino met de camera
    s+=moeder_tan(30,522)+vader_tan(78,530)+meisje_tan(124,552)+big_tan(166,572)
    s+=pino_foto(236,552,flip=True)
    if zoeker: s+=use('s4-zoeker',104,296,146,140)
    return s

SCENE_LBL=('Tropisch strand in driekwartaanzicht: zee met kalksteenrotsen, longtailboot en pier, zand met palmboom, '
           'fruitkraam met rieten dak, bankje, bloemenboog met lampion, parasol en handdoek. Familie Tan loopt over het strand; '
           'Pino staat rechts met het fototoestel. De zoeker staat op de bloemenboog gericht.')

def kopbalk(film):
    return f'''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 4 · 27 NOVEMBER</div>
      <div class="kop" style="font-size: 20px;">(Social)ize the family</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px 6px 9px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="Filmrolletje: {film} opnames over">
      <svg class="ic" viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">{use('s4-film',0,0,48,48)}</svg>
      <span class="kop" style="font-size: 18px; color: #0E6A98;">{{{{film}}}}</span>
    </div>
  </div>'''

def filmstrook():
    f1=f'<svg class="ic" viewBox="0 0 96 32" width="84" height="28" aria-hidden="true">{sil(0,0,"moeder","#0E7FB5")}{sil(24,0,"vader","#0E7FB5")}{sil(48,0,"kind","#0E7FB5")}{sil(72,0,"big","#0E7FB5")}</svg>'
    f2=f'<svg class="ic" viewBox="0 0 24 32" width="24" height="32" aria-hidden="true">{sil(0,0,"moeder","#B8C9D6")}</svg>'
    f3=f'<svg class="ic" viewBox="0 0 24 32" width="24" height="32" aria-hidden="true">{sil(0,0,"vader","#B8C9D6")}</svg>'
    return f'''
  <div style="padding: 12px 16px 16px; display: flex; align-items: center; gap: 12px;">
    <div style="flex: 1; display: flex; gap: 8px;" role="group" aria-label="Filmstrook met drie foto's">
      <div class="film film-actief" aria-label="Foto 1: het hele gezin, nu aan de beurt">{f1}</div>
      <div class="film" aria-label="Foto 2: moeder, nog te maken">{f2}</div>
      <div class="film" aria-label="Foto 3: vader, nog te maken">{f3}</div>
    </div>
    <button type="button" aria-label="Maak de foto" style="width: 76px; height: 76px; border-radius: 50%; border: 5px solid #1E3A4C; background: #FFFFFF; box-shadow: 0 6px 0 0 #CDE4F0, 0 10px 18px rgba(30,58,76,0.25); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; box-sizing: border-box;">
      <svg class="ic" viewBox="0 0 48 36" width="38" height="29" aria-hidden="true">{use('s4-camera',0,0,48,36)}</svg>
    </button>
  </div>'''

# ---------- Spel4 ----------
html=HEAD.format(title='Spel 4 – (Social)ize the family')+DEFS
html+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'
html+=kopbalk(10)
html+=f'''
  <!-- Vakantie-illustratie (poppenhuisstijl) -->
  <div role="img" aria-label="{SCENE_LBL}" style="position: relative; margin: 12px 16px 0; flex: 1; border-radius: 22px; background: #8ED8F8; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 670" width="358" height="670" aria-hidden="true">{strand()}</svg>
  </div>'''
html+=filmstrook()
html+='</div>'
html+=TAIL%('{"film":{"editor":"int","default":10,"min":0,"max":24,"section":"Spelstand"},"$preview":{"width":390,"height":844}}',
            '{ film: this.props.film ?? 10 }')
open('pino/project/Spel4.dc.html','w').write(html)

# ---------- Spel4-Klaar: drie polaroids ----------
def polaroid(x,y,rot,inner,lab):
    return f'''<g transform="translate({x} {y}) rotate({rot})" role="img" aria-label="{lab}">{use('s4-polaroid',0,0,120,140)}
      <svg x="8" y="8" width="100" height="96" viewBox="0 0 100 96">{inner}</svg></g>'''
foto1=('<rect width="100" height="96" fill="#FDE9B6"/><rect width="100" height="22" fill="#8ED8F8"/><rect y="22" width="100" height="8" fill="#1FA3DC"/>'
       + use('s4-boog',8,6,84,84) + moeder_tan(14,34,0.62)+vader_tan(38,36,0.62)+meisje_tan(60,48,0.62)+big_tan(74,60,0.62))
foto2=('<rect width="100" height="96" fill="#1FA3DC"/><rect width="100" height="30" fill="#8ED8F8"/>'+use('s4-rots',-6,2,60,40)
       + use('s4-pier',24,22,52,90)+moeder_tan(30,36,0.66))
foto3=('<rect width="100" height="96" fill="#FDE9B6"/><rect width="100" height="18" fill="#8ED8F8"/>'
       + use('s4-kraam',12,8,88,74)+vader_tan(18,40,0.66))
klaar=HEAD.format(title='Spel 4 – resultaat')+DEFS
klaar+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">

  <!-- confetti -->
  <div aria-hidden="true" style="position: absolute; left: 30px; top: 60px; width: 10px; height: 10px; border-radius: 3px; background: #FF6FAE; box-shadow: 70px 30px 0 0 #FFC93C, 140px -10px 0 0 #39D353, 220px 24px 0 0 #9B6BFF, 290px 4px 0 0 #1FA3DC, 330px 50px 0 0 #FF6FAE, 100px 90px 0 0 #1FA3DC, 250px 80px 0 0 #FFC93C;"></div>

  <div class="kaart" style="width: 100%; border-radius: 26px; padding: 0 22px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; margin-top: 30px;">

    <div style="width: 128px; height: 128px; border-radius: 50%; background: #DDF1FB; border: 6px solid #FFFFFF; box-shadow: 0 0 0 3px #1FA3DC, 0 8px 18px rgba(30,58,76,0.18); box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin-top: -50px;">
      <svg class="ic" viewBox="0 0 48 72" width="60" height="90" role="img" aria-label="Pino met het fototoestel">{pino_foto(0,0)}</svg>
    </div>

    <div style="font-size: 12px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">(SOCIAL)IZE THE FAMILY · KLAAR</div>
    <h1 class="kop" style="margin: 0; font-size: 30px;">Drie plaatjes voor het album!</h1>

    <!-- de drie polaroids -->
    <svg class="ic" viewBox="0 0 340 170" width="340" height="170" style="margin: 0 -10px;">
      {polaroid(14,18,-6,foto1,'Foto 1: het hele gezin onder de bloemenboog')}
      {polaroid(118,8,2,foto2,'Foto 2: moeder op de pier')}
      {polaroid(222,20,7,foto3,'Foto 3: vader bij de fruitkraam')}
    </svg>

    <!-- scoretegels -->
    <div style="width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
      <div class="tegel"><span class="tegel-label">FOTO'S</span><span class="kop" style="font-size: 26px; color: #1F7A3A;">3/3</span></div>
      <div class="tegel"><span class="tegel-label">VERDIEND</span><span style="display:flex;align-items:center;gap:4px;"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true">{use('s4-munt',0,0,48,48)}</svg><span class="kop" style="font-size: 26px; color: #9A5B00;">60</span></span></div>
      <div class="tegel"><span class="tegel-label">MISKLIKS</span><span class="kop" style="font-size: 26px; color: #C43B38;">4</span></div>
    </div>

    <!-- beloning -->
    <div style="width: 100%; display: flex; align-items: center; gap: 12px; background: #F1E8FF; border-radius: 16px; padding: 12px 14px; box-sizing: border-box; text-align: left;">
      <div style="width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg class="ic" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><path d="M8 12 h32 v18 a4 4 0 0 1 -4 4 h-14 l-8 7 v-7 h-2 a4 4 0 0 1 -4 -4z" fill="#6B3FCF"/><circle cx="18" cy="22" r="2.5" fill="#FFFFFF"/><circle cx="24" cy="22" r="2.5" fill="#FFFFFF"/><circle cx="30" cy="22" r="2.5" fill="#FFFFFF"/></svg>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <div style="font-size: 12px; font-weight: 800; color: #6B3FCF; letter-spacing: 0.5px;">VAARDIGHEID VERDIEND</div>
        <div style="font-size: 16px; font-weight: 800;">Charisma +1 <span style="font-weight: 700; color: #4F6B7E;">· Behoefte "Verjaardag" +10%</span></div>
      </div>
    </div>

    <div style="width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">
      <a href="Main.dc.html" class="knop" style="background: #39D353; color: #0E3D1C; box-shadow: 0 5px 0 0 #1FA34A;">Terug naar de kalender</a>
      <a href="Spel4.dc.html" class="knop" style="background: #E6EFF5; color: #4F6B7E; box-shadow: 0 5px 0 0 #CDE4F0;">Nog een keer</a>
    </div>
  </div>
</div>'''
klaar+=TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel4-Klaar.dc.html','w').write(klaar)

# ---------- sprite sheet ----------
sheet=HEAD.format(title='Spel 4 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 720px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 4 · (Social)ize the family</h1>
    <span class="stat-label">FAMILIE TAN UIT SPEL 3 (ZELFDE SYMBOLEN) · PINO MET CAMERA · STRAND-REKWISIETEN IN DRIEKWART · SILHOUETTEN VIA currentColor</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">PERSONEN · FAMILIE TAN + PINO (POSE "FOTO") · SILHOUETTEN VOOR DE FILMSTROOK · ZOEKER · TELLERS</span>
    <div style="display: flex; gap: 18px; align-items: flex-end; flex-wrap: wrap;">'''
for lab,p in [('moeder Tan',moeder_tan(0,0)),('vader Tan',vader_tan(0,0)),('meisje Tan',meisje_tan(0,20)),('biggetje',big_tan(0,32)),('Pino met camera',pino_foto(0,0))]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="56" height="98">{p}</svg><span class="lbl">{lab}</span></div>'
sheet+='<span style="width:16px"></span>'
for lab,w in [('moeder','moeder'),('vader','vader'),('kind','kind'),('big','big')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 24 32" width="30" height="40">{sil(0,0,w,"#0E7FB5")}</svg><span class="lbl">sil. {lab}</span></div>'
sheet+='<span style="width:16px"></span>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 146 140" width="88" height="84" style="background:#1FA3DC;border-radius:8px">{use("s4-zoeker",0,0,146,140)}</svg><span class="lbl">zoeker</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44">{use("s4-film",0,0,48,48)}</svg><span class="lbl">filmrol</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44">{use("s4-munt",0,0,48,48)}</svg><span class="lbl">munt §</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 36" width="48" height="36">{use("s4-camera",0,0,48,36)}</svg><span class="lbl">camera</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44" style="background:#1FA3DC;border-radius:8px">{use("s4-flits",0,0,48,48)}</svg><span class="lbl">flits</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 16 20" width="24" height="30">{use("werker",0,0,16,20)}</svg><span class="lbl">werker</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">REKWISIETEN · ZEE EN STRAND, LICHT VAN LINKSBOVEN</span>
    <div style="display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
for lab,id,w,h,sc,bg in [('kalksteenrots','s4-rots',120,80,1.0,'#1FA3DC'),('longtailboot','s4-boot',120,48,1.0,'#1FA3DC'),('pier','s4-pier',80,140,0.75,'#1FA3DC'),
                        ('palm','s4-palm',80,130,0.85,''),('fruitkraam','s4-kraam',120,100,1.0,''),('bloemenboog','s4-boog',130,130,0.85,''),
                        ('bankje','s4-bank',84,48,1.0,''),('parasol','s4-parasol',72,84,1.0,''),('handdoek','s4-handdoek',80,44,1.0,''),
                        ('strandbal','s4-bal',32,32,1.2,''),('zon','s4-zon',64,64,0.8,''),('wolk','s4-wolk',96,36,0.8,'#8ED8F8'),('polaroid','s4-polaroid',120,140,0.72,'')]:
    st=f' style="background:{bg};border-radius:8px"' if bg else ''
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 {w} {h}" width="{w*sc:.0f}" height="{h*sc:.0f}"{st}>{use(id,0,0,w,h)}</svg><span class="lbl">{lab}</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":720}}','{}')
open('pino/project/Spel4-Sprites.dc.html','w').write(sheet)
print('ok')

# ======================================================================================
# Berg (familie Nguyễn) en dagmarkt (familie Somchai) – besluit 44. Zelfde opbouw en posities als
# advent/js/spellen/decor4.js en fotos.js: de familie staat lachend op haar fotoplekken, de zoeker op de ouders.
# ======================================================================================
from spel4_sprites import (moeder_nguyen, vader_nguyen, meisje_nguyen, moeder_somchai, vader_somchai,
                           jongetje_somchai, dier_moment)

def voet(x,y,soort):
    # voetpunt -> linksboven van het 48x72-frame (kind x0,72), zoals lidTekening() in spel4.js
    if soort=='kind': return (x-24*0.72, y-71*0.72)
    if soort=='dier': return (x-24, y-38)
    return (x-24, y-71)

def berg(zoeker=True):
    s='<rect x="0" y="0" width="358" height="340" fill="#8ED8F8"/>'
    s+=use('s4-zon',34,30,54,54)+use('s4-wolk',150,36,96,36)+use('s4-wolk',268,92,66,25)
    s+=use('s4-meeuw',120,110,22,11)+use('s4-meeuw',96,124,16,8)
    s+=use('s4-bergen',0,140,358,190)
    s+=use('s4-rotspunt',230,268,120,64)
    s+='<rect x="0" y="322" width="246" height="5" fill="#A7B2BC"/><rect x="334" y="322" width="24" height="5" fill="#7D8A96"/>'
    s+='<rect x="0" y="326" width="358" height="344" fill="#8BD35A"/>'
    s+='<rect x="0" y="326" width="246" height="5" fill="#5FB05A"/><rect x="334" y="326" width="24" height="5" fill="#5FB05A"/>'
    s+='<g fill="#9ADB7A"><ellipse cx="70" cy="400" rx="44" ry="12"/><ellipse cx="250" cy="500" rx="54" ry="14"/><ellipse cx="120" cy="640" rx="60" ry="14"/><ellipse cx="320" cy="610" rx="40" ry="10"/></g>'
    s+='<path d="M44 676 Q70 566 150 520 T126 372" fill="none" stroke="#F2CF8A" stroke-width="40" stroke-linecap="round"/>'
    s+='<path d="M44 676 Q70 566 150 520 T126 372" fill="none" stroke="#FDE9B6" stroke-width="32" stroke-linecap="round"/>'
    s+=use('s4-trap',4,628,90,50)+use('s4-ijsje',262,552,35,25)
    # rekwisieten en familie, gesorteerd op voet-y (achter -> voor)
    x,y=voet(290,294,'kind'); s+=meisje_nguyen(x,y,gezicht='b-lach')
    s+=use('s4-hek',12,290,200,52)
    x,y=voet(88,364,'v'); s+=moeder_nguyen(x,y,gezicht='b-lach')
    x,y=voet(134,364,'v'); s+=vader_nguyen(x,y,gezicht='b-lach')
    s+=use('s4-den',300,330,54,96)
    s+=use('werker',206,432,16,20)+use('s4-kijker',186,388,44,72)
    s+=use('s4-struik',290,436,56,36)+use('s4-bank',20,430,84,48)
    x,y=voet(250,568,'dier'); s+=dier_moment(x,y,'gansje')
    s+=use('s4-wegwijzer',36,520,44,70)+use('s4-struik',128,600,56,36)
    s+=pino_foto(306,579,flip=True)
    if zoeker: s+=use('s4-zoeker',44,280,136,100)
    return s

def markt(zoeker=True):
    s='<rect x="0" y="0" width="358" height="140" fill="#8ED8F8"/>'
    s+=use('s4-wolk',40,18,80,30)+use('s4-wolk',236,40,66,25)
    s+=use('s4-gevels',0,86,358,210)
    s+='<rect x="0" y="290" width="358" height="14" fill="#DDE7EE"/><rect x="0" y="300" width="358" height="4" fill="#CFD8DC"/>'
    s+='<rect x="0" y="304" width="358" height="366" fill="#EADFC4"/>'
    lijnen=' '.join([f'M0 {y} H358' for y in range(336,670,38)]+[f'M{x} 304 L{x+70} 670' for x in range(-120,400,46)])
    s+=f'<path d="{lijnen}" stroke="#DCCFAE" stroke-width="2"/>'
    s+=use('werker',258,430,16,20)+use('s4-kratten',262,374,80,84)
    x,y=voet(302,386,'kind'); s+=jongetje_somchai(x,y,gezicht='b-lach')
    s+=use('s4-bloemkraam',22,284,130,110)
    x,y=voet(70,416,'v'); s+=moeder_somchai(x,y,gezicht='b-lach')
    x,y=voet(114,416,'v'); s+=vader_somchai(x,y,gezicht='b-lach')
    s+=use('s4-ton',192,420,36,48)+use('s4-manden',16,470,90,60)
    s+=use('s4-groentekraam',214,500,130,100)
    x,y=voet(168,624,'dier'); s+=dier_moment(x,y,'lam')
    s+=use('s4-kool',190,604,24,20)+use('s4-bank',24,588,84,48)
    s+=pino_foto(276,581,flip=True)
    if zoeker: s+=use('s4-zoeker',26,290,146,136)
    return s

def filmstrook2(dier):
    def vak(inner,w):
        return f'<div class="film"><svg class="ic" viewBox="0 0 {w} 32" width="{w}" height="32" aria-hidden="true">{inner}</svg></div>'
    grijs='#9DB4C4'
    return f'''
  <div style="padding: 10px 16px 18px; display: flex; gap: 8px;" role="group" aria-label="Filmstrook">
    {vak(sil(0,0,"moeder",grijs)+sil(24,0,"vader",grijs),48)}{vak(sil(0,0,"kind",grijs),24)}{vak(sil(0,0,dier,grijs),24)}
  </div>'''

BERG_LBL=('Uitzichtpunt op een berg met groene bergtoppen en wolken in de verte: houten hek langs de rand, uitstekend rotspunt, '
          'verrekijker op een paal, bankje, wegwijzer, struiken, een den en een ijsje op de grond. Familie Nguyễn staat lachend op haar fotoplekken.')
MARKT_LBL=('Dagmarkt voor een rij gekleurde winkelhuizen: bloemenkraam, groentekraam, stapel kratten, manden met fruit, regenton en bankje, '
           'een kool op de grond. Familie Somchai staat lachend op haar fotoplekken.')
for naam,titel,inhoud,lbl,dier in [('Spel4-Berg','Spel 4 – berg (familie Nguyễn)',berg(),BERG_LBL,'gans'),
                                   ('Spel4-Markt','Spel 4 – dagmarkt (familie Somchai)',markt(),MARKT_LBL,'lam')]:
    h2=HEAD.format(title=titel)+DEFS
    h2+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'
    h2+=kopbalk(0)
    h2+=f'''
  <div role="img" aria-label="{lbl}" style="position: relative; margin: 12px 16px 0; flex: 1; border-radius: 22px; background: #8ED8F8; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 670" width="358" height="670" aria-hidden="true">{inhoud}</svg>
  </div>'''
    h2+=filmstrook2(dier)+'</div>'
    h2+=TAIL%('{"film":{"editor":"int","default":0,"min":0,"max":99,"section":"Spelstand"},"$preview":{"width":390,"height":844}}','{ film: this.props.film ?? 0 }')
    open(f'pino/project/{naam}.dc.html','w',encoding='utf-8').write(h2)

# ---------- sprite sheet 2: berg, markt, etende dieren ----------
sheet2=HEAD.format(title='Spel 4 – sprite-set berg en markt')+DEFS
sheet2+='''<div class="vloer" style="width: 1000px; height: 620px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 4 · berg en dagmarkt</h1>
    <span class="stat-label">FAMILIE NGUYỄN EN SOMCHAI UIT SPEL 3 · LACHEN OP DE FOTOPLEK · DIEREN ETEN · REKWISIETEN IN DRIEKWART</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">PERSONEN EN DIEREN · B-LACH · LIGGEN/ETEN · SILHOUETTEN</span>
    <div style="display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap;">'''
for lab,p in [('moeder Nguyễn',moeder_nguyen(0,0,gezicht='b-lach')),('vader Nguyễn',vader_nguyen(0,0,gezicht='b-lach')),('meisje',meisje_nguyen(0,20,gezicht='b-lach')),
              ('gansje eet',dier_moment(0,32,'gansje')),('moeder Somchai',moeder_somchai(0,0,gezicht='b-lach')),('vader Somchai',vader_somchai(0,0,gezicht='b-lach')),
              ('jongetje',jongetje_somchai(0,20,gezicht='b-lach')),('lammetje eet',dier_moment(0,32,'lam')),('biggetje ligt',dier_moment(0,32,'biggetje'))]:
    sheet2+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="52" height="91">{p}</svg><span class="lbl">{lab}</span></div>'
for lab,w in [('gans','gans'),('lam','lam')]:
    sheet2+=f'<div class="vak"><svg class="ic" viewBox="0 0 24 32" width="30" height="40">{sil(0,0,w,"#0E7FB5")}</svg><span class="lbl">sil. {lab}</span></div>'
sheet2+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">REKWISIETEN · BERG EN DAGMARKT, LICHT VAN LINKSBOVEN</span>
    <div style="display: flex; gap: 18px; align-items: flex-end; flex-wrap: wrap;">'''
for lab,id,w,h,sc,bg in [('bergen','s4-bergen',358,190,0.5,'#8ED8F8'),('hek','s4-hek',200,52,0.6,''),('rotspunt','s4-rotspunt',120,64,0.8,'#8ED8F8'),('ijsje','s4-ijsje',28,20,1.6,''),
                        ('verrekijker','s4-kijker',44,72,1.0,''),('wegwijzer','s4-wegwijzer',44,70,1.0,''),('struik','s4-struik',56,36,1.0,''),('den','s4-den',54,100,0.8,''),
                        ('trapje','s4-trap',90,50,0.8,''),('winkelhuizen','s4-gevels',358,210,0.45,'#8ED8F8'),('bloemenkraam','s4-bloemkraam',130,110,0.75,''),
                        ('groentekraam','s4-groentekraam',130,100,0.75,''),('kratten','s4-kratten',80,84,0.8,''),('kool','s4-kool',24,20,1.6,''),('manden','s4-manden',90,60,0.8,''),('regenton','s4-ton',36,48,1.0,'')]:
    st=f' style="background:{bg};border-radius:8px"' if bg else ''
    sheet2+=f'<div class="vak"><svg class="ic" viewBox="0 0 {w} {h}" width="{w*sc:.0f}" height="{h*sc:.0f}"{st}>{use(id,0,0,w,h)}</svg><span class="lbl">{lab}</span></div>'
sheet2+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":620}}','{}')
open('pino/project/Spel4-Sprites2.dc.html','w',encoding='utf-8').write(sheet2)
print('ok berg/markt')
