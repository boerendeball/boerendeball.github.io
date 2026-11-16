# Speeltest: de hele kalender uitgespeeld (16 november 2026)

Uitgevoerd door Claude, op verzoek van Benjamin.

> **Besluit Benjamin (16 november 2026):** geen van de bevindingen hieronder leidt tot een wijziging. Het spel blijft zoals het is; dit document is alleen een verslag.

## Opzet

- Verse staat (`?reset=1`), daarna `?test=1`, zodat alle deurtjes open zijn. Mobiel formaat 375×812 in de browser van de Claude-app, met de server op poort 3000.
- Gespeeld zoals een speler: via de kalender, het taartmenu en het laadscherm, met echte knoppen en toetsaanslagen. Voor de actiespellen schreef ik kleine bots die met de pijltjestoetsen en spatie spelen en de spelstand lezen uit `window.pinoDebug`. Bij spel 2 en 8 koos een zoekfunctie de zetten, met de echte spelregels (`hex.kandidaten`, `schaak.losOp`). Die zetten zijn daarna via de knoppen uitgevoerd.
- Spel 10 is in twee delen gehaald:
  - fase 1 (te voet) twee keer gehaald tot aan het ziekenhuisautootje;
  - fase 2 (de auto) tot aan het huis gereden via `?fase=2`, met de finale erna.
  - Een doorlopende run lukte daarna niet meer. De browser-pane werd verborgen, waardoor de animaties haperden en de bot botste.

## Eindstand

| | |
|---|---|
| Deurtjes | 10/10 gespeeld |
| Vaardigheden | alle zes op 10/10 (besluit 164 klopt in de praktijk) |
| Behoeften | alle acht op 100 % |
| Producten spel 5 | ketting 240, kniebeschermers 400, spray 200, schoenen 200 (telkens de laagste prijs) |
| Werkers spel 7 | 5/5 |
| Spel 6 | 28/28 moves, reactie 0,4 s |
| Spel 8 | 5/5 levels, 0× gevangen |
| Spel 9 | 7 baby's gevangen |
| Over | 26 tegels en een halve tuin (veld 4) |

## Verloop en wat het kostte

Volgorde zoals Pino het zou spelen; telkens terug naar een eerder spel als de voorraad op was.

| Stap | Wat |
|---|---|
| Spel 1 ×3 | 15, 13 en 15 onderbroken: 37 tegels (eerst 15, daarna 22 erbij) |
| Spel 2, tuin 1 | 6 velden met een volle ring, daarna veld 7 en de taxi: 6 edelstenen (1 blauw, 3 geel, 2 groen) |
| Spel 3 | lammetje, gansje en meisje gekocht; het biggetje niet, want er ontbrak 1 blauwe steen |
| Spel 4 ×2 | Somchai (80) en Nguyễn (100): samen 180 munten, te weinig voor de ketting (240) |
| Spel 2, tuin 2 | 1 ring, de blauwe steen |
| Spel 3 en 4 | biggetje gekocht, Tan op de foto: 240 munten |
| Spel 5, ronde 1 | ketting voor 240 (Simpel) |
| Spel 1 ×3 en spel 2 | 4 blauwe stenen (400) |
| Spel 5, ronde 2 | kniebeschermers (Moeilijk) voor **400** |
| Spel 6 en 7 | gehaald |
| Spel 1 ×2 en tuin 2/3 | 2 blauwe stenen |
| Spel 5, ronde 3 | spray (Matig, de handelaar kwam aanrennen) voor 200 |
| Spel 8 | gehaald |
| Tuin 3 | 2 blauwe stenen |
| Spel 5, ronde 4 | schoenen (Simpel) voor 200 |
| Spel 9 en 10 | gehaald |

In totaal: **9 keer spel 1** (zo'n 125 tegels) en **3 tuinen** in spel 2. Een bot die nooit een gaap mist, haalt per ronde van spel 1 maar 10–15 tegels.

## Bevindingen

### Fouten

1. **Spel 2: de edelsteen van veld 7 is onhaalbaar.**
   - De twee wegplekken van veld 7 zijn ringplekken, en de eerste tegel op een wegplek beëindigt meteen het spel (`legTegel` → `einde`). De ring kan dus nooit vol.
   - Eén tocht levert daardoor hoogstens 6 edelstenen op, terwijl spel 3 er 7 vraagt (zie punt 7).
   - Mogelijke oplossingen:
     - de weg één rij verder leggen, zodat de wegplekken buiten de ring vallen;
     - een tegel op een wegplek pas het einde laten starten als de ring vol is of de edelsteen geoogst;
     - de edelsteen van veld 7 bij de taxi automatisch laten oogsten.
2. **Spel 2: taalfout in een knoplabel.** Het taartmenu voor de edelsteen heeft de `aria-label` "Kies geele edelsteen"; dat moet "Kies gele edelsteen" zijn.
3. **Spel 10: ganzen schuiven over elkaar heen.**
   - Op het ganzenpad met twee groepen (rij 13) werden beide oude ganzen boos. Ze renden naar dezelfde x en stonden daarna precies over elkaar heen, met hun jonkies ook dubbel.
   - Ze bleven samen boven Pino hangen terwijl ze in kolom 0 stond. Verder kon ze pas na een sprint van vier kolommen naar rechts.
   - Twee ganzen op één plek ziet er vreemd uit. Een afstand tussen boze ganzen (of: maar één gans tegelijk boos) zou dit voorkomen.

### Teksten en consistentie

4. **Spel 1:** het resultaatscherm zegt altijd "Nou ja, bijna niemand.", ook als er geen enkele gaap gemist is. Een variant voor 0 gemist zou beter kloppen.
5. **Spel 4:** de beloning is per dag vast, dus "Gansjes +20 %" verschijnt ook als de gefotografeerde familie geen gansje heeft (Somchai heeft het lammetje). Dat valt niemand op zolang de tekst algemeen is; noteer het alleen als bewuste keuze.
6. **Spel 5:** het taartmenu van de wisselkraam heeft geen Annuleren-optie, terwijl het tegelmenu in spel 2 die wel heeft. Escape en een tik naast het menu werken wel. Op een telefoon is het minder duidelijk hoe je het menu dichtkrijgt zonder iets te ruilen.

### Economie (de grootste bevinding)

7. **Spel 3 vraagt meer edelstenen dan één tuin oplevert.**
   - Spel 3 kost 7 stenen: 2 blauw, 2 groen en 3 geel. Eén tuin geeft er hoogstens 6 (punt 1).
   - Zonder een tweede tuin, en dus eerst meer tegels uit spel 1, kan spel 3 nooit af. Dan krijgt familie Tan geen foto en kost de ketting 240 terwijl Pino hoogstens 180 heeft.
   - Dat is waarschijnlijk niet bedoeld. Met punt 1 opgelost (7 stenen per tuin) past het precies, maar dan moet Pino in elke ring de juiste kleur kiezen.
8. **De tegelvoorraad raakt scheef.**
   - Na een paar ringen bleven er vooral blauwe vlinders over (10 van de 19 tegels). In een groep van dezelfde kleur mag elk type maar één keer voorkomen, dus die zijn bijna niet kwijt te raken.
   - In twee situaties was geen volle ring meer mogelijk en moest ik terug naar spel 1, terwijl er nog 12 tot 26 tegels waren.
   - Ideeën: spel 1 de kinderen laten wekken die bij de schaarse tegels horen, of het tegelmenu de types laten tonen die nog nodig zijn. Dat laatste zou wel een hint zijn.
9. **Spel 5: wie meer meeneemt, betaalt meer.**
   - P is alles wat Pino bij de start heeft (besluit 139). Ik kwam voor de kniebeschermers binnen met 4 blauwe stenen en betaalde 400, terwijl de ondergrens 160 is.
   - Elke ronde begint daardoor weer bij 0, en per product moet Pino opnieuw door spel 1 en spel 2. Een slimme speler neemt precies genoeg mee, maar dat valt nergens te ontdekken.
   - Ideeën:
     - P begrenzen op ondergrens + iets, zodat er iets overblijft;
     - de stenen alleen meetellen als Pino ze bij de wisselkraam inruilt, niet alles wat ze bezit.
10. **Totale speeltijd.**
    - Alles uitspelen kostte 9 keer spel 1 en 3 tuinen. Dat is ongeveer 9 minuten slaapzaal plus een flink aantal tuinvelden, met veel heen-en-weer.
    - Over tien dagen verspreid kan dat, maar het herhalende deel (spel 1 → 2 voor elk product) overheerst.
    - Overweeg meer tegels per ronde van spel 1 (bijvoorbeeld 90 s, zoals het artboard), of minder stenen per product.

### Moeilijkheid en herstarten

11. **Spel 9: één misser en het spel is mis.** Met 3 baby's tegelijk in de lucht en duwen langs één as tegelijk is dat pittig. Mijn bot had zes pogingen nodig, al lag dat vooral aan de bot. Overweeg om bijvoorbeeld 1 misser toe te laten.
12. **Spel 10: na een botsing in de auto begint Pino weer te voet (besluit 151).**
    - Fase 1 is 25 rijen hoog (±30 s) en fase 2 duurt 30 s. Een botsing aan het eind van de rit kost dus ruim een minuut opnieuw.
    - Overweeg een tussenpunt: wie in de auto botst, begint weer in de auto.
13. **Spel 2, zoekmodus vanuit spel 7.**
    - De werker staat bij veld 3 van de tuin. Bij mij stond hij nog in een lopende tuin, dus vond ik hem meteen.
    - Wie spel 2 al had afgerond, heeft een lege tuin. Die moet in de zoekmodus eerst weer tot veld 3 bouwen, met minstens 7 tegels uit spel 1.
    - Heeft Pino op dat moment geen tegels, dan is werker 2 onvindbaar tot ze terug naar spel 1 gaat. Dat is te doen, maar onverwacht. Idee: in de zoekmodus de laatst afgeronde tuin tonen.

## Wat goed werkte (bevestigd)

- Het taartmenu op de deurtjes, het laadscherm met tips en het resultaatscherm met de nieuwe beloningsregel (besluit 164) werken. Na alle tien spellen staat alles precies vol.
- **Spel 1:** de besturing met de pijltjestoetsen (Shift heb ik in deze test niet gebruikt).
- **Spel 2:**
  - de tuin blijft bewaard tussen bezoeken;
  - de taxi aan het einde rijdt;
  - "Nog een keer" begint een nieuwe tuin.
- **Spel 3:** kopen, en de eerste complete familie wordt het gezin van spel 4.
- **Spel 4:** "Nog een keer" start de volgende complete familie, en het album toont een cameraknop per familie.
- **Spel 5:**
  - Simpel, Matig en Moeilijk gedragen zich volgens de spec: in Matig rent de handelaar met "miss! miss! wait!" naar Pino toe, in Moeilijk spannen de handelaars zichtbaar samen;
  - de wisselkraam ruilt tegen de vaste koers;
  - het productenalbum werkt;
  - welke handelaar de korting geeft, is eerlijk verdeeld (4000 keer nagerekend).
- **Spel 6:** het ritmespel is goed te spelen met de pijltjestoetsen. Met kniebeschermers is 28/28 haalbaar.
- **Spel 7:** alle vijf de zoekmodi brengen Pino terug naar het album.
- **Spel 8:** alle vijf de levels zijn op te lossen, met de spray.
- **Spel 9:** met sportschoenen is het te halen (7 baby's). Elke man die onder de landingsplek staat, mag vangen, niet alleen de man bij wie de ooievaar mikt.
- **Spel 10:** de finale toont de felicitatie, alle behoeften groen en het briefje (nog de placeholder).
