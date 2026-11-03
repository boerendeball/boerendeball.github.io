# Spel 5 · Negotiate trade deal

**Status:** aanzet · Dag 5 · 28 november · vaardigheid Charisma (nog te kiezen) · rendering: SVG-DOM
Previews: `Spel5.png`, `Spel5-Onderhandel.png`, `Spel5-Klaar.png`, `Spel5-Sprites.png` · Generator: `spel5_build2.py`, `spel5_sprites.py`
Sprites nieuw: `s5-lampion s5-gloed s5-kraam-achter s5-kraam-voor s5-waar-sieraden s5-waar-fruit s5-waar-stof s5-waar-lampion s5-put s5-mat s5-kruk s5-ketting s5-stemming-twijfel s5-stemming-blij s5-stemming-boos s5-praat s5-wegloop`

## Bekend uit het ontwerp
- Nachtmarkt met lampions, vier kramen (Mai en Arun boven, Siti en Minh onder), waterput. Pino loopt met D-pad (ook pijltjestoetsen).
- Bij een kraam: tekstballon-knop → onderhandelscherm met vraagprijs (ketting + munt + bedrag) en stemmingsbadge bij het portret. Bied met −/+ en de biedknop (praat + munt + bod) of loop weg. Prijzen zelf onthouden.
- Doel: de ketting met roze steen voor de laagste prijs; betalen met geld uit spel 4.
- Werker achter de waterput.

## Staat
In: `geld`. Uit: `geld` (rest → spel 6), `scores[5].betaald`, `rondSpelAf(5, ...)`.

## Uit te werken
Prijslogica per handelaar (startprijs, ondergrens, stemming, aantal biedingen), wat bij te weinig geld, einde (kopen = klaar), resultaatscherm, vaardigheidspunt (open punt). Logica in `spellen/markt.js` zonder DOM.
