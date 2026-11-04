# Spel 1 · Princess Presence

**Status:** gebouwd, te beoordelen (`advent/js/spellen/spel1.js`; gedeeld: `spellen/lus.js`, `spellen/spritesheet.js`, `spellen/canvas.js`, `invoer.js`, `ui/resultaat.js`, `css/spel.css`)
**Dag 1 · 24 november · vaardigheid Lichaam (label "Conditie")**
Previews: `design/previews/Spel1.png`, `Spel1-Klaar.png`, `Spel1-Sprites.png` · Artboards: `design/artboards/Spel1*.dc.html` · Generator: `design/generators/spel1_build.py`, `spel1_sprites.py`
Rendering: **canvas** (actiespel), sprite sheet gerasterd uit `sprites.svg` (set spel1).

## Doel en gevoel

Pino is prinses voor één avond. In de slaapzaal liggen negen nichtjes en neefjes in bed, en in het bijzijn van een prinses gaap je niet. Zodra een kind gaapt (mond open) loopt Pino ernaartoe en drukt ze op de grote rode knop: vinger in de mond, kind kijkt verrast, +1. Hoe meer gapen ze binnen de tijd onderbreekt, hoe beter. Druk en grappig, nooit gemeen.

Verborgen keten: elke gelukte onderbreking levert een **token** (in code en staat: `tegel`) op met de kleur en het figuur van de deken van dat kind (spel 2). In dit spel is daar niets van te zien, behalve één cryptische regel op het resultaatscherm.

## Scherm (390×844, van boven naar beneden)

1. **Kopbalk** (`ui/kopbalk.js`): terugknop (44 px rond) → `#/deur/1`; label `DAG 1 · 24 NOVEMBER`; titel `Princess Presence` (Fredoka 20). **Geen teller rechts**: het artboard toont een kroon-pil met score, maar er worden geen kroontjes verzameld (besluit 19). Het aantal onderbrekingen is pas op het resultaatscherm te zien.
2. **Tijdkaart** (`.kaart`, 12 px marge): klok-icoon (`s9-klok`, 22 px) + balk (14 px hoog, `#E6EFF5`, vulling `#FFC93C` met schaduw `#D97A00`, krimpt van 100 % naar 0 %) + resttijd `m:ss` (Fredoka 18, `#D97A00`, min-width 44 px, rechts uitgelijnd). **Geen tekst "TIJD"** (artboard heeft dat wel; de regel wint).
3. **Scène**: canvas 358×500 CSS-px in een afgeronde kaart (radius 22, schaduw `0 6px 0 0 #CDE4F0`, `overflow: hidden`). Interne resolutie × `devicePixelRatio` (max 3).
4. **Onder de scène: leeg.** Het besturingspaneel uit het artboard (D-pad, rode actieknop) is vervangen door de virtuele joystick die op de drukplek verschijnt (besluiten.md #22–24; zie events.md "Joystick").

Op desktop staat het scherm 390 px breed gecentreerd; de knoppen blijven zichtbaar (toetsenbord werkt daarnaast).

## Scène (viewBox 0 0 358 500)

Lagen van achter naar voor:

| Laag | Wat | Positie / maat | Kleur |
|---|---|---|---|
| muur | rechthoek | 0,0 358×96 | `#FFE0EE` + stippenbehang: cirkels r 2,5 om de 24 px, `#FF9BC8` 50 % |
| plint | rechthoek | 0,92 358×8 | `#C98B5A` |
| vloer | rechthoek | 0,100 358×400 | `#F6EBDD` |
| planken | lijnen | y = 136, 172, … 496 (elke 36) | `#C2743C` 35 %, 2 px |
| raam | `raam` | 147,18 64×52 | — |
| kleedje | `kleedje` | 131,236 96×48 | — |
| bedden rij 1 | zie tabel | y = 86 | — |
| bedden rij 2 | | y = 222 | — |
| bedden rij 3 | | y = 358 | — |
| nachtlamp | `nachtlamp` | 320,440 32×44 | — |
| Pino | `pino-staan` / `pino-loop`; bij het wijzen `pino-romp` + hangende `pino-arm-links`/`-rechts` | 48×72, voeten op y+72 | gespiegeld als ze naar links kijkt |
| wijzende arm | `pino-arm-vinger` (40×10, schouder op 4,5) | schouder op (x+31, y+36) of (x+17, y+36) | **boven alles**: over bed en kind heen; gedraaid naar de mond van het kind (x+32, y+38) en in de lengte gerekt (max. 1,6×) zodat de vinger de mond haalt |
| bereik-tint | witte tint 22 % over het kind (hoofd, haar, gezicht) | op het kind | alleen gapend én Pino naast het bed |
| dekenflits | donkere tint over deken en motieven, 30 % → 0 in 0,4 s | op de deken | direct na een geslaagde onderbreking |

Pino wordt **per rij gesorteerd**: ze wordt getekend ná alle bedden waarvan de onderkant (bed-y + 84) kleiner is dan haar voeten-y, en vóór de rest. Zo loopt ze zichtbaar tussen de rijen door (3/4-aanzicht).

### Bedden (64×84), kolommen x = 24, 147, 270; rijen y = 86, 222, 358

Opbouw per bed (volgorde!): `bed-onder` (0,0) → `k-hoofd` (16,14 32×32, huidkleur) → haar (16,14 32×32, haarkleur) → gezicht `g-slaap`/`g-gaap`/`g-verrast` (16,14) → `bed-deken` (0,0, dekenkleur) → motief 3× (`m-{motief}` op 10,50 14×14; 40,54 14×14; 25,60 12×12).

Vaste bezetting uit het artboard (deken · motief · huid · haar):

| | kolom 1 (x 24) | kolom 2 (x 147) | kolom 3 (x 270) |
|---|---|---|---|
| rij 1 (y 86) | blauw · vlinder · `#F6C9A8` · h-bob `#4A3426` | geel · boom · `#E8B48A` · h-krul `#2B1A0E` | groen · vogel · `#C98B5A` · h-staart `#FFC93C` |
| rij 2 (y 222) | groen · vlinder · `#E8B48A` · h-stekel `#8B4A1E` | geel · vogel · `#F6C9A8` · h-bob `#1E3A4C` | blauw · boom · `#C98B5A` · h-krul `#C2743C` |
| rij 3 (y 358) | geel · vlinder · `#C98B5A` · h-bob `#4A3426` | groen · boom · `#F6C9A8` · h-krul `#2B1A0E` | blauw · vogel · `#E8B48A` · h-staart `#FFC93C` |

Dekenkleuren: groen `#39D353`, geel `#FFC93C`, blauw `#5BC0EB`. Dit zijn precies de negen tegeltypen van spel 2 (elke combinatie komt één keer voor).

### Decoraties bij een bed

- **Slapend**: "z z z" rechts van het kussen: tekst Nunito 800 `#8AA0AF`, op (x+50, y+22) 11 px, (x+57, y+14) 9 px, (x+63, y+7) 7 px. Zachtjes op en neer (±2 px, 1,6 s) mag; geen filters.
- **Gapend**: gezicht `g-gaap`, verder niets. **Geen ring of balk** die de resterende gaaptijd toont (besluit Benjamin, 3 november 2026): Pino ziet aan het gezicht dat er gegaapt wordt en schat zelf in hoeveel tijd ze heeft.
- **Gapend én Pino naast het bed** (`naastBed`): alleen het **kind** (hoofd, haar, gezicht) licht subtiel op met een witte tint van 22 % over alleen de dekkende pixels, zoals een hover op een knop; bed en deken veranderen niet. Technisch: kind op een tussenlaag (`maakLaag`, 32×32 plus 16 px rand, gelijk aan de sprite-uitloop), `source-atop`-vulling, dan op het hoofdcanvas tussen `bed-onder` en `bed-deken` (besluit 17). Zodra Pino buiten reik stapt of de gaap stopt, verdwijnt de tint direct; geen animatie.
- **Verrast** (na onderbreking): gezicht `g-verrast` 1,2 s; de **deken** (met motieven) wordt op het moment van de onderbreking donkerder (tint `#1E3A4C` op 30 %) en loopt in 0,4 s lineair terug naar de eigen kleur (`dekenTot`, besluit 18), via dezelfde tussenlaag-techniek als de bereik-tint. **Geen +1-ballon** (artboard heeft die wel; weggelaten, besluit 20): het verraste gezicht en de dekenflits zijn de enige feedback.

## Regels

Constanten staan bovenaan `spel1.js` en zijn tuning-waarden:

| Constante | Waarde | Betekenis |
|---|---|---|
| `DUUR` | 60 s | speelduur; de tijdbalk loopt van vol naar leeg |
| `START_PAUZE` | 1,5 s | geen gapen in de eerste seconden |
| `GAAP_DUUR` | 3,5 s | zo lang blijft een kind gapen; daarna telt het als gemist |
| `INTERVAL_START` / `INTERVAL_EIND` | 4,0 s → 2,2 s | tijd tussen nieuwe gapen, lineair over de speelduur |
| `MAX_TEGELIJK` | 2 (eerste 30 s), daarna 3 | gelijktijdig gapende kinderen |
| `RUST` | 6 s | een kind gaapt niet twee keer binnen deze tijd |
| `DEKEN_DUUR` | 0,4 s | de deken loopt na een onderbreking van donker terug naar normaal |
| `REIK` | 28 px | strook links én rechts van het bed waarbinnen Pino's voetpunt moet staan |
| `ZIJ_BOVEN` / `ZIJ_ONDER` | 30 / 12 px | voetpunt tussen bed-y+30 en bed-y+96: daarboven staat Pino achter het bed, daaronder te ver eronder; beide tellen niet |
| `ARM_LENGTE` / `ARM_REK_MAX` | 30 px / 1,6 | natuurlijke lengte van de wijzende arm en de maximale rek om de mond te halen |
| `SNELHEID` | 130 px/s | loopsnelheid |
| `POSE_DUUR` | 0,45 s | zo lang staat Pino met de arm uitgestoken (geen lopen) |

- **Start**: Pino staat op (92, 232) (links van het middelste bed), kijkt naar rechts. De tijd begint te lopen bij de eerste invoer óf na 2 s, wat eerder is.
- **Gaap spawnen**: kies willekeurig een slapend kind dat niet in `RUST` zit en niet al gaapt; als er `MAX_TEGELIJK` gapen zijn, wacht.
- **Onderbreken**: bij de actieknop zoekt het spel het dichtstbijzijnde gapende bed waar Pino **naast** staat (`naastBed`: voetpunt links of rechts van het bed binnen `REIK`, en op bedhoogte; boven of onder het bed telt niet, besluit 21). Gevonden → score +1 (onzichtbaar), kind `verrast`, dekenflits, token toegevoegd, Pino 0,45 s gekeerd naar het bed met de **arm aan de kant van het kind** uitgestoken: `pino-romp` + de hangende andere arm op Pino's eigen laag, en `pino-arm-vinger` om de schouder gedraaid naar de mond van het kind, als laatste getekend zodat hij over bed en kind heen ligt. Niet gevonden → dezelfde pose 0,3 s met de arm aan de kijkkant recht vooruit, zonder straf. Zo ontdekt Pino de afstand en de juiste kant zelf.
- **Gemist**: een gaap die afloopt → `gemist` +1, kind valt weer in slaap; geen zichtbare straf; het kind sluit gewoon weer de ogen.
- **Einde**: bij 0:00 bevriest de scène 0,8 s en opent het resultaatscherm. De terugknop tijdens het spel gaat terug zonder op te slaan (bevestiging is niet nodig: niets gaat verloren behalve deze poging).
- **Slotzin**: bij minder dan 6 onderbroken "Er werd flink gegaapt vanavond. Morgen beter!", anders "Niemand durfde te gapen in het bijzijn van prinses Pino. Nou ja, bijna niemand." Geen sterren (besluit 16).
- **Pauze**: `visibilitychange` (tab weg) pauzeert de lus; terugkomen hervat zonder sprong.

## Besturing

- **Touch/muis**: de hele spelpagina (`.scherm.spel`) is joystick-vlak. Vasthouden → na `JOYSTICK_VERTRAGING` (250 ms) verschijnt de joystick op de drukplek; bewegen stuurt Pino analoog (kracht schaalt de snelheid); loslaten stopt. Korte tik = onderbreken (besluiten.md #24). Knoppen in de kopbalk blijven gewoon knoppen.
- **Toetsenbord**: pijltjes en WASD lopen; spatie of Enter onderbreekt; Escape = terug. `preventDefault` op pijltjes zodat de pagina niet scrolt.
- **Botsing**: Pino's voetvlak (24×16 onder haar) mag niet in een bed-voetafdruk komen (bed x+4, y+30, 56×48) en blijft binnen de vloer (x 0–310, voeten-y 130–500). Langs een bed glijden (per as botsen) zodat ze niet blijft haken.
- Looppose: `pino-loop` en `pino-staan` wisselen elke 0,18 s zolang ze beweegt; stilstaan = `pino-staan`. Spiegeling volgt de laatste horizontale richting.

## Staat

- In: niets (spel 1 is het begin van de keten).
- Uit, per gelukte onderbreking: `voegTegelToe(kleur, figuur)` met kleur ∈ groen/geel/blauw en figuur ∈ vlinder/boom/vogel (sleutel `groen-vlinder` enz.).
- Uit, bij einde: `rondSpelAf(1, { vaardigheid: 'lichaam', score: { onderbroken } })`. Er wordt geen highscore bijgehouden (besluit 15). Vaardigheid en behoefte tellen alleen bij de **eerste** afronding (zie besluiten.md); tegels tellen bij **elke** speelbeurt.

## Resultaatscherm (`Spel1-Klaar`, via gedeeld `ui/resultaat.js`)

Kaart gecentreerd, confetti-stipjes op de achtergrond. Bol 128 px (`#FFE0EE`, ring `#FF6FAE`) met kroon 84 px · label `PRINCESS PRESENCE · KLAAR` · titel **De hofhouding is onder de indruk!** · zin "Niemand durfde te gapen in het bijzijn van prinses Pino. Nou ja, bijna niemand." (bij minder dan 6 onderbroken: "Er werd flink gegaapt vanavond. Morgen beter!") · geen sterren (artboard heeft er drie; weggelaten, besluit 16) · één scoretegel **ONDERBROKEN** (groen `#1F7A3A`; het artboard toont ook GEMIST en HIGHSCORE, die zijn weggelaten, besluit 15) · beloningsblok paars: "VAARDIGHEID VERDIEND", "Conditie +1 · Behoefte "Verjaardag" +10%", cursief "Er rammelt iets in je jurkzak…" (de enige hint naar de tegels; bij 0 onderbroken blijft die regel weg) · knoppen **Terug naar de kalender** (groen, → `#/`) en **Nog een keer** (grijs, herstart). Bij een herspeelde beurt toont het beloningsblok "Conditie al verdiend" in plaats van +1.

## Geen uitleg

Weggelaten uit het artboard: het woord "TIJD" bij de balk. Niet aanwezig: de kroon-score-pil in de kopbalk (besluit 19), uitleg wat de knop doet, een teller van tokens, een melding "te ver weg". De `aria-label`s beschrijven wel wat de knoppen doen (toegankelijkheid gaat voor), maar zijn niet zichtbaar.

## Toegankelijkheid

- Canvas: `role="img"`, `aria-label="Slaapzaal met negen bedden; Pino loopt tussen de bedden"`.
- Score-pil `aria-live="polite"`; bij een onderbreking wordt de nieuwe score voorgelezen, niet elke frame.
- Alle knoppen echte `<button>`s met `aria-label`.
- `prefers-reduced-motion`: geen zwevende z's.

## Acceptatiecriteria

- [x] Scène volgt de opbouw van `Spel1.png` (muur, plint, planken, raam, kleedje, negen bedden met de bezetting uit de tabel, nachtlamp); gecontroleerd op DPR 2 in de browser-preview.
- [x] Alle dekenkleuren en motieven kloppen; `currentColor` valt nergens terug op `#1E3A4C`.
- [x] Pino loopt met pijltjes (gecontroleerd), botst op bedden (stopt op x = 114 naast het middelste bed), blijft binnen de vloer, en wordt per bedrij voor/achter getekend.
- [x] Gapen verschijnen volgens de constanten, zonder aflopende ring; afgelopen gaap telt als gemist.
- [ ] Onderbreken naast het bed (links of rechts): verrast gezicht, dekenflits, arm aan de kant van het kind over het bed heen naar de mond; boven/onder het bed of te ver weg: alleen de pose met de arm recht vooruit. (Nog te controleren in de browser na deze wijziging.)
- [x] Tijdbalk en `m:ss` lopen gelijk; op 0:00 volgt het resultaatscherm met het juiste getal.
- [x] Na afronden: deurtje 1 `gespeeld`, `vaardigheden.lichaam` +1 en `behoeften.verjaardag` +10 (alleen eerste keer), `tegels` per onderbreking één tegel met de juiste sleutel (`geel-vogel` gezien), `scores[1]` bijgewerkt.
- [x] "Nog een keer" start schoon opnieuw; terugknop ruimt lus, invoer en debug-haak op.
- [ ] Tab verbergen pauzeert; terugkomen geeft geen tijdsprong (code aanwezig, nog niet handmatig gezien).
- [x] Geen zichtbare uitlegtekst of labels buiten titel/kopbalk; geen consolefouten.
- [x] Joystick: verschijnt na de vertraging op de drukplek, knop volgt binnen de ring, Pino beweegt mee (ook diagonaal), loslaten verbergt en stopt; tik onderbreekt (gecontroleerd met gesimuleerde pointer-events).
- [ ] Beoordeling door Benjamin op telefoon (gevoel van de joystick, tik om te onderbreken) en desktop.

In testmodus (`?test=1`) staat de spelstaat op `window.pinoDebug` (`s`, `pino`, `bedden`) om in de console te sturen, bijvoorbeeld `pinoDebug.s.tijd = 1` om het einde te forceren of `pinoDebug.bedden[4].status = 'gaap'`.

## Test-URL's

- `?test=1&reset=1#/spel/1` schoon spelen.
- `?test=1#/laden/1` inclusief laadscherm (sprite sheet wordt in `voorbereid()` gerasterd).
- Na afloop `#/test` om `tegels` en `scores` te controleren; daarna `?test=1#/spel/2` (zodra dat bestaat) om de tegels terug te zien in het taartmenu.

## Open punten

Zie `besluiten.md`: speelduur 60 s (artboard rekent met 90 s), tegels bij elke speelbeurt, vaardigheid alleen eerste keer.
