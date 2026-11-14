# Economie en spelstaat

De tien spellen zijn aan elkaar gekoppeld. Wat Pino in het ene spel verdient, gebruikt ze (vaak zonder dat ze dat van tevoren weet) in een volgend spel. Deze staat moet de app bewaren in `localStorage` (altijd in `try/catch`; bij ontbrekende of kapotte storage start elk spel met lege voorraad en blijft alles speelbaar).

## Ketens

| Van | Naar | Wat | Zichtbaar? |
|---|---|---|---|
| Spel 1 | Spel 2 | Elke gelukte onderbreking levert een **tegel** op met de kleur + het figuur van de deken van dat kind: 3 kleuren (groen `#39D353`, geel `#FFC93C`, blauw `#5BC0EB`) × 3 figuren (vlinder, boom, vogel) = 9 tegeltypen. | In spel 1 onzichtbaar (alleen een cryptisch zinnetje op het resultaatscherm). In het taartmenu van spel 2 toont elk tegeltype een badge met het aantal. |
| Spel 1 | Spel 2 | De tuin van spel 2 blijft bewaard (`tuin`) tot het pad af is: na één keer spel 1 zijn er bewust te weinig tegels, dus Pino moet terug naar de slaapzaal. | Grijze tegels met een 0 in het taartmenu; verder niets. |
| Spel 2 | Spel 3 | Een leeg hexvak dat aan alle zes kanten door gelegde tegels is omringd levert een **edelsteen** op; Pino kiest de kleur (blauw, groen, geel) via een taartmenu. | In spel 2 niet te zien (alleen het keuzemenu bij het oogsten); de edelsteenteller staat pas in de kopbalk van spel 3. |
| Spel 3 | Spel 4 | Karakterkaarten kosten edelstenen (lammetje = groen+groen, gansje = geel, meisje = geel+blauw, biggetje = blauw+geel) en horen bij een vaste familie (meisje + gansje → Nguyễn, biggetje → Tan, lammetje → Somchai). De **familie** die als eerste compleet is, is het gezin van spel 4 (`familie`); de gekochte kaarten blijven bewaard (`karakters`). Spel 3 is pas af als alle families compleet zijn. | Niet aangekondigd. Opent Pino spel 4 zonder complete familie, dan zegt een popup met de bedroefde familie Nguyễn dat er nog geen foto's gemaakt kunnen worden. |
| Spel 4 | Spel 5 | Elke complete familie betaalt één keer **geld (§)** voor haar drie foto's: Nguyễn 100, Somchai 80, Tan 60 (besluit 48). Welke families al op de foto staan, staat in `fotos`. Samen precies 240: net genoeg voor de ketting in de eerste ronde van spel 5 (besluit 64). | Munt + bedrag op het resultaatscherm van spel 4 en in spel 5. |
| Spel 2 | Spel 5 | Vanaf de tweede marktronde ruilt Pino bij de **wisselkraam** edelstenen in voor geld: blauw 100, groen 80, geel 60 (besluit 65). Na de ketting is dit de enige geldbron, dus voor de volgende producten moet ze terug naar spel 1 → 2. | Taartmenu met edelstenen + aantallen; de munt-teller springt op. De koers staat nergens. |
| Spel 5 | Spel 6, 8, 9 | Spel 5 verkoopt naast de ketting drie **producten** (`producten`), één per ronde: kniebeschermers (spel 6), jungledieren-spray (spel 8), sportschoenen (spel 9). De laagste prijs van een ronde is het geld plus de waarde van de edelstenen waarmee Pino aan spel 5 begint (edelstenen pas vanaf ronde 2), met als ondergrens 240 / 160 / 180 / 200 (besluit 63–64, 139). Een ronde kan pas als het spel van dat product open is; het productenalbum van spel 5 laat zien wat gekocht is, wat aan de beurt is en wat nog op slot zit (besluit 67). | Productenalbum in spel 5. Spel 6 zonder kniebeschermers: zie de rij hieronder. Spel 8 zonder spray: de sprayknop toont een kruis en level 5 is niet te halen (besluit 113). Spel 9 zonder schoenen: Pino loopt traag op hoge hakken en kan de mannen niet op tijd duwen (besluit 128). |
| Spel 5 | Spel 6 | De dief in spel 6 wil de **ketting** uit spel 5 (besluit 80); geld speelt in spel 6 geen rol. Zonder ketting start spel 6 niet (popup, besluit 81). Ontsnapt de dief, dan is dat alleen zichtbaar: de ketting blijft in `producten` (besluit 82). Zonder **kniebeschermers** mislukt de move knee on belly altijd en is spel 6 net niet te halen (besluit 94 en 99). Een gelukte klem zet de behoefte "jiujitsu" op 100 % (besluit 100). | Pino draagt de ketting om haar hals; met kniebeschermers zijn die zichtbaar in de armklem; zonder poppen ze op in de knop van knee on belly. Geen munt in de kopbalk. |
| Spel 2–6 | Spel 7 | In elk speelveld van spel 2 t/m 6 staat één **verstopte werker** (groene hoed, hark): tuin op vak (3,10) (pas zichtbaar als daar een tegel ligt), half achter de villa van familie Nguyễn, half achter de palmstam op het strand, achter de waterput op de nachtmarkt, in de menigte in de steeg. Pas aanklikbaar nadat spel 7 is ontgrendeld. | Spel 7 is een fotoalbum met vijf polaroids dat bijhoudt welke werkers gevonden zijn (loep + x/5). |
| Spel 8 | Spel 8 | Vijf levels; gehaalde levels blijven gehaald (`levels.gehaald`). Na level 5 volgt de beloning van dag 8, die de behoefte Bordspellen op 100 % brengt (besluit 120 en 164). | Leveloverzicht met vinkjes en slotjes. |
| Alle spellen | Kalender | Elk spel geeft bij de eerste afronding een **beloning** (`beloning` per dag in `advent/data/kalender.json`, besluit 164): meerdere **vaardigheidspunten** (zie `spellen-per-dag.md`) en een aanvulling van een paar **behoeften**, waaronder altijd "Verjaardag vieren" +10 %. Na alle tien spellen staat elke vaardigheid op 10 (60 punten) en elke behoefte op 100 %. | Vaardigheidsbalken en behoeftenpaneel op de kalender; het beloningsblok op het resultaatscherm. |

### Behoeften per spel (besluit 164)

| Behoefte | Begin | Spel 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Verjaardag vieren | 0 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 |
| Gansjes | 30 | | | 30 | 20 | | | | | | 20 |
| Lammetjes | 30 | | | 30 | 20 | | | | | | 20 |
| Snoepjes | 20 | | | | 20 | 20 | | | | 20 | 20 |
| Jiujitsu | 45 | | | | | | 55 | | | | |
| Bordspellen | 20 | | 20 | 20 | | | | | 40 | | |
| Reizen | 10 | | 15 | 15 | 15 | 15 | 15 | 15 | | | |
| Sieraden | 15 | | 25 | | | 60 | | | | | |

### Vaardigheden per spel (besluit 164)

| Vaardigheid | Spel 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | Totaal |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Koken | | 2 | | 2 | 2 | | | | 2 | 2 | 10 |
| Techniek (`mechanica`) | | 2 | | 2 | | 2 | | 1 | | 3 | 10 |
| Charisma | 2 | | 1 | 2 | 4 | | | | 1 | | 10 |
| Conditie (`lichaam`) | 3 | | | | | 3 | | | 2 | 2 | 10 |
| Logica | | 2 | 2 | | 1 | | 2 | 3 | | | 10 |
| Creativiteit | | 1 | 3 | 2 | | | 3 | 1 | | | 10 |

## Voorgestelde velden in localStorage

Eén sleutel (bijvoorbeeld `pino-advent`) met een JSON-object; versienummer erbij zodat een latere wijziging oude staat kan migreren.

```json
{
  "versie": 2,
  "deurtjes": { "1": "gespeeld", "2": "open", "3": "dicht" },
  "briefjesGelezen": [1, 2],
  "tegels": { "groen-vlinder": 2, "geel-boom": 1, "blauw-vogel": 0 },
  "edelstenen": { "blauw": 2, "groen": 2, "geel": 1 },
  "tuin": { "gelegd": { "1,13": "geel-boom" }, "geoogst": [], "edelstenen": 0 },
  "karakters": ["biggetje", "meisje"],
  "familie": "tan",
  "fotos": ["tan"],
  "geld": 20,
  "producten": ["ketting", "kniebeschermers"],
  "markt": { "cyclus": ["simpel", "moeilijk", "matig"], "stap": 2, "ronde": null },
  "werkers": { "2": true, "3": true, "4": false, "5": false, "6": false },
  "levels": { "gehaald": [1], "actief": 2 },
  "vaardigheden": { "koken": 2, "mechanica": 2, "charisma": 3, "lichaam": 3, "logica": 4, "creativiteit": 4 },
  "behoeften": { "verjaardag": 30, "gansjes": 60, "lammetjes": 60, "snoepjes": 20, "jiujitsu": 45, "bordspellen": 60, "reizen": 40, "sieraden": 40 },
  "scores": { "1": { "onderbroken": 7 }, "5": { "ketting": { "betaald": 240, "laagste": 240 }, "kniebeschermers": { "betaald": 180, "laagste": 160 } } }
}
```

Dit is een voorstel uit het ontwerp, geen besluit: pas aan wat tijdens de implementatie handiger blijkt, maar houd de ketens hierboven intact.

## Testen

- `?test=1` opent alle deurtjes ongeacht de datum.
- Overweeg een ontwikkelaarsschakelaar om de staat te vullen (bijvoorbeeld alle tegels/edelstenen/geld), zodat elk spel los te testen is zonder de hele keten te spelen.
