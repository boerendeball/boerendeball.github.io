# Spel 2 · Tuin van de koningin

**Status:** gebouwd, te beoordelen (herontwerp 15 november 2026, besluiten #166–#175; `advent/js/spellen/spel2.js`, logica in `advent/js/spellen/hex.js`; gedeeld: `ui/taartmenu.js`, `ui/edelstenen.js`, `ui/resultaat.js`, `spellen/zoeken.js`, `css/spel.css`)
**Dag 2 · 25 november · Logica +2 · Techniek +2 · Koken +2 · Creativiteit +1 (besluit 164)**
Previews (verouderd, zie hieronder): `design/previews/Spel2*.png` · Generator: `design/generators/spel2_sprites.py`
Rendering: **SVG-DOM** (kalm spel) met een camera.

Sprites:
- **nieuw** (#166): `hx-midden`, `hx-kano`, `s2-boeddha`, `s2-waterval`, `s2-taxibord`;
- hergebruikt: `hx-gras hx-tegel hx-doel gem banaan` (spel 2), `m-vlinder m-boom m-vogel pino-*` (spel 1), `s4-palm wk-hark` (spel 4), `s8-tempel s8-boom s8-bamboe s8-varen s8-gras s8-bloem` (spel 8), `s10-auto` (spel 10, geel als taxi);
- niet meer gebruikt, wel in de set: `hx-uitgang`, `hx-fontein`, `vijver`, `m-kraan`.

> **Herontwerp (besluit 166).** Het gazon van 6×14 met een tuinpoort is vervangen door een jungletocht over minispeelveldjes, geïnspireerd op de opbouw van een bordspel met kleine veldjes: elk veldje heeft 6 tegelplekken rond een midden. De previews en artboards van spel 2 tonen nog het oude ontwerp; deze spec is leidend. De hexen, tegels, taartmenu's en kopbalk zijn wél dezelfde als in het artboard.

## Doel en gevoel

Pino komt per kano aan in de jungletuin van de koningin. Op elk minispeelveld legt ze tegels rond het midden: eerst een kano, daarna een tempel, een boeddhabeeld of een waterval.

Na drie tegels kan ze een tegel in een open plek in de jungle leggen. Daar groeit dan een nieuw veld omheen, en Pino en de camera gaan erheen. Het zevende veld ligt aan een weg. Legt ze daar een tegel naast de weg, dan komt er een taxi die haar ophaalt.

Welke tegel waar past, ontdekt ze zelf: het menu toont alleen passende tegels. De tegels komen uit spel 1 en zijn schaars. Wie de ring rond een midden helemaal vol legt, ziet het midden glinsteren: daar ligt een edelsteen voor spel 3. Rustig, puzzelig, zonder tijdsdruk.

## Scherm

1. **Kopbalk** (`ui/kopbalk.js`):
   - terugknop → `#/deur/2` (in de zoekmodus van spel 7: terug naar het album);
   - label `DAG 2 · 25 NOVEMBER`;
   - titel `Tuin van de koningin`;
   - **rechts niets**: geen edelsteenteller in spel 2 (#35).
2. **Scène**: één SVG die de hele ruimte onder de kopbalk vult (`.tuin-ruimte` → `.tuin-kaart` → `.tuin-scene`).
   - Het scherm is één venster hoog (`100dvh`). Er hoeft nooit gescrold te worden (#43, #173).
   - De **camera** bepaalt de `viewBox`: 310 wereldeenheden breed (±5,6 hexbreedtes), en even hoog als de kaart in verhouding.
   - Op een telefoon is een hex zo ±64 px breed (A55, 384×680). Het huidige veld staat in het midden van het beeld.
   - De maat wordt bij elke render opnieuw gemeten, en ook bij `ResizeObserver` en `resize`.
   - Klikdoelen zijn `<button>`s op pixelposities die uit de camera berekend zijn.

## Wereld en tekenen (`hex.js`)

- **Raster**: onbegrensd, spitse bovenkant, axiale coördinaten `"q,r"`.
  - Middelpunt: `x = 55·(q + r/2)`, `y = 48·r`.
  - Een hex is 56×66 en wordt getekend op `(x−28, y−33)`.
  - Tekenvolgorde: alles in beeld (+ marge) gesorteerd op onderkant-y, van achter naar voor. Pino komt direct na haar vak.
- **Veld**: een bloem van 7 vakken (midden + 6 ringplekken) met `{ c, soort, geoogst }`. Het startveld ligt op `0,0`.
- **Middens**, in volgorde:

  | veld | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  |---|---|---|---|---|---|---|---|
  | midden | kano | tempel | boeddha | waterval | tempel | boeddha | waterval |

  - Kano: `hx-kano` (water, lotusblad, houten kano), Pino staat erin.
  - De andere: `hx-midden` (stenen platform) + `s8-tempel` / `s2-boeddha` / `s2-waterval`.
- **Ringplek**: `hx-gras`, of een gelegde tegel (de `hexTegel()`-port: vlinder 3× 15 px, boom/vogel 30 px; groen `#39D353`, geel `#FFC93C`, blauw `#5BC0EB`).
- **Open plek in de jungle** (een mogelijke brug): een plukje gras zonder tegelrand, ellips `#5FB05A` + `#8BD35A` + `s8-gras`. Zo blijft het veld zelf herkenbaar.
- **Jungle**: grond `#4E9A3E` met vlekken `#2E7D1E`/`#5FB05A`.
  - Per vak een vaste plant via een hash: `s8-boom`, `s8-bamboe`, `banaan`, `s8-varen` of `s4-palm`, soms met `s8-bloem`.
  - Binnen afstand 2 van een veld of naast de weg staan alleen varens, zodat de vakken zichtbaar blijven.
- **Weg** (alleen bij veld 7): een doorlopende band in de grondlaag: stoep `#CFD8DC`/`#DDE7EE`, asfalt `#4F6B7E` en een gele streepjeslijn. De band loopt van −14 tot +16 rond het midden van de wegrij, zodat de tegels in de rijen erboven (voorkant tot −16) en eronder (bovenvlak vanaf +19) hem niet raken (#176).
- **Oplichting** van aantikbare plekken: wit 22 % + een witte stippelrand op het bovenvlak. Hover (muis) en toetsenbordfocus maken die oplichting in de scène feller (`.tuin-hover`: wit 50 %, doorgetrokken rand). De knoppen zelf tekenen niets: ze liggen boven de hele scène en zouden anders over Pino heen vallen (#176).
- **Taxi en Pino op diepte**: de taxi wordt gesorteerd als een ding in de wegrij. Ligt de weg achter het veld, dan staat Pino ervóór en stapt ze aan de voorkant in. Ligt de weg ervoor, dan stopt de taxi met zijn lage achterkant onder Pino, zodat dak en dakbord haar niet bedekken, en hupt ze achter de taxi in (#176).
- **Glinster**: 4 gele sterretjes rond het midden die zacht knipperen.

## Regels

| Constante | Waarde | Betekenis |
|---|---|---|
| `AANTAL_VELDEN` | 7 | kano + 6 nieuwe velden (#167) |
| `TEGELS_VOOR_BRUG` | 3 | tegels op het huidige veld voor een brug; de bruggetegel telt mee (#168) |
| `WERKER_VELD` / `WEG_VELD` | 2 / 6 (index) | werker bij veld 3, weg bij veld 7 |
| `CAMERA_BREEDTE` | 310 | wereldeenheden in beeld |
| `CAMERA_DUUR` / `HUP_DUUR` / `GROEI_STAP` | 700 / 300 / 60 ms | camera, hup per hex, groei per vak |
| `MENU_STRAAL` / `MENU_STRAAL_GROOT` / `GEM_STRAAL` | 104 / 116 / 96 px | taartmenu's |

- **Passen** (ongewijzigd, #30): twee tegels passen als ze **precies één** eigenschap delen (kleur óf figuur).
- **Groepen** (ongewijzigd, #34): aangrenzende tegels met dezelfde kleur, of met hetzelfde figuur, vormen een groep. In een groep komt elk type maar één keer voor. Groepen lopen ook over velden heen.
- **Kandidaten**: de types die bij **alle** aangrenzende tegels passen en geen dubbel type in een groep maken. Het midden van een veld is geen tegel. Naast een lege plek past dus elk type: de eerste tegel op het startveld mag alles zijn, en het menu toont dan 9 kleinere tegels op een grotere ring (#172).
- **Leggen op het huidige veld**: elke vrije ringplek met een kandidaat is open. Verlaten velden zijn dicht (#169).
- **Brug**:
  - Kan pas als er ≥ 3 tegels op het huidige veld liggen, en niet vanaf veld 7.
  - Een brugplek ligt op afstand 2 van het huidige midden, grenst aan een gelegde tegel van dat veld, heeft een kandidaat en ruimte voor een nieuw veld.
  - Het nieuwe midden is een buur van de brug op afstand 3 van het huidige midden, zonder overlap met andere velden, de werker of de weg. Bij voorkeur ligt het in rechte lijn naar buiten (`nieuwMidden`).
  - De brug wordt een ringplek van het nieuwe veld en telt als 1 van de 3 tegels daar.
- **Edelsteen**:
  - Liggen alle 6 ringplekken vol en is de edelsteen nog niet gekozen, dan glinstert het midden.
  - Een tik: sterretjes vliegen uit het midden, daarna het taartmenu blauw/groen/geel (het midden van het menu is het middenobject met een gouden ring).
  - Daarna `staat.oogstEdelsteen(veld, kleur)`, één keer per veld. Wegtikken laat de glinster staan.
  - Wie verder gaat voordat de ring vol is, laat die edelsteen liggen.
- **Werker** (#170):
  - Zodra veld 3 ontstaat, staat hij (`wk-hark` ×0,6) te harken op een open plek op afstand 2 van dat veld, zo ver mogelijk van de brug. Die plek wordt nooit een brug.
  - Aanklikbaar zodra deurtje 7 open is, via `werkerGevonden(2, { zoek })`, met hupjes. In de zoekmodus vanuit spel 7 speel je het gewone spel (#103).
- **Weg en einde** (#171):
  - Bij veld 7 komt de weg op een horizontale rij 2 rijen boven of onder het midden. Dat wordt de kant waar Pino niet vandaan kwam en waar geen ander veld ligt.
  - De 2 ringplekken in de rij ertussen zijn **wegplekken**. Een tegel daar beëindigt het spel:
    1. Pino hupt naar die tegel.
    2. Een gele taxi (`s10-auto` ×1,5 + `s2-taxibord`) rijdt van links aan en stopt bij haar.
    3. Pino hupt naar het portier en verdwijnt achter de taxi.
    4. De taxi rijdt rechts het beeld uit.
    5. `rondSpelAf(2, { score: { tegels, edelstenen, velden } })`, `wisTuin()`, resultaatscherm.
- **Effect van een nieuw veld**:
  1. De bruggetegel valt in.
  2. De jungleplanten op het nieuwe veld krimpen weg (0,3 s).
  3. De 6 andere vakken komen één voor één omhoog (60 ms na elkaar).
  4. Een kring sterretjes rond het nieuwe midden.
  5. Pino hupt erheen.
  6. De camera schuift.
- **Vastlopen**: er is geen melding of hint. Het menu toont grijze tegels met een 0. De tuin blijft bewaard.
- **Animaties**: via rAF, met een timer als vangnet (`duur + 400 ms`). Zo blijft het spel niet hangen als de browser de frames stillegt.
- Bij `prefers-reduced-motion` springt alles direct: geen groei, geen hupjes, geen knipperen of rijden.

## Besturing

- Touch en muis: tik op een oplichtende plek, een glinsterend midden of de werker. Het zijn echte `<button>`s met een hex-`clip-path`; het midden en de werker hebben een ronde knop.
- Toetsenbord: Tab naar een plek en Enter/spatie opent het menu. In het menu wisselen de pijltjes tussen de bruikbare opties; Escape of Annuleren sluit het.

## Staat

- In: `tegels` (spel 1), `edelstenen`, `tuin`, `werkers`.
- `tuin = { velden: [{ c, soort, geoogst }], huidig, gelegd: { "q,r": "kleur-figuur" }, pino: "q,r", weg: { rij, kant, plekken } | null, werker: "q,r" | null, edelstenen }`. De tuin wordt bewaard tot het spel af is (#28) en daarna `null`.
- Uit:
  - `tegels` −1 per tegel (`legTuinTegel`, `legTuinBrug`);
  - `edelstenen[kleur]` +1 (`oogstEdelsteen`);
  - `werkers[2]`;
  - `scores[2] = { tegels, edelstenen, velden }`.
- **Migratie** (#174): een tuin uit het oude 6×14-ontwerp (zonder `velden`) wordt bij het laden gewist; de tegels die erin lagen gaan terug in de voorraad.
- **Hoeveel tegels**: minstens 20 voor de hele tocht (3 + 6 bruggen + 5×2 + 1). `?vul=1` geeft er 27; een rondje spel 1 levert er ±6–12 op.

## Resultaatscherm

- Bol met het icoon `tuin` en label `TUIN VAN DE KONINGIN · KLAAR`.
- Titel **Van kano tot taxi!**
- Zin: "Tempels, boeddha's en watervallen: Pino heeft de hele tuin van de koningin doorkruist." (#175)
- Eén scoretegel **TEGELS**; geen EDELSTENEN (#35), geen sterren of highscore.
- Beloningsblok van dag 2 (#164).
- Knoppen **Terug naar de kalender** en **Nog een keer** (een nieuwe tocht vanaf de kano).

## Geen uitleg

- Geen tekst in de scène: de taxi heeft een geblokt dakbord zonder het woord "TAXI".
- Geen teller voor edelstenen.
- Het menu toont alleen passende tegels, zonder uitleg waarom.
- De enige hint staat op de tipkaart van het laadscherm (#165): "Tip: leg je tegels in een kringetje helemaal rond, dan glinstert er iets kostbaars in het gras." Die klopt nog: een volle ring laat het midden glinsteren.

## Toegankelijkheid

- De scène heeft `role="img"` met een beschrijving.
- Knoppen met `aria-label`: "Vak", "Open plek", "Kano", "Tempel", "Beeld", "Waterval", "Werker".
- Menuopties: "Tegel geel vlinder, 2"; een grijze optie is `disabled`.

## Acceptatiecriteria

- [x] Bij de start zie je het kanoveld met jungle en Pino in de kano. De 6 ringplekken lichten op, en de eerste tegel mag elk van de 9 types zijn (menu met 9 kleine tegels, geen overlap).
- [x] Na 2 tegels zijn er nog geen open plekken in de jungle; na 3 wel, alleen naast gelegde tegels (gezien: 5 plekken).
- [x] Een brug: het nieuwe veld groeit, er komen sterretjes, Pino hupt erheen en de camera schuift naar het nieuwe midden. Het oude veld is niet meer aan te tikken. De brug telt als 1 tegel op het nieuwe veld.
- [x] Een volle ring (veld 2): het midden glinstert; een tik geeft sterretjes en het edelsteenmenu; groen → `edelstenen.groen` +1, `velden[1].geoogst`; de glinster is weg.
- [x] Veld 3: de werker harkt op een open plek; met `?test=1` is hij aanklikbaar en zet hij `werkers[2]`.
- [x] Herladen midden in het spel: dezelfde velden, tegels, jungle, camera en Pino-positie.
- [x] Veld 7 (waterval) heeft een weg met 2 wegplekken. Een tegel daar: taxi, Pino stapt in, de taxi rijdt weg, resultaat "Van kano tot taxi!" met TEGELS 23. Daarna `tuin` null, deurtje 2 gespeeld, `scores[2]` gezet.
- [x] Een oude tuin (6×14) in localStorage wordt gewist en de tegels gaan terug in de voorraad.
- [x] De polaroid van spel 2 in spel 7 toont het kanoveld met Pino.
- [x] Het scherm is even hoog als het venster (384×680, 375×812, desktop), en de klikdoelen liggen op de hexen (afwijking 0 px na een resize-event).
- [x] Node-check (`hex.js`): buren en afstand, brugplekken na 3 tegels, nieuw midden zonder overlap, werker- en wegplek, een tocht met 27 tegels in 20 stappen.
- [x] Hover op het vak boven Pino licht het vak in de scène op, onder Pino; de knop zelf heeft geen achtergrond (#176).
- [x] De weg raakt geen tegel van de rij erboven of eronder (gezien met de weg onder veld 7).
- [x] Taxi en Pino (#176):
  - weg achter het veld: de taxi wordt de hele tijd achter Pino getekend;
  - weg ervoor: de taxi staat vóór haar, maar alleen met de lage achterkant onder haar voeten (de omkaders overlappen 7 px);
  - daarna stapt ze in en verdwijnt ze.
- [x] Geen consolefouten.
- [ ] Beoordeling door Benjamin: sfeer, schaal, effecten, taxi.

## Test-URL's

- `?test=1&reset=1&vul=1#/spel/2`: nieuwe tocht met 3 stuks van elke tegel.
- `?test=1#/spel/2`: verder met de bewaarde tocht.
- `window.pinoDebug` (testmodus): `{ spel: 2, hex, tuin(), render(), cam }`.

## Open punten

- De sfeer, de schaal (camerabreedte 310) en de volgorde van de middens zijn eigen keuzes (#171, #173), te bevestigen.
- De previews en artboards van spel 2 zijn nog van het oude ontwerp.
