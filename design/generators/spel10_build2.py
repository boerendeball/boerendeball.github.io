# Bouwt Spel10.dc.html (te voet), Spel10-Auto.dc.html, Spel10-Finale.dc.html en Spel10-Sprites.dc.html (poppenhuisstijl)
from spel10_sprites import DEFS, use, pino, dier, persoon, auto, pino_tas10, lantaarn_aan
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
.kaart{{background:#FFFFFF;border-radius:26px;box-shadow:0 7px 0 0 #CDE4F0,0 14px 28px rgba(30,58,76,0.12)}}
.stat-label{{font-size:11px;font-weight:800;color:#4F6B7E;letter-spacing:0.5px}}
.knop3{{min-height:72px;border-radius:20px;border:0;background:#FFFFFF;box-shadow:0 6px 0 0 #CDE4F0;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-family:inherit;color:#0E7FB5}}
.knop{{font-family:'Nunito',sans-serif;font-weight:800;font-size:18px;border-radius:999px;border:0;cursor:pointer;min-height:54px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:8px}}
.nood{{display:flex;flex-direction:column;gap:3px}}
.nood-label{{font-size:11px;font-weight:800;color:#35505F}}
.nood-balk{{display:block;height:10px;border-radius:999px;background:#E6EFF5;overflow:hidden}}
.nood-balk>span{{display:block;height:100%;width:100%;border-radius:999px;background:#39D353;box-shadow:inset 0 -3px 0 0 #1FA34A}}
.lbl{{font-size:12px;font-weight:800;color:#4F6B7E;text-align:center}}
.vak{{display:flex;flex-direction:column;align-items:center;gap:6px}}
@keyframes wee{{0%,100%{{transform:scale(1)}}50%{{transform:scale(1.15)}}}}
.wee{{animation:wee 1.1s ease-in-out infinite}}
@keyframes zweef{{0%,100%{{transform:translateY(0)}}50%{{transform:translateY(-8px)}}}}
.ballon{{position:absolute;animation:zweef 2.4s ease-in-out infinite}}
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
def ic(id,s=22,color=None,cls='ic'): return f'<svg class="{cls}" viewBox="0 0 48 48" width="{s}" height="{s}" aria-hidden="true">{use(id,0,0,48,48,color)}</svg>'
def kopbalk(wee):
    return f'''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #B23A6A; letter-spacing: 1px;">DAG 10 · 3 DECEMBER · JARIG</div>
      <div class="kop" style="font-size: 20px;">Bereik de bevalling</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px 6px 8px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="Weeën: om de {wee} minuten">
      {ic('s9-hart',22,'#FF5E5B','ic wee')}{ic('s9-klok',18)}<span class="kop" style="font-size: 18px; color: #C43B38;">{wee}</span>
    </div>
  </div>'''
def knoppen(links, midden, rechts, mid_kleur, mid_schaduw, lab_l, lab_m, lab_r):
    return f'''
  <!-- Drie knoppen, alleen iconen -->
  <div style="margin-top: auto; padding: 12px 16px 16px; display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 10px;">
    <button type="button" class="knop3" aria-label="{lab_l}">{links}</button>
    <button type="button" class="knop3" aria-label="{lab_m}" style="background: {mid_kleur}; color: #FFFFFF; box-shadow: 0 6px 0 0 {mid_schaduw};">{midden}</button>
    <button type="button" class="knop3" aria-label="{lab_r}">{rechts}</button>
  </div>'''
PIJL_L='<svg class="ic" viewBox="0 0 48 48" width="30" height="30" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
PIJL_R='<svg class="ic" viewBox="0 0 48 48" width="30" height="30" aria-hidden="true"><path d="M18 10 L32 24 L18 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
PIJL_O='<svg class="ic" viewBox="0 0 48 48" width="36" height="36" aria-hidden="true"><path d="M10 30 L24 16 L38 30" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
def stuur(rot):
    return f'<svg class="ic" viewBox="0 0 48 48" width="34" height="34" aria-hidden="true" style="transform:rotate({rot}deg);"><circle cx="24" cy="24" r="18" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="24" cy="24" r="5" fill="currentColor"/><path d="M24 24 L8 18 M24 24 L40 18 M24 24 V42" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>'
REM='<svg class="ic" viewBox="0 0 48 48" width="36" height="36" aria-hidden="true"><path d="M12 8 h24 l4 26 h-32z" fill="#FFFFFF"/><path d="M16 14 h16 M15 20 h18 M14 26 h20" stroke="#FF5E5B" stroke-width="2.5" stroke-linecap="round"/><rect x="20" y="34" width="8" height="8" rx="2" fill="#FFFFFF"/><rect x="14" y="40" width="20" height="4" rx="2" fill="#FFFFFF"/></svg>'

def lucht(h):
    s=f'<rect x="0" y="0" width="358" height="{h}" fill="#2B4A66"/>'+use('s10-maan',296,6,40,40)
    for x,y,sz in [(20,12,8),(60,30,6),(120,10,7),(180,26,5),(240,14,6),(340,40,5),(90,44,5)]:
        s+=use('s10-ster',x,y,sz,sz)
    return s
def stoep(y,h):
    s=f'<svg x="0" y="{y}" width="358" height="{h}" viewBox="0 0 358 {h}">'
    for yy in range(0,h,32):
        for xx in range(0,358,32): s+=use('s10-stoep',xx,yy,32,32)
    return s+'</svg>'
def stoeprand(y):
    return ''.join(use('s10-stoeprand',x,y,24,6) for x in range(0,358,24))

# ---------- Spel10: te voet (Frogger-stroken als patroon in de grond) ----------
H1=640
def stad():
    s=lucht(60)
    # grachtenpanden op de bovenste stoep
    for i,(x,k) in enumerate([(-8,'#C98B5A'),(50,'#FFF1D6'),(108,'#8AA0AF'),(166,'#C43B38'),(224,'#E8A9C4'),(282,'#FFF1D6'),(340,'#C98B5A')]):
        s+=use('s10-pand',x,36+(i%2)*6,56,90,k)
    s+=f'<rect x="0" y="126" width="358" height="{H1-126}" fill="#4E9A3E"/>'
    # bovenste stoep met het ziekenhuisautootje
    s+=stoep(126,52)+stoeprand(174)
    s+=lantaarn_aan(40,104,0.8)+lantaarn_aan(300,104,0.8)
    s+=f'<g transform="translate(150 136)">{use("s10-ambu",0,0,72,40)}</g>'
    # weg: twee rijstroken
    s+='<rect x="0" y="206" width="358" height="80" fill="#4F6B7E"/><rect x="0" y="206" width="358" height="3" fill="#FFFFFF"/><rect x="0" y="283" width="358" height="3" fill="#FFFFFF"/>'
    s+='<path d="M0 246 h358" stroke="#FFE08A" stroke-width="3" stroke-dasharray="22 22"/>'
    s+=auto(30,208,'#FF5E5B')+auto(230,208,'#FFC93C')+auto(120,248,'#5BC0EB',flip=True)+auto(300,248,'#39D353',flip=True)
    # weilanden met schapen (bermen = iets donkerder gras ertussen)
    s+='<rect x="0" y="316" width="358" height="40" fill="#8BD35A"/>'+'<rect x="0" y="386" width="358" height="40" fill="#8BD35A"/>'
    s+='<path d="M0 316 h358 M0 356 h358 M0 386 h358 M0 426 h358" stroke="#5FB05A" stroke-width="2"/>'
    for x,y in [(36,318),(206,318),(106,388),(286,388)]:
        s+=dier(x,y,'lam',0.85)
    # ganzenpad: klinkerstrook met ganzen
    s+='<svg x="0" y="456" width="358" height="40" viewBox="0 0 358 40">'+''.join(use('s9-klinker',x,0,32,32)+use('s9-klinker',x,32,32,32) for x in range(0,358,32))+'</svg>'
    for x in [106,146,186,226,266]:
        s+=dier(x,452,'gansje',0.85)
    # startstoep met Pino
    s+=stoep(526,H1-526)+stoeprand(526)
    s+=lantaarn_aan(24,540,0.9)+lantaarn_aan(316,540,0.9)
    s+=pino_tas10(160,548)
    return s
h=HEAD.format(title='Spel 10 – Bereik de bevalling (te voet)')+DEFS
h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'+kopbalk(4)
h+=f'''
  <!-- Avondstad te voet: stroken als patroon in de grond -->
  <div role="img" aria-label="Nederlandse avondstad in driekwartaanzicht: maan en sterren boven een rij grachtenpanden, daaronder van boven naar beneden een stoep met het witte ziekenhuisautootje, een weg met twee rijstroken vol auto's, twee weilanden met schapen, een klinkerpad met ganzen en de startstoep waar Pino met haar verloskundigentas staat; lantaarns branden" style="position: relative; margin: 12px 16px 0; height: {H1}px; border-radius: 22px; background: #2B4A66; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 {H1}" width="358" height="{H1}" aria-hidden="true">{stad()}</svg>
  </div>'''
h+=knoppen(PIJL_L,PIJL_O,PIJL_R,'#1FA3DC','#0E7FB5','Naar links','Vooruit','Naar rechts')
h+='</div>'+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel10.dc.html','w').write(h)

# ---------- Spel10-Auto: de weg van boven ----------
H2=640
def weg():
    s=f'<rect x="0" y="0" width="358" height="{H2}" fill="#4E9A3E"/>'
    s+='<rect x="60" y="0" width="238" height="640" fill="#4F6B7E"/><rect x="60" y="0" width="5" height="640" fill="#FFFFFF"/><rect x="293" y="0" width="5" height="640" fill="#FFFFFF"/>'
    s+='<path d="M179 0 v640" stroke="#FFE08A" stroke-width="4" stroke-dasharray="30 30"/>'
    for y in range(40,640,110):
        s+=use('s10-paaltje',30,y,10,26)+use('s10-paaltje',320,y,10,26)
    for x,y in [(2,120),(316,60),(0,420),(318,330),(8,560)]:
        s+=use('s8-boom',x,y,44,56)
    s+=lantaarn_aan(36,230,0.9)+lantaarn_aan(322,460,0.9)
    # ganzen steken ver vooruit over
    for x,y in [(150,-6),(190,2),(228,-6)]:
        s+=dier(x,y,'gansje',0.9)
    # tegenligger (linker baan), slome auto, Pino's ziekenhuisauto, politie erachter
    s+=use('s10-auto-top',96,60,56,96,'#FFC93C')
    s+=use('s10-auto-top',212,232,56,96,'#5BC0EB')
    s+=use('s10-ambu-top',214,366,52,88)
    s+=use('s10-politie-top',212,486,56,96)
    return s
h=HEAD.format(title='Spel 10 – Bereik de bevalling (in de auto)')+DEFS
h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'+kopbalk(2)
h+=f'''
  <!-- De weg vanuit de auto -->
  <div role="img" aria-label="Avondweg van boven met gras, bomen en brandende lantaarns aan beide kanten: Pino's witte ziekenhuisautootje onderaan, een gele tegenligger links, een slome blauwe auto vlak voor haar, een politieauto met zwaailicht achter haar en ganzen die ver vooruit oversteken" style="position: relative; margin: 12px 16px 0; height: {H2}px; border-radius: 22px; background: #4E9A3E; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 {H2}" width="358" height="{H2}" aria-hidden="true">{weg()}</svg>
  </div>'''
h+=knoppen(stuur(-35),REM,stuur(35),'#FF5E5B','#C43B38','Stuur naar links','Remmen','Stuur naar rechts')
h+='</div>'+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel10-Auto.dc.html','w').write(h)

# ---------- Spel10-Finale ----------
fin=HEAD.format(title='Spel 10 – finale: Pino is jarig')+DEFS
fin+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #FFE0EE; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; position: relative; overflow: hidden;">

  <!-- confetti, slinger en ballonnen -->
  <div aria-hidden="true" style="position: absolute; left: 24px; top: 40px; width: 10px; height: 10px; border-radius: 3px; background: #FF6FAE; box-shadow: 70px 30px 0 0 #FFC93C, 140px -10px 0 0 #39D353, 220px 24px 0 0 #9B6BFF, 290px 4px 0 0 #1FA3DC, 330px 50px 0 0 #FF6FAE, 100px 90px 0 0 #1FA3DC, 250px 80px 0 0 #FFC93C, 40px 700px 0 0 #9B6BFF, 320px 720px 0 0 #39D353, 180px 760px 0 0 #FF6FAE;"></div>
  <svg class="ic" viewBox="0 0 200 40" width="390" height="78" style="position: absolute; left: 0; top: 0;" aria-hidden="true">{use('s10-slinger',0,0,200,40)}</svg>
  <svg class="ic ballon" viewBox="0 0 40 70" width="44" height="77" style="left: 18px; top: 100px;" aria-hidden="true">{use('s10-ballon',0,0,40,70,'#1FA3DC')}</svg>
  <svg class="ic ballon" viewBox="0 0 40 70" width="44" height="77" style="left: 320px; top: 80px; animation-delay: 0.6s;" aria-hidden="true">{use('s10-ballon',0,0,40,70,'#FFC93C')}</svg>
  <svg class="ic ballon" viewBox="0 0 40 70" width="36" height="63" style="left: 300px; top: 160px; animation-delay: 1.2s;" aria-hidden="true">{use('s10-ballon',0,0,40,70,'#9B6BFF')}</svg>

  <div class="kaart" style="width: 100%; padding: 0 22px 22px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; margin-top: 40px;">
    <!-- Taart -->
    <div style="width: 140px; height: 140px; border-radius: 50%; background: #FFF1D6; border: 6px solid #FFFFFF; box-shadow: 0 0 0 3px #FF6FAE, 0 8px 18px rgba(30,58,76,0.18); box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin-top: -60px;">
      <svg class="ic" viewBox="0 0 48 48" width="104" height="104" role="img" aria-label="Verjaardagstaart met drie kaarsjes">{use('s10-taart',0,0,48,48)}</svg>
    </div>

    <div style="font-size: 12px; font-weight: 800; color: #B23A6A; letter-spacing: 1px;">3 DECEMBER · DEURTJE 10 VAN 10</div>
    <h1 class="kop" style="margin: 0; font-size: 34px;">Hartelijk gefeliciteerd, Pino!</h1>

    <!-- Pino met de baby, de gansjes en het lammetje -->
    <svg class="ic" viewBox="0 0 300 90" width="300" height="90" role="img" aria-label="Pino met de pasgeboren baby op de arm, tussen een lammetje en twee gansjes">
      <ellipse cx="150" cy="84" rx="130" ry="5" fill="#CDE4F0"/>
      {dier(30,40,'lam')}<g transform="translate(126 8)">{use('p-basis',0,0,48,72)}{use('s9-bundel',8,30,32,32,'#FFD6E6')}{use('s9-armen-om',0,0,48,72,'#F6C9A8')}<rect x="18" y="62" width="5" height="6" rx="2" fill="#B23A6A"/><rect x="25" y="62" width="5" height="6" rx="2" fill="#B23A6A"/></g>
      {dier(200,44,'gansje')}{dier(244,44,'gansje',0.9)}
    </svg>

    <!-- Alle behoeften op groen -->
    <div style="width: 100%; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px 10px; background: #F3F8FB; border-radius: 16px; padding: 12px 14px; box-sizing: border-box;">
      <div class="nood"><span class="nood-label">Verjaardag vieren</span><span class="nood-balk"><span></span></span></div>
      <div class="nood"><span class="nood-label">Gansjes</span><span class="nood-balk"><span></span></span></div>
      <div class="nood"><span class="nood-label">Lammetjes</span><span class="nood-balk"><span></span></span></div>
      <div class="nood"><span class="nood-label">Snoepjes</span><span class="nood-balk"><span></span></span></div>
      <div class="nood"><span class="nood-label">Jiujitsu</span><span class="nood-balk"><span></span></span></div>
      <div class="nood"><span class="nood-label">Bordspellen</span><span class="nood-balk"><span></span></span></div>
      <div class="nood"><span class="nood-label">Reizen</span><span class="nood-balk"><span></span></span></div>
      <div class="nood"><span class="nood-label">Sieraden</span><span class="nood-balk"><span></span></span></div>
    </div>

    <!-- Briefje -->
    <div style="width: 100%; display: flex; align-items: flex-start; gap: 12px; background: #FFE0EE; border-radius: 16px; padding: 12px 14px; box-sizing: border-box; text-align: left;">
      {ic('s9-hart',28,'#FF6FAE')}
      <div style="display: flex; flex-direction: column; gap: 2px;">
        <div style="font-size: 12px; font-weight: 800; color: #B23A6A; letter-spacing: 0.5px;">BRIEFJE VOOR PINO</div>
        <p style="margin: 0; font-size: 15px; line-height: 1.4; color: #35505F;">[Het laatste briefje – de verjaardagsboodschap.]</p>
      </div>
    </div>

    <a href="Main.dc.html" class="knop" style="width: 100%; box-sizing: border-box; background: #FF6FAE; color: #FFFFFF; box-shadow: 0 5px 0 0 #B23A6A;">Terug naar de kalender</a>
  </div>
</div>'''+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel10-Finale.dc.html','w').write(fin)

# ---------- sprite sheet ----------
sheet=HEAD.format(title='Spel 10 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 720px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 10 · Bereik de bevalling</h1>
    <span class="stat-label">AUTO'S VIA currentColor (ZIJ- EN BOVENAANZICHT) · SCHAPEN = LAM, GANZEN = GANSJE UIT SPEL 3 · LANTAARN UIT SPEL 9 MET GLOED · FINALE: TAART, BALLON, SLINGER</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">TE VOET · PINO MET TAS EN STETHOSCOOP · AUTO'S ZIJAANZICHT · ZIEKENHUISAUTOOTJE · GRACHTENPAND (currentColor) · STOEPTEGEL · MAAN · LANTAARN AAN</span>
    <div style="display: flex; gap: 18px; align-items: flex-end; flex-wrap: wrap;">'''
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 56 84" width="64" height="98">{pino_tas10(0,0)}</svg><span class="lbl">Pino te voet</span></div>'
for k in ['#FF5E5B','#FFC93C','#5BC0EB','#39D353']:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 72 40" width="72" height="40">{auto(0,0,k)}</svg><span class="lbl">auto</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 72 40" width="72" height="40">{use("s10-ambu",0,0,72,40)}</svg><span class="lbl">ziekenhuisautootje</span></div>'
for k in ['#C98B5A','#FFF1D6','#8AA0AF','#C43B38','#E8A9C4']:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 56 90" width="42" height="68">{use("s10-pand",0,0,56,90,k)}</svg><span class="lbl">pand</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 64 32" width="64" height="32">{use("s10-stoep",0,0,32,32)}{use("s10-stoep",32,0,32,32)}</svg><span class="lbl">stoep</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44" style="background:#2B4A66;border-radius:8px">{use("s10-maan",0,0,48,48)}{use("s10-ster",4,4,8,8)}{use("s10-ster",36,34,6,6)}</svg><span class="lbl">maan + ster</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="-28 -26 80 106" width="60" height="80" style="background:#4E9A3E;border-radius:8px">{lantaarn_aan(0,0)}</svg><span class="lbl">lantaarn aan</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">IN DE AUTO (BOVENAANZICHT) · TEGENLIGGER · ZIEKENHUISAUTO · POLITIE MET ZWAAILICHT · BERMPAALTJE · FINALE</span>
    <div style="display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
for lab,id,k in [('auto','s10-auto-top','#FFC93C'),('slome auto','s10-auto-top','#5BC0EB'),('ziekenhuisauto','s10-ambu-top',None),('politie','s10-politie-top',None)]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 56 96" width="56" height="96" style="background:#4F6B7E;border-radius:8px">{use(id,0,0,56,96,k)}</svg><span class="lbl">{lab}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="-4 -2 18 30" width="36" height="60" style="background:#4E9A3E;border-radius:8px">{use("s10-paaltje",0,0,10,26)}</svg><span class="lbl">paaltje</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="40" height="40">{use("s8-boom",2,-4,44,56)}</svg><span class="lbl">boom (spel 8)</span></div><span style="width:12px"></span>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="72" height="72">{use("s10-taart",0,0,48,48)}</svg><span class="lbl">taart</span></div>'
for k in ['#1FA3DC','#FFC93C','#9B6BFF','#FF6FAE']:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 40 70" width="36" height="63">{use("s10-ballon",0,0,40,70,k)}</svg><span class="lbl">ballon</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 200 40" width="200" height="40">{use("s10-slinger",0,0,200,40)}</svg><span class="lbl">slinger</span></div>'
for lab,p in [('stuur links',stuur(-35)),('rem',REM),('stuur rechts',stuur(35))]:
    bg='#FF5E5B' if lab=='rem' else '#E6EFF5'; col='#FFFFFF' if lab=='rem' else '#0E7FB5'
    sheet+=f'<div class="vak"><span style="width:52px;height:52px;border-radius:14px;background:{bg};display:flex;align-items:center;justify-content:center;color:{col}">{p}</span><span class="lbl">{lab}</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":720}}','{}')
open('pino/project/Spel10-Sprites.dc.html','w').write(sheet)
print('ok')
