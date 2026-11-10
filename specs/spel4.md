# Spel 4 · (Social)ize the family

**Status:** goedgekeurd (Benjamin, 2026-11-08) · Dag 4 · 27 november · vaardigheid Charisma · rendering: SVG-DOM
Previews: `Spel4.png`, `Spel4-Klaar.png`, `Spel4-Sprites.png` (alleen het strand; berg en markt krijgen nieuwe artboards) · Generator: `spel4_build.py`, `spel4_sprites.py`
Sprites: strand (`s4-zon s4-wolk s4-meeuw s4-rots s4-boot s4-pier s4-palm s4-kraam s4-bank s4-boog s4-parasol s4-handdoek s4-bal s4-schelp s4-zeester`), berg (`s4-bergen s4-hek s4-rotspunt s4-ijsje s4-kijker s4-wegwijzer s4-struik s4-den s4-trap`), markt (`s4-gevels s4-bloemkraam s4-groentekraam s4-dierentafel s4-kooi-kat s4-kooi-eekhoorn s4-kool s4-manden s4-ton`), camera (`s4-camera pino-foto s4-flits s4-zoeker`), fotomoment (`b-lach d-biggetje-lig d-gansje-eet d-lam-eet`), silhouetten (`sil-moeder sil-vader sil-kind sil-big sil-gans sil-lam`), `s4-film s4-munt s4-polaroid werker`

## Doel en gevoel
Pino is de fotograaf van de familie die ze in spel 3 compleet heeft gemaakt. De familieleden lopen los van elkaar rond in een mooie omgeving. Op een vast moment staat iemand precies goed, alléén, en lacht. Pino moet dat moment zien en op tijd op die persoon tikken; dan loopt ze erheen en maakt de foto. Wie te vroeg tikt of tikt terwijl er iemand anders in beeld staat, ziet een rood frame. Drie foto's per familie, en elke familie (drie in totaal) betaalt voor haar foto's. Niemand legt uit wat "precies goed" is: dat ontdekt Pino.

## Drie families, drie omgevingen (besluit 44)

| Familie | Omgeving | Ouders samen | Kind alleen | Dier alleen | Betaalt |
|---|---|---|---|---|---|
| Tan (moeder, vader, meisje, biggetje) | **Tropisch strand** (preview `Spel4.png`) | onder de bloemenboog | bij de fruitkraam (strandwinkel) | ligt op de handdoek | 60 |
| Nguyễn (moeder, vader, meisje, gansje) | **Uitzichtpunt op een berg**, andere bergen op de achtergrond | bij het hekje aan de rand | op het uitstekende rotspunt | eet van het ijsje dat op de grond ligt | 100 |
| Somchai (moeder, vader, jongetje, lammetje) | **Dagmarkt** (overdag, zon en parasols; bewust anders dan de nachtmarkt van spel 5) | voor de bloemenkraam | voor de dierentafel van de verkoper (kooien met twee katten en een vliegende eekhoorn) | eet van de kool die bij de groentekraam op de grond ligt | 80 |

Rijkdom (besluit Benjamin): Nguyễn het rijkst, Somchai iets minder, Tan het minst. De bedragen zijn constanten in `fotos.js`; samen 240, precies de prijs van de ketting in de eerste ronde van spel 5 (besluit 64).

Elke omgeving heeft naast de drie fotoplekken minstens vier **andere plekken** waar familieleden heen lopen en even blijven staan (strand: bankje, palm, zeerand, parasol, bal; berg: bankje, verrekijker op paal, wegwijzer, struiken, trapje; markt: fruitkraam, mandenkraam, waterton, parasol, bankje).

## Scherm (390×844, van boven naar beneden)
1. **Kopbalk** (DOM, `ui/kopbalk.js`): terugknop, "DAG 4 · 27 NOVEMBER", titel, rechts de pil **filmrol + getal** (aantal opnames, telt op vanaf 0, geen limiet).
2. **Scène** (één SVG, 358 breed, ±600 hoog): de omgeving van de familie. Schaalt mee zoals spel 2 (besluit 43): nooit scrollen.
3. **Filmstrook** (DOM): drie vakjes over de volle breedte, elk met de silhouetten van wie erop moet: ouders (`sil-moeder` + `sil-vader`), kind (`sil-kind`), dier (`sil-big` / nieuw `sil-gans` / `sil-lam`). Een gemaakte foto vult het vakje met een mini-polaroid van die foto. Geen "actief" vakje: de volgorde is vrij (besluit Benjamin).
   - De ronde **camera-sluiterknop** uit de preview vervalt: je fotografeert door op een familielid te tikken (besluit 47, te bevestigen).

## Scène
- viewBox `0 0 358 600` (definitieve hoogte bij de bouw, scène + filmstrook moeten op 390×844 passen).
- Lagen van achter naar voor: lucht/achtergrond → verre decor (zee, rotsen, boot / bergen / marktdaken) → grond met de plekken → **diepte-gesorteerde laag**: rekwisieten, familieleden, Pino en de werker, gesorteerd op hun voet-y (tekenvolgorde achter naar voor; opnieuw sorteren als iemand van rij wisselt) → frame (zoeker) → flits.
- Strand: posities uit `spel4_build.py` (`strand()`); de handdoek schuift zo ver naar links dat hij helemaal in beeld ligt.
- Berg en markt (fase 2): decor in `spellen/decor4.js` (zelfde posities als `berg()` en `markt()` in `spel4_build.py`; artboards `Spel4-Berg`, `Spel4-Markt`, `Spel4-Sprites2`, nog zonder PNG in `previews/`). **Berg:** lucht met bergtoppen en mist, gras van het uitzichtpunt vanaf y 326 met een grindpad van het trapje (linksonder) naar het hek; hek langs de rand (12,290), rotspunt rechts (230,268) waarvan de voorkant aansluit op het gras, ijsje plat op het gras (262,552), verder den, verrekijker (werker half achter de voet), bankje, wegwijzer en twee struiken. **Markt:** lucht, rij winkelhuizen met luifels (0,86), stoep en tegelplein vanaf y 304; bloemenkraam linksboven (22,284), dierentafel rechts (232,378) met een verkoper erachter (decor, telt niet mee als iemand in beeld) en drie kooien erop: een oranje kat, een vliegende eekhoorn en een grijze kat; het jongetje staat ervoor (262,470), werker half achter de tafel, regenton, manden, groentekraam rechtsonder met een kool op de grond (190,604) en een bankje.
- Familieleden: dezelfde uiterlijken als in spel 3 (`spellen/familie.js`), via `persoon()` / `dier()`; lopen = spiegelen in looprichting + klein op-en-neer wippen; stilstaan op een fotoplek = lachend gezicht (nieuw `b-lach`), het dier ligt/eet (nieuw `d-biggetje-lig`, `d-gansje-eet`, `d-lam-eet`).
- Pino: `p-basis` + `pino-staan` (rust), `pino-loop` (lopen), `pino-foto` (foto maken). Rustplek per scène (strand: rechtsonder zoals in de preview).
- **Verstopte werker** in elke omgeving (besluit 49): strand achter de palmstam (`wk-zwaai`, voeten op 49,316 net achter de stamvoet, schaal 0,55; besluit 108), berg half achter de verrekijker, markt half achter de dierentafel. Pas aanklikbaar als spel 7 open is; vinden in één omgeving telt (`staat.werkers[4]`).

## Regels
Alle getallen zijn constanten in `spellen/fotos.js`.

**Looproutes (besluit Benjamin).** Ieder familielid loopt zijn eigen route, die steeds opnieuw begint:
- Kind en dier: loop naar andere plek A (even staan) → andere plek B (even staan) → eigen fotoplek, daar **2 seconden** (`MOMENT = 2000` ms): het kind lacht, het dier ligt/eet. Daarna begint de route opnieuw.
- Moeder en vader: lopen los van elkaar elk hun eigen route langs andere plekken, maar hebben een gezamenlijk moment waarop ze **2 seconden samen** op de oudersplek staan en lachen. Hun routes hebben dezelfde cyclusduur, zodat ze daar altijd tegelijk aankomen.
- Routes zijn tijdlijnen (deterministisch, geen toeval): positie = functie van de tijd. Loopsnelheid `SNELHEID ≈ 45` scène-eenheden per seconde.
- De drie groepen hebben verschillende cyclusduren (beginwaarden: ouders 15 s, kind 11 s, dier 9 s). Daardoor loopt iemand af en toe dwars door het frame van een ander op zijn moment; dan mislukt die foto. Eis: elk moment is minstens in de helft van de cycli schoon (controle in `fotos.js`, zie acceptatiecriteria).

**Frame.** Elke fotoplek heeft een vaste framerechthoek (strand-boog: zoeker 104,296,146×140 uit de preview; de andere bij de bouw). Een familielid staat **in beeld** als zijn lichaamsrechthoek de framerechthoek voor minstens 30 % overlapt (`IN_BEELD = 0.3`). Pino zelf telt niet.

**Tikken op een familielid** (elke tik = één opname, filmrol +1):
- **Goed**: het familielid staat in zijn 2-secondenmoment op zijn fotoplek, alle doelen van die plek staan er (bij de ouders: allebei), en verder staat niemand in beeld. Dan:
  1. De doelen bevriezen op hun plek (ze lachen door tot de foto klaar is); de anderen lopen door.
  2. Pino loopt (`pino-loop`) naar het fotopunt bij die plek.
  3. Pino staat stil in `pino-foto`; het **witte frame** (`s4-zoeker`) verschijnt om de plek.
  4. Flits; de foto vliegt als mini-polaroid naar zijn vakje in de filmstrook.
  5. Het frame verdwijnt; Pino gaat naar `pino-staan` en blijft daar staan. De gefotografeerde familieleden **blijven op hun plek staan** voor de rest van het spel; tikken op hen doet niets meer.
- **Fout**: te vroeg/te laat, niet op de plek, of er staat iemand anders in beeld → het frame verschijnt **750 ms in rood** (`ROOD_MS = 750`): om de fotoplek als het familielid daar wel stond, anders om het familielid zelf. Pino blijft staan. Miskliks +1.
- Tijdens de fotovolgorde (stap 1–5) worden tikken genegeerd.
- Het spel is af als alle drie de foto's van deze familie gemaakt zijn.

**Welke familie (besluit 48 en 55).** Heeft nog geen enkele familie foto's, dan opent spel 4 meteen het spel met de eerste **complete** familie (volgorde waarin de families in spel 3 compleet werden, af te leiden uit `staat.karakters`). Zodra er één familie op de foto staat, opent spel 4 het album: daar heeft elke complete familie zonder foto's een ronde **cameraknop** (icoon-only, `aria-label` "Foto's maken") die het fotospel voor die familie start. "Nog een keer" op het resultaatscherm start direct de volgende complete familie zonder foto's. Zo kan spel 4 drie keer gespeeld worden, één keer per familie.

**Album (besluit Benjamin, 54).** Is er geen complete familie meer zonder foto's, dan opent spel 4 een fotoalbum met negen polaroids: per familie een pagina met haar drie foto's, of drie lege polaroids (lichtblauw met de silhouetten van wie erop hoort) als die familie nog niet gefotografeerd is. Geen spel, geen geld, geen tekst. Een familie die al foto's heeft, kan nooit opnieuw gefotografeerd worden. Voorstel (besluit 50, te bevestigen): als spel 7 open is, opent een tik op een polaroid die omgeving met de familie op haar fotoplekken, zodat de werker daar alsnog te vinden is.

**Geen complete familie**: popup "Nog geen familiefoto" (besluit 41, al gebouwd in `spellen/index.js`).

## Besturing
- Touch/muis: tik op een familielid. Raakvlak = lichaamsrechthoek + 8 eenheden marge (onzichtbare `<button>`s over de scène die meebewegen, of een `pointerdown` op de scène met een hittest in `fotos.js`).
- Toetsenbord: Tab gaat langs de familieleden (focusring om het familielid), Enter/spatie = foto.

## Staat
- In: `familie`, `karakters` (welke families compleet zijn en in welke volgorde), `fotos`.
- Uit:
  - nieuw veld `fotos: []` met de familie-id's die al gefotografeerd zijn (migratie: lege lijst); `markeerFotos(familie)` in `staat.js`;
  - `wijzigGeld(+bedrag)` één keer per familie;
  - `rondSpelAf(4, { vaardigheid: 'charisma', score: { miskliks, opnames } })` bij elke afgeronde familie (Charisma +1 en Verjaardag +10 % alleen de eerste keer, zoals bij alle spellen).
- `?vul=1` zorgt dat familie Tan echt compleet is (`karakters` bevat `biggetje`). Nieuwe dev-schakelaar `?familie=nguyen|tan|somchai` forceert een familie in spel 4 (alleen in testmodus).

## Resultaatscherm (preview `Spel4-Klaar.png`)
- Bol met Pino en de camera, label "(SOCIAL)IZE THE FAMILY · KLAAR", titel "Drie plaatjes voor het album!", geen uitlegzin.
- Drie polaroids (scheef, overlappend) met de drie gemaakte foto's: het decor uitgesneden op de framerechthoek met alleen de gefotografeerde familieleden lachend op hun plek (opgebouwd uit de gegevens met `foto(familie, plek)`, dezelfde foto's als in het album; de werker staat er niet op). Daarvoor krijgt `ui/resultaat.js` een vrij inhoudsvak.
- Eén tegel: VERDIEND munt + bedrag van deze familie (FOTO'S en MISKLIKS vervallen, besluit 51). Het aantal opnames en miskliks wordt wel bewaard in `scores[4]`.
- Beloning: "Charisma +1 · Behoefte "Verjaardag" +10%" de eerste keer, daarna "Charisma al verdiend".
- Knoppen: "Terug naar de kalender" en **"Nog een keer"**, alleen als er nog een complete familie zonder foto's is; die start direct de volgende familie.

## Geen uitleg
- Geen tekst in de scène of filmstrook: geen "Foto 1 van 3", geen namen, geen pijlen naar de plekken, geen aftelklokje bij het moment. Het lachen is het enige signaal.
- Filmrol-teller zonder woord erbij. Album zonder familienamen.

## Toegankelijkheid
- Scène `role="img"` met een `aria-label` per omgeving (beschrijving van het decor, niet van de oplossing).
- Familieleden zijn echte `<button>`s met `aria-label` ("Moeder", "Vader", "Meisje", "Biggetje", …); decoratieve SVG `aria-hidden="true"`.
- Filmstrook: `role="group"`, vakjes met `aria-label` "Foto gemaakt" / "Nog geen foto".
- `prefers-reduced-motion`: geen wippen, geen flits en geen vliegende polaroid (die verschijnt direct); het lopen zelf blijft (dat is het spel).

## Acceptatiecriteria
Nagelopen op 2026-11-08 in de browser (390×844 en 390×680, touch en Tab/Enter) met de test-URL's hieronder; de controlefunctie draaide voor alle drie de omgevingen.

- [x] Zonder complete familie: popup "Nog geen familiefoto" (bestaat al).
- [x] Zonder foto's: spel 4 opent met de eerste complete familie, in de omgeving van die familie. Met foto's: het album, met een cameraknop bij elke complete familie zonder foto's.
- [x] Ieder familielid loopt zijn eigen route; kind en dier gaan langs twee andere plekken en staan dan 2 s op hun fotoplek; de ouders staan 2 s samen op hun plek. Daarna begint de route opnieuw.
- [x] Tik in het moment met niemand anders in beeld: Pino loopt erheen, wit frame, flits, polaroid in het vakje, frame weg, Pino rust; de gefotografeerden blijven staan.
- [x] Tik buiten het moment of met iemand anders in beeld: 750 ms rood frame; miskliks +1.
- [x] Filmrol telt elke tik op een familielid; geen limiet.
- [x] Foto's in elke volgorde; na drie foto's het resultaatscherm met de drie polaroids en alleen de tegel VERDIEND (Tan 60 · Somchai 80 · Nguyễn 100); geld is opgehoogd.
- [x] "Nog een keer" alleen als er nog een complete familie zonder foto's is, en die start meteen.
- [x] Een familie met foto's kan niet opnieuw gefotografeerd worden; wordt later een andere familie compleet, dan kan die via de cameraknop in het album.
- [x] Elk 2-secondenmoment is in minstens de helft van de cycli schoon (controlefunctie in `fotos.js`, uitvoerbaar in de console via `window.pinoDebug`).
- [x] Werker in elke omgeving, alleen aanklikbaar als spel 7 open is; vanuit het album (spel 7 open) een gefotografeerde familie bekijken in haar omgeving, met de werker te vinden. Vanuit spel 7 (`#/spel/4?zoek=1`) opent altijd het album van spel 4; na de vondst gaat het spel terug naar het album van spel 7 (besluit 105).
- [x] Scène + filmstrook passen op 390×844 en op een laag scherm zonder scrollen; werkt met touch en met Tab/Enter.
- [x] Geen tekst in het spelscherm buiten kopbalk en tellergetallen.

## Test-URL's
- `?test=1&reset=1&vul=1#/spel/4` — familie Tan op het strand.
- `?test=1&vul=1&familie=nguyen#/spel/4` / `&familie=somchai` — de andere omgevingen.
- Album: speel één familie, open daarna `#/spel/4` opnieuw; in testmodus is spel 7 open, dus de foto's van die familie zijn aan te tikken (bekijkmodus met werker).
- `?test=1&reset=1#/spel/4` — popup zonder familie.

## Bouwstand
- **Fase 1 (gebouwd):** `spellen/fotos.js` (routes, frames, beoordeling, `controleer()`), `spellen/spel4.js` (strand, familie Tan, filmstrook, foto maken, resultaat, album), `staat.fotos` + `markeerFotos()`, resultaatscherm met polaroids en munt-tegel, sprites `b-lach` en `d-biggetje-lig`. Routecontrole strand (1 uur gesimuleerd): boog 73 %, kraam 91 %, handdoek 53 % van de momenten schoon.
- **Fase 2 (gebouwd):** sprites berg/markt/etende dieren/silhouetten (`spel4_sprites.py` → `assets/sprites`), decor in `spellen/decor4.js`, fotoplekken en voorlopige routes voor Nguyễn (hek, rotspunt, ijsje) en Somchai (bloemenkraam, dierentafel, kool) in `fotos.js`, artboards `Spel4-Berg`, `Spel4-Markt`, `Spel4-Sprites2` (en in `canvas.json`). Elke familie fotografeert nu in haar eigen omgeving; de werker zit in alle drie. De cyclus van een route wordt automatisch verlengd als de route langer is (ouders houden dezelfde cyclus). Routecontrole (1 uur): berg hek 100 %, rotspunt 93 %, ijsje 73 %; markt bloemenkraam 86 %, kratten 86 %, kool 74 %.
- **Fase 3 (gebouwd):** routes van berg en markt afgestemd met `controleer()` (cycli ouders 17–18 s, kind 11–15 s, dier 11–12 s; schone momenten strand 73/91/53 %, berg 84/64/83 %, markt 82/58/82 % (na de dierentafel, besluit 57)). Album-tik (besluit 50): is spel 7 open, dan zijn de foto's van een gefotografeerde familie een knop ("Foto's bekijken") die haar omgeving opent in bekijkmodus: familie lachend op de fotoplekken, filmstrook vol, geen teller, niets te fotograferen of te verdienen, werker aanklikbaar. Acceptatiecriteria nagelopen.
- Nog open: PNG-previews van `Spel4-Berg`, `Spel4-Markt` en `Spel4-Sprites2` in `design/previews/` (headless Edge maakt in deze omgeving geen screenshots; de artboards zelf staan wel in `design/artboards/`).

## Open punten
Alle besluiten voor spel 4 (44–57 in `besluiten.md`) zijn genomen. Bewust zo gelaten (Benjamin, 2026-11-08): de vader op de markt mag na de foto door het jongetje heen lopen, en de kraam op het strand mag voorlopig zo makkelijk blijven (91 % schoon).
- Bij spel 5: is het geld uit spel 4 (Nguyễn 100, Somchai 80, Tan 60) genoeg?
- PNG-previews van `Spel4-Berg`, `Spel4-Markt` en `Spel4-Sprites2` in `design/previews/` ontbreken nog.
