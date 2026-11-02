from spel3_sprites import DEFS, use, persoon, dier, plek
from spel2_sprites import gem
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
.familie{{position:relative;border-radius:18px;overflow:hidden;box-shadow:0 5px 0 0 #CDE4F0;height:150px}}
.familie-naam{{position:absolute;left:10px;top:8px;font-family:'Fredoka',sans-serif;font-weight:700;font-size:15px;color:#1E3A4C;background:rgba(255,255,255,0.85);border-radius:999px;padding:3px 10px}}
.kaartje{{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 6px 8px;border-radius:16px;background:#FFFFFF;border:0;box-shadow:0 4px 0 0 #CDE4F0;cursor:pointer;font-family:inherit;color:inherit;min-width:0}}
.kaartje-gekozen{{box-shadow:0 0 0 3px #1FA3DC,0 6px 0 0 #0E7FB5;transform:translateY(-6px)}}
.kaartje-duur{{opacity:0.45}}
.prijs{{display:inline-flex;align-items:center;gap:2px;background:#F3F8FB;border-radius:999px;padding:3px 7px}}
.lbl{{font-size:12px;font-weight:800;color:#4F6B7E;text-align:center}}
.vak{{display:flex;flex-direction:column;align-items:center;gap:6px}}
</style>
</helmet>
'''
TAIL='''
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":%d,"height":%d}}'>
class Component extends DCLogic {
  renderVals() { return {}; }
}
</script>
</body>
</html>
'''
def gemsvg(k,s=20): return f'<svg class="ic" viewBox="0 0 48 48" width="{s}" height="{s}" aria-hidden="true">{gem(24,24,k,44)}</svg>'

# ---- families als scènes (358x150) ----
def scene(naam, huis, lucht, grond, leden, lab, achter=''):
    out=f'''
    <div class="familie" role="img" aria-label="{lab}">
      <svg class="ic" viewBox="0 0 358 150" width="358" height="150">
        <rect x="0" y="0" width="358" height="150" fill="{lucht}"/>
        <rect x="0" y="104" width="358" height="46" fill="{grond}"/>
        <rect x="0" y="104" width="358" height="4" fill="rgba(0,0,0,0.08)"/>
        {achter}
        {use('huis-'+huis,186,4,160,110)}
        {''.join(leden)}
      </svg>
      <span class="familie-naam">{naam}</span>
    </div>'''
    return out
# posities op de grond: voeten rond y=140 → persoon (72 hoog) top=70; kind (52 hoog) top≈90; dier (40) top=100
fam1=scene('Familie Nguyễn','villa','#DDF1FB','#8BD35A',[
    persoon(14,66,'#9B6BFF','#E8B48A','bh-knot','#2B1A0E',jurk=True,acc=('acc-ketting',)),
    persoon(62,66,'#1E3A4C','#E8B48A','bh-kort','#2B1A0E',acc=('acc-hoed',)),
    plek(112,100), plek(156,100)],
    'Familie Nguyễn voor hun villa met rood getrapt dak: moeder met parelketting, vader met hoge hoed, twee lege plekken',
    achter='<g transform="translate(192 78) scale(1.5)" aria-hidden="true"><rect x="5" y="9" width="6" height="8" rx="1.5" fill="#C2743C"/><rect x="5" y="16" width="2" height="4" fill="#5C2E0E"/><rect x="9" y="16" width="2" height="4" fill="#5C2E0E"/><circle cx="8" cy="6" r="3.2" fill="#E8B48A"/><path d="M3 5 h10 l-2 -3 h-6z" fill="#39D353"/><rect x="11" y="8" width="1.5" height="9" fill="#8B4A1E"/><path d="M12.5 8 l3 -2" stroke="#A7B2BC" stroke-width="1.5"/></g>')
fam2=scene('Familie Tan','paal','#BFE6FA','#9ADB7A',[
    persoon(14,66,'#C43B38','#E8B48A','bh-lang','#2B1A0E',jurk=True,acc=('acc-nonla',)),
    persoon(62,66,'#39D353','#E8B48A','bh-kort','#2B1A0E',acc=('acc-pet',)),
    persoon(110,86,'#5BC0EB','#E8B48A','bh-lang','#FFC93C',jurk=True,kind=True,acc=('acc-rijsthoed-kind',)),
    plek(146,100,actief=True)],
    'Familie Tan voor hun paalwoning bij de rijstvelden: moeder met rijsthoed, vader met pet, dochtertje, en één lege plek die nu aan de beurt is')
fam3=scene('Familie Somchai','shop','#FFE0EE','#D9B27C',[
    persoon(14,66,'#FF6FAE','#C98B5A','bh-knot','#2B1A0E',jurk=True,acc=('acc-bril',)),
    persoon(62,66,'#1FA3DC','#E8B48A','bh-stekel','#2B1A0E'),
    persoon(110,86,'#FFC93C','#C98B5A','bh-stekel','#2B1A0E',kind=True),
    plek(150,100)],
    'Familie Somchai voor hun shophouse: moeder met bril, vader, zoontje, en één lege plek')

# ---- winkel ----
def kaart(naam, prijs, inner, cls, lab):
    return f'''
      <button type="button" class="{cls}" aria-label="{lab}">
        <svg class="ic" viewBox="0 0 48 52" width="60" height="65" aria-hidden="true">{inner}</svg>
        <span style="font-size: 13px; font-weight: 800;">{naam}</span>
        <span class="prijs">{''.join(gemsvg(k,16) for k in prijs)}</span>
      </button>'''
winkel=(kaart('Lammetje',['groen','groen'],dier(0,8,'lam'),'kaartje','Lammetje kopen voor twee groene edelstenen')
      + kaart('Gansje',['geel'],dier(0,8,'gansje'),'kaartje','Gansje kopen voor een gele edelsteen')
      + kaart('Meisje',['geel','blauw'],persoon(-7,-6,'#5BC0EB','#E8B48A','bh-lang','#FFC93C',jurk=True,kind=True,s=1.1),'kaartje','Meisje kopen voor een gele en een blauwe edelsteen')
      + kaart('Biggetje',['blauw','geel'],dier(0,8,'biggetje'),'kaartje kaartje-gekozen','Biggetje kopen voor een blauwe en een gele edelsteen (gekozen)'))

html=HEAD.format(title='Spel 3 – Complete the family')+DEFS
html+='''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">

  <!-- Kopbalk -->
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 3 · 26 NOVEMBER</div>
      <div class="kop" style="font-size: 20px;">Complete the family</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="Edelstenen: 2 blauw, 2 groen, 1 geel">
      <span style="display:flex;align-items:center;gap:3px;">''' + gemsvg('blauw') + '''<span class="kop" style="font-size: 15px; color: #0E6A98;">2</span></span>
      <span style="display:flex;align-items:center;gap:3px;">''' + gemsvg('groen') + '''<span class="kop" style="font-size: 15px; color: #1F7A3A;">2</span></span>
      <span style="display:flex;align-items:center;gap:3px;">''' + gemsvg('geel') + '''<span class="kop" style="font-size: 15px; color: #9A5B00;">1</span></span>
    </div>
  </div>

  <!-- Families als kleine scènes -->
  <div style="padding: 12px 16px 0; display: flex; flex-direction: column; gap: 10px;">''' + fam1 + fam2 + fam3 + '''
  </div>

  <!-- Winkel -->
  <div class="kaart" style="margin: auto 16px 16px; padding: 12px; display: flex; flex-direction: column; gap: 8px;">
    <span class="kop" style="font-size: 16px; padding: 0 2px;">Karakterkaarten</span>
    <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; padding-top: 6px;">''' + winkel + '''
    </div>
  </div>
</div>'''+TAIL%(390,844)
open('pino/project/Spel3.dc.html','w').write(html)

# ---- sprite sheet ----
sheet=HEAD.format(title='Spel 3 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 620px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 16px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 3 · Complete the family</h1>
    <span class="stat-label">PERSOON 48×72 (KIND ×0,72) · DIER 48×40 · HUIS 160×110 · KLEDING, HUID EN HAAR VIA currentColor</span>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">PERSONEN · LIJF / JURK + HOOFD + HAAR (KORT, LANG, KNOT, STEKELS) + ACCESSOIRE (NÓN LÁ, HOGE HOED, KETTING, BRIL, PET)</span>
    <div style="display: flex; gap: 18px; align-items: flex-end; flex-wrap: wrap;">''' 
for lab,p in [('moeder Nguyễn',persoon(0,0,'#9B6BFF','#E8B48A','bh-knot','#2B1A0E',jurk=True,acc=('acc-ketting',))),('vader Nguyễn',persoon(0,0,'#1E3A4C','#E8B48A','bh-kort','#2B1A0E',acc=('acc-hoed',))),
              ('moeder Tan',persoon(0,0,'#C43B38','#E8B48A','bh-lang','#2B1A0E',jurk=True,acc=('acc-nonla',))),('vader Tan',persoon(0,0,'#39D353','#E8B48A','bh-kort','#2B1A0E',acc=('acc-pet',))),
              ('moeder Somchai',persoon(0,0,'#FF6FAE','#C98B5A','bh-knot','#2B1A0E',jurk=True,acc=('acc-bril',))),('vader Somchai',persoon(0,0,'#1FA3DC','#E8B48A','bh-stekel','#2B1A0E')),
              ('meisje',persoon(0,20,'#5BC0EB','#E8B48A','bh-lang','#FFC93C',jurk=True,kind=True)),('jongetje',persoon(0,20,'#FFC93C','#C98B5A','bh-stekel','#2B1A0E',kind=True))]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 -12 48 84" width="56" height="98">{p}</svg><span class="lbl">{lab}</span></div>'
sheet+='''      <span style="width:24px"></span>'''
for lab,soort in [('lammetje','lam'),('gansje','gansje'),('biggetje','biggetje')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 40" width="64" height="54">{dier(0,0,soort)}</svg><span class="lbl">{lab}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 48 40" width="64" height="54">{plek(0,0)}</svg><span class="lbl">lege plek</span></div><div class="vak"><svg class="ic" viewBox="0 0 48 40" width="64" height="54">{plek(0,0,True)}</svg><span class="lbl">plek aan de beurt</span></div>'
sheet+='''    </div>
  </div>
  <div class="kaart" style="padding: 14px 16px; display: flex; flex-direction: column; gap: 8px;">
    <span class="stat-label">HUIZEN · VOORGEVEL + ZIJKANT, LICHT VAN LINKSBOVEN</span>
    <div style="display: flex; gap: 40px; align-items: flex-end;">'''
for lab,h in [('Thaise villa (rijk)','villa'),('paalwoning bij rijstvelden','paal'),('shophouse','shop')]:
    sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 160 110" width="240" height="165">{use("huis-"+h,0,0,160,110)}</svg><span class="lbl">{lab}</span></div>'
sheet+='''    </div>
  </div>
</div>'''+TAIL%(1000,620)
open('pino/project/Spel3-Sprites.dc.html','w').write(sheet)
print('ok')
