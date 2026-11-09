# Spel 8 · Check mate

**Status:** aanzet · Dag 8 · 1 december · vaardigheid Logica · rendering: SVG-DOM
Previews: `Spel8-Levels.png`, `Spel8.png`, `Spel8-Klaar.png`, `Spel8-Sprites.png` · Generator: `spel8_build*.py`, `spel8_sprites.py`
Sprites nieuw: `s8-tegel s8-water s8-doelvak s8-boom s8-bamboe s8-tempel s8-rots s8-stam s8-voet s8-stuk-python s8-stuk-tijger s8-stuk-luiaard s8-stuk-leeuw s8-stuk-krokodil s8-stuk-pino s8-wacht s8-opnieuw s8-speel s8-slot s8-vlag s8-stap s8-varen s8-gras s8-bloem s8-grootboom s8-liaan s8-vak s8-vak-water`

## Bekend uit het ontwerp
- Vijf levels tegen roofdieren als schaakstukken: 1 python-pion, 2 tijger-toren, 3 luiaard-paard, 4 leeuw-loper, 5 krokodil-koningin. Het leveloverzicht toont alleen het stuk (de vorm verraadt de beweging), met vinkjes en slotjes.
- Bord: versleten stenen 8×8 in de junglegrond, jungle eromheen. Pino (roze pion) loopt stap voor stap (D-pad, pijltjestoetsen) en duwt rotsen en boomstammen; bomen, bamboe en rivier zijn vast. Doel: de tempel.
- Zandloperknop = het dier zet een beurt; kleine knop = level opnieuw. Teller: voetstappen + zetten.
- Gehaalde levels blijven gehaald (`staat.levels`).

## Staat
In: `producten` (jungledieren-spray, besluit 63). In/uit: `levels`. `rondSpelAf(8, { vaardigheid: 'logica' })` bij level 5 gehaald (of eerder; te kiezen).

## Uit te werken
Levelkaarten (8×8 per level), beurtregel (zet het dier na elke stap van Pino of alleen bij de zandloper?), vangregel, duwregels, resultaatscherm per level en totaal. Logica in `spellen/schaak.js` zonder DOM. Gedrag zonder jungledieren-spray uit spel 5 (`producten`).
