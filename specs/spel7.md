# Spel 7 · Spot the peasant

**Status:** goedgekeurd (10 november 2026; `advent/js/spellen/spel7.js`, zoekmodus in `spellen/zoeken.js` + spel 2–6; router: query in de hash; besluiten #101–#107)
**Dag 7 · 30 november · vaardigheid Logica · rendering: SVG-DOM**
Previews: `Spel7.png`, `Spel7-Klaar.png`, `Spel7-Sprites.png` · Artboards: `Spel7.dc.html`, `Spel7-Klaar.dc.html` · Generator: `spel7_build2.py`, `spel7_sprites.py`

## Doel en gevoel
Een fotoalbum met vakantiefoto's van de vorige dagen. Op elke foto ontbreekt iets: in elk spel van 2 t/m 6 stond steeds een werker met groene hoed en hark nét in beeld. Pino gaat terug naar die spellen en zoekt hem. Wie hem aantikt, komt meteen terug in het album, waar de foto een stempel en vinkje krijgt. Bij vijf vondsten is het spel af.

## Scherm
Van boven naar beneden (390×844, `.scherm.spel.s7`):
- **Kopbalk** (`ui/kopbalk.js`): terug naar het deurtje, label "DAG 7 · 30 NOVEMBER", titel, rechts de pil loep (`s7-loep`) + `x / 5`.
- **Album** (`.s7-album`): bruin `#C2743C` met batikstippen (geel en rood, 40 px raster), rand `#8B4A1E` + goud `#FFC93C`, hoeken 22 px. Raster 2 × 160 px; polaroids om en om −3° en +3°; spel 6 staat gecentreerd over twee kolommen.
- **Voortgangskaart** (`.s7-voortgang`): werker in een lichtgroene bol + groene balk (`gevonden × 20 %`).

## Polaroids
Elke polaroid is een SVG 160×194 (viewBox −12 −12 144 164): `s4-polaroid` 120×140 + een foto van 100×96 op 8,8. De foto wordt gebouwd met de **scenebouwer van dat spel** (besluit 107), stil en zonder werker, uitgesneden met een eigen viewBox (`UITSNEDE` in `spel7.js`, `preserveAspectRatio` slice):

| Spel | Bouwer | Inhoud | Uitsnede |
|---|---|---|---|
| 2 | `tuinScene()` (spel2.js) | de tuin zoals hij nu in de staat staat (na afronding: alleen de starttegel), Pino op de start | 0 500 240 230 |
| 3 | `familieScene('nguyen', karakters, { werker: false })` | familie Nguyễn met de gekochte karakters | 4 0 156 150 |
| 4 | `foto(familie, plek)` (spel4.js) | de eerste foto van de eerst gefotografeerde familie (of de familie uit spel 3) | het frame van die fotoplek |
| 5 | `marktScene()` (spel5.js) | de markt zoals in de kijkmodus, Pino op haar startplek | 0 44 250 240 |
| 6 | `tekenStilleSteeg(ctx)` (spel6.js, canvas) | de steeg in rust: bezoekers op hun beginplek, Pino met de ketting; één keer gerasterd en als `<image>` (PNG) in de polaroid, eerst een effen vlak tot de sprite sheet geladen is | 62 100 230 221 |

| Toestand | Beeld | Tik |
|---|---|---|
| gevonden | `s7-stempel` (70,100, 34) + `s7-vink` (92,−8, 30) | opent het spel in de zoekmodus |
| te zoeken (spel doorgespeeld) | wit waas 55 % + `s7-vraag` | opent het spel in de zoekmodus |
| spel nog niet doorgespeeld | wit waas 55 % + `s7-vraag` | geen knop |

De mini-scènes uit het artboard (`spel7_sprites.scene2()`…`scene6()`) blijven alleen voor de artboards; in scène 6 draagt Pino daar nu de ketting in plaats van de tas (besluit 80; `pino_tas` bestond niet meer).

## De werker (besluit 108)
Een personage in de poppenhuisstijl (48×72, zoals de andere personen) met altijd dezelfde outfit: groene hoed met leren band, groen halsdoekje, okerbruine werkjas met riem, bruine broek en een snor. Per spel doet hij iets anders, met een prop:

| Symbool | Spel | Wat hij doet | Schaal | Voeten op |
|---|---|---|---|---|
| `wk-hark` | 2, tuin | harkt het gazon | 0,6 | vak (3,10) |
| `wk-kwast` | 3, villa | schildert de villa wit (gespiegeld, verfpot achter de villa) | 0,62 | (198,110) |
| `wk-zwaai` | 4, foto's | zwaait met een kokosdrankje naar de camera | 0,62 (strand 0,55) | strand (49,316), net achter de stamvoet; berg (214,452); markt (236,422) |
| `wk-emmer` | 5, nachtmarkt | haalt water uit de put | 0,62 | (184,262) |
| `wk-lampion` | 6, steeg | draagt een lampion aan een stok | 0,7 | (317,230) |
| `wk-staan` | 7 | armen langs het lijf (stempel, voortgang) | — | — |

Het resultaatscherm toont de vijf werkers elk met zijn eigen prop. Het kader volgt uit `werkerVak(voetX, voetY, schaal)` in `spellen/zoeken.js`. Het oude symbool `werker` (16×20) blijft alleen voor de artboards.

## Zoekmodus (besluiten 101–106)
- Route `#/spel/n?zoek=1`. De router geeft de query na `?` in de hash door als `query`; `schermSpel` geeft `zoek` aan `start()`.
- Alleen voor spel 2–6 dat `gespeeld` is, terwijl deurtje 7 open is (`zoekenMag(n)` in `spellen/zoeken.js`). Anders volgt een omleiding naar `#/spel/7`.
- In elk spel roept de werkerknop `werkerGevonden(n, { zoek })` aan:
  - zet `werkers[n]`;
  - toont bij de eerste vondst een melding loep + `x / 5` (`toonMelding`, 1,8 s);
  - in de zoekmodus volgt na de hupjes (700 ms + 250 ms) `ga('/spel/7', { vervang: true })`, tenzij Pino intussen al weg is.
- De terugknop in de kopbalk (en Escape in spel 6) wijst in de zoekmodus naar het album.
- Per spel:
  - **Spel 2:** het gewone spel. De werker verschijnt pas als er een tegel op (3,10) ligt; zijn de tegels op, dan haalt Pino ze uit spel 1 (#103).
  - **Spel 3:** het gewone spel; de werker staat half achter de villa van Nguyễn.
  - **Spel 4:** start altijd in het album van spel 4. Pino kiest een familie en zoekt in de bekijkmodus (#50, #105).
  - **Spel 5:** start in het productenalbum. Een gekocht kaartje opent de markt in kijkmodus (#67, #105).
  - **Spel 6:** rustige modus. De dief komt niet, ook niet na 2 s; Pino loopt vrij rond (joystick, pijltjes) en de bezoekers lopen. Er is geen afronding en geen ketting-controle (#106).

## Staat
- **In:** `werkers` (`{2..6: bool}`) en `deurtjes[2..6]` (doorgespeeld).
- **Uit:** `werkers[n]` (via `staat.markeerWerkerGevonden`). Bij 5/5 en deurtje 7 nog niet `gespeeld`: `rondSpelAf(7, { vaardigheid: 'logica' })` (klaar).

## Resultaatscherm
`toonResultaat` met:
- icoon loep, label "SPOT THE PEASANT · KLAAR", titel "Gevonden!";
- inhoud: de vijf werkers op een rij, elk met de prop uit zijn spel, met Pino (`pino-vinger`, gespiegeld) ernaast;
- één tegel "GEVONDEN 5/5";
- beloning Logica +1.

Er zijn geen tijd en geen miskliks (#104) en er is geen "Nog een keer". Opent Pino daarna spel 7 opnieuw, dan ziet ze het album met vijf vinkjes.

## Geen uitleg
Geen tekst op of bij de polaroids. Het album zegt niet dat er iemand gezocht moet worden. De melding na een vondst is alleen loep + getal.

## Toegankelijkheid
- Polaroids zijn `<button>` met `aria-label` "Spel n, titel: werker gevonden / nog niet gevonden". Een niet-doorgespeeld spel is `role="img"`.
- De teller en de voortgang hebben `role="img"` + `aria-label`.

## Acceptatiecriteria
- [x] Het album komt overeen met `Spel7.png`: vijf polaroids, juiste toestanden, teller en voortgangsbalk.
- [x] Een niet-doorgespeeld spel is niet aantikbaar; `#/spel/n?zoek=1` met de hand leidt dan terug naar `#/spel/7`.
- [x] Spel 2–6: polaroid → zoekmodus → werker tikken → melding → terug in het album met vinkje (in de preview getest, spel 2 met een tegel op (3,10)).
- [x] Spel 4 en 5 openen hun eigen album; de terugknop gaat naar het album van spel 7.
- [x] Spel 6 in de zoekmodus: geen dief, ook niet na 5 s; Pino loopt.
- [x] 5/5 → resultaatscherm `Spel7-Klaar.png` zonder tijd en miskliks; Logica +1 en deurtje 7 gespeeld.
- [x] Beoordeeld door Benjamin (10 november 2026): uitsneden, werker, testen en speltitel goed.

## Test-URL's
- `?test=1#/spel/7`: het album; deurtje 7 is open. Zet in `#/dev` de deurtjes 2–6 op gespeeld om polaroids aantikbaar te maken.
- `?test=1#/spel/6?zoek=1`: spel 6 in de zoekmodus (deurtje 6 moet gespeeld zijn).

## Open punten
- Geen. De speltitel blijft "Spot the peasant" (bevestigd door Benjamin).
- Niet gedaan: de artboards en previews van spel 7 zijn niet opnieuw gegenereerd (daar staan nog het oude werkertje en de tas in scène 6).
