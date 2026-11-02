# Bouwt Spel7.dc.html, Spel7-Klaar.dc.html en Spel7-Sprites.dc.html (poppenhuisstijl)
from spel7_sprites import DEFS, use, polaroid, SCENES, pino
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
.album{{background:#C2743C;background-image:radial-gradient(circle at 10px 10px, rgba(255,201,60,0.35) 0 4px, transparent 4px),radial-gradient(circle at 30px 30px, rgba(196,59,56,0.35) 0 4px, transparent 4px);background-size:40px 40px;box-shadow:inset 0 0 0 4px #8B4A1E,inset 0 0 0 8px #FFC93C,0 6px 0 0 #CDE4F0}}
.foto{{display:block;width:160px;height:194px}}
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
NAMEN={2:'Tuin van de koningin',3:'Complete the family',4:'(Social)ize the family',5:'Negotiate trade deal',6:'Selfdefense'}
GEVONDEN={2:True,3:True,4:False,5:False,6:False}

def kopbalk():
    return f'''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 7 · 30 NOVEMBER</div>
      <div class="kop" style="font-size: 20px;">Spot the peasant</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px 6px 8px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="{{{{gevonden}}}} van de 5 werkers gevonden">
      <svg class="ic" viewBox="0 0 48 48" width="24" height="24" aria-hidden="true">{use('s7-loep',0,0,48,48)}</svg>
      <span class="kop" style="font-size: 18px; color: #0E6A98;">{{{{gevonden}}}}<span style="font-size: 13px; color: #4F6B7E;"> / 5</span></span>
    </div>
  </div>'''

# ---------- Spel7: het album ----------
fotos=''
for i,nr in enumerate([2,3,4,5,6]):
    g=GEVONDEN[nr]; rot=(-3 if i%2==0 else 3)
    fotos+=f'''
    <a href="Spel{nr}.dc.html" class="foto" aria-label="Spel {nr}, {NAMEN[nr]}: werker {'gevonden' if g else 'nog niet gevonden'}"{' style="grid-column: 1 / span 2; justify-self: center;"' if nr==6 else ''}>
      <svg class="ic" viewBox="-12 -12 144 164" width="160" height="194" aria-hidden="true">{polaroid(nr,g,0,0,rot)}</svg>
    </a>'''
h=HEAD.format(title='Spel 7 – Spot the peasant')+DEFS
h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'+kopbalk()
h+=f'''
  <!-- Het fotoalbum: één polaroid per eerder spel; tik erop om terug te gaan en te zoeken -->
  <div role="group" aria-label="Fotoalbum van de spellen 2 tot en met 6" class="album" style="margin: 12px 16px 0; padding: 16px 12px 10px; border-radius: 22px; display: grid; grid-template-columns: repeat(2, 160px); justify-content: space-between; row-gap: 2px; flex: 1; align-content: start;">{fotos}
  </div>

  <!-- Voortgang: werker + balk -->
  <div style="padding: 12px 16px 16px;">
    <div class="kaart" style="padding: 10px 14px; display: flex; align-items: center; gap: 12px;" role="img" aria-label="Voortgang: 2 van de 5">
      <span style="width: 44px; height: 44px; border-radius: 50%; background: #D9F5DE; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <svg class="ic" viewBox="0 0 16 20" width="22" height="28" aria-hidden="true">{use('werker',0,0,16,20)}</svg>
      </span>
      <div aria-hidden="true" style="flex: 1; height: 12px; border-radius: 999px; background: #E6EFF5; overflow: hidden; box-shadow: inset 0 2px 0 0 #D3E1EA;"><div style="width: 40%; height: 100%; border-radius: 999px; background: #39D353; box-shadow: inset 0 -3px 0 0 #1FA34A;"></div></div>
    </div>
  </div>
</div>'''
h+=TAIL%('{"gevonden":{"editor":"int","default":2,"min":0,"max":5,"section":"Spelstand"},"$preview":{"width":390,"height":844}}','{ gevonden: this.props.gevonden ?? 2 }')
open('pino/project/Spel7.dc.html','w').write(h)

# ---------- Spel7-Klaar ----------
klaar=HEAD.format(title='Spel 7 – resultaat')+DEFS
rij=''.join(f'<g transform="translate({20+i*44} 30) scale(2.2)">{use("werker",0,0,16,20)}</g>' for i in range(5))
klaar+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">

  <!-- confetti -->
  <div aria-hidden="true" style="position: absolute; left: 30px; top: 60px; width: 10px; height: 10px; border-radius: 3px; background: #FF6FAE; box-shadow: 70px 30px 0 0 #FFC93C, 140px -10px 0 0 #39D353, 220px 24px 0 0 #9B6BFF, 290px 4px 0 0 #1FA3DC, 330px 50px 0 0 #FF6FAE, 100px 90px 0 0 #1FA3DC, 250px 80px 0 0 #FFC93C;"></div>

  <div class="kaart" style="width: 100%; border-radius: 26px; padding: 0 22px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; margin-top: 30px;">

    <div style="width: 128px; height: 128px; border-radius: 50%; background: #FFF1D6; border: 6px solid #FFFFFF; box-shadow: 0 0 0 3px #FFC93C, 0 8px 18px rgba(30,58,76,0.18); box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin-top: -50px;">
      <svg class="ic" viewBox="0 0 48 48" width="84" height="84" role="img" aria-label="Vergrootglas">{use('s7-loep',0,0,48,48)}</svg>
    </div>

    <div style="font-size: 12px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">SPOT THE PEASANT · KLAAR</div>
    <h1 class="kop" style="margin: 0; font-size: 30px;">Gevonden!</h1>

    <!-- de vijf werkers op een rij, Pino ernaast -->
    <svg class="ic" viewBox="0 0 300 100" width="300" height="100" role="img" aria-label="De vijf gevonden werkers op een rij naast Pino">
      <ellipse cx="150" cy="92" rx="140" ry="5" fill="#CDE4F0"/>
      {rij}
      <g transform="translate(246 6)">{pino(0,0,'vinger',1.0,True)}</g>
    </svg>

    <!-- scoretegels -->
    <div style="width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
      <div class="tegel"><span class="tegel-label">GEVONDEN</span><span class="kop" style="font-size: 26px; color: #1F7A3A;">5/5</span></div>
      <div class="tegel"><span class="tegel-label">TIJD</span><span class="kop" style="font-size: 26px; color: #0E6A98;">3:48</span></div>
      <div class="tegel"><span class="tegel-label">MISKLIKS</span><span class="kop" style="font-size: 26px; color: #C43B38;">7</span></div>
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
      <a href="Spel7.dc.html" class="knop" style="background: #E6EFF5; color: #4F6B7E; box-shadow: 0 5px 0 0 #CDE4F0;">Nog een keer</a>
    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel7-Klaar.dc.html','w').write(klaar)

# ---------- sprite sheet ----------
sheet=HEAD.format(title='Spel 7 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 560px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 7 · Spot the peasant</h1>
    <span class="stat-label">POLAROID UIT SPEL 4 · MINI-SCÈNES UIT DE SYMBOLEN VAN SPEL 2–6 · BADGES 48×48</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">POLAROIDS · GEVONDEN (STEMPEL + VINK) EN NOG NIET GEVONDEN (VERVAAGD + VRAAGTEKEN)</span>
    <div style="display: flex; gap: 18px; align-items: flex-start; flex-wrap: wrap;">'''
for nr in [2,3,4,5,6]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="-6 -10 132 156" width="132" height="156">{polaroid(nr,True)}</svg><span class="lbl">spel {nr} · gevonden</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="-6 -10 132 156" width="132" height="156">{polaroid(4,False)}</svg><span class="lbl">nog niet gevonden</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">BADGES EN ICONEN · ALBUMACHTERGROND (BATIK-STIPPEN, GOUDEN RAND)</span>
    <div style="display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
for lab,id in [('loep','s7-loep'),('vink','s7-vink'),('stempel gevonden','s7-stempel'),('nog zoeken','s7-vraag')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="56" height="56">{use(id,0,0,48,48)}</svg><span class="lbl">{lab}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 16 20" width="28" height="35">{use("werker",0,0,16,20)}</svg><span class="lbl">werker</span></div>'
sheet+='<div class="vak"><div class="album" style="width:160px;height:72px;border-radius:14px;"></div><span class="lbl">album</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":560}}','{}')
open('pino/project/Spel7-Sprites.dc.html','w').write(sheet)
print('ok')
