# Pino's kamer · verzamelde spullen

**Status:** gebouwd, te beoordelen (22 november) · onderdeel van de kalender (geen deurtje, geen spel) · besluiten #201–#207 · rendering: SVG-DOM
Previews: `Kamer.png` (vol, met de gedachtenwolk), `Kamer-Leeg.png` (verse staat), `Kamer-Sprites.png` · Artboards: `Kamer.dc.html`, `Kamer-Leeg.dc.html`, `Kamer-Sprites.dc.html` · Generator: `kamer_build.py` (artboards), `kamer_sprites.py` (symbolen en bouwstenen), `kamer_assets.py` (naar `assets/sprites`)
Code: `advent/js/kamer.js` (scherm), `advent/js/kamer-inhoud.js` (welke voorwerpen, zonder DOM), `advent/data/kamer.json` (teksten), `advent/css/kamer.css` · Route `#/kamer`
Sprites: bestaande symbolen van spel 1–10 + de kamerset `km-*` (`assets/sprites/kamer.svg`, ook in `sprites.svg`; zie Scène).

## Doel en gevoel

Pino heeft een eigen kamer, zoals een Sim een eigen huis heeft. Op 24 november staan er alleen een bed, een raam en een kleedje, en Pino zelf. Alles wat ze verzamelt en elk spel dat ze speelt, laat iets achter in de kamer: knuffels op het bed, de ketting aan de spiegel, foto's aan de muur, een lampion aan het plafond. Op 3 december is de kamer vol en feestelijk. Tikt Pino op een voorwerp, dan krijgt ze een lieve, korte omschrijving met een knipoog naar het spel waar het vandaan komt (idee van Benjamin, besluit 204).

De kamer hoort bij de kalender en is geen spelscherm: tekst mag (zie `CLAUDE.md`). Toch verklapt de kamer niets van de verborgen verbanden (besluit 205): geen lege plekken of silhouetten voor wat nog komt, en een omschrijving zegt nooit waar iets voor dient.

## Ingang

- **Knop op de Sim-kaart** van de kalender (mobiel en desktop), rechtsboven in de kaart: ronde knop 44 px, wit met teal ring, huisje-icoon `km-huisje` (30 px), `aria-label="Pino's kamer"`. Tik → `#/kamer`.
- **Glinster-badge** (besluit 205): staat er in de kamer iets wat Pino nog niet gezien heeft, dan krijgt de knop rechtsboven een kleine gele ster `km-ster` (`#FFC93C`, rand `#D97A00`, 16 px, 4 px buiten de rand) die zacht pulseert (met *reduced motion*: stil). Na een bezoek aan de kamer is hij weg tot er weer iets bij komt.
- Geen andere ingangen (niet in het taartmenu, niet vanaf het resultaatscherm).

## Scherm

Mobiel 390×844, op desktop gecentreerd met dezelfde breedte (max 420 px) op de vloer-achtergrond.

1. **Kopbalk** (`ui/kopbalk.js`): terugknop (→ `#/`, vervangt de geschiedenis niet), label `PINO'S KAMER`, titel **Mijn Kamer** (besluit 206).
2. **Scène**: één SVG, viewBox `0 0 358 560`, breedte 358 px (schaalt mee tot de schermbreedte), `role="img"`, `aria-label="Pino's kamer"`. Afgeronde hoeken 22 px en de kaartschaduw `0 6px 0 0 #CDE4F0`.
3. **Gedachtenwolk** onder de scène (verborgen tot Pino ergens op tikt): een witte kaart in de stijl van het "Morgen…"-wolkje van de kalender (afgerond 22 px, twee witte stipjes die naar boven wijzen, naar het voorwerp toe). Inhoud: links het voorwerp groot (56 px, dezelfde sprite en kleur als in de kamer), rechts de **naam** (Fredoka 700, 18 px, `#1E3A4C`) en de **omschrijving** (Nunito 400, 15 px, `#35505F`, regelafstand 1,4). Geen knoppen in de wolk.

Er is geen tekst in de scène zelf en geen teller boven de scène.

## Scène

Poppenhuisstijl (zie `CLAUDE.md`), in dezelfde opbouw als de slaapzaal van spel 1: een achterwand met behang en plint, daarvoor een houten vloer met planklijnen, meubels in 3/4-aanzicht, platte vlakken, één schaduwtint per kleur, licht van linksboven, tekenvolgorde van achter naar voor. Muur en vloer tekent de scène zelf (geen symbool); al het andere zijn `<use>`-sprites.

**Vaste delen** (exacte posities in `design/generators/kamer_build.py`, `kamer_scene()`; viewBox 358×560):

| Wat | Positie (x, y, b × h) | Sprite / tekening |
|---|---|---|
| achterwand: zachtgeel `#FFF1D6` met stipjes `#FFE08A` (patroon 24 px, r 2,5) (besluit 206) | 0, 0, 358 × 196 | `<rect>` + `<pattern>` |
| plint | 0, 192, 358 × 8 | `<rect>` `#C98B5A` |
| vloer `#F6EBDD` met planklijnen elke 36 px vanaf y 236 (`#C2743C`, 2 px, 35 %) | 0, 200, 358 × 360 | `<rect>` + `<line>`s |
| raam | 147, 22, 64 × 52 | `raam` (spel 1) |
| twee haakjes | 276, 58 en 314, 58, 12 × 14 | `km-haak` |
| wandplank onder het raam | 112, 124, 150 × 18 | `km-plank` |
| kaptafel met ronde spiegel | 8, 74, 96 × 130 | `km-kaptafel` |
| nachtkastje | 194, 196, 44 × 52 | `km-nachtkastje` |
| bed met roze deken (besluit 206) | 238, 164, schaal 1,6 (102 × 134) | `bed-onder` + `bed-deken` (kleur `#FF6FAE`) |
| kleedje | 96, 330, 150 × 75 | `kleedje` (spel 1) |
| Pino (decor, niet aanklikbaar; besluit 206) | 146, 300, schaal 1,25 | `pino-staan` |
| lage tafel | 14, 456, 128 × 64 | `km-tafel` |

Nieuwe symbolen (`kamer_sprites.py`, `EXTRA_KAMER`): `km-plank`, `km-haak`, `km-kaptafel`, `km-nachtkastje`, `km-tafel`, `km-spaarvarken`, `km-bordje` (4×4 vakken in de kleuren van spel 8), `km-stetho` (liggende stethoscoop; `s9-stetho` hoort om Pino's nek), `km-huisje` (icoon van de kamerknop) en `km-ster` (glinster-ster). Bouwstenen in Python, straks te porten naar `kamer.js`: `foto(familie)` (polaroid `s4-polaroid` met de omgeving en de familie uit spel 4), `poppetje()`, `schaakbord(levels)` en `tegelstapel()`.

Op 3 december (na de finale) hangt de **slinger** over de hele bovenrand van de muur en zweven er **ballonnen** boven de tafel; de vloer en de wand veranderen niet. Meubels, haakjes en de lege plank staan er altijd: dat zijn meubels, geen lege plekken voor iets wat nog komt.

## Voorwerpen

Een voorwerp staat in de kamer zodra de voorwaarde in de kolom **Zichtbaar** waar is. Wat nog niet zichtbaar is, wordt helemaal niet getekend: geen lege haakjes met een vraagteken, geen grijze vormen (besluit 205). Meubels, raam, kleedje en Pino staan er altijd.

Twee soorten:
- **Verzameld**: komt rechtstreeks uit de staat en kan ook weer verdwijnen als het verbruikt wordt (tegels, edelstenen, geld; besluit 202).
- **Aandenken**: één per gespeeld spel, blijft voor altijd (besluit 203).

| # | Spel | Voorwerp | Soort | Bron in de staat | Zichtbaar | Plek | Sprite (kleur) |
|---|---|---|---|---|---|---|---|
| 1 | 1 | nachtlampje | aandenken | `deurtjes[1] === 'gespeeld'` | na spel 1 | nachtkastje (196, 166, 22 × 30) | `nachtlamp` |
| 2 | 1 | tegels, één stapeltje per type | verzameld | `tegels["groen-vogel"]` enz. (9 typen) | aantal > 0 | vaste plek per type in een honingraat vooraan rechts op de vloer: achterste rij (y 482) groen-vlinder, groen-boom, groen-vogel, geel-vlinder, geel-boom op x 196…340; voorste rij (y 516) geel-vogel, blauw-vlinder, blauw-boom, blauw-vogel op x 214…322 | `tegelstapel()`: `hx-tegel` (34 px, kleur van spel 1) + `m-vlinder`/`m-boom`/`m-vogel`, tot drie hoog |
| 3 | 2 | boeddhabeeldje | aandenken | `deurtjes[2]` gespeeld | na spel 2 | wandplank (118, 96, 22 × 28) | `s2-boeddha` |
| 4 | 2 | edelstenen groen, blauw, rood (drie losse voorwerpen) | verzameld | `edelstenen.groen` / `.blauw` / `.rood` | aantal > 0 | op de kaptafel: groen (14, 131), blauw (33, 131), rood (66, 131), 18 px | `gem` (kleuren uit `ui/edelstenen.js`) |
| 5 | 3 | lammetje, gansje, biggetje (knuffels) | verzameld | `karakters` bevat `lam` / `gansje` / `biggetje` | gekocht | op de deken: lam (244, 220), gansje (274, 230), biggetje (304, 220), schaal 0,58 | `d-lam`, `d-gansje`, `d-biggetje` |
| 6 | 3 | poppetje (het meisje) | verzameld | `karakters` bevat `meisje` | gekocht | op het kussen (281, 180), schaal 0,5 | `poppetje()`: `persoon(…, { kind: true })` zoals in spel 3 (jurk `#5BC0EB`, blond lang haar) |
| 7 | 3 | miniatuurhuisje | aandenken | `deurtjes[3]` gespeeld; vorm volgt `familie` | na spel 3 | wandplank (142, 91, 48 × 33) | `huis-villa` (nguyen) / `huis-paal` (tan) / `huis-shop` (somchai) |
| 8 | 4 | foto's, één per gefotografeerde familie | verzameld | `fotos` (`tan`, `nguyen`, `somchai`) | gefotografeerd | linksboven op de muur, vaste volgorde Tan, Nguyễn, Somchai op x 6, 51, 96, schaal 0,34, licht scheef (−4°, 3°, −2°) | `foto(familie)`: `s4-polaroid` + strand / berg / dagmarkt + de familie |
| 9 | 4 | fototoestel | aandenken | `deurtjes[4]` gespeeld | na spel 4 | wandplank (194, 104, 26 × 20) | `s4-camera` |
| 10 | 4 | spaarvarken | verzameld | `geld` | geld > 0 | vloer voor het nachtkastje (198, 262, 34 × 27) | `km-spaarvarken` |
| 11 | 5 | ketting met roze steen | verzameld | `producten` bevat `ketting` | gekocht | aan de spiegel (39, 78, 34 × 34) | `s5-ketting` |
| 12 | 5 | kniebeschermers | verzameld | `producten` bevat `kniebeschermers` | gekocht | rechter haakje (303, 66, 34 × 34) | `s5-kniebeschermers` |
| 13 | 5 | jungledieren-spray | verzameld | `producten` bevat `spray` | gekocht | wandplank (219, 98, 26 × 26) | `s5-spray` |
| 14 | 5 | sportschoenen | verzameld | `producten` bevat `schoenen` | gekocht | vloer voor het bed (296, 296, 34 × 34) | `s5-schoenen` |
| 15 | 5 | lampion | aandenken | `deurtjes[5]` gespeeld | na spel 5 | aan een draadje van boven, rechts van het raam (220, 26, 24 × 34) | `s5-lampion` (`#FF6FAE`) + `s5-gloed` |
| 16 | 6 | gi | aandenken | `deurtjes[6]` gespeeld | na spel 6 | linker haakje (262, 64, 40 × 40) | `s6-gi` |
| 17 | 7 | vergrootglas | aandenken | `deurtjes[7]` gespeeld | na spel 7 | tafel (112, 454, 26 × 26) | `s7-loep` |
| 18 | 7 | beeldje van de werker | verzameld | aantal `true` in `werkers` | deurtje 7 open of gespeeld **en** ≥ 1 gevonden | wandplank, rechts (245, 101, 18 × 23) | `werker` (spel 4) |
| 19 | 8 | schaakbordje met de dieren die Pino te slim af was | verzameld | `levels.gehaald` | ≥ 1 level gehaald | tafel (20, 446) | `schaakbord(levels)`: `km-bordje` + per gehaald level het stuk van dat level: 1 `s8-stuk-python`, 2 `s8-stuk-tijger`, 3 `s8-stuk-luiaard`, 4 `s8-stuk-leeuw`, 5 `s8-stuk-krokodil` |
| 20 | 9 | stethoscoop | aandenken | `deurtjes[9]` gespeeld | na spel 9 | nachtkastje (214, 184, 24 × 16) | `km-stetho` |
| 21 | 10 | verjaardagstaart | aandenken | `deurtjes[10]` gespeeld | na de finale | tafel (80, 428, 38 × 38) | `s10-taart` |
| 22 | 10 | ballonnen en slinger | aandenken | `deurtjes[10]` gespeeld | na de finale | ballonnen boven de tafel (x 8/32/56, y 376/362/380, 28 × 49), slinger twee keer over de bovenrand van de muur | `s10-ballon` (`#FF6FAE`, `#FFC93C`, `#1FA3DC`) + `s10-slinger` |

Tegels in de kamer: sinds besluit 200 ziet Pino in spel 1 al dat er een tegel uit de deken vliegt. Daarom mogen ze meteen na spel 1 in de kamer staan; waar ze voor dienen, zegt de kamer niet. Van de werker weet Pino pas vanaf spel 7 (`CLAUDE.md`), dus het beeldje verschijnt pas als deurtje 7 open is, ook als de staat (bijvoorbeeld via `?vul=1`) al gevonden werkers bevat.

Wordt iets verbruikt (tegels in spel 2, edelstenen in spel 3 of bij de wisselkraam, geld in spel 5), dan staat er bij het volgende bezoek minder of verdwijnt het. Een stapeltje tegels is hooguit drie tegels hoog getekend; het echte aantal staat in de omschrijving.

## Omschrijvingen

Bij elk voorwerp hoort een **naam** en een **omschrijving** van één of twee korte zinnen: warm, een beetje grappig, met een knipoog naar het spel, maar nooit waar het voorwerp voor dient en nooit een aanwijzing hoe een spel werkt (besluit 205). Waar er een aantal is, komt dat in een losse slotzin.

Alle teksten staan in `advent/data/kamer.json`, zodat ze zonder code aan te passen zijn. Plaatshouders: `{n}` (aantal), `{kleur}` en `{figuur}` (tegels). De slotzin met het aantal komt er alleen bij als het aantal 2 of meer is.

**Teksten** (Benjamin heeft namen en omschrijvingen aan Claude overgelaten, besluit 206):

| Voorwerp | Naam | Omschrijving |
|---|---|---|
| nachtlampje | Nachtlampje | Een nachtlampje uit de slaapzaal. Het geeft precies genoeg licht om te zien wie er stiekem gaapt. |
| tegel | Tegel | Een tegel met een mooie {kleur} kleur en een witte {figuur} erop. Doet je denken aan een spel wat je eerder gespeeld hebt. · aantal: Je hebt er {n}. ({kleur}: groene / gele / blauwe; {figuur}: vogel / vlinder / boom) |
| boeddhabeeldje | Boeddhabeeldje | Een klein beeldje uit de tuin van de koningin. Hij glimlacht altijd, ook als het even tegenzit. |
| groene edelsteen | Groene edelsteen | Een glimmende groene edelsteen. Als je hem tegen het licht houdt, zie je een heel klein bos. · aantal: Je hebt er {n}. |
| blauwe edelsteen | Blauwe edelsteen | Een blauwe edelsteen, zo helder als de zee op een zonnige dag. · aantal: Je hebt er {n}. |
| rode edelsteen | Rode edelsteen | Een rode edelsteen die fonkelt als een verjaardagskaarsje. · aantal: Je hebt er {n}. |
| lammetje | Lammetje | Een zacht, wollig lammetje. Als je heel goed luistert, hoor je een piepklein mèèh. |
| gansje | Gansje | Een gansje met een eigenwijze blik. Het waggelt achter je aan, of je nu wilt of niet. |
| biggetje | Biggetje | Een roze biggetje met een krulstaartje. Het liefst ligt het lekker in de modder. |
| poppetje | Poppetje | Een poppetje met lang blond haar en een blauw jurkje. Ze lijkt wel bij een gezellig gezin te horen. |
| miniatuurhuisje | Huisje | Een piepklein huisje. Het lijkt precies op het huis van een gezin dat je hebt geholpen. |
| foto | Foto | Een foto van een blij gezin. Iedereen kijkt precies op het goede moment. |
| fototoestel | Fototoestel | Een fototoestel met een flitser. Klik! Weer een herinnering erbij. |
| spaarvarken | Spaarvarken | Een spaarvarken met een gleufje op zijn rug. Rammel rammel: {n} munten. (bij 1 munt: Rammel… één munt.) |
| ketting | Ketting | Een ketting met een roze steen. Zo mooi dat je hem eigenlijk nooit meer af wilt doen. |
| kniebeschermers | Kniebeschermers | Stevige kniebeschermers, zo goed als nieuw. Ze waren in de aanbieding! |
| spray | Spray | Een flesje met een vrolijk etiket vol junglediertjes. Het ruikt een beetje naar banaan. |
| sportschoenen | Sportschoenen | Splinternieuwe sportschoenen. Als je ze aanhebt, lijkt het alsof je zweeft. |
| lampion | Lampion | Een lampion van de nachtmarkt. Hij geeft een warm, roze licht. |
| gi | Gi | Een gi met een stevige band. Opgevouwen is hij net zo stoer als aan. |
| vergrootglas | Vergrootglas | Een vergrootglas. Wie goed kijkt, ziet meer dan je denkt. |
| werkerbeeldje | Tuinman | Een beeldje van een tuinman met een groene hoed en een hark. Hij duikt overal op. · aantal: Je hebt hem {n} keer gevonden. |
| schaakbordje | Schaakbordje | Een oud schaakbordje uit de jungle. · aantal: Er staan al {n} dieren op die je te slim af was. (bij 1: Er staat al één dier op dat je te slim af was.) |
| stethoscoop | Stethoscoop | Een stethoscoop. Als je goed luistert, hoor je een klein hartje kloppen. |
| verjaardagstaart | Taart | Een verjaardagstaart met kaarsjes. Hiep hiep hoera! |
| ballonnen | Ballonnen | Ballonnen in alle kleuren. Ze dansen een beetje als je langsloopt. |
| slinger | Slinger | Een slinger met vrolijke vlaggetjes. Het is feest! |

Elke tegel (9 typen) en elke edelsteen (3 kleuren) is een eigen voorwerp met een eigen tikvlak. Foto's hebben één gedeelde tekst; ze per familie verschillend maken kan later in `kamer.json`.

## Bediening

- Elk voorwerp heeft een **doorzichtige `<button>`** die in procenten over de scène ligt, hetzelfde patroon als `werkerVak` in `advent/js/spellen/zoeken.js`. Tikvlak minstens 36×36 px op een telefoon; overlappen ze, dan wint het voorwerp dat vooraan getekend is.
- **Tik** op een voorwerp: het voorwerp wipt één keer 4 px op (0,3 s) en de gedachtenwolk toont naam en omschrijving. Tik op een ander voorwerp: de wolk wisselt direct. **Nog eens tikken** op hetzelfde voorwerp, **tikken op de vloer of de wand** of **Escape** sluit de wolk.
- **Toetsenbord**: Tab loopt door de voorwerpen van achter naar voor en van links naar rechts; Enter/spatie werkt als tikken; de focusring is de standaard teal ring van de app (`:focus-visible`).
- Met *reduced motion*: geen wip, geen pulserende ster, de wolk verschijnt zonder overgang.
- Geen geluid.

## Staat

- De kamer **leest** de staat (`staat.lees()`), de deurstatus (`datum.deurStatus(n, staat)`) en schrijft alleen het veld hieronder.
- Nieuw veld in `legeStaat()` (`advent/js/staat.js`): `kamer: { gezien: [] }`: de id's van de voorwerpen die bij het laatste bezoek zichtbaar waren. `migreer()` vult het aan voor bestaande staat (`gezien` leeg; dan glinstert de knop één keer als er al iets in de kamer staat).
- Bij het openen van `#/kamer` wordt `gezien` de lijst van wat nu zichtbaar is. De kalender toont de ster als er een zichtbaar voorwerp is dat niet in `gezien` staat.
- Verbruiksspullen tellen voor de ster alleen als het type nieuw is (een eerste rode edelsteen wel, een tweede niet).
- Voorwerp-id's: `nachtlamp`, `tegel-<kleur>-<figuur>`, `boeddha`, `steen-groen|blauw|rood`, `lam`, `gansje`, `biggetje`, `meisje`, `huisje`, `foto-<familie>`, `camera`, `spaarvarken`, `ketting`, `kniebeschermers`, `spray`, `schoenen`, `lampion`, `gi`, `loep`, `werker`, `schaakbord`, `stetho`, `taart`, `ballonnen`, `slinger`.

## Code-indeling

- `advent/js/kamer-inhoud.js`, zonder DOM en los te testen: `zichtbareVoorwerpen(staat, status)` geeft een lijst `{ id, soort, aantal?, kleur?, figuur?, familie?, levels? }` terug (`soort` = sleutel in `kamer.json`), `tekstVoor(voorwerp, teksten)` de naam en de ingevulde omschrijving, `heeftNieuws(voorwerpen, gezien)` of de ster aan moet, en `volleStaat()` de testkamer van `?kamer=vol`.
- `advent/js/kamer.js`: `schermKamer({ root })` bouwt de kopbalk, de scène met `use()`, `pino()`, `persoon()` en `dier()` uit `sprites.js` (JS-port van `foto()`, `schaakbord()` en `tegelstapel()`; de foto's gebruiken `leden()` uit `spellen/fotos.js`), de tikvlakken en de wolk; per voorwerp een tekening, een zichtbare rand (voor het icoon in de wolk) en een tikvlak. Meubels worden tussen de voorwerpen getekend (`MEUBELS`), zodat alles van achter naar voor ligt.
- `advent/js/app.js`: `route('/kamer', schermKamer)`.
- `advent/js/kalender.js` (`kamerKnop()`) + `advent/css/kamer.css`: de knop met ster op de Sim-kaart.
- `advent/css/kamer.css`: kamerknop, scène-kaart, tikvlakken, gedachtenwolk.
- `advent/js/staat.js`: veld `kamer.gezien` en `markeerKamerGezien(ids)`.
- `advent/js/ontwikkelaar.js`: schakelaar `kamer=vol` en de knop Kamer onder Snel naar.
- `advent/data/kamer.json`: namen en omschrijvingen.
- Sprites: klaar (`km-*` in `assets/sprites/sprites.svg` en `kamer.svg`). Een sprite aanpassen = `kamer_sprites.py` aanpassen en `python kamer_assets.py` + `python kamer_build.py` draaien.

## Geen uitleg

- Geen teller "8 van 30 verzameld", geen lijst van wat nog ontbreekt, geen lege plekken.
- Omschrijvingen noemen geen spelnummers, geen deurtjes en niet waar iets voor nodig is ("hiermee kun je…" komt niet voor).
- De ster op de kalenderknop zegt alleen dát er iets nieuws is, niet wat.

## Toegankelijkheid

- Kamerknop op de kalender: echte `<button>` met `aria-label="Pino's kamer"`; met ster: `aria-label="Pino's kamer, er is iets nieuws"`.
- Scène-SVG: `role="img"`, `aria-label="Pino's kamer"`; de sprites daarin zijn decoratief.
- Elk tikvlak: `<button>` met `aria-label` = naam (+ aantal, bv. "Rode edelsteen, 3").
- De gedachtenwolk is een `aria-live="polite"`-gebied: naam en omschrijving worden voorgelezen.
- Kleuren in de wolk halen WCAG AA op wit.

## Acceptatiecriteria

- [x] Verse staat (`?reset=1`): de kamer toont alleen meubels, raam, kleedje en Pino; de kalenderknop heeft geen ster.
- [x] Elk voorwerp uit de tabel verschijnt precies volgens de kolom **Zichtbaar**, op zijn plek en in de goede kleur (`?kamer=vol` vergeleken met `Kamer.png`).
- [x] Het werkerbeeldje blijft weg zolang deurtje 7 dicht is, ook als `werkers` al gevonden werkers bevat.
- [x] Verbruik: na het leggen van tegels, het kopen van karakters of het inwisselen van edelstenen tonen de tegelstapeltjes, de edelstenen op de kaptafel en het spaarvarken het nieuwe aantal, of ze verdwijnen.
- [x] Na de finale staan taart, ballonnen en slinger in de kamer.
- [x] Tikken toont naam + omschrijving met het juiste aantal; nog eens tikken, buiten tikken en Escape sluiten de wolk.
- [x] De ster verschijnt na iets nieuws en verdwijnt na een bezoek aan de kamer.
- [x] 390 px breed zonder horizontale scroll; op desktop gecentreerd.
- [x] Toetsenbord: alle voorwerpen bereikbaar met Tab, Enter opent de wolk; een schermlezer leest naam en omschrijving voor.
- [ ] *Reduced motion*: geen wip of pulserende ster (in code geregeld met `matchMedia` en `@media (prefers-reduced-motion)`; niet in de browser nagebootst).
- [x] Geen consolefouten; geen `currentColor`-sprites in de verkeerde kleur (#1E3A4C).
- [ ] Beoordeling door Benjamin op telefoon en desktop.

## Test-URL's

- `…/advent/?test=1&reset=1#/kamer`: lege kamer.
- `…/advent/?test=1&vul=1#/kamer`: kamer met testvoorraad (tegels, edelstenen, geld, familie Tan); de werker alleen omdat `test=1` deurtje 7 opent.
- `…/advent/?test=1&kamer=vol#/kamer` (alleen in testmodus; leest en schrijft geen staat, dus ook geen `gezien`): alles zichtbaar, voor het nalopen van de plekken. Ook in `#/dev`.

## Open punten

Geen. Beantwoord door Benjamin op 22 november (besluit 206): teksten door Claude, titel "Mijn Kamer", Pino niet aanklikbaar, glinster-ster ja, behang en deken door Claude gekozen.
