# Spel 6 · Selfdefense

**Status:** aanzet · Dag 6 · 29 november · vaardigheid Lichaam · rendering: canvas
Previews: `Spel6.png`, `Spel6-Controle.png`, `Spel6-Klaar.png`, `Spel6-Sprites.png` · Generator: `spel6_build2.py`, `spel6_sprites.py`
Sprites nieuw: `z-kap z-arm z-gezicht s6-tas s6-tril s6-klem s6-reageer s6-move-greep s6-move-draai s6-move-klem s6-move-houd s6-politie s6-gi`

## Bekend uit het ontwerp
- Drukke steeg op de nachtmarkt; zakkenroller (donkere hoodie) grijpt achter Pino naar haar tas; de enige cue zijn rode trillijntjes bij de tas.
- Fase 1: snel op de grote rode knop (stop-hand met slinkende ring).
- Fase 2: armklem op de grond; vier move-iconen (greep, draai, klem, houd; de actieve heeft een paarse ring) tot de politie er is (autootje + balk + tijd bovenin); een verkeerde keuze laat zijn rode worstelbalk oplopen.
- Munt + bedrag in de kopbalk (wat te stelen valt = rest uit spel 5). Werker in de menigte, half achter een bezoeker.
- Band van de gi: standaard blauw (tweak).

## Staat
In: `geld`, `producten` (kniebeschermers, besluit 63). Uit: `geld` (gevolg bij mislukken nog te kiezen), `rondSpelAf(6, { vaardigheid: 'lichaam' })`.

## Uit te werken
Reactievenster, wat bij te laat, regel voor de juiste move (patroon of reageren op zijn beweging), duur tot de politie er is, gevolg voor het geld, resultaatscherm.
- Gedrag zonder kniebeschermers uit spel 5 (`producten`); hoe ze in beeld komen als Pino ze wel heeft.
- Wat valt er te stelen: na de ketting in spel 5 is het geld 0; alleen wat over is na de kniebeschermers (of ongebruikte wisselkraam-munten) zit in de tas.
