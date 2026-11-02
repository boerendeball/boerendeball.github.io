# Sprite-set spel 9 – Vang de baby (Nederlands dorp, ooievaar, kraamkliniek) – poppenhuisstijl
from spel8_sprites import DEFS as DEFS8, use, pino
from spel3_sprites import persoon
EXTRA9='''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
<defs>
  <!-- OOIEVAAR 120x70 (vliegend, met bundeltje in de snavel) -->
  <symbol id="s9-ooievaar" viewBox="0 0 120 70"><path d="M14 30 L48 26 L70 40 L50 44z" fill="#1E3A4C"/><path d="M26 28 L62 20 L74 40 L50 44z" fill="#FFFFFF"/><path d="M26 28 L62 20 L58 30 L40 36z" fill="#E6EFF5"/><ellipse cx="62" cy="42" rx="26" ry="12" fill="#FFFFFF"/><ellipse cx="62" cy="48" rx="20" ry="6" fill="#E6EFF5"/><path d="M36 42 q-14 2 -24 12 q16 -2 28 -4z" fill="#1E3A4C"/><path d="M64 34 q-4 -22 10 -30" fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/><circle cx="76" cy="6" r="7" fill="#FFFFFF"/><path d="M82 5 l24 3 -24 3z" fill="#FF8A3D"/><path d="M82 8 l24 0 -24 3z" fill="#D97A00"/><circle cx="78" cy="4" r="1.6" fill="#1E3A4C"/><path d="M100 9 q4 10 -2 18" fill="none" stroke="#FFFFFF" stroke-width="2.5"/><path d="M88 30 q10 -8 20 0 q-10 9 -20 0z" fill="#FFD6E6"/><circle cx="98" cy="29" r="3" fill="#F6C9A8"/><path d="M66 52 l-4 14 M72 52 l-2 14" stroke="#FF8A3D" stroke-width="3" stroke-linecap="round"/></symbol>
  <!-- BUNDELTJE 48x48 (doek = currentColor), VALSTREPEN, SCHADUW -->
  <symbol id="s9-bundel" viewBox="0 0 48 48"><path d="M8 30 q16 -26 32 0 q-16 14 -32 0z" fill="currentColor"/><path d="M8 30 q16 -26 32 0 q-16 2 -32 0z" fill="rgba(0,0,0,0.08)"/><path d="M24 10 l-6 8 M24 10 l6 8" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="24" cy="26" r="8" fill="#F6C9A8"/><path d="M16 26 a8 8 0 0 0 8 8 v-2 a6 6 0 0 1 -6 -6z" fill="rgba(0,0,0,0.08)"/><circle cx="21" cy="25" r="1.1" fill="#1E3A4C"/><circle cx="27" cy="25" r="1.1" fill="#1E3A4C"/><path d="M22 29 q2 2 4 0" fill="none" stroke="#1E3A4C" stroke-width="1.2" stroke-linecap="round"/><path d="M22 16 q2 -4 4 0" fill="none" stroke="#4A3426" stroke-width="2" stroke-linecap="round"/></symbol>
  <symbol id="s9-val" viewBox="0 0 20 40"><path d="M4 4 v12 M10 0 v20 M16 6 v10" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="0.8"/></symbol>
  <symbol id="s9-schaduw" viewBox="0 0 60 20"><ellipse cx="30" cy="10" rx="28" ry="8" fill="rgba(30,58,76,0.3)"/></symbol>
  <!-- LAKEN 72x26 (gespannen tussen twee handen) -->
  <symbol id="s9-laken" viewBox="0 0 72 26"><path d="M4 8 q32 -12 64 0 q-32 14 -64 0z" fill="#FFFFFF"/><path d="M4 8 q32 10 64 0 q-32 14 -64 0z" fill="#E6EFF5"/><circle cx="4" cy="8" r="4" fill="#F6C9A8"/><circle cx="68" cy="8" r="4" fill="#F6C9A8"/></symbol>
  <symbol id="s9-ring" viewBox="0 0 80 24"><ellipse cx="40" cy="12" rx="36" ry="9" fill="none" stroke="#1FA3DC" stroke-width="4" stroke-dasharray="8 6"/></symbol>
  <!-- PINO DUWT (handen vooruit), STETHOSCOOP -->
  <symbol id="pino-duw" viewBox="0 0 48 72" overflow="visible"><use href="#p-basis"/><path d="M19 36 L54 31" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><path d="M29 40 L54 40" stroke="#F6C9A8" stroke-width="5" stroke-linecap="round"/><circle cx="55" cy="31" r="3.4" fill="#F6C9A8"/><circle cx="55" cy="40" r="3.4" fill="#F6C9A8"/><rect x="18" y="62" width="5" height="6" rx="2" fill="#B23A6A"/><rect x="25" y="62" width="5" height="6" rx="2" fill="#B23A6A"/></symbol>
  <symbol id="s9-stetho" viewBox="0 0 48 72"><path d="M19 30 v8 a5 5 0 0 0 10 0 v-8" fill="none" stroke="#2F3A4A" stroke-width="2"/><circle cx="24" cy="45" r="3" fill="#B8C4D0" stroke="#2F3A4A" stroke-width="1.2"/></symbol>
  <!-- BABY OP DE ARM (bij lopende man) -->
  <symbol id="b-lijf-los" viewBox="0 0 48 72"><ellipse cx="24" cy="68" rx="14" ry="4" fill="rgba(30,58,76,0.2)"/><rect x="14" y="30" width="20" height="30" rx="8" fill="currentColor"/><rect x="14" y="30" width="6" height="30" rx="6" fill="rgba(255,255,255,0.2)"/><rect x="28" y="30" width="6" height="30" rx="6" fill="rgba(0,0,0,0.12)"/><rect x="16" y="56" width="7" height="12" rx="3" fill="#1E3A4C"/><rect x="25" y="56" width="7" height="12" rx="3" fill="#1E3A4C"/></symbol>
  <!-- armen om de baby heen (kleding = currentColor), getekend ná de bundel -->
  <symbol id="s9-armen-om" viewBox="0 0 48 72" overflow="visible"><path d="M15 34 q-8 10 -1 20" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><path d="M33 34 q8 10 1 20" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/><circle cx="14.5" cy="55" r="3.4" fill="#F6C9A8"/><circle cx="33.5" cy="55" r="3.4" fill="#F6C9A8"/></symbol>
  <!-- HEG 358x30 (driekwart), KLINKERPAD-TEGEL 32x32, TULP, LANTAARN, MOLEN, HUISJES, KLINIEK -->
  <symbol id="s9-heg" viewBox="0 0 358 30"><rect x="0" y="18" width="358" height="12" fill="#1F7A3A"/><rect x="0" y="4" width="358" height="16" rx="8" fill="#2E7D1E"/><g fill="#39D353"><circle cx="20" cy="10" r="7"/><circle cx="60" cy="8" r="8"/><circle cx="100" cy="11" r="7"/><circle cx="140" cy="8" r="8"/><circle cx="180" cy="10" r="7"/><circle cx="220" cy="8" r="8"/><circle cx="260" cy="11" r="7"/><circle cx="300" cy="8" r="8"/><circle cx="340" cy="10" r="7"/></g></symbol>
  <symbol id="s9-klinker" viewBox="0 0 32 32"><rect x="0" y="0" width="32" height="32" fill="#C2743C"/><rect x="1" y="1" width="14" height="6" fill="#D98E55"/><rect x="17" y="1" width="14" height="6" fill="#D98E55"/><rect x="9" y="9" width="14" height="6" fill="#D98E55"/><rect x="1" y="17" width="14" height="6" fill="#D98E55"/><rect x="17" y="17" width="14" height="6" fill="#D98E55"/><rect x="9" y="25" width="14" height="6" fill="#D98E55"/><rect x="25" y="9" width="6" height="6" fill="#D98E55"/><rect x="1" y="9" width="6" height="6" fill="#D98E55"/><rect x="25" y="25" width="6" height="6" fill="#D98E55"/><rect x="1" y="25" width="6" height="6" fill="#D98E55"/></symbol>
  <symbol id="s9-tulp" viewBox="0 0 16 28"><rect x="7" y="12" width="2" height="16" fill="#2E7D1E"/><path d="M9 20 q6 -2 6 -8 q-5 2 -6 8z" fill="#39D353"/><path d="M3 4 q5 -4 10 0 v6 q-5 6 -10 0z" fill="currentColor"/><path d="M8 2 l-3 4 h6z" fill="currentColor"/><path d="M3 4 q2.5 -2 5 -1 v8 q-3 2 -5 -1z" fill="rgba(255,255,255,0.2)"/></symbol>
  <symbol id="s9-lantaarn" viewBox="0 0 24 80"><ellipse cx="12" cy="78" rx="8" ry="2.5" fill="rgba(30,58,76,0.25)"/><rect x="10" y="18" width="4" height="60" fill="#1E3A4C"/><rect x="6" y="74" width="12" height="4" rx="1" fill="#1E3A4C"/><path d="M4 18 h16 l-2 -14 h-12z" fill="#1E3A4C"/><rect x="7" y="7" width="10" height="9" fill="#FFE08A"/><rect x="9" y="1" width="6" height="4" fill="#1E3A4C"/></symbol>
  <symbol id="s9-molen" viewBox="0 0 80 110"><ellipse cx="40" cy="106" rx="26" ry="4" fill="rgba(30,58,76,0.2)"/><path d="M22 106 L30 50 h20 L58 106z" fill="#C2743C"/><path d="M22 106 L30 50 h6 L30 106z" fill="#D98E55"/><path d="M26 50 h28 l-4 -8 h-20z" fill="#1E3A4C"/><rect x="36" y="86" width="8" height="20" fill="#5C2E0E"/><rect x="35" y="62" width="10" height="10" fill="#FFE08A"/><g stroke="#8B4A1E" stroke-width="3" stroke-linecap="round"><path d="M40 46 L14 20 M40 46 L66 20 M40 46 L14 72 M40 46 L66 72"/></g><g fill="#FFFFFF" opacity="0.95"><path d="M18 24 l10 -4 l10 10 l-6 8z"/><path d="M62 24 l-10 -4 l-10 10 l6 8z"/><path d="M18 68 l10 4 l10 -10 l-6 -8z"/><path d="M62 68 l-10 4 l-10 -10 l6 -8z"/></g><circle cx="40" cy="46" r="4" fill="#1E3A4C"/></symbol>
  <symbol id="s9-huisje" viewBox="0 0 48 60"><rect x="6" y="26" width="36" height="32" fill="currentColor"/><rect x="36" y="26" width="6" height="32" fill="rgba(0,0,0,0.18)"/><path d="M4 26 l6 -6 v-4 h4 v-2 h4 v-2 h12 v2 h4 v2 h4 v4 l6 6z" fill="#C43B38"/><path d="M24 12 h4 v2 h4 v2 h4 v4 l6 6 h-18z" fill="rgba(0,0,0,0.15)"/><rect x="12" y="34" width="8" height="10" fill="#DDF1FB"/><rect x="26" y="34" width="8" height="10" fill="#DDF1FB"/><rect x="18" y="46" width="10" height="12" fill="#5C2E0E"/></symbol>
  <symbol id="s9-kliniek" viewBox="0 0 150 130"><ellipse cx="75" cy="126" rx="72" ry="5" fill="rgba(30,58,76,0.2)"/><path d="M128 30 l18 8 v88 h-18z" fill="#DDE7EE"/><rect x="10" y="30" width="118" height="96" fill="#FFFFFF"/><rect x="10" y="30" width="118" height="8" fill="#5BC0EB"/><rect x="10" y="38" width="118" height="3" fill="#0E7FB5"/><rect x="56" y="6" width="26" height="26" rx="5" fill="#FFFFFF"/><rect x="56" y="6" width="26" height="26" rx="5" fill="rgba(0,0,0,0.04)"/><path d="M69 11 v16 M61 19 h16" stroke="#FF5E5B" stroke-width="5" stroke-linecap="round"/><rect x="18" y="48" width="26" height="28" rx="3" fill="#DDF1FB"/><rect x="56" y="48" width="26" height="28" rx="3" fill="#DDF1FB"/><rect x="94" y="48" width="26" height="28" rx="3" fill="#DDF1FB"/><rect x="18" y="86" width="26" height="28" rx="3" fill="#DDF1FB"/><rect x="94" y="86" width="26" height="28" rx="3" fill="#DDF1FB"/><rect x="56" y="90" width="26" height="36" fill="#1FA3DC"/><path d="M69 92 v32" stroke="#FFFFFF" stroke-width="2"/><rect x="10" y="122" width="118" height="4" fill="#CDE4F0"/></symbol>
  <!-- MOEDER ACHTER RAAM 26x28 (hoofd + schouders, kleding currentColor) -->
  <symbol id="s9-moeder" viewBox="0 0 26 28"><rect x="4" y="18" width="18" height="10" rx="5" fill="currentColor"/><circle cx="13" cy="11" r="8" fill="#F6C9A8"/></symbol>
  <!-- TELLER-ICONEN: hart, baby, wandelaar, klok -->
  <symbol id="s9-hart" viewBox="0 0 48 48"><path d="M24 42 C10 32 4 24 4 16 a10 10 0 0 1 20 -4 a10 10 0 0 1 20 4 c0 8 -6 16 -20 26z" fill="currentColor"/></symbol>
  <symbol id="s9-wandel" viewBox="0 0 48 48"><circle cx="26" cy="8" r="5" fill="#1E3A4C"/><path d="M26 14 l-8 10 6 6 -6 14 M26 14 l6 8 8 2 M24 30 l8 12" fill="none" stroke="#1E3A4C" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></symbol>
  <symbol id="s9-klok" viewBox="0 0 48 48"><circle cx="24" cy="24" r="19" fill="#FFFFFF" stroke="#1E3A4C" stroke-width="4"/><path d="M24 12 v12 l8 5" fill="none" stroke="#1E3A4C" stroke-width="4" stroke-linecap="round"/></symbol>
</defs>
</svg>'''
DEFS=DEFS8+EXTRA9
MANNEN=[dict(kleding='#9B6BFF',huid='#F6C9A8',haar='bh-kort',haarkleur='#4A3426'),
        dict(kleding='#FF8A3D',huid='#C98B5A',haar='bh-stekel',haarkleur='#1E3A4C'),
        dict(kleding='#39D353',huid='#E8B48A',haar='bh-kort',haarkleur='#8B4A1E'),
        dict(kleding='#5BC0EB',huid='#F6C9A8',haar='bh-kort',haarkleur='#FFC93C'),
        dict(kleding='#FF6FAE',huid='#E8B48A',haar='bh-stekel',haarkleur='#2B1A0E')]
def man_laken(i,x,y,actief=False,s=1.0):
    out=f'<g transform="translate({x} {y}) scale({s})">'
    if actief: out+=use('s9-ring',-16,56,80,24)
    out+=persoon(0,0,**MANNEN[i])
    out+=use('s9-laken',-12,36,72,26)
    return out+'</g>'
def man_baby(i,x,y,doek='#FFD6E6',s=1.0,flip=False):
    """Man zonder zijwaartse armen; de bundel is helemaal zichtbaar voor zijn borst, zijn armen en handen gaan eromheen."""
    f=' scale(-1 1) translate(-48 0)' if flip else ''
    m=MANNEN[i]
    out=f'<g transform="translate({x} {y}) scale({s}){f}">'
    out+=use('b-lijf-los',0,0,48,72,m['kleding'])+use('b-hoofd',0,0,48,72,m['huid'])+use(m['haar'],0,0,48,72,m['haarkleur'])+use('b-blij',0,0,48,72)
    out+=use('s9-bundel',8,30,32,32,doek)
    out+=use('s9-armen-om',0,0,48,72,m['kleding'])
    return out+'</g>'
def pino_duw(x,y,s=1.0,flip=False):
    f=' scale(-1 1) translate(-48 0)' if flip else ''
    return f'<g transform="translate({x} {y}) scale({s}){f}">'+use('pino-duw',0,0,48,72)+use('s9-stetho',0,0,48,72)+'</g>'
def bundel(x,y,doek='#FFD6E6',s=1.0,val=True):
    out=''
    if val: out+=use('s9-val',x+10*s,y-32*s,20*s,40*s)
    return out+f'<g transform="translate({x} {y}) scale({s})">'+use('s9-bundel',0,0,48,48,doek)+'</g>'
