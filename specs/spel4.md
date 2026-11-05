# Spel 4 · (Social)ize the family

**Status:** aanzet · Dag 4 · 27 november · vaardigheid Charisma · rendering: SVG-DOM
Previews: `Spel4.png`, `Spel4-Klaar.png`, `Spel4-Sprites.png` · Generator: `spel4_build.py`, `spel4_sprites.py`
Sprites nieuw: strand (`s4-zon s4-wolk s4-meeuw s4-rots s4-boot s4-pier s4-palm s4-kraam s4-bank s4-boog s4-parasol s4-handdoek s4-bal s4-schelp s4-zeester`), camera (`s4-camera pino-foto s4-flits s4-zoeker`), silhouetten (`sil-moeder sil-vader sil-kind sil-big`), `s4-film s4-munt s4-polaroid werker`

## Bekend uit het ontwerp
- Tropisch strand; de familie uit spel 3 loopt over het strand; Pino heeft een camera.
- Drie foto's: gezin, moeder, vader. Zoeker verschuiven, sluiterknop. Filmstrook onderin toont met silhouetten welke foto aan de beurt is; filmrol-teller = aantal opnames.
- De familie betaalt geld (ontwerp 60; afhankelijk van familie) → `wijzigGeld`.
- Werker half achter de palmstam.

## Zonder familie (gebouwd, besluit 41)
Is `staat.familie` leeg (nog geen familie compleet in spel 3), dan toont `#/spel/4` de kopbalk met een dialoog: de villa met de bedroefde familie Nguyễn (twee vraagteken-plekken), de titel "Nog geen familiefoto" en de tekst "Nog geen enkele familie is compleet. Er kunnen nog geen foto's gemaakt worden." Eén knop: "Terug naar de kalender". Dit zit in `spellen/index.js`, vóór het laden van `spel4.js`.

## Staat
In: `familie`. Uit: `geld`, `rondSpelAf(4, { vaardigheid: 'charisma' })`.

## Uit te werken
Wat een "perfecte plek" is (zones per foto), beweging van de familie, aantal opnames, betaling per familie (open punt), resultaatscherm.
