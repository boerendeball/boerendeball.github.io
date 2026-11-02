# Ontwerpkeuzes Pino's Adventkalender

## Basis
- Kalender loopt van 24 november t/m 3 december (10 deurtjes), telt af naar Pino's verjaardag op 3 december.
- Stijl: Sims-achtig (oude Sims, cd-rom-tijdperk), niet Stardew Valley. Geen plumbob of EA-bitmapfonts (merk/ontwerp van EA); eigen interpretatie.
- Palet en fonts: zie `../CLAUDE.md` (daar staat de volledige tabel). Kort: achtergrond `#BFE6FA` met isometrisch tegelpatroon, witte kaarten met schaduw `#CDE4F0`, tekst `#1E3A4C`, teal `#1FA3DC`/`#0E7FB5`, groen `#39D353`/`#1FA34A`, geel `#FFC93C`/`#D97A00`, rood `#FF5E5B`/`#C43B38`, roze `#FF6FAE`/`#B23A6A`, paars `#9B6BFF`/`#6B3FCF`. Fredoka (koppen) + Nunito (tekst).
- Thema's/behoeften van Pino: verjaardag vieren, gansjes, lammetjes, snoepjes, jiujitsu, bordspellen, reizen, sieraden. Vaardigheden: Koken, Mechanica, Charisma, Lichaam, Logica, Creativiteit.
- Verwijderd op verzoek: "Sul sul!"-tekst, stickerboek, "Pino's favorieten", buurtscherm. Gans op het vergrendelde scherm zegt "Kwak kwak kwaaak!".

## Poppenhuisstijl (de tekenstijl van alle spellen)
- 3/4-aanzicht, platte vectorvlakken, één schaduwtint per kleur, licht van linksboven, geen gradients/filters op bewegende delen, 56 px-raster in het ontwerp, tekenvolgorde achter→voor (bij een bord: rij voor rij, per rij eerst de vakken, dan wat erop staat).
- Speelveld = altijd een echte scène met decor eromheen; het spelmechanisme zit als patroon in de grond (zie `../CLAUDE.md`).
- Sprites als SVG `<symbol>`/`<use>` met `currentColor`; per spel een sprite-set (`Spel{n}-Sprites` in `previews/`, `../assets/sprites/spel{n}.svg`). De sets stapelen: latere spellen hergebruiken symbolen van eerdere (personen uit spel 3, Pino uit spel 1, werker en munt uit spel 4, lantaarn en klinkers uit spel 9, enz.).
- Personages: `persoon(kleding, huid, haar, haarkleur, jurk, accessoires)` — lijf of jurk, hoofd, haar (kort, lang, knot, stekels), blij gezicht, accessoires (nón lá, hoge hoed, ketting, bril, pet, kinder-rijsthoed). Kinderen op 72 %. Dieren: lam, gansje, biggetje. Precies twee armen per personage (zie `../CLAUDE.md`).
- Geld = munt-symbool `s4-munt` (§) + getal; tellers altijd icoon + getal.

## Cultureel decor per spel
- Spel 1, 9 en 10 spelen in Pino's eigen wereld: slaapzaal met bedjes; Nederlands dorp met molen, huisjes, tulpen, klinkerpad en kraamkliniek; Nederlandse avondstad met grachtenpanden, lantaarns, maan en sterren.
- Spel 2 t/m 8 zijn Zuidoost-Aziatisch (Vietnam, Maleisië, Thailand): lotusvijver met paviljoen (sala) en bananenplanten in de tuin (2); Thaise villa met getrapt rood dak, paalwoning bij rijstvelden en shophouse als familiehuizen, families Nguyễn, Tan en Somchai, nón lá op moeder Tan (3); tropisch strand met kalksteenrotsen, longtailboot, pier, fruitkraam met rieten dak en kokosnoten, bloemenboog met lampion (4); nachtmarkt met slinger van rood-gele lampions, kasseien, waterput, handelaars Mai, Arun, Siti en Minh (5 en 6); fotoalbum met batik-stippelpatroon en gouden rand (7); jungle met tempel met getrapt dak en gouden nokversiering, bamboe, lianen en varens, schaakbord van versleten steen in de grond (8).
- Kleuren erbij: tempelrood `#C43B38`, goud `#FFC93C`, riet `#D9B27C`.

## Sims-elementen in de kalender (ontworpen)
1. Behoeftenpaneel — inklapbaar (groen/geel/rood); mobiel standaard open, desktop open.
2. Taartmenu bij tikken op deurtje — Open deurtje / Gluren… / Briefje lezen / Annuleren; ook gebruikt in spel 2 voor tegel- en edelsteenkeuze.
3. Nederlandse "reticulating splines"-laadteksten — 12 regels, wisselen tijdens het laden.
4. Vaardigheidsbalken — inklapbaar; mobiel standaard ingeklapt, desktop open.
5. Gedachtenwolkje met hint voor morgen boven de avatar.
6. Telefoon-notificatie "Er wordt gebeld!" — apart scherm met rinkelende telefoon.
7. Isometrische tegelvloer als achtergrond (subtiele witte diamantlijnen).

## Open punten
- Spelnamen verfijnen en "Briefje voor Pino" per dag invullen (Benjamin).
- Kleur van de jiujitsu-band is een tweak (standaard blauw).
- Resultaatschermen van spel 1–3 staan nog in de oudere kaartstijl met een uitlegzin; Benjamin was tevreden, alleen aanpassen als hij erom vraagt.
