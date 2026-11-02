# Generators

Python 3-scripts (zonder afhankelijkheden) die de sprite-sets en de artboards van het ontwerp genereren.

- `spel{n}_sprites.py` — de `<symbol>`-definities van spel n (`EXTRA{n}`) plus hulpfuncties om ze te combineren (`persoon()`, `pino()`, `dier()`, `kraam()`, `polaroid()`, `stuk()`, …). Elke set importeert de vorige, zodat `spel10_sprites.DEFS` alle symbolen van spel 1 t/m 10 bevat. `spel1_sprites.py` heeft alleen `DEFS`, `spel2_sprites.py` `EXTRA`, `spel3_sprites.py` `EXTRA3`.
- `spel{n}_build*.py` — schrijft de artboards van spel n (`../artboards/Spel{n}*.dc.html`). Draai ze vanuit een map waarin `pino/project/` bestaat (ze schrijven naar `pino/project/`), of pas het uitvoerpad aan. **Importeer nooit een build-script**: bij import schrijft het meteen bestanden.
- `spellen_icons.py` — de deurtjes-iconen van de kalender.

`assets/sprites/*.svg` is uit deze scripts gemaakt door per set het `<defs>`-blok te nemen (zie `assets/sprites/README.md`). Pas je een sprite aan, doe dat hier en genereer de SVG's opnieuw, zodat ontwerp en app gelijk blijven.
