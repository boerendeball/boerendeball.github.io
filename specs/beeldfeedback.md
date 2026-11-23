# Beeldfeedback ("sap") · animatie, deeltjes, schudden en trillen in plaats van geluid

**Status:** goedgekeurd (Benjamin, 23 november 2026) · geldt voor de kalender en alle spellen · besluiten #210 en #211
**Code:** `advent/js/ui/sap.js` (DOM/SVG-effecten), `advent/js/ui/teller.js` (teller die optelt), `advent/js/spellen/effecten.js` (canvas: deeltjes, schok, flits), `advent/js/spellen/lus.js` (`bevries`), `advent/js/spellen/canvas.js` (`begin({ dx, dy })`), `advent/css/sap.css`
**Sprites (#211):** `bub-wolk`, `bub-boos`, `bub-uitroep`, `s10-taart-kaal`, `s10-vlam`, `s10-rook`, `s9-wieken` (via `design/generators`); verder bestaande sprites (`s10-ster`, `s9-hart`, `s9-stof`, `s4-flits`, `s8-lamp-aan`)

## Doel en gevoel

De app heeft geen geluid (#210). Wat geluid in een spel doet, komt uit het beeld:

- **Sfeer**: elke scène leeft een beetje, met dingen die ademen, wiegen, dobberen en twinkelen.
- **Raak**: een treffer voelt als een klap. Het beeld staat even stil, er komen deeltjes, de teller pulseert en op Android trilt de telefoon kort.
- **Spanning**: de tijd pulseert in de laatste seconden en een botsing laat het beeld schudden.
- **Feest**: het resultaatscherm en de finale bouwen stap voor stap op, met vallende confetti.

## Regels

1. **Geen tekst** in spelschermen (`CLAUDE.md`). Een "+1" is spelstand en mag.
2. **Niets verklappen**: een effect volgt alleen wat Pino al ziet of doet. Daarom:
   - geen glinster bij de werker zolang spel 7 dicht is;
   - geen beloningseffect bij het lapje in spel 1 (#200);
   - geen teken op het juiste fotomoment in spel 4;
   - in spel 5 geen boos wolkje voordat een handelaar zichtbaar boos is;
   - in spel 8 hetzelfde lampje, wat het dier ook van plan is.
3. **Reduced motion** (`sap.rustig()`):
   - geen schudden, flitsen of hit-stop;
   - wachtanimaties staan stil;
   - pop, wip en vliegen worden een korte fade of vallen weg;
   - confetti blijft liggen.

   De globale regel in `basis.css` zet *oneindige* animaties op 0,01 ms; `sap.css` zet de wachtklassen daarom expliciet op `animation: none`.
4. **Poppenhuisstijl**: platte vlakken, geen gradients of filters op bewegende delen, alleen bestaande of nieuwe sprites uit de generators.
5. **Trillen** alleen via `sap.tril(ms)`: hooguit 80 ms, nooit herhaald, stil als `navigator.vibrate` ontbreekt (iPhone).
6. Alle effecten zijn **toevoegingen**: als ze wegvallen (oude browser, reduced motion), werkt alles precies zoals zonder.

## Gedeelde bouwstenen

| Functie | Wat |
|---|---|
| `sap.rustig()` | reduced motion aan? |
| `sap.wip(el)` | squash & stretch: even platter, dan iets hoger, terug |
| `sap.pop(el, { vertraging })` | verschijnen met overshoot (curve van `fam-pop`) |
| `sap.schud(el, { sterkte, duur })` | horizontaal schudden |
| `sap.flits(el, { kleur, duur })` | gekleurde laag over een element die opflitst en vervaagt |
| `sap.vlieg({ van, naar, inhoud, duur })` | een icoon vliegt in een boog van A naar B (Promise) |
| `sap.deeltjes(svg, x, y, { soort, aantal })` | sterren, hartjes of stofjes spatten uit een punt (SVG) |
| `sap.bubbel(svg, x, y, soort)` | reactiewolkje boven een personage: `hart`, `boos`, `uitroep`, `lamp` |
| `sap.confetti(houder, { aantal })` | vallende confetti in de paletkleuren |
| `sap.telOp(el, van, naar, { duur })` | getal telt op in een element |
| `sap.tril(ms)` | kort trillen (Android) |
| `sap.leven(svg)` | wachtanimaties voor elk element met `data-sap="wieg 2 3400"` (ook `hang`, `haak` (zwaaien om het eigen nulpunt), `dobber`, `drijf`, `adem`, `gloei`). Let bij zwaaien en wiegen op het draaipunt: het moet op het echte haakje of de echte voet liggen, niet op het midden van de tekening; scriptanimaties die doorlopen als een scène knopen herordent |
| `maakTeller({ icoon, waarde, label })` | `.teller-pil` die bij `zet(n)` optelt en pulseert |
| `maakDeeltjes()` / `maakSchok()` / `maakFlits()` | canvasversies (`spellen/effecten.js`) |
| `lus.bevries(ms)` | hit-stop: de logica staat stil, tekenen gaat door |

## Kalender en gedeelde schermen

| Moment | Effect |
|---|---|
| Tik op een deurtje | `wip` |
| "Open deurtje" | deurtje zwaait open op zijn scharnier (rotateY), dan het laadscherm |
| Taartmenu open/dicht | opties springen gestaffeld uit het midden en krimpen bij sluiten terug (ook in spel 2 en 5) |
| Dialoog / melding | kaart springt in, melding schuift in |
| Telefoon | de hele kaart schudt mee met het rinkelen, eenmaal `tril(60)` |
| Gedachtenwolkje | dobbert zacht |
| Terug van een spel | behoeftebalken lopen van oud naar nieuw, nieuwe vaardigheidsblokjes vullen zich één voor één; het vaardighedenpaneel staat dan open (ook op mobiel), anders is het niet te zien. Alleen na de eerste keer uitspelen (`staat.pakNetVerdiend()`, in het geheugen) |
| Laadscherm | elke nieuwe regel pop't in |
| Resultaatscherm | bol pop't, scoretegels tellen één voor één op, de beloning verschijnt daarna, vallende confetti; bij een mislukking zakt de bol even door |

## Per spel

| Spel | Sfeer | Feedback |
|---|---|---|
| 1 Slaapzaal | dekens ademen, nachtlampje gloeit | onderbreking: hit-stop 70 ms + sterretjes + "+1" die opstijgt + `tril(20)`; stofje bij lopen; tijd laatste 5 s rood en pulserend |
| 2 Tuin | jungleplanten wiegen elk in hun eigen tempo (de fase loopt door als `render()` ze opnieuw bouwt); geen waterrimpel, want er is geen vijver in de scène | tegel: stofwolkje en de tegel veert na; stofje bij elke hup van Pino; ring net vol: extra sterrenregen en het midden veert op; edelsteen in het kuiltje: het midden veert op (sterretjes, vallen en wegvliegen bestonden al) |
| 3 Families | familieleden ademen, elk in hun eigen tempo (ook op de polaroid in het album en in de popup van spel 4) | kopen: het karakter vliegt van het kaartje naar zijn lege plek en springt daar pas tevoorschijn; de edelsteenteller telt af en pulseert; compleet: na de hup een hartje-wolkje boven elk lid, één voor één |
| 4 Foto's | strand: meeuwen dobberen, wolken drijven, golfjes glinsteren, de boot deint, palm en parasol wiegen; berg: meeuwen, wolken, den en struiken wiegen; markt: wolken en de verkoper ademt. Het wiegen was eerst raar: een `<use>` met x/y draaide om een verkeerd punt (de browser rekent fill-box zonder x/y). `sap.js` zet zo'n element nu in een eigen groep (`.sap-omhulsel`), en spel 4 sorteert die groep op diepte. Via `sap.leven()` en `data-sap` in `decor4.js` (scriptanimaties, zodat het sorteren op diepte ze niet onderbreekt) | filmrolteller telt op en pulseert; rood frame schudt zacht; het vakje in de filmstrook pulseert als de foto erin landt; de witte flits bestond al. Bij het juiste fotomoment geen extra teken |
| 5 Nachtmarkt | de lampions aan de slinger zwaaien zacht aan hun haakje (± 4°, `data-sap="haak"`), hun gloed ademt licht; de lampion op de paal staat stil | portemonnee telt op en af en pulseert (ook bij de wisselkraam); een nieuwe stemming springt in beeld; −/+ laat het bod kort opzwellen; akkoord: drie munten vliegen van het bod naar de handelaar, die even opveert; loopt Pino weg bij een boze handelaar, dan staat er even een boos wolkje boven zijn hoofd in de scène; bij het samenzweren (Moeilijk) een boos wolkje boven elk van de drie zodra ze met boze gezichten staan te praten |
| 6 Steeg | de lampions aan de slinger zwaaien zacht aan hun haakje (± 4°, elk in een eigen fase), op canvas; ze staan daarvoor niet meer in de vaste achtergrondlaag | greep: de hele kolom schudt, een rode rand flitst op, `tril(80)`, en boven de drie omstanders die het dichtst bij staan verschijnt een uitroep-wolkje (op canvas, `bub-wolk` + `bub-uitroep`); gelukte move: hit-stop 60 ms + `tril(20)`, geen sterretjes (Benjamin); verkeerde knop: de scène schudt licht; politietijd laatste 5 s rood en pulserend; toetsen 1–4 drukken de knoppen zichtbaar in |
| 7 Album | geen (de polaroids tonen al bewegende scènes van spel 2–5) | een tik op een polaroid laat hem even opveren voordat het spel opent; net gevonden werker (`zoeken.js` onthoudt dat in het geheugen, `pakNetGevonden()`): de vervaagde laag met het vraagteken trekt weg, de stempel valt met een klap op de foto met sterretjes, het vinkje springt op, en de teller en de voortgangsbalk lopen op; was het de vijfde, dan volgt het resultaatscherm pas daarna |
| 8 Jungle | varens en bloemen wiegen om hun voet (`data-sap="wieg"`); bomen, bamboe en lianen staan stil | het lampje springt aan met een gloed die zacht pulseert (bij elk dier hetzelfde); Pino, een dier of een stam die neerkomt: een stofje op het vak; gevangen: het bord schudt en boven Pino verschijnt een uitroep-wolkje (niet in de browser nagespeeld); tempel: sterren en hartjes rond Pino |
| 9 Dorp | de molenwieken draaien rustig rond (`s9-molen-romp` in de vaste laag, `s9-wieken` per beeld om hun as) | vangst: hit-stop 60 ms + `tril(20)` en de bundelteller telt op en pulseert (de sterretjes en hartjes bij de kliniek bestonden al); misser: het beeld schokt, er stuift een stofwolk op waar het bundeltje landt, `tril(60)` |
| 10 Stad + auto | sterren twinkelen (niet meer in de vaste laag), de lantaarns in de stad gloeien zacht na | stofje als Pino na een stap neerkomt; een gans die net boos wordt krijgt een uitroep-wolkje (niet in de browser gezien; de gans werd niet boos in de test); botsing: het beeld schokt, witte flits, `tril(80)` (de bestaande sterretjes en het trillen van de auto blijven); toetsen drukken de knoppen zichtbaar in, de rem zolang hij is ingedrukt |
| Finale | de vlammen flakkeren | de taart is een knop: elke tik blaast het kaarsje het dichtst bij de vinger uit (toetsenbord: het volgende) met een rookpluimpje; een regel tekst eronder zegt wat te doen (de finale mag tekst hebben) en verdwijnt na het laatste kaarsje; dan valt er confetti, stijgen de ballonnen op in beeld en lopen de behoeftebalken een voor een vol. De statische confetti is weg |

## Toegankelijkheid

- Decoratieve effecten zijn `aria-hidden="true"` en `pointer-events: none`; ze nemen nooit de focus over.
- Een teller die optelt, zet zijn `aria-label` meteen op de eindwaarde.
- De kaarsjes in de finale zijn echte `<button>`s met `aria-label="Kaarsje uitblazen"` en zijn met het toetsenbord te bedienen.

## Acceptatiecriteria

- [x] Geen tekst in spelschermen behalve spelstand ("+1"); geen effect verklapt een verborgen mechaniek (regel 2). (nagelopen door Claude, 23 november: alle schermen op 375×812 en 1280 breed, geen fouten, geen restjes na weggaan; touch en toetsenbord door Benjamin beoordeeld)
- [x] Met *reduced motion*: geen schudden, flitsen of hit-stop, wachtanimaties staan stil, niets flikkert. (Benjamin, 23 november)
- [x] Geen fouten in de console; geen verschuiving van de lay-out door effecten; effecten blijven niet hangen na het verlaten van een scherm (opruimfunctie). (nagelopen door Claude, 23 november: alle schermen op 375×812 en 1280 breed, geen fouten, geen restjes na weggaan; touch en toetsenbord door Benjamin beoordeeld)
- [x] Canvasspellen blijven vloeiend op een telefoon; hit-stop is te zien met `window.pinoDebug.stap(ms)`. (Benjamin, 23 november)
- [x] Trillen alleen op Android, kort en eenmalig; op iPhone geen fout. (Benjamin, 23 november)
- [x] Alles werkt met touch en toetsenbord op 390×844 en op desktop. (nagelopen door Claude, 23 november: alle schermen op 375×812 en 1280 breed, geen fouten, geen restjes na weggaan; touch en toetsenbord door Benjamin beoordeeld)

## Test-URL's

- Kalender: `http://localhost:3000/advent/?test=1`
- Spel n: `http://localhost:3000/advent/?test=1#/spel/n` (spel 10-finale: `?test=1&fase=finale#/spel/10`)
- Resultaatscherm: speel een spel uit, of gebruik de dev-knoppen op `#/dev`
- Losse effecten: `#/test`

## Voortgang

| Onderdeel | Status |
|---|---|
| Gedeelde bouwstenen | goedgekeurd (`#/test` toont elk effect los) |
| Kalender en gedeelde schermen | goedgekeurd |
| Spel 1 | goedgekeurd |
| Spel 2 | goedgekeurd |
| Spel 3 | goedgekeurd |
| Spel 4 | goedgekeurd |
| Spel 5 | goedgekeurd |
| Spel 6 | goedgekeurd |
| Spel 7 | goedgekeurd |
| Spel 8 | goedgekeurd |
| Spel 9 | goedgekeurd |
| Spel 10 en finale | goedgekeurd |
| Sprites (#211) | gemaakt (`bub-*`, `s10-taart-kaal`, `s10-vlam`, `s10-rook`, `s9-wieken`, `s9-molen-romp`); de wolkjes gebruiken ze al |
