# Bouwt Spel6.dc.html, Spel6-Controle.dc.html, Spel6-Klaar.dc.html en Spel6-Sprites.dc.html (poppenhuisstijl)
from spel6_sprites import DEFS, use, kraam, lampion, pino, zakkenroller, pino_tas, bezoeker
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
.move{{display:flex;align-items:center;justify-content:center;padding:10px;border-radius:18px;background:#FFFFFF;border:0;box-shadow:0 5px 0 0 #CDE4F0;cursor:pointer;font-family:inherit;color:#6B3FCF;min-width:0}}
.move-actief{{box-shadow:0 0 0 4px #9B6BFF,0 6px 0 0 #6B3FCF}}
.move-bol{{width:56px;height:56px;border-radius:50%;background:#F1E8FF;display:flex;align-items:center;justify-content:center}}
.knop{{font-family:'Nunito',sans-serif;font-weight:800;font-size:18px;border-radius:999px;border:0;cursor:pointer;min-height:54px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:8px}}
.tegel{{display:flex;flex-direction:column;align-items:center;gap:4px;background:#F3F8FB;border-radius:16px;padding:12px 8px}}
.tegel-label{{font-size:11px;font-weight:800;color:#4F6B7E;letter-spacing:0.5px}}
.lbl{{font-size:12px;font-weight:800;color:#4F6B7E;text-align:center}}
.vak{{display:flex;flex-direction:column;align-items:center;gap:6px}}
@keyframes puls{{0%,100%{{transform:scale(1)}}50%{{transform:scale(1.06)}}}}
.puls{{animation:puls 0.8s ease-in-out infinite}}
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
def munt(s=22): return f'<svg class="ic" viewBox="0 0 48 48" width="{s}" height="{s}" aria-hidden="true">{use("s4-munt",0,0,48,48)}</svg>'

def kopbalk():
    return f'''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 6 · 29 NOVEMBER</div>
      <div class="kop" style="font-size: 20px;">Selfdefense</div>
    </div>
    <div style="display: flex; align-items: center; gap: 5px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px 6px 8px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="Portemonnee: {{{{portemonnee}}}} Simoleons">
      {munt(24)}<span class="kop" style="font-size: 18px; color: #9A5B00;">{{{{portemonnee}}}}</span>
    </div>
  </div>'''

# ---------- drukke marktsteeg (358 x H) ----------
def steeg(H, midden):
    s=f'<rect x="0" y="0" width="358" height="{H}" fill="#556B8E"/>'
    for yy in range(0,H,28):
        for xx in range(0,358,28):
            off=14 if (yy//28)%2 else 0
            s+=f'<rect x="{xx+off+1}" y="{yy+1}" width="26" height="26" rx="4" fill="#4E6384"/>'
    s+='<path d="M0 28 q90 22 180 0 t178 0" fill="none" stroke="#8B4A1E" stroke-width="2.5"/>'
    for i,(x,k) in enumerate([(18,'#FF5E5B'),(78,'#FFC93C'),(138,'#FF5E5B'),(198,'#FF8A3D'),(258,'#FF5E5B'),(318,'#FFC93C')]):
        s+=lampion(x,[36,44,40,36,42,38][i],k)
    # kramen van Siti en Minh langs de bovenrand
    s+=kraam('Siti',8,50)+kraam('Minh',220,50)
    # menigte achter (klein = verder weg)
    s+=bezoeker(0,150,118,0.78)+bezoeker(1,196,128,0.8)+bezoeker(3,34,176,0.86)
    # verstopte werker (spel 7): in de menigte, half achter bezoeker 4
    s+=use('werker',309,208,16,20)
    s+=bezoeker(4,276,184,0.9)+bezoeker(2,108,196,0.9)
    s+=midden
    # menigte voor (groter = dichterbij)
    s+=bezoeker(5,22,H-120)+bezoeker(1,112,H-96,kind=True)+bezoeker(3,286,H-116)+bezoeker(0,206,H-84,0.96)
    s+=lampion(330,H-150,'#FF8A3D')+f'<rect x="338" y="{H-118}" width="4" height="60" fill="#8B4A1E"/>'
    return s

# ---------- Spel6: de greep ----------
H1=592
midden1=zakkenroller(206,286)+pino_tas(150,268)+use('s6-tril',186,300,36,36)
h=HEAD.format(title='Spel 6 – Selfdefense')+DEFS
h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'+kopbalk()
h+=f'''
  <!-- Drukke marktsteeg -->
  <div role="img" aria-label="Drukke nachtmarkt in driekwartaanzicht: kramen van Siti en Minh, lampions, bezoekers; achter Pino grijpt een zakkenroller in donkere hoodie naar haar tas, alleen trillijntjes bij de tas" style="position: relative; margin: 12px 16px 0; height: {H1}px; border-radius: 22px; background: #556B8E; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 {H1}" width="358" height="{H1}" aria-hidden="true">{steeg(H1,midden1)}</svg>
  </div>

  <!-- Reactieknop met slinkende ring (alleen icoon) -->
  <div style="margin-top: auto; padding: 14px 16px 18px; display: flex; justify-content: center;">
    <button type="button" class="puls" aria-label="Reageer nu" style="position: relative; width: 150px; height: 150px; border-radius: 50%; border: 0; background: #FF5E5B; box-shadow: 0 8px 0 0 #C43B38, 0 14px 24px rgba(196,59,56,0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; font-family: inherit; color: #FFFFFF;">
      <svg class="ic" viewBox="0 0 160 160" width="150" height="150" style="position: absolute; inset: 0;" aria-hidden="true"><circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="8"/><path d="M80 10 a70 70 0 1 1 -60.6 35" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/></svg>
      <svg class="ic" viewBox="0 0 48 48" width="64" height="64" aria-hidden="true">{use('s6-reageer',0,0,48,48)}</svg>
    </button>
  </div>
</div>'''
h+=TAIL%('{"portemonnee":{"editor":"int","default":26,"min":0,"max":200,"section":"Spelstand"},"$preview":{"width":390,"height":844}}','{ portemonnee: this.props.portemonnee ?? 26 }')
open('pino/project/Spel6.dc.html','w').write(h)

# ---------- Spel6-Controle: de klem ----------
H2=600
midden2=f'<g transform="translate(96 262)">{use("s6-klem",0,0,140,90)}</g>'
midden2+='<rect x="92" y="364" width="150" height="12" rx="6" fill="#E6EFF5"/><rect x="92" y="364" width="60" height="12" rx="6" fill="#FF5E5B"/><rect x="92" y="372" width="60" height="4" rx="2" fill="#C43B38"/>'
h=HEAD.format(title='Spel 6 – Selfdefense (controle)')+DEFS
h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'+kopbalk()
h+=f'''
  <!-- Politie onderweg: icoon, balk, tijd -->
  <div class="kaart" style="margin: 12px 16px 0; padding: 10px 14px; display: flex; align-items: center; gap: 12px;" role="img" aria-label="Politie onderweg: 55 procent, nog 18 seconden">
    <svg class="ic" viewBox="0 0 48 48" width="34" height="34" aria-hidden="true">{use('s6-politie',0,0,48,48)}</svg>
    <div aria-hidden="true" style="flex: 1; height: 14px; border-radius: 999px; background: #E6EFF5; overflow: hidden; box-shadow: inset 0 2px 0 0 #D3E1EA;">
      <div style="width: 55%; height: 100%; border-radius: 999px; background: #1FA3DC; box-shadow: inset 0 -4px 0 0 #0E7FB5;"></div>
    </div>
    <span class="kop" style="font-size: 16px; color: #0E6A98;">0:18</span>
  </div>

  <!-- Marktsteeg: Pino houdt de zakkenroller in de klem; omstanders kijken toe -->
  <div role="img" aria-label="Pino zit bovenop de zakkenroller en houdt hem in een armklem op de kasseien; marktbezoekers kijken toe. Rode balk onder hen: hoe hard hij tegenworstelt" style="position: relative; margin: 12px 16px 0; height: {H2}px; border-radius: 22px; background: #556B8E; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 {H2}" width="358" height="{H2}" aria-hidden="true">{steeg(H2,midden2)}</svg>
  </div>

  <!-- Jiujitsu-moves (alleen iconen) -->
  <div style="margin-top: auto; padding: 14px 16px 18px; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px;" role="group" aria-label="Jiujitsu-moves">
    <button type="button" class="move" aria-label="Greep"><span class="move-bol"><svg class="ic" viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">{use('s6-move-greep',0,0,48,48)}</svg></span></button>
    <button type="button" class="move move-actief" aria-label="Draai, nu aan de beurt"><span class="move-bol"><svg class="ic" viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">{use('s6-move-draai',0,0,48,48)}</svg></span></button>
    <button type="button" class="move" aria-label="Klem"><span class="move-bol"><svg class="ic" viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">{use('s6-move-klem',0,0,48,48)}</svg></span></button>
    <button type="button" class="move" aria-label="Vasthouden"><span class="move-bol"><svg class="ic" viewBox="0 0 48 48" width="32" height="32" aria-hidden="true">{use('s6-move-houd',0,0,48,48)}</svg></span></button>
  </div>
</div>'''
h+=TAIL%('{"portemonnee":{"editor":"int","default":26,"min":0,"max":200,"section":"Spelstand"},"$preview":{"width":390,"height":844}}','{ portemonnee: this.props.portemonnee ?? 26 }')
open('pino/project/Spel6-Controle.dc.html','w').write(h)

# ---------- Spel6-Klaar ----------
klaar=HEAD.format(title='Spel 6 – resultaat')+DEFS
klaar+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">

  <!-- confetti -->
  <div aria-hidden="true" style="position: absolute; left: 30px; top: 60px; width: 10px; height: 10px; border-radius: 3px; background: #FF6FAE; box-shadow: 70px 30px 0 0 #FFC93C, 140px -10px 0 0 #39D353, 220px 24px 0 0 #9B6BFF, 290px 4px 0 0 #1FA3DC, 330px 50px 0 0 #FF6FAE, 100px 90px 0 0 #1FA3DC, 250px 80px 0 0 #FFC93C;"></div>

  <div class="kaart" style="width: 100%; border-radius: 26px; padding: 0 22px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; margin-top: 30px;">

    <div style="width: 128px; height: 128px; border-radius: 50%; background: #F1E8FF; border: 6px solid #FFFFFF; box-shadow: 0 0 0 3px #9B6BFF, 0 8px 18px rgba(30,58,76,0.18); box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin-top: -50px;">
      <svg class="ic" viewBox="0 0 48 48" width="84" height="84" role="img" aria-label="Jiujitsu-gi">{use('s6-gi',0,0,48,48)}</svg>
    </div>

    <div style="font-size: 12px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">SELFDEFENSE · KLAAR</div>
    <h1 class="kop" style="margin: 0; font-size: 30px;">Oss!</h1>

    <!-- politie neemt de zakkenroller mee, Pino met tas -->
    <svg class="ic" viewBox="0 0 240 96" width="250" height="100" role="img" aria-label="De politieauto neemt de zakkenroller mee; Pino heeft haar tas nog">
      <ellipse cx="120" cy="90" rx="100" ry="5" fill="#CDE4F0"/>
      {use('s6-politie',140,20,96,72)}
      {zakkenroller(96,14,arm=False,s=0.95)}
      {pino_tas(28,12)}
    </svg>

    <!-- scoretegels -->
    <div style="width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
      <div class="tegel"><span class="tegel-label">REACTIE</span><span class="kop" style="font-size: 26px; color: #1F7A3A;">0,4s</span></div>
      <div class="tegel"><span class="tegel-label">MOVES</span><span class="kop" style="font-size: 26px; color: #0E6A98;">9/10</span></div>
      <div class="tegel"><span class="tegel-label">GERED</span><span style="display:flex;align-items:center;gap:4px;">{munt(20)}<span class="kop" style="font-size: 26px; color: #9A5B00;">26</span></span></div>
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
      <a href="Spel6.dc.html" class="knop" style="background: #E6EFF5; color: #4F6B7E; box-shadow: 0 5px 0 0 #CDE4F0;">Nog een keer</a>
    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel6-Klaar.dc.html','w').write(klaar)

# ---------- sprite sheet ----------
sheet=HEAD.format(title='Spel 6 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 600px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 6 · Selfdefense</h1>
    <span class="stat-label">MARKT, KRAMEN EN LAMPIONS UIT SPEL 5 · BEZOEKERS = PERSOON-SYMBOLEN UIT SPEL 3 · MOVE-ICONEN VIA currentColor</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">PINO MET TAS · ZAKKENROLLER (LIJF + KAP + GRIJPARM) · TRILLIJNTJES · KLEM · MARKTBEZOEKERS</span>
    <div style="display: flex; gap: 18px; align-items: flex-end; flex-wrap: wrap;">'''
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 56 84" width="64" height="98">{pino_tas(0,0)}</svg><span class="lbl">Pino met tas</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="-22 -12 70 84" width="80" height="98">{zakkenroller(0,0)}</svg><span class="lbl">zakkenroller grijpt</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="56" height="98">{zakkenroller(0,0,arm=False)}</svg><span class="lbl">zakkenroller</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44">{use("s6-tril",0,0,48,48)}</svg><span class="lbl">trilling</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -10 140 100" width="168" height="120">{use("s6-klem",0,0,140,90)}</svg><span class="lbl">armklem</span></div><span style="width:12px"></span>'
for i in range(6):
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="48" height="84">{bezoeker(i,0,0)}</svg><span class="lbl">bezoeker {i+1}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 16 20" width="24" height="30">{use("werker",0,0,16,20)}</svg><span class="lbl">werker</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">KNOPICONEN · POLITIEAUTO · GI</span>
    <div style="display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
sheet+=f'<div class="vak"><span style="width:64px;height:64px;border-radius:50%;background:#FF5E5B;display:flex;align-items:center;justify-content:center;color:#FFFFFF"><svg class="ic" viewBox="0 0 48 48" width="40" height="40">{use("s6-reageer",0,0,48,48)}</svg></span><span class="lbl">reageer</span></div>'
for lab,id in [('greep','s6-move-greep'),('draai','s6-move-draai'),('klem','s6-move-klem'),('houd','s6-move-houd')]:
    sheet+=f'<div class="vak"><span class="move-bol" style="color:#6B3FCF"><svg class="ic" viewBox="0 0 48 48" width="32" height="32">{use(id,0,0,48,48)}</svg></span><span class="lbl">{lab}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="64" height="64">{use("s6-politie",0,0,48,48)}</svg><span class="lbl">politieauto</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="64" height="64">{use("s6-gi",0,0,48,48)}</svg><span class="lbl">jiujitsu-gi</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":600}}','{}')
open('pino/project/Spel6-Sprites.dc.html','w').write(sheet)
print('ok')
