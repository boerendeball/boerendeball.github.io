# Bouwt Spel5.dc.html, Spel5-Onderhandel.dc.html, Spel5-Klaar.dc.html en Spel5-Sprites.dc.html (poppenhuisstijl)
from spel5_sprites import DEFS, use, kraam, lampion, handelaar, LUIFEL, WAAR, pino
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
.knop{{font-family:'Nunito',sans-serif;font-weight:800;font-size:18px;border-radius:999px;border:0;cursor:pointer;min-height:54px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:8px}}
.stap{{width:46px;height:46px;border-radius:50%;border:0;background:#E3F4FC;color:#0E7FB5;font-family:'Fredoka',sans-serif;font-weight:700;font-size:24px;cursor:pointer;box-shadow:0 3px 0 0 #CDE4F0}}
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
def munt(s=22): return f'<svg class="ic" viewBox="0 0 48 48" width="{s}" height="{s}" aria-hidden="true">{use("s4-munt",0,0,48,48)}</svg>'

# ---------- nachtmarkt 358 x 582, tekenvolgorde achter → voor ----------
def markt():
    s='<rect x="0" y="0" width="358" height="582" fill="#556B8E"/>'
    # kasseien (raster van donkere tegels)
    for yy in range(0,582,28):
        for xx in range(0,358,28):
            off=14 if (yy//28)%2 else 0
            s+=f'<rect x="{xx+off+1}" y="{yy+1}" width="26" height="26" rx="4" fill="#4E6384"/>'
    s+='<rect x="0" y="0" width="358" height="582" fill="rgba(0,0,0,0)"/>'
    # lampionslinger bovenaan
    s+='<path d="M0 28 q90 22 180 0 t178 0" fill="none" stroke="#8B4A1E" stroke-width="2.5"/>'
    for i,(x,k) in enumerate([(18,'#FF5E5B'),(78,'#FFC93C'),(138,'#FF5E5B'),(198,'#FF8A3D'),(258,'#FF5E5B'),(318,'#FFC93C')]):
        s+=lampion(x,[36,44,40,36,42,38][i],k)
    # mat met mandjes en krukje bij de put
    s+=use('s5-mat',126,170,96,40)
    # kramen (achterste rij)
    s+=kraam('Mai',8,54)+kraam('Arun',220,54)
    # verstopte werker (spel 7), half achter de put
    s+=use('werker',176,242,16,20)
    s+=use('s5-put',143,228,72,84)
    s+=use('s5-kruk',106,296,24,28)
    # losse lampions op palen bij de onderste kramen
    s+='<rect x="194" y="330" width="4" height="70" fill="#8B4A1E"/>'+lampion(186,308,'#FF8A3D')
    # Pino loopt naar de kraam van Arun
    s+=pino(246,176,'loop')
    # kramen (voorste rij)
    s+=kraam('Siti',8,344)+kraam('Minh',220,344)
    s+=use('s5-mat',126,500,96,40)
    return s
MARKT_LBL=('Nachtmarkt in driekwartaanzicht: kasseien, slinger van rood-gele lampions, vier kramen met gekleurde luifels '
           '(Mai en Arun boven, Siti en Minh onder) met handelaars achter hun toonbank vol sieraden, stoffen en lampions, '
           'een waterput in het midden; Pino loopt naar de kraam van Arun.')

def kopbalk():
    return f'''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 5 · 28 NOVEMBER</div>
      <div class="kop" style="font-size: 20px;">Negotiate trade deal</div>
    </div>
    <div style="display: flex; align-items: center; gap: 5px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px 6px 8px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="Portemonnee: {{{{portemonnee}}}} Simoleons">
      {munt(24)}<span class="kop" style="font-size: 18px; color: #9A5B00;">{{{{portemonnee}}}}</span>
    </div>
  </div>'''

def scherm(overlay):
    extra=''
    if overlay:
        extra=f'''
  <!-- Dimlaag en onderhandelscherm -->
  <div aria-hidden="true" style="position: absolute; inset: 0; background: rgba(30,58,76,0.5);"></div>
  <div role="dialog" aria-label="Onderhandelen met Arun" class="kaart" style="position: absolute; left: 20px; right: 20px; top: 236px; padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 14px; border-radius: 26px;">
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="position: relative; width: 72px; height: 72px; border-radius: 50%; background: #FFE3D6; display: flex; align-items: flex-end; justify-content: center; overflow: visible; flex-shrink: 0;">
        <svg class="ic" viewBox="0 -4 48 44" width="68" height="62" role="img" aria-label="Arun"><clipPath id="c-arun"><circle cx="24" cy="18" r="30"/></clipPath><g clip-path="url(#c-arun)">{handelaar('Arun',0,0)}</g></svg>
        <span style="position: absolute; right: -6px; bottom: -4px; width: 26px; height: 26px;" role="img" aria-label="Stemming: twijfelt"><svg class="ic" viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">{use('s5-stemming-twijfel',0,0,48,48)}</svg></span>
      </div>
      <div style="flex: 1; display: flex; align-items: center; gap: 12px; background: #F3F8FB; border-radius: 16px 16px 16px 4px; padding: 10px 14px;" role="img" aria-label="Arun vraagt 48 Simoleons voor de ketting">
        <svg class="ic" viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">{use('s5-ketting',0,0,48,48)}</svg>
        <span style="display: flex; align-items: center; gap: 5px;">{munt(26)}<span class="kop" style="font-size: 28px; color: #9A5B00;">48</span></span>
      </div>
    </div>
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px;" role="group" aria-label="Jouw bod">
      <button type="button" class="stap" aria-label="Bod verlagen">−</button>
      <span style="display: flex; align-items: center; gap: 6px; min-width: 96px; justify-content: center;">{munt(28)}<span class="kop" style="font-size: 32px; color: #0E6A98;">{{{{bod}}}}</span></span>
      <button type="button" class="stap" aria-label="Bod verhogen">+</button>
    </div>
    <div style="display: flex; gap: 10px;">
      <a href="Spel5.dc.html" class="knop" aria-label="Weglopen" style="width: 54px; padding: 0; background: #E6EFF5; color: #4F6B7E; box-shadow: 0 5px 0 0 #CDE4F0;"><svg class="ic" viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">{use('s5-wegloop',0,0,48,48)}</svg></a>
      <button type="button" class="knop" aria-label="Bied {{{{bod}}}} Simoleons" style="flex: 1; background: #39D353; color: #0E3D1C; box-shadow: 0 5px 0 0 #1FA34A;"><svg class="ic" viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">{use('s5-praat',0,0,48,48)}</svg>{munt(24)}<span class="kop" style="font-size: 22px;">{{{{bod}}}}</span></button>
    </div>
  </div>'''
    title='Spel 5 – Negotiate trade deal'+(' (onderhandelen)' if overlay else '')
    h=HEAD.format(title=title)+DEFS
    h+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'
    h+=kopbalk()
    h+=f'''
  <!-- Marktplein -->
  <div role="img" aria-label="{MARKT_LBL}" style="position: relative; margin: 12px 16px 0; height: 582px; border-radius: 22px; background: #556B8E; box-shadow: 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 582" width="358" height="582" aria-hidden="true">{markt()}</svg>
  </div>

  <!-- Besturing -->
  <div style="margin-top: auto; padding: 12px 16px 16px; display: flex; align-items: center; justify-content: space-between; gap: 16px;">
    <div role="group" aria-label="Loop met de pijlen" style="display: grid; grid-template-columns: repeat(3, 52px); grid-template-rows: repeat(3, 52px); gap: 4px;">
      <span></span>
      <button type="button" class="pijl" aria-label="Omhoog"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M10 30 L24 16 L38 30" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <span></span>
      <button type="button" class="pijl" aria-label="Links"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button type="button" class="pijl" aria-label="Omlaag"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M10 18 L24 32 L38 18" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <button type="button" class="pijl" aria-label="Rechts"><svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M18 10 L32 24 L18 38" fill="none" stroke="#0E7FB5" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <a href="Spel5-Onderhandel.dc.html" aria-label="Praat met de handelaar" style="width: 128px; height: 128px; border-radius: 50%; background: #1FA3DC; box-shadow: 0 8px 0 0 #0E7FB5, 0 14px 24px rgba(14,127,181,0.35); display: flex; align-items: center; justify-content: center; color: #FFFFFF;">
      <svg class="ic" viewBox="0 0 48 48" width="60" height="60" aria-hidden="true">{use('s5-praat',0,0,48,48)}<circle cx="17" cy="22" r="2.5" fill="#1FA3DC"/><circle cx="24" cy="22" r="2.5" fill="#1FA3DC"/><circle cx="31" cy="22" r="2.5" fill="#1FA3DC"/></svg>
    </a>
  </div>{extra}
</div>'''
    h+=TAIL%('{"portemonnee":{"editor":"int","default":60,"min":0,"max":200,"section":"Spelstand"},"bod":{"editor":"int","default":38,"min":1,"max":200,"section":"Spelstand"},"$preview":{"width":390,"height":844}}',
             '{ portemonnee: this.props.portemonnee ?? 60, bod: this.props.bod ?? 38 }')
    return h
open('pino/project/Spel5.dc.html','w').write(scherm(False))
open('pino/project/Spel5-Onderhandel.dc.html','w').write(scherm(True))

# ---------- Spel5-Klaar ----------
klaar=HEAD.format(title='Spel 5 – resultaat')+DEFS
klaar+=f'''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden;">

  <!-- confetti -->
  <div aria-hidden="true" style="position: absolute; left: 30px; top: 60px; width: 10px; height: 10px; border-radius: 3px; background: #FF6FAE; box-shadow: 70px 30px 0 0 #FFC93C, 140px -10px 0 0 #39D353, 220px 24px 0 0 #9B6BFF, 290px 4px 0 0 #1FA3DC, 330px 50px 0 0 #FF6FAE, 100px 90px 0 0 #1FA3DC, 250px 80px 0 0 #FFC93C;"></div>

  <div class="kaart" style="width: 100%; border-radius: 26px; padding: 0 22px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; text-align: center; margin-top: 30px;">

    <div style="width: 128px; height: 128px; border-radius: 50%; background: #FFE0EE; border: 6px solid #FFFFFF; box-shadow: 0 0 0 3px #FF6FAE, 0 8px 18px rgba(30,58,76,0.18); box-sizing: border-box; display: flex; align-items: center; justify-content: center; margin-top: -50px;">
      <svg class="ic" viewBox="0 0 48 48" width="84" height="84" role="img" aria-label="Ketting met roze steen">{use('s5-ketting',0,0,48,48)}</svg>
    </div>

    <div style="font-size: 12px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">NEGOTIATE TRADE DEAL · KLAAR</div>
    <h1 class="kop" style="margin: 0; font-size: 30px;">Deal!</h1>

    <!-- Pino met ketting en Arun, handen schudden -->
    <svg class="ic" viewBox="0 0 200 90" width="220" height="99" role="img" aria-label="Pino en Arun schudden elkaar de hand">
      <ellipse cx="100" cy="84" rx="80" ry="5" fill="#CDE4F0"/>
      <g transform="translate(40 6)">{pino(0,0,'vinger')}</g>
      <g transform="translate(104 6) scale(-1 1) translate(-48 0)">{handelaar('Arun',0,0)}</g>
      <svg x="86" y="0" width="28" height="28" viewBox="0 0 48 48">{use('s5-stemming-blij',0,0,48,48)}</svg>
    </svg>

    <!-- scoretegels -->
    <div style="width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px;">
      <div class="tegel"><span class="tegel-label">BETAALD</span><span style="display:flex;align-items:center;gap:4px;">{munt(20)}<span class="kop" style="font-size: 26px; color: #1F7A3A;">34</span></span></div>
      <div class="tegel"><span class="tegel-label">LAAGSTE</span><span style="display:flex;align-items:center;gap:4px;">{munt(20)}<span class="kop" style="font-size: 26px; color: #0E6A98;">31</span></span></div>
      <div class="tegel"><span class="tegel-label">OVER</span><span style="display:flex;align-items:center;gap:4px;">{munt(20)}<span class="kop" style="font-size: 26px; color: #9A5B00;">26</span></span></div>
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
      <a href="Spel5.dc.html" class="knop" style="background: #E6EFF5; color: #4F6B7E; box-shadow: 0 5px 0 0 #CDE4F0;">Nog een keer</a>
    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":390,"height":844}}','{}')
open('pino/project/Spel5-Klaar.dc.html','w').write(klaar)

# ---------- sprite sheet ----------
sheet=HEAD.format(title='Spel 5 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 640px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 5 · Negotiate trade deal</h1>
    <span class="stat-label">HANDELAARS = PERSOON-SYMBOLEN UIT SPEL 3 · KRAAM IN TWEE LAGEN (LUIFEL VIA currentColor) · LAMPION VIA currentColor</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">HANDELAARS · PINO (LOOP) · STEMMINGEN · KETTING · KNOPICONEN</span>
    <div style="display: flex; gap: 18px; align-items: flex-end; flex-wrap: wrap;">'''
for naam in ['Mai','Arun','Siti','Minh']:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="56" height="98">{handelaar(naam,0,0)}</svg><span class="lbl">{naam}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="56" height="98">{pino(0,0,"loop")}</svg><span class="lbl">Pino loopt</span></div><span style="width:16px"></span>'
for lab,id in [('twijfelt','s5-stemming-twijfel'),('blij','s5-stemming-blij'),('boos','s5-stemming-boos'),('ketting','s5-ketting'),('munt §','s4-munt')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44">{use(id,0,0,48,48)}</svg><span class="lbl">{lab}</span></div>'
for lab,id in [('praat','s5-praat'),('weglopen','s5-wegloop')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 48" width="44" height="44" style="color:#0E7FB5">{use(id,0,0,48,48)}</svg><span class="lbl">{lab}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 16 20" width="24" height="30">{use("werker",0,0,16,20)}</svg><span class="lbl">werker</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">KRAMEN (ACHTER + HANDELAAR + VOOR + WAREN) · WATERPUT · MAT · KRUKJE · LAMPIONS</span>
    <div style="display: flex; gap: 22px; align-items: flex-end; flex-wrap: wrap;">'''
for naam in ['Mai','Arun','Siti','Minh']:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 130 120" width="130" height="120">{kraam(naam,0,0)}</svg><span class="lbl">kraam {naam} · {WAAR[naam]}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 130 120" width="130" height="120">{use("s5-kraam-achter",0,0,130,120,"#9B6BFF")}{use("s5-kraam-voor",0,0,130,120)}{use("s5-waar-fruit",14,58,100,30)}</svg><span class="lbl">kraam leeg · fruit</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 72 84" width="72" height="84">{use("s5-put",0,0,72,84)}</svg><span class="lbl">waterput</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 96 40" width="96" height="40">{use("s5-mat",0,0,96,40)}</svg><span class="lbl">mat</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 24 28" width="30" height="35">{use("s5-kruk",0,0,24,28)}</svg><span class="lbl">krukje</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="-30 -24 140 80" width="140" height="80" style="background:#556B8E;border-radius:8px">{lampion(0,0,"#FF5E5B")}{lampion(30,0,"#FFC93C")}{lampion(60,0,"#FF8A3D")}</svg><span class="lbl">lampions + gloed</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%('{"$preview":{"width":1000,"height":640}}','{}')
open('pino/project/Spel5-Sprites.dc.html','w').write(sheet)
print('ok')
