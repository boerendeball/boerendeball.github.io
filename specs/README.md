# Specs

Per scherm één spec: wat het precies doet, hoe het eruitziet (met verwijzing naar artboard en preview), welke staat erin en eruit gaat, en waaraan het af te meten is. De specs zijn de brug tussen `design/` (wat ontworpen is) en `advent/` (wat gebouwd is). Bij twijfel geldt: `CLAUDE.md` (regels) > spec > preview.

| Spec | Status |
|---|---|
| [kalender.md](kalender.md) | gebouwd, te beoordelen |
| [events.md](events.md) — taartmenu, telefoon, vergrendeld, briefje, laadscherm, resultaatscherm, meldingen | gebouwd, te beoordelen |
| [spel1.md](spel1.md) — Princess Presence | gebouwd, te beoordelen |
| [spel2.md](spel2.md) — Tuin van de koningin | gebouwd, te beoordelen |
| [spel3.md](spel3.md) — Complete the family | gebouwd, te beoordelen |
| [spel4.md](spel4.md) — (Social)ize the family | goedgekeurd |
| [spel5.md](spel5.md) — Negotiate trade deal | gebouwd, te beoordelen |
| [spel6.md](spel6.md) — Selfdefense | goedgekeurd |
| [spel7.md](spel7.md) — Spot the peasant | goedgekeurd |
| [spel8.md](spel8.md) … [spel10.md](spel10.md) | aanzet; uitwerken vlak voor de bouw |
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
| `?dev=1` | devmodus buiten een lokale host: de knop naar de ontwikkelaarsopties op de kalender |
| `#/dev` | **ontwikkelaarsopties**: alle schakelaars hierboven met de hand aan/uit (alleen in devmodus, zie [ontwikkelaarsopties.md](ontwikkelaarsopties.md)) |
| `#/test` | sprite-controlescherm en de ruwe staat |
| `window.pinoDebug` | in testmodus: de live spelstaat van het lopende canvas-spel (console); in spel 6 ook `stap(ms)` om het spel met de hand vooruit te zetten |
| `#/spel/n` | spel n direct (laadscherm overgeslagen) |
| `#/laden/n` | laadscherm en dan spel n |
| `#/deur/n` | het Open-scherm van deurtje n (of de gans als het dicht is) |

Parameters combineren: `?test=1&reset=1&vul=1#/spel/3`.
