# Economie en spelstaat

De tien spellen zijn aan elkaar gekoppeld. Wat Pino in het ene spel verdient, gebruikt ze (vaak zonder dat ze dat van tevoren weet) in een volgend spel. Deze staat moet de app bewaren in `localStorage` (altijd in `try/catch`; bij ontbrekende of kapotte storage start elk spel met lege voorraad en blijft alles speelbaar).

## Ketens

| Van | Naar | Wat | Zichtbaar? |
|---|---|---|---|
| Spel 1 | Spel 2 | Elke gelukte onderbreking levert een **tegel** op met de kleur + het figuur van de deken van dat kind: 3 kleuren (groen `#39D353`, geel `#FFC93C`, blauw `#5BC0EB`) × 3 figuren (vlinder, boom, vogel) = 9 tegeltypen. | In spel 1 onzichtbaar (alleen een cryptisch zinnetje op het resultaatscherm). In het taartmenu van spel 2 toont elk tegeltype een badge met het aantal. |
| Spel 1 | Spel 2 | De tuin van spel 2 blijft bewaard (`tuin`) tot het pad af is: na één keer spel 1 zijn er bewust te weinig tegels, dus Pino moet terug naar de slaapzaal. | Grijze tegels met een 0 in het taartmenu; verder niets. |
| Spel 2 | Spel 3 | Een leeg hexvak dat aan alle zes kanten door gelegde tegels is omringd levert een **edelsteen** op; Pino kiest de kleur (blauw, groen, geel) via een taartmenu. | Edelsteentellers in de kopbalk van spel 2 en 3. |
| Spel 3 | Spel 4 | De **familie** die Pino compleet maakt (Nguyễn, Tan of Somchai) is het gezin van spel 4. Karakterkaarten kosten edelstenen (ontwerp: lammetje = groen+groen, gansje = geel, meisje = geel+blauw, biggetje = blauw+geel; nog af te stemmen). | Niet aangekondigd. |
| Spel 4 | Spel 5 | De familie betaalt **geld (§)** voor de drie foto's (ontwerp: 60); hoeveel hangt af van de familie (sommige ogen rijker). | Munt + bedrag in de kopbalk van spel 4-resultaat en spel 5. |
| Spel 5 | Spel 6 | Wat Pino overhoudt na het kopen van de ketting (ontwerp: 26) is wat de zakkenroller in spel 6 probeert te stelen. | Munt + bedrag in de kopbalk van spel 6. |
| Spel 2–6 | Spel 7 | In elk speelveld van spel 2 t/m 6 staat één **verstopte werker** (groene hoed, hark): tuin op vak (3,10) (pas zichtbaar als daar een tegel ligt), half achter de villa van familie Nguyễn, half achter de palmstam op het strand, achter de waterput op de nachtmarkt, in de menigte in de steeg. Pas aanklikbaar nadat spel 7 is ontgrendeld. | Spel 7 is een fotoalbum met vijf polaroids dat bijhoudt welke werkers gevonden zijn (loep + x/5). |
| Spel 8 | Spel 8 | Vijf levels; gehaalde levels blijven gehaald. | Leveloverzicht met vinkjes en slotjes. |
| Alle spellen | Kalender | Elk afgerond spel geeft een **vaardigheidspunt** (zie `spellen-per-dag.md`) en vult de behoefte "Verjaardag vieren" met 10 %. | Vaardigheidsbalken en behoeftenpaneel op de kalender. |

## Voorgestelde velden in localStorage

Eén sleutel (bijvoorbeeld `pino-advent`) met een JSON-object; versienummer erbij zodat een latere wijziging oude staat kan migreren.

```json
{
  "versie": 1,
  "deurtjes": { "1": "gespeeld", "2": "open", "3": "dicht" },
  "briefjesGelezen": [1, 2],
  "tegels": { "groen-vlinder": 2, "geel-boom": 1, "blauw-vogel": 0 },
  "edelstenen": { "blauw": 2, "groen": 2, "geel": 1 },
  "tuin": { "gelegd": { "1,13": "geel-boom" }, "geoogst": [], "edelstenen": 0 },
  "familie": "tan",
  "geld": 26,
  "werkers": { "2": true, "3": true, "4": false, "5": false, "6": false },
  "levels": { "gehaald": [1], "actief": 2 },
  "vaardigheden": { "koken": 0, "mechanica": 0, "charisma": 2, "lichaam": 3, "logica": 2, "creativiteit": 1 },
  "behoeften": { "verjaardag": 40, "gansjes": 100, "lammetjes": 100, "snoepjes": 60, "jiujitsu": 40, "bordspellen": 70, "reizen": 100, "sieraden": 100 },
  "scores": { "1": { "onderbroken": 7 }, "5": { "betaald": 34 } }
}
```

Dit is een voorstel uit het ontwerp, geen besluit: pas aan wat tijdens de implementatie handiger blijkt, maar houd de ketens hierboven intact.

## Testen

- `?test=1` opent alle deurtjes ongeacht de datum.
- Overweeg een ontwikkelaarsschakelaar om de staat te vullen (bijvoorbeeld alle tegels/edelstenen/geld), zodat elk spel los te testen is zonder de hele keten te spelen.
