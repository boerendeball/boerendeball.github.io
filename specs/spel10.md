# Spel 10 · Bereik de bevalling + finale

**Status:** gebouwd, te beoordelen · Dag 10 · 3 december · vaardigheid nog te kiezen · rendering: canvas (fase 1 en 2), DOM (finale)
Previews: `Spel10.png`, `Spel10-Auto.png`, `Spel10-Finale.png`, `Spel10-Sprites.png` · Artboards: `Spel10*.dc.html` · Generator: `spel10_build2.py`, `spel10_sprites.py`
Code: `advent/js/spellen/spel10.js` (canvas, DOM, resultaat, finale) en `advent/js/spellen/bevalling.js` (regels en afstelwaarden zonder DOM)
Sprites nieuw: `s10-maan s10-ster s10-gloed s10-pand s10-auto s10-ambu s10-stoep s10-stoeprand s10-auto-top s10-ambu-top s10-politie-top s10-paaltje s10-tas s10-taart s10-ballon s10-slinger s10-lam-graas s10-gans s10-gans-boos`

De previews zijn van vóór de besluiten 144–158 (12–14 november 2026). Waar ze afwijken, is deze spec leidend: **geen weeën-teller** in de kopbalk, wel een **afstandsbalk** boven de scène in fase 2. Fase 1 is **26 rijen van 40 px** (25 stappen, besluiten 155 en 157): de stad is 1200 px hoog, hoger dan het beeld, en het beeld schuift mee met Pino. `Spel10.png` toont dus alleen de opbouw en de stijl, niet de hele stad.

## Doel en gevoel

Pino is verloskundige en moet op tijd bij een bevallende vrouw zijn. Eerst steekt ze te voet de avondstad over naar het witte ziekenhuisautootje, stap voor stap tussen ganzen, schapen en auto's door. Dan rijdt ze over de avondweg naar het huis. Eén botsing en het is voorbij. Komt ze aan, dan volgt de verjaardagsfinale.

## Scherm

Eén venster hoog (`.spel10`, `100dvh`), van boven naar beneden:

1. **Kopbalk** (`ui/kopbalk.js`): terugknop → `#/deur/10`, label, titel. **Geen teller rechts** (besluit 145).
2. **Afstandskaart** (`.kaart.tijdkaart.s10-afstand`): ziekenhuisautootje (`s10-ambu`) + balk (teal, 0 → 100 %) + huisje (`s9-huisje`). Geen tekst. Heeft altijd haar plek, maar is in fase 1 onzichtbaar (`visibility: hidden`).
3. **Scène-kaart** met het canvas (358×640); krimpt mee met de ruimte.
4. **Drie icoon-knoppen** (`.s10-knoppen`, `1fr 1.4fr 1fr`, 72 px hoog): fase 1 pijl links · pijl omhoog (teal) · pijl rechts; fase 2 stuur links · rempedaal (rood) · stuur rechts.

## Scène (posities uit `spel10_build2.py`)

**Fase 1 · stad** (statische laag van 358×1200 + bewegend verkeer, gesorteerd op voetpunt; het canvas toont er 640 px van): bovenaan avondlucht `#2B4A66` met maan en zeven sterren en zeven grachtenpanden, daaronder de stoep (y 120–160) met stoeprand en het ziekenhuisautootje, dan 24 rijen van 40 px en onderaan de startstoep (y 1120–1200) met stoeprand. Van onder naar boven (`RIJ_SOORT`): startstoep · berm · klinkerpad · berm · weiland · berm · weiland · berm · weg (2 rijen) · berm · weiland · berm · klinkerpad · berm · weiland (2 rijen) · berm · weg (2 rijen) · berm · klinkerpad · berm · weiland · berm · stoep. Vier brandende lantaarns (`s10-gloed` + `s9-lantaarn`) op de twee stoepen. Pino = `pino-loop` + `s9-stetho` + `s10-tas`. Schaap = `d-lam`, grazend `s10-lam-graas` (kop omlaag). Oude gans = `s10-gans` (wit, borst vooruit, 50×42), boos `s10-gans-boos` (hals gestrekt, snavel open, vleugel omhoog); jonkie = `d-gansje` op 30×25. De auto's (`s10-auto`) staan zo dat hun wielas midden op de rijstrook ligt (besluit 158): de carrosserie steekt 13 px boven de strook uit.

**Fase 2 · weg van boven** (elk frame getekend; berm en middenstreep schuiven mee met de afgelegde afstand): berm `#4E9A3E`, weg x 60–298 met witte randen en gele middenstreep, paaltjes om de 110 px, vijf bomen en twee lantaarns per 640 px. Pino's auto (`s10-ambu-top`, 52×88) staat vast op y 366. **De weg eindigt bij het huis** (besluit 161): het huis (`s9-huisje` 96×120, verlicht raam met `s9-moeder` erachter) staat midden boven de weg, bovenaan het beeld (y 2–122), met het einde van de weg (witte dwarslijn) op y 124. De laatste 216 px schuift de weg niet meer en rijdt de auto zelf omhoog, naar het midden van de weg, tot y 150.

## Regels

Alle getallen staan als constanten in `bevalling.js`.

### Fase 1 · te voet

| Wat | Waarde |
|---|---|
| Rijen | 26 rijen van elk 40 px (`RIJ_H`, besluit 155 en 157) = 25 stappen; elke stap omhoog is even groot. Voetpunt y = 1154 − 40 × rij |
| Camera | Pino staat 450 px onder de bovenrand van het beeld (`PINO_IN_BEELD`); het beeld volgt vloeiend (`CAMERA_TEMPO` 7 per s) en stopt aan de onder- en bovenkant van de stad. De eerste drie stappen en de laatste zeven schuift het beeld niet |
| Kolommen | 9, om de 36 px (x 35–323); start in kolom 5 (x 179) |
| Stap | 0,12 s (`STAP_DUUR`), met een sprongetje van 5 px |
| Ganzen | drie klinkerpaden, 22 px/s. Ze lopen in groepjes (besluit 159): een **oude gans** voorop met de **jonkies** in een rij erachter (38 px achter de gans, 26 px onderling). Onderste pad: één gans met vier jonkies; middelste: twee groepjes van een gans met twee jonkies; bovenste: een gans met drie en een gans met één |
| Schapen | twee per weiland, zes weilanden, 30 px/s, om en om naar links en naar rechts. Ze lopen 2,5–5 s met een vlot huppeltje en grazen dan 1,5–3 s op hun plek (kop omlaag, happend), elk in zijn eigen tempo. Een schaap wacht als het schaap voor hem binnen 70 px is (besluit 156) |
| Auto's | twee wegen van twee rijstroken, twee auto's per strook. Eerste weg: 160 px/s naar links en 130 px/s naar rechts; tweede weg: 180 en 150 px/s |

- Eén tik = één stap: omhoog een rij, links/rechts een kolom. Terug kan niet. Tijdens een stap wordt één volgende tik onthouden.
- Verkeer dat aan de ene kant verdwijnt, komt aan de andere kant terug (omloop 430 px). Bermen en stoepen zijn veilig.
- **Boze gans** (besluit 159): een oude gans die Pino vóór zich ziet (zij staat op zijn pad of in de rij ernaast, binnen 130 px in zijn kijkrichting, en hij is zelf in beeld) wordt boos en rent met 95 px/s op haar af. Hij blijft op zijn pad en stopt recht voor haar. De jonkies rennen erachteraan (tot 120 px/s). Is Pino meer dan één rij of meer dan 220 px weg, dan loopt hij na 0,7 s weer door in zijn eigen richting. Achter een gans langs lopen ziet hij niet.
- **Botsing** (besluit 144): Pino's voeten (±10 px) overlappen een dier of auto op dezelfde rij; een jonkie telt ook. De rij telt vanaf het begin van de stap.
- **Instappen**: op de bovenste stoep (rij 25) binnen 45 px van het midden van het autootje (kolom 4–6). Pino vervaagt (0,4 s), het beeld gaat dicht en weer open (2 × 0,25 s) en fase 2 begint. Geen tussenscherm (besluit 148).

### Fase 2 · in de auto

| Wat | Waarde |
|---|---|
| Rijsnelheid | 260 px/s; met de rem in 90 px/s; optrekken en remmen met 500 px/s² |
| Afstand | 7800 px = 30 s op volle snelheid (`DUUR`, besluit 146 en 160) |
| Stroken | midden x 124 (links, tegenliggers) en x 240 (rechts); start rechts |
| Baanwissel | per tik, 0,15 s (besluit 150) |
| Tegenligger | 150 px/s tegemoet (op het scherm 410 px/s omlaag) |
| Slome auto | 100 px/s (komt met 160 px/s dichterbij; met de rem in blijft hij voor Pino) |
| Politie | 400 px/s van achter, **altijd op de rechterstrook** (besluit 162); eenmaal voorbij trekt hij weg |
| Ganzen | drie op een rij, 26 px/s naar de dichtstbijzijnde berm |

- **Situaties** komen een voor een: de volgende pas als de weg leeg is, na 0,5 s. Volgorde: eerst een tegenligger, dan inhalen, daarna willekeurig (nooit twee keer dezelfde).
  - *tegenligger*: één auto op de linkerstrook.
  - *inhalen*: slome auto rechts en tegelijk een tegenligger links; wachten (of remmen) tot links vrij is en dan inhalen.
  - *politie* (besluit 163): komt van achter op de rechterstrook, en tegelijk komt er een tegenligger aan die 1,4 s later in beeld is. Pino wijkt uit naar links, maar moet daar weg voor de tegenligger terwijl de politie nog naast haar rijdt. Remmen is de uitweg: dan is de politie eerder voorbij en voegt ze achter hem in. Zonder remmen botst ze.
  - *ganzen*: een oude gans met twee jonkies steekt over in Pino's strook; naar de andere strook.
- **Te lang remmen**: staat de rem 2,5 s aaneen in, dan komt er politie van achter op de rechterstrook (zonder tegenligger). Zo is het spel niet remmend uit te rijden.
- **Botsing** met een auto of gans → voorbij (besluit 144).
- **Afstandsbalk** = afgelegd / 7800.
- **Aankomst** (besluit 152 en 161): vanaf 1100 px voor het huis komt er niets nieuws meer; vanaf 520 px gaat de besturing uit, gaat de auto rechts rijden en verdwijnt wat er nog op de weg is. Het einde van de weg en het huis schuiven van boven het beeld in; de laatste 216 px rijdt de auto zelf omhoog en rolt hij uit tot vlak voor het huis. Daar 1,8 s sterretjes en hartjes, dan de finale.

## Besturing

- Touch: de drie knoppen, op `pointerdown`. De rem werkt zolang de knop ingedrukt is.
- Toetsenbord: pijltjes of WASD (links, rechts, omhoog); in fase 2 pijl omlaag, S of spatie = rem. Ingedrukt houden herhaalt een stap niet. Escape = terug naar het deurtje.
- Geen joystick: de knoppen staan altijd in beeld.

## Staat

- In: niets (geen koppeling met eerdere spellen, besluit 149).
- Uit bij aankomst: `rondSpelAf(10, { vaardigheid: null })` en alle behoeften op 100. Bij een botsing wordt niets geschreven; het deurtje blijft ongespeeld.

## Resultaatscherm

- **Botsing**: `toonResultaat` met label "BEREIK DE BEVALLING", titel "Oeps…", tafereel met verdrietige Pino (`pino-sip` + `s9-stetho`) en een gansje, geen tegels, geen beloning, geen confetti. "Nog een keer" begint altijd weer te voet (besluit 151).
- **Aangekomen**: geen resultaatscherm, direct de finale.

## Finale (DOM, mag tekst)

Volgens `Spel10-Finale.png`: roze achtergrond (`body.s10-feest`), confetti, slinger, drie zwevende ballonnen, kaart met taart-bol, "3 DECEMBER · DEURTJE 10 VAN 10", "Hartelijk gefeliciteerd, Pino!", Pino met de baby (`p-basis` + `s9-bundel` + `s9-armen-om` + `s9-handen-om`) tussen een lam en twee gansjes, acht groene behoeftebalken (`BEHOEFTE_LABELS`), het briefje (`info.briefje`, anders de placeholder) en de knop "Terug naar de kalender".

## Geen uitleg

Geen weeën-teller, geen tekst bij de afstandsbalk, geen labels op de knoppen, geen aanwijzing wat de rem doet of dat lang remmen politie oplevert. De `aria-label`s beschrijven de knoppen wel, maar zijn niet zichtbaar.

## Toegankelijkheid

Canvas met `role="img"` en een `aria-label` per fase; de afstandskaart is een `progressbar` met `aria-valuenow`; echte `<button>`s met `aria-label`. `prefers-reduced-motion`: geen sprongetje, geen wippende dieren, geen trillende auto, geen zwevende ballonnen.

## Acceptatiecriteria

- [x] Fase 1 ziet eruit als `Spel10.png` (zonder weeën-teller); geen tekst of teller in het spelscherm.
- [x] Een tik op een knop, een pijltjestoets en WASD zetten elk precies één stap; een ingedrukt gehouden toets herhaalt niet.
- [x] Botsing met een gans geeft na 0,8 s het scherm "Oeps…" met "Nog een keer"; die begint weer te voet.
- [x] Op de bovenste stoep bij het autootje gaat het spel zonder tussenscherm door in de auto; de knoppen wisselen en de afstandsbalk verschijnt.
- [x] Fase 2: een automatische testspeler (wisselt van strook bij gevaar, remt als beide stroken bezet zijn) haalt zes ritten op rij, in 32,7–33,7 s, met 7–9 situaties per rit. De politie rijdt altijd rechts; per politie remt de testspeler 0,7 s.
- [x] Dezelfde testspeler zonder rem botst in elke rit waarin de politie komt (vier van de vijf ritten; in de vijfde kwam geen politie).
- [x] Niets doen in fase 2 eindigt in een botsing.
- [x] Aankomst: de weg eindigt bovenaan het beeld bij het huis met de vrouw achter het raam; de auto rijdt het laatste stukje zelf omhoog en staat midden voor het huis stil, de balk is vol, daarna volgt de finale.
- [x] Finale komt overeen met `Spel10-Finale.png`; deurtje 10 is daarna gespeeld en alle behoeften staan op 100; terug op de kalender is de achtergrond weer blauw.
- [x] 25 stappen omhoog van de startstoep naar de stoep met het autootje; elke stap is 40 px.
- [x] Het beeld schuift mee: vanaf de vierde stap blijft Pino op 449–450 px in beeld, de laatste zeven stappen staat het beeld stil met de panden en het autootje in zicht.
- [x] De banden van de auto's rijden midden op hun rijstrook.
- [x] Ganzen lopen in groepjes: een witte oude gans voorop, kleinere jonkies erachter; in 60 s blijft elk jonkie binnen 38 px van zijn voorganger.
- [x] Staat Pino in de berm vóór een oude gans, dan wordt hij meteen boos (andere sprite), staat hij na 1 s recht voor haar en is hij 0,7 s nadat ze weg is weer kalm. Achter de gans langs wordt hij niet boos.
- [x] Schapen grazen om beurten met de kop omlaag en komen elkaar niet dichter dan 70 px (30 s gevolgd: kleinste afstand 107 px).
- [x] Console zonder fouten.
- [ ] Gespeeld op een echte telefoon: snelheden en moeilijkheid beoordeeld (Benjamin).
- [ ] De ganzen in fase 2 (oude gans met twee jonkies) in beeld gezien.
- [ ] Botsing met een schaap en met een auto in fase 1 met de hand gezien (de regel is dezelfde als voor de gans).
- [ ] Desktop-weergave beoordeeld.

## Test-URL's

- `…/advent/?test=1#/spel/10` — het hele spel
- `…/advent/?test=1&fase=2#/spel/10` — meteen in de auto
- `…/advent/?test=1&fase=finale#/spel/10` — meteen de finale (schrijft geen staat)
- Console in testmodus: `pinoDebug.stap(ms)` zet het spel vooruit, `pinoDebug.actie('omhoog' | 'links' | 'rechts')` zet een stap of wisselt van strook, `pinoDebug.s.onkwetsbaar = true` zet botsingen uit, `pinoDebug.rit.afstand = 7200` springt naar het einde van de rit.

## Open punten

- Vaardigheidspunt voor dag 10 en de tekst van het laatste briefje (Benjamin, zie `besluiten.md`).
- Afstelling na het spelen op een telefoon: snelheden en het aantal situaties in 30 s. De werking van de rem, de politie, de boze gans, de schapen en de stad van 25 stappen zijn bevestigd (besluiten 153, 156, 157, 159 en 163; Benjamin, 14 november 2026).
- De bevallende vrouw is een figuurtje achter het raam van het huisje aan het einde van de weg (bestaande sprites, nu groter). Een eigen sprite voor de aankomst kan via `spel10_sprites.py`.
