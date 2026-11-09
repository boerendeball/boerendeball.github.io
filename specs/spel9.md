# Spel 9 · Vang de baby

**Status:** aanzet · Dag 9 · 2 december · vaardigheid Lichaam · rendering: canvas
Previews: `Spel9.png`, `Spel9-Klaar.png`, `Spel9-Sprites.png` · Generator: `spel9_build*.py`, `spel9_sprites.py`
Sprites nieuw: `s9-ooievaar s9-bundel s9-val s9-schaduw s9-laken s9-ring pino-duw s9-stetho b-lijf-los s9-armen-om s9-heg s9-klinker s9-tulp s9-lantaarn s9-molen s9-huisje s9-kliniek s9-moeder s9-hart s9-wandel s9-klok`

## Bekend uit het ontwerp
- Nederlands dorp (molen, huisjes). Boven: een ooievaar laat bundeltjes (roze/blauw) vallen. De vangstrook is gemaaide grasbanen met drie mannen met een laken die Pino (stethoscoop, armen vooruit) verschuift door te slepen; groeiende schaduwen op het gras tonen waar een bundeltje landt. Heg als scheiding.
- Onder: klinkerpad met tulpen naar de kraamkliniek waar moeders achter de ramen wachten; mannen met een gevangen baby lopen erheen.
- Tellers: hartjes = levens, bundel + getal = gevangen; onderin ooievaar + ronde, wandelaar + onderweg, klok + tijd.
- Twee-armen-regel: wie een baby draagt gebruikt `b-lijf-los` + bundel + `s9-armen-om`.

## Staat
In: `producten` (sportschoenen, besluit 63). Uit: `rondSpelAf(9, { vaardigheid: 'lichaam' })`, `scores[9]`.

## Uit te werken
Valsnelheid en rondes, sleepbesturing (pointer op het laken, ook toetsenbord links/rechts), levens, einde, resultaatscherm. Gedrag zonder sportschoenen uit spel 5 (`producten`).
