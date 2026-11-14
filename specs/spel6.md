# Spel 6 · Selfdefense

**Status:** goedgekeurd (Benjamin, 10 november 2026) (`advent/js/spellen/spel6.js`, regels in `spellen/klem.js`; gedeeld: `spellen/lus.js`, `spellen/spritesheet.js`, `spellen/canvas.js`, `invoer.js`, `ui/resultaat.js`, `css/spel.css`; popup zonder ketting in `spellen/index.js`)
**Dag 6 · 29 november · Conditie +3 · Techniek +2 (besluit 164)**
Previews: `design/previews/Spel6.png`, `Spel6-Controle.png`, `Spel6-Klaar.png`, `Spel6-Sprites.png` · Artboards: `design/artboards/Spel6*.dc.html` · Generator: `design/generators/spel6_build2.py`, `spel6_sprites.py`
Rendering: **canvas** (actiespel), sprite sheet gerasterd uit `sprites.svg`.

De previews en artboards zijn van vóór de besluiten 80–95 (9 november 2026). Waar ze afwijken, is deze spec leidend: de dief wil de **ketting** (geen tas, geen geld, geen munt in de kopbalk), fase 2 is een ritmespel met banen en vier getekende jiujitsu-moves, de scène is 530 hoog en de titel is "Osssuu". De move-tekeningen (knop-iconen en scènes) zijn door Benjamin aangeleverd en staan als `s6-knop-*` en `s6-scene-*` in de sprite-set.

## Doel en gevoel

Pino loopt over de nachtmarkt tussen blije bezoekers, met de ketting uit spel 5 om haar hals. Na twee seconden kan ze niet meer bewegen: een dief in een donkere hoodie loopt recht op haar af, naar de plek waar ze op dat moment staat, en grijpt naar de ketting. Reageert ze op tijd, dan ligt hij in een armklem op de kasseien en moet ze hem met de juiste moves op het juiste moment vasthouden tot de politie er is. Kort, spannend en fysiek: eerst schrikken, dan ritme houden.

Verborgen ketens: zonder ketting uit spel 5 valt er niets te stelen (popup). Zonder kniebeschermers uit spel 5 mislukt de derde move (knee on belly) altijd; de ontbrekende kniebeschermers poppen dan kort op in de knop, verder staat er nergens waarom.

## Scherm (390×844, van boven naar beneden)

1. **Kopbalk** (`ui/kopbalk.js`): terugknop → `#/deur/6`; label `DAG 6 · 29 NOVEMBER`; titel `Selfdefense`. **Geen munt rechts** (besluit 84).
2. **Politiekaart** (`.kaart.tijdkaart.s6-politie`): politieauto (`s6-politie`, 34 px) + balk (14 px, vulling teal, loopt van 0 % naar 100 %) + resttijd `0:20` → `0:00` (Fredoka 16, `#0E6A98`). Heeft altijd haar plek, maar is in fase 1 onzichtbaar (`visibility: hidden`) en verdwijnt weer als de dief ontsnapt.
3. **Scène**: canvas 358×530 in een afgeronde kaart (radius 22, achtergrond `#556B8E`).
4. **Strook onder de scène** (150 px hoog, even breed als de scène):
   - fase 1: leeg; vanaf de greep de **rode knop** (132 px rond, `#FF5E5B`, stop-hand `s6-reageer` wit 60 px, witte ring die in 2000 ms leegloopt, pulseert);
   - fase 2: vier ronde, witte **move-knoppen** naast elkaar (83,5 px, schaduw `#CDE4F0`) met de tekening van de move: `s6-knop-sweep`, `s6-knop-side-control`, `s6-knop-knee-on-belly`, `s6-knop-rear-naked-choke` (in die volgorde), elk precies onder zijn baan.
5. **Notencanvas** (`.s6-noten`): een tweede canvas van 358×690 over scène én strook heen, zonder pointer-events. Daarop vallen de noten door tot op de knoppen.

Het geheel is één venster hoog (`100dvh`); scène, tussenruimte en strook vormen samen één kolom van 358×690 die als geheel meeschaalt, zodat banen, knoppen en noten uitgelijnd blijven. Op desktop staat het scherm gecentreerd.

## Scène (358×530)

Lagen van achter naar voor (posities uit `steeg()` in `spel6_build2.py`):

| Laag | Wat | Positie |
|---|---|---|
| kasseien | vlak `#556B8E`, stenen 26×26 rx 4 `#4E6384`, om en om 14 px verschoven | hele scène (statische laag) |
| slinger | lijn `#8B4A1E` 2,5 px met zes lampions (`s5-gloed` + `s5-lampion` rood/geel/oranje) | y 28–44 (statische laag) |
| kramen | Siti (groene luifel, stof) op 8,50 en Minh (gele luifel, lampions) op 220,50; `s5-kraam-achter` → handelaar → `s5-kraam-voor` → waar | elke frame, de handelaars kijken mee |
| menigte | negen bezoekers (`BEZOEKERS` uit `spel6_sprites.py`), elk op een vaste rij en heen en weer tussen twee x-waarden; bezoeker 4 (oranje, bril) staat stil | achter: y 118–196, voor: y 410–446 |
| werker | `wk-lampion` 48×72 × 0,7, voeten op (317,230), half achter bezoeker 4 (besluit 108) | zie Werker |
| Pino | `pino-staan` / `pino-loop` + `s6-ketting`, start op 155,200 en loopt de eerste 2 s vrij binnen x 56–254, y 150–212 (linkerbovenhoek van haar frame); gespiegeld als ze naar links loopt; na een diefstal `pino-sip` zonder ketting | waar ze staat als de dief komt |
| dief | hoodie `#2F3A4A`, huid `#E8B48A`; lopend `b-lijf` + `b-handen` + `b-hoofd` + `z-kap` + `z-gezicht`; grijpend en rennend armloos `b-lijf-los` + `z-arm` + `z-arm-hang`; met buit `z-blij` en `s5-ketting` (16 px) bij zijn hand | komt van rechts (x 372) naar Pino + (46, 2) |
| trillijntjes | `s6-tril` 36×36 bij Pino's hals, trilt licht | alleen tijdens de greep |
| klem | `s6-klem` 140×90 op Pino + (−46, −4) + `s6-klem-ketting`, met kniebeschermers ook `s6-klem-knie`; schudt harder naarmate de balk voller is | fase 2 |
| worstelbalk | 150×12 op Pino + (−51, 98): `#E6EFF5`, vulling `#FF5E5B` met onderrand `#C43B38` | fase 2 |
| politieauto | `s6-politie` 88×88, rijdt in 600 ms de scène in tot naast de klem: rechts als daar ruimte is, anders (gespiegeld) links | alleen als het gelukt is |
| lantaarn | paal 338,412 + oranje lampion 330,380 | rechtsonder |
| banen | vier vlakken wit 14 %, 83,5 breed met 8 ertussen, van y 324 tot de onderrand; **geen raakring** (besluit 93) | fase 2, over de menigte heen |
| noten | witte schijf met rand `#9B6BFF` en de tekening van de move (`s6-knop-*`); valt in 1200 ms van y 346 tot op het midden van zijn knop (y 581,75, onder de scène) en groeit daarbij van 55 % naar de maat van de knop | fase 2, op het notencanvas |
| move-scène | `s6-scene-*` (120×120, hoeken 20 %) op 52 % van de breedte, midden op 36 % van de hoogte (over de klem, boven de banen); fadet in 900 ms in en uit | DOM over de scène, na een gelukte move |

Figuren worden op voet-y gesorteerd. Gezichten van omstanders en handelaars: `b-blij`; vanaf de greep en tijdens een vlucht `b-bang` (ze staan stil en kijken naar het midden); in de klem weer `b-blij`; als de politie er is `b-lach`.

## Regels

Constanten staan bovenaan `spel6.js` (fase 1, animatie) en `klem.js` (fase 2); het zijn tuning-waarden.

| Constante | Waarde | Betekenis |
|---|---|---|
| `START_PAUZE` | 2000 ms | zo lang loopt iedereen blij rond en kan Pino zelf lopen voordat de dief verschijnt |
| `SNELHEID` | 120 px/s | loopsnelheid van Pino (zoals spel 5) |
| `LOOP` | x 56–254, y 150–212 | loopgebied: de klem en de worstelbalk passen overal binnen de scène en boven de banen |
| `DIEF_SNELHEID` / `VLUCHT_SNELHEID` | 130 / 170 px/s | aanlopen (± 1,3 s) en wegrennen |
| `REACTIE` | 2000 ms | tijd om op de rode knop te drukken |
| `DUUR` | 20 000 ms | tot de politie er is |
| `VALTIJD` | 1200 ms | een noot is zo lang onderweg |
| `VENSTER` | ±180 ms | rond het moment dat de noot op de knop ligt, telt een druk als raak |
| `EERSTE` / `SLOT` | 1400 / 400 ms | eerste noot op de knop; geen noten meer in de laatste 400 ms |
| `INTERVAL_START` / `INTERVAL_EIND` | 800 → 550 ms | tijd tussen noten (28 noten in totaal) |
| `GEMIST` / `MISDRUK` / `RAAK` | +20 / +10 / −5 | effect op de worstelbalk |
| `VOL` | 100 | balk vol: de dief is los |
| `KNIE_BAAN` | 2 (de derde) | knee on belly: lukt alleen met kniebeschermers |
| `KNIE_KANS` | 36 % | aandeel knee on belly in het patroon (7 tot 12 van de 28 noten, gemiddeld bijna 10) |
| `LOS_VANAF` | 80 % | zonder kniebeschermers loopt de balk ook met foutloos spel vol, maar pas na 16 s (besluit 99) |
| `MOVE_SCENE` / `KNIE_POP` | 900 / 900 ms | duur van de move-scène en van de opgepopte kniebeschermers |

**Fasen** (`s.fase`): `rust` → `nadert` → `greep` → `klem` → `politie` (gelukt), of vanuit `greep` en `klem` naar `vlucht` (mislukt).

- **rust** (0–2000 ms): Pino kan vrij lopen binnen het loopgebied (looppose wisselt elke 0,18 s, geen botsingen: bezoekers staan op diepte voor of achter haar); bezoekers lopen heen en weer met een wip-loopje en pauzeren kort bij het omkeren.
- **nadert**: de besturing gaat uit (de loop-invoer wordt opgeruimd, ook de joystick) en Pino blijft staan waar ze is. De dief loopt van de rechterrand op haar hoogte recht naar die plek. Dief, trillijntjes, klem, worstelbalk en politieauto staan vanaf nu ten opzichte van Pino.
- **greep**: hij staat naast haar en steekt zijn hand uit naar de ketting; trillijntjes, bange omstanders, de rode knop verschijnt en de ring loopt leeg. Drukken → `reactie` = verstreken ms, door naar de klem. Niets gedaan na 2000 ms → vlucht. Vóór de greep doet drukken niets (de knop is er nog niet).
- **klem**: noten vallen in de vier banen tot op de knoppen. Het moment om te drukken is als de noot op de knop ligt (de tekening in de noot dekt dan de tekening in de knop). Een druk op een baan zoekt de dichtstbijzijnde open noot in die baan binnen het venster: raak (balk −5, de scène van die move fadet kort in en uit) of mis (balk +10). Een noot die het venster voorbij is, is gemist (balk +20). Nooit drie keer achter elkaar dezelfde baan. Balk vol → vlucht. Tijd om en balk niet vol → politie.
- **Zonder kniebeschermers** (besluit 94): een op tijd gedrukte knee on belly mislukt altijd. De noot telt als gemist (balk +20, geen scène, niet bij Moves), de knop krijgt een rode ring en in de knop poppen 900 ms de ontbrekende kniebeschermers op (`s5-kniebeschermers` vervaagd met een rood kruis). Niet drukken is ook gemist. Zo kost elke knee on belly minpunten. Met kniebeschermers is het een gewone move en zijn ze zichtbaar op Pino's knieën.
- **Net niet te halen zonder kniebeschermers** (besluit 99): `maakPatroon` kiest alleen een patroon waarbij foutloos spel zonder kniebeschermers (elke knee on belly +20, elke andere move −5) de balk toch laat vollopen, en pas in de laatste 20 % van de tijd (`zonderKnie`). De dief ontsnapt dan tussen 16,5 en 19,5 s. Met kniebeschermers is hetzelfde patroon gewoon te halen.
- **vlucht**: Pino staat verdrietig zonder ketting; de dief rent blij met de ketting naar rechts de scène uit; 500 ms later het faalscherm.
- **politie**: de politieauto rijdt in, iedereen lacht; na 1500 ms het resultaatscherm.
- **Pauze**: een verborgen tab pauzeert de lus (`lus.js`).

## Besturing

- **Lopen (alleen de eerste 2 s)**: zoals spel 1 en 5. Vasthouden op het scherm → na 250 ms de joystick op de drukplek (analoog); of pijltjes/WASD. Zodra de dief verschijnt, werkt dit niet meer.
- **Touch/muis**: de rode knop en de vier move-knoppen reageren op `pointerdown` (snelheid). De noten liggen op een canvas zonder pointer-events, dus een tik gaat altijd naar de knop eronder.
- **Toetsenbord**: spatie of Enter = rode knop; ← ↓ ↑ → of de cijfertoetsen 1–4 (ook op het numerieke blok) = baan 1 t/m 4 (geen herhaling bij vasthouden; nergens zichtbaar in de UI); Escape = terug.
- Feedback op een move-knop: 180 ms een paarse ring bij raak, een rode bij mis of een gemiste noot.

## Staat

- In: `producten` (ketting = voorwaarde, besluit 81; kniebeschermers = knee on belly lukt, besluit 94). `geld` speelt geen rol.
- Uit, bij succes: `rondSpelAf(6, { score: { reactie, raak, totaal } })`: de beloning van dag 6 (`kalender.json`) brengt de behoefte "jiujitsu" op 100 % (besluit 100 en 164).
- Uit, bij falen: niets. De ketting blijft in `producten` (besluit 82); het deurtje wordt niet `gespeeld`.
- Werker: `werkerGevonden(6, { zoek })` (`spellen/zoeken.js`).

## Zonder ketting

`spellen/index.js` controleert vóór het laden of `producten` de ketting bevat. Zo niet: dialoog met een kleine scène (Pino alleen in de steeg onder de lampions), titel "Een rustige avond", tekst "Pino draagt nog niets moois om haar hals. In de steeg kijkt niemand naar haar om." en de knop "Terug naar de kalender". Sluiten gaat ook terug naar de kalender.

## Resultaatscherm (via `ui/resultaat.js`)

- **Gelukt**: bol met de gi · label `SELFDEFENSE · KLAAR` · titel **Osssuu** · tafereel op een lichtblauw vlak: Pino in witte gi met blauwe band (`pino-gi`), de dief boos ernaast, de politieauto naast hem · tegels **REACTIE** (bv. `0,4s`, groen) en **MOVES** (raak/totaal, teal) · beloning "Conditie +1 · Behoefte "Verjaardag" +10%" (bij herspelen "al verdiend") · knoppen Terug naar de kalender / Nog een keer.
- **Mislukt**: bol met de ketting · label `SELFDEFENSE` · titel **Gestolen!** · tafereel: Pino in haar gewone jurk met verdrietig gezicht (`pino-sip`), de dief blij ernaast (`z-blij`) met de ketting in zijn hand · tegels REACTIE en MOVES voor zover die fase bereikt is (te laat gedrukt: geen tegels) · geen beloning, geen confetti · dezelfde twee knoppen.

## Werker (spel 7)

De werker staat op 309,208, half achter bezoeker 4, die daarom niet loopt. Als deurtje 7 open is, ligt er een onzichtbare knop over hem heen (`.s6-knop-werker`); tikken markeert hem gevonden en laat hem twee keer opspringen. Hij is tijdens het hele spel aanklikbaar. Vanuit het album van spel 7 opent `#/spel/6?zoek=1` een rustige modus: de dief komt niet, Pino loopt vrij rond, en na de vondst gaat het spel terug naar het album (besluit 106).

## Geen uitleg

Geen tekst in het spelscherm: geen "Reageer!", geen namen bij de moves, geen label bij de politiebalk of de worstelbalk, geen toetsaanduiding (1–4) bij de knoppen, geen tekst bij de ontbrekende kniebeschermers. De `aria-label`s beschrijven de knoppen wel, maar zijn niet zichtbaar. Weggelaten uit het artboard: de munt in de kopbalk en de tegel "Gered".

## Toegankelijkheid

- Canvas: `role="img"` met een beschrijving van de steeg. Politiekaart: `role="img"`, `aria-label="Politie onderweg"`.
- Rode knop en move-knoppen zijn echte `<button>`s met `aria-label` (Reageer nu, Sweep, Side control, Knee on belly, Rear naked choke); de moves staan in een `role="group"`.
- `prefers-reduced-motion`: geen wip-loopje, geen trillen of schudden, geen pulserende knop; de politieauto staat er direct; move-scène en kniebeschermers faden alleen (geen schaal).

## Acceptatiecriteria

- [x] Zonder ketting (`?test=1&reset=1#/spel/6`): popup "Een rustige avond", knop terug naar de kalender.
- [x] De eerste 2 s loopt Pino met pijltjes/WASD binnen het loopgebied; daarna beweegt ze niet meer en is het joystick-vlak weg. De dief loopt naar haar plek, en klem, balk en politieauto staan daar ook (linksboven en rechtsonder gecontroleerd; rechts komt de auto van links).
- [x] De joystick zelf (vasthouden op het scherm) in de eerste 2 s: goed bevonden door Benjamin op de telefoon (10 november).
- [x] Fase 1: bezoekers lopen blij rond; de dief verschijnt na 2 s en loopt recht op Pino af; bij de greep kijken omstanders en handelaars bang, de trillijntjes staan bij de ketting en de rode knop verschijnt met leeglopende ring.
- [x] Niet gedrukt binnen 2 s: de dief rent weg met de ketting, Pino kijkt verdrietig, daarna "Gestolen!" zonder tegels, beloning of confetti; `producten` blijft ongewijzigd.
- [x] Op tijd gedrukt (ook met spatie): klem, politiekaart en move-knoppen verschijnen; de banen staan precies boven de knoppen (ook op een breder venster gecontroleerd).
- [x] Noten vallen tot op de knoppen (geen raakring); op het raakmoment ligt de noot precies op zijn knop. Raak geeft een paarse ring, haalt de balk omlaag en toont kort de scène van die move; een gemiste noot en een druk zonder noot laten de balk oplopen met een rode ring (gecontroleerd via `pinoDebug`, pijltjes- en cijfertoetsen).
- [x] 20 s volgehouden (met kniebeschermers, foutloos 28/28): politieauto rijdt in, omstanders lachen, "Osssuu" met Pino in gi, tegels Reactie en Moves, Conditie +1; `deurtjes[6]` = gespeeld, `vaardigheden.lichaam` +1, `scores[6]` gevuld.
- [x] Balk vol: Pino laat los, de dief rent met de ketting naar rechts weg, "Gestolen!" met tegels, geen punt.
- [x] `knie=1`: kniebeschermers zichtbaar in de klem, knee on belly lukt. `knie=0`: knee on belly mislukt altijd (balk +20), de kniebeschermers poppen op in de knop. Zonder kniebeschermers is de klem net niet te halen: 5000 patronen doorgerekend, met foutloos spel loopt de balk altijd vol, tussen 16,5 en 19,4 s; met kniebeschermers en foutloos spel nooit. In de browser: zonder los op 17,1 s, met gehaald.
- [x] Geen zichtbare uitlegtekst of labels in het spelscherm; geen consolefouten.
- [x] Gevoel van de timing op een echte telefoon (raakvenster, tempo, move-scène, 20 s met 28 noten): goed bevonden door Benjamin (10 november).
- [x] Werker-knop (deurtje 7 open): tikken zet `werkers[6]` op gevonden en laat hem opspringen.
- [ ] `prefers-reduced-motion`: code aanwezig, nog niet handmatig gezien.
- [x] "Nog een keer" start een schone ronde (nieuwe staat, fase rust, rode knop verborgen); de terugknop tijdens het spel gaat naar `#/deur/6` en ruimt canvas, joystick-vlak en debug-haak op.
- [x] Na een gelukte klem staat `behoeften.jiujitsu` op 100.

In testmodus (`?test=1`) staat de spelstaat op `window.pinoDebug` (`s`, `dief`, `klem`, `reageer()`, `drukBaan(n)`, `stap(ms)`). Met `stap` zet je het spel met de hand vooruit, bijvoorbeeld `pinoDebug.stap(2300)` tot in de greep.

## Test-URL's

- `?test=1&reset=1#/spel/6` zonder ketting: de popup.
- `?test=1&knie=1#/spel/6` met kniebeschermers; `?test=1&knie=0#/spel/6` zonder (beide slaan de ketting-controle over).
- `?test=1#/laden/6` inclusief laadscherm; `#/dev` → "Spel 6 · kniebeschermers".
- Zonder `knie`: eerst in spel 5 de ketting (en eventueel de kniebeschermers) kopen.

## Open punten

Geen voor Benjamin: besluit 80–100 zijn bevestigd (10 november 2026).
