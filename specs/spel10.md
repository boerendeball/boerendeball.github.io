# Spel 10 · Bereik de bevalling + finale

**Status:** gebouwd, te beoordelen · Dag 10 · 3 december · vaardigheid nog te kiezen · rendering: canvas (fase 1 en 2), DOM (finale)
Previews: `Spel10.png`, `Spel10-Auto.png`, `Spel10-Finale.png`, `Spel10-Sprites.png` · Artboards: `Spel10*.dc.html` · Generator: `spel10_build2.py`, `spel10_sprites.py`
Code: `advent/js/spellen/spel10.js` (canvas, DOM, resultaat, finale) en `advent/js/spellen/bevalling.js` (regels en afstelwaarden zonder DOM)
Sprites nieuw: `s10-maan s10-ster s10-gloed s10-pand s10-auto s10-ambu s10-stoep s10-stoeprand s10-auto-top s10-ambu-top s10-politie-top s10-paaltje s10-tas s10-taart s10-ballon s10-slinger`

De previews zijn van vóór de besluiten 144–152 (12 november 2026). Waar ze afwijken, is deze spec leidend: **geen weeën-teller** in de kopbalk, wel een **afstandsbalk** boven de scène in fase 2.

## Doel en gevoel

Pino is verloskundige en moet op tijd bij een bevallende vrouw zijn. Eerst steekt ze te voet de avondstad over naar het witte ziekenhuisautootje, stap voor stap tussen ganzen, schapen en auto's door. Dan rijdt ze over de avondweg naar het huis. Eén botsing en het is voorbij. Komt ze aan, dan volgt de verjaardagsfinale.

## Scherm

Eén venster hoog (`.spel10`, `100dvh`), van boven naar beneden:

1. **Kopbalk** (`ui/kopbalk.js`): terugknop → `#/deur/10`, label, titel. **Geen teller rechts** (besluit 145).
2. **Afstandskaart** (`.kaart.tijdkaart.s10-afstand`): ziekenhuisautootje (`s10-ambu`) + balk (teal, 0 → 100 %) + huisje (`s9-huisje`). Geen tekst. Heeft altijd haar plek, maar is in fase 1 onzichtbaar (`visibility: hidden`).
3. **Scène-kaart** met het canvas (358×640); krimpt mee met de ruimte.
4. **Drie icoon-knoppen** (`.s10-knoppen`, `1fr 1.4fr 1fr`, 72 px hoog): fase 1 pijl links · pijl omhoog (teal) · pijl rechts; fase 2 stuur links · rempedaal (rood) · stuur rechts.

## Scène (posities uit `spel10_build2.py`)

**Fase 1 · stad** (statische laag + bewegend verkeer, gesorteerd op voetpunt): avondlucht `#2B4A66` met maan en zeven sterren, zeven grachtenpanden (y 36/42), stoep y 126–178 met stoeprand en het ziekenhuisautootje op (150, 136), weg y 206–286 met twee rijstroken, weilanden y 316–356 en 386–426, klinkerpad y 456–496, startstoep vanaf y 526, vier brandende lantaarns (`s10-gloed` + `s9-lantaarn`). Pino = `pino-loop` + `s9-stetho` + `s10-tas`.

**Fase 2 · weg van boven** (elk frame getekend; berm en middenstreep schuiven mee met de afgelegde afstand): berm `#4E9A3E`, weg x 60–298 met witte randen en gele middenstreep, paaltjes om de 110 px, vijf bomen en twee lantaarns per 640 px. Pino's auto (`s10-ambu-top`, 52×88) staat vast op y 366. Het huis (`s9-huisje` 60×75, verlicht raam met `s9-moeder` erachter) staat in de rechterberm.

## Regels

Alle getallen staan als constanten in `bevalling.js`.

### Fase 1 · te voet

| Wat | Waarde |
|---|---|
| Rijen (voetpunt y) | 616 startstoep · 520 berm · 490 klinkerpad · 450 berm · 420 weiland · 380 berm · 350 weiland · 310 berm · 280 rijstrook · 240 rijstrook · 200 berm · 170 stoep |
| Kolommen | 9, om de 36 px (x 35–323); start in kolom 5 (x 179) |
| Stap | 0,12 s (`STAP_DUUR`), met een sprongetje van 5 px |
| Ganzen | vijf op een rij op het klinkerpad, 22 px/s naar rechts |
| Schapen | twee per weiland, 16 px/s (onderste weiland naar links, bovenste naar rechts) |
| Auto's | twee per rijstrook: onderste strook 160 px/s naar links, bovenste 130 px/s naar rechts |

- Eén tik = één stap: omhoog een rij, links/rechts een kolom. Terug kan niet. Tijdens een stap wordt één volgende tik onthouden.
- Verkeer dat aan de ene kant verdwijnt, komt aan de andere kant terug (omloop 430 px). Bermen en stoepen zijn veilig.
- **Botsing** (besluit 144): Pino's voeten (±10 px) overlappen een dier of auto op dezelfde rij. De rij telt vanaf het begin van de stap.
- **Instappen**: op de bovenste stoep binnen 45 px van het midden van het autootje (kolom 4–6). Pino vervaagt (0,4 s), het beeld gaat dicht en weer open (2 × 0,25 s) en fase 2 begint. Geen tussenscherm (besluit 148).

### Fase 2 · in de auto

| Wat | Waarde |
|---|---|
| Rijsnelheid | 260 px/s; met de rem in 90 px/s; optrekken en remmen met 500 px/s² |
| Afstand | 5200 px = 20 s op volle snelheid (`DUUR`, besluit 146) |
| Stroken | midden x 124 (links, tegenliggers) en x 240 (rechts); start rechts |
| Baanwissel | per tik, 0,15 s (besluit 150) |
| Tegenligger | 150 px/s tegemoet (op het scherm 410 px/s omlaag) |
| Slome auto | 100 px/s (komt met 160 px/s dichterbij; met de rem in blijft hij voor Pino) |
| Politie | 400 px/s van achter; eenmaal voorbij trekt hij weg |
| Ganzen | drie op een rij, 26 px/s naar de dichtstbijzijnde berm |

- **Situaties** komen een voor een: de volgende pas als de weg leeg is, na 0,5 s. Volgorde: eerst een tegenligger, dan inhalen, daarna willekeurig (nooit twee keer dezelfde).
  - *tegenligger*: één auto op de linkerstrook.
  - *inhalen*: slome auto rechts en tegelijk een tegenligger links; wachten (of remmen) tot links vrij is en dan inhalen.
  - *politie*: komt van achter in Pino's strook; opzij gaan.
  - *ganzen*: steken over in Pino's strook; naar de andere strook.
- **Te lang remmen**: staat de rem 2,5 s aaneen in, dan komt er politie van achter in Pino's strook. Zo is het spel niet remmend uit te rijden.
- **Botsing** met een auto of gans → voorbij (besluit 144).
- **Afstandsbalk** = afgelegd / 5200.
- **Aankomst** (besluit 152): vanaf 1100 px voor het huis komt er niets nieuws meer; vanaf 360 px gaat de besturing uit, gaat de auto rechts rijden, verdwijnt wat er nog op de weg is en rolt de auto uit tot precies naast het huis. Daar 1,8 s sterretjes en hartjes, dan de finale.

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
- [x] Fase 2: een automatische testspeler (wisselt van strook bij gevaar, remt als beide stroken bezet zijn) haalt zes ritten op rij, in 21,7–22,2 s, en ziet alle vier de situaties.
- [x] Niets doen in fase 2 eindigt in een botsing.
- [x] Aankomst: de auto staat rechts stil naast het huis met de vrouw achter het raam, de balk is vol, daarna volgt de finale.
- [x] Finale komt overeen met `Spel10-Finale.png`; deurtje 10 is daarna gespeeld en alle behoeften staan op 100; terug op de kalender is de achtergrond weer blauw.
- [x] Console zonder fouten.
- [ ] Gespeeld op een echte telefoon: snelheden en moeilijkheid beoordeeld (Benjamin).
- [ ] Botsing met een schaap en met een auto in fase 1 met de hand gezien (de regel is dezelfde als voor de gans).
- [ ] Desktop-weergave beoordeeld.

## Test-URL's

- `…/advent/?test=1#/spel/10` — het hele spel
- `…/advent/?test=1&fase=2#/spel/10` — meteen in de auto
- `…/advent/?test=1&fase=finale#/spel/10` — meteen de finale (schrijft geen staat)
- Console in testmodus: `pinoDebug.stap(ms)` zet het spel vooruit, `pinoDebug.actie('omhoog' | 'links' | 'rechts')` zet een stap of wisselt van strook, `pinoDebug.s.onkwetsbaar = true` zet botsingen uit, `pinoDebug.rit.afstand = 5000` springt naar het einde van de rit.

## Open punten

- Vaardigheidspunt voor dag 10 en de tekst van het laatste briefje (Benjamin, zie `besluiten.md`).
- Afstelling na het spelen op een telefoon: snelheden, het aantal situaties in 20 s, de werking van de rem en de politie bij lang remmen (besluit 153, keuze van Claude).
- De bevallende vrouw is nu een klein figuurtje achter het raam van het huisje (bestaande sprites). Een eigen sprite voor de aankomst kan via `spel10_sprites.py`.
