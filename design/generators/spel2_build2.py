import math
from spel2_sprites import DEFS, hex_gras, hex_tegel, hex_doel, gem, use, KLEUR
def hex_sym(id,cx,cy,s=56): return use(id,cx-s/2,cy-s*58/112-4,s,s*66/56)
from spel1_sprites import pino
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
.spaak{{position:absolute;height:3px;background:#FFFFFF;opacity:0.75;transform-origin:0 50%;border-radius:2px}}
.aantal{{position:absolute;right:-2px;top:-2px;min-width:24px;height:24px;border-radius:999px;background:#FFFFFF;color:#1E3A4C;font-family:'Nunito',sans-serif;font-weight:800;font-size:13px;display:flex;align-items:center;justify-content:center;padding:0 6px;box-sizing:border-box;box-shadow:0 2px 0 0 #CDE4F0}}
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
# ---- raster ----
ox,oy=28,40; dx,dy=55,48; COLS=6; ROWS=14
def c(col,row): return ox+col*dx+(dx/2 if row%2 else 0), oy+row*dy
def step(p,m):
    col,row=p; odd=row%2
    if m=='R': return (col+1,row)
    if m=='UR': return (col+(1 if odd else 0), row-1)
    if m=='UL': return (col-(0 if odd else 1), row-1)
route=[(0,13)]
for m in ['R','UR','UL','UR','UR','R','UL','UR','UL','UL','UR','UR','R','UR','UL','UR']:
    route.append(step(route[-1],m))
gelegd=[('groen','boom'),('groen','vlinder'),('blauw','vlinder'),('blauw','boom'),('geel','boom'),('geel','vogel'),('blauw','vogel')]
routeset={p:i for i,p in enumerate(route)}
extra={(3,11):('geel','vlinder'),(3,10):('groen','vogel'),(3,12):('blauw','boom')}
OMRINGD=(2,11)
FONTEIN=(4,6)
UITGANG=route[-1]
WERKER=(3,10)   # staat op een gelegde tegel; pas zichtbaar als die tegel ligt
def grid_svg(markeer_gem=True):
    out=''
    for row in range(ROWS):          # van achter naar voren tekenen
        for col in range(COLS):
            x,y=c(col,row); i=routeset.get((col,row))
            if (col,row)==OMRINGD: out+=hex_gras(x,y)
            elif (col,row)==FONTEIN: out+=hex_sym('hx-fontein',x,y)
            elif (col,row)==UITGANG: out+=hex_sym('hx-uitgang',x,y)
            elif (col,row) in extra: out+=hex_tegel(x,y,*extra[(col,row)])
            elif i is not None and i<len(gelegd): out+=hex_tegel(x,y,*gelegd[i])
            elif i==len(gelegd): out+=hex_doel(x,y)
            else: out+=hex_gras(x,y)
    return out
ax,ay=c(*route[len(gelegd)]); gx,gy=c(*OMRINGD); sx,sy=c(*route[0]); ex,ey=c(*route[-1])

def kop(gemtellers=True):
    return '''
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 2 · 25 NOVEMBER</div>
      <div class="kop" style="font-size: 20px;">Tuin van de koningin</div>
    </div>
    <div style="display: flex; align-items: center; gap: 8px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px; box-shadow: 0 4px 0 0 #CDE4F0;" role="img" aria-label="Edelstenen: 1 blauw, 0 groen, 2 geel">
      <span style="display:flex;align-items:center;gap:3px;"><svg class="ic" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">''' + gem(24,24,'blauw',44) + '''</svg><span class="kop" style="font-size: 15px; color: #0E6A98;">1</span></span>
      <span style="display:flex;align-items:center;gap:3px;"><svg class="ic" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">''' + gem(24,24,'groen',44) + '''</svg><span class="kop" style="font-size: 15px; color: #1F7A3A;">0</span></span>
      <span style="display:flex;align-items:center;gap:3px;"><svg class="ic" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true">''' + gem(24,24,'geel',44) + '''</svg><span class="kop" style="font-size: 15px; color: #9A5B00;">2</span></span>
    </div>
  </div>'''

def tuin(mode):
    # mode: None | 'menu' | 'gem'
    lab={'menu':'Tropische tuin in driekwartaanzicht; het volgende vak is gekozen en een taartmenu toont de beschikbare tegels met aantallen',
         'gem':'Een omringd grasvak licht op en een taartmenu biedt een blauwe, groene of gele edelsteen',
         None:'Tropische tuin als zeshoekig grasraster in driekwartaanzicht; een pad van stenen tegels loopt van Pino linksonder naar de tuinpoort rechtsboven, een fonteintegel staat ergens op het bord, het volgende vak is gemarkeerd met een vraagteken'}[mode]
    out=f'''
  <div style="position: relative; margin: 12px 16px 16px; flex: 1; border-radius: 22px; background: #5FB05A; box-shadow: inset 0 0 0 4px #4E9A3E, 0 6px 0 0 #CDE4F0; overflow: hidden;">
    <svg class="ic" viewBox="0 0 358 744" width="358" height="744" role="img" aria-label="{lab}" style="position:absolute;left:0;top:0;">
      {grid_svg()}
      {'' if mode=='gem' else '<path d="M%.0f %.0f l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z" fill="#FFC93C"/>' % (gx,gy-14)}
      {pino(sx-24,sy-66,'staan')}
      <!-- verstopte werker (spel 7): staat op een gelegde tegel -->
      <g transform="translate({c(*WERKER)[0]-8:.0f} {c(*WERKER)[1]-20:.0f})"><rect x="5" y="9" width="6" height="8" rx="1.5" fill="#C2743C"/><rect x="5" y="16" width="2" height="4" fill="#5C2E0E"/><rect x="9" y="16" width="2" height="4" fill="#5C2E0E"/><circle cx="8" cy="6" r="3.2" fill="#E8B48A"/><path d="M3 5 h10 l-2 -3 h-6z" fill="#39D353"/><rect x="11" y="8" width="1.5" height="9" fill="#8B4A1E"/><path d="M12.5 8 l3 -2" stroke="#A7B2BC" stroke-width="1.5"/></g>
    </svg>'''
    if mode=='menu':
        opts=[('geel','vlinder',2),('blauw','vogel',1),('groen','boom',3),('geel','vogel',1),('blauw','boom',2)]
        R=104; angles=[-90,-30,30,150,210,90]; parts=''
        for (k,f,n),ang in zip(opts,angles):
            a=math.radians(ang); px=ax+R*math.cos(a); py=ay+R*math.sin(a)
            parts+=f'<div class="spaak" aria-hidden="true" style="left:{ax:.0f}px;top:{ay:.0f}px;width:{R-30}px;transform:rotate({ang}deg);"></div>'
            parts+=f'<a href="Spel2.dc.html" role="menuitem" aria-label="Leg {k} met {f}, nog {n} over" style="position:absolute;left:{px-34:.0f}px;top:{py-40:.0f}px;width:68px;height:80px;display:block;filter:drop-shadow(0 10px 14px rgba(30,58,76,0.35));"><svg class="ic" viewBox="0 0 68 80" width="68" height="80">{hex_tegel(34,38,k,f,62)}</svg><span class="aantal" aria-hidden="true">{n}</span></a>'
        a=math.radians(90); px=ax+R*math.cos(a); py=ay+R*math.sin(a)
        parts+=f'<div class="spaak" aria-hidden="true" style="left:{ax:.0f}px;top:{ay:.0f}px;width:{R-30}px;transform:rotate(90deg);"></div>'
        parts+=f'<a href="Spel2.dc.html" role="menuitem" aria-label="Annuleren" style="position:absolute;left:{px-24:.0f}px;top:{py-24:.0f}px;width:48px;height:48px;border-radius:50%;background:#FFFFFF;box-shadow:0 4px 0 0 #CDE4F0,0 8px 16px rgba(30,58,76,0.25);display:flex;align-items:center;justify-content:center;"><svg class="ic" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path d="M12 12 L36 36 M36 12 L12 36" stroke="#4F6B7E" stroke-width="6" stroke-linecap="round"/></svg></a>'
        out+=f'''
    <div aria-hidden="true" style="position:absolute;inset:0;background:rgba(30,58,76,0.42);border-radius:22px;"></div>
    <div aria-hidden="true" style="position:absolute;left:{ax-36:.0f}px;top:{ay-36:.0f}px;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.35);box-shadow:0 0 0 4px #1FA3DC;"></div>
    <svg class="ic" viewBox="0 0 56 66" width="56" height="66" style="position:absolute;left:{ax-28:.0f}px;top:{ay-33:.0f}px;" aria-hidden="true">{hex_doel(28,33)}</svg>
    <div role="menu" aria-label="Kies een tegel voor dit vak">{parts}</div>'''
    if mode=='gem':
        R=96; parts=''
        for kleur,ang,lab2 in [('blauw',-150,'Blauwe edelsteen'),('groen',-90,'Groene edelsteen'),('geel',-30,'Gele edelsteen')]:
            a=math.radians(ang); px=gx+R*math.cos(a); py=gy+R*math.sin(a)
            parts+=f'<div class="spaak" aria-hidden="true" style="left:{gx:.0f}px;top:{gy:.0f}px;width:{R-34}px;transform:rotate({ang}deg);"></div>'
            parts+=f'<a href="Spel2.dc.html" role="menuitem" aria-label="Kies {lab2.lower()}" style="position:absolute;left:{px-32:.0f}px;top:{py-32:.0f}px;width:64px;height:64px;border-radius:50%;background:#FFFFFF;box-shadow:0 4px 0 0 #CDE4F0,0 8px 16px rgba(30,58,76,0.25);display:flex;align-items:center;justify-content:center;"><svg class="ic" viewBox="0 0 48 48" width="44" height="44">{gem(24,24,kleur,44)}</svg></a>'
        out+=f'''
    <div aria-hidden="true" style="position:absolute;inset:0;background:rgba(30,58,76,0.42);border-radius:22px;"></div>
    <div aria-hidden="true" style="position:absolute;left:{gx-36:.0f}px;top:{gy-36:.0f}px;width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,0.35);box-shadow:0 0 0 4px #FFC93C;"></div>
    <svg class="ic" viewBox="0 0 56 66" width="56" height="66" style="position:absolute;left:{gx-28:.0f}px;top:{gy-33:.0f}px;" aria-hidden="true">{hex_gras(28,33)}<path d="M28 10 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3z" fill="#FFC93C"/></svg>
    <div role="menu" aria-label="Kies een edelsteen">{parts}</div>'''
    out+='\n  </div>'
    return out

def artboard(mode):
    title='Spel 2 – Tuin van de koningin'+{None:'','menu':' (tegel kiezen)','gem':' (edelsteen kiezen)'}[mode]
    html=HEAD.format(title=title)+DEFS
    html+='<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">'
    html+=kop()+tuin(mode)+'\n</div>'+TAIL%(390,844)
    return html
open('pino/project/Spel2.dc.html','w').write(artboard(None))
open('pino/project/Spel2-Menu.dc.html','w').write(artboard('menu'))
open('pino/project/Spel2-Edelsteen.dc.html','w').write(artboard('gem'))

# ---- sprite sheet ----
sheet=HEAD.format(title='Spel 2 – sprite-set')+DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 560px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 18px;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 2 · Tuin van de koningin</h1>
    <span class="stat-label">HEX 56×66 · BOVENVLAK + VOORKANT 7 PX · RIJEN VAN ACHTER NAAR VOREN</span>
  </div>
  <div class="kaart" style="padding: 16px; display: flex; flex-direction: column; gap: 12px;">
    <span class="stat-label">TEGELS · 3 KLEUREN × 3 MOTIEVEN · GRAS · DOEL</span>
    <div style="display: flex; gap: 14px; align-items: flex-end; flex-wrap: wrap;">'''
for k in ['groen','geel','blauw']:
    for m in ['vlinder','boom','vogel']:
        sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 56 66" width="56" height="66">{hex_tegel(28,33,k,m)}</svg><span class="lbl">{k}·{m}</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 56 66" width="56" height="66">{hex_gras(28,33)}</svg><span class="lbl">gras</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 56 66" width="56" height="66">{hex_doel(28,33)}</svg><span class="lbl">volgende vak</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 56 66" width="56" height="66">{hex_sym("hx-fontein",28,33)}</svg><span class="lbl">fontein</span></div>'
sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 56 66" width="56" height="66">{hex_sym("hx-uitgang",28,33)}</svg><span class="lbl">uitgang</span></div>'
sheet+='''    </div>
  </div>
  <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 18px;">
    <div class="kaart" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;"><span class="stat-label">VERSTOPTE WERKER · 16×20 · PAS ZICHTBAAR ALS ZIJN TEGEL LIGT</span><svg class="ic" viewBox="0 0 16 20" width="48" height="60"><rect x="5" y="9" width="6" height="8" rx="1.5" fill="#C2743C"/><rect x="5" y="16" width="2" height="4" fill="#5C2E0E"/><rect x="9" y="16" width="2" height="4" fill="#5C2E0E"/><circle cx="8" cy="6" r="3.2" fill="#E8B48A"/><path d="M3 5 h10 l-2 -3 h-6z" fill="#39D353"/><rect x="11" y="8" width="1.5" height="9" fill="#8B4A1E"/><path d="M12.5 8 l3 -2" stroke="#A7B2BC" stroke-width="1.5"/></svg></div>
    <div class="kaart" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;"><span class="stat-label">PINO · HERGEBRUIK SPRITE-SET SPEL 1</span><svg class="ic" viewBox="0 0 48 72" width="64" height="96">''' + pino(0,0,'staan') + '''</svg></div>
    <div class="kaart" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;"><span class="stat-label">EDELSTENEN · 48×48 · currentColor</span><div style="display:flex;gap:16px;">''' + ''.join(f'<svg class="ic" viewBox="0 0 48 48" width="56" height="56">{gem(24,24,k,44)}</svg>' for k in ['blauw','groen','geel']) + '''</div></div>
  </div>
</div>'''+TAIL%(1000,560)
open('pino/project/Spel2-Sprites.dc.html','w').write(sheet)
print('ok', ax,ay,gx,gy)
