# Bouwt Spel9.dc.html, Spel9-Klaar.dc.html en Spel9-Sprites.dc.html (poppenhuisstijl, echte scène)
from spel9_sprites import DEFS, use, pino, man_laken, man_baby, pino_duw, bundel, MANNEN
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
.pil{{display:flex;align-items:center;justify-content:center;gap:6px;background:#FFFFFF;border-radius:999px;padding:8px 12px;box-shadow:0 4px 0 0 #CDE4F0;flex:1}}
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
def ic(id,s=22,color=None): return f'<svg class="ic" viewBox="0 0 48 48" width="{s}" height="{s}" aria-hidden="true">{use(id,0,0,48,48,color)}</svg>'

# ---------- de scène 358 x 680 ----------
H=680
def dorp():
    s=f'<rect x="0" y="0" width="358" height="{H}" fill="#8ED8F8"/>'
    s+=use('s4-zon',282,18,56,56)+use('s4-wolk',20,30,96,36)+use('s4-wolk',200,64,70,26)
    # verte: dorpje met molen en huisjes op de horizon
    s+=f'<rect x="0" y="176" width="358" height="{H-176}" fill="#8BD35A"/>'
    s+='<ellipse cx="110" cy="178" rx="150" ry="12" fill="#9ADB7A"/><ellipse cx="300" cy="180" rx="120" ry="10" fill="#9ADB7A"/>'
    s+=use('s9-molen',6,96,60,82)+use('s9-huisje',74,134,36,45,'#FFF1D6')+use('s9-huisje',108,138,32,40,'#E8A9C4')+use('s9-huisje',300,132,38,48,'#DDF1FB')+use('s9-huisje',266,140,30,38,'#FFF1D6')
    s+=use('s8-boom',140,128,40,51)+use('s8-boom',230,134,36,46)+use('s8-boom',336,126,40,51)
    # ooievaar in de lucht
    s+=use('s9-ooievaar',150,28,120,70)
    # vangstrook: gemaaide banen in het gras (het mechaniek in de grond)
    for i,y in enumerate(range(296,470,24)):
        s+=f'<rect x="0" y="{y}" width="358" height="24" fill="{"#9ADB7A" if i%2==0 else "#8BD35A"}"/>'
    s+='<path d="M0 296 h358 M0 470 h358" stroke="#FFFFFF" stroke-width="2" opacity="0.6"/>'
    # schaduwen van de vallende bundeltjes op de strook
    s+=use('s9-schaduw',44,436,60,20)+use('s9-schaduw',194,440,44,15)+use('s9-schaduw',292,444,28,9)
    # bundeltjes in de lucht
    s+=bundel(290,88,'#FFD6E6',0.75,val=False)+bundel(192,186,'#FFD6E6')+bundel(50,300,'#DDF1FB')
    # Pino duwt, de mannen met lakens op de strook
    s+=pino_duw(92,384)
    s+=man_laken(0,30,380)+man_laken(1,158,380,actief=True)+man_laken(2,282,380)
    # heg
    s+=use('s9-heg',0,466,358,30)
    # onder: gras met tulpen, klinkerpad naar de kraamkliniek
    for x,k in [(14,'#FF5E5B'),(30,'#FFC93C'),(46,'#FF6FAE'),(120,'#FF5E5B'),(136,'#FFC93C'),(200,'#FF6FAE'),(216,'#FF5E5B')]:
        s+=use('s9-tulp',x,500,16,28,k)
    s+='<svg x="0" y="556" width="358" height="60" viewBox="0 0 358 60">'
    for x in range(0,358,32):
        s+=use('s9-klinker',x,0,32,32)+use('s9-klinker',x,32,32,32)
    s+='</svg><rect x="0" y="554" width="358" height="3" fill="#A85F2A"/><rect x="0" y="616" width="358" height="3" fill="#A85F2A"/>'
    s+=use('s8-boom',4,490,52,66)+use('s9-lantaarn',196,520,20,66)
    # kraamkliniek met moeders achter de ramen
    s+=use('s9-kliniek',212,498,150,130)
    for wx,wy,k in [(18,48,'#9B6BFF'),(56,48,'#FF6FAE'),(94,48,'#39D353'),(18,86,'#FFC93C'),(94,86,'#5BC0EB')]:
        s+=use('s9-moeder',212+wx,498+wy+2,26,28,k)
    for x,k in [(320,'#FF6FAE'),(336,'#FFC93C')]:
        s+=use('s9-tulp',x,640,16,28,k)
    # mannen met een gevangen baby onderweg naar de kliniek
    s+=man_baby(3,40,540)+man_baby(4,140,546,'#DDF1FB')
    return s
LBL=('Nederlands dorp in driekwartaanzicht: boven de lucht met een ooievaar die bundeltjes laat vallen, op de horizon een molen en huisjes; '
     'daaronder een weiland met gemaaide banen als vangstrook waarop drie mannen met een laken staan, Pino duwt een van hen opzij; '
     'schaduwen op het gras tonen waar de bundeltjes landen. Achter de heg een klinkerpad met tulpen naar de kraamkliniek rechts, '
     'waar moeders achter de ramen wachten; twee mannen lopen met een baby over het pad.')

h=HEAD.format(title='Spel 9 – Vang de baby')+DEFS
h+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">

  <!-- Kopbalk -->
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 9 · 2 DECEMBER</div>
      <div class="kop" style="font-size: 20px;">Vang de baby</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px; box-shadow: 0 4px 0 0 #CDE4F0;">
      <span style="display:flex;gap:2px;" role="img" aria-label="Twee van drie levens over">{ic('s9-hart',20,'#FF5E5B')}{ic('s9-hart',20,'#FF5E5B')}{ic('s9-hart',20,'#E6EFF5')}</span>
      <span style="display:flex;align-items:center;gap:4px;" role="img" aria-label="{{{{gevangen}}}} baby's gevangen">{ic('s9-bundel',24,'#FFD6E6')}<span class="kop" style="font-size: 18px; color: #B23A6A;">{{{{gevangen}}}}</span></span>
    </div>
  </div>

  <!-- Speelveld -->
  <div role="img" aria-label="{LBL}" style="position: relative; margin: 12px 16px 0; height: {H}px; border-radius: 22px; background: #8ED8F8; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 {H}" width="358" height="{H}" aria-hidden="true">{dorp()}</svg>
  </div>

  <!-- Onderbalk: alleen de stand (icoon + getal) -->
  <div style="margin-top: auto; padding: 12px 16px 16px; display: flex; gap: 10px;">
    <div class="pil" role="img" aria-label="Ronde 3"><svg class="ic" viewBox="0 0 120 70" width="40" height="23" aria-hidden="true">{use('s9-ooievaar',0,0,120,70)}</svg><span class="kop" style="font-size: 20px; color: #0E6A98;">3</span></div>
    <div class="pil" role="img" aria-label="3 baby's onderweg naar de kliniek">{ic('s9-wandel',24)}<span class="kop" style="font-size: 20px; color: #B23A6A;">3</span></div>
    <div class="pil" role="img" aria-label="Tijd 0:51">{ic('s9-klok',24)}<span class="kop" style="font-size: 20px; color: #D97A00;">0:51</span></div>
  </div>
</div>'''
h+=TAIL%('{"gevangen":{"editor":"int","default":7,"min":0,"max":99,"section":"Spelstand"},"$preview":{"width":390,"height":844}}','{ gevangen: this.props.gevangen ?? 7 }')
open('pino/project/Spel9.dc.html','w').write(h)

# ---------- Spel9-Klaar ----------
klaar=HEAD.format(title='Spel 9 – resultaat')+DEFS
klaar+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">

  <!-- confetti -->
  <div aria-hidden="true" style="position: absolute; left: 30px; top: 60px; width: 10px; height: 10px; border-radius: 3px; background: #FF6FAE; box-shadow: 70px 30px 0 0 #FFC93C, 140px -10px 0 0 #39D353, 220px 24px 0 0 #9B6BFF, 290px 4px 0 0 #1FA3DC, 330px 50px 0 0 #FF6FAE, 100px 90px 0 0 #1FA3DC, 250px 80px 0 0 #FFC93C;"></div>

  <div class="kaart" style="width: 100%; border-radius: 26px; padding: 0 22px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; margin-top: 30px;">

    <div style="width: 128px; height: 128px; border-radius: 50%; background: #FFE0EE; border: 6px solid #FFFFFF; box-shadow: 0 0 0 3px #FF6FAE, 0 8px 18px rgba(30,58,76,0.18); box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin-top: -50px;">
      <svg class="ic" viewBox="0 0 48 48" width="84" height="84" role="img" aria-label="Baby in een doek">{use('s9-bundel',0,0,48,48,'#FFD6E6')}</svg>
    </div>

    <div style="font-size: 12px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">VANG DE BABY · KLAAR</div>
    <h1 class="kop" style="margin: 0; font-size: 30px;">Allemaal veilig geland!</h1>

    <!-- ooievaar, Pino en de mannen met baby's -->
    <svg class="ic" viewBox="0 0 320 110" width="320" height="110" role="img" aria-label="De ooievaar vliegt weg; Pino en drie mannen met een baby op de arm">
      <ellipse cx="160" cy="104" rx="150" ry="5" fill="#CDE4F0"/>
      <ellipse cx="252" cy="30" rx="62" ry="30" fill="#8ED8F8"/>{use('s9-ooievaar',200,0,100,58)}
      {pino_duw(14,30)}
      {man_baby(0,96,30)}{man_baby(1,160,30,'#DDF1FB')}{man_baby(2,224,30)}
    </svg>

    <!-- scoretegels -->
    <div style="width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
      <div class="tegel"><span class="tegel-label">GEVANGEN</span><span class="kop" style="font-size: 26px; color: #1F7A3A;">18</span></div>
      <div class="tegel"><span class="tegel-label">RONDES</span><span class="kop" style="font-size: 26px; color: #0E6A98;">5</span></div>
      <div class="tegel"><span class="tegel-label">GEMIST</span><span class="kop" style="font-size: 26px; color: #C43B38;">2</span></div>
    </div>

    <!-- beloning -->
    <div style="width: 100%; display: flex; align-items: center; gap: 12px; background: #F1E8FF; border-radius: 16px; padding: 12px 14px; box-sizing: border-box; text-align: left;">
      <div style="width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg class="ic" viewBox="0 0 48 48" width="28" height="28" aria-hidden="true"><path d="M8 12 h32 v18 a4 4 0 0 1 -4 4 h-14 l-8 7 v-7 h-2 a4 4 0 0 1 -4 -4z" fill="#6B3FCF"/><circle cx="18" cy="22" r="2.5" fill="#FFFFFF"/><circle cx="24" cy="22" r="2.5" fill="#FFFFFF"/><circle cx="30" cy="22" r="2.5" fill="#FFFFFF"/></svg>
      </div>
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <div style="font-size: 12px; font-weight: 800; color: #6B3FCF; letter-spacing: 0.5px;">VAARDIGHEID VERDIEND</div>
        <div style="font-size: 16px; font-weight: 800;">Lichaam +1 <span style="font-weight: 700; color: #4F6B7E;">· Behoefte "Verjaardag" +10%</span></div>
      </div>
    </div>

    <div style="width: 100%; display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">
      <a href="Main.dc.html" class="knop" style="background: #39D353; color: #0E3D1C; box-shadow: 0 5px 0 0 #1FA34A;">Terug naar de kalender</a>
      <a href="Spel9.dc.html" class="knop" style="background: #E6EFF5; color: #4F6B7E; box-shadow: 0 5px 0 0 #CDE4F0;">Nog een keer</a>
    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel9-Klaar.dc.html','w').write(klaar)

# ---------- sprite sheet ----------
sheet=HEAD.format(title='Spel 9 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 640px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 9 · Vang de baby</h1>
    <span class="stat-label">MANNEN = PERSOON-SYMBOLEN + LAKEN / BABY OP DE ARM · PINO: STIL / DUWT RECHTS / DUWT LINKS (+ STETHOSCOOP) · BUNDEL EN TULP VIA currentColor</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">PERSONEN · OOIEVAAR · BUNDELTJES (DOEK currentColor) · VALSTREPEN · SCHADUW · ACTIEF-RING · TELLERICONEN</span>
    <div style="display: flex; gap: 18px; align-items: flex-end; flex-wrap: wrap;">'''
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="56" height="98">{pino(0,0,"staan")}{use("s9-stetho",0,0,48,72)}</svg><span class="lbl">Pino stil</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 60 84" width="70" height="98">{pino_duw(0,0)}</svg><span class="lbl">Pino duwt rechts</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="-12 -12 60 84" width="70" height="98">{pino_duw(0,0,flip=True)}</svg><span class="lbl">Pino duwt links</span></div>'
for i in range(3):
    sheet+=f'<div class="vak"><svg class="ic" viewBox="-16 -12 80 96" width="80" height="96">{man_laken(i,0,0,actief=(i==1))}</svg><span class="lbl">man met laken{" (actief)" if i==1 else ""}</span></div>'
for i,d in [(3,'#FFD6E6'),(4,'#DDF1FB')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="56" height="98">{man_baby(i,0,0,d)}</svg><span class="lbl">man met baby</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 120 70" width="120" height="70" style="background:#8ED8F8;border-radius:8px">{use("s9-ooievaar",0,0,120,70)}</svg><span class="lbl">ooievaar</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -34 48 82" width="48" height="82">{bundel(0,0,"#FFD6E6")}</svg><span class="lbl">bundel roze</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -34 48 82" width="48" height="82">{bundel(0,0,"#DDF1FB")}</svg><span class="lbl">bundel blauw</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 60 20" width="60" height="20" style="background:#8BD35A;border-radius:6px">{use("s9-schaduw",0,0,60,20)}</svg><span class="lbl">landingsschaduw</span></div>'
for lab,id,c in [('hart','s9-hart','#FF5E5B'),('onderweg','s9-wandel',None),('klok','s9-klok',None)]:
    sheet+=f'<div class="vak">{ic(id,40,c)}<span class="lbl">{lab}</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">DECOR · MOLEN · HUISJE (currentColor) · HEG · KLINKERS · TULP (currentColor) · LANTAARN · KRAAMKLINIEK + MOEDER ACHTER RAAM</span>
    <div style="display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 80 110" width="64" height="88">{use("s9-molen",0,0,80,110)}</svg><span class="lbl">molen</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 60" width="48" height="60">{use("s9-huisje",0,0,48,60,"#FFF1D6")}</svg><span class="lbl">huisje</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 358 30" width="200" height="17">{use("s9-heg",0,0,358,30)}</svg><span class="lbl">heg</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 64 32" width="64" height="32">{use("s9-klinker",0,0,32,32)}{use("s9-klinker",32,0,32,32)}</svg><span class="lbl">klinkerpad</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 28" width="48" height="28">{use("s9-tulp",0,0,16,28,"#FF5E5B")}{use("s9-tulp",16,0,16,28,"#FFC93C")}{use("s9-tulp",32,0,16,28,"#FF6FAE")}</svg><span class="lbl">tulpen</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 24 80" width="24" height="80">{use("s9-lantaarn",0,0,24,80)}</svg><span class="lbl">lantaarn</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 150 130" width="150" height="130">{use("s9-kliniek",0,0,150,130)}{use("s9-moeder",18,50,26,28,"#9B6BFF")}{use("s9-moeder",56,50,26,28,"#FF6FAE")}{use("s9-moeder",94,50,26,28,"#39D353")}</svg><span class="lbl">kraamkliniek met moeders</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":640}}','{}')
open('pino/project/Spel9-Sprites.dc.html','w').write(sheet)
print('ok')
