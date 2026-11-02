import re, sys
kroon = '<path d="M8 36 L6 14 L17 24 L24 10 L31 24 L42 14 L40 36z" fill="#FFC93C"/><rect x="8" y="36" width="32" height="6" rx="2" fill="#D97A00"/><circle cx="24" cy="10" r="3" fill="#FF6FAE"/><circle cx="6" cy="14" r="2.5" fill="#1FA3DC"/><circle cx="42" cy="14" r="2.5" fill="#1FA3DC"/><circle cx="24" cy="30" r="3" fill="#FF6FAE"/>'
tuin = '<path d="M4 42 h40 l-10 -16 h-20z" fill="#D9B27C"/><path d="M14 34 h20 M11 38 h26" stroke="#C2743C" stroke-width="2" opacity="0.7"/><rect x="9" y="20" width="2" height="8" fill="#3F8F3C"/><circle cx="10" cy="16" r="5" fill="#FF6FAE"/><circle cx="10" cy="16" r="2" fill="#FFC93C"/><rect x="37" y="18" width="2" height="10" fill="#3F8F3C"/><circle cx="38" cy="14" r="5" fill="#9B6BFF"/><circle cx="38" cy="14" r="2" fill="#FFC93C"/><rect x="23" y="12" width="2" height="12" fill="#3F8F3C"/><circle cx="24" cy="9" r="4" fill="#FFFFFF"/><circle cx="24" cy="9" r="1.6" fill="#FFC93C"/>'
familie = '<circle cx="10" cy="26" r="7" fill="#FFFFFF"/><path d="M16 25 l6 1.5 -6 1.5z" fill="#FF8A3D"/><circle cx="12" cy="24" r="1.2" fill="#1E3A4C"/><circle cx="24" cy="26" r="7" fill="#FFF7EA"/><circle cx="18" cy="21" r="2.5" fill="#FFF7EA"/><circle cx="30" cy="21" r="2.5" fill="#FFF7EA"/><ellipse cx="24" cy="28" rx="4" ry="3" fill="#4A3426"/><circle cx="38" cy="26" r="7" fill="#FFB8D4"/><path d="M32 21 l2 -5 3 3z M44 21 l-2 -5 -3 3z" fill="#FFB8D4"/><ellipse cx="38" cy="28" rx="3" ry="2" fill="#FF6FAE"/><circle cx="37" cy="28" r="0.7" fill="#B23A6A"/><circle cx="39" cy="28" r="0.7" fill="#B23A6A"/><path d="M4 40 q20 -8 40 0" fill="none" stroke="#FF6FAE" stroke-width="3" stroke-linecap="round"/>'
camera = '<rect x="16" y="9" width="14" height="7" rx="2" fill="#1E3A4C"/><rect x="6" y="14" width="36" height="26" rx="5" fill="#1E3A4C"/><circle cx="24" cy="27" r="9" fill="#5BC0EB"/><circle cx="24" cy="27" r="5" fill="#0E7FB5"/><circle cx="21" cy="24" r="1.8" fill="#FFFFFF"/><rect x="34" y="18" width="5" height="3" rx="1" fill="#FFC93C"/><path d="M4 6 l3 3 M44 6 l-3 3" stroke="#FFC93C" stroke-width="2.5" stroke-linecap="round"/>'
munten = '<circle cx="17" cy="31" r="10" fill="#E6EFF5" stroke="#8AA0AF" stroke-width="2"/><circle cx="17" cy="31" r="5" fill="none" stroke="#8AA0AF" stroke-width="2"/><circle cx="31" cy="20" r="10" fill="#E6EFF5" stroke="#8AA0AF" stroke-width="2"/><circle cx="31" cy="20" r="5" fill="none" stroke="#8AA0AF" stroke-width="2"/>'

def swap_door(s, label_old, label_new, bg_new, icon):
    # find the <a ... aria-label="label_old"> block and replace its svg inner + bg + label
    i = s.index('aria-label="%s"' % label_old)
    j = s.index('</a>', i)
    blok = s[i:j]
    blok = blok.replace('aria-label="%s"' % label_old, 'aria-label="%s"' % label_new)
    blok = re.sub(r'class="bol" style="background: #[0-9A-F]{6};"', 'class="bol" style="background: %s;"' % bg_new, blok)
    blok = re.sub(r'(<svg class="ic" viewBox="0 0 48 48" width="\d+" height="\d+" aria-hidden="true">).*?(</svg>)', lambda m: m.group(1) + icon + m.group(2), blok, flags=re.S)
    return s[:i] + blok + s[j:]

for p in ['pino/project/Main.dc.html', 'pino/project/Desktop.dc.html']:
    s = open(p).read()
    s = swap_door(s, '24 november, geopend: gans', '24 november, gespeeld: Princess Presence', '#FFE0EE', kroon)
    s = swap_door(s, '25 november, geopend: potlammetje', '25 november, gespeeld: Tuin van de koningin', '#D9F5DE', tuin)
    s = swap_door(s, '26 november, geopend: snoepje', '26 november, gespeeld: Complete the family', '#FFF1D6', familie)
    s = swap_door(s, '27 november, vandaag: open dit deurtje', '27 november, vandaag: (Social)ize the family', '#DDF1FB', camera)
    # gedachtenwolkje: dobbelsteen -> munten (spel 5: Negotiate trade deal)
    s = re.sub(r'(<div class="wolkje" role="img" aria-label=")[^"]*(")', r'\1Pino denkt aan morgen: een geheim spel op de markt\2', s)
    s = re.sub(r'(<span class="wolk-icoon">\s*<svg class="ic" viewBox="0 0 48 48" width="\d+" height="\d+" aria-hidden="true">).*?(</svg>)', lambda m: m.group(1) + munten + m.group(2), s, flags=re.S)
    # vaardigheden herverdelen
    s = s.replace('Vandaag: +1 Lichaam', 'Vandaag: +1 Charisma')
    s = s.replace('aria-label="Koken: 1 van 10"><span class="vol"></span>', 'aria-label="Koken: 0 van 10"><span></span>')
    s = s.replace('aria-label="Charisma: 1 van 10"><span class="vol"></span>', 'aria-label="Charisma: 0 van 10, vandaag te verdienen"><span class="straks"></span>')
    s = s.replace('aria-label="Lichaam: 0 van 10, vandaag te verdienen"><span class="straks"></span>', 'aria-label="Lichaam: 1 van 10"><span class="vol"></span>')
    s = s.replace('aria-label="Logica: 0 van 10"><span></span>', 'aria-label="Logica: 1 van 10"><span class="vol"></span>')
    open(p, 'w').write(s)
    print(p, s.count('Princess Presence'), s.count('class="straks"'), s.count('class="vol"'))
