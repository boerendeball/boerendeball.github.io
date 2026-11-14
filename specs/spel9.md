# Spel 9 · Vang de baby

**Status:** gebouwd, te beoordelen · Dag 9 · 2 december · vaardigheid Lichaam · rendering: canvas
Previews: `Spel9.png`, `Spel9-Klaar.png`, `Spel9-Sprites.png` · Artboards: `Spel9*.dc.html` · Generator: `spel9_build2.py`, `spel9_sprites.py`
Code: `advent/js/spellen/spel9.js` (canvas, DOM, resultaat) en `advent/js/spellen/vang.js` (regels en afstelwaarden zonder DOM)

De previews tonen het eerste ontwerp (laken slepen, hartjes, rondes, klok). Besluit 125–138 vervangen dat op de punten hieronder; de scène, de sprites en de kleuren zijn ongewijzigd.

## Doel en gevoel
De ooievaar heeft het druk. Pino rent over het grasveld en duwt de mannen met hun laken onder de vallende bundeltjes. Twintig seconden lang; mist er één, dan is het voorbij. Met de sportschoenen uit spel 5 is het te doen, op hakken niet.

## Scherm
- Kopbalk: terugknop, "DAG 9 · 2 DECEMBER", titel, en rechts één teller-pil: `s9-bundel` + aantal gevangen.
- Daaronder alleen de scène (358×680) in een kaart met ronde hoeken. Geen hartjes, geen onderbalk, geen klok, geen rondes (besluit 130).
- Het scherm is één venster hoog (`.spel9`, `100dvh`); de scène krimpt mee met de ruimte onder de kopbalk.

## Scène (358×680, posities uit `spel9_build2.py`)
Van achter naar voor:
1. **Achtergrondlaag** (statisch): lucht `#8ED8F8`, zon, twee wolken, gras vanaf y 176, twee heuvels, molen, vier huisjes, drie bomen. De vangstrook (y 296–470) bestaat uit acht gemaaide banen die naar achteren smaller worden (factor 1,11 per baan, ±14 → ±30 px), met een witte lijn boven en onder.
2. **Ooievaar** (`s9-ooievaar`, 120×70, y 28 met een lichte deining), gespiegeld als hij naar links vliegt.
3. **Landingsschaduwen** (`s9-schaduw`) en de **ring** (`s9-ring`) onder de man die geduwd wordt.
4. **Vangstrook, gesorteerd op voetpunt**: mannen met laken (`b-lijf-los` + hoofd + haar + `b-blij` + `s9-laken` + `s9-armen-laken` + `s9-handen-laken`), mannen met baby (`b-lijf-los` + bundel + `s9-armen-om` + `s9-handen-om`), stofwolkjes, Pino.
5. **Vallende bundeltjes** (`s9-bundel` roze `#FFD6E6` of blauw `#DDF1FB`, met `s9-val`).
6. **Voorgrondlaag** (statisch): heg, tulpen, klinkerpad, boom, lantaarn, kraamkliniek met vijf moeders.
7. **Mannen met baby op het pad**, sterretjes (`s10-ster`) en hartjes (`s9-hart`).

**Pino** = pose (`pino-staan`, `pino-loop`, `pino-duw`, `pino-duw-op`, `pino-duw-neer`) + `s9-stetho` (bij de duw-poses ingebouwd, onder de armen) + schoenen-overlay (`s9-sneakers[-loop]` of `s9-hakken[-loop]`).

**Diepte** (besluit 127): alles op de vangstrook schaalt rond het voetpunt met `schaalOp(y)`: 0,70 op de bovenrand (voet-y 316), 1,00 op de onderrand (462). De loopsnelheid schaalt mee, de tekenvolgorde volgt het voetpunt en de grasbanen lopen taps. Op het pad is de schaal 1.

## Regels (constanten in `vang.js`)
| | |
|---|---|
| Speelduur | 20 s (`DUUR`); de klok start bij de eerste invoer of na 2 s |
| Worpen | eerste na 1 s, daarna om de 2–3 s (willekeurig, besluit 137); na 17 s geen nieuwe (`STOP_VALLEN`) |
| In de lucht | hooguit 3 baby's tegelijk (`MAX_IN_LUCHT`, besluit 138); is de lucht vol, dan wacht de ooievaar |
| Valtijd | 4000 ms van snavel tot gras (`VALTIJD`, besluit 136) |
| Lopen | 160 px/s met sportschoenen, 55 px/s op hakken (× schaal; in de diepte × 0,8) |
| Vangers | altijd drie mannen met een laken op de strook |

- **Landingsplek**: 0,5 s voor een worp kiest het spel een punt op 38–92 px van een vanger die nog geen bundeltje boven zich heeft, en vliegt de ooievaar erheen. Pino moet dus altijd duwen, maar het is haalbaar (besluit 134). De schaduw ligt er vanaf de worp en groeit in 4 s van 35 % naar vol.
- **Duwen** (besluit 125): loopt Pino tegen een vanger aan (binnen 26 px diepte en de som van hun halve breedtes), dan schuift die met haar mee, in dezelfde richting en even snel. Dat kan van links, rechts, boven en onder. Een man schuift niet door een andere man heen en niet voorbij de rand van zijn eigen veld (`MAN_VELD`: 42 px van de zijkanten en 30 px van de boven- en onderrand van Pino's veld), zodat Pino er altijd achter past om hem terug naar het midden te duwen (besluit 135); dan staat Pino ook stil. Ook de beginplekken, de plek van een nieuwe man en de landingsplekken liggen binnen dat veld. Tijdens het duwen heeft Pino de duw-pose van die richting en ligt de ring onder de man.
- **Vangen**: landt een bundeltje binnen 28 px (× schaal) naast en 16 px voor/achter het voetpunt van een vanger, dan is het gevangen: teller +1.
- **Na het vangen** (besluit 131): de man houdt de baby vast en rent (240 px/s) naar de dichtstbijzijnde zijkant, komt op het klinkerpad terug en rent naar de deur van de kliniek. Daar verdwijnt hij met sterretjes en stijgen er drie hartjes op uit de kliniek. Op het moment van vangen loopt aan dezelfde kant een nieuwe man met een laken het veld in (200 px/s, tot net binnen de rand van het mannenveld); onderweg kan hij nog niet vangen of geduwd worden.
- **Gemist** (besluit 130): landt een bundeltje naast elk laken, dan blijft het in het gras liggen, bevriest het spel 0,9 s en volgt het niet-gehaald-scherm.
- **Gehaald**: de 20 s zijn om, er valt niets meer en alle mannen met een baby zijn bij de kliniek.
- **Zonder sportschoenen** (besluit 128): het spel start gewoon. Pino draagt gouden hakken, loopt traag en wiebelt; met schoenen draagt ze de roze-blauwe sneakers uit spel 5 en laat ze stofwolkjes achter. Zonder schoenen is alles vangen praktisch onhaalbaar; dat het aan de schoenen ligt, staat nergens.

## Besturing
Zoals spel 1 (besluit 125): vasthouden op het scherm → joystick (250 ms), of pijltjestoetsen/WASD. Geen actieknop; een tik doet niets. Escape = terug naar het deurtje.

## Staat
- In: `producten` bevat `'schoenen'` of niet (besluit 63).
- Uit, gehaald: `rondSpelAf(9, { vaardigheid: 'lichaam', score: { gevangen } })` → `scores[9].gevangen`, eerste keer Lichaam +1 en Verjaardag +10 %.
- Uit, niet gehaald: niets; het deurtje wordt niet `gespeeld`.

## Resultaatscherm (besluit 132)
Geen scoretegels.
- **Gehaald**: label "VANG DE BABY · KLAAR", titel "Allemaal veilig geland!", tafereel met blije Pino en drie blije vrouwen met een baby in hun armen, confetti, de verdiende vaardigheid, "Terug naar de kalender" en "Nog een keer".
- **Niet gehaald**: label "VANG DE BABY", titel "Oeps…" (voorstel), tafereel met verdrietige Pino en de ooievaar die een vleugel om haar heen slaat (`pino-sip` + `s9-ooievaar-troost`), geen confetti, geen beloning.

## Geen uitleg
Geen tekst in het spelscherm. Uit het eerste ontwerp vervallen: hartjes, ronde-teller, wandelaar-teller, klok, en de tegels GEVANGEN / RONDES / GEMIST op het resultaatscherm. Nergens staat dat de schoenen het verschil maken.

## Toegankelijkheid
Canvas met `role="img"` en `aria-label`; de teller is `role="status"` met "n baby's gevangen"; terugknop met `aria-label`. `prefers-reduced-motion`: geen deining van de ooievaar en geen wiebel.

## Acceptatiecriteria
- [x] Scène komt overeen met `Spel9.png` (dorp, vangstrook, heg, pad, kliniek), zonder de vervallen tellers.
- [x] Lopen met joystick en met pijltjestoetsen; Pino en de mannen worden kleiner naar boven.
- [x] Duwen van links, rechts, boven en onder toont de juiste pose en verplaatst de man.
- [x] Een bundeltje valt 4 s; de schaduw groeit op de landingsplek.
- [x] Vangen: teller +1, man rent weg en verschijnt op het pad, nieuwe man loopt in, sterretjes en hartjes bij de kliniek.
- [x] Geen worp na 17 s; na 20 s zonder misser het gehaald-scherm met beloning, `scores[9]` gevuld.
- [x] Eerste misser: direct het niet-gehaald-scherm, zonder beloning.
- [x] `?schoenen=0`: hakken, wiebel, duidelijk trager; `?schoenen=1`: sneakers en stofwolkjes.
- [ ] Door Benjamin gespeeld op een telefoon: is het met schoenen haalbaar en zonder niet? (afstelwaarden in `vang.js`)

## Test-URL's
- `/advent/?test=1&schoenen=1#/spel/9` en `…&schoenen=0#/spel/9`
- `/advent/?test=1#/laden/9` (laadscherm), `#/dev` (schakelaar "Spel 9 · sportschoenen")
- Console in testmodus: `pinoDebug.stap(ms)` zet het spel vooruit; `pinoDebug.s.altijdRaak = true` laat elke baby vangen (om het gehaald-scherm te zien).

## Open punten
- Geen: de titel "Oeps…" (besluit 132), de snelheid zonder schoenen (besluit 128) en de afstelling van landingsplek en vangmarge (besluit 134) zijn bevestigd (Benjamin, 14 november 2026).
