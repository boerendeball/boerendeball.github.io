# Bouwt Spel8-Levels.dc.html, Spel8.dc.html, Spel8-Klaar.dc.html en Spel8-Sprites.dc.html (poppenhuisstijl)
from spel8_sprites import DEFS, use, stuk, STUKKEN
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
.pijl{{width:52px;height:52px;border-radius:16px;background:#FFFFFF;border:0;box-shadow:0 4px 0 0 #CDE4F0;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}}
.ronde{{border-radius:999px;border:0;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:8px;font-family:'Nunito',sans-serif;font-weight:800}}
.level{{position:relative;display:flex;align-items:center;justify-content:center;height:150px;border-radius:22px;background:#FFFFFF;box-shadow:0 6px 0 0 #CDE4F0,0 12px 24px rgba(30,58,76,0.10)}}
.level-klaar{{box-shadow:0 0 0 3px #39D353,0 6px 0 0 #1FA34A}}
.level-actief{{box-shadow:0 0 0 4px #1FA3DC,0 7px 0 0 #0E7FB5,0 14px 26px rgba(14,127,181,0.28)}}
.level-dicht{{background:#E6EFF5;box-shadow:inset 0 0 0 2px #D3E1EA}}
.level-dicht .stuk{{opacity:0.3}}
.level-nr{{position:absolute;left:12px;top:10px;font-family:'Fredoka',sans-serif;font-weight:700;font-size:18px;color:#4F6B7E}}
.badge{{position:absolute;right:8px;top:8px;width:28px;height:28px}}
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
def kopbalk(terug, sub, teller):
    return f'''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="{terug}" aria-label="Terug" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">{sub}</div>
      <div class="kop" style="font-size: 20px;">Check mate</div>
    </div>
    {teller}
  </div>'''
def teller(icoon, inner, lab):
    return f'''<div style="display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px 6px 8px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="{lab}">
      <svg class="ic" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true">{use(icoon,0,0,48,48)}</svg>
      <span class="kop" style="font-size: 18px; color: #0E6A98;">{inner}</span>
    </div>'''

# ---------- Spel8-Levels ----------
STATUS={1:'klaar',2:'actief',3:'dicht',4:'dicht',5:'dicht'}
kaarten=''
for nr,naam in STUKKEN:
    st=STATUS[nr]; href='Spel8.dc.html' if st!='dicht' else 'Spel8-Levels.dc.html'
    badge={'klaar':f'<span class="badge" aria-hidden="true"><svg class="ic" viewBox="0 0 48 48" width="28" height="28">{use("s7-vink",0,0,48,48)}</svg></span>',
           'actief':'',
           'dicht':f'<span class="badge" aria-hidden="true"><svg class="ic" viewBox="0 0 48 48" width="28" height="28">{use("s8-slot",0,0,48,48)}</svg></span>'}[st]
    lab={'klaar':f'Level {nr}, gehaald','actief':f'Level {nr}, nu aan de beurt','dicht':f'Level {nr}, nog vergrendeld'}[st]
    kaarten+=f'''
    <a href="{href}" class="level level-{st}" aria-label="{lab}">
      <span class="level-nr">{nr}</span>
      <svg class="ic stuk" viewBox="-4 -8 56 72" width="92" height="118" aria-hidden="true">{stuk(naam,0,0)}</svg>
      {badge}
    </a>'''
h=HEAD.format(title='Spel 8 – levels')+DEFS
h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'
h+=kopbalk('Open.dc.html','DAG 8 · 1 DECEMBER',teller('s8-vlag','1<span style="font-size: 13px; color: #4F6B7E;"> / 5</span>','1 van de 5 levels gehaald'))
h+=f'''
  <div style="margin: 14px 16px 0; flex: 1; border-radius: 22px; background: #2E5E1E; box-shadow: inset 0 0 0 4px #1F4414, 0 6px 0 0 #CDE4F0; padding: 18px 14px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; align-content: start;" role="group" aria-label="Vijf levels, elk met een ander roofdier als schaakstuk">{kaarten}
    <!-- Pino als pion, als zesde vakje -->
    <div style="display: flex; align-items: center; justify-content: center; height: 150px;" aria-hidden="true">
      <svg class="ic" viewBox="-4 -8 56 72" width="92" height="118">{stuk('pino',0,0)}</svg>
    </div>
  </div>

  <div style="padding: 14px 16px 16px;">
    <a href="Spel8.dc.html" class="knop" aria-label="Speel level 2" style="width: 100%; box-sizing: border-box; background: #39D353; color: #0E3D1C; box-shadow: 0 5px 0 0 #1FA34A;"><svg class="ic" viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">{use('s8-speel',0,0,48,48)}</svg><span class="kop" style="font-size: 22px;">2</span></a>
  </div>
</div>'''+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel8-Levels.dc.html','w').write(h)

# ---------- Spel8: het bord (level 2) ----------
T=42; ox=11; oy=10
bomen=[(1,0),(5,1),(0,2),(6,3),(2,5),(1,7)]
bamboes=[(2,0),(7,5),(4,7)]
rivieren=[(3,2),(3,3),(3,4)]
rotsen=[(2,3),(5,5)]
stammen=[(4,4),(1,5)]
objs={}
for p in bomen: objs[p]='s8-boom'
for p in bamboes: objs[p]='s8-bamboe'
for p in rotsen: objs[p]='s8-rots'
for p in stammen: objs[p]='s8-stam'
objs[(7,0)]='s8-tempel'
# ---- junglescène 358 x 582 met het schaakbord als patroon in de grond ----
S=36; BX=35; BY=150
def jungle():
    s='<rect x="0" y="0" width="358" height="582" fill="#4E9A3E"/>'
    # bodemtextuur
    s+='<g fill="#5FB05A" opacity="0.5"><ellipse cx="60" cy="110" rx="26" ry="8"/><ellipse cx="300" cy="100" rx="30" ry="9"/><ellipse cx="40" cy="500" rx="28" ry="8"/><ellipse cx="320" cy="520" rx="24" ry="7"/><ellipse cx="180" cy="470" rx="34" ry="8"/></g>'
    for (x,y) in [(14,120),(330,130),(20,460),(336,470),(150,468),(250,480),(60,560),(300,560),(200,112)]:
        s+=use('s8-gras',x,y,24,16)
    # jungle achter het bord (bovenrand): grote bomen, bamboe, varens, lianen
    s+=use('s8-grootboom',-18,-10,90,110)+use('s8-grootboom',70,-30,90,110)+use('s8-grootboom',190,-28,90,110)+use('s8-grootboom',286,-12,90,110)
    s+=use('s8-bamboe',150,40,44,56)+use('s8-bamboe',258,56,44,56)
    s+=use('s8-liaan',40,0,120,40)+use('s8-liaan',220,-6,120,40)
    s+=use('s8-varen',6,96,48,40)+use('s8-varen',118,100,48,40)+use('s8-varen',300,92,48,40)
    s+=use('s8-bloem',70,118,16,20,'#FF6FAE')+use('s8-bloem',236,116,16,20,'#FF5E5B')
    # het schaakbord: versleten stenen vakken, vlak in de grond
    s+=f'<rect x="{BX-5}" y="{BY-5}" width="{8*S+10}" height="{8*S+10}" rx="6" fill="#3D7A30"/>'
    for r in range(8):
        for c in range(8):
            x=BX+c*S; y=BY+r*S
            if (c,r) in rivieren: s+=use('s8-vak-water',x,y,36,36)
            else: s+=use('s8-vak',x,y,36,36,'#8AA66E' if (c+r)%2 else '#D9CFA8')
    # jungle langs de zijkanten (voor het bord, maar achter de objecten erop)
    s+=use('s8-varen',-14,250,48,40)+use('s8-varen',324,210,48,40)+use('s8-varen',-10,380,48,40)+use('s8-varen',322,350,48,40)
    s+=use('s8-bloem',10,330,16,20,'#FFC93C')+use('s8-bloem',336,300,16,20,'#9B6BFF')
    # objecten en stukken op het bord, rij voor rij
    for r in range(8):
        for c in range(8):
            x=BX+c*S; y=BY+r*S
            if (c,r) in objs: s+=use(objs[(c,r)],x-1,y+36-47,38,48)
            if (c,r)==(6,2): s+=use('s8-stuk-tijger',x-1,y+36-46,38,47)
            if (c,r)==(0,7): s+=use('s8-stuk-pino',x-1,y+36-46,38,47)
    # jungle vóór het bord (onderrand)
    s+=use('s8-varen',30,448,48,40)+use('s8-varen',270,452,48,40)
    s+=use('s8-grootboom',-26,470,90,110)+use('s8-grootboom',292,478,90,110)
    s+=use('s8-bamboe',120,500,44,56)+use('s8-boom',216,506,44,56)
    s+=use('s8-bloem',100,540,16,20,'#FF6FAE')+use('s8-bloem',190,552,16,20,'#FF5E5B')+use('s8-bloem',268,536,16,20,'#FFC93C')
    return s
h=HEAD.format(title='Spel 8 – Check mate')+DEFS
h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'
h+=kopbalk('Spel8-Levels.dc.html','DAG 8 · LEVEL 2 VAN 5',teller('s8-stap','{{zetten}}','Zetten: {{zetten}}'))
h+=f'''
  <!-- Junglescène met het schaakbord als patroon in de grond -->
  <div role="img" aria-label="Level 2: jungle in driekwartaanzicht met in de grond een versleten stenen schaakbord van acht bij acht vakken; op het bord bomen, bamboe, een rivier, duwbare rotsen en boomstammen, Pino linksonder als roze pion, de tempel rechtsboven en de tijger als toren; eromheen grote bomen, varens en lianen" style="position: relative; margin: 12px 16px 0; height: 582px; border-radius: 22px; background: #4E9A3E; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 582" width="358" height="582" aria-hidden="true">{jungle()}</svg>
  </div>

  <!-- Besturing: pijlen, wachten (zandloper), opnieuw -->
  <div style="margin-top: auto; padding: 12px 16px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
    <div role="group" aria-label="Pino een stap laten zetten" style="display: grid; grid-template-columns: repeat(3, 52px); grid-template-rows: repeat(3, 52px); gap: 4px;">
      <span></span>
      <button type="button" class="pijl" aria-label="Omhoog"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M10 30 L24 16 L38 30" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <span></span>
      <button type="button" class="pijl" aria-label="Links"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button type="button" class="pijl" aria-label="Omlaag"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M10 18 L24 32 L38 18" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button type="button" class="pijl" aria-label="Rechts"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M18 10 L32 24 L18 38" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
      <button type="button" class="ronde" aria-label="Wachten: het dier zet een beurt" style="width: 92px; height: 92px; background: #39D353; color: #0E3D1C; box-shadow: 0 6px 0 0 #1FA34A;"><svg class="ic" viewBox="0 0 48 48" width="46" height="46" aria-hidden="true">{use('s8-wacht',0,0,48,48)}</svg></button>
      <button type="button" class="ronde" aria-label="Level opnieuw" style="width: 54px; height: 54px; background: #E6EFF5; color: #4F6B7E; box-shadow: 0 4px 0 0 #CDE4F0;"><svg class="ic" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true">{use('s8-opnieuw',0,0,48,48)}</svg></button>
    </div>
  </div>
</div>'''
h+=TAIL%('{"zetten":{"editor":"int","default":4,"min":0,"max":60,"section":"Spelstand"},"$preview":{"width":390,"height":844}}','{ zetten: this.props.zetten ?? 4 }')
open('pino/project/Spel8.dc.html','w').write(h)

# ---------- Spel8-Klaar ----------
rij=''.join(stuk(n,8+i*52,20,0.8) for i,(nr,n) in enumerate(STUKKEN))
klaar=HEAD.format(title='Spel 8 – resultaat')+DEFS
klaar+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">

  <!-- confetti -->
  <div aria-hidden="true" style="position: absolute; left: 30px; top: 60px; width: 10px; height: 10px; border-radius: 3px; background: #FF6FAE; box-shadow: 70px 30px 0 0 #FFC93C, 140px -10px 0 0 #39D353, 220px 24px 0 0 #9B6BFF, 290px 4px 0 0 #1FA3DC, 330px 50px 0 0 #FF6FAE, 100px 90px 0 0 #1FA3DC, 250px 80px 0 0 #FFC93C;"></div>

  <div class="kaart" style="width: 100%; border-radius: 26px; padding: 0 22px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; margin-top: 30px;">

    <div style="width: 128px; height: 128px; border-radius: 50%; background: #D9F5DE; border: 6px solid #FFFFFF; box-shadow: 0 0 0 3px #39D353, 0 8px 18px rgba(30,58,76,0.18); box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin-top: -50px;">
      <svg class="ic" viewBox="-4 -8 56 72" width="78" height="100" role="img" aria-label="Pino als pion">{stuk('pino',0,0)}</svg>
    </div>

    <div style="font-size: 12px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">CHECK MATE · KLAAR</div>
    <h1 class="kop" style="margin: 0; font-size: 30px;">Schaakmat!</h1>

    <!-- de vijf roofdieren op een rij, met de tempel -->
    <svg class="ic" viewBox="0 0 320 90" width="320" height="90" role="img" aria-label="De vijf verslagen roofdieren op een rij voor de tempel">
      <ellipse cx="160" cy="84" rx="150" ry="5" fill="#CDE4F0"/>
      {rij}
      {use('s8-tempel',268,16,48,61)}
    </svg>

    <!-- scoretegels -->
    <div style="width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
      <div class="tegel"><span class="tegel-label">LEVELS</span><span class="kop" style="font-size: 26px; color: #1F7A3A;">5/5</span></div>
      <div class="tegel"><span class="tegel-label">ZETTEN</span><span class="kop" style="font-size: 26px; color: #0E6A98;">58</span></div>
      <div class="tegel"><span class="tegel-label">GEVANGEN</span><span class="kop" style="font-size: 26px; color: #C43B38;">3×</span></div>
    </div>

    <!-- beloning -->
    <div style="width: 100%; display: flex; align-items: center; gap: 12px; background: #F1E8FF; border-radius: 16px; padding: 12px 14px; box-sizing: border-box; text-align: left;">
      <div style="width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg class="ic" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><path d="M8 12 h32 v18 a4 4 0 0 1 -4 4 h-14 l-8 7 v-7 h-2 a4 4 0 0 1 -4 -4z" fill="#6B3FCF"/><circle cx="18" cy="22" r="2.5" fill="#FFFFFF"/><circle cx="24" cy="22" r="2.5" fill="#FFFFFF"/><circle cx="30" cy="22" r="2.5" fill="#FFFFFF"/></svg>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <div style="font-size: 12px; font-weight: 800; color: #6B3FCF; letter-spacing: 0.5px;">VAARDIGHEID VERDIEND</div>
        <div style="font-size: 16px; font-weight: 800;">Logica +1 <span style="font-weight: 700; color: #4F6B7E;">· Behoefte "Verjaardag" +10%</span></div>
      </div>
    </div>

    <div style="width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">
      <a href="Main.dc.html" class="knop" style="background: #39D353; color: #0E3D1C; box-shadow: 0 5px 0 0 #1FA34A;">Terug naar de kalender</a>
      <a href="Spel8-Levels.dc.html" class="knop" style="background: #E6EFF5; color: #4F6B7E; box-shadow: 0 5px 0 0 #CDE4F0;">Nog een keer</a>
    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel8-Klaar.dc.html','w').write(klaar)

# ---------- sprite sheet ----------
sheet=HEAD.format(title='Spel 8 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 660px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 8 · Check mate</h1>
    <span class="stat-label">BORDVAK 36×36 VLAK IN DE GROND (currentColor) · OBSTAKELS 44×56 · STUKKEN 48×60 (VOET currentColor) · JUNGLE EROMHEEN, RIJ VOOR RIJ TEKENEN</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">SCHAAKSTUKKEN · PYTHON-PION · TIJGER-TOREN · LUIAARD-PAARD · LEEUW-LOPER · KROKODIL-KONINGIN · PINO-PION</span>
    <div style="display: flex; gap: 26px; align-items: flex-end; flex-wrap: wrap;">'''
for lab,n in [('python · pion','python'),('tijger · toren','tijger'),('luiaard · paard','luiaard'),('leeuw · loper','leeuw'),('krokodil · koningin','krokodil'),('Pino · pion','pino')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="-4 -8 56 72" width="84" height="108">{stuk(n,0,0)}</svg><span class="lbl">{lab}</span></div>'
sheet+='<span style="width:10px"></span>'
for lab,id in [('wachten','s8-wacht'),('opnieuw','s8-opnieuw'),('spelen','s8-speel')]:
    sheet+=f'<div class="vak"><span style="width:52px;height:52px;border-radius:50%;background:#E6EFF5;display:flex;align-items:center;justify-content:center;color:#0E7FB5"><svg class="ic" viewBox="0 0 48 48" width="30" height="30">{use(id,0,0,48,48)}</svg></span><span class="lbl">{lab}</span></div>'
for lab,id in [('slot','s8-slot'),('vlag','s8-vlag'),('stappen','s8-stap')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44">{use(id,0,0,48,48)}</svg><span class="lbl">{lab}</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">BORD IN DE GROND · VAKKEN (LICHT/DONKER/WATER) · VASTE OBSTAKELS (BOOM, BAMBOE, TEMPEL) · DUWBAAR (ROTS, BOOMSTAM) · JUNGLE-DECOR</span>
    <div style="display: flex; gap: 26px; align-items: flex-end; flex-wrap: wrap;">'''
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 36 36" width="50" height="50" style="background:#3D7A30">{use("s8-vak",0,0,36,36,"#D9CFA8")}</svg><span class="lbl">vak licht</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 36 36" width="50" height="50" style="background:#3D7A30">{use("s8-vak",0,0,36,36,"#8AA66E")}</svg><span class="lbl">vak donker</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 36 36" width="50" height="50" style="background:#3D7A30">{use("s8-vak-water",0,0,36,36)}</svg><span class="lbl">rivier</span></div>'
for lab,id in [('boom','s8-boom'),('bamboe','s8-bamboe'),('tempel','s8-tempel'),('rots (duwbaar)','s8-rots'),('boomstam (duwbaar)','s8-stam')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="-4 -20 44 56" width="53" height="67" style="background:#4E9A3E;border-radius:6px">{use("s8-vak",0,0,36,36,"#D9CFA8")}{use(id,-1,-11,38,48)}</svg><span class="lbl">{lab}</span></div>'
for lab,id,w,hh in [('varen','s8-varen',48,40),('grasplukje','s8-gras',24,16),('grote boom','s8-grootboom',90,110),('liaan','s8-liaan',120,40)]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 {w} {hh}" width="{w*0.7:.0f}" height="{hh*0.7:.0f}">{use(id,0,0,w,hh)}</svg><span class="lbl">{lab}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 16 20" width="20" height="25">{use("s8-bloem",0,0,16,20,"#FF6FAE")}</svg><span class="lbl">bloem</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":660}}','{}')
open('pino/project/Spel8-Sprites.dc.html','w').write(sheet)
print('ok')
