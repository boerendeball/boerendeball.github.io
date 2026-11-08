# Spel 2 · Tuin van de koningin

**Status:** gebouwd, te beoordelen (`advent/js/spellen/spel2.js`, logica in `advent/js/spellen/hex.js`; gedeeld: `ui/taartmenu.js`, `ui/resultaat.js`, `css/spel.css`)
**Dag 2 · 25 november · vaardigheid Logica**
Previews: `design/previews/Spel2.png`, `Spel2-Menu.png`, `Spel2-Edelsteen.png`, `Spel2-Klaar.png`, `Spel2-Sprites.png` · Artboards: `design/artboards/Spel2*.dc.html` · Generator: `design/generators/spel2_build2.py`, `spel2_sprites.py`
Rendering: **SVG-DOM** (kalm spel). Sprites: `hx-gras hx-tegel hx-doel hx-uitgang m-kraan vijver banaan gem` + `m-vlinder m-boom m-vogel pino-*` (spel 1) + `werker s4-palm` (spel 4) + `s8-boom s8-liaan s8-tempel s8-bamboe s8-varen s8-gras s8-bloem` (spel 8). Er zijn geen nieuwe sprites. `hx-fontein` staat nog in de set, maar wordt niet gebruikt.

> **De scène wijkt bewust af van de previews** (besluit 26): het gazon ligt zonder kader in een tuin vol decor. De markup, kleuren en maten van de hexen, tegels, menu's en kopbalk komen wél uit het artboard. Bij twijfel geldt deze spec.

## Doel en gevoel

De koningin wil naar haar tuinpoort, maar het pad ligt er nog niet. Pino legt het tegel voor tegel, met de tegels die ze in spel 1 (ongemerkt) verdiende. Welke tegel waar mag, ontdekt ze zelf: het menu laat alleen tegels zien die passen. Na één keer spel 1 heeft ze te weinig tegels. Dan moet ze terug naar de slaapzaal om meer te verdienen (de economie). Wie slim legt en vakken insluit, vindt edelstenen voor spel 3. Rustig, puzzelig, zonder tijdsdruk.

## Scherm (390×844, van boven naar beneden)

1. **Kopbalk** (`ui/kopbalk.js`):
   - terugknop → `#/deur/2`;
   - label `DAG 2 · 25 NOVEMBER`;
   - titel `Tuin van de koningin` (Fredoka 20);
   - **rechts niets**: het artboard heeft een edelsteenteller, maar in spel 2 zie je niet hoeveel edelstenen je hebt. Dat zie je pas in spel 3 (besluit 35).
2. **Scène**: SVG 358×744 in `.scene-kaart.tuin-kaart` (radius 22, `overflow: hidden`). Daarboven ligt `.tuin-knoppen` met de klikdoelen, in % van de kaart.
   - Het scherm is precies één venster hoog (`100dvh`, dus zonder adres- en navigatiebalk). De scène staat in `.tuin-ruimte` (`container-type: size`) en krijgt de breedte `min(100cqw, 100cqh × 358/744)` met `aspect-ratio: 358/744`. Ze schaalt dus mee met de kleinste van de beschikbare breedte en hoogte en is altijd helemaal te zien (besluit 43). Op een laag scherm blijft er links en rechts wat achtergrond over.
   - De scène heeft `touch-action: manipulation`, niet `none` zoals spel 1: hier is geen joystick.

Op desktop staat het scherm 390 px breed gecentreerd, net als in spel 1.

## Scène (viewBox 0 0 358 744)

- **Raster**: 6 kolommen × 14 rijen, "odd-r" (oneven rijen een halve hex naar rechts). Het middelpunt van vak (c, r) is `x = 28 + 55c (+27,5 als r oneven)`, `y = 76 + 48r`.
  - Die formule komt uit `spel2_build2.py`, met `oy` 76 in plaats van 40, zodat er bovenin ruimte is voor bomen en het paviljoen.
  - Een hex is 56×66 en wordt getekend op `(x−28, y−33)`.
- **Vaste vakken**:
  - start (0,13): een `groen-boom`-tegel met Pino;
  - uitgang (5,0): `hx-uitgang`;
  - werkervak (3,10).
- **Decorvakken** (geen bord): `0,0 1,0 0,1` (vijver), `5,5 4,6 5,6 5,7` (bananenperk), `0,8 0,9` (bamboe), `5,11 5,12` (palm), `4,13 5,13` (bloemenperk). Zie `DECOR` in `hex.js`.
- **Tekenvolgorde**: de grond eerst. Daarna worden decor en vakken samen gesorteerd op onderkant-y, van achter naar voor. Pino komt direct na het vak waarop ze staat.

| Laag / element | Sprite | Positie, maat |
|---|---|---|
| grond | rect `#5FB05A` + vlekken `#4E9A3E` / `#8BD35A` | volledig vlak |
| bomen achter bovenste rij | `s8-boom` (×3), `s8-liaan` (×2) | y ≈ −16…−4 |
| paviljoen van de koningin | `s8-tempel` | 276,−4 · 54×68, achter de uitgang |
| lotusvijver met sala | `vijver` | −4,40 · 120×100 |
| kraanvogels | `m-kraan` (één gespiegeld) | 6,102 en 84,108 |
| bananenperk | `banaan` ×3, `s8-varen` ×2, `s8-bloem` ×3 | rond 230–360, 262–440 |
| bamboe | `s8-bamboe` ×2 | −2,400 en 26,448 |
| palm | `s4-palm` + `s8-varen` | 274,540 · 84×136 |
| bloemenperk | `s8-varen` ×2, `s8-bloem` ×4 | rechtsonder, y 684–728 |
| randgaten | `s8-gras` (+ `s8-bloem` links) | links naast oneven rijen, rechts naast even rijen |
| grasvak | `hx-gras` | per vak |
| tegel | `hx-tegel` met `color` = kleur + motief (port van `hex_tegel()`): vlinder 3× 15 px op (28,13),(16,33),(40,33); boom/vogel 30 px | groen `#39D353`, geel `#FFC93C`, blauw `#5BC0EB` |
| uitgang | `hx-uitgang` | (5,0) |
| open vak | bovenvlak `28,6 50,18 50,42 28,54 6,42 6,18`: wit 22 % + stippelrand wit 90 % (1,5 px, `4 3`) | per open vak |
| fonkel | 4-puntige ster (pad uit het artboard), `#FFC93C`, zacht knipperend | (x, y−14) |
| werker | `werker` 16×20 | (x−8, y−20) op vak (3,10), alleen als daar een tegel ligt |
| Pino | `pino-staan` / `pino-loop` (gespiegeld naar links) | (x−24, y−66) op haar vak |

## Regels

| Constante | Waarde | Betekenis |
|---|---|---|
| `START` / `START_TYPE` | `0,13` / `groen-boom` | starttegel |
| `UITGANG` | `5,0` | tuinpoort |
| `WERKER` | `3,10` | vak van de verstopte werker |
| `STAP_DUUR` | 260 ms | Pino per vak naar de poort |
| `EIND_PAUZE` | 450 ms | stilstand bij de poort |
| `MENU_STRAAL` / `GEM_STRAAL` | 104 / 96 px | taartmenu's (artboard) |

- **Passen**: twee tegels passen als ze **precies één** eigenschap delen: kleur óf figuur, niet allebei en niet geen. Naast blauw-vogel passen dus groen-vogel, geel-vogel, blauw-vlinder en blauw-boom.
- **Groepen**: aangrenzende tegels met dezelfde kleur vormen samen een kleurgroep, aangrenzende tegels met hetzelfde figuur een figuurgroep. De groep loopt door zolang de tegels elkaar raken. In een groep mag elk tegeltype maar **één keer** voorkomen, dus hooguit drie tegels per groep. Voorbeeld: groen-vogel → blauw-vogel → geel-vogel; aan die gele vogel mag geen groen-vogel (en ook geen blauw-vogel) meer. Dat geldt ook als een nieuwe tegel twee groepen aan elkaar knoopt waarin hetzelfde type zit (`hex.groepenUniek`).
- **Kandidaten voor een vak**: de tegeltypen die passen bij **alle** aangrenzende tegels en geen dubbel type in een groep maken. De start telt mee; gras en uitgang niet. Dat zijn er maximaal 4. Raakt een nieuw vak twee of meer tegels, dan is het de doorsnede (soms 1, soms 0).
- **Open vak**: een grasvak (geen decor, start of uitgang) naast de start of een gelegde tegel, met minstens één kandidaat. De voorraad doet hier niet mee. Alleen open vakken zijn aantikbaar en lichten subtiel op.
- **Leggen**:
  - Tik op een open vak. Het taartmenu toont de kandidaten in vaste volgorde (groen, geel, blauw × vlinder, boom, vogel), elk met een badge met de voorraad.
  - Een tegel met voorraad 0 is grijs (`#B8C3CC`) en niet te kiezen.
  - Kiezen haalt één tegel uit de voorraad en legt hem (`staat.legTuinTegel`, valt 0,2 s in).
- **Edelsteen**:
  - Een grasvak waarvan alle zes buren bezet zijn (start, tegel of uitgang; een rand- of decorbuur telt niet als bezet) en dat nog niet geoogst is, krijgt een fonkel.
  - Tik erop: een taartmenu met blauw/groen/geel, en de gekozen edelsteen erbij (`staat.oogstEdelsteen`). Eén keer per vak.
  - Wegtikken laat de fonkel staan.
  - Een geoogst vak blijft gras en is weer gewoon een (mogelijk) open vak. Een vak met fonkel is pas te betegelen als de edelsteen geoogst is.
- **Werker**:
  - Zichtbaar zodra (3,10) een tegel heeft.
  - Aanklikbaar zodra deurtje 7 open is (`datum.deurOpen(7)`, specs/spel7.md). Een tik zet `werkers[2] = true`, en de werker maakt twee hupjes.
- **Einde**:
  - Zodra een gelegde tegel aan de uitgang grenst, verdwijnen de klikdoelen.
  - Pino loopt via het kortste pad over de gelegde tegels (`hex.pad`, BFS) naar de poort, met een klein hupje per vak.
  - Daarna `rondSpelAf(2, { vaardigheid: 'logica', score: { tegels, edelstenen } })`, `wisTuin()` en het resultaatscherm.
- **Vastlopen**: er is geen melding, timer of hint. Het menu toont dan grijze tegels met een 0. De tuin blijft bewaard, dus na een rondje spel 1 kan Pino verder.

## Besturing

- Touch en muis: tik op een open vak, een fonkel of de werker. Het zijn echte `<button>`s met een hex-`clip-path` over de scène.
- Toetsenbord: Tab naar een vak en Enter/spatie opent het menu. In het menu wisselen de pijltjes tussen de bruikbare opties; Escape of Annuleren sluit het.

## Staat

- In: `tegels` (spel 1), `edelstenen`, `tuin`, `werkers`.
- Uit:
  - `tegels` −1 per gelegde tegel;
  - `edelstenen[kleur]` +1 per oogst;
  - `tuin = { gelegd: { "c,r": "kleur-figuur" }, geoogst: ["c,r"], edelstenen: n }` zolang het pad niet af is, en `null` na afronden;
  - `werkers[2]`;
  - `rondSpelAf(2, …)` met `scores[2] = { tegels, edelstenen }`.
- Vaardigheid en "Verjaardag +10 %" alleen bij de eerste afronding (besluit 9).
- `?vul=1` geeft 3 stuks van elk tegeltype (27). Daarmee is de poort te halen, maar niet met elke volgorde (dat is de puzzel).

## Resultaatscherm

- Bol met het icoon `tuin` en label `TUIN VAN DE KONINGIN · KLAAR`.
- Titel **Het pad is gelegd!**
- Zin: "De koningin wandelt met droge voeten naar de poort. Zelfs de kraanvogels maken een buiging."
- Eén scoretegel: **TEGELS** (gelegd in deze tuin, `#1F7A3A`). Er is geen tegel EDELSTENEN (besluit 35); het aantal wordt wel bewaard in `scores[2].edelstenen`.
- Beloningsblok "Logica +1 · Behoefte "Verjaardag" +10%" (bij herspelen: "Logica al verdiend").
- Knoppen **Terug naar de kalender** en **Nog een keer** (lege tuin).
- Geen sterren, geen BESTE en geen ZETTEN (besluiten 15, 16 en 31).

## Geen uitleg

Weggelaten uit het ontwerp of bewust niet toegevoegd:

- de fontein;
- de slotzin "Elke tegel past precies bij zijn buur" (verraadt de regel);
- sterren;
- labels bij de voorraad;
- de edelsteenteller in de kopbalk en de tegel EDELSTENEN op het resultaatscherm (besluit 35).

Er is geen tekst in de scène. Het menu toont alleen passende tegels, zonder uitleg waarom.

## Toegankelijkheid

- De scène heeft `role="img"` met een beschrijvende `aria-label`. Het decor is onderdeel van die ene afbeelding.
- Klikdoelen zijn `<button>` met `aria-label` "Vak", "Edelsteen" of "Werker".
- Menuopties hebben `aria-label` "Tegel geel vlinder, 2". Een grijze optie is `disabled` met `aria-disabled`.
- Bij `prefers-reduced-motion` is er geen invalanimatie, geen knipperende fonkel en geen hupjes, en springt Pino direct naar de poort.

## Acceptatiecriteria

- [x] Leeg bord: alleen de vakken naast de start lichten op (0,12 · 1,12 · 1,13).
- [x] Menu naast de start (groen-boom): groen-vlinder, groen-vogel, geel-boom, blauw-boom, met aantallen.
- [x] Een vak dat twee tegels raakt, toont alleen de doorsnede (node-check: start groen-boom + blauw-boom → alleen geel-boom). Een vak naast één geel-boom toont geel-vlinder, geel-vogel, groen-boom en blauw-boom.
- [x] Groepsregel: na groen-vogel → blauw-vogel → geel-vogel (1,13 · 2,13 · 3,13) toont het vak naast de gele vogel (4,12) alleen geel-vlinder en geel-boom. Node-check: een vol kleurgroepje (groen ×3) laat geen vierde groene tegel toe, en het samenknopen van twee groepen met elk een groen-vogel wordt geweigerd.
- [x] Met 3 stuks van elk type is de poort nog te halen (node-zoeker: 17 tegels).
- [x] Een tegel met voorraad 0 is grijs met een 0 en niet te kiezen.
- [x] Een omringd vak krijgt een fonkel; het edelsteenmenu (blauw/groen/geel) verhoogt `staat.edelstenen`; de fonkel verdwijnt.
- [x] Nergens in spel 2 staat een edelsteenaantal: geen teller in de kopbalk, op het resultaatscherm alleen TEGELS.
- [x] De werker verschijnt bij een tegel op (3,10); met `?test=1` is hij aanklikbaar en zet hij `werkers[2]`.
- [x] Herladen midden in het spel: de tuin staat er nog (de tegels zijn bewaard).
- [x] Een tegel naast de poort: Pino loopt het pad af, daarna het resultaatscherm; `tuin` is `null`, deurtje 2 `gespeeld`, Logica +1, `scores[2]` gezet.
- [x] "Nog een keer" geeft een lege tuin.
- [x] Past zonder scrollen op elk telefoonformaat: 384×600, 384×680 (Galaxy A55 met browserbalken), 375×812 en 412×915 gemeten. De pagina is even hoog als het venster, de klikdoelen liggen op de vakken en het menu opent.
- [x] Het kalender-taartmenu werkt nog (radiale opties zijn een uitbreiding).
- [x] Geen consolefouten.
- [ ] Beoordeling door Benjamin: scène, decor en gevoel.

## Test-URL's

- `?test=1&reset=1&vul=1#/spel/2`: lege tuin met 3 stuks van elke tegel en 3 van elke edelsteen.
- `?test=1&reset=1#/spel/1`, daarna `#/spel/2`: echte schaarste na één rondje spel 1.
- `?test=1#/spel/2`: verder met de bewaarde tuin.
- `window.pinoDebug` (testmodus): `{ spel: 2, hex, tuin(), render() }`.

## Open punten

Geen. Alle keuzes voor spel 2 zijn besloten (`besluiten.md` 25–37). De decorvakken zijn "goed voor nu" en kunnen later nog schuiven. Het briefje voor dag 2 is voorlopig een placeholder. Edelstenen komen alleen uit spel 2 (besluit 37); de prijzen in spel 3 moeten daarop aansluiten.
