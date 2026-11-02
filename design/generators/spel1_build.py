from spel1_sprites import DEFS, bed, pino, KLEUR, HUID, HAAR
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
.lbl{{font-size:12px;font-weight:800;color:#4F6B7E;text-align:center}}
.vak{{display:flex;flex-direction:column;align-items:center;gap:6px}}
</style>
</helmet>
'''
TAIL='''
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{props}'>
class Component extends DCLogic {{
  renderVals() {{ {body} }}
}}
</script>
</body>
</html>
'''
# ---------- Sprite sheet ----------
sheet=HEAD.format(title='Spel 1 – sprite-set')
sheet+=DEFS
sheet+='''<div class="vloer" style="width: 1000px; height: 640px; box-sizing: border-box; background-color: #BFE6FA; padding: 28px 32px; display: flex; flex-direction: column; gap: 18px; position: relative;">
  <div style="display: flex; justify-content: space-between; align-items: baseline;">
    <h1 class="kop" style="margin: 0; font-size: 26px;">Sprite-set spel 1 · Princess Presence</h1>
    <span class="stat-label">POPPENHUISSTIJL · VLAK · 1 SCHADUWTINT · LICHT VAN LINKSBOVEN</span>
  </div>

  <div style="display: grid; grid-template-columns: 300px 1fr; gap: 18px; flex: 1;">
    <!-- Pino -->
    <div class="kaart" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
      <span class="stat-label">PINO · 48×72 · 3 POSES</span>
      <div style="display: flex; justify-content: space-around; align-items: flex-end;">
        <div class="vak"><svg class="ic" viewBox="0 0 48 72" width="72" height="108">''' + pino(0,0,'staan') + '''</svg><span class="lbl">staan</span></div>
        <div class="vak"><svg class="ic" viewBox="0 0 48 72" width="72" height="108">''' + pino(0,0,'loop') + '''</svg><span class="lbl">lopen</span></div>
        <div class="vak"><svg class="ic" viewBox="-2 0 64 72" width="96" height="108">''' + pino(0,0,'vinger') + '''</svg><span class="lbl">vinger in mond</span></div>
      </div>
      <span class="stat-label" style="margin-top: 6px;">REKWISIETEN</span>
      <div style="display: flex; justify-content: space-around; align-items: flex-end;">
        <div class="vak"><svg class="ic" viewBox="0 0 64 52" width="80" height="65"><use href="#raam" width="64" height="52"/></svg><span class="lbl">raam</span></div>
        <div class="vak"><svg class="ic" viewBox="0 0 32 44" width="40" height="55"><use href="#nachtlamp" width="32" height="44"/></svg><span class="lbl">nachtlamp</span></div>
        <div class="vak"><svg class="ic" viewBox="0 0 96 48" width="96" height="48"><use href="#kleedje" width="96" height="48"/></svg><span class="lbl">kleedje</span></div>
      </div>
    </div>

    <!-- Kinderen en bedden -->
    <div class="kaart" style="padding: 16px; display: flex; flex-direction: column; gap: 10px;">
      <span class="stat-label">KIND IN BED · 3 GEZICHTEN × WISSELBAAR HAAR EN HUID · 9 DEKENS (3 KLEUREN × 3 MOTIEVEN)</span>
      <div style="display: grid; grid-template-columns: repeat(9, 1fr); gap: 6px; align-items: end;">'''
gez=['slaap','gaap','verrast']
i=0
for kleur in ['groen','geel','blauw']:
    for motief in ['vlinder','boom','vogel']:
        haar,hk=HAAR[i%6]; huid=HUID[i%3]; g=gez[i%3]
        sheet+=f'<div class="vak"><svg class="ic" viewBox="0 0 64 84" width="64" height="84">{bed(0,0,kleur,motief,g,huid,haar,hk)}</svg><span class="lbl">{kleur}·{motief}</span></div>'
        i+=1
sheet+='''      </div>
      <div style="display: flex; gap: 18px; margin-top: 4px; align-items: center;">
        <span class="stat-label">GEZICHTEN</span>'''
for g,lab in [('slaap','slapend'),('gaap','gapend'),('verrast','verrast (vinger)')]:
    sheet+=f'<div class="vak" style="flex-direction: row; gap: 8px;"><svg class="ic" viewBox="0 0 32 32" width="40" height="40"><use href="#k-hoofd" width="32" height="32" color="#F6C9A8"/><use href="#h-bob" width="32" height="32" color="#4A3426"/><use href="#g-{g}" width="32" height="32"/></svg><span class="lbl">{lab}</span></div>'
sheet+='''        <span class="stat-label" style="margin-left: auto;">RASTER 56 PX · TEKENVOLGORDE VAN ACHTER NAAR VOREN</span>
      </div>
    </div>
  </div>
</div>'''
sheet+=TAIL.format(props='{"$preview":{"width":1000,"height":640}}', body='return {};')
open('pino/project/Spel1-Sprites.dc.html','w').write(sheet)

# ---------- Spelscherm ----------
spel=HEAD.format(title='Spel 1 – Princess Presence')
spel+=DEFS
spel+='''<div class="vloer" style="width: 390px; height: 844px; box-sizing: border-box; background-color: #BFE6FA; display: flex; flex-direction: column; overflow: hidden; position: relative;">

  <!-- Kopbalk -->
  <div style="padding: 14px 16px 0; display: flex; align-items: center; gap: 10px;">
    <a href="Open.dc.html" aria-label="Terug naar het deurtje" style="display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; background: #FFFFFF; box-shadow: 0 4px 0 0 #CDE4F0; flex-shrink: 0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="#0E7FB5" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
    <div style="display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0;">
      <div style="font-size: 11px; font-weight: 800; color: #0E7FB5; letter-spacing: 1px;">DAG 1 · 24 NOVEMBER</div>
      <div class="kop" style="font-size: 20px;">Princess Presence</div>
    </div>
    <div style="display: flex; align-items: center; gap: 6px; background: #FFFFFF; border-radius: 999px; padding: 6px 12px 6px 8px; box-shadow: 0 4px 0 0 #CDE4F0;">
      <svg class="ic" viewBox="0 0 48 48" width="22" height="22" aria-hidden="true"><path d="M8 36 L6 14 L17 24 L24 10 L31 24 L42 14 L40 36z" fill="#FFC93C"/><rect x="8" y="36" width="32" height="6" rx="2" fill="#D97A00"/><circle cx="24" cy="30" r="3" fill="#FF6FAE"/></svg>
      <span class="kop" style="font-size: 18px; color: #B23A6A;">{{score}}</span>
    </div>
  </div>

  <!-- Tijd -->
  <div class="kaart" style="margin: 12px 16px 0; padding: 10px 14px; display: flex; align-items: center; gap: 12px;">
    <span class="stat-label">TIJD</span>
    <div aria-hidden="true" style="flex: 1; height: 14px; border-radius: 999px; background: #E6EFF5; overflow: hidden; box-shadow: inset 0 2px 0 0 #D3E1EA;">
      <div style="width: {{tijdBreedte}}; height: 100%; border-radius: 999px; background: #FFC93C; box-shadow: inset 0 -4px 0 0 #D97A00;"></div>
    </div>
    <span class="kop" style="font-size: 18px; color: #D97A00; min-width: 44px; text-align: right;">{{tijd}}</span>
  </div>

  <!-- Slaapzaal in poppenhuisstijl -->
  <div style="position: relative; margin: 12px 16px 0; height: 500px; border-radius: 22px; overflow: hidden; box-shadow: 0 6px 0 0 #CDE4F0;">
    <svg class="ic" viewBox="0 0 358 500" width="358" height="500" role="img" aria-label="Slaapzaal in driekwartaanzicht met negen bedden; prinses Pino stopt haar vinger in de mond van een verrast kind, twee andere kinderen gapen">
      <!-- muur en vloer -->
      <rect x="0" y="0" width="358" height="96" fill="#FFE0EE"/>
      <rect x="0" y="0" width="358" height="96" fill="url(#behang)"/>
      <rect x="0" y="92" width="358" height="8" fill="#C98B5A"/>
      <rect x="0" y="100" width="358" height="400" fill="#F6EBDD"/>
      <g opacity="0.35" stroke="#C2743C" stroke-width="2">''' + ''.join(f'<line x1="0" y1="{y}" x2="358" y2="{y}"/>' for y in range(136,500,36)) + '''</g>
      <defs><pattern id="behang" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="12" cy="12" r="2.5" fill="#FF9BC8" opacity="0.5"/></pattern></defs>
      <use href="#raam" x="147" y="18" width="64" height="52"/>
      <use href="#kleedje" x="131" y="236" width="96" height="48"/>
'''
# bedden: 3 kolommen x 3 rijen, raster
cols=[24,147,270]; rows=[86,222,358]
config=[
 [('blauw','vlinder','slaap',0,0),('geel','boom','slaap',1,1),('groen','vogel','gaap',2,2)],
 [('groen','vlinder','slaap',1,3),('geel','vogel','verrast',0,4),('blauw','boom','slaap',2,5)],
 [('geel','vlinder','slaap',2,0),('groen','boom','gaap',0,1),('blauw','vogel','slaap',1,2)],
]
for r,row in enumerate(config):
    for c,(kleur,motief,g,hi,hj) in enumerate(row):
        haar,hk=HAAR[hj]; spel+=bed(cols[c],rows[r],kleur,motief,g,HUID[hi],haar,hk)+'\n'
        if g=='slaap':
            bx,by=cols[c]+50,rows[r]+22
            spel+=f'<g font-family="Nunito, sans-serif" font-weight="800" fill="#8AA0AF"><text x="{bx}" y="{by}" font-size="11">z</text><text x="{bx+7}" y="{by-8}" font-size="9">z</text><text x="{bx+13}" y="{by-15}" font-size="7">z</text></g>\n'
# nachtlampje
spel+='      <use href="#nachtlamp" x="320" y="440" width="32" height="44"/>\n'
# Pino naast het middelste bed (links ervan), vinger in de mond
spel+=pino(92,232,'vinger')+'\n'
# gaap-labels en timers
def gaap(x,y,txt,arc):
    return f'''      <g transform="translate({x} {y})"><circle cx="0" cy="24" r="12" fill="#FFFFFF" stroke="#E6EFF5" stroke-width="4"/><path d="{arc}" fill="none" stroke="#FF5E5B" stroke-width="4" stroke-linecap="round"/></g>\n'''
spel+=gaap(302,66,'','M0 12 a12 12 0 0 1 12 12')
spel+=gaap(56,338,'','M0 12 a12 12 0 1 1 -8.5 20.5')
spel+='''      <g transform="translate(202 206)"><rect x="-18" y="-12" width="36" height="22" rx="11" fill="#39D353"/><rect x="-18" y="7" width="36" height="4" rx="2" fill="#1FA34A"/><text x="0" y="4" text-anchor="middle" font-size="13" font-weight="800" fill="#0E3D1C" font-family="Nunito, sans-serif">+1</text></g>
    </svg>
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
    <button type="button" aria-label="Onderbreek de gaap: vinger in de mond" style="width: 128px; height: 128px; border-radius: 50%; border: 0; background: #FF5E5B; box-shadow: 0 8px 0 0 #C43B38, 0 14px 24px rgba(196,59,56,0.35); display: flex; align-items: center; justify-content: center; cursor: pointer; font-family: inherit; color: #FFFFFF;">
      <svg class="ic" viewBox="0 0 48 48" width="54" height="54" aria-hidden="true">
        <!-- hand die naar rechts wijst: wijsvinger uitgestoken, drie gekromde vingers eronder, duim bovenop -->
        <path d="M6 20 a4 4 0 0 1 4 -4 h4 v-3 a3.5 3.5 0 0 1 7 0 v3 h20 a4 4 0 0 1 0 8 h-14 v3.5 a3.5 3.5 0 0 1 -0.5 1.8 a3.5 3.5 0 0 1 -1 6 a3.5 3.5 0 0 1 -2 6 h-8 a9.5 9.5 0 0 1 -9.5 -9.5z" fill="#FFFFFF"/>
        <path d="M18 28 h8 M18 34.5 h7 M18 41 h5" stroke="#FF5E5B" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</div>'''
spel+=TAIL.format(props='{"score":{"editor":"int","default":7,"min":0,"max":99,"section":"Spelstand"},"seconden":{"editor":"int","default":42,"min":0,"max":90,"unit":"s","section":"Spelstand"},"$preview":{"width":390,"height":844}}',
                  body="var s = this.props.seconden ?? 42; var m = Math.floor(s / 60); var r = s % 60; return { score: this.props.score ?? 7, tijd: m + ':' + (r < 10 ? '0' + r : r), tijdBreedte: Math.round((s / 90) * 100) + '%' };")
open('pino/project/Spel1.dc.html','w').write(spel)
print('ok')
