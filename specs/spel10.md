# Spel 10 · Bereik de bevalling + finale

**Status:** aanzet · Dag 10 · 3 december · vaardigheid nog te kiezen · rendering: canvas (fase 1 en 2), DOM (finale)
Previews: `Spel10.png`, `Spel10-Auto.png`, `Spel10-Finale.png`, `Spel10-Sprites.png` · Generator: `spel10_build2.py`, `spel10_sprites.py`
Sprites nieuw: `s10-maan s10-ster s10-gloed s10-pand s10-auto s10-ambu s10-stoep s10-stoeprand s10-auto-top s10-ambu-top s10-politie-top s10-paaltje s10-tas s10-taart s10-ballon s10-slinger`

## Bekend uit het ontwerp
- Fase 1 te voet (Frogger; knoppen links / omhoog / rechts, pijltjestoetsen): avondstad met grachtenpanden; stroken van onder naar boven: startstoep, klinkerpad met ganzen, twee weilanden met schapen, weg met twee rijstroken auto's, stoep met het witte elektrische ziekenhuisautootje.
- Fase 2 in de auto (stuur links / rem / stuur rechts): weg van boven met gras, bomen en lantaarns; tegenligger, slome auto om in te halen, politieauto die wil inhalen, overstekende ganzen. De weeën-teller (hart + klok + getal) loopt op.
- Finale (mag tekst): taart, ballonnen, slinger, Pino met de baby, alle behoeften op groen, het laatste briefje (placeholder, Benjamin).

## Staat
Uit: `rondSpelAf(10, { vaardigheid: null })`; behoeften → alle 100 in de finale.

## Uit te werken
Botsing of raken (terug naar het begin van de strook, of weeën +1?), snelheden, einde van fase 2, opbouw en teksten van de finale, vaardigheidspunt (open punt).
