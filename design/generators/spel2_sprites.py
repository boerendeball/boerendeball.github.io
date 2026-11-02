from spel1_sprites import DEFS as DEFS1
# Hex in driekwartaanzicht: bovenvlak (puntig) + voorkant met dikte 7
HEX_TOP='28,2 54,16 54,44 28,58 2,44 2,16'
HEX_FRONT='M2 44 L28 58 L54 44 v7 L28 65 L2 51z'
EXTRA='''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
  <!-- gras-hex: zacht groen bovenvlak, donkere voorkant -->
  <symbol id="hx-gras" viewBox="0 0 56 66"><path d="''' + HEX_FRONT + '''" fill="#4E9A3E"/><polygon points="''' + HEX_TOP + '''" fill="#8BD35A"/><polygon points="28,6 50,18 50,42 28,54 6,42 6,18" fill="#9ADB7A"/><path d="M14 30 l2 -6 M22 38 l2 -6 M36 26 l2 -6 M40 40 l2 -6" stroke="#5FB05A" stroke-width="2" stroke-linecap="round"/></symbol>
  <!-- tegel-hex: steen met gekleurd bovenvlak (currentColor) -->
  <symbol id="hx-tegel" viewBox="0 0 56 66"><path d="''' + HEX_FRONT + '''" fill="currentColor"/><path d="''' + HEX_FRONT + '''" fill="rgba(0,0,0,0.28)"/><polygon points="''' + HEX_TOP + '''" fill="currentColor"/><polygon points="''' + HEX_TOP + '''" fill="rgba(0,0,0,0.1)"/><polygon points="28,6 50,18 50,42 28,54 6,42 6,18" fill="currentColor"/><path d="M6 18 L28 6 L50 18" fill="none" stroke="rgba(255,255,255,0.45)" stroke-width="3" stroke-linejoin="round"/></symbol>
  <!-- doel-hex: lichtblauw met stippellijn en vraagteken -->
  <symbol id="hx-doel" viewBox="0 0 56 66"><path d="''' + HEX_FRONT + '''" fill="#0E7FB5"/><polygon points="''' + HEX_TOP + '''" fill="#1FA3DC"/><polygon points="28,6 50,18 50,42 28,54 6,42 6,18" fill="#DDF1FB"/><polygon points="28,12 44,21 44,39 28,48 12,39 12,21" fill="none" stroke="#1FA3DC" stroke-width="2.5" stroke-dasharray="5 4"/><text x="28" y="37" text-anchor="middle" font-size="20" font-weight="700" fill="#0E7FB5" font-family="Fredoka, sans-serif">?</text></symbol>
  <!-- fontein-hex: één tegel met een fonteintje erop -->
  <symbol id="hx-fontein" viewBox="0 0 56 66"><path d="M2 44 L28 58 L54 44 v7 L28 65 L2 51z" fill="#7D8A96"/><polygon points="28,2 54,16 54,44 28,58 2,44 2,16" fill="#A7B2BC"/><polygon points="28,6 50,18 50,42 28,54 6,42 6,18" fill="#CFD8DC"/><ellipse cx="28" cy="36" rx="16" ry="7" fill="#5BC0EB"/><ellipse cx="28" cy="35" rx="11" ry="4" fill="#8ED8F8" opacity="0.7"/><rect x="25" y="20" width="6" height="14" rx="2" fill="#E6EFF5"/><ellipse cx="28" cy="20" rx="9" ry="3" fill="#CFD8DC"/><path d="M28 18 q-7 -9 -12 -3 M28 18 q7 -9 12 -3 M28 18 v-9" fill="none" stroke="#5BC0EB" stroke-width="2.5" stroke-linecap="round"/><circle cx="15" cy="14" r="1.5" fill="#5BC0EB"/><circle cx="41" cy="14" r="1.5" fill="#5BC0EB"/><circle cx="28" cy="7" r="1.5" fill="#5BC0EB"/></symbol>
  <!-- uitgang-hex: stenen tegel met tuinpoort (rood met gouden nok) -->
  <symbol id="hx-uitgang" viewBox="0 0 56 66"><path d="M2 44 L28 58 L54 44 v7 L28 65 L2 51z" fill="#7D8A96"/><polygon points="28,2 54,16 54,44 28,58 2,44 2,16" fill="#A7B2BC"/><polygon points="28,6 50,18 50,42 28,54 6,42 6,18" fill="#D9B27C"/><rect x="13" y="16" width="5" height="30" fill="#C43B38"/><rect x="38" y="16" width="5" height="30" fill="#C43B38"/><rect x="9" y="12" width="38" height="5" rx="1" fill="#C43B38"/><path d="M9 12 q-2 -4 0 -6 M47 12 q2 -4 0 -6" stroke="#FFC93C" stroke-width="2.5" stroke-linecap="round" fill="none"/><rect x="12" y="20" width="32" height="3" fill="#FFC93C"/><path d="M18 46 h20" stroke="#8B4A1E" stroke-width="2"/></symbol>
  <!-- kraanvogel, wit, 24x32 -->
  <symbol id="m-kraan" viewBox="0 0 24 32"><ellipse cx="11" cy="17" rx="7" ry="4.5" fill="#FFFFFF"/><path d="M4.5 15 q-3 -1 -4 2 q2 -0.5 4 0z" fill="#FFFFFF"/><path d="M15 14 q2 -6 1 -11" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="3" r="2.6" fill="#FFFFFF"/><path d="M18.4 3 l5 1 -5 1.2z" fill="#FFFFFF"/><circle cx="16.4" cy="2.6" r="0.7" fill="#1E3A4C"/><path d="M9 21 v8 M13 21 v8" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/><path d="M7 29 h4 M11 29 h4" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round"/><path d="M8 15 q3 -5 7 -3" fill="none" stroke="rgba(30,58,76,0.18)" stroke-width="1.2"/></symbol>
  <!-- lotusvijver met sala, 96x80 -->
  <symbol id="vijver" viewBox="0 0 96 80">
    <ellipse cx="48" cy="66" rx="44" ry="12" fill="#0E7FB5"/><ellipse cx="48" cy="62" rx="44" ry="12" fill="#5BC0EB"/><ellipse cx="48" cy="62" rx="36" ry="8" fill="#8ED8F8" opacity="0.6"/>
    <ellipse cx="20" cy="64" rx="9" ry="5" fill="#39D353"/><ellipse cx="76" cy="66" rx="9" ry="5" fill="#39D353"/><ellipse cx="48" cy="70" rx="7" ry="4" fill="#2E7D1E"/>
    <path d="M26 58 l4 -8 4 8z M22 60 l8 -11 8 11z" fill="#FF6FAE"/><path d="M66 60 l4 -8 4 8z M62 62 l8 -11 8 11z" fill="#FF6FAE"/><circle cx="30" cy="57" r="2" fill="#FFC93C"/><circle cx="70" cy="59" r="2" fill="#FFC93C"/>
    <rect x="34" y="34" width="4" height="26" fill="#8B4A1E"/><rect x="58" y="34" width="4" height="26" fill="#8B4A1E"/><rect x="32" y="56" width="32" height="5" rx="2" fill="#C98B5A"/>
    <path d="M22 38 L48 20 L74 38z" fill="#C43B38"/><path d="M22 38 L48 20 L48 38z" fill="rgba(255,255,255,0.12)"/><path d="M32 26 L48 12 L64 26z" fill="#C43B38"/><path d="M48 12 v-8 M22 38 q-3 -4 -4 -9 M74 38 q3 -4 4 -9 M32 26 q-2 -4 -1 -8 M64 26 q2 -4 1 -8" stroke="#FFC93C" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  </symbol>
  <!-- bananenplant 72x64 -->
  <symbol id="banaan" viewBox="0 0 72 64"><path d="M36 62 q-30 -8 -34 -40 q22 6 34 40z" fill="#2E7D1E"/><path d="M36 62 q30 -8 34 -40 q-22 6 -34 40z" fill="#39D353"/><path d="M36 62 q-4 -36 6 -58 q8 24 -6 58z" fill="#5FB05A"/><path d="M36 62 q-18 -14 -20 -34" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="3"/></symbol>
  <!-- edelstenen (facetten) -->
  <symbol id="gem" viewBox="0 0 48 48"><path d="M24 4 L42 20 L24 44 L6 20z" fill="currentColor"/><path d="M24 4 L42 20 L24 20z" fill="rgba(255,255,255,0.55)"/><path d="M6 20 L24 20 L24 44z" fill="rgba(255,255,255,0.18)"/><path d="M24 4 L24 20 L6 20z" fill="rgba(255,255,255,0.3)"/><path d="M42 20 L24 44 L24 20z" fill="rgba(0,0,0,0.22)"/></symbol>
</defs>
</svg>'''
DEFS=DEFS1+EXTRA
KLEUR={'groen':'#39D353','geel':'#FFC93C','blauw':'#5BC0EB'}
GEMK={'blauw':'#5BC0EB','groen':'#39D353','geel':'#FFC93C'}
def use(id,x,y,w,h,color=None,extra=''):
    c=f' color="{color}"' if color else ''
    return f'<use href="#{id}" x="{x:.1f}" y="{y:.1f}" width="{w}" height="{h}"{c}{extra}/>'
def hex_gras(cx,cy,s=56): return use('hx-gras',cx-s/2,cy-s*58/112-4,s,s*66/56)
def hex_tegel(cx,cy,kleur,motief,s=56):
    h=s*66/56; x=cx-s/2; y=cy-s*58/112-4
    out=use('hx-tegel',x,y,s,h,KLEUR[kleur])
    k=s/56
    if motief=='vlinder':
        m=15*k
        for (mx,my) in [(28,13),(16,33),(40,33)]:
            out+=use('m-vlinder',x+mx*k-m/2,y+my*k-m/2+4*k,m,m)
    elif motief=='boom':
        m=30*k; out+=use('m-boom',cx-m/2,y+14*k,m,m)
    else:
        m=30*k; out+=use('m-vogel',cx-m/2,y+14*k,m,m)
    return out
def hex_doel(cx,cy,s=56): return use('hx-doel',cx-s/2,cy-s*58/112-4,s,s*66/56)
def gem(cx,cy,kleur,s=28): return use('gem',cx-s/2,cy-s/2,s,s,GEMK[kleur])
