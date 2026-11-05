# Beslislog en open vragen

Keuzes die niet (eenduidig) in het ontwerp staan. **Te bevestigen** = door mij gekozen, Benjamin mag het terugdraaien. Datum = wanneer gekozen.

| # | Datum | Onderwerp | Keuze | Status |
|---|---|---|---|---|
| 1 | 2026-11-02 | Stack | Vanilla ES-modules, geen framework/bundler/packages; actiespellen op canvas | besloten (Benjamin) |
| 2 | 2026-11-02 | URL | Kalender onder `/advent/` met hash-routes | besloten (Benjamin) |
| 3 | 2026-11-02 | Onderbalk Main (Kalender/Stickers/Over) | Weggelaten: stickerboek is geschrapt, twee tabs zijn geen tabbalk | te bevestigen |
| 4 | 2026-11-02 | "Gluren…" | Opent het Open-scherm (spelinfo + briefje); "Open deurtje" start direct het laadscherm; op een dicht deurtje leiden alle opties naar de gans | te bevestigen |
| 5 | 2026-11-02 | Vaardigheidslabels | Artboard-labels Techniek en Conditie (documenten zeggen Mechanica en Lichaam); sleutels `mechanica`/`lichaam` | te bevestigen |
| 6 | 2026-11-02 | Open-scherm teksten | Korte, niet-verklappende omschrijving + chips (soort, duur) per dag in `kalender.json`; dag 4 letterlijk uit het ontwerp | te bevestigen / aan te passen |
| 7 | 2026-11-02 | Beginwaarden behoeften | Uit de Main-preview: verjaardag 0, gansjes/lammetjes/snoepjes 100, jiujitsu 45, bordspellen 20, reizen 10, sieraden 15 | te bevestigen |
| 8 | 2026-11-02 | Telefoon | Eén keer per dag, zowel bij "Later" als "Opnemen" | te bevestigen |
| 9 | 2026-11-02 | Vaardigheid bij herspelen | Alleen de eerste afronding van een dag geeft +1 vaardigheid en +10 % verjaardag; herspelen telt alleen voor score/keten | te bevestigen |
| 10 | 2026-11-02 | Spel 1: tegels bij herspelen | Elke gelukte onderbreking geeft een tegel, ook bij herspelen (helpt in spel 2; geen straf voor oefenen) | te bevestigen |
| 11 | 2026-11-02 | Spel 1: speelduur | 60 s (artboard rekent met 90 s voor de balk) | te bevestigen |
| 12 | 2026-11-02 | Spel 1: sterren | ~~3: ≥ 10 onderbroken en ≤ 2 gemist · 2: ≥ 6 onderbroken · 1: anders~~ | vervallen (zie 16) |
| 13 | 2026-11-02 | Spel 1: tijdlabel | Klok-icoon in plaats van het woord "TIJD" (regel "geen labels bij tellers") | besloten (CLAUDE.md) |
| 14 | 2026-11-03 | Spel 1: gaap-ring | Geen aflopend ringetje of balk met de resterende gaaptijd boven het bed; alleen het gapende gezicht | besloten (Benjamin) |
| 15 | 2026-11-03 | Resultaatschermen: geen highscore | Geen enkel spel houdt een highscore bij; `staat.scores[dag]` bevat alleen de laatste uitslag. Spel 1 toont alleen de tegel ONDERBROKEN (geen GEMIST, geen HIGHSCORE) | besloten (Benjamin) |
| 16 | 2026-11-03 | Resultaatschermen: geen sterren | Geen enkel spel toont sterren als score; `toonResultaat` kent geen `sterren` meer. De slotzin mag wel variëren met de uitslag (spel 1: grens bij 6 onderbroken) | besloten (Benjamin) |
| 17 | 2026-11-03 | Spel 1: bereik-indicatie | Een gapend kind dat Pino kan onderbreken licht subtiel op (witte tint 22 % over alleen het kind: hoofd, haar, gezicht; bed en deken niet; als een hover op een UI-element). Geen tekst, geen pijl, geen ring | besloten (Benjamin) |
| 18 | 2026-11-03 | Spel 1: dekenflits | Bij een geslaagde onderbreking wordt de deken van dat bed kort donkerder (30 %) en loopt in 0,4 s terug naar de eigen kleur | besloten (Benjamin) |
| 19 | 2026-11-03 | Spel 1: geen kroontjes | Er worden geen kroontjes verzameld; de kroon-score-pil uit het artboard vervalt. Wat wél wordt verzameld zijn de negen **tokens** voor spel 2 (blauw/geel/groen × vlinder/boom/vogel, één per onderbroken kind, naar de deken van dat bed). Ze zijn nergens in de interface te zien en leven alleen in `staat.tegels` (de code noemt ze tegels) | besloten (Benjamin) |
| 20 | 2026-11-03 | Spel 1: geen +1-ballon | De groene +1-ballon boven het bed na een onderbreking vervalt; feedback is alleen het verraste gezicht en de dekenflits | besloten (Benjamin) |
| 23 | 2026-11-04 | Virtuele joystick (touch/muis) | Vasthouden op het spelscherm; na **250 ms** (eerst 2 s, op 4 november verkort) verschijnt op de drukplek een ring (120 px) met een knop (52 px). De knop volgt de vinger/cursor binnen de ring (max 34 px) en geeft richting én kracht (0–1); loslaten laat hem verdwijnen. Herbruikbaar: `ui/joystick.js`, via `maakInvoer({ joystick: { element, vertraging, tik } })`; de vertraging is een constante per spel (`JOYSTICK_VERTRAGING`) | besloten (Benjamin) |
| 24 | 2026-11-04 | Spel 1: tik = onderbreken | Een korte tik op het scherm (< 250 ms, < 10 px beweging, dus vóórdat de joystick verschijnt) doet hetzelfde als spatie/Enter: Pino steekt haar vinger uit. Zonder dit zou spel 1 op een telefoon niet af te maken zijn | te bevestigen (eigen toevoeging) |
| 22 | 2026-11-04 | Spel 1: geen besturingspaneel | De D-pad en de grote rode actieknop onder de scène zijn verwijderd; Benjamin wil daar nieuwe functionaliteit (nog te bepalen). Tot die tijd werkt spel 1 alleen met toetsenbord (pijltjes/WASD, spatie/Enter). De CSS-klassen `.besturing`, `.dpad` en `.knop-actie` blijven in `spel.css` voor andere spellen | besloten (Benjamin) |
| 21 | 2026-11-03 | Spel 1: losse armen en zijkant | Pino's armen zijn losse sprites (`pino-romp`, `pino-arm-links`, `pino-arm-rechts`, `pino-arm-vinger`). Bij het onderbreken wijst de arm aan de kant van het kind, om de schouder gedraaid naar de mond, en wordt over bed en kind heen getekend. Daarom mag Pino alleen onderbreken als ze links of rechts naast het bed staat, niet erboven of eronder | besloten (Benjamin) |
| 25 | 2026-11-05 | Spel 2: werker | Het artboard en de generator zijn leidend: de werker staat op vak (3,10) en is pas zichtbaar als daar een tegel ligt (niet "linksboven in de tuin") | besloten (Benjamin) |
| 26 | 2026-11-05 | Spel 2: scène | Een verbeterde scène in plaats van het kale raster in een kader: het hexraster is het gazon van een tropische tuin. Randvakken worden decor (vijver met sala en kraanvogels, bananenperk, bamboe, palm, bloemenperk), met bomen en het paviljoen van de koningin achter de poort. Allemaal bestaande sprites (spel 2, 4, 8). Het raster schuift 36 px omlaag (`oy` 76). De spec is hier leidend boven de previews | besloten (Benjamin; decorvakken "goed voor nu") |
| 27 | 2026-11-05 | Spel 2: waar leggen | Alleen op een grasvak naast de starttegel of een gelegde tegel; niet vanaf de poort terugbouwen | besloten (Benjamin) |
| 28 | 2026-11-05 | Spel 2: schaarste | Na één keer spel 1 zijn er bewust te weinig tegels om de poort te halen; de tuin blijft bewaard (`staat.tuin`) tot het pad af is, en na afronden begint de volgende keer een lege tuin | besloten (Benjamin) |
| 29 | 2026-11-05 | Spel 2: fontein | Vervalt (had geen functie); het symbool `hx-fontein` blijft in de sprite-set | besloten (Benjamin) |
| 30 | 2026-11-05 | Spel 2: matchregel | Twee tegels passen als ze precies één eigenschap delen (kleur óf figuur). Het menu toont alleen tegels die bij álle aangrenzende tegels passen (max. 4), met een aantal; met voorraad 0 grijs en niet te kiezen. Een verkeerde tegel leggen kan dus niet | besloten (Benjamin) |
| 31 | 2026-11-05 | Spel 2: resultaat | Geen sterren en geen BESTE. Alleen de tegel TEGELS (ZETTEN vervalt; EDELSTENEN vervalt door besluit 35). Nieuwe slotzin: "De koningin wandelt met droge voeten naar de poort. Zelfs de kraanvogels maken een buiging." | besloten (Benjamin) |
| 32 | 2026-11-05 | Spel 2: open vakken en Pino | Vakken waar een tegel kan, lichten subtiel op (wit 22 % + stippelrand); het vraagteken-vak verschijnt pas in het menu. Pino blijft op de start en loopt aan het eind over het kortste pad naar de poort | besloten (Benjamin) |
| 33 | 2026-11-05 | Spel 2: edelsteenvak | Een omringd vak geeft één keer een edelsteen (fonkel tot je hem oogst; wegtikken laat hem staan). Daarna blijft het gras en mag er later nog een tegel op als er een past. Rand- en decorvakken tellen niet als bezette buur | besloten (Benjamin) |
| 34 | 2026-11-05 | Spel 2: groepen | Aangrenzende tegels met dezelfde kleur, of met hetzelfde figuur, vormen een groep; in een groep mag elk tegeltype maar één keer voorkomen (dus max. 3). Voorbeeld van Benjamin: groen-vogel > blauw-vogel > geel-vogel, daaraan geen groen-vogel. Ook een tegel die twee groepen met hetzelfde type aan elkaar knoopt, mag niet. Aanvulling op besluit 30; het menu toont zulke tegels niet | besloten (Benjamin) |
| 35 | 2026-11-05 | Spel 2: edelstenen onzichtbaar | In spel 2 zie je niet hoeveel edelstenen je hebt of verdiend hebt: geen teller in de kopbalk (het artboard heeft er wel een) en geen tegel EDELSTENEN op het resultaatscherm. Het aantal is pas in spel 3 te zien | besloten (Benjamin) |
| 36 | 2026-11-05 | Spel 2: details | De starttegel is altijd groen-boom (artboard). Op een vak met fonkel kun je pas een tegel leggen nadat je de edelsteen hebt gekozen. De werker maakt bij aantikken twee hupjes, verder geen feedback. Pino loopt aan het eind 0,26 s per vak naar de poort | besloten (Benjamin) |
| 37 | 2026-11-05 | Edelstenen: bron | Edelstenen komen alleen uit spel 2; spel 3 levert geen edelstenen op (het besteedt ze alleen). Het briefje voor dag 2 blijft voorlopig een placeholder | besloten (Benjamin) |

## Open vragen voor Benjamin (uit de ontwerpdocumenten)

- Definitieve speltitels per dag.
- "Briefje voor Pino" per dag (nu placeholder) en het laatste briefje in de finale.
- Vaardigheidspunt voor dag 5 (nu Charisma) en dag 10 (nu geen).
- Edelsteenprijzen in spel 3 (edelstenen komen alleen uit spel 2, besluit 37; een tuin levert er hooguit een paar op); welke familie "rijk" is en hoeveel elke familie in spel 4 betaalt.
- Welke behoefte elk spel vult naast "Verjaardag vieren" (voorstel: 6 → jiujitsu, 8 → bordspellen, 2–8 → reizen, 5 → sieraden, 3/9 → lammetjes/gansjes).
