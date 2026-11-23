# Specs

Per scherm één spec: wat het precies doet, hoe het eruitziet (met verwijzing naar artboard en preview), welke staat erin en eruit gaat, en waaraan het af te meten is. De specs zijn de brug tussen `design/` (wat ontworpen is) en `advent/` (wat gebouwd is). Bij twijfel geldt: `CLAUDE.md` (regels) > spec > preview.

| Spec | Status |
|---|---|
| [kalender.md](kalender.md) | gebouwd, te beoordelen |
| [events.md](events.md) — taartmenu, telefoon, vergrendeld, briefje, laadscherm, resultaatscherm, meldingen | gebouwd, te beoordelen |
| [spel1.md](spel1.md) — Princess Allure | gebouwd, te beoordelen |
| [spel2.md](spel2.md) — Waar is die groene vogel nou!? | gebouwd, te beoordelen |
| [spel3.md](spel3.md) — 6 rooie, 2 blauwe, 2 groene | gebouwd, te beoordelen |
| [spel4.md](spel4.md) — Het CFM'etje | goedgekeurd |
| [spel5.md](spel5.md) — Miss... Miss... 12 euro? | gebouwd, te beoordelen |
| [spel6.md](spel6.md) — Maak Jeff trots | goedgekeurd |
| [spel7.md](spel7.md) — Zie de peasants in het veld | goedgekeurd |
| [spel9.md](spel9.md) — Help de lulletjes rozenwater | gebouwd, te beoordelen |
| [spel10.md](spel10.md) — Op naar de bevalling + finale | gebouwd, te beoordelen |
| [spel8.md](spel8.md) | zie de spec zelf |
| [kamer.md](kamer.md) — Pino's kamer: verzamelde spullen en aandenkens (`#/kamer`) | gebouwd, te beoordelen |
| [beeldfeedback.md](beeldfeedback.md) — "sap": animaties, deeltjes, schudden en trillen in plaats van geluid, per scherm en per spel | in aanbouw |
| [ontwikkelaarsopties.md](ontwikkelaarsopties.md) — pagina `#/dev` met alle dev-schakelaars (alleen lokaal) | gebouwd, te beoordelen |
| [besluiten.md](besluiten.md) — beslislog en open vragen voor Benjamin | lopend |

## Statuswaarden

`aanzet` → `spec klaar` → `in aanbouw` → `gebouwd, te beoordelen` → `goedgekeurd`. Een spec gaat alleen naar `goedgekeurd` als Benjamin het scherm heeft gezien.

## Template voor een spelspec

```
# Spel n · Titel
Status · dag/datum · vaardigheid · previews · artboards · generator
## Doel en gevoel        (één alinea: wat Pino doet en waarom het leuk is)
## Scherm                (opbouw van boven naar beneden, maten, wat DOM is en wat scène)
## Scène                 (viewBox, lagen van achter naar voor, posities, sprites met id's en kleuren)
## Regels                (de mechaniek, getallen als constanten, randgevallen)
## Besturing             (touch, toetsenbord, herhaling bij vasthouden)
## Staat                 (wat erin komt, wat eruit gaat, sleutels in staat.js)
## Resultaatscherm       (titel, tegels, beloning, knoppen)
## Geen uitleg           (welke tekst uit het ontwerp bewust wegblijft)
## Toegankelijkheid
## Acceptatiecriteria    (afvinkbaar; dit is de testlijst)
## Test-URL's
## Open punten           (voor Benjamin; verwijst naar besluiten.md)
```

## Werkwijze per spel

1. Lees de spec, `design/spellen-per-dag.md` (regels), de previews en het artboard; bij een actiespel ook `design/generators/spel{n}_build*.py` (exacte posities).
2. Vul de spec aan waar ze nog `aanzet` is; leg keuzes die niet in het ontwerp staan vast in `besluiten.md`.
3. Bouw `advent/js/spellen/spel{n}.js` (+ logica-module zonder DOM als er regels zijn die los te testen zijn).
4. Loop de acceptatiecriteria na op 390×844 (touch) en op desktop (toetsenbord), met de test-URL's.
5. Zet de status op `gebouwd, te beoordelen`; Benjamin beoordeelt voordat spel n+1 begint.

## Test-URL's en dev-schakelaars

Alles werkt met `npx serve .` op `http://localhost:3000/advent/`.

| Parameter | Effect |
|---|---|
| `?test=1` | alle deurtjes open |
| `?dag=5` | doet alsof het dag 5 is (28 nov) |
| `?datum=2026-11-27` | vaste datum |
| `?reset=1` | wist de spelstaat bij het laden |
| `?vul=1` | vult de staat met testvoorraad (tegels, edelstenen, geld, familie, werkers, levels) om een later spel los te spelen |
| `?familie=nguyen` | spel 4 met deze familie (`tan`, `nguyen`, `somchai`; alleen met `test=1`) |
| `?niveau=matig` | spel 5 met dit niveau (`simpel`, `matig`, `moeilijk`; alleen met `test=1`) |
| `?knie=1` | spel 6 met (`1`) of zonder (`0`) kniebeschermers, en zonder de ketting-controle (alleen met `test=1`) |
| `?spray=1` | spel 8 met (`1`) of zonder (`0`) jungledieren-spray (alleen met `test=1`) |
| `?schoenen=1` | spel 9 met (`1`) of zonder (`0`) sportschoenen (alleen met `test=1`) |
| `?fase=2` | spel 10 meteen in de auto (`2`) of meteen de finale (`finale`; alleen met `test=1`) |
| `?kamer=vol` | Pino's kamer met alles erin, zonder de staat te lezen of te schrijven (alleen met `test=1`) |
| `?level=3` | spel 8 meteen op het bord van dit level (`1`–`5`; alleen met `test=1`) |
| `?dev=1` | devmodus buiten een lokale host: de knop naar de ontwikkelaarsopties op de kalender |
| `#/dev` | **ontwikkelaarsopties**: alle schakelaars hierboven met de hand aan/uit (alleen in devmodus, zie [ontwikkelaarsopties.md](ontwikkelaarsopties.md)) |
| `#/test` | sprite-controlescherm en de ruwe staat |
| `window.pinoDebug` | in testmodus: de live spelstaat van het lopende canvas-spel (console); in spel 1, 5 en 6 ook `stap(ms)` om het spel met de hand vooruit te zetten (handig als de tab geen frames tekent); in spel 8 `oplossing()` en `speelOplossing()`; in spel 9 `stap(ms)` en `s.altijdRaak`; in spel 10 `stap(ms)`, `actie(naam)` en `s.onkwetsbaar` |
| `#/spel/n` | spel n direct (laadscherm overgeslagen) |
| `#/laden/n` | laadscherm en dan spel n |
| `#/kamer` | Pino's kamer (ook via de huisjesknop op de Sim-kaart) |
| `#/deur/n` | het Open-scherm van deurtje n (of de gans als het dicht is) |

Parameters combineren: `?test=1&reset=1&vul=1#/spel/3`.
