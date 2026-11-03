# Spel 7 · Spot the peasant

**Status:** aanzet · Dag 7 · 30 november · vaardigheid Logica · rendering: SVG-DOM
Previews: `Spel7.png`, `Spel7-Klaar.png`, `Spel7-Sprites.png` · Generator: `spel7_build*.py`, `spel7_sprites.py`
Sprites nieuw: `s7-loep s7-vink s7-stempel s7-vraag s7-hoekje`

## Bekend uit het ontwerp
- Fotoalbum (batik-stippen, gouden rand) met vijf polaroids, één per spel 2–6, elk met een mini-scène waarin de werker bewust niet staat.
- Gevonden = vinkje + stempel; niet gevonden = vervaagd + grijze vraagteken-werker.
- Tik op een polaroid → terug naar dat spel; vanaf nu is de werker daar aanklikbaar (`staat.werkers[n]`). Loep + x/5 bovenin, voortgangsbalk onderin.

## Staat
In/uit: `werkers`. Ontgrendeling: zodra deurtje 7 open is, worden de werkers in spel 2–6 aanklikbaar. `rondSpelAf(7, { vaardigheid: 'logica' })` bij 5/5.

## Uit te werken
Hoe spel 2–6 in zoekmodus openen (route-parameter of staat), terugkeer naar het album na een vondst, melding bij vondst (toast via `toonMelding`), resultaatscherm.
