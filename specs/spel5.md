# Spel 5 · Negotiate trade deal

**Status:** gebouwd, te beoordelen (`advent/js/spellen/spel5.js`, regels in `advent/js/spellen/markt.js`; besluiten #58–#79) · Dag 5 · 28 november · vaardigheid Charisma · rendering: SVG-DOM
Previews: `Spel5.png`, `Spel5-Onderhandel.png`, `Spel5-Klaar.png`, `Spel5-Sprites.png` · Generator: `spel5_build2.py`, `spel5_sprites.py`
Sprites nieuw: `s5-lampion s5-gloed s5-kraam-achter s5-kraam-voor s5-waar-sieraden s5-waar-fruit s5-waar-stof s5-waar-lampion s5-put s5-mat s5-kruk s5-ketting s5-stemming-twijfel (oranje, besluit 78) s5-stemming-blij s5-stemming-boos s5-praat s5-wegloop` `b-boos b-twijfel s5-stemming-verdrietig s5-kniebeschermers s5-spray s5-schoenen s5-waar-wissel` (wisselkraam = `s5-kraam-*` op 75 % met paarse luifel + `s5-waar-wissel`, besluit 69)

## Bekend uit het ontwerp
- Nachtmarkt met lampions, vier kramen (Mai en Arun boven, Siti en Minh onder), waterput. Pino loopt met D-pad (ook pijltjestoetsen).
- Bij een kraam: tekstballon-knop → onderhandelscherm met vraagprijs (ketting + munt + bedrag) en stemmingsbadge bij het portret. Bied met −/+ en de biedknop (praat + munt + bod) of loop weg. Prijzen zelf onthouden.
- Doel: de ketting met roze steen voor de laagste prijs; betalen met geld uit spel 4.
- Werker achter de waterput.

## Doel en gevoel
Pino koopt op de nachtmarkt eerst haar verjaardagssieraad en later wat ze nodig heeft voor de spellen van de komende dagen. Ze ontdekt zelf dat handelaars verschillend reageren, dat sommigen samenspannen, en dat ze met edelstenen uit de tuin (spel 2) weer geld kan krijgen. Zo hangen de spellen aan elkaar: wie verder wil, gaat terug naar de slaapzaal (spel 1) en de tuin (spel 2).

## Scherm

### Startpunt (zoals spel 4, besluit 55)
- **Nog geen ketting gekocht** → spel 5 opent direct de **markt** (ronde 1).
- **Ketting gekocht** → spel 5 opent het **productenalbum**. Daar start Pino een nieuwe marktronde.
- **Alle vier de producten gekocht** → alleen nog het album, zonder marktknop.

### Markt
Zoals `Spel5.png`: kopbalk (terug, label, titel, munt + geld), scène 358×582, D-pad links en de grote tekstballonknop rechts. Vanaf ronde 2 staat de wisselkraam in de scène (zie Regels).

### Onderhandelscherm
Zoals `Spel5-Onderhandel.png`, met het product van de ronde in plaats van de ketting: portret + stemmingsbadge, product + munt + V, stepper −/+ met het bod, wegloopknop, biedknop (praat + munt + bod).

### Productenalbum
DOM, geen scène; in de stijl van het album van spel 4 (`s4-album`), klassen `s5-album` en `s5-kaartje`.
- Kopbalk zoals in elk spel, rechts munt + geld.
- Eén witte kaart (`.kaart`). Bovenaan een slinger met rood-gele lampions (`s5-lampion`, verkleind).
- Aan de slinger hangen **vier prijskaartjes** in een 2×2-raster: witte afgeronde labels met een gaatje en een rood touwtje (`#FF5E5B`), licht scheef zoals de polaroids van spel 4. Volgorde: ketting, kniebeschermers, spray, schoenen.
- Elk kaartje toont het **productsymbool** (72 px). Er staat **niet** bij voor welk spel een product nodig is: dat ontdekt Pino zelf (besluit 72).

Toestanden van een kaartje (alleen icoon + getal, geen tekst):

| Toestand | Wanneer | Zo ziet het eruit |
|---|---|---|
| **Gekocht** | product staat in `producten` | product in kleur, groene vinkjes-stempel schuin over de hoek (`s7-stempel` / `icoon('vink')`), onderin munt + betaald bedrag |
| **Aan de beurt** | spel open, product niet gekocht, en het is het eerstvolgende niet-gekochte product | product in kleur, ronde teal **marktknop** (`s5-praat`, `aria-label` "Naar de markt"), net als de cameraknop van spel 4; start de marktronde |
| **Open, wacht** | spel open, maar een eerder product is nog niet gekocht | product in kleur, geen knop |
| **Spel nog dicht** | het deurtje van dat spel is nog dicht | product als lichtblauw silhouet (zoals de lege polaroids van spel 4), `icoon('slot')` op de plek van de knop |

Er is dus altijd hooguit één marktknop.

Voorbeeld:

| Moment | Ketting | Kniebeschermers | Spray | Schoenen |
|---|---|---|---|---|
| 28 nov, na de ketting | gekocht | dicht | dicht | dicht |
| 29 nov | gekocht | aan de beurt | dicht | dicht |
| 1 dec, kniebeschermers nog niet gekocht | gekocht | aan de beurt | open, wacht | dicht |
| 2 dec, ketting, kniebeschermers en spray gekocht | gekocht | gekocht | gekocht | aan de beurt |

**Spel 7** (zoals besluit 50; besloten, #67): als spel 7 open is, kun je op een **gekocht** kaartje tikken. Dat opent de markt in **kijkmodus**: Pino kan lopen, maar er is geen handel en geen wisselkraam. De werker achter de put is daar te vinden, ook als er geen ronde mogelijk is. Vanuit spel 7 (`#/spel/5?zoek=1`) opent het productenalbum; na de vondst gaat het spel terug naar het album van spel 7 (besluit 105).

## Regels

Begrippen: **P** = de laagst haalbare prijs van de ronde (zie hieronder), **V** = vraagprijs van een handelaar, **G** = de laagste prijs die hij accepteert, **b** = het bod van Pino. Alle bedragen zijn veelvouden van 5.

### Producten en rondes
- Een **ronde** is één bezoek aan de markt dat eindigt met het kopen van één product ("Deal!"). Ronde n verkoopt product n; alle vier de handelaars verkopen het product van die ronde.

| Ronde | Product | Nodig voor | ondergrens van P | Niveau |
|---|---|---|---|---|
| 1 | ketting met roze steen | — | 240 | Simpel (altijd) |
| 2 | kniebeschermers | spel 6 | 160 | Matig of Moeilijk |
| 3 | jungledieren-spray | spel 8 | 180 | de andere van de twee |
| 4 | sportschoenen (eigen ontwerp, geen merk of logo) | spel 9 | 200 | Simpel (nieuwe cyclus) |

- Een ronde voor een product kan pas als **het spel waarvoor het nodig is open is** (`deurOpen(dag)` uit `datum.js`; met `?test=1` alles). Wat spel 6, 8 en 9 doen zonder product, staat in hun eigen spec.
- **Niveaus** lopen in een cyclus van drie: eerst altijd Simpel, daarna Matig en Moeilijk in **willekeurige volgorde**, dan een nieuwe cyclus. De cyclus gaat pas een stap verder na een koop.
- Verlaat Pino de markt zonder te kopen, dan komt ze terug in **dezelfde ronde**: prijzen, grenzen, nee-tellers en het laatste bod per handelaar blijven bewaard. Zo kun je beledigingen niet wegpoetsen door opnieuw te beginnen, en heeft het onthouden van prijzen zin.
- Het niveau wordt **nergens getoond**; Pino merkt het aan het gedrag van de handelaars.

### De laagste prijs P (besluit 139)
- **P = het geld plus de waarde van alle edelstenen waarmee Pino aan spel 5 begint** (koers van de wisselkraam: blauw 100, groen 80, geel 60), afgerond omlaag op 5. Wie het product voor de laagste prijs wil, moet dus al haar geld uitgeven en al haar edelstenen inruilen.
- De edelstenen tellen alleen mee als de **wisselkraam** er staat (vanaf ronde 2). In ronde 1 is P dus het geld.
- P is **nooit lager dan de ondergrens** van het product (240 / 160 / 180 / 200, tabel hierboven). Heeft Pino minder, dan is P de ondergrens en lukt geen deal (zie *Te weinig geld*).
- P wordt berekend als de ronde begint en bewaard in de ronde (`ronde.p`). Inwisselen bij de wisselkraam verandert P niet (het geld gaat omhoog, de edelstenen omlaag). Heeft Pino sinds de bewaarde ronde méér verdiend (spel 2 of 4 gespeeld), dan begint bij het volgende bezoek een **nieuwe ronde op hetzelfde niveau** met de nieuwe P; stemmingen en laatste biedingen beginnen dan opnieuw.
- `prijsVoor(product, geld, edelstenen, metWissel)` in `markt.js`.

### Prijzen per niveau
Constanten in `markt.js`.

| Niveau | Vraagprijs V | Laagste prijs G | "Laagste" op het resultaatscherm |
|---|---|---|---|
| **Simpel** | goedkoopste V = P; de andere drie verschillend uit P+15 … P+60, onderling ≥ 10 uit elkaar | G = V: afdingen kan niet | P |
| **Matig** | één gedeelde V uit P+40 … P+50 | drie handelaars geven **geen korting** (G = V); één willekeurige handelaar zakt tot G = P, maar **twijfelt** zolang Pino niet eerst bij een andere handelaar is geweest; dan **komt hij naar haar toe** (besluit 79/140, zie *Matig: de twijfelende handelaar komt langs*) | P |
| **Moeilijk** | één gedeelde V uit P+40 … P+50 | **Mai** (linksboven) **óf Minh** (rechtsonder) is gastheer; Siti en Arun lopen naar hem toe. Die drie spannen samen met dezelfde grens K = P+20 of P+25. De vierde (Minh of Mai) spant niet samen en zakt tot B = P | P |

- **Ronde 1 (ketting):** voor die eerste ronde is spel 4 de enige geldbron (maximaal 100 + 80 + 60 = 240), dus P = 240: goedkoopste V = 240, de andere drie uit 255–300. Pino kan de ketting alleen kopen als alle drie de families op de foto staan én ze de goedkoopste kraam vindt. Daarna heeft ze 0 munten.
- Welke handelaar welke prijs of grens krijgt (en wie gastheer is), wordt per ronde willekeurig bepaald.

### Te weinig geld
De stepper gaat nooit hoger dan het geld. Is het geld plus de waarde van de edelstenen lager dan de ondergrens van het product, dan lukt geen enkele deal. Er komt geen tekst: Pino moet zelf ontdekken dat ze terug moet (spel 3/4 in ronde 1, daarna spel 1 → 2 en de wisselkraam). De ronde blijft bewaard.

### Bieden
- **Stemming** (besluit 77): de badge bij het portret én het gezicht van de handelaar (in het portret en in de scène) tonen hoe hij zich voelt: **blij** (`s5-stemming-blij`, `b-blij`) zolang er niets is afgewezen, **verdrietig** (blauwe smiley `s5-stemming-verdrietig`, `b-bedroefd`) na het eerste afgewezen lagere bod, **boos** (rode smiley `s5-stemming-boos`, `b-boos`) vanaf het tweede. **Alleen in Matig** (besluit 79): de handelaar die korting geeft **twijfelt** zodra Pino genoeg biedt (een bod van P of hoger, maar onder V): oranje smiley `s5-stemming-twijfel` en gezicht `b-twijfel` (één wenkbrauw omhoog, scheve mond). Dat is een nee die niet meetelt en hem niet verdrietiger maakt. Hij blijft twijfelen tot hij naar Pino toe is gekomen (besluit 140). De stemming blijft de hele ronde, ook na weglopen en terugkomen; bij een deal wordt hij weer blij.
- Het onderhandelscherm opent met de huidige stemming (de eerste keer blij). Het bod staat op het laatste bod bij deze handelaar, of anders (de eerste keer) op de **vraagprijs V** (besluit 76), maar nooit hoger dan het geld. Pino moet dus zelf omlaag met −.
- De stepper −/+ gaat in **stappen van 5**, en vasthouden herhaalt. Het bereik is 5 … min(V, geld): boven de vraagprijs bieden kan niet.
- Uitkomst van een bod b bij een handelaar met grens G:
  - **Matig, de handelaar met korting:** een bod tussen P en V → twijfel (zie boven), elke keer, tot hij langs is gekomen. Een bod onder P is een gewone nee. Is hij langs geweest, dan is zijn vraagprijs P: een bod van P is ja, elk lager bod maakt hem boos (zie hieronder).
  - **b ≥ G → ja.** De badge wordt blij, Pino betaalt b en de ronde is klaar → resultaatscherm.
  - **b < G → nee.** De handelaar schudt kort zijn hoofd en wordt verdrietig (eerste keer) of boos (daarna) De nee-teller van die handelaar gaat +1.
- **Beledigd:** na de derde nee blijft de badge boos en accepteert de handelaar in deze ronde alleen nog b = V (de stepper springt naar V; lager bieden geeft nee/boos). Kan Pino V niet betalen, dan is deze handelaar die ronde af. De teller zelf is onzichtbaar.
- **Simpel:** dezelfde regel met G = V, dus elk lager bod is nee. Beledigd zijn verandert in Simpel niets aan de prijs.
- **Moeilijk, samenzweerders:** grens G = K, verder zoals hierboven.
- **Moeilijk, de vierde (die niet samenspant):**
  - b ≥ K → direct ja, net als de anderen.
  - B ≤ b < K → de eerste keer **nee** (hij wordt wel verdrietig of boos), maar dat telt niet mee voor de nee-teller. Is het **volgende bod bij hem precies hetzelfde**, dan zegt hij **ja**. "Nog een keer vragen" is dus hetzelfde bod nog een keer doen; er is geen extra knop.
  - b < B → gewone nee (telt mee).
- De wegloopknop sluit het onderhandelscherm; Pino staat weer op de markt bij de kraam.

### Samenspannen zichtbaar (alleen Moeilijk, besluit 74 en 75)
- Het samenzweren gebeurt **maar één keer per ronde**: pas nadat Pino ergens een bod lager dan de vraagprijs heeft gedaan dat werd afgewezen (bij welke handelaar dan ook). Zodra het onderhandelscherm dicht is, begint het na 0,8 s. Daarvóór en daarna lopen er geen handelaars weg; ook niet na weglopen en terugkomen (`ronde.lagerBod` en `ronde.samengezworen` worden bewaard).
- Dan lopen de twee bezoekers (Siti en Arun) naar de kraam van de gastheer, met 100 px/s:
  - **Gastheer Mai** (linksboven): Arun loopt achter zijn toonbank langs naar buiten en dan naar rechts naast Mai's kraam; Siti loopt achter haar toonbank langs naar buiten en dan omhoog tot vóór Mai's toonbank.
  - **Gastheer Minh** (rechtsonder): Siti loopt naar links naast Minh's kraam; Arun loopt omlaag tot vóór Minh's toonbank.
- Zodra ze er allebei zijn, praten ze met z'n drieën 2,4 s met een **boos gezicht** (`b-boos`: gefronste wenkbrauwen, mondhoeken omlaag, rode wangen); de bezoekers kijken naar de gastheer en om de beurt wippen ze even op en neer. Daarna lopen de bezoekers dezelfde weg terug.
- Onderweg staan ze in de gesorteerde laag, dus netjes voor of achter de put, het krukje, de lantaarnpaal en Pino. Er is geen tekstwolk.
- Zolang het samenzweren duurt, kan Pino met geen van de drie praten (de tekstballonknop is dan niet actief). De vierde blijft gewoon achter zijn toonbank en is altijd aanspreekbaar.
- In Simpel en Matig lopen er nooit handelaars weg; dat verschil is zelf de aanwijzing.
- Tijdens het onderhandelscherm staat alles stil.

### Wisselkraam (vanaf ronde 2)
- De wisselkraam staat er zodra de ketting gekocht is (`producten` bevat `ketting`), dus bij elke ronde na de eerste. In kijkmodus staat hij er niet.
- **Plek:** op de plaats van de onderste mat, midden onderaan in de scène. Het is dezelfde kraam op 75 % met een paarse luifel en de waar `s5-waar-wissel` (weegschaal, kist met munten, edelsteentjes), met een vijfde handelaar (de wisselaar, met bril) erachter, gebouwd met `persoon()`.
- **Interactie:** Pino loopt erheen, de tekstballon wordt actief, en een tik opent het bestaande **taartmenu** (`toonTaartmenu` in `ui/taartmenu.js`). Het menu heeft drie opties met het `gem`-symbool in blauw, groen en geel, elk met een aantal-badge. Een optie met 0 stenen is grijs.
- **Ruilen:** één tik ruilt **één** edelsteen. Er springt een badge "munt + bedrag" naar de munt-teller in de kopbalk. Het menu blijft open tot Pino buiten tikt.
- **Vaste koers** zonder onderhandeling: **blauw 100, groen 80, geel 60**. De koers staat nergens; Pino ontdekt hem aan de teller.
- Pino kiest in spel 2 zelf welke edelsteen ze oogst. Wie de koers kent, oogst blauw. Ook dat is te ontdekken.

### Producten zichtbaar, maar niet aan te klikken
- In elke ronde liggen de producten van **latere** rondes klein (±60 %) bij een vaste kraam, decoratief en `aria-hidden`:
  - kniebeschermers bij Siti (stofkraam);
  - spray bij Minh;
  - schoenen bij Arun;
  - Mai houdt de sieraden. (besloten, #66)
- Vanaf de eigen ronde ligt het product vooraan op de toonbank van **alle vier** de kramen. Gekochte producten verdwijnen van de kramen.

### Matig: de twijfelende handelaar komt langs (besluit 140)
- Heeft de handelaar met korting getwijfeld en **beëindigt Pino daarna een gesprek met een andere handelaar** (weglopen), dan stopt **na 1000 ms** de besturing (D-pad, joystick, toetsen en de tekstballon).
- De twijfelende handelaar **loopt naar Pino toe**: achter zijn toonbank langs naar buiten en dan om de put, het krukje, de lantaarnpaal, de kramen en de wisselkraam heen (route over een raster, rechtgetrokken), met het twijfelgezicht. Zijn kraam is zolang leeg.
- Hij ziet er **gehaast** uit (besluit 141): hij loopt sneller (135 i.p.v. 100 px/s), wipt sneller en hoger, leunt 9° voorover in de looprichting, er vliegen zweetdruppels (`#8ED8F8`) van zijn hoofd en er blijven stofwolkjes (`s9-stof`) achter bij zijn voeten. Boven zijn hoofd staat een wit **tekstwolkje "miss! miss! wait!"** (Fredoka 700, 12 px, schaduw `#CDE4F0`, met een puntje naar hem toe; binnen de scène gehouden). Het wolkje verdwijnt zodra hij bij Pino staat. Teruglopen gaat in gewoon tempo, zonder wolkje. Met *reduced motion*: geen wippen, kantelen, druppels of stof, wel het wolkje.
- Staat hij naast haar, dan draait Pino naar hem toe en **opent het onderhandelscherm opnieuw**, met hem. Zijn **vraagprijs is nu alles wat Pino heeft**: haar geld plus de waarde van de edelstenen die ze nog niet heeft ingeruild (= P van de ronde, besluit 139). Heeft ze nog niet ingeruild, dan reikt de stepper niet tot die vraagprijs.
- **Bod = vraagprijs → deal.** Elk **lager bod → boos** (rode smiley en gezicht): hij gaat terug naar zijn oude vraagprijs V en doet niet meer mee. Met wat Pino heeft lukt deze ronde dan geen deal meer; pas als ze meer verdient (spel 2 of 4) begint bij een volgend bezoek een nieuwe ronde (besluit 139).
- **Weglopen** (zonder bod) kan: hij loopt terug naar zijn kraam en Pino kan meteen weer lopen. Daar staat hij met dezelfde vraagprijs (alles wat ze heeft), dus ze kan eerst inruilen en dan bij zijn kraam betalen.
- Hij komt **één keer** per ronde, alleen na een gesprek met een andere handelaar (niet met hemzelf, niet met de wisselaar). Verlaat Pino de markt in de seconde vóór hij vertrekt, dan komt hij niet; dat gebeurt dan na een volgend gesprek met een ander.
- Staat: `gekomen` en `oudeV` bij die handelaar in `ronde.handelaars`; `moetKomen` en `komBij` in `markt.js`.

### Voorbeeldrondes
- **Ronde 1 · Simpel · ketting** (geld 240): Mai 270, Arun 240, Siti 295, Minh 255. Bij Mai kan de stepper niet hoger dan 240 → nee/boos (30 eronder). Bij Arun 240 → ja. Betaald 240, laagste 240, over 0.
- **Ronde 2 · Matig · kniebeschermers** (29 nov): Pino begint met 0 munten en twee groene edelstenen → P = 160. Ze ruilt ze in → 160. V = 200 bij iedereen; Mai, Arun en Siti geven geen korting (G = 200), Minh zakt tot 160. Bij Arun: 160 → nee/verdrietig; 150 → nee/boos. Bij Minh: 160 → nee/twijfel (telt niet); nog eens 160 → weer twijfel. Pino loopt weg en praat met Arun; ze loopt weg. Na 1 s staat ze stil en Minh loopt naar haar toe; het scherm opent met vraagprijs 160. 160 → ja (blij). Betaald 160, laagste 160, over 0. (Had ze 155 geboden, dan was Minh boos geworden en terug naar 200 gegaan.) Met 160 munten kan ze bij de andere drie niets kopen.
- **Ronde 3 · Moeilijk · spray** (1 dec): Pino begint met 0 munten, één groene en één blauwe edelsteen → P = 180. V = 225; gastheer Mai, Siti en Arun komen bij haar langs; die drie spannen samen met K = 200. Minh doet niet mee, B = 180. Bij Mai: 185 → nee/verdrietig; 200 → ja. Bij Minh: 180 → nee/verdrietig (telt niet); 180 → ja. Of: 175 → nee/verdrietig (telt wel; 5 onder B).
- **Ronde 4 · Simpel · schoenen** (2 dec): Pino begint met 20 munten, één blauwe en twee gele edelstenen → P = 20 + 100 + 120 = 240 (boven de ondergrens 200). Goedkoopste V = 240, de andere drie bv. 255, 275, 300.
- **Te weinig:** 0 munten en één gele edelsteen bij de schoenen → 60 < 200, dus P = 200 en geen enkele deal lukt.

## Besturing
- Telefoon, zoals spel 1 (besluiten 23, 24 en 71): vasthouden op het scherm laat na 250 ms de joystick verschijnen (ring met knop op de drukplek, richting én kracht); een korte tik doet hetzelfde als de tekstballonknop.
- Daarnaast de D-pad (vasthouden = lopen, `invoer.js`) en pijltjestoetsen/WASD; Pino loopt 120 px/s (scène-eenheden) en botst tegen toonbanken, put, krukje, lantaarnpaal en wisselkraam.
- De grote tekstballonknop is alleen actief als Pino vóór een toonbank staat (of vóór de wisselkraam); spatie/Enter doet hetzelfde.
- Onderhandelscherm: −/+ per 5, vasthouden herhaalt; pijltjestoetsen verhogen/verlagen; Escape = weglopen.

## Staat
- **In:** `geld`, `edelstenen`, `producten`, `markt`, `werkers[5]`.
- **Uit:** `geld`, `edelstenen` (wisselkraam), `producten`, `markt`, `scores[5]`, `rondSpelAf(5, …)`.
- **Nieuw veld `producten: []`** bovenaan in de staat (`'ketting' | 'kniebeschermers' | 'spray' | 'schoenen'`). Spel 6, 8 en 9 lezen dit.
- **Nieuw veld `markt`** in `staat.js` (`legeStaat` + `migreer`):
  ```
  markt: {
    cyclus: ['simpel', 'moeilijk', 'matig'],   // altijd simpel eerst
    stap: 0,                                    // index in cyclus
    ronde: null | {
      product: 'kniebeschermers',
      niveau: 'matig',
      k: null,                                  // alleen Moeilijk: kartelgrens
      gastheer: null,                           // alleen Moeilijk: 'mai' of 'minh'
      samenzweerders: [],                       // alleen Moeilijk: ['mai', 'siti', 'arun'] of ['minh', 'siti', 'arun']
      korting: null,                            // alleen Matig: de handelaar die tot P zakt
      lagerBod: false,                          // alleen Moeilijk: er is een bod onder de vraagprijs afgewezen
      samengezworen: false,                     // alleen Moeilijk: het samenzweren is al gebeurd (één keer per ronde)
      handelaars: { mai: { v, g, nee, afgewezen, twijfelt, getwijfeld, gekomen, oudeV, laatsteBod, vrijeNee, beledigd }, arun: {…}, siti: {…}, minh: {…} }
    }
  }
  ```
  `vrijeNee` = het laatste bod bij een handelaar die niet samenspant was een nee die niet meetelde (het volgende gelijke bod wordt ja).
- **Nieuw: `wisselEdelsteen(kleur)`** in `staat.js`: als `edelstenen[kleur] > 0`, dan −1 en `geld + KOERS[kleur]`.
- **Bij een deal:**
  - `producten.push(product)` en `wijzigGeld(-b)`;
  - `scores[5][product] = { betaald: b, laagste: P }` (het album toont `betaald`);
  - `rondSpelAf(5, { vaardigheid: 'charisma' })`: de eerste keer is dat de ketting;
  - `stap + 1` (bij 3: nieuwe cyclus, stap 0) en `ronde = null`.
- **Spellogica zonder DOM** in `advent/js/spellen/markt.js`:
  - `PRODUCTEN`, `KOERS`, `nieuweCyclus(rnd)`, `maakRonde(product, niveau, rnd)`, `bied(ronde, id, bod, geld) → { ja, stemming, ronde }`;
  - `albumToestand(staat, nu) → [{ product, toestand }]`.
  - `rnd` is in te voeren zodat de logica met een vaste seed te testen is.

## Resultaatscherm
Zoals `Spel5-Klaar.png`, met het product van de ronde in de bol: "Deal!", Pino en de handelaar met blije badge (Pino blij met beide handen langs haar zij: `pino-staan`, niet de uitgestoken arm van `pino-vinger`; Benjamin, 12 november), tegels **Betaald / Laagste / Over** (munt + getal) en de verdiende vaardigheid (alleen de eerste keer).
- Knoppen: "Terug naar de kalender", en "Nog een keer" alleen als de volgende ronde al kan (het volgende product is "aan de beurt"). Die knop start dan direct de markt.
- Geen zin die verraadt of het de laagste prijs was, en geen niveau-aanduiding.

## Geen uitleg
Uitzondering (besluit 141): het tekstwolkje "miss! miss! wait!" van de handelaar die in Matig naar Pino toe rent; dat is wat hij roept, geen uitleg. Verder: geen niveaunaam, geen teller voor het aantal biedingen, geen tekst bij "nee", bij het samenspannen of bij de wisselkraam (geen koers). In het album geen productnamen en geen datums: alleen productsymbool, stempel, slot en munt + bedrag; geen deurtje-icoon of andere aanwijzing voor welk spel een product is. Alleen de badge (blij/twijfel/boos), de hoofdschud-animatie, de wolkjes en de munt-teller vertellen iets.

## Toegankelijkheid
- Kaartjes in het album zijn `role="img"` met `aria-label` (bv. "Kniebeschermers, gekocht, 160 munten" of "Spray, op slot"); de marktknop is een `<button>`.
- Opties in het wisseltaartmenu: `aria-label` bv. "Blauwe edelsteen, 2"; leeg = `aria-disabled`.
- Decoratieve producten bij de kramen zijn `aria-hidden="true"`.
- Scène: `role="img"` met `aria-label`; D-pad-knoppen en de tekstballon hebben een `aria-label` ("Praat met de handelaar" / "Edelstenen ruilen"); het onderhandelscherm is een dialoog met focus-val.

## Acceptatiecriteria
- [x] Zonder ketting opent spel 5 de markt; met ketting het album; met alle vier alleen het album zonder marktknop.
- [x] Album: de toestand van elk kaartje klopt voor 28 nov, 29 nov, 1 dec, 2 dec en "alles gekocht" (zie het voorbeeld); er is hooguit één marktknop.
- [x] Een ronde kan alleen voor het eerstvolgende product, en alleen als het deurtje van zijn spel open is.
- [x] De eerste ronde is Simpel; rondes 2 en 3 zijn samen precies {Matig, Moeilijk}; ronde 4 is weer Simpel.
- [x] Ronde 1: met 240 munten kan alleen de kraam met V = 240; met minder kan geen enkele kraam.
- [x] Simpel: vier verschillende vraagprijzen; elk bod onder V wordt geweigerd; bieden op V lukt.
- [x] Matig: alle vier dezelfde V; drie handelaars weigeren alles onder V; de vierde twijfelt bij elk bod tussen P en V (telt niet mee). Na een gesprek met een andere handelaar stopt na 1 s de besturing, loopt hij naar Pino toe en opent het scherm met vraagprijs P; P → deal, lager → boos en terug naar V (geen deal meer); weglopen → hij loopt terug en Pino kan weer lopen. Hij komt maar één keer.
- [x] Moeilijk: de drie samenzweerders (gastheer Mai of Minh, plus Siti en Arun) accepteren K en weigeren K − 5; de vierde weigert een bod tussen B en K de eerste keer en accepteert hetzelfde bod direct daarna; een bod onder B blijft nee.
- [x] Stemming: blij bij het eerste openen, verdrietig (blauw) na het eerste afgewezen bod, boos (rood) daarna, in Matig twijfel (oranje) bij een genoeg-bod aan de handelaar met korting (ook tijdens het aanlopen), blij bij een deal; het gezicht in het portret en in de scène hoort er steeds bij.
- [x] Na drie keer nee accepteert een handelaar alleen nog V; de "vrije" nee van wie niet samenspant telt niet mee.
- [x] Alleen in Moeilijk lopen Siti en Arun naar de kraam van de gastheer (Mai of Minh) en praten ze daar met z'n drieën boos; de vierde blijft staan. Zolang dat duurt, kan Pino met geen van de drie praten. Het gebeurt één keer per ronde, pas na het eerste afgewezen bod onder de vraagprijs.
- [x] Weglopen en terugkomen (ook via de kalender) houdt prijzen, grenzen en nee-tellers vast.
- [x] Wisselkraam: pas vanaf ronde 2; één tik = één steen; blauw +100, groen +80, geel +60; een kleur met 0 stenen is grijs.
- [x] Latere producten liggen klein bij hun kraam en reageren nergens op; het product van de ronde ligt op alle vier de toonbanken.
- [x] Na een deal: `producten` uitgebreid, `geld` met b verlaagd, de tegels tonen het juiste betaald / laagste / over.
- [x] Nergens tekst die het niveau, de koers of de regels uitlegt.

## Test-URL's
- `?test=1&reset=1&vul=1#/spel/5` — ronde 1 (ketting) met 240 munten en 3/3/3 edelstenen.
- `?test=1&niveau=matig#/spel/5` — dwingt het niveau van de lopende ronde af (`simpel`, `matig`, `moeilijk`; alleen in testmodus).
- `?dag=6#/spel/5` (na de ketting) — album met de kniebeschermers aan de beurt en spray/schoenen op slot; `?dag=5` laat alles behalve de ketting op slot zien.
- `window.pinoDebug` (testmodus): `ronde` (prijzen en grenzen) en `pino` (positie).

## Open punten
Zie `besluiten.md`.
- Alle keuzes voor spel 5 zijn besloten (Benjamin, 10 november). Bij tegenstrijdigheid zijn #77 (stemming) en #79 (Matig) leidend.
- Nog te doen: de artboards `Spel5*.dc.html` en de previews opnieuw maken met de nieuwe sprites (producten, wisselkraam, smileys, gezichten).
- Gevolg voor spel 6: geen. De dief in spel 6 wil de ketting, niet het geld (besluit 80; `spel6.md`).
