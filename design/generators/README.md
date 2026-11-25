# Generators

Python 3-scripts (zonder afhankelijkheden) die de sprite-sets en de artboards van het ontwerp genereren.

- `spel{n}_sprites.py` — de `<symbol>`-definities van spel n (`EXTRA{n}`) plus hulpfuncties om ze te combineren (`persoon()`, `pino()`, `dier()`, `kraam()`, `polaroid()`, `stuk()`, …). Elke set importeert de vorige, zodat `spel10_sprites.DEFS` alle symbolen van spel 1 t/m 10 bevat. `spel1_sprites.py` heeft alleen `DEFS`, `spel2_sprites.py` `EXTRA`, `spel3_sprites.py` `EXTRA3`.
- `spel{n}_build*.py` — schrijft de artboards van spel n (`../artboards/Spel{n}*.dc.html`). Draai ze vanuit een map waarin `pino/project/` bestaat (ze schrijven naar `pino/project/`), of pas het uitvoerpad aan. **Importeer nooit een build-script**: bij import schrijft het meteen bestanden.
- `spellen_icons.py` — de deurtjes-iconen van de kalender.
- Spel 1: `spel1_assets.py` zet nieuwe symbolen uit `spel1_sprites.DEFS` (nu `s1-haas`, het icoon van de Chop chop-knop, besluit 225) in `assets/sprites` (`spel1.svg`, `sprites.svg` vóór het kamerblok, `symbolen.json`); mag vaker draaien.
- Spel 10 (middernacht, besluit 220): `spel10_build2.py` schrijft zijn artboards rechtstreeks naar `../artboards/`; `spel10_assets.py` zet de nachtsymbolen (`s10-toren`, `s10-pand-nacht`, `s10-stoep-nacht`, `s10-klinker-nacht`, `s10-boom-nacht`, `s10-koplicht-zij`, `s10-koplicht-top`) in `assets/sprites` (mag vaker draaien).
- `kamer_sprites.py` — de symbolen van Pino's kamer (`km-*`, `EXTRA_KAMER`) en bouwstenen voor de kamer (`foto()`, `poppetje()`, `schaakbord()`, `tegelstapel()`); importeert `spel10_sprites`. `kamer_build.py` schrijft de artboards `Kamer.dc.html`, `Kamer-Leeg.dc.html` en `Kamer-Sprites.dc.html` rechtstreeks naar `../artboards/`. `kamer_assets.py` zet de kamersymbolen in `assets/sprites` (mag vaker draaien).

`assets/sprites/*.svg` is uit deze scripts gemaakt door per set het `<defs>`-blok te nemen (zie `assets/sprites/README.md`). Pas je een sprite aan, doe dat hier en genereer de SVG's opnieuw, zodat ontwerp en app gelijk blijven.
