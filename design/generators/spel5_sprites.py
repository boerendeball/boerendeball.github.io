# Sprite-set spel 5 – Negotiate trade deal (nachtmarkt, poppenhuisstijl)
from spel4_sprites import DEFS as DEFS4, use, persoon
from spel1_sprites import pino
EXTRA5='''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
  <!-- LAMPION 24x34 (currentColor) met platte gloed -->
  <symbol id="s5-lampion" viewBox="0 0 24 34"><rect x="9" y="0" width="6" height="4" fill="#FFC93C"/><ellipse cx="12" cy="16" rx="11" ry="12" fill="currentColor"/><ellipse cx="12" cy="16" rx="11" ry="12" fill="rgba(0,0,0,0.0)"/><path d="M6 8 v16 M12 4 v24 M18 8 v16" stroke="rgba(0,0,0,0.18)" stroke-width="1.5"/><ellipse cx="8" cy="12" rx="2.5" ry="4" fill="rgba(255,255,255,0.35)"/><rect x="9" y="27" width="6" height="3" fill="#FFC93C"/><path d="M12 30 v4" stroke="#FFC93C" stroke-width="2"/></symbol>
  <symbol id="s5-gloed" viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="rgba(255,201,60,0.12)"/><circle cx="40" cy="40" r="18" fill="rgba(255,201,60,0.12)"/></symbol>
  <!-- KRAAM 130x120 in twee lagen: achter (palen + luifel, luifel = currentColor) en voor (toonbank) -->
  <symbol id="s5-kraam-achter" viewBox="0 0 130 120"><ellipse cx="65" cy="116" rx="60" ry="5" fill="rgba(0,0,0,0.18)"/><rect x="16" y="30" width="5" height="70" fill="#8B4A1E"/><rect x="109" y="30" width="5" height="70" fill="#8B4A1E"/><rect x="22" y="34" width="86" height="40" fill="rgba(0,0,0,0.12)"/><path d="M4 30 L24 6 h86 l20 24z" fill="currentColor"/><path d="M4 30 L24 6 h86 l20 24z" fill="rgba(0,0,0,0.18)"/><path d="M24 6 h86 l-14 14 h-58z" fill="currentColor"/><path d="M4 30 h126 v4 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0 q-7 8 -14 0z" fill="currentColor"/><path d="M30 10 h8 l1 20 h-10z M60 10 h8 l1 20 h-10z M90 10 h8 l1 20 h-10z" fill="rgba(255,255,255,0.75)"/></symbol>
  <symbol id="s5-kraam-voor" viewBox="0 0 130 120"><path d="M110 70 l12 6 v30 h-12z" fill="#A85F2A"/><rect x="12" y="70" width="98" height="36" rx="2" fill="#C2743C"/><rect x="12" y="70" width="98" height="7" fill="#D98E55"/><path d="M12 88 h98 M12 98 h98" stroke="#A85F2A" stroke-width="2"/><rect x="16" y="106" width="6" height="10" fill="#8B4A1E"/><rect x="102" y="106" width="6" height="10" fill="#8B4A1E"/></symbol>
  <!-- WAREN op de toonbank, 100x30 -->
  <symbol id="s5-waar-sieraden" viewBox="0 0 100 30"><rect x="6" y="14" width="40" height="14" rx="3" fill="#B23A6A"/><path d="M12 16 q7 10 14 0 M30 16 q7 10 14 0" fill="none" stroke="#FFC93C" stroke-width="2"/><circle cx="19" cy="23" r="2.5" fill="#FF6FAE"/><circle cx="37" cy="23" r="2.5" fill="#5BC0EB"/><rect x="54" y="4" width="4" height="24" fill="#8B4A1E"/><path d="M48 6 q8 -6 16 0" fill="none" stroke="#F2B63C" stroke-width="2.5"/><path d="M50 10 q6 12 12 0" fill="none" stroke="#F2B63C" stroke-width="2"/><path d="M56 16 l4 4 -4 6 -4 -6z" fill="#FF6FAE"/><rect x="70" y="12" width="24" height="16" rx="3" fill="#FFF1D6"/><circle cx="76" cy="20" r="3" fill="#39D353"/><circle cx="84" cy="20" r="3" fill="#FFC93C"/><circle cx="90" cy="20" r="3" fill="#5BC0EB"/></symbol>
  <symbol id="s5-waar-fruit" viewBox="0 0 100 30"><rect x="4" y="12" width="30" height="16" rx="3" fill="#D9B27C"/><circle cx="11" cy="14" r="5" fill="#FF8A3D"/><circle cx="20" cy="12" r="5" fill="#FF8A3D"/><circle cx="29" cy="14" r="5" fill="#FF8A3D"/><rect x="38" y="12" width="28" height="16" rx="3" fill="#D9B27C"/><path d="M44 14 l5 -9 5 9z M54 14 l5 -9 5 9z" fill="#FFC93C"/><circle cx="49" cy="13" r="3" fill="#39D353"/><rect x="70" y="12" width="26" height="16" rx="3" fill="#D9B27C"/><circle cx="77" cy="12" r="5" fill="#8B4A1E"/><circle cx="86" cy="11" r="5" fill="#8B4A1E"/><circle cx="82" cy="17" r="4" fill="#A85F2A"/></symbol>
  <symbol id="s5-waar-stof" viewBox="0 0 100 30"><rect x="6" y="8" width="26" height="20" rx="3" fill="#39D353"/><rect x="6" y="8" width="26" height="6" fill="#1FA34A"/><rect x="36" y="4" width="26" height="24" rx="3" fill="#FF6FAE"/><rect x="36" y="4" width="26" height="6" fill="#B23A6A"/><rect x="66" y="10" width="28" height="18" rx="3" fill="#5BC0EB"/><rect x="66" y="10" width="28" height="6" fill="#0E7FB5"/><path d="M10 20 h18 M40 18 h18 M70 22 h20" stroke="rgba(255,255,255,0.5)" stroke-width="2"/></symbol>
  <symbol id="s5-waar-lampion" viewBox="0 0 100 30"><use href="#s5-lampion" x="8" y="-2" width="18" height="26" color="#FF5E5B"/><use href="#s5-lampion" x="30" y="2" width="16" height="24" color="#FFC93C"/><use href="#s5-lampion" x="50" y="-2" width="18" height="26" color="#FF8A3D"/><rect x="72" y="8" width="22" height="20" rx="3" fill="#C43B38"/><circle cx="83" cy="18" r="5" fill="#FFC93C"/></symbol>
  <!-- WATERPUT 72x84 in driekwart -->
  <symbol id="s5-put" viewBox="0 0 72 84"><ellipse cx="36" cy="80" rx="30" ry="5" fill="rgba(0,0,0,0.2)"/><rect x="12" y="24" width="5" height="40" fill="#8B4A1E"/><rect x="55" y="24" width="5" height="40" fill="#8B4A1E"/><rect x="26" y="20" width="20" height="4" fill="#8B4A1E"/><rect x="34" y="20" width="3" height="22" fill="#8B4A1E"/><rect x="29" y="40" width="14" height="10" rx="2" fill="#C2743C"/><rect x="29" y="40" width="14" height="3" fill="#D98E55"/><path d="M6 26 L36 6 L66 26z" fill="#C43B38"/><path d="M36 6 L66 26 L58 26 L36 11z" fill="#A82F2C"/><path d="M36 6 v-5 M6 26 q-3 -4 0 -8 M66 26 q3 -4 0 -8" stroke="#FFC93C" stroke-width="2.5" stroke-linecap="round" fill="none"/><path d="M8 60 a28 11 0 0 0 56 0 v12 a28 11 0 0 1 -56 0z" fill="#7D8A96"/><ellipse cx="36" cy="60" rx="28" ry="11" fill="#A7B2BC"/><ellipse cx="36" cy="60" rx="20" ry="7" fill="#5BC0EB"/><ellipse cx="32" cy="58" rx="8" ry="3" fill="#8ED8F8" opacity="0.7"/><path d="M12 66 h8 M26 70 h10 M44 70 h10 M54 66 h8" stroke="#5F6E7B" stroke-width="2.5" stroke-linecap="round"/></symbol>
  <!-- MAT met mandjes 96x40, krukje 24x28 -->
  <symbol id="s5-mat" viewBox="0 0 96 40"><path d="M10 6 h78 l6 30 h-90z" fill="#D9B27C"/><path d="M10 6 h78 l1 5 h-80z" fill="#C9A77A"/><path d="M8 20 h80 M6 30 h84" stroke="#C9A77A" stroke-width="2"/><ellipse cx="30" cy="22" rx="12" ry="7" fill="#A85F2A"/><ellipse cx="30" cy="19" rx="12" ry="6" fill="#C2743C"/><circle cx="26" cy="17" r="3" fill="#39D353"/><circle cx="34" cy="17" r="3" fill="#FF5E5B"/><ellipse cx="66" cy="24" rx="12" ry="7" fill="#A85F2A"/><ellipse cx="66" cy="21" rx="12" ry="6" fill="#C2743C"/><circle cx="62" cy="19" r="3" fill="#FFC93C"/><circle cx="70" cy="19" r="3" fill="#FF8A3D"/></symbol>
  <symbol id="s5-kruk" viewBox="0 0 24 28"><ellipse cx="12" cy="26" rx="10" ry="2.5" fill="rgba(0,0,0,0.18)"/><rect x="4" y="14" width="3" height="12" fill="#8B4A1E"/><rect x="17" y="14" width="3" height="12" fill="#8B4A1E"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="#C2743C"/><ellipse cx="12" cy="10" rx="10" ry="4" fill="#D98E55"/></symbol>
  <!-- KETTING (doelvoorwerp) 48x48 en STEMMINGEN 48x48 -->
  <symbol id="s5-ketting" viewBox="0 0 48 48"><path d="M8 10 q16 28 32 0" fill="none" stroke="#F2B63C" stroke-width="3.5" stroke-linecap="round"/><circle cx="12" cy="15" r="2" fill="#F2B63C"/><circle cx="36" cy="15" r="2" fill="#F2B63C"/><path d="M24 24 L31 31 L24 42 L17 31z" fill="#FF6FAE"/><path d="M24 24 L31 31 L24 31z" fill="#FFB8D4"/><path d="M17 31 L24 31 L24 42z" fill="#FFB8D4" opacity="0.5"/></symbol>
  <symbol id="s5-stemming-twijfel" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#FFC93C"/><circle cx="24" cy="26" r="22" fill="#D97A00"/><circle cx="24" cy="23" r="21" fill="#FFC93C"/><circle cx="16" cy="19" r="3" fill="#6B4A10"/><circle cx="32" cy="19" r="3" fill="#6B4A10"/><path d="M14 32 h20" stroke="#6B4A10" stroke-width="4" stroke-linecap="round"/></symbol>
  <symbol id="s5-stemming-blij" viewBox="0 0 48 48"><circle cx="24" cy="26" r="22" fill="#1FA34A"/><circle cx="24" cy="23" r="21" fill="#39D353"/><circle cx="16" cy="19" r="3" fill="#0E3D1C"/><circle cx="32" cy="19" r="3" fill="#0E3D1C"/><path d="M14 29 q10 10 20 0" fill="none" stroke="#0E3D1C" stroke-width="4" stroke-linecap="round"/></symbol>
  <symbol id="s5-stemming-boos" viewBox="0 0 48 48"><circle cx="24" cy="26" r="22" fill="#C43B38"/><circle cx="24" cy="23" r="21" fill="#FF5E5B"/><circle cx="16" cy="20" r="3" fill="#5A1210"/><circle cx="32" cy="20" r="3" fill="#5A1210"/><path d="M11 13 l8 4 M37 13 l-8 4" stroke="#5A1210" stroke-width="3.5" stroke-linecap="round"/><path d="M14 34 q10 -8 20 0" fill="none" stroke="#5A1210" stroke-width="4" stroke-linecap="round"/></symbol>
  <!-- PRAAT-ICOON en WEGLOOP-ICOON 48x48 -->
  <symbol id="s5-praat" viewBox="0 0 48 48"><path d="M8 10 h32 a4 4 0 0 1 4 4 v16 a4 4 0 0 1 -4 4 h-16 l-9 8 v-8 h-7 a4 4 0 0 1 -4 -4 v-16 a4 4 0 0 1 4 -4z" fill="currentColor"/></symbol>
  <symbol id="s5-wegloop" viewBox="0 0 48 48"><rect x="26" y="6" width="14" height="36" rx="2" fill="none" stroke="currentColor" stroke-width="4"/><path d="M6 24 h22 M20 16 l8 8 -8 8" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></symbol>
</defs>
</svg>'''
DEFS=DEFS4+EXTRA5

# Handelaars (persoon-symbolen uit spel 3)
HANDELAARS={
  'Mai':  dict(kleding='#9B6BFF',huid='#E8B48A',haar='bh-lang',haarkleur='#1E3A4C',jurk=True,acc=('acc-nonla',)),
  'Arun': dict(kleding='#FF8A3D',huid='#E8B48A',haar='bh-kort',haarkleur='#4A3426'),
  'Siti': dict(kleding='#39D353',huid='#F6C9A8',haar='bh-knot',haarkleur='#2B1A0E'),
  'Minh': dict(kleding='#5BC0EB',huid='#E8B48A',haar='bh-stekel',haarkleur='#2B1A0E',acc=('acc-nonla',)),
}
LUIFEL={'Mai':'#FF6FAE','Arun':'#1FA3DC','Siti':'#39D353','Minh':'#FFC93C'}
WAAR={'Mai':'sieraden','Arun':'sieraden','Siti':'stof','Minh':'lampion'}
def handelaar(naam,x,y,s=1.0): return persoon(x,y,s=s,**HANDELAARS[naam])
def kraam(naam,x,y):
    out=f'<g transform="translate({x} {y})">'
    out+=use('s5-kraam-achter',0,0,130,120,LUIFEL[naam])
    out+=handelaar(naam,41,28)
    out+=use('s5-kraam-voor',0,0,130,120)
    out+=use('s5-waar-'+WAAR[naam],14,58,100,30)
    return out+'</g>'
def lampion(x,y,kleur,s=1.0):
    return f'<g transform="translate({x} {y}) scale({s})">'+use('s5-gloed',-28,-22,80,80)+use('s5-lampion',0,0,24,34,kleur)+'</g>'
