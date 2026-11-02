# Gedeelde sprite-definities (poppenhuisstijl, driekwartaanzicht, vlak met één schaduwtint)
DEFS = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
  <!-- BED 64x84 in twee lagen: onder (frame, matras, kussen) en deken (currentColor) — het kind wordt ertussen getekend -->
  <symbol id="bed-onder" viewBox="0 0 64 84">
    <ellipse cx="32" cy="80" rx="28" ry="4" fill="rgba(30,58,76,0.18)"/>
    <rect x="6" y="2" width="52" height="22" rx="5" fill="#C98B5A"/><rect x="6" y="2" width="52" height="22" rx="5" fill="rgba(0,0,0,0.12)"/><rect x="9" y="4" width="46" height="16" rx="4" fill="#D98E55"/>
    <rect x="4" y="22" width="56" height="48" rx="3" fill="#FFFFFF"/>
    <rect x="4" y="70" width="56" height="8" rx="2" fill="#E6EFF5"/><rect x="4" y="70" width="56" height="8" rx="2" fill="rgba(30,58,76,0.08)"/>
    <rect x="10" y="24" width="44" height="16" rx="7" fill="#F3F8FB"/><path d="M13 30 q19 -3 38 0" fill="none" stroke="#DDE7EE" stroke-width="2"/>
    <rect x="6" y="76" width="6" height="6" fill="#8B4A1E"/><rect x="52" y="76" width="6" height="6" fill="#8B4A1E"/>
  </symbol>
  <symbol id="bed-deken" viewBox="0 0 64 84">
    <path d="M4 46 q28 -8 56 0 v24 h-56z" fill="currentColor"/>
    <path d="M4 46 q28 -8 56 0 v5 q-28 -8 -56 0z" fill="rgba(255,255,255,0.4)"/>
    <rect x="4" y="64" width="56" height="12" rx="3" fill="currentColor"/><rect x="4" y="64" width="56" height="12" rx="3" fill="rgba(0,0,0,0.18)"/>
  </symbol>
  <!-- dekenmotieven, wit, 16x16 -->
  <symbol id="m-vlinder" viewBox="0 0 16 16"><ellipse cx="5" cy="7" rx="3.2" ry="2.6" fill="#FFFFFF"/><ellipse cx="11" cy="7" rx="3.2" ry="2.6" fill="#FFFFFF"/><ellipse cx="5.6" cy="11" rx="2.4" ry="1.8" fill="#FFFFFF"/><ellipse cx="10.4" cy="11" rx="2.4" ry="1.8" fill="#FFFFFF"/><rect x="7.4" y="4.5" width="1.2" height="8" rx="0.6" fill="rgba(30,58,76,0.5)"/></symbol>
  <symbol id="m-boom" viewBox="0 0 16 16"><circle cx="8" cy="5.5" r="4" fill="#FFFFFF"/><circle cx="4.5" cy="8" r="3" fill="#FFFFFF"/><circle cx="11.5" cy="8" r="3" fill="#FFFFFF"/><circle cx="8" cy="9" r="3" fill="#FFFFFF"/><rect x="7.2" y="10.5" width="1.6" height="4.5" rx="0.6" fill="#FFFFFF"/></symbol>
  <symbol id="m-vogel" viewBox="0 0 16 16"><ellipse cx="7" cy="9" rx="4.5" ry="2.2" fill="#FFFFFF"/><circle cx="11.5" cy="7.6" r="1.8" fill="#FFFFFF"/><path d="M13 7.6 l2 0.5 -2 0.6z" fill="#FFFFFF"/><path d="M6 7.4 q1.6 -6 7 -5.6 q-3.8 2.6 -3.4 5.6z" fill="#FFFFFF"/><path d="M2.6 9 l-2.4 -1.6 0.6 3.2z" fill="#FFFFFF"/></symbol>
  <!-- KIND in bed: hoofd op kussen, 3 gezichten; huid en haar via losse symbolen met currentColor -->
  <symbol id="k-hoofd" viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="currentColor"/><circle cx="16" cy="16" r="11" fill="rgba(255,255,255,0.12)"/><path d="M5 16 a11 11 0 0 0 11 11 v-2 a9 9 0 0 1 -9 -9z" fill="rgba(0,0,0,0.08)"/></symbol>
  <symbol id="h-bob" viewBox="0 0 32 32"><path d="M5 15 a11 11 0 0 1 22 0 q-11 -4 -22 0z" fill="currentColor"/><path d="M5 15 v7 q2 -2 2.5 -7z M27 15 v7 q-2 -2 -2.5 -7z" fill="currentColor"/></symbol>
  <symbol id="h-krul" viewBox="0 0 32 32"><path d="M5 15 a11 11 0 0 1 22 0 q-11 -4 -22 0z" fill="currentColor"/><circle cx="7" cy="10" r="3.2" fill="currentColor"/><circle cx="12" cy="6.5" r="3.2" fill="currentColor"/><circle cx="17" cy="5.5" r="3.2" fill="currentColor"/><circle cx="22" cy="6.8" r="3.2" fill="currentColor"/><circle cx="26" cy="10.5" r="3.2" fill="currentColor"/><circle cx="5" cy="16" r="2.8" fill="currentColor"/><circle cx="27" cy="16" r="2.8" fill="currentColor"/></symbol>
  <symbol id="h-staart" viewBox="0 0 32 32"><path d="M5 15 a11 11 0 0 1 22 0 q-11 -3 -22 0z" fill="currentColor"/><circle cx="4" cy="17" r="3.6" fill="currentColor"/><circle cx="28" cy="17" r="3.6" fill="currentColor"/><path d="M14 5 q2 4 4 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="h-stekel" viewBox="0 0 32 32"><path d="M5 15 l2 -8 3 5 3 -8 3 6 3 -8 3 6 3 -5 2 12 q-11 -4 -22 0z" fill="currentColor"/></symbol>
  <symbol id="g-slaap" viewBox="0 0 32 32"><path d="M10 19 q2 2 4 0 M18 19 q2 2 4 0" fill="none" stroke="#1E3A4C" stroke-width="1.6" stroke-linecap="round"/><path d="M13 24 q3 2 6 0" fill="none" stroke="#1E3A4C" stroke-width="1.4" stroke-linecap="round"/><circle cx="8.5" cy="22" r="1.8" fill="#FF9BC8" opacity="0.6"/><circle cx="23.5" cy="22" r="1.8" fill="#FF9BC8" opacity="0.6"/></symbol>
  <symbol id="g-gaap" viewBox="0 0 32 32"><path d="M9 18 l5 2 M23 18 l-5 2" fill="none" stroke="#1E3A4C" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="16" cy="24.5" rx="3.4" ry="4" fill="#B23A6A"/><ellipse cx="16" cy="26.5" rx="1.8" ry="1.4" fill="#FF6FAE"/><circle cx="8.5" cy="22.5" r="1.8" fill="#FF9BC8" opacity="0.6"/><circle cx="23.5" cy="22.5" r="1.8" fill="#FF9BC8" opacity="0.6"/></symbol>
  <symbol id="g-verrast" viewBox="0 0 32 32"><circle cx="12" cy="18.5" r="2.4" fill="#1E3A4C"/><circle cx="20" cy="18.5" r="2.4" fill="#1E3A4C"/><circle cx="11.2" cy="17.7" r="0.8" fill="#FFFFFF"/><circle cx="19.2" cy="17.7" r="0.8" fill="#FFFFFF"/><circle cx="16" cy="24.5" r="2.8" fill="#B23A6A"/><circle cx="8.5" cy="22.5" r="1.8" fill="#FF9BC8" opacity="0.7"/><circle cx="23.5" cy="22.5" r="1.8" fill="#FF9BC8" opacity="0.7"/></symbol>
  <!-- deken-rand over de schouders (currentColor = dekenkleur) -->
  <symbol id="k-schouders" viewBox="0 0 40 16"><path d="M0 16 q20 -14 40 0z" fill="currentColor"/><path d="M0 16 q20 -14 40 0z" fill="rgba(255,255,255,0.25)"/></symbol>
  <!-- PINO 48x72, 3 poses -->
  <symbol id="p-basis" viewBox="0 0 48 72">
    <ellipse cx="24" cy="68" rx="14" ry="4" fill="rgba(30,58,76,0.2)"/>
    <path d="M12 64 L17 36 h14 l5 28z" fill="#FF6FAE"/><path d="M12 64 L17 36 h4 l-2 28z" fill="rgba(255,255,255,0.22)"/><path d="M31 36 h-4 l2 28 h7z" fill="rgba(0,0,0,0.14)"/><path d="M12 64 h24" stroke="#B23A6A" stroke-width="3" stroke-linecap="round"/>
    <rect x="17" y="29" width="14" height="10" rx="4" fill="#FFD6E6"/>
    <circle cx="24" cy="18" r="12" fill="#F6C9A8"/><path d="M12 18 a12 12 0 0 0 12 12 v-2 a10 10 0 0 1 -10 -10z" fill="rgba(0,0,0,0.07)"/>
    <path d="M12 17 a12 12 0 0 1 24 0 q-6 -3 -12 -1 q-6 -2 -12 1z" fill="#4A3426"/><path d="M12 17 v9 q2.5 -3 3 -9z M36 17 v9 q-2.5 -3 -3 -9z" fill="#4A3426"/><path d="M13 15 q4 -7 9 -8 q-3 3 -5 9z" fill="rgba(255,255,255,0.15)"/>
    <circle cx="20" cy="20.5" r="1.7" fill="#1E3A4C"/><circle cx="28" cy="20.5" r="1.7" fill="#1E3A4C"/><circle cx="19.4" cy="19.9" r="0.6" fill="#FFFFFF"/><circle cx="27.4" cy="19.9" r="0.6" fill="#FFFFFF"/><path d="M20.5 24.5 q3.5 3 7 0" fill="none" stroke="#1E3A4C" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="16" cy="23.5" r="2" fill="#FF9BC8" opacity="0.7"/><circle cx="32" cy="23.5" r="2" fill="#FF9BC8" opacity="0.7"/>
    <path d="M15 7 L14 0 L19 4 L24 -2 L29 4 L34 0 L33 7z" fill="#FFC93C"/><path d="M15 7 h18 v3 h-18z" fill="#D97A00"/><circle cx="24" cy="2.5" r="1.8" fill="#FF6FAE"/>
  </symbol>
  <symbol id="pino-staan" viewBox="0 0 48 72"><use href="#p-basis"/><path d="M17 38 q-5 8 -2 16" fill="none" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><path d="M31 38 q5 8 2 16" fill="none" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><rect x="18" y="62" width="5" height="6" rx="2" fill="#B23A6A"/><rect x="25" y="62" width="5" height="6" rx="2" fill="#B23A6A"/></symbol>
  <symbol id="pino-loop" viewBox="0 0 48 72"><use href="#p-basis"/><path d="M17 38 q-8 4 -6 14" fill="none" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><path d="M31 38 q8 2 6 12" fill="none" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><rect x="14" y="61" width="6" height="7" rx="2" fill="#B23A6A" transform="rotate(-18 17 64)"/><rect x="28" y="61" width="6" height="7" rx="2" fill="#B23A6A" transform="rotate(14 31 64)"/></symbol>
  <symbol id="pino-vinger" viewBox="0 0 48 72"><use href="#p-basis"/><path d="M17 38 q-5 8 -2 16" fill="none" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><path d="M31 36 L52 30" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><path d="M50 30 L60 28" stroke="#F6C9A8" stroke-width="3" stroke-linecap="round"/><rect x="18" y="62" width="5" height="6" rx="2" fill="#B23A6A"/><rect x="25" y="62" width="5" height="6" rx="2" fill="#B23A6A"/></symbol>
  <!-- REKWISIETEN -->
  <symbol id="raam" viewBox="0 0 64 52"><rect x="0" y="0" width="64" height="52" rx="6" fill="#FFFFFF"/><rect x="5" y="5" width="54" height="42" rx="4" fill="#1E3A4C"/><circle cx="42" cy="18" r="9" fill="#FFF1A8"/><circle cx="38" cy="15" r="8" fill="#1E3A4C"/><circle cx="16" cy="14" r="1.5" fill="#FFFFFF"/><circle cx="24" cy="32" r="1.5" fill="#FFFFFF"/><circle cx="50" cy="38" r="1.2" fill="#FFFFFF"/><rect x="31" y="5" width="2" height="42" fill="#FFFFFF"/><rect x="5" y="25" width="54" height="2" fill="#FFFFFF"/></symbol>
  <symbol id="nachtlamp" viewBox="0 0 32 44"><ellipse cx="16" cy="42" rx="10" ry="2.5" fill="rgba(30,58,76,0.18)"/><rect x="6" y="22" width="20" height="18" rx="3" fill="#C98B5A"/><rect x="6" y="22" width="20" height="18" rx="3" fill="rgba(0,0,0,0.1)"/><rect x="8" y="24" width="16" height="7" rx="2" fill="#D98E55"/><rect x="14" y="14" width="4" height="8" fill="#8AA0AF"/><path d="M6 14 L12 2 h8 l6 12z" fill="#FFE08A"/><path d="M6 14 L12 2 h3 l-4 12z" fill="rgba(255,255,255,0.4)"/></symbol>
  <symbol id="kleedje" viewBox="0 0 96 48"><ellipse cx="48" cy="24" rx="46" ry="22" fill="#FFD6E6"/><ellipse cx="48" cy="24" rx="34" ry="15" fill="#FF9BC8" opacity="0.5"/><ellipse cx="48" cy="24" rx="20" ry="8" fill="#FFD6E6"/></symbol>
</defs>
</svg>'''

KLEUR={'groen':'#39D353','geel':'#FFC93C','blauw':'#5BC0EB'}
HUID=['#F6C9A8','#E8B48A','#C98B5A']
HAAR=[('h-bob','#4A3426'),('h-krul','#2B1A0E'),('h-staart','#FFC93C'),('h-stekel','#8B4A1E'),('h-bob','#1E3A4C'),('h-krul','#C2743C')]

def bed(x,y,kleur,motief,gezicht,huid,haar,haarkleur,scale=1.0):
    k=KLEUR[kleur]
    def u(id,ux,uy,uw,uh,color=None):
        c=f' color="{color}"' if color else ''
        return f'<use href="#{id}" x="{ux}" y="{uy}" width="{uw}" height="{uh}"{c}/>'
    out=f'<g transform="translate({x} {y}) scale({scale})">'
    out+=u('bed-onder',0,0,64,84)
    # kind: hoofd op het kussen, kin verdwijnt straks onder de deken
    out+=u('k-hoofd',16,14,32,32,huid)+u(haar,16,14,32,32,haarkleur)+u(f'g-{gezicht}',16,14,32,32)
    # deken over lichaam en kin heen
    out+=u('bed-deken',0,0,64,84,k)
    out+=u(f'm-{motief}',10,50,14,14)+u(f'm-{motief}',40,54,14,14)+u(f'm-{motief}',25,60,12,12)
    out+='</g>'
    return out

def pino(x,y,pose,scale=1.0,flip=False):
    f=f' scale(-1 1) translate(-48 0)' if flip else ''
    return f'<g transform="translate({x} {y}) scale({scale}){f}"><use href="#pino-{pose}" x="0" y="0" width="48" height="72"/></g>'
