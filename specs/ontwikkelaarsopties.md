# Ontwikkelaarsopties

**Status:** gebouwd, te beoordelen
Geen preview of artboard (dit scherm is niet ontworpen en is er alleen voor het testen) · Code: `advent/js/ontwikkelaar.js` (`schermOntwikkelaar`), `advent/css/ontwikkelaar.css`, `devModus()` in `advent/js/datum.js`, de knop in `advent/js/kalender.js` · Route `#/dev`

## Doel

Eén pagina waar Benjamin bij het lokaal testen alle dev-schakelaars met de hand aan- en uitzet, in plaats van ze in de URL te typen. Pino ziet deze pagina en de knop ernaartoe nooit.

## Wanneer zichtbaar (devmodus)

`devModus()` is waar als:
- de host lokaal is: `localhost`, `127.0.0.1`, `[::1]`, een naam op `.localhost` of `.test`, of een privé-LAN-adres (`10.*`, `192.168.*`, `172.16.*`–`172.31.*`; zo werkt het ook op een telefoon die `npx serve` via het netwerk opent), **of**
- `?dev=1` in de URL staat (om op GitHub Pages zelf te testen).

Buiten devmodus bestaat de route `#/dev` niet (je krijgt "Dit deurtje bestaat niet") en staat er geen knop op de kalender. De module wordt pas geladen als je de pagina opent, dus de gewone kalender laadt er niets extra's voor.

## Ingang vanaf de kalender

Alleen in devmodus: een kleine witte pil rechtsonder, vast in beeld (`position: fixed`), met een tandwiel-icoon en de tekst "Ontwikkelaarsopties" (op schermen < 1000 px alleen het icoon, met `aria-label`). Staan er opties aan, dan staat er een teal badge met het aantal op. De kalender mag tekst hebben, dus dit botst niet met de regel "geen uitleg".

## Bron van waarheid: de URL

De opties blijven gewoon URL-parameters (zie de tabel in `specs/README.md`); deze pagina is daar een bedieningspaneel voor. Omdat alle navigatie in de app via de hash loopt, blijven de parameters actief als je vanaf hier naar de kalender of een spel gaat. Een schakelaar omzetten herschrijft `location.search` en herlaadt de pagina op `#/dev` (met `location.replace`, dus geen extra stappen in de geschiedenis); de scrollpositie wordt bewaard in `sessionStorage`.

`reset` en `vul` zijn eenmalige acties: als parameter in de URL zouden ze bij elk herladen opnieuw afgaan. Op deze pagina zijn het daarom knoppen, en bij elke wijziging via deze pagina worden `reset=1` en `vul=1` uit de URL gehaald.

## Opbouw (van boven naar beneden)

1. **Kopbalk**: terug naar de kalender, label "ONTWIKKELAAR", titel "Ontwikkelaarsopties".
2. **Nu-kaart**: de (gesimuleerde) datum voluit, de kalenderdag (0 = nog niet begonnen, 11 = voorbij), of `localStorage` werkt, en de actieve parameters als chips. Knop "Alles uit" haalt alle opties uit de URL (behalve `dev=1`).
3. **Datum en deurtjes**
   - Schakelaar **Alle deurtjes open** (`test=1`). Onderregel: ook nodig voor de knop "Rond af (test)", `window.pinoDebug`, `familie` en `niveau`.
   - **Doe alsof het dag … is** (`dag`): elf knoppen in een raster, "Echt" en 1–10, met de datum eronder. De gekozen knop is teal (`aria-pressed`).
   - **Vaste datum** (`datum`): datumveld + knop "Wis". `dag` en `datum` sluiten elkaar uit (in `datum.js` wint `dag`): kiezen van de een wist de ander.
4. **Spelstaat** (acties, direct op `localStorage`, geen herladen nodig behalve bij wissen)
   - **Testvoorraad vullen** (`vulTestStaat()`, wat `?vul=1` doet).
   - **Telefoon opnieuw laten rinkelen** (zet `telefoonGezien` op 0).
   - **Staat wissen** (rood; vraagt eerst bevestiging met `confirm()`; doet wat `?reset=1` doet).
   - Korte samenvatting: geld, edelstenen, tegels, familie, producten, gespeelde deurtjes. Link naar `#/test` voor de ruwe JSON.
   - Staat `reset=1` of `vul=1` nog in de URL, dan staat hier een gele waarschuwing met de knop "Uit de URL halen".
5. **Per spel**
   - **Spel 4 · familie** (`familie`): Automatisch / Tan / Nguyễn / Somchai.
   - **Spel 5 · niveau** (`niveau`): Automatisch / Simpel / Matig / Moeilijk.
   - Zonder `test=1` zijn deze knoppen uitgeschakeld (de spellen lezen ze dan niet), met de onderregel "Werkt alleen met alle deurtjes open".
6. **Snel naar**: knoppen Kalender en Sprite-controle (`#/test`); daaronder per dag één rij: "Dag n · 24 nov · titel", een statuspil (dicht / open / vandaag / gespeeld, zoals op de kalender), knoppen **Spel** (`#/spel/n`), **Laden** (`#/laden/n`), **Deur** (`#/deur/n`) en een vinkje **gespeeld** dat `deurtjes[n]` direct op `'gespeeld'` zet of weghaalt (zonder vaardigheid, behoefte of score; daarvoor speel je het spel of gebruik je "Rond af (test)").
7. **URL**: de volledige huidige URL in een monospace-vak met de knop "Kopieer" (`navigator.clipboard`, in `try/catch`).

Opmaak: zelfde schermbreedte (390), kaarten, knoppen en fonts als de rest van de app; op desktop (≥ 1000 px) twee kolommen tot 860 px breed. Schakelaars zijn echte `<input type="checkbox" role="switch">` met een label.

## Staat

Leest en schrijft via `staat.js` (`lees`, `schrijf`, `wis`, `vulTestStaat`). Er komt geen nieuw veld bij in de spelstaat; de opties zelf staan alleen in de URL.

## Toegankelijkheid

Echte `<button>`s, `<label>` bij elke schakelaar en elk veld, `aria-pressed` op de keuzeknoppen, `aria-label` op de icoon-knop in de kalender. Alles werkt met toetsenbord.

## Acceptatiecriteria

- [x] Op `http://localhost:3000/advent/` staat rechtsonder de knop. *Nog na te lopen na publicatie:* op de echte site (`boerendeball.github.io/advent/`) niet, behalve met `?dev=1`.
- [ ] `#/dev` buiten devmodus toont "Dit deurtje bestaat niet" (pas na publicatie te testen).
- [x] "Alle deurtjes open" aan → terug naar de kalender: alle deurtjes zijn open; de badge op de knop toont 1.
- [x] Dag 5 kiezen → de nu-kaart toont 28 november, dag 5; deurtje 5 staat op "Vandaag". Daarna een vaste datum kiezen haalt `dag` uit de URL.
- [x] Testvoorraad vullen → de samenvatting toont geld ≥ 240 en edelstenen 3/3/3, zonder herladen.
- [x] Staat wissen vraagt eerst bevestiging; daarna is de samenvatting leeg.
- [ ] Familie/niveau zijn uitgeschakeld zonder `test=1` en werken met `test=1` (uitschakelen en de URL gecontroleerd; spel 4/5 zelf met de gekozen waarde nog niet nagelopen).
- [x] Vinkje "gespeeld" bij dag 3 → de kalender toont deurtje 3 als "Gespeeld"; uitvinken zet het terug.
- [x] Een schakelaar omzetten onderaan de pagina laat de pagina op dezelfde scrollpositie terugkomen.
- [x] Op 390×844 past alles zonder horizontaal scrollen (gecontroleerd op 375 breed).

## Test-URL's

- `http://localhost:3000/advent/#/dev`
- `http://localhost:3000/advent/?test=1&dag=5#/dev`
- `https://boerendeball.github.io/advent/?dev=1#/dev`

## Open punten

- Zie `besluiten.md` #70.
